import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCalEYFS7-ROFSBgkdipILYTMPfesCkx1A",
    authDomain: "oddoneout-98e8e.firebaseapp.com",
    projectId: "oddoneout-98e8e",
    storageBucket: "oddoneout-98e8e.firebasestorage.app",
    messagingSenderId: "433401228455",
    appId: "1:433401228455:web:4588e20befa1f8f0243f82",
    measurementId: "G-74CCK0P86Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const playerNameElement = document.getElementById('playerName');
    const oddOneMessage = document.getElementById('oddOneMessage');
    const notOddOneMessage = document.getElementById('notOddOneMessage');
    const nextButton = document.getElementById('nextButton');
    const selectedCategory = localStorage.getItem('selectedCategory');

    // Add item display element
    const itemDisplay = document.createElement('p'); // Element to display the item
    notOddOneMessage.parentNode.insertBefore(itemDisplay, nextButton); // Insert below the "not odd one out" message
    itemDisplay.style.display = 'none'; // Initially hide the item display

    let itemRef;
    if (selectedCategory === "FOODS") {
        itemRef = collection(db, 'foodItems');
    } else if (selectedCategory === "ANIMALS") {
        itemRef = collection(db, 'animalItems');
    } else if (selectedCategory === "PLACES") {
        itemRef = collection(db, 'locationItems');
    } else {
        itemRef = collection(db, 'foodItems'); // Default to foodItems
    }

    // Load items from Firestore into localStorage
    async function loadItemsIntoLocalStorage() {
        const querySnapshot = await getDocs(itemRef);
        const items = [];
        querySnapshot.forEach((doc) => {
            items.push(doc.data()); // Add each document's data to the array
        });

        // Save items to localStorage
        localStorage.setItem('gameItems', JSON.stringify(items));
        console.log('Items loaded into localStorage:', items);
    }

    // Function to get a random item from localStorage
    function getRandomItemFromLocalStorage() {
        const items = JSON.parse(localStorage.getItem('gameItems')) || [];
        if (items.length === 0) {
            return null; // No items available
        }
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    // Load items into localStorage at the start of the game
    if (!localStorage.getItem('gameItems')) {
        await loadItemsIntoLocalStorage();
    }

    // Retrieve player names from localStorage
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    const oddOneIndex = JSON.parse(localStorage.getItem('oddOneIndex')) || Math.floor(Math.random() * playerNames.length);

    if (!localStorage.getItem('oddOneIndex')) {
        localStorage.setItem('oddOneIndex', JSON.stringify(oddOneIndex));
    }

    let currentIndex = 0;
    let currentItem = null; // Store the current item for the round

    function updateContent() {
        oddOneMessage.style.display = 'none';
        notOddOneMessage.style.display = 'none';
        itemDisplay.style.display = 'none';

        if (currentIndex < playerNames.length) {
            // Update the player's name from the playerNames array
            playerNameElement.textContent = `${playerNames[currentIndex]}'s Turn`;
            nextButton.textContent = 'Reveal';

            // Select a random item for the round if not already selected
            if (!currentItem) {
                currentItem = getRandomItemFromLocalStorage();
            }
        } else {
            window.location.href = 'questions.html';
        }
    }

    nextButton.addEventListener('click', async () => {
        if (nextButton.textContent === 'Reveal') {
            if (currentIndex === oddOneIndex) {
                oddOneMessage.style.display = 'block';
                itemDisplay.style.display = 'none'; // Hide the item for the odd one out
            } else {
                notOddOneMessage.style.display = 'block';

                // Display the current item for the round
                if (currentItem && currentItem.lang_en) {
                    itemDisplay.textContent = `Item: ${currentItem.lang_en}`;
                    itemDisplay.style.display = 'block';
                } else {
                    itemDisplay.textContent = 'No item found.';
                    itemDisplay.style.display = 'block';
                }
            }
            nextButton.textContent = 'Next';
        } else {
            currentIndex++;
            if (currentIndex === playerNames.length) {
                currentItem = null; // Reset the item for the next round
            }
            updateContent();
        }
    });

    updateContent();
});