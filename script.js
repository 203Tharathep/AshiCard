/**
 * Ashi Art Toy Blind Box & 3D Rotating Showcase
 * Pop Mart / Designer Toy Experience
 */

// Art Toy Series 01 Data
const TOY_ITEMS = [
  {
    id: 1,
    src: 'ashi/1.jpeg',
    fallback: '1.jpeg',
    name: 'Ashi - Sunshine Breeze',
    rarity: 'SSR',
    rarityClass: 'tag-ssr',
    badge: 'SSR ★★',
    quote: 'รอยยิ้มสดใสในวันที่ฟ้าโปร่ง เติมพลังใจให้เต็มร้อย',
    chance: 'Drop Rate: 8.5%',
    weight: 12
  },
  {
    id: 2,
    src: 'ashi/2.jpeg',
    fallback: '2.jpeg',
    name: 'Ashi - Cozy Autumn',
    rarity: 'SR',
    rarityClass: 'tag-sr',
    badge: 'SR ★',
    quote: 'ความอบอุ่นในฤดูใบไม้ร่วง กาแฟร้อนกับหนังสือเล่มโปรด',
    chance: 'Drop Rate: 16.0%',
    weight: 20
  },
  {
    id: 3,
    src: 'ashi/3.jpeg',
    fallback: '3.jpeg',
    name: 'Ashi - Sweet Macaron',
    rarity: 'R',
    rarityClass: 'tag-r',
    badge: 'REGULAR',
    quote: 'ความหวานละมุนชวนหลงใหล เหมือนขนมหวานยามบ่าย',
    chance: 'Drop Rate: 20.0%',
    weight: 25
  },
  {
    id: 4,
    src: 'ashi/4.jpeg',
    fallback: '4.jpeg',
    name: 'Ashi - Midnight Whisper',
    rarity: 'SR',
    rarityClass: 'tag-sr',
    badge: 'SR ★',
    quote: 'เสียงกระซิบยามราตรีใต้แสงดาว เสน่ห์อันน่าค้นหา',
    chance: 'Drop Rate: 15.0%',
    weight: 20
  },
  {
    id: 5,
    src: 'ashi/5.jpeg',
    fallback: '5.jpeg',
    name: 'Ashi - Blossom Memory',
    rarity: 'R',
    rarityClass: 'tag-r',
    badge: 'REGULAR',
    quote: 'กลิ่นหอมของความทรงจำแรกผลิ ความสดใสที่ไม่รู้ลืม',
    chance: 'Drop Rate: 22.0%',
    weight: 25
  },
  {
    id: 6,
    src: 'ashi/7.jpeg',
    fallback: '7.jpeg',
    name: 'Ashi - Starlight Muse',
    rarity: 'SSR',
    rarityClass: 'tag-ssr',
    badge: 'SSR ★★',
    quote: 'แรงบันดาลใจแห่งหมู่ดาวพร่างพราว ประกายแสงแห่งความฝัน',
    chance: 'Drop Rate: 7.0%',
    weight: 10
  },
  {
    id: 7,
    src: 'ashi/Gemini_Generated_Image_9bccp39bccp39bcc.jpeg',
    fallback: 'Gemini_Generated_Image_9bccp39bccp39bcc.jpeg',
    name: 'Ashi - Cosmic Dreamer',
    rarity: 'SECRET',
    rarityClass: 'tag-secret',
    badge: 'SECRET ★★★',
    quote: 'ร่างลับแห่งมิติคอสมิกสุดพิเศษ หายากระดับตำนาน 1/72!',
    chance: 'Secret Chase: 1.2%',
    weight: 4
  },
  {
    id: 8,
    src: 'ashi/qwen_edit_20261004_234512 (1).png',
    fallback: 'qwen_edit_20261004_234512 (1).png',
    name: 'Ashi - Cyber Fantasy',
    rarity: 'SECRET',
    rarityClass: 'tag-secret',
    badge: 'SECRET ★★★',
    quote: 'ผู้พิทักษ์แห่งโลกอนาคต ลิมิเต็ดเฉพาะกล่องทองคำ!',
    chance: 'Super Secret: 0.8%',
    weight: 3
  }
];

// App State
let unlockedIds = new Set();
let soundEnabled = true;
let isAutoSpinning = true;
let spinSpeed = 0.35;
let currentRotationY = 0;
let targetRotationY = 0;
let isDragging = false;
let startX = 0;
let lastX = 0;
let dragVelocity = 0;
let activeIndex = 0;
let currentRevealedToy = null;
let isUnboxingInProgress = false;

// Load unlocked collection from LocalStorage
try {
  const saved = localStorage.getItem('ashi_unlocked_toys');
  if (saved) {
    unlockedIds = new Set(JSON.parse(saved));
  }
} catch (e) {
  console.log('LocalStorage not available');
}

// Ensure at least 1 toy is unlocked initially so showcase is not completely empty, or let user open
if (unlockedIds.size === 0) {
  unlockedIds.add(1); // Start with Memory 01
}

// DOM References
const tabUnboxBtn = document.getElementById('tabUnboxBtn');
const tabShowcaseBtn = document.getElementById('tabShowcaseBtn');
const unboxingView = document.getElementById('unboxingView');
const showcaseView = document.getElementById('showcaseView');
const unlockedBadge = document.getElementById('unlockedBadge');

// Blindbox elements
const artToyBox = document.getElementById('artToyBox');
const unboxPrompt = document.getElementById('unboxPrompt');
const shakeBoxBtn = document.getElementById('shakeBoxBtn');
const openBoxBtn = document.getElementById('openBoxBtn');
const unlockAllBtn = document.getElementById('unlockAllBtn');

// 3D Showcase elements
const carousel3dWorld = document.getElementById('carousel3dWorld');
const carouselCylinder = document.getElementById('carouselCylinder');
const indicatorBar = document.getElementById('indicatorBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoSpinBtn = document.getElementById('autoSpinBtn');
const spinPlayIcon = document.getElementById('spinPlayIcon');
const speedSlider = document.getElementById('speedSlider');
const backToUnboxBtn = document.getElementById('backToUnboxBtn');

// Reveal Modal elements
const revealModal = document.getElementById('revealModal');
const holoToyCard = document.getElementById('holoToyCard');
const revealStatusTag = document.getElementById('revealStatusTag');
const revealRarityBadge = document.getElementById('revealRarityBadge');
const revealCollectorId = document.getElementById('revealCollectorId');
const revealCardImg = document.getElementById('revealCardImg');
const revealToyName = document.getElementById('revealToyName');
const revealToyQuote = document.getElementById('revealToyQuote');
const revealChance = document.getElementById('revealChance');
const revealShowcaseBtn = document.getElementById('revealShowcaseBtn');
const revealAgainBtn = document.getElementById('revealAgainBtn');

// Book Modal
const collectionBookBtn = document.getElementById('collectionBookBtn');
const collectionBookModal = document.getElementById('collectionBookModal');
const bookBackdrop = document.getElementById('bookBackdrop');
const bookCloseBtn = document.getElementById('bookCloseBtn');
const bookGrid = document.getElementById('bookGrid');
const bookProgressText = document.getElementById('bookProgressText');
const bookProgressBar = document.getElementById('bookProgressBar');

// Sound Toggle
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');

// Canvases
const ambientCanvas = document.getElementById('ambientCanvas');
const confettiCanvas = document.getElementById('confettiCanvas');

// ===================================================================
// Web Audio Synthesizer
// ===================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playRattle() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    // Rattle sounds like plastic toy shaking inside cardboard
    for (let i = 0; i < 4; i++) {
      const time = this.ctx.currentTime + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140 + Math.random() * 80, time);
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  playTear() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playFanfare(isSecret = false) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const baseNotes = isSecret 
      ? [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // Grand Major Chords
      : [440, 554.37, 659.25, 880];

    baseNotes.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isSecret ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  playTick() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

const sounds = new SoundEngine();

// ===================================================================
// Background Ambient Stars
// ===================================================================
class AmbientStars {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.8,
        speedY: -Math.random() * 0.3 - 0.05,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        hue: Math.random() > 0.5 ? 180 : 330 // Cyan or Neon Pink
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const p of this.particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * 0.002 * p.pulseSpeed) * 0.006;

      if (p.y < -10) p.y = this.height + 10;
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      const alpha = Math.max(0.1, Math.min(0.8, p.opacity));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${alpha})`;
      this.ctx.shadowBlur = p.size * 6;
      this.ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, 0.8)`;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.render());
  }
}

// ===================================================================
// Confetti Explosions
// ===================================================================
class ConfettiManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  burst(originX, originY, isSuper = false) {
    this.particles = [];
    this.isRunning = true;
    const colors = isSuper 
      ? ['#ffbe0b', '#ffd166', '#ff006e', '#00f0ff', '#ffffff', '#ff758c']
      : ['#00f0ff', '#8338ec', '#ff3366', '#06d6a0', '#ffffff'];

    const count = isSuper ? 180 : 120;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 16 + 5;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 9 + 4),
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.35,
        drag: 0.95,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    let aliveCount = 0;

    for (const p of this.particles) {
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.007;

      if (p.alpha > 0 && p.y < this.height) {
        aliveCount++;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }
    }

    if (aliveCount > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// ===================================================================
// Blind Box Randomizer Logic
// ===================================================================
function getRandomToy() {
  const totalWeight = TOY_ITEMS.reduce((sum, item) => sum + item.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const item of TOY_ITEMS) {
    if (randomVal < item.weight) {
      return item;
    }
    randomVal -= item.weight;
  }
  return TOY_ITEMS[0];
}

function updateCollectionBadge() {
  if (unlockedBadge) {
    unlockedBadge.textContent = `${unlockedIds.size}/${TOY_ITEMS.length}`;
  }
  try {
    localStorage.setItem('ashi_unlocked_toys', JSON.stringify([...unlockedIds]));
  } catch (e) {}
}

// ===================================================================
// Blind Box Actions
// ===================================================================
function shakeBox() {
  if (isUnboxingInProgress) return;
  sounds.playRattle();
  artToyBox.classList.add('shaking');

  const hints = [
    '🎲 กล่องมีน้ำหนักพอดีๆ เหมือนมีการ์ดพิเศษซ่อนอยู่!',
    '✨ เขย่าแล้วเบามือ ลุ้น Secret Chase ระดับ 1.2%!',
    '🌟 เสียงดังกังวาน น่าจะได้ตัว SSR สุดสวย!',
    '🔮 สัมผัสได้ถึงกลิ่นอายความทรงจำที่คุ้นเคย...'
  ];
  const chosenHint = hints[Math.floor(Math.random() * hints.length)];
  unboxPrompt.textContent = chosenHint;

  setTimeout(() => {
    artToyBox.classList.remove('shaking');
  }, 600);
}

function openBlindBox() {
  if (isUnboxingInProgress) return;
  isUnboxingInProgress = true;

  sounds.playTear();
  artToyBox.classList.add('ripping');
  unboxPrompt.textContent = '🎉 กำลังแกะซองและกล่องสุ่ม...';

  const pickedToy = getRandomToy();
  const isNew = !unlockedIds.has(pickedToy.id);
  unlockedIds.add(pickedToy.id);
  updateCollectionBadge();

  // Burst confetti
  setTimeout(() => {
    const isSecret = pickedToy.rarity === 'SECRET';
    sounds.playFanfare(isSecret);

    const rect = artToyBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    confetti.burst(cx, cy, isSecret);
  }, 400);

  // Show Reveal Modal
  setTimeout(() => {
    displayRevealModal(pickedToy, isNew);
    artToyBox.classList.remove('ripping');
    isUnboxingInProgress = false;
    unboxPrompt.textContent = 'ยินดีด้วย! คุณได้รับตัวละครใหม่เข้าคอลเลกชัน';
    buildShowcaseItems();
  }, 850);
}

function displayRevealModal(toy, isNew) {
  currentRevealedToy = toy;

  revealStatusTag.textContent = isNew 
    ? (toy.rarity === 'SECRET' ? '👑 NEW SECRET CHASE UNLOCKED! 👑' : '✨ NEW CHARACTER UNLOCKED! ✨')
    : '📦 ได้ตัวซ้ำ! แต่ยังคงความน่ารักระดับพรีเมียม';
  
  revealRarityBadge.className = `rarity-badge ${toy.rarityClass}`;
  revealRarityBadge.textContent = toy.badge;
  revealCollectorId.textContent = `NO. 0${toy.id}`;

  revealCardImg.src = toy.src;
  revealCardImg.onerror = () => { revealCardImg.src = toy.fallback; };
  revealToyName.textContent = toy.name;
  revealToyQuote.textContent = `"${toy.quote}"`;
  revealChance.textContent = toy.chance;

  revealModal.classList.remove('hide');
}

function closeRevealModal() {
  revealModal.classList.add('hide');
}

// 3D Tilt Effect on Holographic Card
holoToyCard.addEventListener('mousemove', (e) => {
  const rect = holoToyCard.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotX = -(y / (rect.height / 2)) * 14;
  const rotY = (x / (rect.width / 2)) * 14;

  holoToyCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
});

holoToyCard.addEventListener('mouseleave', () => {
  holoToyCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

// ===================================================================
// 3D Rotating Showcase (ตู้โชว์หมุน 3D)
// ===================================================================
function getCarouselRadius() {
  const width = window.innerWidth;
  if (width < 480) return 260;
  if (width < 768) return 310;
  return 430;
}

function buildShowcaseItems() {
  carouselCylinder.innerHTML = '';
  indicatorBar.innerHTML = '';

  const total = TOY_ITEMS.length;
  const angleStep = 360 / total;
  const radius = getCarouselRadius();

  TOY_ITEMS.forEach((toy, idx) => {
    const angle = idx * angleStep;
    const isUnlocked = unlockedIds.has(toy.id);

    const card = document.createElement('div');
    card.className = `toy-showcase-card ${isUnlocked ? '' : 'locked'}`;
    card.dataset.index = idx;
    card.dataset.angle = angle;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

    if (isUnlocked) {
      card.innerHTML = `
        <div class="toy-card-img-box">
          <span class="toy-card-top-tag ${toy.rarityClass}">${toy.badge}</span>
          <img class="toy-card-img" src="${toy.src}" alt="${toy.name}" onerror="this.onerror=null;this.src='${toy.fallback}';">
        </div>
        <div class="toy-card-bottom-bar">
          <div>
            <div class="toy-card-title">${toy.name}</div>
            <div class="toy-card-series">Series 01 • No. 0${toy.id}</div>
          </div>
          <div class="toy-card-action-icon"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="toy-card-img-box">
          <span class="toy-card-top-tag tag-sr">LOCKED</span>
          <div class="locked-card-placeholder">
            <i class="fa-solid fa-lock"></i>
            <span>ยังไม่ได้สุ่ม</span>
          </div>
        </div>
        <div class="toy-card-bottom-bar">
          <div>
            <div class="toy-card-title">??? Mystery Art Toy</div>
            <div class="toy-card-series">สุ่มเพื่อปลดล็อก</div>
          </div>
          <div class="toy-card-action-icon"><i class="fa-solid fa-question"></i></div>
        </div>
      `;
    }

    card.addEventListener('click', () => {
      sounds.playTick();
      if (isUnlocked) {
        displayRevealModal(toy, false);
      } else {
        switchToUnboxView();
        unboxPrompt.textContent = 'ต้องการปลดล็อกตัวนี้ใช่ไหม? ลองสุ่มกล่องเลย!';
      }
    });

    carouselCylinder.appendChild(card);

    // Indicator dot
    const dot = document.createElement('div');
    dot.className = `showcase-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      sounds.playTick();
      rotateToIndex(idx);
    });
    indicatorBar.appendChild(dot);
  });
}

function updateIndicators(index) {
  const dots = document.querySelectorAll('.showcase-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function rotateToIndex(index) {
  const total = TOY_ITEMS.length;
  const angleStep = 360 / total;
  targetRotationY = -index * angleStep;
  activeIndex = index;
  updateIndicators(index);
}

function startShowcaseLoop() {
  function loop() {
    if (!isDragging) {
      if (isAutoSpinning) {
        targetRotationY -= spinSpeed;
      } else if (Math.abs(dragVelocity) > 0.02) {
        targetRotationY += dragVelocity;
        dragVelocity *= 0.94;
      }
    }

    currentRotationY += (targetRotationY - currentRotationY) * 0.12;
    carouselCylinder.style.transform = `rotateY(${currentRotationY}deg)`;

    const total = TOY_ITEMS.length;
    const angleStep = 360 / total;
    let normalized = ((-currentRotationY % 360) + 360) % 360;
    let currentIdx = Math.round(normalized / angleStep) % total;
    if (currentIdx !== activeIndex) {
      activeIndex = currentIdx;
      updateIndicators(activeIndex);
    }

    requestAnimationFrame(loop);
  }
  loop();
}

function setupShowcaseDragging() {
  const stage = carousel3dWorld;

  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    lastX = startX;
    dragVelocity = 0;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - lastX;
    lastX = clientX;

    targetRotationY += deltaX * 0.45;
    dragVelocity = deltaX * 0.45;
  }

  function onPointerUp() {
    isDragging = false;
  }

  stage.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  stage.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);
}

// Switch between Unboxing Table and 3D Showcase
function switchToUnboxView() {
  sounds.playTick();
  if (tabUnboxBtn) tabUnboxBtn.classList.add('active');
  if (tabShowcaseBtn) tabShowcaseBtn.classList.remove('active');
  unboxingView.classList.remove('hide');
  showcaseView.classList.add('hide');
}

function switchToShowcaseView() {
  sounds.playTick();
  if (tabShowcaseBtn) tabShowcaseBtn.classList.add('active');
  if (tabUnboxBtn) tabUnboxBtn.classList.remove('active');
  unboxingView.classList.add('hide');
  showcaseView.classList.remove('hide');

  // Recalculate 3D transform radius
  const radius = getCarouselRadius();
  document.querySelectorAll('.toy-showcase-card').forEach((card) => {
    const angle = card.dataset.angle;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}

// ===================================================================
// Collector's Guidebook Modal
// ===================================================================
function openBookModal() {
  sounds.playTick();
  const total = TOY_ITEMS.length;
  const count = unlockedIds.size;
  const pct = Math.round((count / total) * 100);

  bookProgressText.textContent = `${count} / ${total} (${pct}%)`;
  bookProgressBar.style.width = `${pct}%`;

  bookGrid.innerHTML = '';
  TOY_ITEMS.forEach((toy) => {
    const isUnlocked = unlockedIds.has(toy.id);
    const itemCard = document.createElement('div');
    itemCard.className = `book-item-card ${isUnlocked ? '' : 'locked'}`;

    if (isUnlocked) {
      itemCard.innerHTML = `
        <div class="book-item-thumb">
          <img src="${toy.src}" alt="${toy.name}" onerror="this.src='${toy.fallback}'">
        </div>
        <div class="book-item-name">${toy.name}</div>
        <div class="book-item-rarity ${toy.rarityClass}">${toy.badge}</div>
      `;
      itemCard.addEventListener('click', () => {
        closeBookModal();
        displayRevealModal(toy, false);
      });
    } else {
      itemCard.innerHTML = `
        <div class="book-item-thumb" style="display:flex;align-items:center;justify-content:center;background:#100b20;">
          <i class="fa-solid fa-lock" style="font-size:2rem;color:#443b60;"></i>
        </div>
        <div class="book-item-name">??? Mystery</div>
        <div class="book-item-rarity" style="color:#776d95;">${toy.rarity}</div>
      `;
    }

    bookGrid.appendChild(itemCard);
  });

  collectionBookModal.classList.remove('hide');
}

function closeBookModal() {
  collectionBookModal.classList.add('hide');
}

// ===================================================================
// Event Listeners
// ===================================================================
artToyBox.addEventListener('click', openBlindBox);
openBoxBtn.addEventListener('click', openBlindBox);
shakeBoxBtn.addEventListener('click', shakeBox);

unlockAllBtn.addEventListener('click', () => {
  sounds.playFanfare(true);
  TOY_ITEMS.forEach((t) => unlockedIds.add(t.id));
  updateCollectionBadge();
  buildShowcaseItems();
  confetti.burst(window.innerWidth / 2, window.innerHeight / 2, true);
  switchToShowcaseView();
});

if (tabUnboxBtn) tabUnboxBtn.addEventListener('click', switchToUnboxView);
if (tabShowcaseBtn) tabShowcaseBtn.addEventListener('click', switchToShowcaseView);
backToUnboxBtn.addEventListener('click', switchToUnboxView);

// Showcase Controls
prevBtn.addEventListener('click', () => {
  sounds.playTick();
  const total = TOY_ITEMS.length;
  rotateToIndex((activeIndex - 1 + total) % total);
});

nextBtn.addEventListener('click', () => {
  sounds.playTick();
  const total = TOY_ITEMS.length;
  rotateToIndex((activeIndex + 1) % total);
});

autoSpinBtn.addEventListener('click', () => {
  sounds.playTick();
  isAutoSpinning = !isAutoSpinning;
  autoSpinBtn.classList.toggle('active', isAutoSpinning);
  spinPlayIcon.className = isAutoSpinning ? 'fa-solid fa-circle-pause' : 'fa-solid fa-circle-play';
});

speedSlider.addEventListener('input', (e) => {
  const val = parseFloat(e.target.value);
  spinSpeed = val * 0.09;
});

// Reveal Modal Actions
revealShowcaseBtn.addEventListener('click', () => {
  closeRevealModal();
  switchToShowcaseView();
  if (currentRevealedToy) {
    const idx = TOY_ITEMS.findIndex((t) => t.id === currentRevealedToy.id);
    if (idx !== -1) rotateToIndex(idx);
  }
});

revealAgainBtn.addEventListener('click', () => {
  closeRevealModal();
  switchToUnboxView();
});

revealModal.querySelector('.reveal-backdrop').addEventListener('click', closeRevealModal);

// Book Modal Events
collectionBookBtn.addEventListener('click', openBookModal);
bookBackdrop.addEventListener('click', closeBookModal);
bookCloseBtn.addEventListener('click', closeBookModal);

// Sound Toggle
soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    sounds.init();
    sounds.playTick();
    soundIcon.className = 'fa-solid fa-volume-high';
    soundToggleBtn.style.color = 'var(--pop-cyan)';
  } else {
    soundIcon.className = 'fa-solid fa-volume-xmark';
    soundToggleBtn.style.color = '#fff';
  }
});

// Responsive resize
window.addEventListener('resize', () => {
  const radius = getCarouselRadius();
  document.querySelectorAll('.toy-showcase-card').forEach((card) => {
    const angle = card.dataset.angle;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
});

// Keyboard
window.addEventListener('keydown', (e) => {
  if (!revealModal.classList.contains('hide')) {
    if (e.key === 'Escape') closeRevealModal();
  } else if (!collectionBookModal.classList.contains('hide')) {
    if (e.key === 'Escape') closeBookModal();
  } else if (!showcaseView.classList.contains('hide')) {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === ' ') {
      e.preventDefault();
      autoSpinBtn.click();
    }
  } else {
    if (e.key === ' ' || e.key === 'Enter') {
      openBlindBox();
    }
  }
});

// ===================================================================
// Start Application
// ===================================================================
const ambient = new AmbientStars(ambientCanvas);
ambient.render();

const confetti = new ConfettiManager(confettiCanvas);

updateCollectionBadge();
buildShowcaseItems();
setupShowcaseDragging();
startShowcaseLoop();
