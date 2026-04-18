// Variation 3 — Editorial hacker (mono + grid + motion)
// Big typographic hero, engineered grid, hover-reveal project cards,
// animated skills matrix.
const { useState: useState3, useEffect: useEffect3, useRef: useRef3, useMemo: useMemo3 } = React;

function V3Editorial({ data, openPalette, theme, setTheme }) {
  const [typed, setTyped] = useState3("");
  const full = data.tagline;

  useEffect3(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [full]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>
      <TopBar openPalette={openPalette} theme={theme} setTheme={setTheme} data={data} />
      <Grid data={data} typed={typed} />
    </div>
  );
}

function TopBar({ openPalette, theme, setTheme, data }) {
  return (
    <div data-v3-top style={{
      position: "sticky", top: 0, zIndex: 10,
      background: "color-mix(in oklab, var(--bg) 88%, transparent)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      padding: "10px 28px",
      gap: 18, fontSize: 12
    }}>
      <span className="accent" style={{ fontWeight: 700, letterSpacing: 1 }}>K.N/</span>
      <span className="dim">cloud · ai · security</span>
      <nav style={{ display: "flex", gap: 18, marginLeft: 24 }}>
        {["about", "stack", "work", "lab", "contact"].map(s => (
          <a key={s} href={`#${s}`} className="dim" style={{ textTransform: "lowercase" }}>/{s}</a>
        ))}
      </nav>
      <span data-v3-meta style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        <span className="dim">{data.location.toUpperCase()}</span>
        <span className="accent">●</span>
        <button onClick={openPalette} style={{ fontSize: 11 }}>
          <span className="kbd">⌘</span><span className="kbd">K</span>
        </button>
        <ThemeToggle theme={theme} setTheme={setTheme} compact />
      </span>
    </div>
  );
}

function Grid({ data, typed }) {
  return (
    <div data-v3-grid style={{
      maxWidth: 1280, margin: "0 auto", padding: "36px 28px 80px",
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: 24
    }}>
      {/* HERO */}
      <section id="about" style={{ gridColumn: "1 / -1", position: "relative", padding: "40px 0 16px" }}>
        <GridLines />
        <div data-v3-hero-row style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "end", gap: 32 }}>
          <div>
            <div className="dim" style={{ fontSize: 11, letterSpacing: 3, marginBottom: 14 }}>
              ▸ CLOUD-ENGINEER · EST. 2017 · {data.location.toUpperCase()}
            </div>
            <h1 data-v3-name style={{
              margin: 0,
              fontSize: "clamp(48px, 8vw, 120px)",
              lineHeight: 0.92,
              fontWeight: 700,
              letterSpacing: -2,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace'
            }}>
              KALLE<br />
              <span style={{ color: "var(--fg-dim)" }}>NÄRHI</span><span className="accent">_</span>
            </h1>
          </div>
          <div data-v3-hero-meta style={{ textAlign: "right", paddingBottom: 10 }}>
            <div className="dim mono" style={{ fontSize: 11, marginBottom: 4 }}>ssh kalle@narhi.dev</div>
            <div className="mono" style={{ fontSize: 11 }}>
              {"> "}<span className="accent">~/kalle.dev</span><br />
              {"> "}ver 2026.04 · build stable
            </div>
          </div>
        </div>

        <div data-v3-hero-body style={{ marginTop: 30, display: "grid", gridTemplateColumns: "minmax(0,2fr) 1fr", gap: 40 }}>
          <div>
            <p style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.4, margin: 0, maxWidth: 720 }}>
              <span className="accent">$</span> {typed}<span className="caret"></span>
            </p>
            <p className="dim" style={{ marginTop: 22, maxWidth: 640, fontSize: 14 }}>
              {data.bio[0]}
            </p>
          </div>
          <div style={{ fontSize: 11 }} className="dim">
            <div data-v3-stats style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Stat n="2" l="projects in flight" />
              <Stat n="5y" l="in production" />
              <Stat n="1" l="certifications" />
              <Stat n="2" l="nodes racked" />
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* STACK */}
      <section id="stack" style={{ gridColumn: "1 / -1" }}>
        <SectionHead num="01" title="the stack" sub="what i reach for" />
        <StackMatrix skills={data.skills} />
      </section>

      <Rule />

      {/* WORK */}
      <section id="work" style={{ gridColumn: "1 / -1" }}>
        <SectionHead num="02" title="selected work" sub="6 of n · hover for stack" />
        <ProjectGrid projects={data.projects} />
      </section>

      <Rule />

      {/* EXPERIENCE */}
      <section style={{ gridColumn: "1 / -1" }}>
        <SectionHead num="03" title="timeline" sub="how i got here" />
        <div data-v3-timeline style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 0 }}>
          {data.experience.map((e, i) => (
            <React.Fragment key={i}>
              <div className="mono dim" style={{ fontSize: 12, padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                {e.when}
              </div>
              <div style={{ padding: "14px 0", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{e.where}</div>
                <div className="dim" style={{ fontSize: 13 }}>{e.what}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      <Rule />

      {/* LAB */}
      <section id="lab" style={{ gridColumn: "1 / -1" }}>
        <SectionHead num="04" title="the lab" sub="5 nodes, one config repo" />
        <div data-v3-lab style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <RackDiagram nodes={data.homelab.nodes} />
          <div>
            <div className="dim mono" style={{ fontSize: 11, marginBottom: 12 }}>## services</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.homelab.services.map(s => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <div className="dim mono" style={{ fontSize: 11, marginBottom: 12 }}>## certifications</div>
              <div style={{ display: "grid", gap: 6 }}>
                {data.certs.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px dashed var(--border-2)" }}>
                    <span className="accent">✓</span>
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span className="dim" style={{ fontSize: 12 }}>{c.issuer} · {c.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* CONTACT */}
      <section id="contact" style={{ gridColumn: "1 / -1" }}>
        <SectionHead num="05" title="get in touch" sub="low ceremony, high signal" />
        <div data-v3-contact style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.2, fontWeight: 600, letterSpacing: -0.5 }}>
              say something<span className="accent">.</span>
            </div>
            <p className="dim" style={{ maxWidth: 460, marginTop: 12 }}>
              email works best — i actually read it. if it's about a project or a weird idea, even better.
            </p>
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            {Object.entries(data.contact).map(([k, v]) => (
              <div key={k} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span className="dim mono" style={{ width: 90, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>{k}</span>
                <span>{v}</span>
                <span style={{ marginLeft: "auto" }} className="accent">→</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 64, display: "flex", justifyContent: "space-between", color: "var(--fg-mute)", fontSize: 11 }}>
          <span>© 2026 kalle närhi · hand-typed in neovim</span>
          <span className="mono">last-built: {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, l }) {
  return (
    <div style={{ borderLeft: "1px solid var(--border-2)", paddingLeft: 12 }}>
      <div className="accent mono" style={{ fontSize: 22, fontWeight: 600 }}>{n}</div>
      <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
    </div>
  );
}

function Rule() {
  return (
    <div style={{ gridColumn: "1 / -1", position: "relative", padding: "32px 0" }}>
      <div style={{ borderTop: "1px dashed var(--border-2)" }}></div>
    </div>
  );
}

function SectionHead({ num, title, sub }) {
  return (
    <div data-v3-section-head style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 26 }}>
      <span className="mono dim" style={{ fontSize: 12 }}>§{num}</span>
      <h2 style={{ margin: 0, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, letterSpacing: -0.5 }}>
        {title}<span className="accent">.</span>
      </h2>
      <span className="dim mono" style={{ fontSize: 11, marginLeft: "auto" }}>{sub}</span>
    </div>
  );
}

function GridLines() {
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px)",
      backgroundSize: "calc(100%/12) 100%",
      opacity: 0.35,
      pointerEvents: "none"
    }} />
  );
}

function StackMatrix({ skills }) {
  const [hover, setHover] = useState3(null);
  const cats = Object.entries(skills);

  return (
    <div data-v3-stack style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
      {cats.map(([cat, items], i) => (
        <div key={cat} style={{ background: "var(--bg)", padding: 16, minHeight: 220 }}>
          <div className="mono dim" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            0{i + 1} · {cat.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {items.map((s, j) => (
              <span
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(null)}
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  fontSize: 12,
                  cursor: "default",
                  background: hover === s ? "var(--accent)" : "var(--bg-2)",
                  color: hover === s ? "var(--bg)" : "var(--fg)",
                  borderRadius: 2,
                  transition: "all .12s",
                  transform: hover === s ? "translateY(-1px)" : "none"
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectGrid({ projects }) {
  return (
    <div data-v3-projects style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
      {projects.map((p, i) => <ProjectCard key={p.name} p={p} idx={i} />)}
    </div>
  );
}

function ProjectCard({ p, idx }) {
  const [hover, setHover] = useState3(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "var(--bg-2)" : "var(--bg)",
        padding: 20,
        minHeight: 230,
        display: "flex", flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        transition: "background .15s"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span className="mono dim" style={{ fontSize: 11 }}>{String(idx + 1).padStart(2, "0")}/</span>
        <span className="mono dim" style={{ fontSize: 11 }}>{p.year}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, marginBottom: 8 }}>
        {p.name}
        <span className="accent" style={{ marginLeft: 6, opacity: hover ? 1 : 0, transition: "opacity .15s" }}>↗</span>
      </div>
      <div className="dim" style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }}>
        {p.summary}
      </div>
      <div style={{
        marginTop: 14,
        opacity: hover ? 1 : 0.4,
        transition: "opacity .15s",
        display: "flex", flexWrap: "wrap", gap: 6
      }}>
        {p.stack.map(s => (
          <span key={s} style={{
            fontSize: 10, padding: "2px 6px",
            border: "1px solid var(--border-2)",
            color: hover ? "var(--accent)" : "var(--fg-mute)",
            borderRadius: 2
          }}>{s}</span>
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, width: hover ? "100%" : "0%",
        background: "var(--accent)", transition: "width .3s"
      }} />
    </div>
  );
}

function RackDiagram({ nodes }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden", background: "var(--panel)" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: 11 }} className="dim mono">
        RACK-01 · 4U · ~200W idle
      </div>
      <div>
        {nodes.map((n, i) => (
          <div key={n.host} style={{
            display: "grid",
            gridTemplateColumns: "24px 90px 1fr 12px",
            alignItems: "center",
            padding: "14px 12px",
            borderBottom: i < nodes.length - 1 ? "1px dashed var(--border-2)" : "none",
            gap: 10
          }}>
            <span className="mono dim" style={{ fontSize: 10 }}>U{nodes.length - i}</span>
            <span className="accent mono" style={{ fontSize: 13 }}>{n.host}</span>
            <div>
              <div style={{ fontSize: 13 }}>{n.role}</div>
              <div className="dim" style={{ fontSize: 11 }}>{n.kind} · {n.specs}</div>
            </div>
            <span className="accent" style={{ fontSize: 10 }}>●</span>
          </div>
        ))}
      </div>
    </div>
  );
}

window.V3Editorial = V3Editorial;
