<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/months')" />
      Ingresos y Gastos de {{ months[entry.month - 1] }}
      <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span>
    </h2>
    <div class="row">
      <div class="col-xs-6 col-sm-3 q-pr-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/week/${$route.params.entryId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Ingresos</strong>
          <span class="btn-block-detail"><strong>Total:</strong> <span class="text-primary">{{ totalEntries }} Bs.</span></span>
          <q-icon name="attach_money" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
         <!-- <q-btn
          label="Ver informe"
          no-caps
          color="primary"
          icon="preview"
          padding="10px 20px"
          class="full-width q-mt-xs"
          @click="closeMonth" /> -->
      </div>
      <div class="col-xs-6 col-sm-3 q-pl-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/expense/${$route.params.expenseId}`)"
          class="full-width btn-block">
          <strong class="q-pb-sm">Gastos</strong>
          <span class="btn-block-detail"><strong>Total:</strong> <span class="text-primary">{{ totalExpenses }} Bs.</span></span>
          <q-icon name="money_off" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
         <!-- <q-btn
          label="Ver informe"
          no-caps
          color="primary"
          icon="preview"
          padding="10px 20px"
          class="full-width q-mt-xs"
          @click="closeMonth" /> -->
      </div>
    </div>
    <div
      class="text-right q-pt-sm q-gutter-xs">
      <q-btn
        :label="entry.state === 'CLOSED' ? 'Ver informe mensual' : 'Cerrar el mes y generar Informe mensual'"
        no-caps
        color="primary"
        :icon="entry.state === 'CLOSED' ? 'print' : 'check'"
        padding="10px 20px"
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
  const items = await http.get(`entries/details?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
  totalEntries.value = items.rows.reduce((value, current) => value + Number(current.value), 0).toFixed(1)
}

const getExpenseDetails = async () => {
  const items = await http.get(`expenses/details?id_expense=${expenseId as string}`) as Result<ExpenseDetail>
  totalExpenses.value = items.rows.reduce((value, current) => value + Number(current.value), 0).toFixed(1)
}

const closeMonth = () => {
  if (totalEntries.value === 0 || totalExpenses.value === 0) {
    alert('Debe llenar los ingresos y los gastos')
  } else {
    if (entry.value.state === 'ACTIVE') {
      Confirm(`Va a <strong>cerrar</strong> el mes de <strong>${months[entry.value.month - 1]}</strong> este proceso es irreversible, revise los datos antes de continuar porque ya no podrá modificar los datos del mes.`, async () => {
        await http.put(`entries/close/${entryId as string}/${expenseId as string}`)
        return router.push(`/treasury/report/${entryId as string}/${expenseId as string}`)
      }, null, 'Advertencia', 'Cerrar mes')
    } else {
      return router.push(`/treasury/report/${entryId as string}/${expenseId as string}`)
    }
  }
}

onBeforeMount(async () => {
  await getEntry()
  await getEntryDetails()
  await getExpenseDetails()
})
</script>
