import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { createPaper, updatePaperFrame, PAPER_DESIGNS } from "./paper.js";
import { loadVATData } from "./paper-vat.js";

// ==================================================
// SCENE & TRANSPARENT HIGH-DPI RENDERER SETUP
// ==================================================
const app = document.getElementById("app");
const info = document.getElementById("info");

const scene = new THREE.Scene();
// Keep scene background transparent so the VoidDev Manga Arena CSS background shines through!
scene.background = null;

const cameraSettings = { x: 0, y: 2.35, z: 3.65, targetY: 0.28 };
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.01,
  100,
);

function isMobileViewport() {
  return window.innerWidth < 768 || window.innerWidth / window.innerHeight < 0.82;
}

function configureCameraForViewport() {
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  camera.aspect = aspect;
  if (aspect < 0.65) {
    // Tall mobile portrait screen
    camera.fov = 46;
    cameraSettings.x = 0;
    cameraSettings.y = 3.25;
    cameraSettings.z = 4.65;
    cameraSettings.targetY = 0.12;
  } else if (aspect < 0.9) {
    // Tablet / wider mobile portrait
    camera.fov = 43;
    cameraSettings.x = 0;
    cameraSettings.y = 2.85;
    cameraSettings.z = 4.15;
    cameraSettings.targetY = 0.18;
  } else {
    // Desktop / landscape
    camera.fov = 40;
    cameraSettings.x = 0;
    cameraSettings.y = 2.35;
    cameraSettings.z = 3.65;
    cameraSettings.targetY = 0.28;
  }
  camera.position.set(cameraSettings.x, cameraSettings.y, cameraSettings.z);
  camera.lookAt(0, cameraSettings.targetY, 0);
  camera.updateProjectionMatrix();
}

configureCameraForViewport();

function applyCameraSettings() {
  camera.position.set(cameraSettings.x, cameraSettings.y, cameraSettings.z);
  camera.lookAt(0, cameraSettings.targetY, 0);
  updateOpenPose();
}

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = false;
app.appendChild(renderer.domElement);

// ==================================================
// MANGA ARENA FLOOR SEAL & LIGHTING
// ==================================================
const FLOOR_VISUAL_Y = -0.1;
const WALL_Z = -1.1;

function createMangaArenaFloorTexture() {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  // Soft warm paper radial spotlight
  const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, size * 0.48);
  grad.addColorStop(0, "rgba(255, 253, 245, 0.78)");
  grad.addColorStop(0.55, "rgba(245, 238, 223, 0.52)");
  grad.addColorStop(0.82, "rgba(245, 238, 223, 0.18)");
  grad.addColorStop(1, "rgba(245, 238, 223, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Outer Manga Ink Ring
  ctx.strokeStyle = "rgba(17, 17, 15, 0.32)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 410, 0, Math.PI * 2);
  ctx.stroke();

  // Dashed Crimson Ring
  ctx.strokeStyle = "rgba(228, 47, 38, 0.35)";
  ctx.lineWidth = 4;
  ctx.setLineDash([22, 14]);
  ctx.beginPath();
  ctx.arc(cx, cy, 382, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner Gold & Ink Rings
  ctx.strokeStyle = "rgba(246, 200, 76, 0.45)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(17, 17, 15, 0.22)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 140, 0, Math.PI * 2);
  ctx.stroke();

  // Radial Compass / Speed-Line Ticks on Floor
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r0 = i % 4 === 0 ? 350 : 390;
    const r1 = 410;
    ctx.strokeStyle = i % 4 === 0 ? "rgba(17, 17, 15, 0.38)" : "rgba(17, 17, 15, 0.18)";
    ctx.lineWidth = i % 4 === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.stroke();
  }

  // Crosshair Axis Lines
  ctx.strokeStyle = "rgba(17, 17, 15, 0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 410, cy);
  ctx.lineTo(cx + 410, cy);
  ctx.moveTo(cx, cy - 410);
  ctx.lineTo(cx, cy + 410);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const arenaFloorGeo = new THREE.PlaneGeometry(5.6, 5.6);
const arenaFloorMat = new THREE.MeshBasicMaterial({
  map: createMangaArenaFloorTexture(),
  transparent: true,
  depthWrite: false,
});
const arenaFloor = new THREE.Mesh(arenaFloorGeo, arenaFloorMat);
arenaFloor.rotation.x = -Math.PI / 2;
arenaFloor.position.set(0, FLOOR_VISUAL_Y, 0.15);
scene.add(arenaFloor);

// Shared Contact Shadow Texture (manga halftone + ink shadow under each paper ball)
let contactShadowTex = null;
function getContactShadowTexture() {
  if (contactShadowTex) return contactShadowTex;
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 58);
  g.addColorStop(0, "rgba(17, 17, 15, 0.68)");
  g.addColorStop(0.55, "rgba(17, 17, 15, 0.34)");
  g.addColorStop(0.85, "rgba(17, 17, 15, 0.08)");
  g.addColorStop(1, "rgba(17, 17, 15, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  contactShadowTex = new THREE.CanvasTexture(c);
  return contactShadowTex;
}

function createContactShadowMesh() {
  const geo = new THREE.PlaneGeometry(0.68, 0.68);
  const mat = new THREE.MeshBasicMaterial({
    map: getContactShadowTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  });
  const m = new THREE.Mesh(geo, mat);
  m.rotation.x = -Math.PI / 2;
  m.position.y = FLOOR_VISUAL_Y + 0.003;
  m.raycast = () => {};
  scene.add(m);
  return m;
}

// Anime Falling Speed-Trail Mesh (attached above falling ball)
function createSpeedTrailMesh(index) {
  const geo = new THREE.ConeGeometry(0.16, 0.95, 7, 1, true);
  geo.translate(0, 0.48, 0);
  const color = index % 2 === 0 ? 0xe42f26 : 0xf6c84c;
  const mat = new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const m = new THREE.Mesh(geo, mat);
  m.raycast = () => {};
  scene.add(m);
  return m;
}

// 3D Manga Shockwave Rings on Landing Impact
const impactRings = [];
const impactRingGeo = new THREE.RingGeometry(0.14, 0.23, 28);
impactRingGeo.rotateX(-Math.PI / 2);

function spawnImpactRing(x, z, index = 0) {
  const color = index % 2 === 0 ? 0x11110f : 0xe42f26;
  const mat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(impactRingGeo, mat);
  mesh.position.set(x, FLOOR_VISUAL_Y + 0.006, z);
  mesh.scale.setScalar(0.5);
  mesh.raycast = () => {};
  scene.add(mesh);
  impactRings.push({ mesh, mat, age: 0, duration: 0.48 });

  // Project 3D impact point to 2D screen for Manga SFX pop ("ドン!", "BAM!", etc.)
  if (typeof window.spawnMangaImpactSfx === "function") {
    const v = new THREE.Vector3(x, FLOOR_VISUAL_Y + 0.18, z);
    v.project(camera);
    const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
    window.spawnMangaImpactSfx(sx, sy, index);
  }
}

function updateImpactRings(dt) {
  for (let i = impactRings.length - 1; i >= 0; i--) {
    const r = impactRings[i];
    r.age += dt;
    const t = r.age / r.duration;
    if (t >= 1) {
      scene.remove(r.mesh);
      r.mat.dispose();
      impactRings.splice(i, 1);
      continue;
    }
    const scale = 0.5 + (1 - Math.pow(1 - t, 3)) * 2.2;
    r.mesh.scale.setScalar(scale);
    r.mat.opacity = (1 - t) * 0.82;
  }
}

// Clean Cel-Shading Lights
const ambient = new THREE.AmbientLight(0xffffff, 1.55);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xfffcf2, 1.45);
dirLight.position.set(-1.8, 3.2, 2.2);
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xf6c84c, 0.35);
fillLight.position.set(2.2, 1.5, -1.2);
scene.add(fillLight);

// ==================================================
// SETTINGS & OPTIONAL DEBUG GUI
// ==================================================
const MAX_PAPERS = 50;
const urlParams = new URLSearchParams(window.location.search);
const animSettings = { speed: 1.65, openFrame: 2 };
const paperSettings = {
  count: Math.min(
    MAX_PAPERS,
    Math.max(
      1,
      parseInt(urlParams.get("papers"), 10) || (isMobileViewport() ? 12 : 16),
    ),
  ),
};
const showGui = urlParams.get("gui") === "on";
const debugFrameParam = urlParams.get("frame");
const debugFrame = debugFrameParam !== null ? parseFloat(debugFrameParam) : null;
const debugPhysics = urlParams.get("debug") === "physics";

if (showGui) {
  const gui = new GUI();
  gui.add(animSettings, "speed", 0.1, 5, 0.1).name("Speed");
  gui.add(paperSettings, "count", 1, MAX_PAPERS, 1).name("Papers").onFinishChange(syncPaperCount);
}

// ==================================================
// STATE & STAGE BOUNDS
// ==================================================
const papers = [];
let animData = null;
let activePaper = null;

const OPEN_DISTANCE = 1.48;
const CLOSED_SCALE = 0.84;

const flatSize = { width: 1, depth: 1.4 };

const OPEN_DURATION = 0.92;
const DISCARD_DURATION = 1.05;
const ROLL_LINEAR_RESISTANCE = 2.4;
const ROLL_ANGULAR_RESISTANCE = 4.2;
const ROLL_SETTLE_SPEED = 0.018;
const PHYSICS_STEP = 1 / 60;
const PAPER_MASS = 0.18;

const GRAB_LIFT = 0.52;
const GRAB_STIFFNESS = 15;
const GRAB_MAX_SPEED = 4.8;
const THROW_MAX_SPEED = 3.5;
const CLICK_DRAG_THRESHOLD_PX = 8;

let collisionRadius = 0.25;
let restCenterY = FLOOR_VISUAL_Y + 0.25;
let restMeshY = 0.02;
const crumpleCenter = new THREE.Vector3(0, 0.2, 0);

// Compute stage bounds dynamically so all paper balls fit 100% inside mobile portrait & desktop screens!
function getThrowBounds() {
  const aspect = window.innerWidth / Math.max(1, window.innerHeight);
  if (aspect < 0.65) {
    return { minX: -0.96, maxX: 0.96, minZ: -0.88, maxZ: 1.22 };
  }
  if (aspect < 0.9) {
    return { minX: -1.25, maxX: 1.25, minZ: -0.92, maxZ: 1.28 };
  }
  return { minX: -2.05, maxX: 2.05, minZ: -0.95, maxZ: 1.38 };
}

// ==================================================
// CANNON-ES PHYSICS WORLD (SMOOTH 60HZ)
// ==================================================
const physicsWorld = new CANNON.World({
  broadphase: new CANNON.NaiveBroadphase(),
  gravity: new CANNON.Vec3(0, -7.6, 0),
});
physicsWorld.allowSleep = false;
physicsWorld.solver.iterations = 5;
physicsWorld.defaultContactMaterial.friction = 0.75;
physicsWorld.defaultContactMaterial.restitution = 0.28;

const paperMaterial = new CANNON.Material("paper");
const floorPhysicsMaterial = new CANNON.Material("floor");
physicsWorld.addContactMaterial(
  new CANNON.ContactMaterial(paperMaterial, floorPhysicsMaterial, {
    friction: 0.85,
    restitution: 0.3,
  }),
);
physicsWorld.addContactMaterial(
  new CANNON.ContactMaterial(paperMaterial, paperMaterial, {
    friction: 0.5,
    restitution: 0.38,
  }),
);

const floorBody = new CANNON.Body({
  mass: 0,
  material: floorPhysicsMaterial,
  shape: new CANNON.Plane(),
  position: new CANNON.Vec3(0, FLOOR_VISUAL_Y, 0),
  quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
});
physicsWorld.addBody(floorBody);

const _crumpleOffset = new THREE.Vector3();
function crumpleWorldOffset(scale, quaternion) {
  return _crumpleOffset
    .copy(crumpleCenter)
    .multiplyScalar(scale)
    .applyQuaternion(quaternion);
}

function createPaperBody(paper) {
  const off = crumpleWorldOffset(CLOSED_SCALE, paper.mesh.quaternion);
  const body = new CANNON.Body({
    mass: PAPER_MASS,
    material: paperMaterial,
    shape: new CANNON.Sphere(collisionRadius),
    linearDamping: 0.14,
    angularDamping: 0.32,
    position: new CANNON.Vec3(
      paper.mesh.position.x + off.x,
      paper.mesh.position.y + off.y,
      paper.mesh.position.z + off.z,
    ),
  });
  body.quaternion.set(
    paper.mesh.quaternion.x,
    paper.mesh.quaternion.y,
    paper.mesh.quaternion.z,
    paper.mesh.quaternion.w,
  );
  physicsWorld.addBody(body);
  return body;
}

function setPaperBodyDynamic(paper, enabled) {
  const body = paper.body;
  body.type = enabled ? CANNON.Body.DYNAMIC : CANNON.Body.KINEMATIC;
  body.mass = enabled ? PAPER_MASS : 0;
  body.collisionFilterGroup = enabled ? 1 : 0;
  body.collisionFilterMask = enabled ? 1 : 0;
  if (!enabled) {
    body.velocity.set(0, 0, 0);
    body.angularVelocity.set(0, 0, 0);
    body.force.set(0, 0, 0);
    body.torque.set(0, 0, 0);
  }
  body.updateMassProperties();
  body.wakeUp();
}

function syncBodyToMesh(paper) {
  const off = crumpleWorldOffset(paper.mesh.scale.x, paper.mesh.quaternion);
  paper.body.position.set(
    paper.mesh.position.x + off.x,
    paper.mesh.position.y + off.y,
    paper.mesh.position.z + off.z,
  );
  paper.body.quaternion.set(
    paper.mesh.quaternion.x,
    paper.mesh.quaternion.y,
    paper.mesh.quaternion.z,
    paper.mesh.quaternion.w,
  );
}

function syncMeshToBody(paper, scale = CLOSED_SCALE) {
  paper.mesh.quaternion.set(
    paper.body.quaternion.x,
    paper.body.quaternion.y,
    paper.body.quaternion.z,
    paper.body.quaternion.w,
  );
  const off = crumpleWorldOffset(scale, paper.mesh.quaternion);
  paper.mesh.position.set(
    paper.body.position.x - off.x,
    paper.body.position.y - off.y,
    paper.body.position.z - off.z,
  );
  paper.mesh.scale.setScalar(scale);
}

function isOnGround(body) {
  return body.position.y <= restCenterY + 0.055;
}

function applyRollingResistance(body, dt) {
  const linearDecay = Math.exp(-ROLL_LINEAR_RESISTANCE * dt);
  const angularDecay = Math.exp(-ROLL_ANGULAR_RESISTANCE * dt);
  body.velocity.x *= linearDecay;
  body.velocity.z *= linearDecay;
  body.angularVelocity.x *= angularDecay;
  body.angularVelocity.y *= angularDecay;
  body.angularVelocity.z *= angularDecay;
}

function finishRollingPaper(paper, maxFrame) {
  paper.state = "closed";
  paper.time = 0;
  paper.homePosition.copy(paper.mesh.position);
  paper.homeRotation.copy(paper.mesh.rotation);
  paper.frameIdx = maxFrame;
  updatePaperFrame(paper, animData, paper.frameIdx);
  syncBodyToMesh(paper);
  syncMeshToBody(paper);
}

const BOUNDS_PULL = 4.2;

function applyPhysicsBounds(dt) {
  const bounds = getThrowBounds();
  const minX = bounds.minX + collisionRadius * 0.7;
  const maxX = bounds.maxX - collisionRadius * 0.7;
  const minZ = bounds.minZ + collisionRadius * 0.7;
  const maxZ = bounds.maxZ - collisionRadius * 0.7;

  for (const paper of papers) {
    if (!paper.body || paper.body.type !== CANNON.Body.DYNAMIC) continue;
    const body = paper.body;

    if (body.position.x < minX) {
      if (body.velocity.x < 0) body.velocity.x = Math.abs(body.velocity.x) * 0.45;
      body.velocity.x += BOUNDS_PULL * dt;
    } else if (body.position.x > maxX) {
      if (body.velocity.x > 0) body.velocity.x = -Math.abs(body.velocity.x) * 0.45;
      body.velocity.x -= BOUNDS_PULL * dt;
    }

    if (body.position.z < minZ) {
      if (body.velocity.z < 0) body.velocity.z = Math.abs(body.velocity.z) * 0.45;
      body.velocity.z += BOUNDS_PULL * dt;
    } else if (body.position.z > maxZ) {
      if (body.velocity.z > 0) body.velocity.z = -Math.abs(body.velocity.z) * 0.45;
      body.velocity.z -= BOUNDS_PULL * dt;
    }
  }
}

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return t * t * t;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function captureTransform(paper) {
  return {
    position: paper.mesh.position.clone(),
    quaternion: paper.mesh.quaternion.clone(),
    scale: paper.mesh.scale.x,
    frameIdx: paper.frameIdx,
  };
}

const _viewDir = new THREE.Vector3();
function computeOpenPose() {
  camera.getWorldDirection(_viewDir);
  const position = camera.position
    .clone()
    .addScaledVector(_viewDir, OPEN_DISTANCE);

  const yAxis = _viewDir.clone().negate();
  const zAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis),
  );

  const screenRatio = isMobileViewport() ? 0.78 : 0.84;
  const viewH =
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * OPEN_DISTANCE;
  const viewW = viewH * camera.aspect;
  const scale = Math.min(
    (viewH * screenRatio) / flatSize.depth,
    (viewW * screenRatio) / flatSize.width,
  );

  return { position, quaternion, scale };
}

function updateOpenPose() {
  if (!activePaper) return;
  if (activePaper.state === "opening" && activePaper.target) {
    const pose = computeOpenPose();
    activePaper.target.position.copy(pose.position);
    activePaper.target.quaternion.copy(pose.quaternion);
    activePaper.target.scale = pose.scale;
  } else if (activePaper.state === "open") {
    const pose = computeOpenPose();
    activePaper.mesh.position.copy(pose.position);
    activePaper.mesh.quaternion.copy(pose.quaternion);
    activePaper.mesh.scale.setScalar(pose.scale);
  }
}

// ==================================================
// INITIALIZATION & SKY-DROP SPAWN LOGIC
// ==================================================
async function init() {
  info.textContent = "Summoning VoidDev Track Scrolls...";

  const moduleDir = import.meta.url.replace(/[^/]*$/, "");
  animData = await loadVATData(moduleDir + "../vat/");

  flatSize.width = animData.flat.width;
  flatSize.depth = animData.flat.depth;

  crumpleCenter.fromArray(animData.crumple.center);
  collisionRadius = animData.crumple.radius * CLOSED_SCALE;
  restCenterY = FLOOR_VISUAL_Y + collisionRadius * 1.08;
  restMeshY = restCenterY - crumpleCenter.y * CLOSED_SCALE;
  floorBody.position.y = restCenterY - collisionRadius;

  // Hide loading overlay once VAT is ready
  if (typeof window.hideMangaLoader === "function") {
    window.hideMangaLoader();
  }

  if (debugFrame !== null) {
    for (let i = 0; i < paperSettings.count; i++) {
      const position =
        paperSettings.count === 1
          ? new THREE.Vector3(0, restMeshY, 0.2)
          : initialPaperPosition(i, paperSettings.count);
      const paper = spawnPaper(position, false);
      setPaperBodyDynamic(paper, false);
      paper.state = "posed";
      paper.frameIdx = Math.max(0, Math.min(debugFrame, animData.frameCount - 1));
      updatePaperFrame(paper, animData, paper.frameIdx);
    }
  } else {
    triggerSkyDropWave(paperSettings.count);
  }

  info.textContent = "";
}

function triggerSkyDropWave(count) {
  for (let i = 0; i < count; i++) {
    const delay = i * 65 + randomRange(0, 45);
    setTimeout(() => {
      if (!animData) return;
      const pos = initialPaperPosition(i, count);
      const dropH = randomRange(2.4, 4.6) + i * 0.14;
      spawnPaper(pos, true, dropH);
    }, delay);
  }
}

// Well-distributed stratified grid + golden-angle placement so balls never stack at (0,0,0)
function initialPaperPosition(index, total = paperSettings.count) {
  const bounds = getThrowBounds();
  const margin = collisionRadius * 0.85;
  const minX = bounds.minX + margin;
  const maxX = bounds.maxX - margin;
  const minZ = bounds.minZ + margin;
  const maxZ = bounds.maxZ - margin;

  const cols = isMobileViewport() ? 3 : 4;
  const rows = Math.max(2, Math.ceil(total / cols));
  const col = index % cols;
  const row = Math.floor(index / cols) % rows;

  const cellW = (maxX - minX) / cols;
  const cellD = (maxZ - minZ) / rows;

  const x = minX + cellW * (col + 0.5) + randomRange(-cellW * 0.28, cellW * 0.28);
  const z = minZ + cellD * (row + 0.5) + randomRange(-cellD * 0.28, cellD * 0.28);

  return new THREE.Vector3(
    Math.min(maxX, Math.max(minX, x)),
    restMeshY,
    Math.min(maxZ, Math.max(minZ, z)),
  );
}

function randomSpawnPosition() {
  const bounds = getThrowBounds();
  const margin = collisionRadius * 0.9;
  const pos = new THREE.Vector3(0, restMeshY, 0);
  for (let attempt = 0; attempt < 40; attempt++) {
    pos.x = randomRange(bounds.minX + margin, bounds.maxX - margin);
    pos.z = randomRange(bounds.minZ + margin, bounds.maxZ - margin);
    const clear = papers.every((p) => {
      const dx = p.body.position.x - pos.x;
      const dz = p.body.position.z - pos.z;
      return dx * dx + dz * dz > (collisionRadius * 2.1) ** 2;
    });
    if (clear) break;
  }
  return pos;
}

let spawnCounter = 0;

function spawnPaper(position, dropIn, dropHeight = randomRange(2.4, 4.2)) {
  const maxFrame = animData.frameCount - 1;
  const dIdx = spawnCounter++ % PAPER_DESIGNS.length;
  const base = createPaper(animData, dIdx);

  base.mesh.rotation.set(
    randomRange(-0.4, 0.4),
    Math.PI + randomRange(-0.8, 0.8),
    randomRange(-0.4, 0.4),
  );
  base.mesh.position.copy(position);
  base.mesh.scale.setScalar(CLOSED_SCALE);
  scene.add(base.mesh);

  const body = createPaperBody(base);
  const shadowMesh = createContactShadowMesh();
  const trailMesh = createSpeedTrailMesh(dIdx);

  // Start slightly uncrumpled when dropping from the sky so it visibly crumples in mid-air!
  const initialFrame = dropIn ? Math.floor(maxFrame * 0.52) : maxFrame;

  const paper = {
    ...base,
    body,
    shadowMesh,
    trailMesh,
    frameIdx: initialFrame,
    state: "closed",
    time: 0,
    wasGrounded: !dropIn,
    impactCount: 0,
    homePosition: base.mesh.position.clone(),
    homeRotation: base.mesh.rotation.clone(),
    start: null,
    target: null,
    throw: null,
  };
  updatePaperFrame(paper, animData, initialFrame);
  papers.push(paper);

  if (debugPhysics) {
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(collisionRadius, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x00b566, wireframe: true }),
    );
    scene.add(wire);
    paper.debugSphere = wire;
  }

  if (dropIn) {
    paper.state = "rolling";
    paper.throw = { settleTimer: 0 };
    body.position.y += dropHeight;
    // Slight inward horizontal drift + anime spin
    body.velocity.set(
      -position.x * 0.18 + randomRange(-0.35, 0.35),
      randomRange(-1.4, -0.4),
      -position.z * 0.15 + randomRange(-0.35, 0.35),
    );
    body.angularVelocity.set(
      randomRange(-4.2, 4.2),
      randomRange(-2.5, 2.5),
      randomRange(-4.2, 4.2),
    );
    syncMeshToBody(paper);
  }
  return paper;
}

function removeOnePaper(forceAll = false) {
  let idx = -1;
  for (let i = papers.length - 1; i >= 0; i--) {
    const p = papers[i];
    if (
      !forceAll &&
      (p === activePaper ||
        p.state === "grabbed" ||
        p.state === "opening" ||
        p.state === "open" ||
        p.state === "discarding")
    ) {
      continue;
    }
    idx = i;
    break;
  }
  if (idx === -1) return false;

  const p = papers[idx];
  if (p === activePaper) activePaper = null;
  if (pointerState && pointerState.paper === p) pointerState.paper = null;
  if (p.debugSphere) scene.remove(p.debugSphere);
  if (p.shadowMesh) {
    scene.remove(p.shadowMesh);
    p.shadowMesh.geometry.dispose();
    p.shadowMesh.material.dispose();
  }
  if (p.trailMesh) {
    scene.remove(p.trailMesh);
    p.trailMesh.geometry.dispose();
    p.trailMesh.material.dispose();
  }
  scene.remove(p.mesh);
  p.mesh.geometry.dispose();
  physicsWorld.removeBody(p.body);
  papers.splice(idx, 1);
  return true;
}

function syncPaperCount() {
  if (!animData) return;
  const target = Math.round(paperSettings.count);
  while (papers.length > target && removeOnePaper()) {}
  while (papers.length < target) {
    spawnPaper(randomSpawnPosition(), true);
  }
}

// ==================================================
// GLOBAL INTERACTION HELPERS FOR ELIGIBILITY.HTML HUD
// ==================================================
window.reshufflePapers = function () {
  if (!animData) return;
  if (activePaper) {
    activePaper = null;
    if (typeof window.onPaperStateChange === "function") {
      window.onPaperStateChange(null, "closed");
    }
  }
  while (papers.length > 0) {
    removeOnePaper(true);
  }
  const count = isMobileViewport() ? 12 : 16;
  paperSettings.count = count;
  triggerSkyDropWave(count);
};

window.closeActivePaper = function () {
  if (!activePaper) return;
  const p = activePaper;
  activePaper = null;
  startDiscard(p);
  if (typeof window.onPaperStateChange === "function") {
    window.onPaperStateChange(null, "closed");
  }
};

window.openCurrentTrackModal = function () {
  if (activePaper && activePaper.design && typeof window.openTrackModal === "function") {
    window.openTrackModal(activePaper.design.title);
  }
};

window.summonTrackPaper = function (trackTitle) {
  if (!animData) return;
  // Find if a paper with this track is already on stage
  let targetPaper = papers.find((p) => p.design && p.design.title === trackTitle);
  if (!targetPaper) {
    const dIdx = PAPER_DESIGNS.findIndex((d) => d.title === trackTitle);
    if (dIdx >= 0) {
      spawnCounter = dIdx;
      targetPaper = spawnPaper(new THREE.Vector3(0, restMeshY, 0.2), false);
    }
  }
  if (!targetPaper) return;

  if (activePaper && activePaper !== targetPaper) {
    startDiscard(activePaper);
    activePaper = null;
  }
  if (activePaper === targetPaper) return;
  startOpen(targetPaper);
  activePaper = targetPaper;
};

// ==================================================
// POINTER / TOUCH INTERACTION
// ==================================================
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const grabPlane = new THREE.Plane();
const grabHitPoint = new THREE.Vector3();
let pointerState = null;

renderer.domElement.style.touchAction = "none";

function updatePointer(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function pickPaper(e) {
  updatePointer(e);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(
    papers.map((p) => p.mesh),
    false,
  );
  if (hit.length === 0) return null;
  return papers.find((p) => p.mesh === hit[0].object) || null;
}

function isGrabbable(paper) {
  return paper.state === "closed" || paper.state === "rolling";
}

renderer.domElement.addEventListener("pointerdown", (e) => {
  if (!animData || pointerState) return;
  const p = pickPaper(e);
  pointerState = {
    paper: p,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    grabbing: false,
  };
  try {
    renderer.domElement.setPointerCapture(e.pointerId);
  } catch {}

  if (p && p.state === "rolling" && p !== activePaper) beginGrab(p, e);
});

renderer.domElement.addEventListener("pointermove", (e) => {
  if (!pointerState) {
    updateHoverCursor(e);
    return;
  }
  if (e.pointerId !== pointerState.pointerId) return;

  if (!pointerState.grabbing) {
    const p = pointerState.paper;
    const moved = Math.hypot(
      e.clientX - pointerState.startX,
      e.clientY - pointerState.startY,
    );
    if (p && isGrabbable(p) && moved > CLICK_DRAG_THRESHOLD_PX) {
      beginGrab(p, e);
    }
  }
  if (pointerState.grabbing) updateGrabTarget(pointerState.paper, e);
});

renderer.domElement.addEventListener("pointerup", (e) => {
  if (!pointerState || e.pointerId !== pointerState.pointerId) return;
  if (pointerState.grabbing) {
    releaseGrab(pointerState.paper, true);
  } else {
    handleClick(e);
  }
  pointerState = null;
});

renderer.domElement.addEventListener("pointercancel", (e) => {
  if (!pointerState || e.pointerId !== pointerState.pointerId) return;
  if (pointerState.grabbing) releaseGrab(pointerState.paper, false);
  pointerState = null;
});

function updateHoverCursor(e) {
  if (!animData) return;
  const p = pickPaper(e);
  renderer.domElement.style.cursor = p
    ? isGrabbable(p)
      ? "grab"
      : "pointer"
    : "";
}

function handleClick(e) {
  const p = pickPaper(e);

  // If clicking empty background while a paper is open, crumple and toss it back
  if (!p) {
    if (activePaper) {
      startDiscard(activePaper);
      activePaper = null;
      if (typeof window.onPaperStateChange === "function") {
        window.onPaperStateChange(null, "closed");
      }
    }
    return;
  }

  const previousActive = activePaper;
  if (previousActive) {
    startDiscard(previousActive);
    activePaper = null;
    if (typeof window.onPaperStateChange === "function") {
      window.onPaperStateChange(null, "closed");
    }
  }

  if (previousActive === p || p.state !== "closed") return;

  startOpen(p);
  activePaper = p;
}

function beginGrab(paper, e) {
  pointerState.grabbing = true;
  paper.state = "grabbed";
  paper.time = 0;

  const body = paper.body;
  body.type = CANNON.Body.KINEMATIC;
  body.mass = 0;
  body.updateMassProperties();
  body.velocity.set(0, 0, 0);
  body.angularVelocity.set(0, 0, 0);
  body.collisionFilterGroup = 1;
  body.collisionFilterMask = 1;
  body.wakeUp();

  paper.grab = {
    target: new THREE.Vector3(
      body.position.x,
      restCenterY + GRAB_LIFT,
      body.position.z,
    ),
  };
  updateGrabTarget(paper, e);
  renderer.domElement.style.cursor = "grabbing";
}

function updateGrabTarget(paper, e) {
  updatePointer(e);
  raycaster.setFromCamera(pointer, camera);
  grabPlane.normal.set(0, 1, 0);
  grabPlane.constant = -(restCenterY + GRAB_LIFT);
  if (!raycaster.ray.intersectPlane(grabPlane, grabHitPoint)) return;

  const bounds = getThrowBounds();
  paper.grab.target.set(
    Math.min(
      Math.max(grabHitPoint.x, bounds.minX + collisionRadius * 0.5),
      bounds.maxX - collisionRadius * 0.5,
    ),
    restCenterY + GRAB_LIFT,
    Math.min(
      Math.max(grabHitPoint.z, bounds.minZ + collisionRadius * 0.5),
      bounds.maxZ - collisionRadius * 0.5,
    ),
  );
}

function releaseGrab(paper, withThrow) {
  const body = paper.body;
  let vx = withThrow ? body.velocity.x : 0;
  let vz = withThrow ? body.velocity.z : 0;
  const speed = Math.hypot(vx, vz);
  if (speed > THROW_MAX_SPEED) {
    const k = THROW_MAX_SPEED / speed;
    vx *= k;
    vz *= k;
  }

  body.type = CANNON.Body.DYNAMIC;
  body.mass = PAPER_MASS;
  body.updateMassProperties();
  body.velocity.set(vx, 0, vz);
  body.angularVelocity.set(
    (vz / collisionRadius) * 0.65,
    randomRange(-1.2, 1.2),
    (-vx / collisionRadius) * 0.65,
  );
  body.wakeUp();

  paper.state = "rolling";
  paper.wasGrounded = false;
  paper.time = 0;
  paper.throw = { settleTimer: 0 };
  renderer.domElement.style.cursor = "grab";
}

function startOpen(paper) {
  setPaperBodyDynamic(paper, false);
  syncMeshToBody(paper);
  paper.state = "opening";
  paper.time = 0;
  paper.start = captureTransform(paper);
  const pose = computeOpenPose();
  paper.target = {
    position: pose.position,
    quaternion: pose.quaternion,
    scale: pose.scale,
    frameIdx: animSettings.openFrame,
  };
  if (typeof window.onPaperStateChange === "function") {
    window.onPaperStateChange(paper.design, "open");
  }
}

function startDiscard(paper) {
  if (paper.state === "discarding" || paper.state === "rolling") return;

  const bounds = getThrowBounds();
  const targetX = randomRange(bounds.minX * 0.7, bounds.maxX * 0.7);
  const targetZ = randomRange(bounds.minZ * 0.6, bounds.maxZ * 0.6);

  paper.state = "discarding";
  paper.time = 0;
  paper.wasGrounded = false;
  paper.start = captureTransform(paper);
  setPaperBodyDynamic(paper, true);
  syncBodyToMesh(paper);
  paper.body.velocity.set(
    (targetX - paper.body.position.x) * 1.35,
    randomRange(0.45, 0.85),
    (targetZ - paper.body.position.z) * 1.45,
  );
  paper.body.angularVelocity.set(
    randomRange(-3.2, 3.2),
    randomRange(-1.4, 1.4),
    randomRange(-3.2, 3.2),
  );
  paper.throw = {
    settleTimer: 0,
  };
}

// ==================================================
// MAIN 60FPS ANIMATION LOOP
// ==================================================
let prevTime = null;

function startAnimation() {
  prevTime = performance.now() / 1000;
  renderer.setAnimationLoop(tick);
}

function tick() {
  const now = performance.now() / 1000;
  const dt = Math.min(now - prevTime, 0.05);
  prevTime = now;

  // Slowly rotate the manga arena seal on the floor
  arenaFloor.rotation.z += dt * 0.06;

  if (!animData) {
    renderer.render(scene, camera);
    return;
  }

  physicsWorld.step(PHYSICS_STEP, dt, 3);
  applyPhysicsBounds(dt);
  updateImpactRings(dt);

  for (const p of papers) {
    updatePaperMotion(p, dt);
    updatePaperVisualAttachments(p);
  }

  if (debugPhysics) {
    for (const p of papers) {
      if (!p.debugSphere) continue;
      p.debugSphere.position.set(
        p.body.position.x,
        p.body.position.y,
        p.body.position.z,
      );
    }
  }

  renderer.render(scene, camera);
}

function updatePaperVisualAttachments(paper) {
  // 1. Contact Shadow on Floor
  if (paper.shadowMesh) {
    if (paper.state === "open" || paper.state === "opening") {
      paper.shadowMesh.visible = false;
    } else {
      paper.shadowMesh.visible = true;
      const bx = paper.body.position.x;
      const bz = paper.body.position.z;
      const heightAboveFloor = Math.max(0, paper.body.position.y - restCenterY);
      const shadowScale = Math.max(0.32, 1.0 - heightAboveFloor * 0.16);
      const shadowAlpha = Math.max(0.12, 0.86 - heightAboveFloor * 0.18);
      paper.shadowMesh.position.set(bx, FLOOR_VISUAL_Y + 0.003, bz);
      paper.shadowMesh.scale.setScalar(shadowScale);
      paper.shadowMesh.material.opacity = shadowAlpha;
    }
  }

  // 2. Anime Speed-Trail while falling fast
  if (paper.trailMesh) {
    const vy = paper.body.velocity.y;
    if (paper.state === "rolling" && vy < -0.85 && paper.body.position.y > restCenterY + 0.15) {
      paper.trailMesh.visible = true;
      paper.trailMesh.position.set(
        paper.body.position.x,
        paper.body.position.y + collisionRadius * 0.35,
        paper.body.position.z,
      );
      const speedFactor = Math.min(2.2, Math.abs(vy) * 0.28);
      paper.trailMesh.scale.set(1, speedFactor, 1);
      paper.trailMesh.rotation.y += 0.25;
      paper.trailMesh.material.opacity = Math.min(0.55, Math.abs(vy) * 0.09);
    } else {
      paper.trailMesh.visible = false;
    }
  }
}

function updatePaperMotion(paper, dt) {
  const maxFrame = animData.frameCount - 1;

  if (paper.state === "opening") {
    paper.time += dt * animSettings.speed;
    const t = clamp01(paper.time / OPEN_DURATION);
    const e = easeOutCubic(t);
    const openEase = easeInCubic(t);

    paper.mesh.position.lerpVectors(
      paper.start.position,
      paper.target.position,
      e,
    );
    paper.mesh.quaternion.slerpQuaternions(
      paper.start.quaternion,
      paper.target.quaternion,
      e,
    );
    paper.mesh.scale.setScalar(lerp(paper.start.scale, paper.target.scale, e));

    paper.frameIdx = lerp(
      paper.start.frameIdx,
      paper.target.frameIdx,
      openEase,
    );
    updatePaperFrame(paper, animData, paper.frameIdx);

    if (t >= 1) {
      paper.state = "open";
      paper.frameIdx = paper.target.frameIdx;
      paper.mesh.position.copy(paper.target.position);
      paper.mesh.quaternion.copy(paper.target.quaternion);
      paper.mesh.scale.setScalar(paper.target.scale);
      syncBodyToMesh(paper);
      updatePaperFrame(paper, animData, paper.frameIdx);
    }
    return;
  }

  if (paper.state === "discarding") {
    paper.time += dt * animSettings.speed;
    const t = clamp01(paper.time / DISCARD_DURATION);
    const closeEase = easeOutCubic(t);
    const scale = lerp(paper.start.scale, CLOSED_SCALE, closeEase);

    paper.frameIdx = lerp(paper.start.frameIdx, maxFrame, closeEase);
    syncMeshToBody(paper, scale);
    updatePaperFrame(paper, animData, paper.frameIdx);

    if (t >= 1) {
      paper.state = "rolling";
      paper.time = 0;
      paper.frameIdx = maxFrame;
      updatePaperFrame(paper, animData, paper.frameIdx);
    }
    return;
  }

  if (paper.state === "grabbed") {
    const body = paper.body;
    const target = paper.grab.target;
    let vx = (target.x - body.position.x) * GRAB_STIFFNESS;
    let vy = (target.y - body.position.y) * GRAB_STIFFNESS;
    let vz = (target.z - body.position.z) * GRAB_STIFFNESS;
    const speed = Math.hypot(vx, vy, vz);
    if (speed > GRAB_MAX_SPEED) {
      const k = GRAB_MAX_SPEED / speed;
      vx *= k;
      vy *= k;
      vz *= k;
    }
    body.velocity.set(vx, vy, vz);
    syncMeshToBody(paper);
    return;
  }

  if (paper.state === "rolling") {
    paper.time += dt;

    // Smoothly finish crumpling in mid-air during initial sky-drop!
    if (paper.frameIdx < maxFrame) {
      paper.frameIdx = Math.min(maxFrame, paper.frameIdx + dt * 62);
      updatePaperFrame(paper, animData, paper.frameIdx);
    }

    const grounded = isOnGround(paper.body);

    // Trigger Anime Shockwave Ring & SFX on first bounce!
    if (grounded && !paper.wasGrounded) {
      paper.wasGrounded = true;
      if (paper.impactCount < 1) {
        paper.impactCount++;
        spawnImpactRing(
          paper.body.position.x,
          paper.body.position.z,
          paper.designIndex,
        );
      }
    } else if (!grounded && paper.body.position.y > restCenterY + 0.14) {
      paper.wasGrounded = false;
    }

    if (grounded) applyRollingResistance(paper.body, dt);
    syncMeshToBody(paper);

    const speed =
      paper.body.velocity.lengthSquared() +
      paper.body.angularVelocity.lengthSquared() * 0.02;
    paper.throw.settleTimer =
      grounded && speed < ROLL_SETTLE_SPEED ? paper.throw.settleTimer + dt : 0;

    if (paper.throw.settleTimer > 0.35) {
      finishRollingPaper(paper, maxFrame);
    }
    return;
  }

  if (paper.state === "closed") {
    if (isOnGround(paper.body)) applyRollingResistance(paper.body, dt);
    syncMeshToBody(paper);
  }
}

// ==================================================
// RESPONSIVE RESIZE HANDLER
// ==================================================
window.addEventListener("resize", () => {
  configureCameraForViewport();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateOpenPose();
});

startAnimation();

init().catch((err) => {
  console.error(err);
  info.textContent = "ERROR: " + err.message;
});
