document.addEventListener('DOMContentLoaded', () => {
    const playerNameElement = document.getElementById('playerName');
    const oddOneMessage = document.getElementById('oddOneMessage');
    const notOddOneMessage = document.getElementById('notOddOneMessage');
    const nextButton = document.getElementById('nextButton');

    // Retrieve player names from localStorage
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    const oddOneIndex = JSON.parse(localStorage.getItem('oddOneIndex')) || Math.floor(Math.random() * playerNames.length);

    // Save the odd one index to localStorage if not already saved
    if (!localStorage.getItem('oddOneIndex')) {
        localStorage.setItem('oddOneIndex', JSON.stringify(oddOneIndex));
    }

    let currentIndex = 0;

    function updateContent() {
        // Reset messages
        oddOneMessage.style.display = 'none';
        notOddOneMessage.style.display = 'none';

        if (currentIndex < playerNames.length) {
            // Show the player's name
            playerNameElement.textContent = playerNames[currentIndex];
            nextButton.textContent = 'Reveal';
        } else {
            // End of the game, redirect to questions.html
            window.location.href = 'questions.html';
        }
    }

    nextButton.addEventListener('click', () => {
        if (nextButton.textContent === 'Reveal') {
            // Reveal if the player is the odd one out
            if (currentIndex === oddOneIndex) {
                oddOneMessage.style.display = 'block';
            } else {
                notOddOneMessage.style.display = 'block';
            }
            nextButton.textContent = 'Next';
        } else {
            // Move to the next player
            currentIndex++;
            updateContent();
        }
    });

    // Initialize the content
    updateContent();
});