<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue'
import { storage } from 'boot/storage'
import { auth } from 'boot/auth'

export default defineComponent({
  name: 'App',
  setup () {
    onBeforeMount(() => {
      if (storage.exist('token')) {
        auth.initStore()
      } else {
        auth.logout()
      }
    })
  }
})
</script>
