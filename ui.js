// ui user interface

// 定義並快取 DOM 元素，避免重複查詢 DOM，提升效能
export const elements = {
    startScreen: document.getElementById("start-screen"),
    gameScreen: document.getElementById("game-screen"),
    modePvpBtn: document.getElementById("mode-pvp"),
    modePveBtn: document.getElementById("mode-pve"),
    backToMenuBtn: document.getElementById("back-to-menu"),
    cells: document.querySelectorAll(".cell"),
    statusText: document.getElementById("status"),
    restartButton: document.getElementById("restart"),
    resultModal: document.getElementById("result-modal"),
    resultMessage: document.getElementById("result-message"),
    newGameBtn: document.getElementById("new-game-btn"),
    scoreEls: {
        X: document.getElementById("x-score"),
        O: document.getElementById("o-score")
    },
    modalScoreEls: {
        X: document.getElementById("x-score-modal"),
        O: document.getElementById("o-score-modal")
    },
    difficultyBtns: {
        Easy: document.getElementById("diff-easy"),
        Normal: document.getElementById("diff-normal"),
        Hard: document.getElementById("diff-hard")
    }
};

// 更新單個格子的顯示內容
export function updateCell(index, player) {
    elements.cells[index].textContent = player;
    // 新增類別以套用特定顏色 (例如 .X 或 .O)
    elements.cells[index].classList.add(player);
}

// 更新遊戲狀態文字 (例如: 輪到誰、獲勝訊息)
export function updateStatus(message) {
    elements.statusText.textContent = message;
}

// 更新分數板的數值
export function updateScoreBoard(player, score) {
    if (elements.scoreEls[player]) elements.scoreEls[player].textContent = score;
}

// 顯示結算視窗 (Modal)，包含訊息與最終分數
export function showResultModal(message, scores) {
    elements.resultMessage.textContent = message;
    if (elements.modalScoreEls.X) elements.modalScoreEls.X.textContent = scores.X;
    if (elements.modalScoreEls.O) elements.modalScoreEls.O.textContent = scores.O;
    elements.resultModal.classList.remove("hidden");
}

// 隱藏結算視窗
export function hideResultModal() {
    elements.resultModal.classList.add("hidden");
}

// 切換到遊戲畫面 (隱藏開始畫面)
export function showGameScreen() {
    elements.startScreen.classList.add("hidden");
    elements.gameScreen.classList.remove("hidden");
}

// 切換到開始畫面 (隱藏遊戲畫面)
export function showStartScreen() {
    elements.gameScreen.classList.add("hidden");
    elements.startScreen.classList.remove("hidden");
}

// 清空棋盤上所有格子的內容
export function clearBoardUI() {
    elements.cells.forEach(cell => {
        cell.textContent = "";
        // 移除所有玩家類別，確保下一局顏色正確
        cell.classList.remove("X", "O");
    });
}

// 更新難度按鈕的樣式 (高亮目前選中的難度)
export function updateDifficultyUI(activeDiff) {
    Object.entries(elements.difficultyBtns).forEach(([diff, btn]) => {
        if (!btn) return;
        if (diff === activeDiff) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}