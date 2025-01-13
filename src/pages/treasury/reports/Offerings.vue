<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
        Informe de ofrendas por persona - {{ store.state.user.user.company?.name }}
    </h2>
    <div class="q-pb-md row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="year"
          :options="years"
          label="Gestión" />
      </div>
      <div class="col-xs-12 col-sm-5">
        <q-input
          filled
          label="Buscar por Nombre o apellido"
          v-model="searchQuery"
          input-debounce="1000"
          placeholder="Escribe el nombre o apellido de la persona a buscar">
          <template v-slot:append v-if="searchQuery.length > 0">
            <q-icon name="close" @click="searchQuery = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
      <div class="col-xs-12 col-sm-3">
        <q-checkbox v-model="memberOnly" label="Ver solo miembros" />
      </div>
    </div>
    <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap table-responsive">
      <table class="q-table treasury-table-data">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th
              v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]"
              :key="month">{{ monthsLiteral[month - 1] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filterUsers"
            :key="item.value">
            <td>
              {{ item.label }}
              <span class="treasury-observation" v-if="item.type">{{ memberType[item.type] }}</span>
            </td>
            <td
              v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]"
              :key="month">
              <div class="flow-row-table">
                <span class="text-hidden">{{ monthsLiteral[month - 1] }}:</span>
                <div class="flow-row-content text-right" v-if="item.months && item.months[month]">
                  <ul class="treasury-list-concepts">
                    <li
                      v-for="off in getFirstOffering(item.months[month])"
                      :key="off.id">
                      <span class="treasury-observation-report">{{ off.label }}: </span> <strong>{{ off.value }}</strong>
                    </li>
                  </ul>
                  <ul
                    class="treasury-list-concepts"
                    v-if="item.active === true">
                    <li
                      v-for="off in item.months[month]"
                      :key="off.id">
                      <template v-if="off.group !== 'TITHES' && off.group !== 'SCOOP'">
                        <span class="treasury-observation-report">{{ off.label }}: </span> <strong>{{ off.value }}</strong>
                      </template>
                    </li>
                  </ul>
                  <a
                    class="flow-row-link"
                    v-if="Object.keys(item.months[month]).length > getFirstOffering(item.months[month]).length" href=""
                    @click.prevent="item.active = !item.active">
                    {{ item.active === true ? 'Ver menos' : 'Ver más' }}
                  </a>
                </div>
                <span class="treasury-observation" v-else>-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { EntryDetail, Offering, Option } from '../../../components/entities/Entry'
import { months as monthsLiteral, getYears } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'
import { User } from 'src/components/entities/User'

const store = useStore()
const router = useRouter()
const users = ref<Record<string, Option>>()
const searchQuery = ref<string>('')
const memberOnly = ref<boolean>(false)

const year = ref(new Date().getFullYear())
const idCompany = Number(store.state.user?.user?.company?.id)
const years = getYears()

const goBack = () => {
  return router.push('/treasury/reports')
}

const memberType = {
  member: 'Miembro',
  sympathizer: 'Miembro Esc. sabática',
  visit: 'Visita'
}

const getUsers = async (query: string, association?: boolean) => {
  let url = 'users?order=fullname'
  if (query) {
    if (association) {
      url += `&fullname=${query}&all_association=true`
    } else {
      url += `&fullname=${query}&all_churchs=true`
    }
  } else {
    url += `&id_company=${idCompany}`
  }
  const items = await http.get(url, false) as Result<User>
  const users: Record<string, Option> = {}
  items.rows.forEach(item => {
    users[`user-${item.id || ''}`] = {
      value: String(item.id),
      label: String(item.person?.fullname),
      church: String(item.company?.name),
      association: association ? String(item.association?.name) : undefined,
      type: item.type?.toLowerCase(),
      months: {}
    }
  })
  return users
}

watch(year, async () => {
  await getEntryDetails()
})

const filterUsers = computed(() => {
  if (searchQuery.value !== '') {
    const usersFilter: Record<string, Option> = {}
    for (const key in users.value) {
      if (users.value[key].label.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        if (!memberOnly.value || (memberOnly.value && users.value[key].type?.toUpperCase() === 'MEMBER')) {
          usersFilter[key] = users.value[key]
        }
      }
    }
    return usersFilter
  }
  if (memberOnly.value) {
    const usersFilter: Record<string, Option> = {}
    for (const key in users.value) {
      if (users.value[key].type?.toUpperCase() === 'MEMBER') {
        usersFilter[key] = users.value[key]
      }
    }
    return usersFilter
  }
  return users.value
})

const getEntryDetails = async () => {
  for (const key in users.value) {
    users.value[key].months = {}
  }
  const items = await http.get(`entriesdetails?year=${year.value}&id_department=0&order=entry_detail.id`) as Result<EntryDetail>
  for (const item of items.rows) {
    if (item.user?.id && users.value && users.value[`user-${item.user?.id}`]) {
      const user = users.value[`user-${item.user?.id}`]
      if (user.months) {
        if (!user.months[item.entry.month]) {
          user.months[item.entry.month] = {}
        }
        for (const off of item.concepts) {
          if (off.concept.value) {
            if (!user.months[item.entry.month][off.concept.value]) {
              user.months[item.entry.month][off.concept.value] = {
                id: String(off.concept.value),
                type: off.concept.type,
                label: off.concept.label,
                group: off.concept.group,
                value: Number(off.value)
              }
            } else {
              user.months[item.entry.month][off.concept.value].value += Number(off.value)
            }
          }
        }
      }
    }
  }
}

const getFirstOffering = (items: Record<string, Offering>) => {
  const offerings: Offering[] = []

  for (const key in items) {
    if (items[key].group && ['TITHES', 'SCOOP'].includes(items[key].group)) {
      offerings.push(items[key])
    }
  }

  return offerings
}

onMounted(async () => {
  users.value = await getUsers('')
  await getEntryDetails()
})
</script>
