// Shared UI: theme toggle, command palette, terminal boot, variation switcher
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ----------------- THEME -----------------
function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("kn-theme") || "dark";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kn-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}

function ThemeToggle({ theme, setTheme, compact }) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="toggle theme (t)"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        padding: compact ? "3px 8px" : "6px 10px"
      }}
    >
      <span className="accent">{theme === "dark" ? "◐" : "◑"}</span>
      <span className="dim">{theme}</span>
    </button>
  );
}

// ----------------- COMMAND PALETTE -----------------
function CommandPalette({ open, setOpen, commands }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      (c.hint || "").toLowerCase().includes(q) ||
      (c.group || "").toLowerCase().includes(q)
    );
  }, [query, commands]);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); e.preventDefault(); }
      else if (e.key === "ArrowDown") { setSel(s => Math.min(s + 1, filtered.length - 1)); e.preventDefault(); }
      else if (e.key === "ArrowUp") { setSel(s => Math.max(s - 1, 0)); e.preventDefault(); }
      else if (e.key === "Enter") {
        const c = filtered[sel];
        if (c) { c.run(); setOpen(false); }
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, setOpen]);

  if (!open) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "color-mix(in oklab, var(--bg) 70%, transparent)",
        backdropFilter: "blur(3px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="pane"
        style={{ width: 560, maxWidth: "92vw", boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
          <span className="accent">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSel(0); }}
            placeholder="type a command or section…"
            style={{
              flex: 1,
              background: "transparent", border: "none", outline: "none",
              color: "var(--fg)", font: "inherit", fontSize: 14
            }}
          />
          <span className="kbd">esc</span>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto", padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 16, color: "var(--fg-mute)" }}>no matches.</div>
          )}
          {filtered.map((c, i) => (
            <div
              key={c.id}
              onMouseEnter={() => setSel(i)}
              onClick={() => { c.run(); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 3, cursor: "pointer",
                background: i === sel ? "var(--bg-2)" : "transparent",
                borderLeft: i === sel ? "2px solid var(--accent)" : "2px solid transparent"
              }}
            >
              <span style={{ color: "var(--fg-mute)", width: 16, textAlign: "center" }}>{c.icon || "·"}</span>
              <span style={{ color: "var(--fg)" }}>{c.label}</span>
              {c.hint && <span style={{ color: "var(--fg-mute)", fontSize: 11, marginLeft: "auto" }}>{c.hint}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: "6px 12px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--fg-mute)", display: "flex", gap: 12 }}>
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> select</span>
          <span style={{ marginLeft: "auto" }}>kalle/cmd</span>
        </div>
      </div>
    </div>
  );
}

// ----------------- TYPEWRITER -----------------
function useTypewriter(lines, opts = {}) {
  const { speed = 22, startDelay = 120, onDone } = opts;
  const [state, setState] = useState({ lineIdx: 0, charIdx: 0, done: false });

  useEffect(() => {
    if (state.done) return;
    const line = lines[state.lineIdx];
    if (!line) return;
    const textLen = (line.text || "").length;

    let t;
    if (state.lineIdx === 0 && state.charIdx === 0) {
      t = setTimeout(() => setState(s => ({ ...s, charIdx: 1 })), startDelay);
    } else if (state.charIdx < textLen) {
      const delay = line.fast ? 4 : speed;
      t = setTimeout(() => setState(s => ({ ...s, charIdx: s.charIdx + 1 })), delay);
    } else {
      // done with line
      const pause = line.pause ?? 60;
      if (state.lineIdx + 1 < lines.length) {
        t = setTimeout(() => setState(s => ({ lineIdx: s.lineIdx + 1, charIdx: 0, done: false })), pause);
      } else {
        t = setTimeout(() => { setState(s => ({ ...s, done: true })); onDone && onDone(); }, pause);
      }
    }
    return () => clearTimeout(t);
  }, [state, lines]);

  return state;
}

// ----------------- EXPORT -----------------
Object.assign(window, { useTheme, ThemeToggle, CommandPalette, useTypewriter });
