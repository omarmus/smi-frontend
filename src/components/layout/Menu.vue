7<template>
  <q-scroll-area class="fit">
    <div class="layout-menu">
      <h1>
        <q-icon name="church" class="warning-light" size="32px" /> Secretaría & Tesorería
        <!-- <q-btn dense flat round icon="close" class="text-white" size="lg" @click="leftDrawerClose" /> -->
      </h1>
    </div>
    <div class="personal q-ma-md">
      <q-avatar size="48px" color="white">{{ $store.state.user?.user?.username?.substring(0, 2).toUpperCase() }}</q-avatar>
      <div class="personal-datos">
        <div class="personal-name">{{ $store.state.user?.user?.fullname }}</div>
        <div class="personal-company">{{ $store.state.user?.user?.company?.name }}</div>
      </div>
    </div>
    <q-separator />
    <q-select
      v-if="roles?.length > 1"
      square standout
      color="teal"
      label="Rol seleccionado"
      v-model="role"
      :options="roles"
      option-value="id"
      option-label="name"
      emit-value
      map-options
      dark />
    <q-separator />
    <q-list padding class="menu-list">
      <q-item
        v-if="['TREASURER'].indexOf($store.state.user.role?.slug) === -1"
        @click="$router.push('/secretary')" :active="$route.path.indexOf('/secretary') !== -1" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="edit_note" class="color-texto" />
        </q-item-section>

        <q-item-section>
          Secretaria
        </q-item-section>
      </q-item>

      <q-item
        v-if="['SECRETARY'].indexOf($store.state.user?.role?.slug) === -1"
        @click="$router.push('/treasury')" :active="$route.path.indexOf('/treasury') !== -1" clickable v-ripple>
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
      <!-- <q-item
        @click="darkModeChange" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="dark_mode" class="color-texto" />
        </q-item-section>
        <q-item-section>
          {{ darkMode ? `Desactivar modo oscuro` : `Activar modo oscuro` }}
        </q-item-section>
      </q-item> -->
      <q-item
        @click="logout" clickable v-ripple>
        <q-item-section avatar class="layout-menu-icon">
          <q-icon name="logout" class="color-texto" />
        </q-item-section>

        <q-item-section>Salir de sistema</q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// import { useQuasar } from 'quasar'
import { auth, UserResponse } from 'boot/auth'
import { http } from 'boot/http'
import { storage } from 'boot/storage'
import { useRouter } from 'vue-router'
import { Role } from '../entities/Permission'
import { useStore } from '../../store'

const store = useStore()
const router = useRouter()

// function leftDrawerClose () {
//   store.commit('global/setOpen', false)
// }

// const $q = useQuasar()
// const darkMode = ref($q.dark.isActive)

const role = ref<Role>()
const roles = ref<Role[]>()

// function darkModeChange () {
//   darkMode.value = !darkMode.value
//   $q.dark.set(!$q.dark.isActive)
// }

function logout () {
  auth.logout('store')
}

watch(role, async () => {
  if (typeof role.value === 'number') {
    const data = await http.get(`auth/token/${role.value as string}`) as UserResponse
    storage.set('role', data.role)
    storage.set('menu', data.menu)
    storage.set('permissions', data.permissions)
    storage.set('token', data.token)
    auth.initStore()
    return router.push('/')
  }
})

onMounted(() => {
  roles.value = store.state.user.roles
  role.value = store.state.user.role
})
</script>

<style lang="scss">
.sidebar {
  background-color: $primary;
  color: #ffffff;
}
.personal-datos {
  padding-left: 15px;
}
.personal-name {
  font-weight: bolder;
  font-size: .95rem;
  line-height: 1.2rem;
}
.personal-company  {
  color: $texto;
  font-size: .8rem;
}
.personal {
  display: grid;
  grid-template-columns: 40px 1fr;

  & > .q-avatar {
    vertical-align: top;
    color: $primary;
    font-weight: bolder;
  }
}
.layout-menu {
  h1 {
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: -.05rem;
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
  font-size: .95rem;
  line-height: .95rem;
  padding: 6px;
  height: 72px;

  &:hover, &.active {
    border-color: $primary;
  }
}
.menu-list {
  font-size: .95rem;

  .layout-menu-icon {
    padding: 0;
    min-width: 36px;
  }

  .q-item {
    min-height: 40px;

    &:hover,
    &.active,
    &:hover
    .color-texto,
    &.q-router-link--active,
    &.q-router-link--active .color-texto {
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
