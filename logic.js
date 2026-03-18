// 電腦下棋邏輯
import { WIN_PATTERNS } from './constants.js'; //引入獲勝的條件

// 檢查某位玩家是否滿足任一獲勝條件
export function checkWin(board, player) {
    return WIN_PATTERNS.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

// 根據難度決定電腦的最佳移動位置 (AI 入口)
export function getBestMove(board, difficulty = "Normal") {
    // Easy: 完全隨機
    if (difficulty === "Easy") {
        return getRandomMove(board);
    }

    // Hard: Minimax 演算法 (無敵)
    if (difficulty === "Hard") {
        return getHardMove(board);
    }

    // Normal: 基本策略 (進攻 > 防守 > 中心 > 隨機)
    // 1. 檢查自己 (O) 是否能贏
    let winMove = findWinningMove(board, "O");
    if (winMove !== -1) return winMove;

    // 2. 檢查對手 (X) 是否快贏了，必須阻擋
    let blockMove = findWinningMove(board, "X");
    if (blockMove !== -1) return blockMove;

    // 3. 搶佔中心點
    if (board[4] === "") return 4;

    // 4. 隨機選擇剩餘格子
    return getRandomMove(board);
}

// 輔助函式：尋找是否存在只要一步就能獲勝(或阻擋對手)的位置
function findWinningMove(board, player) {
    for (let pattern of WIN_PATTERNS) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === "") return c;
        if (board[a] === player && board[c] === player && board[b] === "") return b;
        if (board[b] === player && board[c] === player && board[a] === "") return a;
    }
    return -1;
}

// --- Hard Mode Logic (Minimax) ---

// 困難模式邏輯：使用 Minimax 演算法計算最佳解
function getHardMove(originalBoard) {
    // 複製棋盤以避免汙染原始資料
    const board = [...originalBoard];
    
    let bestScore = -Infinity;
    let move = -1;
    
    // 取得所有空格
    const availableMoves = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    // 效能優化：如果第一步且中心是空的，直接佔領中心
    if (availableMoves.length === 9 || (availableMoves.length === 8 && board[4] === "")) {
        return 4;
    }

    for (let i of availableMoves) {
        board[i] = "O"; // 嘗試走這一步
        let score = minimax(board, 0, false); // 計算分數
        board[i] = ""; // 復原
        
        if (score > bestScore) {
            bestScore = score;
            move = i;
        }
    }
    return move;
}

// 定義 Minimax 的分數權重
const SCORES = { O: 10, X: -10, TIE: 0 };

// Minimax 遞迴演算法：模擬所有可能的走法並評分
function minimax(board, depth, isMaximizing) {
    if (checkWin(board, "O")) return SCORES.O - depth; // O 贏 (越快贏分數越高)
    if (checkWin(board, "X")) return SCORES.X + depth; // X 贏 (拖越久輸分數越高)
    if (board.every(c => c !== "")) return SCORES.TIE; // 平手

    // Maximizing: 電腦 (O) 的回合，嘗試取得最高分
    if (isMaximizing) { // 電腦 (O) 的回合，找最大分
        let bestScore = -Infinity;
        board.forEach((cell, i) => {
            if (cell === "") {
                board[i] = "O";
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = "";
            }
        });
        return bestScore;
    } 
    // Minimizing: 玩家 (X) 的回合，假設玩家會走最佳步(讓電腦得分最低)
    else { 
        let bestScore = Infinity;
        board.forEach((cell, i) => {
            if (cell === "") {
                board[i] = "X";
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = "";
            }
        });
        return bestScore;
    }
}

// 隨機取得一個可用的格子
function getRandomMove(board) {
    let available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
}