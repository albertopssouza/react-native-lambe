import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'

const firebaseConfig = {
        apiKey: "minha-chave",
        authDomain: "lambe-d5175.firebaseapp.com",
        databaseURL: "https://lambe-d5175.firebaseio.com",
        projectId: "lambe-d5175",
        storageBucket: "lambe-d5175.appspot.com",
        messagingSenderId: "sender-id",
        appId: "lambe-d5175",
        measurementId: "G-measurement-id",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
