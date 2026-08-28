export type Project = {
  title: string;
  category: string;
  description: string;
  architecture: string[];
  technologies: string[];
  visibility: "Privado" | "En preparación" | "Público";
  imageLabel: string;
  demoUrl?: string;
  githubUrl?: string;
};

/**
 * Edita este archivo para sustituir los textos y enlaces por la información
 * verificable de cada proyecto. No publiques claves, URLs internas ni código propietario.
 */
export const projects: Project[] = [
  {
    title: "Asistente SRI",
    category: "IA aplicada · Información tributaria",
    description:
      "Asistente orientado a facilitar la consulta de información. La descripción pública puede ampliarse cuando se definan el alcance, las fuentes y las políticas de acceso.",
    architecture: ["Interfaz de consulta", "Servicio de recuperación", "Base de conocimiento"],
    technologies: ["Python", "RAG", "pgvector", "MCP"],
    visibility: "Privado",
    imageLabel: "Captura o diagrama pendiente",
  },
  {
    title: "Solución empresarial .NET",
    category: "Desarrollo de software",
    description:
      "Espacio para presentar un sistema desarrollado con el ecosistema .NET sin revelar reglas de negocio, datos de clientes o implementaciones propietarias.",
    architecture: ["Cliente web", "API ASP.NET Core", "Persistencia relacional"],
    technologies: ["C#", ".NET", "ASP.NET Core", "SQL Server"],
    visibility: "En preparación",
    imageLabel: "Añadir caso de estudio",
  },
  {
    title: "Pipeline ETL",
    category: "Ingeniería de datos",
    description:
      "Proyecto para mostrar procesos de extracción, transformación y carga. Sustituye este texto por el problema, resultado y métricas que puedas compartir públicamente.",
    architecture: ["Fuentes de datos", "Transformación", "Base de datos destino"],
    technologies: ["Python", "ETL", "PostgreSQL", "SQLite"],
    visibility: "En preparación",
    imageLabel: "Añadir flujo ETL",
  },
];
