<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/monster_1.png" width="125" height="125" />
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/why">Why BlinkBlink</RouterLink>
        <RouterLink to="/rule">The 20-20-20 Rule</RouterLink>
        <RouterLink to="/pricing">Pricing</RouterLink>
        <RouterLink to="/download">Download</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
