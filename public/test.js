// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "APIKEY",
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
document.addEventListener('DOMContentLoaded', async () => { //Looks through database once the page is loaded

let questionID = document.getElementById('questionID').value;

const englishCheckbox = document.getElementById('english');
const spanishCheckbox = document.getElementById('spanish');
const outputTextarea = document.getElementById('output');

englishCheckbox.addEventListener('change', async () => {
  if (englishCheckbox.checked) {
      let foodquestion = await getQuestionFromFirestore(questionID);
      const question = foodquestion.englishQuestion;
      outputTextarea.value = question;
  } else {
      outputTextarea.value = '';
  }
});

spanishCheckbox.addEventListener('change', async () => {
  if (spanishCheckbox.checked) {
      let foodquestion = await getQuestionFromFirestore(questionID);
      const question = foodquestion.spanishQuestion;
      outputTextarea.value = question;
  } else {
      outputTextarea.value = '';
  }
});

console.log(foodquestion.englishQuestion);
console.log(foodquestion.spanishQuestion);
});


const getQuestionFromFirestore = async (questionID) => {
  let returnQuestion = null;
  const querySnapshot = await getDocs(foodQRef);
  querySnapshot.forEach((doc) => {
      if (doc.data().questionID == questionID) { //Check the question ID in the database matches the question ID queried 
          returnQuestion = questionConverter.fromFirestore(doc);
      }
  });
  return returnQuestion;
}

const questionConverter = {
  fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Question(data.questionID, data.lang_en, data.lang_es);
  }
}


class Lobby{
  constructor(lobbyID, hostID, currentPlayers)
  {
    this._lobbyID = lobbyID;
    this._hostID = hostID;
    this._currentPlayers = currentPlayers;
  }

  get lobbyID(){
    return this._lobbyID;
  }

  get hostID(){
    return this._hostID;
  }

  get currentPlayers(){
    return this._currentPlayers;
  }
}


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

