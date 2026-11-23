/* PATO — Automated Communication-Score Portal for BSIT Alumni of 2025–2026 at Pateros Technological College
 * Upgraded client application preserving Google Workspace OAuth, server-backed persistence, direct question-selection flow,
 * real Web Speech TTS + Mic Test + Countdown + Speech-to-Text recording, adaptive branching dialogue, rubric scoring,
 * Interview DNA, Branch Trace, Answer Blueprint Coach, Duck Hint Ladder, Scenario Shift, Answer Evolution, Competency Skill Tree,
 * Focus Areas, Gamification + Duck Wardrobe, Learning Hub, and Admin Portal.
 */

const GOOGLE_CLIENT_ID = "190884994641-k87g0g0ni63agq7bnsbp590qqtp2gn4l.apps.googleusercontent.com";

const BSIT_CATEGORIES = [
  { name: "Web Development", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M7 13l2 2-2 2\"/><path d=\"M12 17h4\"/></svg>", desc: "HTML/CSS/JS architecture, browser DevTools debugging, REST APIs, and responsive UI engineering.", jobDescription: "Web developers build and maintain the interfaces and services people use in a browser. Day to day, they turn designs into responsive pages with HTML, CSS, and JavaScript, connect front ends to REST APIs, and use browser DevTools to trace layout, performance, and network issues. They solve problems such as broken layouts on small screens, slow page loads, failed API requests, and inconsistent behavior across browsers, while keeping the experience accessible and easy to use." },
  { name: "Software Development", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M8 8l-4 4 4 4\"/><path d=\"M16 8l4 4-4 4\"/><path d=\"M13 5l-2 14\"/></svg>", desc: "Programming fundamentals, state vs. functions, logic debugging, edge cases, and code reviews.", jobDescription: "Software developers design, build, and maintain programs and the logic behind them. They work with programming fundamentals such as state, functions, data structures, and control flow, then debug edge cases and review code with teammates. Their problems include incorrect output, unreliable features, performance bottlenecks, and maintainability, and they solve them through testing, clean structure, and careful iteration." },
  { name: "IT Support", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 13a8 8 0 0 1 16 0\"/><rect x=\"3\" y=\"13\" width=\"4\" height=\"6\" rx=\"1\"/><rect x=\"17\" y=\"13\" width=\"4\" height=\"6\" rx=\"1\"/><path d=\"M19 19a3 3 0 0 1-3 3h-2\"/></svg>", desc: "Workstation diagnostics, user empathy, helpdesk escalation, and hardware/OS troubleshooting.", jobDescription: "IT support professionals keep staff and students working by diagnosing hardware, software, and account problems. They listen to users, ask clear questions, document the fix, and escalate issues that need deeper technical work. They handle operating-system errors, connectivity failures, device setup, and access requests, balancing technical troubleshooting with patience and clear communication." },
  { name: "Networking", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"5\" r=\"2\"/><circle cx=\"5\" cy=\"19\" r=\"2\"/><circle cx=\"19\" cy=\"19\" r=\"2\"/><path d=\"M12 7v4\"/><path d=\"M12 11l-5 6\"/><path d=\"M12 11l5 6\"/></svg>", desc: "IPv4 addressing, private vs. public IPs, NAT, subnetting, DHCP, gateway, and DNS isolation.", jobDescription: "Network professionals design and maintain the connections that let devices communicate. They work with IPv4 addressing, subnetting, NAT, DHCP, DNS, gateways, and routing and switching concepts. They troubleshoot problems such as an unreachable host, an exhausted DHCP scope, a misconfigured gateway, or slow traffic, and they document the network so others can support it." },
  { name: "Database Management", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><ellipse cx=\"12\" cy=\"5\" rx=\"7\" ry=\"3\"/><path d=\"M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5\"/><path d=\"M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6\"/></svg>", desc: "Primary & foreign keys, referential integrity, normalization, joins, and query optimization.", jobDescription: "Database professionals organize, protect, and tune the data an organization depends on. They design tables with primary and foreign keys, enforce referential integrity, normalize schemas, and write joins and queries that return accurate results efficiently. They solve problems such as duplicate records, orphaned rows, slow reports, and inconsistent data, while keeping backups and access controls in place." },
  { name: "Cybersecurity", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z\"/><path d=\"M9 12l2 2 4-4\"/></svg>", desc: "SQL injection defense, parameterized queries, RBAC authorization, and secure authentication.", jobDescription: "Cybersecurity professionals reduce the risk of unauthorized access, data loss, and attacks. They review systems for weaknesses, apply secure coding and access-control practices, and investigate suspicious activity. They deal with issues such as SQL injection, weak authentication, excessive permissions, and exposed data, and they recommend practical fixes that keep services usable." },
  { name: "Systems Analysis", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"3\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"15\" y=\"3\" width=\"6\" height=\"5\" rx=\"1\"/><rect x=\"9\" y=\"16\" width=\"6\" height=\"5\" rx=\"1\"/><path d=\"M6 8v4h12V8\"/><path d=\"M12 12v4\"/></svg>", desc: "Requirements engineering, Use Case diagrams, Level 0/1 DFDs, ERDs, and SDLC defense.", jobDescription: "Systems analysts turn business needs into clear technical requirements. They interview stakeholders, model processes with use case diagrams, Level 0 and Level 1 DFDs, and ERDs, and support the SDLC from planning through delivery. They solve problems such as unclear scope, missing requirements, conflicting workflows, and systems that do not match how people actually work." },
  { name: "Behavioral / Internship", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20a6 6 0 0 1 12 0\"/><circle cx=\"17\" cy=\"9\" r=\"2\"/><path d=\"M15 20a5 5 0 0 1 6-4.9\"/></svg>", desc: "STAR method communication, OJT/SPES teamwork, deadline pressure, and workplace professionalism.", jobDescription: "This track prepares you for the human side of the workplace, including internships and entry-level roles. You will practice STAR-method answers, teamwork, deadline management, and professional communication with supervisors and peers. The problems are often about priorities, feedback, conflict, and accountability, and the goal is to show judgment and reliability under real workplace pressure." },
  { name: "Call Center", icon: "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 13a8 8 0 0 1 16 0\"/><rect x=\"3\" y=\"13\" width=\"4\" height=\"6\" rx=\"1\"/><rect x=\"17\" y=\"13\" width=\"4\" height=\"6\" rx=\"1\"/><path d=\"M19 19a3 3 0 0 1-3 3h-3\"/><circle cx=\"13\" cy=\"22\" r=\"1\"/></svg>", desc: "Customer support by phone, chat, and email, service quality, resolution, and CRM/ticketing tools.", jobDescription: "Call center professionals help customers by phone, chat, and email. They listen for the real issue, explain options clearly, resolve or escalate cases, and document each interaction in CRM and ticketing tools. They handle problems such as billing questions, service outages, delayed orders, and frustrated customers, while meeting quality, resolution, and customer-satisfaction targets." }
];

const SCENARIO_SHIFTS = [
  {
    id: "scen-enrollment-crash",
    title: "Scenario Shift: PTC Enrollment Portal API Timeout",
    category: "Web Development",
    difficulty: "Challenge",
    brief: "It is peak enrollment week at Pateros Technological College. Hundreds of BSIT students report that clicking 'Submit Schedule' spins for 30 seconds and fails with HTTP 504 Gateway Timeout.",
    question: {
      id: 901,
      category: "Web Development",
      type: "technical",
      difficulty: "Advanced",
      objectives: ["Isolate frontend vs API vs database bottleneck", "Propose immediate mitigation and permanent fix"],
      text: "During peak PTC enrollment, the schedule submission endpoint throws HTTP 504 timeouts. Walk me through how you isolate whether the bottleneck is the frontend, Node/PHP API server, or database query, and how you stabilize it.",
      keywords: ["network", "devtools", "timeout", "504", "logs", "database", "query", "index", "lock", "cache"],
      concepts: ["Inspect Network tab & server API latency logs", "Identify slow/locked database queries or missing indexes", "Apply query indexing, connection pooling, and graceful retry UI"],
      misconceptions: ["Changing CSS colors fixes HTTP 504 timeouts", "Deleting student records speeds up production safely"],
      followups: {
        strong: "Your database slow-query log shows a full table scan on `enrollments(student_id, semester)`. What exact index do you add and how do you verify the execution plan?",
        incomplete: "You identified part of the stack. How do you distinguish between an application server CPU bottleneck and a slow database lock?",
        keywordOnly: "Walk me through the concrete diagnostic order from the student's browser to the database server.",
        incorrect: "An HTTP 504 means an upstream server took too long to respond—not a CSS issue. Where do you check response timings first?",
        vague: "Give specific tools or logs you would open in step 1, step 2, and step 3.",
        irrelevant: "Focusing back on the enrollment outage: how do you diagnose an HTTP 504 Gateway Timeout?"
      },
      hints: [
        "Trace the request path: Browser Network tab → Reverse Proxy/API logs → Database slow-query log.",
        "Check for unindexed JOIN/WHERE columns, table locks during concurrent writes, and thread pool exhaustion.",
        "Blueprint: Direct Diagnosis → Step-by-step isolation (Browser → API → DB) → Concrete fix (Index + Pool) → Verification."
      ]
    }
  },
  {
    id: "scen-lab-outage",
    title: "Scenario Shift: Computer Lab 3 Intermittent DNS & DHCP Fault",
    category: "Networking",
    difficulty: "Challenge",
    brief: "Half of the workstations in IICT Computer Lab 3 show 'No Internet' with 169.254.x.x IP addresses, while the other half can ping 8.8.8.8 but cannot open any websites.",
    question: {
      id: 902,
      category: "Networking",
      type: "technical",
      difficulty: "Advanced",
      objectives: ["Diagnose DHCP pool exhaustion / rogue DHCP", "Separate IP routing from DNS resolution failure"],
      text: "In Computer Lab 3, half the PCs have 169.254.x.x addresses, while the remaining PCs can ping 8.8.8.8 but cannot load domain names. Diagnose both symptoms and explain your fix.",
      keywords: ["apipa", "169.254", "dhcp", "lease", "scope", "ping", "8.8.8.8", "dns", "nslookup", "ipconfig"],
      concepts: ["169.254.x.x indicates APIPA due to unreachable/exhausted DHCP server", "Successful ping to 8.8.8.8 with failed web browsing isolates a DNS failure", "Verify DHCP scope/switch VLAN and test/switch DNS forwarders"],
      misconceptions: ["169.254.x.x is a valid public IP address", "DNS failure means the Ethernet cable is unplugged"],
      followups: {
        strong: "If `ipconfig /all` reveals an unauthorized rogue router handing out 192.168.0.x leases on the lab switch, which switch security feature prevents this permanently?",
        incomplete: "You explained one symptom well. Why do the other PCs succeed on `ping 8.8.8.8` yet still fail to load websites?",
        keywordOnly: "Explain what `169.254.x.x` means technically and what `nslookup` would reveal on the second group of PCs.",
        incorrect: "Remember: 169.254.x.x is automatic private IP addressing (APIPA) when DHCP fails, while pinging 8.8.8.8 proves Layer 3 routing works so DNS is failing. Restate how you fix both.",
        vague: "Break your answer into two clear parts: Symptom A (169.254.x.x PCs) and Symptom B (ping 8.8.8.8 works, websites fail).",
        irrelevant: "Let’s focus on the Computer Lab 3 outage: how do you resolve both the 169.254.x.x addresses and the DNS failure?"
      },
      hints: [
        "Split the incident into two distinct network faults: DHCP assignment vs. DNS name resolution.",
        "169.254.x.x = APIPA (DHCP unreachable or pool full). Ping 8.8.8.8 works = Gateway/ISP OK, DNS server failing.",
        "Blueprint: Diagnose Symptom 1 (DHCP scope/VLAN) → Diagnose Symptom 2 (DNS server/flushdns) → Verify on client PCs."
      ]
    }
  },
  {
    id: "scen-sqli-audit",
    title: "Scenario Shift: Legacy Student Records SQL Injection & RBAC Audit",
    category: "Cybersecurity",
    difficulty: "Challenge",
    brief: "During a pre-deployment security review of a student portal, you discover raw string concatenation in login SQL queries and an admin route protected only by hiding the sidebar link in CSS.",
    question: {
      id: 903,
      category: "Cybersecurity",
      type: "technical",
      difficulty: "Advanced",
      objectives: ["Remediate SQL Injection via parameterized queries", "Enforce server-side RBAC authorization"],
      text: "You find a portal concatenating user input directly into SQL login queries and hiding admin links with CSS `display:none` instead of backend role checks. Explain the risks and how you fix both vulnerabilities.",
      keywords: ["sql injection", "prepared", "parameterized", "bypass", "authorization", "rbac", "middleware", "session", "server", "hash"],
      concepts: ["SQL Injection allows authentication bypass or database dumping", "Parameterized queries / prepared statements bind input safely", "Server-side RBAC middleware must verify session role on every admin API route"],
      misconceptions: ["Hiding buttons in HTML/CSS prevents API requests", "Client-side validation secures database queries"],
      followups: {
        strong: "Beyond prepared statements and RBAC, how should student passwords and session cookies be hardened against theft?",
        incomplete: "Good fix for the SQL query. How does an attacker bypass `display:none` and how do you stop them on the server?",
        keywordOnly: "Walk through how a prepared statement neutralizes `' OR 1=1 --` and how backend middleware checks roles.",
        incorrect: "Anyone can inspect HTML or send a direct HTTP request with curl/Postman, bypassing CSS `display:none`. What must the backend server check before returning admin data?",
        vague: "Address both vulnerabilities explicitly: (1) SQL query hardening and (2) Backend Admin route protection.",
        irrelevant: "Let’s stay on the security audit: how do you fix concatenated SQL queries and CSS-only admin hiding?"
      },
      hints: [
        "Address both flaws: SQL Injection (database layer) and Broken Access Control (API authorization layer).",
        "Use Prepared Statements (`?` placeholders) for SQL, and server-side session role checks (`user.role === 'admin'`) on every `/api/admin/*` route.",
        "Blueprint: Explain Risk 1 & Prepared Statement fix → Explain Risk 2 & Server RBAC middleware fix → Conclude."
      ]
    }
  }
];

let appState = null; // Loaded from /api/state
let currentUser = null;
let currentPage = "dashboard";

// Voice & Interview Runtime State
let ttsState = {
  muted: false,
  rate: 1.0,
  duckState: "idle", // idle | speaking | listening | thinking | evaluating | reacting
  supported: typeof window !== "undefined" && "speechSynthesis" in window
};

let micTestState = {
  passed: false,
  permissionGranted: false,
  testing: false,
  recordingTest: false,
  testAudioUrl: null,
  level: 0,
  error: null,
  stream: null,
  audioCtx: null,
  analyser: null,
  rafId: null,
  mediaRecorder: null,
  chunks: [],
  recorded: false,
  listened: false
};

let interviewState = null; // Active session state
let lastCompletedSession = null;
let lastEarnedRewards = null;

// Admin modals / filters
let editingQuestionId = null;
let editingLessonId = null;
let activeWardrobeSlot = "all";
let previewEquipped = null;

const $ = id => document.getElementById(String(id).replace(/^#/, ""));

function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.remove("show"), 3100);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options
  });
  const data = await res.json().catch(() => ({ error: "Unexpected server response." }));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

// ============================================================================
// AUTHENTICATION (PRESERVED GOOGLE WORKSPACE + SERVER-VERIFIED ADMIN LOGIN)
// ============================================================================
function handleGoogleCredential(response) {
  apiRequest("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential: response.credential })
  })
    .then(data => enterApp(data.user))
    .catch(err => toast(err.message));
}

function initializeGoogleSignIn() {
  if (!window.google?.accounts?.id) {
    setTimeout(initializeGoogleSignIn, 250);
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false
  });
  const container = $("googleSignInButton");
  if (container) {
    google.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: 300
    });
  }
}

document.querySelectorAll("[data-toggle]").forEach(btn =>
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.toggle);
    input.type = input.type === "password" ? "text" : "password";
    btn.textContent = input.type === "password" ? "Show" : "Hide";
  })
);

let loginCodeSent = false;

function resetLoginVerification() {
  loginCodeSent = false;
  $("emailCodeForm")?.reset();
  $("codeStep")?.classList.add("hidden");
  const loginButton = $("loginSubmitBtn");
  if (loginButton) {
    loginButton.disabled = false;
    loginButton.textContent = "Send verification code";
  }
  const loginStatus = $("loginCodeStatus");
  if (loginStatus) loginStatus.textContent = "";
}

$("emailCodeForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const code = $("loginCode")?.value.trim() || "";
  const button = $("loginSubmitBtn");
  const status = $("loginCodeStatus");

  if (!loginCodeSent) {
    if (!email) { toast("Enter your PTC email first."); return; }
    button.disabled = true;
    button.textContent = "Sending code…";
    if (status) status.textContent = "Sending verification code…";
    try {
      const data = await apiRequest("/api/auth/request-code", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      loginCodeSent = true;
      $("codeStep").classList.remove("hidden");
      $("loginCode").focus();
      button.disabled = false;
      button.textContent = "Log In";
      if (status) {
        status.textContent = data.emailed
          ? "Verification code sent to your email. Enter the 6-digit code, then press Log In."
          : `Email sending is not configured. Demo verification code: ${data.demoCode}`;
      }
      if (!data.emailed && data.demoCode) toast(`Demo verification code: ${data.demoCode}`);
    } catch (err) {
      button.disabled = false;
      button.textContent = "Send verification code";
      if (status) status.textContent = "";
      toast(err.message);
    }
    return;
  }

  if (!code) { toast("Enter the verification code."); return; }
  button.disabled = true;
  button.textContent = "Verifying…";
  if (status) status.textContent = "Verifying code…";
  try {
    const data = await apiRequest("/api/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code })
    });
    if (status) status.textContent = "";
    enterApp(data.user);
  } catch (err) {
    button.disabled = false;
    button.textContent = "Log In";
    if (status) status.textContent = "";
    toast(err.message);
  }
});

window.logoutUser = async function() {
  stopAllAudioAndRecording();
  try { await apiRequest("/api/auth/logout", { method: "POST" }); } catch {}
  currentUser = null; appState = null; interviewState = null; previewEquipped = null;
  try { localStorage.clear(); sessionStorage.clear(); } catch {}
  $("appView").classList.add("hidden"); $("authView").classList.remove("hidden");
  resetLoginVerification();
};

async function refreshServerState() {
  appState = await apiRequest("/api/state");
  updateTopHud();
}

async function enterApp(user) {
  currentUser = user;
  $("appView").classList.add("hidden");
  $("topName").textContent = user.name;
  $("topRole").textContent = user.role === "admin" ? "System Administrator" : "Alumni Students";
  $("avatar").textContent = user.name.charAt(0).toUpperCase();
  $("topKicker").textContent = user.role === "admin" ? "ADMINISTRATOR PORTAL · PTC IICT" : "STUDENT WORKSPACE · PATEROS TECHNOLOGICAL COLLEGE";

  try {
    await refreshServerState();
  } catch (err) {
    currentUser=null;appState=null;$("authView").classList.remove("hidden");toast("Unable to load your account. Please try logging in again.");return;
  }
  buildNav();
  navigate(user.role === "admin" ? "admin" : "dashboard");
  $("authView").classList.add("hidden");$("appView").classList.remove("hidden");
}


function updateTopHud() {
  syncProfileIdentity();
  const hud = $("topStatsBar");
  const mini = $("sidebarDuckMini");
  if (!hud || !appState) return;
  if (appState.role === "admin") {
    hud.innerHTML = `<span class="hud-chip">🛡️ Admin Protected Session</span>`;
    if (mini) {
      mini.innerHTML = `<strong>PTC Admin Portal</strong><span>Manage BSIT question banks, concepts, rubrics &amp; student analytics.</span>`;
    }
    return;
  }
  const p = appState.profile;
  const idItem = (appState.wardrobeCatalog || []).find(i => i.id === p.equipped?.identity);
  hud.innerHTML = `
    <span class="hud-chip">⭐ Level ${p.level} (${p.xp} XP)</span>
    <span class="hud-chip gold">🪙 ${p.coins} Coins</span>
    <span class="hud-chip">${escapeHtml(idItem?.badge || "🎓")} ${escapeHtml((idItem?.name || "PTC BSIT Alumni").replace(/PTC BSIT Candidate/g,"PTC BSIT Alumni"))}</span>
  `;

}

// ============================================================================
// DUCK AVATAR SVG RENDERER (WITH EQUIPPED WARDROBE + 6 EXPRESSIVE STATES)
// ============================================================================
function renderDuckSvg(equipped = {}, state = "idle", compact = false) {
  const eq = equipped || {};
  const hasGradCap = eq.hat === "hat-gradcap";
  const hasHeadset = eq.hat === "hat-headset";
  const hasCrown = eq.hat === "hat-devcap";

  const hasBlazer = eq.clothes === "cloth-suit";
  const hasHoodie = eq.clothes === "cloth-hoodie";
  const hasBarong = eq.clothes === "cloth-barong";

  const hasBlueLight = eq.glasses === "glass-classic";
  const hasVisor = eq.glasses === "glass-tech";

  const hasSneakers = eq.shoes === "shoe-sneakers";
  const hasLoafers = eq.shoes === "shoe-formal";

  const hasLanyard = eq.accessory === "acc-id";
  const hasCoffee = eq.accessory === "acc-portfolio";
  const hasLaptop = eq.accessory === "acc-laptop";

  // Eye / beak expressions by state
  const isSpeaking = state === "speaking";
  const isThinking = state === "thinking" || state === "evaluating";
  const isReacting = state === "reacting";
  const isListening = state === "listening";

  const size = compact ? 44 : 124;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-label="PATO Duck Avatar (${state})">
    <!-- Soft shadow -->
    <ellipse cx="80" cy="146" rx="42" ry="8" fill="rgba(11,79,50,0.16)"/>

    <!-- Feet / Shoes -->
    ${hasSneakers ? `
      <rect x="52" y="131" width="22" height="12" rx="6" fill="#ffffff" stroke="#126b45" stroke-width="2.5"/>
      <rect x="86" y="131" width="22" height="12" rx="6" fill="#ffffff" stroke="#126b45" stroke-width="2.5"/>
      <path d="M55 137h16M89 137h16" stroke="#1fa366" stroke-width="2"/>
    ` : hasLoafers ? `
      <rect x="51" y="132" width="23" height="11" rx="5" fill="#3b2618"/>
      <rect x="86" y="132" width="23" height="11" rx="5" fill="#3b2618"/>
    ` : `
      <path d="M54 134 L72 134 L75 143 L50 143 Z" fill="#f59e0b"/>
      <path d="M88 134 L106 134 L110 143 L85 143 Z" fill="#f59e0b"/>
    `}

    <!-- Duck Body -->
    <ellipse cx="80" cy="106" rx="34" ry="30" fill="#ffd84d" stroke="#e0a800" stroke-width="2"/>

    <!-- Clothes Layer -->
    ${hasBlazer ? `
      <path d="M47 96 Q80 112 113 96 L110 130 Q80 138 50 130 Z" fill="#103d2b"/>
      <polygon points="72,94 88,94 80,118" fill="#ffffff"/>
      <polygon points="78,98 82,98 83,115 80,120 77,115" fill="#168653"/>
    ` : hasHoodie ? `
      <path d="M46 96 Q80 110 114 96 L111 130 Q80 138 49 130 Z" fill="#168653"/>
      <line x1="80" y1="98" x2="80" y2="133" stroke="#a7f3d0" stroke-width="2"/>
    ` : hasBarong ? `
      <path d="M47 95 Q80 108 113 95 L110 131 Q80 138 50 131 Z" fill="#fdfbf2" stroke="#d6ceb8" stroke-width="1.5"/>
      <rect x="73" y="95" width="14" height="34" fill="#f3ebd3" stroke="#d4c59e" stroke-width="1"/>
    ` : `
      <!-- Default PTC Emerald Polo -->
      <path d="M48 96 Q80 109 112 96 L109 129 Q80 136 51 129 Z" fill="#147447"/>
      <polygon points="73,94 87,94 80,106" fill="#e4f5ea"/>
    `}

    <!-- Lanyard Accessory -->
    ${hasLanyard ? `
      <path d="M68 90 L80 114 L92 90" fill="none" stroke="#eab308" stroke-width="2.5"/>
      <rect x="74" y="113" width="12" height="15" rx="2" fill="#ffffff" stroke="#126b45" stroke-width="1.5"/>
    ` : ""}

    <!-- Wings -->
    <ellipse cx="46" cy="108" rx="9" ry="18" transform="rotate(14 46 108)" fill="#ffcf2e" stroke="#e0a800" stroke-width="1.8"/>
    <ellipse cx="114" cy="108" rx="9" ry="18" transform="rotate(-14 114 108)" fill="#ffcf2e" stroke="#e0a800" stroke-width="1.8"/>

    <!-- Duck Head -->
    <circle cx="80" cy="63" r="27" fill="#ffe066" stroke="#e0a800" stroke-width="2"/>

    <!-- Eyes -->
    ${isReacting ? `
      <path d="M65 57 Q70 51 75 57" fill="none" stroke="#132e22" stroke-width="3" stroke-linecap="round"/>
      <path d="M85 57 Q90 51 95 57" fill="none" stroke="#132e22" stroke-width="3" stroke-linecap="round"/>
    ` : `
      <circle cx="70" cy="56" r="${isListening ? 4.5 : 3.8}" fill="#132e22"/>
      <circle cx="90" cy="56" r="${isListening ? 4.5 : 3.8}" fill="#132e22"/>
      <circle cx="71.2" cy="54.8" r="1.3" fill="#ffffff"/>
      <circle cx="91.2" cy="54.8" r="1.3" fill="#ffffff"/>
    `}

    <!-- Eyewear -->
    ${hasBlueLight ? `
      <rect x="61" y="50" width="17" height="12" rx="3" fill="rgba(255,255,255,0.2)" stroke="#103d2b" stroke-width="2.2"/>
      <rect x="82" y="50" width="17" height="12" rx="3" fill="rgba(255,255,255,0.2)" stroke="#103d2b" stroke-width="2.2"/>
      <line x1="78" y1="55" x2="82" y2="55" stroke="#103d2b" stroke-width="2.2"/>
    ` : hasVisor ? `
      <rect x="58" y="49" width="44" height="13" rx="6" fill="rgba(31,163,102,0.38)" stroke="#0b4f32" stroke-width="2"/>
    ` : ""}

    <!-- Beak (animates open when speaking) -->
    ${isSpeaking ? `
      <ellipse cx="80" cy="69" rx="12" ry="6" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
      <ellipse cx="80" cy="73" rx="9" ry="4.5" fill="#9a3412"/>
    ` : `
      <path d="M68 67 Q80 62 92 67 Q89 75 80 75 Q71 75 68 67 Z" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
    `}

    <!-- Hats -->
    ${hasGradCap ? `
      <polygon points="80,22 48,35 80,46 112,35" fill="#0b4f32"/>
      <rect x="64" y="38" width="32" height="8" rx="3" fill="#126b45"/>
      <line x1="106" y1="36" x2="111" y2="52" stroke="#facc15" stroke-width="2.5"/>
    ` : hasHeadset ? `
      <path d="M52 60 A28 28 0 0 1 108 60" fill="none" stroke="#1f2937" stroke-width="4"/>
      <rect x="47" y="53" width="8" height="15" rx="4" fill="#126b45"/>
      <rect x="105" y="53" width="8" height="15" rx="4" fill="#126b45"/>
      <path d="M50 66 Q58 76 70 73" fill="none" stroke="#1f2937" stroke-width="2"/>
    ` : hasCrown ? `
      <polygon points="62,40 66,24 74,34 80,21 86,34 94,24 98,40" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>
    ` : ""}

    <!-- Handheld / Side Accessories -->
    ${hasCoffee ? `
      <rect x="116" y="103" width="22" height="25" rx="2" fill="#6b422d" stroke="#3b2618" stroke-width="2"/>
      <path d="M119 109h16M119 114h16" stroke="#e9d5b5" stroke-width="1.5"/>
    ` : hasLaptop ? `
      <polygon points="106,112 136,104 142,124 112,130" fill="#1e293b" stroke="#168653" stroke-width="1.5"/>
      <circle cx="124" cy="117" r="3" fill="#22c55e"/>
    ` : ""}

    <!-- State indicators -->
    ${isThinking ? `<text x="116" y="36" font-size="18" font-weight="800" fill="#126b45">?</text>` : ""}
    ${isListening ? `<circle cx="124" cy="40" r="7" fill="#ef4444"/><circle cx="124" cy="40" r="11" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.5"/>` : ""}
  </svg>`;
}

// ============================================================================
// NAVIGATION & ROUTING
// ============================================================================
function buildNav() {
  const items =
    currentUser.role === "admin"
      ? [
          ["admin", "▦", "Admin Overview"],
          ["users", "👥", "Student Records"],
          ["questions", "❓", "Question Bank"],
          ["rules", "⚖️", "Rubrics & Rewards"],
          ["voiceRules", "🎙️", "Voice Score Rules"],
          ["attempts", "🧾", "Score Audit"],
          ["reports", "🏅", "Certificate Awards"]
        ]
      : [
          ["dashboard", "▦", "Dashboard"],
          ["select", "🎙️", "Interview Practice"],
          ["dna", "🧬", "My Progress"],
          ["wardrobe", "🦆", "My Duck"],
          ["history", "◷", "Activity & Results"],
          ["certificates", "🏅", "Certificates"]
        ];
  $("sideNav").innerHTML = items
    .map(
      ([id, icon, label]) =>
        `<a class="nav-item" href="#${id}" data-page="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`
    )
    .join("");
  $("sideNav")
    .querySelectorAll("a")
    .forEach(a => a.addEventListener("click", e => {e.preventDefault();navigate(a.dataset.page)}));
}

function navigate(page) {
  if (currentPage === "profile" && page !== "profile") cleanupProfileEditor();
  if (currentPage === "interview" && page !== "interview") {
    stopAllAudioAndRecording();
  }
  currentPage = page;
  $("pageContent").dataset.view = page;
  $("sideNav")
    .querySelectorAll(".nav-item")
    .forEach(a => a.classList.toggle("active", a.dataset.page === page));

  const titles = {
    profile: "Profile",
    dashboard: "Student Dashboard",
    select: "Adaptive Voice Interview",
    scenarios: "Scenario Shift Labs",
    learning: "BSIT Learning Hub",
    dna: "My Progress",
    wardrobe: "PATO Wardrobe & Achievements",
    history: "Interview History & Answer Evolution",
    certificates: "My Certificates",
    interview: "Live Adaptive Voice Interview",
    results: "My Progress",
    admin: "Administrator Portal Overview",
    users: "BSIT Student & Alumni Records",
    questions: "Adaptive Question & Concept Bank",
    rules: "Rubric Weights & Gamification Rules",
    voiceRules: "Voice Score Configuration",
    attempts: "Score Audit & Overrides",
    reports: "Certificate Awards"
  };
  $("pageTitle").textContent = titles[page] || "InterAct Portal";

  const views = {
    profile: renderProfile,
    dashboard: renderDashboard,
    select: renderSelect,
    scenarios: renderScenarios,
    learning: renderLearningHub,
    dna: renderDnaAndSkills,
    wardrobe: renderWardrobe,
    history: renderHistory,
    certificates: renderCertificates,
    interview: renderInterview,
    results: renderResults,
    admin: renderAdmin,
    users: renderUsers,
    questions: renderQuestions,
    rules: renderRules,
    voiceRules: renderVoiceRules,
    attempts: renderAttempts,
    settings: renderSettings,
    reports: renderReports
  };
  (views[page] || renderDashboard)();
}

// ============================================================================
// 3. STUDENT DASHBOARD (ACTUAL DATA, "NOT ASSESSED YET" FOR NEW USERS)
// ============================================================================
function renderDashboard() {
  if (!appState || !appState.profile) {
    $("pageContent").innerHTML = `<div class="empty">Loading your Pateros Technological College profile...</div>`;
    return;
  }
  const p = appState.profile;
  const analytics = appState.analytics;
  const mine = (p.sessions || []).filter(s => !s.status || ['completed','complete','finished'].includes(String(s.status).toLowerCase()));
  const scored=mine.map(s=>s.jobInterviewSkillScore??s.score).filter(v=>v!=null&&v!==''&&Number.isFinite(Number(v))).map(Number);
 const avg=scored.length?Math.round(scored.reduce((a,b)=>a+b,0)/scored.length):null;
  const voiceScores = mine.map(s => s.voiceScore).filter(v => v != null && v !== '' && Number.isFinite(Number(v))).map(Number);
  const voiceAvg = voiceScores.length ? Math.round(voiceScores.reduce((a,b)=>a+b,0)/voiceScores.length) : null;
  const completedLessons = Object.values(p.lessonProgress || {}).filter(l => l.completed).length;
  const totalLessons = (appState.lessons || []).length;
  const nextLesson = (appState.lessons || []).find(l => !p.lessonProgress?.[l.id]?.completed) || appState.lessons?.[0];
  const unfinished = mine.find(s => s.status === "in_progress" || s.status === "active");

  $("pageContent").innerHTML = `
    <section class="dash-hero">
      <div class="hero-card">
        <span class="eyebrow">PATEROS TECHNOLOGICAL COLLEGE · BSIT 2025–2026</span>
        <h1>Welcome back, ${escapeHtml(p.name.split(" ")[0])}</h1>
        <p>${mine.length ? "Continue building your interview skills. Review your latest results, practice a role-specific question, or continue a lesson." : "Practice a job interview with PATO. Test your microphone, answer one question at a time, and receive clear feedback on your answer and speaking."}</p>
        <div class="hero-actions">
          <button class="primary-btn" onclick="navigate('select')">Start Interview Practice</button>
          ${p.activeInterview ? `<button class="secondary-btn" onclick="resumeSavedInterview()">Resume Interview</button>` : ""}
          ${completedLessons > 0 ? `<button class="secondary-btn" onclick="navigate('learning')">Continue Learning</button>` : ""}
        </div>
      </div>
      <div class="duck-feature">
        <div class="duck-stage duck-bg-${escapeHtml((p.equipped?.background || "bg-ptc-mint").replace("bg-", ""))}" id="patoDashboardAvatarStage">
          <div class="pato-dashboard-avatar-host"></div>
          <span class="duck-state-badge">PATO · ONLINE</span>
        </div>
      </div>
    </section>

    <section class="metrics-band">
      <div class="metric-card">
        <div class="metric-label">Completed interviews</div>
        <div class="metric-value">${mine.length}</div>
        <div class="metric-sub">${mine.length ? "Across your saved interview sessions." : "No interview sessions yet."}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Average interview score</div>
        <div class="metric-value">${avg === null ? '<span class="not-assessed">Not assessed yet</span>' : avg + "<small> / 100</small>"}</div>
        <div class="metric-sub">${avg === null ? "Complete an interview to see your score." : "Based on your completed sessions."}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Voice score</div>
        <div class="metric-value">${voiceAvg === null ? '<span class="not-assessed">Not assessed yet</span>' : voiceAvg + "<small> / 100</small>"}</div>
        <div class="metric-sub">${voiceAvg === null ? "Voice scores appear after a recorded interview." : "Average of your recorded voice evaluations."}</div>
      </div>
    </section>

    ${
      p.activeInterview ? `
      <div class="section-head">
        <h3>Continue interview</h3>
        <span>Resume your paused interview from where you left off.</span>
      </div>
      <div class="path-list">
        <div class="path-row">
          <div>
            <div class="path-title">Continuation · ${escapeHtml(p.activeInterview.category || "Interview")}</div>
            <div class="path-desc">Paused interview · ${(p.activeInterview.turns || []).length} answer(s) saved</div>
          </div>
          <button class="primary-btn" onclick="resumeSavedInterview()">Continue</button>
        </div>
      </div>` : ""
    }

    <section class="panel dash-system-panel">
      <div class="dash-system-head">
        <div>
          <h3>PATO system overview</h3>
          <p class="panel-sub">Your interview readiness, learning tools, progress, and certificates in one place.</p>
        </div>
        <span class="dash-system-badge">SYSTEM READY</span>
      </div>
      <div class="dash-system-grid">
        <div class="dash-system-card">
          <span class="dash-system-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg></span>
          <strong>Microphone</strong>
          <span>Test your voice before an interview</span>
          <button class="secondary-btn" onclick="navigate('select')">Open Mic Test</button>
        </div>
        <div class="dash-system-card">
          <span class="dash-system-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 13h5"/></svg></span>
          <strong>Learning Hub</strong>
          <span>Review lessons and practice materials</span>
          <button class="secondary-btn" onclick="navigate('learning')">Open Learning</button>
        </div>
        <div class="dash-system-card">
          <span class="dash-system-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg></span>
          <strong>My Progress</strong>
          <span>Check scores and focus areas</span>
          <button class="secondary-btn" onclick="navigate('dna')">Open Progress</button>
        </div>
        <div class="dash-system-card">
          <span class="dash-system-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 13.5 7 21l5-3 5 3-2-7.5"/></svg></span>
          <strong>Certificates</strong>
          <span>View earned certificates</span>
          <button class="secondary-btn" onclick="navigate('certificates')">Open Certificates</button>
        </div>
      </div>
    </section>

    <div class="section-head">
      <h3>Learning paths</h3>
      <span>Complete 3 Basic Practice sessions in a role to unlock Advanced Practice.</span>
    </div>
    <div class="path-list">
      ${BSIT_CATEGORIES.map(c => {
        const count = (appState.questions || []).filter(q => q.category === c.name).length;
        const done = mine.filter(s => s.category === c.name && s.mode === "Practice").length;
        const pct = Math.min(100, Math.round((done / 3) * 100));
        return `
          <div class="path-row">
            <div>
              <div class="path-title">${escapeHtml(c.name)}</div>
              <div class="path-desc">${escapeHtml(c.desc)}</div>
            </div>
            <div class="path-progress">
              <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
              <div class="path-count" style="margin-top:6px">${done}/3 Basic sessions · ${count} questions</div>
            </div>
            <button class="secondary-btn" onclick="navigateToCategorySetup('${escapeHtml(c.name)}')">${done ? "Continue" : "Start"}</button>
          </div>`;
      }).join("")}
    </div>

    <div class="section-head">
      <h3>Communication focus areas</h3>
      <span>Based on your actual interview assessments.</span>
    </div>
    <div class="focus-grid">
      ${analytics.focusAreas.map(fa => `
        <div class="focus-item">
          <div class="focus-top"><strong>${escapeHtml(fa.name)}</strong><span>${fa.avgRating === null ? "Not assessed yet" : fa.avgRating + "/5"}</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${fa.progressPct}%"></div></div>
        </div>`).join("")}
    </div>

    <div class="section-head">
      <h3>Recent activity</h3>
      <span>${mine.length ? "Open a session to view its results and branch trace." : "Your interview and lesson activity will appear here."}</span>
    </div>
    <div class="panel">
      ${mine.length ? renderSessionsTable(mine.slice(-5).reverse()) : `<div class="empty dash-empty-tech">
          <span class="dash-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6M9 13h6M9 17h3"/></svg></span>
          <strong>No recent activity yet</strong>
          <p>Start your first interview practice to build your communication progress, scores, and certificate record.</p>
        </div>`}
    </div>
  `;
  mountDashboardPato();
}

function mountDashboardPato() {
  const stage=document.querySelector("#patoDashboardAvatarStage .pato-dashboard-avatar-host");
  if(!stage || !window.PATO3D || !window.THREE) return;
  const eq=appState?.profile?.equipped || {};
  const avatar=window.PATO3D.mount(stage,{background:"#e8f5ed",equipped:eq});
  avatar?.equip(eq);
  avatar?.setState("idle");
}

function renderSessionsTable(items) {
  if (!items.length) {
    return `<div class="empty">Not assessed yet. Start a voice interview in any BSIT category to record your first communication evaluation.</div>`;
  }
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>BSIT Track</th>
            <th>Mode</th>
            <th>Date</th>
            <th>Turns</th>
            <th>Weighted Score</th>
            <th>Rewards</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              s => `
            <tr>
              <td><strong>${escapeHtml(s.category)}</strong>${s.scenarioTitle ? `<br><small style="color:var(--ptc)">${escapeHtml(s.scenarioTitle)}</small>` : ""}</td>
              <td><span class="pill ${s.mode === "Assessment" ? "gold" : s.mode === "Challenge" ? "amber" : ""}">${escapeHtml(s.mode || "Practice")}</span></td>
              <td>${new Date(s.date).toLocaleDateString()}</td>
              <td>${(s.turns || []).length} turn(s)</td>
              <td><strong>${s.score}/100</strong></td>
              <td>+${s.earnedXp || 0} XP · +${s.earnedCoins || 0} 🪙</td>
              <td><button class="small-btn" onclick="viewSavedSession('${escapeHtml(String(s.id))}')">Inspect Report &amp; Trace</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function viewSavedSession(sessionId) {
  const found = (appState?.profile?.sessions || []).find(s => String(s.id) === String(sessionId));
  if (!found) return;
  lastCompletedSession = found;
  lastEarnedRewards = null;
  navigate("results");
}

// ============================================================================
// DIRECT QUESTION SELECTION & MODE CONFIGURATION (PRESERVED FLOW)
// ============================================================================
let preselectedCategory = "Web Development";

function navigateToCategorySetup(category) {
  preselectedCategory = category;
  navigate("select");
}


function renderSelect() {
  const questions = appState?.questions || [];
  const catQuestions = questions.filter(q => q.category === preselectedCategory);
  const firstQ = catQuestions[0] || questions[0];
  const selectedRole = BSIT_CATEGORIES.find(c => c.name === preselectedCategory) || BSIT_CATEGORIES[0];

  window.PATO_SETUP = window.PATO_SETUP || { type: "Basic Interview", level: "Basic Practice" };
  const currentMode = window.PATO_SETUP.level === "Advanced Practice" ? "Challenge" : (window.PATO_SETUP.level === "Assessment" ? "Assessment" : "Practice");

  $("pageContent").innerHTML = `
    <div class="welcome-row setup-hero">
      <div class="setup-hero-text">
        <span class="top-kicker">PATO · BSIT INTERVIEW SIMULATOR</span>
        <h1>Configure Your Interview Simulator</h1>
        <p>Select your target BSIT career role and simulation mode. PATO will guide you through realistic interview questions, spoken-response practice, and professional communication feedback.</p>
      </div>
    </div>

    <div class="setup-steps">
      <div class="setup-step active">1 · Interview type</div>
      <div class="setup-step">2 · BSIT career role</div>
      <div class="setup-step">3 · Simulator mode</div>
      <div class="setup-step">4 · Begin</div>
    </div>

    <section class="panel">
      <h3>Choose interview type</h3>
      <p class="panel-sub">This helps PATO select the kind of questions and feedback for your simulation.</p>
      <div class="choice-list" id="typeChoices">
        ${["Basic Interview","Technical Interview","Situational Interview"].map(t => `
          <button class="choice-row ${window.PATO_SETUP.type === t ? "selected" : ""}" data-choice="${escapeHtml(t)}" onclick="selectSetupChoice('type',this)">
            <div class="choice-main"><strong>${escapeHtml(t)}</strong><span>${t === "Basic Interview" ? "Tell me about yourself, strengths, goals, and work readiness." : t === "Technical Interview" ? "Role-specific concepts, troubleshooting, and technical explanations." : "Workplace situations, decisions, teamwork, and problem solving."}</span></div>
            <span class="choice-state">${window.PATO_SETUP.type === t ? "Selected" : "Select"}</span>
          </button>`).join("")}
      </div>
    </section>

    <section class="panel">
      <h3>Choose BSIT career role</h3>
      <p class="panel-sub">Select the role you want to prepare for. The job title and description will help you understand the position before the simulation begins.</p>
      <div class="role-dropdown-wrap">
        <label class="field-label" for="bsitRoleDropdown">BSIT Career Role</label>
        <select id="bsitRoleDropdown" class="role-dropdown" onchange="onSetupCategoryChange(this.value)">
          ${BSIT_CATEGORIES.map(c => `<option value="${escapeHtml(c.name)}" ${c.name === preselectedCategory ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
        </select>
      </div>
      <div class="role-info-card">
        <div class="role-info-head">
          <span class="role-icon">${selectedRole.icon}</span>
          <div>
            <span class="role-kicker">Job Title</span>
            <h4 id="roleJobTitle">${escapeHtml(selectedRole.name)}</h4>
          </div>
        </div>
        <span class="role-kicker">Job Description</span>
        <p id="roleJobDescription">${escapeHtml(selectedRole.jobDescription)}</p>
      </div>
    </section>

    <section class="panel">
      <h3>Choose simulator mode</h3>
      <p class="panel-sub">Choose how PATO will guide and evaluate your interview performance.</p>
      <div class="choice-list">
        <button class="choice-row ${currentMode === "Practice" ? "selected" : ""}" data-choice="Practice" onclick="selectSimulatorMode(this)">
          <div class="choice-main"><strong>Guided Practice</strong><span>Step-by-step coaching, helpful hints, retries, and detailed communication feedback.</span></div>
          <span class="choice-state">${currentMode === "Practice" ? "Selected" : "Select"}</span>
        </button>
        <button class="choice-row ${currentMode === "Challenge" ? "selected" : ""}" data-choice="Challenge" onclick="selectSimulatorMode(this)">
          <div class="choice-main"><strong>Challenge Round</strong><span>More demanding follow-up questions, limited hints, and higher rewards for strong responses.</span></div>
          <span class="choice-state">${currentMode === "Challenge" ? "Selected" : "Select"}</span>
        </button>
        <button class="choice-row ${currentMode === "Assessment" ? "selected" : ""}" data-choice="Assessment" onclick="selectSimulatorMode(this)">
          <div class="choice-main"><strong>Formal Assessment</strong><span>A realistic evaluator-style session with no hints and rubric-based scoring after completion.</span></div>
          <span class="choice-state">${currentMode === "Assessment" ? "Selected" : "Select"}</span>
        </button>
      </div>
    </section>

    <section class="panel summary-panel">
      <h3>Session summary</h3>
      <p class="panel-sub">Review your simulator configuration before starting.</p>
      <div class="session-summary professional-summary">
        <div class="summary-item"><span>Interview type</span><strong id="summaryType">${escapeHtml(window.PATO_SETUP.type)}</strong></div>
        <div class="summary-item"><span>BSIT career role</span><strong id="summaryRole">${escapeHtml(preselectedCategory)}</strong></div>
        <div class="summary-item"><span>Simulator mode</span><strong id="summaryMode">${escapeHtml(currentMode === "Practice" ? "Guided Practice" : currentMode === "Challenge" ? "Challenge Round" : "Formal Assessment")}</strong></div>
        <div class="summary-item"><span>Interview coach</span><strong>PATO Voice Coach</strong></div>
      </div>
      <div class="begin-row">
        <button class="primary-btn begin-interview-btn" onclick="beginSelectedInterview()">Begin Interview Simulator</button>
      </div>
    </section>

    <footer class="pato-page-footer">
      <span>© 2026 PATO · Pateros Technological College · BSIT</span>
      <span>Automated Communication-Score Portal · Interview Simulator</span>
    </footer>

    <select id="setupCategory" class="hidden">${BSIT_CATEGORIES.map(c => `<option value="${escapeHtml(c.name)}" ${c.name === preselectedCategory ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select>
    <select id="setupMode" class="hidden">
      <option value="Practice" ${currentMode === "Practice" ? "selected" : ""}>Practice</option>
      <option value="Challenge" ${currentMode === "Challenge" ? "selected" : ""}>Challenge</option>
      <option value="Assessment" ${currentMode === "Assessment" ? "selected" : ""}>Assessment</option>
    </select>
    <select id="setupFirstQuestion" class="hidden">
      ${catQuestions.map((q, idx) => `<option value="${q.id}" ${firstQ && q.id === firstQ.id ? "selected" : ""}>Q${idx + 1}: ${escapeHtml(q.text.slice(0, 68))}</option>`).join("")}
    </select>
  `;
}

function selectSimulatorMode(el) {
  const value = el.dataset.choice;
  document.querySelectorAll(".choice-list .choice-row").forEach(row => {
    if (row.dataset.choice === "Practice" || row.dataset.choice === "Challenge" || row.dataset.choice === "Assessment") {
      row.classList.remove("selected");
      const state = row.querySelector(".choice-state");
      if (state) state.textContent = "Select";
    }
  });
  el.classList.add("selected");
  el.querySelector(".choice-state").textContent = "Selected";
  window.PATO_SETUP.level = value === "Challenge" ? "Advanced Practice" : (value === "Assessment" ? "Assessment" : "Basic Practice");
  const modeSelect = document.getElementById("setupMode");
  if (modeSelect) modeSelect.value = value;
  const label = value === "Practice" ? "Guided Practice" : value === "Challenge" ? "Challenge Round" : "Formal Assessment";
  const summaryMode = document.getElementById("summaryMode");
  if (summaryMode) summaryMode.textContent = label;
}




function onSetupCategoryChange(cat) {
  preselectedCategory = cat;
  renderSelect();
}

function updateModeDescription(mode) {
  const box = $("modeDescBox");
  if (!box) return;
  const map = {
    Practice:
      "<strong>Practice Mode:</strong> Full access to the 3-level Duck Hint Ladder, Answer Blueprint Coach, transcript review before submission, and Answer Evolution comparison.",
    Challenge:
      "<strong>Challenge Mode:</strong> Escalated follow-up probing, 1.35x XP/Coin multiplier, and maximum 1 optional hint per session.",
    Assessment:
      "<strong>Assessment Mode:</strong> Formal unassisted evaluation (0 hints allowed, 1.5x XP/Coin multiplier). Rubric feedback is revealed upon session completion."
  };
  box.innerHTML = map[mode] || map.Practice;
}

function launchDirectQuestion(questionId) {
  const mode = $("setupMode")?.value || "Practice";
  const q = (appState?.questions || []).find(x => Number(x.id) === Number(questionId));
  if (!q) return;
  startInterviewSession({ category: q.category, mode, firstQuestion: q, scenarioTitle: null });
}

function beginSelectedInterview() {
  const cat = $("setupCategory")?.value || preselectedCategory;
  const mode = $("setupMode")?.value || "Practice";
  const qId = Number($("setupFirstQuestion")?.value);
  const q = (appState?.questions || []).find(x => Number(x.id) === qId) || (appState?.questions || []).find(x => x.category === cat);
  if (!q) {
    toast("No question available for this category.");
    return;
  }
  startInterviewSession({ category: cat, mode, firstQuestion: q, scenarioTitle: null });
}

async function resumeSavedInterview() {
  try {
    const res = await apiRequest('/api/interview/progress');
    if (!res.progress) { toast('There is no saved interview to resume.'); await refreshServerState(); renderDashboard(); return; }
    interviewState = res.progress;
    if (['countdown','duck_speaking','recording'].includes(interviewState.stage)) {
      interviewState.stage = interviewState.liveTranscript ? 'transcript_review' : 'ready_to_record';
    }
    if (interviewState.stage === 'mic_test') {
      micTestState.passed=false; micTestState.recorded=false; micTestState.listened=false;
    }
    navigate('interview');
    if (interviewState.stage !== 'mic_test') toast('Your saved interview has been restored.');
  } catch (err) { toast('Could not resume interview: '+err.message); }
}

function showBreakModal() {
  if (interviewState?.stage === 'evaluating') { toast('Please wait until the current answer has been evaluated before taking a break.'); return; }
  const modal=document.getElementById('interviewBreakModal');
  if(modal) modal.classList.remove('hidden');
}
function closeBreakModal() {
  document.getElementById('interviewBreakModal')?.classList.add('hidden');
}
async function takeInterviewBreak() {
  if(!interviewState) return navigate('dashboard');
  const snapshot=JSON.parse(JSON.stringify(interviewState));
  if(snapshot.stage==='recording') snapshot.stage=snapshot.liveTranscript?'transcript_review':'ready_to_record';
  try {
    await apiRequest('/api/interview/progress',{method:'POST',body:JSON.stringify({progress:snapshot})});
    closeBreakModal();
    stopAllAudioAndRecording();
    await refreshServerState();
    navigate('dashboard');
    toast('Your interview progress has been saved. You can resume it from the dashboard.');
  } catch(err) { toast('Could not save your interview progress: '+err.message); }
}

function startInterviewSession({ category, mode, firstQuestion, scenarioTitle }) {
  stopAllAudioAndRecording();
  interviewState = {
    sessionId: String(Date.now()),
    category,
    mode,
    scenarioTitle,
    stage: "mic_test", // mic_test -> countdown -> duck_speaking -> ready_to_record -> recording -> transcript_review -> evaluating -> turn_feedback
    turnIndex: 0,
    maxTurns: 3, // Adaptive 3-turn branching dialogue per session
    currentQuestion: firstQuestion,
    turns: [],
    hintsUsedThisTurn: 0,
    totalHintsUsed: 0,
    unlockedHintLevel: 0,
    liveTranscript: "",
    interimTranscript: "",
    recordStartTime: null,
    recordDurationSec: 0,
    pauseCount: 0,
    restarts: 0,
    lastTurnEval: null,
    introSpoken: false,
    speechError: null
  };
  navigate("interview");
}

// ============================================================================
// 4. TALKING DUCK (TTS) + MICROPHONE TEST + STRICT RECORDING SEQUENCE
// ============================================================================
function setDuckState(newState) {
  ttsState.duckState = newState;
  const stageEl = $("duckStageContainer");
  if (stageEl) {
    stageEl.className = `duck-stage duck-bg-${escapeHtml((appState?.profile?.equipped?.background || "bg-ptc-mint").replace("bg-", ""))} duck-state-${newState}`;
    stageEl.innerHTML = `
      ${renderDuckSvg(appState?.profile?.equipped, newState)}
      <span class="duck-state-badge">PATO: ${escapeHtml(newState.toUpperCase())}</span>
    `;
  }
}

function speakDuckText(text, onFinished) {
  // Duck Coach remains silent throughout the microphone test.
  if (interviewState?.stage === 'mic_test') { setDuckState('idle'); return; }
  // Never record while duck is speaking
  if (interviewState && interviewState.stage === "recording") {
    stopVoiceRecording();
  }
  if (!ttsState.supported || ttsState.muted) {
    setDuckState("idle");
    if (typeof onFinished === "function") setTimeout(onFinished, 250);
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = Math.min(ttsState.rate, 1.0);
    utter.pitch = 0.88;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /en-(US|GB|PH)/i.test(v.lang) && !/novelty/i.test(v.name)) || voices[0];
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setDuckState("speaking");
    utter.onend = () => {
      setDuckState("idle");
      if (typeof onFinished === "function") onFinished();
    };
    utter.onerror = () => {
      setDuckState("idle");
      if (typeof onFinished === "function") onFinished();
    };
    setDuckState("speaking");
    window.speechSynthesis.speak(utter);
  } catch {
    setDuckState("idle");
    if (typeof onFinished === "function") onFinished();
  }
}

function toggleDuckMute() {
  ttsState.muted = !ttsState.muted;
  if (ttsState.muted && ttsState.supported) {
    window.speechSynthesis.cancel();
    setDuckState("idle");
  }
  renderInterview();
}

function setDuckSpeed(rate) {
  ttsState.rate = Number(rate) || 1.0;
  toast(`PATO voice speed set to ${ttsState.rate}x`);
}

function replayDuckQuestion() {
  if (!interviewState || interviewState.stage === "recording" || interviewState.stage === "countdown") return;
  speakDuckText(interviewState.currentQuestion.text);
}

// Microphone test: permission, live RMS meter, sustained voice detection and cleanup.
async function startMicTestMonitor() {
  stopMicMonitor();
  micTestState.error = null; micTestState.passed = false; micTestState.recorded=false; micTestState.listened=false; micTestState.voiceDetected=false; micTestState.level = 0;
  micTestState.peak = 0; micTestState.average = 0; micTestState.samples = [];
  micTestState.voiceSince = null; micTestState.startedAt = Date.now(); micTestState.status = 'Listening… speak normally';
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser does not support microphone access. Please use a recent version of Chrome or Edge over HTTPS or localhost.');
    if (!(window.AudioContext || window.webkitAudioContext)) throw new Error('Live microphone testing is not supported by this browser. Try an updated Chrome or Edge browser.');
    const stream = await navigator.mediaDevices.getUserMedia({audio:{ echoCancellation:true, noiseSuppression:true, autoGainControl:true }});
    micTestState.stream = stream; micTestState.permissionGranted = true; micTestState.testing = true;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
    const source = audioCtx.createMediaStreamSource(stream), analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; analyser.smoothingTimeConstant = .72; source.connect(analyser);
    micTestState.audioCtx = audioCtx; micTestState.analyser = analyser;
    const data = new Float32Array(analyser.fftSize);
    const tick = () => {
      if (!micTestState.testing) return;
      analyser.getFloatTimeDomainData(data);
      let sum = 0; for (let i=0;i<data.length;i++) sum += data[i]*data[i];
      const rms = Math.sqrt(sum/data.length);
      const pct = Math.min(100, Math.round(rms*420));
      micTestState.level = pct; micTestState.peak = Math.max(micTestState.peak || 0, pct);
      micTestState.samples.push(pct); if (micTestState.samples.length > 180) micTestState.samples.shift();
      micTestState.average = Math.round(micTestState.samples.reduce((a,b)=>a+b,0)/micTestState.samples.length);
      const fill = $('micMeterFill'); if (fill) fill.style.width = pct+'%';
      const meter = fill?.parentElement; if (meter) meter.setAttribute('aria-valuenow', String(pct));
      const visual = $('micVisualizer'); if (visual) visual.style.setProperty('--mic-level', Math.max(0.08,pct/100));
      const now = Date.now(), speech = pct >= 7;
      if (speech) { if (!micTestState.voiceSince) micTestState.voiceSince = now; micTestState.status = 'Voice detected'; }
      else { micTestState.voiceSince = null; micTestState.status = (now-micTestState.startedAt < 3500) ? 'Listening… take your time' : (now-micTestState.startedAt < 8000 ? 'Too quiet — move closer to the microphone' : 'No input detected — check your microphone and try again'); }
      if (micTestState.voiceSince && now-micTestState.voiceSince >= 1200) { micTestState.voiceDetected = true; micTestState.status = 'Voice detected — record a short sample'; }
      const status=$('micStatus'); if(status) status.textContent=micTestState.status;
      const recordBtn=$('micRecordBtn'); if(recordBtn) recordBtn.disabled=!micTestState.voiceDetected || micTestState.recordingTest;
      const readout=$('micReadout'); if(readout) readout.textContent=`Peak ${micTestState.peak}% · Average ${micTestState.average}%`;
      const live=$('micLiveState'); if(live) live.textContent=micTestState.passed?'Test passed':micTestState.status;
      micTestState.rafId=requestAnimationFrame(tick);
    };
    tick(); renderInterview();
  } catch (err) {
    const name=err?.name || '';
    micTestState.permissionGranted=false; micTestState.testing=false;
    micTestState.error = name==='NotAllowedError' || name==='SecurityError' ? 'Microphone permission was blocked. Allow microphone access in your browser or site settings, then try again.' : name==='NotFoundError' || name==='DevicesNotFoundError' ? 'No microphone was found. Connect a microphone or check your device settings, then retry.' : name==='NotReadableError' || name==='TrackStartError' ? 'Your microphone is busy or unavailable. Close other apps using it, then retry.' : (err.message || 'The microphone could not be started. Check your device and try again.');
    renderInterview();
  }
}

async function recordMicTestClip() {
  try {
    if (!micTestState.permissionGranted || !navigator.mediaDevices?.getUserMedia) {
      toast("Start the microphone test and allow microphone access first.");
      return;
    }
    if (!micTestState.stream || !micTestState.stream.getTracks().some(track => track.readyState === "live")) {
      micTestState.stream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    }
    micTestState.chunks = [];
    micTestState.recorded = false;
    micTestState.listened = false;
    micTestState.passed = false;
    const mimeType = MediaRecorder.isTypeSupported?.("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
    const mr = new MediaRecorder(micTestState.stream, mimeType ? {mimeType} : undefined);
    micTestState.mediaRecorder = mr;
    micTestState.recordingTest = true;
    mr.ondataavailable = e => { if (e.data?.size > 0) micTestState.chunks.push(e.data); };
    mr.onerror = () => { micTestState.recordingTest=false; micTestState.error="Recording failed. Check your microphone and try again."; renderInterview(); };
    mr.onstop = () => {
      const blob = new Blob(micTestState.chunks, { type: mr.mimeType || "audio/webm" });
      micTestState.recordingTest = false;
      if (!blob.size) { micTestState.error="No audio was captured. Please record again."; renderInterview(); return; }
      if (micTestState.testAudioUrl) URL.revokeObjectURL(micTestState.testAudioUrl);
      micTestState.testAudioUrl = URL.createObjectURL(blob);
      micTestState.recorded = true;
      micTestState.passed = false;
      renderInterview();
    };
    mr.start();
    renderInterview();
    const stop = () => { if (mr.state === "recording") mr.stop(); };
    micTestState.recordStopTimer = setTimeout(stop, 4000);
  } catch (err) {
    micTestState.recordingTest=false;
    micTestState.error = err?.name === "NotAllowedError" || err?.name === "SecurityError"
      ? "Microphone permission was blocked. Allow microphone access, then test again."
      : "Recording failed. Check that your microphone is connected and try again.";
    renderInterview();
  }
}

function replayMicTestClip() {
  const audio = document.getElementById('micTestPlayback');
  if (!audio) return;
  try { audio.currentTime = 0; audio.play(); } catch (err) { toast('Tap the audio player to hear your recording.'); }
}

function retryMicTest() {
  clearTimeout(micTestState.recordStopTimer);
  if (micTestState.mediaRecorder?.state === "recording") {
    micTestState.mediaRecorder.onstop = null;
    micTestState.mediaRecorder.ondataavailable = null;
    try { micTestState.mediaRecorder.stop(); } catch {}
  }
  if (micTestState.testAudioUrl) {
    URL.revokeObjectURL(micTestState.testAudioUrl);
    micTestState.testAudioUrl = null;
  }
  micTestState.passed = false; micTestState.recorded=false; micTestState.listened=false; micTestState.voiceDetected=false; micTestState.error=null;
  micTestState.chunks=[]; micTestState.recordingTest=false;
  startMicTestMonitor();
}

function stopMicMonitor() {
  micTestState.testing = false;
  clearTimeout(micTestState.recordStopTimer);
  if (micTestState.mediaRecorder?.state === "recording") {
    micTestState.mediaRecorder.onstop = null;
    micTestState.mediaRecorder.ondataavailable = null;
    try { micTestState.mediaRecorder.stop(); } catch {}
  }
  micTestState.recordingTest = false;
  if (micTestState.rafId) cancelAnimationFrame(micTestState.rafId);
  if (micTestState.audioCtx) {
    micTestState.audioCtx.close().catch(() => {});
    micTestState.audioCtx = null;
  }
  if (micTestState.stream) {
    micTestState.stream.getTracks().forEach(t => t.stop());
    micTestState.stream = null;
  }
}

// Strict Sequence: Mic Test -> Start -> 3-2-1 Countdown -> Duck Speaks Question -> Ready to Record
function startTurnCountdown() {
  if (!interviewState) return;
  stopMicMonitor();
  if (ttsState.supported) window.speechSynthesis.cancel();
  interviewState.stage = "countdown";
  interviewState.countdownVal = 3;
  interviewState.liveTranscript = "";
  interviewState.interimTranscript = "";
  interviewState.hintsUsedThisTurn = 0;
  interviewState.unlockedHintLevel = 0;
  interviewState.restarts = 0;
  interviewState.pauseCount = 0;
  interviewState.speechError = null;
  renderInterview();

  const timer = setInterval(() => {
    if (!interviewState || interviewState.stage !== "countdown") {
      clearInterval(timer);
      return;
    }
    interviewState.countdownVal--;
    if (interviewState.countdownVal > 0) {
      const numEl = $("countdownNumber");
      if (numEl) numEl.textContent = interviewState.countdownVal;
    } else {
      clearInterval(timer);
      // Now Duck speaks the question (NO recording during countdown or duck playback)
      interviewState.stage = "duck_speaking";
      renderInterview();
      const askCurrentQuestion = () => {
        if (!interviewState) return;
        speakDuckText(interviewState.currentQuestion.text, () => {
          if (!interviewState) return;
          interviewState.stage = "ready_to_record";
          renderInterview();
        });
      };
      if (interviewState.turnIndex === 0 && !interviewState.introSpoken) {
        interviewState.introSpoken = true;
        speakDuckText(`Hello! Welcome to your ${interviewState.category} interview. I am PATO, your interview coach. Listen to each question, answer in your own words, and I may ask a follow-up based on your response. Let's begin.`, askCurrentQuestion);
      } else askCurrentQuestion();
    }
  }, 900);
}

// Speech-to-Text Voice Recording (Manual Start & Manual Stop, never captures duck voice)
let activeSpeechRec = null;

function startVoiceRecording() {
  if (!interviewState) return;
  // Guarantee TTS is completely stopped before microphone capture begins
  if (ttsState.supported) window.speechSynthesis.cancel();
  setDuckState("listening");

  interviewState.stage = "recording";
  interviewState.recordStartTime = Date.now();
  interviewState.speechError = null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    interviewState.speechError =
      "Live browser Speech-to-Text is not supported in this browser. You may speak and type/edit your transcript below.";
    renderInterview();
    return;
  }

  try {
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let lastResultTs = Date.now();
    let recognizedFinals = [];

    rec.onresult = event => {
      const now = Date.now();
      if (now - lastResultTs > 2200) {
        interviewState.pauseCount = (interviewState.pauseCount || 0) + 1;
      }
      lastResultTs = now;

      let finalChunk = "";
      let interimChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalChunk += res[0].transcript + " ";
          if (interviewState?.scheme === 'pato-entry-10' && Number.isFinite(res[0].confidence) && res[0].confidence > 0) {
            (interviewState.recognitionSamples ||= []).push(res[0].confidence);
          }
        }
        else interimChunk += res[0].transcript;
      }
      if (finalChunk) {
        const cleanChunk = finalChunk.trim();
        if (cleanChunk && !recognizedFinals.includes(cleanChunk)) {
          recognizedFinals.push(cleanChunk);
        }
        interviewState.liveTranscript = recognizedFinals.join(" ").trim();
      }
      interviewState.interimTranscript = interimChunk;
      const box = $("transcriptEditor");
      if (box) {
        box.value = (interviewState.liveTranscript + (interimChunk ? " " + interimChunk : "")).trim();
      }
    };

    rec.onerror = e => {
      if (e.error !== "aborted") {
        interviewState.speechError = `Speech recognition notice (${e.error}): You can review or edit your transcript directly before submitting.`;
      }
    };

    rec.onend = () => {
      // If user hasn't clicked Stop yet, keep listening smoothly
      if (interviewState && interviewState.stage === "recording") {
        try {
          rec.start();
        } catch {}
      }
    };

    activeSpeechRec = rec;
    rec.start();
  } catch (err) {
    interviewState.speechError = "Could not start SpeechRecognition: " + err.message;
  }
  renderInterview();
}

function stopVoiceRecording() {
  if (!interviewState) return;
  if (activeSpeechRec) {
    try {
      activeSpeechRec.onend = null;
      activeSpeechRec.stop();
    } catch {}
    activeSpeechRec = null;
  }
  if (interviewState.recordStartTime) {
    interviewState.recordDurationSec += Math.max(1, Math.round((Date.now() - interviewState.recordStartTime) / 1000));
    interviewState.recordStartTime = null;
  }
  const editorVal = $("transcriptEditor")?.value;
  if (typeof editorVal === "string" && editorVal.trim()) {
    interviewState.liveTranscript = editorVal.trim();
  }
  interviewState.interimTranscript = "";
  interviewState.stage = "transcript_review";
  setDuckState("idle");
  renderInterview();
}

function reRecordAnswer() {
  if (!interviewState) return;
  interviewState.restarts = (interviewState.restarts || 0) + 1;
  interviewState.liveTranscript = "";
  interviewState.interimTranscript = "";
  interviewState.recordDurationSec = 0;
  interviewState.stage = "ready_to_record";
  renderInterview();
}

function stopAllAudioAndRecording() {
  stopMicMonitor();
  if (ttsState.supported) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  if (activeSpeechRec) {
    try {
      activeSpeechRec.onend = null;
      activeSpeechRec.stop();
    } catch {}
    activeSpeechRec = null;
  }
}

// ============================================================================
// 5 & 6. SUBMIT TRANSCRIPT -> AI EVALUATION -> ADAPTIVE NEXT QUESTION
// ============================================================================
async function submitSpokenAnswer() {
  if (!interviewState) return;
  const transcript = ($("transcriptEditor")?.value ?? interviewState.liveTranscript).trim();
  interviewState.liveTranscript = transcript;
  interviewState.stage = "evaluating";
  setDuckState("evaluating");
  renderInterview();

  try {
    const res = await apiRequest("/api/interview/evaluate-turn", {
      method: "POST",
      body: JSON.stringify({
        questionId: interviewState.currentQuestion.id,
        customQuestion: interviewState.currentQuestion,
        transcript,
        history: interviewState.turns,
        mode: interviewState.mode,
        hintsUsed: interviewState.hintsUsedThisTurn,
        audioMetrics: {
          durationSec: interviewState.recordDurationSec,
          pauseCount: interviewState.pauseCount,
          restarts: interviewState.restarts
        }
      })
    });

    const evaluation = res.evaluation;
    interviewState.lastTurnEval = evaluation;
    interviewState.turns.push({
      turnNumber: interviewState.turnIndex + 1,
      questionId: interviewState.currentQuestion.id,
      question: interviewState.currentQuestion.text,
      difficulty: interviewState.currentQuestion.difficulty,
      transcript,
      hintsUsed: interviewState.hintsUsedThisTurn,
      classification: evaluation.classification,
      evaluation
    });

    interviewState.stage = "turn_feedback";
    setDuckState("reacting");
    renderInterview();

    // In Practice/Challenge, Duck gives brief spoken transition or reads adaptive follow-up when advancing
    if (interviewState.scheme !== "pato-entry-10" && interviewState.mode !== "Assessment" && !ttsState.muted) {
      const briefSpoken =
        evaluation.classification === "strong"
          ? "Your explanation is clear and well-reasoned. Proceed to the next question."
          : evaluation.classification === "incorrect"
          ? "That concept needs clarification. Review the principle, then address the next question."
          : "Answer received. Please explain your main point a little more clearly.";
      speakDuckText(briefSpoken);
    }
  } catch (err) {
    toast("Evaluation error: " + err.message);
    interviewState.stage = "transcript_review";
    setDuckState("idle");
    renderInterview();
  }
}

function advanceToAdaptiveNextQuestion() {
  if (!interviewState) return;
  if (interviewState.turnIndex + 1 >= interviewState.maxTurns) {
    finalizeInterviewSession();
    return;
  }
  const prevEval = interviewState.lastTurnEval;
  const baseQ = interviewState.currentQuestion;
  const nextDifficulty =
    prevEval.classification === "strong"
      ? "Advanced"
      : prevEval.classification === "incorrect" || prevEval.classification === "unassessable"
      ? "Beginner"
      : baseQ.difficulty;

  // Build adaptive follow-up question object anchored in the student's actual answer & BSIT domain
  const adaptiveQuestion = {
    ...baseQ,
    id: baseQ.id * 100 + interviewState.turnIndex + 1,
    difficulty: nextDifficulty,
    text: prevEval.followupQuestion,
    concepts: prevEval.conceptsMissing?.length ? prevEval.conceptsMissing : baseQ.concepts
  };

  interviewState.turnIndex++;
  interviewState.currentQuestion = adaptiveQuestion;
  interviewState.lastTurnEval = null;
  // Follow strict sequence: Countdown -> Duck Speaks Adaptive Question -> Student Records
  startTurnCountdown();
}

async function finalizeInterviewSession() {
  if (!interviewState) return;
  stopAllAudioAndRecording();
  try {
    const res = await apiRequest("/api/interview/complete", {
      method: "POST",
      body: JSON.stringify({
        sessionId: interviewState.sessionId,
        category: interviewState.category,
        mode: interviewState.mode,
        scenarioTitle: interviewState.scenarioTitle,
        turns: interviewState.turns
      })
    });
    lastCompletedSession = res.session;
    lastEarnedRewards = {
      earnedXp: res.earnedXp,
      earnedCoins: res.earnedCoins,
      newAchievements: res.newAchievements || []
    };
    interviewState = null;
    await refreshServerState();
    navigate("results");
  } catch (err) {
    toast("Could not save session: " + err.message);
  }
}

// Duck Hint Ladder (3 optional levels in Practice Mode, 1 in Challenge, 0 in Assessment)
function unlockNextHint() {
  if (!interviewState) return;
  const maxAllowed = interviewState.mode === "Assessment" ? 0 : interviewState.mode === "Challenge" ? 1 : 3;
  if (interviewState.unlockedHintLevel >= maxAllowed) {
    toast(`Maximum ${maxAllowed} hint(s) allowed in ${interviewState.mode} Mode.`);
    return;
  }
  interviewState.unlockedHintLevel++;
  interviewState.hintsUsedThisTurn = interviewState.unlockedHintLevel;
  interviewState.totalHintsUsed++;
  renderInterview();
}

// ============================================================================
// RENDER INTERVIEW STAGE UI
// ============================================================================
function renderInterview() {
  if (!interviewState) {
    navigate("select");
    return;
  }
  const st = interviewState;
  const q = st.currentQuestion;
  const progressPct = Math.round((st.turnIndex / st.maxTurns) * 100);
  const maxHints = st.mode === "Assessment" ? 0 : st.mode === "Challenge" ? 1 : 3;

  let mainStageHtml = "";

  if (st.stage === "mic_test") {
    mainStageHtml = `
      <section class="mic-test-card" aria-label="Microphone test">
        <div class="mic-test-top"><div><span class="mic-eyebrow">MICROPHONE TEST</span><h3>Microphone Test</h3><p class="mic-how">Press <strong>Start Microphone Test</strong> and allow microphone access. Speak normally so PATO can check that your microphone works. Press <strong>Record Voice Sample</strong>, then press <strong>Replay</strong> to hear your recording. Start Interview unlocks after you play back your sample.</p></div></div>
        ${micTestState.error ? `<div class="mic-error" role="alert">${escapeHtml(micTestState.error)}</div>` : ''}
        <div class="mic-test-main"><div class="mic-orb" id="micVisualizer" style="--mic-level:${Math.max(.08,(micTestState.level||0)/100)}"><span>🎙️</span></div><div class="mic-test-copy"><strong id="micLiveState" aria-live="polite">${escapeHtml(micTestState.status || 'Ready when you are')}</strong><p id="micStatus" role="status" aria-live="polite">${micTestState.passed?'Voice detected — microphone is ready':escapeHtml(micTestState.status || 'Click the microphone and speak for a few seconds.')}</p><div class="mic-meter-wrap" role="meter" aria-label="Live microphone input level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${micTestState.level||0}"><div id="micMeterFill" class="mic-meter-fill" style="width:${micTestState.level||0}%"></div></div><small id="micReadout">Peak ${micTestState.peak||0}% · Average ${micTestState.average||0}%</small></div></div>
        <div class="mic-actions"><button class="primary-btn" onclick="retryMicTest()">${micTestState.permissionGranted?'Test Microphone':'Start Microphone Test'}</button><button id="micRecordBtn" class="secondary-btn" onclick="recordMicTestClip()" ${!micTestState.permissionGranted || micTestState.recordingTest ? "disabled" : ""}>${micTestState.recordingTest?'Recording…':'Record Voice Sample'}</button></div>
      </section>

      ${
        micTestState.testAudioUrl
          ? `<div class="tip mic-replay-card">
              <strong>Voice Sample</strong>
              <div class="mic-playback-row">
                <button class="secondary-btn" onclick="replayMicTestClip()">▶ Replay</button>
                <audio id="micTestPlayback" controls preload="metadata" src="${micTestState.testAudioUrl}" style="flex:1;min-width:220px;height:36px" onplay="micTestState.listened=false;micTestState.passed=false" onended="micTestState.listened=true;micTestState.passed=true;renderInterview()"></audio>
              </div>
            </div>`
          : ""
      }

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--line);flex-wrap:wrap;gap:10px">
        <span></span>
        <button class="primary-btn" onclick="startTurnCountdown()" ${!(micTestState.permissionGranted && micTestState.recorded && micTestState.listened && micTestState.passed) ? "disabled" : ""}>
          Start Interview →
        </button>
      </div>
    `;
  } else if (st.stage === "countdown") {
    mainStageHtml = `
      <div class="countdown-overlay">
        <div class="question-label">GET READY · MICROPHONE LOCKED DURING COUNTDOWN</div>
        <div id="countdownNumber" class="countdown-num">${st.countdownVal || 3}</div>
        <p style="margin:10px 0 0;color:var(--muted);font-size:13px">PATO will speak Question ${st.turnIndex + 1} immediately after countdown.</p>
      </div>
    `;
  } else if (st.stage === "duck_speaking") {
    mainStageHtml = `
      <div class="question-label">TURN ${st.turnIndex + 1} OF ${st.maxTurns} · PATO IS SPEAKING</div>
      <div class="question-text">${escapeHtml(q.text)}</div>
      <div class="tip" style="background:#fef9c3;border-color:#fde047;color:#854d0e">
        🔊 <strong>Listen carefully:</strong> Recording is paused while PATO speaks so the interviewer's voice is never captured in your answer.
      </div>
      <button class="secondary-btn" onclick="if(window.speechSynthesis)window.speechSynthesis.cancel(); interviewState.stage='ready_to_record'; setDuckState('idle'); renderInterview();">
        Skip Voice Playback &amp; Ready to Record →
      </button>
    `;
  } else if (st.stage === "ready_to_record" || st.stage === "recording" || st.stage === "transcript_review") {
    const isRec = st.stage === "recording";
    const isReview = st.stage === "transcript_review";
    mainStageHtml = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span class="question-label">TURN ${st.turnIndex + 1} OF ${st.maxTurns} · ${escapeHtml(q.difficulty)}</span>
        <span class="pill">${q.scheme === "pato-entry-10" ? "Behavioral Rubric" : q.type === "behavioral" ? "Behavioral Rubric" : "Technical Rubric"}</span>
      </div>
      <div class="question-text">${escapeHtml(q.text)}</div>

      <div class="tts-bar">
        <button class="small-btn" onclick="replayDuckQuestion()" ${isRec ? "disabled" : ""}>🔊 Replay Question</button>
        <button class="small-btn" onclick="toggleDuckMute()" ${isRec ? "disabled" : ""}>${ttsState.muted ? "🔇 Unmute Duck" : "🔈 Mute Duck"}</button>
        <label style="font-size:11px;font-weight:700;color:var(--muted);margin-left:auto">
          Voice Speed:
          <select class="inline-input" style="padding:4px 8px;font-size:11px" onchange="setDuckSpeed(this.value)" ${isRec ? "disabled" : ""}>
            <option value="0.85" ${ttsState.rate === 0.85 ? "selected" : ""}>0.85x</option>
            <option value="1" ${ttsState.rate === 1 ? "selected" : ""}>1.0x</option>
            <option value="1.15" ${ttsState.rate === 1.15 ? "selected" : ""}>1.15x</option>
          </select>
        </label>
      </div>

      ${st.speechError ? `<div class="tip" style="background:#fef3c7;border-color:#fcd34d;color:#92400e">${escapeHtml(st.speechError)}</div>` : ""}

      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px">
        ${
          isRec
            ? `<span class="rec-indicator">● RECORDING YOUR VOICE</span>
               <button class="primary-btn" style="background:#b91c1c" onclick="stopVoiceRecording()">⏹ Stop Recording</button>`
            : `<button class="primary-btn" onclick="startVoiceRecording()">🎙️ ${isReview ? "Continue Recording" : "Start Recording Answer"}</button>
               ${isReview ? `<button class="secondary-btn" onclick="reRecordAnswer()">↻ Clear &amp; Re-record</button>` : ""}`
        }
      </div>

      <label class="question-label" style="display:block;margin-bottom:6px">
        ${isRec ? "Live Speech-to-Text Transcript" : "Review & Verify Transcript Before Submission"}
      </label>
      <textarea id="transcriptEditor" class="answer-area" placeholder="Click 'Start Recording Answer' and speak clearly. Your spoken words appear here for review..." ${isRec ? "readonly" : ""} oninput="if(interviewState){interviewState.submitError='';}document.getElementById('submitError')?.remove()">${escapeHtml(st.liveTranscript)}</textarea>

      ${st.submitError ? `<div id="submitError" class="mic-error" role="alert">${escapeHtml(st.submitError)}</div>` : ""}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;flex-wrap:wrap;gap:10px">
        <span style="font-size:11px;color:var(--muted)">
          Speak naturally; content is scored separately from delivery pace.
        </span>
        <button class="primary-btn" onclick="submitSpokenAnswer()" ${isRec ? "disabled" : ""}>
          Submit Answer
        </button>
      </div>
    `;
  } else if (st.stage === "evaluating") {
    mainStageHtml = `
      <div class="countdown-overlay">
        <div class="question-label">AI ANSWER CHECK</div>
        <h3 style="margin:12px 0 6px">Checking your answer and preparing feedback...</h3>
        <p style="margin:0;color:var(--muted);font-size:12.5px">Reviewing your answer and choosing the next question.</p>
      </div>
    `;
  } else if (st.stage === "turn_feedback") {
    const ev = st.lastTurnEval;
    const isAssessment = st.mode === "Assessment";
    mainStageHtml = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        <span class="question-label">TURN ${st.turnIndex + 1} EVALUATION &amp; ADAPTIVE BRANCH</span>
        <span class="pill ${ev.classification === "strong" ? "" : ev.classification === "incorrect" || ev.classification === "irrelevant" ? "danger" : "amber"}">
          ${escapeHtml(ev.classification.toUpperCase())} RESPONSE
        </span>
      </div>

      ${
        isAssessment
          ? `<div class="tip">
              <strong>Assessment Mode Active:</strong> Your answer has been recorded and evaluated. Detailed criterion scores and feedback will be unlocked at the end of the session.
            </div>`
          : `
            <div class="result-hero" style="padding:18px 20px;margin-bottom:14px">
              <div>
                <span class="eyebrow">TURN WEIGHTED SCORE · ${escapeHtml(ev.engine || "Rubric Engine")}</span>
                <h3 style="margin:4px 0">${escapeHtml(ev.scoreReason)}</h3>
                <p style="margin:4px 0 0;font-size:12px">Evidence: <em>"${escapeHtml(ev.transcriptEvidence)}"</em></p>
              </div>
              <div class="score-circle" style="width:76px;height:76px;font-size:21px">${ev.weightedScore}<small>/100</small></div>
            </div>

            <div class="feedback-grid" style="margin-top:0;margin-bottom:14px">
              <div class="feedback-card" style="padding:14px">
                <h4>✅ Concepts &amp; Strengths</h4>
                <p style="font-size:11.5px;margin:0">${(ev.strengths || []).map(escapeHtml).join("<br>")}</p>
              </div>
              <div class="feedback-card" style="padding:14px">
                <h4>🎯 Missing Concepts &amp; Next Step</h4>
                <p style="font-size:11.5px;margin:0">${escapeHtml(ev.actionableImprovement)}</p>
              </div>
            </div>
          `
      }

      <div class="branch-node">
        <div class="question-label">ADAPTIVE BRANCHING DECISION · ${escapeHtml(ev.difficultyShift)}</div>
        <p style="margin:5px 0;font-size:12px;color:var(--ink)">${escapeHtml(ev.branchReason)}</p>
        ${
          st.turnIndex + 1 >= st.maxTurns
            ? `<p style="margin:6px 0 0;font-size:12.5px;font-weight:700;color:var(--ptc)">All ${st.maxTurns} interview questions completed. Ready to generate your full report.</p>`
            : ''
        }
      </div>

      <div style="display:flex;justify-content:flex-end;align-items:center;margin-top:14px;flex-wrap:wrap;gap:10px">
        ${st.feedbackSpeaking ? `<span class="question-label" aria-live="polite">PATO is giving feedback…</span>` : ""}
        <button class="primary-btn" onclick="advanceToAdaptiveNextQuestion()" ${st.feedbackSpeaking ? "disabled" : ""}>
          ${st.feedbackSpeaking ? "Please wait for PATO’s feedback…" : (st.turnIndex + 1 < st.maxTurns ? "Continue to Question →" : "Complete Session & View Full Report →")}
        </button>
      </div>
    `;
  }

  $("pageContent").innerHTML = `
    <div class="welcome-row interview-heading-row">
      <div>
        <button class="secondary-btn back-pill" type="button" onclick="showBreakModal()">← Back to Dashboard</button>
        <h1>${escapeHtml(st.category)} Interview</h1>
        <p>${st.scenarioTitle ? escapeHtml(st.scenarioTitle) : "Adaptive branching dialogue powered by PATO Voice Evaluator"}</p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="pill ${st.mode === "Assessment" ? "gold" : st.mode === "Challenge" ? "amber" : ""}">${escapeHtml(st.mode.toUpperCase())} MODE</span>
      </div>
    </div>

    <div class="progress-track" style="margin-bottom:18px"><div class="progress-fill" style="width:${progressPct}%"></div></div>

    <div class="interview-layout">
      <div class="interview-box">${mainStageHtml}</div>

      <aside class="interview-side">
        <div id="duckStageContainer" class="duck-stage duck-bg-${escapeHtml((appState?.profile?.equipped?.background || "bg-ptc-mint").replace("bg-", ""))} duck-state-${ttsState.duckState}">
          ${renderDuckSvg(appState?.profile?.equipped, ttsState.duckState)}
          <span class="duck-state-badge">PATO: ${escapeHtml(ttsState.duckState.toUpperCase())}</span>
        </div>

        <div style="margin-top:16px">
          <h4 style="margin:0 0 8px;font:800 13px Manrope">🧭 Answer Blueprint Coach</h4>
          <div class="tip" style="font-size:11px">
            ${
              q.scheme === "pato-entry-10"
                ? "<strong>Simple Answer Guide:</strong><br>1. <strong>Main point:</strong> Answer the question<br>2. <strong>Explain:</strong> Say why it makes sense<br>3. <strong>Stay focused:</strong> Keep it clear and short"
                : q.type === "behavioral"
                ? "<strong>Behavioral Answer Guide:</strong><br>1. <strong>Answer:</strong> Give your main point<br>2. <strong>Explain:</strong> Share what you think and why<br>3. <strong>Keep it clear:</strong> Use simple words"
                : "<strong>Technical Answer Blueprint:</strong><br>1. <strong>Direct Answer:</strong> Define clearly<br>2. <strong>Explanation:</strong> Explain how &amp; why<br>3. <strong>Example:</strong> Project / lab scenario<br>4. <strong>Conclusion:</strong> Impact or best practice"
            }
          </div>
        </div>

        </aside>
    </div>
    <div class="modal-backdrop hidden" id="interviewBreakModal" role="dialog" aria-modal="true" aria-labelledby="interviewBreakTitle">
      <div class="modal-card">
        <h3 id="interviewBreakTitle">Take a Break?</h3>
        <p>You can take a break now and continue your interview later, or return to your current lesson.</p>
        <div class="modal-actions">
          <button class="secondary-btn" type="button" onclick="takeInterviewBreak()">Take a Break</button>
          <button class="primary-btn" type="button" onclick="closeBreakModal()">Continue Lesson</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 6 & 7. RESULTS REPORT, BRANCH TRACE & ANSWER EVOLUTION
// ============================================================================
function renderResults() {
  const s = lastCompletedSession || (appState?.profile?.sessions || []).slice(-1)[0];
  if (!s) {
    $("pageContent").innerHTML = `<div class="empty">No evaluated session found yet.</div>`;
    return;
  }

  // Aggregate criterion averages across all turns in this session
  const critMap = {};
  for (const t of s.turns || []) {
    for (const c of t.evaluation?.criteria || []) {
      if (!critMap[c.name]) critMap[c.name] = { name: c.name, weight: c.weight, sum: 0, count: 0 };
      critMap[c.name].sum += Number(c.rating || 0);
      critMap[c.name].count++;
    }
  }
  const aggCriteria = Object.values(critMap).map(c => ({
    name: c.name,
    weight: c.weight,
    rating: c.count ? Number((c.sum / c.count).toFixed(1)) : 0
  }));

  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Automated Communication-Score Report</h1>
        <p>${escapeHtml(s.category)} · ${escapeHtml(s.mode)} Mode · ${new Date(s.date).toLocaleString()}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="secondary-btn" onclick="navigate('dna')">🧬 My Progress</button>
        <button class="primary-btn" onclick="navigate('select')">🎙️ New Session →</button>
      </div>
    </div>

    ${
      lastEarnedRewards
        ? `<div class="tip" style="background:#ecfdf5;border-color:#6ee7b7;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <span>🎉 <strong>Session Rewards Earned:</strong> +${lastEarnedRewards.earnedXp} XP &amp; +${lastEarnedRewards.earnedCoins} Duck Coins persisted to your PTC profile!</span>
            ${
              lastEarnedRewards.newAchievements?.length
                ? `<span class="pill gold">🏆 Unlocked: ${lastEarnedRewards.newAchievements.map(a => escapeHtml(a.title)).join(", ")}</span>`
                : ""
            }
          </div>`
        : ""
    }

    <div class="result-hero">
      <div>
        <span class="eyebrow">PATEROS TECHNOLOGICAL COLLEGE · RUBRIC EVALUATION</span>
        <h3 style="margin:6px 0">${escapeHtml(s.category)} Assessment Summary</h3>
        <p style="margin:0;color:#dcf5e4;font-size:12.5px">Every criterion is scored on a 0–5 evidence scale and separated from observational audio-delivery indicators.</p>
      </div>
      <div class="score-circle">${s.score}<small>/ 100</small></div>
    </div>

    <div class="feedback-grid" style="margin:14px 0">
      <div class="feedback-card">
        <h4>🧠 Job Interview Skill Score</h4>
        <p style="font-size:26px;margin:6px 0"><strong>${s.jobInterviewSkillScore ?? s.score}/100</strong></p>
        <p style="font-size:11.5px;margin:0">Separate measure of interview-response quality, relevance, reasoning, organization, and clarity.</p>
      </div>
      <div class="feedback-card">
        <h4>🔊 Voice Score</h4>
        <p style="font-size:26px;margin:6px 0"><strong>${s.voiceScore ?? "Not assessed"}${s.voiceScore != null ? "/100" : ""}</strong></p>
        <p style="font-size:11.5px;margin:0">Separate measure of spoken delivery: pace, fluency, pauses, fillers, and response engagement.</p>
      </div>
    </div>

    <div class="panel">
      <h3>Weighted Rubric Breakdown (0–5 Criterion Scale)</h3>
      <p class="panel-sub">Calculated transparently from your spoken transcript evidence across ${(s.turns || []).length} adaptive turn(s).</p>
      <div class="criteria">
        ${aggCriteria
          .map(
            c => `
          <div class="criteria-row">
            <span><strong>${escapeHtml(c.name)}</strong> (${c.weight}%)</span>
            <div class="bar"><span style="width:${(c.rating / 5) * 100}%"></span></div>
            <strong>${c.rating.toFixed(1)}/5</strong>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="section-head">
      <h3>🌿 Branch Trace &amp; Turn-by-Turn Evidence</h3>
      <span>Shows how each spoken response triggered the next adaptive question</span>
    </div>

    ${(s.turns || [])
      .map((t, idx) => {
        const ev = t.evaluation || {};
        const ad = ev.audioDelivery || {};
        return `
        <div class="branch-node">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            <div>
              <span class="question-label">TURN ${idx + 1} · ${escapeHtml(t.difficulty || "Standard")}</span>
              <span class="pill ${ev.classification === "strong" ? "" : ev.classification === "incorrect" || ev.classification === "irrelevant" ? "danger" : "amber"}" style="margin-left:6px">
                ${escapeHtml((ev.classification || "").toUpperCase())} (${ev.weightedScore}/100)
              </span>
            </div>
            <button class="small-btn" onclick="openAnswerEvolutionModal('${escapeHtml(String(s.id))}', ${idx})">🔄 Answer Evolution (Retry &amp; Compare)</button>
          </div>

          <strong style="font-size:14px;display:block;margin-bottom:6px">Q${idx + 1}: ${escapeHtml(t.question)}</strong>
          <div class="tip" style="background:#fff">
            <strong>Your Spoken Transcript:</strong> "${escapeHtml(t.transcript)}"
          </div>

          <p style="font-size:12px;margin:8px 0"><strong>Why this score:</strong> ${escapeHtml(ev.scoreReason)}</p>
          <p style="font-size:12px;margin:4px 0;color:var(--ptc)"><strong>Branch Trigger:</strong> ${escapeHtml(ev.branchReason)}</p>

          <div class="feedback-grid" style="margin-top:10px">
            <div class="feedback-card" style="padding:13px">
              <h4>Concept Detection</h4>
              <p style="font-size:11px;margin:0">
                <strong>Explained:</strong> ${(ev.conceptsExplained || []).join(", ") || "None"}<br>
                <strong>Mentioned only:</strong> ${(ev.conceptsMentioned || []).join(", ") || "None"}<br>
                <strong>Missing:</strong> ${(ev.conceptsMissing || []).join(", ") || "None"}
              </p>
            </div>
            <div class="feedback-card" style="padding:13px">
              <h4>Audio Delivery (Observational · Non-Graded)</h4>
              <p style="font-size:11px;margin:0">
                <strong>Pace:</strong> ${escapeHtml(ad.wpm || "Not assessed")} · <strong>Pauses:</strong> ${escapeHtml(ad.pauseCount || "Not assessed")}<br>
                <strong>Restarts:</strong> ${escapeHtml(ad.restarts || "Not assessed")}<br>
                <em>${escapeHtml(ad.clarityNote || "Accent is never penalized.")}</em>
              </p>
            </div>
          </div>

          ${
            (t.revisions || []).length
              ? `<div class="tip" style="margin-top:10px;background:#ecfdf5;border-color:#6ee7b7">
                  <strong>Answer Evolution History (${t.revisions.length} revision):</strong>
                  Latest score: <strong>${t.revisions[t.revisions.length - 1].evaluation.weightedScore}/100</strong>
                  (${t.revisions[t.revisions.length - 1].delta >= 0 ? "+" : ""}${t.revisions[t.revisions.length - 1].delta} pts vs original)
                </div>`
              : ""
          }
        </div>`;
      })
      .join("")}
  `;
}

// ============================================================================
// 7. ANSWER EVOLUTION MODAL (RETRY & COMPARE USING SAME RUBRIC)
// ============================================================================
function openAnswerEvolutionModal(sessionId, turnIndex) {
  const session = (appState?.profile?.sessions || []).find(s => String(s.id) === String(sessionId));
  if (!session) return;
  const turn = session.turns[turnIndex];
  if (!turn) return;

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "evolutionModal";
  modal.innerHTML = `
    <div class="modal">
      <h3>🔄 Answer Evolution: Retry &amp; Rubric Comparison</h3>
      <p class="panel-sub">Revise your answer using the feedback below. PATO re-evaluates with the exact same rubric and compares every criterion.</p>
      <div class="tip">
        <strong>Original Question:</strong> ${escapeHtml(turn.question)}<br>
        <strong>Original Score:</strong> ${turn.evaluation.weightedScore}/100 (${escapeHtml(turn.evaluation.classification.toUpperCase())})<br>
        <strong>Actionable Improvement Target:</strong> ${escapeHtml(turn.evaluation.actionableImprovement)}
      </div>
      <label>Original Transcript</label>
      <textarea readonly style="background:#f8faf9;min-height:60px">${escapeHtml(turn.transcript)}</textarea>
      <label>Revised Answer (Edit or speak improved response)</label>
      <textarea id="evolutionInput" placeholder="Write or dictate an improved answer that addresses the missing points..."></textarea>
      <div id="evolutionComparisonBox"></div>
      <div class="modal-actions">
        <button class="secondary-btn" onclick="document.getElementById('evolutionModal')?.remove()">Close</button>
        <button class="primary-btn" id="runEvolutionBtn" onclick="submitAnswerEvolution('${escapeHtml(String(sessionId))}', ${turnIndex})">Evaluate &amp; Compare →</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function submitAnswerEvolution(sessionId, turnIndex) {
  const revisedTranscript = $("evolutionInput")?.value.trim();
  if (!revisedTranscript || revisedTranscript.length < 5) {
    toast("Please enter your revised answer first.");
    return;
  }
  const btn = $("runEvolutionBtn");
  if (btn) btn.disabled = true;
  try {
    const res = await apiRequest("/api/interview/evolve", {
      method: "POST",
      body: JSON.stringify({ sessionId, turnIndex, revisedTranscript })
    });
    await refreshServerState();
    const box = $("evolutionComparisonBox");
    if (box) {
      box.innerHTML = `
        <div class="tip" style="background:#ecfdf5;border-color:#6ee7b7;margin-top:10px">
          <strong>Comparison Result:</strong> Original <strong>${res.original.weightedScore}/100</strong> → Revised <strong>${res.revised.weightedScore}/100</strong>
          (<strong>${res.delta >= 0 ? "+" : ""}${res.delta} pts</strong>)
          ${res.reward?.xp ? `<br>🎉 Improvement Reward: +${res.reward.xp} XP, +${res.reward.coins} Coins!` : ""}
          <br><strong>Explained Concepts Now:</strong> ${(res.revised.conceptsExplained || []).join(", ") || "None"}
          <br><strong>Remaining Gaps:</strong> ${(res.revised.conceptsMissing || []).join(", ") || "All core concepts covered!"}
        </div>
      `;
    }
    if (currentPage === "results") {
      lastCompletedSession = (appState.profile.sessions || []).find(s => String(s.id) === String(sessionId));
      renderResults();
    }
  } catch (err) {
    toast(err.message);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ============================================================================
// 7 & 8. INTERVIEW DNA, FOCUS AREAS & COMPETENCY SKILL TREE
// ============================================================================
function renderCertificates() {
  const certificates=appState?.profile?.certificates||[];
  $("pageContent").innerHTML=`
    <div class="welcome-row"><div><h1>My Certificates</h1><p>Certificates earned from completed interview assessments.</p></div></div>
    ${certificates.length?`<div class="category-grid">${certificates.slice().sort((a,b)=>new Date(b.completedAt)-new Date(a.completedAt)).map(c=>`
      <div class="panel certificate-list-card"><span class="eyebrow">PATO · INTERVIEW ACHIEVEMENT</span><h3>${escapeHtml(c.achievement)}</h3><p><strong>${escapeHtml(c.lessonTitle)}</strong></p><p>Score: ${Number(c.score)}% · ${new Date(c.completedAt).toLocaleDateString()}</p><small>Certificate ID: ${escapeHtml(c.id)}</small><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="secondary-btn" onclick="viewCertificate('${escapeHtml(c.id)}')">View Certificate</button><button class="primary-btn" onclick="downloadCertificate('${escapeHtml(c.id)}')">Download PDF</button></div></div>`).join('')}</div>`:
    `<div class="panel"><h3>Your first certificate is waiting</h3><p class="panel-sub">Complete an interview, save your result, and earn at least 85% to receive a certificate. Certificates are only shown after they are awarded.</p><button class="primary-btn" onclick="navigate('select')">Start interview practice</button></div>`}
  `;
}
function certificateMarkup(c) {
  return `<article class="pato-certificate"><div class="certificate-frame"><div class="certificate-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#1f6842" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/><circle cx="12" cy="12" r="2"/></svg></div><div class="certificate-kicker">PATEROS TECHNOLOGICAL COLLEGE</div><h1>CERTIFICATE OF ACHIEVEMENT</h1><p class="certificate-intro">This certificate is proudly presented to</p><h2>${escapeHtml(c.studentName)}</h2><p>for successfully completing the interview practice assessment</p><h3>${escapeHtml(c.lessonTitle)}</h3><div class="certificate-score">${Number(c.score)}%</div><div class="certificate-level">${escapeHtml(c.achievement)}</div><div class="certificate-meta"><span>Completion date<br><strong>${new Date(c.completedAt).toLocaleDateString()}</strong></span><span>Certificate ID<br><strong>${escapeHtml(c.id)}</strong></span></div></div></article>`;
}
function getCertificate(id) { return (appState?.profile?.certificates||[]).find(c=>c.id===id); }
function viewCertificate(id) {
  const c=getCertificate(id); if(!c) return toast('Certificate not found.');
  const win=window.open('','_blank'); if(!win) return toast('Allow pop-ups to view your certificate.');
  win.document.write(`<!doctype html><html><head><title>PATO Certificate</title><style>
  @page{size:landscape;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:Georgia,serif;color:#173c2a;background:#fff}.pato-certificate{width:100%;min-height:180mm;padding:12mm}.certificate-frame{height:100%;min-height:160mm;border:8px double #1f6842;padding:16mm;text-align:center;position:relative}.certificate-frame:before{content:'';position:absolute;inset:5mm;border:1px solid #c49a43;pointer-events:none}.certificate-icon{width:64px;height:64px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;border:2px solid #1f6842;border-radius:14px;background:#f2faf5}.certificate-icon svg{width:40px;height:40px}.certificate-kicker{letter-spacing:4px;font:700 13px Arial;color:#1f6842}.certificate-frame h1{font:700 30px Arial;letter-spacing:3px;margin:18px}.certificate-intro{margin-top:28px}.certificate-frame h2{font-size:38px;color:#174d32;border-bottom:1px solid #c49a43;display:inline-block;padding:0 35px 8px}.certificate-frame h3{font-size:22px}.certificate-score{font:bold 28px Arial;color:#174d32}.certificate-level{font:bold 15px Arial;letter-spacing:3px;color:#a77a20;margin:8px}.certificate-meta{display:flex;justify-content:space-between;margin-top:26px;font:12px Arial}.certificate-meta span{min-width:220px}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}</style></head><body>${certificateMarkup(c)}</body></html>`);
  win.document.close();
}
function downloadCertificate(id) {
  const c=getCertificate(id); if(!c) return toast('Certificate not found.');
  const win=window.open('','_blank'); if(!win) return toast('Allow pop-ups to download or print your certificate.');
  win.document.write(`<!doctype html><html><head><title>${escapeHtml(c.id)}</title><style>@page{size:landscape;margin:12mm}body{font-family:Georgia,serif;color:#173c2a}.pato-certificate{padding:10mm}.certificate-frame{border:8px double #1f6842;outline:1px solid #c49a43;outline-offset:-14px;padding:18mm;text-align:center;min-height:170mm}.certificate-kicker{letter-spacing:4px;color:#1f6842;font:bold 13px Arial}.certificate-frame h1{font:700 30px Arial;letter-spacing:3px}.certificate-frame h2{font-size:38px;color:#174d32}.certificate-frame h3{font-size:22px}.certificate-score{font:bold 28px Arial;color:#174d32}.certificate-level{font:bold 15px Arial;letter-spacing:3px;color:#a77a20}.certificate-meta{display:flex;justify-content:space-between;margin-top:28px;font:12px Arial}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${certificateMarkup(c)}<script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}

function renderDnaAndSkills() {
  const sessions = (appState?.profile?.sessions || []).filter(s =>
    ['completed','complete','finished',undefined].includes(String(s.status || 'completed').toLowerCase()) &&
    Number.isFinite(Number(s.jobInterviewSkillScore ?? s.score))
  ).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const scores = sessions.map(s=>Number(s.jobInterviewSkillScore ?? s.score));
  const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
  const highest = scores.length ? Math.max(...scores) : null;
  const recent = scores.slice(-3), prior = scores.slice(-6,-3);
  const trend = recent.length && prior.length
    ? (recent.reduce((a,b)=>a+b,0)/recent.length - prior.reduce((a,b)=>a+b,0)/prior.length)
    : null;
  const criterionMap = {};
  sessions.forEach(s=>(s.turns||[]).forEach(t=>(t.evaluation?.criteria||[]).forEach(c=>{
    const key=c.name || c.key || 'Interview skill';
    const item=criterionMap[key] ||= {name:key,focusArea:c.focusArea||key,total:0,count:0};
    item.total += Number(c.rating ?? 0); item.count++;
  })));
  const criteria=Object.values(criterionMap).map(x=>({...x,average:x.count?x.total/x.count:0})).sort((a,b)=>b.average-a.average);
  const strongest=criteria[0] || null, weakest=criteria.length?criteria[criteria.length-1]:null;
  const completedLessons=Object.values(appState?.profile?.lessonProgress||{}).filter(x=>x?.completed).length;
  const lessons=appState?.lessons||[];
  const recommended=weakest ? lessons.find(l=>(l.focusArea||'').toLowerCase() === String(weakest.focusArea||'').toLowerCase()) : null;
  const nextLesson=recommended;
  const history=sessions.slice(-10);
  $("pageContent").innerHTML = `
    <div class="welcome-row"><div><h1>Interview Performance</h1><p>A clear view of your completed interview results and areas to practise next.</p></div></div>
    <div class="metrics-band" style="margin-top:0">
      <div class="metric-card"><div class="metric-label">Average interview score</div><div class="metric-value">${avg===null?'—':avg+'<small> / 100</small>'}</div><div class="metric-sub">${sessions.length} completed interview${sessions.length===1?'':'s'}</div></div>
      
      <div class="metric-card"><div class="metric-label">Highest score</div><div class="metric-value">${highest===null?'—':highest+'<small> / 100</small>'}</div><div class="metric-sub">Your best completed interview</div></div>
      <div class="metric-card"><div class="metric-label">Progress trend</div><div class="metric-value" style="font-size:20px">${trend===null?'Not enough data':trend>1?'Improving':trend< -1?'Declining':'Consistent'}</div><div class="metric-sub">${trend===null?'Complete more interviews to see a trend':'Compared with the previous three completed interviews'}</div></div>
    </div>
    ${!sessions.length?`<div class="panel"><h3>Your interview progress will appear here</h3><p class="panel-sub">Complete an interview to see your real scores, strengths, and practice suggestions. No sample data is shown.</p><button class="primary-btn" onclick="navigate('select')">Start interview practice</button></div>`:`
    <div class="feedback-grid" style="margin-top:18px">
      <div class="panel"><h3>Strongest area</h3><p class="panel-sub">${strongest?`${escapeHtml(strongest.name)} · ${strongest.average.toFixed(1)} / 5 average`:'Not enough evaluation data'}</p><p>${strongest?'Keep using this skill in your next interview.':'Complete more evaluated questions to identify a strength.'}</p></div>
      <div class="panel"><h3>Area to improve</h3><p class="panel-sub">${weakest?`${escapeHtml(weakest.name)} · ${weakest.average.toFixed(1)} / 5 average`:'Not enough evaluation data'}</p><p>${weakest?'Review the feedback for this criterion and practise explaining your answer with clear examples.':'More evaluation data is needed before suggesting an improvement area.'}</p></div>
    </div>
    <div class="panel" style="margin-top:18px"><h3>Score history</h3><p class="panel-sub">Your latest completed interviews, in chronological order.</p>
      <div style="display:grid;gap:10px">${history.map((s,i)=>{const score=Number(s.jobInterviewSkillScore??s.score);return `<div style="display:grid;grid-template-columns:minmax(100px,1fr) 3fr 54px;gap:12px;align-items:center"><span style="font-size:12px">${escapeHtml(s.category||'Interview')}<small style="display:block;color:var(--muted)">${new Date(s.date).toLocaleDateString()}</small></span><div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,score))}%"></div></div><strong>${score}%</strong></div>`}).join('')}</div>
    </div>
    <div class="panel" style="margin-top:18px"><h3>Recommended next practice</h3><p class="panel-sub">${nextLesson?escapeHtml(nextLesson.title):'No existing lesson is mapped to this area yet.'}</p><p>${weakest?`Based on your lowest recorded evaluation area: ${escapeHtml(weakest.name)}.`:'No existing lesson is currently mapped to this evaluation area.'}</p>${nextLesson?`<button class="primary-btn" onclick="openLessonModal('${escapeHtml(nextLesson.id)}')">Practise this lesson</button>`:''}</div>`}
  `;
}

// ============================================================================
// 7. SCENARIO SHIFT (REALISTIC BSIT WORKPLACE TROUBLESHOOTING LABS)
// ============================================================================
function renderScenarios() {
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Scenario Shift: Realistic BSIT Workplace Incidents</h1>
        <p>Step into live Pateros Technological College IT incidents and defend your root-cause diagnosis by voice.</p>
      </div>
    </div>
    <div class="category-grid-3">
      ${SCENARIO_SHIFTS.map(
        sc => `
        <div class="category-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="pill">${escapeHtml(sc.category)}</span>
            <span class="pill amber">${escapeHtml(sc.difficulty)}</span>
          </div>
          <h4>${escapeHtml(sc.title)}</h4>
          <p>${escapeHtml(sc.brief)}</p>
          <button class="primary-btn" style="margin-top:auto" onclick="launchScenarioShift('${escapeHtml(sc.id)}')">Launch Scenario Simulation →</button>
        </div>`
      ).join("")}
    </div>
  `;
}

function launchScenarioShift(scenId) {
  const sc = SCENARIO_SHIFTS.find(s => s.id === scenId);
  if (!sc) return;
  startInterviewSession({
    category: sc.category,
    mode: "Challenge",
    firstQuestion: sc.question,
    scenarioTitle: sc.title
  });
}

// ============================================================================
// 10. LEARNING HUB (OBJECTIVES, MATERIAL, EXAMPLES, SPOKEN TASK & FEEDBACK)
// ============================================================================
function renderLearningHub() {
  const lessons = appState?.lessons || [];
  const prog = appState?.profile?.lessonProgress || {};

  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>BSIT Learning Hub</h1>
        <p>Study structured concepts and examples, then complete the spoken communication task with instant rubric feedback.</p>
      </div>
    </div>

    <div class="category-grid-3">
      ${lessons
        .map(les => {
          const lp = prog[les.id];
          return `
          <div class="category-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <span class="pill">${escapeHtml(les.category)}</span>
              <span class="pill ${lp?.completed ? "" : "gray"}">${lp?.completed ? `✅ Passed (${lp.bestScore}%)` : escapeHtml(les.difficulty)}</span>
            </div>
            <h4>${escapeHtml(les.title)}</h4>
            <p><strong>Focus Area:</strong> ${escapeHtml(les.focusArea)}<br>${escapeHtml((les.objectives || [])[0] || "")}</p>
            <button class="primary-btn" style="margin-top:auto" onclick="openLessonModal('${escapeHtml(les.id)}')">
              ${lp?.completed ? "Review & Retry Spoken Task" : "Start Lesson & Spoken Task →"}
            </button>
          </div>`;
        })
        .join("")}
    </div>
  `;
}

function openLessonModal(lessonId) {
  const les = (appState?.lessons || []).find(l => l.id === lessonId);
  if (!les) return;
  const lp = appState?.profile?.lessonProgress?.[les.id];

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "lessonModal";
  modal.innerHTML = `
    <div class="modal" style="width:min(100%,680px)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="pill">${escapeHtml(les.category)} · ${escapeHtml(les.focusArea)}</span>
        <button class="small-btn" onclick="speakDuckText(${JSON.stringify(les.spokenPrompt)})">🔊 Listen to Spoken Task</button>
      </div>
      <h3 style="margin-top:10px">${escapeHtml(les.title)}</h3>
      <div class="tip">
        <strong>Learning Objectives:</strong>
        <ul style="margin:6px 0 0;padding-left:18px">
          ${(les.objectives || []).map(o => `<li>${escapeHtml(o)}</li>`).join("")}
        </ul>
      </div>
      <p style="font-size:12.5px;line-height:1.65;color:var(--ink)">${escapeHtml(les.material)}</p>
      <div class="tip" style="background:#f0fdf4;border-color:#86efac">
        ${escapeHtml(les.example)}
      </div>

      <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
      <label class="question-label">SPOKEN PRACTICE TASK</label>
      <p style="font-weight:700;font-size:13.5px;margin:6px 0 10px">${escapeHtml(les.spokenPrompt)}</p>
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <button class="secondary-btn" id="lessonRecBtn" onclick="toggleLessonDictation()">🎙️ Dictate Spoken Answer</button>
      </div>
      <textarea id="lessonTranscriptInput" placeholder="Speak using the button above or type your spoken response...">${lp?.lastTranscript ? escapeHtml(lp.lastTranscript) : ""}</textarea>
      <div id="lessonFeedbackArea"></div>

      <div class="modal-actions">
        <button class="secondary-btn" onclick="stopLessonDictation(); document.getElementById('lessonModal')?.remove()">Close</button>
        <button class="primary-btn" id="submitLessonBtn" onclick="submitLessonTask('${escapeHtml(les.id)}')">Evaluate Spoken Task →</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

let lessonRec = null;
function toggleLessonDictation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast("SpeechRecognition not supported in this browser; type your answer below.");
    return;
  }
  if (lessonRec) {
    stopLessonDictation();
    return;
  }
  const btn = $("lessonRecBtn");
  lessonRec = new SpeechRecognition();
  lessonRec.lang = "en-US";
  lessonRec.continuous = true;
  lessonRec.onresult = e => {
    let txt = "";
    for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript + " ";
    const box = $("lessonTranscriptInput");
    if (box) box.value = txt.trim();
  };
  lessonRec.onend = () => {
    lessonRec = null;
    if (btn) btn.textContent = "🎙️ Dictate Spoken Answer";
  };
  lessonRec.start();
  if (btn) btn.textContent = "⏹ Stop Dictation";
}

function stopLessonDictation() {
  if (lessonRec) {
    try {
      lessonRec.stop();
    } catch {}
    lessonRec = null;
  }
}

async function submitLessonTask(lessonId) {
  stopLessonDictation();
  const transcript = $("lessonTranscriptInput")?.value.trim();
  if (!transcript || transcript.length < 4) {
    toast("Please provide your spoken response before submitting.");
    return;
  }
  const btn = $("submitLessonBtn");
  if (btn) btn.disabled = true;
  try {
    const res = await apiRequest("/api/lessons/complete", {
      method: "POST",
      body: JSON.stringify({ lessonId, transcript })
    });
    await refreshServerState();
    const area = $("lessonFeedbackArea");
    if (area) {
      area.innerHTML = `
        <div class="tip" style="background:#ecfdf5;border-color:#6ee7b7;margin-top:10px">
          <strong>Lesson Score: ${res.evaluation.weightedScore}/100 (${escapeHtml(res.evaluation.classification.toUpperCase())})</strong>
          ${res.reward?.xp ? ` · 🎉 Earned +${res.reward.xp} XP &amp; +${res.reward.coins} Coins!` : ""}
          <p style="margin:6px 0 0">${escapeHtml(res.evaluation.scoreReason)}<br><strong>Tip:</strong> ${escapeHtml(res.evaluation.actionableImprovement)}</p>
        </div>
      `;
    }
    if (currentPage === "learning") renderLearningHub();
  } catch (err) {
    toast(err.message);
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ============================================================================
// 9. GAMIFICATION + DUCK WARDROBE (PREVIEW, EQUIP, SAVE, LOCKED/OWNED)
// ============================================================================
function renderWardrobe() {
  const p = appState?.profile;
  const catalog = appState?.wardrobeCatalog || [];
  if (!p) return;

  const activeEq = previewEquipped || p.equipped;
  const slots = ["all", "hat", "clothes", "glasses", "accessory", "background"];
  const visibleCatalog = catalog.filter(item => item.slot !== "shoes" && item.slot !== "identity" && item.id !== "IDENTITY");
  const filtered = visibleCatalog.filter(item => activeWardrobeSlot === "all" || item.slot === activeWardrobeSlot);

  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>PATO Wardrobe</h1>
        <p>Customize PATO using earned Coins. Cosmetics are purely visual and never influence rubric scores.</p>
      </div>
      <div style="display:flex;gap:8px">
        <span class="hud-chip">⭐ Level ${p.level}</span>
        <span class="hud-chip gold">🪙 ${p.coins} Coins Available</span>
      </div>
    </div>

    <div class="interview-layout wardrobe-layout">
      <div class="wardrobe-catalog-area">
        <div class="toolbar wardrobe-tabs">
          ${slots
            .map(
              s =>
                `<button class="small-btn ${activeWardrobeSlot === s ? "primary-btn" : ""}" onclick="activeWardrobeSlot='${s}'; renderWardrobe()">${s.toUpperCase()}</button>`
            )
            .join("")}
        </div>
        <div class="wardrobe-grid wardrobe-items">
          ${filtered
            .map(item => {
              const owned = (p.inventory || []).includes(item.id);
              const isEquipped = p.equipped?.[item.slot] === item.id;
              const canLevel = p.level >= item.minLevel;
              return `
              <div class="wardrobe-card ${isEquipped ? "equipped" : ""}">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:22px">${item.badge}</span>
                  <span class="pill ${isEquipped ? "" : owned ? "gray" : "amber"}">
                    ${isEquipped ? "EQUIPPED" : owned ? "OWNED" : `🪙 ${item.cost} · Lvl ${item.minLevel}+`}
                  </span>
                </div>
                <strong style="font-size:13px">${escapeHtml(item.name)}</strong>
                <span style="font-size:11px;color:var(--muted)">${escapeHtml(item.desc)}</span>
                <div style="display:flex;gap:6px;margin-top:auto;padding-top:6px">
                  <button class="secondary-btn" style="padding:6px 10px;font-size:10.5px" onclick="previewWardrobeItem('${escapeHtml(item.slot)}', '${escapeHtml(item.id)}')">Preview</button>
                  ${
                    isEquipped
                      ? `<button class="small-btn" disabled>Active</button>`
                      : owned
                      ? `<button class="primary-btn" style="padding:6px 11px;font-size:10.5px" onclick="wardrobeAction('equip', '${escapeHtml(item.id)}')">Equip &amp; Save</button>`
                      : `<button class="primary-btn" style="padding:6px 11px;font-size:10.5px" ${!canLevel || p.coins < item.cost ? "disabled" : ""} onclick="wardrobeAction('buy', '${escapeHtml(item.id)}')">Unlock (${item.cost} 🪙)</button>`
                  }
                </div>
              </div>`;
            })
            .join("")}
        </div>
      </div>

      <aside class="interview-side">
        <h3 style="margin:0 0 4px;font-size:18px">PATO Outfit Preview</h3><p style="margin:0 0 12px;color:var(--muted);font-size:12px">Preview cosmetics on the 3D avatar before equipping.</p>
        <div class="duck-stage duck-bg-${escapeHtml((activeEq?.background || "bg-ptc-mint").replace("bg-", ""))} duck-state-idle">
          ${renderDuckSvg(activeEq, "idle")}
          <span class="duck-state-badge">${previewEquipped ? "PREVIEW MODE" : "SAVED OUTFIT"}</span>
        </div>
        ${
          previewEquipped
            ? `<button class="secondary-btn" style="width:100%;justify-content:center;margin-top:10px" onclick="previewEquipped=null; renderWardrobe()">Reset Preview</button>`
            : ""
        }

        <div style="margin-top:18px">
          <h4 style="margin:0 0 8px">🏆 Unlocked Achievements (${(p.achievements || []).length})</h4>
          ${
            (p.achievements || []).length
              ? p.achievements
                  .map(
                    a => `<div class="tip" style="font-size:11px"><strong>🏅 ${escapeHtml(a.title)}</strong><br>${escapeHtml(a.desc)}</div>`
                  )
                  .join("")
              : `<div class="tip" style="font-size:11px">Complete your first voice interview to unlock your first milestone badge!</div>`
          }
        </div>
      </aside>
    </div>
  `;
  mountWardrobePato();
}

function mountWardrobePato() {
  const stage=document.querySelector(".interview-side .duck-stage");
  if(!stage)return;
  stage.innerHTML=`<div class="pato-3d-stage"></div><span class="duck-state-badge">${previewEquipped?"PREVIEW MODE":"SAVED OUTFIT"}</span>`;
  const host=stage.querySelector(".pato-3d-stage");
  if(window.PATO3D&&window.THREE) {
    const avatar=window.PATO3D.mount(host,{background:"#e8f5ed",equipped:previewEquipped||appState.profile.equipped});
    avatar?.setState("idle");
  }
}
function previewWardrobeItem(slot, itemId) {
  previewEquipped = { ...(previewEquipped || appState.profile.equipped), [slot]: itemId };
  renderWardrobe();
}

async function wardrobeAction(action, itemId) {
  try {
    await apiRequest("/api/wardrobe/action", {
      method: "POST",
      body: JSON.stringify({ action, itemId })
    });
    previewEquipped = null;
    await refreshServerState();
    renderWardrobe();
    toast(action === "buy" ? "Wardrobe item unlocked and equipped!" : "Outfit saved!");
  } catch (err) {
    toast(err.message);
  }
}

// ============================================================================
// HISTORY VIEW
// ============================================================================
function renderHistory() {
  const mine = (appState?.profile?.sessions || []).slice().reverse();
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Interview History &amp; Answer Evolution</h1>
        <p>Inspect any past session to review rubric scores, Branch Trace decisions, or retry answers for comparison.</p>
      </div>
      <button class="primary-btn" onclick="navigate('select')">🎙️ New Voice Interview</button>
    </div>
    <div class="panel">
      ${renderSessionsTable(mine)}
    </div>
  `;
}

// ============================================================================
// 11. ADMINISTRATOR PORTAL (QUESTIONS, LESSONS, RUBRICS, REWARDS, ANALYTICS)
// ============================================================================
function renderAdmin() {
  const students = appState?.students || [];
  const allSessions = students.flatMap(st => st.sessions || []);
  const jobScores = allSessions.map(x => Number(x.jobInterviewSkillScore ?? x.score)).filter(Number.isFinite);
  const voiceScores = allSessions.map(x => x.voiceScore).filter(v => v != null && v !== '' && Number.isFinite(Number(v))).map(Number);
  const jobAvg = jobScores.length ? Math.round(jobScores.reduce((x, y) => x + y, 0) / jobScores.length) : null;
  const voiceAvg = voiceScores.length ? Math.round(voiceScores.reduce((x, y) => x + y, 0) / voiceScores.length) : null;
  const audit = appState?.auditLog || [];

  $("#pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Administrator Dashboard</h1>
        <p>Pateros Technological College · BSIT 2025–2026 · Separate Job Interview Skill Score and Voice Score governance</p>
      </div>
      <span class="pill">SERVER-PROTECTED ADMIN</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-top">Registered PTC Alumni <span class="stat-icon">👥</span></div>
        <div class="stat-value">${students.length}</div>
        <div class="stat-sub">Verified Google Workspace accounts</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">Completed Attempts <span class="stat-icon">🎙️</span></div>
        <div class="stat-value">${allSessions.length}</div>
        <div class="stat-sub">Persisted branching interview records</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">Job Interview Skill Score <span class="stat-icon">🧠</span></div>
        <div class="stat-value">${jobAvg === null ? '<span class="not-assessed">Not assessed yet</span>' : jobAvg + "/100"}</div>
        <div class="stat-sub">Separate interview-response measure</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">Voice Score <span class="stat-icon">🔊</span></div>
        <div class="stat-value">${voiceAvg === null ? '<span class="not-assessed">Not assessed yet</span>' : voiceAvg + "/100"}</div>
        <div class="stat-sub">Separate spoken-delivery measure</div>
      </div>
    </div>

    <div class="tip" style="margin:14px 0">
      <strong>Measurement rule:</strong> The Job Interview Skill Score and Voice Score are calculated, displayed, audited, and exported independently. No combined score is generated automatically.
    </div>

    <div class="category-grid-3">
      <div class="category-card">
        <div class="category-symbol">👥</div>
        <h4>Alumni Cohort</h4>
        <p>Review 2025–2026 BSIT alumni records, participation, and separate score averages.</p>
        <button class="text-link" onclick="navigate('users')">Manage Alumni →</button>
      </div>
      <div class="category-card">
        <div class="category-symbol">🧾</div>
        <h4>Score Audit</h4>
        <p>Inspect attempts, review both score breakdowns, and record documented overrides.</p>
        <button class="text-link" onclick="navigate('attempts')">Open Score Audit →</button>
      </div>
      <div class="category-card">
        <div class="category-symbol">🏅</div>
        <h4>Certificate Awards</h4>
        <p>Award certificates to students who meet the certification criteria across all roles or one selected role.</p>
        <button class="text-link" onclick="navigate('reports')">Open Certificate Awards →</button>
      </div>
    </div>

    <div class="category-grid-3">
      <div class="category-card">
        <div class="category-symbol">❓</div>
        <h4>Question & Branch Bank</h4>
        <p>Manage questions, concepts, misconceptions, and adaptive follow-up branches.</p>
        <button class="text-link" onclick="navigate('questions')">Manage Questions →</button>
      </div>
      <div class="category-card">
        <div class="category-symbol">🧠</div>
        <h4>Job Interview Skill Rules</h4>
        <p>Configure technical and behavioral rubric weights used for the interview-response score.</p>
        <button class="text-link" onclick="navigate('rules')">Configure Skill Score →</button>
      </div>
      <div class="category-card">
        <div class="category-symbol">🔊</div>
        <h4>Voice Score Rules</h4>
        <p>Configure the separate Voice Score criteria and review the latest audit activity.</p>
        <button class="text-link" onclick="navigate('voiceRules')">Configure Voice Score →</button>
      </div>
    </div>

    <div class="panel">
      <h3>Recent Admin Activity</h3>
      <p class="panel-sub">Append-only administrative audit trail.</p>
      ${
        audit.length
          ? `<div class="table-wrap"><table><thead><tr><th>Timestamp</th><th>Admin</th><th>Action</th><th>Target</th><th>Reason / Details</th></tr></thead><tbody>
            ${audit.slice().reverse().slice(0, 8).map(x => `<tr><td>${new Date(x.timestamp).toLocaleString()}</td><td>${escapeHtml(x.adminEmail)}</td><td>${escapeHtml(x.action)}</td><td>${escapeHtml(x.target)}</td><td>${escapeHtml(typeof x.details === "object" ? (x.details.reason || JSON.stringify(x.details)) : String(x.details || ""))}</td></tr>`).join("")}
          </tbody></table></div>`
          : `<div class="empty">No administrative actions recorded yet.</div>`
      }
    </div>
  `;
}

function renderUsers() {
  const students = appState?.students || [];
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>BSIT Student &amp; Alumni Records</h1>
        <p>Isolated per-student records from verified @paterostechnologicalcollege.edu.ph accounts.</p>
      </div>
    </div>
    <div class="panel">
      ${
        students.length
          ? `<div class="table-wrap"><table>
              <thead><tr><th>Student Name</th><th>PTC Institutional Email</th><th>Level / XP</th><th>Coins</th><th>Sessions</th><th>Job Interview Skill Score</th><th>Voice Score</th><th>Last Active</th></tr></thead>
              <tbody>
                ${students
                  .map(
                    u => `<tr>
                      <td><strong>${escapeHtml(u.name)}</strong></td>
                      <td>${escapeHtml(u.email)}</td>
                      <td>Lvl ${u.level} (${u.xp} XP)</td>
                      <td>${u.coins} 🪙</td>
                      <td>${u.sessionCount}</td>
                      <td><strong>${u.avgScore === null ? "Not assessed yet" : u.avgScore + "/100"}</strong></td>
                      <td><strong>${u.avgVoiceScore === null || u.avgVoiceScore === undefined ? "Not assessed yet" : u.avgVoiceScore + "/100"}</strong></td>
                      <td>${new Date(u.lastActive).toLocaleDateString()}</td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table></div>`
          : `<div class="empty">No student records yet. Students appear here automatically upon signing in with their PTC Google Workspace account.</div>`
      }
    </div>
  `;
}


function renderVoiceRules() {
  const vr = appState?.voiceRubric || {};
  const keys = Object.keys(vr);
  $("#pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Voice Score Configuration</h1>
        <p>Configure the separate Voice Score. This score is independent of the Job Interview Skill Score.</p>
      </div>
    </div>
    <div class="panel">
      <h3>Voice Score Criteria</h3>
      <p class="panel-sub">Each criterion is scored from observable spoken-delivery evidence. Weights must total 100%.</p>
      ${keys.length ? keys.map(k => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)">
          <span>${escapeHtml(vr[k].name || k)}</span>
          <input type="number" id="voiceW_${escapeHtml(k)}" value="${vr[k].weight}" min="0" max="100" class="inline-input" style="width:90px">
        </div>`).join("") : `<div class="empty">Voice Score rules are not yet configured.</div>`}
      <button class="primary-btn" style="margin-top:14px" onclick="saveVoiceRubric()">Save Voice Score Rules</button>
    </div>
    <div class="tip">
      <strong>Important:</strong> The Voice Score uses captured-audio delivery indicators such as pace, restarts, pauses, fillers, and response engagement. It remains separate from the Job Interview Skill Score.
    </div>
  `;
}

async function saveVoiceRubric() {
  const vr = appState?.voiceRubric || {};
  const next = {};
  Object.keys(vr).forEach(k => {
    next[k] = { ...vr[k], weight: Number($("voiceW_" + k)?.value || 0) };
  });
  try {
    const res = await apiRequest("/api/admin/voice-rubric", {
      method: "POST",
      body: JSON.stringify({ voiceRubric: next })
    });
    appState.voiceRubric = res.voiceRubric;
    appState.auditLog = res.auditLog;
    toast("Voice Score rules saved.");
    renderVoiceRules();
  } catch (err) {
    toast(err.message);
  }
}

function renderAttempts() {
  const students = appState?.students || [];
  const attempts = students.flatMap(st => (st.sessions || []).map(se => ({ student: st, session: se })));
  $("#pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Score Audit & Overrides</h1>
        <p>Review each attempt’s separate Job Interview Skill Score and Voice Score. Original automated results remain preserved.</p>
      </div>
    </div>
    <div class="panel">
      ${
        attempts.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Alumni</th><th>Attempt</th><th>Scenario</th><th>Job Interview Skill Score</th><th>Voice Score</th><th>Status</th><th>Action</th></tr></thead><tbody>
          ${attempts.map(({ student, session }) => `
            <tr>
              <td><strong>${escapeHtml(student.name)}</strong><br><span style="font-size:11px;color:var(--muted)">${escapeHtml(student.email)}</span></td>
              <td>${escapeHtml(String(session.id))}<br><span style="font-size:11px;color:var(--muted)">${new Date(session.date).toLocaleString()}</span></td>
              <td>${escapeHtml(session.category)} · ${escapeHtml(session.mode || "Practice")}</td>
              <td><strong>${session.jobInterviewSkillScore ?? session.score ?? "Not assessed"}/100</strong></td>
              <td><strong>${session.voiceScore ?? "Not assessed"}/100</strong></td>
              <td>
                <span class="pill ${session.jobInterviewSkillScoreStatus === "Overridden" || session.voiceScoreStatus === "Overridden" ? "danger" : ""}">
                  ${escapeHtml(session.jobInterviewSkillScoreStatus || "Automated")} · ${escapeHtml(session.voiceScoreStatus || "Automated")}
                </span>
              </td>
              <td><button class="small-btn" onclick="openScoreOverrideModal('${escapeHtml(student.email)}','${escapeHtml(String(session.id))}')">Review / Override</button></td>
            </tr>`).join("")}
        </tbody></table></div>` : `<div class="empty">No interview attempts recorded yet.</div>`
      }
    </div>
  `;
}

function openScoreOverrideModal(email, sessionId) {
  const student = (appState?.students || []).find(x => x.email === email);
  const session = student?.sessions?.find(x => String(x.id) === String(sessionId));
  if (!session) return;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "overrideModal";
  modal.innerHTML = `
    <div class="modal">
      <h3>Score Audit: ${escapeHtml(student.name)}</h3>
      <p class="panel-sub">Attempt ${escapeHtml(String(session.id))} · ${escapeHtml(session.category)} · ${new Date(session.date).toLocaleString()}</p>
      <div class="feedback-grid">
        <div class="feedback-card">
          <h4>Job Interview Skill Score</h4>
          <p><strong>${session.jobInterviewSkillScore ?? session.score ?? "Not assessed"}/100</strong></p>
          <p style="font-size:11px">Based on transcript evidence, rubric criteria, and branching responses.</p>
        </div>
        <div class="feedback-card">
          <h4>Voice Score</h4>
          <p><strong>${session.voiceScore ?? "Not assessed"}/100</strong></p>
          <p style="font-size:11px">Based on separate spoken-delivery indicators.</p>
        </div>
      </div>
      <label>Score to override</label>
      <select id="overrideType">
        <option value="jobInterviewSkill">Job Interview Skill Score</option>
        <option value="voice">Voice Score</option>
      </select>
      <label>Revised score (0–100)</label>
      <input type="number" id="overrideScore" min="0" max="100">
      <label>Required override reason</label>
      <textarea id="overrideReason" placeholder="Explain the audit finding, technical issue, or assessment reason."></textarea>
      <div class="modal-actions">
        <button class="secondary-btn" onclick="document.getElementById('overrideModal')?.remove()">Close</button>
        <button class="primary-btn" onclick="submitScoreOverride('${escapeHtml(email)}','${escapeHtml(String(sessionId))}')">Save Override</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function submitScoreOverride(email, sessionId) {
  const scoreType = $("overrideType")?.value;
  const revisedScore = Number($("overrideScore")?.value);
  const reason = $("overrideReason")?.value.trim();
  if (!reason) return toast("An override reason is required.");
  if (!Number.isFinite(revisedScore) || revisedScore < 0 || revisedScore > 100) return toast("Enter a revised score between 0 and 100.");
  try {
    const res = await apiRequest("/api/admin/score-override", {
      method: "POST",
      body: JSON.stringify({ email, sessionId, scoreType, revisedScore, reason })
    });
    await refreshServerState();
    document.getElementById("overrideModal")?.remove();
    toast("Override recorded. Original result remains in the audit trail.");
    renderAttempts();
  } catch (err) {
    toast(err.message);
  }
}

function renderReports() {
  const roles = BSIT_CATEGORIES.map(c => c.name);
  const attempts = appState?.attempts || [];
  const eligible = attempts.filter(a => {
    const score = Number(a.jobInterviewSkillScore ?? a.score);
    return Number.isFinite(score) && score >= 85 && score <= 100;
  });
  const byRole = roles.map(r => ({ role: r, count: eligible.filter(a => a.category === r).length }));
  $("#pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Certificate Awards</h1>
        <p>Award certificates to students who meet the certification criteria. Eligible completed interviews have a score of 85% or higher.</p>
      </div>
    </div>
    <section class="panel">
      <h3>Certification criteria</h3>
      <p class="panel-sub">Students become eligible when a completed interview reaches at least 85%. Certificates are awarded once per completed interview.</p>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-top">Eligible interviews</div><div class="stat-value">${eligible.length}</div><div class="stat-sub">Across all roles</div></div>
        ${byRole.map(r => `<div class="stat-card"><div class="stat-top">${escapeHtml(r.role)}</div><div class="stat-value">${r.count}</div><div class="stat-sub">Eligible interviews</div></div>`).join("")}
      </div>
    </section>
    <section class="panel">
      <h3>Award certificates</h3>
      <p class="panel-sub">Choose whether to award certificates across the whole system or for one job role only.</p>
      <div class="admin-form">
        <label for="certScope">Certificate scope</label>
        <select id="certScope">
          <option value="all">All roles</option>
          ${roles.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join("")}
        </select>
        <div class="profile-actions">
          <button class="primary-btn" onclick="awardCertificates()">🏅 Award Certificates</button>
        </div>
        <p id="certAwardStatus" role="status" aria-live="polite"></p>
      </div>
    </section>`;
}

async function awardCertificates() {
  const scope = document.getElementById("certScope")?.value || "all";
  const status = document.getElementById("certAwardStatus");
  if (status) status.textContent = "Awarding certificates…";
  try {
    const res = await apiRequest("/api/admin/certificates/award", {
      method: "POST",
      body: JSON.stringify({ category: scope })
    });
    if (status) status.textContent = `Awarded ${res.awarded} certificate(s).`;
    toast(`Awarded ${res.awarded} certificate(s).`);
    await refreshServerState();
  } catch (err) {
    if (status) status.textContent = "";
    toast(err.message);
  }
}

function renderQuestions() {
  const questions = appState?.questions || [];
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Adaptive Question, Concept &amp; Misconception Bank</h1>
        <p>Manage questions across all 8 BSIT categories with semantic concepts, misconceptions, and branch follow-ups.</p>
      </div>
      <button class="primary-btn" onclick="openAdminQuestionModal()">+ Add Question</button>
    </div>
    <div class="panel">
      <div class="toolbar">
        <select id="adminCatFilter" onchange="filterAdminQuestions()">
          <option value="all">All 8 BSIT Categories</option>
          ${BSIT_CATEGORIES.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join("")}
        </select>
      </div>
      <div id="adminQuestionTable"></div>
    </div>
  `;
  filterAdminQuestions();
}

function filterAdminQuestions() {
  const cat = $("adminCatFilter")?.value || "all";
  const list = (appState?.questions || []).filter(q => cat === "all" || q.category === cat);
  $("adminQuestionTable").innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Category</th><th>Difficulty</th><th>Question &amp; Concepts</th><th>Actions</th></tr></thead>
        <tbody>
          ${list
            .map(
              q => `<tr>
                <td><strong>${escapeHtml(q.category)}</strong><br><span class="pill gray">${escapeHtml(q.type || "technical")}</span></td>
                <td><span class="pill">${escapeHtml(q.difficulty || "Beginner")}</span></td>
                <td>
                  <strong>${escapeHtml(q.text)}</strong>
                  <div style="font-size:11px;color:var(--muted);margin-top:4px">Concepts: ${(q.concepts || []).map(escapeHtml).join(" · ")}</div>
                </td>
                <td style="white-space:nowrap">
                  <button class="small-btn" onclick="openAdminQuestionModal(${q.id})">Edit</button>
                  <button class="small-btn danger-btn" onclick="deleteAdminQuestion(${q.id})">Delete</button>
                </td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function openAdminQuestionModal(id = null) {
  const q = (appState?.questions || []).find(x => Number(x.id) === Number(id));
  editingQuestionId = id;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "adminQModal";
  modal.innerHTML = `
    <div class="modal">
      <h3>${q ? "Edit Adaptive Question" : "Add Adaptive Question"}</h3>
      <label>BSIT Category</label>
      <select id="aqCategory">
        ${BSIT_CATEGORIES.map(c => `<option value="${escapeHtml(c.name)}" ${q?.category === c.name ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
      </select>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <label>Rubric Type</label>
          <select id="aqType">
            <option value="technical" ${q?.type !== "behavioral" ? "selected" : ""}>Technical Rubric</option>
            <option value="behavioral" ${q?.type === "behavioral" ? "selected" : ""}>Behavioral Rubric</option>
          </select>
        </div>
        <div>
          <label>Difficulty</label>
          <select id="aqDiff">
            <option ${q?.difficulty === "Beginner" ? "selected" : ""}>Beginner</option>
            <option ${q?.difficulty === "Intermediate" ? "selected" : ""}>Intermediate</option>
            <option ${q?.difficulty === "Advanced" ? "selected" : ""}>Advanced</option>
          </select>
        </div>
      </div>
      <label>Main Question Prompt</label>
      <textarea id="aqText">${q ? escapeHtml(q.text) : ""}</textarea>
      <label>Target Keywords (comma-separated)</label>
      <input id="aqKeywords" value="${q ? escapeHtml((q.keywords || []).join(", ")) : ""}">
      <label>Expected Concepts (one per line)</label>
      <textarea id="aqConcepts">${q ? escapeHtml((q.concepts || []).join("\n")) : ""}</textarea>
      <label>Common Misconceptions (one per line)</label>
      <textarea id="aqMisconceptions">${q ? escapeHtml((q.misconceptions || []).join("\n")) : ""}</textarea>
      <label>Strong Answer Follow-Up</label>
      <textarea id="aqStrong">${q ? escapeHtml(q.followups?.strong || "") : ""}</textarea>
      <label>Incomplete / Keyword-Only Follow-Up</label>
      <textarea id="aqIncomplete">${q ? escapeHtml(q.followups?.incomplete || "") : ""}</textarea>
      <label>Incorrect / Vague / Irrelevant Follow-Up</label>
      <textarea id="aqWeak">${q ? escapeHtml(q.followups?.incorrect || "") : ""}</textarea>
      <label>Duck Hint Ladder (3 levels, one per line)</label>
      <textarea id="aqHints">${q ? escapeHtml((q.hints || []).join("\n")) : ""}</textarea>
      <div class="modal-actions">
        <button class="secondary-btn" onclick="document.getElementById('adminQModal')?.remove()">Cancel</button>
        <button class="primary-btn" onclick="saveAdminQuestion()">Save Question</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveAdminQuestion() {
  const payload = {
    id: editingQuestionId,
    category: $("aqCategory").value,
    type: $("aqType").value,
    difficulty: $("aqDiff").value,
    text: $("aqText").value.trim(),
    keywords: $("aqKeywords").value,
    concepts: $("aqConcepts").value,
    misconceptions: $("aqMisconceptions").value,
    followups: {
      strong: $("aqStrong").value.trim(),
      incomplete: $("aqIncomplete").value.trim(),
      keywordOnly: $("aqIncomplete").value.trim(),
      incorrect: $("aqWeak").value.trim(),
      vague: $("aqWeak").value.trim(),
      irrelevant: $("aqWeak").value.trim()
    },
    hints: $("aqHints").value
  };
  try {
    await apiRequest("/api/admin/questions", { method: "POST", body: JSON.stringify(payload) });
    await refreshServerState();
    document.getElementById("adminQModal")?.remove();
    renderQuestions();
    toast("Question saved to server database.");
  } catch (err) {
    toast(err.message);
  }
}

async function deleteAdminQuestion(id) {
  if (!confirm("Delete this question from the bank?")) return;
  try {
    await apiRequest(`/api/admin/questions/${id}`, { method: "DELETE" });
    await refreshServerState();
    renderQuestions();
    toast("Question deleted.");
  } catch (err) {
    toast(err.message);
  }
}

function renderLessonsAdmin() {
  const lessons = appState?.lessons || [];
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Learning Hub Lessons Manager</h1>
        <p>Manage BSIT learning modules, study materials, examples, and spoken assessment tasks.</p>
      </div>
      <button class="primary-btn" onclick="openAdminLessonModal()">+ Add Lesson</button>
    </div>
    <div class="panel">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Category</th><th>Title</th><th>Focus Area</th><th>Spoken Task</th><th>Actions</th></tr></thead>
          <tbody>
            ${lessons
              .map(
                l => `<tr>
                  <td><span class="pill">${escapeHtml(l.category)}</span></td>
                  <td><strong>${escapeHtml(l.title)}</strong></td>
                  <td>${escapeHtml(l.focusArea)}</td>
                  <td>${escapeHtml(l.spokenPrompt)}</td>
                  <td style="white-space:nowrap">
                    <button class="small-btn" onclick="openAdminLessonModal('${escapeHtml(l.id)}')">Edit</button>
                    <button class="small-btn danger-btn" onclick="deleteAdminLesson('${escapeHtml(l.id)}')">Delete</button>
                  </td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAdminLessonModal(id = null) {
  const l = (appState?.lessons || []).find(x => x.id === id);
  editingLessonId = id;
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = "adminLModal";
  modal.innerHTML = `
    <div class="modal">
      <h3>${l ? "Edit BSIT Lesson" : "Create BSIT Lesson"}</h3>
      <label>Category</label>
      <select id="alCat">${BSIT_CATEGORIES.map(c => `<option value="${escapeHtml(c.name)}" ${l?.category === c.name ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select>
      <label>Lesson Title</label>
      <input id="alTitle" value="${l ? escapeHtml(l.title) : ""}">
      <label>Target Focus Area</label>
      <input id="alFocus" value="${l ? escapeHtml(l.focusArea) : "Technical Knowledge"}">
      <label>Objectives (one per line)</label>
      <textarea id="alObj">${l ? escapeHtml((l.objectives || []).join("\n")) : ""}</textarea>
      <label>Short Study Material</label>
      <textarea id="alMat">${l ? escapeHtml(l.material) : ""}</textarea>
      <label>Strong Spoken Example</label>
      <textarea id="alEx">${l ? escapeHtml(l.example) : ""}</textarea>
      <label>Spoken Task Prompt</label>
      <textarea id="alPrompt">${l ? escapeHtml(l.spokenPrompt) : ""}</textarea>
      <label>Keywords (comma-separated)</label>
      <input id="alKeys" value="${l ? escapeHtml((l.keywords || []).join(", ")) : ""}">
      <label>Expected Concepts (one per line)</label>
      <textarea id="alConcepts">${l ? escapeHtml((l.concepts || []).join("\n")) : ""}</textarea>
      <div class="modal-actions">
        <button class="secondary-btn" onclick="document.getElementById('adminLModal')?.remove()">Cancel</button>
        <button class="primary-btn" onclick="saveAdminLesson()">Save Lesson</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveAdminLesson() {
  const payload = {
    id: editingLessonId,
    category: $("alCat").value,
    title: $("alTitle").value.trim(),
    focusArea: $("alFocus").value.trim(),
    objectives: $("alObj").value,
    material: $("alMat").value.trim(),
    example: $("alEx").value.trim(),
    spokenPrompt: $("alPrompt").value.trim(),
    keywords: $("alKeys").value,
    concepts: $("alConcepts").value
  };
  try {
    await apiRequest("/api/admin/lessons", { method: "POST", body: JSON.stringify(payload) });
    await refreshServerState();
    document.getElementById("adminLModal")?.remove();
    renderLessonsAdmin();
    toast("Lesson saved.");
  } catch (err) {
    toast(err.message);
  }
}

async function deleteAdminLesson(id) {
  if (!confirm("Delete this lesson?")) return;
  try {
    await apiRequest(`/api/admin/lessons/${encodeURIComponent(id)}`, { method: "DELETE" });
    await refreshServerState();
    renderLessonsAdmin();
    toast("Lesson deleted.");
  } catch (err) {
    toast(err.message);
  }
}

function renderRules() {
  const rubrics = appState?.rubrics;
  const rr = appState?.rewardRules || {};
  if (!rubrics) return;

  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div>
        <h1>Rubric Weights &amp; Reward Rules</h1>
        <p>Technical and Behavioral rubrics must each equal 100%.</p>
      </div>
    </div>

    <div class="feedback-grid" style="margin-top:0">
      <div class="panel" style="margin:0">
        <h3>Technical Rubric (100%)</h3>
        ${rubrics.technical
          .map(
            (r, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)">
            <span style="font-size:12.5px">${escapeHtml(r.name)}</span>
            <input type="number" id="techW${i}" value="${r.weight}" min="0" max="100" class="inline-input" style="width:80px">
          </div>`
          )
          .join("")}
      </div>

      <div class="panel" style="margin:0">
        <h3>Behavioral Rubric (100%)</h3>
        ${rubrics.behavioral
          .map(
            (r, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)">
            <span style="font-size:12.5px">${escapeHtml(r.name)}</span>
            <input type="number" id="behW${i}" value="${r.weight}" min="0" max="100" class="inline-input" style="width:80px">
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="margin:14px 0 24px">
      <button class="primary-btn" onclick="saveAdminRubrics()">Save Rubric Weights</button>
    </div>

    <div class="panel">
      <h3>Gamification &amp; Anti-Farming Reward Rules</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0">
        <div>
          <label style="font-size:11px;font-weight:700">Base XP per Session</label>
          <input type="number" id="rwXpBase" value="${rr.xpPerSessionBase || 60}" class="inline-input" style="width:100%">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700">Base Coins per Session</label>
          <input type="number" id="rwCoinBase" value="${rr.coinsPerSessionBase || 25}" class="inline-input" style="width:100%">
        </div>
        <div>
          <label style="font-size:11px;font-weight:700">Lesson Completion Coins</label>
          <input type="number" id="rwLessonCoin" value="${rr.coinsPerLesson || 20}" class="inline-input" style="width:100%">
        </div>
      </div>
      <button class="primary-btn" onclick="saveAdminRewards()">Save Reward Rules</button>
    </div>
  `;
}

async function saveAdminRubrics() {
  const nextTech = appState.rubrics.technical.map((r, i) => ({ ...r, weight: Number($("techW" + i).value) }));
  const nextBeh = appState.rubrics.behavioral.map((r, i) => ({ ...r, weight: Number($("behW" + i).value) }));
  try {
    await apiRequest("/api/admin/rubrics", {
      method: "POST",
      body: JSON.stringify({ rubrics: { technical: nextTech, behavioral: nextBeh } })
    });
    await refreshServerState();
    toast("Rubric weights updated.");
  } catch (err) {
    toast(err.message);
  }
}

async function saveAdminRewards() {
  try {
    await apiRequest("/api/admin/rewards", {
      method: "POST",
      body: JSON.stringify({
        rewardRules: {
          xpPerSessionBase: Number($("rwXpBase").value),
          coinsPerSessionBase: Number($("rwCoinBase").value),
          coinsPerLesson: Number($("rwLessonCoin").value)
        }
      })
    });
    await refreshServerState();
    toast("Reward rules saved.");
  } catch (err) {
    toast(err.message);
  }
}

// ============================================================================
// BOOTSTRAP SESSION RESTORATION
// ============================================================================
initializeGoogleSignIn();
(async function restoreSession() {
  try {
    const me = await apiRequest("/api/auth/me");
    if (me?.user) {
      await enterApp(me.user);
    }
  } catch {
    // Stay on auth view
  }
})();

function selectSetupChoice(kind, el) {
  const value = el.dataset.choice;
  const box = el.parentElement;
  box.querySelectorAll(".choice-row").forEach(row => {
    row.classList.remove("selected");
    const state = row.querySelector(".choice-state");
    if (state && !row.classList.contains("locked")) state.textContent = "Select";
  });
  if (el.classList.contains("locked")) { toast("Complete 3 Basic Practice sessions in this role first."); return; }
  el.classList.add("selected");
  const state = el.querySelector(".choice-state");
  if (state) state.textContent = "Selected";
  if (kind === "type") {
    window.PATO_SETUP.type = value;
    const t = document.getElementById("summaryType"); if (t) t.textContent = value;
  } else if (kind === "role") {
    preselectedCategory = value;
    const categorySelect = document.getElementById("setupCategory");
    if (categorySelect) categorySelect.value = value;
    const r = document.getElementById("summaryRole"); if (r) r.textContent = value;
    renderSelect();
  } else {
    window.PATO_SETUP.level = value;
    const modeSelect = document.getElementById("setupMode");
    if (modeSelect) modeSelect.value = value === "Advanced Practice" ? "Challenge" : "Practice";
    const l = document.getElementById("summaryLevel"); if (l) l.textContent = value;
  }
}


function renderSettings() {
  const p = appState?.profile || {};
  $("pageContent").innerHTML = `
    <div class="welcome-row">
      <div><h1>Settings</h1><p>Manage your interview voice preferences and sign-out options. Account details are available in Profile Information.</p></div>
    </div>
    <section class="panel">
      <h3>Voice preferences</h3>
      <p class="panel-sub">Choose how PATO speaks during interview practice.</p>
      <div class="choice-list">
        <div class="choice-row"><div class="choice-main"><strong>Duck voice</strong><span>Replay, mute, and playback speed remain available during the interview.</span></div><span class="choice-state">${ttsState.muted ? "Muted" : "On"}</span></div>
        <div class="choice-row"><div class="choice-main"><strong>Playback speed</strong><span>Current speed: ${ttsState.rate}x</span></div><span class="choice-state">Adjustable in interview</span></div>
      </div>
    </section>
    <section class="panel">
      <h3>Sign out</h3>
      <p class="panel-sub">Signing out will end your current PATO session on this device.</p>
      <button class="primary-btn" onclick="confirmLogout()">Log Out</button>
    </section>
  `;
}


// Profile: uses existing navigation, apiRequest(), toast(), and student JSON persistence.
const profileEditor = { pending: null, busy: false, generation: 0 };
function cleanupProfileEditor() {
  profileEditor.pending = null;
  profileEditor.generation++;
  $('pageContent')?.removeAttribute('aria-busy');
}
function profilePhotoUrl(profile = {}) {
  const value = profile.photo || profile.googlePhoto || profile.picture || '';
  if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && (url.hostname === 'googleusercontent.com' || url.hostname.endsWith('.googleusercontent.com'))) return url.href;
  } catch {}
  return '';
}
function syncProfileIdentity() {
  if (!currentUser) return;
  const isStudent = currentUser.role !== 'admin';
  const p = isStudent ? (appState?.profile || currentUser) : currentUser;
  const name = p.name || currentUser.name || 'Student';
  if ($('topName')) $('topName').textContent = name;
  if ($('menuName')) $('menuName').textContent = name;
  if ($('menuEmail')) $('menuEmail').textContent = p.email || currentUser.email || '';
  if ($('topRole')) $('topRole').textContent = isStudent ? 'Alumni Students' : 'System Administrator';
  const avatar = $('avatar');
  if (!avatar) return;
  avatar.replaceChildren();
  const fallback = document.createElement('span');
  fallback.textContent = name.charAt(0).toUpperCase();
  avatar.appendChild(fallback);
  const photo = isStudent ? profilePhotoUrl(p) : '';
  if (photo) {
    const img = document.createElement('img');
    img.src = photo;
    img.alt = '';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => { img.remove(); fallback.hidden = false; });
    fallback.hidden = true;
    avatar.appendChild(img);
  }
}
function renderProfile() {
  cleanupProfileEditor();
  if (currentUser?.role === 'admin') {
    const a = currentUser || {};
    $('pageContent').innerHTML = `
      <div class="welcome-row"><div><h1>Profile Information</h1><p>Administrator account and profile details.</p></div></div>
      <section class="panel">
        <h3>Profile information</h3>
        <p class="panel-sub">These details come from your verified administrator account.</p>
        <div class="session-summary">
          <div class="summary-item"><span>Full name</span><strong>${escapeHtml(a.name || "Administrator")}</strong></div>
          <div class="summary-item"><span>Email</span><strong>${escapeHtml(a.email || "Administrator account")}</strong></div>
          <div class="summary-item"><span>Account role</span><strong>Administrator</strong></div>
          <div class="summary-item"><span>Account type</span><strong>PTC Administrator</strong></div>
        </div>
      </section>`;
    return;
  }
  const p = appState?.profile || currentUser || {};
  const program = p.programSection || [p.program, p.section].filter(Boolean).join(' · ');
  $('pageContent').innerHTML = `
    <div class="welcome-row"><div><h1>Profile</h1><p>Manage your profile photo and alumni information.</p></div></div>
    <section class="panel profile-panel" aria-labelledby="profilePhotoHeading">
      <h3 id="profilePhotoHeading">Profile photo</h3>
      <div class="profile-photo-row">
        <div class="profile-photo-wrap">
          <div class="profile-photo" id="profilePhotoArea"><span id="profilePhotoFallback" aria-label="Default profile avatar">${escapeHtml((p.name || 'A').charAt(0).toUpperCase())}</span><img id="profilePhotoImage" alt="Current profile photo" referrerpolicy="no-referrer" hidden></div>
          <button class="secondary-btn profile-camera" id="profileCamera" type="button" aria-label="Choose a profile photo" aria-describedby="profilePhotoHelp"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h4l2-3h4l2 3h4a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/><circle cx="12" cy="13" r="4"/></svg></button>
        </div>
        <div class="profile-photo-copy"><p id="profilePhotoHelp" class="panel-sub">Choose a JPG, PNG or WEBP image up to 5 MB. Images are resized before saving.</p><input type="file" id="profilePhotoInput" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" hidden>
        <div id="profilePhotoActions" class="profile-actions" hidden><button type="button" class="primary-btn" id="profilePhotoConfirm">Confirm</button><button type="button" class="secondary-btn" id="profilePhotoCancel">Cancel</button></div>
        <p id="profilePhotoStatus" role="status" aria-live="polite" aria-atomic="true"></p></div>
      </div>
    </section>
    <section class="panel profile-panel" aria-labelledby="profileDetailsHeading">
      <h3 id="profileDetailsHeading">Personal information</h3>
      <form id="profileForm" class="admin-form profile-form">
        <div class="profile-field"><label for="profileFullName">Full Name</label><input id="profileFullName" name="name" type="text" autocomplete="name" required minlength="2" maxlength="100" value="${escapeHtml(p.name || '')}"></div>
        <div class="profile-field"><label for="profileEmail">Email</label><input id="profileEmail" name="email" type="email" autocomplete="email" readonly aria-describedby="profileEmailHelp" value="${escapeHtml(p.email || currentUser?.email || '')}"><small id="profileEmailHelp">Your verified sign-in email cannot be changed here.</small></div>
        <div class="profile-field"><label for="profileProgramSection">Program &amp; Section</label><input id="profileProgramSection" name="programSection" type="text" required maxlength="120" placeholder="e.g. BSIT · Section A" value="${escapeHtml(program)}"></div>
        <div class="profile-actions"><button class="primary-btn" type="submit" id="profileSave">Save changes</button></div>
        <p id="profileFormStatus" role="status" aria-live="polite" aria-atomic="true"></p>
      </form>
    </section>`;
  showProfilePhoto(profilePhotoUrl(p), false);
  $('profileCamera').addEventListener('click', () => $('profilePhotoInput').click());
  $('profilePhotoInput').addEventListener('change', chooseProfilePhoto);
  $('profilePhotoConfirm').addEventListener('click', confirmProfilePhoto);
  $('profilePhotoCancel').addEventListener('click', cancelProfilePhoto);
  $('profileForm').addEventListener('submit', saveProfileDetails);
  setProfileBusy(profileEditor.busy);
}
function showProfilePhoto(url, preview) {
  const image = $('profilePhotoImage'), fallback = $('profilePhotoFallback');
  if (!image || !fallback) return;
  image.onerror = () => { image.hidden = true; fallback.hidden = false; };
  image.hidden = !url; fallback.hidden = !!url;
  image.alt = preview ? 'Preview of selected profile photo' : 'Current profile photo';
  if (url) image.src = url; else image.removeAttribute('src');
}
function setProfileBusy(busy) {
  profileEditor.busy = busy;
  if (currentPage !== 'profile') return;
  $('pageContent').setAttribute('aria-busy', String(busy));
  $('pageContent').querySelectorAll('button,input').forEach(el => { el.disabled = busy; });
}
async function chooseProfilePhoto(event) {
  const file = event.target.files?.[0];
  if (!file || profileEditor.busy) return;
  const status = $('profilePhotoStatus');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    status.textContent = 'Please choose a JPG, PNG or WEBP image.'; event.target.value = ''; return;
  }
  if (file.size > 5 * 1024 * 1024) { status.textContent = 'Choose an image no larger than 5 MB.'; event.target.value = ''; return; }
  const generation = ++profileEditor.generation;
  status.textContent = 'Preparing image preview…';
  setProfileBusy(true);
  try {
    const data = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), image = new Image();
      image.onload = () => {
        try {
          if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 20000000) throw new Error('Choose an image with no more than 20 megapixels.');
          const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Image processing is unavailable in this browser.');
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const encoded = canvas.toDataURL('image/jpeg', .85);
          if (encoded.length > 350000) throw new Error('This image is too complex. Please choose a smaller photo.');
          resolve(encoded);
        } catch (error) { reject(error); } finally { URL.revokeObjectURL(url); }
      };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('The selected file could not be read as an image.')); };
      image.src = url;
    });
    if (generation !== profileEditor.generation || currentPage !== 'profile') return;
    profileEditor.pending = data;
    showProfilePhoto(data, true);
    $('profilePhotoActions').hidden = false;
    status.textContent = 'Preview only. Confirm to save this photo, or Cancel to keep your previous photo.';
    $('profilePhotoConfirm').focus();
  } catch (error) { if (generation === profileEditor.generation && currentPage === 'profile') status.textContent = error.message; }
  finally { setProfileBusy(false); if (currentPage === 'profile' && profileEditor.pending) $('profilePhotoConfirm').focus(); }
}
function cancelProfilePhoto() {
  if (profileEditor.busy) return;
  profileEditor.pending = null;
  $('profilePhotoInput').value = '';
  $('profilePhotoActions').hidden = true;
  showProfilePhoto(profilePhotoUrl(appState?.profile), false);
  $('profilePhotoStatus').textContent = 'Selection discarded. Your previous photo is unchanged.';
  $('profileCamera').focus();
}
function applySavedProfile(data, email) {
  if (!currentUser || currentUser.email !== email) return false;
  appState.profile = {...appState.profile, ...data.profile};
  currentUser = {...currentUser, ...data.user};
  syncProfileIdentity();
  return true;
}
async function confirmProfilePhoto() {
  if (!profileEditor.pending || profileEditor.busy) return;
  const photo = profileEditor.pending, email = currentUser.email;
  setProfileBusy(true);
  $('profilePhotoStatus').textContent = 'Saving photo…';
  try {
    const data = await apiRequest('/api/profile', {method:'POST',body:JSON.stringify({photo})});
    if (!applySavedProfile(data, email)) return;
    profileEditor.pending = null;
    if (currentPage === 'profile') {
      showProfilePhoto(profilePhotoUrl(data.profile), false);
      $('profilePhotoActions').hidden = true;
      $('profilePhotoInput').value = '';
      $('profilePhotoStatus').textContent = 'Profile photo saved.';
    }
    toast('Profile photo saved.');
  } catch (error) { if (currentPage === 'profile') $('profilePhotoStatus').textContent = error.message; }
  finally { setProfileBusy(false); if (currentPage === 'profile') $('profileCamera').focus(); }
}
async function saveProfileDetails(event) {
  event.preventDefault();
  if (profileEditor.busy) return;
  const form = event.currentTarget;
  const name = $('profileFullName').value.trim(), programSection = $('profileProgramSection').value.trim();
  $('profileFullName').value = name; $('profileProgramSection').value = programSection;
  if (!form.reportValidity()) return;
  const email = currentUser.email;
  setProfileBusy(true); $('profileFormStatus').textContent = 'Saving changes…';
  try {
    const data = await apiRequest('/api/profile', {method:'POST',body:JSON.stringify({name,email,programSection})});
    if (!applySavedProfile(data, email)) return;
    if (currentPage === 'profile') {
      $('profileFullName').value = data.profile.name;
      $('profileProgramSection').value = data.profile.programSection;
      $('profilePhotoFallback').textContent = data.profile.name.charAt(0).toUpperCase();
      $('profileFormStatus').textContent = 'Profile changes saved.';
    }
    toast('Profile changes saved.');
  } catch (error) { if (currentPage === 'profile') $('profileFormStatus').textContent = error.message; }
  finally { setProfileBusy(false); }
}
