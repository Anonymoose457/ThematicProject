document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.querySelector('.leaderboard-container');

    // Retrieve player data from localStorage
    let players = JSON.parse(localStorage.getItem('players'));

    // Check if players exist in localStorage
    if (!players) {
        console.error('No players found in localStorage.');
        leaderboardContainer.innerHTML = '<p>No players found. Please complete the voting first.</p>';
        return;
    }

    // Sort players by votes in descending order
    players.sort((a, b) => b.votes - a.votes);

    // Clear the leaderboard container
    leaderboardContainer.innerHTML = '';

    // Populate the leaderboard
    players.forEach((player, index) => {
        const positionDiv = document.createElement('div');
        positionDiv.classList.add('leaderboard');
        positionDiv.id = `position${index + 1}`;

        const positionText = document.createElement('div');
        positionText.classList.add('position-text');
        positionText.id = `position-text${index + 1}`;
        positionText.textContent = `${index + 1}. ${player.name}`;

        const pointsText = document.createElement('div');
        pointsText.classList.add('points-text');
        pointsText.textContent = `${player.votes} votes`;

        positionDiv.appendChild(positionText);
        positionDiv.appendChild(pointsText);
        leaderboardContainer.appendChild(positionDiv);
    });
});