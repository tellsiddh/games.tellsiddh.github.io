// Wordle Game Class
class WordleGame {
    constructor() {
        this.word = wordleData.getDailyWord();
        this.guesses = [];
        this.currentInput = ''; // Track current word being typed, separate from submitted guesses
        this.gameOver = false;
        this.won = false;
    }

    makeGuess(guess) {
        if (this.gameOver || this.guesses.length >= 6 || guess.length !== 5) {
            return false;
        }

        guess = guess.toUpperCase();

        if (!wordleData.isValidWord(guess)) {
            return false;
        }

        this.guesses.push(guess);
        this.currentInput = ''; // Clear current input after successful guess

        if (guess === this.word) {
            this.gameOver = true;
            this.won = true;
            return true;
        }

        if (this.guesses.length >= 6) {
            this.gameOver = true;
            this.won = false;
        }

        return true;
    }

    getLetterStatus(guess, index) {
        const letter = guess[index];
        const wordLetters = this.word.split('');
        const guessLetters = guess.split('');

        // Correct position
        if (letter === this.word[index]) {
            return 'correct';
        }

        // Wrong position
        if (this.word.includes(letter)) {
            return 'present';
        }

        // Not in word
        return 'absent';
    }

    getKeyboardStatus() {
        const status = {};
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        alphabet.forEach(letter => {
            status[letter] = 'unused';
        });

        this.guesses.forEach(guess => {
            guess.split('').forEach((letter, index) => {
                const currentStatus = this.getLetterStatus(guess, index);
                if (currentStatus === 'correct') {
                    status[letter] = 'correct';
                } else if (currentStatus === 'present' && status[letter] !== 'correct') {
                    status[letter] = 'present';
                } else if (status[letter] === 'unused') {
                    status[letter] = 'absent';
                }
            });
        });

        return status;
    }
}

// Main Application
class GameApp {
    constructor() {
        this.currentScreen = 'name-entry';
        this.userName = storage.get('userName');
        this.currentGameType = null; // 'wordmaze' or 'wordle'
        this.currentLevel = 1;
        this.currentGame = null;
        this.wordleGame = null;
        this.selectedPath = [];
        this.lastIncorrectPath = null;
        this.isDragging = false;
        this.dragStart = null;
        this.init();
    }

    async init() {
        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }

        // Initialize Wordle word data - WAIT for it to complete
        try {
            console.log('🔄 Starting to load Wordle word list...');
            await wordleData.initialize();
            console.log(`✓ Wordle initialized with ${wordleData.validWords.size} words`);
        } catch (err) {
            console.error('❌ Failed to initialize Wordle data:', err);
            wordleData.loadFallbackValidWords();
            console.log('⚠ Using fallback word list');
        }

        if (this.userName) {
            this.showHome();
        } else {
            this.showNameEntry();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            // Handle action buttons first
            const btn = e.target.closest('[data-action]:not(.word-cell)');
            if (btn) {
                const action = btn.getAttribute('data-action');
                const param = btn.getAttribute('data-param');
                this[action]?.(param);
                return;
            }
            
            // Handle word cell clicks
            const cell = e.target.closest('.word-cell');
            if (cell && this.currentScreen === 'game' && this.currentGameType === 'wordmaze') {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.selectWord(`${row},${col}`);
            }
        });

        // Drag selection for word cells - only on mouse move
        let mouseDownCell = null;
        document.addEventListener('mousedown', (e) => {
            const cell = e.target.closest('.word-cell');
            if (cell && this.currentScreen === 'game' && this.currentGameType === 'wordmaze') {
                mouseDownCell = cell;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.dragStart = { row, col };
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (mouseDownCell && this.currentScreen === 'game' && this.currentGameType === 'wordmaze' && this.dragStart) {
                const currentCell = e.target.closest('.word-cell');
                // Only activate drag if user moved to a different cell
                if (currentCell && currentCell !== mouseDownCell) {
                    this.isDragging = true;
                    const row = parseInt(currentCell.dataset.row);
                    const col = parseInt(currentCell.dataset.col);
                    this.selectWord(`${row},${col}`);
                }
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.dragStart = null;
            mouseDownCell = null;
        });

        // Touch support for mobile
        let touchStartCell = null;
        document.addEventListener('touchstart', (e) => {
            const cell = e.target.closest('.word-cell');
            if (cell && this.currentScreen === 'game' && this.currentGameType === 'wordmaze') {
                touchStartCell = cell;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.dragStart = { row, col };
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (touchStartCell && this.currentScreen === 'game' && this.currentGameType === 'wordmaze') {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const cell = element.closest('.word-cell');
                if (cell && cell !== touchStartCell) {
                    this.isDragging = true;
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    this.selectWord(`${row},${col}`);
                }
            }
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
            this.dragStart = null;
            touchStartCell = null;
        });
    }

    render(html) {
        const app = document.getElementById('app');
        app.innerHTML = html;
    }

    showNameEntry() {
        this.currentScreen = 'name-entry';
        this.render(`
            <div class="name-entry">
                <div class="card">
                    <h1>🎮 Word Maze</h1>
                    <p>Enter your name to begin</p>
                    <div class="form-group">
                        <label for="nameInput">Your Name</label>
                        <input type="text" id="nameInput" placeholder="Enter your name" />
                        <button class="button button-primary" data-action="saveName" style="width: 100%;">Start Playing</button>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('nameInput').focus();
        document.getElementById('nameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveName();
            }
        });
    }

    saveName() {
        const nameInput = document.getElementById('nameInput');
        const name = nameInput.value.trim();

        if (!name) {
            alert('Please enter your name');
            return;
        }

        this.userName = name;
        storage.set('userName', name);
        this.showHome();
    }

    showHome() {
        this.currentScreen = 'home';
        const mazeStats = storage.get(`gameStats_1`, { levelsSolved: 0, timesPlayed: 0, bestTime: null });
        const mazeSolvePercentage = mazeStats.levelsSolved ? (mazeStats.levelsSolved / gameData.levels.length) * 100 : 0;
        
        const wordleStats = storage.get(`gameStats_wordle`, { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0 });
        const wordleWinPercentage = wordleStats.gamesPlayed > 0 ? (wordleStats.gamesWon / wordleStats.gamesPlayed) * 100 : 0;

        this.render(`
            <div class="container">
                <div class="home-header">
                    <h1>🎮 Word Games</h1>
                    <div class="user-info">
                        <div class="user-avatar">${this.userName.charAt(0).toUpperCase()}</div>
                        <div>
                            <div style="font-weight: 600;">${this.userName}</div>
                            <div style="color: var(--text-secondary); font-size: 12px;">
                                <button class="button button-secondary button-small" data-action="clearData" style="margin-top: 4px;">Switch User</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="games-grid">
                    <div class="card game-card" data-action="startGame" data-param="wordmaze">
                        <div class="game-icon">🧩</div>
                        <h3>Word Maze</h3>
                        <p>Connect related words through a 5×10 grid</p>
                        <div class="game-progress">
                            <div class="game-progress-bar" style="width: ${mazeSolvePercentage}%"></div>
                        </div>
                        <div class="game-stats">
                            <span>📊 ${mazeStats.levelsSolved}/${gameData.levels.length} levels</span>
                            <span>🎯 ${mazeStats.timesPlayed} plays</span>
                        </div>
                    </div>
                    
                    <div class="card game-card" data-action="startGame" data-param="wordle">
                        <div class="game-icon">🟩</div>
                        <h3>Wordle</h3>
                        <p>Guess the word in 6 tries</p>
                        <div class="game-progress">
                            <div class="game-progress-bar" style="width: ${wordleWinPercentage}%"></div>
                        </div>
                        <div class="game-stats">
                            <span>🎯 ${wordleStats.gamesWon}/${wordleStats.gamesPlayed} wins</span>
                            <span>🔥 ${wordleStats.currentStreak} streak</span>
                        </div>
                    </div>
                </div>

                <h2 style="margin-bottom: 16px; font-size: 18px;">📋 History</h2>
                ${this.renderHistory()}
            </div>
        `);
    }

    renderHistory() {
        const history = storage.get('gameHistory', []);
        if (history.length === 0) {
            return '<div style="color: var(--text-secondary); text-align: center; padding: 32px;">No games played yet. Start your first game!</div>';
        }

        return history.slice().reverse().slice(0, 10).map(record => `
            <div class="history-item" data-action="viewHistoryDetail" data-param="${record.timestamp}">
                <div class="history-date">${new Date(record.timestamp).toLocaleDateString()}</div>
                <div class="history-stats">
                    <div class="history-stat">
                        <span class="history-stat-label">Level</span>
                        <span class="history-stat-value">${record.levelId}</span>
                    </div>
                    <div class="history-stat">
                        <span class="history-stat-label">Result</span>
                        <span class="history-stat-value">${record.solved ? '✓' : '✗'}</span>
                    </div>
                    <div class="history-stat">
                        <span class="history-stat-label">Steps</span>
                        <span class="history-stat-value">${record.pathLength}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startGame(gameId) {
        if (gameId === 'wordmaze') {
            this.currentGameType = 'wordmaze';
            this.currentGame = gameData.levels[0];
            this.currentLevel = 1;
            this.selectedPath = [];
            this.lastIncorrectPath = null;
            this.showGame();
        } else if (gameId === 'wordle') {
            this.currentGameType = 'wordle';
            this.wordleGame = new WordleGame();
            this.showWordleGame();
        }
    }

    showGame() {
        const game = this.currentGame;
        this.currentScreen = 'game';
        const rowSize = 10;
        const colSize = 5;

        let gridHtml = '<div class="word-grid">';
        for (let row = 0; row < rowSize; row++) {
            for (let col = 0; col < colSize; col++) {
                const word = game.grid[row][col];
                const isStart = row === game.startPos.row && col === game.startPos.col;
                const isEnd = row === game.endPos.row && col === game.endPos.col;
                const isInPath = this.selectedPath.some(p => p.row === row && p.col === col);
                const isInIncorrectPath = this.lastIncorrectPath && this.lastIncorrectPath.some(p => p.row === row && p.col === col);
                const classes = ['word-cell'];

                if (isStart) classes.push('start');
                if (isEnd) classes.push('end');
                if (isInPath) classes.push('path');
                if (isInIncorrectPath && !isInPath) classes.push('incorrect');
                if (this.selectedPath.length > 0 && this.selectedPath[this.selectedPath.length - 1].row === row && this.selectedPath[this.selectedPath.length - 1].col === col) {
                    classes.push('selected');
                }

                gridHtml += `
                    <button class="${classes.join(' ')}" 
                            data-row="${row}" 
                            data-col="${col}" 
                            data-word="${word}"
                            data-action="selectWord"
                            data-param="${row},${col}">
                        ${word}
                    </button>
                `;
            }
        }
        gridHtml += '</div>';

        const pathDisplay = this.selectedPath.length === 0
            ? '<div style="color: var(--text-secondary);">Select the starting word: <strong>' + game.startWord + '</strong></div>'
            : this.selectedPath.map(p => this.currentGame.grid[p.row][p.col]).map((word, idx) => {
                if (idx === 0) {
                    return `<span class="path-word">${word}</span>`;
                }
                return `<span class="path-arrow">→</span><span class="path-word">${word}</span>`;
            }).join('');

        this.render(`
            <div class="container">
                <div class="game-header">
                    <button class="back-button" data-action="goHome">←</button>
                    <h2 class="game-title">${game.title}</h2>
                    <div class="game-status">
                        <div class="status-item">
                            <span class="status-label">Difficulty</span>
                            <span class="status-value">${game.difficulty}</span>
                        </div>
                    </div>
                </div>

                <div class="maze-container">
                    <div class="path-display">${pathDisplay}</div>
                    ${gridHtml}
                    <div class="maze-controls">
                        <button class="button button-secondary button-small" data-action="resetPath">↻ Reset</button>
                        <button class="button button-secondary button-small" data-action="undoMove">← Undo</button>
                        <button class="button button-primary button-small" data-action="submitPath" ${this.selectedPath.length === 0 ? 'disabled' : ''}>Submit</button>
                    </div>
                </div>
            </div>
        `);

        // Auto-select the starting word
        if (this.selectedPath.length === 0) {
            this.selectWord(`${game.startPos.row},${game.startPos.col}`);
        }
    }

    selectWord(param) {
        const [row, col] = param.split(',').map(Number);
        const word = this.currentGame.grid[row][col];
        const game = this.currentGame;

        if (this.selectedPath.length === 0) {
            if (word === game.startWord) {
                this.selectedPath.push({ row, col });
            }
        } else {
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            const lastWord = game.grid[lastPos.row][lastPos.col];

            // Check if clicking the same word (toggle/deselect)
            if (lastPos.row === row && lastPos.col === col) {
                this.selectedPath.pop();
            } else {
                // Check if adjacent (horizontally or vertically only)
                const isHorizontallyAdjacent = lastPos.row === row && Math.abs(lastPos.col - col) === 1;
                const isVerticallyAdjacent = lastPos.col === col && Math.abs(lastPos.row - row) === 1;

                if ((isHorizontallyAdjacent || isVerticallyAdjacent) && gameData.areWordsRelated(lastWord, word)) {
                    // Check if already in path - if so, remove everything after it (unselect from that point)
                    const existingIndex = this.selectedPath.findIndex(p => p.row === row && p.col === col);
                    if (existingIndex !== -1) {
                        // Remove everything after this point
                        this.selectedPath = this.selectedPath.slice(0, existingIndex);
                    } else {
                        // Add new word to path
                        this.selectedPath.push({ row, col });
                    }
                }
            }
        }

        this.showGame();
    }

    undoMove() {
        if (this.selectedPath.length > 1) {
            this.selectedPath.pop();
            this.showGame();
        }
    }

    resetPath() {
        this.selectedPath = [];
        this.lastIncorrectPath = null;
        this.showGame();
    }

    submitPath() {
        const game = this.currentGame;
        const pathWords = this.selectedPath.map(p => game.grid[p.row][p.col]);
        const expectedWords = game.path.map(pos => game.grid[pos.row][pos.col]);

        const isSolved = JSON.stringify(pathWords) === JSON.stringify(expectedWords);

        // Debug logging
        console.log('Selected Path:', this.selectedPath);
        console.log('Selected Words:', pathWords);
        console.log('Expected Path:', game.path);
        console.log('Expected Words:', expectedWords);
        console.log('Is Solved:', isSolved);

        this.showResult(isSolved);
    }

    showResult(isSolved) {
        const game = this.currentGame;
        const timestamp = Date.now();

        // Save the incorrect path so it can be shown on retry
        if (!isSolved) {
            this.lastIncorrectPath = [...this.selectedPath];
        }

        // Save to history
        const history = storage.get('gameHistory', []);
        history.push({
            timestamp,
            levelId: game.id,
            solved: isSolved,
            pathLength: this.selectedPath.length,
            date: new Date().toLocaleDateString()
        });
        storage.set('gameHistory', history);

        // Update game stats
        const gameStats = storage.get('gameStats_1', { levelsSolved: 0, timesPlayed: 0, bestTime: null });
        gameStats.timesPlayed++;
        if (isSolved) {
            gameStats.levelsSolved = Math.max(gameStats.levelsSolved, game.id);
        }
        storage.set('gameStats_1', gameStats);

        const nextLevel = game.id < gameData.levels.length ? game.id + 1 : null;

        this.render(`
            <div class="result-screen">
                <div class="card result-card">
                    <div class="result-icon">${isSolved ? '🎉' : '💪'}</div>
                    <h2 class="result-title">${isSolved ? 'Puzzle Solved!' : 'Not Quite Right'}</h2>
                    <p class="result-message">${isSolved ? 'Great job! You found the correct path!' : 'The path you traced doesn\'t match the solution. Try again!'}</p>
                    
                    <div class="result-stats">
                        <div class="result-stat">
                            <span class="result-stat-label">Level</span>
                            <span class="result-stat-value">Level ${game.id}</span>
                        </div>
                        <div class="result-stat">
                            <span class="result-stat-label">Path Length</span>
                            <span class="result-stat-value">${this.selectedPath.length} words</span>
                        </div>
                        <div class="result-stat">
                            <span class="result-stat-label">Completed</span>
                            <span class="result-stat-value">${new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>

                    <div class="result-buttons">
                        <button class="button button-primary" data-action="retryLevel">↻ Try Again</button>
                        ${nextLevel ? `<button class="button button-secondary" data-action="nextLevel">Next Level →</button>` : ''}
                        <button class="button button-secondary" data-action="goHome">Home</button>
                    </div>
                </div>
            </div>
        `);
    }

    retryLevel() {
        this.selectedPath = [];
        this.showGame();
    }

    nextLevel() {
        if (this.currentGame.id < gameData.levels.length) {
            this.currentGame = gameData.levels[this.currentGame.id];
            this.selectedPath = [];
            this.showGame();
        }
    }

    showWordleGame() {
        this.currentScreen = 'wordle-game';
        const game = this.wordleGame;
        
        // Only calculate keyboard status from submitted (valid) guesses that are in the word list
        const validatedGuesses = game.guesses.filter(g => g && g.length === 5 && wordleData.isValidWord(g));
        const keyboardStatus = {};
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        // Initialize all letters as unused
        alphabet.forEach(letter => {
            keyboardStatus[letter] = 'unused';
        });
        
        // Only update keyboard based on valid submitted guesses
        validatedGuesses.forEach(guess => {
            guess.split('').forEach((letter, index) => {
                const currentStatus = game.getLetterStatus(guess, index);
                if (currentStatus === 'correct') {
                    keyboardStatus[letter] = 'correct';
                } else if (currentStatus === 'present' && keyboardStatus[letter] !== 'correct') {
                    keyboardStatus[letter] = 'present';
                } else if (keyboardStatus[letter] === 'unused') {
                    keyboardStatus[letter] = 'absent';
                }
            });
        });

        let guessesHtml = '';
        for (let i = 0; i < 6; i++) {
            const guess = game.guesses[i];
            // Current row is the one after all submitted guesses
            const isCurrentRow = i === game.guesses.length;
            // Show the current input text for the current row
            const displayText = isCurrentRow ? game.currentInput : guess;
            const isComplete = displayText && displayText.length === 5;
            const guessClass = isComplete ? 'filled' : isCurrentRow ? 'current' : '';
            guessesHtml += '<div class="wordle-guess ' + guessClass + '">';
            
            for (let j = 0; j < 5; j++) {
                const letter = displayText && j < displayText.length ? displayText[j] : '';
                let tileClass = 'wordle-tile';
                
                // Only show color status for submitted guesses (not current input being typed)
                if (letter && !isCurrentRow && i < game.guesses.length) {
                    const status = game.getLetterStatus(guess, j);
                    tileClass += ' ' + status;
                }
                
                guessesHtml += `<div class="${tileClass}">${letter}</div>`;
            }
            guessesHtml += '</div>';
        }

        const keyboardRows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
        ];

        let keyboardHtml = '<div class="wordle-keyboard">';
        keyboardRows.forEach(row => {
            keyboardHtml += '<div class="wordle-keyboard-row">';
            row.forEach(letter => {
                const status = keyboardStatus[letter] || 'unused';
                keyboardHtml += `<button class="wordle-key ${status}" data-action="handleWordleKey" data-param="${letter}">${letter}</button>`;
            });
            keyboardHtml += '</div>';
        });
        keyboardHtml += `<div class="wordle-keyboard-row">
            <button class="wordle-key wordle-special-key" data-action="handleWordleKey" data-param="Backspace">⌫</button>
            <button class="wordle-key wordle-special-key" data-action="handleWordleKey" data-param="Enter" ${game.currentInput.length === 5 ? '' : 'disabled'}>Enter</button>
        </div></div>`;

        this.render(`
            <div class="wordle-page">
                <div class="wordle-header">
                    <button class="wordle-back-btn" data-action="goHome">← Back</button>
                    <h1 class="wordle-title">WORDLE</h1>
                    <div class="wordle-header-spacer"></div>
                </div>

                <div id="wordle-error-message" class="wordle-error-message" style="display: none;"></div>

                <div class="wordle-card">
                    <div class="wordle-board">
                        ${guessesHtml}
                    </div>

                    ${keyboardHtml}
                </div>

                ${game.gameOver ? `
                    <div class="wordle-result ${game.won ? 'won' : 'lost'}">
                        <div class="wordle-result-content">
                            <h3>${game.won ? '🎉 You Won!' : '💔 Game Over'}</h3>
                            <p>${game.won ? 'The word was: ' + game.word : 'The word was: ' + game.word}</p>
                            <div class="wordle-result-buttons">
                                <button class="button button-primary" data-action="newWordleGame">Play Again</button>
                                <button class="button button-secondary" data-action="goHome">Home</button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `);

        // Focus on keyboard for real keyboard input
        this.setupWordleKeyboard();
    }

    setupWordleKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen !== 'wordle-game' || this.wordleGame.gameOver) return;

            const key = e.key.toUpperCase();
            
            if (/^[A-Z]$/.test(key)) {
                this.addWordleLetter(key);
                e.preventDefault();
            } else if (key === 'BACKSPACE') {
                this.removeWordleLetter();
                e.preventDefault();
            } else if (key === 'ENTER') {
                this.submitWordleGuess();
                e.preventDefault();
            }
        });
    }

    addWordleLetter(letter) {
        const game = this.wordleGame;
        if (game.gameOver) return;

        // Simply add to current input string
        if (game.currentInput.length < 5) {
            game.currentInput += letter;
        }

        this.showWordleGame();
    }

    removeWordleLetter() {
        const game = this.wordleGame;
        if (game.gameOver) return;

        // Remove last character from current input
        if (game.currentInput.length > 0) {
            game.currentInput = game.currentInput.slice(0, -1);
        }

        this.showWordleGame();
    }

    handleWordleKey(param) {
        if (param === 'Backspace') {
            this.removeWordleLetter();
        } else if (param === 'Enter') {
            this.submitWordleGuess();
        } else {
            this.addWordleLetter(param);
        }
    }

    submitWordleGuess() {
        const game = this.wordleGame;
        
        // Safety checks
        if (game.gameOver) {
            return;
        }
        
        if (!game.currentInput) {
            this.showWordleGame();
            this.showWordleError('Please type a word first!');
            return;
        }

        // Check if word is complete
        if (game.currentInput.length !== 5) {
            this.showWordleGame();
            this.showWordleError('Word must be 5 letters!');
            return;
        }

        const wordToCheck = game.currentInput.toUpperCase();
        
        // Check if word is valid
        if (!wordleData.isValidWord(wordToCheck)) {
            // Clear current input to let user retype
            game.currentInput = '';
            this.showWordleGame();
            this.showWordleError('Not in word list!');
            return;
        }

        // Make the guess
        const success = game.makeGuess(wordToCheck);
        
        if (!success) {
            this.showWordleGame();
            this.showWordleError('Error submitting word. Please try again.');
            return;
        }
        
        // Save stats
        const stats = storage.get('gameStats_wordle', { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0 });
        stats.gamesPlayed++;
        
        if (game.won) {
            stats.gamesWon++;
            stats.currentStreak++;
            stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        } else if (game.gameOver) {
            stats.currentStreak = 0;
        }
        
        storage.set('gameStats_wordle', stats);
        this.showWordleGame();
    }

    showWordleError(message) {
        // Show error message in UI
        setTimeout(() => {
            const errorEl = document.getElementById('wordle-error-message');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
                
                // Hide error after 2 seconds
                setTimeout(() => {
                    errorEl.style.display = 'none';
                }, 2000);
            }
        }, 0);
    }

    newWordleGame() {
        this.wordleGame = new WordleGame();
        this.showWordleGame();
    }

    goHome() {
        this.showHome();
    }

    viewHistoryDetail(timestamp) {
        const history = storage.get('gameHistory', []);
        const record = history.find(h => h.timestamp == timestamp);

        if (!record) return;

        this.render(`
            <div class="container">
                <div style="margin-bottom: 32px;">
                    <button class="back-button" data-action="goHome" style="margin-bottom: 16px;">← Back</button>
                    <h2>Game Details</h2>
                </div>

                <div class="card">
                    <div class="result-stats">
                        <div class="result-stat">
                            <span class="result-stat-label">Date</span>
                            <span class="result-stat-value">${new Date(record.timestamp).toLocaleString()}</span>
                        </div>
                        <div class="result-stat">
                            <span class="result-stat-label">Level</span>
                            <span class="result-stat-value">Level ${record.levelId}</span>
                        </div>
                        <div class="result-stat">
                            <span class="result-stat-label">Result</span>
                            <span class="result-stat-value">${record.solved ? '✓ Solved' : '✗ Not Solved'}</span>
                        </div>
                        <div class="result-stat">
                            <span class="result-stat-label">Path Steps</span>
                            <span class="result-stat-value">${record.pathLength} words</span>
                        </div>
                    </div>

                    <div style="margin-top: 24px;">
                        <button class="button button-primary" data-action="goHome" style="width: 100%;">Back to Home</button>
                    </div>
                </div>
            </div>
        `);
    }

    clearData() {
        if (confirm('Are you sure? This will clear all your data.')) {
            storage.clear();
            this.userName = null;
            this.selectedPath = [];
            this.showNameEntry();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
