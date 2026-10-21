<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/reports')" />
      Top de personas que aportan
    </h2>

    <CrudTable
      :url="url"
      :columns="columns"
      :filters="filters"
      order="-total"
      :open-filter="true"
      buttons-hidden>
      <template v-slot:row="props">
        <q-tr>
          <q-td class="text-weight-medium">{{ props.row.fullname }}</q-td>
          <q-td>{{ props.row.church }}</q-td>
          <q-td>{{ memberTypeLabel(props.row.type) }}</q-td>
          <q-td class="text-right text-weight-bold">{{ formatMoney(props.row.total) }}</q-td>
        </q-tr>
      </template>
      <template v-slot:no-data>
        <div class="full-width text-center q-pa-md text-grey">
          No hay aportes registrados en esta gestión
        </div>
      </template>
    </CrudTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from 'boot/http'
import CrudTable from 'src/components/common/crud-table/CrudTable.vue'
import { getYears } from '../../../components/plugins/datetime'
import { Result } from '../../../components/entities/Entity'
import { Company } from '../../../components/entities/Company'
import { useStore } from '../../../store'

const store = useStore()

const money = store.state.user?.user?.company?.money as string
const url = 'entries/report/contributions-ranking'

// 'ALL' = el reporte de todas las iglesias del alcance del usuario
const ALL_CHURCHES = 'ALL'

const churchOptions = ref<Array<{ label: string; value: string | number }>>([
  { label: 'Todas las iglesias', value: ALL_CHURCHES }
])

const columns = [
  { name: 'fullname', label: 'Nombre completo', field: 'fullname', align: 'left' as const, sortable: true },
  { name: 'church', label: 'Iglesia', field: 'church', align: 'left' as const, sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' as const, sortable: true },
  { name: 'total', label: 'Total aportado', field: 'total', align: 'right' as const, sortable: true }
]

/**
 * Tipos de aporte: el grupo del concepto (diezmos, primicias, ...). El filtro
 * es opcional: sin él, el total es la suma de todos los aportes de la persona.
 */
const groupOptions = [
  { value: 'TITHES', label: 'Diezmos' },
  { value: 'SCOOP', label: 'Primicias' },
  { value: 'SECOND', label: 'Segundo diezmo' },
  { value: 'TITHE', label: 'Diezmo de iglesia' },
  { value: 'MUNDIAL', label: 'Asociación general' },
  { value: 'ASSOCIATION', label: 'Asociación' },
  { value: 'YOUNG', label: 'Jóvenes' },
  { value: 'EVENT', label: 'Pobres' },
  { value: 'DEPARTMENT', label: 'Departamento' },
  { value: 'CHURCH', label: 'Iglesia' },
  { value: 'OTHER', label: 'Otros' }
]

const filters = ref([
  {
    label: 'Iglesia',
    name: 'id_company',
    type: 'select',
    options: churchOptions.value,
    value: ALL_CHURCHES
  },
  {
    label: 'Gestión',
    name: 'year',
    type: 'select',
    options: getYears().map(year => ({ value: year, label: String(year) })),
    value: new Date().getFullYear()
  },
  {
    label: 'Tipo de aporte',
    name: 'concept_group',
    type: 'select',
    options: groupOptions
  }
])

const memberTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    member: 'Miembro',
    sympathizer: 'Miembro Esc. sabática',
    baptismal_candidate: 'Miembro Esc. sabática',
    visit: 'Visita'
  }
  return map[type] ?? '—'
}

const formatMoney = (value: number): string =>
  `${Number(value).toFixed(2)} ${money ?? ''}`

// Iglesias que el usuario puede ver (el endpoint ya viene scopeado por rol)
const getChurches = async () => {
  const items = await http.get('companies') as Result<Company>
  const churches = items.rows
    .filter(item => ['CHURCH', 'GROUP'].includes(item.type))
    .map(item => ({ label: item.name, value: item.id }))
  churchOptions.value = [{ label: 'Todas las iglesias', value: ALL_CHURCHES }, ...churches]
  filters.value[0].options = churchOptions.value
}

onMounted(async () => {
  await getChurches()
})
</script>
