<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
      Seguimiento de aportes a la asociación
    </h2>

    <div class="alert alert-info q-mb-md">
      Resumen de los ingresos (diezmos y ofrendas) que cada iglesia envió a la asociación durante la gestión.
      Seleccione la gestión y haga clic en una celda para ver el detalle del mes.
    </div>

    <div class="row q-col-gutter-md q-mb-md items-end">
      <div class="col-xs-12 col-sm-3">
        <q-select
          v-model="year"
          :options="yearOptions"
          label="Gestión"
          emit-value
          map-options
          filled
          @update:model-value="loadPivot" />
      </div>
      <div class="col-xs-12 col-sm-3">
        <q-select
          v-model="departmentFilter"
          :options="departmentFilterOptions"
          label="Departamento"
          emit-value
          map-options
          filled
          @update:model-value="loadPivot" />
      </div>
      <div class="col-xs-12 col-sm-2">
        <template v-if="pivot && pivot.rows.length > 0">
          <q-select
            v-model="typeFilter"
            :options="typeFilterOptions"
            label="Tipo"
            emit-value
            map-options
            filled />
        </template>
      </div>
      <div class="col-xs-12 col-sm-2">
        <template v-if="pivot && pivot.rows.length > 0">
          <q-input
            v-model="nameFilter"
            debounce="300"
            label="Buscar por nombre"
            filled
            clearable
            placeholder="Escribe para filtrar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </div>
      <div class="col-xs-12 col-sm-2">
        <q-btn
          v-if="pivot && pivot.rows.length > 0"
          class="full-width"
          icon="picture_as_pdf"
          label="Imprimir PDF"
          no-caps
          :loading="printingPdf"
          @click="downloadPdf" />
      </div>
    </div>

    <div class="q-mb-md text-caption text-grey-7 row items-center q-col-gutter-sm" v-if="pivot">
      <div>
        {{ filteredRows.length }} / {{ pivot.rows.length }} iglesia(s) ·
        Total gestión: <strong>{{ formatMoney(filteredGrandTotal) }} {{ money }}</strong>
      </div>
      <q-space />
      <div class="row items-center pivot-legend">
        <span class="pivot-legend__swatch" aria-hidden="true" />
        <span>Celda naranja = monto ingresado manualmente</span>
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">Cargando...</div>
    <div v-else-if="!pivot || pivot.rows.length === 0" class="alert alert-info">
      No hay iglesias o grupos registrados en esta asociación.
    </div>
    <div v-else-if="filteredRows.length === 0" class="alert alert-info">
      Ninguna iglesia/grupo coincide con el filtro.
    </div>
    <div v-else class="q-table-simple q-table__container q-table--horizontal-separator column q-table--dense pivot-container">
      <table class="q-table pivot-table">
        <thead>
          <tr>
            <th class="text-right row-num-col"><strong>#</strong></th>
            <th class="text-left sticky-col sortable" @click="toggleSort('name')">
              <strong>Iglesia / Grupo</strong>
              <q-icon
                v-if="sortBy.column === 'name'"
                :name="sortBy.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                size="14px"
                class="q-ml-xs sort-icon" />
            </th>
            <th
              v-for="m in 12"
              :key="`h-${m}`"
              class="text-right sortable"
              @click="toggleSort(`month-${m}`)">
              <strong>{{ monthsLiteral[m - 1] }}</strong>
              <q-icon
                v-if="sortBy.column === `month-${m}`"
                :name="sortBy.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                size="14px"
                class="q-ml-xs sort-icon" />
            </th>
            <th class="text-right sortable" @click="toggleSort('total')">
              <strong>Total</strong>
              <q-icon
                v-if="sortBy.column === 'total'"
                :name="sortBy.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                size="14px"
                class="q-ml-xs sort-icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in sortedRows" :key="row.id">
            <td class="text-right row-num-col">{{ idx + 1 }}</td>
            <td class="text-left sticky-col">
              <strong>{{ row.name }}</strong>
            </td>
            <td
              v-for="m in 12"
              :key="`r-${row.id}-${m}`"
              class="text-right pivot-cell"
              :class="{
                'pivot-cell--empty': !row.months[m] || row.months[m] === 0,
                'pivot-cell--manual': row.manualMonths?.[m] === true
              }"
              @click="openDetail(row, m)">
              <span v-if="row.months[m] && row.months[m] > 0">
                {{ formatMoney(row.months[m]) }}
                <q-icon name="visibility" size="xs" class="q-ml-xs pivot-cell__icon" />
              </span>
              <span v-else-if="row.manualMonths?.[m] === true">
                {{ formatMoney(0) }}
                <q-icon name="visibility" size="xs" class="q-ml-xs pivot-cell__icon" />
              </span>
              <span v-else class="text-grey-5">—</span>
            </td>
            <td class="text-right pivot-total">
              <strong>{{ formatMoney(row.total) }}</strong>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="filteredRows.length > 0">
          <tr class="pivot-foot">
            <td class="text-right row-num-col">—</td>
            <td class="text-left sticky-col"><strong>TOTAL</strong></td>
            <td
              v-for="m in 12"
              :key="`f-${m}`"
              class="text-right">
              <strong>{{ formatMoney(filteredMonthTotals[m]) }}</strong>
            </td>
            <td class="text-right">
              <strong>{{ formatMoney(filteredGrandTotal) }}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <q-dialog v-model="detailDialog" persistent>
      <q-card class="detail-card">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="church" size="24px" class="q-mr-sm" />
          <div class="text-h6">
            {{ detail?.church?.name }} — {{ detail ? monthsLiteral[detail.month - 1] : '' }} {{ detail?.year }}
          </div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup />
        </q-card-section>

        <q-card-section v-if="loadingInforme" class="text-center q-pa-lg">Cargando informe...</q-card-section>
        <q-card-section v-else-if="!informeManual && !informeNormal" class="alert alert-info">No se pudo cargar el informe. Intente nuevamente.</q-card-section>
        <template v-else>
          <div class="detail-card__body">
            <q-card-section v-if="hasInformeData" class="q-pb-none">
              <q-tabs
                v-model="informeTab"
                inline-label
                dense
                no-caps
                align="left"
                indicator-color="warning"
                class="bg-grey-2 rounded-borders q-mb-sm"
              >
                <q-tab
                  name="normal"
                  icon="visibility"
                  label="Registro normal"
                  v-if="hasNormalData" />
                <q-tab name="manual" icon="edit" label="Registro manual" />
              </q-tabs>
            </q-card-section>

            <q-card-section>
              <q-tab-panels v-model="informeTab" animated>
              <!-- Tab: Registro normal -->
              <q-tab-panel name="normal" v-if="hasNormalData">
                <h3 class="text-center report-title">
                  INFORME MENSUAL DE TESORERÍA DE IGLESIA
                  <strong class="block">{{ informeNormal.entry?.company?.name || detail?.church?.name }}</strong>
                  <span class="block text-caption text-grey-7">{{ detail ? monthsLiteral[detail.month - 1] : '' }} {{ detail?.year }}</span>
                </h3>

                <div class="row q-col-gutter-md">
                  <div class="col-xs-12" :class="{ 'col-md-6': informeNormal.expensesDetailsGlobal?.length > 0, 'col-md-12': !informeNormal.expensesDetailsGlobal || informeNormal.expensesDetailsGlobal.length === 0 }">
                    <h4 class="text-primary flow-title q-mb-sm">Ingresos Asociación</h4>
                    <div v-if="!informeNormal.flowsEntriesSendGlobal || informeNormal.flowsEntriesSendGlobal.length === 0" class="text-grey-7 q-pa-sm">
                      Sin ingresos registrados.
                    </div>
                    <div v-else>
                      <div
                        v-for="item in informeNormal.flowsEntriesSendGlobal"
                        :key="item.id"
                        class="row justify-end q-mb-xs">
                        <template v-if="item.department">
                          <div class="col-7">{{ item.department.name }}</div>
                          <div class="col-5 text-right">{{ formatMoney(item.total) }} {{ money }}</div>
                        </template>
                      </div>
                      <q-separator class="q-my-sm" />
                      <div class="row justify-end">
                        <div class="col-7"><strong>Total:</strong></div>
                        <div class="col-5 text-right"><strong>{{ formatMoney(totalFlowEntryGlobalInformeNormal) }} {{ money }}</strong></div>
                      </div>
                    </div>
                  </div>

                  <div v-if="informeNormal.expensesDetailsGlobal && informeNormal.expensesDetailsGlobal.length > 0" class="col-xs-12 col-md-6">
                    <h4 class="text-primary flow-title q-mb-sm">Gastos Asociación</h4>
                    <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense">
                      <table class="q-table">
                        <thead>
                          <tr>
                            <th class="text-left"><strong>Descripción</strong></th>
                            <th class="text-right"><strong>Valor</strong></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in informeNormal.expensesDetailsGlobal" :key="item.id">
                            <td class="text-left">
                              {{ item.concept }}
                              <strong v-if="item.department?.name" class="block text-caption text-primary">{{ item.department.name }}</strong>
                            </td>
                            <td class="text-right">{{ formatMoney(item.value) }}</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <th class="text-left"><strong>Total</strong></th>
                            <th class="text-right"><strong>{{ formatMoney(totalExpensesGlobalInformeNormal) }}</strong></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="row q-col-gutter-md items-center">
                  <div class="col-xs-12 col-sm-4">
                    <div class="text-caption text-grey-7">Total enviado</div>
                    <strong>{{ formatMoney(informeNormal.entry?.totalDeposited) }} {{ money }}</strong>
                  </div>
                  <div class="col-xs-12 col-sm-4">
                    <div class="text-caption text-grey-7">Fecha del envío</div>
                    <strong>{{ informeNormal.entry?.dateDeposited ? formatDate(informeNormal.entry.dateDeposited) : '—' }}</strong>
                  </div>
                  <div class="col-xs-12 col-sm-4">
                    <div class="text-caption text-grey-7">Comprobante</div>
                    <a
                      v-if="informeNormal.entry?.voucherDeposited"
                      class="text-primary"
                      :href="`${apiBase}/files/${informeNormal.entry.voucherDeposited}`"
                      target="_blank"
                      rel="noopener">
                      <q-icon name="file_download" /> {{ informeNormal.entry.voucherDeposited }}
                    </a>
                    <div v-else class="text-grey-7">Sin comprobante</div>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Tab: Registro manual -->
              <q-tab-panel name="manual">
                <div class="text-primary flow-title q-mb-sm">Registro manual de aportes</div>
                <div class="text-caption text-grey-7 q-mb-sm">
                  Ingrese los montos para cada concepto de la iglesia en este mes.
                  <br>Los valores ingresados reemplazarán cualquier registro existente.
                </div>
                <div v-if="loadingDepts" class="text-center q-pa-md">Cargando conceptos...</div>
                <div v-else-if="!globalDepartments || globalDepartments.length === 0" class="alert alert-warning">
                  No hay conceptos globales configurados para esta iglesia.
                </div>
                <div v-else>
                  <div
                    v-for="dept in globalDepartments"
                    :key="dept.id"
                    class="row q-mb-xs items-center">
                    <div class="col-8 col-md-9 text-body2">{{ dept.name }}</div>
                    <div class="col-4 col-md-3">
                      <q-input
                        v-model="manualValues[dept.id]"
                        dense
                        filled
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        :suffix="money" />
                    </div>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="row items-center manual-total">
                    <div class="col-8 col-md-9"><strong>Total ingresado</strong></div>
                    <div class="col-4 col-md-3 text-right">
                      <strong>{{ formatMoney(manualTotal) }} {{ money }}</strong>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
          </div>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              v-if="informeTab === 'manual'"
              no-caps
              color="primary"
              icon="save"
              label="Guardar registro manual"
              :loading="saving"
              @click="saveManual" />
            <q-btn
              label="Cerrar"
              no-caps
              flat
              color="secondary"
              padding="8px 20px"
              v-close-popup />
          </q-card-actions>
        </template>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { http, urlBase } from 'boot/http'
import { months as monthsLiteral } from 'src/components/plugins/datetime'
import { useStore } from 'src/store'
import { message } from 'boot/message'
import { Department } from 'src/components/entities/Department'

const store = useStore()
const money = computed(() => (store.state.user?.user?.company?.money as string) || 'BS')
const apiBase = computed(() => (urlBase || '').replace(/\/api\/?$/, ''))

const year = ref(new Date().getFullYear())
const loading = ref(false)
const printingPdf = ref(false)

/** Descarga el PDF del reporte de la gestión actual, respetando los filtros y el sort
 *  aplicados en la pantalla. El backend devuelve el PDF en base64. */
async function downloadPdf () {
  printingPdf.value = true
  try {
    const params = new URLSearchParams()
    if (typeFilter.value !== 'ALL') params.set('type', typeFilter.value)
    const trimmedName = (nameFilter.value || '').trim()
    if (trimmedName) params.set('name', trimmedName)
    if (departmentFilter.value) params.set('id_department', String(departmentFilter.value))
    if (sortBy.value.column) {
      params.set('sortBy', sortBy.value.column)
      params.set('sortDir', sortBy.value.direction)
    }
    const qs = params.toString()
    const url = `entries/report/association-contributions/${year.value}/pdf${qs ? '?' + qs : ''}`

    const res = await http.get(url) as { data?: string } | string
    const b64 = typeof res === 'string' ? res : res?.data
    if (!b64) {
      message.error('No se pudo generar el PDF.')
      return
    }
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url2 = URL.createObjectURL(blob)
    window.open(url2, '_blank')
    // Liberamos el object URL después de que el navegador haya tenido tiempo de cargar el PDF.
    setTimeout(() => URL.revokeObjectURL(url2), 60_000)
  } catch (err) {
    message.error('Error al generar el PDF del reporte.')
  } finally {
    printingPdf.value = false
  }
}
const pivot = ref<{
  year: number
  rows: Array<{ id: number; name: string; type?: string; months: Record<number, number>; manualMonths: Record<number, boolean>; total: number }>
  monthTotals: Record<number, number>
  grandTotal: number
} | null>(null)

const detailDialog = ref(false)
const detail = ref<{
  church: { id: number; name: string }
  year: number
  month: number
  total: number
  details: Array<{
    id: number
    date: string
    week: number
    department: { id: number; name: string } | null
    value: number
    paymentType: string
    observations: string
  }>
} | null>(null)

const yearOptions = computed(() => {
  const y = new Date().getFullYear()
  const opts: Array<{ value: number; label: string }> = []
  for (let i = y; i >= 2022; i--) opts.push({ value: i, label: String(i) })
  return opts
})

const formatMoney = (n: number | string | undefined) => {
  const v = Number(n) || 0
  return v.toFixed(2)
}

const formatDate = (d: string | Date | undefined) => {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${date.getFullYear()}`
}

// ─── Modo "Registro manual" en el diálogo ───────────────────────────────

const informeTab = ref<'manual' | 'normal'>('normal')
const globalDepartments = ref<Department[]>([])
const loadingDepts = ref(false)
const saving = ref(false)
const manualValues = ref<Record<number, number>>({})

async function saveManual () {
  if (!detail.value) return
  // Armar el payload: solo departamentos con monto > 0
  /* eslint-disable camelcase */
  const departments: Array<{ id_department: number; total: number }> = []
  let hasValues = false
  for (const dept of globalDepartments.value) {
    const val = Number(manualValues.value[dept.id]) || 0
    if (val > 0) {
      departments.push({ id_department: dept.id, total: val })
      hasValues = true
    }
  }
  /* eslint-enable camelcase */
  if (!hasValues) {
    message.warning('Ingrese al menos un monto antes de guardar.')
    return
  }
  saving.value = true
  try {
    await http.post('entries/report/manual-contribution', {
      id_company: detail.value.church.id,
      year: year.value,
      month: detail.value.month,
      departments
    })
    message.success('Registro manual guardado.')
    detailDialog.value = false
    // Refrescar el pivote para que la celda aparezca marcada como manual.
    await loadPivot()
  } catch (err) {
    message.error('Error al guardar el registro manual.')
  } finally {
    saving.value = false
  }
}

interface PivotResponse {
  year: number
  rows: Array<{ id: number; name: string; type?: string; months: Record<number, number>; manualMonths: Record<number, boolean>; total: number }>
  monthTotals: Record<number, number>
  grandTotal: number
}

interface DetailResponse {
  church: { id: number; name: string }
  year: number
  month: number
  total: number
  details: Array<{
    id: number
    date: string
    week: number
    department: { id: number; name: string } | null
    value: number
    paymentType: string
    observations: string
  }>
}

const unwrap = <T>(res: T | { data: T }): T => {
  if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
    return (res as { data: T }).data
  }
  return res as T
}

/** Filtros del pivote: tipo (Todos / Iglesias / Grupos) y nombre (texto libre con debounce). */
type TypeFilter = 'ALL' | 'CHURCH' | 'GROUP'
const typeFilter = ref<TypeFilter>('ALL')
const typeFilterOptions = [
  { value: 'ALL', label: 'Todos' },
  { value: 'CHURCH', label: 'Solo iglesias' },
  { value: 'GROUP', label: 'Solo grupos' }
]
const nameFilter = ref<string>('')

/** Filtro por departamento de la asociación. 0 = todos los departamentos. */
const departmentFilter = ref<number>(0)
const departments = ref<Department[]>([])
const departmentFilterOptions = computed<Array<{ value: number; label: string }>>(() => [
  { value: 0, label: 'Todos los departamentos' },
  ...departments.value
    .filter(d => d.type === 'GLOBAL')
    .map(d => ({ value: d.id, label: d.name }))
])

async function loadDepartments () {
  try {
    const res = await http.get(
      `departments?id_company=${String(store.state.user?.user?.company?.id_association || 1)}&type=GLOBAL&order=id`
    ) as { rows: Department[] }
    departments.value = res?.rows || []
  } catch (err) {
    departments.value = []
  }
}

/** Filas del pivote que pasan el filtro de tipo + nombre. */
const filteredRows = computed(() => {
  if (!pivot.value) return []
  const needle = (nameFilter.value || '').trim().toLowerCase()
  return pivot.value.rows.filter(r => {
    if (typeFilter.value !== 'ALL' && r.type !== typeFilter.value) return false
    if (needle && !r.name.toLowerCase().includes(needle)) return false
    return true
  })
})

/** Totales por mes sobre el subconjunto filtrado. */
const filteredMonthTotals = computed<Record<number, number>>(() => {
  const out: Record<number, number> = {}
  for (let m = 1; m <= 12; m++) out[m] = 0
  for (const r of filteredRows.value) {
    for (let m = 1; m <= 12; m++) {
      out[m] += Number(r.months[m] || 0)
    }
  }
  return out
})

/** Total general sobre el subconjunto filtrado. */
const filteredGrandTotal = computed(() => {
  return filteredRows.value.reduce((s, r) => s + Number(r.total || 0), 0)
})

/** Orden de la tabla pivote: por nombre, mes 1-12 o total. */
type SortColumn = 'name' | `month-${1|2|3|4|5|6|7|8|9|10|11|12}` | 'total'
const sortBy = ref<{ column: SortColumn | null; direction: 'asc' | 'desc' }>({
  column: null,
  direction: 'asc'
})

/** Alterna la dirección si se hace clic en la columna activa, o fija asc en una nueva. */
function toggleSort (column: SortColumn) {
  if (sortBy.value.column === column) {
    sortBy.value.direction = sortBy.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value.column = column
    sortBy.value.direction = 'asc'
  }
}

/** Filas filtradas ordenadas según `sortBy`. Devuelve copia, no muta. */
const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  const { column, direction } = sortBy.value
  if (!column) return rows
  if (column === 'name') {
    // Comparación alfabética case-insensitive con soporte para acentos.
    rows.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      return direction === 'asc' ? cmp : -cmp
    })
    return rows
  }
  const get = (r: typeof rows[number]) => {
    if (column === 'total') return Number(r.total) || 0
    const m = Number(column.split('-')[1]) as 1|2|3|4|5|6|7|8|9|10|11|12
    return Number(r.months[m]) || 0
  }
  rows.sort((a, b) => direction === 'asc' ? get(a) - get(b) : get(b) - get(a))
  return rows
})

async function loadPivot () {
  loading.value = true
  try {
    const url = departmentFilter.value
      ? `entries/report/association-contributions/${year.value}?id_department=${departmentFilter.value}`
      : `entries/report/association-contributions/${year.value}`
    const res = await http.get(url) as PivotResponse | { data: PivotResponse }
    pivot.value = unwrap(res)
  } catch (err) {
    message.error('No se pudo cargar el seguimiento de aportes')
    pivot.value = null
  } finally {
    loading.value = false
  }
}

async function openDetail (row: { id: number; name: string }, month: number) {
  detailDialog.value = true
  informeTab.value = 'manual'
  loadingInforme.value = true
  loadingDepts.value = true
  detail.value = null
  informeManual.value = null
  informeNormal.value = null
  manualValues.value = {}
  try {
    const [detRes, deptsRes] = await Promise.all([
      http.get(`entries/report/association-contributions/${year.value}/${month}/${row.id}`) as Promise<DetailResponse | { data: DetailResponse }>,
      http.get(`departments?id_company=${String(store.state.user?.user?.company?.id_association || 1)}&type=GLOBAL&order=id`) as Promise<{ rows: Department[] }>
    ])
    detail.value = unwrap(detRes)
    globalDepartments.value = (deptsRes?.rows || [])
    await loadInforme(row.id, month)
    // Default del tab según los datos cargados:
    //   - datos del tesorero → 'normal';
    //   - solo manuales o vacío → 'manual'.
    informeTab.value = hasNormalData.value ? 'normal' : 'manual'
  } catch (err) {
    message.error('No se pudo cargar el detalle del mes')
    detail.value = null
    informeManual.value = null
    informeNormal.value = null
  } finally {
    loadingInforme.value = false
    loadingDepts.value = false
  }
}

interface InformeData {
  entry: null | { id?: number; totalDeposited?: number; dateDeposited?: string; voucherDeposited?: string; company?: { name?: string } }
  flowsEntriesSendGlobal: Array<{ id?: number; total?: number; department?: { id: number; name: string } | null }>
  expensesDetailsGlobal: Array<{ id?: number; concept?: string; value?: number; department?: { id?: number; name?: string } | null }>
}
const loadingInforme = ref(false)
const informeManual = ref<InformeData | null>(null)
const informeNormal = ref<InformeData | null>(null)

/** Hay datos si existe entry, o hay flows (normales o manuales), o gastos registrados. */
const hasInformeData = computed(() => {
  const m = informeManual.value
  const n = informeNormal.value
  return Boolean(m?.entry || n?.entry) ||
    (m?.flowsEntriesSendGlobal?.length ?? 0) > 0 ||
    (n?.flowsEntriesSendGlobal?.length ?? 0) > 0 ||
    (n?.expensesDetailsGlobal?.length ?? 0) > 0
})

/** Hay datos del tesorero (normales): entry, flows del tesorero o gastos. Sin esto no se
 *  muestra la pestaña "Registro normal" — si solo hay datos manuales, no hay nada que
 *  mostrar ahí. */
const hasNormalData = computed(() => {
  const n = informeNormal.value
  return Boolean(n?.entry) ||
    (n?.flowsEntriesSendGlobal?.length ?? 0) > 0 ||
    (n?.expensesDetailsGlobal?.length ?? 0) > 0
})

/** Suma de los valores ingresados en el formulario manual. Solo de los deptos actuales. */
const manualTotal = computed(() => {
  let total = 0
  for (const dept of globalDepartments.value) {
    total += Number(manualValues.value[dept.id]) || 0
  }
  return total
})

const asArray = (raw: unknown): any[] => {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object' && Array.isArray((raw as { rows?: unknown[] }).rows)) {
    return (raw as { rows: any[] }).rows
  }
  return []
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

/** Carga datos manual y normal del informe para una iglesia/mes. */
async function loadInforme (idCompany: number, month: number) {
  loadingInforme.value = true
  informeManual.value = null
  informeNormal.value = null
  try {
    const [entryRes, flowsManualRes, flowsNormalRes] = await Promise.all([
      // 1) entry header
      http.get(`entries?year=${year.value}&month=${month}&id_company=${idCompany}`),
      // 2) flows manuales
      http.get(`flows/send/${year.value}/${month}/${idCompany}?manual=true`),
      // 3) flows normales
      http.get(`flows/send/${year.value}/${month}/${idCompany}?manual=false`)
    ])
    const entry = asArray(unwrap(entryRes))[0] || null

    const flowsManualData = unwrap(flowsManualRes) as { rows?: any[] } | null
    const flowsNormalData = unwrap(flowsNormalRes) as { rows?: any[] } | null

    const flowsManual = (flowsManualData?.rows || []).filter((r: any) => r.department)
    const flowsNormal = (flowsNormalData?.rows || []).filter((r: any) => r.department)

    // Hidratar el form manual con los balances manuales ya guardados.
    // Si el admin ya cargó este mes antes, el form debe mostrarle sus valores previos.
    manualValues.value = {}
    for (const item of flowsManual) {
      const deptId = item.department?.id
      if (deptId != null) manualValues.value[deptId] = Number(item.total) || 0
    }

    // 4) gastos (compartidos entre ambos)
    let expensesDetailsGlobal: InformeData['expensesDetailsGlobal'] = []
    if (entry?.id) {
      const expRes = await http.get(`expenses?year=${year.value}&month=${month}&id_company=${idCompany}`)
      const expense = asArray(unwrap(expRes))[0] as { id?: number } | null
      if (expense?.id) {
        const expDetRes = await http.get(`expensesdetails?id_expense=${String(expense.id)}`)
        const expDetData = unwrap(expDetRes) as { rows?: any[] } | null
        const details: any[] = expDetData?.rows || []
        expensesDetailsGlobal = details.filter((d: any) => d.type === 'GLOBAL')
      }
    }

    const entryData = entry ? {
      id: entry.id,
      totalDeposited: entry.totalDeposited,
      dateDeposited: entry.dateDeposited,
      voucherDeposited: entry.voucherDeposited,
      company: entry.company
    } : null

    informeManual.value = { entry: entryData, flowsEntriesSendGlobal: flowsManual, expensesDetailsGlobal }
    informeNormal.value = { entry: entryData, flowsEntriesSendGlobal: flowsNormal, expensesDetailsGlobal }
  } catch (err) {
    message.error('No se pudo cargar el informe del mes')
    informeManual.value = null
    informeNormal.value = null
  } finally {
    loadingInforme.value = false
  }
}

/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

const totalFlowEntryGlobalInformeNormal = computed(() => {
  if (!informeNormal.value) return 0
  return informeNormal.value.flowsEntriesSendGlobal.reduce((s, r) => s + Number(r.total || 0), 0)
})

const totalExpensesGlobalInformeNormal = computed(() => {
  if (!informeNormal.value) return 0
  return informeNormal.value.expensesDetailsGlobal.reduce((s, r) => s + Number(r.value || 0), 0)
})

onMounted(async () => {
  await loadDepartments()
  await loadPivot()
})
</script>

<style scoped>
.pivot-container {
  overflow-x: auto;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}
.pivot-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  min-width: 1100px;
}
.pivot-table th,
.pivot-table td {
  padding: 8px 10px;
  white-space: nowrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.pivot-table thead th {
  background-color: rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1;
}
.pivot-table tfoot td {
  background-color: rgba(0, 0, 0, 0.06);
  border-top: 2px solid rgba(0, 0, 0, 0.12);
}
.sticky-col {
  position: sticky;
  left: 0;
  background-color: #ffffff;
  z-index: 2;
  min-width: 180px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
.pivot-table thead .sticky-col {
  z-index: 3;
}
.row-num-col {
  min-width: 40px;
  width: 40px;
  color: rgba(0, 0, 0, 0.55);
  font-variant-numeric: tabular-nums;
}
.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease;
}
.sortable:hover {
  background-color: rgba(0, 0, 0, 0.06);
}
.sort-icon {
  vertical-align: middle;
}
.detail-card {
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.detail-card__body {
  flex: 1 1 auto;
  overflow-y: auto;
}
.pivot-cell {
  cursor: pointer;
  transition: background-color 120ms ease;
}
.pivot-cell:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.pivot-cell--empty {
  cursor: default;
  color: rgba(0, 0, 0, 0.25);
}
.pivot-cell--manual {
  background-color: rgba(255, 152, 0, 0.18);
  color: #b35a00;
  font-weight: 500;
}
.pivot-cell--manual:hover {
  background-color: rgba(255, 152, 0, 0.28);
}
.pivot-legend {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
}
.pivot-legend__swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border-radius: 3px;
  background-color: rgba(255, 152, 0, 0.18);
  border: 1px solid rgba(255, 152, 0, 0.45);
}
.manual-total {
  background-color: rgba(0, 0, 0, 0.04);
  padding: 10px 12px;
  border-radius: 4px;
  margin-top: 4px;
  font-size: 1rem;
}
.pivot-cell__icon {
  opacity: 0.4;
}
.pivot-cell:hover .pivot-cell__icon {
  opacity: 0.9;
}
.pivot-total {
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}
.treasury-observation {
  font-size: 0.9em;
  color: #666;
  max-width: 220px;
  white-space: normal;
}
.treasury-empty {
  color: #666;
  font-style: italic;
}
</style>
