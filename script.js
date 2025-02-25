let players = JSON.parse(localStorage.getItem("players")) || [];
if (!Array.isArray(players)) players = [];
let currentPlayerIndex = JSON.parse(localStorage.getItem("currentPlayerIndex")) || 0;
let currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;

function saveToLocalStorage() {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("currentPlayerIndex", JSON.stringify(currentPlayerIndex));
    localStorage.setItem("currentScore", JSON.stringify(currentScore));
}

function loadPlayers() {
    let storedPlayers = JSON.parse(localStorage.getItem("players"));
    if (Array.isArray(storedPlayers)) {
        players = storedPlayers;
    }
    currentPlayerIndex = JSON.parse(localStorage.getItem("currentPlayerIndex")) || 0;
    currentScore = JSON.parse(localStorage.getItem("currentScore")) || 0;
    updatePlayerList();
    updateLeaderboard();
}

document.addEventListener("DOMContentLoaded", loadPlayers);

function confirmResetGame() {
    if (confirm("Are you sure you want to reset all players and scores? This cannot be undone.")) {
        resetGame();
    }
}

function confirmResetScores() {
    if (confirm("Are you sure you want to reset all scores?")) {
        resetScores();
    }
}

function resetGame() {
    localStorage.removeItem("players");
    localStorage.removeItem("currentPlayerIndex");
    localStorage.removeItem("currentScore");
    players = [];
    currentPlayerIndex = 0;
    currentScore = 0;
    updatePlayerList();
    updateLeaderboard();
}

function resetScores() {
    players.forEach(player => player.score = 0);
    localStorage.setItem("players", JSON.stringify(players));
    updatePlayerList();
    updateLeaderboard();
}

function endTurn() {
    if (players.length === 0) return;

    let points = parseInt(document.getElementById("customScore").value);
    if (!isNaN(points)) {
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
        if (i !== currentPlayerIndex && players[i].score === player.score && players[i].score > 0) {
            alert(`${player.name} a rayé ${players[i].name} !`);
            players[i].score = 0;
        }        
    }
    currentScore = 0;
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    saveToLocalStorage();
    updatePlayerList();
    updateLeaderboard();
    
    // Clear the custom score field
    let customScoreField = document.getElementById("customScore");
    if (customScoreField) {
        customScoreField.value = "";
    }
}

function updatePlayerList() {
    let playerList = document.getElementById("playerList");
    playerList.innerHTML = "";

    players.forEach((player, index) => {
        let playerItem = document.createElement("li");
        let playerInfo = document.createElement("span");
        playerInfo.className = "player-info";
        playerInfo.textContent = `${player.name}`;
        // playerInfo.textContent = `${player.name}: ${player.score}`;
        
        if (index === currentPlayerIndex) {
            playerItem.classList.add("current-turn");
        }

        let buttonContainer = document.createElement("span");
        buttonContainer.className = "player-buttons";

        let removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.onclick = () => removePlayer(index);
        
        let upButton = document.createElement("button");
        upButton.textContent = "⬆";
        upButton.onclick = () => movePlayerUp(index);
        
        let downButton = document.createElement("button");
        downButton.textContent = "⬇";
        downButton.onclick = () => movePlayerDown(index);
        
        buttonContainer.appendChild(upButton);
        buttonContainer.appendChild(downButton);
        buttonContainer.appendChild(removeButton);
        
        playerItem.appendChild(playerInfo);
        playerItem.appendChild(buttonContainer);
        playerList.appendChild(playerItem);
    });
}

function updateLeaderboard() {
    let leaderboard = document.getElementById("players");
    leaderboard.innerHTML = "";
    
    let sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    let medals = ["🥇", "🥈", "🥉"];
    
    sortedPlayers.forEach((player, index) => {
        let leaderboardItem = document.createElement("li");
        let medal = index < 3 ? medals[index] + " " : "";
        leaderboardItem.textContent = `${medal}${player.name}: ${player.score}`;
        leaderboard.appendChild(leaderboardItem);
    });
}

function removePlayer(index) {
    players.splice(index, 1);
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
    }
    saveToLocalStorage();
    updatePlayerList();
    updateLeaderboard();
}

function addPlayer() {
    let playerNameInput = document.getElementById("playerName");
    let name = playerNameInput.value.trim();
    if (name) {
        players.push({ name, score: 0 });
        playerNameInput.value = "";
        saveToLocalStorage();
        updatePlayerList();
        updateLeaderboard();
    }
}

function movePlayerUp(index) {
    if (index > 0) {
        [players[index], players[index - 1]] = [players[index - 1], players[index]];
        saveToLocalStorage();
        updatePlayerList();
    }
}

function movePlayerDown(index) {
    if (index < players.length - 1) {
        [players[index], players[index + 1]] = [players[index + 1], players[index]];
        saveToLocalStorage();
        updatePlayerList();
    }
}

function showWinPopup(winnerName) {
    let sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    let medals = ["🥇", "🥈", "🥉"];
    let top3 = sortedPlayers.slice(0, 3).map((player, index) => `${medals[index] || ''} ${player.name}: ${player.score}`).join("\n");
    
    let popup = document.createElement("div");
    popup.id = "winPopup";
    popup.innerHTML = `
        <div class="popup-content">
            <h2>🎉 ${winnerName} Wins! 🎉</h2>
            <p>Top 3 Players:</p>
            <pre>${top3}</pre>
            <button onclick="closeWinPopup()">OK</button>
        </div>
    `;
    popup.classList.add("popup");
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add("show");
    }, 100);
}

function closeWinPopup() {
    let popup = document.getElementById("winPopup");
    if (popup) {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }
}