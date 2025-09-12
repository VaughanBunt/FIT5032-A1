import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const firebaseUser = ref(null)
  const profile = ref(null)

  const fetchUserProfile = async (uid) => {
    const docRef = doc(db, "users", uid)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      profile.value = snap.data()
    }
  }

  onAuthStateChanged(auth, async (user) => {
    firebaseUser.value = user
    if (user) {
      await fetchUserProfile(user.uid)
    } else {
      profile.value = null
    }
  })

  return { firebaseUser, profile }
})
