import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import World from './components/World.jsx'
import { ME, SCHOOL, PROJECTS, SKILLS, ARCHIVE, FILES, FILTERS } from './data.js'

const nav = [['Home', '#home'], ['About', '#about'], ['Projects', '#projects'], ['Skills', '#skills'], ['Contact', '#contact']]

function Header() {
  const [active, setActive] = useState(0)
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const f = () => {
      const y = scrollY + innerHeight * 0.4; let a = 0
      nav.forEach(([, h], i) => { const el = document.querySelector(h); if (el && el.offsetTop <= y) a = i })
      setActive(a)
    }
    addEventListener('scroll', f, { passive: true }); f()
    return () => removeEventListener('scroll', f)
  }, [])
  return (
    <header className="top">
      <div className="wrap bar">
        <a className="mark" href="#home" aria-label="Lucky Amores">Lucky Amores</a>
        <nav className={menu ? 'open' : ''}>
          {nav.map(([t, h], i) => <a key={h} href={h} className={active === i ? 'on' : ''} onClick={() => setMenu(false)}>{t}</a>)}
        </nav>
        <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}

function Reveal({ delay = 0, className = '', children }) {
  const r = useRef(), [on, setOn] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(r.current); return () => io.disconnect()
  }, [])
  return <div ref={r} className={`rv ${on ? 'in' : ''} ${className}`} style={{ '--d': delay + 'ms' }}>{children}</div>
}

function Card({ className = '', children }) {
  const r = useRef()
  const move = e => {
    const b = r.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
    r.current.style.setProperty('--mx', x * 100 + '%'); r.current.style.setProperty('--my', y * 100 + '%')
    r.current.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 5}deg) rotateX(${(0.5 - y) * 5}deg)`
  }
  return <div ref={r} className={'card ' + className} onPointerMove={move} onPointerLeave={() => (r.current.style.transform = '')}>{children}</div>
}

const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${ME.email}&su=Hello%20Lucky`

function CopyBtn() {
  const [ok, setOk] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(ME.email) } catch {
      const t = document.createElement('textarea'); t.value = ME.email; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove()
    }
    setOk(true); setTimeout(() => setOk(false), 2000)
  }
  return <button className="btn ghost" onClick={copy}>{ok ? 'Copied!' : 'Copy email'}</button>
}

const Orn = () => (
  <svg className="orn" viewBox="0 0 240 14" aria-hidden="true"><path d="M0 7h98M142 7h98" /><path d="M120 1l6 6-6 6-6-6z" /><circle cx="104" cy="7" r="1.6" /><circle cx="136" cy="7" r="1.6" /></svg>
)

function Head({ title, text, children }) {
  return (
    <Reveal className="head">
      <h2>{title}</h2><Orn />
      {text && <p>{text}</p>}{children}
    </Reveal>
  )
}

export default function App() {
  const [filter, setFilter] = useState('All')
  const list = PROJECTS.filter(p => filter === 'All' || p.tag === filter)
  const live = PROJECTS.filter(p => p.link).length
  const tools = SKILLS.reduce((n, s) => n + s[1].length, 0)
  const name = 'Lucky Amores'
  return (
    <div className="app">
      <World /><Header />
      <div className="vig" /><div className="grain" />
      <main>
        <section id="home" className="hero">
          <div className="wrap">
            <p className="eyebrow">{SCHOOL.program} at {SCHOOL.name}</p>
            <h1 aria-label={name}>
              {name.split(' ').map((w, wi) => <span className="word" key={wi}>{w.split('').map((c, i) => <b key={i} style={{ '--i': i + wi * 6 }}>{c}</b>)}</span>)}
            </h1>
            <p className="lede">I build intelligent, secure and carefully crafted software, from machine-learning security research to full web applications.</p>
            <div className="row">
              <a className="btn" href="#projects">View projects</a>
              <a className="btn ghost" href="#contact">Get in touch</a>
            </div>
            <span className="cue">Scroll to begin the journey</span>
          </div>
        </section>

        <section id="about" className="sec band">
          <div className="wrap g12">
            <Reveal className="c6">
              <h2>The Scholar</h2><Orn />
              <p className="body">I'm a Computer Science student at {SCHOOL.name}, based in San Pedro, Laguna. I'm drawn to problems that sit between software and the real world: a chatbot that understands what a person means, an approval process that turns paperwork into a clear path.</p>
              <p className="body">My capstone hunts hidden crypto-miners by watching how hardware behaves. I'm looking for teams where I can learn fast, build seriously and contribute from day one.</p>
            </Reveal>
            <Reveal className="c6" delay={150}>
              <Card className="dossier">
                <dl>
                  <dt>Studies</dt><dd>{SCHOOL.program}</dd>
                  <dt>School</dt><dd>{SCHOOL.name}</dd>
                  <dt>Based in</dt><dd>{ME.location}</dd>
                  <dt>Interests</dt><dd>Machine learning for security, web applications, backend APIs</dd>
                  <dt>Open to</dt><dd>Internships, collaborations and new opportunities</dd>
                </dl>
                <div className="stats">
                  <div><b>{PROJECTS.length}</b><span>Projects</span></div>
                  <div><b>{live}</b><span>Live demos</span></div>
                  <div><b>{tools}</b><span>Tools and methods</span></div>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>

        <section id="projects" className="sec band">
          <div className="wrap">
            <Head title="Chronicles of Work" text="Capstone research, a live chatbot, a workflow prototype and a handful of web, Java and backend builds.">
              <div className="filters">{FILTERS.map(f => <button key={f} className={f === filter ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
            </Head>
            <div className="cards" key={filter}>
              {list.map((p, i) => (
                <Reveal key={p.id} delay={i * 80} className="cell">
                  <Card className="proj">
                    <div className="meta"><span>{p.kind}</span>{p.link && <em>Live</em>}</div>
                    <h3>{p.title}</h3>
                    <p className="lead">{p.blurb}</p>
                    <p className="sm">{p.detail}</p>
                    <div className="chips">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
                    {p.link && <a className="btn small" href={p.link.href} target="_blank" rel="noreferrer">{p.link.label} <ArrowUpRight size={15} /></a>}
                  </Card>
                </Reveal>
              ))}
            </div>
            <Reveal className="files">
              <p>Source files and project folders</p>
              <div>{FILES.map(([t, h]) => <a key={h} className="btn ghost small" href={h} target="_blank" rel="noreferrer">{t} <ArrowUpRight size={15} /></a>)}
                <a className="btn ghost small" href={ARCHIVE} target="_blank" rel="noreferrer">Project archive <ArrowUpRight size={15} /></a></div>
            </Reveal>
          </div>
        </section>

        <section id="skills" className="sec band">
          <div className="wrap">
            <Head title="The Craft" text="The tools and methods I reach for when a problem needs solving." />
            <div className="cards">
              {SKILLS.map(([t, items], i) => (
                <Reveal key={t} delay={i * 80} className="cell">
                  <Card><h3>{t}</h3><div className="chips">{items.map(s => <span key={s}>{s}</span>)}</div></Card>
                </Reveal>
              ))}
              <Reveal delay={400} className="cell">
                <Card className="edu"><h3>Education</h3><p className="lead">{SCHOOL.name}</p><p className="sm">{SCHOOL.program}</p></Card>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="contact" className="sec band last">
          <div className="wrap g12">
            <Reveal className="c6">
              <h2>Send Word</h2><Orn />
              <p className="body">Whether it's an internship, a collaboration or a project that needs building, I'd like to hear about it. Write to me and I'll reply with my résumé and project details.</p>
              <p className="mail">{ME.email}</p>
              <div className="actions"><a className="btn" href={gmail} target="_blank" rel="noreferrer"><Mail size={17} /> Write to me</a><CopyBtn /></div>
            </Reveal>
            <Reveal className="c6" delay={150}>
              <div className="links">
                {[[Mail, 'Email', ME.email, gmail], [Github, 'GitHub', 'luckyam10', ME.github], [Linkedin, 'LinkedIn', 'Connect with me', ME.linkedin]].map(([I, t, v, h]) => (
                  <a key={t} className="card link" href={h} target="_blank" rel="noreferrer"><I size={22} /><span><b>{t}</b><small>{v}</small></span><ArrowUpRight size={18} /></a>
                ))}
              </div>
            </Reveal>
          </div>
          <p className="foot">© 2026 Lucky Amores</p>
        </section>
      </main>
    </div>
  )
}
