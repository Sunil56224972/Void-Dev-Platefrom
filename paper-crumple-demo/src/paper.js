import * as THREE from "three";

// ==================================================
// ç´™é¢ãƒ‡ã‚¶ã‚¤ãƒ³ â€” æ–¹çœ¼ç´™ã«æ‰‹æ›¸ããƒ•ã‚©ãƒ³ãƒˆã§ title / ã‚µãƒ ãƒã‚¤ãƒ« / url ã‚’é…ç½®
// ã‚µãƒ ãƒã‚¤ãƒ«ã¯å„ã‚µã‚¤ãƒˆã® OGP ç”»åƒ (public/ ã«é…ç½®)
// ==================================================
// æž¶ç©ºãƒ–ãƒ©ãƒ³ãƒ‰ (è¨˜äº‹å…¬é–‹ç”¨ã«è‘—ä½œæ¨©ãƒ•ãƒªãƒ¼ã®è‡ªä½œãƒ‡ãƒ¼ã‚¿)ã€‚
// URL ã¯ RFC 2606 ã§äºˆç´„ã•ã‚ŒãŸ .example TLD ãªã®ã§å®Ÿåœ¨ã—ãªã„ã€‚
// ã‚µãƒ ãƒã‚¤ãƒ«ã¯ public/data/ ã®è‡ªä½œ SVG (1200Ã—630 = OGP ã¨åŒã˜æ¯”çŽ‡)ã€‚
export const PAPER_DESIGNS = [
  {
    title: "AI / LLM ENGINEER",
    url: "#ai", image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: ["Python (Intermediate+)", "LLM APIs - OpenAI, Gemini, Claude", "Prompt Engineering & RAG", "LangChain / Agent Frameworks", "Build AI features fast", "Bonus: Fine-tuning exp"]
  },
  {
    title: "FRONTEND DEVELOPER",
    url: "#frontend", image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: ["React / Next.js / Vue", "HTML, CSS, JS (must)", "Responsive Design", "CSS Animations", "Tailwind / Framer Motion", "Build polished UI fast"]
  },
  {
    title: "BACKEND DEVELOPER",
    url: "#backend", image: "paper-crumple-demo/data/fold-toss.svg",
    skills: ["Node.js / Python / Go", "REST API Design", "PostgreSQL / MongoDB / DynamoDB", "Auth - JWT, OAuth", "Deploy to Vercel / AWS", "Bonus: Microservices"]
  },
  {
    title: "MOBILE APP DEV",
    url: "#mobile", image: "paper-crumple-demo/data/origami-engine.svg",
    skills: ["React Native / Flutter", "API Integration", "State Management", "App Store Deployment", "Cross-platform dev", "Bonus: PWA experience"]
  },
  {
    title: "UI/UX DESIGNER",
    url: "#uiux", image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: ["Figma (must)", "Design Systems", "Mobile-First Design", "Motion Design / Framer", "Pitch Deck Design", "Portfolio Required"]
  },
  {
    title: "BUG HUNTER",
    url: "#security", image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: ["OWASP Top 10", "Burp Suite / Tools", "XSS, SQLi, IDOR Testing", "Recon & Enumeration", "Secure before demo", "HackerOne / Bugcrowd"]
  },
  {
    title: "DEVOPS ENGINEER",
    url: "#devops", image: "paper-crumple-demo/data/throwaway-studio.svg",
    skills: ["AWS / GCP / Azure", "Docker & Containers", "CI/CD Pipelines", "Quick Deploy & Scale", "Monitoring & Logging", "Deploy stack in hours"]
  },
  {
    title: "BLOCKCHAIN DEV",
    url: "#web3", image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: ["Solidity / Smart Contracts", "Ethers.js / Web3.js", "DeFi / NFT Protocols", "Hardhat / Foundry", "Wallet Integration", "Bonus: Audit experience"]
  },
  {
    title: "DATA SCIENTIST",
    url: "#data", image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: ["Python - Pandas, NumPy", "Data Visualization", "Machine Learning basics", "SQL & Data Pipelines", "Jupyter Notebooks", "Storytelling with data"]
  },
  {
    title: "GAME DEVELOPER",
    url: "#gamedev", image: "paper-crumple-demo/data/fold-toss.svg",
    skills: ["Unity / Godot / Unreal", "C# or GDScript", "2D/3D Game Mechanics", "Physics & Animation", "Gamified demos", "Interactive experiences"]
  },
  {
    title: "CLOUD ARCHITECT",
    url: "#cloud", image: "paper-crumple-demo/data/origami-engine.svg",
    skills: ["AWS / Azure / GCP", "Serverless Architecture", "Terraform / CloudFormation", "Cost Optimization", "High Availability Design", "Multi-region deployment"]
  },
  {
    title: "PITCH MASTER",
    url: "#pitch", image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: ["Public Speaking", "Storytelling & Narrative", "Demo Presentation", "Slide Design", "Handle Q&A from judges", "Make mid project shine"]
  },
  {
    title: "QA / TESTER",
    url: "#qa", image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: ["Manual + Auto Testing", "Playwright / Selenium", "API Testing - Postman", "Bug Reporting", "Find bugs before demo", "Edge case hunter"]
  },
  {
    title: "TECHNICAL WRITER",
    url: "#writer", image: "paper-crumple-demo/data/throwaway-studio.svg",
    skills: ["Documentation / README", "API Documentation", "Blog & Tutorial Writing", "Project Descriptions", "Social Media Content", "Make repos look pro"]
  },
  {
    title: "IOT / HARDWARE",
    url: "#iot", image: "paper-crumple-demo/data/paper-protocol.svg",
    skills: ["Arduino / Raspberry Pi", "ESP32 / Sensors", "Circuit Prototyping", "Embedded C / Python", "Physical + Software combo", "Real-world interaction"]
  },
  {
    title: "VIDEO EDITOR",
    url: "#video", image: "paper-crumple-demo/data/crumple-lab.svg",
    skills: ["Premiere / After Effects", "CapCut / DaVinci", "Demo Video Creation", "Motion Graphics", "Product Walkthroughs", "Social Reels & Shorts"]
  },
  {
    title: "PRODUCT MANAGER",
    url: "#pm", image: "paper-crumple-demo/data/fold-toss.svg",
    skills: ["User Research", "Market Analysis", "MVP Prioritization", "Sprint Planning", "Keep team on track", "Structure hackathon plan"]
  },
  {
    title: "ML OPS ENGINEER",
    url: "#mlops", image: "paper-crumple-demo/data/origami-engine.svg",
    skills: ["Model Deployment", "MLflow / Kubeflow", "Docker + K8s for ML", "Data Pipeline Automation", "Monitoring ML models", "GPU/TPU optimization"]
  },
  {
    title: "OPEN SOURCE DEV",
    url: "#oss", image: "paper-crumple-demo/data/wastebasket-club.svg",
    skills: ["Git & GitHub (advanced)", "PR Reviews & Issues", "Community Contribution", "Documentation Culture", "CI/CD for OSS", "Published packages"]
  },
  {
    title: "NO-CODE BUILDER",
    url: "#nocode", image: "paper-crumple-demo/data/grid-paper-works.svg",
    skills: ["Bubble / Webflow / Framer", "Zapier / Make Automation", "Airtable / Notion", "Rapid Prototyping", "Landing Pages in minutes", "MVP without code"]
  },
];

const TEX_W = 512;
const TEX_H = 700;
// è‹±æ•°å­—ã¯ Caveatã€æ—¥æœ¬èªžã¯æ‰‹æ›¸ãé¢¨ã® Yomogi ã«ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯ã™ã‚‹
const HAND_FONT = '"Caveat", "Yomogi", "Comic Sans MS", cursive';
const INK_COLOR = "#D4AF37";
// ã‚µãƒ ãƒã‚¤ãƒ«ã¯ 16:9
const IMAGE_RECT = {
  x: Math.round(TEX_W * 0.11),
  y: Math.round(TEX_H * 0.33),
  w: Math.round(TEX_W * 0.78),
  h: Math.round((TEX_W * 0.78 * 9) / 16),
};

// ãƒ‡ã‚¶ã‚¤ãƒ³ã”ã¨ã®å…±æœ‰ã‚¹ãƒ†ãƒ¼ãƒˆ (canvas / texture / material / video)
const designStates = [];

function drawStaticLayer(ctx, design) {
  // æ–¹çœ¼ç´™ã®ä¸‹åœ°
  // Unique paper colors per track for visibility
  const PAPER_COLORS = [
    "#1a1a2e", "#16213e", "#0f3460", "#1b1b2f", "#162447",
    "#1f1f38", "#1a1a40", "#0d1b2a", "#1b2838", "#1c2333",
    "#2d132c", "#1a1a2e", "#0b2545", "#13293d", "#1b1b2f",
    "#1c1c3c", "#0d1b2a", "#162447", "#1a1a40", "#13293d"
  ];
  const paperBg = PAPER_COLORS[PAPER_DESIGNS.indexOf(design) % PAPER_COLORS.length] || "#1a1a2e";
  ctx.fillStyle = paperBg;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
  ctx.lineWidth = 2;
  const cell = 64;
  ctx.beginPath();
  for (let x = cell / 2; x <= TEX_W; x += cell) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, TEX_H);
  }
  for (let y = cell / 2; y <= TEX_H; y += cell) {
    ctx.moveTo(0, y);
    ctx.lineTo(TEX_W, y);
  }
  ctx.stroke();

  // ã‚¿ã‚¤ãƒˆãƒ« (å¹…ã«åŽã¾ã‚‰ãªã‘ã‚Œã°ç¸®å° â†’ ãã‚Œã§ã‚‚åŽã¾ã‚‰ãªã‘ã‚Œã°2è¡Œã«æŠ˜ã‚Šè¿”ã—)
  ctx.fillStyle = INK_COLOR;
  ctx.textBaseline = "alphabetic";
  drawTitle(ctx, design.title);

  // ã‚µãƒ ãƒã‚¤ãƒ«ã‚¨ãƒªã‚¢ (ç”»åƒãƒ­ãƒ¼ãƒ‰ã¾ã§ã®ãƒ—ãƒ¬ãƒ¼ã‚¹ãƒ›ãƒ«ãƒ€ + æž ç·š)
  // Draw skills list directly on the paper
  if (design.skills && design.skills.length > 0) {
    const startY = IMAGE_RECT.y;
    const lineH = 56;
    const x = TEX_W * 0.13;
    
    // "REQUIRED SKILLS" header
    ctx.fillStyle = "#E8C547";
    ctx.font = `bold 44px ${HAND_FONT}`;
    ctx.fillText("REQUIRED SKILLS:", x, startY);
    
    // Underline
    ctx.strokeStyle = "#E8C547";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, startY + 10);
    ctx.lineTo(x + 420, startY + 10);
    ctx.stroke();
    
    // Skills list
    ctx.fillStyle = INK_COLOR;
    ctx.font = `36px ${HAND_FONT}`;
    design.skills.forEach((skill, i) => {
      ctx.fillText("\u25B8 " + skill, x + 10, startY + 60 + i * lineH);
    });
    
    // Badge at bottom
    ctx.fillStyle = "#E8C547";
    ctx.font = `bold 34px ${HAND_FONT}`;
    ctx.fillText("VOIDDEV HACKATHON SQUAD", x, startY + 85 + design.skills.length * lineH);
  } else {
    ctx.fillStyle = "#d9d7d0";
    ctx.fillRect(IMAGE_RECT.x, IMAGE_RECT.y, IMAGE_RECT.w, IMAGE_RECT.h);
    ctx.fillStyle = INK_COLOR;
    ctx.font = `62px ${HAND_FONT}`;
    ctx.fillText(design.url, TEX_W * 0.11, IMAGE_RECT.y + IMAGE_RECT.h + 95);
  }
}

function drawTitle(ctx, title) {
  const maxW = TEX_W * 0.78;
  const x = TEX_W * 0.11;

  // ã¾ãš1è¡Œã§åŽã¾ã‚‹ã‹ (100px ã¾ã§ã¯ç¸®å°ã‚’è¨±å®¹)
  let size = 170;
  ctx.font = `${size}px ${HAND_FONT}`;
  while (ctx.measureText(title).width > maxW && size > 100) {
    size -= 6;
    ctx.font = `${size}px ${HAND_FONT}`;
  }
  const words = title.split(" ");
  if (ctx.measureText(title).width <= maxW || words.length < 2) {
    // 1å˜èªžã§åŽã¾ã‚‰ãªã„å ´åˆã¯ã•ã‚‰ã«ç¸®å°
    while (ctx.measureText(title).width > maxW && size > 60) {
      size -= 6;
      ctx.font = `${size}px ${HAND_FONT}`;
    }
    ctx.fillText(title, x, TEX_H * 0.245);
    return;
  }

  // 2è¡Œã«æŠ˜ã‚Šè¿”ã— (è¡Œå¹…ãŒæœ€ã‚‚æƒã†åˆ†å‰²ä½ç½®ã‚’é¸ã¶)
  let best = null;
  for (let i = 1; i < words.length; i++) {
    const line1 = words.slice(0, i).join(" ");
    const line2 = words.slice(i).join(" ");
    const width = Math.max(
      ctx.measureText(line1).width,
      ctx.measureText(line2).width,
    );
    if (!best || width < best.width) best = { line1, line2, width };
  }
  size = 120;
  ctx.font = `${size}px ${HAND_FONT}`;
  while (
    Math.max(
      ctx.measureText(best.line1).width,
      ctx.measureText(best.line2).width,
    ) > maxW &&
    size > 60
  ) {
    size -= 6;
    ctx.font = `${size}px ${HAND_FONT}`;
  }
  ctx.fillText(best.line1, x, TEX_H * 0.16);
  ctx.fillText(best.line2, x, TEX_H * 0.255);
}

// OGP ç”»åƒã‚’ cover ãƒ•ã‚£ãƒƒãƒˆã§æž å†…ã«æãè¾¼ã‚€
function drawDesignImage(state) {
  // Skip image if design has skills (we draw text instead)
  if (state.design && state.design.skills && state.design.skills.length > 0) return;
  const { ctx, image } = state;
  if (!image.complete || !image.naturalWidth) return;

  const scale = Math.max(
    IMAGE_RECT.w / image.naturalWidth,
    IMAGE_RECT.h / image.naturalHeight,
  );
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(IMAGE_RECT.x, IMAGE_RECT.y, IMAGE_RECT.w, IMAGE_RECT.h);
  ctx.clip();
  ctx.drawImage(
    image,
    IMAGE_RECT.x + (IMAGE_RECT.w - dw) / 2,
    IMAGE_RECT.y + (IMAGE_RECT.h - dh) / 2,
    dw,
    dh,
  );
  ctx.restore();
  ctx.strokeStyle = "#3a3a38";
  ctx.lineWidth = 3;
  ctx.strokeRect(IMAGE_RECT.x, IMAGE_RECT.y, IMAGE_RECT.w, IMAGE_RECT.h);
  state.texture.needsUpdate = true;
}

// æ‰‹æ›¸ããƒ•ã‚©ãƒ³ãƒˆã®ãƒ­ãƒ¼ãƒ‰å®Œäº†å¾Œã«é™çš„ãƒ¬ã‚¤ãƒ¤ãƒ¼ã‚’æãç›´ã™
if (document.fonts) {
  Promise.all([
    document.fonts.load('100px "Caveat"'),
    document.fonts.load('100px "Yomogi"', "ä¸€æ­©ã®å†’é™º"),
  ]).then(() => {
    for (const state of designStates) {
      if (!state) continue;
      drawStaticLayer(state.ctx, state.design);
      drawDesignImage(state);
      state.texture.needsUpdate = true;
    }
  });
}

function getDesignMaterial(designIndex) {
  const idx = designIndex % PAPER_DESIGNS.length;
  if (designStates[idx]) return designStates[idx].material;

  const design = PAPER_DESIGNS[idx];
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  drawStaticLayer(ctx, design);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.rotation = Math.PI; // UVã«åˆã‚ã›ã¦å›žè»¢
  texture.center.set(0.5, 0.5);
  texture.repeat.set(1, -1); // UVã«åˆã‚ã›ã¦åè»¢

  // ä¸¡é¢è¡¨ç¤ºï¼ˆç´™ã¯è–„ã„ã®ã§è£ã‚‚è¦‹ãˆã¦ã»ã—ã„ï¼‰
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.9,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const image = new Image();
  const state = { design, canvas, ctx, texture, material, image };
  image.onload = () => drawDesignImage(state);
  // ã“ã®ãƒ•ã‚¡ã‚¤ãƒ« (src/) ã®1ã¤ä¸Šã®éšŽå±¤ã«ã‚ã‚‹ data/ ã‚’å‚ç…§ã™ã‚‹
  image.src = import.meta.url.replace(/[^/]*$/, "") + "../" + design.image;

  designStates[idx] = state;
  return material;
}

/**
 * animation.json ã®ãƒ‡ãƒ¼ã‚¿ã‹ã‚‰ Three.js ã®ãƒ¡ãƒƒã‚·ãƒ¥ã‚’ä½œã‚‹
 * designIndex ã§ç´™é¢ãƒ‡ã‚¶ã‚¤ãƒ³ (PAPER_DESIGNS) ã‚’é¸ã¶
 * æˆ»ã‚Šå€¤: { mesh, positionAttr, normalAttr }
 */
export function createPaper(animData, designIndex = 0) {
  const { vertexCount, indices, uvs, positions, normals } = animData;

  const geometry = new THREE.BufferGeometry();

  // ===== é ‚ç‚¹ä½ç½®ï¼ˆæœ€åˆã®ãƒ•ãƒ¬ãƒ¼ãƒ ã§åˆæœŸåŒ–ï¼‰=====
  // æ¯Žãƒ•ãƒ¬ãƒ¼ãƒ æ›¸ãæ›ãˆã‚‹å‰æãªã®ã§ Float32Array ã‚’ç›´æŽ¥æŒã¤
  const positionArray = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount * 3; i++) {
    positionArray[i] = positions[i]; // ãƒ•ãƒ¬ãƒ¼ãƒ 0
  }
  const positionAttr = new THREE.BufferAttribute(positionArray, 3);
  positionAttr.setUsage(THREE.DynamicDrawUsage); // é »ç¹ã«æ›´æ–°ã•ã‚Œã‚‹
  geometry.setAttribute("position", positionAttr);

  // ===== æ³•ç·š =====
  const normalArray = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount * 3; i++) {
    normalArray[i] = normals[i];
  }
  const normalAttr = new THREE.BufferAttribute(normalArray, 3);
  normalAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute("normal", normalAttr);

  // ===== UV =====
  const uvArray = new Float32Array(uvs.length);
  for (let i = 0; i < uvs.length; i++) {
    uvArray[i] = uvs[i];
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));

  // ===== ã‚¤ãƒ³ãƒ‡ãƒƒã‚¯ã‚¹ =====
  // 140é ‚ç‚¹ãªã®ã§ Uint16 ã§ååˆ†
  const indexArray = new Uint16Array(indices);
  geometry.setIndex(new THREE.BufferAttribute(indexArray, 1));

  const mesh = new THREE.Mesh(geometry, getDesignMaterial(designIndex));

  return {
    mesh,
    positionAttr,
    normalAttr,
  };
}

/**
 * æŒ‡å®šãƒ•ãƒ¬ãƒ¼ãƒ ï¼ˆå°æ•°å¯ï¼‰ã® positions ã¨ normals ã§ã‚¸ã‚ªãƒ¡ãƒˆãƒªã‚’æ›´æ–°ã™ã‚‹ã€‚
 * å°æ•°ã®å ´åˆã¯éš£æŽ¥ãƒ•ãƒ¬ãƒ¼ãƒ é–“ã‚’ç·šå½¢è£œé–“ã™ã‚‹ã€‚
 */
export function updatePaperFrame(paper, animData, frameIdx) {
  const { vertexCount, frameCount, positions, normals } = animData;
  const { positionAttr, normalAttr } = paper;

  const len = vertexCount * 3;
  const f0 = Math.floor(frameIdx);
  const t = frameIdx - f0;

  const off0 = f0 * len;

  const posArray = positionAttr.array;
  const nrmArray = normalAttr.array;

  if (t < 1e-6) {
    // æ•´æ•°ãƒ•ãƒ¬ãƒ¼ãƒ  â€” ã‚³ãƒ”ãƒ¼ã ã‘
    for (let i = 0; i < len; i++) {
      posArray[i] = positions[off0 + i];
      nrmArray[i] = normals[off0 + i];
    }
  } else {
    // å°æ•°ãƒ•ãƒ¬ãƒ¼ãƒ  â€” lerp
    const f1 = (f0 + 1) % frameCount;
    const off1 = f1 * len;
    const s = 1 - t;
    for (let i = 0; i < len; i++) {
      posArray[i] = positions[off0 + i] * s + positions[off1 + i] * t;
      nrmArray[i] = normals[off0 + i] * s + normals[off1 + i] * t;
    }
  }

  positionAttr.needsUpdate = true;
  normalAttr.needsUpdate = true;

  paper.mesh.geometry.computeBoundingSphere();
  paper.mesh.geometry.computeBoundingBox();
}
