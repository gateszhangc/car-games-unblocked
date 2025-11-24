class SurvivalRace {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'start'; // start, playing, gameover
        this.selectedCar = 0;
        this.coins = 0;
        this.players = [];
        this.hexagons = [];
        this.coinsList = [];
        this.animationId = null;
        
        // Game settings
        this.hexSize = 30;
        this.arenaRadius = 8; // hexagons from center
        this.gravity = 0.5;
        this.jumpPower = -12;
        
        // Player settings
        this.player = {
            x: 400,
            y: 300,
            vx: 0,
            vy: 0,
            width: 30,
            height: 20,
            speed: 5,
            jumping: false,
            onGround: false,
            color: '#00ff00'
        };
        
        // Controls
        this.keys = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateHexagonalArena();
        this.spawnCoins();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Prevent default for arrow keys and space
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // UI controls
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Car selection
        document.querySelectorAll('.car-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.car-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedCar = parseInt(e.target.dataset.car);
            });
        });
    }
    
    generateHexagonalArena() {
        this.hexagons = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Generate hexagonal grid
        for (let q = -this.arenaRadius; q <= this.arenaRadius; q++) {
            for (let r = -this.arenaRadius; r <= this.arenaRadius; r++) {
                const s = -q - r;
                if (Math.abs(s) <= this.arenaRadius) {
                    const x = centerX + this.hexSize * 1.5 * q;
                    const y = centerY + this.hexSize * Math.sqrt(3) * (r + q / 2);
                    
                    this.hexagons.push({
                        x: x,
                        y: y,
                        q: q,
                        r: r,
                        s: s,
                        collapsing: false,
                        collapsed: false,
                        collapseTimer: 0,
                        color: '#ffffff'
                    });
                }
            }
        }
    }
    
    spawnCoins() {
        this.coinsList = [];
        const numCoins = 20;
        
        for (let i = 0; i < numCoins; i++) {
            const hex = this.hexagons[Math.floor(Math.random() * this.hexagons.length)];
            if (hex && !hex.collapsed) {
                this.coinsList.push({
                    x: hex.x,
                    y: hex.y - 15,
                    radius: 8,
                    collected: false,
                    value: 1,
                    animation: 0
                });
            }
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('start-screen').classList.add('hidden');
        this.resetPlayer();
    }
    
    restartGame() {
        this.gameState = 'playing';
        document.getElementById('game-over').classList.add('hidden');
        this.coins = 0;
        this.updateUI();
        this.generateHexagonalArena();
        this.spawnCoins();
        this.resetPlayer();
    }
    
    resetPlayer() {
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2 - 100;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.jumping = false;
        this.player.onGround = false;
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Handle input
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.player.vx = -this.player.speed;
        } else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.player.vx = this.player.speed;
        } else {
            this.player.vx *= 0.8; // Friction
        }
        
        if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' ']) && this.player.onGround) {
            this.player.vy = this.jumpPower;
            this.player.jumping = true;
            this.player.onGround = false;
        }
        
        // Apply physics
        this.player.vy += this.gravity;
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // Check hexagon collisions
        this.checkHexagonCollisions();
        
        // Check coin collection
        this.checkCoinCollection();
        
        // Update collapsing hexagons
        this.updateCollapsingHexagons();
        
        // Check if player fell off
        if (this.player.y > this.canvas.height + 50) {
            this.gameOver();
        }
        
        // Randomly collapse hexagons
        if (Math.random() < 0.01) {
            this.collapseRandomHexagon();
        }
        
        // Update UI
        this.updateUI();
    }
    
    checkHexagonCollisions() {
        this.player.onGround = false;
        
        for (let hex of this.hexagons) {
            if (hex.collapsed) continue;
            
            // Simple rectangular collision with hexagon bounds
            const hexLeft = hex.x - this.hexSize;
            const hexRight = hex.x + this.hexSize;
            const hexTop = hex.y - this.hexSize;
            const hexBottom = hex.y + this.hexSize;
            
            const playerLeft = this.player.x - this.player.width / 2;
            const playerRight = this.player.x + this.player.width / 2;
            const playerTop = this.player.y - this.player.height / 2;
            const playerBottom = this.player.y + this.player.height / 2;
            
            if (playerRight > hexLeft && playerLeft < hexRight &&
                playerBottom > hexTop && playerTop < hexBottom) {
                
                // Landing on top of hexagon
                if (this.player.vy > 0 && playerBottom - this.player.vy <= hexTop + 10) {
                    this.player.y = hexTop - this.player.height / 2;
                    this.player.vy = 0;
                    this.player.onGround = true;
                    this.player.jumping = false;
                    
                    // Start collapse timer
                    if (!hex.collapsing && Math.random() < 0.3) {
                        hex.collapsing = true;
                    }
                }
            }
        }
    }
    
    checkCoinCollection() {
        for (let coin of this.coinsList) {
            if (coin.collected) continue;
            
            const dx = this.player.x - coin.x;
            const dy = this.player.y - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < coin.radius + this.player.width / 2) {
                coin.collected = true;
                this.coins += coin.value;
            }
        }
    }
    
    updateCollapsingHexagons() {
        for (let hex of this.hexagons) {
            if (hex.collapsing && !hex.collapsed) {
                hex.collapseTimer += 0.02;
                if (hex.collapseTimer >= 1) {
                    hex.collapsed = true;
                }
            }
        }
    }
    
    collapseRandomHexagon() {
        const activeHexagons = this.hexagons.filter(hex => !hex.collapsed && !hex.collapsing);
        if (activeHexagons.length > 0) {
            const hex = activeHexagons[Math.floor(Math.random() * activeHexagons.length)];
            hex.collapsing = true;
        }
    }
    
    gameOver() {
        this.gameState = 'gameover';
        document.getElementById('final-coins').textContent = this.coins;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    updateUI() {
        document.getElementById('coin-count').textContent = this.coins;
        document.getElementById('player-count').textContent = '1'; // In multiplayer, this would show actual player count
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw hexagons
        for (let hex of this.hexagons) {
            this.drawHexagon(hex);
        }
        
        // Draw coins
        for (let coin of this.coinsList) {
            if (!coin.collected) {
                this.drawCoin(coin);
            }
        }
        
        // Draw player
        if (this.gameState === 'playing') {
            this.drawPlayer();
        }
    }
    
    drawHexagon(hex) {
        if (hex.collapsed) return;
        
        this.ctx.save();
        this.ctx.translate(hex.x, hex.y);
        
        let alpha = 1;
        if (hex.collapsing) {
            alpha = 1 - hex.collapseTimer;
            this.ctx.scale(1 - hex.collapseTimer * 0.2, 1 - hex.collapseTimer * 0.2);
        }
        
        this.ctx.globalAlpha = alpha;
        this.ctx.strokeStyle = hex.collapsing ? '#ff0000' : '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = hex.collapsing ? '#330000' : '#111111';
        
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i;
            const x = this.hexSize * Math.cos(angle);
            const y = this.hexSize * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawCoin(coin) {
        coin.animation += 0.1;
        const bounce = Math.sin(coin.animation) * 2;
        
        this.ctx.save();
        this.ctx.translate(coin.x, coin.y + bounce);
        
        // Coin glow
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 10;
        
        // Coin body
        this.ctx.fillStyle = '#ffdd00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Coin highlight
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(-2, -2, coin.radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        
        // Car shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(-this.player.width/2 + 2, -this.player.height/2 + 5, this.player.width, this.player.height);
        
        // Car body
        const carColors = ['#00ff00', '#ff0000', '#0000ff', '#ffff00'];
        this.ctx.fillStyle = carColors[this.selectedCar];
        this.ctx.fillRect(-this.player.width/2, -this.player.height/2, this.player.width, this.player.height);
        
        // Car windows
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(-this.player.width/2 + 5, -this.player.height/2 + 3, this.player.width - 10, this.player.height - 6);
        
        // Car headlights
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(this.player.width/2 - 3, -this.player.height/2 + 2, 3, 4);
        this.ctx.fillRect(this.player.width/2 - 3, this.player.height/2 - 6, 3, 4);
        
        this.ctx.restore();
    }
    
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new SurvivalRace();
});