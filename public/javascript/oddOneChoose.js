import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
        itemRef = collection(db, 'foodQuestions');
    } else if (selectedCategory === "ANIMALS") {
        itemRef = collection(db, 'animalQuestions');
    } else if (selectedCategory === "PLACES") {
        itemRef = collection(db, 'locationQuestions');
    } else {
        itemRef = collection(db, 'foodQuestions'); // Default to foodQuestions
    }

    async function countItemsInCollection() {
        const querySnapshot = await getDocs(itemRef);
        return querySnapshot.size; // Returns the number of documents in the collection
    }

    async function getItemFromFirestore(itemID) {
        const q = query(itemRef, where("itemID", "==", itemID));
        const querySnapshot = await getDocs(q);

        let item = null;
        querySnapshot.forEach((doc) => {
            item = doc.data(); // Retrieve the document data
        });

        return item;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    const oddOneIndex = JSON.parse(localStorage.getItem('oddOneIndex')) || getRandomInt(0, playerNames.length - 1);

    if (!localStorage.getItem('oddOneIndex')) {
        localStorage.setItem('oddOneIndex', JSON.stringify(oddOneIndex));
    }

    let currentIndex = 0;

    function updateContent() {
        oddOneMessage.style.display = 'none';
        notOddOneMessage.style.display = 'none';
        itemDisplay.style.display = 'none';

        if (currentIndex < playerNames.length) {
            playerNameElement.textContent = playerNames[currentIndex];
            nextButton.textContent = 'Reveal';
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

                const randomItemID = getRandomInt(1, await countItemsInCollection());
                const item = await getItemFromFirestore(randomItemID);
                if (item && item.questionText) {
                    itemDisplay.textContent = `Question: ${item.questionText}`;
                    itemDisplay.style.display = 'block';
                } else {
                    itemDisplay.textContent = 'No item found.';
                    itemDisplay.style.display = 'block';
                }
            }
            nextButton.textContent = 'Next';
        } else {
            currentIndex++;
            updateContent();
        }
    });

    updateContent();
});