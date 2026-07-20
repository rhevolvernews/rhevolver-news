import InstitutionPage from "@/components/InstitutionPage";

export const metadata = {
  title: "Transparencia",
  description: "Transparencia editorial, contacto, correcciones y relación con las audiencias de Rhevolver.news.",
};

export default function Page() {
  return (
    <InstitutionPage
      eyebrow="Confianza"
      title="Transparencia"
      intro="La confianza se construye explicando cómo trabajamos, cómo corregimos y cómo se puede contactar a nuestra redacción."
      sections={[
        {
          title: "Identidad editorial",
          paragraphs: [
            "Rhevolver.news es una casa editorial digital independiente con origen en Guerrero y cobertura local, estatal, nacional e internacional.",
          ],
        },
        {
          title: "Contacto con la redacción",
          paragraphs: [
            "Las audiencias pueden enviar información, documentos, solicitudes de cobertura, aclaraciones o comentarios al correo contacto@rhevolver.news.",
          ],
        },
        {
          title: "Correcciones y derecho de réplica",
          paragraphs: [
            "Las solicitudes deben identificar la publicación, el dato cuestionado y aportar elementos que permitan revisar el caso. Cada solicitud será valorada editorialmente.",
          ],
        },
        {
          title: "Contenido comercial",
          paragraphs: [
            "La publicidad, colaboración pagada o contenido patrocinado debe diferenciarse de la información editorial. Los acuerdos comerciales no determinan nuestras decisiones informativas.",
          ],
        },
        {
          title: "Tecnología e inteligencia artificial",
          paragraphs: [
            "Las herramientas digitales pueden apoyar el trabajo de la redacción, pero la decisión final y la responsabilidad de publicación permanecen bajo supervisión humana.",
          ],
        },
      ]}
    />
  );
}
