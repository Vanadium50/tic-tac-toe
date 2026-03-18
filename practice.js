import { gameState, resetRoundState, resetAllState } from './state.js';
import * as UI from './ui.js';
import { checkWin, getBestMove } from './logic.js';

// --- 初始化與事件綁定 ---
function initialize() {
    UI.updateDifficultyUI(gameState.difficulty);
    returnToMenu(); // 呼叫 returnToMenu 可重置畫面到主選單並清空分數
}

// 綁定事件
UI.elements.cells.forEach((cell, index) => { 
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

// 模式選擇按鈕
UI.elements.modePvpBtn.addEventListener("click", () => startGame("PVP"));
UI.elements.modePveBtn.addEventListener("click", () => startGame("PVE"));
UI.elements.backToMenuBtn.addEventListener("click", returnToMenu);

// 遊戲控制按鈕 (重新開始)
UI.elements.restartButton.addEventListener("click", restartGame);
if (UI.elements.newGameBtn) {
    UI.elements.newGameBtn.addEventListener("click", restartGame);
}

// 綁定難度按鈕事件
Object.keys(UI.elements.difficultyBtns).forEach(diff => {
    const btn = UI.elements.difficultyBtns[diff];
    if (btn) {
        btn.addEventListener("click", () => {
            gameState.difficulty = diff;
            UI.updateDifficultyUI(diff);
        });
    }
});

initialize(); // 確保頁面載入時是起始畫面

// --- 遊戲流程控制 ---
// 處理格子點擊事件 (核心遊戲迴圈)
function handleCellClick(cell, index) {
    // 檢查是否合法
    if (gameState.board[index] !== "" || !gameState.isActive) return;

    // 防止在電腦思考時玩家點擊 (PVE 模式下，輪到 O 時禁止玩家操作)
    if (gameState.mode === "PVE" && gameState.currentPlayer === "O") return;
    
    executeMove(index);
}

// 執行移動邏輯 (統一處理玩家點擊與電腦移動)
function executeMove(index) {
    // 更新資料
    gameState.board[index] = gameState.currentPlayer;
    // 更新畫面
    UI.updateCell(index, gameState.currentPlayer);

    // 檢查勝負
    if (checkWin(gameState.board, gameState.currentPlayer)) {
        handleWin();
        return;
    }

    if (gameState.board.every(c => c !== "")) {
        handleDraw();
        return;
    }

    // 切換回合
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
    UI.updateStatus(`玩家 ${gameState.currentPlayer} 的回合`);

    // 如果是 PvE 輪到電腦
    if (gameState.mode === "PVE" && gameState.currentPlayer === "O" && gameState.isActive) {
        setTimeout(runComputerTurn, 500);
    }
}

// 電腦回合
function runComputerTurn() {
    if (!gameState.isActive) return;
    const moveIndex = getBestMove(gameState.board, gameState.difficulty);
    if (moveIndex !== -1) {
        executeMove(moveIndex);
    }
}

// --- 介面與狀態控制 ---
// 開始新遊戲 (設定模式並顯示遊戲畫面)
function startGame(mode) {
    gameState.mode = mode;
    UI.showGameScreen();
    restartGame();
}

// 返回主選單 (重置所有狀態)
function returnToMenu() {
    resetAllState();
    UI.updateScoreBoard("X", 0);
    UI.updateScoreBoard("O", 0);
    UI.showStartScreen();
    UI.hideResultModal();
}

// 重新開始本局 (保留比分，重置棋盤)
function restartGame() {
    resetRoundState();
    UI.clearBoardUI();
    UI.updateStatus("玩家 X 的回合");
    UI.hideResultModal();
}

// 處理獲勝邏輯
function handleWin() {
    gameState.isActive = false;
    const winner = gameState.currentPlayer;
    gameState.scores[winner]++;
    
    UI.updateScoreBoard(winner, gameState.scores[winner]);
    
    const winMsg = (gameState.mode === "PVE" && winner === "O") 
        ? "電腦 (O) 贏了!" 
        : `玩家 ${winner} 贏了!`;
        
    UI.updateStatus(winMsg);
    UI.showResultModal(winMsg, gameState.scores);
}

// 處理平手邏輯
function handleDraw() {
    gameState.isActive = false;
    const msg = "平手!";
    UI.updateStatus(msg);
    UI.showResultModal(msg, gameState.scores);
}
