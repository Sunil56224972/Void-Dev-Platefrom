import * as THREE from "three";

// ==================================================
// VOIDDEV ANIME / MANGA BOUNTY SCROLL & PAPER BALL DESIGNS
// ==================================================
export const PAPER_DESIGNS = [
  {
    id: 1,
    title: "AI / LLM ENGINEER",
    badge: "AI & Machine Learning",
    bounty: "8,800,000,000",
    rank: "SSR ★ GRAND",
    jp: "人工知能・特級術師",
    url: "#ai",
    image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: [
      "Python (Intermediate+)",
      "LLM APIs - OpenAI, Gemini, Claude",
      "Prompt Engineering & RAG",
      "LangChain / CrewAI / Agents",
      "Build AI features into products fast",
      "Bonus: Model Fine-tuning exp",
    ],
  },
  {
    id: 2,
    title: "FRONTEND DEVELOPER",
    badge: "Web Frontend",
    bounty: "7,500,000,000",
    rank: "SR ★ VANGUARD",
    jp: "画面構築・視覚術師",
    url: "#frontend",
    image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: [
      "React / Next.js / Vue",
      "HTML, CSS, JavaScript (must)",
      "Responsive & Mobile-First Design",
      "CSS Animations & Micro-interactions",
      "Tailwind CSS / Framer Motion",
      "Build polished UI in hours",
    ],
  },
  {
    id: 3,
    title: "BACKEND DEVELOPER",
    badge: "Server & APIs",
    bounty: "7,800,000,000",
    rank: "SR ★ ARCHITECT",
    jp: "中枢機関・基盤術師",
    url: "#backend",
    image: "paper-crumple-demo/data/fold-toss.svg",
    skills: [
      "Node.js / Python / Go (any one)",
      "REST API Design & Implementation",
      "PostgreSQL / MongoDB / DynamoDB",
      "Authentication - JWT, OAuth",
      "Deploy to Vercel / AWS / Railway",
      "Bonus: Microservices experience",
    ],
  },
  {
    id: 4,
    title: "MOBILE APP DEV",
    badge: "Mobile Development",
    bounty: "7,200,000,000",
    rank: "SR ★ STRIKER",
    jp: "携帯端末・機動術師",
    url: "#mobile",
    image: "paper-crumple-demo/data/origami-engine.svg",
    skills: [
      "React Native / Flutter (any one)",
      "API Integration & State Management",
      "App Store / Play Store Deployment",
      "Can build working mobile demo",
      "Cross-platform development",
      "Bonus: Offline-first & PWA exp",
    ],
  },
  {
    id: 5,
    title: "UI/UX DESIGNER",
    badge: "Design & Experience",
    bounty: "6,900,000,000",
    rank: "SR ★ VISIONARY",
    jp: "意匠設計・幻術師",
    url: "#uiux",
    image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: [
      "Figma - wireframes to high-fidelity",
      "Design Systems & Component Thinking",
      "Mobile-First Responsive Design",
      "Motion Design / Framer",
      "Pitch Deck & Demo Presentation",
      "Strong Visual Portfolio Required",
    ],
  },
  {
    id: 6,
    title: "BUG HUNTER",
    badge: "Cybersecurity",
    bounty: "8,500,000,000",
    rank: "SSR ★ SHADOW",
    jp: "脆弱性狩・暗部術師",
    url: "#security",
    image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: [
      "OWASP Top 10 Deep Knowledge",
      "Burp Suite / Security Tools",
      "XSS, SQLi, IDOR Exploitation",
      "Recon & Enumeration Skills",
      "Secure projects before demo",
      "Bonus: HackerOne / Bugcrowd rep",
    ],
  },
  {
    id: 7,
    title: "DEVOPS ENGINEER",
    badge: "Infrastructure & Cloud",
    bounty: "7,600,000,000",
    rank: "SR ★ COMMANDER",
    jp: "無限配備・結界術師",
    url: "#devops",
    image: "paper-crumple-demo/data/throwaway-studio.svg",
    skills: [
      "AWS / GCP / Azure Cloud",
      "Docker & Containerization",
      "CI/CD Pipelines (GitHub Actions)",
      "Quick Deployment & Auto-Scaling",
      "Monitoring, Logs & Zero-Downtime",
      "Deploy entire stack in hours",
    ],
  },
  {
    id: 8,
    title: "BLOCKCHAIN DEV",
    badge: "Web3 & Smart Contracts",
    bounty: "8,100,000,000",
    rank: "SSR ★ CIPHER",
    jp: "分散台帳・契約術師",
    url: "#web3",
    image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: [
      "Solidity / Rust Smart Contracts",
      "Ethers.js / Viem / Web3.js",
      "DeFi / NFT / Token Protocols",
      "Hardhat / Foundry Testing",
      "Wallet & Chain Integration",
      "Bonus: Smart Contract Auditing",
    ],
  },
  {
    id: 9,
    title: "DATA SCIENTIST",
    badge: "Analytics & ML",
    bounty: "7,400,000,000",
    rank: "SR ★ ORACLE",
    jp: "統計解析・予見術師",
    url: "#data",
    image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: [
      "Python - Pandas, NumPy, SciPy",
      "Interactive Data Visualization",
      "Scikit-Learn & ML Modeling",
      "SQL & ETL Data Pipelines",
      "Jupyter & Rapid Experimentation",
      "Compelling Storytelling with Data",
    ],
  },
  {
    id: 10,
    title: "GAME DEVELOPER",
    badge: "Interactive & 3D",
    bounty: "7,700,000,000",
    rank: "SR ★ WORLDMAKER",
    jp: "仮想世界・創造術師",
    url: "#gamedev",
    image: "paper-crumple-demo/data/fold-toss.svg",
    skills: [
      "Unity / Godot / Unreal / Three.js",
      "C#, GDScript, or WebGL Shaders",
      "2D/3D Game Feel & Mechanics",
      "Real-time Physics & Animation",
      "Gamified Hackathon Demos",
      "High-FPS Interactive Experiences",
    ],
  },
  {
    id: 11,
    title: "CLOUD ARCHITECT",
    badge: "Distributed Systems",
    bounty: "8,200,000,000",
    rank: "SSR ★ OVERLORD",
    jp: "天上基盤・設計術師",
    url: "#cloud",
    image: "paper-crumple-demo/data/origami-engine.svg",
    skills: [
      "AWS / Azure / GCP Multi-Cloud",
      "Serverless & Event-Driven Arch",
      "Terraform / CloudFormation IaC",
      "Cost & Latency Optimization",
      "High Availability & Failover",
      "Multi-Region Edge Deployment",
    ],
  },
  {
    id: 12,
    title: "PITCH MASTER",
    badge: "Storytelling & Demo",
    bounty: "6,800,000,000",
    rank: "SR ★ HERALD",
    jp: "言霊演説・交渉術師",
    url: "#pitch",
    image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: [
      "High-Impact Public Speaking",
      "Storytelling & Problem Narrative",
      "Live Demo Choreography",
      "Manga-Grade Slide Deck Design",
      "Crush Judge Q&A Under Pressure",
      "Turn Prototypes into Winners",
    ],
  },
  {
    id: 13,
    title: "QA / TESTER",
    badge: "Quality & Reliability",
    bounty: "6,400,000,000",
    rank: "R+ ★ SENTINEL",
    jp: "品質守護・検閲術師",
    url: "#qa",
    image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: [
      "Manual + Automated E2E Testing",
      "Playwright / Cypress / Selenium",
      "API Stress Testing - Postman",
      "Precision Bug Reproduction",
      "Eliminate Demo-Breaking Bugs",
      "Relentless Edge-Case Hunter",
    ],
  },
  {
    id: 14,
    title: "TECHNICAL WRITER",
    badge: "Docs & Lore",
    bounty: "6,100,000,000",
    rank: "R+ ★ CHRONICLER",
    jp: "秘伝記録・文書術師",
    url: "#writer",
    image: "paper-crumple-demo/data/throwaway-studio.svg",
    skills: [
      "Crystal-Clear README & Architecture",
      "OpenAPI / Swagger Documentation",
      "Technical Deep-Dive Blogs",
      "Judge Submission Write-ups",
      "Developer Relations Content",
      "Make GitHub Repos Look Legendary",
    ],
  },
  {
    id: 15,
    title: "IOT / HARDWARE",
    badge: "Embedded & Robotics",
    bounty: "7,900,000,000",
    rank: "SR ★ MECHA",
    jp: "機巧制御・工学術師",
    url: "#iot",
    image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: [
      "Arduino / Raspberry Pi / Jetson",
      "ESP32 & Sensor Fusion",
      "Rapid Circuit Prototyping",
      "Embedded C / C++ / MicroPython",
      "Hardware + Cloud Telemetry",
      "Real-World Physical Computing",
    ],
  },
  {
    id: 16,
    title: "VIDEO EDITOR",
    badge: "Motion & Visuals",
    bounty: "6,600,000,000",
    rank: "SR ★ DIRECTOR",
    jp: "映像演出・閃光術師",
    url: "#video",
    image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: [
      "Premiere Pro / After Effects",
      "DaVinci Resolve / CapCut Pro",
      "Hype Hackathon Trailer Creation",
      "Anime Motion Graphics & SFX",
      "Crisp 2-Minute Product Demos",
      "Viral Launch Reels & Shorts",
    ],
  },
  {
    id: 17,
    title: "PRODUCT MANAGER",
    badge: "Strategy & Execution",
    bounty: "7,100,000,000",
    rank: "SR ★ TACTICIAN",
    jp: "作戦統括・軍師",
    url: "#pm",
    image: "paper-crumple-demo/data/fold-toss.svg",
    skills: [
      "Rapid User & Problem Research",
      "Market & Competitor Analysis",
      "Ruthless 8-Hour MVP Scoping",
      "Team Sprint Coordination",
      "Keep Squad Focused & Shipping",
      "Align Tech with Judge Rubric",
    ],
  },
  {
    id: 18,
    title: "ML OPS ENGINEER",
    badge: "AI Infrastructure",
    bounty: "8,300,000,000",
    rank: "SSR ★ ENGINE",
    jp: "知能配備・加速術師",
    url: "#mlops",
    image: "paper-crumple-demo/data/origami-engine.svg",
    skills: [
      "Fast Model Serving (vLLM / ONNX)",
      "MLflow / Weights & Biases",
      "Docker + GPU Containerization",
      "Automated Vector & Data Pipelines",
      "Model Latency & Cost Tuning",
      "Production AI Reliability",
    ],
  },
  {
    id: 19,
    title: "OPEN SOURCE DEV",
    badge: "Community & Packages",
    bounty: "7,000,000,000",
    rank: "SR ★ PIONEER",
    jp: "公開技術・開拓術師",
    url: "#oss",
    image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: [
      "Advanced Git & GitHub Workflows",
      "Clean SDK / Library Design",
      "PR Reviews & Issue Triage",
      "Automated Releases & Versioning",
      "Developer Experience (DX) Focus",
      "Published npm / PyPI / Crates",
    ],
  },
  {
    id: 20,
    title: "NO-CODE BUILDER",
    badge: "Rapid Prototyping",
    bounty: "6,300,000,000",
    rank: "R+ ★ ALCHEMIST",
    jp: "高速錬成・召喚術師",
    url: "#nocode",
    image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: [
      "Framer / Webflow / Bubble",
      "n8n / Make / Zapier Workflows",
      "Supabase / Airtable / Notion",
      "AI Workflow Chaining",
      "Ship Full MVPs in 60 Minutes",
      "Seamless API Webhook Glue",
    ],
  },
];

// VoidDev Manga Website Theme Palettes (matches styles-DCIjP5mH.css variables)
const MANGA_THEMES = [
  {
    name: "Crimson Bounty",
    paperBg: "#F5EEDF",
    panelBg: "#FFFDF5",
    accent: "#E42F26",
    secondary: "#F6C84C",
    ink: "#11110F",
    stamp: "#E42F26",
  },
  {
    name: "Golden Crown",
    paperBg: "#FDF6E2",
    panelBg: "#FFFDF5",
    accent: "#F6C84C",
    secondary: "#E42F26",
    ink: "#11110F",
    stamp: "#E42F26",
  },
  {
    name: "Grand Sky Blue",
    paperBg: "#F0F6FA",
    panelBg: "#FFFDF5",
    accent: "#70B7DF",
    secondary: "#F6C84C",
    ink: "#11110F",
    stamp: "#E42F26",
  },
  {
    name: "Cursed Violet",
    paperBg: "#F3EFFB",
    panelBg: "#FFFDF5",
    accent: "#8064C7",
    secondary: "#F6C84C",
    ink: "#11110F",
    stamp: "#8064C7",
  },
  {
    name: "Blaze Orange",
    paperBg: "#FDF2E9",
    panelBg: "#FFFDF5",
    accent: "#EF8E3A",
    secondary: "#F6C84C",
    ink: "#11110F",
    stamp: "#E42F26",
  },
  {
    name: "Cyber Teal",
    paperBg: "#ECF7F6",
    panelBg: "#FFFDF5",
    accent: "#3DA7A0",
    secondary: "#F6C84C",
    ink: "#11110F",
    stamp: "#E42F26",
  },
  {
    name: "Emerald Hunter",
    paperBg: "#F3F8E9",
    panelBg: "#FFFDF5",
    accent: "#A3C94A",
    secondary: "#E42F26",
    ink: "#11110F",
    stamp: "#11110F",
  },
];

// High-resolution canvas so text and manga ink lines are super crisp on mobile & desktop
const TEX_W = 1024;
const TEX_H = 1400;

const DISPLAY_FONT = '"Bangers", Impact, "Arial Black", sans-serif';
const BODY_FONT = '"Space Grotesk", "Caveat", system-ui, sans-serif';
const JP_FONT = '"Yomogi", "Hiragino Kaku Gothic ProN", sans-serif';

const designStates = [];

// Create a shared 4-step anime cel-shading gradient map
let animeToonGradient = null;
function getAnimeToonGradient() {
  if (animeToonGradient) return animeToonGradient;
  // 4-step cel-shading: deep crease shadow -> mid tone -> bright paper -> crisp rim highlight
  const data = new Uint8Array([
    135, 128, 118, 255,
    198, 192, 180, 255,
    244, 240, 232, 255,
    255, 255, 255, 255,
  ]);
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  animeToonGradient = tex;
  return tex;
}

// Shared Manga Ink Outline ShaderMaterial (extrudes backfaces along vertex normals)
function createInkOutlineMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uOutlineWidth: { value: 0.011 },
      uInkColor: { value: new THREE.Color("#11110F") },
      uOpacity: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
      uniform float uOutlineWidth;
      void main() {
        vec3 displaced = position + normal * uOutlineWidth;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInkColor;
      uniform float uOpacity;
      void main() {
        gl_FragColor = vec4(uInkColor, uOpacity);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: true,
  });
}

function drawHalftonePattern(ctx, x, y, w, h, dotColor, spacing = 18, radius = 2.6) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = dotColor;
  for (let py = y + spacing * 0.5; py < y + h; py += spacing) {
    const rowOffset = Math.floor((py - y) / spacing) % 2 === 0 ? 0 : spacing * 0.5;
    for (let px = x + rowOffset; px < x + w; px += spacing) {
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawSpeedLines(ctx, cx, cy, innerR, outerR, count, color, lineWidth = 3.5) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.02;
    const r0 = innerR + ((i * 37) % 140);
    const r1 = outerR;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
    ctx.lineTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMangaBallSurfaceDetails(ctx, theme, trackNum) {
  // When the paper is crumpled into a ball, the outer edges, corners, and diagonal folds
  // are prominently visible on the exterior of the sphere.
  // Drawing bold manga ink cross-hatching, speed lines, crimson/gold hazard bars,
  // and anime seals along the outer perimeter makes the crumpled ball look 100% anime-styled!
  ctx.save();

  // 1. Diagonal manga hazard/ink stripes around the outer bleed
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 5;
  const step = 36;
  for (let i = -TEX_H; i < TEX_W + TEX_H; i += step) {
    // Top strip
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 28, 42);
    ctx.stroke();
    // Bottom strip
    ctx.beginPath();
    ctx.moveTo(i, TEX_H - 42);
    ctx.lineTo(i + 28, TEX_H);
    ctx.stroke();
  }

  // 2. Corner Anime Burst Triangles (visible on ball exterior)
  const cornerSize = 155;
  const corners = [
    [0, 0, cornerSize, 0, 0, cornerSize],
    [TEX_W, 0, TEX_W - cornerSize, 0, TEX_W, cornerSize],
    [0, TEX_H, cornerSize, TEX_H, 0, TEX_H - cornerSize],
    [TEX_W, TEX_H, TEX_W - cornerSize, TEX_H, TEX_W, TEX_H - cornerSize],
  ];
  corners.forEach(([x0, y0, x1, y1, x2, y2], idx) => {
    ctx.fillStyle = idx % 2 === 0 ? theme.accent : theme.secondary;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = theme.ink;
    ctx.lineWidth = 7;
    ctx.stroke();
  });

  // 3. Manga SFX & Track Number Badges along margins (so crumpled ball shows cool kanji/numbers)
  ctx.fillStyle = theme.ink;
  ctx.font = `900 44px ${DISPLAY_FONT}`;
  ctx.save();
  ctx.translate(38, TEX_H * 0.35);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`★ VOIDDEV #${trackNum} ★ ゴゴゴ`, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(TEX_W - 38, TEX_H * 0.65);
  ctx.rotate(Math.PI / 2);
  ctx.fillText(`★ BOUNTY SCROLL #${trackNum} ★ ドドド`, 0, 0);
  ctx.restore();

  // 4. Crisp Manga Fold/Crease Ink Lines across the sheet (gives cel-shaded comic linework on folds!)
  ctx.strokeStyle = "rgba(17, 17, 15, 0.22)";
  ctx.lineWidth = 3.5;
  ctx.setLineDash([18, 10]);
  const creases = [
    [0, TEX_H * 0.28, TEX_W, TEX_H * 0.72],
    [0, TEX_H * 0.75, TEX_W, TEX_H * 0.22],
    [TEX_W * 0.25, 0, TEX_W * 0.78, TEX_H],
    [TEX_W * 0.75, 0, TEX_W * 0.22, TEX_H],
  ];
  creases.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  ctx.restore();
}

function drawStaticLayer(ctx, design, designIndex = 0) {
  const theme = MANGA_THEMES[designIndex % MANGA_THEMES.length];
  const trackNum = String(design.id || designIndex + 1).padStart(2, "0");

  // 1. Base Warm Manga Paper Background
  ctx.fillStyle = theme.paperBg;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // 2. Subtle Manga Grid + Halftone Dots on Paper Base
  drawHalftonePattern(ctx, 0, 0, TEX_W, TEX_H, "rgba(17, 17, 15, 0.085)", 22, 2.5);

  // 3. Radial Anime Speed Lines from Center
  drawSpeedLines(
    ctx,
    TEX_W * 0.5,
    TEX_H * 0.42,
    290,
    880,
    72,
    "rgba(17, 17, 15, 0.13)",
    3,
  );

  // 4. Outer Ball Surface Details (for when crumpled into a 3D ball)
  drawMangaBallSurfaceDetails(ctx, theme, trackNum);

  // 5. Main Manga Bounty Poster Frame
  const frameX = 64;
  const frameY = 64;
  const frameW = TEX_W - 128;
  const frameH = TEX_H - 128;

  // Hard Comic Offset Shadow
  ctx.fillStyle = theme.ink;
  ctx.fillRect(frameX + 14, frameY + 14, frameW, frameH);

  // Inner Poster Background
  ctx.fillStyle = theme.panelBg;
  ctx.fillRect(frameX, frameY, frameW, frameH);

  // Halftone Accent Band at Top of Frame
  ctx.fillStyle = theme.accent;
  ctx.fillRect(frameX, frameY, frameW, 210);
  drawHalftonePattern(ctx, frameX, frameY, frameW, 210, "rgba(17, 17, 15, 0.16)", 16, 3);

  // Thick Manga Ink Outer Border
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 10;
  ctx.strokeRect(frameX, frameY, frameW, frameH);

  // Inner Double Ink Line
  ctx.lineWidth = 3.5;
  ctx.strokeRect(frameX + 14, frameY + 14, frameW - 28, frameH - 28);

  // 6. Top Chapter / Track Ribbon Bar
  const ribbonH = 58;
  ctx.fillStyle = theme.ink;
  ctx.fillRect(frameX, frameY, frameW, ribbonH);

  ctx.fillStyle = theme.secondary;
  ctx.font = `700 28px ${BODY_FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText(
    `★ VOIDDEV GRAND ALLIANCE // SKILL TRACK #${trackNum}`,
    frameX + 28,
    frameY + ribbonH / 2 + 2,
  );

  ctx.fillStyle = "#FFFDF5";
  ctx.font = `700 24px ${JP_FONT}`;
  const jpMetrics = ctx.measureText(design.jp || "選抜試験");
  ctx.fillText(
    design.jp || "選抜試験",
    frameX + frameW - jpMetrics.width - 28,
    frameY + ribbonH / 2 + 2,
  );

  // 7. Category Badge Pill
  const badgeY = frameY + 82;
  const badgeText = `⚡ ${design.badge.toUpperCase()} • ${design.rank}`;
  ctx.font = `800 26px ${BODY_FONT}`;
  const badgeW = Math.min(frameW - 60, ctx.measureText(badgeText).width + 48);
  const badgeX = frameX + 32;

  ctx.fillStyle = theme.ink;
  ctx.fillRect(badgeX + 6, badgeY + 6, badgeW, 48);
  ctx.fillStyle = theme.secondary;
  ctx.fillRect(badgeX, badgeY, badgeW, 48);
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 4;
  ctx.strokeRect(badgeX, badgeY, badgeW, 48);

  ctx.fillStyle = theme.ink;
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, badgeX + 22, badgeY + 25);

  // 8. Huge Manga Track Title Banner
  drawTitle(ctx, design.title, theme, frameX, frameY + 235, frameW);

  // 9. Bounty Reward Strip
  const bountyY = 470;
  const bountyH = 74;
  ctx.fillStyle = theme.ink;
  ctx.fillRect(frameX + 32 + 7, bountyY + 7, frameW - 64, bountyH);
  ctx.fillStyle = "#FFFDF5";
  ctx.fillRect(frameX + 32, bountyY, frameW - 64, bountyH);
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 5;
  ctx.strokeRect(frameX + 32, bountyY, frameW - 64, bountyH);

  // Red "BOUNTY" tag on left
  ctx.fillStyle = "#E42F26";
  ctx.fillRect(frameX + 32, bountyY, 210, bountyH);
  ctx.strokeRect(frameX + 32, bountyY, 210, bountyH);
  ctx.fillStyle = "#FFFDF5";
  ctx.font = `400 40px ${DISPLAY_FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText("BOUNTY ฿", frameX + 54, bountyY + bountyH / 2 + 3);

  // Bounty number
  ctx.fillStyle = theme.ink;
  ctx.font = `400 50px ${DISPLAY_FONT}`;
  ctx.fillText(design.bounty || "7,500,000,000", frameX + 266, bountyY + bountyH / 2 + 4);

  // 10. Required Skills Manga Panel Box
  const skillsBoxX = frameX + 32;
  const skillsBoxY = 574;
  const skillsBoxW = frameW - 64;
  const skillsBoxH = 610;

  // Panel shadow & fill
  ctx.fillStyle = theme.ink;
  ctx.fillRect(skillsBoxX + 8, skillsBoxY + 8, skillsBoxW, skillsBoxH);
  ctx.fillStyle = "#FFFDF5";
  ctx.fillRect(skillsBoxX, skillsBoxY, skillsBoxW, skillsBoxH);
  drawHalftonePattern(
    ctx,
    skillsBoxX,
    skillsBoxY + 64,
    skillsBoxW,
    skillsBoxH - 64,
    "rgba(17, 17, 15, 0.04)",
    20,
    2,
  );
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 5;
  ctx.strokeRect(skillsBoxX, skillsBoxY, skillsBoxW, skillsBoxH);

  // Skills Header Bar
  ctx.fillStyle = theme.ink;
  ctx.fillRect(skillsBoxX, skillsBoxY, skillsBoxW, 62);
  ctx.fillStyle = theme.secondary;
  ctx.font = `400 36px ${DISPLAY_FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText(
    "⚔ REQUIRED SKILLS & TECH ARSENAL",
    skillsBoxX + 24,
    skillsBoxY + 33,
  );

  // Skills Checklist Items
  if (design.skills && design.skills.length > 0) {
    const startY = skillsBoxY + 108;
    const rowH = 82;
    design.skills.slice(0, 6).forEach((skill, i) => {
      const y = startY + i * rowH;

      // Alternating row tint
      if (i % 2 === 1) {
        ctx.fillStyle = "rgba(245, 238, 223, 0.65)";
        ctx.fillRect(skillsBoxX + 6, y - 34, skillsBoxW - 12, rowH - 6);
      }

      // Dashed divider line
      if (i > 0) {
        ctx.strokeStyle = "rgba(17, 17, 15, 0.16)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(skillsBoxX + 20, y - 38);
        ctx.lineTo(skillsBoxX + skillsBoxW - 20, y - 38);
        ctx.stroke();
      }

      // Manga Diamond Badge Bullet
      const bx = skillsBoxX + 38;
      const by = y;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = i === 0 ? "#E42F26" : theme.accent;
      ctx.fillRect(-11, -11, 22, 22);
      ctx.strokeStyle = theme.ink;
      ctx.lineWidth = 3;
      ctx.strokeRect(-11, -11, 22, 22);
      ctx.restore();

      // Skill text (auto-fit if long)
      ctx.fillStyle = theme.ink;
      let fontSize = 33;
      ctx.font = `700 ${fontSize}px ${BODY_FONT}`;
      const maxSkillW = skillsBoxW - 100;
      while (ctx.measureText(skill).width > maxSkillW && fontSize > 22) {
        fontSize -= 2;
        ctx.font = `700 ${fontSize}px ${BODY_FONT}`;
      }
      ctx.textBaseline = "middle";
      ctx.fillText(skill, skillsBoxX + 72, y + 1);
    });
  }

  // 11. Red Manga Hanko Stamp Seal in Bottom-Right Corner
  ctx.save();
  ctx.translate(frameX + frameW - 135, skillsBoxY + skillsBoxH - 72);
  ctx.rotate(-0.18);
  ctx.fillStyle = "rgba(228, 47, 38, 0.92)";
  ctx.beginPath();
  ctx.arc(0, 0, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#11110F";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.strokeStyle = "#FFFDF5";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 54, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#FFFDF5";
  ctx.font = `400 28px ${DISPLAY_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VOIDDEV", 0, -14);
  ctx.font = `400 24px ${DISPLAY_FONT}`;
  ctx.fillText("APPROVED", 0, 15);
  ctx.restore();

  // 12. Bottom Action Footer Strip
  const footY = 1212;
  const footH = 88;
  ctx.fillStyle = theme.ink;
  ctx.fillRect(frameX + 32, footY, frameW - 64, footH);
  ctx.strokeStyle = theme.secondary;
  ctx.lineWidth = 3;
  ctx.strokeRect(frameX + 38, footY + 6, frameW - 76, footH - 12);

  ctx.fillStyle = theme.secondary;
  ctx.font = `400 34px ${DISPLAY_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "★ TAP PAPER AGAIN TO CRUMPLE • USE HUD BELOW FOR FULL BRIEF ★",
    TEX_W * 0.5,
    footY + footH / 2 + 2,
  );
  ctx.textAlign = "left";
}

function drawTitle(ctx, title, theme, frameX, startY, frameW) {
  const maxW = frameW - 64;
  const x = frameX + 32;

  ctx.save();
  ctx.textBaseline = "alphabetic";

  // Try single line first
  let size = 108;
  ctx.font = `400 ${size}px ${DISPLAY_FONT}`;
  while (ctx.measureText(title).width > maxW && size > 68) {
    size -= 4;
    ctx.font = `400 ${size}px ${DISPLAY_FONT}`;
  }

  const drawComicText = (text, tx, ty, fontSize) => {
    ctx.font = `400 ${fontSize}px ${DISPLAY_FONT}`;
    // Hard comic block shadow
    ctx.fillStyle = theme.ink;
    ctx.fillText(text, tx + 7, ty + 7);
    // Thick ink stroke
    ctx.strokeStyle = theme.ink;
    ctx.lineWidth = 14;
    ctx.lineJoin = "round";
    ctx.strokeText(text, tx, ty);
    // Main fill
    ctx.fillStyle = "#FFFDF5";
    ctx.fillText(text, tx, ty);
  };

  const words = title.split(" ");
  if (ctx.measureText(title).width <= maxW || words.length < 2) {
    drawComicText(title, x, startY + 135, size);
    ctx.restore();
    return;
  }

  // Split into 2 balanced lines
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(" ");
    const line2 = words.slice(i).join(" ");
    const width = Math.max(ctx.measureText(line1).width, ctx.measureText(line2).width);
    if (!best || width < best.width) best = { line1, line2, width };
  }

  size = 92;
  ctx.font = `400 ${size}px ${DISPLAY_FONT}`;
  while (
    Math.max(ctx.measureText(best.line1).width, ctx.measureText(best.line2).width) > maxW &&
    size > 58
  ) {
    size -= 4;
    ctx.font = `400 ${size}px ${DISPLAY_FONT}`;
  }

  drawComicText(best.line1, x, startY + 86, size);
  drawComicText(best.line2, x, startY + 178, size);
  ctx.restore();
}

// Re-render textures once Google Fonts finish loading so Bangers & Space Grotesk appear crisp
if (typeof document !== "undefined" && document.fonts) {
  Promise.all([
    document.fonts.load('400 96px "Bangers"'),
    document.fonts.load('700 32px "Space Grotesk"'),
  ])
    .then(() => {
      for (const state of designStates) {
        if (!state) continue;
        drawStaticLayer(state.ctx, state.design, state.idx);
        state.texture.needsUpdate = true;
      }
    })
    .catch(() => {});
}

function getDesignMaterial(designIndex) {
  const idx = designIndex % PAPER_DESIGNS.length;
  if (designStates[idx]) return designStates[idx].material;

  const design = PAPER_DESIGNS[idx];
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  drawStaticLayer(ctx, design, idx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.rotation = Math.PI;
  texture.center.set(0.5, 0.5);
  texture.repeat.set(1, -1);

  // Anime Cel-Shaded Toon Material for crisp manga look
  const material = new THREE.MeshToonMaterial({
    map: texture,
    gradientMap: getAnimeToonGradient(),
    side: THREE.DoubleSide,
  });

  designStates[idx] = { idx, design, canvas, ctx, texture, material };
  return material;
}

/**
 * Create a 3D anime/manga paper ball mesh with a synchronized GPU ink outline mesh.
 */
export function createPaper(animData, designIndex = 0) {
  const { vertexCount, indices, uvs, positions, normals } = animData;
  const idx = designIndex % PAPER_DESIGNS.length;
  const design = PAPER_DESIGNS[idx];

  const geometry = new THREE.BufferGeometry();

  const positionArray = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount * 3; i++) {
    positionArray[i] = positions[i];
  }
  const positionAttr = new THREE.BufferAttribute(positionArray, 3);
  positionAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("position", positionAttr);

  const normalArray = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount * 3; i++) {
    normalArray[i] = normals[i];
  }
  const normalAttr = new THREE.BufferAttribute(normalArray, 3);
  normalAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("normal", normalAttr);

  const uvArray = new Float32Array(uvs.length);
  for (let i = 0; i < uvs.length; i++) {
    uvArray[i] = uvs[i];
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));

  const indexArray = new Uint16Array(indices);
  geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

  const mesh = new THREE.Mesh(geometry, getDesignMaterial(idx));

  // Add Manga Ink Outline child mesh sharing the exact same animated BufferGeometry
  const outlineMat = createInkOutlineMaterial();
  const outlineMesh = new THREE.Mesh(geometry, outlineMat);
  outlineMesh.raycast = () => {}; // Do not interfere with pointer picking
  mesh.add(outlineMesh);

  return {
    mesh,
    outlineMesh,
    outlineMat,
    positionAttr,
    normalAttr,
    designIndex: idx,
    design,
  };
}

/**
 * Update vertex positions and normals for the given VAT frame (supports fractional lerp).
 */
export function updatePaperFrame(paper, animData, frameIdx) {
  const { vertexCount, frameCount, positions, normals } = animData;
  const { positionAttr, normalAttr, outlineMat } = paper;

  const len = vertexCount * 3;
  const clamped = Math.max(0, Math.min(frameIdx, frameCount - 1));
  const f0 = Math.floor(clamped);
  const t = clamped - f0;

  const off0 = f0 * len;

  const posArray = positionAttr.array;
  const nrmArray = normalAttr.array;

  if (t < 1e-6) {
    for (let i = 0; i < len; i++) {
      posArray[i] = positions[off0 + i];
      nrmArray[i] = normals[off0 + i];
    }
  } else {
    const f1 = Math.min(f0 + 1, frameCount - 1);
    const off1 = f1 * len;
    const s = 1 - t;
    for (let i = 0; i < len; i++) {
      posArray[i] = positions[off0 + i] * s + positions[off1 + i] * t;
      nrmArray[i] = normals[off0 + i] * s + normals[off1 + i] * t;
    }
  }

  positionAttr.needsUpdate = true;
  normalAttr.needsUpdate = true;

  // Adjust anime ink outline thickness: bold when crumpled ball, subtle when unfolded flat
  if (outlineMat && outlineMat.uniforms) {
    const crumpleRatio = clamped / Math.max(1, frameCount - 1);
    outlineMat.uniforms.uOutlineWidth.value = 0.003 + crumpleRatio * 0.0095;
  }

  paper.mesh.geometry.computeBoundingSphere();
  paper.mesh.geometry.computeBoundingBox();
}
