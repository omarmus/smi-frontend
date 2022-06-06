<template>
  <q-scroll-area class="fit">
    <div class="layout-menu">
      <h1>
        <q-icon name="church" class="warning-light" size="32px" /> Sistema SMI
        <q-btn dense flat round icon="close" class="text-white" size="lg" @click="leftDrawerOpen = false" />
      </h1>
    </div>
    <div class="personal q-ma-md">
      <q-avatar size="48px" color="white">OG</q-avatar>
      <div class="personal-datos">
        <div class="personal-name">Omar Gutiérrez Condori</div>
        <div class="personal-company">Iglesia La Fortuna</div>
      </div>
    </div>
    <q-separator />
    <q-list padding class="menu-list">
      <q-item
        @click="$router.push('/secretary')" :active="$route.path === '/internacional'" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="edit_note" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Secretaria
        </q-item-section>
      </q-item>

      <q-item
        @click="$router.push('/treasury')" :active="$route.path === '/jovenes'" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="monetization_on" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Tesorería
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator />
    <q-list padding class="menu-list">
      <q-item
        @click="$router.push('/internacional')" :active="$route.path === '/internacional'" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="favorite" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Mis favoritos
        </q-item-section>
      </q-item>

      <q-item
        @click="$router.push('/jovenes')" :active="$route.path === '/jovenes'" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="share" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Compartir
        </q-item-section>
      </q-item>
      <q-item
        @click="$router.push('/jovenes')" :active="$route.path === '/jovenes'" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="download" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Descargar
        </q-item-section>
      </q-item>
      <q-item
        @click="darkModeChange" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="dark_mode" class="color-texto" />
        </q-item-section>

        <q-item-section>
          {{ darkMode ? `Desactivar modo oscuro` : `Activar modo oscuro` }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const darkMode = ref($q.dark.isActive)

function darkModeChange () {
  darkMode.value = !darkMode.value
  $q.dark.set(!$q.dark.isActive)
}
</script>

<style lang="scss">
.sidebar {
  background-color: $primary;
  color: #ffffff;
}
.personal-datos {
  padding-left: 15px;
  display: inline-block;
}
.personal-name {
  font-weight: bolder;
  font-size: 1rem;
}
.personal-company  {
  color: $texto;
  font-size: .9rem;
}
.personal {
  & > .q-avatar {
    vertical-align: top;
    color: $primary;
    font-weight: bolder;
  }
}
.layout-menu {
  h1 {
    margin: 0;
    font-size: 1.25rem;
    line-height: 50px;
    font-weight: bolder;
    padding: 0 15px;
    position: relative;

    & > .q-icon {
      margin-top: -8px;
    }

    .q-btn {
      right: 3px;
      top: 2px;
      position: absolute;
    }
  }
}
.card-menu-item {
  border-color: $texto;
  font-size: 14px;
  line-height: 1rem;
  padding: 6px;
  height: 72px;

  &:hover, &.active {
    border-color: $primary;
  }
}
.menu-list {
  font-size: 16px;

  .layout-menu-icon {
    padding: 0;
    min-width: 36px;
  }

  .q-item {
    min-height: 40px;

    &:hover, &.active, &:hover .color-texto {
      font-weight: bolder;
      color: $warning-light;
    }

    & > .q-focus-helper {
      background: transparent;
    }
  }

  .icon-presentation {
    padding-left: 2px;
  }
  .icon-letter {
    margin-bottom: -5px;
  }
}
</style>
