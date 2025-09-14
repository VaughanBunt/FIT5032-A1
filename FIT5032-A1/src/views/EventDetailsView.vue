<template>
  <div class="d-flex justify-content-center align-items-start min-vh-100 py-5">
    <div class="floating-box p-4 w-100" style="max-width: 1000px;">

      <div v-if="loading" class="text-center">Loading event...</div>
      <div v-else-if="error" class="text-danger text-center">{{ error }}</div>

      <div v-else>
        <div class="event-banner mb-4">
          <img
            :src="event.bannerUrl || 'https://placehold.co/1200x200'"
            alt="Event Banner"
            class="img-fluid w-100 rounded shadow-sm"
          />
        </div>

        <div class="text-center mb-5">
          <h1 class="fw-bold">{{ event.name }}</h1>
          <h4 class="text-muted">{{ event.sport }}</h4>
        </div>

        <div class="row">
          <div class="col-md-4">
            <h5 class="mb-3">Attendees</h5>
            <div v-if="event.attendees && event.attendees.length" class="d-flex flex-column gap-3">
              <div
                v-for="(attendee, index) in event.attendees"
                :key="index"
                class="card p-2 d-flex align-items-center flex-row gap-3"
              >
                <img
                  :src="attendee.photo || 'https://placehold.co/50'"
                  class="rounded-circle"
                  width="50"
                  height="50"
                  alt="User"
                />
                <span>{{ attendee.name }}</span>
              </div>
            </div>
            <p v-else class="text-muted">No attendees yet.</p>
            <button class="btn btn-primary" @click.stop.prevent="applyToEvent" v-if="loggedIn && !alreadyApplied">
              Apply
            </button>
            <button class="btn btn-secondary" disabled v-else-if="loggedIn && alreadyApplied">
              Already Applied
            </button>
            <button class="btn btn-secondary" disabled @click.stop.prevent v-else>
              Log in to Apply
            </button>
          </div>

          <div class="col-md-8">
            <h5 class="mb-3">Reviews</h5>
            <div v-if="event.reviews">
              <div
                v-for="(review, index) in event.reviews"
                :key="index"
                class="card p-3 shadow-sm"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <strong>{{ review.user.name }}</strong>
                  <small class="text-muted">{{ review.date }}</small>
                </div>
                <div class="text-warning">
                  <span v-for="n in 5" :key="n">
                    {{ n <= review.rating ? '★' : '☆' }}
                  </span>
                </div>
                <p class="mb-0 mt-2">{{ review.comment }}</p>
              </div>
            </div>
            <p v-else class="text-muted">No reviews yet.</p>
            <div v-if="!alreadyReviewed && alreadyApplied">
              <h5 class="mt-4">Leave a Review</h5>
              <StarRating
                v-model:rating="reviewData.reviewRating"
                @blur="validateRating(true)"
                @input="validateRating(false)"
              />
              <div v-if="reviewErrors.reviewRating" class="text-danger">{{ reviewErrors.reviewRating }}</div>
              <textarea
                v-model="reviewData.reviewComment"
                class="form-control mt-2"
                placeholder="Write your review..."
                @blur="validateComment(true)"
                @input="validateComment(false)"
              ></textarea>
              <div v-if="reviewErrors.reviewComment" class="text-danger">{{ reviewErrors.reviewComment }}</div>
              <button class="btn btn-success mt-2" @click="leaveReview">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { auth, db } from '@/firebase/firebase.js'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import StarRating from '@/components/StarRating.vue'

const route = useRoute()
const event = ref(null)
const loading = ref(true)
const error = ref(null)

const reviewData = ref({
  reviewRating: 0,
  reviewComment: ""
})

const reviewErrors = ref({
  reviewRating: null,
  reviewComment: null
})

const loggedIn = computed(() => auth.currentUser != null)
const alreadyApplied = computed(() => {
  if (!event.value?.attendees || !auth.currentUser) return false
  return event.value?.attendees.some(user => user.uid === auth.currentUser.uid)
})
const alreadyReviewed = computed(() => {
  if (!event.value?.reviews || !auth.currentUser) return false
  return event.value?.reviews.some(review => review.user.uid === auth.currentUser.uid)
})

onMounted(async () => {
  loadData()
})

const validateComment = (blur) => {
  if (!reviewData.value.reviewComment || reviewData.value.reviewComment.trim().length < 10){
    if (blur) reviewErrors.value.reviewComment = "Comment must be at least 10 characters"
  } else{
    reviewErrors.value.reviewComment = null
  }
}

const validateRating = (blur) => {
  if (reviewData.value.reviewRating < 0){
    if (blur) reviewErrors.value.reviewRating = "Rating must be at least 0, How did you even manage to input a negative number?"
  } else if (reviewData.value.reviewRating > 5){
    if (blur) reviewErrors.value.reviewRating = "Rating must be at less than 6"
  } else{
    reviewErrors.value.reviewRating = null
  }
}

const loadData = async () =>{
  try {
    const id = route.query.id
    if (!id) {
      error.value = "No event ID provided."
      loading.value = false
      return
    }

    const docRef = doc(db, "events", id)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      event.value = {id: snapshot.id, ...snapshot.data()}
    } else {
      error.value = "Event not found."
    }
  } catch (err) {
    console.error(err)
    error.value = "Failed to load event."
  } finally {
    loading.value = false
  }
}

const applyToEvent = async () => {
  try {
    const eventRef = doc(db, "events", event.value.id)

    await updateDoc(eventRef, {
      attendees: arrayUnion({
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || "No Display Name",
        photo: auth.currentUser.photoURL || ""
      })
    })

    event.value.attendees = event.value.attendees || []
    event.value.attendees.push({
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName || "Anonymous",
      photo: auth.currentUser.photoURL || ""
    })
  } catch (error) {
    console.error("Error applying to event:", error)
  }
}

const leaveReview = async () => {
  if (!auth.currentUser || !event.value) return
  validateComment(true)
  validateRating(true)

  const hasErrors = Object.values(reviewErrors.value).some(err => err !== null)

  if (hasErrors) return

  const eventRef = doc(db, "events", route.query.id)

  const newReview = {
    user: {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName || "Anonymous"
    },
    ...reviewData.value,
    date: new Date().toISOString().split("T")[0]
  }

  await updateDoc(eventRef, {
    reviews: arrayUnion(newReview)
  })

  event.value.reviews = event.value.reviews || []
  event.value.reviews.push(newReview)

  loadData()
}
</script>
