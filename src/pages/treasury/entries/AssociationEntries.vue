<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
      Ingresos a la asociación por iglesia
    </h2>

    <div class="alert alert-info q-mb-md">
      Registre aquí los ingresos que cada iglesia envía a la asociación (diezmos y ofrendas para la asociación).
      No es necesario que la iglesia haya configurado su caja inicial local; este registro es independiente.
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-xs-12 col-sm-4">
        <q-select
          v-model="year"
          :options="yearOptions"
          label="Gestión"
          emit-value
          map-options
          filled
          @update:model-value="onYearOrMonthChange" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          v-model="month"
          :options="monthOptions"
          label="Mes"
          emit-value
          map-options
          filled
          @update:model-value="onYearOrMonthChange" />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          v-model="selectedChurch"
          :options="churchOptions"
          label="Iglesia"
          emit-value
          map-options
          filled
          option-value="id"
          option-label="name"
          :loading="loadingChurches"
          @update:model-value="onChurchChange" />
      </div>
    </div>

    <template v-if="selectedChurch && currentEntry">
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            Registrar ingreso a la asociación — {{ selectedChurchName }} ({{ monthsLiteral[(month as number) - 1] }} {{ year }})
          </div>
          <q-form class="q-gutter-md" @submit="submitEntry">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-select
                  v-model="form.department"
                  :options="globalDepartments"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  label="Concepto (Asociación)"
                  filled
                  :disable="!globalDepartments.length"
                  :rules="[v => !!v || 'Seleccione el concepto']" />
                <q-banner v-if="globalDepartments.length === 0" class="bg-warning q-mt-xs" rounded>
                  Esta iglesia no tiene conceptos de asociación (GLOBAL) configurados. Configure los departamentos de la iglesia en Secretaría.
                </q-banner>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-2">
                <q-input
                  v-model="form.value"
                  label="Monto"
                  filled
                  :suffix="$store.state.user?.user?.company?.money"
                  :rules="[validation.decimal, validation.required]" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-2">
                <q-select
                  v-model="form.week"
                  :options="weekOptions"
                  label="Semana"
                  emit-value
                  map-options
                  filled />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-2">
                <q-select
                  v-model="form.paymentType"
                  :options="paymentTypeOptions"
                  label="Forma de entrega"
                  emit-value
                  map-options
                  filled />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3">
                <q-input
                  v-model="form.observations"
                  label="Observaciones"
                  filled
                  dense />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-btn
                  type="submit"
                  color="primary"
                  icon="add"
                  label="Agregar ingreso"
                  no-caps
                  :loading="saving" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">
            Ingresos registrados este mes (tipo congregación)
          </div>
          <div v-if="loadingDetails" class="text-center q-pa-lg">Cargando...</div>
          <div v-else-if="!entryDetails.length" class="treasury-empty q-pa-md">
            Sin registros. Agregue un ingreso con el formulario de arriba.
          </div>
          <div v-else class="q-table-simple q-table__container q-table--horizontal-separator column q-table--dense">
            <table class="q-table">
              <thead>
                <tr>
                  <th class="text-left"><strong>Concepto</strong></th>
                  <th class="text-left"><strong>Observaciones</strong></th>
                  <th class="text-center"><strong>Semana</strong></th>
                  <th class="text-right"><strong>Valor</strong></th>
                  <th v-if="currentEntry?.state !== 'CLOSED'" class="text-right"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in entryDetails" :key="item.id">
                  <td>{{ item.department?.name }}</td>
                  <td class="treasury-observation">{{ item.observations || '—' }}</td>
                  <td class="text-center">{{ item.week }}</td>
                  <td class="text-right">{{ item.value }} {{ $store.state.user?.user?.company?.money }}</td>
                  <td v-if="currentEntry?.state !== 'CLOSED'" class="text-right">
                    <q-btn size="sm" icon="delete" round flat @click="removeDetail(item.id)" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th class="text-left" colspan="3"><strong>Total</strong></th>
                  <th class="text-right"><strong>{{ totalDetails.toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</strong></th>
                  <th v-if="currentEntry?.state !== 'CLOSED'"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </q-card-section>
      </q-card>
    </template>

    <div v-else-if="selectedChurch && !currentEntry && !loadingEntry" class="alert alert-warning q-mt-md">
      No hay entradas creadas para esta iglesia en el mes seleccionado. Se crearán al agregar el primer ingreso.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { http } from 'boot/http'
import { Result } from 'src/components/entities/Entity'
import { Entry, EntryDetail } from 'src/components/entities/Entry'
import { Department } from 'src/components/entities/Department'
import { months as monthsLiteral } from 'src/components/plugins/datetime'
import validation from 'src/components/plugins/validation'
import { Confirm } from 'boot/modal'
import { message } from 'boot/message'

const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const selectedChurch = ref<number | null>(null)
const churches = ref<{ id: number; name: string }[]>([])
const loadingChurches = ref(false)
const currentEntry = ref<Entry | null>(null)
const loadingEntry = ref(false)
const globalDepartments = ref<Department[]>([])
const entryDetails = ref<EntryDetail[]>([])
const loadingDetails = ref(false)
const saving = ref(false)

const yearOptions = computed(() => {
  const y = new Date().getFullYear()
  const opts = []
  for (let i = y; i >= 2022; i--) opts.push({ value: i, label: String(i) })
  return opts
})

const monthOptions = computed(() => {
  return monthsLiteral.map((m, i) => ({ value: i + 1, label: m }))
})

const churchOptions = computed(() => churches.value)

const selectedChurchName = computed(() => {
  const c = churches.value.find(ch => ch.id === selectedChurch.value)
  return c?.name ?? ''
})

const weekOptions = [
  { value: 1, label: 'Semana 1' },
  { value: 2, label: 'Semana 2' },
  { value: 3, label: 'Semana 3' },
  { value: 4, label: 'Semana 4' },
  { value: 5, label: 'Semana 5' }
]

const paymentTypeOptions = [
  { label: 'Efectivo', value: 'CASH' },
  { label: 'QR', value: 'QR' },
  { label: 'Depósito', value: 'DEPOSIT' },
  { label: 'Transferencia bancaria', value: 'BANK_TRANSFER' }
]

const form = ref({
  department: null as number | null,
  value: '' as string | number,
  week: 4 as number,
  paymentType: 'CASH' as string,
  observations: '' as string
})

const totalDetails = computed(() => {
  return entryDetails.value.reduce((sum, d) => sum + Number(d.value || 0), 0)
})

async function loadChurches () {
  loadingChurches.value = true
  try {
    const res = await http.get('companies?order=name') as Result<{ id: number; name: string; type?: string }>
    churches.value = (res.rows || []).filter((c: { type?: string }) => c.type === 'CHURCH' || c.type === 'GROUP' || !c.type)
    // churches.value = res.rows || []
    if (churches.value.length === 1 && !selectedChurch.value) {
      selectedChurch.value = churches.value[0].id
    }
  } finally {
    loadingChurches.value = false
  }
}

async function ensureEntriesForChurch (idCompany: number) {
  loadingEntry.value = true
  currentEntry.value = null
  try {
    const byYear = await http.get(`entries/year/${year.value}/${idCompany}`) as Result<Entry>
    const entryForMonth = byYear?.rows?.find((e: Entry) => e.month === month.value)
    currentEntry.value = entryForMonth || null
  } catch (e) {
    currentEntry.value = null
  } finally {
    loadingEntry.value = false
  }
}

async function loadGlobalDepartments (idCompany: number) {
  const res = await http.get(`departments?id_company=${idCompany}&type=GLOBAL&order=id`) as Result<Department>
  globalDepartments.value = res?.rows || []
  if (globalDepartments.value.length && !form.value.department) {
    form.value.department = globalDepartments.value[0].id
  }
}

async function loadEntryDetails () {
  if (!currentEntry.value?.id) {
    entryDetails.value = []
    return
  }
  loadingDetails.value = true
  try {
    const res = await http.get(`entriesdetails?id_entry=${currentEntry.value.id}&type=CHURCH&order=id`) as Result<EntryDetail>
    entryDetails.value = res?.rows || []
  } finally {
    loadingDetails.value = false
  }
}

function onYearOrMonthChange () {
  if (selectedChurch.value) {
    void ensureEntriesForChurch(selectedChurch.value)
    void loadEntryDetails()
  }
}

async function onChurchChange () {
  if (!selectedChurch.value) {
    currentEntry.value = null
    globalDepartments.value = []
    entryDetails.value = []
    return
  }
  await ensureEntriesForChurch(selectedChurch.value)
  await loadGlobalDepartments(selectedChurch.value)
  await loadEntryDetails()
}

async function submitEntry () {
  if (!currentEntry.value?.id || !form.value.department || form.value.value === '' || form.value.value == null) {
    message.warning('Complete concepto y monto.')
    return
  }
  const numValue = Number(form.value.value)
  if (Number.isNaN(numValue) || numValue <= 0) {
    message.warning('Monto debe ser un número mayor a 0.')
    return
  }
  saving.value = true
  try {
    await http.post('entriesdetails', {
      type: 'CHURCH',
      id_entry: currentEntry.value.id,
      id_department: form.value.department,
      value: numValue,
      observations: form.value.observations || undefined,
      week: form.value.week,
      paymentType: form.value.paymentType || 'CASH'
    })
    message.success('Ingreso registrado.')
    form.value.observations = ''
    await loadEntryDetails()
    const churchId = selectedChurch.value
    if (churchId) await ensureEntriesForChurch(churchId)
  } finally {
    saving.value = false
  }
}

function removeDetail (id: number) {
  Confirm('¿Eliminar este registro?', async () => {
    await http.delete(`entriesdetails/${id}`)
    await loadEntryDetails()
  }, null, 'Eliminar', 'Sí', 'No')
}

watch([year, month, selectedChurch], () => {
  if (selectedChurch.value && currentEntry.value) {
    void loadEntryDetails()
  }
})

onMounted(() => {
  void loadChurches()
})
</script>

<style scoped>
.treasury-observation {
  font-size: 0.9em;
  color: #666;
}
.treasury-empty {
  color: #666;
  font-style: italic;
}
</style>
