import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowUpRight, ArrowRight, Menu, X, Globe2, BookOpen, Code2, Sparkles, Github, ChevronDown } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articles, base, pageMeta, projects, routes, text } from './content'
import type { Language, Translation } from './content'
import { readLanguage, saveLanguage, subscribeLanguage } from './language'

type Project = typeof projects[number]
const pathFromLocation = () => {
  if (typeof window === 'undefined') return ''
  const path = window.location.pathname
  if (!path.startsWith(base)) return '404/'
  return path.slice(base.length).replace(/\/?$/, '/').replace(/^\/$/, '')
}

function Preview({ project, large = false }: { project: Project; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  return <div className={`project-preview ${project.color} ${large ? 'large-preview' : ''}`}>
    {!failed && <img src={`${base}images/${project.image}`} alt="" loading="lazy" onError={() => setFailed(true)} />}
    {failed && <div className="preview-fallback">
      {project.id === 'chino-100' ? <><span className="hanzi">你好</span><span>Chino 100</span><div className="preview-chips"><span>汉字</span><span>听力</span><span>练习</span></div></>
        : <><Code2 size={42} /><span>{project.name}</span><pre>{'def learn(pattern):\n    practice(pattern)\n    return understanding'}</pre></>}
    </div>}
  </div>
}

export default function App({ initialPath = pathFromLocation() }: { initialPath?: string }) {
  const language = useSyncExternalStore(subscribeLanguage, readLanguage, (): Language => 'en')
  const [drawer, setDrawer] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const t = (value: Translation) => value[language]
  const path = initialPath
  const isBlog = path.startsWith('blog/')
  const project = projects.find(p => path === `projects/${p.id}/`)
  const article = articles.find(a => path === `blog/${a.slug}/`)
  const notFound = !routes.includes(path)
  const meta = pageMeta(path, language)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description)
  }, [language, meta.title, meta.description])

  useEffect(() => {
    if (!drawer) return
    const element = dialog.current
    const trigger = menuButton.current
    const previousOverflow = document.body.style.overflow
    element?.showModal()
    document.body.style.overflow = 'hidden'
    const media = matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (media.matches) setDrawer(false) }
    media.addEventListener('change', closeOnDesktop)
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
      media.removeEventListener('change', closeOnDesktop)
      trigger?.focus()
    }
  }, [drawer])

  function chooseLanguage(next: Language) {
    saveLanguage(next)
  }
  const languages = <div className="language-switch" aria-label={t(text('Language', 'Idioma'))}>
    <Globe2 size={15} aria-hidden="true" />
    {(['en', 'es'] as const).map(l => <button key={l} aria-pressed={language === l} onClick={() => chooseLanguage(l)} lang={l}>{l.toUpperCase()}</button>)}
  </div>
  const brand = <a className="brand" href={base} aria-label="EMHO Initiative">
    <img src={`${base}images/emho-mark.webp`} width="48" height="48" alt="" />
    <span><strong>EMHO</strong><span>INITIATIVE</span></span>
  </a>
  const articleCards = (limit = articles.length) => <div className="article-grid">{articles.slice(0, limit).map((a, i) => <a className="article-card" href={`${base}blog/${a.slug}/`} key={a.slug}>
    <div className={`article-art art-${i}`} aria-hidden="true">{i === 0 ? <span>学</span> : i === 1 ? <Code2 size={54} strokeWidth={1} /> : <div className="orbit"><span /><span /><span /></div>}<ArrowUpRight size={22} /></div>
    <span className="eyebrow">{t(a.category)} <span className="reading-time">{a.reading} {t(text('MIN READ', 'MIN DE LECTURA'))}</span></span>
    <h3>{t(a.title)}</h3><p>{t(a.excerpt)}</p>
  </a>)}</div>

  return <>
    <a className="skip-link" href="#main">{t(text('Skip to content', 'Ir al contenido'))}</a>
    <header className="site-header"><div className="header-inner">
      {brand}
      <nav className="desktop-nav" aria-label={t(text('Main navigation', 'Navegación principal'))}>
        <a href={base} aria-current={path === '' ? 'page' : undefined}>{t(text('Home', 'Inicio'))}</a>
        <a href={`${base}blog/`} aria-current={isBlog ? 'page' : undefined}>Blog</a>
      </nav>
      <div className="header-actions">{languages}<a className="header-cta" href={`${base}#projects`}>{t(text('Explore projects', 'Explorar proyectos'))}<ArrowUpRight size={16} /></a>
        <button className="menu-button" ref={menuButton} aria-expanded={drawer} aria-controls="mobile-menu" aria-label={t(text('Open menu', 'Abrir menú'))} onClick={() => setDrawer(true)}><Menu size={23} /></button>
      </div>
    </div></header>
    <dialog id="mobile-menu" className="mobile-drawer" ref={dialog} aria-label={t(text('Main navigation', 'Navegación principal'))} onCancel={() => setDrawer(false)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX > rect.right || event.clientY > rect.bottom || event.clientY < rect.top) setDrawer(false) } }}>
      <div className="drawer-head">{brand}<button autoFocus aria-label={t(text('Close menu', 'Cerrar menú'))} onClick={() => setDrawer(false)}><X /></button></div>
      <nav><a href={base} onClick={() => setDrawer(false)}>{t(text('Home', 'Inicio'))}<ArrowUpRight /></a><a href={`${base}blog/`} onClick={() => setDrawer(false)}>Blog<ArrowUpRight /></a></nav>
      <div className="drawer-projects"><span className="eyebrow">{t(text('OUR PROJECTS', 'NUESTROS PROYECTOS'))}</span>{projects.map(p => <a key={p.id} href={`${base}projects/${p.id}/`} onClick={() => setDrawer(false)}>{p.name}<ArrowRight size={17} /></a>)}</div>
      <p className="drawer-note">{t(text('Knowledge grows when we share it.', 'El conocimiento crece cuando lo compartimos.'))}</p>
    </dialog>
    <main id="main">
      {path === '' && <>
        <section className="hero wrap">
          <div className="hero-label">{t(text('OPEN IDEAS. REAL POSSIBILITIES.', 'IDEAS ABIERTAS. POSIBILIDADES REALES.'))}</div>
          <h1>{t(text('Knowledge,', 'Conocimiento,'))}<br /><em>{t(text('shared.', 'compartido.'))}</em><span className="hero-spark" aria-hidden="true">✳</span></h1>
          <div className="hero-bottom"><p>{t(text('Thoughtful tools for curious minds. We build free learning experiences that bring people, knowledge, and AI together.', 'Herramientas conscientes para mentes curiosas. Creamos experiencias gratuitas que conectan personas, conocimiento e IA.'))}</p>
            <a className="button primary" href="#projects">{t(text('Find your next discovery', 'Encuentra tu próximo descubrimiento'))}<ArrowDownIcon /></a>
          </div>
          <div className="hero-caption"><span>{t(text('BUILT TO LEARN. DESIGNED TO SHARE.', 'CREADO PARA APRENDER. DISEÑADO PARA COMPARTIR.'))}</span><span>01 — 03</span></div>
        </section>
        <section className="projects-section wrap" id="projects" aria-labelledby="projects-title">
          <div className="section-heading"><div><span className="eyebrow">{t(text('A GROWING COLLECTION', 'UNA COLECCIÓN EN CRECIMIENTO'))}</span><h2 id="projects-title">{t(text('Small tools.', 'Pequeñas herramientas.'))} <em>{t(text('Bigger possibilities.', 'Grandes posibilidades.'))}</em></h2></div><span className="project-count">03 {t(text('PROJECTS', 'PROYECTOS'))}</span></div>
          <div className="collage">
            {projects.map(p => <a key={p.id} className={`project-card card-${p.color}`} href={`${base}projects/${p.id}/`}>
              <div className="card-top"><span className="eyebrow">{t(p.category)}</span><span>{p.number}</span></div>
              <Preview project={p} />
              <div className="card-caption"><div><h3>{p.name}</h3><p>{t(p.title)}</p></div><span className="circle-arrow"><ArrowUpRight size={23} /></span></div>
            </a>)}
            <a href={`${base}projects/chino-100/`} className="feature-tile chinese-tile"><div><span className="eyebrow">CHINO 100</span><h3>{t(text('One character.', 'Un carácter.'))}<br /><em>{t(text('A world of meaning.', 'Un mundo de significado.'))}</em></h3></div><span className="character" aria-hidden="true">学</span><span className="tile-bottom">{t(text('MAKE LEARNING TANGIBLE', 'HAZ TANGIBLE EL APRENDIZAJE'))}<ArrowUpRight size={20} /></span></a>
            <a href={`${base}projects/dsa-mastery/`} className="feature-tile code-tile"><span className="eyebrow">DSA MASTERY</span><div className="code-lines" aria-hidden="true"><span>def <b>grow</b>(curiosity):</span><span>    learn = <i>True</i></span><span>    <b>while</b> learn:</span><span>        practice()</span></div><span className="tile-bottom">{t(text('UNDERSTANDING > MEMORIZING', 'COMPRENDER > MEMORIZAR'))}<ArrowUpRight size={20} /></span></a>
            <div className="feature-tile shared-tile"><span className="eyebrow">{t(text('THE COMMON THREAD', 'LO QUE NOS CONECTA'))}</span><div className="shared-icon"><Globe2 size={50} strokeWidth={1} /></div><h3>{t(text('Made for you.', 'Creado para ti.'))}<br /><em>{t(text('Open to everyone.', 'Abierto a todos.'))}</em></h3><p>{t(text('Free to explore. No account needed.', 'Explora gratis. Sin necesidad de cuenta.'))}</p></div>
          </div>
        </section>
        <section className="approach-section"><div className="wrap approach-inner"><div><span className="eyebrow">{t(text('THE EMHO APPROACH', 'EL ENFOQUE EMHO'))}</span><h2>{t(text('Human curiosity.', 'Curiosidad humana.'))}<br /><em>{t(text('Shared progress.', 'Progreso compartido.'))}</em></h2><p>{t(text('Technology matters most when it helps someone understand something new. Our approach starts with evidence, welcomes different perspectives, and keeps people at the center.', 'La tecnología importa cuando ayuda a comprender algo nuevo. Nuestro enfoque parte de la evidencia, valora distintas perspectivas y mantiene a las personas en el centro.'))}</p></div>
          <div className="principles">{[
            { icon: BookOpen, title: text('Evidence-based', 'Basado en evidencia'), description: text('Ground learning in clear content and practical feedback.', 'Apoyar el aprendizaje en contenido claro y retroalimentación práctica.') },
            { icon: Sparkles, title: text('Different perspectives', 'Distintas perspectivas'), description: text('An ambition for multi-agent consensus, guided by human judgment.', 'La aspiración de lograr consenso multiagente, guiado por el criterio humano.') },
            { icon: Globe2, title: text('People first', 'Las personas primero'), description: text('Accessible tools, transparent limitations, and room to improve.', 'Herramientas accesibles, límites transparentes y espacio para mejorar.') },
            { icon: Code2, title: text('Open collaboration', 'Colaboración abierta'), description: text('Explore available source. Check each project’s license before reuse.', 'Explora el código disponible. Revisa la licencia de cada proyecto antes de reutilizarlo.') },
          ].map(({ icon: Icon, title, description }) => <div className="principle" key={title.en}><Icon size={21} strokeWidth={1.5} /><div><h3>{t(title)}</h3><p>{t(description)}</p></div></div>)}</div>
        </div></section>
        <section className="writing-section wrap"><div className="section-heading"><div><span className="eyebrow">{t(text('NOTES FROM THE JOURNEY', 'NOTAS DEL CAMINO'))}</span><h2>{t(text('Ideas worth', 'Ideas que vale la pena'))} <em>{t(text('sharing.', 'compartir.'))}</em></h2></div><a className="text-link" href={`${base}blog/`}>{t(text('All writing', 'Todos los artículos'))}<ArrowUpRight size={18} /></a></div>{articleCards()}</section>
      </>}
      {project && <section className="project-detail wrap"><a className="breadcrumb" href={`${base}#projects`}>{t(text('Projects', 'Proyectos'))} / {project.name}</a><span className="eyebrow">{t(project.category)}</span><h1>{project.name}<em>{t(project.title)}</em></h1><p className="lead">{t(project.description)}</p><div className="detail-actions"><a className="button primary" href={project.live}>{t(text('Open the project', 'Abrir el proyecto'))}<ArrowUpRight size={19} /></a>{project.repository && <a className="button secondary" href={project.repository}><Github size={17} />{t(text('Explore the code', 'Explorar el código'))}</a>}</div><Preview project={project} large /><div className="detail-grid"><div><span className="eyebrow">{t(text('WHAT YOU CAN DO', 'QUÉ PUEDES HACER'))}</span><h2>{t(text('A little practice.', 'Un poco de práctica.'))}<br /><em>{t(text('A new perspective.', 'Una nueva perspectiva.'))}</em></h2></div><ul>{project.features.map(f => <li key={f.en}><ArrowRight size={18} />{t(f)}</li>)}</ul></div><div className="transparency-note"><h3>{t(text('A note on access and AI', 'Una nota sobre acceso e IA'))}</h3><p>{t(text('These are free learning tools, not certified DPGA registry entries. Core practice does not require a cloud AI subscription. Optional browser AI needs compatible hardware and a separate model download. Source availability does not by itself grant reuse rights: check the repository license.', 'Son herramientas gratuitas de aprendizaje, no entradas certificadas del registro DPGA. La práctica básica no requiere una suscripción de IA en la nube. La IA opcional del navegador requiere hardware compatible y descargar un modelo. El acceso al código no concede derechos de reutilización: consulta su licencia.'))}</p>{!project.repository && <p>{t(text('Chino 100 is free to use; its source repository remains private.', 'Chino 100 es gratuito; su repositorio de código permanece privado.'))}</p>}</div></section>}
      {path === 'blog/' && <section className="blog-index wrap"><span className="eyebrow">{t(text('LEARNING IN PUBLIC', 'APRENDER EN ABIERTO'))}</span><h1>{t(text('Ideas worth', 'Ideas para'))}<br /><em>{t(text('sharing.', 'compartir.'))}</em></h1><p className="lead">{t(text('Project notes, useful questions, and the things we learn along the way.', 'Notas de proyectos, preguntas útiles y lo que aprendemos en el camino.'))}</p>{articleCards()}</section>}
      {article && <article className="article-page wrap"><a className="breadcrumb" href={`${base}blog/`}>Blog / {t(article.category)}</a><span className="eyebrow">{t(article.category)} · {article.reading} {t(text('MIN READ', 'MIN DE LECTURA'))}</span><h1>{t(article.title)}</h1><p className="lead">{t(article.excerpt)}</p><div className="prose"><Markdown remarkPlugins={[remarkGfm]} skipHtml>{article.body[language]}</Markdown></div>{article.project && <a className="button primary" href={`${base}projects/${article.project}/`}>{t(text('Meet the project', 'Conoce el proyecto'))}<ArrowUpRight size={18} /></a>}<a className="back-link" href={`${base}blog/`}>{t(text('Back to all writing', 'Volver a los artículos'))}<ArrowRight size={17} /></a></article>}
      {notFound && <section className="not-found wrap"><span className="eyebrow">404</span><h1>{t(text('A different', 'Un camino'))}<br /><em>{t(text('path awaits.', 'diferente.'))}</em></h1><p>{t(text('We couldn’t find that page. There’s still plenty to discover.', 'No encontramos esa página. Aún queda mucho por descubrir.'))}</p><a className="button primary" href={base}>{t(text('Go home', 'Ir al inicio'))}<ArrowRight size={18} /></a></section>}
    </main>
    <footer className="site-footer"><div className="wrap"><div className="footer-top">{brand}<p>{t(text('Knowledge grows when', 'El conocimiento crece cuando'))}<br /><em>{t(text('we share it.', 'lo compartimos.'))}</em></p><a className="text-link" href="https://github.com/pigchip"><Github size={19} />GitHub<ArrowUpRight size={15} /></a></div><div className="footer-bottom"><span>© {import.meta.env.VITE_BUILD_YEAR} EMHO Initiative</span><span>{t(text('FREE TO LEARN. OPEN TO POSSIBILITY.', 'APRENDER GRATIS. EXPLORAR SIN LÍMITES.'))}</span><div><a href={base}>{t(text('Home', 'Inicio'))}</a><a href={`${base}blog/`}>Blog</a></div></div></div></footer>
  </>
}

function ArrowDownIcon() { return <ChevronDown size={19} aria-hidden="true" /> }
