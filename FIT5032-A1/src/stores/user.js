import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const firebaseUser = ref(null)
  const profile = ref(null)
  const userRole = ref('user')
  const inactivityTimeout = ref(null)
  const timeLimit = 10 * 60 * 1000 

  const activityEvents = ['mousemove', 'keydown', 'scroll', 'click']

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.value) clearTimeout(inactivityTimeout.value)
    if (!firebaseUser.value) return

    const docRef = doc(db, 'users', firebaseUser.value.uid)
    inactivityTimeout.value = setTimeout(async () => {
      await setDoc(docRef, {
        online: false,
        lastSeen: new Date(),
      }, { merge: true })
    }, timeLimit)
  }

  const attachActivityListeners = () => {
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimeout)
    )
  }

  const removeActivityListeners = () => {
    activityEvents.forEach((event) =>
      window.removeEventListener(event, resetInactivityTimeout)
    )
  }

  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
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

  const fetchUserRole = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
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

  onAuthStateChanged(auth, async (user) => {
    firebaseUser.value = user

    if (user) {
      await fetchUserProfile(user.uid)
      await fetchUserRole(user.uid)

      const docRef = doc(db, 'users', user.uid)
      await setDoc(docRef, {
        online: true,
        lastSeen: new Date(),
      }, { merge: true })

      resetInactivityTimeout()
      attachActivityListeners()
    } else {
      if (inactivityTimeout.value) {
        clearTimeout(inactivityTimeout.value)
        inactivityTimeout.value = null
      }
      removeActivityListeners()

      if (firebaseUser.value) {
        const docRef = doc(db, 'users', firebaseUser.value.uid)
        await setDoc(docRef, {
          online: false,
          lastSeen: new Date(),
        }, { merge: true })
      }

      firebaseUser.value = null
      profile.value = null
      userRole.value = 'user'
    }
  })

  return { firebaseUser, profile, userRole }
})
