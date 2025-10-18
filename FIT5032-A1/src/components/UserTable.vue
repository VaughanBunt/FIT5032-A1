<template>
	<h4>User List</h4>

	<table class="table">
		<thead>
		<tr>
			<th @click="sort('username')" :class="{'sorted': isSortedBy('username')}">
				UserName 
				<span v-if="isSortedBy('username')">{{ getSortIcon('username') }}</span>
				<input
					v-model="searchUsername"
					type="text"
					class="form-control form-control-sm mt-2"
					placeholder="Search"
					@click.stop  
				/>
			</th>
			<th @click="sort('email')" :class="{'sorted': isSortedBy('email')}">
				Email 
				<span v-if="isSortedBy('email')">{{ getSortIcon('email') }}</span>
				<input
					v-model="searchEmail"
					type="text"
					class="form-control form-control-sm mt-2"
					placeholder="Search"
					@click.stop  
				/>
			</th>
			<th @click="sort('role')" :class="{'sorted': isSortedBy('role')}">
				Role 
				<span v-if="isSortedBy('role')">{{ getSortIcon('role') }}</span>
				<input
					v-model="searchRole"
					type="text"
					class="form-control form-control-sm mt-2"
					placeholder="Search"
					@click.stop 
				/>
			</th>
			<th @click="sort('eventCount')" :class="{'sorted': isSortedBy('eventCount')}">
				Events 
				<span v-if="isSortedBy('eventCount')">{{ getSortIcon('eventCount') }}</span>
			</th>
			<th @click="sort('warnings')" :class="{'sorted': isSortedBy('warnings')}">
				Warnings 
				<span v-if="isSortedBy('warnings')">{{ getSortIcon('warnings') }}</span>
			</th>
			<th @click="sort('lastActive')" :class="{'sorted': isSortedBy('lastActive')}">
				Last Active 
				<span v-if="isSortedBy('lastActive')">{{ getSortIcon('lastActive') }}</span>
			</th>
			<th @click="sort('status')" :class="{'sorted': isSortedBy('status')}">
				Status 
				<span v-if="isSortedBy('status')">{{ getSortIcon('status') }}</span>
			</th>
			<th>Actions</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="user in paginatedUsers" :key="user.id">
			<td>{{ user.username }}</td>
			<td>{{ user.email }}</td>
			<td>{{ user.role || 'user' }}</td>
			<td>{{ eventCounts[user.id] }}</td>
			<td>{{ user.warnings || '0' }}</td>
			<td>{{ user.lastActive || 'N/A' }}</td>
			<td>{{ user.status || 'active' }}</td>
			<td>
				<button class="btn btn-sm btn-info" v-if="user.role !== 'admin'">Promote</button>
				<button class="btn btn-sm btn-warning" v-if="user.role == 'moderator' || user.role == 'admin'">Demote</button>
				<button class="btn btn-sm btn-warning">Suspend</button>
				<button class="btn btn-sm btn-danger">Ban</button>
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
import { ref, computed, onMounted, reactive } from 'vue'
import { db } from '@/firebase/firebase.js'
import axios from 'axios'

const users = ref([]);
const eventCounts = reactive({});
const searchUsername = ref('');
const searchEmail = ref('');
const searchRole = ref('');
const currentPage = ref(1);
const usersPerPage = 10;
const sortKey = ref('username');
const sortOrder = ref('asc');

const fetchUsers = async () => {
	try {
		const userCollection = collection(db, 'users')
		const userSnapshot = await getDocs(userCollection)
		users.value = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

		for (let user of users.value){
			await getEventCount(user.id)
		}
	} catch (error) {
		console.error('Error fetching users: ', error)
	}
}

const totalPages = computed(() => {
  const filteredUsers = filteredAndSortedUsers.value || [];
  return Math.ceil(filteredUsers.length / usersPerPage);
});

const paginatedUsers = computed(() => {
  const filteredUsersArray = [...filteredAndSortedUsers.value];

  const start = (currentPage.value - 1) * usersPerPage;
  const end = start + usersPerPage;
  return filteredUsersArray.slice(start, end);
});

const filteredAndSortedUsers = computed(() => {
  const filteredUsers = users.value.filter(user => {
	const usernameMatches = user.username.toLowerCase().includes(searchUsername.value.toLowerCase());
	const emailMatches = user.email.toLowerCase().includes(searchEmail.value.toLowerCase());
	const roleMatches = (user.role?.toLowerCase() || 'user').includes(searchRole.value.toLowerCase());

	return usernameMatches && emailMatches && roleMatches;
  });

  const sortedUsers = [...filteredUsers];
  if (sortKey.value) {
	sortedUsers.sort((a, b) => {
	  let valueA = a[sortKey.value] || '';
	  let valueB = b[sortKey.value] || '';
	  if (sortKey.value === 'eventCount') {
		valueA = eventCounts[a.id] || 0;
		valueB = eventCounts[b.id] || 0;
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
  return sortedUsers;
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
	currentPage.value = page;
  }
}

const sort = (key) => {
  if (key === sortKey.value) {
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

const getEventCount = async (uid) => {
  try {
	const response = await axios.get(
	  "https://countevents-tt6m6dcmxq-uc.a.run.app",
	  {
		params: {
		  uid: uid
		}
	  }
	);
	eventCounts[uid] = response.data.count;
  } catch (error) {
	console.error('Error fetching event count: ', error);
	eventCounts[uid] = 0;
  }
}

onMounted(() => {
  fetchUsers();
})
</script>

