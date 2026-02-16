7<template>
  <q-scroll-area class="fit">
    <div class="layout-menu">
      <h1 class="header-icon">
        Secretaría & Tesorería
        <!-- <q-btn dense flat round icon="close" class="text-white" size="lg" @click="leftDrawerClose" /> -->
      </h1>
    </div>
    <div class="personal q-ma-md">
      <q-avatar size="48px" color="white">
        <img
          v-if="$store.state.user?.user?.photo"
          :src="`${urlBase?.replace(/\/api\//g, '')}/files/users/${$store.state.user?.user?.photo}`"
          :alt="$store.state.user?.user?.username?.substring(0, 2).toUpperCase()">
        <span v-else>{{ $store.state.user?.user?.username?.substring(0, 2).toUpperCase() }}</span>
      </q-avatar>
      <div class="personal-datos">
        <div class="personal-name">{{ $store.state.user?.user?.fullname }}</div>
        <div class="personal-company">{{ $store.state.user?.user?.company?.name }}</div>
      </div>
    </div>
    <q-separator />
    <q-select
      v-if="roles && roles?.length > 1"
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
    <template v-if="isAdminTreasury">
      <q-separator />
      <q-select
        filled
        v-model="companyId"
        :options="companiesFilter"
        label="Iglesia seleccionada"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        use-input
        input-debounce="200"
        @filter="filterCompaniesFn"
        dark />
    </template>
    <q-separator />
    <q-list>
      <q-expansion-item
        group="somegroup"
        :icon="item.icon"
        :label="item.label"
        header-class="text-white menu-list"
        v-for="item in menu"
        :key="item.path"
      >
        <q-list padding class="menu-list menu-sublist" v-if="item.items">
          <q-item
            v-for="subitem in item.items"
            :key="subitem.path"
            @click="goPath(subitem)" :active="$route.path.indexOf(subitem.path) !== -1" clickable v-ripple>
            <q-item-section avatar class="layout-menu-icon"></q-item-section>
            <q-item-section>
              {{ subitem.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
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
import { auth, initStorage, UserResponse } from 'boot/auth'
import { http, urlBase } from 'boot/http'
import { storage } from 'boot/storage'
import { useRouter } from 'vue-router'
import { Role, RoleSlug } from '../entities/Permission'
import { useStore } from '../../store'
import { Result } from '../../components/entities/Entity'
import { Entry } from '../../components/entities/Entry'
import { Expense } from '../../components/entities/Expense'
import { Company } from '../entities/Company'

interface Menu {
  path: string
  label: string
  icon?: string
  items?: Menu []
}

const store = useStore()
const router = useRouter()

// function leftDrawerClose () {
//   store.commit('global/setOpen', false)
// }

// const $q = useQuasar()
// const darkMode = ref($q.dark.isActive)

const role = ref<Role>()
const roles = ref<Role[]>()
const companies = ref<Company[]>([])
const companiesFilter = ref<Company[]>([])
const menu = ref<Menu[]>([])

const entries = ref<Result<Entry>>()
const expenses = ref<Result<Expense>>()

const companyId = ref<number>(Number(store.state.user?.user?.company?.id))
const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug)
const isAdminTreasury = ref<boolean>([RoleSlug.WORKER, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug))

// function darkModeChange () {
//   darkMode.value = !darkMode.value
//   $q.dark.set(!$q.dark.isActive)
// }

function logout () {
  auth.logout('store')
}

const goPath = (item: Menu) => {
  if (item.path === '/treasury/entryexpense/') {
    return getPathEntryExpense()
  }
  return router.push(item.path)
}

const getPathEntryExpense = async () => {
  const initial = storage.get('initial')
  if (initial) {
    return router.push('/treasury/flows/initial')
  }
  entries.value = await http.get(`entries/year/${year}/${companyId.value}`) as Result<Entry>
  expenses.value = await http.get(`expenses/year/${year}/${companyId.value}`) as Result<Expense>

  const entry = entries.value.rows.find(item => item.state === 'ACTIVE')
  const expense = expenses.value.rows.find(item => item.state === 'ACTIVE')
  if (entry && expense) {
    return router.push(`/treasury/entryexpense/${String(entry.id)}/${String(expense.id)}`)
  }
  return router.push('/treasury/months')
}

const filterCompaniesFn = (val: string, update: (func: () => void) => void) : void => {
  if (val === '') {
    update(() => (companiesFilter.value = companies.value))
  } else {
    update(() => {
      const needle = val.toLowerCase()
      companiesFilter.value = companies.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
    })
  }
}

const year = new Date().getUTCFullYear()

watch(role, async () => {
  if (typeof role.value === 'number') {
    const data = await http.get(`auth/token/${String(role.value)}`) as UserResponse
    storage.set('role', data.role)
    storage.set('menu', data.menu)
    storage.set('permissions', data.permissions)
    storage.set('token', data.token)
    auth.initStore()
    renderMenu()
    isAdminTreasury.value = [RoleSlug.WORKER, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug)
    return router.push('/')
  }
})

watch(companyId, async () => {
  if (typeof companyId.value === 'number') {
    const currentRoleId = store.state.user?.role?.id ?? (typeof role.value === 'number' ? role.value : (role.value as Role)?.id)
    const roleQuery = currentRoleId != null ? `?roleId=${String(currentRoleId)}` : ''
    const data = await http.get(`auth/token/company/${String(companyId.value)}${roleQuery}`) as UserResponse
    initStorage(data)
    auth.initStore()
    renderMenu()
    return router.push('/')
  }
})

const renderMenu = () => {
  roles.value = store.state.user.roles
  role.value = store.state.user.role

  const initial = storage.get('initial')

  menu.value = []

  if (!['TREASURER'].includes(store.state.user.role?.slug)) {
    const secretary: Menu = {
      path: '/secretary',
      label: 'Secretaría',
      icon: 'edit_note',
      items: []
    }
    if (store.state.user?.permissions?.includes('company:read')) {
      secretary.items?.push({
        path: '/secretary/churchs',
        label: 'Iglesias'
      })
    }
    if (store.state.user?.permissions?.includes('user:read')) {
      secretary.items?.push({
        path: '/secretary/members',
        label: 'Miembros y usuarios'
      })
    }
    if (store.state.user?.permissions?.includes('department:read') && (isSuperAdmin || isAdmin)) {
      secretary.items?.push({
        path: '/secretary/departments',
        label: 'Departamentos'
      })
    }
    menu.value.push(secretary)
  }

  if (!['SECRETARY'].includes(store.state.user?.role?.slug)) {
    const treasury: Menu = {
      path: '/treasury',
      label: 'Tesorería',
      icon: 'monetization_on',
      items: []
    }
    if (store.state.user?.permissions?.includes('entry:read')) {
      treasury.items?.push({
        path: '/treasury/entryexpense/',
        label: 'Ingresos y Gastos'
      })
    }
    if (store.state.user?.permissions?.includes('account:read') && !initial) {
      treasury.items?.push({
        path: '/treasury/accounts',
        label: 'Cuentas bancarias'
      })
    }
    if (store.state.user?.permissions?.includes('balance:read') && !initial) {
      treasury.items?.push({
        path: '/treasury/reports',
        label: 'Reportes'
      })
    }
    menu.value.push(treasury)
  }
}

onMounted(async () => {
  const items = await http.get('companies') as Result<Company>
  companies.value = items.rows.filter(item => item.type && ['CHURCH', 'GROUP'].includes(item.type))
  companiesFilter.value = items.rows.filter(item => item.type && ['CHURCH', 'GROUP'].includes(item.type))

  renderMenu()
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
  h1.header-icon {
    background-image: url(../../assets/images/logo-white.png);
    background-size: 32px;
    background-repeat: no-repeat;
    background-position: 6px 6px;
    padding-left: 48px;
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: -.05rem;
    line-height: 50px;
    font-weight: bolder;
    padding: 0 15px 0 48px;
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

  .q-item__section--avatar {
    min-width: 36px;
  }
}

.menu-sublist {
  background: darken($primary, 7%);
}
</style>
