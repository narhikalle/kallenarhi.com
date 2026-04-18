// Variation 1 — Pure Terminal
// A single full-screen terminal. You type commands; it renders sections inline.
const { useState: useState1, useEffect: useEffect1, useRef: useRef1, useMemo: useMemo1 } = React;

function V1Terminal({ data, openPalette, theme, setTheme }) {
  const [history, setHistory] = useState1([]);   // [{prompt, cmd, output}]
  const [input, setInput] = useState1("");
  const [cmdIdx, setCmdIdx] = useState1(-1);
  const [booted, setBooted] = useState1(false);
  const [hoveredProject, setHoveredProject] = useState1(null);
  const scrollRef = useRef1(null);
  const inputRef = useRef1(null);

  // Boot sequence
  const bootLines = [
    { text: "[  OK  ] kalle.dev v2026.4 — systemd analog init" },
    { text: "[  OK  ] mounted /dev/brain" },
    { text: "[  OK  ] loaded module: cloud.ko" },
    { text: "[  OK  ] loaded module: ai.ko" },
    { text: "[  OK  ] loaded module: sec.ko" },
    { text: "[  OK  ] coffee: brewed, hot" },
    { text: "" },
    { text: "welcome — type `help` or press ⌘K." }
  ];
  const boot = useTypewriter(bootLines, { speed: 8, startDelay: 80, onDone: () => setBooted(true) });

  useEffect1(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, boot]);

  useEffect1(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  const commands = useMemo1(() => ({
    help: () => (
      <div>
        <div className="dim">available commands:</div>
        <table style={{ marginTop: 6, borderSpacing: "16px 2px" }}>
          <tbody>
            {[
              ["whoami", "about me"],
              ["skills", "tech stack"],
              ["projects", "things i've built"],
              ["experience", "timeline"],
              ["certs", "certifications"],
              ["homelab", "the rack"],
              ["contact", "say hi"],
              ["theme", "toggle dark/light"],
              ["clear", "clear screen"],
              ["⌘K", "command palette"]
            ].map(([c, d]) => (
              <tr key={c}><td className="accent">{c}</td><td className="dim">{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    whoami: () => (
      <div>
        <div><span className="accent">{data.name}</span> — {data.role}</div>
        <div className="dim">{data.location} · {data.tagline}</div>
        <div style={{ marginTop: 8, maxWidth: 680 }}>
          {data.bio.map((p, i) => <p key={i} style={{ margin: "4px 0" }}>{p}</p>)}
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.focus.map(f => <span key={f} className="chip on">{f}</span>)}
        </div>
      </div>
    ),
    skills: () => (
      <div>
        {Object.entries(data.skills).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 6 }}>
            <span className="accent" style={{ display: "inline-block", width: 110 }}>{group.toLowerCase()}</span>
            <span className="dim">{items.join("  ·  ")}</span>
          </div>
        ))}
      </div>
    ),
    projects: () => (
      <div>
        <div className="dim" style={{ marginBottom: 6 }}>hover a row for details</div>
        <table style={{ width: "100%", maxWidth: 820, borderCollapse: "collapse" }}>
          <tbody>
            {data.projects.map((p, i) => (
              <tr
                key={p.name}
                onMouseEnter={() => setHoveredProject(p.name)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  borderTop: "1px dashed var(--border-2)",
                  background: hoveredProject === p.name ? "var(--bg-2)" : "transparent",
                  transition: "background .1s"
                }}
              >
                <td className="dim" style={{ padding: "6px 10px", width: 54 }}>{p.year}</td>
                <td className="accent" style={{ padding: "6px 10px", width: 160 }}>{p.name}</td>
                <td style={{ padding: "6px 10px" }}>
                  {hoveredProject === p.name ? (
                    <div>
                      <div>{p.summary}</div>
                      <div className="dim" style={{ marginTop: 4, fontSize: 11 }}>
                        stack: {p.stack.join(" · ")} &nbsp;|&nbsp; status: <span className={p.status === "active" ? "accent" : "warn"}>{p.status}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="dim" style={{
                      display: "inline-block", maxWidth: 560,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>{p.summary}</span>
                  )}
                </td>
                <td style={{ padding: "6px 10px", textAlign: "right" }}>
                  {p.tags.map(t => <span key={t} className="tag" style={{ marginLeft: 8, fontSize: 11 }}>{t}</span>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    experience: () => (
      <div>
        {data.experience.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 4 }}>
            <span className="dim" style={{ width: 120, flexShrink: 0 }}>{e.when}</span>
            <span className="accent" style={{ width: 220, flexShrink: 0 }}>{e.where}</span>
            <span className="dim">{e.what}</span>
          </div>
        ))}
      </div>
    ),
    certs: () => (
      <div>
        {data.certs.map((c, i) => (
          <div key={i} style={{ marginBottom: 2 }}>
            <span className="accent">✓</span> {c.name} <span className="dim">— {c.issuer}, {c.year}</span>
          </div>
        ))}
      </div>
    ),
    homelab: () => (
      <div>
        <pre className="ascii-line" style={{ margin: 0, fontSize: 12 }}>{`
  ┌───────── rack @ ${data.location.toLowerCase()} ─────────┐`}</pre>
        {data.homelab.nodes.map(n => (
          <div key={n.host} style={{ display: "flex", gap: 14, padding: "3px 0" }}>
            <span className="accent" style={{ width: 80 }}>{n.host}</span>
            <span className="dim" style={{ width: 120 }}>{n.kind}</span>
            <span className="dim" style={{ width: 240 }}>{n.specs}</span>
            <span>{n.role}</span>
          </div>
        ))}
        <div style={{ marginTop: 8 }} className="dim">
          services: {data.homelab.services.join(" · ")}
        </div>
      </div>
    ),
    contact: () => (
      <div>
        {Object.entries(data.contact).map(([k, v]) => (
          <div key={k}>
            <span className="accent" style={{ display: "inline-block", width: 90 }}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
    ),
    theme: () => {
      setTheme(theme === "dark" ? "light" : "dark");
      return <span className="dim">→ switched to {theme === "dark" ? "light" : "dark"}</span>;
    },
    clear: () => { setHistory([]); return null; },
    "": () => null
  }), [data, hoveredProject, theme, setTheme]);

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "clear") { setHistory([]); return; }
    const fn = commands[cmd];
    let output;
    if (fn) output = fn();
    else output = <span className="err">command not found: {raw} — try `help`</span>;
    setHistory(h => [...h, { cmd: raw, output }]);
    setCmdIdx(-1);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      const cmds = history.map(h => h.cmd).filter(Boolean);
      if (!cmds.length) return;
      const next = cmdIdx < 0 ? cmds.length - 1 : Math.max(0, cmdIdx - 1);
      setCmdIdx(next);
      setInput(cmds[next]);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      const cmds = history.map(h => h.cmd).filter(Boolean);
      if (cmdIdx < 0) return;
      const next = cmdIdx + 1;
      if (next >= cmds.length) { setCmdIdx(-1); setInput(""); }
      else { setCmdIdx(next); setInput(cmds[next]); }
      e.preventDefault();
    }
  };

  return (
    <div
      className="scanlines"
      onClick={() => inputRef.current?.focus()}
      style={{
        height: "100vh",
        background: "var(--bg)",
        padding: "18px 22px",
        overflow: "hidden",
        display: "flex", flexDirection: "column"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <span className="dot r" style={{ width: 10, height: 10, borderRadius: "50%", background: "#e06c75", display: "inline-block" }}></span>
        <span className="dot y" style={{ width: 10, height: 10, borderRadius: "50%", background: "#e5c07b", display: "inline-block" }}></span>
        <span className="dot g" style={{ width: 10, height: 10, borderRadius: "50%", background: "#7dd3a8", display: "inline-block" }}></span>
        <span className="dim" style={{ marginLeft: 10 }}>kalle@narhi.dev: ~/</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={openPalette} style={{ fontSize: 11 }}>
            <span className="dim">⌘K</span> palette
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} compact />
        </span>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", paddingTop: 12 }}>
        {/* boot */}
        {!booted && (
          <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--fg-dim)" }}>
            {bootLines.slice(0, boot.lineIdx).map((l, i) => <div key={i}>{l.text}</div>)}
            <div>{(bootLines[boot.lineIdx]?.text || "").slice(0, boot.charIdx)}<span className="caret"></span></div>
          </pre>
        )}
        {booted && (
          <>
            <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--fg-dim)" }}>
              {bootLines.map((l, i) => <div key={i}>{l.text}</div>)}
            </pre>
            <BigBanner name={data.name} role={data.role} />
            <div className="dim" style={{ marginTop: 4 }}>try: <span className="accent">whoami</span>, <span className="accent">projects</span>, <span className="accent">homelab</span></div>
            <div style={{ height: 14 }} />

            {history.map((h, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div>
                  <span className="accent">kalle@dev</span>
                  <span className="dim">:~$</span>{" "}
                  <span>{h.cmd}</span>
                </div>
                {h.output && <div style={{ marginTop: 4 }}>{h.output}</div>}
              </div>
            ))}

            {/* live input */}
            <div>
              <span className="accent">kalle@dev</span>
              <span className="dim">:~$</span>{" "}
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "var(--fg)", font: "inherit", fontSize: "inherit",
                  width: "60%", caretColor: "var(--accent)"
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BigBanner({ name, role }) {
  // ASCII-style banner using block chars
  const banner = `
╔══════════════════════════════════════════════════════════════════╗
║   K A L L E   N Ä R H I                                          ║
║   cloud · ai · security · tinkering                              ║
╚══════════════════════════════════════════════════════════════════╝`;
  return (
    <pre data-v1-banner className="mono accent" style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.2, whiteSpace: "pre" }}>
      {banner}
    </pre>
  );
}

window.V1Terminal = V1Terminal;
