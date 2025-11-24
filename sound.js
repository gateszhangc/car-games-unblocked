class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.init();
    }
    
    init() {
        // Create oscillator-based sounds since we don't have actual audio files
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create sound effects
        this.createSounds();
    }
    
    createSounds() {
        // Jump sound
        this.sounds.jump = () => {
            if (!this.enabled) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
        
        // Coin collection sound
        this.sounds.coin = () => {
            if (!this.enabled) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
        
        // Platform collapse sound
        this.sounds.collapse = () => {
            if (!this.enabled) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
        
        // Game over sound
        this.sounds.gameover = () => {
            if (!this.enabled) return;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
        
        // Background music (simple loop)
        this.sounds.bgMusic = () => {
            if (!this.enabled || this.bgMusicPlaying) return;
            
            this.bgMusicPlaying = true;
            const playNote = (frequency, startTime, duration) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, startTime);
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, startTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, startTime + duration - 0.1);
                gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };
            
            const playMelody = () => {
                if (!this.bgMusicPlaying) return;
                
                const now = this.audioContext.currentTime;
                const melody = [
                    {note: 261.63, duration: 0.2}, // C
                    {note: 293.66, duration: 0.2}, // D
                    {note: 329.63, duration: 0.2}, // E
                    {note: 261.63, duration: 0.2}, // C
                    {note: 329.63, duration: 0.2}, // E
                    {note: 392.00, duration: 0.4}, // G
                ];
                
                let time = now;
                melody.forEach(({note, duration}) => {
                    playNote(note, time, duration);
                    time += duration;
                });
                
                setTimeout(playMelody, 2000);
            };
            
            playMelody();
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    stopBgMusic() {
        this.bgMusicPlaying = false;
    }
    
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBgMusic();
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}