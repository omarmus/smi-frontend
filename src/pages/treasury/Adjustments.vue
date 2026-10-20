<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/months')" />
      Rectificaciones de períodos anteriores
    </h2>

    <div class="alert alert-info">
      Los meses ya cerrados no se modifican. La corrección queda registrada en el
      mes abierto con la referencia del período al que corresponde.
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-md-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Nueva rectificación</div>
          </q-card-section>
          <q-card-section>
            <q-select
              v-model="form.type"
              :options="typeOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="¿Ingreso o gasto?"
              outlined
              dense />

            <q-select
              v-model="form.kind"
              :options="kindOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="¿Qué pasó?"
              outlined
              dense />

            <q-select
              v-model="form.year"
              :options="years"
              label="Gestión"
              outlined
              dense />

            <q-select
              v-model="form.month"
              :options="monthOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Mes"
              outlined
              dense />

            <q-select
              v-model="form.id_department"
              :options="departments"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Departamento"
              outlined
              dense />

            <q-select
              v-if="form.kind === AdjustmentKind.CORRECTION"
              v-model="form.original_detail_id"
              :options="originalLines"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Línea que se corrigió"
              outlined
              dense
              :loading="loadingLines"
              hint="Elegí la línea del mes que tiene el valor equivocado" />

            <q-input
              v-if="form.kind === AdjustmentKind.CORRECTION"
              v-model.number="form.value"
              type="number"
              label="Monto correcto"
              outlined
              dense />

            <q-input
              v-else
              v-model.number="form.value"
              type="number"
              label="Monto que faltaba"
              outlined
              dense />

            <q-input
              v-model="form.reason"
              label="Motivo"
              outlined
              dense
              hint="Por ejemplo: se cargó con un cero de más" />

            <q-input
              v-model="form.reference"
              label="Comprobante o documento"
              outlined
              dense
              hint="Número y fecha del recibo, factura o acta" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              label="Guardar rectificación"
              color="primary"
              no-caps
              :disable="!canSave"
              :loading="saving"
              @click="save" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Rectificaciones registradas</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="item in adjustments" :key="item.id">
              <q-item-section>
                <q-item-label>
                  {{ kindLabel(item.kind) }} — {{ months[item.month - 1] }} {{ item.year }}
                  <q-badge
                    v-if="item.state === AdjustmentState.REVERSED"
                    color="negative"
                    label="Anulada" />
                </q-item-label>
                <q-item-label caption>
                  {{ item.reference }} — {{ item.reason }}
                </q-item-label>
                <q-item-label caption>
                  Registrada en {{ months[(item.applied_month || 1) - 1] }} {{ item.applied_year }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-right">
                  <div class="text-weight-bold">
                    {{ totalOf(item) }} {{ $store.state.user?.user?.company?.money }}
                  </div>
                  <q-btn
                    v-if="item.state === AdjustmentState.APPLIED && item.kind !== AdjustmentKind.REVERSAL"
                    label="Anular"
                    color="negative"
                    flat
                    dense
                    no-caps
                    @click="revert(item)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-section v-if="!adjustments.length" class="text-grey">
            Todavía no hay rectificaciones registradas.
          </q-card-section>
        </q-card>
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

const typeOptions = [
  { label: 'Ingreso', value: AdjustmentType.ENTRY },
  { label: 'Gasto', value: AdjustmentType.EXPENSE }
]

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
        label: [String(detail.department?.name ?? ''), String(detail.observations ?? 'sin observación'), Number(detail.value).toFixed(2)].join(' — '),
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
      label: [String(detail.department?.name ?? ''), String(detail.concept ?? 'sin concepto'), Number(detail.value).toFixed(2)].join(' — '),
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
  const year = route.query.year ? Number(route.query.year) : null
  const month = route.query.month ? Number(route.query.month) : null
  if (year) form.value.year = year
  if (month) form.value.month = month

  await getDepartments()
  await getAdjustments()
  await getOriginalLines()
})
</script>
