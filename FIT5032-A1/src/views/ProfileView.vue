<template>
  <div class="d-flex justify-content-center align-items-start min-vh-100 mt-5">
    <div class="floating-box p-4 w-100" style="max-width: 500px;">
      <div class="text-center mb-4">
        <img
          v-if="profile?.photoURL"
          :src="profile.photoURL"
          class="rounded-circle"
          alt="User Avatar"
          width="100"
          height="100"
        />
        <i v-else class="bi bi-person-circle fs-1 text-secondary"></i>
      </div>

      <form @submit.prevent="saveProfile">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" v-model="profile.username" />
        </div>

        <div class="mb-3">
          <label class="form-label">First Name</label>
          <input type="text" class="form-control" v-model="profile.firstName" />
        </div>

        <div class="mb-3">
          <label class="form-label">Last Name</label>
          <input type="text" class="form-control" v-model="profile.lastName" />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="profile.email" disabled />
        </div>

        <div class="mb-3">
          <label class="form-label">Date of Birth</label>
          <input type="date" class="form-control" v-model="profile.dob" />
        </div>

        <button class="btn btn-primary w-100" type="submit">Save Changes</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase.js'

const userStore = useUserStore()

const profile = reactive({
  username: userStore.profile?.username || '',
  firstName: userStore.profile?.firstName || '',
  lastName: userStore.profile?.lastName || '',
  email: userStore.profile?.email || '',
  dob: userStore.profile?.dob || '',
  photoURL: userStore.profile?.photoURL || ''
})

const saveProfile = async () => {
  if (!userStore.firebaseUser) return
  const userRef = doc(db, 'users', userStore.firebaseUser.uid)

  try {
    await updateDoc(userRef, {
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      dob: profile.dob
    })
    alert('Profile updated successfully!')
    userStore.profile = { ...profile }
  } catch (err) {
    console.error(err)
    alert('Failed to update profile')
  }
}
</script>
