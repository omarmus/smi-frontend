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
          <q-icon name="today" />
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
      <q-btn
        v-if="entry.state === 'CLOSED' && isAdmin"
        label="Reabrir el mes"
        no-caps
        color="red"
        :icon="'warning'"
        :disable="!canReopen"
        class="btn-close-month"
        @click="revertMonth" />
      <q-btn
        v-if="canRectify"
        label="Ajustar el mes"
        no-caps
        color="secondary"
        icon="edit"
        class="btn-close-month"
        @click="rectifyMonth" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { months } from '../../components/plugins/datetime'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Confirm } from 'boot/modal'
import { Entry, EntryDetail } from '../../components/entities/Entry'
import { Result } from '../../components/entities/Entity'
import { RoleSlug } from '../../components/entities/Permission'
import { ExpenseDetail } from '../../components/entities/Expense'
import { useStore } from '../../store'

const store = useStore()

const entry = ref<Entry>()
const totalEntries = ref<number>(0)
const totalExpenses = ref<number>(0)
const route = useRoute()
const router = useRouter()
const { entryId, expenseId } = route.params

const isAdmin = ref<boolean>([RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug))
const idCompany = store.state.user?.user?.company?.id as number

const activeMonth = ref<Entry>()

// Solo el mes inmediatamente anterior al mes activo es reabrible, sin importar
// la gestión: si enero 2026 está activo, el único reabrible es diciembre 2025.
const canReopen = computed(() => {
  const active = activeMonth.value
  if (!isAdmin.value || entry.value?.state !== 'CLOSED' || !active) return false
  const expectedMonth = active.month === 1 ? 12 : active.month - 1
  const expectedYear = active.month === 1 ? active.year - 1 : active.year
  return entry.value.year === expectedYear && entry.value.month === expectedMonth
})

// Solo se puede rectificar un mes cerrado, y hace falta un mes abierto donde
// registrar el movimiento. Cuando el mes que se está viendo es el abierto, el
// botón no se muestra: ese mes se edita directamente, no se rectifica.
const canRectify = computed(() => {
  if (!isAdmin.value || entry.value?.state !== 'CLOSED') return false
  return !!activeMonth.value
})

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
}

const getActiveMonth = async () => {
  // El mes activo se busca en la company de la propia entrada: un admin de
  // asociación puede estar mirando la gestión de otra iglesia.
  const companyId = entry.value?.company?.id ?? idCompany
  const result = await http.get(`entries?state=ACTIVE&id_company=${companyId}`) as Result<Entry>
  activeMonth.value = result.count === 1 ? result.rows[0] : undefined
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
  if ((Number.parseFloat(totalEntries.value) === 0 || Number.parseFloat(totalExpenses.value) === 0) && !isAdmin.value) {
    message.warning('Debe llenar los ingresos y los gastos')
  } else {
    if (entry.value.state === 'ACTIVE') {
      let msg = `Va a <strong>cerrar</strong> el mes de <strong>${months[entry.value.month - 1]}</strong> este proceso es irreversible, revise los datos antes de continuar porque ya no podrá modificarlos.`
      if (Number.parseFloat(totalEntries.value) === 0 || Number.parseFloat(totalExpenses.value) === 0) {
        msg += '<br><br><strong class="text-red">VA CERRAR EL MES CON CERO DATOS. ¿Está seguro?</strong>'
      }
      Confirm(msg, async () => {
        await http.put(`entries/close/${entryId as string}/${expenseId as string}`)
        return router.push(`/treasury/report/${entryId as string}/${expenseId as string}`)
      }, null, 'Advertencia', 'Cerrar mes')
    }
  }
}

const revertMonth = () => {
  if (canReopen.value) {
    const msg = `Va a <strong>reabrir</strong> el mes de <strong>${months[entry.value.month - 1]}</strong>. ¿Está seguro de continuar?`

    Confirm(msg, async () => {
      await http.put(`entries/revert/${entryId as string}/${expenseId as string}`)
      return window.location.reload()
    }, null, 'Advertencia', 'Reabrir el mes')
  }
}

const rectifyMonth = () => {
  return router.push(`/treasury/adjustments/${entry.value.year}/${entry.value.month}`)
}

onBeforeMount(async () => {
  await getEntry()
  await getEntryDetails()
  await getExpenseDetails()
  await getActiveMonth()
})
</script>
