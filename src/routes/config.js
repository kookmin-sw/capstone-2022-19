var admin = require("firebase-admin");

var serviceAccount = require("../public/data/ongamdock-project-firebase-adminsdk-vq6w0-68b5c5cd21.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ongamdock-project-default-rtdb.firebaseio.com"
});


const firebaseConfig = {
  apiKey: "AIzaSyBsMZhiWbYUOIUPAWQ2sjc-s2vM83JQs-8",
  authDomain: "ongamdock-project.firebaseapp.com",
  projectId: "ongamdock-project",
  storageBucket: "ongamdock-project.appspot.com",
  messagingSenderId: "569465704962",
  appId: "1:569465704962:web:c745e13de007b8313b8d1b"
};

// Initialize Firebase
let database = admin.firestore();

module.exports = database;