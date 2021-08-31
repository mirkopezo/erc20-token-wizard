import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyApna9Dagn5A5O7l9lrcJ3sDQtzqpMn5hE",
    authDomain: "crypto-internship-projec-8b94c.firebaseapp.com",
    projectId: "crypto-internship-projec-8b94c",
    storageBucket: "crypto-internship-projec-8b94c.appspot.com",
    messagingSenderId: "65903471109",
    appId: "1:65903471109:web:276d7a165da02e29fa0a6c",
    databaseURL: "https://crypto-internship-projec-8b94c-default-rtdb.europe-west1.firebasedatabase.app"
};
firebase.initializeApp(firebaseConfig);

export default firebase;