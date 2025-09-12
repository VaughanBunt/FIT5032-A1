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
      <li class="nav-item">
        <router-link class="dropdown-item nav-link" to="/FireLogin">Login</router-link>
      </li>
      <li class="nav-item">
        <router-link class="dropdown-item nav-link" to="/FireRegister">Register</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup></script>
