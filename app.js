const STORAGE_KEY = 'gameHubAccounts';
const defaultProgress = {
  doge1: { coins: 0, autoMiners: 0, clickPower: 1 },
  doge2: { gems: 0, drills: 0, digPower: 1 },
  drive: { best: 0 }
};

const appState = {
  activeGame: 'doge1',
  currentUser: null,
  accounts: JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
};

const dm1Data = () => appState.currentUser?.progress.doge1 || defaultProgress.doge1;
const dm2Data = () => appState.currentUser?.progress.doge2 || defaultProgress.doge2;
const driveData = () => appState.currentUser?.progress.drive || defaultProgress.drive;

const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('app');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');
const authModeButtons = [...document.querySelectorAll('.mode-btn')];
const submitAuthBtn = document.getElementById('submitAuthBtn');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const welcomeUser = document.getElementById('welcomeUser');

const gameButtons = [...document.querySelectorAll('.game-btn')];
const gamePanels = {
  doge1: document.getElementById('doge1Panel'),
  doge2: document.getElementById('doge2Panel'),
  drive: document.getElementById('drivePanel')
};

const mineBtn1 = document.getElementById('mineBtn1');
const mineBtn2 = document.getElementById('mineBtn2');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const logoutBtn = document.getElementById('logoutBtn');
const startDriveBtn = document.getElementById('startDriveBtn');

const dm1CoinsEl = document.getElementById('dm1Coins');
const dm1MinersEl = document.getElementById('dm1Miners');
const dm1PowerEl = document.getElementById('dm1Power');
const dm1LogEl = document.getElementById('dm1Log');

const dm2GemsEl = document.getElementById('dm2Gems');
const dm2DrillsEl = document.getElementById('dm2Drills');
const dm2PowerEl = document.getElementById('dm2Power');
const dm2LogEl = document.getElementById('dm2Log');

const driveScoreEl = document.getElementById('driveScore');
const driveBestEl = document.getElementById('driveBest');
const driveCanvas = document.getElementById('driveCanvas');
const driveCtx = driveCanvas.getContext('2d');

let authMode = 'login';

function saveAccounts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.accounts));
}

function defaultUserProgress() {
  return JSON.parse(JSON.stringify(defaultProgress));
}

function showAuthMessage(text, type = 'info') {
  authMessage.textContent = text;
  authMessage.style.color = type === 'error' ? '#ff9d9d' : '#ffd166';
}

function setAuthMode(mode) {
  authMode = mode;
  authModeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  submitAuthBtn.textContent = mode === 'login' ? 'Log In' : 'Create Account';
}

function openApp(user) {
  appState.currentUser = user;
  authScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  welcomeUser.textContent = `Player: ${user.username}`;
  renderAll();
}

function closeApp() {
  appState.currentUser = null;
  appScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
  welcomeUser.textContent = 'Guest';
}

function updateProgress() {
  if (!appState.currentUser) return;
  appState.accounts[appState.currentUser.username].progress = appState.currentUser.progress;
  saveAccounts();
}

function renderDogeMiner1() {
  const stats = dm1Data();
  dm1CoinsEl.textContent = Math.floor(stats.coins);
  dm1MinersEl.textContent = stats.autoMiners;
  dm1PowerEl.textContent = stats.clickPower;
  dm1LogEl.innerHTML = `Coins: ${Math.floor(stats.coins)}<br>Auto miners: ${stats.autoMiners}<br>Click power: ${stats.clickPower}`;
}

function renderDogeMiner2() {
  const stats = dm2Data();
  dm2GemsEl.textContent = Math.floor(stats.gems);
  dm2DrillsEl.textContent = stats.drills;
  dm2PowerEl.textContent = stats.digPower;
  dm2LogEl.innerHTML = `Gems: ${Math.floor(stats.gems)}<br>Drills: ${stats.drills}<br>Dig power: ${stats.digPower}`;
}

function renderDriveMad() {
  const stats = driveData();
  driveBestEl.textContent = Math.floor(stats.best);
  driveScoreEl.textContent = Math.floor(stats.best);
}

function renderAll() {
  renderDogeMiner1();
  renderDogeMiner2();
  renderDriveMad();
  showGame(appState.activeGame);
}

function getCost(type) {
  if (type === 'dm1Auto') return 25 + dm1Data().autoMiners * 18;
  if (type === 'dm1Power') return 40 + dm1Data().clickPower * 22;
  if (type === 'dm2Drill') return 30 + dm2Data().drills * 25;
  if (type === 'dm2Power') return 50 + dm2Data().digPower * 28;
  return 0;
}

function buyUpgrade(type) {
  if (!appState.currentUser) return;

  if (type === 'dm1Auto') {
    const stats = dm1Data();
    const cost = getCost(type);
    if (stats.coins >= cost) {
      stats.coins -= cost;
      stats.autoMiners += 1;
      updateProgress();
      renderDogeMiner1();
    }
  }

  if (type === 'dm1Power') {
    const stats = dm1Data();
    const cost = getCost(type);
    if (stats.coins >= cost) {
      stats.coins -= cost;
      stats.clickPower += 1;
      updateProgress();
      renderDogeMiner1();
    }
  }

  if (type === 'dm2Drill') {
    const stats = dm2Data();
    const cost = getCost(type);
    if (stats.gems >= cost) {
      stats.gems -= cost;
      stats.drills += 1;
      updateProgress();
      renderDogeMiner2();
    }
  }

  if (type === 'dm2Power') {
    const stats = dm2Data();
    const cost = getCost(type);
    if (stats.gems >= cost) {
      stats.gems -= cost;
      stats.digPower += 1;
      updateProgress();
      renderDogeMiner2();
    }
  }
}

function showGame(gameName) {
  appState.activeGame = gameName;

  Object.entries(gamePanels).forEach(([name, panel]) => {
    panel.classList.toggle('active', name === gameName);
  });

  gameButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.game === gameName);
  });
}

gameButtons.forEach((button) => {
  button.addEventListener('click', () => showGame(button.dataset.game));
});

authModeButtons.forEach((button) => {
  button.addEventListener('click', () => setAuthMode(button.dataset.mode));
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showAuthMessage('Please fill in both fields.', 'error');
    return;
  }

  if (authMode === 'signup') {
    if (appState.accounts[username]) {
      showAuthMessage('That username already exists. Use login instead.', 'error');
      return;
    }

    appState.accounts[username] = {
      password,
      progress: JSON.parse(JSON.stringify(defaultProgress))
    };

    saveAccounts();
    showAuthMessage('Account created. You can now log in.', 'success');
    setAuthMode('login');
    usernameInput.value = '';
    passwordInput.value = '';
    return;
  }

  const account = appState.accounts[username];
  if (!account || account.password !== password) {
    showAuthMessage('Invalid username or password.', 'error');
    return;
  }

  appState.currentUser = {
    username,
    progress: account.progress || JSON.parse(JSON.stringify(defaultProgress))
  };

  account.progress = appState.currentUser.progress;
  saveAccounts();
  openApp(appState.currentUser);
});

mineBtn1.addEventListener('click', () => {
  if (!appState.currentUser) return;
  const stats = dm1Data();
  stats.coins += stats.clickPower;
  updateProgress();
  renderDogeMiner1();
});

mineBtn2.addEventListener('click', () => {
  if (!appState.currentUser) return;
  const stats = dm2Data();
  stats.gems += stats.digPower;
  updateProgress();
  renderDogeMiner2();
});

document.querySelectorAll('.upgrade-btn').forEach((button) => {
  button.addEventListener('click', () => buyUpgrade(button.dataset.upgrade));
});

logoutBtn.addEventListener('click', () => {
  closeApp();
  showAuthMessage('You have been logged out.', 'success');
});

fullscreenBtn.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen().catch(() => {});
  } else {
    await document.exitFullscreen().catch(() => {});
  }
});

document.addEventListener('fullscreenchange', () => {
  document.body.classList.toggle('fullscreen-mode', !!document.fullscreenElement);
});

let driveAnimationId = null;
let driveRunActive = false;
const driveState = {
  carX: 130,
  carY: 310,
  carWidth: 82,
  carHeight: 44,
  speed: 5,
  jumpVel: 0,
  gravity: 0.7,
  obstacles: [],
  frame: 0,
  score: 0,
  started: false,
  gameOver: false
};

function resetDriveState() {
  driveState.carX = 130;
  driveState.carY = 310;
  driveState.jumpVel = 0;
  driveState.obstacles = [];
  driveState.frame = 0;
  driveState.score = 0;
  driveState.started = true;
  driveState.gameOver = false;
}

function spawnObstacle() {
  const height = 36 + Math.random() * 110;
  driveState.obstacles.push({
    x: driveCanvas.width + 30,
    y: driveCanvas.height - height - 40,
    width: 30 + Math.random() * 36,
    height,
    color: Math.random() > 0.5 ? '#ff7d7d' : '#ffd166'
  });
}

function handleDriveInput() {
  if (!driveState.started || driveState.gameOver) return;
  if (driveState.carY >= 310) {
    driveState.jumpVel = -14;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    handleDriveInput();
  }
});

driveCanvas.addEventListener('pointerdown', () => {
  handleDriveInput();
});

function updateDriveGame() {
  if (!driveState.started || driveState.gameOver) return;

  driveState.frame += 1;
  if (driveState.frame % 55 === 0) {
    spawnObstacle();
  }

  driveState.carY += driveState.jumpVel;
  driveState.jumpVel += driveState.gravity;
  if (driveState.carY > 310) {
    driveState.carY = 310;
    driveState.jumpVel = 0;
  }

  driveState.obstacles.forEach((obstacle) => {
    obstacle.x -= driveState.speed;
  });

  driveState.obstacles = driveState.obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
  driveState.score += 1;

  const carRect = {
    x: driveState.carX,
    y: driveState.carY,
    width: driveState.carWidth,
    height: driveState.carHeight
  };

  for (const obstacle of driveState.obstacles) {
    const obstacleRect = {
      x: obstacle.x,
      y: obstacle.y,
      width: obstacle.width,
      height: obstacle.height
    };

    if (
      carRect.x < obstacleRect.x + obstacleRect.width &&
      carRect.x + carRect.width > obstacleRect.x &&
      carRect.y < obstacleRect.y + obstacleRect.height &&
      carRect.y + carRect.height > obstacleRect.y
    ) {
      driveState.gameOver = true;
      const best = driveData().best;
      if (driveState.score > best) {
        driveData().best = driveState.score;
        updateProgress();
      }
      renderDriveMad();
      break;
    }
  }

  driveScoreEl.textContent = Math.floor(driveState.score);
}

function drawDriveScene() {
  driveCtx.clearRect(0, 0, driveCanvas.width, driveCanvas.height);

  driveCtx.fillStyle = '#dff7ff';
  driveCtx.fillRect(0, 0, driveCanvas.width, driveCanvas.height);

  driveCtx.fillStyle = '#87c66a';
  driveCtx.fillRect(0, driveCanvas.height - 35, driveCanvas.width, 35);

  driveCtx.fillStyle = '#5a8d47';
  driveCtx.fillRect(0, driveCanvas.height - 50, driveCanvas.width, 15);

  // road stripes
  for (let i = 0; i < 10; i += 1) {
    const x = (i * 120) - (driveState.score * 2 % 120);
    driveCtx.fillStyle = '#e5f7ff';
    driveCtx.fillRect(x, driveCanvas.height - 130, 60, 12);
  }

  driveCtx.fillStyle = '#1b2756';
  driveCtx.fillRect(driveState.carX, driveState.carY, driveState.carWidth, driveState.carHeight);
  driveCtx.fillStyle = '#59d0ff';
  driveCtx.fillRect(driveState.carX + 12, driveState.carY + 8, 20, 14);
  driveCtx.fillRect(driveState.carX + 48, driveState.carY + 8, 20, 14);

  driveState.obstacles.forEach((obstacle) => {
    driveCtx.fillStyle = obstacle.color;
    driveCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  if (!driveState.started) {
    driveCtx.fillStyle = 'rgba(7, 15, 28, 0.55)';
    driveCtx.fillRect(0, 0, driveCanvas.width, driveCanvas.height);
    driveCtx.fillStyle = '#fff';
    driveCtx.font = 'bold 32px Arial';
    driveCtx.fillText('Press Start Run', 250, 210);
  }

  if (driveState.gameOver) {
    driveCtx.fillStyle = 'rgba(7, 15, 28, 0.6)';
    driveCtx.fillRect(0, 0, driveCanvas.width, driveCanvas.height);
    driveCtx.fillStyle = '#fff';
    driveCtx.font = 'bold 34px Arial';
    driveCtx.fillText('Crash!', 340, 190);
    driveCtx.font = '24px Arial';
    driveCtx.fillText(`Score: ${Math.floor(driveState.score)}`, 320, 232);
    driveCtx.fillText('Press Start Run to retry', 240, 270);
  }
}

function driveLoop() {
  updateDriveGame();
  drawDriveScene();
  driveAnimationId = requestAnimationFrame(driveLoop);
}

function startDriveGame() {
  if (!appState.currentUser) return;
  resetDriveState();
  startDriveBtn.textContent = 'Restart Run';
  if (!driveAnimationId) {
    driveLoop();
  }
}

startDriveBtn.addEventListener('click', startDriveGame);

setAuthMode('login');
showAuthMessage('Create an account or sign in to save your game progress.');

setInterval(() => {
  if (!appState.currentUser) return;
  const minerStats = dm1Data();
  minerStats.coins += minerStats.autoMiners;
  updateProgress();
  renderDogeMiner1();
}, 1200);

setInterval(() => {
  if (!appState.currentUser) return;
  const minerStats = dm2Data();
  minerStats.gems += minerStats.drills;
  updateProgress();
  renderDogeMiner2();
}, 1300);

function ensureCurrentUserProgress() {
  if (!appState.currentUser) return;
  const account = appState.accounts[appState.currentUser.username];
  if (!account) return;
  appState.currentUser.progress = account.progress || JSON.parse(JSON.stringify(defaultProgress));
  account.progress = appState.currentUser.progress;
}

window.addEventListener('load', () => {
  Object.keys(appState.accounts).forEach((username) => {
    if (!appState.accounts[username].progress) {
      appState.accounts[username].progress = JSON.parse(JSON.stringify(defaultProgress));
    }
  });
  saveAccounts();
  drawDriveScene();
});

window.addEventListener('beforeunload', () => {
  ensureCurrentUserProgress();
  saveAccounts();
});

showGame('doge1');
