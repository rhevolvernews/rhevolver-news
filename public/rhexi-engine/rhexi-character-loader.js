import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

export class RhexiCharacter {
  constructor(scene,{url='/rhexi-assets/rhexi.glb',scale=1.0}={}){
    this.scene=scene; this.url=url; this.scale=scale;
    this.root=new THREE.Group();
    this.root.rotation.y=Math.PI;
    this.scene.add(this.root);
    this.model=null; this.mixer=null; this.actions={}; this.current=null;
    this.ready=false; this.state='loading';
  }

  async load(){
    const gltf=await new Promise((resolve,reject)=>new GLTFLoader().load(this.url,resolve,undefined,reject));
    this.model=gltf.scene;
    this.model.scale.setScalar(this.scale);
    this.model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=true;}});
    this.root.add(this.model);
    if(gltf.animations?.length){
      this.mixer=new THREE.AnimationMixer(this.model);
      for(const clip of gltf.animations){
        const key=this.#normalize(clip.name);
        this.actions[key]=this.mixer.clipAction(clip);
      }
    }
    this.ready=true; this.state='ready';
    this.play('run',0);
    return this;
  }

  #normalize(n=''){
    n=n.toLowerCase();
    if(/run|running|jog/.test(n)) return 'run';
    if(/jump|leap/.test(n)) return 'jump';
    if(/slide|duck|crouch/.test(n)) return 'slide';
    if(/idle|stand/.test(n)) return 'idle';
    if(/stumble|trip|hit/.test(n)) return 'stumble';
    if(/celebr/.test(n)) return 'celebrate';
    return n.replace(/[^a-z0-9]+/g,'_');
  }

  play(name,fade=.12,{loop=true,clamp=false,speed=1}={}){
    const next=this.actions[name];
    if(!next || next===this.current) return false;
    if(this.current) this.current.fadeOut(fade);
    next.reset().setEffectiveTimeScale(speed).setEffectiveWeight(1);
    next.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,loop?Infinity:1);
    next.clampWhenFinished=clamp;
    next.fadeIn(fade).play();
    this.current=next;
    return true;
  }

  setLaneX(x,dt,speed=13){
    this.root.position.x=THREE.MathUtils.damp(this.root.position.x,x,speed,dt);
    const dx=x-this.root.position.x;
    this.root.rotation.z=THREE.MathUtils.damp(this.root.rotation.z,-dx*.08,10,dt);
  }

  setGroundY(y){ this.root.position.y=y; }
  setForwardZ(z){ this.root.position.z=z; }
  update(dt){ if(this.mixer) this.mixer.update(dt); }
  dispose(){
    if(this.mixer) this.mixer.stopAllAction();
    this.root.traverse(o=>{if(o.isMesh){o.geometry?.dispose(); if(Array.isArray(o.material))o.material.forEach(m=>m.dispose()); else o.material?.dispose();}});
    this.scene.remove(this.root);
  }
}
