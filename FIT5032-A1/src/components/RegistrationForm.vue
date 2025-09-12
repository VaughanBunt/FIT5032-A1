<template>
  <form class="container mt-4" @submit.prevent="submitForm">
    <div class="row mb-3 align-items-center">
      <label for="username" class="col-sm-3 col-form-label">UserName</label>
      <div class="col-sm-9">
        <input
          type="text"
          class="form-control"
          id="username"
          placeholder="Enter username"
          @blur="validateName(true, formData.username, 'username')"
          @input="validateName(false, formData.username, 'username')"
          v-model="formData.username"
        />
        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="first-name" class="col-sm-3 col-form-label">First Name</label>
      <div class="col-sm-9">
        <input
          type="text"
          class="form-control"
          id="first-name"
          placeholder="Enter first name"
          @blur="validateName(true, formData.firstName, 'firstName')"
          @input="validateName(false, formData.firstName, 'firstName')"
          v-model="formData.firstName"
        />
        <div v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</div>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="last-name" class="col-sm-3 col-form-label">Last Name</label>
      <div class="col-sm-9">
        <input
          type="text"
          class="form-control"
          id="last-name"
          placeholder="Enter last name"
          @blur="validateName(true, formData.lastName, 'lastName')"
          @input="validateName(false, formData.lastName, 'lastName')"
          v-model="formData.lastName"
        />
        <div v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</div>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="dob" class="col-sm-3 col-form-label">Date of Birth</label>
      <div class="col-sm-9">
        <input
          type="date"
          class="form-control"
          id="dob"
          @blur="validateDob(true)"
          @input="validateDob(false)"
          v-model="formData.dob"
        />
        <div v-if="errors.dob" class="text-danger">{{ errors.dob }}</div>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="email" class="col-sm-3 col-form-label">Email</label>
      <div class="col-sm-9">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter email"
          @blur="validateEmail(true)"
          @input="validateEmail(false)"
          v-model="formData.email"
        />
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
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
          @blur="validatePassword(true)"
          @input="validatePassword(false)"
          v-model="formData.password"
        />
        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
      </div>
    </div>

    <div class="row mb-3 align-items-center">
      <label for="confirm-password" class="col-sm-3 col-form-label">Confirm Password</label>
      <div class="col-sm-9">
        <input
          type="password"
          class="form-control"
          id="confirm-password"
          placeholder="Confirm password"
          @blur="validateConfirmPassword(true)"
          @input="validateConfirmPassword(false)"
          v-model="formData.confirmPassword"
        />
        <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
      </div>
    </div>

    <div class="row">
      <div class="offset-sm-3 col-sm-9">
        <button type="submit" class="btn btn-primary">Register</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase.js'
import { useUserStore } from '@/stores/user.js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'


const formData = ref({
  username: '',
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const router = useRouter()

const register = async () => {
  const data = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password)
  await updateProfile(data.user, {displayName: formData.value.username})
  const userDoc = {
    username: formData.value.username,
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    dob: formData.value.dob,
    email: formData.value.email,
    createdAt: new Date()
  }
  await setDoc(doc(db, "users", data.user.uid), userDoc)
  const userStore = useUserStore()
  userStore.firebaseUser = data.user
  userStore.profile = userDoc
  console.log("Firebase Register Successful!")
}

const submitForm = async () => {
  validateName(true, formData.value.username, 'username')
  validateName(true, formData.value.firstName, 'firstName')
  validateName(true, formData.value.lastName, 'lastName')
  validateDob(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.password) {
    try{
      await register()
      clearForm()
      router.push("/")
    } catch (error){
      console.log(error.code)
    }
  }
}

const errors = ref({
  username: null,
  firstName: null,
  lastName: null,
  dob: null,
  email: null,
  password: null,
  confirmPassword: null,
})

const clearForm = () => {
  formData.value = {
    username: '',
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  errors.value = {
    username: null,
    firstName: null,
    lastName: null,
    dob: null,
    email: null,
    password: null,
    confirmPassword: null,
  }
}

const validateName = (blur, name, err) => {
  if (name.length < 3) {
    if (blur) errors.value[err] = 'Name must be at least 3 characters'
  } else {
    errors.value[err] = null
  }
}

function calculateAge(dob) {
  if (!dob) return null
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

const validateDob = (blur) => {
  const age = calculateAge(formData.value.dob)

  if (!age) {
    if (blur) errors.value.dob = 'Date of birth is required'
  } else if (isNaN(age) || age < 0) {
    errors.value.dob = 'Invalid date of birth'
  } else if (age < 13) {
    errors.value.dob = 'You must be at least 13 years old'
  } else {
    errors.value.dob = null
  }
}

const validateEmail = (blur) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
  if (!isEmail) {
    if (blur) errors.value.email = 'Please enter a valid email.'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[ !@#$%^&* ( ),.?":{}|<>]/.test(password)
  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password != formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else if (errors.value.password) {
    errors.value.confirmPassword = errors.value.password
  } else {
    errors.value.confirmPassword = null
  }
}
</script>
