<template>
  <q-layout view="lHh lpR lFf">
    <q-header
      class="q-header-main">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          class="warning-light"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <!-- <q-icon name="church" /> -->
        <!-- <span class="title-smi">Sistema SMI</span> -->
        <q-space />
      </q-toolbar>
    </q-header>
    <!-- <q-drawer
      class="sidebar"
      v-model="$store.state.global.open"
      side="left"
      overlay
      behavior="mobile"> -->
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="270"
      class="sidebar"
    >
      <Menu />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer bordered class="q-footer-main">
      <div class="footer">
        <a href="https://omarmus.com" target="_blank">omarmus.com</a> © {{ new Date().getFullYear() }}
      </div>
    </q-footer> -->
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import Menu from '../components/layout/Menu'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss">+
.title-smi {
  font-size: 1.3rem;
  font-weight: bold;
  display: inline-block;
  padding-left: 10px;
}
</style>
