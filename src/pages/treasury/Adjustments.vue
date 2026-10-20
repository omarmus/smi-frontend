<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/months')" />
      Rectificaciones - {{ months[form.month - 1] }} {{ form.year }}
    </h2>
    <div class="row">
      <div class="col-xs-12 col-sm-5">
        <q-form
          class="q-gutter-md"
          @submit="save">
          <div class="col-xs-12">
            <q-btn-group spread outline>
              <q-btn
                :outline="form.type !== AdjustmentType.ENTRY"
                padding="12px"
                color="primary"
                label="Ingreso"
                @click="form.type = AdjustmentType.ENTRY"
                no-caps />
              <q-btn
                :outline="form.type !== AdjustmentType.EXPENSE"
                padding="12px"
                color="primary"
                label="Gasto"
                @click="form.type = AdjustmentType.EXPENSE"
                no-caps />
            </q-btn-group>
          </div>
          <div class="col-xs-12">
            <q-select
              filled
              label="¿Qué pasó?"
              v-model="form.kind"
              :options="kindOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options />
          </div>
          <div class="row">
            <div class="col-xs-6 q-pr-xs">
              <q-select
                filled
                label="Gestión"
                v-model="form.year"
                :options="years" />
            </div>
            <div class="col-xs-6 q-pr-xs">
              <q-select
                filled
                label="Mes"
                v-model="form.month"
                :options="monthOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options />
            </div>
          </div>
          <div class="col-xs-12">
            <q-select
              filled
              label="Departamento"
              v-model="form.id_department"
              :options="departments"
              option-value="value"
              option-label="label"
              emit-value
              map-options />
          </div>
          <div
            class="col-xs-12"
            v-if="form.kind === AdjustmentKind.CORRECTION">
            <q-select
              filled
              label="Línea que se corrigió"
              v-model="form.original_detail_id"
              :options="originalLines"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :loading="loadingLines"
              hint="Elegí la línea del mes que tiene el valor equivocado" />
          </div>
          <div class="row">
            <div class="col-xs-6 q-pr-xs">
              <q-input
                filled
                :label="form.kind === AdjustmentKind.CORRECTION ? 'Monto correcto' : 'Monto que faltaba'"
                v-model.number="form.value"
                type="number" />
            </div>
            <div class="col-xs-6 q-pr-xs">
              <q-input
                filled
                label="Comprobante"
                v-model="form.reference" />
            </div>
          </div>
          <div class="col-xs-12">
            <q-input
              filled
              label="Motivo"
              v-model="form.reason" />
          </div>
          <div class="col-xs-12">
            <q-btn
              padding="10px"
              label="Guardar rectificación"
              icon="check"
              color="primary"
              type="submit"
              no-caps
              class="full-width"
              :disable="!canSave"
              :loading="saving" />
          </div>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-7">
        <h3 class="text-secondary treasury-subtitle">Rectificaciones registradas</h3>
        <div class="q-table-simple q-table__container q-table--horizontal-separator column q-table--dense">
          <table class="q-table">
            <thead>
              <tr>
                <th class="text-left"><strong>Período</strong></th>
                <th class="text-left"><strong>Motivo</strong></th>
                <th class="text-right"><strong>Valor</strong></th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in adjustments"
                :key="item.id">
                <td class="text-left">
                  {{ kindLabel(item.kind) }} - {{ months[item.month - 1] }} {{ item.year }}
                  <div class="treasury-observation">
                    {{ item.reference }} - registrada en {{ months[(item.applied_month || 1) - 1] }} {{ item.applied_year }}
                  </div>
                </td>
                <td class="text-left">
                  {{ item.reason }}
                  <div
                    class="treasury-observation"
                    v-if="item.state === AdjustmentState.REVERSED">
                    Anulada
                  </div>
                </td>
                <td class="text-right">{{ totalOf(item) }}</td>
                <td class="width-120">
                  <q-btn
                    v-if="item.state === AdjustmentState.APPLIED && item.kind !== AdjustmentKind.REVERSAL"
                    size="sm"
                    icon="cancel"
                    round
                    flat
                    @click="revert(item)" />
                </td>
              </tr>
            </tbody>
            <tfoot v-if="adjustments.length">
              <tr>
                <th class="text-left" colspan="2"><strong>Total</strong></th>
                <th class="text-right"><strong>{{ totalAdjustments }}</strong></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div
          class="alert alert-info q-mt-md"
          v-if="!adjustments.length">
          Todavía no hay rectificaciones registradas.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Confirm } from 'boot/modal'
import { months, getYears } from '../../components/plugins/datetime'
import { Result } from '../../components/entities/Entity'
import { Department, DepartmentOption } from '../../components/entities/Department'
import { Entry, EntryDetail } from '../../components/entities/Entry'
import { Expense, ExpenseDetail } from '../../components/entities/Expense'
import {
  Adjustment,
  AdjustmentKind,
  AdjustmentState,
  AdjustmentType
} from '../../components/entities/Adjustment'
import { useStore } from '../../store'

/* eslint-disable camelcase */
interface AdjustmentForm {
  type: AdjustmentType
  kind: AdjustmentKind
  year: number
  month: number
  id_department: number | null
  original_detail_id: number | null
  value: number | null
  reason: string
  reference: string
}

interface LineOption {
  value: number
  label: string
  amount: number
}

const store = useStore()
const route = useRoute()

const idCompany = store.state.user?.user?.company?.id as number
const years = getYears()

const adjustments = ref<Adjustment[]>([])
const departments = ref<DepartmentOption[]>([])
const originalLines = ref<LineOption[]>([])
const loadingLines = ref<boolean>(false)
const saving = ref<boolean>(false)

const form = ref<AdjustmentForm>({
  type: AdjustmentType.ENTRY,
  kind: AdjustmentKind.OMISSION,
  year: new Date().getFullYear(),
  month: 1,
  id_department: null,
  original_detail_id: null,
  value: null,
  reason: '',
  reference: ''
})

const kindOptions = [
  { label: 'Se olvidó registrar (entró algo que no estaba)', value: AdjustmentKind.OMISSION },
  { label: 'Se registró mal (el valor está equivocado)', value: AdjustmentKind.CORRECTION }
]

const monthOptions = months.map((label, index) => ({ label, value: index + 1 }))

const canSave = computed(() =>
  !!form.value.year &&
  !!form.value.month &&
  !!form.value.id_department &&
  form.value.value !== null &&
  form.value.value !== '' &&
  !!form.value.reason.trim() &&
  !!form.value.reference.trim() &&
  (form.value.kind !== AdjustmentKind.CORRECTION || !!form.value.original_detail_id)
)

const kindLabel = (kind: AdjustmentKind) => {
  if (kind === AdjustmentKind.OMISSION) return 'Registro omitido'
  if (kind === AdjustmentKind.CORRECTION) return 'Corrección'
  return 'Anulación'
}

const totalOf = (item: Adjustment) => {
  const total = (item.adjustmentsDetails || []).reduce((sum, detail) => sum + Number(detail.value), 0)
  return total.toFixed(2)
}

const totalAdjustments = computed(() =>
  adjustments.value
    .filter(item => item.state === AdjustmentState.APPLIED)
    .reduce((sum, item) => sum + Number(totalOf(item)), 0)
    .toFixed(2)
)

const getAdjustments = async () => {
  const items = await http.get(`adjustments?id_company=${idCompany}&order=-id`) as Result<Adjustment>
  adjustments.value = items.rows
}

const getDepartments = async () => {
  const items = await http.get('departments?order=id') as Result<Department>
  departments.value = items.rows.map(item => ({
    value: item.id,
    label: item.name,
    church: '',
    type: item.type
  }))
}

/**
 * Líneas del mes que se quiere rectificar: de ahí se elige la que tiene el
 * valor equivocado (solo para CORRECTION).
 */
const getOriginalLines = async () => {
  originalLines.value = []
  form.value.original_detail_id = null
  if (form.value.kind !== AdjustmentKind.CORRECTION) return

  loadingLines.value = true
  try {
    if (form.value.type === AdjustmentType.ENTRY) {
      const entries = await http.get(`entries?year=${form.value.year}&id_company=${idCompany}&order=month`) as Result<Entry>
      const entry = entries.rows.find(item => item.month === form.value.month)
      if (!entry) return
      const details = await http.get(`entriesdetails?id_entry=${entry.id as string}&order=id`) as Result<EntryDetail>
      originalLines.value = details.rows.map(detail => ({
        value: detail.id as number,
        label: [String(detail.department?.name ?? ''), String(detail.observations ?? 'sin observación'), Number(detail.value).toFixed(2)].join(' - '),
        amount: Number(detail.value)
      }))
      return
    }

    const expenses = await http.get(`expenses?year=${form.value.year}&id_company=${idCompany}&order=month`) as Result<Expense>
    const expense = expenses.rows.find(item => item.month === form.value.month)
    if (!expense) return
    const details = await http.get(`expensesdetails?id_expense=${expense.id as string}&order=id`) as Result<ExpenseDetail>
    originalLines.value = details.rows.map(detail => ({
      value: detail.id as number,
      label: [String(detail.department?.name ?? ''), String(detail.concept ?? 'sin concepto'), Number(detail.value).toFixed(2)].join(' - '),
      amount: Number(detail.value)
    }))
  } finally {
    loadingLines.value = false
  }
}

const save = async () => {
  saving.value = true
  try {
    const payload = {
      year: form.value.year,
      month: form.value.month,
      type: form.value.type,
      kind: form.value.kind,
      reason: form.value.reason,
      reference: form.value.reference,
      id_company: idCompany,
      details: [{
        id_department: form.value.id_department as number,
        value: Number(form.value.value),
        original_detail_id: form.value.kind === AdjustmentKind.CORRECTION
          ? form.value.original_detail_id as number
          : undefined
      }]
    }

    await http.post('adjustments', payload)
    message.success('Rectificación registrada')
    form.value.value = null
    form.value.reason = ''
    form.value.reference = ''
    form.value.original_detail_id = null
    await getAdjustments()
  } catch (error) {
    // el boot de http ya muestra el mensaje del error
  } finally {
    saving.value = false
  }
}

const revert = (item: Adjustment) => {
  Confirm('Va a <strong>anular</strong> la rectificación con un contra-asiento. El registro original no se borra.', async () => {
    try {
      await http.put(`adjustments/${item.id as string}/revert`)
      message.success('Rectificación anulada')
      await getAdjustments()
    } catch (error) {
      // el boot de http ya muestra el mensaje del error
    }
  }, null, 'Anular rectificación', 'Anular')
}

watch(() => [form.value.kind, form.value.type, form.value.year, form.value.month], () => {
  void getOriginalLines()
})

onBeforeMount(async () => {
  const year = route.params.year ? Number(route.params.year) : null
  const month = route.params.month ? Number(route.params.month) : null
  if (year) form.value.year = year
  if (month) form.value.month = month

  await getDepartments()
  await getAdjustments()
  await getOriginalLines()
})
</script>
