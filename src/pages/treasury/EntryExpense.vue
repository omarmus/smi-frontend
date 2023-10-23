<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
      Ingresos y Gastos de {{ months[entry.month - 1] }} {{ entry.year }}
      <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span>
    </h2>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/week/${$route.params.entryId}/${$route.params.expenseId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Ingresos</strong>
          <span class="btn-block-detail"><strong>Total:</strong> <span class="text-primary">{{ totalEntries }} {{ $store.state.user?.user.company.money }}</span></span>
          <q-icon name="attach_money" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/expense/${$route.params.expenseId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Gastos</strong>
          <span class="btn-block-detail"><strong>Total:</strong> <span class="text-primary">{{ totalExpenses }} {{ $store.state.user?.user.company.money }}</span></span>
          <q-icon name="payments" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/transactions/${entryId}/${expenseId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Transacciones</strong>
          <span class="btn-block-detail"><strong>Bancarias</strong></span>
          <q-icon name="point_of_sale" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
      <div
        v-if="entry.state === 'CLOSED'"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/report/${entryId}/${expenseId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Informe mensual</strong>
          <span class="btn-block-detail"><strong>Ingresos y gastos</strong></span>
          <q-icon name="analytics" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
    </div>
    <div
      class="text-right q-pt-md q-gutter-xs">
      <q-btn
        label="Cambiar mes"
        no-caps
        icon="calendar_month"
        class="btn-close-month"
        @click="$router.push('/treasury/months')" />
      <q-btn
        v-if="entry.state !== 'CLOSED'"
        :label="entry.state === 'CLOSED' ? 'Ver informe mensual' : 'Cerrar el mes'"
        no-caps
        color="primary"
        :icon="entry.state === 'CLOSED' ? 'print' : 'check'"
        class="btn-close-month"
        @click="closeMonth" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { months } from '../../components/plugins/datetime'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Confirm } from 'boot/modal'
import { Entry, EntryDetail } from '../../components/entities/Entry'
import { Result } from '../../components/entities/Entity'
import { ExpenseDetail } from '../../components/entities/Expense'

const entry = ref<Entry>()
const totalEntries = ref<number>(0)
const totalExpenses = ref<number>(0)
const route = useRoute()
const router = useRouter()
const { entryId, expenseId } = route.params

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
}

const getEntryDetails = async () => {
  const items = await http.get(`entriesdetails?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
  totalEntries.value = items.rows.reduce((value, current) => value + Number(current.value), 0).toFixed(2)
}

const getExpenseDetails = async () => {
  const items = await http.get(`expensesdetails?id_expense=${expenseId as string}`) as Result<ExpenseDetail>
  totalExpenses.value = items.rows.reduce((value, current) => value + Number(current.value), 0).toFixed(2)
}

const closeMonth = () => {
  if (Number.parseFloat(totalEntries.value) === 0 || Number.parseFloat(totalExpenses.value) === 0) {
    message.warning('Debe llenar los ingresos y los gastos')
  } else {
    if (entry.value.state === 'ACTIVE') {
      Confirm(`Va a <strong>cerrar</strong> el mes de <strong>${months[entry.value.month - 1]}</strong> este proceso es irreversible, revise los datos antes de continuar porque ya no podrá modificarlos.`, async () => {
        await http.put(`entries/close/${entryId as string}/${expenseId as string}`)
        return router.push(`/treasury/report/${entryId as string}/${expenseId as string}`)
      }, null, 'Advertencia', 'Cerrar mes')
    }
  }
}

onBeforeMount(async () => {
  await getEntry()
  await getEntryDetails()
  await getExpenseDetails()
})
</script>
