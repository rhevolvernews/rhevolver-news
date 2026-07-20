import InstitutionPage from "@/components/InstitutionPage";

export const metadata = {
  title: "Responsabilidad editorial",
  description:
    "Descargo de responsabilidad, actualización de contenidos, uso de fuentes, inteligencia artificial y derechos de autor en Rhevolver.news.",
};

export default function Page() {
  return (
    <InstitutionPage
      eyebrow="Responsabilidad"
      title="Responsabilidad editorial"
      intro="Rhevolver.news informa con base en las fuentes y datos disponibles al momento de cada publicación. La información puede actualizarse cuando surjan nuevos elementos verificables."
      sections={[
        {
          title: "Alcance informativo",
          paragraphs: [
            "Nuestros contenidos tienen fines periodísticos e informativos. No sustituyen asesoría médica, jurídica, financiera, de seguridad o de cualquier otra especialidad profesional.",
            "Las noticias en desarrollo pueden cambiar conforme autoridades, protagonistas o documentos aporten información adicional.",
          ],
        },
        {
          title: "Fuentes, versiones y contexto",
          paragraphs: [
            "Procuramos identificar la procedencia de los datos y distinguir entre hechos confirmados, declaraciones, reportes preliminares y versiones sujetas a verificación.",
            "La publicación de una declaración no implica que Rhevolver respalde su contenido; significa que forma parte del contexto informativo relevante.",
          ],
        },
        {
          title: "Correcciones y actualizaciones",
          paragraphs: [
            "Cuando detectamos un error relevante, corregimos o actualizamos la publicación. Las solicitudes documentadas pueden enviarse mediante nuestro canal de correcciones.",
          ],
          bullets: [
            "Indicamos cuando una información está en desarrollo.",
            "Actualizamos datos cuando existen nuevas confirmaciones.",
            "Atendemos solicitudes de aclaración, réplica y rectificación de buena fe.",
          ],
        },
        {
          title: "Uso responsable de inteligencia artificial",
          paragraphs: [
            "Las herramientas de inteligencia artificial pueden apoyar tareas como organización, resumen, estilo, transcripción o propuestas editoriales. La revisión, edición y responsabilidad final corresponden siempre a una persona.",
            "Rhevolver no publica de forma autónoma contenido generado por IA sin supervisión editorial humana.",
          ],
        },
        {
          title: "Enlaces y plataformas externas",
          paragraphs: [
            "El sitio puede incluir enlaces, videos o publicaciones de terceros. Rhevolver no controla la disponibilidad, políticas ni cambios posteriores realizados por esas plataformas.",
          ],
        },
        {
          title: "Derechos de autor y citas",
          paragraphs: [
            "Los contenidos originales, diseño e identidad de Rhevolver están protegidos. Se permite citar fragmentos breves con atribución clara y enlace a la publicación original. La reproducción comercial íntegra requiere autorización previa.",
          ],
        },
      ]}
    />
  );
}
