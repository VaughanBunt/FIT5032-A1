<template>
  <div class="d-flex justify-content-center align-items-start min-vh-100 py-5">
    <div class="floating-box p-4 w-100" style="max-width: 1000px;">

      <h1 class="text-center">{{ eventId ? 'Edit Event' : 'Create Your Event' }}</h1>

      <form class="container mt-4" @submit.prevent="eventId ? updateEvent() : createEvent()">

        <div class="row mb-3 align-items-center">
          <label for="name" class="col-sm-3 col-form-label">Event Name</label>
          <div class="col-sm-9">
            <input
              type="text"
              id="name"
              class="form-control"
              placeholder="Enter event name"
              v-model="formData.name"
              @blur="validateName(true)"
              @input="validateName(false)"
            />
            <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
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
              @blur="validateDesc(true)"
              @input="validateDesc(false)"
              rows="4"
            ></textarea>
            <div v-if="errors.desc" class="text-danger">{{ errors.desc }}</div>
          </div>
        </div>

        <div class="row mb-3 align-items-center">
          <label for="sport" class="col-sm-3 col-form-label">Sport</label>
          <div class="col-sm-9">
            <select
              id="sport"
              class="form-select"
              v-model="formData.sport"
              @blur="validateSport(true)"
              @input="validateSport(false)"
            >
              <option disabled value="">Select sport</option>
              <option v-for="(sport, index) in sports" :key="index" :value="sport">
                {{ sport }}
              </option>
            </select>
            <div v-if="errors.sport" class="text-danger">{{ errors.sport }}</div>
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
              @blur="validateDate(true)"
              @input="validateDate(false)"
            />
            <div v-if="errors.date" class="text-danger">{{ errors.date }}</div>
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
              v-model.number="formData.capacity"
              @blur="validateCapacity(true)"
              @input="validateCapacity(false)"
            />
            <div v-if="errors.capacity" class="text-danger">{{ errors.capacity }}</div>
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
            <button type="submit" class="btn btn-success">
              {{ eventId ? 'Update Event' : 'Create Event' }}
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/firebase.js'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const sports = ["Football (AFL)", "Soccer", "Cricket", "Basketball", "Tennis"]

const formData = ref({
  name: '',
  desc: '',
  sport: '',
  date: '',
  recurring: false,
  capacity: null,
  isPublic: false
})

const formDataBefore = ref({})

const errors = ref({
  name: null,
  desc: null,
  sport: null,
  date: null,
  capacity: null
})

const eventId = route.query.id 

const validateName = (blur) => { 
  if (
    !formData.value.name 
    || formData.value.name.trim().length < 3
  ){
    if (blur) errors.value.name = "Event name must be at least 3 characters" 
  } else{ errors.value.name = null } 
} 
const validateDesc = (blur) => {
  if (
    !formData.value.desc 
    || formData.value.desc.trim().length < 10
  ){ 
    if (blur) errors.value.desc = "Description must be at least 10 characters" 
  } else{ 
    errors.value.desc = null 
  } 
} 
const validateSport = (blur) => {
  if (!formData.value.sport){
    if (blur) errors.value.sport = "Please select a sport" 
  } else{ 
    errors.value.sport = null 
  } 
} 
const validateDate = (blur) => { 
  if (!formData.value.date) { 
    if (blur) errors.value.date = "Please select a date" 
  } else if (new Date(formData.value.date) < new Date()) { 
    if (blur) errors.value.date = "Date must be in the future" 
  } else {
    errors.value.date = null 
  } 
} 
const validateCapacity = (blur) => { 
  if (
    formData.value.capacity == null 
    || formData.value.capacity < 1
  ){ 
    if (blur) errors.value.capacity = "Capacity must be at least 1" 
  } else{ 
    errors.value.capacity = null 
  } 
}

const loadEvent = async () => {
  if (!eventId) return

  const eventDocRef = doc(db, "events", eventId)
  const eventDoc = await getDoc(eventDocRef)

  if (eventDoc.exists()) {
    formData.value = { ...eventDoc.data() }
    formDataBefore.value = { ...eventDoc.data() }
  } else {
    console.error("Event not found")
  }
}

const createEvent = async () => {
  validateName(true)
  validateDesc(true)
  validateSport(true)
  validateDate(true)
  validateCapacity(true)

  const hasErrors = Object.values(errors.value).some(err => err !== null)
  if (hasErrors){
    console.error(errors.value)
    return
  }

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

const updateEvent = async () => {
  validateName(true)
  validateDesc(true)
  validateSport(true)
  validateDate(true)
  validateCapacity(true)

  const hasErrors = Object.values(errors.value).some(err => err !== null)
  if (hasErrors) return

  try {
    const eventDocRef = doc(db, "events", eventId)
    await updateDoc(eventDocRef, { ...formData.value })
    console.log("Event updated with ID:", eventId)
    await emailParticipants()
    router.push({ path: "/EventDetails", query: { id: eventId } })
  } catch (err) {
    console.error("Error updating event:", err)
  }
}

const emailParticipants = async () => {
  const dateChanged = formDataBefore.value.date !== formData.value.date;
  const sportChanged = formDataBefore.value.sport !== formData.value.sport;

  if (!dateChanged && !sportChanged){
      return;
  }

  try{
    const idToken = await auth.currentUser.getIdToken(true)
    const response = await axios.get(
      "https://emailparticipants-tt6m6dcmxq-uc.a.run.app",
      {
        params: {
          id: eventId
        },
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    console.log(response.data)
  } catch (error) {
    console.error('Error emailing participants: ', error);
  }
  
}

onMounted(() => {
  loadEvent()
})
</script>
