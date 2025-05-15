let wordList = [
  "gato", "pato", "livro", "solto", "certo", "plano", "mundo", "verde", "carta", "bicho",
  "navio", "pedra", "tempo", "pleno", "porta", "piano", "banho", "nuvem", "linha", "cinto",
  "peixe", "areia", "forca", "vinho", "folha", "papel", "treno", "couro", "banco", "grato",
  "risco", "barro", "baixo", "velho", "leito", "seixo", "anexo", "corte", "pente", "molho",
  "feira", "barco", "meche", "suave", "ponto", "nobre", "dente", "vento", "fundo", "beijo",
  "prato", "lente", "salto", "fraco", "corda", "letra", "ferro", "bolha", "amigo", "casal",
  "troca", "vazio", "tarde", "rapaz", "forma", "noite", "claro", "canto", "limpo", "cedro",
  "troco", "passe", "morro", "baixa", "cobre", "trago", "medir", "doido", "livre", "volta",
  "justo", "firme", "preto", "feita", "brisa", "sorte", "puxar", "forno", "tocar", "fruta",
  "fecho", "visto", "ganho", "trama", "bloco"
];

let secretWord = "";
let board = [];
let currentGuess = [];
const maxLen = 5;
const maxAttempts = 6;

const boardDiv = document.getElementById('wordle-board');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const messageDiv = document.getElementById('message');

function gameFinished() {
  return board.length >= maxAttempts || (board.length > 0 && board[board.length - 1].guess === secretWord);
}

function sortearPalavra() {
  const nova = wordList[Math.floor(Math.random() * wordList.length)];
  return nova.toLowerCase();
}

function startGame() {
  board = [];
  currentGuess = [];
  messageDiv.textContent = "";
  secretWord = sortearPalavra();
  renderBoard();
}

function renderBoard() {
  boardDiv.innerHTML = '';
  const linhas = Math.max(board.length + (!gameFinished() ? 1 : 0), maxAttempts);

  for (let i = 0; i < linhas; i++) {
    const row = document.createElement('div');
    row.className = 'row';

    for (let j = 0; j < maxLen; j++) {
      const square = document.createElement('div');
      square.className = 'square';

      if (i < board.length) {
        const { guess, status } = board[i];
        square.textContent = guess[j].toUpperCase();
        square.classList.add('filled', status[j]);
      } else if (i === board.length && !gameFinished()) {
        if (currentGuess[j]) {
          square.textContent = currentGuess[j].toUpperCase();
          square.classList.add('filled');
        } else {
          square.innerHTML = '&nbsp;';
        }
        if (j === currentGuess.length) square.classList.add('cursor');
      } else {
        square.innerHTML = '&nbsp;';
      }

      row.appendChild(square);
    }

    boardDiv.appendChild(row);
  }
}

function checkGuess(guessWord) {
  const result = Array(maxLen).fill('wrong');
  const secretArr = secretWord.split('');
  const guessArr = guessWord.split('');
  const used = Array(maxLen).fill(false);

  for (let i = 0; i < maxLen; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'correct';
      used[i] = true;
      secretArr[i] = null;
    }
  }

  for (let i = 0; i < maxLen; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < maxLen; j++) {
      if (!used[j] && guessArr[i] === secretArr[j]) {
        result[i] = 'misplaced';
        used[j] = true;
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
    messageDiv.textContent = "Digite 5 letras.";
    return;
  }

  const guess = currentGuess.join('').toLowerCase();
  if (!/^[a-z]{5}$/.test(guess)) {
    messageDiv.textContent = "Somente letras de A-Z.";
    return;
  }

  const status = checkGuess(guess);
  board.push({ guess, status });

  if (guess === secretWord) {
    messageDiv.textContent = "Parabéns! Você acertou!";
  } else if (board.length >= maxAttempts) {
    messageDiv.textContent = `Fim de jogo! A palavra era: ${secretWord.toUpperCase()}`;
  } else {
    messageDiv.textContent = "";
  }

  currentGuess = [];
  renderBoard();
}

submitBtn.addEventListener('click', submitGuess);
resetBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (gameFinished()) return;

  if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < maxLen) {
    currentGuess.push(e.key.toLowerCase());
    renderBoard();
  } else if (e.key === "Backspace" && currentGuess.length > 0) {
    currentGuess.pop();
    renderBoard();
  } else if (e.key === "Enter") {
    submitGuess();
  }
});

window.addEventListener('DOMContentLoaded', startGame);
