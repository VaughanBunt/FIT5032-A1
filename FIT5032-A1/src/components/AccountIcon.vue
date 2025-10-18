<template>
  <div class="dropdown">
    <i
      :class="userIconClass"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style="cursor: pointer"
    ></i>

    <ul class="dropdown-menu dropdown-menu-end">
      <template v-if="!isLoggedIn">
        <li class="nav-item">
          <router-link class="dropdown-item nav-link" to="/FireLogin">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="dropdown-item nav-link" to="/FireRegister">Register</router-link>
        </li>
      </template>
      <template v-else>
        <li class="nav-item">
          <router-link class="dropdown-item nav-link" to="/Profile">Profile</router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <router-link class="dropdown-item nav-link" to="/AdminDashboard">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <button class="dropdown-item nav-link" @click="logout">Logout</button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user.js'
import { getAuth, signOut } from 'firebase/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const auth = getAuth()
const router = useRouter()

const isLoggedIn = computed(() => !!userStore.firebaseUser)

const userIconClass = computed(() => {
  if (userStore.firebaseUser?.photoURL) {
    return 'rounded-circle'
  }
  return 'bi bi-person-circle fs-2 text-white'
})

const logout = async () => {
  await signOut(auth)
  router.push('/') // redirect home
}

const isAdmin = computed(() => {
  console.log('User Role:', userStore.userRole)
  return isLoggedIn.value && userStore.userRole == "admin"
})
</script>
