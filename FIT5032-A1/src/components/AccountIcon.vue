<template>
  <div class="dropdown">
    <i
      class="bi bi-person-circle fs-2 text-white"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style="cursor: pointer"
    ></i>

    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <router-link class="dropdown-item" to="/login">Login</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/register">Register</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup></script>
