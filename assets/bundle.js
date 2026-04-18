/* kalle.dev bundle — precompiled */
(function(){
"use strict";

/* === dist/assets/shared.js === */
// Shared UI: theme toggle, command palette, terminal boot, variation switcher
var {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} = React;

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
function ThemeToggle({
  theme,
  setTheme,
  compact
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
    title: "toggle theme (t)",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      padding: compact ? "3px 8px" : "6px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, theme === "dark" ? "◐" : "◑"), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, theme));
}

// ----------------- COMMAND PALETTE -----------------
function CommandPalette({
  open,
  setOpen,
  commands
}) {
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
    return commands.filter(c => c.label.toLowerCase().includes(q) || (c.hint || "").toLowerCase().includes(q) || (c.group || "").toLowerCase().includes(q));
  }, [query, commands]);
  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        setSel(s => Math.min(s + 1, filtered.length - 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSel(s => Math.max(s - 1, 0));
        e.preventDefault();
      } else if (e.key === "Enter") {
        const c = filtered[sel];
        if (c) {
          c.run();
          setOpen(false);
        }
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, setOpen]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "color-mix(in oklab, var(--bg) 70%, transparent)",
      backdropFilter: "blur(3px)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: "12vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "pane",
    style: {
      width: 560,
      maxWidth: "92vw",
      boxShadow: "0 20px 60px rgba(0,0,0,.4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u203A"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setSel(0);
    },
    placeholder: "type a command or section\u2026",
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--fg)",
      font: "inherit",
      fontSize: 14
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "esc")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 320,
      overflowY: "auto",
      padding: 6
    }
  }, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      color: "var(--fg-mute)"
    }
  }, "no matches."), filtered.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onMouseEnter: () => setSel(i),
    onClick: () => {
      c.run();
      setOpen(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 10px",
      borderRadius: 3,
      cursor: "pointer",
      background: i === sel ? "var(--bg-2)" : "transparent",
      borderLeft: i === sel ? "2px solid var(--accent)" : "2px solid transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg-mute)",
      width: 16,
      textAlign: "center"
    }
  }, c.icon || "·"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg)"
    }
  }, c.label), c.hint && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg-mute)",
      fontSize: 11,
      marginLeft: "auto"
    }
  }, c.hint)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 12px",
      borderTop: "1px solid var(--border)",
      fontSize: 11,
      color: "var(--fg-mute)",
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2191\u2193"), " navigate"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u21B5"), " select"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, "kalle/cmd"))));
}

// ----------------- TYPEWRITER -----------------
function useTypewriter(lines, opts = {}) {
  const {
    speed = 22,
    startDelay = 120,
    onDone
  } = opts;
  const [state, setState] = useState({
    lineIdx: 0,
    charIdx: 0,
    done: false
  });
  useEffect(() => {
    if (state.done) return;
    const line = lines[state.lineIdx];
    if (!line) return;
    const textLen = (line.text || "").length;
    let t;
    if (state.lineIdx === 0 && state.charIdx === 0) {
      t = setTimeout(() => setState(s => ({
        ...s,
        charIdx: 1
      })), startDelay);
    } else if (state.charIdx < textLen) {
      const delay = line.fast ? 4 : speed;
      t = setTimeout(() => setState(s => ({
        ...s,
        charIdx: s.charIdx + 1
      })), delay);
    } else {
      // done with line
      const pause = line.pause ?? 60;
      if (state.lineIdx + 1 < lines.length) {
        t = setTimeout(() => setState(s => ({
          lineIdx: s.lineIdx + 1,
          charIdx: 0,
          done: false
        })), pause);
      } else {
        t = setTimeout(() => {
          setState(s => ({
            ...s,
            done: true
          }));
          onDone && onDone();
        }, pause);
      }
    }
    return () => clearTimeout(t);
  }, [state, lines]);
  return state;
}

// ----------------- EXPORT -----------------
Object.assign(window, {
  useTheme,
  ThemeToggle,
  CommandPalette,
  useTypewriter
});

/* === dist/assets/v1_terminal.js === */
// Variation 1 — Pure Terminal
// A single full-screen terminal. You type commands; it renders sections inline.
var {
  useState: useState1,
  useEffect: useEffect1,
  useRef: useRef1,
  useMemo: useMemo1
} = React;
function V1Terminal({
  data,
  openPalette,
  theme,
  setTheme
}) {
  const [history, setHistory] = useState1([]); // [{prompt, cmd, output}]
  const [input, setInput] = useState1("");
  const [cmdIdx, setCmdIdx] = useState1(-1);
  const [booted, setBooted] = useState1(false);
  const [hoveredProject, setHoveredProject] = useState1(null);
  const scrollRef = useRef1(null);
  const inputRef = useRef1(null);

  // Boot sequence
  const bootLines = [{
    text: "[  OK  ] kalle.dev v2026.4 — systemd analog init"
  }, {
    text: "[  OK  ] mounted /dev/brain"
  }, {
    text: "[  OK  ] loaded module: cloud.ko"
  }, {
    text: "[  OK  ] loaded module: ai.ko"
  }, {
    text: "[  OK  ] loaded module: sec.ko"
  }, {
    text: "[  OK  ] coffee: brewed, hot"
  }, {
    text: ""
  }, {
    text: "welcome — type `help` or press ⌘K."
  }];
  const boot = useTypewriter(bootLines, {
    speed: 8,
    startDelay: 80,
    onDone: () => setBooted(true)
  });
  useEffect1(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, boot]);
  useEffect1(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);
  const commands = useMemo1(() => ({
    help: () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "dim"
    }, "available commands:"), /*#__PURE__*/React.createElement("table", {
      style: {
        marginTop: 6,
        borderSpacing: "16px 2px"
      }
    }, /*#__PURE__*/React.createElement("tbody", null, [["whoami", "about me"], ["skills", "tech stack"], ["projects", "things i've built"], ["experience", "timeline"], ["certs", "certifications"], ["homelab", "the rack"], ["contact", "say hi"], ["theme", "toggle dark/light"], ["clear", "clear screen"], ["⌘K", "command palette"]].map(([c, d]) => /*#__PURE__*/React.createElement("tr", {
      key: c
    }, /*#__PURE__*/React.createElement("td", {
      className: "accent"
    }, c), /*#__PURE__*/React.createElement("td", {
      className: "dim"
    }, d)))))),
    whoami: () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "accent"
    }, data.name), " \u2014 ", data.role), /*#__PURE__*/React.createElement("div", {
      className: "dim"
    }, data.location, " \xB7 ", data.tagline), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        maxWidth: 680
      }
    }, data.bio.map((p, i) => /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        margin: "4px 0"
      }
    }, p))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }
    }, data.focus.map(f => /*#__PURE__*/React.createElement("span", {
      key: f,
      className: "chip on"
    }, f)))),
    skills: () => /*#__PURE__*/React.createElement("div", null, Object.entries(data.skills).map(([group, items]) => /*#__PURE__*/React.createElement("div", {
      key: group,
      style: {
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "accent",
      style: {
        display: "inline-block",
        width: 110
      }
    }, group.toLowerCase()), /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, items.join("  ·  "))))),
    projects: () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "dim",
      style: {
        marginBottom: 6
      }
    }, "hover a row for details"), /*#__PURE__*/React.createElement("table", {
      style: {
        width: "100%",
        maxWidth: 820,
        borderCollapse: "collapse"
      }
    }, /*#__PURE__*/React.createElement("tbody", null, data.projects.map((p, i) => /*#__PURE__*/React.createElement("tr", {
      key: p.name,
      onMouseEnter: () => setHoveredProject(p.name),
      onMouseLeave: () => setHoveredProject(null),
      style: {
        borderTop: "1px dashed var(--border-2)",
        background: hoveredProject === p.name ? "var(--bg-2)" : "transparent",
        transition: "background .1s"
      }
    }, /*#__PURE__*/React.createElement("td", {
      className: "dim",
      style: {
        padding: "6px 10px",
        width: 54
      }
    }, p.year), /*#__PURE__*/React.createElement("td", {
      className: "accent",
      style: {
        padding: "6px 10px",
        width: 160
      }
    }, p.name), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 10px"
      }
    }, hoveredProject === p.name ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, p.summary), /*#__PURE__*/React.createElement("div", {
      className: "dim",
      style: {
        marginTop: 4,
        fontSize: 11
      }
    }, "stack: ", p.stack.join(" · "), " \xA0|\xA0 status: ", /*#__PURE__*/React.createElement("span", {
      className: p.status === "active" ? "accent" : "warn"
    }, p.status))) : /*#__PURE__*/React.createElement("span", {
      className: "dim",
      style: {
        display: "inline-block",
        maxWidth: 560,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, p.summary)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "6px 10px",
        textAlign: "right"
      }
    }, p.tags.map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      className: "tag",
      style: {
        marginLeft: 8,
        fontSize: 11
      }
    }, t)))))))),
    experience: () => /*#__PURE__*/React.createElement("div", null, data.experience.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 16,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dim",
      style: {
        width: 120,
        flexShrink: 0
      }
    }, e.when), /*#__PURE__*/React.createElement("span", {
      className: "accent",
      style: {
        width: 220,
        flexShrink: 0
      }
    }, e.where), /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, e.what)))),
    certs: () => /*#__PURE__*/React.createElement("div", null, data.certs.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginBottom: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "accent"
    }, "\u2713"), " ", c.name, " ", /*#__PURE__*/React.createElement("span", {
      className: "dim"
    }, "\u2014 ", c.issuer, ", ", c.year)))),
    homelab: () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("pre", {
      className: "ascii-line",
      style: {
        margin: 0,
        fontSize: 12
      }
    }, `
  ┌───────── rack @ ${data.location.toLowerCase()} ─────────┐`), data.homelab.nodes.map(n => /*#__PURE__*/React.createElement("div", {
      key: n.host,
      style: {
        display: "flex",
        gap: 14,
        padding: "3px 0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "accent",
      style: {
        width: 80
      }
    }, n.host), /*#__PURE__*/React.createElement("span", {
      className: "dim",
      style: {
        width: 120
      }
    }, n.kind), /*#__PURE__*/React.createElement("span", {
      className: "dim",
      style: {
        width: 240
      }
    }, n.specs), /*#__PURE__*/React.createElement("span", null, n.role))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      },
      className: "dim"
    }, "services: ", data.homelab.services.join(" · "))),
    contact: () => /*#__PURE__*/React.createElement("div", null, Object.entries(data.contact).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("span", {
      className: "accent",
      style: {
        display: "inline-block",
        width: 90
      }
    }, k), /*#__PURE__*/React.createElement("span", null, v)))),
    theme: () => {
      setTheme(theme === "dark" ? "light" : "dark");
      return /*#__PURE__*/React.createElement("span", {
        className: "dim"
      }, "\u2192 switched to ", theme === "dark" ? "light" : "dark");
    },
    clear: () => {
      setHistory([]);
      return null;
    },
    "": () => null
  }), [data, hoveredProject, theme, setTheme]);
  const runCommand = raw => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    const fn = commands[cmd];
    let output;
    if (fn) output = fn();else output = /*#__PURE__*/React.createElement("span", {
      className: "err"
    }, "command not found: ", raw, " \u2014 try `help`");
    setHistory(h => [...h, {
      cmd: raw,
      output
    }]);
    setCmdIdx(-1);
  };
  const handleKey = e => {
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
      if (next >= cmds.length) {
        setCmdIdx(-1);
        setInput("");
      } else {
        setCmdIdx(next);
        setInput(cmds[next]);
      }
      e.preventDefault();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "scanlines",
    onClick: () => inputRef.current?.focus(),
    style: {
      height: "100vh",
      background: "var(--bg)",
      padding: "18px 22px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingBottom: 8,
      borderBottom: "1px solid var(--border)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot r",
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#e06c75",
      display: "inline-block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot y",
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#e5c07b",
      display: "inline-block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dot g",
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#7dd3a8",
      display: "inline-block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      marginLeft: 10
    }
  }, "kalle@narhi.dev: ~/"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: openPalette,
    style: {
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "\u2318K"), " palette"), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme,
    compact: true
  }))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      overflowY: "auto",
      paddingTop: 12
    }
  }, !booted && /*#__PURE__*/React.createElement("pre", {
    className: "mono",
    style: {
      margin: 0,
      whiteSpace: "pre-wrap",
      color: "var(--fg-dim)"
    }
  }, bootLines.slice(0, boot.lineIdx).map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l.text)), /*#__PURE__*/React.createElement("div", null, (bootLines[boot.lineIdx]?.text || "").slice(0, boot.charIdx), /*#__PURE__*/React.createElement("span", {
    className: "caret"
  }))), booted && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("pre", {
    className: "mono",
    style: {
      margin: 0,
      whiteSpace: "pre-wrap",
      color: "var(--fg-dim)"
    }
  }, bootLines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l.text))), /*#__PURE__*/React.createElement(BigBanner, {
    name: data.name,
    role: data.role
  }), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      marginTop: 4
    }
  }, "try: ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "whoami"), ", ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "projects"), ", ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "homelab")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 14
    }
  }), history.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "kalle@dev"), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, ":~$"), " ", /*#__PURE__*/React.createElement("span", null, h.cmd)), h.output && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, h.output))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "kalle@dev"), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, ":~$"), " ", /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: handleKey,
    autoFocus: true,
    style: {
      background: "transparent",
      border: "none",
      outline: "none",
      color: "var(--fg)",
      font: "inherit",
      fontSize: "inherit",
      width: "60%",
      caretColor: "var(--accent)"
    }
  })))));
}
function BigBanner({
  name,
  role
}) {
  // ASCII-style banner using block chars
  const banner = `
╔══════════════════════════════════════════════════════════════════╗
║   K A L L E   N Ä R H I                                          ║
║   cloud · ai · security · tinkering                              ║
╚══════════════════════════════════════════════════════════════════╝`;
  return /*#__PURE__*/React.createElement("pre", {
    className: "mono accent",
    style: {
      margin: "12px 0 0",
      fontSize: 12,
      lineHeight: 1.2,
      whiteSpace: "pre"
    }
  }, banner);
}
window.V1Terminal = V1Terminal;

/* === dist/assets/v2_tmux.js === */
// Variation 2 — tmux split panes / IDE layout
// Left: file tree (sections). Center: content pane. Right: skills cloud + status.
// Bottom: status bar. Top: tmux-style tab bar.
var {
  useState: useState2,
  useEffect: useEffect2,
  useRef: useRef2,
  useMemo: useMemo2
} = React;
function V2Tmux({
  data,
  openPalette,
  theme,
  setTheme
}) {
  const [active, setActive] = useState2("about.md");
  const [uptime, setUptime] = useState2(0);
  const [hoveredProject, setHoveredProject] = useState2(null);
  useEffect2(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const files = [{
    id: "about.md",
    icon: "●",
    label: "about.md",
    group: "~/kalle"
  }, {
    id: "skills.json",
    icon: "◆",
    label: "skills.json",
    group: "~/kalle"
  }, {
    id: "projects/",
    icon: "▸",
    label: "projects/",
    group: "~/kalle"
  }, {
    id: "experience.log",
    icon: "▤",
    label: "experience.log",
    group: "~/kalle"
  }, {
    id: "certs.yml",
    icon: "✓",
    label: "certs.yml",
    group: "~/kalle"
  }, {
    id: "homelab.nix",
    icon: "◉",
    label: "homelab.nix",
    group: "~/kalle"
  }, {
    id: "contact.sh",
    icon: "✉",
    label: "contact.sh",
    group: "~/kalle"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(TmuxTabs, {
    active: active,
    setActive: setActive,
    files: files,
    openPalette: openPalette,
    theme: theme,
    setTheme: setTheme,
    data: data
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "220px 1fr 280px",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(LeftTree, {
    files: files,
    active: active,
    setActive: setActive
  }), /*#__PURE__*/React.createElement(CenterPane, {
    active: active,
    data: data,
    hoveredProject: hoveredProject,
    setHoveredProject: setHoveredProject
  }), /*#__PURE__*/React.createElement(RightPanel, {
    data: data,
    uptime: uptime
  })), /*#__PURE__*/React.createElement(StatusBar, {
    data: data,
    active: active,
    uptime: uptime,
    theme: theme
  }));
}
function TmuxTabs({
  active,
  setActive,
  files,
  openPalette,
  theme,
  setTheme,
  data
}) {
  const tabs = ["about.md", "projects/", "homelab.nix"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "6px 10px",
      background: "var(--bg-2)",
      borderBottom: "1px solid var(--border)",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      fontWeight: 600
    }
  }, "[", data.handle, "]"), /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      marginRight: 6
    }
  }, "0:"), tabs.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setActive(t),
    style: {
      padding: "2px 10px",
      background: active === t ? "var(--accent)" : "var(--bg-3)",
      color: active === t ? "var(--bg)" : "var(--fg-dim)",
      border: "none",
      borderRadius: 2,
      fontSize: 12
    }
  }, i, ":", t)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: openPalette,
    style: {
      fontSize: 11,
      padding: "3px 8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "\u2318K")), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme,
    compact: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, new Date().toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  }))));
}
function LeftTree({
  files,
  active,
  setActive
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: "1px solid var(--border)",
      background: "var(--panel)",
      overflowY: "auto",
      padding: "12px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      padding: "0 14px 6px",
      fontSize: 11,
      letterSpacing: 1
    }
  }, "EXPLORER"), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      padding: "4px 14px",
      fontSize: 12
    }
  }, "\u25BE ~/kalle"), files.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    onClick: () => setActive(f.id),
    style: {
      padding: "4px 14px 4px 28px",
      fontSize: 13,
      cursor: "pointer",
      background: active === f.id ? "var(--sel)" : "transparent",
      borderLeft: active === f.id ? "2px solid var(--accent)" : "2px solid transparent",
      color: active === f.id ? "var(--fg)" : "var(--fg-dim)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      marginRight: 8,
      display: "inline-block",
      width: 10
    }
  }, f.icon), f.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px dashed var(--border-2)",
      margin: "14px 14px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      padding: "0 14px",
      fontSize: 11,
      letterSpacing: 1
    }
  }, "OUTLINE"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 14px",
      fontSize: 12
    },
    className: "dim"
  }, /*#__PURE__*/React.createElement("div", null, "\u2514\u2500 ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "$"), " whoami"), /*#__PURE__*/React.createElement("div", null, "\u2514\u2500 ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "$"), " stack"), /*#__PURE__*/React.createElement("div", null, "\u2514\u2500 ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "$"), " building"), /*#__PURE__*/React.createElement("div", null, "\u2514\u2500 ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "$"), " reach out")));
}
function CenterPane({
  active,
  data,
  hoveredProject,
  setHoveredProject
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      padding: "0",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "42px 1fr",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRight: "1px solid var(--border)",
      background: "var(--bg)",
      padding: "18px 0",
      textAlign: "right",
      color: "var(--fg-mute)",
      fontSize: 11,
      userSelect: "none",
      paddingRight: 10
    }
  }, Array.from({
    length: 60
  }, (_, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, i + 1))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 28px"
    }
  }, active === "about.md" && /*#__PURE__*/React.createElement(AboutMd, {
    data: data
  }), active === "skills.json" && /*#__PURE__*/React.createElement(SkillsJson, {
    data: data
  }), active === "projects/" && /*#__PURE__*/React.createElement(ProjectsPane, {
    data: data,
    hovered: hoveredProject,
    setHovered: setHoveredProject
  }), active === "experience.log" && /*#__PURE__*/React.createElement(ExperienceLog, {
    data: data
  }), active === "certs.yml" && /*#__PURE__*/React.createElement(CertsYml, {
    data: data
  }), active === "homelab.nix" && /*#__PURE__*/React.createElement(HomelabNix, {
    data: data
  }), active === "contact.sh" && /*#__PURE__*/React.createElement(ContactSh, {
    data: data
  }))));
}

// Token helpers
const K = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--err)"
  }
}, children); // keyword
const S = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--accent)"
  }
}, children); // string
const N = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--warn)"
  }
}, children); // number
const C = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--fg-mute)"
  }
}, children); // comment
const P = ({
  children
}) => /*#__PURE__*/React.createElement("span", {
  style: {
    color: "var(--fg-dim)"
  }
}, children); // property

function AboutMd({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# about.md"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "14px 0 4px",
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: -0.5
    }
  }, data.name, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, ".")), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 15,
      marginBottom: 18
    }
  }, data.role, " \xB7 ", /*#__PURE__*/React.createElement("span", null, data.location)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--fg)",
      maxWidth: 640
    }
  }, data.tagline), data.bio.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      fontSize: 14,
      color: "var(--fg-dim)",
      maxWidth: 640
    }
  }, p)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, data.focus.map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    className: "chip on"
  }, f))), /*#__PURE__*/React.createElement("hr", {
    className: "hr-dashed"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, "## current"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u25B8"), " shipping vault-sentry v0.3", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u25B8"), " learning Rust, slowly", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u25B8"), " benchmarking local LLMs on the GPU node")));
}
function SkillsJson({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# skills.json"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "{"), Object.entries(data.skills).map(([group, items], i, arr) => /*#__PURE__*/React.createElement("div", {
    key: group,
    style: {
      paddingLeft: 20
    }
  }, /*#__PURE__*/React.createElement(P, null, "\"", group.toLowerCase(), "\""), ": [", /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 20
    }
  }, items.map((s, j) => /*#__PURE__*/React.createElement("span", {
    key: s
  }, /*#__PURE__*/React.createElement(S, null, "\"", s, "\""), j < items.length - 1 ? ", " : "", (j + 1) % 4 === 0 && j < items.length - 1 ? /*#__PURE__*/React.createElement("br", null) : null))), "]", i < arr.length - 1 ? "," : "")), /*#__PURE__*/React.createElement("span", null, "}")));
}
function ProjectsPane({
  data,
  hovered,
  setHovered
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# projects/"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "grid",
      gap: 8
    }
  }, data.projects.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    onMouseEnter: () => setHovered(p.name),
    onMouseLeave: () => setHovered(null),
    style: {
      border: "1px solid var(--border)",
      borderLeft: hovered === p.name ? "2px solid var(--accent)" : "2px solid var(--border)",
      borderRadius: 4,
      padding: "12px 14px",
      background: hovered === p.name ? "var(--bg-2)" : "var(--panel)",
      transition: "all .15s",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, p.year), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      padding: "1px 6px",
      borderRadius: 2,
      color: p.status === "active" ? "var(--accent)" : "var(--fg-mute)",
      border: "1px solid currentColor"
    }
  }, p.status), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 11
    }
  }, p.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "tag",
    style: {
      marginLeft: 8
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      color: "var(--fg)"
    }
  }, p.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: hovered === p.name ? 10 : 0,
      maxHeight: hovered === p.name ? 40 : 0,
      overflow: "hidden",
      transition: "all .2s",
      fontSize: 11,
      color: "var(--fg-mute)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "$ cat stack.txt > "), p.stack.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "accent"
  }, s, i < p.stack.length - 1 ? " · " : "")))))));
}
function ExperienceLog({
  data
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# experience.log"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: "inherit"
    }
  }, data.experience.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 14,
      padding: "10px 0",
      borderBottom: "1px dashed var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      width: 120,
      flexShrink: 0,
      fontSize: 12
    }
  }, "[", e.when, "]"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "accent",
    style: {
      fontWeight: 600
    }
  }, e.where), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 13
    }
  }, e.what))))));
}
function CertsYml({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# certs.yml"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(P, null, "certifications"), ":", data.certs.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      paddingLeft: 16
    }
  }, "- ", /*#__PURE__*/React.createElement(P, null, "name"), ": ", /*#__PURE__*/React.createElement(S, null, "\"", c.name, "\""), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(P, null, "issuer"), ": ", /*#__PURE__*/React.createElement(S, null, "\"", c.issuer, "\"")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(P, null, "year"), ": ", /*#__PURE__*/React.createElement(N, null, c.year))))));
}
function HomelabNix({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# homelab.nix"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(C, null, `# 5 nodes. ~200W idle. all declared.`), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(K, null, '{'), " pkgs, ... ", /*#__PURE__*/React.createElement(K, null, '}'), ": ", /*#__PURE__*/React.createElement(K, null, '{'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(P, null, "nodes"), " = [", /*#__PURE__*/React.createElement("br", null), data.homelab.nodes.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n.host,
    style: {
      paddingLeft: 16
    }
  }, /*#__PURE__*/React.createElement(K, null, '{'), " ", /*#__PURE__*/React.createElement(P, null, "host"), "=", /*#__PURE__*/React.createElement(S, null, "\"", n.host, "\""), "; ", /*#__PURE__*/React.createElement(P, null, "kind"), "=", /*#__PURE__*/React.createElement(S, null, "\"", n.kind, "\""), ";", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 22
    }
  }, /*#__PURE__*/React.createElement(P, null, "specs"), "=", /*#__PURE__*/React.createElement(S, null, "\"", n.specs, "\""), ";"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 22
    }
  }, /*#__PURE__*/React.createElement(P, null, "role"), " =", /*#__PURE__*/React.createElement(S, null, "\"", n.role, "\""), ";"), " ", /*#__PURE__*/React.createElement(K, null, '}'), i < data.homelab.nodes.length - 1 ? "" : "")), "];", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(P, null, "services"), " = [ ", data.homelab.services.map(s => /*#__PURE__*/React.createElement(S, {
    key: s
  }, "\"", s, "\" ")), " ];", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement(K, null, '}')));
}
function ContactSh({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.9,
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, "# contact.sh"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(C, null, '#!/usr/bin/env bash'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(C, null, '# low-ceremony ways to reach me'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), Object.entries(data.contact).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement(K, null, "export"), " ", /*#__PURE__*/React.createElement(P, null, k.toUpperCase()), "=", /*#__PURE__*/React.createElement(S, null, "\"", v, "\""))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(K, null, "echo"), " ", /*#__PURE__*/React.createElement(S, null, "\"preferred: email. i read it.\"")));
}
function RightPanel({
  data,
  uptime
}) {
  // animated skills cloud
  const allSkills = useMemo2(() => {
    return Object.entries(data.skills).flatMap(([cat, items]) => items.map(name => ({
      name,
      cat
    })));
  }, [data]);
  const catColor = {
    Cloud: "var(--accent)",
    AI: "#b39cff",
    Security: "#e06c75",
    Languages: "#e5c07b",
    Tools: "#7dc4e0"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid var(--border)",
      background: "var(--panel)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pane-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot g"
  }), /*#__PURE__*/React.createElement("span", null, "stack.cloud")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(SkillsCloud, {
    skills: allSkills,
    catColor: catColor
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pane-header",
    style: {
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot y"
  }), /*#__PURE__*/React.createElement("span", null, "system")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      fontSize: 12,
      lineHeight: 1.8
    }
  }, /*#__PURE__*/React.createElement(Row, {
    k: "host",
    v: "kalle@narhi.dev"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "uptime",
    v: `${Math.floor(uptime / 60)}m ${uptime % 60}s`
  }), /*#__PURE__*/React.createElement(Row, {
    k: "cpu",
    v: "1.4% \xB7 nominal"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "mem",
    v: "2.1 / 32 GiB"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "net",
    v: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "accent"
    }, "\u25CF"), " tailscale up")
  }), /*#__PURE__*/React.createElement(Row, {
    k: "mood",
    v: "curious"
  }))));
}
function Row({
  k,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, k), /*#__PURE__*/React.createElement("span", null, v));
}
function SkillsCloud({
  skills,
  catColor
}) {
  // positions computed once
  const positions = useMemo2(() => {
    return skills.map((s, i) => {
      const seed = (s.name.charCodeAt(0) * 13 + s.name.length * 31 + i * 7) % 1000;
      const angle = seed / 1000 * Math.PI * 2;
      const radius = 30 + i * 37 % 60;
      return {
        x: 50 + Math.cos(angle) * (radius * 0.6) + (i * 11 % 40 - 20),
        y: 50 + Math.sin(angle) * (radius * 0.6) + (i * 17 % 40 - 20),
        size: 10 + (s.name.length > 6 ? 2 : 0),
        delay: (i * 0.04).toFixed(2)
      };
    });
  }, [skills]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: 260
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @keyframes float-s {
          0%,100% { transform: translate(-50%,-50%) translateY(0); }
          50% { transform: translate(-50%,-50%) translateY(-4px); }
        }
      `), skills.map((s, i) => {
    const p = positions[i];
    return /*#__PURE__*/React.createElement("span", {
      key: s.name + i,
      style: {
        position: "absolute",
        left: `${p.x}%`,
        top: `${p.y}%`,
        fontSize: p.size,
        color: catColor[s.cat] || "var(--fg-dim)",
        whiteSpace: "nowrap",
        transform: "translate(-50%,-50%)",
        animation: `float-s ${3 + i % 5 * 0.4}s ease-in-out infinite`,
        animationDelay: `${p.delay}s`,
        opacity: 0.9,
        padding: "1px 4px",
        borderRadius: 2,
        background: "color-mix(in oklab, var(--bg) 60%, transparent)"
      }
    }, s.name);
  }));
}
function StatusBar({
  data,
  active,
  uptime,
  theme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      background: "var(--accent)",
      color: "var(--bg)",
      padding: "3px 12px",
      fontSize: 11,
      fontWeight: 600,
      gap: 14,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", null, "[NORMAL]"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.8
    }
  }, active), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, "cloud \u25CF ai \u25CF sec"), /*#__PURE__*/React.createElement("span", null, theme), /*#__PURE__*/React.createElement("span", null, uptime, "s"), /*#__PURE__*/React.createElement("span", null, "utf-8"), /*#__PURE__*/React.createElement("span", null, data.handle, "@narhi.dev")));
}
window.V2Tmux = V2Tmux;

/* === dist/assets/v3_editorial.js === */
// Variation 3 — Editorial hacker (mono + grid + motion)
// Big typographic hero, engineered grid, hover-reveal project cards,
// animated skills matrix.
var {
  useState: useState3,
  useEffect: useEffect3,
  useRef: useRef3,
  useMemo: useMemo3
} = React;
function V3Editorial({
  data,
  openPalette,
  theme,
  setTheme
}) {
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--bg)",
      overflowX: "hidden"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    openPalette: openPalette,
    theme: theme,
    setTheme: setTheme,
    data: data
  }), /*#__PURE__*/React.createElement(Grid, {
    data: data,
    typed: typed
  }));
}
function TopBar({
  openPalette,
  theme,
  setTheme,
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      background: "color-mix(in oklab, var(--bg) 88%, transparent)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "10px 28px",
      gap: 18,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      fontWeight: 700,
      letterSpacing: 1
    }
  }, "K.N/"), /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, "cloud \xB7 ai \xB7 security"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 18,
      marginLeft: 24
    }
  }, ["about", "stack", "work", "lab", "contact"].map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    href: `#${s}`,
    className: "dim",
    style: {
      textTransform: "lowercase"
    }
  }, "/", s))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim"
  }, data.location.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u25CF"), /*#__PURE__*/React.createElement("button", {
    onClick: openPalette,
    style: {
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318"), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "K")), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme,
    compact: true
  })));
}
function Grid({
  data,
  typed
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "36px 28px 80px",
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("section", {
    id: "about",
    style: {
      gridColumn: "1 / -1",
      position: "relative",
      padding: "40px 0 16px"
    }
  }, /*#__PURE__*/React.createElement(GridLines, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "end",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11,
      letterSpacing: 3,
      marginBottom: 14
    }
  }, "\u25B8 CLOUD-ENGINEER \xB7 EST. 2017 \xB7 ", data.location.toUpperCase()), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "clamp(48px, 8vw, 120px)",
      lineHeight: 0.92,
      fontWeight: 700,
      letterSpacing: -2,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    }
  }, "KALLE", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--fg-dim)"
    }
  }, "N\xC4RHI"), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "_"))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim mono",
    style: {
      fontSize: 11,
      marginBottom: 4
    }
  }, "ssh kalle@kallenarhi.com"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11
    }
  }, "> ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "~/kalle.dev"), /*#__PURE__*/React.createElement("br", null), "> ", "ver 2026.04 \xB7 build stable"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30,
      display: "grid",
      gridTemplateColumns: "minmax(0,2fr) 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "clamp(18px, 2vw, 24px)",
      lineHeight: 1.4,
      margin: 0,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "$"), " ", typed, /*#__PURE__*/React.createElement("span", {
    className: "caret"
  })), /*#__PURE__*/React.createElement("p", {
    className: "dim",
    style: {
      marginTop: 22,
      maxWidth: 640,
      fontSize: 14
    }
  }, data.bio[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11
    },
    className: "dim"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    n: "2",
    l: "projects in flight"
  }), /*#__PURE__*/React.createElement(Stat, {
    n: "9y",
    l: "in production"
  }), /*#__PURE__*/React.createElement(Stat, {
    n: "1",
    l: "certifications"
  }), /*#__PURE__*/React.createElement(Stat, {
    n: "2",
    l: "nodes racked"
  }))))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("section", {
    id: "stack",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "01",
    title: "the stack",
    sub: "what i reach for"
  }), /*#__PURE__*/React.createElement(StackMatrix, {
    skills: data.skills
  })), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("section", {
    id: "work",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "02",
    title: "selected work",
    sub: "6 of n \xB7 hover for stack"
  }), /*#__PURE__*/React.createElement(ProjectGrid, {
    projects: data.projects
  })), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("section", {
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "03",
    title: "timeline",
    sub: "how i got here"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "140px 1fr",
      gap: 0
    }
  }, data.experience.map((e, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono dim",
    style: {
      fontSize: 12,
      padding: "14px 0",
      borderTop: "1px solid var(--border)"
    }
  }, e.when), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 0",
      borderTop: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, e.where), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 13
    }
  }, e.what)))))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("section", {
    id: "lab",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "04",
    title: "the lab",
    sub: "5 nodes, one config repo"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(RackDiagram, {
    nodes: data.homelab.nodes
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dim mono",
    style: {
      fontSize: 11,
      marginBottom: 12
    }
  }, "## services"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, data.homelab.services.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    className: "chip"
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dim mono",
    style: {
      fontSize: 11,
      marginBottom: 12
    }
  }, "## certifications"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, data.certs.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      padding: "6px 0",
      borderBottom: "1px dashed var(--border-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "dim",
    style: {
      fontSize: 12
    }
  }, c.issuer, " \xB7 ", c.year)))))))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      gridColumn: "1 / -1"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    num: "05",
    title: "get in touch",
    sub: "low ceremony, high signal"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 28,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "clamp(28px, 4vw, 44px)",
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: -0.5
    }
  }, "say something", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, ".")), /*#__PURE__*/React.createElement("p", {
    className: "dim",
    style: {
      maxWidth: 460,
      marginTop: 12
    }
  }, "email works best \u2014 i actually read it. if it's about a project or a weird idea, even better.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 4
    }
  }, Object.entries(data.contact).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      padding: "10px 0",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dim mono",
    style: {
      width: 90,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 1
    }
  }, k), /*#__PURE__*/React.createElement("span", null, v), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    },
    className: "accent"
  }, "\u2192"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 64,
      display: "flex",
      justifyContent: "space-between",
      color: "var(--fg-mute)",
      fontSize: 11
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 kalle n\xE4rhi \xB7 hand-typed in neovim"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "last-built: ", new Date().toISOString().slice(0, 10)))));
}
function Stat({
  n,
  l
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: "1px solid var(--border-2)",
      paddingLeft: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "accent mono",
    style: {
      fontSize: 22,
      fontWeight: 600
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase"
    }
  }, l));
}
function Rule() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      position: "relative",
      padding: "32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px dashed var(--border-2)"
    }
  }));
}
function SectionHead({
  num,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 18,
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono dim",
    style: {
      fontSize: 12
    }
  }, "\xA7", num), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "clamp(22px, 3vw, 32px)",
      fontWeight: 600,
      letterSpacing: -0.5
    }
  }, title, /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, ".")), /*#__PURE__*/React.createElement("span", {
    className: "dim mono",
    style: {
      fontSize: 11,
      marginLeft: "auto"
    }
  }, sub));
}
function GridLines() {
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px)",
      backgroundSize: "calc(100%/12) 100%",
      opacity: 0.35,
      pointerEvents: "none"
    }
  });
}
function StackMatrix({
  skills
}) {
  const [hover, setHover] = useState3(null);
  const cats = Object.entries(skills);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 1,
      background: "var(--border)",
      border: "1px solid var(--border)"
    }
  }, cats.map(([cat, items], i) => /*#__PURE__*/React.createElement("div", {
    key: cat,
    style: {
      background: "var(--bg)",
      padding: 16,
      minHeight: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono dim",
    style: {
      fontSize: 10,
      letterSpacing: 2,
      marginBottom: 10
    }
  }, "0", i + 1, " \xB7 ", cat.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4
    }
  }, items.map((s, j) => /*#__PURE__*/React.createElement("span", {
    key: s,
    onMouseEnter: () => setHover(s),
    onMouseLeave: () => setHover(null),
    style: {
      display: "inline-block",
      padding: "3px 8px",
      fontSize: 12,
      cursor: "default",
      background: hover === s ? "var(--accent)" : "var(--bg-2)",
      color: hover === s ? "var(--bg)" : "var(--fg)",
      borderRadius: 2,
      transition: "all .12s",
      transform: hover === s ? "translateY(-1px)" : "none"
    }
  }, s))))));
}
function ProjectGrid({
  projects
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 1,
      background: "var(--border)",
      border: "1px solid var(--border)"
    }
  }, projects.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
    key: p.name,
    p: p,
    idx: i
  })));
}
function ProjectCard({
  p,
  idx
}) {
  const [hover, setHover] = useState3(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: hover ? "var(--bg-2)" : "var(--bg)",
      padding: 20,
      minHeight: 230,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      cursor: "pointer",
      transition: "background .15s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono dim",
    style: {
      fontSize: 11
    }
  }, String(idx + 1).padStart(2, "0"), "/"), /*#__PURE__*/React.createElement("span", {
    className: "mono dim",
    style: {
      fontSize: 11
    }
  }, p.year)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: -0.3,
      marginBottom: 8
    }
  }, p.name, /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      marginLeft: 6,
      opacity: hover ? 1 : 0,
      transition: "opacity .15s"
    }
  }, "\u2197")), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      flex: 1
    }
  }, p.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      opacity: hover ? 1 : 0.4,
      transition: "opacity .15s",
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, p.stack.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontSize: 10,
      padding: "2px 6px",
      border: "1px solid var(--border-2)",
      color: hover ? "var(--accent)" : "var(--fg-mute)",
      borderRadius: 2
    }
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: 2,
      width: hover ? "100%" : "0%",
      background: "var(--accent)",
      transition: "width .3s"
    }
  }));
}
function RackDiagram({
  nodes
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border)",
      borderRadius: 4,
      overflow: "hidden",
      background: "var(--panel)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 12px",
      borderBottom: "1px solid var(--border)",
      fontSize: 11
    },
    className: "dim mono"
  }, "RACK-01 \xB7 4U \xB7 ~200W idle"), /*#__PURE__*/React.createElement("div", null, nodes.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n.host,
    style: {
      display: "grid",
      gridTemplateColumns: "24px 90px 1fr 12px",
      alignItems: "center",
      padding: "14px 12px",
      borderBottom: i < nodes.length - 1 ? "1px dashed var(--border-2)" : "none",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono dim",
    style: {
      fontSize: 10
    }
  }, "U", nodes.length - i), /*#__PURE__*/React.createElement("span", {
    className: "accent mono",
    style: {
      fontSize: 13
    }
  }, n.host), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, n.role), /*#__PURE__*/React.createElement("div", {
    className: "dim",
    style: {
      fontSize: 11
    }
  }, n.kind, " \xB7 ", n.specs)), /*#__PURE__*/React.createElement("span", {
    className: "accent",
    style: {
      fontSize: 10
    }
  }, "\u25CF")))));
}
window.V3Editorial = V3Editorial;

/* === dist/assets/app.js === */
// App root — compiled to app.js for production
/* hooks from shared */
function App() {
  const [theme, setTheme] = useTheme();
  const [variation, setVariation] = useState(() => localStorage.getItem("kn-variation") || TWEAKS.variation || "v1");
  const [accent, setAccent] = useState(() => localStorage.getItem("kn-accent") || TWEAKS.accent || "green");
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("kn-variation", variation);
  }, [variation]);
  useEffect(() => {
    localStorage.setItem("kn-accent", accent);
    window.__tw_accent = accent;
    applyAccent(accent);
  }, [accent]);
  useEffect(() => {
    function onKey(e) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      } else if (!paletteOpen && e.key.toLowerCase() === "t" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        setTheme(theme === "dark" ? "light" : "dark");
      } else if (!paletteOpen && ["1", "2", "3"].includes(e.key) && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        setVariation("v" + e.key);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, paletteOpen]);
  const commands = [{
    id: "v1",
    icon: "◐",
    label: "view: pure terminal",
    hint: "1",
    run: () => setVariation("v1")
  }, {
    id: "v2",
    icon: "◧",
    label: "view: tmux / ide",
    hint: "2",
    run: () => setVariation("v2")
  }, {
    id: "v3",
    icon: "▦",
    label: "view: editorial",
    hint: "3",
    run: () => setVariation("v3")
  }, {
    id: "theme",
    icon: "◑",
    label: `toggle theme (${theme})`,
    hint: "t",
    run: () => setTheme(theme === "dark" ? "light" : "dark")
  }, ...Object.keys(ACCENTS).map(a => ({
    id: "acc-" + a,
    icon: "●",
    label: `accent: ${a}`,
    group: "accent",
    run: () => setAccent(a)
  })), {
    id: "email",
    icon: "✉",
    label: "email kalle",
    hint: SITE_DATA.contact.email,
    run: () => window.location.href = `mailto:${SITE_DATA.contact.email}`
  }, {
    id: "github",
    icon: "⎇",
    label: "open github",
    run: () => window.open(`https://${SITE_DATA.contact.github}`, "_blank")
  }, {
    id: "li",
    icon: "in",
    label: "open linkedin",
    run: () => window.open(`https://${SITE_DATA.contact.linkedin}`, "_blank")
  }];
  const openPalette = () => setPaletteOpen(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, variation === "v1" && /*#__PURE__*/React.createElement(V1Terminal, {
    data: SITE_DATA,
    openPalette: openPalette,
    theme: theme,
    setTheme: setTheme
  }), variation === "v2" && /*#__PURE__*/React.createElement(V2Tmux, {
    data: SITE_DATA,
    openPalette: openPalette,
    theme: theme,
    setTheme: setTheme
  }), variation === "v3" && /*#__PURE__*/React.createElement(V3Editorial, {
    data: SITE_DATA,
    openPalette: openPalette,
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement(CommandPalette, {
    open: paletteOpen,
    setOpen: setPaletteOpen,
    commands: commands
  }), /*#__PURE__*/React.createElement("div", {
    className: "v-switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "VIEW"), [{
    id: "v1",
    lbl: "01/terminal"
  }, {
    id: "v2",
    lbl: "02/tmux"
  }, {
    id: "v3",
    lbl: "03/editorial"
  }].map(v => /*#__PURE__*/React.createElement("button", {
    key: v.id,
    onClick: () => setVariation(v.id),
    className: variation === v.id ? "on" : ""
  }, v.lbl))));
}
function mount() {
  if (!window.V1Terminal || !window.V2Tmux || !window.V3Editorial || !window.CommandPalette) {
    return setTimeout(mount, 30);
  }
  applyAccent(TWEAKS.accent);
  ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));
}
mount();

})();
