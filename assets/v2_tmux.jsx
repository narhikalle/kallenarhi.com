// Variation 2 — tmux split panes / IDE layout
// Left: file tree (sections). Center: content pane. Right: skills cloud + status.
// Bottom: status bar. Top: tmux-style tab bar.
const { useState: useState2, useEffect: useEffect2, useRef: useRef2, useMemo: useMemo2 } = React;

function V2Tmux({ data, openPalette, theme, setTheme }) {
  const [active, setActive] = useState2("about.md");
  const [uptime, setUptime] = useState2(0);
  const [hoveredProject, setHoveredProject] = useState2(null);

  useEffect2(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const files = [
    { id: "about.md", icon: "●", label: "about.md", group: "~/kalle" },
    { id: "skills.json", icon: "◆", label: "skills.json", group: "~/kalle" },
    { id: "projects/", icon: "▸", label: "projects/", group: "~/kalle" },
    { id: "experience.log", icon: "▤", label: "experience.log", group: "~/kalle" },
    { id: "certs.yml", icon: "✓", label: "certs.yml", group: "~/kalle" },
    { id: "homelab.nix", icon: "◉", label: "homelab.nix", group: "~/kalle" },
    { id: "contact.sh", icon: "✉", label: "contact.sh", group: "~/kalle" },
  ];

  return (
    <div data-v2-root style={{
      height: "100vh",
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* tmux tab bar */}
      <TmuxTabs active={active} setActive={setActive} files={files} openPalette={openPalette} theme={theme} setTheme={setTheme} data={data} />

      {/* main panes */}
      <div data-v2-main style={{ flex: 1, display: "grid", gridTemplateColumns: "220px 1fr 280px", minHeight: 0 }}>
        {/* Left: file tree */}
        <LeftTree files={files} active={active} setActive={setActive} />

        {/* Center: content */}
        <CenterPane active={active} data={data} hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />

        {/* Right: skills cloud + system */}
        <RightPanel data={data} uptime={uptime} />
      </div>

      {/* bottom status bar */}
      <StatusBar data={data} active={active} uptime={uptime} theme={theme} />
    </div>
  );
}

function TmuxTabs({ active, setActive, files, openPalette, theme, setTheme, data }) {
  const tabs = ["about.md", "projects/", "homelab.nix"];
  return (
    <div data-v2-tabs style={{
      display: "flex", alignItems: "center", gap: 2,
      padding: "6px 10px",
      background: "var(--bg-2)",
      borderBottom: "1px solid var(--border)",
      fontSize: 12
    }}>
      <span className="accent" style={{ fontWeight: 600 }}>[{data.handle}]</span>
      <span className="dim" style={{ marginRight: 6 }}>0:</span>
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          style={{
            padding: "2px 10px",
            background: active === t ? "var(--accent)" : "var(--bg-3)",
            color: active === t ? "var(--bg)" : "var(--fg-dim)",
            border: "none",
            borderRadius: 2,
            fontSize: 12
          }}
        >
          {i}:{t}
        </button>
      ))}
      <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={openPalette} style={{ fontSize: 11, padding: "3px 8px" }}>
          <span className="dim">⌘K</span>
        </button>
        <ThemeToggle theme={theme} setTheme={setTheme} compact />
        <span className="dim">{new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
      </span>
    </div>
  );
}

function LeftTree({ files, active, setActive }) {
  return (
    <div data-v2-tree style={{
      borderRight: "1px solid var(--border)",
      background: "var(--panel)",
      overflowY: "auto",
      padding: "12px 0"
    }}>
      <div className="dim" style={{ padding: "0 14px 6px", fontSize: 11, letterSpacing: 1 }}>EXPLORER</div>
      <div className="dim" style={{ padding: "4px 14px", fontSize: 12 }}>▾ ~/kalle</div>
      {files.map(f => (
        <div
          key={f.id}
          data-filepill
          onClick={() => setActive(f.id)}
          style={{
            padding: "4px 14px 4px 28px",
            fontSize: 13,
            cursor: "pointer",
            background: active === f.id ? "var(--sel)" : "transparent",
            borderLeft: active === f.id ? "2px solid var(--accent)" : "2px solid transparent",
            color: active === f.id ? "var(--fg)" : "var(--fg-dim)"
          }}
        >
          <span className="accent" style={{ marginRight: 8, display: "inline-block", width: 10 }}>{f.icon}</span>
          {f.label}
        </div>
      ))}
      <div data-divider style={{ borderTop: "1px dashed var(--border-2)", margin: "14px 14px" }} />
      <div data-outline className="dim" style={{ padding: "0 14px", fontSize: 11, letterSpacing: 1 }}>OUTLINE</div>
      <div data-outline style={{ padding: "6px 14px", fontSize: 12 }} className="dim">
        <div>└─ <span className="accent">$</span> whoami</div>
        <div>└─ <span className="accent">$</span> stack</div>
        <div>└─ <span className="accent">$</span> building</div>
        <div>└─ <span className="accent">$</span> reach out</div>
      </div>
    </div>
  );
}

function CenterPane({ active, data, hoveredProject, setHoveredProject }) {
  return (
    <div style={{ overflowY: "auto", padding: "0", position: "relative" }}>
      {/* line numbers + gutter */}
      <div data-v2-content style={{ display: "grid", gridTemplateColumns: "42px 1fr", minHeight: "100%" }}>
        <div data-v2-gutter style={{
          borderRight: "1px solid var(--border)",
          background: "var(--bg)",
          padding: "18px 0",
          textAlign: "right",
          color: "var(--fg-mute)",
          fontSize: 11,
          userSelect: "none",
          paddingRight: 10
        }}>
          {Array.from({ length: 60 }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>

        <div style={{ padding: "18px 28px" }}>
          {active === "about.md" && <AboutMd data={data} />}
          {active === "skills.json" && <SkillsJson data={data} />}
          {active === "projects/" && <ProjectsPane data={data} hovered={hoveredProject} setHovered={setHoveredProject} />}
          {active === "experience.log" && <ExperienceLog data={data} />}
          {active === "certs.yml" && <CertsYml data={data} />}
          {active === "homelab.nix" && <HomelabNix data={data} />}
          {active === "contact.sh" && <ContactSh data={data} />}
        </div>
      </div>
    </div>
  );
}

// Token helpers
const K = ({ children }) => <span style={{ color: "var(--err)" }}>{children}</span>; // keyword
const S = ({ children }) => <span style={{ color: "var(--accent)" }}>{children}</span>; // string
const N = ({ children }) => <span style={{ color: "var(--warn)" }}>{children}</span>; // number
const C = ({ children }) => <span style={{ color: "var(--fg-mute)" }}>{children}</span>; // comment
const P = ({ children }) => <span style={{ color: "var(--fg-dim)" }}>{children}</span>; // property

function AboutMd({ data }) {
  return (
    <div style={{ maxWidth: 720, lineHeight: 1.7 }}>
      <div className="dim" style={{ fontSize: 11 }}># about.md</div>
      <h1 style={{ margin: "14px 0 4px", fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>
        {data.name}<span className="accent">.</span>
      </h1>
      <div className="dim" style={{ fontSize: 15, marginBottom: 18 }}>
        {data.role} · <span>{data.location}</span>
      </div>
      <p style={{ fontSize: 15, color: "var(--fg)", maxWidth: 640 }}>
        {data.tagline}
      </p>
      {data.bio.map((p, i) => (
        <p key={i} style={{ fontSize: 14, color: "var(--fg-dim)", maxWidth: 640 }}>{p}</p>
      ))}

      <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {data.focus.map(f => <span key={f} className="chip on">{f}</span>)}
      </div>

      <hr className="hr-dashed" />
      <div className="dim" style={{ fontSize: 12 }}>
        <div>## current</div>
        <div style={{ marginTop: 6 }}>
          <span className="accent">▸</span> shipping vault-sentry v0.3<br />
          <span className="accent">▸</span> learning Rust, slowly<br />
          <span className="accent">▸</span> benchmarking local LLMs on the GPU node
        </div>
      </div>
    </div>
  );
}

function SkillsJson({ data }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.8 }}>
      <div className="dim" style={{ fontSize: 11 }}># skills.json</div>
      <div style={{ marginTop: 10 }}>
        <span>{"{"}</span>
        {Object.entries(data.skills).map(([group, items], i, arr) => (
          <div key={group} style={{ paddingLeft: 20 }}>
            <P>"{group.toLowerCase()}"</P>: [
            <div style={{ paddingLeft: 20 }}>
              {items.map((s, j) => (
                <span key={s}>
                  <S>"{s}"</S>{j < items.length - 1 ? ", " : ""}
                  {(j + 1) % 4 === 0 && j < items.length - 1 ? <br /> : null}
                </span>
              ))}
            </div>
            ]{i < arr.length - 1 ? "," : ""}
          </div>
        ))}
        <span>{"}"}</span>
      </div>
    </div>
  );
}

function ProjectsPane({ data, hovered, setHovered }) {
  return (
    <div>
      <div className="dim" style={{ fontSize: 11 }}># projects/</div>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {data.projects.map(p => (
          <div
            key={p.name}
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              border: "1px solid var(--border)",
              borderLeft: hovered === p.name ? "2px solid var(--accent)" : "2px solid var(--border)",
              borderRadius: 4,
              padding: "12px 14px",
              background: hovered === p.name ? "var(--bg-2)" : "var(--panel)",
              transition: "all .15s",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span className="accent" style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span>
              <span className="dim" style={{ fontSize: 11 }}>{p.year}</span>
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 2,
                color: p.status === "active" ? "var(--accent)" : "var(--fg-mute)",
                border: "1px solid currentColor"
              }}>{p.status}</span>
              <span style={{ marginLeft: "auto", fontSize: 11 }}>
                {p.tags.map(t => <span key={t} className="tag" style={{ marginLeft: 8 }}>{t}</span>)}
              </span>
            </div>
            <div style={{ marginTop: 6, color: "var(--fg)" }}>{p.summary}</div>
            <div style={{
              marginTop: hovered === p.name ? 10 : 0,
              maxHeight: hovered === p.name ? 40 : 0,
              overflow: "hidden",
              transition: "all .2s",
              fontSize: 11,
              color: "var(--fg-mute)"
            }}>
              <span className="dim">$ cat stack.txt &gt; </span>
              {p.stack.map((s, i) => (
                <span key={s} className="accent">{s}{i < p.stack.length - 1 ? " · " : ""}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceLog({ data }) {
  return (
    <div>
      <div className="dim" style={{ fontSize: 11 }}># experience.log</div>
      <div style={{ marginTop: 10, fontFamily: "inherit" }}>
        {data.experience.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px dashed var(--border-2)" }}>
            <span className="dim" style={{ width: 120, flexShrink: 0, fontSize: 12 }}>[{e.when}]</span>
            <div>
              <div className="accent" style={{ fontWeight: 600 }}>{e.where}</div>
              <div className="dim" style={{ fontSize: 13 }}>{e.what}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertsYml({ data }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.8 }}>
      <div className="dim" style={{ fontSize: 11 }}># certs.yml</div>
      <div style={{ marginTop: 10 }}>
        <P>certifications</P>:
        {data.certs.map((c, i) => (
          <div key={i} style={{ paddingLeft: 16 }}>
            - <P>name</P>: <S>"{c.name}"</S><br />
            <span style={{ paddingLeft: 16 }}><P>issuer</P>: <S>"{c.issuer}"</S></span><br />
            <span style={{ paddingLeft: 16 }}><P>year</P>: <N>{c.year}</N></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomelabNix({ data }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.8 }}>
      <div className="dim" style={{ fontSize: 11 }}># homelab.nix</div>
      <div style={{ marginTop: 10 }}>
        <C>{`# 5 nodes. ~200W idle. all declared.`}</C><br />
        <K>{'{'}</K> pkgs, ... <K>{'}'}</K>: <K>{'{'}</K><br />
        <div style={{ paddingLeft: 16 }}>
          <P>nodes</P> = [<br />
          {data.homelab.nodes.map((n, i) => (
            <div key={n.host} style={{ paddingLeft: 16 }}>
              <K>{'{'}</K> <P>host</P>=<S>"{n.host}"</S>; <P>kind</P>=<S>"{n.kind}"</S>;<br />
              <span style={{ paddingLeft: 22 }}><P>specs</P>=<S>"{n.specs}"</S>;</span><br />
              <span style={{ paddingLeft: 22 }}><P>role</P> =<S>"{n.role}"</S>;</span> <K>{'}'}</K>{i < data.homelab.nodes.length - 1 ? "" : ""}
            </div>
          ))}
          ];<br />
          <P>services</P> = [ {data.homelab.services.map(s => <S key={s}>"{s}" </S>)} ];<br />
        </div>
        <K>{'}'}</K>
      </div>
    </div>
  );
}

function ContactSh({ data }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.9, maxWidth: 560 }}>
      <div className="dim" style={{ fontSize: 11 }}># contact.sh</div>
      <div style={{ marginTop: 10 }}>
        <C>{'#!/usr/bin/env bash'}</C><br />
        <C>{'# low-ceremony ways to reach me'}</C><br /><br />
        {Object.entries(data.contact).map(([k, v]) => (
          <div key={k}>
            <K>export</K> <P>{k.toUpperCase()}</P>=<S>"{v}"</S>
          </div>
        ))}
        <br />
        <K>echo</K> <S>"preferred: email. i read it."</S>
      </div>
    </div>
  );
}

function RightPanel({ data, uptime }) {
  // animated skills cloud
  const allSkills = useMemo2(() => {
    return Object.entries(data.skills).flatMap(([cat, items]) =>
      items.map(name => ({ name, cat }))
    );
  }, [data]);

  const catColor = {
    Cloud: "var(--accent)",
    AI: "#b39cff",
    Security: "#e06c75",
    Languages: "#e5c07b",
    Tools: "#7dc4e0"
  };

  return (
    <div data-v2-right style={{
      borderLeft: "1px solid var(--border)",
      background: "var(--panel)",
      display: "flex", flexDirection: "column",
      overflow: "hidden"
    }}>
      <div className="pane-header">
        <span className="dot g"></span>
        <span>stack.cloud</span>
      </div>
      <div data-cloud style={{ flex: 1, padding: 12, overflow: "hidden" }}>
        <SkillsCloud skills={allSkills} catColor={catColor} />
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="pane-header" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="dot y"></span>
          <span>system</span>
        </div>
        <div style={{ padding: 12, fontSize: 12, lineHeight: 1.8 }}>
          <Row k="host" v="kalle@narhi.dev" />
          <Row k="uptime" v={`${Math.floor(uptime / 60)}m ${uptime % 60}s`} />
          <Row k="cpu" v="1.4% · nominal" />
          <Row k="mem" v="2.1 / 32 GiB" />
          <Row k="net" v={<span><span className="accent">●</span> tailscale up</span>} />
          <Row k="mood" v="curious" />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span className="dim">{k}</span>
      <span>{v}</span>
    </div>
  );
}

function SkillsCloud({ skills, catColor }) {
  // positions computed once
  const positions = useMemo2(() => {
    return skills.map((s, i) => {
      const seed = (s.name.charCodeAt(0) * 13 + s.name.length * 31 + i * 7) % 1000;
      const angle = (seed / 1000) * Math.PI * 2;
      const radius = 30 + ((i * 37) % 60);
      return {
        x: 50 + Math.cos(angle) * (radius * 0.6) + ((i * 11) % 40 - 20),
        y: 50 + Math.sin(angle) * (radius * 0.6) + ((i * 17) % 40 - 20),
        size: 10 + (s.name.length > 6 ? 2 : 0),
        delay: (i * 0.04).toFixed(2)
      };
    });
  }, [skills]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 260 }}>
      <style>{`
        @keyframes float-s {
          0%,100% { transform: translate(-50%,-50%) translateY(0); }
          50% { transform: translate(-50%,-50%) translateY(-4px); }
        }
      `}</style>
      {skills.map((s, i) => {
        const p = positions[i];
        return (
          <span
            key={s.name + i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: p.size,
              color: catColor[s.cat] || "var(--fg-dim)",
              whiteSpace: "nowrap",
              transform: "translate(-50%,-50%)",
              animation: `float-s ${3 + (i % 5) * 0.4}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: 0.9,
              padding: "1px 4px",
              borderRadius: 2,
              background: "color-mix(in oklab, var(--bg) 60%, transparent)"
            }}
          >
            {s.name}
          </span>
        );
      })}
    </div>
  );
}

function StatusBar({ data, active, uptime, theme }) {
  return (
    <div data-v2-status style={{
      display: "flex", alignItems: "center",
      background: "var(--accent)",
      color: "var(--bg)",
      padding: "3px 12px",
      fontSize: 11,
      fontWeight: 600,
      gap: 14,
      flexShrink: 0
    }}>
      <span>[NORMAL]</span>
      <span style={{ opacity: 0.8 }}>{active}</span>
      <span style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
        <span>cloud ● ai ● sec</span>
        <span>{theme}</span>
        <span>{uptime}s</span>
        <span>utf-8</span>
        <span>{data.handle}@narhi.dev</span>
      </span>
    </div>
  );
}

window.V2Tmux = V2Tmux;
