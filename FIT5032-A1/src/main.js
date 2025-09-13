import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/HomeView.vue'
import FirebaseSignin from './views/FirebaseSigninView.vue'
import FirebaseRegister from './views/FirebaseRegisterView.vue'
import Profile from './views/ProfileView.vue'
import Browse from './views/BrowseView.vue'
import EventDetails from './views/EventDetailsView.vue'
import CreateEvent from './views/EventCreateView.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

const pinia = createPinia()

const routes = [
  { path: '/', component: Home },
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSignin},
  { path: '/FireRegister', name: 'FireRegister', component: FirebaseRegister},
  { path: '/Profile', name: 'Profile', component: Profile},
  { path: '/Browse', name: 'Browse', component: Browse},
  { path: '/EventDetails', name: 'EventDetails', component: EventDetails},
  { path: '/CreateEvent', name: 'CreateEvent', component: CreateEvent}

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).use(pinia).mount('#app')
