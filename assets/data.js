// Shared content for Kalle Närhi's personal site
window.SITE_DATA = {
  name: "Kalle Närhi",
  handle: "kalle",
  role: "Cloud Engineer",
  location: "EU/Helsinki",
  tagline: "Cloud engineer. Tinkering with AI, cloud infra & cyber security.",
  bio: [
    "Cloud engineer. On my freetime I break things in a home lab, wire AI models into weird side projects and read too many post-mortems.",
    "This site is my playground. no analytics, no newsletter, no lead magnet. Just notes, projects and a record of what I'm building."
  ],
  focus: ["cloud", "ai", "security", "tinkering"],

  skills: {
    Cloud: ["AWS","Terraform", "Cloudflare", "ECS", "Lambda", "API Gateway"],
    AI: ["LlamaIndex", "Ollama", "vLLM", "OpenAI API", "Claude API", "pgvector"],
    Languages: ["Python", "TypeScript", "Bash", "Rust (learning)", "HCL"],
    Tools: ["Linux", "Neovim", "tmux", "Docker", "Tailscale", "Grafana", "Loki", "Prometheus"]
  },

  projects: [
    {
      name: "vault-sentry",
      year: "2026",
      tags: ["security", "go"],
      summary: "Drift detector for HashiCorp Vault policies — diffs live state against Git and alerts on unauthorized changes.",
      stack: ["Go", "Vault API", "OPA"],
      status: "active"
    },
    {
      name: "llm-ops-lab",
      year: "2025",
      tags: ["ai", "cloud"],
      summary: "Self-hosted LLM gateway with prompt caching, per-tenant quotas and OTel traces. Runs on a 3-node k3s cluster.",
      stack: ["vLLM", "Traefik", "Postgres", "Grafana"],
      status: "active"
    }
  ],

  experience: [
    { when: "2026 — now", where: "Cloud Engineer", what: "AWS MAP assessments for customer.", tags: ["cloud"] },
    { when: "2022 — 2026", where: "Cloud Engineer", what: "Maintained and developed cloud environments for different customers.", tags: ["cloud"] },
  ],

  certs: [
    { name: "AWS Solutions Architect - Associate", issuer: "AWS", year: "2025" }
  ],

  homelab: {
    nodes: [
      { host: "main",    kind: "Workstation",  specs: "i9-14900K / RTX 4090 / 64GB DDR5", role: "AI model tinkering + dev" },
      { host: "edge-01", kind: "Raspberry Pi 5", specs: "8GB", role: "k3s cluster + Grafana" }
    ],
    services: ["k3s", "Tailscale", "Grafana", "Ollama", "vLLM"]
  },

  contact: {
    email: "me@kallenarhi.com",
    github: "github.com/kallenarhi",
    linkedin: "linkedin.com/in/kallenarhi",
    pgp: "9aabdcc1afaf0fcba3af6e46f49d6d4862af0178"
  }
};
