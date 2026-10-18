import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Layers, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Volume2, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Check,
  Compass
} from 'lucide-react';
import { audioSynth } from '../services/audioSynth';

export type WatchFinish = 'dune' | 'obsidian' | 'terracotta' | 'lilac';

interface Hotspot3D {
  id: string;
  name: string;
  category: string;
  description: string;
  spec: string;
  position: [number, number, number];
  targetCamera: [number, number, number];
  actionText: string;
  onAction: () => void;
}

interface Tavy3DWatchViewerProps {
  onTriggerSOS: () => void;
  onBeatPulse: () => void;
  beatTick: number;
}

const FINISHES: { id: WatchFinish; name: string; hex: string; finHex: string; strapHex: string; desc: string }[] = [
  { id: 'dune', name: 'Desert Dune', hex: '#d4af37', finHex: '#fcd34d', strapHex: '#292524', desc: 'Warm champagne anodized titanium with sun-bleached linen weave' },
  { id: 'obsidian', name: 'Obsidian Night', hex: '#262626', finHex: '#38bdf8', strapHex: '#171717', desc: 'Phantom matte black DLC coating with electric twilight cyan optics' },
  { id: 'terracotta', name: 'Dusk Terracotta', hex: '#c2410c', finHex: '#fb923c', strapHex: '#3f2e27', desc: 'Sunset copper alloy inspired by desert festival twilight horizons' },
  { id: 'lilac', name: 'Ethereal Mist', hex: '#7c3aed', finHex: '#c084fc', strapHex: '#2e1065', desc: 'Iridescent violet titanium with responsive prism acoustics' },
];

export const Tavy3DWatchViewer: React.FC<Tavy3DWatchViewerProps> = ({
  onTriggerSOS,
  onBeatPulse,
  beatTick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [finish, setFinish] = useState<WatchFinish>('dune');
  const [explosionAmount, setExplosionAmount] = useState<number>(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>('fin');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for Three.js scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partsGroupRef = useRef<THREE.Group | null>(null);

  // Explodable parts references
  const finMeshRef = useRef<THREE.Mesh | null>(null);
  const finGlowMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const chassisMeshRef = useRef<THREE.Mesh | null>(null);
  const chassisMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const bezelMeshRef = useRef<THREE.Mesh | null>(null);
  const pcbMeshRef = useRef<THREE.Mesh | null>(null);
  const lraMeshRef = useRef<THREE.Group | null>(null);
  const sensorMeshRef = useRef<THREE.Mesh | null>(null);
  const strapTopRef = useRef<THREE.Mesh | null>(null);
  const strapBottomRef = useRef<THREE.Mesh | null>(null);
  const strapMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const sosSliderRef = useRef<THREE.Mesh | null>(null);

  // Animation values stored in mutable ref
  const animStateRef = useRef({
    currentExplosion: 0,
    targetExplosion: 0,
    targetCamPos: new THREE.Vector3(0, 1.8, 4.2),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    finPulseIntensity: 0.5,
  });

  const hotspots: Hotspot3D[] = useMemo(() => [
    {
      id: 'fin',
      name: 'Crystalline Waveguide Fin',
      category: '16.8M RGB Optical Strobe',
      description: 'Laser-faceted optical PMMA prism that channels micro-LED pulses into a luminous blade visible through dense festival dust and stage haze, synchronizing thousands of attendees into unified light waves.',
      spec: 'Total Internal Reflection (TIR) acrylic · 128 BPM Arena Mesh lock · 0ms latency',
      position: [0, 0.72, 0],
      targetCamera: [0, 1.2, 3.2],
      actionText: 'Fire Optical Strobe',
      onAction: () => {
        onBeatPulse();
        audioSynth.playKick(0.8);
      },
    },
    {
      id: 'lra',
      name: 'Dual 35Hz Sub-Bass LRA Core',
      category: 'Bone-Conduction Haptic Resonance',
      description: 'High-displacement Linear Resonant Actuators tuned to 35Hz–120Hz fundamental frequencies. Delivers tactile sub-bass impacts through wrist bone conduction so deaf and hard-of-hearing fans physically feel every drop.',
      spec: 'Dual 10G peak G-force · 35Hz resonant frequency · Microsecond start-stop latency',
      position: [0, 0, 0.35],
      targetCamera: [0.8, 0.8, 2.5],
      actionText: 'Test 35Hz Sub-Bass Kick',
      onAction: () => {
        audioSynth.playBeatDrop();
        audioSynth.triggerHaptic([120, 60, 240]);
      },
    },
    {
      id: 'slider',
      name: 'Blind SOS Mechanical Slider',
      category: 'Accident-Proof Distress Trigger',
      description: 'A positive-detent tactile slider engineered to be located by thumb in pitch-black 110 dB crowds without glancing at a display. Requires a continuous 3-second hold to activate the 10m offline emergency halo.',
      spec: 'Mechanical tactile detent · 3-second blind hold requirement · 5-second abort countdown',
      position: [1.2, 0.05, 0],
      targetCamera: [2.5, 0.5, 1.5],
      actionText: 'Arm 10m Safety Halo',
      onAction: () => {
        onTriggerSOS();
        audioSynth.playSOS();
      },
    },
    {
      id: 'mesh',
      name: 'AuraMesh BLE 5.3 Array',
      category: 'Zero-Infrastructure Mesh Network',
      description: 'High-density peer-to-peer RF antenna operating without cell coverage or venue Wi-Fi. Automatically discovers adjacent Tavy Halos up to 10 meters away, sharing crowd density telemetry and emergency alerts.',
      spec: '2.4 GHz P2P direct broadcast · AES-128 cryptographic pairing · 250 node localized cluster',
      position: [-0.9, -0.1, 0.3],
      targetCamera: [-2.2, 0.6, 2.0],
      actionText: 'Ping 10m Mesh Peers',
      onAction: () => {
        audioSynth.playBump();
      },
    },
    {
      id: 'sensor',
      name: 'Acoustic Health Dosimeter',
      category: 'Real-Time Hearing Guard',
      description: 'Precision MEMS microphone array calibrated for extreme-SPL music festival environments (up to 135 dB peak). Continuously calculates safe daily noise exposure allowances and alerts the user before hearing damage occurs.',
      spec: 'A-weighted SPL dosimetry · NIOSH/OSHA standards · 0.1 dB accuracy',
      position: [0, -0.5, 0],
      targetCamera: [0, -1.8, 3.0],
      actionText: 'Run dB Sensor Diagnostics',
      onAction: () => {
        audioSynth.playTap();
      },
    },
  ], [onBeatPulse, onTriggerSOS]);

  const activeHotspot = hotspots.find(h => h.id === activeHotspotId) || hotspots[0];

  // Set explosion target whenever slider or state changes
  useEffect(() => {
    animStateRef.current.targetExplosion = explosionAmount;
  }, [explosionAmount]);

  // Update materials when finish changes
  useEffect(() => {
    const activeFinish = FINISHES.find(f => f.id === finish) || FINISHES[0];
    const chassisColor = new THREE.Color(activeFinish.hex);
    const finColor = new THREE.Color(activeFinish.finHex);
    const strapColor = new THREE.Color(activeFinish.strapHex);

    if (chassisMaterialRef.current) {
      chassisMaterialRef.current.color.copy(chassisColor);
    }
    if (finGlowMaterialRef.current) {
      finGlowMaterialRef.current.color.copy(finColor);
      finGlowMaterialRef.current.emissive.copy(finColor);
    }
    if (strapMaterialRef.current) {
      strapMaterialRef.current.color.copy(strapColor);
    }
  }, [finish]);

  // Optical pulse effect on beat
  useEffect(() => {
    animStateRef.current.finPulseIntensity = 1.6;
  }, [beatTick]);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#0b0c13');
    scene.fog = new THREE.FogExp2('#0b0c13', 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping & studio quality
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't go too far under ground
    controls.target.set(0, 0, 0);

    // 6. Balanced 3-Point Studio Lighting
    // Warm key light
    const keyLight = new THREE.DirectionalLight('#ffe5b4', 2.8);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool fill light
    const fillLight = new THREE.DirectionalLight('#93c5fd', 1.4);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Warm rim light for glossy edges
    const rimLight = new THREE.DirectionalLight('#fbcfe8', 2.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Ambient hemisphere light
    const hemiLight = new THREE.HemisphereLight('#fef3c7', '#1e1b4b', 0.8);
    scene.add(hemiLight);

    // Soft contact shadow ground
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const gradient = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.15;
    scene.add(shadowPlane);

    // 7. BUILD PROCEDURAL COMPOSITE 3D TAVY HALO WATCH (3-12 parts)
    const partsGroup = new THREE.Group();
    partsGroupRef.current = partsGroup;
    scene.add(partsGroup);

    const activeFinish = FINISHES.find(f => f.id === finish) || FINISHES[0];

    // --- PART 1: Main Titanium Unibody Chassis ---
    // Curved squircle/pill watch case with micro bevels
    const chassisGeo = new THREE.CylinderGeometry(1.08, 1.05, 0.32, 48);
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeFinish.hex),
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    });
    chassisMaterialRef.current = chassisMat;
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    chassisMeshRef.current = chassisMesh;
    partsGroup.add(chassisMesh);

    // Inner bevel ring
    const bezelGeo = new THREE.TorusGeometry(0.96, 0.05, 24, 48);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      metalness: 0.9,
      roughness: 0.15,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.rotation.x = Math.PI / 2;
    bezelMesh.position.y = 0.16;
    bezelMeshRef.current = bezelMesh;
    partsGroup.add(bezelMesh);

    // Sapphire Crystal Face
    const glassGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.03, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.76,
      thickness: 0.8,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 0.18;
    partsGroup.add(glassMesh);

    // Dial face texture (Aura dial)
    const dialCanvas = document.createElement('canvas');
    dialCanvas.width = 512;
    dialCanvas.height = 512;
    const dctx = dialCanvas.getContext('2d')!;
    dctx.fillStyle = '#0f111a';
    dctx.fillRect(0, 0, 512, 512);
    // Radial rings
    dctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    dctx.lineWidth = 2;
    dctx.beginPath();
    dctx.arc(256, 256, 220, 0, Math.PI * 2);
    dctx.stroke();
    dctx.beginPath();
    dctx.arc(256, 256, 170, 0, Math.PI * 2);
    dctx.stroke();
    // Tavy wordmark on dial
    dctx.fillStyle = '#ffffff';
    dctx.font = 'bold 36px sans-serif';
    dctx.textAlign = 'center';
    dctx.fillText('TAVY', 256, 160);
    dctx.fillStyle = '#f59e0b';
    dctx.font = '18px monospace';
    dctx.fillText('35Hz LRA · ARENA MESH', 256, 340);

    const dialTex = new THREE.CanvasTexture(dialCanvas);
    dialTex.colorSpace = THREE.SRGBColorSpace;
    const dialGeo = new THREE.CircleGeometry(0.9, 48);
    const dialMat = new THREE.MeshBasicMaterial({ map: dialTex });
    const dialMesh = new THREE.Mesh(dialGeo, dialMat);
    dialMesh.rotation.x = -Math.PI / 2;
    dialMesh.position.y = 0.165;
    partsGroup.add(dialMesh);

    // --- PART 2: Crystalline Waveguide Optical Fin (Top Feature) ---
    // Extruded curved fin
    const finShape = new THREE.Shape();
    finShape.moveTo(-0.7, 0);
    finShape.lineTo(0.7, 0);
    finShape.quadraticCurveTo(0.5, 0.45, 0, 0.52);
    finShape.quadraticCurveTo(-0.5, 0.45, -0.7, 0);

    const finExtrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    finGeo.center();

    const finColor = new THREE.Color(activeFinish.finHex);
    const finMat = new THREE.MeshPhysicalMaterial({
      color: finColor,
      emissive: finColor,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.95,
      ior: 1.5,
      thickness: 1.2,
    });
    finGlowMaterialRef.current = finMat;
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(0, 0.35, -0.55);
    finMesh.rotation.x = -Math.PI * 0.15;
    finMeshRef.current = finMesh;
    partsGroup.add(finMesh);

    // --- PART 3: Tactile Blind SOS Slider (Right flank) ---
    const sliderBaseGeo = new THREE.BoxGeometry(0.25, 0.16, 0.4);
    const sliderBaseMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Safety red detent
      metalness: 0.6,
      roughness: 0.3,
    });
    const sliderMesh = new THREE.Mesh(sliderBaseGeo, sliderBaseMat);
    sliderMesh.position.set(1.15, 0.02, 0);
    sosSliderRef.current = sliderMesh;
    partsGroup.add(sliderMesh);

    // --- PART 4: Internal BLE 5.3 Antenna & Logic Board (Circuit) ---
    const pcbGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.04, 32);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // Emerald circuit green
      metalness: 0.3,
      roughness: 0.4,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.y = -0.05;
    pcbMeshRef.current = pcbMesh;
    partsGroup.add(pcbMesh);

    // --- PART 5: Dual 35Hz Linear Resonant Actuator Core ---
    const lraGroup = new THREE.Group();
    lraMeshRef.current = lraGroup;
    const lraCoilGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 24);
    const lraCoilMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Copper coil
      metalness: 0.9,
      roughness: 0.2,
    });
    const coil1 = new THREE.Mesh(lraCoilGeo, lraCoilMat);
    coil1.position.set(-0.35, 0, 0);
    const coil2 = new THREE.Mesh(lraCoilGeo, lraCoilMat);
    coil2.position.set(0.35, 0, 0);
    lraGroup.add(coil1);
    lraGroup.add(coil2);
    lraGroup.position.y = -0.12;
    partsGroup.add(lraGroup);

    // --- PART 6: Biometric Sensor & Hearing Health Micro-Array ---
    const sensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.06, 32);
    const sensorMat = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      transmission: 0.7,
      roughness: 0.2,
      metalness: 0.8,
    });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.y = -0.22;
    sensorMeshRef.current = sensorMesh;
    partsGroup.add(sensorMesh);

    // Optical sensor LEDs
    const sensorDotGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const sensorDotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const sdot1 = new THREE.Mesh(sensorDotGeo, sensorDotMat);
    sdot1.position.set(0.2, -0.24, 0);
    const sdot2 = new THREE.Mesh(sensorDotGeo, sensorDotMat);
    sdot2.position.set(-0.2, -0.24, 0);
    sensorMesh.add(sdot1);
    sensorMesh.add(sdot2);

    // --- PART 7: Ergonomic Woven Festival Strap (Top & Bottom Bands) ---
    const strapCurveTop = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, -1.05),
      new THREE.Vector3(0, -0.2, -1.6),
      new THREE.Vector3(0, -0.7, -1.9),
      new THREE.Vector3(0, -1.2, -1.7)
    );
    const strapCurveBottom = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 1.05),
      new THREE.Vector3(0, -0.2, 1.6),
      new THREE.Vector3(0, -0.7, 1.9),
      new THREE.Vector3(0, -1.2, 1.7)
    );

    const strapTopGeo = new THREE.TubeGeometry(strapCurveTop, 32, 0.42, 16, false);
    const strapBottomGeo = new THREE.TubeGeometry(strapCurveBottom, 32, 0.42, 16, false);

    const strapMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeFinish.strapHex),
      roughness: 0.85,
      metalness: 0.05,
    });
    strapMaterialRef.current = strapMat;

    const strapTop = new THREE.Mesh(strapTopGeo, strapMat);
    strapTop.castShadow = true;
    strapTopRef.current = strapTop;
    partsGroup.add(strapTop);

    const strapBottom = new THREE.Mesh(strapBottomGeo, strapMat);
    strapBottom.castShadow = true;
    strapBottomRef.current = strapBottom;
    partsGroup.add(strapBottom);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth damping of explosion
      const state = animStateRef.current;
      state.currentExplosion = THREE.MathUtils.damp(
        state.currentExplosion,
        state.targetExplosion,
        6,
        delta
      );

      const exp = state.currentExplosion;

      // Move exploded components along separation vectors
      if (finMeshRef.current) {
        finMeshRef.current.position.y = 0.35 + exp * 0.9;
        finMeshRef.current.position.z = -0.55 - exp * 0.4;
      }
      if (bezelMeshRef.current) {
        bezelMeshRef.current.position.y = 0.16 + exp * 0.4;
      }
      if (pcbMeshRef.current) {
        pcbMeshRef.current.position.y = -0.05 - exp * 0.35;
      }
      if (lraMeshRef.current) {
        lraMeshRef.current.position.y = -0.12 - exp * 0.7;
      }
      if (sensorMeshRef.current) {
        sensorMeshRef.current.position.y = -0.22 - exp * 1.1;
      }
      if (sosSliderRef.current) {
        sosSliderRef.current.position.x = 1.15 + exp * 0.6;
      }
      if (strapTopRef.current) {
        strapTopRef.current.position.z = -exp * 0.5;
      }
      if (strapBottomRef.current) {
        strapBottomRef.current.position.z = exp * 0.5;
      }

      // Smooth damping of fin optical pulse glow
      state.finPulseIntensity = THREE.MathUtils.damp(
        state.finPulseIntensity,
        0.5,
        4,
        delta
      );
      if (finGlowMaterialRef.current) {
        finGlowMaterialRef.current.emissiveIntensity = state.finPulseIntensity;
      }

      // Auto rotation when enabled and user not interacting
      if (autoRotate && !controls.state) {
        partsGroup.rotation.y += delta * 0.25;
      }

      // Camera smooth damping
      if (cameraRef.current) {
        cameraRef.current.position.lerp(state.targetCamPos, delta * 3.5);
        controls.target.lerp(state.targetLookAt, delta * 3.5);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      chassisGeo.dispose();
      bezelGeo.dispose();
      glassGeo.dispose();
      finGeo.dispose();
      dialGeo.dispose();
      shadowGeo.dispose();
      strapTopGeo.dispose();
      strapBottomGeo.dispose();
    };
  }, []);

  // Handle Hotspot Click
  const handleSelectHotspot = (spot: Hotspot3D) => {
    setActiveHotspotId(spot.id);
    animStateRef.current.targetCamPos.set(
      spot.targetCamera[0],
      spot.targetCamera[1],
      spot.targetCamera[2]
    );
    animStateRef.current.targetLookAt.set(
      spot.position[0] * 0.5,
      spot.position[1] * 0.5,
      spot.position[2] * 0.5
    );
    audioSynth.playTap();
  };

  const resetCamera = () => {
    animStateRef.current.targetCamPos.set(0, 1.8, 4.2);
    animStateRef.current.targetLookAt.set(0, 0, 0);
    audioSynth.playTap();
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-[#0c0d14] border border-white/[0.08] shadow-2xl">
      {/* Editorial Header (Ideal House + Ford GT Performance Style) */}
      <div className="p-6 md:p-10 border-b border-white/[0.06] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-mono-tech tracking-widest text-amber-300 uppercase">
              ENGINEERING ARCHITECTURE · 3D INTERACTIVE VIEWER
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            The Tavy Halo Wearable
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Engineered like high-performance automotive machinery. Inspect every precision sub-assembly, test 35Hz bone-conduction haptics, and explore the internal optical waveguide in real-time 3D.
          </p>
        </div>

        {/* Quick View Anchors */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setExplosionAmount(prev => (prev > 0.1 ? 0 : 1));
              audioSynth.playTap();
            }}
            className={`px-4 py-2.5 rounded-full text-xs font-mono-tech font-bold uppercase transition-all cursor-pointer border flex items-center gap-2 ${
              explosionAmount > 0.1
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{explosionAmount > 0.1 ? 'Collapse Model' : 'Exploded View'}</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-white/10 text-amber-300 border-amber-400/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={resetCamera}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Reset Camera Angle"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Viewport Container (Unobstructed Center) */}
      <div className={`relative w-full transition-all duration-500 ${isFullscreen ? 'h-[85vh]' : 'h-[520px] sm:h-[620px]'}`}>
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

        {/* Floating Hotspot Pills (Top-Left / Quick Select) */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-md pointer-events-auto">
          {hotspots.map(spot => {
            const isSelected = activeHotspotId === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => handleSelectHotspot(spot)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono-tech transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-md'
                    : 'bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white border-white/15 backdrop-blur-sm'
                }`}
              >
                {spot.name}
              </button>
            );
          })}
        </div>

        {/* Top-Right Telemetry & Fullscreen */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono-tech text-slate-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>WebGL 60 FPS</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen View' : 'Expand Viewport'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Active Feature Detail Drawer (Ford GT Exploded Feature Card) */}
        <div className="absolute top-16 right-4 z-20 max-w-sm hidden sm:block pointer-events-auto">
          <div className="p-5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                {activeHotspot.category}
              </span>
              <span className="text-[10px] font-mono-tech text-slate-400">
                Active Layer
              </span>
            </div>

            <h4 className="font-heading text-lg font-bold text-white">
              {activeHotspot.name}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {activeHotspot.description}
            </p>

            <div className="pt-1 border-t border-white/10 text-[10px] font-mono-tech text-slate-400">
              <span className="text-amber-300 font-semibold">SPEC: </span>
              {activeHotspot.spec}
            </div>

            <button
              onClick={activeHotspot.onAction}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-0 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{activeHotspot.actionText}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Bottom Control Dock (Three.js Directive Compliant) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl px-4 pointer-events-auto">
          {/* Collapse/Expand Toggle Button */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
              className="px-3 py-1 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/15 text-[11px] font-mono-tech text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isControlsCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Show Controls &amp; Swatches</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hide Controls (Zen Mode)</span>
                </>
              )}
            </button>
          </div>

          {!isControlsCollapsed && (
            <div className="p-4 rounded-2xl bg-black/90 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Exploded View Slider */}
              <div className="w-full sm:w-1/2 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Exploded Architecture
                  </span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(explosionAmount * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explosionAmount}
                  onChange={e => setExplosionAmount(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Material Finish Swatches (Ford GT Customizer) */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-xs font-mono-tech text-slate-400 hidden lg:inline">
                  Finish:
                </span>
                <div className="flex items-center gap-2">
                  {FINISHES.map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFinish(f.id);
                        audioSynth.playTap();
                      }}
                      className={`relative w-8 h-8 rounded-full transition-all cursor-pointer p-0.5 border ${
                        finish === f.id
                          ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={f.name}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: f.hex }}
                      >
                        {finish === f.id && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Feature Detail Bar (Under canvas on small screens) */}
      <div className="p-4 bg-black/90 border-t border-white/10 sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono-tech text-amber-400 uppercase font-bold">
            {activeHotspot.category}
          </span>
          <span className="text-[10px] font-mono-tech text-slate-400">
            {activeHotspot.spec}
          </span>
        </div>
        <h4 className="font-heading text-base font-bold text-white">
          {activeHotspot.name}
        </h4>
        <p className="text-xs text-slate-300 font-light leading-relaxed">
          {activeHotspot.description}
        </p>
        <button
          onClick={activeHotspot.onAction}
          className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-mono-tech font-bold text-xs uppercase cursor-pointer border-0"
        >
          {activeHotspot.actionText}
        </button>
      </div>
    </section>
  );
};
