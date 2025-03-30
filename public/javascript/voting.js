document.addEventListener('DOMContentLoaded', () => {
    const votingForm = document.getElementById('votingForm');
    const result = document.getElementById('result');
    const currentPlayerInput = document.getElementById('currentPlayer');
    const playerOptions = document.getElementById('playerOptions');
    const currentPlayerNameElement = document.getElementById('currentPlayerName');

    // Retrieve player names from localStorage
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];

    // Initialize voteCount based on playerNames
    const voteCount = JSON.parse(localStorage.getItem('voteCount')) || playerNames.map(name => ({
        name: name,
        votes: 0
    }));

    const totalPlayers = playerNames.length;

    // Function to update the current player's name
    function updateCurrentPlayerName() {
        const currentPlayerIndex = parseInt(currentPlayerInput.value) - 1;
        if (currentPlayerIndex >= 0 && currentPlayerIndex < playerNames.length) {
            currentPlayerNameElement.textContent = `${playerNames[currentPlayerIndex]}'s Turn to Vote`;
        }
    }

    // Dynamically generate player voting options
    playerNames.forEach(playerName => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'player';
        input.value = playerName;
        const span = document.createElement('span');
        span.textContent = playerName;
        label.appendChild(input);
        label.appendChild(span);
        playerOptions.appendChild(label);
    });

    votingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedPlayer = document.querySelector('input[name="player"]:checked');
        if (selectedPlayer) {
            const currentPlayer = parseInt(currentPlayerInput.value);
            if (selectedPlayer.value === playerNames[currentPlayer - 1]) {
                result.textContent = 'You cannot vote for yourself. Please select another player.';
                return;
            }

            result.textContent = `${playerNames[currentPlayer - 1]} voted for ${selectedPlayer.value}`;

            // Update the votes for the selected player
            const votedPlayer = voteCount.find(player => player.name === selectedPlayer.value);
            if (votedPlayer) {
                votedPlayer.votes += 1;
            }

            if (currentPlayer < totalPlayers) {
                currentPlayerInput.value = currentPlayer + 1;
                updateCurrentPlayerName(); // Update the current player's name
                result.textContent += `. Next is ${playerNames[currentPlayer]}`;
            } else {
                result.textContent += `. All players have voted.`;
                votingForm.querySelector('button[type="submit"]').disabled = true;

                // Save updated voteCount back to localStorage
                localStorage.setItem('voteCount', JSON.stringify(voteCount));

                // Redirect to leaderboard
                window.location.href = '/leaderboard.html';
            }

            // Clear the selected radio button
            selectedPlayer.checked = false;
        } else {
            result.textContent = 'Please select a player to vote for.';
        }
    });

    // Initialize the current player's name
    updateCurrentPlayerName();
});