<template>
  <div class="d-flex justify-content-center align-items-start min-vh-100 py-5">
    <div class="floating-box p-4 w-100" style="max-width: 1000px;">

      <h1 class="text-center">
        Create Your Event
      </h1>

      <form class="container mt-4" @submit.prevent="createEvent">

        <div class="row mb-3 align-items-center">
          <label for="name" class="col-sm-3 col-form-label">Event Name</label>
          <div class="col-sm-9">
            <input
              type="text"
              id="name"
              class="form-control"
              placeholder="Enter event name"
              v-model="formData.name"
              required
            />
          </div>
        </div>

        <div class="row mb-3 align-items-center">
        <label for="description" class="col-sm-3 col-form-label">Event Description</label>
        <div class="col-sm-9">
          <textarea
            id="description"
            class="form-control"
            placeholder="Enter event description"
            v-model="formData.desc"
            rows="4"
            required
          ></textarea>
        </div>
      </div>

        <div class="row mb-3 align-items-center">
          <label for="sport" class="col-sm-3 col-form-label">Sport</label>
          <div class="col-sm-9">
            <select id="sport" class="form-select" v-model="formData.sport" required>
              <option disabled value="">Select sport</option>
              <option v-for="(sport, index) in sports" :key="index" :value="sport">
                {{ sport }}
              </option>
            </select>
          </div>
        </div>

        <div class="row mb-3 align-items-center">
          <label for="date" class="col-sm-3 col-form-label">Date</label>
          <div class="col-sm-9">
            <input
              type="date"
              id="date"
              class="form-control"
              v-model="formData.date"
              required
            />
          </div>
        </div>

        <div class="row mb-3 align-items-center">
          <label class="col-sm-3 col-form-label">Recurring</label>
          <div class="col-sm-9">
            <input
              type="checkbox"
              id="recurring"
              v-model="formData.recurring"
            />
            <label for="recurring" class="ms-2">Yes</label>
          </div>
        </div>

        <div class="row mb-3 align-items-center">
          <label for="capacity" class="col-sm-3 col-form-label">Capacity</label>
          <div class="col-sm-9">
            <input
              type="number"
              id="capacity"
              class="form-control"
              placeholder="Enter max participants"
              v-model="formData.capacity"
              min="1"
            />
          </div>
        </div>

        <div class="row mb-3 align-items-center">
          <label class="col-sm-3 col-form-label">Public Event</label>
          <div class="col-sm-9">
            <input
              type="checkbox"
              id="public"
              v-model="formData.isPublic"
            />
            <label for="public" class="ms-2">Visible to everyone</label>
          </div>
        </div>

        <div class="row">
          <div class="offset-sm-3 col-sm-9">
            <button type="submit" class="btn btn-success">Create Event</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db} from '@/firebase/firebase.js'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const router = useRouter()

const sports = [
    "Football (AFL)",
    "Soccer",
    "Cricket",
    "Basketball",
    "Tennis"
  ]

const formData = ref({
  name: '',
  desc: '',
  sport: '',
  date: '',
  recurring: false,
  capacity: null,
  isPublic: false
})

const createEvent = async () => {
  try {
    const eventDoc = {
      ...formData.value,
      owner: {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName
      },
      type: "event",
      createdAt: new Date()
    }

    const docRef = await addDoc(collection(db, "events"), eventDoc)
    console.log("Event created with ID:", docRef.id)
    router.push({ path: "/EventDetails", query: { id: docRef.id } })
  } catch (err) {
    console.error("Error creating event:", err)
  }
}
</script>
