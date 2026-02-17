<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
        Informe de ofrendas y diezmos - {{ store.state.user.user.company?.name }}
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
    <div class="col-xs-12 q-mb-lg">
      <q-btn
        icon="print"
        no-caps
        label="Imprimir"
        @click="generatePdf" />
    </div>
    <div
      id="report-content"
      class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap table-responsive">
      <h2
        id="pdf-title"
        class="treasury-title q-mt-lg"
        style="display: none;">
        Ofrendas y diezmos {{ store.state.user.user.company?.name }} - Gestión {{ year }}
      </h2>
      <template v-if="hasRecordsForYear">
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
            <template v-for="(row, idx) in rowsForTable">
              <tr v-if="row.type === 'section'" :key="`section-${row.label}-${idx}`" class="treasury-section-row">
                <td colspan="13" class="treasury-section-cell">{{ row.label }}</td>
              </tr>
              <tr v-else :key="row.key">
                <td>
                  {{ row.user.label }}
                  <span class="treasury-observation" v-if="row.user.type">
                    {{ memberType[row.user.type as keyof typeof memberType] }} {{ $store.state.user.user.company?.name !== row.user.church ? `- ${row.user.church}` : '' }}
                  </span>
                </td>
                <td
                  v-for="month in [1,2,3,4,5,6,7,8,9,10,11,12]"
                  :key="month">
                  <div class="flow-row-table">
                    <span class="text-hidden">{{ monthsLiteral[month - 1] }}:</span>
                    <div class="flow-row-content text-right" v-if="row.user.months && row.user.months[month]">
                      <ul class="treasury-list-concepts">
                        <li
                          v-for="off in getFirstOffering(row.user.months[month])"
                          :key="off.id">
                          <span class="treasury-observation-report">{{ off.label }}: </span> <strong>{{ off.value?.toFixed(2) }}</strong>
                        </li>
                      </ul>
                      <ul
                        class="treasury-list-concepts"
                        v-if="row.user.active === true">
                        <li
                          v-for="off in row.user.months[month]"
                          :key="off.id">
                          <template v-if="off.group !== 'TITHES' && off.group !== 'SCOOP'">
                            <span class="treasury-observation-report">{{ off.label }}: </span> <strong>{{ off.value?.toFixed(2) }}</strong>
                          </template>
                        </li>
                      </ul>
                      <a
                        class="flow-row-link"
                        v-if="Object.keys(row.user.months[month]).length > getFirstOffering(row.user.months[month]).length" href=""
                        @click.prevent="row.user.active = !row.user.active">
                        {{ row.user.active === true ? 'Ver menos' : 'Ver más' }}
                      </a>
                    </div>
                    <span class="treasury-observation text-right" v-else>-</span>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </template>
      <div v-else class="alert alert-info">No existe información para la gestión {{ year }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { Offering, Option, ReportRow } from '../../../components/entities/Entry'
import { months as monthsLiteral, getYears } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'

const store = useStore()
const router = useRouter()
const users = ref<Record<string, Option>>({})
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

/** Etiqueta de sección para filas separadoras (mismo criterio que el backend). */
function getSectionLabel (user: Option): string {
  const t = user.type?.toLowerCase()
  if (t === 'member') return user.id_company === idCompany ? 'Miembro' : 'Miembro de otra iglesia'
  if (t === 'sympathizer' || t === 'baptismal_candidate') return 'Miembro Esc. sabática'
  if (t === 'visit') return 'Visita'
  return 'Otros'
}

/** Respuesta posible del endpoint offerings-by-church (objeto directo o envuelto en .data). */
type OfferingsByChurchResponse = Record<string, Option> | { data?: Record<string, Option> }

/** Carga el reporte desde el backend (endpoint report/offerings-by-church). */
const loadReport = async () => {
  const res = await http.get(
    `entries/report/offerings-by-church?year=${year.value}&id_company=${idCompany}&id_department=0`
  ) as unknown as OfferingsByChurchResponse
  const raw: Record<string, Option> | undefined =
    res && typeof res === 'object' && 'data' in res
      ? (res as { data?: Record<string, Option> }).data
      : (res as Record<string, Option>)
  const data: Record<string, Option> = raw ?? {}
  for (const key in data) {
    if (data[key] && typeof data[key] === 'object') {
      data[key].active = false
    }
  }
  users.value = data
}

watch(year, loadReport)

const hasRecordsForYear = computed(() => {
  const data = users.value ?? {}
  return Object.keys(data).length > 0
})

const filterUsers = computed(() => {
  const source = users.value ?? {}
  if (searchQuery.value !== '') {
    const usersFilter: Record<string, Option> = {}
    for (const key in source) {
      if (source[key].label.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        if (!memberOnly.value || (memberOnly.value && source[key].type?.toUpperCase() === 'MEMBER')) {
          usersFilter[key] = source[key]
        }
      }
    }
    return usersFilter
  }
  if (memberOnly.value) {
    const usersFilter: Record<string, Option> = {}
    for (const key in source) {
      if (source[key].type?.toUpperCase() === 'MEMBER') {
        usersFilter[key] = source[key]
      }
    }
    return usersFilter
  }
  return source
})

/** Lista para la tabla: filas de sección + filas de usuario en orden (el backend ya envía ordenado). */
const rowsForTable = computed((): ReportRow[] => {
  const source = filterUsers.value ?? {}
  const keys = Object.keys(source)
  if (keys.length === 0) return []
  const rows: ReportRow[] = []
  let currentSection = ''
  for (const key of keys) {
    const user = source[key]
    const sectionLabel = getSectionLabel(user)
    if (sectionLabel !== currentSection) {
      currentSection = sectionLabel
      rows.push({ type: 'section', label: sectionLabel })
    }
    rows.push({ type: 'user', key, user })
  }
  return rows
})

const getFirstOffering = (items: Record<string, Offering>) => {
  const offerings: Offering[] = []

  for (const key in items) {
    if (items[key].group && ['TITHES', 'SCOOP'].includes(items[key].group)) {
      offerings.push(items[key])
    }
  }

  return offerings
}

/** Descarga el PDF del reporte desde el backend (endpoint report/offerings-by-church/pdf). */
const generatePdf = async () => {
  const res = await http.get(
    `entries/report/offerings-by-church/pdf?year=${year.value}&id_company=${idCompany}&id_department=0`
  ) as string | { data?: string }
  const base64 = typeof res === 'string' ? res : res?.data
  if (!base64) {
    return
  }
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  const blob = new Blob([binary], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const filename = `informe-ofrendas-${store.state.user.user.company?.name || 'iglesia'}-${year.value}-${Date.now()}.pdf`
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(loadReport)
</script>

<style scoped>
.treasury-section-row .treasury-section-cell {
  font-weight: 700;
  background-color: rgba(0, 0, 0, 0.06);
  padding: 0.4em 0.6em;
  text-transform: uppercase;
}
</style>
