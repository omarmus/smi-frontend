<template>
  <div class="container fill-page">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary/form-reports')" />
      {{ title }}
    </h2>

    <div class="row q-col-gutter-sm q-mb-md fill-toolbar">
      <div class="col-auto">
        <q-btn
          v-if="canUpdate"
          outline
          color="primary"
          icon="view_column"
          label="Columnas"
          no-caps
          @click="columnsDialog = true" />
      </div>
      <div class="col-auto">
        <q-btn
          v-if="canUpdate"
          outline
          color="primary"
          icon="playlist_add"
          label="Agregar columna"
          no-caps
          @click="openAddColumn" />
      </div>
      <div class="col-auto">
        <q-btn
          color="secondary"
          icon="print"
          label="Imprimir"
          no-caps
          @click="goPrint" />
      </div>
    </div>

    <q-list bordered separator class="day-list">
      <q-item
        v-for="row in dayRows"
        :key="row.day"
        clickable
        v-ripple
        @click="openDay(row)">
        <q-item-section avatar>
          <q-badge color="primary" :label="row.day" />
        </q-item-section>
        <q-item-section>
          <q-item-label v-if="dayChips(row).length">
            <q-chip
              v-for="chip in dayChips(row)"
              :key="chip.label"
              dense
              size="sm"
              color="grey-3"
              text-color="black">
              {{ chip.label }}: {{ chip.value }}
            </q-chip>
          </q-item-label>
          <q-item-label v-else caption>Sin datos</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" color="grey" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-bar class="fill-totals">
      <div class="text-caption text-bold q-mr-sm">Totales:</div>
      <q-chip
        v-for="total in totalChips"
        :key="total.key"
        dense
        size="sm"
        color="white"
        text-color="black"
        class="text-bold">
        {{ total.label }}: {{ total.value }}
      </q-chip>
    </q-bar>

    <!-- Edición de un día -->
    <q-dialog v-model="dayDialog" persistent>
      <q-card class="day-dialog">
        <q-toolbar class="q-pa-md">
          <q-icon name="edit_calendar" size="md" />
          <!-- C4: la cabecera ES la fecha del día que se llena, no un input -->
          <q-toolbar-title>{{ selectedDateLabel }}</q-toolbar-title>
          <q-btn flat round dense icon="close" @click="dayDialog = false" />
        </q-toolbar>
        <q-card-section>
          <q-form @submit="saveDay">
            <div class="row q-col-gutter-sm">
              <div
                v-for="column in editableColumns"
                :key="column.key"
                class="col-12">
                <!-- B6-2: los −/+ son botones PROPIOS junto al input (la fila
                     crece con el input, los botones quedan fijos a la derecha) -->
                <div
                  v-if="column.kind === 'number'"
                  class="row no-wrap items-center q-col-gutter-xs cell-row">
                  <div class="col">
                    <q-input
                      class="cell-number"
                      :model-value="formValues[column.key]"
                      :label="column.label"
                      filled
                      dense
                      type="number"
                      inputmode="decimal"
                      :rules="rules.nonNegative"
                      @update:model-value="value => setNumber(column.key, value)" />
                  </div>
                  <!-- C4/B6-2: el valor nunca baja de 0 (el − queda deshabilitado en 0) -->
                  <div class="col-auto row no-wrap q-gutter-xs">
                    <q-btn
                      color="primary"
                      dense
                      round
                      size="sm"
                      icon="remove"
                      :disable="!(Number(formValues[column.key]) > 0)"
                      @click="stepNumber(column.key, -1)">
                      <q-tooltip>Restar 1</q-tooltip>
                    </q-btn>
                    <q-btn
                      color="primary"
                      dense
                      round
                      size="sm"
                      icon="add"
                      @click="stepNumber(column.key, 1)">
                      <q-tooltip>Sumar 1</q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <q-input
                  v-else
                  v-model="formValues[column.key]"
                  :label="column.label"
                  filled
                  dense
                  type="textarea"
                  autogrow />
              </div>
              <div class="col-12 text-right q-gutter-sm q-mt-sm">
                <q-btn
                  flat
                  color="negative"
                  icon="delete_sweep"
                  label="Limpiar día"
                  type="button"
                  @click="clearDay" />
                <q-btn icon="check" color="primary" label="Guardar" type="submit" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Columnas del informe -->
    <q-dialog v-model="columnsDialog" persistent>
      <q-card class="day-dialog">
        <q-toolbar class="q-pa-md">
          <q-icon name="view_column" size="md" />
          <q-toolbar-title>Columnas del informe</q-toolbar-title>
          <q-btn flat round dense icon="close" @click="columnsDialog = false" />
        </q-toolbar>
        <q-card-section>
          <q-list bordered separator>
            <q-item
              v-for="column in detail?.columns || []"
              :key="column.key">
              <q-item-section>
                <q-item-label>{{ column.label }}</q-item-label>
                <q-item-label caption>
                  {{ column.key }} · {{ kindName(column) }}
                  <span v-if="column.total"> · total</span>
                  <span v-if="isDerived(column)"> · derivada</span>
                  <span v-else-if="columnSource(column) === 'template'"> · plantilla</span>
                </q-item-label>
              </q-item-section>
              <!-- C2: las columnas de la plantilla son de solo lectura acá;
                   quien llena edita y quita SOLO las suyas (custom) -->
              <q-item-section v-if="columnSource(column) === 'custom'" side>
                <div class="row items-center no-wrap">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    :disable="!canUpdate"
                    @click="openEditColumn(column)">
                    <q-tooltip>Editar columna</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    :disable="!canUpdate"
                    @click="askRemoveColumn(column.key)">
                    <q-tooltip>Quitar columna</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Agregar / editar columna (la clave la genera el server: C3) -->
    <q-dialog v-model="addColumnDialog" persistent>
      <q-card class="day-dialog">
        <q-toolbar class="q-pa-md">
          <q-icon :name="editingKey ? 'edit' : 'playlist_add'" size="md" />
          <q-toolbar-title>{{ editingKey ? 'Editar columna' : 'Agregar columna' }}</q-toolbar-title>
          <q-btn flat round dense icon="close" @click="addColumnDialog = false" />
        </q-toolbar>
        <q-card-section>
          <q-form @submit="saveColumn">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  v-model="newColumn.label"
                  label="Nombre de la columna"
                  placeholder="Ej.: Horas de viaje, Hogares visitados, Reuniones…"
                  filled
                  dense
                  :rules="rules.required" />
              </div>
              <div class="col-6">
                <q-select
                  v-model="newColumn.kind"
                  label="Tipo"
                  filled
                  dense
                  :options="kindOptions"
                  emit-value
                  map-options />
              </div>
              <div class="col-6 column-total">
                <q-toggle
                  v-model="newColumn.total"
                  label="Marcar como total"
                  :disable="newColumn.kind !== 'number'" />
              </div>
              <div class="col-12 text-caption text-grey">
                Se sumará automáticamente en la fila de totales del mes.
                Aplica solo a columnas numéricas.
              </div>
              <div class="col-12 text-right q-gutter-sm q-mt-sm">
                <q-btn icon="close" label="Cancelar" type="button" @click="addColumnDialog = false" />
                <q-btn icon="check" color="primary" :label="editingKey ? 'Guardar' : 'Agregar'" type="submit" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Confirm } from 'boot/modal'
import { months } from '../../../components/plugins/datetime'
import validation from '../../../components/plugins/validation'
import { useStore } from '../../../store'
import { FormReportDetail } from '../../../components/entities/FormReport'
import {
  DERIVED_KEYS,
  ReportColumn,
  columnSource,
  emptyColumn,
  formLabels,
  kindLabels
} from '../../../components/entities/ReportTemplate'

interface DayRow {
  day: number
  values: Record<string, unknown>
}

const route = useRoute()
const router = useRouter()
const store = useStore()

const reportId = String(route.params.id)

const detail = ref<FormReportDetail>()
const dayDialog = ref(false)
const columnsDialog = ref(false)
const addColumnDialog = ref(false)
/** Clave de la columna que se está editando; null ⇒ el diálogo agrega una. */
const editingKey = ref<string | null>(null)
const selectedDay = ref<number>()
const formValues = ref<Record<string, string | number>>({})
const newColumn = ref<ReportColumn>(emptyColumn())

const rules = {
  required: [validation.required],
  // C4: el campo numérico rechaza negativos aunque se escriban a mano
  nonNegative: [(v: string | number) =>
    v === '' || v === null || v === undefined || Number(v) >= 0 || 'No se permiten valores negativos']
}

const kindOptions = Object.entries(kindLabels).map(([value, label]) => ({ value, label }))

const canUpdate = computed(() =>
  !!store.state.user?.permissions?.includes('form_report:update'))

const title = computed(() => {
  const report = detail.value
  if (!report) {
    return 'Informe'
  }
  const month = months[Number(report.month) - 1] || ''
  const form = formLabels[report.form] || report.form
  return `INFORME ${form.toUpperCase()} — ${month.toUpperCase()} ${report.year}`
})

/** C4: fecha completa del día que se está llenando (cabecera del diálogo). */
const selectedDateLabel = computed(() => {
  const report = detail.value
  const day = selectedDay.value
  if (!report || !day) {
    return ''
  }
  const month = months[Number(report.month) - 1] || ''
  return `${day} de ${month.toLowerCase()} de ${report.year}`
})

const editableColumns = computed(() =>
  (detail.value?.columns || []).filter(column => !isDerived(column)))

const dayRows = computed<DayRow[]>(() => {
  const report = detail.value
  if (!report) {
    return []
  }
  const stored = new Map<number, Record<string, unknown>>()
  for (const day of report.days || []) {
    stored.set(day.day, day.values)
  }
  const rows: DayRow[] = []
  for (let day = 1; day <= report.daysInMonth; day++) {
    rows.push({ day, values: stored.get(day) || {} })
  }
  return rows
})

const totalChips = computed(() => {
  const report = detail.value
  if (!report) {
    return []
  }
  return report.columns
    .filter(column => column.kind === 'number' && column.total)
    .map(column => ({
      key: column.key,
      label: column.label,
      value: report.totals?.[column.key] ?? 0
    }))
})

const isDerived = (column: ReportColumn) => DERIVED_KEYS.includes(column.key)

const kindName = (column: ReportColumn) => kindLabels[column.kind] || column.kind

/**
 * C4 — el valor numérico nunca baja de 0, ni escribiendo ni con los botones.
 * Se conserva el texto crudo si es válido (para poder teclear "1.5"), y un
 * negativo o un texto no numérico se corrige de inmediato.
 */
const setNumber = (key: string, value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value)
  if (text === '') {
    formValues.value[key] = ''
    return
  }
  const numeric = Number(text)
  if (!Number.isFinite(numeric)) {
    formValues.value[key] = ''
    return
  }
  formValues.value[key] = numeric < 0 ? 0 : text
}

const stepNumber = (key: string, delta: number) => {
  const current = Number(formValues.value[key])
  formValues.value[key] = Math.max(0, (Number.isFinite(current) ? current : 0) + delta)
}

const dayChips = (row: DayRow) => {
  const chips: { label: string, value: unknown }[] = []
  for (const column of editableColumns.value) {
    const value = row.values[column.key]
    if (value === undefined || value === null || value === '') {
      continue
    }
    chips.push({ label: column.label, value })
    if (chips.length === 3) {
      break
    }
  }
  return chips
}

const load = async () => {
  detail.value = await http.get(`form-reports/${reportId}`) as FormReportDetail
}

const openDay = (row: DayRow) => {
  selectedDay.value = row.day
  const values: Record<string, string | number> = {}
  for (const column of editableColumns.value) {
    const value = row.values[column.key]
    if (value === undefined || value === null) {
      values[column.key] = ''
    } else if (column.kind === 'number') {
      values[column.key] = Number(value)
    } else {
      values[column.key] = String(value)
    }
  }
  formValues.value = values
  dayDialog.value = true
}

const saveDay = async () => {
  const report = detail.value
  if (!report || !selectedDay.value) {
    return
  }
  const values: Record<string, unknown> = {}
  for (const column of editableColumns.value) {
    const value = formValues.value[column.key]
    if (value === '' || value === null || value === undefined) {
      continue
    }
    values[column.key] = column.kind === 'number' ? Number(value) : String(value)
  }
  // el server valida todo: día, pertenencia de claves, tipos y tamaños
  await http.post(`form-reports/${String(report.id)}/days`, {
    day: selectedDay.value,
    values
  })
  message.success('¡Día guardado!')
  dayDialog.value = false
  await load()
}

const clearDay = async () => {
  const report = detail.value
  if (!report || !selectedDay.value) {
    return
  }
  await http.post(`form-reports/${String(report.id)}/days`, {
    day: selectedDay.value,
    values: {}
  })
  message.success('Día sin datos')
  dayDialog.value = false
  await load()
}

const openAddColumn = () => {
  newColumn.value = emptyColumn()
  editingKey.value = null
  addColumnDialog.value = true
}

const openEditColumn = (column: ReportColumn) => {
  newColumn.value = { ...column }
  editingKey.value = column.key
  addColumnDialog.value = true
}

/**
 * C3: el body solo lleva `label`/`kind`/`total` — la clave la genera el server
 * (al agregar) y la identidad de la columna no cambia (al editar).
 */
const saveColumn = async () => {
  const report = detail.value
  if (!report) {
    return
  }
  const payload = {
    label: newColumn.value.label.trim(),
    kind: newColumn.value.kind,
    total: newColumn.value.kind === 'number' && newColumn.value.total
  }
  const url = `form-reports/${String(report.id)}/columns`

  if (editingKey.value) {
    await http.put(`${url}/${editingKey.value}`, payload)
    message.success('¡Columna actualizada!')
  } else {
    await http.post(url, payload)
    message.success('¡Columna agregada!')
  }
  addColumnDialog.value = false
  editingKey.value = null
  await load()
}

const askRemoveColumn = (key: string) => {
  const report = detail.value
  if (!report) {
    return
  }
  const used = (report.days || []).filter(day =>
    day.values[key] !== undefined && day.values[key] !== null && day.values[key] !== ''
  ).length
  const warning = used > 0 ? `<br><b>Se usan datos en ${used} días</b>` : ''
  Confirm(`¿Está seguro que desea quitar esta columna?${warning}`, async () => {
    await http.delete(`form-reports/${String(report.id)}/columns/${key}`)
    message.success('¡Columna quitada!')
    await load()
  })
}

const goPrint = () => {
  void router.push(`/secretary/form-reports/print/${reportId}`)
}

onMounted(() => {
  void load()
})
</script>

<style lang="scss">
.fill-page {
  padding-bottom: 64px;
}

.fill-toolbar {
  margin-bottom: 12px;
}

.day-list {
  background: rgba(255, 255, 255, 0.6);
}

.fill-totals {
  position: sticky;
  bottom: 0;
  z-index: 5;
  margin-top: 12px;
  overflow-x: auto;
  white-space: nowrap;
  background: $primary;
  color: #fff;
}

.day-dialog {
  min-width: 300px;
  width: 100%;
  max-width: 480px;
}

.column-total {
  display: flex;
  align-items: center;
}

/*
 * B6-4 — ponytail: los botones −/+ son los ÚNICOS controles de estos campos;
 * las flechas nativas del `input[type=number]` además permiten bajar de 0.
 * El bloque `<style>` de este SFC NO está scoped (los dialogs viven en un
 * portal a `body`), así que el alcance lo pone la clase `.cell-number` y no
 * se tocan los inputs numéricos de Tesorería.
 */
.cell-number input[type='number']::-webkit-inner-spin-button,
.cell-number input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cell-number input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
