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

function updateLeaderboard() {
    players.sort((a, b) => b.score - a.score);
    let playerList = document.getElementById("playerList");
    let leaderboard = document.getElementById("players");

    playerList.innerHTML = "";
    leaderboard.innerHTML = "";

    players.forEach((player, index) => {
        let li = document.createElement("li");
        li.textContent = `${player.name}: ${player.score}`;

        if (index === currentPlayerIndex) {
            li.classList.add("current-turn");
            li.textContent += " (Playing)";
        } else if (index === (currentPlayerIndex + 1) % players.length) {
            li.classList.add("next-turn");
            li.textContent += " (Next)";
        }

        let liClone = li.cloneNode(true);
        playerList.appendChild(liClone);
        leaderboard.appendChild(li);
    });
}

function updateCurrentScore(score) {
    document.getElementById("currentScore").textContent = score;
}

// Load existing players from localStorage when the page loads
updateLeaderboard();