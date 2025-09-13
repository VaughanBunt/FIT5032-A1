<template>
  <form class="container mt-4" @submit.prevent="signin">

    <div class="row mb-3 align-items-center">
      <label for="email" class="col-sm-3 col-form-label">Email</label>
      <div class="col-sm-9">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter email"
          v-model="formData.email"
        />
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="password" class="col-sm-3 col-form-label">Password</label>
      <div class="col-sm-9">
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
          v-model="formData.password"
        />
        <div v-if="err" class="text-danger">{{ err }}</div>
      </div>
    </div>
    <div class="row">
      <div class="offset-sm-3 col-sm-9">
        <button type="submit" class="btn btn-primary">Sign In</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase/firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const formData = ref({
  email: '',
  password: ''
})

const errorMessages = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/invalid-credential": "Incorrect password. Please try again.",
  "auth/missing-password": "Please enter your password."
}

const err = ref("")

const router = useRouter()

const signin = () => {
  signInWithEmailAndPassword(auth, formData.value.email, formData.value.password)
  .then(() => {
    console.log("Firebase Login Successful!")
    err.value = ""
    router.push("/")
  }).catch((error) => {
    console.log(error.code)
    err.value = errorMessages[error.code]
  })
}
</script>
