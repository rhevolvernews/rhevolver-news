import InstitutionPage from "@/components/InstitutionPage";
export const metadata={title:"Misión, visión y valores"};
export default function Page(){return <InstitutionPage eyebrow="Rumbo editorial" title="Misión, visión y valores" intro="La visión de Rhevolver es construir un medio digital confiable, moderno y cercano, capaz de crecer sin perder su identidad regional." sections={[
{title:"Misión",paragraphs:["Informar con rapidez, claridad y contexto sobre los hechos que impactan a nuestras comunidades, usando herramientas digitales para acercar información útil a más personas."]},
{title:"Visión",paragraphs:["Consolidarnos como una casa editorial profesional nacida en Guerrero, reconocida por su identidad visual, innovación, responsabilidad y capacidad para conectar lo local con la conversación nacional."]},
{title:"Valores",bullets:["Responsabilidad y verificación.","Independencia editorial.","Cercanía con la comunidad.","Transparencia y corrección.","Innovación con criterio humano.","Respeto a la dignidad y a la diversidad."]}
]} />}
