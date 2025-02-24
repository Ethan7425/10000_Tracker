let players = JSON.parse(localStorage.getItem("players")) || [];
let currentPlayerIndex = 0;
let currentScore = 0;

function saveToLocalStorage() {
    localStorage.setItem("players", JSON.stringify(players));
}

function addPlayer() {
    let name = document.getElementById("playerName").value.trim();
    if (name) {
        players.push({ name, score: 0 });
        document.getElementById("playerName").value = "";
        saveToLocalStorage();
        updateLeaderboard();
    }
}

function resetGame() {
    players = [];
    currentPlayerIndex = 0;
    currentScore = 0;
    localStorage.removeItem("players");
    updateLeaderboard();
    updateCurrentScore(0);
}

function addCustomScore() {
    let points = parseInt(document.getElementById("customScore").value);
    if (!isNaN(points) && points > 0) {
        currentScore += points;
        updateCurrentScore(currentScore);
    }
}

function endTurn() {
    if (players.length === 0) return;

    let points = parseInt(document.getElementById("customScore").value);
    if (!isNaN(points) && points > 0) {
        currentScore += points;
    }

    let player = players[currentPlayerIndex];
    player.score += currentScore;

    // Check if the player has won
    if (player.score >= 10000) {
        showWinPopup(player.name);
    }

    // Check for score catch-up rule
    for (let i = 0; i < players.length; i++) {
        if (i !== currentPlayerIndex && players[i].score === player.score) {
            players[i].score = 0;
        }
    }

    currentScore = 0;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    saveToLocalStorage();
    updateLeaderboard();
    updateCurrentScore(0);
    document.getElementById("customScore").value = "";
}

function showWinPopup(winnerName) {
    alert(`${winnerName} wins the game! 🎉`);
    triggerConfetti();
}

function triggerConfetti() {
    const confettiSettings = { target: 'confettiCanvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    setTimeout(() => confetti.clear(), 3000);
}

function updateLeaderboard() {
    players.sort((a, b) => b.score - a.score);
    let playerList = document.getElementById("playerList");
    let leaderboard = document.getElementById("players");

    playerList.innerHTML = "";
    leaderboard.innerHTML = "";

    players.forEach((player) => {
        let playerItem = document.createElement("li");
        playerItem.textContent = `${player.name}: ${player.score}`;
        playerList.appendChild(playerItem);

        let leaderboardItem = document.createElement("li");
        leaderboardItem.textContent = `${player.name}: ${player.score}`;
        leaderboard.appendChild(leaderboardItem);
    });
}

function updateCurrentScore(score) {
    document.getElementById("currentScore").textContent = score;
}

// Load existing players from localStorage when the page loads
updateLeaderboard();
