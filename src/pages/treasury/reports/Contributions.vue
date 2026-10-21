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
          <q-td>
            <div class="text-weight-medium">{{ props.row.fullname }}</div>
            <div
              class="text-caption text-grey"
              v-if="props.row.church">
              {{ props.row.church }}
            </div>
          </q-td>
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
import CrudTable from 'src/components/common/crud-table/CrudTable.vue'
import { getYears } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'

const store = useStore()

const idCompany = store.state.user?.user?.company?.id as number
const money = store.state.user?.user?.company?.money as string
const url = `entries/report/contributions-ranking?id_company=${idCompany}`

const columns = [
  { name: 'fullname', label: 'Nombre completo', field: 'fullname', align: 'left' as const, sortable: true },
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

const filters = [
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
]

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
</script>
