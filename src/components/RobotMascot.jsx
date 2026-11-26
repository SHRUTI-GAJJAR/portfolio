import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/*
 * Hero robot — a purpose-built 3D recreation of the reference character.
 *
 * No ready-made rigged model of this specific design exists in the supplied
 * sources (the demo project only ships a different, generic greeting robot),
 * so the character is modeled here from 3D geometry: glossy face screen,
 * happy glowing eyes, hair bun, over-ear headphones, oversized hoodie with
 * the </> emblem, robotic arms/legs and chunky sneakers. The character uses
 * real Three.js geometry and is animated on a GPU-friendly render loop.
 *
 * The component owns exactly one transparent canvas. It adds no pointer
 * elements, so the portfolio's existing SmokeyCursor keeps working.
 */

const VIOLET = 0xa78bfa;
const ELECTRIC_VIOLET = 0x8b5cf6;
const LAVENDER = 0xd8b4fe;
const SILVER = 0xe5e7eb;
const CHARCOAL = 0x111118;
const DEEP_CHARCOAL = 0x0b0b12;
const SECONDARY = 0xa1a1aa;

/*
 * Animation flow, kept inside the single render-loop effect so React
 * re-renders (typewriter, scene-ready flag, scrolling) can never restart the
 * welcome. ENTERING -> GREETING (5s) -> EXPLORING -> IDLE.
 */
const ANIM_STATE = {
  ENTERING: "ENTERING",
  GREETING: "GREETING",
  EXPLORING: "EXPLORING",
  IDLE: "IDLE",
};

/* Supported cinematic entries. The right edge is the chosen direction.
   Change this single value to "left", "top" or "bottom" and the greeting
   position and entry transform follow automatically. */
const ENTRY_DIRECTION = "right"; // "left" | "right" | "top" | "bottom"

// After the welcome the robot travels across the hero: right -> left,
// left -> right, then down and up again. x/y are fractions of the available
// hero space (-1 .. 1), so the route adapts to every breakpoint.
const EXPLORE_POINTS = [
  { x: -0.86, y: 0.05, yaw: -0.2, duration: 4.4 }, // right -> left
  { x: 0.86, y: 0.05, yaw: 0.2, duration: 4.8 }, // left -> right
  { x: 0.62, y: -0.82, yaw: 0.12, duration: 4.6 }, // down
  { x: 0.62, y: 0.82, yaw: -0.12, duration: 4.8 }, // up
  { x: 0.48, y: 0, yaw: 0.05, duration: 4.0 }, // ease back to rest
];

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
const easeInOutCubic = (p) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

function roundedBox(width, height, depth, radius, material) {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, 4, radius),
    material
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function ball(radius, material, sx = 1, sy = 1, sz = 1) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 22, 16), material);
  mesh.scale.set(sx, sy, sz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function capsule(radius, length, material) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, 5, 12),
    material
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function flatPanel(width, height, radius, depth, material) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geometry.center();
  return new THREE.Mesh(geometry, material);
}

function tube(points, radius, material, closed = false) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(...point)),
    closed,
    "catmullrom",
    0.5
  );
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(24, points.length * 8), radius, 8, closed),
    material
  );
}

function arcPoints(x, y, z, width, height, count = 9) {
  return Array.from({ length: count }, (_, index) => {
    const u = index / (count - 1);
    return [x + (u - 0.5) * width, y + Math.sin(u * Math.PI) * height, z];
  });
}

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the robot glow texture.");

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.22, "rgba(216,180,254,0.7)");
  gradient.addColorStop(0.55, "rgba(167,139,250,0.22)");
  gradient.addColorStop(1, "rgba(139,92,246,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundedRectPath(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function makePanelTexture(lines, { mode = "text", width = 512, height = 256 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create a robot hologram.");

  const radius = Math.round(Math.min(width, height) * 0.1);
  roundedRectPath(context, 7, 7, width - 14, height - 14, radius);
  context.fillStyle = "rgba(11, 11, 18, 0.82)";
  context.fill();
  context.strokeStyle = "rgba(216, 180, 254, 0.94)";
  context.lineWidth = 5;
  context.stroke();

  roundedRectPath(context, 20, 20, width - 40, height - 40, Math.max(4, radius - 8));
  context.strokeStyle = "rgba(229, 231, 235, 0.2)";
  context.lineWidth = 2;
  context.stroke();

  // Small corner brackets make the panels read as holograms rather than cards.
  context.strokeStyle = "rgba(167, 139, 250, 0.8)";
  context.lineWidth = 4;
  const corner = Math.round(Math.min(width, height) * 0.13);
  [
    [20, 20, 1, 1],
    [width - 20, 20, -1, 1],
    [20, height - 20, 1, -1],
    [width - 20, height - 20, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    context.beginPath();
    context.moveTo(x + dx * corner, y);
    context.lineTo(x, y);
    context.lineTo(x, y + dy * corner);
    context.stroke();
  });

  if (mode === "code") {
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 ${Math.round(height * 0.44)}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    context.shadowColor = "rgba(139, 92, 246, 0.95)";
    context.shadowBlur = 26;
    context.fillStyle = "#d8b4fe";
    context.fillText("</>", width / 2, height / 2 + 4);
  } else {
    const fontSize = Math.round(height / (lines.length + 1.35));
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.font = `600 ${fontSize}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
    context.shadowColor = "rgba(139, 92, 246, 0.5)";
    context.shadowBlur = 12;
    lines.forEach((line, index) => {
      context.fillStyle = index === 0 ? "#e5e7eb" : "#d8b4fe";
      context.fillText(line, width * 0.14, (height * (index + 1)) / (lines.length + 1));
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSymbolTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the robot emblem.");

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 78px ui-monospace, SFMono-Regular, Consolas, monospace";
  context.shadowColor = "rgba(139, 92, 246, 0.95)";
  context.shadowBlur = 22;
  context.fillStyle = "#d8b4fe";
  context.fillText("</>", 128, 66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMaterials(glowTexture) {
  const physical = (options) => new THREE.MeshPhysicalMaterial(options);
  const standard = (options) => new THREE.MeshStandardMaterial(options);

  return {
    // Glossy black digital face screen.
    visor: physical({
      color: 0x050508,
      metalness: 0.32,
      roughness: 0.07,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
    // Charcoal hair with a soft lavender rim on the stray strands.
    hair: physical({
      color: CHARCOAL,
      metalness: 0.2,
      roughness: 0.34,
      clearcoat: 0.55,
      clearcoatRoughness: 0.24,
    }),
    hairHighlight: physical({
      color: 0x4a3d6b,
      metalness: 0.24,
      roughness: 0.38,
    }),
    shell: physical({
      color: 0x1a1a26,
      metalness: 0.48,
      roughness: 0.3,
      clearcoat: 0.4,
    }),
    hoodie: standard({ color: 0x171722, metalness: 0.06, roughness: 0.88 }),
    hoodieDark: standard({ color: DEEP_CHARCOAL, metalness: 0.1, roughness: 0.82 }),
    // Silver metallic plates on the arms, legs and headphones.
    white: physical({
      color: SILVER,
      metalness: 0.52,
      roughness: 0.3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    }),
    whiteShade: standard({ color: SECONDARY, metalness: 0.32, roughness: 0.42 }),
    metal: standard({ color: 0x362f47, metalness: 0.85, roughness: 0.27 }),
    metalDark: standard({ color: DEEP_CHARCOAL, metalness: 0.66, roughness: 0.36 }),
    rubber: standard({ color: CHARCOAL, metalness: 0.04, roughness: 0.92 }),
    violet: standard({
      color: VIOLET,
      emissive: ELECTRIC_VIOLET,
      emissiveIntensity: 1.5,
      metalness: 0.36,
      roughness: 0.3,
    }),
    violetBasic: new THREE.MeshBasicMaterial({
      color: LAVENDER,
      toneMapped: false,
      transparent: true,
      opacity: 0.9,
    }),
    eye: new THREE.MeshBasicMaterial({ color: VIOLET, toneMapped: false }),
    mouth: new THREE.MeshBasicMaterial({ color: ELECTRIC_VIOLET, toneMapped: false }),
    bubble: physical({
      color: LAVENDER,
      metalness: 0.08,
      roughness: 0.06,
      clearcoat: 1,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
    glow: new THREE.SpriteMaterial({
      map: glowTexture,
      color: VIOLET,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    ring: new THREE.MeshBasicMaterial({
      color: LAVENDER,
      toneMapped: false,
      transparent: true,
      opacity: 0.95,
    }),
    orbit: new THREE.MeshBasicMaterial({
      color: ELECTRIC_VIOLET,
      toneMapped: false,
      transparent: true,
      opacity: 0.35,
    }),
  };
}

function buildArm(materials, side) {
  const shoulder = new THREE.Group();
  shoulder.position.set(side * 0.5, 0.56, 0.02);

  shoulder.add(ball(0.14, materials.white, 1, 0.9, 1.05));

  const upper = capsule(0.105, 0.3, materials.white);
  upper.position.y = -0.2;
  shoulder.add(upper);

  const upperPlate = roundedBox(0.17, 0.26, 0.09, 0.04, materials.metal);
  upperPlate.position.set(side * 0.055, -0.2, 0.09);
  shoulder.add(upperPlate);

  const elbow = new THREE.Group();
  elbow.position.y = -0.38;
  shoulder.add(elbow);
  elbow.add(ball(0.11, materials.metalDark));

  const forearm = capsule(0.094, 0.27, materials.white);
  forearm.position.y = -0.19;
  elbow.add(forearm);

  const forearmPlate = roundedBox(0.15, 0.23, 0.085, 0.035, materials.metal);
  forearmPlate.position.set(side * 0.05, -0.19, 0.085);
  elbow.add(forearmPlate);

  const wrist = new THREE.Group();
  wrist.position.y = -0.36;
  elbow.add(wrist);
  wrist.add(ball(0.078, materials.metalDark));

  const wristBand = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.011, 8, 22), materials.violet);
  wristBand.rotation.x = Math.PI / 2;
  wristBand.position.y = -0.035;
  wrist.add(wristBand);

  const palm = roundedBox(0.19, 0.16, 0.1, 0.045, materials.white);
  palm.position.y = -0.11;
  wrist.add(palm);

  for (let finger = 0; finger < 4; finger += 1) {
    const digit = capsule(0.021, 0.075, materials.white);
    digit.position.set(-0.066 + finger * 0.044, -0.235, 0.005);
    digit.rotation.x = 0.12;
    wrist.add(digit);
  }

  const thumb = capsule(0.026, 0.06, materials.white);
  thumb.position.set(side * -0.1, -0.13, 0.012);
  thumb.rotation.z = side * 0.95;
  wrist.add(thumb);

  return { shoulder, elbow, wrist };
}

function buildLeg(materials, side) {
  const hip = new THREE.Group();
  hip.position.set(side * 0.28, -0.36, 0.02);
  hip.add(ball(0.15, materials.metalDark));

  const thigh = capsule(0.135, 0.3, materials.metalDark);
  thigh.position.y = -0.2;
  hip.add(thigh);

  const thighPlate = roundedBox(0.19, 0.24, 0.1, 0.05, materials.white);
  thighPlate.position.set(0, -0.2, 0.1);
  hip.add(thighPlate);

  const knee = new THREE.Group();
  knee.position.y = -0.4;
  hip.add(knee);
  knee.add(ball(0.13, materials.metal));

  const kneePad = roundedBox(0.27, 0.24, 0.14, 0.07, materials.metalDark);
  kneePad.position.z = 0.13;
  knee.add(kneePad);

  const kneeRing = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.01, 8, 24), materials.orbit);
  kneeRing.position.z = 0.205;
  knee.add(kneeRing);

  const shin = capsule(0.114, 0.28, materials.metalDark);
  shin.position.y = -0.18;
  knee.add(shin);

  const shinPlate = roundedBox(0.17, 0.22, 0.09, 0.045, materials.white);
  shinPlate.position.set(0, -0.18, 0.095);
  knee.add(shinPlate);

  const ankle = new THREE.Group();
  ankle.position.y = -0.36;
  knee.add(ankle);
  ankle.add(ball(0.092, materials.metal));

  const shoe = new THREE.Group();
  shoe.position.set(0, -0.03, 0.03);
  ankle.add(shoe);

  const sole = roundedBox(0.34, 0.1, 0.52, 0.045, materials.rubber);
  sole.position.set(0, 0, 0.08);
  shoe.add(sole);

  const outsole = roundedBox(0.36, 0.06, 0.56, 0.022, materials.rubber);
  outsole.position.set(0, -0.055, 0.08);
  shoe.add(outsole);

  const soleTrim = roundedBox(0.345, 0.018, 0.52, 0.008, materials.violet);
  soleTrim.position.set(0, 0.05, 0.08);
  shoe.add(soleTrim);

  const upper = roundedBox(0.33, 0.23, 0.46, 0.11, materials.white);
  upper.position.set(0, 0.15, 0.02);
  shoe.add(upper);

  const toe = ball(0.16, materials.white, 1, 0.62, 0.88);
  toe.position.set(0, 0.14, 0.26);
  shoe.add(toe);

  const sidePanel = roundedBox(0.31, 0.095, 0.22, 0.04, materials.metalDark);
  sidePanel.position.set(0, 0.22, -0.02);
  shoe.add(sidePanel);

  const toeBumper = roundedBox(0.27, 0.07, 0.12, 0.03, materials.metalDark);
  toeBumper.position.set(0, 0.08, 0.29);
  shoe.add(toeBumper);

  const stripe = roundedBox(0.02, 0.12, 0.26, 0.008, materials.violet);
  stripe.position.set(side * 0.155, 0.14, 0.04);
  shoe.add(stripe);

  const badge = roundedBox(0.014, 0.05, 0.05, 0.005, materials.violet);
  badge.position.set(side * 0.16, 0.21, -0.03);
  shoe.add(badge);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 20), materials.rubber);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.2, -0.08);
  shoe.add(collar);

  return { hip, knee, ankle, shoe };
}

function buildRobot(scene, materials, glowTexture, panelTextures) {
  const robot = new THREE.Group();

  // Oversized, compact hoodie body.
  const torso = roundedBox(0.96, 0.86, 0.64, 0.3, materials.hoodie);
  torso.position.set(0, 0.24, 0);
  robot.add(torso);

  const hem = roundedBox(0.98, 0.26, 0.66, 0.13, materials.hoodieDark);
  hem.position.set(0, -0.24, 0);
  robot.add(hem);

  const pocket = roundedBox(0.54, 0.19, 0.05, 0.04, materials.hoodieDark);
  pocket.position.set(0, 0.04, 0.33);
  robot.add(pocket);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.09, 12, 32), materials.hoodieDark);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.7, 0.02);
  robot.add(collar);

  const hoodBack = ball(0.5, materials.hoodieDark, 1.18, 0.78, 0.9);
  hoodBack.position.set(0, 0.74, -0.2);
  robot.add(hoodBack);

  [-0.13, 0.13].forEach((x) => {
    robot.add(tube([[x, 0.68, 0.32], [x + 0.012, 0.5, 0.35], [x, 0.34, 0.34]], 0.012, materials.whiteShade));
    const tip = ball(0.023, materials.violet);
    tip.position.set(x, 0.33, 0.34);
    robot.add(tip);
  });

  // Developer emblem on the chest.
  const emblem = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.18),
    new THREE.MeshBasicMaterial({
      map: panelTextures.chest,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    })
  );
  emblem.position.set(0, 0.23, 0.33);
  robot.add(emblem);

  // Robotic shoulder shells.
  [-1, 1].forEach((side) => {
    const pauldron = ball(0.25, materials.white, 1, 0.88, 1.06);
    pauldron.position.set(side * 0.5, 0.56, 0);
    robot.add(pauldron);

    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.016, 8, 24), materials.violet);
    trim.rotation.y = Math.PI / 2;
    trim.position.set(side * 0.54, 0.56, 0);
    robot.add(trim);
  });

  // Neck.
  const neck = capsule(0.115, 0.12, materials.metalDark);
  neck.position.set(0, 0.8, -0.02);
  robot.add(neck);

  // ---- Head (oversized, chibi proportions) ----
  const head = new THREE.Group();
  head.position.set(0, 1.22, 0.02);
  head.rotation.z = -0.04;
  robot.add(head);

  const skull = roundedBox(1.26, 1.16, 0.86, 0.33, materials.shell);
  head.add(skull);

  const visor = flatPanel(1.04, 0.84, 0.28, 0.05, materials.visor);
  visor.position.set(0, -0.02, 0.43);
  head.add(visor);

  const eyes = [];
  [-1, 1].forEach((side) => {
    const eye = tube(
      arcPoints(side * 0.27, 0.075, 0.475, 0.31, 0.095),
      0.035,
      materials.eye
    );
    head.add(eye);
    eyes.push(eye);

    // A bright sparkle keeps the eyes lively and extra cute.
    const spark = ball(0.022, materials.mouth, 1, 1, 0.6);
    spark.position.set(side * 0.24, 0.16, 0.49);
    head.add(spark);
    eyes.push(spark);

    const glow = new THREE.Sprite(materials.glow.clone());
    glow.material.opacity = 0.48;
    glow.scale.set(0.5, 0.32, 1);
    glow.position.set(side * 0.27, 0.07, 0.49);
    head.add(glow);
  });

  // Small, gentle smile.
  head.add(tube(arcPoints(0, -0.22, 0.475, 0.16, -0.035), 0.017, materials.mouth));

  // Fluffy hair: rounded back, swept bangs, big messy bun, loose wisps.
  const hairBack = ball(0.63, materials.hair, 1.16, 1.06, 0.92);
  hairBack.position.set(0, 0.12, -0.22);
  head.add(hairBack);

  const fringe = ball(0.6, materials.hair, 1.16, 0.6, 0.94);
  fringe.position.set(0, 0.49, -0.03);
  head.add(fringe);

  head.add(tube([
    [-0.42, 0.5, 0.16],
    [-0.2, 0.42, 0.29],
    [0.12, 0.4, 0.3],
    [0.36, 0.47, 0.18],
  ], 0.055, materials.hair));

  [-1, 1].forEach((side) => {
    head.add(tube([
      [side * 0.5, 0.5, 0.18],
      [side * 0.62, 0.16, 0.26],
      [side * 0.58, -0.22, 0.2],
      [side * 0.5, -0.42, 0.1],
    ], 0.05, materials.hair));
    head.add(tube([
      [side * 0.56, 0.3, 0.1],
      [side * 0.68, 0.02, 0.12],
      [side * 0.6, -0.3, 0.06],
    ], 0.028, materials.hairHighlight));
  });

  const bun = ball(0.36, materials.hair, 1, 0.95, 1);
  bun.position.set(0.04, 0.98, -0.18);
  head.add(bun);

  const bunWrap = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.07, 10, 28), materials.hair);
  bunWrap.position.copy(bun.position);
  bunWrap.rotation.x = 0.5;
  head.add(bunWrap);

  [
    [[-0.16, 1.06, -0.24], [-0.34, 1.12, -0.12], [-0.3, 1.0, 0.02], [-0.14, 0.96, 0.06]],
    [[0.18, 1.08, -0.2], [0.36, 1.12, -0.06], [0.3, 0.98, 0.08], [0.14, 0.96, 0.1]],
    [[0.0, 1.22, -0.2], [0.14, 1.26, -0.08], [0.1, 1.16, 0.04]],
    [[-0.26, 0.86, -0.3], [-0.42, 0.92, -0.18], [-0.36, 0.82, -0.06]],
  ].forEach((points, index) => {
    head.add(tube(points, index === 2 ? 0.016 : 0.02, index % 2 ? materials.hairHighlight : materials.hair));
  });

  // Large over-ear headphones with glowing rings.
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.055, 10, 48, Math.PI),
    materials.whiteShade
  );
  headband.position.set(0, 0.04, 0);
  head.add(headband);

  [-1, 1].forEach((side) => {
    const cup = new THREE.Group();
    cup.position.set(side * 0.78, -0.02, 0.02);
    head.add(cup);

    const cushion = roundedBox(0.18, 0.56, 0.54, 0.18, materials.shell);
    cushion.position.x = side * 0.03;
    cup.add(cushion);

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.03, 32), materials.white);
    plate.rotation.z = Math.PI / 2;
    plate.position.x = side * 0.14;
    cup.add(plate);

    const lightRing = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.022, 8, 32), materials.violet);
    lightRing.rotation.y = Math.PI / 2;
    lightRing.position.x = side * 0.16;
    cup.add(lightRing);

    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 24), materials.violetBasic);
    center.rotation.z = Math.PI / 2;
    center.position.x = side * 0.17;
    cup.add(center);

    const bracket = roundedBox(0.07, 0.22, 0.12, 0.03, materials.metal);
    bracket.position.set(0, 0.28, 0);
    cup.add(bracket);
  });

  const leftArm = buildArm(materials, -1);
  const rightArm = buildArm(materials, 1);
  robot.add(leftArm.shoulder, rightArm.shoulder);

  const leftLeg = buildLeg(materials, -1);
  const rightLeg = buildLeg(materials, 1);
  robot.add(leftLeg.hip, rightLeg.hip);

  // Compact seated pose: knees folded up and out, feet tucked beneath.
  leftLeg.hip.rotation.set(-0.7, -0.12, -0.34);
  rightLeg.hip.rotation.set(-0.68, 0.12, 0.34);
  leftLeg.knee.rotation.x = 0.45;
  rightLeg.knee.rotation.x = 0.46;

  scene.add(robot);

  return { robot, head, eyes, leftArm, rightArm, leftLeg, rightLeg };
}

function buildPlatform(scene, materials) {
  const group = new THREE.Group();
  group.position.y = -1.18;

  const disk = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.12, 64), materials.metalDark);
  disk.position.y = -0.06;
  group.add(disk);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.045, 10, 64), materials.metal);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.02;
  group.add(rim);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.02, 64), materials.metal);
  top.position.y = 0.005;
  group.add(top);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.018, 8, 96), materials.ring);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 0.02;
  group.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.011, 8, 96), materials.violetBasic);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = 0.03;
  group.add(ring2);

  const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.008, 8, 96), materials.orbit);
  ring3.rotation.x = Math.PI / 2;
  ring3.position.y = 0.035;
  group.add(ring3);

  const segments = new THREE.Group();
  const segmentGeometry = new THREE.BoxGeometry(0.045, 0.014, 0.1);
  for (let index = 0; index < 28; index += 1) {
    const angle = (index / 28) * Math.PI * 2;
    const segment = new THREE.Mesh(segmentGeometry, index % 2 ? materials.ring : materials.violetBasic);
    segment.position.set(Math.cos(angle) * 0.9, 0.028, Math.sin(angle) * 0.9);
    segment.rotation.y = -angle;
    segments.add(segment);
  }
  group.add(segments);

  const underGlow = new THREE.Sprite(materials.glow.clone());
  underGlow.material.opacity = 0.5;
  underGlow.scale.set(2.9, 1.1, 1);
  underGlow.position.y = -0.16;
  group.add(underGlow);

  scene.add(group);
  return { group, ring1, ring2, ring3, segments };
}

function buildHolograms(scene, materials, glowTexture, panelTextures) {
  const panels = [];

  const addPanel = (texture, width, height, position, rotation) => {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.86,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      })
    );
    panel.position.set(...position);
    panel.rotation.set(...rotation);
    panel.userData.baseY = panel.position.y;
    panel.userData.baseRotZ = panel.rotation.z;
    scene.add(panel);
    panels.push(panel);
    return panel;
  };

  addPanel(panelTextures.code, 0.62, 0.31, [-1.3, 0.82, -0.1], [0.04, 0.22, -0.07]);
  addPanel(panelTextures.words, 0.76, 0.58, [1.32, 0.2, -0.12], [0.02, -0.22, 0.05]);

  // Small floating laptop-style code panel near the lower right.
  const laptop = new THREE.Group();
  laptop.position.set(1.12, -0.62, 0.34);
  laptop.rotation.set(0.04, -0.42, 0.04);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.4),
    new THREE.MeshBasicMaterial({
      map: panelTextures.code,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    })
  );
  screen.position.set(0, 0.21, 0);
  screen.rotation.x = -0.24;
  laptop.add(screen);

  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(0.64, 0.32),
    new THREE.MeshBasicMaterial({
      color: 0x111118,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  base.rotation.x = -Math.PI / 2 + 0.24;
  base.position.set(0, 0.015, 0.19);
  laptop.add(base);

  const halo = new THREE.Sprite(materials.glow.clone());
  halo.material.opacity = 0.22;
  halo.scale.set(0.9, 0.6, 1);
  halo.position.set(0, 0.18, -0.03);
  laptop.add(halo);

  laptop.userData.baseY = laptop.position.y;
  laptop.userData.baseRotZ = laptop.rotation.z;
  scene.add(laptop);
  panels.push(laptop);

  // Transparent floating bubbles.
  const bubbles = [];
  [
    [-1.35, -0.62, 0.2, 0.09],
    [1.5, -0.85, 0.12, 0.07],
    [-0.95, 1.45, -0.2, 0.055],
    [0.95, -1.05, 0.3, 0.05],
    [1.35, 0.85, -0.3, 0.06],
  ].forEach(([x, y, z, size], index) => {
    const bubble = ball(size, materials.bubble);
    bubble.position.set(x, y, z);
    bubble.userData.baseY = y;
    bubble.userData.phase = index * 1.3;
    scene.add(bubble);
    bubbles.push(bubble);
  });

  // Glowing orbital arcs around the platform.
  const orbits = [];
  [
    { radiusX: 1.5, radiusZ: 1.0, y: -0.96, tilt: 0.1 },
    { radiusX: 1.3, radiusZ: 1.1, y: -1.08, tilt: -0.12 },
  ].forEach((config, index) => {
    const points = Array.from({ length: 64 }, (_, pointIndex) => {
      const angle = (pointIndex / 64) * Math.PI * 2;
      return [
        Math.cos(angle) * config.radiusX,
        config.y + Math.sin(angle) * 0.12,
        Math.sin(angle) * config.radiusZ - 0.1,
      ];
    });
    const orbit = tube(points, 0.004, materials.orbit, true);
    orbit.rotation.z = config.tilt;
    orbit.userData.speed = index === 0 ? 0.05 : -0.035;
    scene.add(orbit);
    orbits.push(orbit);
  });

  return { panels, bubbles, orbits, glowTexture };
}

function buildParticles(scene, glowTexture) {
  const count = 46;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = index * 2.39996;
    const radius = 0.95 + (index % 8) * 0.11;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = ((index * 17) % 31) / 10 - 1.35;
    positions[index * 3 + 2] = -0.55 + ((index * 7) % 13) * 0.07;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      map: glowTexture,
      color: 0xd8b4fe,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  );
  scene.add(points);
  return points;
}

function disposeScene(scene) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();

  scene.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) {
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
      });
    }
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export default function RobotMascot({ onReady, onFailure }) {
  const canvasRef = useRef(null);
  const callbacksRef = useRef({ onReady, onFailure });

  useEffect(() => {
    callbacksRef.current = { onReady, onFailure };
  }, [onReady, onFailure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    const heroEl = host.closest(".hero");
    const copyEl = heroEl?.querySelector(".heroCopy");

    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let intersectionObserver;
    let visible = true;
    let disposed = false;
    let previousTime = 0;
    let elapsed = 0;
    let ready = false;
    let frameVerified = false;
    let failureReported = false;
    let layoutValid = false;
    let layoutChecks = 0;
    let fontsReady = !document.fonts;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.45, 7.2);
    camera.lookAt(0, 0.45, 0);

    const animation = {};

    // Layout is measured from the real hero/copy boxes, so the greeting spot
    // always clears the centred introduction at the current viewport size.
    const layout = {
      scale: 0.55,
      greetX: 2.2,
      minX: -2.4,
      maxX: 2.4,
      rangeX: 2.4,
      rangeY: 1,
      maxY: 1,
      entryX: 3.6,
      entryY: 0,
      dir: 1,
      stacked: false,
    };

    // Owned by this effect only: no effect dependency can reset it.
    const flow = {
      state: ANIM_STATE.ENTERING,
      time: 0,
      point: 0,
      idleFromX: 0,
      idleFromY: 0,
      idleFromYaw: -0.12,
    };

    const renderFrame = (time) => {
      animationFrame = 0;
      if (disposed || !renderer || !ready || !layoutValid) return;

      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      if (!reducedMotion.matches) elapsed += delta;

      const still = reducedMotion.matches;
      const t = elapsed;
      const { robot, head, eyes, leftArm, rightArm, leftLeg, rightLeg } = animation.character;
      const stage = animation.stage;

      if (!still) flow.time += delta;

      // ---------------------------------------------------------------
      // Animation flow. Every value is derived from `flow` (owned by this
      // effect), never from React state, so the welcome runs exactly once.
      // ---------------------------------------------------------------
      let waveAmount = 0;
      let present = still ? 1 : 0;
      let posX = layout.greetX;
      let posY = 0;
      let tilt = 0;
      let bodyYaw = -0.12;
      let scalePulse = 1;

      if (still) {
        // Reduced motion: skip the show entirely and rest beside the copy.
        flow.state = ANIM_STATE.IDLE;
        posX = layout.greetX;
        posY = 0;
        bodyYaw = -0.12;
        present = 1;
      } else if (flow.state === ANIM_STATE.ENTERING) {
        // Cinematic entrance from the right edge of the hero, with a soft
        // arc, a gentle grow and a settling bounce as it reaches its spot.
        const p = clamp01(flow.time / 1.7);
        const eased = easeOutCubic(p);
        posX = THREE.MathUtils.lerp(layout.entryX, layout.greetX, eased);
        posY =
          THREE.MathUtils.lerp(layout.entryY, 0, eased) -
          Math.sin(p * Math.PI) * 0.2;
        tilt = Math.sin(p * Math.PI) * 0.065;
        bodyYaw = THREE.MathUtils.lerp(0.3, -0.12, eased);
        scalePulse = THREE.MathUtils.lerp(0.84, 1, eased);
        if (p >= 1) {
          flow.state = ANIM_STATE.GREETING;
          flow.time = 0;
        }
      } else if (flow.state === ANIM_STATE.GREETING) {
        // Exactly five seconds of waving. The amplitude ramps in and out
        // inside that window so the hand starts and stops naturally.
        const g = flow.time;
        waveAmount =
          THREE.MathUtils.smoothstep(g, 0, 0.45) *
          (1 - THREE.MathUtils.smoothstep(g, 4.45, 5));
        posY =
          Math.sin(clamp01(g / 0.75) * Math.PI * 2) *
          Math.exp(-g * 3.2) *
          0.07 +
          Math.sin(g * 1.3) * 0.02;
        tilt = Math.sin(clamp01(g / 0.75) * Math.PI * 2) * Math.exp(-g * 3.2) * 0.012;
        bodyYaw = 0; // faces the visitor while welcoming them
        if (g >= 5) {
          flow.state = ANIM_STATE.EXPLORING;
          flow.time = 0;
          flow.point = 0;
        }
      } else if (flow.state === ANIM_STATE.EXPLORING) {
        const points = EXPLORE_POINTS;
        const target = points[flow.point % points.length];
        // The first leg starts where the wave ended, so there is no jump.
        const previous =
          flow.point === 0
            ? { x: layout.greetX / layout.rangeX, y: 0, yaw: -0.12 }
            : points[(flow.point - 1) % points.length];
        const p = clamp01(flow.time / target.duration);
        const eased = easeInOutCubic(p);
        posX = THREE.MathUtils.lerp(
          previous.x * layout.rangeX,
          target.x * layout.rangeX,
          eased
        );
        posY =
          THREE.MathUtils.lerp(
            previous.y * layout.rangeY,
            target.y * layout.rangeY,
            eased
          ) + Math.sin(t * 1.1) * 0.025;
        bodyYaw = THREE.MathUtils.lerp(previous.yaw, target.yaw, eased) - 0.12;
        tilt = Math.sin(t * 0.42) * 0.022;
        scalePulse = 1 + Math.sin(t * 0.9) * 0.008;
        present = 1;
        if (p >= 1) {
          flow.point += 1;
          flow.time = 0;
          if (flow.point >= points.length) {
            flow.state = ANIM_STATE.IDLE;
            flow.time = 0;
            flow.idleFromX = posX;
            flow.idleFromY = posY;
            flow.idleFromYaw = bodyYaw;
          }
        }
      } else {
        // IDLE: settle back into a gentle floating rest.
        const p = clamp01(flow.time / 1.6);
        const eased = easeInOutCubic(p);
        posX = THREE.MathUtils.lerp(flow.idleFromX, layout.greetX, eased);
        posY = THREE.MathUtils.lerp(flow.idleFromY, 0, eased) + Math.sin(t * 1.05) * 0.035;
        bodyYaw = THREE.MathUtils.lerp(flow.idleFromYaw, -0.12, eased);
        tilt = Math.sin(t * 0.36) * 0.014;
        present = 1;
      }

      // Keep the whole robot inside the hero on every frame. During the
      // entrance it is intentionally just outside, so skip the clamp there.
      if (flow.state !== ANIM_STATE.ENTERING) {
        posX = Math.max(layout.minX, Math.min(layout.maxX, posX));
        posY = Math.max(-layout.maxY, Math.min(layout.maxY, posY));
      }

      stage.position.set(posX, posY, 0);
      stage.rotation.set(0, bodyYaw * 0.35, tilt);
      stage.scale.setScalar(layout.scale * scalePulse);

      // Whole character + platform float together (local, subtle motion).
      animation.float.position.y = still ? 0 : Math.sin(t * 1.15) * 0.045;
      animation.float.rotation.z = still ? 0 : Math.sin(t * 0.47) * 0.01;
      robot.rotation.y = -0.12 + (still ? 0 : Math.sin(t * 0.4) * 0.03);

      // Natural head turns and tilts, with a small tilt during the wave.
      head.rotation.y = still ? 0 : Math.sin(t * 0.55) * 0.12;
      head.rotation.x = still ? 0 : Math.sin(t * 0.42) * 0.035;
      head.rotation.z = -0.04 + (still ? 0 : Math.sin(t * 0.34) * 0.018) + waveAmount * 0.03;

      // One hand raised in welcome; the arm relaxes once the wave is over.
      const waveTick = Math.sin(flow.time * 10.5);
      leftArm.shoulder.rotation.z =
        -1.14 - waveAmount * (0.72 + waveTick * 0.07) - present * 0.035;
      leftArm.shoulder.rotation.x =
        (still ? 0 : Math.sin(t * 0.6) * 0.025) + waveAmount * 0.05;
      leftArm.elbow.rotation.z = -0.12 - waveAmount * (0.52 + waveTick * 0.06);
      leftArm.elbow.rotation.x = -0.28 + (still ? 0 : Math.sin(t * 0.7) * 0.02);
      leftArm.wrist.rotation.z = waveAmount * waveTick * 0.28;
      leftArm.wrist.rotation.x = -0.15 + present * 0.05;

      rightArm.shoulder.rotation.z = 0.44 + (still ? 0 : Math.sin(t * 0.53) * 0.025);
      rightArm.elbow.rotation.z = 0.62;
      rightArm.elbow.rotation.x = -0.18;

      leftLeg.hip.rotation.x = -0.7 + (still ? 0 : Math.sin(t * 0.5) * 0.012);
      rightLeg.hip.rotation.x = -0.68 + (still ? 0 : Math.sin(t * 0.5 + 1) * 0.012);
      leftLeg.knee.rotation.x = 0.45 + (still ? 0 : Math.sin(t * 0.5) * 0.01);
      rightLeg.knee.rotation.x = 0.46 + (still ? 0 : Math.sin(t * 0.5 + 1) * 0.01);

      // Two soft blinks per cycle.
      let blink = 0;
      if (!still) {
        const phase = t % 5.2;
        if (phase < 0.18) blink = Math.sin((Math.PI * phase) / 0.18);
        else if (phase > 2.7 && phase < 2.9) {
          blink = 0.7 * Math.sin((Math.PI * (phase - 2.7)) / 0.2);
        }
      }
      eyes.forEach((eye) => {
        eye.scale.y = Math.max(0.08, 1 - blink * 0.92);
      });

      try {
        renderer.render(scene, camera);
      } catch (error) {
        if (!failureReported) {
          failureReported = true;
          console.warn("The hero robot could not render its first frame.", error);
          callbacksRef.current.onFailure?.();
        }
        return;
      }

      /* The canvas fades in only after a complete frame has actually been
         submitted: real draw calls, a valid projection, the assembled model
         and a live WebGL context. A canvas that merely exists (or has a
         non-zero size) never satisfies this check. */
      if (!frameVerified) {
        const gl = renderer.getContext();
        const frameOk =
          renderer.info.render.frame > 0 &&
          renderer.info.render.calls > 0 &&
          renderer.info.render.triangles > 0 &&
          Number.isFinite(camera.projectionMatrix.elements[0]) &&
          camera.aspect > 0 &&
          animation.stage.children.length > 0 &&
          !gl.isContextLost();
        if (frameOk) {
          frameVerified = true;
          callbacksRef.current.onReady?.();
        } else if (!failureReported) {
          failureReported = true;
          console.warn("The hero robot's first frame could not be verified.");
          callbacksRef.current.onFailure?.();
        }
      }

      if (visible && !document.hidden && !still) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const requestFrame = () => {
      if (animationFrame || disposed || !renderer || !ready || !visible || document.hidden) return;
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    /* ROOT CAUSE OF THE REFRESH FLASH
       On a hard refresh the hero stylesheet can arrive after React mounts.
       Until then the canvas host is only the browser's default 300x150, which
       is big enough to pass a simple size check but produces aspect ~2 and a
       wrongly scaled, centred robot. So we require the host to match the
       hero's real width before measuring anything. Until then no frame is
       rendered and onReady is not fired, so the canvas stays invisible. */
    const waitForLayout = () => {
      if (layoutValid || disposed || layoutChecks >= 180) return;
      layoutChecks += 1;
      window.requestAnimationFrame(() => {
        if (!disposed && !layoutValid) resize();
      });
    };

    const resize = () => {
      if (!renderer) return;
      if (!fontsReady) return;
      const hostRect = host.getBoundingClientRect();
      const heroRect = heroEl?.getBoundingClientRect();
      const copyRect = copyEl?.getBoundingClientRect();
      const cssApplied =
        heroRect &&
        hostRect.width >= 240 &&
        hostRect.height >= 240 &&
        Math.abs(hostRect.width - heroRect.width) < 4 &&
        copyRect &&
        copyRect.width >= 100;

      if (!cssApplied) {
        waitForLayout();
        return;
      }

      const width = hostRect.width;
      const height = hostRect.height;
      const aspect = width / height;
      camera.aspect = aspect;
      camera.position.z = aspect < 0.86 ? 8.2 : aspect < 1 ? 7.7 : 7.2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.2 : 1.5));
      renderer.setSize(width, height, false);

      /* The robot travels across the whole hero after the wave, but its
         greeting spot must sit clear of the centred introduction on load.
         On small screens the scene is its own block under the copy. */
      const stacked = hostRect.top >= copyRect.bottom - 4;

      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const halfW = halfH * aspect;
      const pxPerWorld = width / (2 * halfW);
      const BASE_W = 2.2; // approximate width of the robot
      const BASE_H = 3.3; // approximate height of the robot (no platform)

      // Size the robot to the free space beside the text so the initial
      // greeting never covers the introduction.
      const copyW = stacked ? 0 : (copyRect?.width ?? width * 0.6);
      const robotPx = stacked
        ? Math.min(width * 0.46, 210)
        : Math.max(84, Math.min((width - copyW) / 2 - 26, 210));

      const scale = THREE.MathUtils.clamp((robotPx / pxPerWorld) / BASE_W, 0.26, 1.15);
      const robotHalfW = (BASE_W * scale) / 2;
      const robotHalfH = (BASE_H * scale) / 2;
      const rangeX = Math.max(0.2, halfW - robotHalfW - 0.1);
      const rangeY = Math.max(0.2, halfH - robotHalfH - 0.1);
      const dir = ENTRY_DIRECTION === "left" ? -1 : 1;
      const greetPx = stacked
        ? rangeX * pxPerWorld * 0.82
        : Math.min(rangeX * pxPerWorld, copyW / 2 + 26 + robotPx / 2);

      layout.scale = scale;
      layout.dir = dir;
      layout.rangeX = rangeX;
      layout.rangeY = rangeY;
      layout.minX = -rangeX;
      layout.maxX = rangeX;
      layout.maxY = rangeY;
      layout.greetX = dir * (greetPx / pxPerWorld);
      layout.entryX =
        ENTRY_DIRECTION === "left"
          ? -halfW - robotHalfW * 0.45
          : ENTRY_DIRECTION === "right"
            ? halfW + robotHalfW * 0.45
            : layout.greetX;
      layout.entryY =
        ENTRY_DIRECTION === "top"
          ? halfH + robotHalfH * 0.45
          : ENTRY_DIRECTION === "bottom"
            ? -halfH - robotHalfH * 0.45
            : 0;
      layout.stacked = stacked;

      const firstValidLayout = !layoutValid;
      layoutValid = true;
      if (firstValidLayout) {
        // Paint one complete, correctly transformed frame while the canvas is
        // still transparent (shaders compile, materials/lights are ready).
        // renderFrame confirms that frame before it calls onReady, so nothing
        // is revealed merely because the canvas has a valid size.
        ready = true;
        previousTime = 0;
        renderFrame(performance.now());
      }

      if (!firstValidLayout && reducedMotion.matches) {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        renderFrame(performance.now());
      }
      requestFrame();
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        previousTime = 0;
        if (ready) renderFrame(performance.now());
      } else {
        previousTime = 0;
        requestFrame();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        previousTime = 0;
        requestFrame();
      }
    };

    const onContextLost = (event) => {
      event.preventDefault();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      callbacksRef.current.onFailure?.();
    };

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;

      scene.add(new THREE.HemisphereLight(0xe5e7eb, 0x111118, 1.7));

      const keyLight = new THREE.DirectionalLight(0xe5e7eb, 2.4);
      keyLight.position.set(-3, 4, 5);
      scene.add(keyLight);

      const violetLight = new THREE.PointLight(0x8b5cf6, 20, 7, 2);
      violetLight.position.set(2.4, 1.0, 2.3);
      scene.add(violetLight);

      const rimLight = new THREE.PointLight(0xd8b4fe, 26, 8, 2);
      rimLight.position.set(-2.3, 1.3, -2.3);
      scene.add(rimLight);

      const platformLight = new THREE.PointLight(0xa78bfa, 6, 3.2, 2);
      platformLight.position.set(0, -1.4, 1.3);
      scene.add(platformLight);

      const glowTexture = makeGlowTexture();
      const materials = makeMaterials(glowTexture);
      const panelTextures = { chest: makeSymbolTexture() };

      animation.character = buildRobot(scene, materials, glowTexture, panelTextures);

      /* Only the robot remains: no platform under its feet, no hologram
         panels, orbital rings, bubbles or particles behind it. The character
         itself, its materials and the lighting are unchanged. */
      const float = new THREE.Group();
      scene.remove(animation.character.robot);
      float.add(animation.character.robot);

      const stage = new THREE.Group();
      stage.add(float);
      scene.add(stage);
      animation.float = float;
      animation.stage = stage;

      canvas.addEventListener("webglcontextlost", onContextLost);
      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);
        // Text can reflow after webfonts load; keep the greeting spot in sync.
        if (copyEl) resizeObserver.observe(copyEl);
      } else {
        window.addEventListener("resize", resize);
      }
      // Font fallback changes hero geometry, so keep the first frame hidden
      // until webfont metrics settle; load/observer callbacks keep it in sync.
      window.addEventListener("load", resize);
      document.fonts?.ready?.then(() => {
        if (disposed) return;
        fontsReady = true;
        resize();
      });
      if ("IntersectionObserver" in window) {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (!visible && animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = 0;
          } else {
            requestFrame();
          }
        });
        intersectionObserver.observe(host);
      }

      // Compile every material up front so the first visible frame already
      // has correct shading instead of a dark/partial silhouette.
      renderer.compile(scene, camera);

      // resize() reveals the canvas only after a valid measurement.
      resize();
    } catch (error) {
      console.warn("The hero robot scene could not be created.", error);
      callbacksRef.current.onFailure?.();
    }

    reducedMotion.addEventListener?.("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", resize);
      window.removeEventListener("load", resize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      reducedMotion.removeEventListener?.("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      disposeScene(scene);
      renderer?.dispose();
    };
  }, []);

  return (
    <div className="heroRobotCanvasHost" aria-hidden="true">
      <canvas className="heroRobotCanvas" ref={canvasRef} />
    </div>
  );
}
