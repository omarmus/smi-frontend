<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push(`/treasury/entryexpense/${$route.params.entryId}/${$route.params.expenseId}`)" />
      Ingresos {{ months[entry.month - 1] }} - Diezmos y ofrendas
      <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span>
      <span class="subtitle">Total: {{ total.toFixed(2) }} {{ $store.state.user?.user.company.money }}</span></h2>
    <div class="row treasury-row">
      <div
        class="col-xs-6 col-sm-3 q-pa-sm card-button"
        v-for="item in weeks"
        :key="item.week">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/entry/${$route.params.entryId}/${item.week}`)"
          class="full-width btn-block"
          :class="getClass(item)"
          :disable="getDisable(item)">
          <strong>{{ item.label }}</strong>
          <span class="btn-block-detail">{{ item.total }} {{ $store.state.user?.user.company.money }}</span>
          <q-icon name="calendar_month" />
        </q-btn>
      </div>
    </div>
    <div class="text-right q-pt-xs q-gutter-xs">
      <q-btn
        v-if="$route.params.expenseId"
        label="Ver gastos del mes"
        no-caps
        icon="payments"
        padding="10px 20px"
        class="btn-close-month"
        @click="$router.push(`/treasury/expense/${$route.params.expenseId}`)" />
      <!-- <q-btn
        :label="entry.state === 'CLOSED' ? 'Generar informe' : 'Generar informe y Cerrar el mes'"
        no-caps
        color="primary"
        icon="print"
        padding="10px 20px"
        class="btn-close-month"
        @click="closeMonth" /> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { Entry, EntryDetail } from '../../../components/entities/Entry'
import { Result } from '../../../components/entities/Entity'
import { months, getWeeks } from '../../../components/plugins/datetime'

const entry = ref<Entry>()
const weeks = ref([])
const day = new Date().getDate()
const month = new Date().getMonth() + 1
const total = ref<number>(0)

const route = useRoute()
const { entryId } = route.params

const getClass = (item: { day: number }) => {
  if (entry.value.state === 'CLOSED' || entry.value.month !== month) {
    return ''
  }
  return item.day >= (day - 7) && item.day < day ? 'active' : 'pending'
}

// TODO: falta controlar que esté habilitado antes del sábado que le corresponde
const getDisable = (item: { day: number }) => {
  if (entry.value.state === 'CLOSED' || entry.value.month !== month) {
    return false
  }
  return item.day >= day
}

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
  weeks.value = getWeeks(entry.value.year, entry.value.month)
  const items = await http.get(`entriesdetails?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  items.rows.forEach(row => {
    totals[row.week] += parseFloat(row.value)
  })
  total.value = 0
  weeks.value.forEach((item: { total: number, week: number }) => {
    item.total = totals[item.week] as number
    total.value += item.total
  })
}

onBeforeMount(async () => {
  await getEntry()
})
</script>
