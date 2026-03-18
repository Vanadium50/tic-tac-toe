// ui user interface

// 定義並快取 DOM 元素，避免重複查詢 DOM，提升效能
export const elements = {
    // 畫面
    startScreen: document.getElementById("start-screen"),
    mainMenu: document.getElementById("main-menu"),
    modeSelectionScreen: document.getElementById("mode-selection-screen"),
    gameScreen: document.getElementById("game-screen"),

    // 按鈕
    selectPvpBtn: document.getElementById("select-pvp"),
    selectPveBtn: document.getElementById("select-pve"),
    startNormalGameBtn: document.getElementById("start-normal-game"),
    startInfiniteGameBtn: document.getElementById("start-infinite-game"),
    backToMainMenuBtn: document.getElementById("back-to-main-menu"),
    backToMenuBtn: document.getElementById("back-to-menu"),
    cells: document.querySelectorAll(".cell"),
    statusText: document.getElementById("status"),
    restartButton: document.getElementById("restart"),
    resultModal: document.getElementById("result-modal"),
    resultMessage: document.getElementById("result-message"),
    newGameBtn: document.getElementById("new-game-btn"),

    // 其他
    scoreEls: {
        X: document.getElementById("x-score"),
        O: document.getElementById("o-score")
    },
    modalScoreEls: {
        X: document.getElementById("x-score-modal"),
        O: document.getElementById("o-score-modal")
    },
    difficultyContainer: document.getElementById("difficulty-controls"),
    difficultyBtns: {
        Easy: document.getElementById("diff-easy"),
        Normal: document.getElementById("diff-normal"),
        Hard: document.getElementById("diff-hard")
    }
};

// 更新單個格子的顯示內容
export function updateCell(index, player) {
    elements.cells[index].textContent = player;
    elements.cells[index].classList.remove("X", "O"); // 先移除舊的類別
    // 如果 player 有值 (X 或 O)，才新增類別
    if (player) elements.cells[index].classList.add(player);
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

// --- 畫面切換 ---

// 隱藏所有頂層畫面容器
function hideTopLevelScreens() {
    elements.startScreen.classList.add("hidden");
    elements.gameScreen.classList.add("hidden");
}

// 顯示主選單畫面 (第一步)
export function showMainMenu() {
    hideTopLevelScreens();
    elements.startScreen.classList.remove("hidden"); // 顯示選單外框

    // 確保只顯示第一步的選單
    elements.mainMenu.classList.remove("hidden");
    elements.modeSelectionScreen.classList.add("hidden");
}

// 顯示模式選擇畫面 (第二步)
export function showModeSelectionScreen(isPve) {
    // 假設此時 startScreen 已經是可見的，我們只切換內部畫面
    elements.mainMenu.classList.add("hidden");
    elements.modeSelectionScreen.classList.remove("hidden");

    if (isPve) {
        elements.difficultyContainer.classList.remove("hidden");
    } else {
        elements.difficultyContainer.classList.add("hidden");
    }
}

// 顯示遊戲畫面
export function showGameScreen() { 
    hideTopLevelScreens();
    elements.gameScreen.classList.remove("hidden");
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