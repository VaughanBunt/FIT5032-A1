<template>
	<h4>Event List</h4>

	<table class="table">
		<thead>
			<tr>
				<th @click="sort('name')" :class="{'sorted': isSortedBy('name')}">
					Title
					<span v-if="isSortedBy('name')">{{ getSortIcon('name') }}</span>
					<input
						v-model="searchTitle"
						type="text"
						class="form-control form-control-sm mt-2"
						placeholder="Search"
						@click.stop  
					/>
				</th>
				<th @click="sort('date')" :class="{'sorted': isSortedBy('date')}">
					Date
					<span v-if="isSortedBy('date')">{{ getSortIcon('date') }}</span>
				</th>
				<th @click="sort('sport')" :class="{'sorted': isSortedBy('sport')}">
					Sport
					<span v-if="isSortedBy('sport')">{{ getSortIcon('sport') }}</span>
					<input
						v-model="searchSport"
						type="text"
						class="form-control form-control-sm mt-2"
						placeholder="Search"
						@click.stop  
					/>
				</th>
				<th @click="sort('capacity')" :class="{'sorted': isSortedBy('capacity')}">
					Capacity
					<span v-if="isSortedBy('capacity')">{{ getSortIcon('capacity') }}</span>
				</th>
				<th @click="sort('owner.displayName')" :class="{'sorted': isSortedBy('owner.displayName')}">
					Owner
					<span v-if="isSortedBy('owner.displayName')">{{ getSortIcon('owner.displayName') }}</span>
					<input
						v-model="searchOwner"
						type="text"
						class="form-control form-control-sm mt-2"
						placeholder="Search"
						@click.stop  
					/>
				</th>
				<th @click="sort('reports')" :class="{'sorted': isSortedBy('reports')}">
					Reports
					<span v-if="isSortedBy('reports')">{{ getSortIcon('reports') }}</span>
				</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="event in paginatedEvents" :key="event.id">
				<td>{{ event.name }}</td>
				<td>{{ event.date }}</td>
				<td>{{ event.sport }}</td>
				<td>{{ event.attendees.length }}/{{ event.capacity }}</td>
				<td>{{ event.owner.displayName }}</td>
				<td>{{ event.reports?.length || 0 }}</td>
				<td>
					<button class="btn btn-sm btn-primary">View</button>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="d-flex justify-content-center">
		<button class="btn btn-sm btn-secondary" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
		<span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
		<button class="btn btn-sm btn-secondary" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
	</div>
</template>

<script setup>
import { collection, getDocs } from 'firebase/firestore'
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase/firebase.js'

const events = ref([]);
const searchTitle = ref('');
const searchSport = ref('');
const searchOwner = ref('');
const currentPage = ref(1);
const eventsPerPage = 10;
const sortKey = ref('name');
const sortOrder = ref('asc');

const fetchEvents = async () => {
	try {
		const eventCollection = collection(db, 'events')
		const eventSnapshot = await getDocs(eventCollection)
		events.value = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
	} catch (error) {
		console.error('Error fetching events: ', error)
	}
}

const totalPages = computed(() => {
	const filteredEvents = filteredAndSortedEvents.value || [];
	return Math.ceil(filteredEvents.length / eventsPerPage);
});

const paginatedEvents = computed(() => {
  const filteredEventssArray = [...filteredAndSortedEvents.value];

  const start = (currentPage.value - 1) * eventsPerPage;
  const end = start + eventsPerPage;
  return filteredEventssArray.slice(start, end);
});

const filteredAndSortedEvents = computed(() => {
	const filteredEvents = events.value.filter(event => {
		const titleMatches = event.name.toLowerCase().includes(searchTitle.value.toLowerCase());
		const sportMatches = event.sport.toLowerCase().includes(searchSport.value.toLowerCase());
		const ownerMatches = event.owner.displayName.toLowerCase().includes(searchOwner.value.toLowerCase());

		return titleMatches && sportMatches && ownerMatches;
  });

	const sortedEvents = [...filteredEvents];
	if (sortKey.value) {
		sortedEvents.sort((a, b) => {
			let valueA = a[sortKey.value] || '';
			let valueB = b[sortKey.value] || '';
			
			if (sortKey.value === 'reports') {
				valueA = a.reports?.length || 0;
				valueB = b.reports?.length || 0;
			}
			if (sortKey.value === 'capacity') {
				valueA = a.capacity || 0;
				valueB = b.capacity || 0;
			}

			if (typeof valueA === 'string') {
				valueA = valueA.toLowerCase();
				valueB = valueB.toLowerCase();
			}

			if (valueA < valueB) {
				return sortOrder.value === 'asc' ? -1 : 1;
			}
			if (valueA > valueB) {
				return sortOrder.value === 'asc' ? 1 : -1;
			}
			return 0;
		});
	}
	return sortedEvents;
});

const changePage = (page) => {
	if (page > 0 && page <= totalPages.value) {
		currentPage.value = page;
	}
}

const sort = (key) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
	} else {
		sortKey.value = key;
		sortOrder.value = 'asc';
	}
}

const getSortIcon = (key) => {
	if (sortKey.value === key) {
		return sortOrder.value === 'asc' ? '↑' : '↓';
	}
	return '';
}

const isSortedBy = (key) => {
	return sortKey.value === key;
}

onMounted(() => {
	fetchEvents();
})
</script>

