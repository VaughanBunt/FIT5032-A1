<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="floating-box p-4 w-100" style="max-width: 800px;">
      <div class="d-flex justify-content-end mb-3" v-if="loggedIn">
        <router-link to="/CreateEvent" class="btn btn-primary">
          + Create Event
        </router-link>
      </div>

      <p class="text-center" v-if="events.length == 0">No Events to Show</p>
      <ul class="list-unstyled" v-else>
        <li v-for="(event, index) in events" :key="index" class="mb-3">
          <EventCard :event="event" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import EventCard from '@/components/EventCard.vue'
import { useRoute } from 'vue-router'
import { auth, db } from '@/firebase/firebase.js'
import { collection, getDocs, query, where } from 'firebase/firestore'

const loggedIn = computed(() => auth.currentUser != null)

const route = useRoute()
console.log(route.query)

const events = ref([])

const fetchEvents = async () => {
  try {
    let q = collection(db, "events")

    if (route.query.type) {
      q = query(q, where("type", "==", route.query.type))
    }

    const snapshot = await getDocs(q)
    events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (err) {
    console.error("Error fetching events:", err)
  }
}

onMounted(fetchEvents)
watch(() => route.query, fetchEvents)

</script>
