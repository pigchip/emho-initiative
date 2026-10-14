import chinoEn from './articles/chino.en.md?raw'
import chinoEs from './articles/chino.es.md?raw'
import masteryEn from './articles/mastery.en.md?raw'
import masteryEs from './articles/mastery.es.md?raw'
import publicEn from './articles/public.en.md?raw'
import publicEs from './articles/public.es.md?raw'

export type Language = 'en' | 'es'
export type Translation = Record<Language, string>
export const base = '/emho-initiative/'
export const text = (en: string, es: string): Translation => ({ en, es })

export const projects = [
  {
    id: 'chino-100', name: 'Chino 100', number: '01', color: 'chino',
    category: text('LANGUAGE & LEARNING', 'IDIOMAS Y APRENDIZAJE'),
    title: text('A new way to learn Mandarin.', 'Otra forma de aprender mandarín.'),
    description: text('Characters, conversations, and small moments of understanding. Practice Mandarin with a curriculum built for Spanish-speaking learners.', 'Caracteres, conversaciones y pequeños momentos de comprensión. Practica mandarín con un currículo para estudiantes hispanohablantes.'),
    features: [
      text('Guided HSK 1–2 vocabulary and everyday structures', 'Vocabulario HSK 1–2 y estructuras de uso cotidiano'),
      text('Character strokes, listening, and visual practice', 'Trazos, comprensión auditiva y práctica visual'),
      text('Sections, mock exams, and progress saved on your device', 'Práctica por secciones, simulacros y progreso en tu dispositivo'),
    ],
    live: 'https://aguzmancruz.com/chino-100/',
    repository: null,
    image: 'chino-preview.webp',
  },
  {
    id: 'one-dsa', name: 'One-DSA', number: '02', color: 'patterns',
    category: text('CODE & KNOWLEDGE', 'CÓDIGO Y CONOCIMIENTO'),
    title: text('See the pattern. Build the solution.', 'Encuentra el patrón. Crea la solución.'),
    description: text('A place to connect algorithms, explore reusable patterns, and turn scattered notes into a clearer path through computer science.', 'Un espacio para conectar algoritmos, explorar patrones reutilizables y convertir apuntes dispersos en una ruta más clara por la informática.'),
    features: [
      text('A searchable library of algorithmic patterns', 'Una biblioteca de patrones algorítmicos'),
      text('Practice, reference material, and a learning roadmap', 'Práctica, material de referencia y una ruta de aprendizaje'),
      text('An approachable workspace for building understanding', 'Un espacio accesible para construir conocimiento'),
    ],
    live: 'https://aguzmancruz.com/one-dsa/',
    repository: 'https://github.com/pigchip/one-dsa',
    image: 'one-dsa-preview.webp',
  },
  {
    id: 'dsa-mastery', name: 'DSA Mastery', number: '03', color: 'mastery',
    category: text('PRACTICE & PROGRESS', 'PRÁCTICA Y PROGRESO'),
    title: text('Less memorizing. More understanding.', 'Menos memorizar. Más comprender.'),
    description: text('Recall first, write Python, and learn from your attempts. A focused practice companion with optional on-device AI hints.', 'Recuerda, escribe Python y aprende de tus intentos. Un compañero de práctica con pistas opcionales de IA en tu dispositivo.'),
    features: [
      text('Active recall and sequential pattern mastery', 'Recuperación activa y dominio progresivo de patrones'),
      text('Python runs in a dedicated browser worker', 'Python se ejecuta en un worker del navegador'),
      text('Deterministic feedback, with optional local AI wording', 'Retroalimentación determinista e IA local opcional'),
    ],
    live: 'https://aguzmancruz.com/one-dsa/dsa-mastery/',
    repository: 'https://github.com/pigchip/one-dsa',
    image: 'mastery-preview.webp',
  },
] as const

export const articles = [
  {
    slug: 'learning-mandarin-one-step-at-a-time', project: 'chino-100', category: text('PROJECT NOTES', 'NOTAS DE PROYECTO'),
    title: text('Learning Mandarin, one small step at a time.', 'Aprender mandarín, un pequeño paso a la vez.'),
    excerpt: text('Why characters, context, and a little repetition belong together.', 'Por qué los caracteres, el contexto y un poco de repetición van juntos.'),
    reading: 3, body: { en: chinoEn, es: chinoEs },
  },
  {
    slug: 'understanding-before-the-answer', project: 'dsa-mastery', category: text('LEARNING IN PUBLIC', 'APRENDER EN ABIERTO'),
    title: text('Understanding before the answer.', 'Comprender antes de responder.'),
    excerpt: text('A more thoughtful way to practice code patterns with active recall.', 'Una forma más consciente de practicar patrones con recuperación activa.'),
    reading: 3, body: { en: masteryEn, es: masteryEs },
  },
  {
    slug: 'knowledge-should-be-a-shared-resource', project: null, category: text('OUR APPROACH', 'NUESTRO ENFOQUE'),
    title: text('Knowledge should be a shared resource.', 'El conocimiento debería ser un recurso compartido.'),
    excerpt: text('Free access, transparent tools, and the work of building useful public goods.', 'Acceso gratuito, herramientas transparentes y el trabajo de crear bienes públicos útiles.'),
    reading: 2, body: { en: publicEn, es: publicEs },
  },
] as const

export const routes = [
  '', 'blog/', ...projects.map(p => `projects/${p.id}/`),
  ...articles.map(a => `blog/${a.slug}/`),
]

export function pageMeta(path: string, language: Language) {
  const project = projects.find(p => path === `projects/${p.id}/`)
  const article = articles.find(a => path === `blog/${a.slug}/`)
  if (project) return { title: `${project.name} · EMHO Initiative`, description: project.description[language] }
  if (article) return { title: `${article.title[language]} · EMHO Initiative`, description: article.excerpt[language] }
  if (path === 'blog/') return { title: 'Blog · EMHO Initiative', description: text('Ideas, project notes, and learning in public.', 'Ideas, notas de proyectos y aprendizaje en abierto.')[language] }
  if (path && !routes.includes(path)) return { title: text('Page not found · EMHO Initiative', 'Página no encontrada · EMHO Initiative')[language], description: text('This page could not be found.', 'No se encontró esta página.')[language] }
  return { title: 'EMHO Initiative · Knowledge, shared.', description: text('Free learning tools, open ideas, and thoughtful AI. Explore Chino 100, One-DSA, and DSA Mastery.', 'Herramientas gratuitas, ideas abiertas e IA consciente. Explora Chino 100, One-DSA y DSA Mastery.')[language] }
}
