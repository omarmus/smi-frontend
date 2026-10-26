<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/months')" />
      Ajustes de meses cerrados - {{ months[form.month - 1] }} {{ form.year }}
    </h2>
    <div class="row q-col-gutter-md">
      <div class="col-xs-12 col-sm-5">
        <q-form
          class="q-gutter-md"
          @submit="save">
          <div class="col-xs-12">
            <q-btn-group spread outline class="full-width">
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
              map-options>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.technical }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
          <div
            class="col-xs-12"
            v-if="form.kind === AdjustmentKind.CORRECTION">
            <q-select
              filled
              label="Línea que se corregirá"
              v-model="form.original_detail_id"
              :options="filteredLines"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              use-input
              input-debounce="0"
              clearable
              @filter="onFilterLines"
              :loading="loadingLines"
              hint="Buscá por persona o por departamento">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label class="text-weight-medium ellipsis">{{ scope.opt.title }}</q-item-label>
                    <q-item-label caption class="ellipsis">{{ scope.opt.subtitle }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-weight-medium text-primary">
                      {{ formatAmount(scope.opt.amount) }}
                    </q-item-label>
                  </q-item-section>
                  <q-tooltip>
                    <div class="line-detail">
                      <div v-for="detail in scope.opt.details" :key="detail.label">
                        <strong>{{ detail.label }}:</strong> {{ detail.value }}
                      </div>
                    </div>
                  </q-tooltip>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12">
            <q-select
              filled
              label="Departamento"
              v-model="form.id_department"
              :options="availableDepartments"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              :hint="departmentHint">
              <template v-slot:selected-item="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local' }}
                      <span v-if="scope.opt.amount !== null">· {{ formatAmount(scope.opt.amount) }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local' }}
                      <span v-if="scope.opt.amount !== null">· {{ formatAmount(scope.opt.amount) }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-checkbox
              v-if="canShowAllDepartments"
              v-model="showAllDepartments"
              dense
              size="xs"
              class="q-mt-xs"
              label="Mostrar todos los departamentos" />
          </div>
          <div class="row">
            <div class="col-xs-6 q-pr-xs">
              <q-input
                filled
                :label="amountLabel"
                v-model.number="form.value"
                type="number"
                :hint="registeredAmount !== null ? `Registrado: ${formatAmount(registeredAmount)}` : ''" />
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
              label="Guardar ajuste"
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
        <h3 class="text-secondary treasury-subtitle">Ajustes registrados</h3>
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
          Todavía no hay ajustes registrados.
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
import { Entry, EntryDetail, Concept } from '../../components/entities/Entry'
import { Expense, ExpenseDetail } from '../../components/entities/Expense'
import { User } from '../../components/entities/User'
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

interface LineDetail {
  label: string
  value: string
}

/** Un concepto de la línea original con el monto que tenía registrado. */
interface ConceptAmount {
  /** id del departamento (el concept.value del offering). */
  id: number
  label: string
  type: string
  amount: number
}

/** Opción del select de departamento, con el monto del concepto si aplica. */
interface DepartmentChoice {
  value: number
  label: string
  type: string
  amount: number | null
}

interface LineOption {
  value: number
  label: string
  amount: number
  type: string
  title: string
  subtitle: string
  search: string
  /** Departamentos a los que puede imputarse la corrección de esta línea. */
  candidateDepartments: number[]
  /** Conceptos de la línea con su monto (aportes de persona). */
  conceptAmounts: ConceptAmount[]
  details: LineDetail[]
}

const store = useStore()
const route = useRoute()

const idCompany = store.state.user?.user?.company?.id as number
const years = getYears()

const adjustments = ref<Adjustment[]>([])
const departments = ref<DepartmentOption[]>([])
const showAllDepartments = ref<boolean>(false)
const originalLines = ref<LineOption[]>([])
const filteredLines = ref<LineOption[]>([])
const loadingLines = ref<boolean>(false)
const saving = ref<boolean>(false)

const form = ref<AdjustmentForm>({
  type: AdjustmentType.ENTRY,
  kind: AdjustmentKind.CORRECTION,
  year: new Date().getFullYear(),
  month: 1,
  id_department: null,
  original_detail_id: null,
  value: null,
  reason: '',
  reference: ''
})

const kindOptions = [
  {
    label: 'Se registró mal (el valor está equivocado)',
    technical: 'Corrección de un error',
    value: AdjustmentKind.CORRECTION
  },
  {
    label: 'Se olvidó registrar (entró algo que no estaba)',
    technical: 'Registro omitido',
    value: AdjustmentKind.OMISSION
  }
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

const money = store.state.user?.user?.company?.money ?? ''

const formatAmount = (value: number): string =>
  `${Number(value).toFixed(2)}${money ? ` ${money}` : ''}`

const personFullName = (user?: User): string => {
  const person = user?.person
  if (!person) return ''
  const fullname = String(person.fullname ?? '').trim()
  if (fullname) return fullname
  return [person.firstName, person.lastName, person.secondLastName]
    .map(part => String(part ?? '').trim())
    .filter(Boolean)
    .join(' ')
}

const paymentTypeLabel = (type?: string): string => {
  const labels: Record<string, string> = {
    CASH: 'Efectivo',
    QR: 'QR',
    DEPOSIT: 'Depósito',
    BANK_TRANSFER: 'Transferencia bancaria'
  }
  return (type && labels[type]) || 'Sin especificar'
}

const formatDate = (value?: Date | string): string => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return date.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const departmentTypeLabel = (type?: string): string =>
  type === 'GLOBAL' ? 'Asociación' : 'Iglesia local'

const detailStateLabel = (state?: string): string => {
  const labels: Record<string, string> = {
    ACTIVE: 'Activa',
    CLOSED: 'Cerrada'
  }
  return (state && labels[state]) || 'Sin estado'
}

const conceptDetails = (concepts?: Concept[]): LineDetail[] => {
  if (!concepts || !concepts.length) return []
  return concepts.map(item => ({
    label: `Concepto · ${String(item.concept?.label ?? 'Sin concepto')}`,
    value: `${formatAmount(Number(item.value))}${item.observation ? ` (${item.observation})` : ''}`
  }))
}

/**
 * El id del departamento de cada concepto: en el catálogo de offerings el
 * `concept.value` ES el id de `sec_departments` (Diezmos=1, Primicias=2,
 * Pro Templo=26...). Con eso se sabe a qué departamentos pertenece el aporte
 * de una persona.
 */
const conceptDepartmentIds = (concepts?: Concept[]): number[] => {
  if (!concepts || !concepts.length) return []
  const ids = concepts
    .map(item => Number(item.concept?.value))
    .filter(id => Number.isFinite(id) && id > 0)
  return Array.from(new Set(ids))
}

/**
 * Los conceptos de la línea con su monto: es lo que permite mostrar en el
 * select de departamento cuánto tiene registrado cada concepto.
 */
const conceptAmountsOf = (concepts?: Concept[]): ConceptAmount[] => {
  if (!concepts || !concepts.length) return []
  const byDepartment = new Map<number, ConceptAmount>()
  for (const item of concepts) {
    const id = Number(item.concept?.value)
    if (!Number.isFinite(id) || id <= 0) continue
    const amount = Number(item.value) || 0
    const current = byDepartment.get(id)
    // Un mismo departamento puede aparecer dos veces en la línea: el monto
    // del departamento es la suma de sus partes.
    if (current) {
      current.amount += amount
    } else {
      byDepartment.set(id, {
        id,
        label: String(item.concept?.label ?? 'Sin concepto'),
        type: String(item.concept?.type ?? 'LOCAL'),
        amount
      })
    }
  }
  return Array.from(byDepartment.values())
}

/**
 * Normaliza texto para buscar: sin acentos, sin eñes, en minúsculas.
 * "nino" encuentra "Niño", "cion" encuentra "ción".
 */const normalizeText = (value: string): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

/**
 * Filtro del select: matchea por persona, departamento, concepto, usuario
 * u observación (texto plano, sin acentos).
 */
const onFilterLines = (needle: string, update: (fn: () => void) => void) => {
  const query = normalizeText(needle)
  const filtered = query
    ? originalLines.value.filter(option => normalizeText(option.search).includes(query))
    : originalLines.value.slice()
  update(() => {
    filteredLines.value = filtered
  })
}

/**
 * Carga las líneas del mes: guarda la lista completa (fuente del filtro) y
 * la lista visible (lo que muestra el select).
 */
const setOriginalLines = (lines: LineOption[]) => {
  originalLines.value = lines
  filteredLines.value = lines.slice()
}

/** Línea elegida en "Línea que se corrigió". */
const selectedLine = computed<LineOption | null>(() =>
  originalLines.value.find(option => option.value === form.value.original_detail_id) ?? null
)

/**
 * Departamentos que se pueden seleccionar:
 *  - con una línea de iglesia/asociación: el de esa línea;
 *  - con una línea de persona: los departamentos de sus conceptos, con el
 *    monto que tenía registrado cada concepto;
 *  - sin línea (omisión) o con la opción "ver todos": todos.
 */
const availableDepartments = computed<DepartmentChoice[]>(() => {
  const all = departments.value
  const line = selectedLine.value
  const toChoice = (department: DepartmentOption): DepartmentChoice => ({
    value: department.value,
    label: department.label,
    type: department.type,
    amount: null
  })
  if (showAllDepartments.value || !line) return all.map(toChoice)
  const candidates = line.candidateDepartments
  if (!candidates.length) return all.map(toChoice)
  const filtered = all
    .filter(department => candidates.includes(department.value))
    .map(department => {
      const concept = line.conceptAmounts.find(item => item.id === department.value)
      return {
        value: department.value,
        label: concept?.label ?? department.label,
        type: concept?.type ?? department.type,
        amount: concept ? concept.amount : null
      }
    })
  // Si algún departamento del concepto no está en el catálogo de la iglesia,
  // se muestran todos para no dejar al usuario sin opciones.
  return filtered.length ? filtered : all.map(toChoice)
})

/**
 * Concepto de la línea que se está corrigiendo: cuando el departamento
 * elegido es uno de los conceptos de un aporte de persona, la corrección
 * aplica solo a ese concepto (y su monto).
 */
const selectedConcept = computed<ConceptAmount | null>(() => {
  const line = selectedLine.value
  const idDepartment = form.value.id_department
  if (!line || idDepartment === null) return null
  return line.conceptAmounts.find(item => item.id === idDepartment) ?? null
})

const canShowAllDepartments = computed<boolean>(() =>
  form.value.kind === AdjustmentKind.CORRECTION &&
  !!selectedLine.value &&
  selectedLine.value.candidateDepartments.length > 0 &&
  availableDepartments.value.length < departments.value.length
)

const departmentHint = computed<string>(() => {
  if (form.value.kind !== AdjustmentKind.CORRECTION) {
    return 'A qué departamento se imputa el movimiento'
  }
  const line = selectedLine.value
  if (!line) return 'Elegí primero la línea que se corrigió'
  if (selectedConcept.value) {
    return `Se corrige solo el concepto ${selectedConcept.value.label}`
  }
  if (line.candidateDepartments.length === 1) {
    return 'Se completó con el departamento de la línea'
  }
  return 'Elegí el departamento donde se imputa la corrección'
})

/** Rótulo del campo de monto: el concepto elegido o la línea completa. */
const amountLabel = computed<string>(() => {
  if (form.value.kind !== AdjustmentKind.CORRECTION) return 'Monto que faltaba'
  return selectedConcept.value ? 'Monto correcto del concepto' : 'Monto correcto de la línea'
})

/** Monto original de referencia (concepto o línea) para no perder contexto. */
const registeredAmount = computed<number | null>(() => {
  if (form.value.kind !== AdjustmentKind.CORRECTION) return null
  if (selectedConcept.value) return selectedConcept.value.amount
  return selectedLine.value ? selectedLine.value.amount : null
})

/**
 * Al elegir la línea, el departamento se completa solo cuando es unívoco:
 * en las líneas de iglesia/asociación es el de la línea; en un aporte de
 * persona son los departamentos de sus conceptos, y si hay más de uno el
 * usuario elige a cuál se imputa la corrección.
 */
const applyDepartmentFromLine = () => {
  showAllDepartments.value = false
  const line = selectedLine.value
  if (form.value.kind !== AdjustmentKind.CORRECTION || !line) {
    form.value.id_department = null
    return
  }
  form.value.id_department = line.candidateDepartments.length === 1
    ? line.candidateDepartments[0]
    : null
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
  filteredLines.value = []
  form.value.original_detail_id = null
  form.value.id_department = null
  if (form.value.kind !== AdjustmentKind.CORRECTION) return

  loadingLines.value = true
  try {
    if (form.value.type === AdjustmentType.ENTRY) {
      const entries = await http.get(`entries?year=${form.value.year}&id_company=${idCompany}&order=month`) as Result<Entry>
      const entry = entries.rows.find(item => item.month === form.value.month)
      if (!entry) return
      const details = await http.get(`entriesdetails?id_entry=${entry.id as string}&order=id`) as Result<EntryDetail>
      setOriginalLines(details.rows.map(detail => {
        const amount = Number(detail.value)
        const departmentName = String(detail.department?.name ?? '').trim()
        const departmentId = detail.department?.id ?? null
        const departmentType = String(detail.department?.type ?? '')
        const memberName = personFullName(detail.user)
        const isMember = detail.type === 'MEMBER' || (!departmentName && !!memberName)
        const observation = String(detail.observations ?? detail.observation ?? '').trim()
        const typeLabel = departmentTypeLabel(departmentType)
        const belongsTo = isMember
          ? `Aportante (persona): ${memberName || 'persona sin nombre registrado'}`
          : `Departamento: ${departmentName || 'no registrado'}`
        const title = isMember
          ? (memberName || 'Aportante sin nombre')
          : (departmentName || 'Línea sin departamento')
        const subtitle = isMember
          ? 'Aportante individual'
          : `Departamento · ${typeLabel}`
        const details: LineDetail[] = [
          { label: 'Imputado a', value: belongsTo },
          { label: 'Tipo de línea', value: isMember ? 'Aportante individual (miembro)' : `Departamento (${typeLabel})` }
        ]
        if (isMember) {
          details.push({ label: 'Persona', value: memberName || 'Sin nombre registrado' })
          details.push({ label: 'Usuario', value: String(detail.user?.username ?? 'Sin usuario') })
        } else {
          details.push({ label: 'Departamento', value: departmentName || 'No registrado' })
          details.push({ label: 'Tipo', value: typeLabel })
        }
        if (detail.code) details.push({ label: 'Nro. de recibo', value: String(detail.code) })
        details.push({ label: 'Fecha', value: formatDate(detail.date) })
        details.push({ label: 'Semana', value: detail.week ? `N° ${detail.week}` : 'Sin semana' })
        details.push({ label: 'Forma de pago', value: paymentTypeLabel(detail.paymentType) })
        details.push({ label: 'Estado', value: detailStateLabel(detail.state) })
        details.push({ label: 'Observación', value: observation || 'Sin observación' })
        details.push(...conceptDetails(detail.concepts))
        details.push({ label: 'Monto registrado', value: formatAmount(amount) })
        return {
          value: detail.id as number,
          label: `${title} — ${formatAmount(amount)}`,
          amount,
          type: isMember ? 'MEMBER' : departmentType,
          title,
          subtitle,
          candidateDepartments: isMember
            ? conceptDepartmentIds(detail.concepts)
            : (departmentId ? [departmentId] : conceptDepartmentIds(detail.concepts)),
          conceptAmounts: conceptAmountsOf(detail.concepts),
          search: [
            title,
            subtitle,
            memberName,
            departmentName,
            String(detail.user?.username ?? ''),
            observation,
            ...conceptDetails(detail.concepts).map(item => `${item.label} ${item.value}`)
          ].filter(Boolean).join(' '),
          details
        }
      }))
      return
    }

    const expenses = await http.get(`expenses?year=${form.value.year}&id_company=${idCompany}&order=month`) as Result<Expense>
    const expense = expenses.rows.find(item => item.month === form.value.month)
    if (!expense) return
    const details = await http.get(`expensesdetails?id_expense=${expense.id as string}&order=id`) as Result<ExpenseDetail>
    setOriginalLines(details.rows.map(detail => {
      const amount = Number(detail.value)
      const concept = String(detail.concept ?? '').trim() || 'Sin concepto'
      const departmentName = String(detail.department?.name ?? '').trim()
      const departmentId = detail.department?.id ?? null
      const departmentType = String(detail.type ?? detail.department?.type ?? '')
      const typeLabel = departmentTypeLabel(departmentType)
      const responsible = String(detail.responsible ?? '').trim()
      const supplier = String(detail.supplier ?? '').trim()
      const documentType = String(detail.document_type ?? detail.documentType ?? '').trim()
      const documentNumber = String(detail.document_number ?? detail.documentNumber ?? '').trim()
      const document = [documentType, documentNumber].filter(Boolean).join(' ')
      const belongsTo = departmentName
        ? `${typeLabel}: ${departmentName}`
        : (responsible ? `Responsable (persona): ${responsible}` : 'Sin responsable ni departamento registrado')
      const title = concept
      const subtitle = departmentName
        ? `${typeLabel} · ${departmentName}`
        : (responsible ? `Responsable · ${responsible}` : 'Sin imputación registrada')
      const details: LineDetail[] = [
        { label: 'Imputado a', value: belongsTo },
        { label: 'Concepto', value: concept }
      ]
      if (departmentName) {
        details.push({ label: 'Departamento', value: departmentName })
        details.push({ label: 'Tipo', value: typeLabel })
      }
      if (responsible) details.push({ label: 'Responsable', value: responsible })
      if (supplier) details.push({ label: 'Proveedor', value: supplier })
      if (document) details.push({ label: 'Documento', value: document })
      details.push({ label: 'Fecha', value: formatDate(detail.date) })
      details.push({ label: 'Estado', value: detailStateLabel(detail.state) })
      details.push({ label: 'Monto registrado', value: formatAmount(amount) })
      return {
        value: detail.id as number,
        label: `${title} — ${formatAmount(amount)}`,
        amount,
        type: departmentType,
        title,
        subtitle,
        candidateDepartments: departmentId ? [departmentId] : [],
        conceptAmounts: [],
        search: [
          title,
          subtitle,
          concept,
          departmentName,
          responsible,
          supplier,
          document
        ].filter(Boolean).join(' '),
        details
      }
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
    message.success('Ajuste registrado')
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
  Confirm('Va a <strong>anular</strong> el ajuste con un contra-asiento. El registro original no se borra.', async () => {
    try {
      await http.put(`adjustments/${item.id as string}/revert`)
      message.success('Ajuste anulado')
      await getAdjustments()
    } catch (error) {
      // el boot de http ya muestra el mensaje del error
    }
  }, null, 'Anular el ajuste', 'Anular')
}

// Si el departamento elegido deja de estar en la lista (p.ej. se desmarca
// "mostrar todos"), se limpia para no guardar un valor inconsistente.
// El monto a corregir cambia de significado según lo seleccionado (concepto o
// línea completa): si cambia el modo, el monto tipeado deja de servir.
watch(() => selectedConcept.value?.id ?? null, () => {
  form.value.value = null
})

watch(availableDepartments, list => {
  if (form.value.id_department === null) return
  if (!list.some(department => department.value === form.value.id_department)) {
    form.value.id_department = null
  }
})

watch(() => [form.value.kind, form.value.type, form.value.year, form.value.month], () => {
  void getOriginalLines()
})

// Al elegir o limpiar la línea, el filtro vuelve a mostrar todas las opciones
// y el departamento se deriva de la línea elegida.
watch(() => form.value.original_detail_id, () => {
  filteredLines.value = originalLines.value.slice()
  applyDepartmentFromLine()
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

<style scoped>
.line-detail {
  line-height: 1.5;
  max-width: 340px;
}
</style>
