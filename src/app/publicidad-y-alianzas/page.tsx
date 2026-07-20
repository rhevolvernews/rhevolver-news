import InstitutionPage from "@/components/InstitutionPage";

export const metadata = {
  title: "Publicidad y alianzas",
  description: "Opciones de publicidad, contenidos patrocinados y alianzas con Rhevolver.news.",
};

export default function Page() {
  return (
    <InstitutionPage
      eyebrow="Colaboración"
      title="Publicidad y alianzas"
      intro="Rhevolver ofrece espacios para marcas, negocios, instituciones y proyectos que buscan conectar con audiencias digitales mediante formatos claros y responsables."
      sections={[
        {
          title: "Formatos disponibles",
          bullets: [
            "Banners y presencia de marca.",
            "Contenido patrocinado identificado.",
            "Coberturas y alianzas especiales.",
            "Difusión en plataformas sociales, sujeta a evaluación.",
          ],
        },
        {
          title: "Independencia editorial",
          paragraphs: [
            "La contratación de publicidad no garantiza cobertura informativa favorable ni modifica los criterios editoriales de Rhevolver.",
          ],
        },
        {
          title: "Identificación",
          paragraphs: [
            "Los contenidos pagados, patrocinios o colaboraciones comerciales deben señalarse de forma visible para evitar confusión con una noticia independiente.",
          ],
        },
        {
          title: "Contacto comercial",
          paragraphs: [
            "Para solicitar información, disponibilidad o una propuesta, escribe a rhevolvermedia@gmail.com con el asunto “Publicidad y alianzas”.",
          ],
        },
      ]}
    />
  );
}
