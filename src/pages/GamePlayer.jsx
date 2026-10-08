import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// --- Canvas Texture Generators ---
function createPlatformTexture(colorBase, colorDark, colorHighlight) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');
  
  // 1. Top Wide Body
  ctx.fillStyle = colorBase;
  ctx.beginPath();
  ctx.moveTo(15, 20); // Top left
  ctx.lineTo(241, 20); // Top right
  ctx.lineTo(233, 45); // Bottom right
  ctx.lineTo(23, 45); // Bottom left
  ctx.fill();

  // 2. Top Edge Highlight
  ctx.fillStyle = colorHighlight;
  ctx.beginPath();
  ctx.moveTo(17, 22);
  ctx.lineTo(239, 22);
  ctx.lineTo(236, 28);
  ctx.lineTo(20, 28);
  ctx.fill();

  // 3. Dark Underside (Left and Right Wings)
  ctx.fillStyle = colorDark;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(35, 45);
  ctx.lineTo(80, 45);
  ctx.lineTo(70, 65);
  ctx.lineTo(45, 65);
  ctx.fill();
  
  // Right wing
  ctx.beginPath();
  ctx.moveTo(221, 45);
  ctx.lineTo(176, 45);
  ctx.lineTo(186, 65);
  ctx.lineTo(211, 65);
  ctx.fill();

  // 4. Center Protruding Block
  ctx.fillStyle = colorBase;
  ctx.beginPath();
  ctx.moveTo(70, 45);
  ctx.lineTo(186, 45);
  ctx.lineTo(170, 75);
  ctx.lineTo(86, 75);
  ctx.fill();

  // 5. Center Block Edge Highlight
  ctx.fillStyle = colorHighlight;
  ctx.beginPath();
  ctx.moveTo(74, 47);
  ctx.lineTo(182, 47);
  ctx.lineTo(179, 52);
  ctx.lineTo(77, 52);
  ctx.fill();

  // 6. Glowing Cyan Slit
  ctx.fillStyle = '#ccffff'; // White-ish center
  ctx.shadowColor = '#00ffff'; // Cyan glow
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(95, 56, 66, 10, 4);
  ctx.fill();
  // Second pass for intense glow
  ctx.shadowBlur = 5;
  ctx.fill();
  ctx.shadowBlur = 0; 

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createCoinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#fbc500'; // Outer ring
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI*2);
  ctx.fill();
  
  ctx.fillStyle = '#ffd700'; // Inner ring
  ctx.beginPath();
  ctx.arc(64, 64, 45, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = '#c89b00'; // Center slot
  ctx.fillRect(58, 30, 12, 68);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export default function GamePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const controlsRef = useRef({ left: false, right: false });
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.display = 'none';
    
    // Force body background to match game to avoid white flashing on mobile fullscreen/notch
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = '#0A1128';
    document.documentElement.style.backgroundColor = '#0A1128';
    
    // Change mobile browser theme-color to prevent white safe-areas
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    const originalThemeColor = themeMeta.content;
    themeMeta.content = '#0A1128';
    
    return () => {
      if (nav) nav.style.display = 'flex';
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      themeMeta.content = originalThemeColor;
    };
  }, []);

  useEffect(() => {
    let wakeLock = null;
    
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    };

    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wakeLock !== null) {
        wakeLock.release().catch(() => {});
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || isGameOver) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    
    // Moved camera further back (from 18 to 22)
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 22;
    camera.position.y = 5;
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 15);
    scene.add(dirLight);

    // Player Group
    const player = new THREE.Group();
    player.position.y = 0;
    scene.add(player);

    let mixer;
    const clock = new THREE.Clock();
    
    // Asset Loading Manager
    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, loaded, total) => {
      setLoadProgress(Math.round((loaded / total) * 100));
    };
    manager.onLoad = () => {
      setIsLoading(false);
    };
    
    // Fallback in case there are no assets to load (rare, but good for safety)
    setTimeout(() => { if (manager.itemsLoaded === manager.itemsTotal) setIsLoading(false); }, 500);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.load('/character.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(1.2, 1.2, 1.2);
      model.rotation.y = 0; 
      model.position.y = -0.5;
      player.add(model);

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        const jumpAnim = gltf.animations.find(a => a.name.toLowerCase().includes('jump')) || gltf.animations[0];
        if (jumpAnim) {
          mixer.clipAction(jumpAnim).play();
        }
      }
    }, undefined, (error) => {
      console.error('Failed to load character:', error);
      const fallback = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0xffa500 })
      );
      player.add(fallback);
    });

    // Materials - Using EXACT platform design from screenshot in 4 colors
    const platformMats = [
      new THREE.MeshBasicMaterial({ map: createPlatformTexture('#fbc500', '#a37b00', '#ffe066'), transparent: true }), // Yellow
      new THREE.MeshBasicMaterial({ map: createPlatformTexture('#1ea1f1', '#0b5b99', '#78c5f9'), transparent: true }), // Blue
      new THREE.MeshBasicMaterial({ map: createPlatformTexture('#9051ff', '#491d88', '#bd94ff'), transparent: true }), // Purple
      new THREE.MeshBasicMaterial({ map: createPlatformTexture('#0ba83f', '#065f23', '#3ee477'), transparent: true })  // Green (Replaced Red Spiky)
    ];
    
    // Fragile platform material (Red/Orange danger color)
    const fragileMat = new THREE.MeshBasicMaterial({ map: createPlatformTexture('#ef4444', '#7f1d1d', '#fca5a5'), transparent: true });

    const coinMat = new THREE.MeshBasicMaterial({ map: createCoinTexture(), transparent: true });
    const coinGeo = new THREE.PlaneGeometry(0.8, 0.8);

    // Entities
    const platforms = [];
    const coins = [];
    const parallaxEntities = [];
    
    // --- Parallax Background Assets Setup ---
    const bgAssets = [];
    for (let i = 1; i <= 10; i++) {
      bgAssets.push(`https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2F${i}.webp?alt=media`);
    }
    const textureLoader = new THREE.TextureLoader(manager);
    const bgMats = bgAssets.map(url => new THREE.MeshBasicMaterial({
      map: textureLoader.load(url),
      transparent: true,
      opacity: 0.6, // Dimmed to blend into background
      side: THREE.DoubleSide
    }));

    function createParallaxEntity(yPos) {
      const mat = bgMats[Math.floor(Math.random() * bgMats.length)];
      const size = 3.5 + Math.random() * 4.5; // Larger sizes from 3.5 to 8
      const geo = new THREE.PlaneGeometry(size, size);
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.position.y = yPos + (Math.random() * 4 - 2);
      mesh.position.x = (Math.random() - 0.5) * 16; // Spread out wide
      mesh.position.z = -15 + Math.random() * 10; // Depth between -15 and -5
      
      scene.add(mesh);
      parallaxEntities.push({
        mesh,
        mat,
        size,
        aspectSet: false,
        driftSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.015), // Drift slowly in one constant direction
        baseY: mesh.position.y
      });
    }

    // Initial scatter of planets/spaceships (closer together)
    for (let i = -10; i < 40; i += 3.5) {
      createParallaxEntity(i);
    }
    
    // --- Starfield Setup ---
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 16;
    starCanvas.height = 16;
    const starCtx = starCanvas.getContext('2d');
    const starGrad = starCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    starGrad.addColorStop(0, 'rgba(255,255,255,1)');
    starGrad.addColorStop(1, 'rgba(255,255,255,0)');
    starCtx.fillStyle = starGrad;
    starCtx.fillRect(0, 0, 16, 16);
    const starTex = new THREE.CanvasTexture(starCanvas);

    const starsMat = new THREE.PointsMaterial({
      size: 0.7,
      map: starTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8
    });
    
    const starChunks = [];
    for (let c = 0; c < 2; c++) {
      const geo = new THREE.BufferGeometry();
      const count = 250;
      const arr = new Float32Array(count * 3);
      for(let i=0; i<count*3; i+=3) {
        arr[i] = (Math.random() - 0.5) * 40; // x spread
        arr[i+1] = Math.random() * 60;       // y local chunk
        arr[i+2] = -25 + Math.random() * 20; // z depth behind platforms
      }
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const mesh = new THREE.Points(geo, starsMat);
      mesh.position.y = c * 60 - 10;
      scene.add(mesh);
      starChunks.push(mesh);
    }

    // --- Shockwave Setup ---
    const shockGeo = new THREE.RingGeometry(0.8, 1.2, 32);
    const shockMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const shockwave = new THREE.Mesh(shockGeo, shockMat);
    shockwave.rotation.x = -Math.PI / 2.2; // Slightly tilted up towards camera
    scene.add(shockwave);
    
    // Starting Ground Platform (Flat 2D Plane)
    const groundGeo = new THREE.PlaneGeometry(25, 2);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x1a365d });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -2;
    scene.add(ground);
    platforms.push({ mesh: ground, baseY: -2, bounceTimer: 0, isMoving: false });

    // Made platforms smaller
    const platformGeo = new THREE.PlaneGeometry(1.6, 0.6);

    function createPlatform(yPos) {
      const isFragile = yPos > 15 && Math.random() > 0.8; // 20% chance after height 15
      const meshMat = isFragile ? fragileMat.clone() : platformMats[Math.floor(Math.random() * platformMats.length)];
      
      const mesh = new THREE.Mesh(platformGeo, meshMat);
      mesh.position.y = yPos;
      // Constrain X position so platforms don't clip outside the screen
      mesh.position.x = (Math.random() - 0.5) * 5.5; 
      scene.add(mesh);
      
      const isMoving = !isFragile && yPos > 10 && Math.random() > 0.7; // Start moving platforms after a bit of height
      const moveSpeed = isMoving ? (Math.random() > 0.5 ? 0.04 : -0.04) : 0;
      
      let coinMesh = null;
      // 50% chance to spawn a coin above the platform
      if (Math.random() > 0.5) {
        coinMesh = new THREE.Mesh(coinGeo, coinMat);
        coinMesh.position.y = yPos + 1.2;
        coinMesh.position.x = mesh.position.x;
        scene.add(coinMesh);
        coins.push(coinMesh);
      }
      
      platforms.push({ 
        mesh, 
        baseY: yPos, 
        bounceTimer: 0, 
        isMoving, 
        moveSpeed, 
        attachedCoin: coinMesh,
        isFragile,
        bouncesLeft: isFragile ? 1 : Infinity, // 1 bounce allowed, falls on 2nd impact
        isFalling: false
      });
    }

    // Generate Initial platforms
    for (let i = 1; i <= 10; i++) {
      createPlatform(i * 4.5);
    }

    // --- Trail Particles Setup ---
    const trailGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const trailGroup = new THREE.Group();
    scene.add(trailGroup);
    
    const maxTrails = 30;
    const trails = [];
    let trailIndex = 0;
    for(let i=0; i<maxTrails; i++) {
      const m = new THREE.Mesh(trailGeo, trailMat);
      m.visible = false;
      trailGroup.add(m);
      trails.push({ mesh: m, life: 0 });
    }

    // Game variables
    let velocityY = 0;
    const gravity = -0.0035; // Reduced gravity for slower fall
    const jumpForce = 0.22;  // Tuned to easily reach 1 platform, but never 2
    let highestY = 0;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') controlsRef.current.left = true;
      if (e.key === 'ArrowRight') controlsRef.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') controlsRef.current.left = false;
      if (e.key === 'ArrowRight') controlsRef.current.right = false;
    };
    
    // Device Orientation for Phones & Tablets (Analog Steering)
    const handleOrientation = (e) => {
      let tilt = 0;
      
      // Detect if device is in portrait or landscape
      const angle = window.orientation || (window.screen && window.screen.orientation ? window.screen.orientation.angle : 0);
      
      if (angle === 90) {
        // Landscape (top edge on left) - tilting left/right changes beta
        tilt = e.beta;
      } else if (angle === -90 || angle === 270) {
        // Landscape (top edge on right)
        tilt = -e.beta;
      } else {
        // Portrait
        tilt = e.gamma;
      }
      
      if (tilt === null || isNaN(tilt)) return;
      
      // Cap the maximum tilt angle at 35 degrees for full speed
      if (tilt > 35) tilt = 35;
      if (tilt < -35) tilt = -35;
      
      // Small deadzone so it doesn't drift when holding still
      if (Math.abs(tilt) < 3) tilt = 0;
      
      // Map to a normalized value between -1.0 and 1.0
      controlsRef.current.tilt = tilt / 35; 
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('deviceorientation', handleOrientation);

    const resizeRendererToDisplaySize = (renderer) => {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    // Animation Loop
    let animationId;
    const animate = () => {
      if (isGameOver) return;
      animationId = requestAnimationFrame(animate);
      
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Physics
      velocityY += gravity;
      player.position.y += velocityY;

      // Controls
      let moveSpeed = 0;
      if (controlsRef.current.left) moveSpeed -= 0.15;
      if (controlsRef.current.right) moveSpeed += 0.15;
      if (controlsRef.current.tilt) moveSpeed = controlsRef.current.tilt * 0.13; // Max speed slightly lower for smooth tilt control
      
      player.position.x += moveSpeed;

      // Wrap around screen boundaries adjusted for actual mobile visible area
      if (player.position.x > 4.5) player.position.x = -4.5;
      if (player.position.x < -4.5) player.position.x = 4.5;

      // Particle Trail Logic (Decreased intensity)
      if (velocityY > 0 && Math.random() > 0.7) {
        const t = trails[trailIndex];
        t.mesh.position.copy(player.position);
        t.mesh.position.y -= 0.5; // Spawn at feet
        t.mesh.position.z = -1;   // Spawn slightly behind
        t.mesh.scale.set(0.6, 0.6, 1); // Start smaller
        t.mesh.rotation.z = Math.random() * Math.PI;
        t.mesh.visible = true;
        t.life = 1;
        trailIndex = (trailIndex + 1) % maxTrails;
      }
      
      // Update existing particles
      for (let t of trails) {
        if (t.life > 0) {
          t.life -= 0.1; // Die twice as fast
          t.mesh.position.y -= 0.02;
          t.mesh.scale.multiplyScalar(0.7); // Shrink much faster
          t.mesh.rotation.z += 0.1;
          if (t.life <= 0) t.mesh.visible = false;
        }
      }

      // Collision with platforms (only when falling)
      if (velocityY < 0) {
        for (let p of platforms) {
          if (p.isFalling) continue; // Don't collide if it's already falling away
          
          const width = p.mesh.geometry.parameters.width / 2;
          if (
            Math.abs(player.position.x - p.mesh.position.x) < width + 0.3 &&
            player.position.y - 0.5 <= p.mesh.position.y + 0.3 &&
            player.position.y - 0.5 >= p.mesh.position.y - 0.3
          ) {
            velocityY = jumpForce; // Bounce
            p.bounceTimer = Math.PI; // Trigger bounce animation
            
            // Play jump sound
            try {
              const jumpSfx = new Audio('/jump.mp3');
              jumpSfx.volume = 0.7;
              jumpSfx.play().catch(()=>{});
            } catch(e) {}
            
            if (p.isFragile) {
              p.bouncesLeft -= 1;
              if (p.bouncesLeft <= 0) {
                p.isFalling = true; // Breaks and falls!
              } else {
                p.mesh.material.opacity = 0.5; // Visually indicate it's about to break
              }
            }
            
            // Trigger shockwave
            shockwave.position.copy(p.mesh.position);
            shockwave.position.y += 0.3; // Just above platform surface
            shockwave.scale.set(0.1, 0.1, 0.1);
            shockMat.opacity = 1.0;
            
            // Trigger vibration (if supported)
            try {
              if (navigator.vibrate) navigator.vibrate(50);
            } catch (err) {}
            
            break;
          }
        }
      }

      // Update Platform Animations & Movement
      for (let p of platforms) {
        // Handle Fragile Falling Platforms
        if (p.isFalling) {
          p.mesh.position.y -= 0.15; // Gravity pulls it down
          p.mesh.rotation.z += 0.05; // Tumbles while falling
          if (p.attachedCoin && p.attachedCoin.parent) {
            p.attachedCoin.position.y -= 0.15;
            p.attachedCoin.rotation.z += 0.05;
          }
          continue; // Skip normal bounce/movement logic if it's falling
        }

        // Handle Moving Platforms
        if (p.isMoving) {
          p.mesh.position.x += p.moveSpeed;
          // Keep attached coin synced
          if (p.attachedCoin && p.attachedCoin.parent) {
            p.attachedCoin.position.x = p.mesh.position.x;
          }
          // Bounce off invisible screen boundaries
          if (p.mesh.position.x > 3.5 || p.mesh.position.x < -3.5) {
            p.moveSpeed *= -1;
          }
        }
        
        // Handle Bounce Animation
        if (p.bounceTimer > 0) {
          p.bounceTimer -= 0.25; // Slightly slower recovery
          if (p.bounceTimer <= 0) {
            p.bounceTimer = 0;
            p.mesh.position.y = p.baseY;
            p.mesh.scale.y = 1;
          } else {
            const bounceForce = Math.sin(p.bounceTimer);
            p.mesh.position.y = p.baseY - bounceForce * 0.5; // Increased displacement
            p.mesh.scale.y = 1 - bounceForce * 0.5; // Increased squish
          }
        }
      }

      // Coin Collection
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        if (Math.abs(player.position.x - c.position.x) < 1 && Math.abs(player.position.y - c.position.y) < 1) {
          scene.remove(c);
          coins.splice(i, 1);
          setCoinsCollected(prev => prev + 1);
        }
      }

      // Track Score
      if (player.position.y > highestY) {
        highestY = player.position.y;
        setScore(Math.floor(highestY * 10));
      }
      
      // Smooth camera follow (ONLY moves upwards)
      const targetCamY = player.position.y - 1; // Pushes camera even lower, bringing player higher up on screen
      if (targetCamY > camera.position.y) {
        camera.position.y += (targetCamY - camera.position.y) * 0.1;
      }
      
      // Parallax scroll seamless CSS background (Tracks PLAYER so it bounces with jumps)
      if (bgRef.current) {
        bgRef.current.style.backgroundPositionY = `${player.position.y * 25}px`;
      }
      
      // Update Starfield
      for (let chunk of starChunks) {
        chunk.position.y -= 0.015; // Slow downward drift
        if (chunk.position.y + 60 < camera.position.y - 15) {
          chunk.position.y += 120; // Leapfrog above the other chunk
        }
      }

      // Update Shockwave
      if (shockMat.opacity > 0) {
        shockwave.scale.addScalar(0.15); // Expand
        shockMat.opacity -= 0.06; // Fade out
      }
      
      // Update Parallax Entities (Constant drift, no oscillation)
      for (let p of parallaxEntities) {
        // Fix aspect ratio once the texture image is fully loaded
        if (!p.aspectSet && p.mat.map && p.mat.map.image && p.mat.map.image.width) {
          p.mesh.scale.y = p.mat.map.image.height / p.mat.map.image.width;
          p.aspectSet = true;
        }
        p.mesh.position.x += p.driftSpeed;
      }
      
      const topEntity = parallaxEntities[parallaxEntities.length - 1];
      if (camera.position.y + 25 > topEntity.baseY) {
        createParallaxEntity(topEntity.baseY + 3.5);
      }
      
      if (parallaxEntities[0].baseY < camera.position.y - 15) {
        scene.remove(parallaxEntities[0].mesh);
        parallaxEntities.shift();
      }
      
      // Generate new platforms infinitely
      const topPlatform = platforms[platforms.length - 1];
      if (camera.position.y + 15 > topPlatform.baseY) {
        createPlatform(topPlatform.baseY + 4.5);
      }

      // Cleanup old platforms
      if (platforms[0].baseY < camera.position.y - 15) {
        scene.remove(platforms[0].mesh);
        platforms.shift();
      }
      
      // Cleanup old coins
      if (coins.length > 0 && coins[0].position.y < camera.position.y - 10) {
         scene.remove(coins[0]);
         coins.shift();
      }

      // Game Over condition (fell off screen)
      if (player.position.y < camera.position.y - 10) {
        setIsGameOver(true);
        cancelAnimationFrame(animationId);
      }

      // Visual tilting
      if (controlsRef.current.tilt) {
        // Smoothly interpolate to match the phone's tilt angle (max 0.4 rad)
        player.rotation.z += (-controlsRef.current.tilt * 0.4 - player.rotation.z) * 0.2;
      } else if (controlsRef.current.left) {
        player.rotation.z = Math.min(player.rotation.z + 0.1, 0.4);
      } else if (controlsRef.current.right) {
        player.rotation.z = Math.max(player.rotation.z - 0.1, -0.4);
      } else {
        player.rotation.z *= 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('deviceorientation', handleOrientation);
      
      scene.clear();
      renderer.dispose();
    };
  }, [isGameOver]);

  return (
    <div className="fixed top-0 left-0 w-screen h-[100dvh] z-[100] bg-[#0A1128] overflow-hidden animate-[fadeIn_0.3s_ease-out]">
      
      {/* Seamless Scrolling Background */}
      <div 
        ref={bgRef}
        className="absolute inset-[-5%] z-0 bg-repeat-y blur-[3px]"
        style={{ 
          backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/gamefaktory-1b0b8.firebasestorage.app/o/lulu-happiness%2Fbg.webp?alt=media')",
          backgroundSize: '100% auto',
          backgroundPositionX: 'center'
        }}
      ></div>

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform pointer-events-auto"
        >
          <X size={24} className="text-white" />
        </button>
        
        <div className="flex gap-3 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-200"></div>
            <span className="text-white font-bold">{coinsCollected}</span>
          </div>
          <div className="bg-black/40 backdrop-blur px-5 py-2 rounded-full border border-white/20 shadow-lg">
            <span className="text-white font-bold">Score: <span className="text-happiness-lime">{score}</span></span>
          </div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        onClick={async () => {
          // iOS 13+ requires user gesture to request device orientation permissions
          if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
              const permission = await DeviceOrientationEvent.requestPermission();
              if (permission === 'granted') {
                // Listener is already attached, it will just start receiving data now
              }
            } catch (err) {
              console.error('Orientation permission error:', err);
            }
          }
        }}
        className="absolute inset-0 w-full h-full block touch-none z-10" 
      />

      {/* Loading Screen Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[200] bg-[#0A1128] flex flex-col items-center justify-center animate-[fadeIn_0.3s_ease-out]">
          <h2 className="text-4xl font-black text-white mb-6 tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            LOADING
          </h2>
          <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden shadow-inner border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-[#0ba83f] to-happiness-lime transition-all duration-300 shadow-[0_0_10px_rgba(154,205,50,0.8)]" 
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="text-white/60 mt-4 font-bold text-sm tracking-widest">{loadProgress}%</p>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
          <h2 className="text-5xl font-black text-red-500 mb-2 uppercase tracking-widest drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">Game Over</h2>
          <p className="text-white text-xl mb-4 font-bold">Distance: <span className="text-happiness-lime">{score}</span></p>
          <p className="text-white text-xl mb-8 font-bold flex items-center gap-2">
            Coins Collected: <span className="text-yellow-400">{coinsCollected}</span>
            <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-yellow-200"></div>
          </p>
          
          <button 
            onClick={() => {
              setScore(0);
              setCoinsCollected(0);
              setLoadProgress(0);
              setIsLoading(true);
              setIsGameOver(false);
            }}
            className="bg-happiness-lime text-black font-bold text-xl px-8 py-4 rounded-2xl flex items-center gap-3 active:scale-95 transition-transform shadow-[0_0_30px_rgba(154,205,50,0.5)] pointer-events-auto"
          >
            <RotateCcw size={24} strokeWidth={2.5} />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
