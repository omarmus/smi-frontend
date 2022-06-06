<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
        Flujo de caja - <span class="text-warning">Iglesia local</span>
        <!-- <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span> -->
        <span class="subtitle">Total: {{ total.total || 0 }} Bs.</span>
      </h2>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="type"
          :options="types"
          label="Tipo" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="year"
          :options="years"
          label="Gestión"
          :disable="type.value === 'GENERAL' || type.value === 'INITIAL'" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="month"
          :options="months"
          label="Mes"
          :disable="type.value === 'GENERAL' || type.value === 'YEAR' || type.value === 'INITIAL'" />
      </div>
    </div>
    <div
      v-if="flows.length && (type.value === 'GENERAL' || type.value === 'INITIAL')"
      class="row flow-items q-col-gutter-x-lg q-pt-md">
      <h3 class="flow-title col-12">Flujo de caja {{ type.value === 'GENERAL' ? 'General' : 'Inicial' }}</h3>
      <div
        class="col-xs-12 col-sm-6"
        v-for="item in flows"
        :key="item.id">
        <div class="row q-pb-xs">
          <div class="col-8">{{ item.department?.name }}</div>
          <div class="col-xs-4 col-sm-4">
            <q-field
              standout
              class="text-right"
              dense
              placeholder="0"
              suffix="Bs.">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{ item.total }}</div>
              </template>
            </q-field>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="flows.length && type.value === 'MONTH'"
      class="row tithe-column">
      <h3 class="flow-title col-12">Flujo de caja {{ monthsLiteral[month.value - 1] }}</h3>
      <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12">
        <table class="q-table treasury-table-data">
          <thead>
            <tr>
              <th class="text-left"><strong>Departamento</strong></th>
              <th class="text-right text-secondary"><strong>Saldo {{ monthsLiteral[monthPrev] }}</strong></th>
              <th class="text-right text-positive"><strong>Ingreso <q-icon name="add_circle_outline" /> </strong></th>
              <th class="text-right text-negative"><strong>Diezmo Ingreso <q-icon name="remove_circle_outline" /></strong></th>
              <th class="text-right text-positive"><strong>Total Ingreso <q-icon name="add_circle_outline" /> </strong></th>
              <th class="text-right text-negative"><strong>Gasto <q-icon name="remove_circle_outline" /></strong></th>
              <th class="text-right"><strong>Sub total</strong></th>
              <th class="text-right text-primary"><strong>Total</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in flows"
              :key="item.id">
              <td class="text-left">
                <span class="flow-head-table">{{ item.name }}</span>
              </td>
              <td class="text-right text-secondary">
                <div class="flow-row-table">
                  <span class="text-hidden">Saldo {{ monthsLiteral[previousMonth - 1] }}:</span> {{ item.previous }}
                </div>
              </td>
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso <q-icon name="add_circle_outline" /> :</span> {{ item.entry }}
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Diezmo Ingreso <q-icon name="remove_circle_outline" />:</span> {{ item.tithe }}
                </div>
              </td>
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Total Ingreso <q-icon name="add_circle_outline" /> :</span> {{ item.entryTotal }}
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Gasto <q-icon name="remove_circle_outline" />:</span> {{ item.expense }}
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Sub total:</span> {{ item.subtotal }}
                </div>
              </td>
              <td class="text-right text-primary">
                <div class="flow-row-table">
                  <span class="text-hidden">Total:</span> <strong>{{ item.total }}</strong>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="text-left">
                <span class="flow-head-table"><strong>TOTAL</strong></span>
              </td>
              <td class="text-right text-secondary">
                <div class="flow-row-table">
                  <span class="text-hidden">Saldo {{ monthsLiteral[previousMonth - 1] }}:</span> <strong>{{ total.previous }}</strong>
                </div>
              </td>
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso <q-icon name="add_circle_outline" /> :</span> <strong>{{ total.entry }}</strong>
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Diezmo Ingreso <q-icon name="remove_circle_outline" />:</span> <strong>{{ total.tithe }}</strong>
                </div>
              </td>
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Total Ingreso <q-icon name="add_circle_outline" /> :</span> <strong>{{ total.entryTotal }}</strong>
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Gasto <q-icon name="remove_circle_outline" />:</span> <strong>{{ total.expense }}</strong>
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Sub total:</span> <strong>{{ total.subtotal }}</strong>
                </div>
              </td>
              <td class="text-right text-primary">
                <div class="flow-row-table">
                  <span class="text-hidden">Total:</span> <strong>{{ total.total }}</strong>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div v-else-if="flows.length === 0 && type.value === 'MONTH'" class="q-pa-sm text-primary">No existe datos para el mes de <strong>{{ monthsLiteral[month.value - 1] }}</strong>.</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, watch } from 'vue'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { months as monthsLiteral } from '../../../components/plugins/datetime'
import { Flow } from '../../../components/entities/Flow'

const now = new Date()
let previousYear = now.getFullYear()
let previousMonth = now.getMonth() - 1
if (previousMonth < 0) {
  previousMonth = 11
  previousYear--
}
const year = ref({ value: previousYear, label: previousYear })
const type = ref({ value: 'MONTH', label: 'MENSUAL' })
const month = ref({ value: previousMonth + 1, label: monthsLiteral[previousMonth] })

const months = monthsLiteral.map((item, index) => ({ value: index + 1, label: item }))
const years = [
  { value: 2022, label: '2022' }
]

const types = [
  { value: 'GENERAL', label: 'GENERAL' },
  // { value: 'YEAR', label: 'POR GESTION' },
  { value: 'MONTH', label: 'MENSUAL' },
  { value: 'INITIAL', label: 'INICIAL' }
]

const flows = ref<[Flow]>([])
const idCompany = 9

const getFlows = async () => {
  if (type.value.value === 'GENERAL') {
    const url = `expenses/report/${type.value.value}?id_company=${idCompany}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  } else if (type.value.value === 'MONTH') {
    const url = `expenses/report/${type.value.value}?id_company=${idCompany}&year=${year.value.value}&month=${month.value.value}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  } else {
    const url = `flows?id_company=${idCompany}&type=${type.value.value}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  }
}

const total = computed(() => {
  const total = {
    previous: 0,
    entry: 0,
    tithe: 0,
    entryTotal: 0,
    expense: 0,
    subtotal: 0,
    total: 0
  }
  flows.value.forEach(item => {
    total.previous += item.previous ? Number(item.previous) : 0
    total.entry += item.entry ? Number(item.entry) : 0
    total.tithe += item.tithe ? Number(item.tithe) : 0
    total.entryTotal += item.entryTotal ? Number(item.entryTotal) : 0
    total.expense += item.expense ? Number(item.expense) : 0
    total.subtotal += item.subtotal ? Number(item.subtotal) : 0
    total.total += item.total ? Number(item.total) : 0
  })
  return total
})

const monthPrev = computed(() => {
  if (month.value.value - 2 < 0) {
    return 11
  }
  return month.value.value - 2
})

watch(type, async () => (await getFlows()))
watch(year, async () => (await getFlows()))
watch(month, async () => (await getFlows()))

onBeforeMount(async () => {
  await getFlows('GENERAL')
})
</script>

<style lang="scss">
.flow-title {
  margin: 15px 0 10px;
  text-align: center;
  font-size: 1.4em;
  font-weight: bold;
  color: $primary;
}
</style>
