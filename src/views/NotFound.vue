<script setup lang="ts">
import RaiderIO from '../components/RaiderIO.vue';
import Alert from '../components/Alert.vue';
</script>

<template>
  <div class="w-full h-full">
    <Alert class="fixed w-full bottom-0" type="error"> 404 - Not Found </Alert>
    <a href="https://raider.io" target="_blank" rel="noreferrer" class="underline"
      ><RaiderIO title="powered by" class="fixed bottom-1.5 right-1.5 h-6 z-10"
    /></a>
  </div>
</template>

<style scoped></style>
