<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
        Informe mensual - Gestión {{ year }}
      </h2>
    <div class="q-pb-md">
      <q-select
        filled
        v-model="year"
        :options="years"
        label="Gestión" />
    </div>
    <template v-if="months?.length !== 0">
      <div class="row treasury-row">
        <div
          class="col-xs-6 col-sm-3 q-pa-sm"
          v-for="item in months"
          :key="item.month">
          <q-btn
            flat
            color="secondary"
            padding="lg"
            no-caps
            @click="goReport(item)"
            class="full-width btn-block"
            :class="item.state.toLowerCase()">
            <strong class="q-pb-sm">{{ monthsLiteral[item.month - 1] }}</strong>
            <span class="btn-block-detail"><strong>Ingresos:</strong> <span class="text-primary">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</span></span>
            <span class="btn-block-detail"><strong>Gastos:</strong> <span class="text-primary">{{ Number(item.totalExpense).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</span></span>
            <q-icon name="calendar_month" />
          </q-btn>
        </div>
      </div>
    </template>
    <div class="alert alert-info" v-if="months?.length === 0">
      No existe datos para el año {{ year }}, seleccione otra gestión.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { storage } from 'boot/storage'
import { Result } from '../../../components/entities/Entity'
import { Entry } from '../../../components/entities/Entry'
import { Expense } from '../../../components/entities/Expense'
import { months as monthsLiteral, getYears } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'

const store = useStore()
const router = useRouter()

const year = ref(new Date().getFullYear())
const months = ref<Entry[]>()
const idCompany = store.state.user?.user?.company?.id as number
const years = getYears()

const getEntriesAndExpensesYear = async (start = false) => {
  const lenght = start ? 10 : 1
  for (let i = 0; i < lenght; i++) { // TODO: Cambiar la lógica para que verifique si hay entradas y gastos en el año
    const entries = await http.get(`entries?year=${year.value}&id_company=${idCompany}&order=month&state=CLOSED`) as Result<Entry>
    const expenses = await http.get(`expenses?year=${year.value}&id_company=${idCompany}&order=month&state=CLOSED`) as Result<Expense>

    if (entries.count > 0 || !start) {
      months.value = entries.rows.map((entry: Entry, index: number) => {
        entry.idExpense = expenses.rows[index].id
        entry.totalExpense = expenses.rows[index].total
        return entry
      })
      break
    }
    year.value--
  }
}

const goBack = () => {
  return router.push('/treasury/reports')
}

const goReport = (item: Entry) => {
  storage.set('report', true)
  return router.push(`/treasury/report/${String(item.id)}/${String(item.idExpense)}`)
}

watch(year, async () => {
  await getEntriesAndExpensesYear()
})

onBeforeMount(async () => {
  await getEntriesAndExpensesYear(true)
})
</script>
