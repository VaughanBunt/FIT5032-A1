import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import App from './App.vue'
import Home from './views/HomeView.vue'
import Login from './views/LoginView.vue'
import Register from './views/RegisterView.vue'
import FirebaseSignin from './views/FirebaseSigninView.vue'
import FirebaseRegister from './views/FirebaseRegisterView.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNjyB1PoqDDBAdCV4KGO4p5PgA4BmKovk",
  authDomain: "sportsconnect-d6d51.firebaseapp.com",
  projectId: "sportsconnect-d6d51",
  storageBucket: "sportsconnect-d6d51.firebasestorage.app",
  messagingSenderId: "753285700826",
  appId: "1:753285700826:web:0f2ad5d29224d84f1f19e3",
  measurementId: "G-008MZC63E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSignin},
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegister},
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
