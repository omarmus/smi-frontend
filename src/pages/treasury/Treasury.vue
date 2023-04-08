<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/')" />
      Tesorería
    </h2>
    <div class="row q-gutter-sm">
      <div
        v-if="$store.state.user?.permissions?.includes('entry:read')"
        class="col-xs-6 col-sm-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="attach_money"
          label="Ingresos y Gastos"
          no-caps
          @click="goEntriesExpenses"
          class="full-width btn-block"
          :disable="entries?.count === 0"
        />
      </div>
      <div
        v-if="$store.state.user?.permissions?.includes('balance:read')"
        class="col-xs-6 col-sm-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="account_balance"
          label="Flujo de caja"
          no-caps
          @click="$router.push('/treasury/flows/general')"
          class="full-width btn-block"
          :disable="entries?.count === 0"
        />
      </div>
      <div
        v-if="$store.state.user?.permissions?.includes('account:read')"
        class="col-xs-6 col-sm-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="account_balance_wallet"
          label="Cuentas bancarias"
          no-caps
          @click="$router.push('/treasury/accounts')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storage } from 'boot/storage'
import { http } from 'boot/http'
import { Result } from '../../components/entities/Entity'
import { Entry } from '../../components/entities/Entry'
import { Expense } from '../../components/entities/Expense'
import { useStore } from '../../store'

const store = useStore()
const idCompany = store.state.user?.user?.company.id as number

const router = useRouter()
const entries = ref<Result<Entry>>()
const expenses = ref<Result<Expense>>()

const goEntriesExpenses = () => {
  const entry = entries.value.rows.find(item => item.state === 'ACTIVE')
  const expense = expenses.value.rows.find(item => item.state === 'ACTIVE')
  if (entry && expense) {
    return router.push(`/treasury/entryexpense/${entry.id as string}/${expense.id as string}`)
  }
  return router.push('/treasury/months')
}

const year = new Date().getUTCFullYear()

onBeforeMount(async () => {
  const initial = storage.get('initial')
  if (initial) {
    return router.push('/treasury/flows/initial')
  }
  expenses.value = await http.get(`expenses/year/${year}/${idCompany}`) as Result<Expense>
  entries.value = await http.get(`entries/year/${year}/${idCompany}`) as Result<Entry>
})
</script>
