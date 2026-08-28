# Portafolio de Moisés Asbel Solis

Landing profesional construida con Next.js, TypeScript y Tailwind CSS. Está pensada para presentar experiencia en desarrollo de software, datos, automatización e IA sin exponer información sensible.

## Ejecutar localmente

1. Instala Node.js 20.9 o posterior.
2. Instala las dependencias: `npm install`.
3. Crea un archivo `.env.local` a partir de `.env.example` y añade tus URLs públicas.
4. Coloca tu CV como `public/cv/Moises-Asbel-Solis-CV.pdf`.
5. Inicia el proyecto con `npm run dev` y abre `http://localhost:3000`.

## Personalización

- Edita `data/projects.ts` para documentar proyectos, enlaces de demo y repositorios públicos.
- Añade capturas optimizadas a `public/images/` y actualiza cada ficha de proyecto cuando las tengas.
- Configura LinkedIn, GitHub y correo mediante las variables de `.env.local`.

Los proyectos marcados como privados están deliberadamente descritos a alto nivel. Conserva fuera del repositorio las credenciales, documentación interna, conjuntos de datos y código que no deba publicarse.

## Despliegue en Vercel

1. Sube este directorio a un repositorio de GitHub.
2. En Vercel, selecciona **Add New → Project** e importa el repositorio.
3. Vercel detectará Next.js automáticamente; no cambies el comando de build.
4. En **Environment Variables**, añade `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_GITHUB_URL` y `NEXT_PUBLIC_EMAIL` si los usas.
5. Pulsa **Deploy**.

Cada actualización enviada a la rama principal generará un despliegue nuevo.
