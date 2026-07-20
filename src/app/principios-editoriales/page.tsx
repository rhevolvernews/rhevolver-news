import InstitutionPage from "@/components/InstitutionPage";
export const metadata={title:"Principios editoriales"};
export default function Page(){return <InstitutionPage eyebrow="Confianza" title="Principios editoriales" intro="Estos lineamientos orientan la producción, edición y publicación de contenidos en Rhevolver.news." sections={[
{title:"Verificación",paragraphs:["Contrastamos datos, documentos, declaraciones y fuentes disponibles antes de publicar. Cuando una información está en desarrollo, lo señalamos con claridad."]},
{title:"Información, opinión y publicidad",paragraphs:["Distinguimos las noticias de los textos de opinión y del contenido comercial. Las colaboraciones o publicaciones patrocinadas deben identificarse."]},
{title:"Correcciones",paragraphs:["Cuando detectamos un error relevante, lo corregimos con oportunidad y procuramos dejar constancia de la actualización cuando el contexto lo requiere."]},
{title:"Uso responsable de inteligencia artificial",paragraphs:["Las herramientas de IA pueden apoyar tareas editoriales, pero la revisión, decisión y responsabilidad final corresponden siempre a una persona. No publicamos automáticamente contenido generado sin supervisión humana."]},
{title:"Privacidad y dignidad",paragraphs:["Evitamos exponer datos personales innecesarios y tratamos con especial cuidado a víctimas, menores de edad y personas en situaciones vulnerables."]}
]} />}
