import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moisés Asbel Solis | Ingeniero en Sistemas de Información",
  description:
    "Portafolio de Moisés Asbel Solis: desarrollo de software, datos, automatización e inteligencia artificial.",
  keywords: ["Moisés Asbel Solis", "Ingeniero en Sistemas", ".NET", "Python", "ETL", "RAG"],
  openGraph: {
    title: "Moisés Asbel Solis | Portafolio profesional",
    description: "Software, datos, automatización e inteligencia artificial.",
    type: "website",
    locale: "es_EC",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
