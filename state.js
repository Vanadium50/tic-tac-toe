// 管理遊戲的全域狀態 (資料層)
export const gameState = {
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "X",
    isActive: true,
    mode: "PVP",
    scores: {
        X: 0,
        O: 0
    },
    difficulty: "Normal" // 新增難度設定: "Easy", "Normal", "Hard"
};

// 重置單局狀態 (棋盤、回合)
export function resetRoundState() {
    gameState.board = ["", "", "", "", "", "", "", "", ""];
    gameState.currentPlayer = "X";
    gameState.isActive = true;
}

// 重置所有狀態 (包含分數)
export function resetAllState() {
    resetRoundState();
    gameState.scores = { X: 0, O: 0 };
}