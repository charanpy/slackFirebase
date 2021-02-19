import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD907OT5AFQYuqiSFKbADCWaG60Lbiz1GY",
    authDomain: "slack-640f8.firebaseapp.com",
    projectId: "slack-640f8",
    storageBucket: "slack-640f8.appspot.com",
    messagingSenderId: "863960778233",
    appId: "1:863960778233:web:010e79686f2f6b0bcd2928",
    measurementId: "G-7JYW64MTH3"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
