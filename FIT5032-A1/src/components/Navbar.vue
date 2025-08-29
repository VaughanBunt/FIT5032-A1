<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <nav class="navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">SportsConnect</a>
      </div>
    </nav>

    <form class="d-flex flex-grow-1 me-auto" role="search">
      <SearchBar />
    </form>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        <li class="nav-item dropdown">
          <Dropdown
            label="Explore"
            :items="[
              { text: 'Map', action: '() => {}' },
              { text: 'Search', action: '() => {}' },
              { text: 'Teams', action: '() => {}' },
              { text: 'Events', action: '() => {}' },
            ]"
            @select="() => {}"
          />
        </li>
        <li class="nav-item dropdown">
          <Dropdown
            label="Teams and Events"
            :items="[
              { text: 'Teams', action: '() => {}' },
              { text: 'Events', action: '() => {}' },
            ]"
            @select="() => {}"
          />
        </li>
        <li class="nav-item dropdown">
          <Dropdown label="Articles" @select="() => {}" />
        </li>
        <li class="nav-item dropdown">
          <Dropdown
            label="About Us"
            :items="[
              { text: 'Meet the team', action: '() => {}' },
              { text: 'Contact us', action: '() => {}' },
            ]"
            @select="() => {}"
          />
        </li>
      </ul>
    </div>

    <nav class="me-auto">
      <IconButton icon="person-circle" />
    </nav>
  </nav>
</template>

<script setup>
import Dropdown from './Dropdown.vue'
import SearchBar from './SearchBar.vue'
import IconButton from './IconButton.vue'
</script>
