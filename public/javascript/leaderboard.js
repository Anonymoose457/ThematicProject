document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.querySelector('.leaderboard-container');

    // Retrieve voteCount data from localStorage
    let voteCount = JSON.parse(localStorage.getItem('voteCount'));

    // Retrieve the odd one out name from localStorage
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    const oddOneIndex = JSON.parse(localStorage.getItem('oddOneIndex'));
    const oddOneName = playerNames[oddOneIndex]; // Get the odd one out's name

    // Check if voteCount exists in localStorage
    if (!voteCount || voteCount.length === 0) {
        console.error('No vote data found in localStorage.');
        leaderboardContainer.innerHTML = '<p>No votes found. Please complete the voting first.</p>';
        return;
    }

    // Sort players by votes in descending order
    voteCount.sort((a, b) => b.votes - a.votes);

    // Clear the leaderboard container
    leaderboardContainer.innerHTML = '';

    // Populate the leaderboard
    voteCount.forEach((player, index) => {
        const positionDiv = document.createElement('div');
        positionDiv.classList.add('leaderboard');
        positionDiv.id = `position${index + 1}`;

        const positionText = document.createElement('div');
        positionText.classList.add('position-text');
        positionText.id = `position-text${index + 1}`;

        // Add "odd one out" next to the odd one out's name
        if (player.name === oddOneName) {
            positionText.textContent = `${index + 1}. ${player.name} - odd one out`;
        } else {
            positionText.textContent = `${index + 1}. ${player.name}`;
        }

        const pointsText = document.createElement('div');
        pointsText.classList.add('points-text');
        pointsText.textContent = `${player.votes} votes`;

        positionDiv.appendChild(positionText);
        positionDiv.appendChild(pointsText);
        leaderboardContainer.appendChild(positionDiv);
    });
});