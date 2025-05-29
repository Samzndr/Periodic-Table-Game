// Game Variables
let currentElement = null;
let score = 0;
let streak = 0;
let hintUsed = false;
let collectedElements = new Set();
let askedElements = new Set();
let wrongAnswers = [];
let gameComplete = false;
let gameStarted = false;
let fallingElementsInterval = null;

// Get references to HTML elements
const welcomeModal = document.getElementById('welcome-modal');
const scoreModal = document.getElementById('score-modal');
const gameContainer = document.querySelector('.game-container');
const elementSymbolDisplay = document.getElementById('element-symbol');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const skipBtn = document.getElementById('skip-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackDiv = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const collectedCountDisplay = document.getElementById('collected-count');
const totalElementsDisplay = document.getElementById('total-elements');
const newGameBtn = document.getElementById('new-game-btn');
const hintBtn = document.getElementById('hint-btn');
const periodicGrid = document.getElementById('periodic-grid');

// Welcome screen elements
const startGameBtn = document.getElementById('start-game-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const instructionsDiv = document.getElementById('instructions');
const fallingElementsContainer = document.getElementById('falling-elements-background');

// Score modal elements
const gaugePercentage = document.getElementById('gauge-percentage');
const gaugeFill = document.getElementById('gauge-fill');
const scoreDetails = document.getElementById('score-details');
const wrongAnswersSection = document.getElementById('wrong-answers-section');
const playAgainBtn = document.getElementById('play-again-btn');
const exitGameBtn = document.getElementById('exit-game-btn');

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    showWelcomeScreen();
});

// Initialize game components
function initializeGame() {
    initializePeriodicTable();
}

// Set up all event listeners
function setupEventListeners() {
    // Welcome screen events
    startGameBtn.addEventListener('click', startGame);
    instructionsBtn.addEventListener('click', toggleInstructions);
    
    // Game events
    submitBtn.addEventListener('click', submitAnswer);
    skipBtn.addEventListener('click', skipQuestion);
    nextBtn.addEventListener('click', startNewQuestion);
    newGameBtn.addEventListener('click', showWelcomeScreen);
    hintBtn.addEventListener('click', showHint);
    
    // Score modal events
    playAgainBtn.addEventListener('click', startGame);
    exitGameBtn.addEventListener('click', showWelcomeScreen);
    
    // Keyboard events
    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitAnswer();
        }
    });
}

// Show welcome screen with falling elements
function showWelcomeScreen() {
    gameStarted = false;
    welcomeModal.classList.remove('hidden');
    scoreModal.classList.add('hidden');
    gameContainer.style.display = 'none';
    
    // Reset game state
    resetGameState();
    
    // Start falling elements animation
    startFallingElements();
}

// Start falling elements animation
function startFallingElements() {
    // Clear any existing interval
    if (fallingElementsInterval) {
        clearInterval(fallingElementsInterval);
    }
    
    // Clear existing falling elements
    fallingElementsContainer.innerHTML = '';
    
    fallingElementsInterval = setInterval(() => {
        createFallingElement();
    }, 600); // Slightly faster for better effect
}

// Create a single falling element
function createFallingElement() {
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    const fallingElement = document.createElement('div');
    fallingElement.className = 'falling-element';
    fallingElement.textContent = randomElement.symbol;
    
    // Random horizontal position
    fallingElement.style.left = Math.random() * 90 + 5 + '%';
    
    // Random animation duration
    const duration = Math.random() * 4 + 6; // 6-10 seconds for slower fall
    fallingElement.style.animationDuration = duration + 's';
    
    // Random delay for more natural effect
    const delay = Math.random() * 2;
    fallingElement.style.animationDelay = delay + 's';
    
    fallingElementsContainer.appendChild(fallingElement);
    
    // Remove element after animation
    setTimeout(() => {
        if (fallingElement.parentNode) {
            fallingElement.parentNode.removeChild(fallingElement);
        }
    }, (duration + delay) * 1000);
}

// Toggle instructions display
function toggleInstructions() {
    instructionsDiv.classList.toggle('hidden');
}

// Start the game
function startGame() {
    gameStarted = true;
    welcomeModal.classList.add('hidden');
    scoreModal.classList.add('hidden');
    gameContainer.style.display = 'flex';
    
    // Stop falling elements
    if (fallingElementsInterval) {
        clearInterval(fallingElementsInterval);
        fallingElementsInterval = null;
    }
    
    // Clear falling elements
    fallingElementsContainer.innerHTML = '';
    
    // Reset game state and start
    resetGameState();
    startNewQuestion();
}

// Reset game state
function resetGameState() {
    score = 0;
    streak = 0;
    collectedElements.clear();
    askedElements.clear();
    wrongAnswers = [];
    gameComplete = false;
    
    // Reset all element tiles
    document.querySelectorAll('.element-tile').forEach(tile => {
        tile.classList.remove('collected');
    });
    
    updateDisplay();
}

// Load high score from localStorage
function loadHighScore() {
    const highScore = localStorage.getItem('elementGameHighScore') || '0';
    return parseInt(highScore);
}

// Save high score to localStorage
function saveHighScore(percentage) {
    const currentHigh = loadHighScore();
    if (percentage > currentHigh) {
        localStorage.setItem('elementGameHighScore', percentage.toString());
        return true; // New high score
    }
    return false;
}

// Initialize the periodic table grid
function initializePeriodicTable() {
    periodicGrid.innerHTML = '';
    
    elements.forEach(element => {
        const tile = document.createElement('div');
        tile.className = 'element-tile';
        tile.id = `tile-${element.symbol}`;
        
        tile.innerHTML = `
            <div class="atomic-number">${element.atomicNumber}</div>
            <div class="symbol">${element.symbol}</div>
            <div class="name">${element.name}</div>
            <div class="atomic-weight">${element.atomicWeight}</div>
        `;
        
        periodicGrid.appendChild(tile);
    });
    
    totalElementsDisplay.textContent = elements.length;
}

// Get a random element that hasn't been asked yet
function getUnaskedElement() {
    const unaskedElements = elements.filter(element => !askedElements.has(element.symbol));
    
    if (unaskedElements.length === 0) {
        return null;
    }
    
    const randomIndex = Math.floor(Math.random() * unaskedElements.length);
    return unaskedElements[randomIndex];
}

// Start a new question
function startNewQuestion() {
    if (askedElements.size >= elements.length) {
        showScoreModal();
        return;
    }
    
    currentElement = getUnaskedElement();
    
    if (!currentElement) {
        showScoreModal();
        return;
    }
    
    askedElements.add(currentElement.symbol);
    elementSymbolDisplay.textContent = currentElement.symbol;
    answerInput.value = '';
    
    // Reset interface
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'feedback';
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    skipBtn.classList.remove('hidden');
    answerInput.disabled = false;
    hintUsed = false;
    
    answerInput.focus();
    
    // Animation
    elementSymbolDisplay.classList.add('bounce');
    setTimeout(() => {
        elementSymbolDisplay.classList.remove('bounce');
    }, 600);
    
    updateProgressDisplay();
}

// Show score modal with gauge chart
function showScoreModal() {
    gameComplete = true;
    scoreModal.classList.remove('hidden');
    
    const correctCount = collectedElements.size;
    const totalCount = elements.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    
    // Check for new high score
    const isNewHighScore = saveHighScore(percentage);
    
    // Update gauge chart
    updateGaugeChart(percentage);
    
    // Update score details
    updateScoreDetails(correctCount, totalCount, percentage, isNewHighScore);
    
    // Update wrong answers section
    updateWrongAnswersSection();
}

// Update gauge chart
function updateGaugeChart(percentage) {
    gaugePercentage.textContent = percentage + '%';
    
    // Calculate gauge fill angle (180 degrees = 100%)
    const angle = (percentage / 100) * 180;
    
    // Determine color based on percentage
    let color;
    if (percentage < 20) {
        color = '#dc3545'; // Red
    } else if (percentage < 50) {
        color = '#ffc107'; // Yellow
    } else if (percentage < 80) {
        color = '#fd7e14'; // Orange
    } else {
        color = '#28a745'; // Green
    }
    
    // Animate gauge fill
    setTimeout(() => {
        gaugeFill.style.background = `conic-gradient(
            from 180deg,
            ${color} 0deg ${angle}deg,
            transparent ${angle}deg 180deg
        )`;
    }, 500);
}

// Update score details section
function updateScoreDetails(correctCount, totalCount, percentage, isNewHighScore) {
    let detailsHTML = '<h4>📊 Game Statistics</h4>';
    
    detailsHTML += `
        <div class="score-stat">
            <span class="score-stat-label">Final Score:</span>
            <span class="score-stat-value">${score} points</span>
        </div>
        <div class="score-stat">
            <span class="score-stat-label">Correct Answers:</span>
            <span class="score-stat-value">${correctCount}/${totalCount}</span>
        </div>
        <div class="score-stat">
            <span class="score-stat-label">Accuracy:</span>
            <span class="score-stat-value">${percentage}%</span>
        </div>
        <div class="score-stat">
            <span class="score-stat-label">Wrong/Skipped:</span>
            <span class="score-stat-value">${wrongAnswers.length}</span>
        </div>
    `;
    
    if (isNewHighScore) {
        detailsHTML += `
            <div class="score-stat" style="background: linear-gradient(135deg, #ffd700, #ffed4e); border-radius: 8px; margin-top: 15px;">
                <span class="score-stat-label">🎉 NEW HIGH SCORE! 🎉</span>
                <span class="score-stat-value">${percentage}%</span>
            </div>
        `;
    }
    
    scoreDetails.innerHTML = detailsHTML;
}

// Update wrong answers section
function updateWrongAnswersSection() {
    if (wrongAnswers.length === 0) {
        wrongAnswersSection.innerHTML = `
            <div style="background: #d4edda; border: 2px solid #c3e6cb; border-radius: 10px; padding: 20px; text-align: center;">
                <h4 style="color: #155724;">🌟 Perfect Score! 🌟</h4>
                <p style="color: #155724; margin: 0;">You got every element correct!</p>
            </div>
        `;
        return;
    }
    
    let wrongHTML = '<h4>📚 Elements to Review</h4>';
    
    wrongAnswers.forEach(element => {
        wrongHTML += `
            <div class="wrong-answer-item">
                <div class="wrong-answer-symbol">${element.symbol}</div>
                <div class="wrong-answer-name">
                    ${element.name}${element.frenchName !== element.name ? ` (${element.frenchName})` : ''}
                </div>
            </div>
        `;
    });
    
    wrongAnswersSection.innerHTML = wrongHTML;
}

// Update progress display
function updateProgressDisplay() {
    const remaining = elements.length - askedElements.size;
    if (remaining > 0) {
        document.querySelector('.question-text').textContent = 
            `What element has this symbol? (${remaining} remaining)`;
    }
}

// Submit answer
function submitAnswer() {
    const userAnswer = answerInput.value.trim();
    
    if (userAnswer === '') {
        showFeedback('Please enter an answer!', 'incorrect');
        return;
    }
    
    const isCorrect = checkAnswer(userAnswer, currentElement);
    
    if (isCorrect) {
        score += hintUsed ? 5 : 10;
        streak += 1;
        collectedElements.add(currentElement.symbol);
        updateElementTile(currentElement.symbol, true);
        
        let feedbackMessage = `Correct! 🎉 ${currentElement.name}`;
        if (currentElement.frenchName !== currentElement.name) {
            feedbackMessage += ` (${currentElement.frenchName})`;
        }
        feedbackMessage += ' is right!';
        
        showFeedback(feedbackMessage, 'correct');
        updateDisplay();
        
        answerInput.disabled = true;
        submitBtn.classList.add('hidden');
        skipBtn.classList.add('hidden');
        
        setTimeout(() => {
            startNewQuestion();
        }, 1500);
        
    } else {
        streak = 0;
        wrongAnswers.push(currentElement);
        
        let feedbackMessage = `Sorry! 😔 The correct answer is ${currentElement.name}`;
        if (currentElement.frenchName !== currentElement.name) {
            feedbackMessage += ` (${currentElement.frenchName})`;
        }
        
        showFeedback(feedbackMessage, 'incorrect');
        updateDisplay();
        
        answerInput.disabled = true;
        submitBtn.classList.add('hidden');
        skipBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
    }
}

// Skip question
function skipQuestion() {
    streak = 0;
    wrongAnswers.push(currentElement);
    
    let feedbackMessage = `Skipped! The answer was ${currentElement.name}`;
    if (currentElement.frenchName !== currentElement.name) {
        feedbackMessage += ` (${currentElement.frenchName})`;
    }
    feedbackMessage += ' 📚';
    
    showFeedback(feedbackMessage, 'skipped');
    updateDisplay();
    
    answerInput.disabled = true;
    submitBtn.classList.add('hidden');
    skipBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
}

// Update element tile
function updateElementTile(symbol, collected) {
    const tile = document.getElementById(`tile-${symbol}`);
    if (tile) {
        if (collected) {
            tile.classList.add('collected');
            tile.classList.add('collect-animation');
            setTimeout(() => {
                tile.classList.remove('collect-animation');
            }, 800);
        } else {
            tile.classList.remove('collected');
        }
    }
}

// Show feedback
function showFeedback(message, type) {
    feedbackDiv.textContent = message;
    feedbackDiv.className = `feedback ${type}`;
}

// Update display
function updateDisplay() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    collectedCountDisplay.textContent = collectedElements.size;
}

// Show hint
function showHint() {
    if (currentElement && !hintUsed) {
        showFeedback(`Hint: ${currentElement.hint} 💡`, 'correct');
        hintUsed = true;
    } else if (hintUsed) {
        showFeedback('You already used the hint for this question!', 'incorrect');
    }
}

// Check answer function (using Levenshtein distance for flexibility)
function checkAnswer(userAnswer, element) {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const englishName = element.name.toLowerCase();
    const frenchName = element.frenchName.toLowerCase();
    
    // Exact match
    if (normalizedAnswer === englishName || normalizedAnswer === frenchName) {
        return true;
    }
    
    // Flexible matching (allow 1 character difference for words > 3 characters)
    if (englishName.length > 3 && levenshteinDistance(normalizedAnswer, englishName) <= 1) {
        return true;
    }
    
    if (frenchName.length > 3 && levenshteinDistance(normalizedAnswer, frenchName) <= 1) {
        return true;
    }
    
    return false;
}

// Levenshtein distance function for flexible matching
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
} 