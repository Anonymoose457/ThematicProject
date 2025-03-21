document.addEventListener('DOMContentLoaded', () => {
    const votingForm = document.getElementById('votingForm');
    const result = document.getElementById('result');
    const currentPlayerInput = document.getElementById('currentPlayer');
    const playerOptions = document.getElementById('playerOptions');

    // Retrieve player data from local storage
    const players = JSON.parse(localStorage.getItem('players')) || [
        { id: 1, name: 'Player 1', votes: 0, oddOneOut: false },
        { id: 2, name: 'Player 2', votes: 0, oddOneOut: false },
        { id: 3, name: 'Player 3', votes: 0, oddOneOut: false },
        { id: 4, name: 'Player 4', votes: 0, oddOneOut: false },
        { id: 5, name: 'Player 5', votes: 0, oddOneOut: false },
        { id: 6, name: 'Player 6', votes: 0, oddOneOut: true }
    ];

    const totalPlayers = players.length;

    // Dynamically generate player voting options
    players.forEach(player => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'player';
        input.value = player.name;
        const span = document.createElement('span');
        span.textContent = player.name;
        label.appendChild(input);
        label.appendChild(span);
        playerOptions.appendChild(label);
    });

    votingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedPlayer = document.querySelector('input[name="player"]:checked');
        if (selectedPlayer) {
            const currentPlayer = parseInt(currentPlayerInput.value);
            if (selectedPlayer.value === `Player ${currentPlayer}`) {
                result.textContent = 'You cannot vote for yourself. Please select another player.';
                return;
            }

            result.textContent = `Player ${currentPlayer} voted for ${selectedPlayer.value}`;

            // Update the votes for the selected player
            const votedPlayer = players.find(player => player.name === selectedPlayer.value);
            if (votedPlayer) {
                votedPlayer.votes += 1;
            }

            if (currentPlayer < totalPlayers) {
                currentPlayerInput.value = currentPlayer + 1;
                result.textContent += `. Next is Player ${currentPlayer + 1}`;
            } else {
                result.textContent += `. All players have voted.`;
                votingForm.querySelector('button[type="submit"]').disabled = true;
                //change page to leaderboard 
                window.location.href = '/leaderboard.html';

                // Determine the player with the most votes
                const oddOneOut = players.reduce((prev, current) => (prev.votes > current.votes) ? prev : current);
                result.textContent += ` ${oddOneOut.name} has been voted as the odd one out.`;
            }

            // Clear the selected radio button
            selectedPlayer.checked = false;

            // Save updated player data back to local storage
            localStorage.setItem('players', JSON.stringify(players));
        } else {
            result.textContent = 'Please select a player to vote for.';
        }
    });
});