// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCalEYFS7-ROFSBgkdipILYTMPfesCkx1A",
  authDomain: "oddoneout-98e8e.firebaseapp.com",
  projectId: "oddoneout-98e8e",
  storageBucket: "oddoneout-98e8e.firebaseapp.com",
  messagingSenderId: "433401228455",
  appId: "1:433401228455:web:4588e20befa1f8f0243f82",
  measurementId: "G-74CCK0P86Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const selectedCategory = localStorage.getItem('selectedCategory');
let questionRef;

if (selectedCategory === "FOODS") {
    questionRef = collection(db, 'foodQuestions');
} else if (selectedCategory === "ANIMALS") {
    questionRef = collection(db, 'animalQuestions');
} else if (selectedCategory === "PLACES") {
    questionRef = collection(db, 'locationQuestions');
} else {
    questionRef = collection(db, 'foodQuestions'); // Default
}

// ✅ Global variable to hold the currently displayed question
let currentQuestion = null;

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
            questionDisplay.textContent = ""; 
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

        // ✅ Save to global variable
        currentQuestion = foodquestion;

        // ✅ Display based on language setting
        const lang = localStorage.getItem('lang');
        if (lang === 'spanish') {
            questionDisplay.textContent = foodquestion.spanishQuestion;
        } else {
            questionDisplay.textContent = foodquestion.englishQuestion;
        }

        nameDisplay.textContent = `${asker} ask ${askee}`;
    }

    // ✅ Update the question without progressing if language changes
    window.updateLanguageOnScreen = function () {
        const questionDisplay = document.getElementById('questionDisplay');
        const lang = localStorage.getItem('lang');

        if (!currentQuestion || !questionDisplay) return;

        if (lang === 'spanish') {
            questionDisplay.textContent = currentQuestion.spanishQuestion;
        } else {
            questionDisplay.textContent = currentQuestion.englishQuestion;
        }
    };

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
    const querySnapshot = await getDocs(questionRef);
    querySnapshot.forEach((doc) => {
        if (doc.data().questionID == questionID) {
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
