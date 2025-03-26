// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCalEYFS7-ROFSBgkdipILYTMPfesCkx1A",
  authDomain: "oddoneout-98e8e.firebaseapp.com",
  projectId: "oddoneout-98e8e",
  storageBucket: "oddoneout-98e8e.firebasestorage.app",
  messagingSenderId: "433401228455",
  appId: "1:433401228455:web:4588e20befa1f8f0243f82",
  measurementId: "G-74CCK0P86Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const foodQRef = collection(db, 'foodQuestions');

document.addEventListener('DOMContentLoaded', async () => {
    const nameDisplay = document.getElementById('nameDisplay');
    const questionDisplay = document.getElementById('questionDisplay');
    const nextButton = document.getElementById('nextButton');

    // Retrieve player names from localStorage
    const names = JSON.parse(localStorage.getItem('playerNames')) || [];

    let currentIndex = 0;
    const totalNames = names.length;

    async function updateContent() {
        if (currentIndex >= totalNames) {
            window.location.href = '/voting.html';
            nameDisplay.textContent = 'EVERYONE ASKED';
            const question = "";
            questionDisplay.textContent = question; 
            nextButton.disabled = true;
            return;
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const asker = names[currentIndex];
        const askee = names[(currentIndex + 1) % totalNames];
        const questionID = getRandomInt(1, 7);
        let foodquestion = await getQuestionFromFirestore(questionID);

        if (localStorage.getItem('lang') === 'spanish') {
            const question = foodquestion.spanishQuestion;
            questionDisplay.textContent = question;
        } else {
            const question = foodquestion.englishQuestion;
            questionDisplay.textContent = question;
        }

        nameDisplay.textContent = `${asker} ask ${askee}`;
    }

    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateContent();
    });

    updateContent();
});

class Question {
    constructor(questionID, lang_en, lang_es) {
        this._questionID = questionID;
        this._lang_en = lang_en;
        this._lang_es = lang_es;
    }

    get englishQuestion() {
        return this._lang_en;
    }

    get spanishQuestion() {
        return this._lang_es;
    }

    get questionID() {
        return this._questionID;
    }
}

const getQuestionFromFirestore = async (questionID) => {
    let returnQuestion = null;
    const querySnapshot = await getDocs(foodQRef);
    querySnapshot.forEach((doc) => {
        if (doc.data().questionID == questionID) { // Check the question ID in the database matches the question ID queried 
            returnQuestion = questionConverter.fromFirestore(doc);
        }
    });
    return returnQuestion;
};

const questionConverter = {
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Question(data.questionID, data.lang_en, data.lang_es);
    }
};