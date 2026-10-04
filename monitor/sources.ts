export type Source={id:string;name:string;url:string;scope:"iguala"|"guerrero"|"federal"|"sports";priority:number;kind:"official"};
export const monitorSources:Source[]=[
{id:"gro-gob",name:"Gobierno de Guerrero",url:"https://www.guerrero.gob.mx/",scope:"guerrero",priority:1,kind:"official"},
{id:"seg",name:"Secretaría de Educación Guerrero",url:"https://www.seg.gob.mx/",scope:"guerrero",priority:1,kind:"official"},
{id:"fge-gro",name:"Fiscalía General del Estado de Guerrero",url:"https://www.fiscaliaguerrero.gob.mx/",scope:"guerrero",priority:1,kind:"official"},
{id:"iepc-gro",name:"IEPC Guerrero",url:"https://www.iepcgro.mx/",scope:"guerrero",priority:1,kind:"official"},
{id:"congreso-gro",name:"Congreso del Estado de Guerrero",url:"https://congresogro.gob.mx/",scope:"guerrero",priority:1,kind:"official"},
{id:"iguala",name:"Gobierno Municipal de Iguala",url:"https://iguala.gob.mx/",scope:"iguala",priority:1,kind:"official"},
{id:"conagua",name:"CONAGUA",url:"https://www.gob.mx/conagua",scope:"federal",priority:1,kind:"official"},
{id:"smn",name:"Servicio Meteorológico Nacional",url:"https://smn.conagua.gob.mx/",scope:"federal",priority:1,kind:"official"},
{id:"capufe",name:"CAPUFE",url:"https://www.gob.mx/capufe/archivo/prensa",scope:"federal",priority:1,kind:"official"},
{id:"fgr",name:"FGR",url:"https://www.gob.mx/fgr",scope:"federal",priority:1,kind:"official"},
{id:"sspc",name:"SSPC",url:"https://www.gob.mx/sspc/archivo/prensa?idiom=es",scope:"federal",priority:1,kind:"official"},
{id:"gn",name:"Guardia Nacional",url:"https://www.gob.mx/guardianacional/es/archivo/prensa",scope:"federal",priority:1,kind:"official"},
{id:"defensa",name:"Defensa",url:"https://www.gob.mx/defensa/archivo/prensa",scope:"federal",priority:1,kind:"official"},
{id:"semar",name:"Marina",url:"https://www.gob.mx/semar/archivo/prensa?idiom=es-MX",scope:"federal",priority:1,kind:"official"}
];