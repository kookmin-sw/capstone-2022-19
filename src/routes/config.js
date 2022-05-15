const { initializeApp } = require('firebase/app');
const { getFirestore } = require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyAVlndUwE5oUNLbeHCiplp_Y27LMNLncPU",
  authDomain: "ongamdock-54e3e.firebaseapp.com",
  projectId: "ongamdock-54e3e",
  storageBucket: "ongamdock-54e3e.appspot.com",
  messagingSenderId: "1080662317677",
  appId: "1:1080662317677:web:178d6405cbd1a9041ffd64"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getFirestore(firebase);


module.exports = {
  firebase,
  database,
}  