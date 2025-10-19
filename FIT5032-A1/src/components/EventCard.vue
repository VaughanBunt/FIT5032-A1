<template>
  <div
    class="card mb-3 text-decoration-none text-dark"
    style="max-width: 600px; cursor: pointer;"
  >
    <router-link
      class="row g-0 align-items-center m-2 text-decoration-none text-dark"
      :to="{ path: '/EventDetails', query: { id: event.id } }"
    >
      <div class="col-md-4">
        <img
          :src="event.image || 'https://placehold.co/150x150'"
          class="img-fluid rounded-start"
          alt="Event Image"
        />
      </div>

      <div class="col-md-8 d-flex flex-column justify-content-between">
        <div class="card-body">
          <h5 class="card-title">{{ event.name }}</h5>
          <p class="card-text text-truncate">{{ event.desc }}</p>
          <p class="card-text">{{ event.owner.displayName }}</p>
        </div>
      </div>
    </router-link>

    <div class="card-footer bg-transparent border-top-0 d-flex justify-content-end">
      <StarRating :rating="avgRating" :editable="false" class="me-auto" />

      <div v-if="!isAdmin">
        <button
          class="btn btn-secondary"
          disabled
          v-if="!loggedIn"
        >
          Log in to Apply
        </button>

        <div v-else-if="isOwner" class="dropdown">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Options
          </button>
          <ul class="dropdown-menu">
            <li>
              <button class="dropdown-item" @click="editEvent">
                Edit Event
              </button>
            </li>
            <li>
              <button class="dropdown-item text-danger" @click="deleteEvent">
                Delete Event
              </button>
            </li>
          </ul>
        </div>

        <button
          class="btn btn-primary"
          @click.stop.prevent="applyToEvent"
          v-else-if="!alreadyApplied"
        >
          Apply
        </button>
        <button class="btn btn-secondary" disabled v-else-if="alreadyApplied">
          Already Applied
        </button>
      </div>

      <div v-else class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Options
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" @click="applyToEvent" :disabled="alreadyApplied">
              Apply as Participant
            </button>
          </li>
          <li>
            <button class="dropdown-item text-danger" @click="deleteEvent">
              Delete Event
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { auth, db } from '@/firebase/firebase.js'
import { useUserStore } from '@/stores/user.js'
import { ref, computed, onMounted } from 'vue'
import { doc, updateDoc, getDoc, deleteDoc, arrayUnion } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import StarRating from './StarRating.vue'

const userStore = useUserStore()
const loggedIn = computed(() => auth.currentUser != null)
const router = useRouter()

const alreadyApplied = computed(() => {
  if (!props.event.attendees || !auth.currentUser) return false
  return props.event.attendees.some(user => user.uid === auth.currentUser.uid)
})
const isAdmin = computed(() => {
  return loggedIn.value && userStore.userRole == "admin"
})

const isOwner = computed(() =>{
  return props.event.owner.uid == auth.currentUser.uid
})

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      image: '',
      name: '',
      description: '',
      reviews: [],
      owner: ''
    })
  }
})

const applyToEvent = async () => {
  try {
    const eventRef = doc(db, "events", props.event.id)

    await updateDoc(eventRef, {
      attendees: arrayUnion({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photo: auth.currentUser.photoURL,
        email: auth.currentUser.email
      })
    })
  } catch (error) {
    console.error("Error applying to event:", error)
  }
}

const avgRating = computed(() => {
  const reviews = props.event.reviews || []
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  return Math.round(total / reviews.length)
})

const deleteEvent = async () => {
  if (!confirm("Are you sure you want to delete this event?")) return
  try {
    const eventRef = doc(db, "events", props.event.id)
    await deleteDoc(eventRef)
    alert("Event deleted")
    router.go(0)
  } catch (err) {
    console.error("Error deleting event:", err)
  }
}

const editEvent = async () => {
  try {
    router.push(`/CreateEvent?id=${props.event.id}`)
  } catch (err) {
    console.error("Error editing event:", err)
  }
}
</script>
