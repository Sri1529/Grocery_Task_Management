import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  //config
  apiKey: "AIzaSyCOGYTlwi9lzprr2wzeyGxu6COc5kEDJ1o",
  authDomain: "login-ce817.firebaseapp.com",
  projectId: "login-ce817",
  storageBucket: "login-ce817.appspot.com",
  messagingSenderId: "807420895104",
  appId: "1:807420895104:web:ff1cf50a9b996fd8262b65",
  measurementId: "G-EGG74M2M0N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);