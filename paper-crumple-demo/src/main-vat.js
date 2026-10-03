import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { createPaper, updatePaperFrame, PAPER_DESIGNS } from "./paper.js";
import { loadVATData } from "./paper-vat.js";

// ==================================================
// ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ¥Ã…Â¸Ã‚ÂºÃƒÂ¦Ã…â€œÃ‚Â¬ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â»ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã†â€™Ã‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¢ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã†â€™Ã¢â‚¬â€
// ==================================================
const app = document.getElementById("app");
const info = document.getElementById("info");

const scene = new THREE.Scene();

// ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¨Ã¢â‚¬Â°Ã‚Â² ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GUI ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¥Ã‚Â¤Ã¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
const colorSettings = {
  background: "#0A0807", // ÃƒÂ¨Ã†â€™Ã…â€™ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚Â£Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ¨Ã†â€™Ã…â€™ÃƒÂ¦Ã¢â€žÂ¢Ã‚Â¯
  floor: "#14100D",
};
scene.background = new THREE.Color(colorSettings.background);

// ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â© ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ¦Ã¢â‚¬â€œÃ…â€œÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ¥Ã¢â‚¬Â°Ã‚ÂÃƒÂ¦Ã¢â‚¬â€œÃ‚Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¨Ã‚Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ (GUI ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚ÂªÃ‚Â¿ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹)
const cameraSettings = { x: 0, y: 2.2, z: 3.6, targetY: 0.35 };
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.01,
  100,
);
camera.position.set(cameraSettings.x, cameraSettings.y, cameraSettings.z);
camera.lookAt(0, cameraSettings.targetY, 0);

function applyCameraSettings() {
  camera.position.set(cameraSettings.x, cameraSettings.y, cameraSettings.z);
  camera.lookAt(0, cameraSettings.targetY, 0);
  updateOpenPose();
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

// ÃƒÂ¥Ã‚ÂºÃ…Â ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ¨Ã†â€™Ã…â€™ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚Â£Ã‚Â
const FLOOR_VISUAL_Y = -0.1;
const WALL_Z = -1.1;

const floorMat = new THREE.MeshStandardMaterial({ color: colorSettings.floor });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, FLOOR_VISUAL_Y, 1);
floor.receiveShadow = true;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({
  color: colorSettings.background,
});
const wall = new THREE.Mesh(new THREE.PlaneGeometry(16, 6), wallMat);
wall.position.set(0, FLOOR_VISUAL_Y + 3, WALL_Z);
wall.receiveShadow = true;
scene.add(wall);

// ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‹â€ 
const ambient = new THREE.AmbientLight(0xffffff, 1.25);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
dirLight.position.set(-2, 2.6, 1.4);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.left = -4;
dirLight.shadow.camera.right = 4;
dirLight.shadow.camera.top = 4;
dirLight.shadow.camera.bottom = -3;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 12;
dirLight.shadow.bias = -0.001;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0);
fillLight.position.set(-2, 1, -1);
scene.add(fillLight);

// ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã†â€™Ã‹â€ ÃƒÂ£Ã†â€™Ã¢â‚¬â€ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â»ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â SSAO ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¦Ã…Â Ã‹Å“ÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â®ÃƒÂ£Ã†â€™Ã‚Â»ÃƒÂ¥Ã¢â‚¬Â¡Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â¿ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã…Â¡Ã¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const ssaoPass = new SSAOPass(
  scene,
  camera,
  window.innerWidth,
  window.innerHeight,
);
ssaoPass.kernelRadius = 0.01;
ssaoPass.minDistance = 0.0001;
ssaoPass.maxDistance = 0.08;
// ÃƒÂ¦Ã‚Â³Ã‚Â¨ÃƒÂ¦Ã¢â‚¬Å¾Ã‚Â: SSAOPass ÃƒÂ£Ã‚ÂÃ‚Â« intensity ÃƒÂ£Ã†â€™Ã¢â‚¬â€ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã†â€™Ã¢â‚¬Â ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â£ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ§Ã¢â‚¬Å¾Ã‚Â¡ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ (ÃƒÂ¨Ã‚Â¨Ã‚Â­ÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ no-op)ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
// ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂªÃƒÂ£Ã†â€™Ã‚Â³/ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂªÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚Â¯ ssaoPass.enabledÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ¥Ã‚Â¼Ã‚Â·ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¨Ã‚ÂªÃ‚Â¿ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â´ÃƒÂ£Ã‚ÂÃ‚Â¯ kernelRadius / maxDistance ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚Â¡Ã…â€™ÃƒÂ£Ã‚ÂÃ¢â‚¬Â ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
composer.addPass(ssaoPass);

composer.addPass(new OutputPass());

// ==================================================
// GUI
// ==================================================
const MAX_PAPERS = 50;
const urlParams = new URLSearchParams(window.location.search);
// openFrame: ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã…Â Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚Â¡Ã‚Â¨ÃƒÂ§Ã‚Â¤Ã‚ÂºÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡0 = ÃƒÂ¥Ã‚Â®Ã…â€™ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â¨ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ¥Ã‹â€ Ã¢â‚¬Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ£Ã¢â€šÂ¬Ã‚Â
// ÃƒÂ¥Ã‚Â°Ã¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ£Ã‚ÂÃ¢â‚¬â„¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â£ÃƒÂ¦Ã¢â‚¬Å¾Ã…Â¸ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ¦Ã‚Â®Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ (VAT ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã‚ÂÃ‚Â¯ 0 ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â¿Ã¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â»ÃƒÂ£Ã‚ÂÃ‚Â©ÃƒÂ¥Ã‚Â¹Ã‚Â³ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°)
const animSettings = { speed: 1.5, openFrame: 4 };
// ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¦Ã…Â¾Ã…Â¡ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â° ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â GUI ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã¢â€šÂ¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ URL ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ (?papers=10) ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¥Ã‚Â¤Ã¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
const paperSettings = {
  count: Math.min(
    MAX_PAPERS,
    Math.max(1, parseInt(urlParams.get("papers"), 10) || 7),
  ),
};
// GUI ÃƒÂ£Ã‚ÂÃ‚Â¯ ?gui=on ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¤Ã‚Â»Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ£Ã‚ÂÃ‚Â ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ¨Ã‚Â¡Ã‚Â¨ÃƒÂ§Ã‚Â¤Ã‚ÂºÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
const showGui = urlParams.get("gui") === "on";

// ÃƒÂ¨Ã‚Â¨Ã‹Å“ÃƒÂ¤Ã‚ÂºÃ¢â‚¬Â¹ÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨ÃƒÂ£Ã†â€™Ã¢â‚¬Â¡ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â°ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â°:
//   ?frame=N        ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â¨ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã…â€™Ã¢â‚¬Â¡ÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ©Ã‚ÂÃ¢â€žÂ¢ÃƒÂ¦Ã‚Â­Ã‚Â¢ÃƒÂ¨Ã‚Â¡Ã‚Â¨ÃƒÂ§Ã‚Â¤Ã‚Âº (ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â§ÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡?papers=1 ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ¤Ã‚Â½Ã‚ÂµÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨ÃƒÂ¦Ã…Â½Ã‚Â¨ÃƒÂ¥Ã‚Â¥Ã‚Â¨)
//   ?ssao=ÃƒÂ¦Ã¢â‚¬Â¢Ã‚Â°ÃƒÂ¥Ã¢â€šÂ¬Ã‚Â¤      SSAO ÃƒÂ¥Ã‚Â¼Ã‚Â·ÃƒÂ¥Ã‚ÂºÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â¸ÃƒÂ£Ã‚ÂÃ‚Â (ÃƒÂ¤Ã‚Â¾Ã¢â‚¬Â¹ ?ssao=0 ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂªÃƒÂ£Ã†â€™Ã¢â‚¬Â¢)
//   ?debug=physics  ÃƒÂ¨Ã‚Â¡Ã‚ÂÃƒÂ§Ã‚ÂªÃ‚ÂÃƒÂ§Ã‚ÂÃ†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ£Ã†â€™Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ¨Ã‚Â¡Ã‚Â¨ÃƒÂ§Ã‚Â¤Ã‚Âº
const debugFrameParam = urlParams.get("frame");
const debugFrame = debugFrameParam !== null ? parseFloat(debugFrameParam) : null;
const debugPhysics = urlParams.get("debug") === "physics";
const ssaoOverride = urlParams.get("ssao");
if (ssaoOverride !== null && parseFloat(ssaoOverride) <= 0) {
  ssaoPass.enabled = false;
}
const gui = new GUI();
if (!showGui) gui.hide();

const lightFolder = gui.addFolder("Lighting");
lightFolder.add(ambient, "intensity", 0, 3, 0.01).name("Ambient");
lightFolder.add(dirLight, "intensity", 0, 4, 0.01).name("Key Light");
lightFolder.add(dirLight.position, "x", -5, 5, 0.1).name("Key X");
lightFolder.add(dirLight.position, "y", 0, 5, 0.1).name("Key Y");
lightFolder.add(dirLight.position, "z", -5, 5, 0.1).name("Key Z");
lightFolder.add(fillLight, "intensity", 0, 2, 0.01).name("Fill Light");

const ssaoFolder = gui.addFolder("SSAO");
ssaoFolder.add(ssaoPass, "kernelRadius", 0.001, 0.5, 0.001).name("Radius");
ssaoFolder.add(ssaoPass, "minDistance", 0.0001, 0.01, 0.0001).name("Min Dist");
ssaoFolder.add(ssaoPass, "maxDistance", 0.01, 0.5, 0.001).name("Max Dist");
ssaoFolder.add(ssaoPass, "enabled").name("Enabled");

const shadowFolder = gui.addFolder("Shadow");
shadowFolder.add(dirLight.shadow, "bias", -0.01, 0.01, 0.0001).name("Bias");

const colorFolder = gui.addFolder("Colors");
colorFolder
  .addColor(colorSettings, "background")
  .name("Background")
  .onChange((v) => {
    scene.background.set(v);
    wallMat.color.set(v);
  });
colorFolder
  .addColor(colorSettings, "floor")
  .name("Floor")
  .onChange((v) => {
    floorMat.color.set(v);
  });

gui.add(animSettings, "speed", 0.1, 5, 0.1).name("Speed");
gui
  .add(animSettings, "openFrame", 0, 12, 0.5)
  .name("Open Frame")
  .onChange(() => {
    // ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¡ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã‚ÂÃ‚Â°ÃƒÂ¥Ã‚ÂÃ‚Â³ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ¦Ã‹Å“Ã‚Â 
    if (activePaper && activePaper.state === "open") {
      activePaper.frameIdx = animSettings.openFrame;
      updatePaperFrame(activePaper, animData, activePaper.frameIdx);
    } else if (activePaper && activePaper.target) {
      activePaper.target.frameIdx = animSettings.openFrame;
    }
  });
gui
  .add(paperSettings, "count", 1, MAX_PAPERS, 1)
  .name("Papers")
  .onFinishChange(syncPaperCount);

const cameraFolder = gui.addFolder("Camera");
cameraFolder
  .add(cameraSettings, "x", -4, 4, 0.05)
  .name("X")
  .onChange(applyCameraSettings);
cameraFolder
  .add(cameraSettings, "y", 0.2, 4, 0.05)
  .name("Y")
  .onChange(applyCameraSettings);
cameraFolder
  .add(cameraSettings, "z", 0.8, 7, 0.05)
  .name("Z")
  .onChange(applyCameraSettings);
cameraFolder
  .add(cameraSettings, "targetY", 0, 2, 0.05)
  .name("Target Y")
  .onChange(applyCameraSettings);
cameraFolder
  .add(camera, "fov", 10, 90, 1)
  .name("FOV")
  .onChange(() => {
    camera.updateProjectionMatrix();
    updateOpenPose();
  });

// ==================================================
// GUI: ÃƒÂ¦Ã¢â‚¬â„¢Ã‚Â®ÃƒÂ¥Ã‚Â½Ã‚Â±ÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â° (ÃƒÂ¨Ã‚Â¨Ã‹Å“ÃƒÂ¤Ã‚ÂºÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â§ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬Ëœ)
// decode / normals ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¤Ã‚Â¸Ã¢â€šÂ¬ÃƒÂ¥Ã‚ÂºÃ‚Â¦ÃƒÂ£Ã‚ÂÃ‚Â ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ¥Ã…Â Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂURL ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ§Ã‚ÂµÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â¿ÃƒÂ§Ã‚Â«Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã†â€™Ã‚ÂªÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
// Pose Frame ÃƒÂ£Ã‚ÂÃ‚Â ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚Â¯ ?frame= ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚ÂµÃ‚Â·ÃƒÂ¥Ã¢â‚¬Â¹Ã¢â‚¬Â¢ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã¢â‚¬â€œÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ¦Ã‹Å“Ã‚Â ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
// ==================================================
const captureSettings = {
  decode: urlParams.get("decode") || "correct",
  normals: urlParams.get("normals") || "smooth",
  poseFrame: debugFrame !== null ? debugFrame : -1,
  physics: debugPhysics,
  apply() {
    const p = new URLSearchParams(window.location.search);
    p.set("gui", "on");
    p.set("papers", String(paperSettings.count));

    const setOrDelete = (key, value, defaultValue) => {
      if (value === defaultValue) p.delete(key);
      else p.set(key, value);
    };
    setOrDelete("decode", captureSettings.decode, "correct");
    setOrDelete("normals", captureSettings.normals, "smooth");
    setOrDelete("frame", String(captureSettings.poseFrame), "-1");
    if (ssaoPass.enabled) p.delete("ssao");
    else p.set("ssao", "0");
    if (captureSettings.physics) p.set("debug", "physics");
    else p.delete("debug");

    window.location.search = p.toString();
  },
};

const captureFolder = gui.addFolder("Capture (Apply ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã†â€™Ã‚ÂªÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°)");
captureFolder
  .add(captureSettings, "decode", ["correct", "naive", "reversed", "noflip", "nomirror"])
  .name("Decode");
captureFolder
  .add(captureSettings, "normals", ["smooth", "flat"])
  .name("Normals");
captureFolder
  .add(captureSettings, "poseFrame", -1, 49, 0.5)
  .name("Pose Frame (-1=off)")
  .onChange((value) => {
    // ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚Â« ?frame= ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚ÂµÃ‚Â·ÃƒÂ¥Ã¢â‚¬Â¹Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã‚ÂÃ‚Â°ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¥Ã‚Â·Ã‚Â®ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â¿ÃƒÂ£Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
    if (debugFrame === null || value < 0 || !animData) return;
    for (const paper of papers) {
      if (paper.state !== "posed") continue;
      paper.frameIdx = Math.max(0, Math.min(value, animData.frameCount - 1));
      updatePaperFrame(paper, animData, paper.frameIdx);
    }
  });
captureFolder.add(captureSettings, "physics").name("Show Colliders");
captureFolder.add(captureSettings, "apply").name("ÃƒÂ¢Ã¢â‚¬â€œÃ‚Â¶ Apply & Reload");

// ==================================================
// ÃƒÂ£Ã†â€™Ã¢â‚¬Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â° ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â¥ÃƒÂ¤Ã‚Â½Ã…â€œÃƒÂ¦Ã‹â€ Ã‚ÂÃƒÂ¯Ã‚Â¼Ã‹â€ 3ÃƒÂ¦Ã…Â¾Ã…Â¡ÃƒÂ¯Ã‚Â¼Ã¢â‚¬Â°
// ==================================================
const papers = [];
let animData = null;
let activePaper = null;

const PAPER_OFFSETS = [
  [-1.25, 0.02, -0.1],
  [0, 0.02, 0.12],
  [1.25, 0.02, -0.06],
];

// ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢: ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ¦Ã‚Â­Ã‚Â£ÃƒÂ©Ã‚ÂÃ‚Â¢ OPEN_DISTANCE ÃƒÂ¥Ã¢â‚¬Â¦Ã‹â€ ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ©Ã‚Â«Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚Â®90%ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¦Ã‚Â­Ã‚Â£ÃƒÂ¥Ã‚Â¯Ã‚Â¾ÃƒÂ¨Ã‚Â¡Ã‚Â¨ÃƒÂ§Ã‚Â¤Ã‚ÂºÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
// (ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã†â€™Ã¢â‚¬Â ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¸ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â©ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â¿Ã¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ¨Ã‚Â·Ã‚ÂÃƒÂ©Ã¢â‚¬ÂºÃ‚Â¢ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ¥Ã‚Â¿Ã¢â‚¬Â¦ÃƒÂ£Ã‚ÂÃ…Â¡ÃƒÂ¦Ã…â€œÃ¢â€šÂ¬ÃƒÂ¥Ã¢â‚¬Â°Ã‚ÂÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‹â€ ÃƒÂ£Ã‚ÂÃ¢â‚¬Â ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹)
const OPEN_SCREEN_RATIO = 0.9;
const OPEN_DISTANCE = 1.5;
const CLOSED_SCALE = 0.82;

const flatSize = { width: 1, depth: 1.4 };

// ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ¥Ã¢â‚¬Â¹Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ¥Ã‚ÂºÃ…Â ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â¯Ã¢â‚¬Å¾ÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â² (ÃƒÂ¥Ã‚Â£Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¦Ã‚Â±Ã‚ÂºÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ¥Ã¢â‚¬ÂºÃ‚ÂºÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã†â€™Ã¢â‚¬Â ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¸)
const STAGE_BOUNDS = { minX: -2.4, maxX: 2.4, minZ: WALL_Z, maxZ: 1.7 };
const OPEN_DURATION = 1.15;
const DISCARD_DURATION = 1.25;
const ROLL_LINEAR_RESISTANCE = 2.6;
const ROLL_ANGULAR_RESISTANCE = 4.5;
const ROLL_SETTLE_SPEED = 0.018;
const PHYSICS_STEP = 1 / 60;
const PAPER_MASS = 0.16;

// ÃƒÂ¦Ã…Â½Ã‚Â´ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¦Ã…Â Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬â„¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ¦Ã¢â‚¬Å“Ã‚ÂÃƒÂ¤Ã‚Â½Ã…â€œ
const GRAB_LIFT = 0.5;
const GRAB_STIFFNESS = 14;
const GRAB_MAX_SPEED = 4.5;
const THROW_MAX_SPEED = 3.2;
const CLICK_DRAG_THRESHOLD_PX = 6;

// ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â‚¬Å¡Ã†â€™ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â‚¬Å¡Ã†â€™ÃƒÂ§Ã…Â Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¨Ã‚Â¡Ã‚ÂÃƒÂ§Ã‚ÂªÃ‚ÂÃƒÂ§Ã‚ÂÃ†â€™ÃƒÂ£Ã†â€™Ã‚Â»ÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¿Ã†â€™ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â VAT ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ¥Ã‚Â¾Ã…â€™ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¥Ã‚Â®Ã…Â¸ÃƒÂ¦Ã‚Â¸Ã‚Â¬ÃƒÂ¥Ã¢â€šÂ¬Ã‚Â¤ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â¸ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
let collisionRadius = 0.25;
let restCenterY = FLOOR_VISUAL_Y + 0.25; // ÃƒÂ©Ã‚ÂÃ¢â€žÂ¢ÃƒÂ¦Ã‚Â­Ã‚Â¢ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¿Ã†â€™ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ©Ã‚Â«Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢
let restMeshY = 0.02; // ÃƒÂ©Ã‚ÂÃ¢â€žÂ¢ÃƒÂ¦Ã‚Â­Ã‚Â¢ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â¥ÃƒÂ¥Ã…Â½Ã…Â¸ÃƒÂ§Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ©Ã‚Â«Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢
const crumpleCenter = new THREE.Vector3(0, 0.2, 0);

// ==================================================
// ÃƒÂ§Ã‚Â°Ã‚Â¡ÃƒÂ¦Ã‹Å“Ã¢â‚¬Å“ÃƒÂ§Ã¢â‚¬Â°Ã‚Â©ÃƒÂ§Ã‚ÂÃ¢â‚¬Â  ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ¤Ã‚Â¸Ã‚Â¸ÃƒÂ£Ã‚ÂÃ‚Â¾ÃƒÂ£Ã‚ÂÃ‚Â£ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ§Ã‚ÂÃ†â€™ÃƒÂ¤Ã‚Â½Ã¢â‚¬Å“ÃƒÂ¥Ã¢â‚¬Â°Ã¢â‚¬ÂºÃƒÂ¤Ã‚Â½Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ¦Ã¢â‚¬Â°Ã‚Â±ÃƒÂ£Ã‚ÂÃ¢â‚¬Â 
// ==================================================
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -7.0, 0),
});
physicsWorld.allowSleep = false;
physicsWorld.defaultContactMaterial.friction = 0.8;
physicsWorld.defaultContactMaterial.restitution = 0.15;

const paperMaterial = new CANNON.Material("paper");
const floorPhysicsMaterial = new CANNON.Material("floor");
physicsWorld.addContactMaterial(
  new CANNON.ContactMaterial(paperMaterial, floorPhysicsMaterial, {
    friction: 1.0,
    restitution: 0.12,
  }),
);
// ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ¥Ã‚ÂÃ…â€™ÃƒÂ¥Ã‚Â£Ã‚Â« ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ¨Ã‚Â»Ã‚Â½ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ¥Ã‚Â¼Ã‚Â¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â€šÂ¬
physicsWorld.addContactMaterial(
  new CANNON.ContactMaterial(paperMaterial, paperMaterial, {
    friction: 0.6,
    restitution: 0.3,
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

// ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â¥ÃƒÂ¥Ã…Â½Ã…Â¸ÃƒÂ§Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚ÂºÃ¢â‚¬Â¢ÃƒÂ¤Ã‚Â»Ã‹Å“ÃƒÂ¨Ã‚Â¿Ã¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¡ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ¥Ã¢â‚¬Â°Ã¢â‚¬ÂºÃƒÂ¤Ã‚Â½Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¿Ã†â€™(=ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¿Ã†â€™)ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â§
// crumpleCenter ÃƒÂ£Ã‚ÂÃ‚Â¶ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂªÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â»ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã†â€™Ã‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¨Ã‚Â¡Ã…â€™ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ¦Ã‚ÂÃ‚Â¥ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
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
    linearDamping: 0.15,
    angularDamping: 0.35,
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
  return body.position.y <= restCenterY + 0.05;
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

const BOUNDS_PULL = 3.0;

function applyPhysicsBounds(dt) {
  const bounds = getThrowBounds();
  const minX = bounds.minX + collisionRadius;
  const maxX = bounds.maxX - collisionRadius;
  const minZ = bounds.minZ + collisionRadius;
  const maxZ = bounds.maxZ - collisionRadius;

  for (const paper of papers) {
    if (!paper.body || paper.body.type !== CANNON.Body.DYNAMIC) continue;

    // ÃƒÂ§Ã‚Â¯Ã¢â‚¬Å¾ÃƒÂ¥Ã¢â‚¬ÂºÃ‚Â²ÃƒÂ¥Ã‚Â¤Ã¢â‚¬â€œÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¥Ã‚Â¤Ã¢â‚¬â€œÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ©Ã¢â€šÂ¬Ã…Â¸ÃƒÂ¥Ã‚ÂºÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¥Ã‚ÂÃ‚ÂÃƒÂ¥Ã‚Â°Ã¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¥Ã¢â‚¬Â Ã¢â‚¬Â¦ÃƒÂ¥Ã‚ÂÃ‚Â´ÃƒÂ£Ã‚ÂÃ‚Â¸ÃƒÂ¥Ã‚Â¼Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ¦Ã‹â€ Ã‚Â»ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢
    // (ÃƒÂ¤Ã‚Â½Ã‚ÂÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ§Ã…Â¾Ã‚Â¬ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Å“ÃƒÂ§Ã‚Â§Ã‚Â»ÃƒÂ¥Ã¢â‚¬Â¹Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ¦Ã‚ÂÃ‚Â¨ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â´ÃƒÂ¥Ã‚Â¾Ã…â€™ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ‚Â©ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â®ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ©Ã‚Â£Ã¢â‚¬ÂºÃƒÂ£Ã‚ÂÃ‚Â¶ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â)
    const body = paper.body;
    if (body.position.x < minX) {
      if (body.velocity.x < 0) {
        body.velocity.x = Math.abs(body.velocity.x) * 0.42;
      }
      body.velocity.x += BOUNDS_PULL * dt;
    } else if (body.position.x > maxX) {
      if (body.velocity.x > 0) {
        body.velocity.x = -Math.abs(body.velocity.x) * 0.42;
      }
      body.velocity.x -= BOUNDS_PULL * dt;
    }

    if (body.position.z < minZ) {
      if (body.velocity.z < 0) {
        body.velocity.z = Math.abs(body.velocity.z) * 0.42;
      }
      body.velocity.z += BOUNDS_PULL * dt;
    } else if (body.position.z > maxZ) {
      if (body.velocity.z > 0) {
        body.velocity.z = -Math.abs(body.velocity.z) * 0.42;
      }
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

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

function getThrowBounds() {
  return STAGE_BOUNDS;
}

const _viewDir = new THREE.Vector3();
function computeOpenPose() {
  camera.getWorldDirection(_viewDir);
  const position = camera.position
    .clone()
    .addScaledVector(_viewDir, OPEN_DISTANCE);

  // ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¦Ã‚Â³Ã¢â‚¬Â¢ÃƒÂ§Ã‚Â·Ã…Â¡(+Y)ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã‚ÂÃ‚Â¸ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ§Ã‚Â«Ã‚Â¯(+Z)ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â¹ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¦Ã‚ÂÃ†â€™ÃƒÂ£Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  const yAxis = _viewDir.clone().negate();
  const zAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
  const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis),
  );

  // ÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ©Ã‚Â«Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚Â® 90% ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ (ÃƒÂ¥Ã‚Â¹Ã¢â‚¬Â¦ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã‚ÂÃ‚Â¿ÃƒÂ¥Ã¢â‚¬Â¡Ã‚ÂºÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¥Ã‚Â¹Ã¢â‚¬Â¦ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¥Ã‹â€ Ã‚Â¶ÃƒÂ©Ã¢â€žÂ¢Ã‚Â)
  const viewH =
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * OPEN_DISTANCE;
  const viewW = viewH * camera.aspect;
  const scale = Math.min(
    (viewH * OPEN_SCREEN_RATIO) / flatSize.depth,
    (viewW * OPEN_SCREEN_RATIO) / flatSize.width,
  );

  return { position, quaternion, scale };
}

// ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¾ÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ¥Ã‚Â¤Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â£ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¨Ã‚Â¿Ã‚Â½ÃƒÂ¥Ã‚Â¾Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
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

async function init() {
  info.textContent = "loading VAT data...";

  // VAT ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â« (FBX + EXR) ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¢ÃƒÂ£Ã†â€™Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â§ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã†â€™Ã¢â‚¬Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã‚Â§Ã¢â‚¬Â¹ÃƒÂ§Ã‚Â¯Ã¢â‚¬Â°ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
  // ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã‚ÂÃ¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â« (src/) ÃƒÂ£Ã‚ÂÃ‚Â®1ÃƒÂ£Ã‚ÂÃ‚Â¤ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ©Ã…Â¡Ã…Â½ÃƒÂ¥Ã‚Â±Ã‚Â¤ÃƒÂ¥Ã…Â¸Ã‚ÂºÃƒÂ¦Ã‚ÂºÃ¢â‚¬â€œ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â vite ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ§Ã¢â€žÂ¢Ã‚ÂºÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂµÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ£Ã¢â€šÂ¬Ã‚Â
  // docs/ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â¾ÃƒÂ£Ã‚ÂÃ‚Â¾ÃƒÂ©Ã‚ÂÃ¢â€žÂ¢ÃƒÂ§Ã…Â¡Ã¢â‚¬Å¾ÃƒÂ©Ã¢â‚¬Â¦Ã‚ÂÃƒÂ¤Ã‚Â¿Ã‚Â¡ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¥Ã‚ÂÃ…â€™ÃƒÂ£Ã‚ÂÃ‹Å“ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ¦Ã¢â‚¬Â°Ã¢â€šÂ¬ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â§Ã‚Â£ÃƒÂ¦Ã‚Â±Ã‚ÂºÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â€šÂ¬Ã¢â‚¬Å¡
  // (new URL(ÃƒÂ£Ã†â€™Ã‚ÂªÃƒÂ£Ã†â€™Ã¢â‚¬Â ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã†â€™Ã‚Â«, import.meta.url) ÃƒÂ£Ã‚ÂÃ‚Â¯ vite ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¦Ã¢â‚¬ÂºÃ‚Â¸ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ¦Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ¦Ã¢â‚¬â€œÃ¢â‚¬Â¡ÃƒÂ¥Ã‚Â­Ã¢â‚¬â€ÃƒÂ¥Ã‹â€ Ã¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ§Ã‚ÂµÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â€šÂ¬)
  const moduleDir = import.meta.url.replace(/[^/]*$/, "");
  animData = await loadVATData(moduleDir + "../vat/");

  // ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚Â®Ã…Â¸ÃƒÂ¥Ã‚Â¯Ã‚Â¸ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ©Ã‚ÂÃ‚Â¢ÃƒÂ¦Ã‚Â¯Ã¢â‚¬ÂÃƒÂ§Ã…Â½Ã¢â‚¬Â¡ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â±ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â«ÃƒÂ¨Ã‚Â¨Ã‹â€ ÃƒÂ§Ã‚Â®Ã¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¤Ã‚Â½Ã‚Â¿ÃƒÂ£Ã‚ÂÃ¢â‚¬Â 
  flatSize.width = animData.flat.width;
  flatSize.depth = animData.flat.depth;

  // ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â‚¬Å¡Ã†â€™ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â‚¬Å¡Ã†â€™ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â¥ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚Â®Ã…Â¸ÃƒÂ¦Ã‚Â¸Ã‚Â¬ÃƒÂ¥Ã¢â€šÂ¬Ã‚Â¤ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¨Ã‚Â¡Ã‚ÂÃƒÂ§Ã‚ÂªÃ‚ÂÃƒÂ§Ã‚ÂÃ†â€™ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¿Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¨Ã‚Â¨Ã‚Â­ÃƒÂ¥Ã‚Â®Ã…Â¡
  // ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚ÂºÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ¨Ã‚Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã¢â‚¬ÂºÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã‚ÂºÃ…Â  (FLOOR_VISUAL_Y) ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¦Ã…Â½Ã‚Â¥ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‹â€ ÃƒÂ£Ã‚ÂÃ¢â‚¬Â ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  crumpleCenter.fromArray(animData.crumple.center);
  collisionRadius = animData.crumple.radius * CLOSED_SCALE;
  // ÃƒÂ¥Ã‚ÂÃ…Â ÃƒÂ¥Ã‚Â¾Ã¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â¯90ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â»ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â«ÃƒÂ¥Ã¢â€šÂ¬Ã‚Â¤ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã‚ÂÃ‚Â¿ÃƒÂ¥Ã¢â‚¬Â¡Ã‚ÂºÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ¨Ã‚Â§Ã¢â‚¬â„¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ¨Ã‚Â¾Ã‚Â¼ÃƒÂ£Ã‚ÂÃ‚Â¾ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã‹â€ ÃƒÂ£Ã‚ÂÃ¢â‚¬Â ÃƒÂ¥Ã‚Â°Ã¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ¤Ã‚Â½Ã¢â€žÂ¢ÃƒÂ¨Ã‚Â£Ã¢â‚¬Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã…â€™Ã‚ÂÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  restCenterY = FLOOR_VISUAL_Y + collisionRadius * 1.08;
  restMeshY = restCenterY - crumpleCenter.y * CLOSED_SCALE;
  floorBody.position.y = restCenterY - collisionRadius;
  console.log(
    "[VAT] physics: collisionRadius =", collisionRadius.toFixed(3),
    "restCenterY =", restCenterY.toFixed(3),
  );

  if (debugFrame !== null) {
    // ÃƒÂ¨Ã‚Â¨Ã‹Å“ÃƒÂ¤Ã‚ÂºÃ¢â‚¬Â¹ÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨: ÃƒÂ¦Ã…â€™Ã¢â‚¬Â¡ÃƒÂ¥Ã‚Â®Ã…Â¡ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ©Ã‚ÂÃ¢â€žÂ¢ÃƒÂ¦Ã‚Â­Ã‚Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â§ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã¢â‚¬â„¢Ã‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â¢ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â° (?frame=N)
    for (let i = 0; i < paperSettings.count; i++) {
      const position =
        paperSettings.count === 1
          ? new THREE.Vector3(0, restMeshY, 0.2) // 1ÃƒÂ¦Ã…Â¾Ã…Â¡ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ¥Ã‚Â¤Ã‚Â®ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã‚ÂÃ‚Â
          : initialPaperPosition(i);
      const paper = spawnPaper(position, false);
      setPaperBodyDynamic(paper, false);
      paper.state = "posed"; // ÃƒÂ£Ã‚ÂÃ‚Â©ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã…Â Ã‚Â¶ÃƒÂ¦Ã¢â‚¬Â¦Ã¢â‚¬Â¹ÃƒÂ¥Ã‹â€ Ã¢â‚¬Â ÃƒÂ¥Ã‚Â²Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¥Ã¢â‚¬Â¦Ã‚Â¥ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ = ÃƒÂ§Ã¢â‚¬Â°Ã‚Â©ÃƒÂ§Ã‚ÂÃ¢â‚¬Â ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¢ÃƒÂ£Ã†â€™Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¥Ã¢â‚¬Â¹Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾
      paper.frameIdx = Math.max(0, Math.min(debugFrame, animData.frameCount - 1));
      updatePaperFrame(paper, animData, paper.frameIdx);
    }
  } else {
    // ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ¦Ã‚Â¼Ã¢â‚¬ÂÃƒÂ¥Ã¢â‚¬Â¡Ã‚Âº ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ¥Ã‚Â±Ã¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã¢â€žÂ¢Ã¢â‚¬Å¡ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Å“ÃƒÂ¥Ã‚Â·Ã‚Â®ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã†â€™Ã¢â‚¬ËœÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ©Ã¢â€žÂ¢Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
    for (let i = 0; i < paperSettings.count; i++) {
      const delay = i * 45 + randomRange(0, 90);
      setTimeout(() => {
        spawnPaper(initialPaperPosition(i), true, randomRange(4.2, 8.2));
      }, delay);
    }
  }

  info.textContent = "";
}

function initialPaperPosition(i) {
  if (i < PAPER_OFFSETS.length) {
    return new THREE.Vector3(PAPER_OFFSETS[i][0], restMeshY, PAPER_OFFSETS[i][2]);
  }
  return randomSpawnPosition();
}

function randomSpawnPosition() {
  const bounds = getThrowBounds();
  const margin = collisionRadius * 1.3;
  const pos = new THREE.Vector3(0, restMeshY, 0);
  // ÃƒÂ¦Ã¢â‚¬â€Ã‚Â¢ÃƒÂ¥Ã‚Â­Ã‹Å“ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ©Ã¢â‚¬Â¡Ã‚ÂÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ¤Ã‚Â½Ã‚ÂÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã…Â½Ã‚Â¢ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ (ÃƒÂ¨Ã‚Â¦Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â¤ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã‚ÂÃ‚Â°ÃƒÂ¦Ã…â€œÃ¢â€šÂ¬ÃƒÂ¥Ã‚Â¾Ã…â€™ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÂ¨Ã‚Â£Ã…â€œÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¥Ã‚Â¦Ã‚Â¥ÃƒÂ¥Ã‚ÂÃ¢â‚¬Â)
  for (let attempt = 0; attempt < 40; attempt++) {
    //pos.x = randomRange(bounds.minX + margin, bounds.maxX - margin);
    //pos.z = randomRange(bounds.minZ + margin, bounds.maxZ - margin);
    const clear = papers.every((p) => {
      const dx = p.body.position.x - pos.x;
      const dz = p.body.position.z - pos.z;
      return dx * dx + dz * dz > (collisionRadius * 2.4) ** 2;
    });
    if (clear) break;
  }
  return pos;
}

let spawnCounter = 0;

function spawnPaper(position, dropIn, dropHeight = randomRange(0.8, 1.2)) {
  const maxFrame = animData.frameCount - 1;
  // ÃƒÂ£Ã†â€™Ã¢â‚¬Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¶ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â³ (KIFFMA / HACHIDORI) ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¤Ã‚ÂºÃ‚Â¤ÃƒÂ¤Ã‚ÂºÃ¢â‚¬â„¢ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¥Ã¢â‚¬Â°Ã‚Â²ÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ¥Ã‚Â½Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  const dIdx = spawnCounter++ % PAPER_DESIGNS.length;
    const base = createPaper(animData, dIdx);
    base.designIndex = dIdx;
  base.mesh.castShadow = true;
  base.mesh.rotation.set(
    0,
    Math.PI + randomRange(-0.25, 0.25),
    randomRange(-0.18, 0.18),
  );
  base.mesh.position.copy(position);
  base.mesh.scale.setScalar(CLOSED_SCALE);
  scene.add(base.mesh);
  const body = createPaperBody(base);

  const paper = {
    ...base,
    body,
    frameIdx: maxFrame,
    state: "closed",
    time: 0,
    homePosition: base.mesh.position.clone(),
    homeRotation: base.mesh.rotation.clone(),
    start: null,
    target: null,
    throw: null,
  };
  updatePaperFrame(paper, animData, maxFrame);
  papers.push(paper);

  // ÃƒÂ¨Ã‚Â¨Ã‹Å“ÃƒÂ¤Ã‚ÂºÃ¢â‚¬Â¹ÃƒÂ§Ã¢â‚¬ÂÃ‚Â¨ (?debug=physics): ÃƒÂ¨Ã‚Â¡Ã‚ÂÃƒÂ§Ã‚ÂªÃ‚ÂÃƒÂ§Ã‚ÂÃ†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ£Ã†â€™Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â¢ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¥Ã‚ÂÃ‚Â¯ÃƒÂ¨Ã‚Â¦Ã¢â‚¬â€œÃƒÂ¥Ã…â€™Ã¢â‚¬â€œ
  if (debugPhysics) {
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(collisionRadius, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x00b566, wireframe: true }),
    );
    scene.add(wire);
    paper.debugSphere = wire;
  }

  if (dropIn) {
    // ÃƒÂ¤Ã‚Â¸Ã…Â ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¨Ã‚ÂÃ‚Â½ÃƒÂ£Ã‚ÂÃ‚Â¨ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ§Ã¢â€žÂ¢Ã‚Â»ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬ÂºÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
    paper.state = "rolling";
    paper.throw = { settleTimer: 0 };
    body.position.y += dropHeight;
    body.angularVelocity.set(
      randomRange(-1.5, 1.5),
      randomRange(-0.5, 0.5),
      randomRange(-1.5, 1.5),
    );
    syncMeshToBody(paper);
  }
  return paper;
}

function removeOnePaper() {
  // ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â»ÃƒÂ¦Ã…Â½Ã‚Â´ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â»ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¢ÃƒÂ£Ã†â€™Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¦Ã‚Â¶Ã‹â€ ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾
  let idx = -1;
  for (let i = papers.length - 1; i >= 0; i--) {
    const p = papers[i];
    if (
      p === activePaper ||
      p.state === "grabbed" ||
      p.state === "opening" ||
      p.state === "open" ||
      p.state === "discarding"
    ) {
      continue;
    }
    idx = i;
    break;
  }
  if (idx === -1) {
    for (let i = papers.length - 1; i >= 0; i--) {
      if (papers[i].state === "grabbed") continue;
      idx = i;
      break;
    }
  }
  if (idx === -1) return false;

  const p = papers[idx];
  if (p === activePaper) activePaper = null;
  if (pointerState && pointerState.paper === p) pointerState.paper = null;
  if (p.debugSphere) scene.remove(p.debugSphere);
  scene.remove(p.mesh);
  p.mesh.geometry.dispose();
  physicsWorld.removeBody(p.body);
  papers.splice(idx, 1);
  return true;
}

function syncPaperCount() {
  if (!animData) return;
  const target = Math.round(paperSettings.count);
  while (papers.length > target && removeOnePaper()) {
    // removeOnePaper ÃƒÂ£Ã‚ÂÃ…â€™ false ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¨Ã‚Â¿Ã¢â‚¬ÂÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â¡ÃƒÂ¥Ã‹â€ Ã¢â‚¬Â¡ÃƒÂ£Ã¢â‚¬Å¡Ã…Â 
  }
  while (papers.length < target) {
    spawnPaper(randomSpawnPosition(), true);
  }
}

// ==================================================
// ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ¦Ã¢â‚¬Å“Ã‚ÂÃƒÂ¤Ã‚Â½Ã…â€œ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã†â€™Ã‚ÂªÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¯ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â° / ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â°ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¦Ã…Â½Ã‚Â´ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ¦Ã…Â Ã¢â‚¬Â¢ÃƒÂ£Ã‚ÂÃ¢â‚¬â„¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
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
  const hit = raycaster.intersectObjects(papers.map((p) => p.mesh));
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
  } catch {
    // ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ¦Ã‹â€ Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã¢â€žÂ¢ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã†â€™Ã‹â€ ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ‚Â© pointerId ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¥Ã…Â Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ¥Ã‚Â Ã‚Â´ÃƒÂ¥Ã‚ÂÃ‹â€ ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ§Ã¢â‚¬Å¾Ã‚Â¡ÃƒÂ¨Ã‚Â¦Ã¢â‚¬â€œ
  }

  // ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã‚ÂÃ‚Â£ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ¦Ã…â€œÃ¢â€šÂ¬ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â£ÃƒÂ£Ã†â€™Ã†â€™ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  if (p && p.state === "rolling") beginGrab(p, e);
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
    ? isGrabbable(p) ? "grab" : "pointer"
    : "";
}

function handleClick(e) {
  const p = pickPaper(e);
  if (!p) return;

  const previousActive = activePaper;
  if (previousActive) {
    startDiscard(previousActive);
    activePaper = null;
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
  // ÃƒÂ¦Ã…Â½Ã‚Â´ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Å“ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¤Ã‚Â»Ã¢â‚¬â€œÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã…Â Ã‚Â¼ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã‹â€ ÃƒÂ£Ã‚ÂÃ¢â‚¬Â ÃƒÂ¨Ã‚Â¡Ã‚ÂÃƒÂ§Ã‚ÂªÃ‚ÂÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¦Ã…â€œÃ¢â‚¬Â°ÃƒÂ¥Ã…Â Ã‚Â¹ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â¾ÃƒÂ£Ã‚ÂÃ‚Â¾
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
      Math.max(grabHitPoint.x, bounds.minX + collisionRadius),
      bounds.maxX - collisionRadius,
    ),
    restCenterY + GRAB_LIFT,
    Math.min(
      Math.max(grabHitPoint.z, bounds.minZ + collisionRadius),
      bounds.maxZ - collisionRadius,
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
  // ÃƒÂ©Ã¢â€šÂ¬Ã‚Â²ÃƒÂ¨Ã‚Â¡Ã…â€™ÃƒÂ¦Ã¢â‚¬â€œÃ‚Â¹ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚ÂÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ¥Ã¢â‚¬ÂºÃ…Â¾ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¤Ã‚Â»Ã‹Å“ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  body.angularVelocity.set(
    (vz / collisionRadius) * 0.6,
    0,
    (-vx / collisionRadius) * 0.6,
  );
  body.wakeUp();

  paper.state = "rolling";
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
}

function startDiscard(paper) {
  if (paper.state === "discarding" || paper.state === "rolling") return;

  // ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¾ÃƒÂ£Ã‚ÂÃ…Â¸ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â©ÃƒÂ¦Ã¢â‚¬Â°Ã¢â‚¬Â¹ÃƒÂ¥Ã¢â‚¬Â°Ã‚ÂÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ£Ã‚ÂÃ¢â‚¬Å¡ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ¥Ã‚Â¿Ã¢â‚¬Â¦ÃƒÂ£Ã‚ÂÃ…Â¡ÃƒÂ¥Ã‚Â¥Ã‚Â¥(ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¹ÃƒÂ£Ã†â€™Ã¢â‚¬Â ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¸ÃƒÂ¥Ã‚ÂÃ‚Â´)ÃƒÂ£Ã‚ÂÃ‚Â¸ÃƒÂ¥Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ¦Ã‚ÂÃ‚Â¨ÃƒÂ£Ã‚ÂÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹
  const dir = new THREE.Vector3(
    randomRange(-1, 1),
    0,
    randomRange(-1.3, -0.45),
  );
  dir.normalize();

  paper.state = "discarding";
  paper.time = 0;
  paper.start = captureTransform(paper);
  setPaperBodyDynamic(paper, true);
  syncBodyToMesh(paper);
  paper.body.velocity.set(
    dir.x * randomRange(1.4, 2.0),
    randomRange(0.5, 0.9),
    dir.z * randomRange(1.4, 2.0),
  );
  paper.body.angularVelocity.set(
    randomRange(-2.4, 2.4),
    randomRange(-0.8, 0.8),
    randomRange(-2.4, 2.4),
  );
  paper.throw = {
    settleTimer: 0,
  };
}

// ==================================================
// ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¢ÃƒÂ£Ã†â€™Ã¢â‚¬Â¹ÃƒÂ£Ã†â€™Ã‚Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â·ÃƒÂ£Ã†â€™Ã‚Â§ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ¥Ã¢â‚¬Â Ã‚ÂÃƒÂ§Ã¢â‚¬ÂÃ…Â¸
// ==================================================
const FPS = 24;
const FRAME_DURATION = 1.0 / FPS;
let prevTime = null;

function startAnimation() {
  prevTime = performance.now() / 1000;
  renderer.setAnimationLoop(tick);
}

function tick() {
  const now = performance.now() / 1000;
  const dt = now - prevTime;
  prevTime = now;

  if (!animData) return;

  physicsWorld.step(PHYSICS_STEP, Math.min(dt, 0.05), 3);
  applyPhysicsBounds(dt);

  for (const p of papers) {
    updatePaperMotion(p, dt);
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

  composer.render();
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
      // Trigger track modal
      if (window.openTrackModal && paper.designIndex !== undefined) {
        const design = PAPER_DESIGNS[paper.designIndex % PAPER_DESIGNS.length];
        if (design) window.openTrackModal(design.title);
      }
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
    // ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ¤Ã‚Â½Ã‚ÂÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã‚ÂÃ‚Â¸ÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ£Ã†â€™Ã‚ÂÃƒÂ§Ã…Â Ã‚Â¶ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¨Ã‚Â¿Ã‚Â½ÃƒÂ¥Ã‚Â¾Ã¢â‚¬Å“ÃƒÂ£Ã‚ÂÃ¢â€žÂ¢ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ÃƒÂ©Ã¢â€šÂ¬Ã…Â¸ÃƒÂ¥Ã‚ÂºÃ‚Â¦ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¤Ã‚Â¸Ã…Â½ÃƒÂ£Ã‚ÂÃ‹â€ ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹ (KINEMATIC ÃƒÂ£Ã‚ÂÃ‚ÂªÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â§
    // step() ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ©Ã¢â€šÂ¬Ã…Â¸ÃƒÂ¥Ã‚ÂºÃ‚Â¦ÃƒÂ£Ã‚ÂÃ¢â‚¬Â¹ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ¤Ã‚Â½Ã‚ÂÃƒÂ§Ã‚Â½Ã‚Â®ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ§Ã‚Â©Ã‚ÂÃƒÂ¥Ã‹â€ Ã¢â‚¬Â ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã¢â€šÂ¬Ã‚ÂÃƒÂ¤Ã‚Â»Ã¢â‚¬â€œÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ§Ã‚Â´Ã¢â€žÂ¢ÃƒÂ§Ã…Â½Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¨Ã¢â‚¬Â¡Ã‚ÂªÃƒÂ§Ã¢â‚¬Å¾Ã‚Â¶ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ¦Ã…Â Ã‚Â¼ÃƒÂ£Ã‚ÂÃ¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ¢â‚¬ËœÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â°ÃƒÂ£Ã¢â‚¬Å¡Ã…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Â¹)
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
    const grounded = isOnGround(paper.body);
    // ÃƒÂ¨Ã‚Â»Ã‚Â¢ÃƒÂ£Ã‚ÂÃ…â€™ÃƒÂ£Ã¢â‚¬Å¡Ã…Â ÃƒÂ¦Ã…Â Ã‚ÂµÃƒÂ¦Ã…Â Ã¢â‚¬â€ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¦Ã…Â½Ã‚Â¥ÃƒÂ¥Ã…â€œÃ‚Â°ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã‚ÂÃ‚Â®ÃƒÂ£Ã‚ÂÃ‚Â¿ ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ÃƒÂ§Ã‚Â©Ã‚ÂºÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã‚ÂÃ‚Â§ÃƒÂ£Ã‚ÂÃ‚Â¯ÃƒÂ¨Ã¢â‚¬Â¡Ã‚ÂªÃƒÂ§Ã¢â‚¬Å¾Ã‚Â¶ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ©Ã‚Â£Ã¢â‚¬ÂºÃƒÂ£Ã‚ÂÃ‚Â¶
    if (grounded) applyRollingResistance(paper.body, dt);
    syncMeshToBody(paper);
    const speed =
      paper.body.velocity.lengthSquared() +
      paper.body.angularVelocity.lengthSquared() * 0.02;
    paper.throw.settleTimer = grounded && speed < ROLL_SETTLE_SPEED
      ? paper.throw.settleTimer + dt
      : 0;

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
// ÃƒÂ£Ã†â€™Ã‚ÂªÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂµÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¤ÃƒÂ£Ã¢â‚¬Å¡Ã‚ÂºÃƒÂ¥Ã‚Â¯Ã‚Â¾ÃƒÂ¥Ã‚Â¿Ã…â€œ
// ==================================================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  updateOpenPose();
});

// ÃƒÂ£Ã†â€™Ã‚Â¬ÃƒÂ£Ã†â€™Ã‚Â³ÃƒÂ£Ã†â€™Ã¢â€šÂ¬ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã‚Â«ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬â€ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¥Ã¢â‚¬Â¦Ã‹â€ ÃƒÂ£Ã‚ÂÃ‚Â«ÃƒÂ©Ã¢â‚¬â€œÃ¢â‚¬Â¹ÃƒÂ¥Ã‚Â§Ã¢â‚¬Â¹ÃƒÂ¯Ã‚Â¼Ã‹â€ ÃƒÂ£Ã†â€™Ã¢â‚¬Â¡ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã¢â‚¬Å¡Ã‚Â¿ÃƒÂ£Ã†â€™Ã‚Â­ÃƒÂ£Ã†â€™Ã‚Â¼ÃƒÂ£Ã†â€™Ã¢â‚¬Â°ÃƒÂ¤Ã‚Â¸Ã‚Â­ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬Å¡ÃƒÂ¨Ã†â€™Ã…â€™ÃƒÂ¦Ã¢â€žÂ¢Ã‚Â¯ÃƒÂ£Ã¢â‚¬Å¡Ã¢â‚¬â„¢ÃƒÂ¦Ã‚ÂÃ‚ÂÃƒÂ§Ã¢â‚¬ÂÃ‚Â»ÃƒÂ¯Ã‚Â¼Ã¢â‚¬Â°
startAnimation();

init().catch((err) => {
  console.error(err);
  info.textContent = "ERROR: " + err.message;
});
