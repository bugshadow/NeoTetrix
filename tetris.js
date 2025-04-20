document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startButton = document.getElementById('start-button');
    const retryButton = document.getElementById('retry-button');
    const nextLevelButton = document.getElementById('next-level-button');
    const menuButton = document.getElementById('menu-button');
    const menuButtonGameOver = document.getElementById('menu-button-game-over');
    const instructionsButton = document.getElementById('instructions-button');
    const backButton = document.getElementById('back-button');
    const pauseButton = document.getElementById('pause-button');
    const highScoresButton = document.getElementById('high-scores-button');
    const backFromScoresButton = document.getElementById('back-from-scores-button');
    const resumeButton = document.getElementById('resume-button');
    const restartButton = document.getElementById('restart-button');
    const exitButton = document.getElementById('exit-button');
    const powerButton = document.getElementById('power-button');
    
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const finalScoreElement = document.getElementById('final-score');
    const winScoreElement = document.getElementById('win-score');
    const finalModeElement = document.getElementById('final-mode');
    const winModeElement = document.getElementById('win-mode');
    const modeDisplayElement = document.getElementById('mode-display').querySelector('span');
    const currentPowerElement = document.getElementById('current-power');
    
    const menuScreen = document.getElementById('menu');
    const gameScreen = document.getElementById('game');
    const gameOverScreen = document.getElementById('game-over');
    const winScreen = document.getElementById('win');
    const instructionsScreen = document.getElementById('instructions');
    const highScoresScreen = document.getElementById('high-scores-screen');
    const pauseScreen = document.getElementById('pause-screen');
    const challengeContainer = document.getElementById('challenge-container');
    const challengeText = document.getElementById('challenge-text');
    const challengeTimer = document.getElementById('challenge-timer');
    
    // Mode buttons
    const modeClassicButton = document.getElementById('mode-classic');
    const modeChallengeButton = document.getElementById('mode-challenge');
    const modeSpeedButton = document.getElementById('mode-speed');
    
    // High score tabs
    const scoreTabButtons = document.querySelectorAll('.score-tab');
    
    // Mobile control buttons
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const downButton = document.getElementById('down-button');
    const rotateButton = document.getElementById('rotate-button');
    const dropButton = document.getElementById('drop-button');
    const mobilePauseButton = document.getElementById('mobile-pause-button');
    
    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('next-piece');
    const nextPieceCtx = nextPieceCanvas.getContext('2d');
    
    // Game constants
    const ROWS = 20;
    const COLS = 10;
    const BLOCK_SIZE = 30;
    const COLORS = [
        null,
        '#FF00FF', // I - Magenta
        '#15EDA3', // J - Cyan
        '#FF3366', // L - Pink
        '#FFCC00', // O - Yellow
        '#33CCFF', // S - Light Blue
        '#FF9900', // T - Orange
        '#CC66FF'  // Z - Purple
    ];
    
    // Level themes based on level
    const LEVEL_THEMES = [
        { primary: '#2e026d', secondary: '#ff00ff', accent: '#15eda3' }, // Level 1
        { primary: '#0b4545', secondary: '#00ffcc', accent: '#ff5e5e' }, // Level 2
        { primary: '#45046a', secondary: '#9a0f98', accent: '#ea0599' }, // Level 3
        { primary: '#4c0033', secondary: '#790252', accent: '#af0171' }, // Level 4
        { primary: '#000000', secondary: '#ff0000', accent: '#ffff00' }, // Level 5
        { primary: '#3d0066', secondary: '#ff9e00', accent: '#00ffff' }, // Level 6
        { primary: '#1a0000', secondary: '#b30000', accent: '#ff7b00' }, // Level 7
        { primary: '#000066', secondary: '#6600ff', accent: '#00ffcc' }, // Level 8
        { primary: '#270082', secondary: '#7a0bc0', accent: '#fa58b6' }, // Level 9
        { primary: '#000000', secondary: '#ff00ff', accent: '#00ffff' }  // Level 10
    ];
    
    // Game modes
    const GAME_MODES = {
        CLASSIC: 'classic',
        CHALLENGE: 'challenge',
        SPEED: 'speed'
    };
    
    // Game variables
    let board = [];
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let level = 1;
    let gameSpeed = 1000; // Initial drop speed in ms
    let gameOver = false;
    let gameInterval = null;
    let isPaused = false;
    let pauseOverlay = null;
    let currentGameMode = GAME_MODES.CLASSIC;
    let currentPower = null;
    let challengeInterval = null;
    let challengeTimeLeft = 0;
    
    // High scores for different modes
    let highScores = {
        classic: [],
        challenge: [],
        speed: []
    };
    const MAX_HIGH_SCORES = 5;
    
    // Target score to win the level
    const targetScore = 1000;
    
    // Tetromino shapes
    const SHAPES = [
        [],
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[2, 0, 0], [2, 2, 2], [0, 0, 0]],                         // J
        [[0, 0, 3], [3, 3, 3], [0, 0, 0]],                         // L
        [[0, 4, 4], [0, 4, 4], [0, 0, 0]],                         // O
        [[0, 5, 5], [5, 5, 0], [0, 0, 0]],                         // S
        [[0, 6, 0], [6, 6, 6], [0, 0, 0]],                         // T
        [[7, 7, 0], [0, 7, 7], [0, 0, 0]]                          // Z
    ];
    
    // Sound effects with error handling
    const sounds = {
        move: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3'),
        rotate: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3'),
        clear: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-complete-or-approved-mission-205.mp3'),
        drop: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-explainer-video-game-alert-sweep-236.mp3'),
        gameOver: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-losing-or-failing-2042.mp3'),
        levelUp: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
        buttonClick: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cool-interface-click-tone-2568.mp3'),
        menuNavigate: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
        powerUp: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3'),
        powerActivate: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fairy-magic-sparkle-871.mp3'),
        gameStart: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.mp3'),
        challengeComplete: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        challengeFail: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-tap-2569.mp3'),
        pause: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3'),
        resume: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'),
        highScore: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-notification-2018.mp3')
    };
    
    // Global variable for sound state
    let soundEnabled = true;
    
    // Safe sound play function
    function playSound(soundName) {
        try {
            if (sounds[soundName] && soundEnabled) {
                // Créer une nouvelle instance pour éviter les problèmes de lecture
                const sound = new Audio(sounds[soundName].src);
                sound.volume = 0.7; // Augmenter le volume
                
                // Forcer le son à jouer
                sound.play().catch(err => {
                    console.log('Audio play error:', err);
                    // Essayer encore une fois avec interaction utilisateur
                    document.addEventListener('click', function playOnClick() {
                        sound.play();
                        document.removeEventListener('click', playOnClick);
                    }, { once: true });
                });
            }
        } catch (error) {
            console.log('Sound error:', error);
        }
    }
    
    // Fonction pour précharger les sons
    function preloadSounds() {
        console.log('Préchargement des sons...');
        Object.keys(sounds).forEach(key => {
            // Forcer le chargement en ajoutant un gestionnaire d'événements
            sounds[key].addEventListener('canplaythrough', function loadHandler() {
                console.log(`Son ${key} chargé`);
                sounds[key].removeEventListener('canplaythrough', loadHandler);
            });
            sounds[key].load();
        });
        
        // Jouer un son de test pour débloquer l'audio
        document.addEventListener('click', function initialClick() {
            playSound('buttonClick');
            document.removeEventListener('click', initialClick);
        }, { once: true });
    }
    
    // Toggle sound on/off
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) {
            if (soundEnabled) {
                soundIcon.classList.remove('fa-volume-mute');
                soundIcon.classList.add('fa-volume-up');
            } else {
                soundIcon.classList.remove('fa-volume-up');
                soundIcon.classList.add('fa-volume-mute');
            }
        }
    }
    
    // Initialize the game board
    function initBoard() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
    
    // Generate a random piece
    function randomPiece() {
        const randomIndex = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        const piece = {
            shape: SHAPES[randomIndex],
            color: COLORS[randomIndex],
            row: 0,
            col: Math.floor(COLS / 2) - 1
        };
        return piece;
    }
    
    // Draw a single block
    function drawBlock(ctx, row, col, color, strokeStyle = 'rgba(255, 255, 255, 0.5)', shadowColor = 'rgba(0, 0, 0, 0.3)') {
        const x = col * BLOCK_SIZE;
        const y = row * BLOCK_SIZE;
        
        // Shadow
        ctx.fillStyle = shadowColor;
        ctx.fillRect(x + 4, y + 4, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(x, y, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        
        // Highlight
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y + BLOCK_SIZE - 2);
        ctx.lineTo(x, y);
        ctx.lineTo(x + BLOCK_SIZE - 2, y);
        ctx.stroke();
        
        // Shadow line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x + BLOCK_SIZE - 2, y);
        ctx.lineTo(x + BLOCK_SIZE - 2, y + BLOCK_SIZE - 2);
        ctx.lineTo(x, y + BLOCK_SIZE - 2);
        ctx.stroke();
    }
    
    // Particle system
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * -3 - 1;
            this.color = color;
            this.alpha = 1;
            this.gravity = 0.1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.gravity;
            this.alpha -= 0.02;
            this.size -= 0.1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Particles array
    let particles = [];
    
    // Add particles for cleared rows
    function addParticlesForRow(row) {
        const y = row * BLOCK_SIZE + BLOCK_SIZE / 2;
        
        for (let col = 0; col < COLS; col++) {
            const x = col * BLOCK_SIZE + BLOCK_SIZE / 2;
            const color = COLORS[board[row][col]];
            
            // Add multiple particles per block
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(x, y, color));
            }
        }
    }
    
    // Update and draw particles
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            // Remove particles when they fade out
            if (particles[i].alpha <= 0 || particles[i].size <= 0) {
                particles.splice(i, 1);
            }
        }
    }
    
    // Draw the game board
    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        // Draw vertical grid lines
        for (let col = 0; col <= COLS; col++) {
            ctx.beginPath();
            ctx.moveTo(col * BLOCK_SIZE, 0);
            ctx.lineTo(col * BLOCK_SIZE, ROWS * BLOCK_SIZE);
            ctx.stroke();
        }
        
        // Draw horizontal grid lines
        for (let row = 0; row <= ROWS; row++) {
            ctx.beginPath();
            ctx.moveTo(0, row * BLOCK_SIZE);
            ctx.lineTo(COLS * BLOCK_SIZE, row * BLOCK_SIZE);
            ctx.stroke();
        }
        
        // Draw the placed blocks
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col]) {
                    drawBlock(ctx, row, col, COLORS[board[row][col]]);
                }
            }
        }
        
        // Draw current piece
        if (currentPiece) {
            for (let r = 0; r < currentPiece.shape.length; r++) {
                for (let c = 0; c < currentPiece.shape[r].length; c++) {
                    if (currentPiece.shape[r][c]) {
                        const pieceRow = currentPiece.row + r;
                        const pieceCol = currentPiece.col + c;
                        
                        if (pieceRow >= 0) {
                            drawBlock(ctx, pieceRow, pieceCol, currentPiece.color);
                        }
                    }
                }
            }
        }
        
        // Draw ghost piece (preview of where the piece will land)
        drawGhostPiece();
        
        // Update and draw particles
        updateParticles();
        
        // Draw pause overlay if game is paused
        if (isPaused) {
            drawPauseOverlay();
        }
    }
    
    // Draw pause overlay
    function drawPauseOverlay() {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Pause text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '30px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2 - 40);
        
        // Instruction text
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Appuyez sur P pour continuer', canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // Draw the ghost piece
    function drawGhostPiece() {
        if (!currentPiece) return;
        
        const ghostPiece = {
            shape: currentPiece.shape.map(row => [...row]), // Deep copy to avoid reference issues
            row: currentPiece.row,
            col: currentPiece.col,
            color: 'rgba(255, 255, 255, 0.2)'
        };
        
        // Move ghost piece down as far as it can go
        while (!collision(ghostPiece, 0, 1)) {
            ghostPiece.row++;
        }
        
        // Draw the ghost piece if it's not at the same position as the current piece
        if (ghostPiece.row > currentPiece.row) {
            for (let r = 0; r < ghostPiece.shape.length; r++) {
                for (let c = 0; c < ghostPiece.shape[r].length; c++) {
                    if (ghostPiece.shape[r][c]) {
                        const pieceRow = ghostPiece.row + r;
                        const pieceCol = ghostPiece.col + c;
                        
                        if (pieceRow >= 0) {
                            ctx.fillStyle = ghostPiece.color;
                            ctx.fillRect(
                                pieceCol * BLOCK_SIZE, 
                                pieceRow * BLOCK_SIZE, 
                                BLOCK_SIZE - 2, 
                                BLOCK_SIZE - 2
                            );
                            
                            // Outline
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(
                                pieceCol * BLOCK_SIZE, 
                                pieceRow * BLOCK_SIZE, 
                                BLOCK_SIZE - 2, 
                                BLOCK_SIZE - 2
                            );
                        }
                    }
                }
            }
        }
    }
    
    // Draw the next piece preview
    function drawNextPiece() {
        nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        
        if (!nextPiece) return;
        
        const blockSize = 20;
        const centerX = (nextPieceCanvas.width / 2) - (nextPiece.shape[0].length * blockSize / 2);
        const centerY = (nextPieceCanvas.height / 2) - (nextPiece.shape.length * blockSize / 2);
        
        for (let r = 0; r < nextPiece.shape.length; r++) {
            for (let c = 0; c < nextPiece.shape[r].length; c++) {
                if (nextPiece.shape[r][c]) {
                    const x = centerX + c * blockSize;
                    const y = centerY + r * blockSize;
                    
                    // Shadow
                    nextPieceCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    nextPieceCtx.fillRect(x + 2, y + 2, blockSize - 2, blockSize - 2);
                    
                    // Block
                    nextPieceCtx.fillStyle = nextPiece.color;
                    nextPieceCtx.fillRect(x, y, blockSize - 2, blockSize - 2);
                    
                    // Highlight
                    nextPieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    nextPieceCtx.lineWidth = 1;
                    nextPieceCtx.beginPath();
                    nextPieceCtx.moveTo(x, y + blockSize - 2);
                    nextPieceCtx.lineTo(x, y);
                    nextPieceCtx.lineTo(x + blockSize - 2, y);
                    nextPieceCtx.stroke();
                    
                    // Shadow line
                    nextPieceCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    nextPieceCtx.beginPath();
                    nextPieceCtx.moveTo(x + blockSize - 2, y);
                    nextPieceCtx.lineTo(x + blockSize - 2, y + blockSize - 2);
                    nextPieceCtx.lineTo(x, y + blockSize - 2);
                    nextPieceCtx.stroke();
                }
            }
        }
    }
    
    // Check for collision
    function collision(piece, rowOffset, colOffset) {
        if (!piece || !piece.shape) return true; // Safety check
        
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (!piece.shape[r][c]) continue;
                
                const newRow = piece.row + r + rowOffset;
                const newCol = piece.col + c + colOffset;
                
                if (newRow < 0) continue;
                
                if (
                    newRow >= ROWS || 
                    newCol < 0 || 
                    newCol >= COLS || 
                    (newRow >= 0 && board[newRow] && board[newRow][newCol])
                ) {
                    // Play collision sound for wall hits if moving horizontally
                    if (colOffset !== 0 && rowOffset === 0) {
                        playSound('move');
                    }
                    return true;
                }
            }
        }
        return false;
    }
    
    // Lock the piece in place and generate a new one
    function lockPiece() {
        if (!currentPiece) return; // Safety check
        
        // Play lock sound
        playSound('drop');
        
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c]) {
                    const newRow = currentPiece.row + r;
                    
                    // If the piece locks above the board, game over
                    if (newRow < 0) {
                        gameOver = true;
                        return;
                    }
                    
                    // Make sure we don't go out of bounds
                    if (newRow >= 0 && newRow < ROWS && 
                        currentPiece.col + c >= 0 && currentPiece.col + c < COLS) {
                        board[newRow][currentPiece.col + c] = currentPiece.shape[r][c];
                    }
                }
            }
        }
        
        // Check for completed rows
        checkRows();
        
        // Update score display
        updateScore();
        
        // Generate new pieces
        currentPiece = nextPiece;
        nextPiece = randomPiece();
        drawNextPiece();
        
        // Check if the new piece immediately collides (game over)
        if (collision(currentPiece, 0, 0)) {
            gameOver = true;
        }
    }
    
    // Check for completed rows
    function checkRows() {
        let rowsCleared = 0;
        
        for (let row = 0; row < ROWS; row++) {
            if (board[row] && board[row].every(cell => cell !== 0)) {
                // Remove the row and add an empty one at the top
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
                rowsCleared++;
                
                // Add visual effect for cleared rows
                addClearEffect(row);
            }
        }
        
        // Update score based on rows cleared
        if (rowsCleared > 0) {
            playSound('clear');
            const points = [0, 100, 300, 500, 800][Math.min(rowsCleared, 4)] * level;
            score += points;
            
            // Check for level up
            if (score >= targetScore * level) {
                levelUp();
            }
        }
    }
    
    // Add visual effect for cleared rows
    function addClearEffect(row) {
        // Flash the row
        ctx.fillStyle = 'white';
        ctx.fillRect(0, row * BLOCK_SIZE, canvas.width, BLOCK_SIZE);
        
        // Add particles
        addParticlesForRow(row);
        
        // Redraw board after flash effect
        setTimeout(() => {
            drawBoard();
        }, 100);
    }
    
    // Move the current piece
    function movePiece(rowOffset, colOffset) {
        if (!currentPiece || gameOver || isPaused) return false;
        
        if (!collision(currentPiece, rowOffset, colOffset)) {
            currentPiece.row += rowOffset;
            currentPiece.col += colOffset;
            
            if (colOffset !== 0) {
                playSound('move');
            }
            
            drawBoard();
            return true;
        }
        
        // If we tried to move down and couldn't, lock the piece
        if (rowOffset > 0) {
            lockPiece();
            playSound('drop');
            
            if (gameOver) {
                endGame();
            }
        }
        
        return false;
    }
    
    // Rotate the current piece
    function rotatePiece() {
        if (isPaused || gameOver) return; // Don't rotate if game is paused or over
        
        const size = currentPiece.shape.length;
        const newShape = [];
        
        // Create a rotated shape
        for (let i = 0; i < size; i++) {
            newShape[i] = [];
            for (let j = 0; j < size; j++) {
                newShape[i][j] = currentPiece.shape[size - 1 - j][i];
            }
        }
        
        // Store the original shape in case we need to revert
        const originalShape = JSON.parse(JSON.stringify(currentPiece.shape));
        
        currentPiece.shape = newShape;
        
        // Check if the new position is valid
        if (!isValidPosition()) {
            // Revert back to original shape if invalid
            currentPiece.shape = originalShape;
            return false;
        }
        
        // Check if this rotation occurred during a "no rotate" challenge
        if (currentChallenge && currentChallenge.type === 'norotate') {
            window.challengeRotated = true;
            console.log('Rotation detected during no-rotate challenge');
        }
        
        // Play rotation sound
        playSound('rotate');
        
        // Update ghost piece
        updateGhostPiece();
        
        // Render the updated game state
        renderGame();
        
        return true;
    }
    
    // Drop the piece all the way down
    function hardDrop() {
        if (!currentPiece || gameOver || isPaused) return;
        
        let dropDistance = 0;
        
        while (!collision(currentPiece, dropDistance + 1, 0)) {
            dropDistance++;
        }
        
        if (dropDistance > 0) {
            currentPiece.row += dropDistance;
            score += dropDistance;
            lockPiece();
            playSound('drop');
            
            drawBoard();
            updateScore();
            
            if (gameOver) {
                endGame();
            }
        }
    }
    
    // Update the score display
    function updateScore() {
        scoreElement.textContent = score;
        levelElement.textContent = level;
    }

    // Level up function
    function levelUp() {
        level++;
        playSound('levelUp');
        
        // Update game speed
        clearInterval(gameInterval);
        gameSpeed = Math.max(100, 1000 - (level - 1) * 100);
        gameInterval = setInterval(gameLoop, gameSpeed);
        
        // Update background theme based on level
        updateBackgroundTheme();
        
        // Show temporary level up message
        showLevelUpMessage();
        
        // Show win screen if player reaches level 10
        if (level > 10) {
            showWinScreen();
        }
    }
    
    // Update background theme based on level
    function updateBackgroundTheme() {
        // Get theme for current level (capped at max theme index)
        const themeIndex = Math.min(level - 1, LEVEL_THEMES.length - 1);
        const theme = LEVEL_THEMES[themeIndex];
        
        // Update CSS variables
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }
    
    // Show level up message
    function showLevelUpMessage() {
        // Play level up sound
        playSound('levelUp');
        
        // Create level up overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '10px';
        overlay.style.boxShadow = '0 0 20px var(--accent-color)';
        overlay.style.zIndex = '100';
        overlay.style.textAlign = 'center';
        overlay.style.animation = 'fadeIn 0.5s ease-in-out';
        overlay.innerHTML = `
            <h2 style="color: var(--accent-color); margin-bottom: 10px;">NIVEAU ${level} !</h2>
            <p style="color: white; font-size: 14px;">Vitesse: ${Math.round((1000 - gameSpeed) / 10)}%</p>
        `;
        
        gameScreen.appendChild(overlay);
        
        // Remove after 2 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.5s ease-in-out';
            overlay.addEventListener('animationend', () => {
                if (overlay.parentNode) {
                    gameScreen.removeChild(overlay);
                }
            });
        }, 1500);
        
        // Add celebration particles
        createCelebrationParticles();
    }
    
    // Create particles for level up celebration
    function createCelebrationParticles() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Add multiple particles
        for (let i = 0; i < 100; i++) {
            const x = centerX + (Math.random() - 0.5) * canvas.width;
            const y = centerY + (Math.random() - 0.5) * canvas.height;
            
            // Random color from our theme
            const colors = [
                getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'),
                getComputedStyle(document.documentElement).getPropertyValue('--accent-color')
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push(new Particle(x, y, color));
        }
    }
    
    // Game main loop
    function gameLoop() {
        if (!gameOver && !isPaused) {
            movePiece(1, 0); // Move down by 1
        }
    }
    
    // Start a new game
    function startGame() {
        console.log('startGame function called');
        
        try {
            // Play start game sound
            playSound('gameStart');
            
            // Reset game state
            initBoard();
            score = 0;
            level = 1;
            gameOver = false;
            isPaused = false;
            currentPower = null;
            particles = [];
            
            // Set up game based on mode
            switch(currentGameMode) {
                case GAME_MODES.CLASSIC:
                    gameSpeed = 1000;
                    break;
                case GAME_MODES.CHALLENGE:
                    gameSpeed = 800;
                    try {
                        startRandomChallenge();
                    } catch (e) {
                        console.error('Error starting challenge:', e);
                    }
                    break;
                case GAME_MODES.SPEED:
                    gameSpeed = 400;
                    break;
                default:
                    gameSpeed = 1000;
                    break;
            }
            
            // Generate initial pieces
            currentPiece = randomPiece();
            nextPiece = randomPiece();
            
            // Update displays
            updateScore();
            drawBoard();
            drawNextPiece();
            currentPowerElement.textContent = 'Aucun';
            
            // Start game interval
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
            
            // Update final mode displays
            finalModeElement.textContent = modeDisplayElement.textContent;
            winModeElement.textContent = modeDisplayElement.textContent;
            
            // Hide menu and show game
            hideAllScreens();
            gameScreen.classList.add('active');
            
            console.log('Game started successfully');
            
            // Occasionally give the player a power-up
            startPowerUpTimer();
            
        } catch (e) {
            console.error('Error starting game:', e);
        }
    }
    
    // Start power-up timer
    function startPowerUpTimer() {
        // Give player a power-up every 30-60 seconds
        setInterval(() => {
            if (gameOver || isPaused) return;
            
            const powers = ['bomb', 'transform', 'slow', 'clear'];
            currentPower = powers[Math.floor(Math.random() * powers.length)];
            currentPowerElement.textContent = currentPower.charAt(0).toUpperCase() + currentPower.slice(1);
            
            // Play power-up received sound
            playSound('powerUp');
            
            // Show notification
            const notification = document.createElement('div');
            notification.textContent = 'NOUVEAU POUVOIR!';
            notification.style.position = 'absolute';
            notification.style.bottom = '100px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = 'var(--accent-color)';
            notification.style.padding = '10px';
            notification.style.borderRadius = '5px';
            notification.style.fontFamily = '"Press Start 2P", cursive';
            notification.style.fontSize = '12px';
            notification.style.zIndex = '100';
            
            gameScreen.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    gameScreen.removeChild(notification);
                }
            }, 3000);
            
        }, Math.random() * 30000 + 30000); // 30-60 seconds
    }
    
    // High scores
    // Load high scores from local storage
    function loadHighScores() {
        const savedScores = localStorage.getItem('tetrisHighScores');
        if (savedScores) {
            highScores = JSON.parse(savedScores);
        }
    }

    // Save high scores to local storage
    function saveHighScores() {
        localStorage.setItem('tetrisHighScores', JSON.stringify(highScores));
    }

    // Add a new high score
    function addHighScore(score) {
        const mode = currentGameMode || GAME_MODES.CLASSIC;
        
        // Play high score sound
        playSound('highScore');
        
        // Create dialog HTML
        const dialogHTML = `
            <div id="player-name-dialog" class="player-name-dialog" style="display: flex;">
                <div class="dialog-content">
                    <h3>Nouveau Meilleur Score!</h3>
                    <p>Score: ${score}</p>
                    <input type="text" id="player-name-input" placeholder="Entrez votre nom" maxlength="20" autofocus>
                    <button id="save-score-button">SAUVEGARDER</button>
                </div>
            </div>
        `;
        
        // Add dialog to body
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        
        const dialog = document.getElementById('player-name-dialog');
        const nameInput = document.getElementById('player-name-input');
        const saveButton = document.getElementById('save-score-button');
        
        // Set focus on input
        setTimeout(() => nameInput.focus(), 100);
        
        // Handle save button click
        saveButton.addEventListener('click', function saveScore() {
            const playerName = nameInput.value.trim() || 'Joueur';
            
            // Add score to the list
            if (!highScores[mode]) {
                highScores[mode] = [];
            }
            
            const newScore = { 
                score, 
                name: playerName,
                date: new Date().toLocaleDateString(), 
                level: level 
            };
            
            highScores[mode].push(newScore);
            
            // Sort by score (highest first)
            highScores[mode].sort((a, b) => b.score - a.score);
            
            // Keep only top scores
            highScores[mode] = highScores[mode].slice(0, MAX_HIGH_SCORES);
            
            // Save to local storage
            saveHighScores();
            
            // Remove dialog
            document.body.removeChild(dialog);
            
            // Clean up event listener
            saveButton.removeEventListener('click', saveScore);
            
            // Return position of new score
            return highScores[mode].findIndex(entry => 
                entry.score === newScore.score && 
                entry.name === newScore.name && 
                entry.date === newScore.date
            );
        });
        
        // Handle Enter key
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveButton.click();
            }
        });
    }

    // Display high scores on game over and win screens
    function displayHighScores(mode) {
        // Utiliser le mode spécifié, ou le mode courant si aucun mode n'est spécifié
        const scoreMode = mode || currentGameMode || GAME_MODES.CLASSIC;
        
        console.log(`Affichage des scores pour le mode: ${scoreMode}`);
        
        const highScoresList = document.getElementById('high-scores-list');
        const scoresForMode = highScores[scoreMode] || [];
        
        highScoresList.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Rang</th>
                        <th>Nom</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${scoresForMode.length === 0 ? 
                        `<tr><td colspan="4" class="no-scores">Aucun score enregistré pour ce mode</td></tr>` :
                        scoresForMode.map((score, index) => `
                        <tr>
                            <td class="rank">${index + 1}</td>
                            <td class="name">${score.name || 'Anonyme'}</td>
                            <td class="score">${score.score}</td>
                            <td class="date">${new Date(score.date).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // End the game
    function endGame() {
        clearInterval(gameInterval);
        gameOver = true;
        playSound('gameOver');
        
        // Add to high scores if score is above 0
        if (score > 0) {
            addHighScore(score);
        }
        
        // Update final score display
        finalScoreElement.textContent = score;
        
        // Show game over screen
        setTimeout(() => {
            hideAllScreens();
            gameOverScreen.classList.add('active');
            
            // Display high scores
            const existingScores = gameOverScreen.querySelector('.high-scores');
            if (existingScores) {
                existingScores.remove();
            }
            displayHighScores(currentGameMode);
        }, 1000);
    }

    // Show win screen
    function showWinScreen() {
        clearInterval(gameInterval);
        gameOver = true;
        
        // Play win sound
        playSound('challengeComplete');
        
        // Add to high scores
        addHighScore(score);
        
        // Update final score display for win
        winScoreElement.textContent = score;
        
        // Show win screen
        setTimeout(() => {
            hideAllScreens();
            winScreen.classList.add('active');
            
            // Display high scores
            const existingScores = winScreen.querySelector('.high-scores');
            if (existingScores) {
                existingScores.remove();
            }
            displayHighScores(currentGameMode);
        }, 1000);
    }
    
    // Hide all screens
    function hideAllScreens() {
        menuScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');
        winScreen.classList.remove('active');
        instructionsScreen.classList.remove('active');
        highScoresScreen.classList.remove('active');
        pauseScreen.classList.remove('active');
    }
    
    // Return to main menu
    function showMenu() {
        // Play menu navigation sound
        playSound('menuNavigate');
        
        clearInterval(gameInterval);
        hideAllScreens();
        menuScreen.classList.add('active');
    }
    
    // Setup event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (gameOver) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    if (!isPaused) movePiece(0, -1);
                    break;
                case 'ArrowRight':
                    if (!isPaused) movePiece(0, 1);
                    break;
                case 'ArrowDown':
                    if (!isPaused) movePiece(1, 0);
                    break;
                case 'ArrowUp':
                    if (!isPaused) rotatePiece();
                    break;
                case ' ':
                    if (!isPaused) hardDrop();
                    break;
                case 'p':
                case 'P':
                    togglePause();
                    break;
                case 'Escape':
                    if (isPaused) {
                        showMenu();
                    } else {
                        togglePause();
                    }
                    break;
            }
        });
        
        // Button event listeners with sounds
        startButton.addEventListener('click', () => {
            playSound('buttonClick');
            startGame();
        });
        
        retryButton.addEventListener('click', () => {
            playSound('buttonClick');
            startGame();
        });
        
        nextLevelButton.addEventListener('click', () => {
            playSound('buttonClick');
            startGame();
        });
        
        menuButton.addEventListener('click', () => {
            playSound('buttonClick');
            showMenu();
        });
        
        menuButtonGameOver.addEventListener('click', () => {
            playSound('buttonClick');
            showMenu();
        });
        
        instructionsButton.addEventListener('click', () => {
            playSound('buttonClick');
            showInstructions();
        });
        
        backButton.addEventListener('click', () => {
            console.log('Back button clicked');
            playSound('buttonClick');
            
            // Animation de sortie
            instructionsScreen.style.animation = 'fadeOut 0.3s ease-in-out';
            
            // Attendre la fin de l'animation avant de changer d'écran
            setTimeout(() => {
                instructionsScreen.style.animation = '';
                showMenu();
            }, 300);
        });
        
        pauseButton.addEventListener('click', () => {
            playSound('buttonClick');
            togglePause();
        });
        
        // Mobile control buttons
        leftButton.addEventListener('click', () => {
            if (!isPaused && !gameOver) {
                playSound('move');
                movePiece(0, -1);
            }
        });
        
        rightButton.addEventListener('click', () => {
            if (!isPaused && !gameOver) {
                playSound('move');
                movePiece(0, 1);
            }
        });
        
        downButton.addEventListener('click', () => {
            if (!isPaused && !gameOver) {
                playSound('move');
                movePiece(1, 0);
            }
        });
        
        rotateButton.addEventListener('click', () => {
            if (!isPaused && !gameOver) {
                playSound('rotate');
                rotatePiece();
            }
        });
        
        dropButton.addEventListener('click', () => {
            if (!isPaused && !gameOver) {
                playSound('drop');
                hardDrop();
            }
        });
        
        // Mobile pause button
        mobilePauseButton.addEventListener('click', () => {
            playSound('buttonClick');
            togglePause();
        });
        
        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            if (isPaused || gameOver) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchmove', (e) => {
            if (isPaused || gameOver) return;
            e.preventDefault();
        }, { passive: false });
        
        canvas.addEventListener('touchend', (e) => {
            if (isPaused || gameOver) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            
            // Determine direction of swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (Math.abs(diffX) > 30) { // Minimum swipe distance
                    if (diffX > 0) {
                        movePiece(0, 1); // Right
                    } else {
                        movePiece(0, -1); // Left
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(diffY) > 30) { // Minimum swipe distance
                    if (diffY > 0) {
                        hardDrop(); // Down - hard drop
                    } else {
                        rotatePiece(); // Up - rotate
                    }
                }
            }
            
            e.preventDefault();
        }, { passive: false });
        
        // Double tap to rotate
        let lastTap = 0;
        canvas.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                rotatePiece();
                e.preventDefault();
            }
            lastTap = currentTime;
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Mode selection buttons
        modeClassicButton.addEventListener('click', () => {
            playSound('menuNavigate');
            setGameMode(GAME_MODES.CLASSIC);
        });
        
        modeChallengeButton.addEventListener('click', () => {
            playSound('menuNavigate');
            setGameMode(GAME_MODES.CHALLENGE);
        });
        
        modeSpeedButton.addEventListener('click', () => {
            playSound('menuNavigate');
            setGameMode(GAME_MODES.SPEED);
        });
        
        // High scores
        highScoresButton.addEventListener('click', () => {
            playSound('buttonClick');
            showHighScores();
        });
        
        backFromScoresButton.addEventListener('click', () => {
            console.log('Back from scores button clicked');
            playSound('buttonClick');
            
            // Animation de sortie
            highScoresScreen.style.animation = 'fadeOut 0.3s ease-in-out';
            
            // Attendre la fin de l'animation avant de changer d'écran
            setTimeout(() => {
                highScoresScreen.style.animation = '';
                showMenu();
            }, 300);
        });
        
        // Score tabs
        scoreTabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                playSound('menuNavigate');
                
                // Remove active class from all tabs
                scoreTabButtons.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Récupérer le mode sélectionné
                const selectedMode = tab.dataset.mode;
                
                // Afficher les scores correspondants
                const highScoresList = document.getElementById('high-scores-list');
                
                // Supprimer tous les scores existants
                while (highScoresList.firstChild) {
                    highScoresList.removeChild(highScoresList.firstChild);
                }
                
                // Afficher les nouveaux scores
                displayHighScores(selectedMode);
            });
        });
        
        // Pause screen buttons
        resumeButton.addEventListener('click', () => {
            playSound('buttonClick');
            resumeGame();
        });
        
        restartButton.addEventListener('click', () => {
            playSound('buttonClick');
            startGame();
        });
        
        exitButton.addEventListener('click', () => {
            playSound('buttonClick');
            showMenu();
        });
        
        // Power button
        powerButton.addEventListener('click', () => {
            if (!isPaused && !gameOver && currentPower) {
                playSound('buttonClick');
                activatePower();
            }
        });
    }
    
    // Toggle pause with separate screen
    function togglePause() {
        console.log('Toggle pause called, current state:', isPaused);
        isPaused = !isPaused;
        
        if (isPaused) {
            console.log('Pausing game, showing pause screen');
            hideAllScreens();
            pauseScreen.classList.add('active');
            // Play pause sound
            playSound('pause');
            // Stop game loop temporarily
            clearInterval(gameInterval);
        } else {
            console.log('Resuming game');
            playSound('resume');
            resumeGame();
        }
    }
    
    // Resume game
    function resumeGame() {
        console.log('Resume game called');
        isPaused = false;
        hideAllScreens();
        gameScreen.classList.add('active');
        
        // Restart game loop
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
    
    // Handle window resize
    function handleResize() {
        // Adjust mobile controls visibility
        if (window.innerWidth <= 800) {
            document.getElementById('mobile-controls').style.display = 'flex';
        } else {
            document.getElementById('mobile-controls').style.display = 'none';
        }
    }
    
    // Show instructions screen
    function showInstructions() {
        console.log('Showing instructions screen');
        
        // Play menu navigation sound
        playSound('menuNavigate');
        
        // Arrêter le jeu s'il est en cours
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        // Masquer tous les écrans et afficher les instructions
        hideAllScreens();
        instructionsScreen.classList.add('active');
        
        // Ajouter une animation d'entrée
        instructionsScreen.style.animation = 'fadeIn 0.5s ease-in-out';
        
        // S'assurer que le contenu des instructions est visible
        const instructionsContent = document.querySelector('.instructions-content');
        if (instructionsContent) {
            instructionsContent.scrollTop = 0; // Remonter au début
        }
    }
    
    // Set game mode
    function setGameMode(mode) {
        // Reset active class on all mode buttons
        modeClassicButton.classList.remove('active');
        modeChallengeButton.classList.remove('active');
        modeSpeedButton.classList.remove('active');
        
        // Set the active mode
        currentGameMode = mode;
        
        // Update UI
        switch(mode) {
            case GAME_MODES.CLASSIC:
                modeClassicButton.classList.add('active');
                modeDisplayElement.textContent = 'Classique';
                challengeContainer.style.display = 'none';
                break;
            case GAME_MODES.CHALLENGE:
                modeChallengeButton.classList.add('active');
                modeDisplayElement.textContent = 'Challenge';
                challengeContainer.style.display = 'block';
                break;
            case GAME_MODES.SPEED:
                modeSpeedButton.classList.add('active');
                modeDisplayElement.textContent = 'Vitesse';
                challengeContainer.style.display = 'none';
                break;
        }
    }
    
    // Show high scores screen
    function showHighScores() {
        console.log('Showing high scores');
        
        // Play menu navigation sound
        playSound('menuNavigate');
        
        // Arrêter le jeu s'il est en cours
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        hideAllScreens();
        highScoresScreen.classList.add('active');
        
        // Ajouter une animation d'entrée
        highScoresScreen.style.animation = 'fadeIn 0.5s ease-in-out';
        
        // Clear previous high scores list
        const highScoresList = document.getElementById('high-scores-list');
        while (highScoresList.firstChild) {
            highScoresList.removeChild(highScoresList.firstChild);
        }
        
        // Trouver le mode actif dans les onglets
        let activeMode = 'classic';
        scoreTabButtons.forEach(tab => {
            if (tab.classList.contains('active')) {
                activeMode = tab.dataset.mode;
            }
        });
        
        // Display high scores for the active tab
        displayHighScores(activeMode);
        
        // S'assurer que l'onglet actif est correctement surligné
        scoreTabButtons.forEach(tab => {
            if (tab.dataset.mode === activeMode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Start random challenge
    function startRandomChallenge() {
        // Play sound for challenge start
        playSound('menuNavigate');
        
        // Define challenges
        const challenges = [
            { type: 'lines', target: 5, text: 'Clear 5 lines!' },
            { type: 'score', target: 1000, text: 'Score 1000 points!' },
            { type: 'survive', target: 60, text: 'Survive for 60 seconds!' },
            { type: 'norotate', target: 20, text: 'Survive for 20 seconds without rotating!' },
            { type: 'speed', target: 30, text: 'Survive for 30 seconds at high speed!' }
        ];

        // Don't start a challenge if one is already active
        if (currentChallenge) {
            clearInterval(challengeTimer);
            currentChallenge = null;
        }

        // Select a random challenge
        const randomIndex = Math.floor(Math.random() * challenges.length);
        currentChallenge = challenges[randomIndex];
        
        console.log(`Starting challenge: ${currentChallenge.type}`);
        
        // Initialize challenge-specific variables
        const startTime = Date.now();
        const startScore = score;
        const startLines = linesCleared;
        let timeLeft = currentChallenge.target;
        
        // Reset rotation tracking for no-rotate challenge
        if (currentChallenge.type === 'norotate') {
            window.challengeRotated = false;
        }
        
        // Set higher speed for speed challenge
        if (currentChallenge.type === 'speed') {
            gameSpeed = 50;  // Faster speed
        }
        
        // Display challenge text
        const challengeTextElement = document.getElementById('challenge-text');
        if (challengeTextElement) {
            challengeTextElement.textContent = currentChallenge.text;
            challengeTextElement.style.display = 'block';
        }
        
        // Set up timer for challenge
        challengeTimer = setInterval(() => {
            // Update time left for timed challenges
            if (['survive', 'norotate', 'speed'].includes(currentChallenge.type)) {
                timeLeft = Math.max(0, currentChallenge.target - Math.floor((Date.now() - startTime) / 1000));
                
                // Update timer display
                const timerElement = document.getElementById('challenge-timer');
                if (timerElement) {
                    timerElement.textContent = `${timeLeft} seconds left`;
                    timerElement.style.display = 'block';
                }
                
                // Check if time is up (success for timed challenges)
                if (timeLeft <= 0) {
                    clearInterval(challengeTimer);
                    
                    // For no-rotate challenge, check if player rotated
                    if (currentChallenge.type === 'norotate' && window.challengeRotated) {
                        showMessage('Challenge failed: You rotated a piece!', 'error');
                        playSound('challengeFail');
                    } else {
                        showMessage('Challenge completed!', 'success');
                        playSound('challengeComplete');
                        score += 2000;  // Bonus for completing challenge
                        updateScore();
                    }
                    
                    // Reset game speed if it was a speed challenge
                    if (currentChallenge.type === 'speed') {
                        resetGameSpeed();
                    }
                    
                    currentChallenge = null;
                    
                    // Hide challenge elements
                    if (challengeTextElement) challengeTextElement.style.display = 'none';
                    const timerElement = document.getElementById('challenge-timer');
                    if (timerElement) timerElement.style.display = 'none';
                }
            } else if (currentChallenge.type === 'lines') {
                // Check if enough lines have been cleared
                const linesDelta = linesCleared - startLines;
                
                // Update progress display
                const timerElement = document.getElementById('challenge-timer');
                if (timerElement) {
                    timerElement.textContent = `${linesDelta}/${currentChallenge.target} lines`;
                    timerElement.style.display = 'block';
                }
                
                if (linesDelta >= currentChallenge.target) {
                    clearInterval(challengeTimer);
                    showMessage('Challenge completed!', 'success');
                    playSound('challengeComplete');
                    score += 2000;  // Bonus for completing challenge
                    updateScore();
                    currentChallenge = null;
                    
                    // Hide challenge elements
                    if (challengeTextElement) challengeTextElement.style.display = 'none';
                    if (timerElement) timerElement.style.display = 'none';
                }
            } else if (currentChallenge.type === 'score') {
                // Check if enough score has been earned
                const scoreDelta = score - startScore;
                
                // Update progress display
                const timerElement = document.getElementById('challenge-timer');
                if (timerElement) {
                    timerElement.textContent = `${scoreDelta}/${currentChallenge.target} points`;
                    timerElement.style.display = 'block';
                }
                
                if (scoreDelta >= currentChallenge.target) {
                    clearInterval(challengeTimer);
                    showMessage('Challenge completed!', 'success');
                    playSound('challengeComplete');
                    score += 2000;  // Bonus for completing challenge
                    updateScore();
                    currentChallenge = null;
                    
                    // Hide challenge elements
                    if (challengeTextElement) challengeTextElement.style.display = 'none';
                    if (timerElement) timerElement.style.display = 'none';
                }
            }
            
            // Check if game is over
            if (isGameOver) {
                clearInterval(challengeTimer);
                if (currentChallenge) {
                    showMessage('Challenge failed: Game over!', 'error');
                    playSound('challengeFail');
                    
                    // Hide challenge elements
                    if (challengeTextElement) challengeTextElement.style.display = 'none';
                    const timerElement = document.getElementById('challenge-timer');
                    if (timerElement) timerElement.style.display = 'none';
                }
            }
        }, 1000);  // Update every second
    }
    
    // Activate power-up ability
    function activatePower() {
        console.log('Activating power:', currentPower);
        
        if (!currentPower) return;
        
        // Play power activation sound
        playSound('powerActivate');
        
        switch (currentPower) {
            case 'bomb':
                // Bomb: Clear blocks in a 3x3 area around the current piece
                bombPower();
                break;
            case 'transform':
                // Transform: Change the current piece to a random new one
                transformPower();
                break;
            case 'slow':
                // Slow: Temporarily slow down the game speed
                slowPower();
                break;
            case 'clear':
                // Clear: Remove a random row
                clearLinePower();
                break;
        }
        
        // Reset power-up
        currentPower = null;
        currentPowerElement.textContent = 'Aucun';
    }
    
    // Bomb power: Clear blocks in a 3x3 area
    function bombPower() {
        if (!currentPiece) return;
        
        // Get center position
        const centerRow = currentPiece.row + Math.floor(currentPiece.shape.length / 2);
        const centerCol = currentPiece.col + Math.floor(currentPiece.shape[0].length / 2);
        
        // Clear blocks in a 3x3 area
        for (let r = centerRow - 1; r <= centerRow + 1; r++) {
            for (let c = centerCol - 1; c <= centerCol + 1; c++) {
                if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                    board[r][c] = 0;
                }
            }
        }
        
        // Visual and sound effects
        playSound('clear');
        
        // Add particles
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle(
                centerCol * BLOCK_SIZE + BLOCK_SIZE / 2,
                centerRow * BLOCK_SIZE + BLOCK_SIZE / 2,
                '#FF5500'
            ));
        }
        
        // Update the board
        drawBoard();
    }
    
    // Transform power: Change current piece
    function transformPower() {
        if (!currentPiece) return;
        
        // Remember position
        const currentRow = currentPiece.row;
        const currentCol = currentPiece.col;
        
        // Generate new piece
        const newIndex = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
        currentPiece = {
            shape: SHAPES[newIndex],
            color: COLORS[newIndex],
            row: currentRow,
            col: currentCol
        };
        
        // Make sure it doesn't collide
        if (collision(currentPiece, 0, 0)) {
            // Try to adjust position if it collides
            for (let offset = -1; offset <= 1; offset++) {
                currentPiece.col = currentCol + offset;
                if (!collision(currentPiece, 0, 0)) {
                    break;
                }
            }
        }
        
        // Visual and sound effects
        playSound('move');
        
        // Update the board
        drawBoard();
    }
    
    // Slow power: Temporarily decrease game speed
    function slowPower() {
        // Save original speed
        const originalSpeed = gameSpeed;
        
        // Slow down game by 50%
        clearInterval(gameInterval);
        gameSpeed = gameSpeed * 2;
        gameInterval = setInterval(gameLoop, gameSpeed);
        
        // Visual effect
        const slowMessage = document.createElement('div');
        slowMessage.textContent = 'RALENTI !';
        slowMessage.style.position = 'absolute';
        slowMessage.style.top = '50%';
        slowMessage.style.left = '50%';
        slowMessage.style.transform = 'translate(-50%, -50%)';
        slowMessage.style.color = 'cyan';
        slowMessage.style.fontSize = '24px';
        slowMessage.style.fontFamily = '"Press Start 2P", cursive';
        slowMessage.style.zIndex = '100';
        
        gameScreen.appendChild(slowMessage);
        
        // Sound effect
        playSound('move');
        
        // Reset speed after 5 seconds
        setTimeout(() => {
            clearInterval(gameInterval);
            gameSpeed = originalSpeed;
            gameInterval = setInterval(gameLoop, gameSpeed);
            
            // Remove message
            if (slowMessage.parentNode) {
                gameScreen.removeChild(slowMessage);
            }
        }, 5000);
    }
    
    // Clear line power: Remove a random row
    function clearLinePower() {
        // Choose random row from the bottom half of the board
        const randomRow = Math.floor(ROWS / 2) + Math.floor(Math.random() * (ROWS / 2));
        
        // Clear the row
        for (let c = 0; c < COLS; c++) {
            board[randomRow][c] = 0;
        }
        
        // Visual effect
        addClearEffect(randomRow);
        
        // Sound effect
        playSound('clear');
    }
    
    // Create background with stars
    function createStarsBackground() {
        console.log('Creating stars background');
        try {
            const starsContainer = document.getElementById('stars-container');
            if (!starsContainer) {
                console.error('Stars container not found');
                return;
            }
            
            const numStars = 100;
            
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random positioning
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // Random size
                const size = Math.random() * 3 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // Random animation delay
                star.style.animationDelay = `${Math.random() * 5}s`;
                
                starsContainer.appendChild(star);
            }
        } catch (error) {
            console.error('Error creating stars background:', error);
        }
    }
    
    // Create sound toggle button
    function createSoundButton() {
        // Check if button already exists
        if (document.getElementById('sound-button')) return;
        
        const soundButton = document.createElement('button');
        soundButton.id = 'sound-button';
        soundButton.className = 'icon-button sound-button';
        soundButton.innerHTML = '<i id="sound-icon" class="fas fa-volume-up"></i>';
        soundButton.title = 'Toggle Sound';
        
        // Position in top right corner
        soundButton.style.position = 'absolute';
        soundButton.style.top = '20px';
        soundButton.style.right = '20px';
        soundButton.style.zIndex = '1000';
        
        document.getElementById('game-container').appendChild(soundButton);
        
        // Add event listener
        soundButton.addEventListener('click', () => {
            playSound('buttonClick');
            toggleSound();
        });
    }
    
    // Initialize the game
    function init() {
        console.log('Initializing game');
        
        try {
            // Create sound toggle button
            createSoundButton();
            
            createStarsBackground();
            initBoard();
            setupEventListeners();
            handleResize(); // Set initial mobile controls visibility
            loadHighScores(); // Load high scores
            
            // Initialize game mode
            setGameMode(GAME_MODES.CLASSIC);
            
            // Preload sounds
            preloadSounds();
            
            // Add CSS animation for fadeOut and high scores styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                .high-scores {
                    background: rgba(0, 0, 0, 0.7);
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 20px;
                    border: 2px solid var(--secondary-color);
                    max-width: 80%;
                }
                
                .high-scores h3 {
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                    color: var(--accent-color);
                    text-align: center;
                }
                
                .high-scores ul {
                    list-style-type: none;
                }
                
                .high-scores li {
                    font-size: 0.8rem;
                    margin: 5px 0;
                }
            `;
            document.head.appendChild(style);
            
            console.log('Game initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    
    // Start the game
    init();

    function showPlayerNameDialog(score, mode) {
        const dialog = document.getElementById('new-high-score-dialog');
        const scoreDisplay = dialog.querySelector('.score-value');
        const nameInput = document.getElementById('player-name-input');
        const saveButton = document.getElementById('save-score-button');

        // Afficher le score
        scoreDisplay.textContent = score;

        // Afficher la boîte de dialogue
        dialog.style.display = 'flex';

        // Focus sur le champ de saisie
        nameInput.focus();

        // Gérer la sauvegarde du score
        saveButton.onclick = function() {
            const playerName = nameInput.value.trim() || 'Anonyme';
            updateHighScores(mode, score, playerName);
            displayHighScores(mode);
            dialog.style.display = 'none';
        };

        // Gérer la touche Entrée
        nameInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                saveButton.click();
            }
        };
    }
}); 