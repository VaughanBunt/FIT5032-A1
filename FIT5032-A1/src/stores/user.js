import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const firebaseUser = ref(null)
  const profile = ref(null)
  const userRole = ref('user')

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        profile.value = snap.data()
      } else {
        console.error('User profile not found')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  onAuthStateChanged(auth, async (user) => {
    firebaseUser.value = user
    if (user) {
      await fetchUserProfile(user.uid)
      await fetchUserRole(user.uid)
    } else {
      firebaseUser.value = null
      profile.value = null
      userRole.value = 'user'
    }
  })

  const fetchUserRole = async (uid) => {
    try {
      const docRef = doc(db, "users", uid)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        userRole.value = snap.data().role || 'user'
      } else {
        userRole.value = 'user'
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      userRole.value = 'user'
    }
  }

  return { firebaseUser, profile, userRole }
})
