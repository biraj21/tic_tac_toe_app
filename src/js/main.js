window.backPressedEvent = new Event("backpressed");

const WIN_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const EASY = "Easy";
const MEDIUM = "Medium";
const IMPOSSIBLE = "Impossible";

const SINGLE_PLAYER = "Computer";
const MULTI_PLAYER = "2 Players";

const O = "o";
const X = "x";

const DRAW = "draw";

function createToast($toast) {
    return {
        timeout: null,
        show(message) {
            if (this.timeout) {
                this.reset();
                setTimeout(this.show.bind(this, message), 100);
                return;
            }

            $toast.innerText = message;
            $toast.style.display = "block";
            $toast.classList.add("toast--fade-in");
            this.timeout = setTimeout(this.close.bind(this), 2000);
        },

        close() {
            $toast.classList.remove("toast--fade-in");
            $toast.classList.add("toase--fade-out");
            $toast.onanimationend = this.reset.bind(this);
        },

        reset() {
            $toast.classList.remove("toast--fade-in");
            $toast.classList.remove("toast--fade-out");
            $toast.onanimationend = null;
            $toast.style.display = "none";
            clearTimeout(this.timeout);
            this.timeout = null;
        },
    };
}

const get = document.querySelector.bind(document);
const getAll = document.querySelectorAll.bind(document);

const $home = get("#home");
const $difficulty = get("#difficulty");
const $game = get("#game");
const $gameMode = get("#game-mode");
const $board = get("#board");
const $cells = getAll(".cell");
const $p1Name = get("#p1-name");
const $p2Name = get("#p2-name");
const $pages = getAll(".page");

const toast = createToast(get(".toast"));

const player1 = {
    name: "Player 1",
    symbol: X,
    score: 0,
};

const player2 = {
    name: "Player 2",
    symbol: O,
    score: 0,
};

const game = {
    darkTheme: true,
    mode: null,
    difficulty: null,
    navHistory: [$home],
    board: Array(9),
    currentPlayer: player1,
    backPressedDouble: false,
    backTimeout: null,
    resetBack() {
        toast.reset();
        clearTimeout(game.backTimeout);
        this.backPressedDouble = false;
        this.backTimeout = null;
    },
    setActivePage($page, push = true) {
        $pages.forEach(($page) => $page.classList.remove("page--active"));
        $page.classList.add("page--active");

        document.body.dataset.activePage = $page.id;
        if (push) {
            this.navHistory.push($page);
        }
    },
    changeTheme() {
        this.darkTheme = !this.darkTheme;
        if (this.darkTheme) {
            document.documentElement.classList.remove("light-theme");
        } else {
            document.documentElement.classList.add("light-theme");
        }
    },
};

$cells.forEach(($cell, i) => ($cell.dataset.index = i));

window.addEventListener("backpressed", () => {
    if (game.backPressedDouble) {
        clearTimeout(game.backTimeout);
        game.backPressedDouble = false;
        game.backTimeout = null;

        game.navHistory.pop();
        const navHistoryLen = game.navHistory.length;
        if (navHistoryLen === 0) {
            window.close();
        } else {
            game.setActivePage(game.navHistory[navHistoryLen - 1], false);
        }

        return;
    }

    game.backPressedDouble = true;
    const $currentPage = game.navHistory[game.navHistory.length - 1];
    if ($currentPage === $home) {
        toast.show("Press back again to exit.");
    } else if ($currentPage === $difficulty) {
        toast.show("Press back again for home.");
    } else if ($currentPage === $game) {
        toast.show("Press back again for difficulty.");
    }

    game.backTimeout = setTimeout(() => {
        game.backPressedDouble = false;
        game.backTimeout = null;
    }, 2000);
});

get("#home-btn").onclick = () => {
    game.navHistory = [];
    game.resetBack();
    game.setActivePage($home);
};

get("#theme-btn").onclick = game.changeTheme.bind(game);

getAll("#symbols .symbol").forEach(($symbol) => ($symbol.onclick = chooseSymbolPlayer1));

get("#single-player-btn").onclick = () => {
    game.resetBack();
    game.mode = SINGLE_PLAYER;
    player1.name = "You";
    player2.name = "Computer";
    game.setActivePage($difficulty);
};

get("#multi-player-btn").onclick = () => {
    game.resetBack();
    game.mode = MULTI_PLAYER;
    player1.name = "Player 1";
    player2.name = "Player 2";
    startGame();
};

getAll("#difficulty .btn").forEach(($btn) => {
    $btn.onclick = () => {
        game.resetBack();
        game.difficulty = $btn.dataset.difficulty;
        startGame();
    };
});

get("#restart-btn").onclick = () => startGame(false);

function chooseSymbolPlayer1(e) {
    get(".symbol--selected").classList.remove("symbol--selected");
    e.target.classList.add("symbol--selected");

    player1.symbol = e.target.firstElementChild.className;
    player2.symbol = player1.symbol === O ? X : O;
}

function startGame(reset = true) {
    game.currentPlayer = player1;
    $board.classList.remove("game-draw");

    if (reset) {
        game.setActivePage($game);

        $gameMode.innerHTML = game.mode;
        if (game.mode === SINGLE_PLAYER) {
            $gameMode.innerHTML += `&nbsp; - &nbsp;${game.difficulty}`;
        }

        $p1Name.innerText = player1.name;
        $p2Name.innerText = player2.name;

        player1.score = player2.score = 0;

        get("#p1 .score-head span").className = player1.symbol;
        get("#p2 .score-head span").className = player2.symbol;
        updateScoreboard();
    }

    // clear the board
    for (let i = 0; i < 9; ++i) {
        game.board[i] = null;
        $cells[i].classList.remove("win");

        let $symbol = $cells[i].firstElementChild;
        if ($symbol) {
            $symbol.remove();
        }
    }

    highlightCurrentPlayer();
    enableCellClicks();
}

function updateScoreboard() {
    get("#p1 .score").innerText = player1.score;
    get("#p2 .score").innerText = player2.score;
}

function highlightCurrentPlayer() {
    get(".score-info.turn").classList.remove("turn");

    if (game.currentPlayer === player1) {
        get("#p1").classList.add("turn");
    } else {
        get("#p2").classList.add("turn");
    }
}

function drawSymbol(player) {
    const symbol = document.createElement("span");
    symbol.className = player.symbol;
    return symbol;
}

function enableCellClicks() {
    getEmptyCells().forEach((i) => ($cells[i].onclick = makeMove));
}

function disableCellClicks() {
    $cells.forEach(($cell) => ($cell.onclick = null));
}

function getEmptyCells(state = game.board) {
    return state.map((_, i) => i).filter((i) => state[i] === null);
}

function makeMove(e) {
    const $cell = e.target;
    $cell.append(drawSymbol(game.currentPlayer));
    $cell.onclick = null;

    const cellIndex = Number($cell.dataset.index);
    game.board[cellIndex] = game.currentPlayer.symbol;

    const result = getGameResult(game.board);
    if (result === null) {
        game.currentPlayer = game.currentPlayer === player1 ? player2 : player1;
        highlightCurrentPlayer();

        if (game.mode === SINGLE_PLAYER && game.currentPlayer === player2) {
            computerMove();
        }
    } else {
        gameOver(result);
    }
}

function getGameResult(boardState) {
    if (checkBoard(player1, boardState)) {
        return player1;
    } else if (checkBoard(player2, boardState)) {
        return player2;
    } else {
        return getEmptyCells(boardState).length === 0 ? DRAW : null;
    }
}

function checkBoard(player) {
    for (let combo of WIN_COMBOS) {
        if (combo.every((i) => game.board[i] === player.symbol)) {
            return combo;
        }
    }
}

function gameOver(player) {
    disableCellClicks();

    if (player === DRAW) {
        $board.classList.add("game-draw");
    } else {
        player.score++;
        checkBoard(player, game.board).forEach((i) => $cells[i].classList.add("win"));
    }

    updateScoreboard();
}

function computerMove() {
    disableCellClicks();

    // timeout is added to simulate "thinking"
    setTimeout(() => {
        const move = chooseComputerMove();
        enableCellClicks();
        $cells[move].click();
    }, 500);
}

function chooseComputerMove() {
    if (game.difficulty == EASY) {
        // check if AI can win
        const move = findWinningMove(player2);
        if (move > -1) return move;

        return getRandomMove();
    } else if (game.difficulty === MEDIUM) {
        // check if AI can win
        let move = findWinningMove(player2);
        if (move > -1) return move;

        // if the player can win in next move, stop it
        move = findWinningMove(player1);
        if (move > -1) return move;

        return Math.random() < 0.5 ? getRandomMove() : getBestMove();
    } else if (game.difficulty === IMPOSSIBLE) {
        return getBestMove();
    } else {
        throw new Error(`Unknown difficulty ${game.difficulty}`);
    }
}

function findWinningMove(player) {
    const emptyCells = getEmptyCells(game.board);
    for (let i of emptyCells) {
        game.board[i] = player.symbol;
        if (getGameResult(game.board) == player) {
            game.board[i] = null;
            return i;
        }

        game.board[i] = null;
    }

    return -1;
}

function getRandomMove() {
    const emptyCells = getEmptyCells();
    const move = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[move];
}

function getBestMove() {
    let bestScore = -Infinity,
        bestMove;

    const emptyCells = getEmptyCells();
    for (let index of emptyCells) {
        game.board[index] = player2.symbol;

        let score = minimax(game.board, false, 0, bestScore, Infinity);
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }

        game.board[index] = null;
    }

    return bestMove;
}

function minimax(board, isMax, depth, alpha, beta) {
    const result = getGameResult(board);
    if (result !== null) {
        if (result === DRAW) return 0;

        return result === player2 ? 100 - depth : -100 + depth;
    }

    const emptyCells = getEmptyCells(board);

    if (isMax) {
        let bestScore = -Infinity;
        for (let i of emptyCells) {
            board[i] = player2.symbol;
            bestScore = Math.max(bestScore, minimax(board, false, depth + 1, alpha, beta));
            board[i] = null;

            /*
             * alpha is the score that the Max (current node) is considering.
             * beta is the score that the Min (parent node) is considering.
             * Now if Max finds a score that is greater than or equal to beta
             * (alpha >= beta), Min will stop exploring Max because whatever
             * move that Max would otherwise choose will be greater than or
             * equal to alpha.
             */
            alpha = Math.max(alpha, bestScore);
            if (alpha >= beta) break;
        }

        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i of emptyCells) {
            board[i] = player1.symbol;
            bestScore = Math.min(bestScore, minimax(board, true, depth + 1, alpha, beta));
            board[i] = null;

            /*
             * alpha is the score that the Max (parent node) is considering.
             * beta is the score that the Min (current node) is considering.
             * Now if Min finds a score that is less than or equal to alpha
             * (beta <= alpha), Max will stop exploring Min because whatever
             * move that Min would otherwise choose will be less than or
             * equal to beta.
             */
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) break;
        }

        return bestScore;
    }
}
