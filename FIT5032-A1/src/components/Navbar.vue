<template>
  <nav class="navbar navbar-expand-lg bg-primary navbar-dark">
    <div class="container-fluid">

      <router-link class="navbar-brand" to="/">SportsConnect</router-link>

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
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Explore
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/Map">Map</router-link></li>
              <li><router-link class="dropdown-item" to="/Search">Search</router-link></li>
              <li><router-link class="dropdown-item" :to="{ path: '/Browse', query: { type: 'team' } }">Teams</router-link></li>
              <li><router-link class="dropdown-item" :to="{ path: '/Browse', query: { type: 'event' } }">Events</router-link></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Teams and Events
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/Browse">Browse</router-link></li>
              <li><router-link class="dropdown-item" :to="{ path: '/Browse', query: { type: 'team' } }">Teams</router-link></li>
              <li><router-link class="dropdown-item" :to="{ path: '/Browse', query: { type: 'event' } }">Events</router-link></li>
            </ul>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/Articles">
              Articles
            </router-link>
          </li>


          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              About Us
            </a>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/AboutUs">Meet the team</router-link></li>
              <li><router-link class="dropdown-item" to="/Contact">Contact us</router-link></li>
            </ul>
          </li>

        </ul>
      </div>

      <div class="d-flex align-items-center ms-2 me-2">
        <AccountIcon />
      </div>
    </div>
  </nav>
</template>

<script setup>
import SearchBar from './SearchBar.vue'
import AccountIcon from './AccountIcon.vue'
</script>
