<template>
  <div class="d-flex min-vh-100">
    <div class="sidebar p-3 bg-light" style="width: 250px;">
      <h5>Admin Dashboard</h5>
      <div class="list-group">
        <button class="list-group-item list-group-item-action" @click="viewUsers">View Users</button>
        <button class="list-group-item list-group-item-action" @click="viewEvents">View Events</button>
      </div>
    </div>

    <div class="content-area p-4 w-100">
      <div v-if="currentView === 'users'">
        <UserTable/>
      </div>

      <!-- View Events Section -->
      <div v-if="currentView === 'events'">
        <EventTable/>
      </div>
    </div>
  </div>
</template>

<script setup>
import EventTable from '@/components/EventTable.vue'
import UserTable from '@/components/UserTable.vue'
import { ref, computed } from 'vue'

const currentView = ref('users')  // Default to view users

const events = ref([
  { id: 1, title: 'Vue.js Workshop', date: '2022-11-01', location: 'New York' },
  { id: 2, title: 'React Summit', date: '2022-12-15', location: 'San Francisco' },
  { id: 3, title: 'JavaScript Conference', date: '2023-01-20', location: 'Los Angeles' },
  { id: 4, title: 'Angular Meetup', date: '2023-02-10', location: 'Seattle' },
  { id: 5, title: 'CSS and HTML5 Workshop', date: '2023-03-05', location: 'Chicago' },
  { id: 6, title: 'Node.js Hackathon', date: '2023-04-10', location: 'Austin' },
  { id: 7, title: 'Django DevCon', date: '2023-05-25', location: 'Dallas' },
  { id: 8, title: 'Ruby on Rails Meetup', date: '2023-06-15', location: 'San Diego' },
  { id: 9, title: 'PHP Conference', date: '2023-07-08', location: 'Miami' },
  { id: 10, title: 'Java Dev Summit', date: '2023-08-12', location: 'Boston' },
  { id: 11, title: 'GoLang Conference', date: '2023-09-25', location: 'Austin' },
])

const currentPage = ref(1)
const currentEventPage = ref(1)
const usersPerPage = 10
const eventsPerPage = 10

const totalPages = computed(() => Math.ceil(users.value.length / usersPerPage))
const eventTotalPages = computed(() => Math.ceil(events.value.length / eventsPerPage))

// Pagination for Users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return users.value.slice(start, end)
})

// Pagination for Events
const paginatedEvents = computed(() => {
  const start = (currentEventPage.value - 1) * eventsPerPage
  const end = start + eventsPerPage
  return events.value.slice(start, end)
})

const viewUsers = () => {
  currentView.value = 'users'
}

const viewEvents = () => {
  currentView.value = 'events'
}

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const changeEventPage = (page) => {
  if (page > 0 && page <= eventTotalPages.value) {
    currentEventPage.value = page
  }
}
</script>

<style scoped>
.sidebar {
  min-width: 200px;
}
.content-area {
  flex-grow: 1;
  padding: 20px;
}
</style>