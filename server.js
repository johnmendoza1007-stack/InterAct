// PATO Node.js Server: Automated Communication-Score Portal for BSIT Alumni of 2025-2026 at Pateros Technological College
// Preserves Google Workspace ID-token verification, session auth, static serving, and adds full JSON persistence,
// server-side AI evaluation/branching (with deterministic semantic fallback), student data isolation, and admin protection.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

function loadEnv() {
  try {
    for (const line of fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
}
loadEnv();

const HOST = 'localhost';
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DOMAIN = 'paterostechnologicalcollege.edu.ph';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '988807079768-c8k5m64e8l4bdvs4q80cfe3dadafpj02.apps.googleusercontent.com';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin1@paterostechnologicalcollege.edu.ph').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'accounts.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const DEFAULT_RUBRICS = {
  technical: [
    { key: 'technicalAccuracy', name: 'Technical Accuracy', weight: 30, focusArea: 'Technical Knowledge' },
    { key: 'relevance', name: 'Relevance', weight: 25, focusArea: 'Critical Thinking' },
    { key: 'reasoning', name: 'Reasoning', weight: 20, focusArea: 'Problem Solving' },
    { key: 'organization', name: 'Organization', weight: 15, focusArea: 'Answer Organization' },
    { key: 'clarity', name: 'Communication Clarity', weight: 10, focusArea: 'Communication' }
  ],
  behavioral: [
    { key: 'relevance', name: 'Relevance', weight: 25, focusArea: 'Behavioral Response' },
    { key: 'answerContent', name: 'Answer Content', weight: 25, focusArea: 'Behavioral Response' },
    { key: 'reasoning', name: 'Reasoning', weight: 20, focusArea: 'Critical Thinking' },
    { key: 'organization', name: 'Organization', weight: 15, focusArea: 'Answer Organization' },
    { key: 'clarity', name: 'Clarity', weight: 10, focusArea: 'Communication' },
    { key: 'professionalRelevance', name: 'Professional Relevance', weight: 5, focusArea: 'Professional Relevance' }
  ]
};

const DEFAULT_VOICE_RUBRIC = {
  pace: { name: 'Speaking Pace', weight: 25 },
  fluency: { name: 'Fluency & Restarts', weight: 25 },
  delivery: { name: 'Pauses & Fillers', weight: 25 },
  engagement: { name: 'Response Engagement', weight: 25 }
};

const DEFAULT_REWARD_RULES = {
  xpPerSessionBase: 60,
  xpScoreMultiplier: 1.2,
  coinsPerSessionBase: 25,
  coinsHighScoreBonus: 20,
  xpPerLesson: 45,
  coinsPerLesson: 20,
  xpPerEvolutionImprovement: 30,
  coinsPerEvolutionImprovement: 15,
  practiceMultiplier: 1.0,
  challengeMultiplier: 1.35,
  assessmentMultiplier: 1.5
};

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    category: 'Web Development',
    type: 'technical',
    difficulty: 'Beginner',
    objectives: ['Explain how HTML, CSS, and JavaScript collaborate in the browser', 'Provide a concrete structural or interactive example'],
    text: 'How do HTML, CSS, and JavaScript work together when rendering an interactive web page?',
    keywords: ['html', 'structure', 'dom', 'css', 'style', 'layout', 'javascript', 'events', 'interactive', 'browser'],
    concepts: ['Semantic HTML structure & DOM', 'CSS styling & responsive layout', 'JavaScript event handling & DOM manipulation'],
    misconceptions: ['CSS handles database logic', 'HTML is a programming language that executes loops', 'JavaScript is only for styling'],
    followups: {
      strong: 'Suppose a web app slows down when updating hundreds of DOM elements via JavaScript. How would you optimize rendering performance?',
      incomplete: 'You touched on part of the stack. How does JavaScript specifically interact with the HTML DOM after CSS styles are applied?',
      keywordOnly: 'You mentioned those technologies—can you walk through a concrete example of what happens when a user clicks a submit button?',
      incorrect: 'Let’s clarify: HTML defines structure, CSS controls visual presentation, and JavaScript handles behavior. Using a login form example, which layer validates empty fields before submission?',
      vague: 'Can you give a specific example from a web project showing how HTML, CSS, and JavaScript each played a distinct role?',
      irrelevant: 'Let’s refocus on web fundamentals: how do HTML, CSS, and JavaScript divide responsibilities inside a web browser?'
    },
    hints: [
      'Think of a webpage like a house: structure, visual design, and interactive electricity/appliances.',
      'Mention DOM (Document Object Model) for HTML, selectors/flexbox/grid for CSS, and event listeners/fetch for JavaScript.',
      'Blueprint: Direct Answer (define all 3 roles) → Explanation (how browser parses & links them) → Example (a button click changing a class) → Conclusion.'
    ]
  },
  {
    id: 2,
    category: 'Web Development',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Diagnose HTTP/API or frontend asset failures systematically', 'Use browser DevTools Network and Console tabs'],
    text: 'A user reports that a newly deployed web page loads blank or broken. How would you troubleshoot it step by step?',
    keywords: ['devtools', 'console', 'network', 'status', '404', '500', 'cors', 'cache', 'logs', 'api'],
    concepts: ['Inspect browser Console for JS/CORS errors', 'Check Network tab HTTP status codes', 'Verify server logs & asset paths'],
    misconceptions: ['Reinstalling the OS fixes a 404 error', 'Clearing cookies fixes server-side 500 errors'],
    followups: {
      strong: 'If the Network tab shows a 200 OK for index.html but a CORS policy error on the API call, how do you resolve it safely?',
      incomplete: 'Checking the browser is a good start. What specific tabs in Developer Tools would you inspect and what error codes would you look for?',
      keywordOnly: 'You mentioned checking errors or logs—walk me through your exact sequence from opening the browser to isolating frontend vs. backend failure.',
      incorrect: 'A blank page usually stems from failed asset paths, JavaScript runtime errors, or server responses rather than user hardware. What would you inspect in Chrome DevTools first?',
      vague: 'Give a step-by-step diagnostic order: what is step 1 in the browser, step 2 on the network request, and step 3 on the server?',
      irrelevant: 'Focusing back on web troubleshooting: if a web application renders a blank screen after deployment, what diagnostic tools do you open first?'
    },
    hints: [
      'Start on the client side using F12 / Browser Developer Tools before touching server code.',
      'Check Console for uncaught exceptions and Network tab for 404 (Not Found), 403, or 500 (Internal Server Error).',
      'Blueprint: Step 1 Reproduce & Hard Refresh → Step 2 DevTools Console & Network status → Step 3 Check backend logs/config → Verify fix.'
    ]
  },
  {
    id: 3,
    category: 'Software Development',
    type: 'technical',
    difficulty: 'Beginner',
    objectives: ['Distinguish state storage from reusable behavior', 'Explain scope, parameters, and return values'],
    text: 'What is the difference between a variable and a function, and how do they work together in clean code?',
    keywords: ['variable', 'store', 'data', 'value', 'type', 'function', 'reusable', 'parameter', 'return', 'scope'],
    concepts: ['Variables store state/data values in memory', 'Functions encapsulate reusable logic/operations', 'Parameters and return values pass data cleanly'],
    misconceptions: ['Variables execute loops on their own', 'Functions cannot accept inputs or return outputs'],
    followups: {
      strong: 'How do local vs. global variable scopes impact maintainability when multiple functions share data?',
      incomplete: 'You explained one half well. How do parameters and return values connect variables to functions?',
      keywordOnly: 'Can you illustrate the difference with a short real example, such as calculating a student’s General Weighted Average (GWA)?',
      incorrect: 'To clarify: a variable holds data (like a grade), while a function performs an action on data (like computing an average). How would you pass three grades into a function?',
      vague: 'Avoid general definitions—give a concrete programming example showing a variable being passed into a function and returning a result.',
      irrelevant: 'Let’s bring it back to core programming concepts: how does a variable differ from a function in structure and purpose?'
    },
    hints: [
      'Compare "holding a value" (noun) versus "performing a task" (verb).',
      'Explain how variables are passed as arguments/parameters into a function and returned as output.',
      'Blueprint: Define Variable → Define Function → Show GWA calculation example → Conclude with modularity benefit.'
    ]
  },
  {
    id: 4,
    category: 'Software Development',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Apply structured debugging and edge-case testing', 'Explain version control or unit validation'],
    text: 'Describe your process for solving a programming bug when your code compiles without syntax errors but produces the wrong output.',
    keywords: ['reproduce', 'breakpoint', 'debugger', 'log', 'trace', 'input', 'edge case', 'condition', 'logic', 'test'],
    concepts: ['Reproduce consistently with minimal input', 'Trace execution state via debugger/logs', 'Verify boundary/edge cases and write regression test'],
    misconceptions: ['Syntax error checkers catch logical bugs', 'Randomly changing lines without reproducing is reliable debugging'],
    followups: {
      strong: 'Once you fix a logic bug in production code, how do you prevent that exact regression from returning in future updates?',
      incomplete: 'Reproducing the issue is key. How do you inspect variable states mid-execution to pinpoint where the logic diverges?',
      keywordOnly: 'You mentioned debugging or testing—walk me through how you isolate which function or loop is causing the wrong calculation.',
      incorrect: 'Since there are no syntax errors, the compiler won’t flag the issue—it is a runtime logic bug. How would you trace variable values line by line?',
      vague: 'Walk through a specific scenario: imagine a payroll function outputs negative net pay. What exact steps do you take to find the flaw?',
      irrelevant: 'Let’s stay on logical debugging: when code runs without crashing but outputs wrong data, how do you trace the logic error?'
    },
    hints: [
      'Distinguish syntax errors from logic errors first.',
      'Use step-by-step tracing: reproduce input, set breakpoints or console logs, check conditionals/loops, test edge cases.',
      'Blueprint: Reproduce → Isolate via breakpoints/logs → Fix root condition → Test edge cases.'
    ]
  },
  {
    id: 5,
    category: 'IT Support',
    type: 'technical',
    difficulty: 'Beginner',
    objectives: ['Apply bottom-up or divide-and-conquer network troubleshooting', 'Check physical, IP, gateway, and DNS layers'],
    text: 'An office workstation suddenly cannot access any websites. Walk me through how you would diagnose and resolve the issue.',
    keywords: ['cable', 'wifi', 'ipconfig', 'dhcp', 'ping', 'gateway', 'dns', 'adapter', 'router', 'browser'],
    concepts: ['Verify physical/Wi-Fi link layer first', 'Check IP address & default gateway via ipconfig/ping', 'Test DNS resolution vs external IP connectivity'],
    misconceptions: ['Replacing the monitor or CPU fixes network drops', 'If ping 8.8.8.8 works, the physical cable is unplugged'],
    followups: {
      strong: 'If `ping 8.8.8.8` succeeds with zero packet loss, but `ping google.com` fails, what is the exact root cause and fix?',
      incomplete: 'Good initial check. After verifying the physical/Wi-Fi connection, what command-line tools confirm whether IP or DNS is failing?',
      keywordOnly: 'You mentioned checking IP or DNS—what specific command would you run and what output tells you DHCP failed?',
      incorrect: 'Before escalating or replacing hardware, we isolate layers: Physical → IP/Gateway → DNS. Which command shows if the PC has a valid IP or a 169.254.x.x APIPA address?',
      vague: 'List your troubleshooting steps in logical order from physical connection to DNS testing.',
      irrelevant: 'Let’s focus on IT Support troubleshooting: an employee has no internet access on their desktop—what is your diagnostic sequence?'
    },
    hints: [
      'Work from the physical layer up to DNS/application layer (OSI model approach).',
      'Mention checking cable/Wi-Fi, running `ipconfig /all`, pinging the default gateway, pinging `8.8.8.8`, and testing DNS (`nslookup` / `ipconfig /flushdns`).',
      'Blueprint: Physical check → IP/DHCP check → Ping Gateway & External IP → DNS check → Document resolution.'
    ]
  },
  {
    id: 6,
    category: 'Networking',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Differentiate private vs public IPv4 addressing and NAT', 'Explain subnet masks and default gateways'],
    text: 'What is the purpose of an IP address, and how do private IP addresses communicate with the public internet?',
    keywords: ['identifier', 'network', 'host', 'private', 'public', 'nat', 'router', 'subnet', 'gateway', 'dhcp'],
    concepts: ['Logical device & network identification', 'Private RFC1918 vs Public routable IP ranges', 'Network Address Translation (NAT) on the router'],
    misconceptions: ['MAC addresses route packets across the global internet', 'Private IP addresses like 192.168.1.1 are globally unique on the internet'],
    followups: {
      strong: 'How does a subnet mask like `/24` (255.255.255.0) tell a host whether a destination IP is on the local LAN or needs the default gateway?',
      incomplete: 'You explained device identification well. How does a home or campus router translate internal private IPs so they can reach public websites?',
      keywordOnly: 'You mentioned private/public IPs or NAT—explain what happens to the packet’s source IP as it leaves the PTC campus router.',
      incorrect: 'Remember: a MAC address works locally at Layer 2, while an IP address provides logical Layer 3 routing. Private IPs require NAT at the router to reach the public internet. Can you restate how NAT works?',
      vague: 'Give a concrete example using `192.168.1.10` inside an office trying to reach a public web server.',
      irrelevant: 'Bringing it back to networking fundamentals: why do devices need IP addresses and how do private networks reach the internet?'
    },
    hints: [
      'Define IP address as a logical Layer 3 identifier split into network and host portions.',
      'Contrast private ranges (10.x.x.x, 172.16-31.x.x, 192.168.x.x) with public IPs, and explain NAT (Network Address Translation).',
      'Blueprint: Define IP → Private vs Public → Explain Router NAT translation → Practical LAN example.'
    ]
  },
  {
    id: 7,
    category: 'Database Management',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Distinguish primary keys from foreign keys', 'Explain relational integrity and normalization benefits'],
    text: 'In a relational database, what is the difference between a Primary Key and a Foreign Key, and why are both essential?',
    keywords: ['primary key', 'unique', 'null', 'foreign key', 'reference', 'relationship', 'integrity', 'table', 'join', 'normalization'],
    concepts: ['Primary key uniquely identifies each record and cannot be NULL', 'Foreign key references a primary key in another table', 'Referential integrity prevents orphan records'],
    misconceptions: ['Primary keys can contain duplicate values', 'Foreign keys must always be unique in the child table'],
    followups: {
      strong: 'What happens if you try to delete a student record whose `student_id` is referenced as a foreign key in an `enrollments` table, and how do `ON DELETE CASCADE` vs `RESTRICT` handle it?',
      incomplete: 'You defined one key clearly. How does the foreign key enforce referential integrity between two related tables?',
      keywordOnly: 'Using a `Students` table and a `Grades` table, show me which column is the primary key and which is the foreign key.',
      incorrect: 'Let’s clarify: a Primary Key must be unique and non-null in its own table, whereas a Foreign Key points to another table’s Primary Key to link records. How would you link `Orders` to `Customers`?',
      vague: 'Provide a two-table database example (like Students and Courses) showing exact column names for both keys.',
      irrelevant: 'Let’s focus on relational databases: how do Primary Keys and Foreign Keys establish reliable relationships between tables?'
    },
    hints: [
      'Focus on uniqueness within a table (PK) versus cross-table linking (FK).',
      'Include rules: PK = unique + NOT NULL; FK = references PK + enforces referential integrity.',
      'Blueprint: Define PK → Define FK → Give Students/Evaluations table example → Conclude with data integrity.'
    ]
  },
  {
    id: 8,
    category: 'Cybersecurity',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Explain SQL Injection or credential attack vectors', 'Recommend parameterized queries and defense-in-depth'],
    text: 'What is SQL Injection, and how do you protect a web login or search form from it?',
    keywords: ['sql injection', 'input', 'query', 'malicious', 'prepared', 'parameterized', 'sanitize', 'escape', 'least privilege', 'validation'],
    concepts: ['Untrusted user input alters SQL query structure', 'Parameterized queries / prepared statements separate code from data', 'Input validation & least-privilege DB accounts'],
    misconceptions: ['Client-side JavaScript validation alone stops SQL injection', 'HTTPS encryption prevents SQL injection payloads'],
    followups: {
      strong: 'Why is client-side JavaScript validation insufficient against SQL Injection, and how do prepared statements solve it at the database driver level?',
      incomplete: 'You explained the attack well. What specific coding technique in PHP, Node.js, or Java prevents user input from being executed as SQL commands?',
      keywordOnly: 'You mentioned prepared statements or sanitization—explain how a parameterized query treats an input like `\' OR 1=1 --`.',
      incorrect: 'HTTPS protects data in transit, not malicious SQL payloads sent inside form fields. Developers stop SQL injection using parameterized queries (prepared statements). Can you explain why?',
      vague: 'Give a concrete example of an unsafe concatenated query versus a safe parameterized query.',
      irrelevant: 'Let’s refocus on application security: how does SQL Injection exploit database queries and how do developers prevent it?'
    },
    hints: [
      'Explain how attackers inject SQL syntax (`\' OR 1=1`) into concatenated query strings.',
      'Highlight Prepared Statements / Parameterized Queries (`?` or `$1` placeholders) as the primary defense.',
      'Blueprint: Define SQLi → Show vulnerable login example → Explain Prepared Statements + Least Privilege → Conclude.'
    ]
  },
  {
    id: 9,
    category: 'Systems Analysis',
    type: 'technical',
    difficulty: 'Intermediate',
    objectives: ['Explain SDLC phases and requirements gathering', 'Connect DFD/ERD/Use Case modeling to system quality'],
    text: 'Why is requirements analysis and system modeling (such as DFDs or Use Case diagrams) critical before writing code for a capstone or client system?',
    keywords: ['requirements', 'scope', 'stakeholder', 'dfd', 'use case', 'erd', 'rework', 'workflow', 'validation', 'architecture'],
    concepts: ['Aligns system scope with stakeholder needs', 'Visualizes data flows, processes, and entities early', 'Reduces costly rework and scope creep during coding'],
    misconceptions: ['Diagrams are only written after deployment for decoration', 'Skipping requirements saves time on multi-role systems'],
    followups: {
      strong: 'In a multi-role academic portal (Student, Registrar, Dean, Admin), how does a Level 1 DFD help uncover missing permissions or data bottlenecks before coding?',
      incomplete: 'Aligning with users is important. How do specific diagrams like DFDs or ERDs help developers avoid database or workflow mistakes?',
      keywordOnly: 'You mentioned DFDs or requirements—give an example from a system project where planning prevented a major logic flaw.',
      incorrect: 'Jumping straight into coding often causes mismatched features and database redesigns. Requirements analysis and DFDs validate workflows first. How would you gather requirements from college staff?',
      vague: 'Give a concrete example of a problem that happens when a team starts coding a multi-user system without defining requirements first.',
      irrelevant: 'Let’s focus on Systems Analysis & Design: why do analysts map requirements and data flows before software implementation?'
    },
    hints: [
      'Connect business/user needs to technical architecture and reduced rework.',
      'Mention stakeholder interviews, functional vs non-functional requirements, Use Case diagrams, DFDs, and ERDs.',
      'Blueprint: Direct Answer (prevents costly rework) → Explain Requirements & Modeling (DFD/ERD) → Capstone/Client Example → Conclusion.'
    ]
  },
  {
    id: 10,
    category: 'Behavioral / Internship',
    type: 'behavioral',
    difficulty: 'Beginner',
    objectives: ['Show calm communication and problem-solving', 'Demonstrate respect, teamwork, and accountability'],
    text: 'How would you work with a difficult teammate or user when time is short?',
    keywords: ['listen', 'communicated', 'resolved', 'deadline', 'team', 'learned', 'calm', 'help'],
    concepts: ['Calm communication', 'Problem-solving', 'Respect and accountability'],
    misconceptions: ['Blaming others without trying to solve the problem', 'Ignoring the other person or making the conflict worse'],
    followups: {
      strong: 'What helps you keep communication clear?',
      incomplete: 'What is one way you could make the situation better?',
      keywordOnly: 'What is the most important thing to do first?',
      incorrect: 'Try to stay calm and focus on the problem. What would you do next?',
      vague: 'What is the main problem, and how would you handle it?',
      irrelevant: 'Let’s return to teamwork. How would you work with the other person?'
    },
    hints: [
      'Stay calm and listen to the other person.',
      'Focus on the problem, not on blame.',
      'Use clear words and agree on a helpful next step.'
    ]
  }
];

const DEFAULT_LESSONS = [
  {
    id: 'les-web-debug',
    category: 'Web Development',
    title: 'Systematic Frontend & API Troubleshooting',
    difficulty: 'Beginner',
    focusArea: 'Problem Solving',
    objectives: [
      'Diagnose client-side vs. server-side web failures using DevTools',
      'Structure spoken troubleshooting answers clearly under interview pressure'
    ],
    material: 'When an interviewer asks how you debug a broken web page, avoid guessing randomly. Follow a layered diagnostic order: (1) Reproduce the bug and perform a hard refresh to rule out stale cache, (2) Open Browser DevTools Console to check JavaScript runtime or CORS errors, (3) Inspect the Network tab for HTTP status codes (400/404 client/path issues vs. 500 backend crashes), and (4) Check server logs and database queries.',
    example: 'Strong spoken response: "First, I reproduce the issue and open Chrome DevTools. In the Console tab, I check for uncaught JavaScript or CORS errors. Next, in the Network tab, I inspect the failing API request—if it returns a 404, I verify the endpoint URL; if it returns a 500, I inspect the backend server logs and database query parameters."',
    spokenPrompt: 'A student portal login button spins forever without logging the user in. Explain step by step how you would diagnose the root cause.',
    keywords: ['devtools', 'network', 'console', 'status', 'api', 'timeout', 'backend', 'logs', 'reproduce'],
    concepts: ['Reproduce & check Console errors', 'Inspect Network tab request status/payload', 'Verify backend endpoint & logs']
  },
  {
    id: 'les-net-osi',
    category: 'Networking',
    title: 'Layered Network Connectivity Diagnosis',
    difficulty: 'Beginner',
    focusArea: 'Technical Knowledge',
    objectives: [
      'Apply bottom-up connectivity verification (Link → IP/DHCP → Gateway → DNS)',
      'Explain diagnostic commands with exact purpose'
    ],
    material: 'Effective IT Support and Network candidates troubleshoot from the local machine outward: (1) Physical/Wireless link check, (2) Local IP configuration (`ipconfig /all` or `ip a`) to ensure the host did not fall back to an APIPA `169.254.x.x` address, (3) Default Gateway ping to verify LAN reachability, (4) External IP ping (`8.8.8.8`) to confirm ISP routing, and (5) DNS lookup (`nslookup`) to isolate name-resolution issues.',
    example: 'Strong spoken response: "I start at the physical link, then run ipconfig to verify a valid subnet IP and gateway. I ping the default gateway first, then 8.8.8.8. If 8.8.8.8 responds but websites fail to load, I know routing works and the fault is DNS."',
    spokenPrompt: 'Explain how you would prove whether an office PC connectivity outage is caused by DHCP, the router gateway, or DNS.',
    keywords: ['ipconfig', 'apipa', '169.254', 'ping', 'gateway', '8.8.8.8', 'dns', 'nslookup', 'dhcp'],
    concepts: ['Verify DHCP/IP assignment vs APIPA', 'Ping gateway and external IP', 'Isolate DNS resolution failure']
  },
  {
    id: 'les-db-integrity',
    category: 'Database Management',
    title: 'Relational Keys, Normalization & Query Safety',
    difficulty: 'Intermediate',
    focusArea: 'Technical Knowledge',
    objectives: [
      'Explain Primary Keys, Foreign Keys, and Referential Integrity clearly',
      'Connect parameterized queries to SQL Injection prevention'
    ],
    material: 'Relational databases organize data across normalized tables to eliminate redundancy. A Primary Key uniquely identifies every row and prohibits NULL values. A Foreign Key references a Primary Key in a parent table to enforce referential integrity. When querying those tables from an application, always use Prepared Statements (parameterized queries) so user input is treated strictly as data, never executable SQL.',
    example: 'Strong spoken response: "In an academic portal, student_id is the Primary Key in Students and a Foreign Key in Evaluations. This prevents orphan grade records. When querying grades, I use prepared statements with bound parameters so malicious input cannot alter the SQL syntax."',
    spokenPrompt: 'How do Primary Keys, Foreign Keys, and Prepared Statements work together to keep a student record database reliable and secure?',
    keywords: ['primary key', 'unique', 'foreign key', 'referential integrity', 'prepared', 'parameterized', 'sql injection'],
    concepts: ['Primary key uniqueness', 'Foreign key referential integrity', 'Parameterized queries prevent SQL injection']
  },
  {
    id: 'les-sec-auth',
    category: 'Cybersecurity',
    title: 'Web Application Defense-in-Depth Essentials',
    difficulty: 'Intermediate',
    focusArea: 'Critical Thinking',
    objectives: [
      'Distinguish authentication, authorization (RBAC), and input validation',
      'Articulate why backend validation is mandatory'
    ],
    material: 'Securing a web platform requires layered controls: (1) Authentication verifies identity (e.g., verified institutional OAuth tokens or hashed passwords), (2) Role-Based Access Control (RBAC) enforces permissions on every backend route so students cannot access admin endpoints, and (3) Server-side input validation and parameterized queries prevent injection and XSS attacks.',
    example: 'Strong spoken response: "Even if the frontend hides admin buttons, attackers can call API routes directly. Therefore, the server must verify the session token and check the user role on every protected endpoint."',
    spokenPrompt: 'Why is hiding an Admin button in HTML/CSS not enough to secure an admin feature, and how do you properly enforce access control?',
    keywords: ['server', 'backend', 'role', 'rbac', 'session', 'token', 'authorization', 'api', 'bypass'],
    concepts: ['Client-side UI hiding can be bypassed', 'Server-side session & role verification on every API route', 'Principle of least privilege']
  },
  {
    id: 'les-sys-sad',
    category: 'Systems Analysis',
    title: 'Translating Requirements into DFDs & ERDs',
    difficulty: 'Intermediate',
    focusArea: 'Answer Organization',
    objectives: [
      'Explain how stakeholder requirements drive system architecture',
      'Differentiate Use Case, DFD, and ERD responsibilities'
    ],
    material: 'Before writing application code, Systems Analysts gather functional and non-functional requirements from stakeholders. Use Case diagrams capture actor goals; Data Flow Diagrams (DFDs) trace how inputs transform into stored data and outputs; Entity-Relationship Diagrams (ERDs) define normalized database tables and cardinalities. Catching gaps in diagrams prevents costly rework later.',
    example: 'Strong spoken response: "In our capstone system, mapping the Level 1 DFD revealed that Registrar grade verification had to happen before Dean ranking could trigger, which saved us from rewriting our database schema mid-development."',
    spokenPrompt: 'Explain the difference between a Use Case diagram, a Data Flow Diagram, and an ERD when designing a school information system.',
    keywords: ['use case', 'actor', 'dfd', 'data flow', 'process', 'erd', 'entity', 'relationship', 'database'],
    concepts: ['Use Case models actors & system goals', 'DFD models data movement & processes', 'ERD models database entities & relationships']
  },
  {
    id: 'les-star-method',
    category: 'Behavioral / Internship',
    title: 'Mastering STAR for IT & Internship Interviews',
    difficulty: 'Beginner',
    focusArea: 'Behavioral Response',
    objectives: [
      'Deliver concise 45–90 second behavioral stories using STAR',
      'Quantify results and highlight professional accountability'
    ],
    material: 'Behavioral questions predict future workplace habits from past actions. Structure every behavioral answer with STAR: Situation (1–2 sentences setting context), Task (your specific responsibility), Action (concrete steps YOU took—use "I" instead of only "we"), and Result (measurable outcome and what you learned).',
    example: 'Strong spoken response: "Situation: During my SPES clinic assignment, walk-in queues backed up during peak morning hours. Task: I needed to encode records without delaying vital signs screening. Action: I organized pre-check forms by queue number and verified PhilHealth details upfront. Result: Waiting time dropped noticeably and zero encoding errors occurred that week."',
    spokenPrompt: 'Using the STAR method, describe a time you stayed organized and calm while handling multiple urgent tasks or requests.',
    keywords: ['situation', 'task', 'action', 'result', 'prioritized', 'organized', 'outcome', 'resolved'],
    concepts: ['Clear Situation & Task setup', 'Specific personal Action steps', 'Concrete Result & takeaway']
  }
];

const WARDROBE_CATALOG = [
  { id:'hat-none',slot:'hat',name:'No Headwear',cost:0,minLevel:1,badge:'🦆',desc:'Classic PATO look.'},
  { id:'hat-gradcap',slot:'hat',name:'Emerald Graduation Cap',cost:40,minLevel:1,badge:'🎓',desc:'Graduation cap with gold tassel.'},
  { id:'hat-headset',slot:'hat',name:'Support Headset',cost:55,minLevel:2,badge:'🎧',desc:'Helpdesk headset with microphone.'},
  { id:'hat-devcap',slot:'hat',name:'Developer Cap',cost:65,minLevel:2,badge:'🧢',desc:'Casual cap for the coding workspace.'},
  { id:'cloth-polo',slot:'clothes',name:'PTC Emerald Polo',cost:0,minLevel:1,badge:'👕',desc:'Institutional smart-casual polo.'},
  { id:'cloth-suit',slot:'clothes',name:'Interview Suit',cost:60,minLevel:2,badge:'🧥',desc:'Forest blazer, white shirt, and tie.'},
  { id:'cloth-hoodie',slot:'clothes',name:'Developer Hoodie',cost:75,minLevel:3,badge:'💻',desc:'Mint-accented tech hoodie.'},
  { id:'cloth-barong',slot:'clothes',name:'Modern Barong',cost:100,minLevel:4,badge:'✨',desc:'Filipino formal attire for panel interviews.'},
  { id:'glass-none',slot:'glasses',name:'No Eyewear',cost:0,minLevel:1,badge:'👀',desc:'Natural look.'},
  { id:'glass-classic',slot:'glasses',name:'Classic Glasses',cost:35,minLevel:1,badge:'👓',desc:'Simple professional frames.'},
  { id:'glass-tech',slot:'glasses',name:'Tech Visor',cost:90,minLevel:3,badge:'🥽',desc:'Subtle emerald-tinted visor.'},
  { id:'acc-none',slot:'accessory',name:'No Accessory',cost:0,minLevel:1,badge:'—',desc:'Clean minimal look.'},
  { id:'acc-id',slot:'accessory',name:'PTC Alumni ID',cost:25,minLevel:1,badge:'🪪',desc:'Green ID card and lanyard.'},
  { id:'acc-laptop',slot:'accessory',name:'Developer Laptop',cost:70,minLevel:3,badge:'💼',desc:'A compact laptop prop.'},
  { id:'acc-portfolio',slot:'accessory',name:'Interview Portfolio',cost:50,minLevel:2,badge:'📁',desc:'Professional portfolio folder.'},
  { id:'bg-studio',slot:'background',name:'Interview Studio',cost:0,minLevel:1,badge:'🌿',desc:'Clean mint interview backdrop.'},
  { id:'bg-campus',slot:'background',name:'PTC Campus',cost:45,minLevel:2,badge:'🏛️',desc:'Campus-inspired backdrop.'},
  { id:'bg-tech',slot:'background',name:'Tech Workspace',cost:70,minLevel:3,badge:'🖥️',desc:'Developer workspace backdrop.'},
  { id:'bg-office',slot:'background',name:'Modern Office',cost:100,minLevel:4,badge:'🏢',desc:'Professional interview office.'}
];

const SKILL_TREE_NODES = [
  { id: 'node-foundations', title: 'Structured Answer Foundations', category: 'All', focusArea: 'Answer Organization', reqLevel: 'Developing', reqSessions: 1, reqMinScore: 55, desc: 'Master Direct Answer → Explanation → Example → Conclusion structure.' },
  { id: 'node-web-arch', title: 'Web Stack & DOM Diagnostics', category: 'Web Development', focusArea: 'Technical Knowledge', reqLevel: 'Developing', reqSessions: 1, reqMinScore: 60, desc: 'Demonstrated mastery of frontend/backend web flow and DevTools debugging.' },
  { id: 'node-it-triage', title: 'Layered IT & Network Triage', category: 'IT Support', focusArea: 'Problem Solving', reqLevel: 'Practicing', reqSessions: 2, reqMinScore: 65, desc: 'Systematic physical-to-DNS isolation and clear user communication.' },
  { id: 'node-code-logic', title: 'Algorithmic & Debugging Rigor', category: 'Software Development', focusArea: 'Problem Solving', reqLevel: 'Practicing', reqSessions: 2, reqMinScore: 65, desc: 'Clean state vs. behavior design and step-by-step logic tracing.' },
  { id: 'node-data-sec', title: 'Relational Integrity & AppSec', category: 'Database Management', focusArea: 'Critical Thinking', reqLevel: 'Practicing', reqSessions: 2, reqMinScore: 70, desc: 'Normalized keys, referential integrity, and prepared statement defense.' },
  { id: 'node-star-pro', title: 'STAR Behavioral Leadership', category: 'Behavioral / Internship', focusArea: 'Behavioral Response', reqLevel: 'Practicing', reqSessions: 1, reqMinScore: 65, desc: 'Evidence-backed STAR stories showing accountability and calm teamwork.' },
  { id: 'node-capstone-arch', title: 'Enterprise Systems Architect', category: 'Systems Analysis', focusArea: 'Professional Relevance', reqLevel: 'Proficient', reqSessions: 4, reqMinScore: 75, desc: 'End-to-end requirements modeling (DFD/ERD/Use Case) and technical defense.' }
];


const LEGACY_WARDROBE_IDS = {
  'id-freshgrad':'id-ptc-professional','id-sysadmin':'id-network-specialist','id-fullstack':'id-developer','id-secops':'id-cybersecurity',
  'hat-crown':'hat-devcap','cloth-blazer':'cloth-suit','glass-bluelight':'glass-classic','glass-visor':'glass-tech',
  'shoe-loafers':'shoe-formal','acc-lanyard':'acc-id','acc-coffee':'acc-portfolio','bg-ptc-mint':'bg-studio','bg-server':'bg-tech','bg-boardroom':'bg-office'
};
function migrateWardrobeUsers(users={}) {
  for(const user of Object.values(users||{})){
    const p=user?.profile;if(!p)continue;
    p.equipped=p.equipped||{};
    for(const slot of ['identity','hat','clothes','glasses','shoes','accessory','background']){
      const id=p.equipped[slot];if(LEGACY_WARDROBE_IDS[id])p.equipped[slot]=LEGACY_WARDROBE_IDS[id];
    }
    p.inventory=(p.inventory||[]).map(id=>LEGACY_WARDROBE_IDS[id]||id);
  }
  return users;
}

function createInitialDb() {
  return {
    users: {},
    questions: DEFAULT_QUESTIONS.map(removeExampleBasedFollowups),
    lessons: DEFAULT_LESSONS,
    rubrics: DEFAULT_RUBRICS,
    rewardRules: DEFAULT_REWARD_RULES,
    voiceRubric: DEFAULT_VOICE_RUBRIC,
    auditLog: [],
    wardrobeCatalog: WARDROBE_CATALOG,
    skillTreeNodes: SKILL_TREE_NODES
  };
}

function removeExampleBasedFollowups(question) {
  if (!question || typeof question !== 'object') return question;
  const q = { ...question };
  if (q.followups && typeof q.followups === 'object') {
    q.followups = Object.fromEntries(Object.entries(q.followups).map(([key, value]) => {
      if (typeof value !== 'string') return [key, value];
      const asksForExample = /example|STAR|your action|what happened|the result|result of your/i.test(value);
      return [key, asksForExample ? 'Could you explain the main point a little more clearly?' : value];
    }));
  }
  return q;
}

function readDb() {
  try {
    const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const base = createInitialDb();
    return {
      users: raw.users && !Array.isArray(raw.users) ? migrateWardrobeUsers(raw.users) : {},
      questions: Array.isArray(raw.questions) && raw.questions.length ? raw.questions.map(removeExampleBasedFollowups) : base.questions.map(removeExampleBasedFollowups),
      lessons: Array.isArray(raw.lessons) && raw.lessons.length ? raw.lessons : base.lessons,
      rubrics: raw.rubrics && raw.rubrics.technical && raw.rubrics.behavioral
        ? { ...raw.rubrics, behavioral: (() => { const rows=raw.rubrics.behavioral.filter(r => !['supportingExample','example','personalAction','result'].includes(r.key)); const total=rows.reduce((n,r)=>n+Number(r.weight||0),0)||100; return rows.map(r=>({...r,weight:Math.round(Number(r.weight||0)*100/total)})); })() }
        : base.rubrics,
      rewardRules: { ...base.rewardRules, ...(raw.rewardRules || {}) },
      voiceRubric: raw.voiceRubric && typeof raw.voiceRubric === 'object' ? { ...base.voiceRubric, ...raw.voiceRubric } : base.voiceRubric,
      auditLog: Array.isArray(raw.auditLog) ? raw.auditLog : [],
      wardrobeCatalog: base.wardrobeCatalog,
      skillTreeNodes: Array.isArray(raw.skillTreeNodes) && raw.skillTreeNodes.length ? raw.skillTreeNodes : base.skillTreeNodes
    };
  } catch {
    const init = createInitialDb();
    writeDb(init);
    return init;
  }
}

function writeDb(db) {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, DB_FILE);
}

function logAdminAction(db, adminEmail, action, target, details = {}) {
  db.auditLog = db.auditLog || [];
  db.auditLog.push({
    id: 'log-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
    adminEmail,
    action,
    target,
    details,
    timestamp: new Date().toISOString()
  });
  if (db.auditLog.length > 1000) db.auditLog = db.auditLog.slice(-1000);
}

function ensureStudentRecord(db, email, name) {
  const key = email.toLowerCase();
  if (!db.users[key]) {
    db.users[key] = {
      email: key,
      name: name || key.split('@')[0],
      createdAt: new Date().toISOString(),
      xp: 0,
      coins: 30, // starter coins
      rewardClaims: [], // prevents duplicate rewards
      sessions: [],
      certificates: [],
      activeInterview: null,
      lessonProgress: {},
      unlockedNodes: [],
      achievements: [],
      inventory: ['id-freshgrad', 'hat-none', 'cloth-polo', 'glass-none', 'shoe-none', 'acc-none', 'bg-ptc-mint'],
      equipped: {
        identity: 'id-freshgrad',
        hat: 'hat-none',
        clothes: 'cloth-polo',
        glasses: 'glass-none',
        shoes: 'shoe-none',
        accessory: 'acc-none',
        background: 'bg-ptc-mint'
      }
    };
  } else if (name && !db.users[key].profileNameCustom && db.users[key].name !== name) {
    db.users[key].name = name;
  }
  db.users[key].certificates ||= [];
  db.users[key].sessions ||= [];
  return db.users[key];
}

// In-memory session store
const sessions = new Map();
const loginCodes = new Map();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function json(res, status, obj, extra = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extra
  });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => {
      body += c;
      if (body.length > 512000) {
        reject(new Error('Request too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON request payload.'));
      }
    });
    req.on('error', reject);
  });
}

function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function makeSession(res, user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { user, expires: Date.now() + 7 * 86400000 });
  res.setHeader(
    'Set-Cookie',
    `pato_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  );
}

function sessionUser(req) {
  const token = getCookie(req, 'pato_session');
  const s = token && sessions.get(token);
  if (!s || s.expires < Date.now()) {
    if (token) sessions.delete(token);
    return null;
  }
  return s.user;
}

// Compute Focus Areas & Competency Levels strictly from accumulated evidence (no repetition-only mastery)
function computeStudentAnalytics(student, db) {
  const focusDefs = [
    { name: 'Technical Knowledge', categories: ['Web Development', 'Software Development', 'IT Support', 'Networking', 'Database Management', 'Cybersecurity', 'Systems Analysis'], criteriaKeys: ['technicalAccuracy'] },
    { name: 'Problem Solving', categories: ['Software Development', 'IT Support', 'Networking', 'Cybersecurity', 'Web Development'], criteriaKeys: ['reasoning'] },
    { name: 'Communication', categories: 'all', criteriaKeys: ['clarity'] },
    { name: 'Answer Organization', categories: 'all', criteriaKeys: ['organization'] },
    { name: 'Critical Thinking', categories: 'all', criteriaKeys: ['relevance', 'reasoning'] },
    { name: 'Behavioral Response', categories: ['Behavioral / Internship'], criteriaKeys: ['relevance', 'answerContent'] },
    { name: 'Professional Relevance', categories: 'all', criteriaKeys: ['professionalRelevance', 'relevance'] }
  ];

  const completedSessions = student.sessions || [];
  const allTurns = completedSessions.flatMap(s => (s.turns || []).map(t => ({ ...t, category: s.category, mode: s.mode, date: s.date })));

  const focusAreas = focusDefs.map(def => {
    const matchingTurns = allTurns.filter(t => def.categories === 'all' || def.categories.includes(t.category));
    if (!matchingTurns.length) {
      return {
        name: def.name,
        points: 0,
        avgRating: null,
        evidenceCount: 0,
        strongCount: 0,
        level: 'Beginner',
        progressPct: 0,
        evidenceSamples: [],
        recommendedPractice: `Complete a ${def.categories === 'all' ? 'practice' : def.categories[0]} session to establish baseline evidence.`
      };
    }

    let ratingSum = 0;
    let ratingCount = 0;
    let strongCount = 0;
    const evidenceSamples = [];

    for (const t of matchingTurns) {
      if (t.classification === 'strong') strongCount++;
      if (t.evaluation && Array.isArray(t.evaluation.criteria)) {
        for (const c of t.evaluation.criteria) {
          if (def.criteriaKeys.includes(c.key)) {
            ratingSum += Number(c.rating || 0);
            ratingCount++;
          }
        }
      }
      if (t.evaluation?.evidence && evidenceSamples.length < 2) {
        evidenceSamples.push(`"${t.evaluation.evidence}" (${t.category})`);
      }
    }

    const avgRating = ratingCount ? Number((ratingSum / ratingCount).toFixed(2)) : 0;
    // Points reward quality-weighted evidence, capped per turn so repetition of weak answers cannot inflate mastery
    const points = Math.round(
      matchingTurns.reduce((acc, t) => {
        const turnScore = Number(t.evaluation?.weightedScore || 0);
        if (turnScore < 45) return acc + 2;
        return acc + Math.round((turnScore / 100) * 28);
      }, 0)
    );

    // Competency progression requires BOTH evidence volume AND quality threshold (anti-repetition gaming)
    let level = 'Beginner';
    if (avgRating >= 4.3 && strongCount >= 4 && matchingTurns.length >= 5) level = 'Advanced Practice';
    else if (avgRating >= 3.7 && strongCount >= 2 && matchingTurns.length >= 3) level = 'Proficient';
    else if (avgRating >= 3.0 && matchingTurns.length >= 2) level = 'Practicing';
    else if (matchingTurns.length >= 1) level = 'Developing';

    const levelProgressMap = { Beginner: 10, Developing: 32, Practicing: 58, Proficient: 82, 'Advanced Practice': 100 };
    const nextHint =
      level === 'Beginner' || level === 'Developing'
        ? `Aim for >= 3.0/5 across at least 2 multi-turn sessions with concrete technical examples.`
        : level === 'Practicing'
        ? `Demonstrate at least 2 Strong answers (>= 3.7/5 avg) without hints to reach Proficient.`
        : level === 'Proficient'
        ? `Sustain >= 4.3/5 across 5+ evaluated responses in Challenge or Assessment mode.`
        : `Maintain mastery by mentoring scenarios in Assessment mode.`;

    return {
      name: def.name,
      points,
      avgRating,
      evidenceCount: matchingTurns.length,
      strongCount,
      level,
      progressPct: levelProgressMap[level],
      evidenceSamples,
      recommendedPractice: nextHint
    };
  });

  // Unlock Competency Skill Tree nodes strictly by demonstrated mastery
  const levelRank = { Beginner: 0, Developing: 1, Practicing: 2, Proficient: 3, 'Advanced Practice': 4 };
  const unlockedNodes = [];
  for (const node of db.skillTreeNodes) {
    const fa = focusAreas.find(f => f.name === node.focusArea);
    const catSessions = completedSessions.filter(s => node.category === 'All' || s.category === node.category);
    const bestCatScore = catSessions.reduce((m, s) => Math.max(m, Number(s.score || 0)), 0);
    const meetsLevel = fa && levelRank[fa.level] >= levelRank[node.reqLevel];
    const meetsCount = catSessions.length >= node.reqSessions;
    const meetsScore = bestCatScore >= node.reqMinScore;
    if (meetsLevel && meetsCount && meetsScore) {
      unlockedNodes.push(node.id);
    }
  }
  student.unlockedNodes = unlockedNodes;

  // Compute Interview DNA
  const strengthList = [];
  const gapList = [];
  const conceptMastery = {};
  const missedConceptCounts = {};

  for (const t of allTurns) {
    for (const c of t.evaluation?.conceptsExplained || []) {
      conceptMastery[c] = (conceptMastery[c] || 0) + 1;
    }
    for (const m of t.evaluation?.conceptsMissing || []) {
      missedConceptCounts[m] = (missedConceptCounts[m] || 0) + 1;
    }
  }

  const sortedFocus = [...focusAreas].filter(f => f.avgRating !== null).sort((a, b) => b.avgRating - a.avgRating);
  if (sortedFocus.length) {
    const top = sortedFocus[0];
    strengthList.push(`Strongest dimension: ${top.name} (${top.avgRating}/5 across ${top.evidenceCount} responses)`);
    const bottom = sortedFocus[sortedFocus.length - 1];
    if (bottom.avgRating < 3.8) {
      gapList.push(`Primary growth area: ${bottom.name} (${bottom.avgRating}/5 average)`);
    }
  }

  const topConcepts = Object.entries(conceptMastery).sort((a, b) => b[1] - a[1]).slice(0, 3);
  for (const [concept, cnt] of topConcepts) {
    strengthList.push(`Verified concept mastery: ${concept} (explained ${cnt}x)`);
  }

  const recurringGaps = Object.entries(missedConceptCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  for (const [gap, cnt] of recurringGaps) {
    gapList.push(`Recurring missing concept: ${gap} (omitted ${cnt}x)`);
  }

  const categoryCounts = {};
  completedSessions.forEach(s => { categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1; });
  const unpracticedCats = ['Web Development', 'Software Development', 'IT Support', 'Networking', 'Database Management', 'Cybersecurity', 'Systems Analysis', 'Behavioral / Internship'].filter(c => !categoryCounts[c]);

  const dna = {
    assessed: completedSessions.length > 0,
    strengths: strengthList,
    recurringGaps: gapList,
    patterns: completedSessions.length
      ? [
          `Completed ${completedSessions.length} session(s) totaling ${allTurns.length} evaluated response turn(s).`,
          `Strong responses: ${allTurns.filter(t => t.classification === 'strong').length} · Incomplete/Vague: ${allTurns.filter(t => ['incomplete', 'vague', 'keyword-only'].includes(t.classification)).length} · Needs correction: ${allTurns.filter(t => ['incorrect', 'irrelevant'].includes(t.classification)).length}.`
        ]
      : [],
    recommendedPractice: unpracticedCats.length
      ? `Explore ${unpracticedCats[0]} next to broaden your BSIT readiness profile.`
      : sortedFocus.length
      ? `Practice ${sortedFocus[sortedFocus.length - 1].name} in Challenge Mode to push toward Proficient mastery.`
      : 'Complete your first voice interview to generate your Interview DNA profile.'
  };

  return { focusAreas, dna, unlockedNodes };
}

// Deterministic semantic & structural evaluator + Gemini API integration when GEMINI_API_KEY is configured
function evaluateAnswerDeterministic({ transcript, questionObj, rubric, history, mode, hintsUsed, audioMetrics }) {
  const clean = String(transcript || '').trim();
  const lower = clean.toLowerCase();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Examples, personal actions, and outcomes are never scoring requirements.
  const keywords = (questionObj.keywords || []).filter(k => !/\b(example|your action|personal action|result|outcome)\b/i.test(String(k)));
  const concepts = (questionObj.concepts || []).filter(c => !/\b(example|personal action|action steps|concrete result|result & takeaway|outcome)\b/i.test(String(c)));
  const misconceptions = questionObj.misconceptions || [];

  // 1. Check unassessable / no answer
  if (wordCount < 3 || /^(\[no speech\]|uh+|um+|idk|i don'?t know|pass|skip|none)\.?$/i.test(clean)) {
    const zeroCriteria = rubric.map(r => ({
      key: r.key,
      name: r.name,
      weight: r.weight,
      rating: 0,
      note: 'No substantive spoken response provided to assess this criterion.'
    }));
    return {
      classification: 'unassessable',
      weightedScore: 0,
      criteria: zeroCriteria,
      transcriptEvidence: clean || '(No speech captured)',
      strengths: ['Attempted the prompt turn in the simulation flow.'],
      weaknesses: ['Response did not contain enough spoken content to evaluate technical or behavioral reasoning.'],
      conceptsExplained: [],
      conceptsMentioned: [],
      conceptsMissing: concepts,
      misconceptionsDetected: [],
      scoreReason: 'Classified as Unassessable because fewer than 3 meaningful words or only non-substantive filler was captured.',
      actionableImprovement: 'Review the question, think about the main point, and try again when ready.',
      followupQuestion: questionObj.followups?.vague || 'Would you like a hint, or can you tell me your first thought?',
      branchReason: 'Triggered recovery/simplification branch because the transcript was unassessable.',
      difficultyShift: 'Simplified',
      audioDelivery: normalizeAudioMetrics(audioMetrics, wordCount)
    };
  }

  // 2. Semantic concept & keyword detection
  const matchedKeywords = keywords.filter(k => lower.includes(k.toLowerCase()));
  const conceptsExplained = [];
  const conceptsMentioned = [];
  const conceptsMissing = [];

  const reasoningConnectors = ['because', 'so that', 'which means', 'therefore', 'first', 'next', 'then', 'finally', 'when', 'if', 'prevents', 'allows', 'ensures', 'step'];
  const hasReasoning = reasoningConnectors.some(c => lower.includes(c));
  const hasStructure = ['first', 'second', 'third', 'step 1', 'next', 'finally', 'in conclusion'].some(s => lower.includes(s));

  for (const concept of concepts) {
    const tokens = concept
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 3 && !['with', 'from', 'that', 'this', 'into', 'when', 'each', 'only'].includes(t));
    const hits = tokens.filter(tok => lower.includes(tok));
    const ratio = tokens.length ? hits.length / tokens.length : 0;
    if (ratio >= 0.45 && (hasReasoning || wordCount >= 22)) {
      conceptsExplained.push(concept);
    } else if (ratio >= 0.25 || hits.length >= 1) {
      conceptsMentioned.push(concept);
    } else {
      conceptsMissing.push(concept);
    }
  }

  // 3. Misconception check
  const misconceptionsDetected = [];
  for (const m of misconceptions) {
    const mTokens = m.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const mHits = mTokens.filter(w => lower.includes(w));
    if (mHits.length >= 3 && !lower.includes('not ') && !lower.includes("isn't") && !lower.includes("doesn't")) {
      misconceptionsDetected.push(m);
    }
  }

  // 4. Relevance check (against category + question topic tokens)
  const qTokens = (questionObj.text + ' ' + questionObj.category)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['what', 'when', 'where', 'which', 'would', 'could', 'should', 'about', 'their', 'there', 'your', 'with', 'from', 'that', 'this', 'have', 'into'].includes(w));
  const topicOverlap = qTokens.filter(w => lower.includes(w)).length + matchedKeywords.length;

  // 5. Classify answer into the 7 required categories
  let classification = 'incomplete';
  if (topicOverlap === 0 && wordCount >= 5) {
    classification = 'irrelevant';
  } else if (misconceptionsDetected.length > 0) {
    classification = 'incorrect';
  } else if (matchedKeywords.length >= 2 && !hasReasoning && wordCount < 22) {
    classification = 'keyword-only';
  } else if (wordCount < 16 && conceptsExplained.length === 0) {
    classification = 'vague';
  } else if ((concepts.length === 0 ? matchedKeywords.length >= 2 : conceptsExplained.length >= Math.max(2, Math.ceil(concepts.length * 0.6))) && hasReasoning && wordCount >= 26) {
    classification = 'strong';
  } else if (conceptsExplained.length >= 1 || (matchedKeywords.length >= 2 && hasReasoning)) {
    classification = 'incomplete';
  } else {
    classification = 'vague';
  }

  // 6. Compute criterion ratings (0-5 scale) transparently from evidence
  const baseByClass = {
    strong: 4.4,
    incomplete: 3.1,
    'keyword-only': 2.3,
    vague: 2.2,
    incorrect: 1.5,
    irrelevant: 0.8,
    unassessable: 0
  };
  let base = baseByClass[classification];
  if (hasStructure && classification !== 'irrelevant') base += 0.25;
  if (conceptsExplained.length === concepts.length && concepts.length > 0) base += 0.3;
  // Slight penalty if hints were used in Practice/Challenge
  if (hintsUsed > 0) base = Math.max(0.5, base - hintsUsed * 0.15);

  const clamp5 = v => Number(Math.max(0, Math.min(5, v)).toFixed(1));

  const criteria = rubric.map(r => {
    let rating = base;
    let note = '';
    if (r.key === 'technicalAccuracy') {
      rating = classification === 'incorrect' ? 1.2 : classification === 'irrelevant' ? 0.5 : base + (conceptsExplained.length - conceptsMissing.length) * 0.25;
      note = conceptsExplained.length
        ? `Accurately explained: ${conceptsExplained.join('; ')}.`
        : misconceptionsDetected.length
        ? `Misconception flagged: ${misconceptionsDetected[0]}.`
        : `Missing core technical concepts: ${conceptsMissing.join('; ') || 'key mechanisms'}.`;
    } else if (r.key === 'relevance') {
      rating = classification === 'irrelevant' ? 0.6 : Math.min(5, base + (topicOverlap >= 3 ? 0.35 : -0.2));
      note = classification === 'irrelevant'
        ? 'Response drifted away from the prompt’s BSIT topic.'
        : `Addressed ${topicOverlap} relevant domain indicator(s) tied to ${questionObj.category}.`;
    } else if (r.key === 'reasoning') {
      rating = hasReasoning ? base + 0.3 : base - 0.45;
      note = hasReasoning
        ? 'Used causal/sequential reasoning connectors to justify steps.'
        : 'Stated assertions without explaining "why" or cause-and-effect.';
    } else if (r.key === 'organization') {
      rating = hasStructure ? base + 0.35 : wordCount >= 25 ? base : base - 0.35;
      note = hasStructure
        ? 'Clear sequential flow with identifiable opening and progression.'
        : 'Could be organized more clearly with a direct answer and a short explanation.';
    } else if (r.key === 'clarity') {
      rating = wordCount >= 15 && wordCount <= 160 ? base + 0.25 : base - 0.25;
      note = `Captured ${wordCount} spoken words; ${wordCount >= 18 ? 'clear sentence articulation.' : 'brief phrasing limited clarity.'}`;
    } else if (r.key === 'answerContent' || r.key === 'content') {
      rating = classification === 'irrelevant' ? 0.6 : classification === 'incorrect' ? 1.2
        : Math.min(5, base + (conceptsExplained.length ? 0.35 : 0) - (conceptsMissing.length ? 0.2 : 0));
      note = conceptsExplained.length
        ? `Answered the main point and explained ${conceptsExplained.length} key idea(s).`
        : conceptsMissing.length
          ? `The answer needs more key information: ${conceptsMissing.slice(0, 2).join('; ')}.`
          : 'Scored on the answer itself, not on examples.';
    } else if (r.key === 'professionalRelevance') {
      rating = topicOverlap >= 2 ? base + 0.3 : base - 0.2;
      note = 'Evaluated alignment with entry-level BSIT workplace standards.';
    }
    rating = clamp5(rating);
    return { key: r.key, name: r.name, weight: Number(r.weight), rating, note };
  });

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0) || 100;
  const weightedScore = Math.round(criteria.reduce((s, c) => s + (c.rating / 5) * (c.weight / totalWeight) * 100, 0));

  // Extract direct transcript evidence snippet
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const evidenceSentence = sentences[0] ? sentences[0].slice(0, 180) : clean.slice(0, 180);

  // Adaptive follow-up selection (avoiding duplicates in history)
  const usedQuestions = new Set((history || []).map(h => h.question));
  let followupQuestion = questionObj.followups?.[classification] || questionObj.followups?.incomplete;
  if (!followupQuestion || usedQuestions.has(followupQuestion)) {
    followupQuestion = 'Could you explain the main point a little more clearly?';
  }

  const branchReasonMap = {
    strong: `Classified as STRONG (${conceptsExplained.length}/${concepts.length} core concepts explained with reasoning) → Escalated to advanced application follow-up.`,
    incomplete: `Classified as INCOMPLETE (omitted: ${conceptsMissing.slice(0, 2).join(', ') || 'key depth'}) → Asking about missing points.`,
    'keyword-only': `Classified as KEYWORD-ONLY (mentioned ${matchedKeywords.slice(0, 3).join(', ')} without explaining the idea) → Checking understanding.`,
    incorrect: `Classified as INCORRECT (${misconceptionsDetected[0] || 'conceptual inaccuracy'}) → Clarifying the idea.`,
    vague: `Classified as VAGUE (did not explain the main idea clearly) → Asking for a clearer explanation.`,
    irrelevant: `Classified as IRRELEVANT (off-topic relative to ${questionObj.category}) → Redirecting back to core question.`
  };

  const difficultyShiftMap = {
    strong: 'Advanced (+1)',
    incomplete: 'Maintained (Probing)',
    'keyword-only': 'Verification',
    incorrect: 'Simplified (-1)',
    vague: 'Scaffolded',
    irrelevant: 'Redirected'
  };

  const strengths = [];
  if (conceptsExplained.length) strengths.push(`Clearly explained: ${conceptsExplained.join(', ')}.`);
  if (hasReasoning) strengths.push('Demonstrated cause-and-effect reasoning rather than isolated buzzwords.');
  if (!strengths.length) strengths.push('Engaged with the prompt and provided an initial spoken attempt.');

  const weaknesses = [];
  if (conceptsMissing.length) weaknesses.push(`Omitted key concepts: ${conceptsMissing.join(', ')}.`);
  if (misconceptionsDetected.length) weaknesses.push(`Technical misconception detected: ${misconceptionsDetected.join('; ')}.`);
  if (!hasReasoning) weaknesses.push('Needed deeper step-by-step explanation of how/why the mechanism works.');

  const scoreReason = `Score ${weightedScore}/100 (${classification.toUpperCase()}): Based on ${conceptsExplained.length}/${concepts.length} explained concepts, ${matchedKeywords.length} relevant terms, and ${hasReasoning ? 'clear' : 'limited'} reasoning${hintsUsed ? ` (adjusted for ${hintsUsed} hint(s) used)` : ''}.`;

  const actionableImprovement =
    classification === 'strong'
      ? 'Your answer is strong. If needed, explain one trade-off in simple words.'
      : conceptsMissing.length
      ? `Explain ${conceptsMissing[0]} in simple terms and connect it to the question.`
      : 'Start with your main answer, then explain why it makes sense.';

  const audioDeliveryResult = normalizeAudioMetrics(audioMetrics, wordCount);

  return {
    classification,
    weightedScore,
    criteria,
    transcriptEvidence: evidenceSentence,
    strengths,
    weaknesses,
    conceptsExplained,
    conceptsMentioned,
    conceptsMissing,
    misconceptionsDetected,
    scoreReason,
    actionableImprovement,
    followupQuestion,
    branchReason: branchReasonMap[classification],
    difficultyShift: difficultyShiftMap[classification],
    audioDelivery: normalizeAudioMetrics(audioMetrics, wordCount),
    voiceScore: null,
    voiceScoreBreakdown: [],
    voiceScoreReason: ''
  };
}

function normalizeAudioMetrics(raw, wordCount) {
  if (!raw || !raw.durationSec || raw.durationSec < 1) {
    return {
      status: 'Not assessed',
      wpm: 'Not assessed',
      pauseCount: 'Not assessed',
      fillerCount: 'Not assessed',
      restarts: 'Not assessed',
      clarityNote: 'Audio delivery metrics unavailable for this turn (marked Not assessed; content score unaffected).',
      voiceScore: null,
      voiceScoreBreakdown: [],
      voiceScoreReason: 'Voice Score was not calculated because no usable audio-duration evidence was captured.'
    };
  }
  const minutes = Math.max(0.05, Number(raw.durationSec) / 60);
  const wpm = Math.round(wordCount / minutes);
  const paceLabel = wpm < 95 ? 'Measured / Deliberate' : wpm <= 165 ? 'Conversational & Clear' : 'Fast Pace';
  const pauseCount = Number(raw.pauseCount || 0);
  const fillerCount = Number(raw.fillerCount || 0);
  const restarts = Number(raw.restarts || 0);

  const paceScore = wpm < 70 ? 55 : wpm <= 95 ? 80 : wpm <= 165 ? 100 : wpm <= 190 ? 75 : 55;
  const fluencyScore = Math.max(0, 100 - restarts * 12);
  const deliveryScore = Math.max(0, 100 - pauseCount * 6 - fillerCount * 5);
  const engagementScore = wordCount < 10 ? 45 : wordCount < 25 ? 70 : wordCount < 80 ? 90 : 100;

  const voiceScore = Math.round(
    paceScore * 0.25 + fluencyScore * 0.25 + deliveryScore * 0.25 + engagementScore * 0.25
  );

  return {
    status: 'Assessed (Separate Voice Score)',
    wpm: `${wpm} WPM (${paceLabel})`,
    pauseCount: `${pauseCount} pause(s)`,
    fillerCount: `${fillerCount} filler(s)`,
    restarts: `${restarts} restart(s)`,
    clarityNote: 'Voice Score is calculated separately from the Job Interview Skill Score and does not penalize accent.',
    voiceScore,
    voiceScoreBreakdown: [
      { key: 'pace', name: 'Speaking Pace', weight: 25, score: paceScore, evidence: `${wpm} WPM (${paceLabel})` },
      { key: 'fluency', name: 'Fluency & Restarts', weight: 25, score: fluencyScore, evidence: `${restarts} restart(s)` },
      { key: 'delivery', name: 'Pauses & Fillers', weight: 25, score: deliveryScore, evidence: `${pauseCount} pause(s), ${fillerCount} filler(s)` },
      { key: 'engagement', name: 'Response Engagement', weight: 25, score: engagementScore, evidence: `${wordCount} spoken words` }
    ],
    voiceScoreReason: `Separate Voice Score ${voiceScore}/100 derived from pace, fluency, delivery, and response engagement.`
  };
}

async function evaluateWithGeminiOrFallback(payload) {
  const fallback = evaluateAnswerDeterministic(payload);
  if (!GEMINI_API_KEY) {
    return { ...fallback, engine: 'Semantic Rubric Engine (Local)' };
  }
  try {
    const prompt = `You are a friendly BSIT job interview evaluator for Pateros Technological College. Use simple everyday English. Keep questions and feedback short and friendly. Add gentle humor only when it fits.
Evaluate the student's spoken transcript strictly using the rubric and return ONLY valid JSON matching the schema.
Question Category: ${payload.questionObj.category}
Question: ${payload.questionObj.text}
Expected Concepts: ${JSON.stringify(payload.questionObj.concepts)}
Known Misconceptions: ${JSON.stringify(payload.questionObj.misconceptions)}
Prior Conversation Turns: ${JSON.stringify((payload.history || []).map(h => ({ q: h.question, a: h.answer, cls: h.classification })))}
Student Transcript: "${payload.transcript}"
Rubric Criteria: ${JSON.stringify(payload.rubric)}

Rules:
1. Classify into exact one of: "strong", "incomplete", "keyword-only", "incorrect", "vague", "irrelevant", "unassessable".
2. Rate each rubric criterion from 0.0 to 5.0 with clear transcript evidence.
3. Generate an short follow-up question based on their answer without repeating prior questions.
4. Never evaluate accent, confidence, or emotion. Do not reward or penalize examples, personal actions, or results. Use simple English in questions and feedback. Keep each feedback line short and easy to understand.
Return JSON keys: classification, criteria (array of {key,name,weight,rating,note}), transcriptEvidence, strengths (string[]), weaknesses (string[]), conceptsExplained (string[]), conceptsMentioned (string[]), conceptsMissing (string[]), misconceptionsDetected (string[]), scoreReason, actionableImprovement, followupQuestion, branchReason, difficultyShift.`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.25 }
        })
      }
    );
    if (!resp.ok) throw new Error('Gemini HTTP ' + resp.status);
    const data = await resp.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(rawText);
    const validClasses = ['strong', 'incomplete', 'keyword-only', 'incorrect', 'vague', 'irrelevant', 'unassessable'];
    if (!validClasses.includes(parsed.classification) || !Array.isArray(parsed.criteria)) {
      throw new Error('Malformed AI JSON');
    }
    const mergedCriteria = payload.rubric.map(r => {
      const found = parsed.criteria.find(c => c.key === r.key || c.name === r.name) || {};
      const rating = Number(Math.max(0, Math.min(5, Number(found.rating ?? 2.5))).toFixed(1));
      return { key: r.key, name: r.name, weight: Number(r.weight), rating, note: String(found.note || 'Evaluated against rubric.') };
    });
    const totalW = mergedCriteria.reduce((s, c) => s + c.weight, 0) || 100;
    let weightedScore = Math.round(mergedCriteria.reduce((s, c) => s + (c.rating / 5) * (c.weight / totalW) * 100, 0));
    if (payload.hintsUsed > 0) weightedScore = Math.max(0, weightedScore - payload.hintsUsed * 3);

    return {
      ...fallback,
      ...parsed,
      criteria: mergedCriteria,
      weightedScore,
      audioDelivery: normalizeAudioMetrics(payload.audioMetrics, String(payload.transcript || '').trim().split(/\s+/).filter(Boolean).length),
      engine: `AI Adaptive Evaluator (${GEMINI_MODEL})`
    };
  } catch (err) {
    return { ...fallback, engine: 'Semantic Rubric Engine (AI Fallback)' };
  }
}


// Student profile uses the existing authenticated session and atomic JSON DB writer.
function publicStudentProfile(student) {
  return {
    name: student.name, email: student.email,
    programSection: student.programSection || [student.program, student.section].filter(Boolean).join(' · '),
    photo: student.photo || '', googlePhoto: student.googlePhoto || ''
  };
}
function validateProfileImage(value) {
  if (typeof value !== 'string' || value.length > 350000) throw new Error('Profile photo must be an image of at most 256 KB after processing.');
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match) throw new Error('Only JPG, PNG and WEBP profile images are supported.');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 256 * 1024 || bytes.toString('base64') !== match[2]) throw new Error('Invalid or oversized profile image.');
  let width=0, height=0;
  if (match[1] === 'png') {
    if (bytes.length < 45 || !bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || bytes.readUInt32BE(8)!==13 || bytes.toString('ascii',12,16)!=='IHDR' || bytes.toString('ascii',bytes.length-8,bytes.length-4)!=='IEND') throw new Error('Invalid PNG image.');
    width=bytes.readUInt32BE(16); height=bytes.readUInt32BE(20);
  } else if (match[1] === 'jpeg') {
    if (bytes.length<12 || bytes[0]!==255 || bytes[1]!==216 || bytes[2]!==255 || bytes[bytes.length-2]!==255 || bytes[bytes.length-1]!==217) throw new Error('Invalid JPEG image.');
    let offset=2;
    while(offset+3<bytes.length) {
      if(bytes[offset++]!==255) break;
      while(bytes[offset]===255) offset++;
      const marker=bytes[offset++];
      if(marker===218||marker===217) break;
      if(marker===1||(marker>=208&&marker<=215)) continue;
      if(offset+2>bytes.length) break;
      const length=bytes.readUInt16BE(offset);
      if(length<2||offset+length>bytes.length) break;
      if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)&&length>=8){height=bytes.readUInt16BE(offset+3);width=bytes.readUInt16BE(offset+5);break;}
      offset+=length;
    }
  } else {
    if(bytes.length<30||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||bytes.readUInt32LE(4)+8!==bytes.length) throw new Error('Invalid WEBP image.');
    const kind=bytes.toString('ascii',12,16);
    if(kind==='VP8X') {width=1+bytes.readUIntLE(24,3);height=1+bytes.readUIntLE(27,3);}
    else if(kind==='VP8 '&&bytes[23]===157&&bytes[24]===1&&bytes[25]===42){width=bytes.readUInt16LE(26)&16383;height=bytes.readUInt16LE(28)&16383;}
    else if(kind==='VP8L'&&bytes[20]===47){const bits=bytes.readUInt32LE(21);width=1+(bits&16383);height=1+((bits>>>14)&16383);}
  }
  if(!width||!height||width>4096||height>4096||width*height>16000000) throw new Error('Unsupported image dimensions. Choose an image no larger than 4096 pixels per side.');
  return value;
}
function validateProfileChanges(body, email) {
  if(!body||typeof body!=='object'||Array.isArray(body)) throw new Error('Invalid profile request.');
  const keys=Object.keys(body);
  if(!keys.length||keys.some(key=>!['name','email','programSection','photo'].includes(key))) throw new Error('Unsupported profile fields.');
  if('email' in body&&(typeof body.email!=='string'||body.email.trim().toLowerCase()!==email.toLowerCase())) throw new Error('Your verified sign-in email cannot be changed here.');
  const changes={};
  if('name' in body){
    if(typeof body.name!=='string') throw new Error('Enter a valid full name.');
    const name=body.name.trim();
    if(name.length<2||name.length>100||/[\u0000-\u001f\u007f]/.test(name)) throw new Error('Full name must contain 2 to 100 characters without control characters.');
    changes.name=name;changes.profileNameCustom=true;
  }
  if('programSection' in body){
    if(typeof body.programSection!=='string') throw new Error('Enter a valid program and section.');
    const program=body.programSection.trim();
    if(!program||program.length>120||/[\u0000-\u001f\u007f]/.test(program)) throw new Error('Program & Section must contain 1 to 120 characters without control characters.');
    changes.programSection=program;
  }
  if('photo' in body) changes.photo=validateProfileImage(body.photo);
  if(!Object.keys(changes).length) throw new Error('No profile changes were supplied.');
  return changes;
}

async function handleApi(req, res, url) {
  // 1. Google Workspace Sign-In (Preserved)
  if (req.method === 'POST' && url === '/api/auth/google') {
    const b = await readBody(req);
    const credential = String(b.credential || '');
    if (!credential) return json(res, 400, { error: 'Google credential is missing.' });
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch {
      return json(res, 401, { error: 'Google sign-in could not be verified. Please try again.' });
    }
    const email = String(payload.email || '').toLowerCase();
    if (payload.email_verified !== true || !email.endsWith('@' + DOMAIN) || String(payload.hd || '').toLowerCase() !== DOMAIN) {
      return json(res, 403, { error: 'Use a verified PTC Google Workspace account ending in @paterostechnologicalcollege.edu.ph.' });
    }
    const db = readDb();
    const student = ensureStudentRecord(db, email, payload.name || email.split('@')[0]);
    if (!student.googlePhoto && /^https:\/\/[^/]+\.googleusercontent\.com\//i.test(String(payload.picture || ''))) student.googlePhoto = payload.picture;
    writeDb(db);
    const publicUser = { name: student.name, email: student.email, role: 'user' };
    makeSession(res, publicUser);
    return json(res, 200, { user: publicUser });
  }

  // 2. Email verification-code sign-in for students, alumni, and administrators
  if (req.method === 'POST' && url === '/api/auth/request-code') {
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    if (!email.endsWith('@paterostechnologicalcollege.edu.ph')) {
      return json(res, 400, { error: 'Use your PTC email address.' });
    }
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    const code = String(Math.floor(100000 + Math.random() * 900000));
    loginCodes.set(email, { code, role, expires: Date.now() + 10 * 60 * 1000 });
    let emailed = false;
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || '') === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'InterAct verification code',
        text: `Your InterAct verification code is ${code}. It expires in 10 minutes.`
      });
      emailed = true;
    } catch (err) {
      console.error('Email sending failed:', err.message);
    }
    return json(res, 200, { sent: true, emailed, demoCode: emailed ? undefined : code });
  }

  if (req.method === 'POST' && url === '/api/auth/verify-code') {
    const b = await readBody(req);
    const email = String(b.email || '').trim().toLowerCase();
    const code = String(b.code || '').trim();
    const record = loginCodes.get(email);
    if (!record || record.expires < Date.now()) {
      loginCodes.delete(email);
      return json(res, 400, { error: 'Verification code expired. Request a new code.' });
    }
    if (record.code !== code) {
      return json(res, 400, { error: 'Invalid verification code.' });
    }
    loginCodes.delete(email);
    if (record.role === 'admin') {
      const adminUser = { email: ADMIN_EMAIL, name: 'Administrator', role: 'admin' };
      makeSession(res, adminUser);
      return json(res, 200, { user: adminUser });
    }
    const db = readDb();
    const student = ensureStudentRecord(db, email, email.split('@')[0]);
    writeDb(db);
    const user = { email: student.email, name: student.name, role: 'user' };
    makeSession(res, user);
    return json(res, 200, { user });
  }


  // 3. Logout & Current User
  if (req.method === 'POST' && url === '/api/auth/logout') {
    const token = getCookie(req, 'pato_session');
    if (token) sessions.delete(token);
    res.writeHead(200, {
      'Set-Cookie': 'pato_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
      'Cache-Control': 'no-store'
    });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (req.method === 'GET' && url === '/api/auth/me') {
    const user = sessionUser(req);
    return json(res, user ? 200 : 401, user ? { user } : { error: 'Not signed in.' });
  }

  // Require authenticated user for all subsequent routes
  const user = sessionUser(req);
  if (!user) return json(res, 401, { error: 'Authentication required. Please sign in.' });

  // Profile updates are restricted to the authenticated student's own record.
  if ((req.method === 'GET' || req.method === 'POST') && url === '/api/profile') {
    if (user.role !== 'user') return json(res, 403, { error: 'Student account required.' });
    let changes = null;
    if (req.method === 'POST') {
      try { changes = validateProfileChanges(await readBody(req), user.email); }
      catch (error) { return json(res, 400, { error: error.message }); }
    }
    // Read after awaiting the body to avoid overwriting another completed update.
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    if (changes) {
      Object.assign(student, changes, {profileUpdatedAt: new Date().toISOString()});
      writeDb(db);
      // Keep all active sessions for this account consistent with the saved display name.
      for (const session of sessions.values()) if (session.user.email === user.email) session.user.name = student.name;
    }
    return json(res, 200, { profile: publicStudentProfile(student), user: { name: student.name, email: student.email, role: 'user' } });
  }

  // 4. Student Bootstrap State (Isolated strictly to logged-in student email)
  if (req.method === 'GET' && url === '/api/state') {
    const db = readDb();
    if (user.role === 'admin') {
      return json(res, 200, {
        role: 'admin',
        voiceRubric: db.voiceRubric,
        auditLog: db.auditLog || [],
        questions: db.questions,
        lessons: db.lessons,
        rubrics: db.rubrics,
        rewardRules: db.rewardRules,
        wardrobeCatalog: db.wardrobeCatalog,
        skillTreeNodes: db.skillTreeNodes,
        students: Object.values(db.users).map(u => ({
          email: u.email,
          name: u.name,
          xp: u.xp,
          coins: u.coins,
          level: Math.floor((u.xp || 0) / 150) + 1,
          sessionCount: (u.sessions || []).length,
          avgScore: u.sessions?.length ? Math.round(u.sessions.reduce((a, s) => a + Number(s.jobInterviewSkillScore ?? s.score ?? 0), 0) / u.sessions.length) : null,
          avgVoiceScore: (() => { const vs = (u.sessions || []).map(x => Number(x.voiceScore)).filter(Number.isFinite); return vs.length ? Math.round(vs.reduce((x, y) => x + y, 0) / vs.length) : null; })(),
          lastActive: u.sessions?.length ? u.sessions[u.sessions.length - 1].date : u.createdAt,
          sessions: u.sessions || []
        }))
      });
    }
    const student = ensureStudentRecord(db, user.email, user.name);
    // Backfill certificates only from genuine saved completed sessions that meet the threshold.
    for (const saved of (student.sessions || [])) {
      const savedScore = Number(saved.jobInterviewSkillScore ?? saved.score);
      const completed = !saved.status || ['completed','complete','finished'].includes(String(saved.status).toLowerCase());
      if (completed && Number.isFinite(savedScore) && savedScore >= 85 && savedScore <= 100 && !(student.certificates || []).some(c => c.sessionId === saved.id)) {
        student.certificates.push({
          id: `PATO-${new Date().getUTCFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
          sessionId: saved.id,
          studentName: student.name,
          lessonTitle: String(saved.category || 'Interview Practice'),
          score: savedScore,
          achievement: savedScore >= 95 ? 'OUTSTANDING' : savedScore >= 90 ? 'EXCELLENT' : 'PASSED',
          completedAt: saved.date
        });
      }
    }
    const analytics = computeStudentAnalytics(student, db);
    writeDb(db);
    return json(res, 200, {
      role: 'user',
      profile: {
        email: student.email,
        name: student.name,
        programSection: student.programSection || [student.program, student.section].filter(Boolean).join(' · '),
        photo: student.photo || '',
        googlePhoto: student.googlePhoto || '',
        xp: student.xp,
        coins: student.coins,
        level: Math.floor((student.xp || 0) / 150) + 1,
        nextLevelXp: (Math.floor((student.xp || 0) / 150) + 1) * 150,
        sessions: student.sessions,
        certificates: student.certificates || [],
        activeInterview: student.activeInterview || null,
        lessonProgress: student.lessonProgress,
        unlockedNodes: analytics.unlockedNodes,
        achievements: student.achievements,
        inventory: student.inventory,
        equipped: student.equipped
      },
      analytics,
      questions: db.questions,
      lessons: db.lessons,
      rubrics: db.rubrics,
      wardrobeCatalog: db.wardrobeCatalog,
      skillTreeNodes: db.skillTreeNodes
    });
  }

  // Persist one unfinished interview per authenticated student; never expose another student's draft.
  if (url === '/api/interview/progress' && user.role === 'user') {
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    if (req.method === 'GET') return json(res, 200, { progress: student.activeInterview || null });
    if (req.method === 'DELETE') {
      student.activeInterview = null; writeDb(db);
      return json(res, 200, { ok: true });
    }
    if (req.method === 'POST') {
      const b = await readBody(req);
      const draft = b.progress;
      if (!draft || typeof draft !== 'object' || !draft.sessionId || !draft.currentQuestion || !Array.isArray(draft.turns)) {
        return json(res, 400, { error: 'A valid interview progress record is required.' });
      }
      if (student.sessions.some(s => s.id === String(draft.sessionId))) return json(res, 409, { error: 'This interview has already been completed.' });
      student.activeInterview = { ...draft, sessionId: String(draft.sessionId), updatedAt: new Date().toISOString(), status: 'paused' };
      writeDb(db);
      return json(res, 200, { ok: true, savedAt: student.activeInterview.updatedAt });
    }
  }

  // 5. Evaluate Single Spoken Turn (Adaptive Branching + Rubric Scoring)
  if (req.method === 'POST' && url === '/api/interview/evaluate-turn') {
    const b = await readBody(req);
    const db = readDb();
    const questionObj = b.customQuestion || db.questions.find(q => Number(q.id) === Number(b.questionId));
    if (!questionObj) return json(res, 404, { error: 'Question not found.' });
    const qType = questionObj.type === 'behavioral' || questionObj.category.toLowerCase().includes('behavioral') ? 'behavioral' : 'technical';
    const rubric = questionObj.scheme === 'pato-entry-10' ? [
      {key:'answerContent',name:'Answer Content',weight:34,focusArea:'Behavioral Response'},
      {key:'organization',name:'Organization',weight:33,focusArea:'Answer Organization'},
      {key:'relevance',name:'Relevance',weight:33,focusArea:'Professional Relevance'}
    ] : (db.rubrics[qType] || DEFAULT_RUBRICS.technical);
    const evaluation = await evaluateWithGeminiOrFallback({
      transcript: b.transcript,
      questionObj,
      rubric,
      history: b.history || [],
      mode: b.mode || 'Practice',
      hintsUsed: Number(b.hintsUsed || 0),
      audioMetrics: b.audioMetrics || null
    });
    if (questionObj.scheme === 'pato-entry-10' && evaluation.engine === 'Semantic Rubric Engine (Local)') evaluation.engine = 'Local heuristic rubric (practice estimate)';
    return json(res, 200, { evaluation, rubricType: qType });
  }

  // 6. Save Completed Interview Session (With anti-duplicate reward guard)
  if (req.method === 'POST' && url === '/api/interview/complete') {
    if (user.role !== 'user') return json(res, 403, { error: 'Student account required.' });
    const b = await readBody(req);
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    const sessionId = String(b.sessionId || Date.now());

    // Prevent duplicate rewards for same sessionId
    if (student.rewardClaims.includes(sessionId)) {
      return json(res, 409, { error: 'This session has already been recorded and rewarded.' });
    }

    const turns = Array.isArray(b.turns) ? b.turns : [];
    if (!turns.length) return json(res, 400, { error: 'Cannot save an empty interview session.' });

    const jobInterviewSkillScore = Math.round(turns.reduce((sum, t) => sum + Number(t.evaluation?.weightedScore || 0), 0) / turns.length);
    const voiceTurnScores = turns.map(t => Number(t.evaluation?.voiceScore)).filter(v => Number.isFinite(v));
    const voiceScore = voiceTurnScores.length ? Math.round(voiceTurnScores.reduce((x, y) => x + y, 0) / voiceTurnScores.length) : null;
    const score = jobInterviewSkillScore;
    const mode = ['Practice', 'Challenge', 'Assessment'].includes(b.mode) ? b.mode : 'Practice';
    const rules = db.rewardRules;
    const modeMult = mode === 'Assessment' ? rules.assessmentMultiplier : mode === 'Challenge' ? rules.challengeMultiplier : rules.practiceMultiplier;

    const earnedXp = Math.round((rules.xpPerSessionBase + score * rules.xpScoreMultiplier) * modeMult);
    const earnedCoins = Math.round((rules.coinsPerSessionBase + (score >= 80 ? rules.coinsHighScoreBonus : 0)) * modeMult);

    const sessionRecord = {
      id: sessionId,
      date: new Date().toISOString(),
      category: String(b.category || 'Web Development'),
      mode,
      scenarioTitle: b.scenarioTitle || null,
      score,
      jobInterviewSkillScore,
      voiceScore,
      jobInterviewSkillScoreStatus: 'Automated',
      voiceScoreStatus: voiceScore === null ? 'Not assessed' : 'Automated',
      overrides: [],
      turns,
      earnedXp,
      earnedCoins
    };

    let certificate = null;
    if (Number.isFinite(jobInterviewSkillScore) && jobInterviewSkillScore >= 85 && jobInterviewSkillScore <= 100 && !student.certificates.some(c => c.sessionId === sessionId)) {
      const level = jobInterviewSkillScore >= 95 ? 'OUTSTANDING' : jobInterviewSkillScore >= 90 ? 'EXCELLENT' : 'PASSED';
      certificate = {
        id: `PATO-${new Date().getUTCFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
        sessionId,
        studentName: student.name,
        lessonTitle: String(b.category || 'Interview Practice'),
        score: jobInterviewSkillScore,
        achievement: level,
        completedAt: sessionRecord.date
      };
      student.certificates ||= [];
      student.certificates.push(certificate);
    }
    student.sessions.push(sessionRecord);
    if (student.activeInterview?.sessionId === sessionId) student.activeInterview = null;
    student.rewardClaims.push(sessionId);
    student.xp += earnedXp;
    student.coins += earnedCoins;

    // Achievements
    const newAchievements = [];
    const grantAch = (id, title, desc) => {
      if (!student.achievements.some(a => a.id === id)) {
        const ach = { id, title, desc, date: new Date().toISOString() };
        student.achievements.push(ach);
        newAchievements.push(ach);
      }
    };
    grantAch('ach-first-voice', 'First Spoken Simulation', 'Completed your first voice-driven PATO interview session.');
    if (score >= 85) grantAch('ach-high-distinction', 'Dean’s Communication Distinction', 'Scored 85/100 or higher on an evaluated session.');
    if (mode === 'Assessment') grantAch('ach-assessment', 'Unassisted Assessment Ready', 'Completed a formal Assessment Mode session without hints.');
    if (student.sessions.length >= 5) grantAch('ach-consistent', 'Consistent BSIT Communicator', 'Completed 5 full adaptive interview sessions.');

    const analytics = computeStudentAnalytics(student, db);
    writeDb(db);

    return json(res, 200, {
      session: sessionRecord,
      certificate,
      earnedXp,
      earnedCoins,
      newAchievements,
      profile: {
        xp: student.xp,
        coins: student.coins,
        level: Math.floor(student.xp / 150) + 1,
        achievements: student.achievements,
        unlockedNodes: analytics.unlockedNodes
      },
      analytics
    });
  }

  // 7. Answer Evolution (Retry & Compare against original turn using identical rubric)
  if (req.method === 'POST' && url === '/api/interview/evolve') {
    if (user.role !== 'user') return json(res, 403, { error: 'Student account required.' });
    const b = await readBody(req);
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    const session = student.sessions.find(s => String(s.id) === String(b.sessionId));
    if (!session) return json(res, 404, { error: 'Session not found in your records.' });
    const turn = session.turns[Number(b.turnIndex)];
    if (!turn) return json(res, 404, { error: 'Turn not found.' });

    const qObj = db.questions.find(q => Number(q.id) === Number(turn.questionId)) || {
      id: turn.questionId || 999,
      category: session.category,
      type: session.category.toLowerCase().includes('behavioral') ? 'behavioral' : 'technical',
      text: turn.question,
      keywords: turn.keywords || [],
      concepts: turn.evaluation?.conceptsExplained?.concat(turn.evaluation?.conceptsMissing || []) || [],
      misconceptions: []
    };
    const qType = qObj.type === 'behavioral' ? 'behavioral' : 'technical';
    const rubric = questionObj.scheme === 'pato-entry-10' ? [
      {key:'answerContent',name:'Answer Content',weight:34,focusArea:'Behavioral Response'},
      {key:'organization',name:'Organization',weight:33,focusArea:'Answer Organization'},
      {key:'relevance',name:'Relevance',weight:33,focusArea:'Professional Relevance'}
    ] : (db.rubrics[qType] || DEFAULT_RUBRICS.technical);

    const revisedEval = await evaluateWithGeminiOrFallback({
      transcript: b.revisedTranscript,
      questionObj: qObj,
      rubric,
      history: [],
      mode: 'Practice',
      hintsUsed: 0,
      audioMetrics: b.audioMetrics || null
    });

    const delta = revisedEval.weightedScore - turn.evaluation.weightedScore;
    const claimKey = `evolve-${session.id}-${b.turnIndex}`;
    let reward = { xp: 0, coins: 0 };
    if (delta > 0 && !student.rewardClaims.includes(claimKey)) {
      student.rewardClaims.push(claimKey);
      reward = { xp: db.rewardRules.xpPerEvolutionImprovement, coins: db.rewardRules.coinsPerEvolutionImprovement };
      student.xp += reward.xp;
      student.coins += reward.coins;
    }

    turn.revisions = turn.revisions || [];
    turn.revisions.push({
      date: new Date().toISOString(),
      transcript: b.revisedTranscript,
      evaluation: revisedEval,
      delta
    });

    const analytics = computeStudentAnalytics(student, db);
    writeDb(db);
    return json(res, 200, { original: turn.evaluation, revised: revisedEval, delta, reward, analytics });
  }

  // 8. Complete Learning Hub Spoken Lesson Task
  if (req.method === 'POST' && url === '/api/lessons/complete') {
    if (user.role !== 'user') return json(res, 403, { error: 'Student account required.' });
    const b = await readBody(req);
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    const lesson = db.lessons.find(l => l.id === b.lessonId);
    if (!lesson) return json(res, 404, { error: 'Lesson not found.' });

    const qObj = {
      id: lesson.id,
      category: lesson.category,
      type: lesson.category.toLowerCase().includes('behavioral') ? 'behavioral' : 'technical',
      text: lesson.spokenPrompt,
      keywords: lesson.keywords,
      concepts: lesson.concepts,
      misconceptions: []
    };
    const rubric = db.rubrics[qObj.type] || DEFAULT_RUBRICS.technical;
    const evaluation = await evaluateWithGeminiOrFallback({
      transcript: b.transcript,
      questionObj: qObj,
      rubric,
      history: [],
      mode: 'Practice',
      hintsUsed: 0,
      audioMetrics: b.audioMetrics || null
    });

    const prev = student.lessonProgress[lesson.id];
    const bestScore = Math.max(prev?.bestScore || 0, evaluation.weightedScore);
    const passed = evaluation.weightedScore >= 65;
    student.lessonProgress[lesson.id] = {
      attempts: (prev?.attempts || 0) + 1,
      bestScore,
      completed: prev?.completed || passed,
      lastTranscript: b.transcript,
      lastEvaluation: evaluation,
      updatedAt: new Date().toISOString()
    };

    let reward = { xp: 0, coins: 0 };
    const claimKey = `lesson-${lesson.id}`;
    if (passed && !student.rewardClaims.includes(claimKey)) {
      student.rewardClaims.push(claimKey);
      reward = { xp: db.rewardRules.xpPerLesson, coins: db.rewardRules.coinsPerLesson };
      student.xp += reward.xp;
      student.coins += reward.coins;
    }

    writeDb(db);
    return json(res, 200, { evaluation, progress: student.lessonProgress[lesson.id], reward, xp: student.xp, coins: student.coins });
  }

  // 9. Duck Wardrobe Purchase & Equip Persistence
  if (req.method === 'POST' && url === '/api/wardrobe/action') {
    if (user.role !== 'user') return json(res, 403, { error: 'Student account required.' });
    const b = await readBody(req);
    const db = readDb();
    const student = ensureStudentRecord(db, user.email, user.name);
    const item = db.wardrobeCatalog.find(i => i.id === b.itemId);
    if (!item) return json(res, 404, { error: 'Wardrobe item not found.' });

    const level = Math.floor((student.xp || 0) / 150) + 1;
    if (b.action === 'buy') {
      if (student.inventory.includes(item.id)) return json(res, 400, { error: 'Item already unlocked.' });
      if (level < item.minLevel) return json(res, 403, { error: `Requires Level ${item.minLevel} to unlock.` });
      if (student.coins < item.cost) return json(res, 400, { error: `Insufficient coins (${item.cost} required).` });
      student.coins -= item.cost;
      student.inventory.push(item.id);
      student.equipped[item.slot] = item.id;
    } else if (b.action === 'equip') {
      if (!student.inventory.includes(item.id)) return json(res, 403, { error: 'Unlock this item before equipping.' });
      student.equipped[item.slot] = item.id;
    }
    writeDb(db);
    return json(res, 200, { coins: student.coins, inventory: student.inventory, equipped: student.equipped });
  }

  // 10. Protected Admin Routes
  if (url.startsWith('/api/admin/')) {
    if (user.role !== 'admin') return json(res, 403, { error: 'Administrator privileges required.' });
    const db = readDb();

    if (req.method === 'POST' && url === '/api/admin/questions') {
      const b = await readBody(req);
      const q = {
        id: b.id ? Number(b.id) : Date.now(),
        category: String(b.category || 'Web Development'),
        type: b.type === 'behavioral' ? 'behavioral' : 'technical',
        difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(b.difficulty) ? b.difficulty : 'Beginner',
        objectives: Array.isArray(b.objectives) ? b.objectives : String(b.objectives || '').split('\n').map(s => s.trim()).filter(Boolean),
        text: String(b.text || '').trim(),
        keywords: Array.isArray(b.keywords) ? b.keywords : String(b.keywords || '').split(',').map(s => s.trim()).filter(Boolean),
        concepts: Array.isArray(b.concepts) ? b.concepts : String(b.concepts || '').split('\n').map(s => s.trim()).filter(Boolean),
        misconceptions: Array.isArray(b.misconceptions) ? b.misconceptions : String(b.misconceptions || '').split('\n').map(s => s.trim()).filter(Boolean),
        followups: b.followups || {
          strong: String(b.good || '').trim(),
          incomplete: String(b.average || '').trim(),
          keywordOnly: String(b.average || '').trim(),
          incorrect: String(b.weak || '').trim(),
          vague: String(b.weak || '').trim(),
          irrelevant: String(b.weak || '').trim()
        },
        hints: Array.isArray(b.hints) ? b.hints : String(b.hints || '').split('\n').map(s => s.trim()).filter(Boolean)
      };
      if (!q.text) return json(res, 400, { error: 'Question text is required.' });
      const idx = db.questions.findIndex(x => Number(x.id) === q.id);
      if (idx >= 0) db.questions[idx] = q;
      else db.questions.push(q);
      writeDb(db);
      return json(res, 200, { questions: db.questions });
    }

    if (req.method === 'DELETE' && url.startsWith('/api/admin/questions/')) {
      const id = Number(url.split('/').pop());
      db.questions = db.questions.filter(q => Number(q.id) !== id);
      writeDb(db);
      return json(res, 200, { questions: db.questions });
    }

    if (req.method === 'POST' && url === '/api/admin/lessons') {
      const b = await readBody(req);
      const lesson = {
        id: b.id || 'les-' + Date.now(),
        category: String(b.category || 'Web Development'),
        title: String(b.title || '').trim(),
        difficulty: String(b.difficulty || 'Beginner'),
        focusArea: String(b.focusArea || 'Technical Knowledge'),
        objectives: String(b.objectives || '').split('\n').map(s => s.trim()).filter(Boolean),
        material: String(b.material || '').trim(),
        example: String(b.example || '').trim(),
        spokenPrompt: String(b.spokenPrompt || '').trim(),
        keywords: String(b.keywords || '').split(',').map(s => s.trim()).filter(Boolean),
        concepts: String(b.concepts || '').split('\n').map(s => s.trim()).filter(Boolean)
      };
      if (!lesson.title || !lesson.spokenPrompt) return json(res, 400, { error: 'Lesson title and spoken task are required.' });
      const idx = db.lessons.findIndex(l => l.id === lesson.id);
      if (idx >= 0) db.lessons[idx] = lesson;
      else db.lessons.push(lesson);
      writeDb(db);
      return json(res, 200, { lessons: db.lessons });
    }

    if (req.method === 'DELETE' && url.startsWith('/api/admin/lessons/')) {
      const id = decodeURIComponent(url.split('/').pop());
      db.lessons = db.lessons.filter(l => l.id !== id);
      writeDb(db);
      return json(res, 200, { lessons: db.lessons });
    }

    if (req.method === 'POST' && url === '/api/admin/rubrics') {
      const b = await readBody(req);
      if (!b.rubrics?.technical || !b.rubrics?.behavioral) return json(res, 400, { error: 'Both technical and behavioral rubrics are required.' });
      const techTotal = b.rubrics.technical.reduce((s, r) => s + Number(r.weight || 0), 0);
      const behTotal = b.rubrics.behavioral.reduce((s, r) => s + Number(r.weight || 0), 0);
      if (techTotal !== 100 || behTotal !== 100) return json(res, 400, { error: 'Each rubric must total exactly 100%.' });
      db.rubrics = b.rubrics;
      writeDb(db);
      return json(res, 200, { rubrics: db.rubrics });
    }

    if (req.method === 'GET' && url === '/api/admin/attempts') {
      const attempts = [];
      Object.values(db.users).forEach(u => {
        (u.sessions || []).forEach(se => {
          attempts.push({
            email: u.email,
            name: u.name,
            sessionId: se.id,
            date: se.date,
            category: se.category,
            mode: se.mode,
            scenarioTitle: se.scenarioTitle,
            jobInterviewSkillScore: se.jobInterviewSkillScore ?? se.score,
            voiceScore: se.voiceScore,
            jobInterviewSkillScoreStatus: se.jobInterviewSkillScoreStatus || 'Automated',
            voiceScoreStatus: se.voiceScoreStatus || (se.voiceScore == null ? 'Not assessed' : 'Automated'),
            overrides: se.overrides || [],
            turns: (se.turns || []).length
          });
        });
      });
      return json(res, 200, { attempts, auditLog: db.auditLog || [] });
    }

    if (req.method === 'POST' && url === '/api/admin/score-override') {
      const b = await readBody(req);
      const student = db.users[String(b.email || '').toLowerCase()];
      const session = student?.sessions?.find(x => String(x.id) === String(b.sessionId));
      if (!student || !session) return json(res, 404, { error: 'Attempt not found.' });
      const scoreType = b.scoreType === 'voice' ? 'voice' : 'jobInterviewSkill';
      const revised = Number(b.revisedScore);
      if (!Number.isFinite(revised) || revised < 0 || revised > 100) return json(res, 400, { error: 'Revised score must be between 0 and 100.' });
      if (!String(b.reason || '').trim()) return json(res, 400, { error: 'An override reason is required.' });

      const original = scoreType === 'voice' ? session.voiceScore : (session.jobInterviewSkillScore ?? session.score);
      const override = {
        scoreType,
        original,
        revised,
        reason: String(b.reason).trim(),
        adminEmail: user.email,
        timestamp: new Date().toISOString()
      };
      session.overrides = session.overrides || [];
      session.overrides.push(override);
      if (scoreType === 'voice') {
        session.voiceScore = revised;
        session.voiceScoreStatus = 'Overridden';
      } else {
        session.jobInterviewSkillScore = revised;
        session.jobInterviewSkillScoreStatus = 'Overridden';
        session.score = revised;
      }
      logAdminAction(db, user.email, 'score_override', `${student.email}/${session.id}`, override);
      writeDb(db);
      return json(res, 200, { session, auditLog: db.auditLog });
    }

    if (req.method === 'POST' && url === '/api/admin/voice-rubric') {
      const b = await readBody(req);
      const next = b.voiceRubric || {};
      const total = Object.values(next).reduce((sum, r) => sum + Number(r.weight || 0), 0);
      if (!Object.keys(next).length || total !== 100) return json(res, 400, { error: 'Voice Score criteria must total exactly 100%.' });
      db.voiceRubric = next;
      logAdminAction(db, user.email, 'voice_rubric_update', 'voiceRubric', { total });
      writeDb(db);
      return json(res, 200, { voiceRubric: db.voiceRubric, auditLog: db.auditLog });
    }

    if (req.method === 'GET' && url === '/api/admin/export') {
      const rows = [['alumni_ref','attempt_id','date','category','mode','scenario','job_interview_skill_score','voice_score','job_status','voice_status','override_count']];
      Object.values(db.users).forEach((u, ui) => {
        (u.sessions || []).forEach(se => {
          rows.push([
            'ALUMNI-' + String(ui + 1).padStart(4, '0'),
            se.id,
            se.date,
            se.category,
            se.mode,
            se.scenarioTitle || '',
            se.jobInterviewSkillScore ?? se.score ?? '',
            se.voiceScore ?? '',
            se.jobInterviewSkillScoreStatus || 'Automated',
            se.voiceScoreStatus || (se.voiceScore == null ? 'Not assessed' : 'Automated'),
            (se.overrides || []).length
          ]);
        });
      });
      const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      logAdminAction(db, user.email, 'export', 'de_identified_attempt_csv', { rows: rows.length - 1 });
      writeDb(db);
      return json(res, 200, { csv, auditLog: db.auditLog });
    }

    if (req.method === 'POST' && url === '/api/admin/certificates/award') {
      const b = await readBody(req);
      const category = b.category && b.category !== 'all' ? String(b.category) : 'all';
      let awarded = 0;
      Object.values(db.users).forEach(u => {
        if (u.role === 'admin') return;
        (u.sessions || []).forEach(se => {
          const score = Number(se.jobInterviewSkillScore ?? se.score);
          const completed = !se.status || ['completed','complete','finished'].includes(String(se.status).toLowerCase());
          if (!completed || !Number.isFinite(score) || score < 85 || score > 100) return;
          if (category !== 'all' && String(se.category) !== category) return;
          if ((u.certificates || []).some(c => c.sessionId === se.id)) return;
          u.certificates.push({
            id: `PATO-${new Date().getUTCFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
            sessionId: se.id,
            studentName: u.name,
            lessonTitle: String(se.category || 'Interview Practice'),
            score,
            achievement: score >= 95 ? 'OUTSTANDING' : score >= 90 ? 'EXCELLENT' : 'PASSED',
            completedAt: se.date
          });
          awarded++;
        });
      });
      writeDb(db);
      return json(res, 200, { awarded, category });
    }

    if (req.method === 'POST' && url === '/api/admin/rewards') {
      const b = await readBody(req);
      db.rewardRules = { ...db.rewardRules, ...(b.rewardRules || {}) };
      if (Array.isArray(b.wardrobeCatalog)) db.wardrobeCatalog = b.wardrobeCatalog;
      writeDb(db);
      return json(res, 200, { rewardRules: db.rewardRules, wardrobeCatalog: db.wardrobeCatalog });
    }
  }

  return json(res, 404, { error: 'API route not found.' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (url.startsWith('/api/')) {
    try {
      return await handleApi(req, res, url);
    } catch (e) {
      console.error('API error:', e.message);
      return json(res, 500, { error: e.message || 'The server could not complete that request.' });
    }
  }
  let requestPath;
  try {
    requestPath = decodeURIComponent(url);
  } catch {
    return res.writeHead(400).end('Bad request');
  }
  if (requestPath === '/') requestPath = '/index.html';
  const filePath = path.resolve(ROOT, '.' + requestPath);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
      return res.end(err.code === 'ENOENT' ? 'Page or file not found' : 'Server error');
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => console.log(`PATO server running at http://${HOST}:${PORT}`));
server.on('error', e => {
  console.error(e.message);
  process.exitCode = 1;
});
