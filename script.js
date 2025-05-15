let secretWord = "";
let board = [];
let wordList = [];
let currentGuess = [];
const maxLen = 5;

const boardDiv = document.getElementById('wordle-board');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const messageDiv = document.getElementById('message');

async function loadWords() {
    try {
        const res = await fetch('palavras.txt');
        const txt = await res.text();
        wordList = txt.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length === maxLen);
    } catch (err) {
        messageDiv.textContent = "Erro ao carregar palavras.txt!";
    }
}

function randomWord() {
    if (!wordList.length) return '';
    let newWord = '';
    do {
        newWord = wordList[Math.floor(Math.random() * wordList.length)];
    } while (board.length && wordList.length > 1 && newWord === secretWord);
    return newWord;
}

function startGame() {
    board = [];
    messageDiv.textContent = "";
    currentGuess = [];
    secretWord = randomWord();
    renderBoard();
}

function renderBoard() {
    boardDiv.innerHTML = '';
    const linhas = Math.max(board.length + (gameFinished() ? 0 : 1), 6);

    for (let attempt = 0; attempt < linhas; attempt++) {
        let row = document.createElement('div');
        row.className = 'row';

        if (attempt < board.length) {
            const { guess, status } = board[attempt];
            for (let j = 0; j < maxLen; j++) {
                const sq = document.createElement('div');
                sq.className = 'square filled';
                sq.textContent = guess[j] ? guess[j].toUpperCase() : '';
                if (status[j] === "correct") sq.classList.add('correct');
                else if (status[j] === "misplaced") sq.classList.add('misplaced');
                else if (status[j] === "wrong") sq.classList.add('wrong');
                row.appendChild(sq);
            }
        }
        else if (attempt === board.length && !gameFinished()) {
            for (let j = 0; j < maxLen; j++) {
                const sq = document.createElement('div');
                sq.className = 'square';
                if (currentGuess[j]) {
                    sq.textContent = currentGuess[j].toUpperCase();
                    sq.classList.add('filled');
                } else {
                    sq.innerHTML = '&nbsp;';
                }
                if (j === currentGuess.length) sq.classList.add('cursor');
                row.appendChild(sq);
            }
        }
        else {
            for (let j = 0; j < maxLen; j++) {
                const sq = document.createElement('div');
                sq.className = 'square';
                sq.innerHTML = '&nbsp;';
                row.appendChild(sq);
            }
        }
        boardDiv.appendChild(row);
    }
}

function checkGuess(guessWord) {
    let result = Array(maxLen).fill('wrong');
    let secretArr = secretWord.split('');
    let guessArr = guessWord.split('');
    let secretUsed = Array(maxLen).fill(false);

    for (let i = 0; i < maxLen; i++) {
        if (guessArr[i] === secretArr[i]) {
            result[i] = "correct";
            secretUsed[i] = true;
            secretArr[i] = null;
        }
    }
    for (let i = 0; i < maxLen; i++) {
        if (result[i] === "correct") continue;
        for (let j = 0; j < maxLen; j++) {
            if (!secretUsed[j] && guessArr[i] === secretArr[j]) {
                result[i] = "misplaced";
                secretUsed[j] = true;
                secretArr[j] = null;
                break;
            }
        }
    }
    return result;
}

function submitGuess() {
    if (gameFinished()) return;
    if (currentGuess.length !== maxLen) {
        messageDiv.textContent = "Preencha todas as letras.";
        return;
    }
    const guessWord = currentGuess.join('').toLowerCase();
    if (!/^[a-zA-Z]{5}$/.test(guessWord)) {
        messageDiv.textContent = "Digite exatamente 5 letras.";
        return;
    }
    const status = checkGuess(guessWord);
    board.push({ guess: guessWord, status });
    if (guessWord === secretWord) {
        messageDiv.textContent = "Parabéns! Você acertou!";
    } else {
        messageDiv.textContent = "";
    }
    currentGuess = [];
    renderBoard();
}

function gameFinished() {
    if (board.length === 0) return false;
    if (board[board.length - 1].guess === secretWord) return true;
    return false;
}

submitBtn.addEventListener('click', submitGuess);
resetBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if (gameFinished()) return;
    if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < maxLen) {
        currentGuess.push(e.key.toUpperCase());
        renderBoard();
    } else if (e.key === "Backspace" && currentGuess.length > 0) {
        currentGuess.pop();
        renderBoard();
    } else if (e.key === "Enter") {
        submitGuess();
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await loadWords();
    startGame();
});
