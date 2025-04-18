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
  

document.addEventListener('DOMContentLoaded', () => {
    const playerNameElement = document.getElementById('playerName');
    const oddOneMessage = document.getElementById('oddOneMessage');
    const notOddOneMessage = document.getElementById('notOddOneMessage');
    const nextButton = document.getElementById('nextButton');
    const selectedCategory = localStorage.getItem('selectedCategory');

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

    function getRandomInt() {
        min = 1;
        max = countItemsInCollection();
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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


    let itemID = getRandomInt();
    //Get the itemRef from firestore with the itemID using the length of the collection
    let itemName = getItemFromFirestore(itemID);
    // Retrieve player names from localStorage
    const playerNames = JSON.parse(localStorage.getItem('playerNames')) || [];
    const oddOneIndex = JSON.parse(localStorage.getItem('oddOneIndex')) || getRandomInt(0, playerNames.length - 1);

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