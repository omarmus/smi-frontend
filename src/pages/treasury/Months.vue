<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
        Ingresos y gastos - Gestión {{ year }}
      </h2>
    <div class="q-pb-md">
      <q-select
        filled
        v-model="year"
        :options="years"
        label="Gestión" />
    </div>
    <div class="alert alert-info">
      Seleccione el mes que quiere ver/editar
    </div>
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
          @click="$router.push(`/treasury/entryexpense/${item.id}/${item.idExpense}`)"
          class="full-width btn-block"
          :class="item.state.toLowerCase()"
          :disable="item.state === 'PENDING'">
          <strong class="q-pb-sm">{{ monthsLiteral[item.month - 1] }}</strong>
          <span class="btn-block-detail"><strong>Ingresos:</strong> <span class="text-primary">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user.company.money }}</span></span>
          <span class="btn-block-detail"><strong>Gastos:</strong> <span class="text-primary">{{ Number(item.totalExpense).toFixed(2) }} {{ $store.state.user?.user.company.money }}</span></span>
          <q-icon name="calendar_month" />
          <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { Result } from '../../components/entities/Entity'
import { Entry } from '../../components/entities/Entry'
import { Expense } from '../../components/entities/Expense'
import { months as monthsLiteral, getYears } from '../../components/plugins/datetime'
import { useStore } from '../../store'

const store = useStore()
const router = useRouter()

const year = ref(new Date().getFullYear())
const months = ref<Entry[]>()
const idCompany = store.state.user?.user?.company.id as number
const years = getYears()

const getEntriesAndExpensesYear = async () => {
  const entries = await http.get(`entries/year/${year.value}/${idCompany}`) as Result<Entry>
  const expenses = await http.get(`expenses/year/${year.value}/${idCompany}`) as Result<Expense>
  months.value = entries.rows.map((entry: Entry, index: number) => {
    entry.idExpense = expenses.rows[index].id
    entry.totalExpense = expenses.rows[index].total
    return entry
  })
}

const goBack = () => {
  const item = months.value.find(item => item.state === 'ACTIVE')
  return router.push(item ? `/treasury/entryexpense/${item.id as string}/${item.idExpense as string}` : '/treasury')
}

watch(year, async () => {
  await getEntriesAndExpensesYear()
})

onBeforeMount(async () => {
  await getEntriesAndExpensesYear()
})
</script>
