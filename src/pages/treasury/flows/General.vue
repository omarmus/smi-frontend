<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/reports')" />
        Flujo de caja - <span class="text-warning">Iglesia local</span>
        <!-- <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span> -->
        <span class="subtitle">Total: {{ (total.total || 0 ).toFixed(2) }} {{ $store.state.user?.user.company.money }}</span>
    </h2>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="type"
          :options="types"
          label="Tipo"
          map-options
          emit-value />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="year"
          :options="years"
          label="Gestión"
          :disable="type === 'GENERAL' || type === 'INITIAL'"
          map-options
          emit-value />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="month"
          :options="months"
          label="Mes"
          :disable="type === 'GENERAL' || type === 'YEAR' || type === 'INITIAL'"
          map-options
          emit-value />
      </div>
    </div>
    <div
      v-if="flows.length && (type === 'GENERAL' || type === 'INITIAL')"
      class="row flow-items q-col-gutter-x-lg q-pt-md">
      <h3 class="flow-title col-12">
        Flujo de caja {{ type === 'GENERAL' ? 'General' : 'Inicial' }}
        <q-btn
          v-if="type === 'INITIAL' && initialEditable && isAdmin"
          label="Editar"
          no-caps
          color="warning"
          icon="edit"
          class="q-ml-md"
          @click="isEditingInitial = !isEditingInitial" />
      </h3>
      <div
        class="col-xs-12 col-sm-6"
        v-for="item in flows"
        :key="item.id">
        <div class="row q-pb-xs">
          <div class="col-8">{{ item.department?.name }}</div>
          <div class="col-xs-4 col-sm-4">
            <q-input
              v-if="type === 'INITIAL' && isEditingInitial"
              standout
              class="text-right"
              dense
              placeholder="0"
              :suffix="$store.state.user?.user.company.money"
              v-model="item.total"
              type="number"
              step="0.01" />
            <q-field
              v-else
              standout
              class="text-right"
              dense
              placeholder="0"
              :suffix="$store.state.user?.user.company.money">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{ Number(item.total).toFixed(2) }}</div>
              </template>
            </q-field>
          </div>
        </div>
      </div>
      <div v-if="type === 'INITIAL' && isEditingInitial" class="col-12 text-right q-pt-md">
        <q-btn
          label="Guardar cambios"
          no-caps
          color="primary"
          icon="check"
          @click="updateInitial" />
      </div>
    </div>
    <div
      v-if="type === 'MONTH'"
      class="row flow-navitagor">
      <q-btn
        label="Anterior"
        flat
        icon="chevron_left"
        @click="prevMonth" />
      <strong v-if="month > 0">{{ monthsLiteral[month - 1].toUpperCase() }}</strong>
      <!-- <strong>{{ month?.label?.toUpperCase() }}</strong> -->
      <q-btn
        label="Siguiente"
        flat
        icon-right="chevron_right"
        @click="nextMonth" />
    </div>
    <div
      v-if="flows.length && type === 'MONTH'"
      class="row tithe-column">
      <div class="col-12 q-mb-lg">
        <q-btn
          icon="print"
          no-caps
          label="Imprimir"
          @click="printFlowReport" />
      </div>
    <div
      id="report-flow"
      class="row tithe-column col-12">
      <h3 class="flow-title col-12 q-mb-lg">
        Flujo de caja {{ monthsLiteral[month - 1] }}
        <span
          id="pdf-church-name"
          style="display: none;"> - {{ store.state.user?.user?.company?.name }}</span>
      </h3>
      <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12">
        <table class="q-table treasury-table-data">
          <thead>
            <tr>
              <th class="text-left"><strong>Departamento</strong></th>
              <th class="text-right text-secondary"><strong>Saldo {{ monthsLiteral[monthPrev] }}</strong></th>
              <!-- <th class="text-right"><strong>Ingreso <q-icon name="add_circle_outline" /> </strong></th> -->
              <!-- <th class="text-right"><strong>Diezmo Ingreso <q-icon name="remove_circle_outline" /></strong></th> -->
              <th class="text-right text-positive"><strong>Ingreso {{ monthsLiteral[month - 1] }}<q-icon name="add_circle_outline" /> </strong></th>
              <th class="text-right text-negative"><strong>Gasto {{ monthsLiteral[month - 1] }}<q-icon name="remove_circle_outline" /></strong></th>
              <th class="text-right"><strong>Total {{ monthsLiteral[month - 1] }}</strong></th>
              <th class="text-right text-primary"><strong>Total Caja local</strong></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in flows"
              :key="item.id">
              <td class="text-left">
                <span class="flow-head-table">{{ item.name }}</span>
              </td>
              <td class="text-right text-secondary">
                <div class="flow-row-table">
                  <span class="text-hidden">Saldo {{ monthsLiteral[monthPrev] }}:</span> {{ Number(item.previous).toFixed(2) }}
                </div>
              </td>
              <!-- <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso <q-icon name="add_circle_outline" /> :</span> {{ Number(item.entry).toFixed(2) }}
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Diezmo Ingreso <q-icon name="remove_circle_outline" />:</span> {{ Number(item.tithe).toFixed(2) }}
                </div>
              </td> -->
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso {{ monthsLiteral[month - 1] }}<q-icon name="add_circle_outline" /> :</span> {{ Number(item.entryTotal).toFixed(2) }}
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Gasto {{ monthsLiteral[month - 1] }}<q-icon name="remove_circle_outline" />:</span> {{ Number(item.expense).toFixed(2) }}
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Total {{ monthsLiteral[month - 1] }}:</span> {{ Number(item.subtotal).toFixed(2)}}
                </div>
              </td>
              <td class="text-right text-primary">
                <div class="flow-row-table">
                  <span class="text-hidden">Total:</span> <strong>{{ Number(item.total).toFixed(2) }}</strong>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="text-left">
                <span class="flow-head-table"><strong>TOTAL</strong></span>
              </td>
              <td class="text-right text-secondary">
                <div class="flow-row-table">
                  <span class="text-hidden">Saldo {{ monthsLiteral[monthPrev] }}:</span> <strong>{{ Number(total.previous).toFixed(2) }}</strong>
                </div>
              </td>
              <!-- <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso <q-icon name="add_circle_outline" /> :</span> <strong>{{ Number(total.entry).toFixed(2) }}</strong>
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Diezmo Ingreso <q-icon name="remove_circle_outline" />:</span> <strong>{{ Number(total.tithe).toFixed(2) }}</strong>
                </div>
              </td> -->
              <td class="text-right text-positive">
                <div class="flow-row-table">
                  <span class="text-hidden">Ingreso <q-icon name="add_circle_outline" /> :</span> <strong>{{ Number(total.entryTotal).toFixed(2) }}</strong>
                </div>
              </td>
              <td class="text-right text-negative">
                <div class="flow-row-table">
                  <span class="text-hidden">Gasto <q-icon name="remove_circle_outline" />:</span> <strong>{{ Number(total.expense).toFixed(2) }}</strong>
                </div>
              </td>
              <td class="text-right">
                <div class="flow-row-table">
                  <span class="text-hidden">Sub total:</span> <strong>{{ Number(total.subtotal).toFixed(2) }}</strong>
                </div>
              </td>
              <td class="text-right text-primary">
                <div class="flow-row-table">
                  <span class="text-hidden">Total {{ monthsLiteral[month - 1] }}:</span> <strong>{{ Number(total.total).toFixed(2) }}</strong>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    </div>
    <div v-else-if="flows.length === 0 && type === 'MONTH'" class="q-pa-sm text-primary">No existe datos para el mes de <strong>{{ monthsLiteral[month - 1] }}</strong>.</div>

    <div v-if="isAssociationAdmin && type === 'INITIAL'" class="q-mt-xl">
      <q-card flat bordered class="danger-zone">
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <q-icon name="warning" size="28px" color="negative" />
            <div class="text-h6 text-negative">Zona peligrosa</div>
          </div>
          <div class="q-mt-sm text-body2 text-grey-8">
            Esta acción elimina de forma <strong>permanente e irreversible</strong> todos los datos
            de tesorería de la/el <strong>{{ companyName }}</strong>: entradas, detalles de entrada, gastos, detalles de gasto
            y balances (incluido el balance inicial). Tras la purga, la iglesia volverá al estado
            de "sin inicializar" y deberá cargar nuevamente el saldo acumulado de cada departamento.
          </div>
          <div class="q-mt-md text-caption text-grey-7">
            Solo el <strong>administrador de la asociación</strong> puede ejecutar esta acción.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Eliminar todos los datos de tesorería"
            no-caps
            color="negative"
            icon="delete_forever"
            padding="10px 20px"
            @click="openPurgeDialog" />
        </q-card-actions>
      </q-card>
    </div>

    <q-dialog v-model="showPurgeDialog" persistent>
      <q-card style="min-width: 480px; max-width: 600px;">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="warning" size="32px" class="q-mr-sm" />
          <div class="text-h6">Confirmar purga de tesorería</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <p class="q-mb-sm">
            Vas a eliminar <strong>de forma permanente</strong>:
          </p>
          <ul class="q-pl-md">
            <li>Todas las <strong>entradas</strong> (semanas de culto) y sus <strong>detalles</strong></li>
            <li>Todos los <strong>gastos</strong> del año y sus <strong>detalles</strong></li>
            <li>Todos los <strong>balances</strong>, incluido el <strong>balance inicial</strong></li>
          </ul>
          <q-banner dense class="bg-red-1 text-red-10 q-mt-sm q-mb-md">
            <template #avatar>
              <q-icon name="error" color="negative" />
            </template>
            <strong>Esta acción es irreversible.</strong> No hay respaldo automático. Deberás
            volver a inicializar la caja local cargando el saldo de cada departamento.
          </q-banner>
          <p class="q-mb-xs">
            Para confirmar, escribe exactamente el nombre de la iglesia
            <strong class="text-uppercase">{{ companyName }}</strong> en el campo de abajo:
          </p>
          <q-input
            v-model="purgeConfirmText"
            dense
            filled
            :placeholder="companyName"
            autofocus
            class="q-mt-sm"
            :rules="[v => (v || '').trim().toUpperCase() === companyName.toUpperCase() || 'El texto no coincide con el nombre de la iglesia']"
            lazy-rules />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Cancelar"
            no-caps
            flat
            color="secondary"
            padding="8px 20px"
            v-close-popup />
          <q-btn
            label="Sí, eliminar todo"
            no-caps
            color="negative"
            icon="delete_forever"
            padding="8px 20px"
            :disable="!isPurgeConfirmed"
            :loading="purging"
            @click="confirmPurge" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { storage } from 'boot/storage'
import { Result } from '../../../components/entities/Entity'
import { RoleSlug } from '../../../components/entities/Permission'
import { months as monthsLiteral, getYears } from '../../../components/plugins/datetime'
import { Flow } from '../../../components/entities/Flow'
import { Entry } from '../../../components/entities/Entry'
import { useStore } from '../../../store'
import html2pdf from 'html2pdf.js'

const store = useStore()
const router = useRouter()

const idCompany = store.state.user?.user?.company.id as number

const initialEditable = ref(false)
const isEditingInitial = ref(false)

const isAdmin = computed(() =>
  [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION, RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug)
)

const getCurrentFlow = async () => {
  const url = `entries?id_company=${idCompany}&state=ACTIVE`
  const items = await http.get(url) as Result<Entry>
  if (items.count > 0) {
    month.value = items.rows[0].month === 1 ? 12 : items.rows[0].month - 1
    year.value = items.rows[0].month === 1 ? (items.rows[0].year - 1) : items.rows[0].year
  }
}

const getInitialEditable = async () => {
  if (type.value === 'INITIAL') {
    const result = await http.get('flows/initial-editable') as { code: number, data?: { editable: boolean, reason?: string }, editable?: boolean }
    // Backend returns { code, data: { editable } } or flat { editable }
    initialEditable.value = result.data?.editable ?? result.editable ?? false
  }
}

const year = ref<number>(0)
const type = ref<string>('MONTH')
const month = ref<number>(0)

const months = monthsLiteral.map((item, index) => ({ value: index + 1, label: item }))
const years = getYears()

const types = [
  { value: 'GENERAL', label: 'GENERAL' },
  // { value: 'YEAR', label: 'POR GESTION' },
  { value: 'MONTH', label: 'MENSUAL' },
  { value: 'INITIAL', label: 'INICIAL' }
]

const flows = ref<[Flow]>([])

const updateInitial = async () => {
  const departments = flows.value.map((item: Flow) => ({
    id: item.department.id,
    total: item.total
  }))
  await http.put('flows/initial', {
    id_company: idCompany,
    departments
  })
  message.success('Balance inicial actualizado correctamente')
}

const getFlows = async () => {
  if (type.value === 'GENERAL') {
    const url = `expenses/report/${type.value as string}?id_company=${idCompany}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  } else if (type.value === 'MONTH') {
    const url = `expenses/report/${type.value as string}?id_company=${idCompany}&year=${year.value as string}&month=${month.value as string}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  } else {
    const url = `flows?id_company=${idCompany}&type=${type.value}`
    const items = await http.get(url) as Result<Flow>
    flows.value = items.rows
  }
  await getInitialEditable()
}

const nextMonth = () => {
  let yearNext = year.value
  let monthNext = month.value + 1
  if (monthNext > 12) {
    yearNext++
    monthNext = 1
  }
  month.value = monthNext
  year.value = yearNext
}

const prevMonth = () => {
  let yearPrev = year.value
  let monthPrev = month.value - 1
  if (monthPrev === 0) {
    yearPrev--
    monthPrev = 12
  }
  month.value = monthPrev
  year.value = yearPrev
}

const total = computed(() => {
  const total = {
    previous: 0,
    entry: 0,
    tithe: 0,
    entryTotal: 0,
    expense: 0,
    subtotal: 0,
    total: 0
  }
  flows.value.forEach(item => {
    total.previous += item.previous ? Number(item.previous) : 0
    total.entry += item.entry ? Number(item.entry) : 0
    total.tithe += item.tithe ? Number(item.tithe) : 0
    total.entryTotal += item.entryTotal ? Number(item.entryTotal) : 0
    total.expense += item.expense ? Number(item.expense) : 0
    total.subtotal += item.subtotal ? Number(item.subtotal) : 0
    total.total += item.total ? Number(item.total) : 0
  })
  return total
})

const monthPrev = computed(() => {
  if (month.value - 2 < 0) {
    return 11
  }
  return month.value - 2
})

const printFlowReport = async () => {
  const element = document.getElementById('report-flow')
  if (!element) {
    return
  }

  // Show church name only for PDF
  const pdfChurchName = document.getElementById('pdf-church-name')
  const originalChurchDisplay = pdfChurchName?.style.display
  if (pdfChurchName) {
    pdfChurchName.style.display = 'inline'
  }

  await new Promise(resolve => setTimeout(resolve, 100))

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `flujo-caja-${store.state.user?.user?.company?.name || 'iglesia'}-${monthsLiteral[month.value - 1]}-${year.value}-${Date.now()}.pdf`,
    image: { type: 'png' as const },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'letter' as const,
      orientation: 'landscape' as const
    }
  }

  try {
    await html2pdf().set(opt).from(element).save()
  } finally {
    // Hide church name again
    if (pdfChurchName) {
      pdfChurchName.style.display = originalChurchDisplay ?? 'none'
    }
  }
}

watch(type, async () => (await getFlows()))
watch(year, async () => (await getFlows()))
watch(month, async () => (await getFlows()))

// ─── Purga de datos de tesorería (solo ADMINISTRATOR_ASSOCIATION) ────────────

const companyName = computed(() => store.state.user?.user?.company?.name || '')

const isAssociationAdmin = computed(() =>
  store?.state?.user?.role?.slug === RoleSlug.ADMINISTRATOR_ASSOCIATION
)

const showPurgeDialog = ref(false)
const purgeConfirmText = ref('')
const purging = ref(false)

const isPurgeConfirmed = computed(() =>
  (purgeConfirmText.value || '').trim().toUpperCase() === companyName.value.trim().toUpperCase()
)

const openPurgeDialog = () => {
  purgeConfirmText.value = ''
  showPurgeDialog.value = true
}

const confirmPurge = async () => {
  if (!isPurgeConfirmed.value) return
  purging.value = true
  try {
    // ponytail: http wrapper ya filtra errores y resuelve con response.data.data
    // (el backend usa code=1 para éxito, no 200, y nunca llega al componente)
    const result = await http.post('flows/purge', {}) as { purged: boolean, counts?: Record<string, number> }
    if (result.purged) {
      const counts = result.counts || {}
      message.success(
        `Datos purgados. Eliminados: ${counts.entries || 0} entradas, ${counts.entryDetails || 0} detalles de entrada, ${counts.transactions || 0} transacciones bancarias, ${counts.expenses || 0} gastos, ${counts.expenseDetails || 0} detalles de gasto, ${counts.balances || 0} balances.`
      )
      showPurgeDialog.value = false
      // Marcar como no inicializada para que Treasury.vue redirija al formulario
      storage.set('initial', true)
      store.commit('global/setInitial', true)
      return router.push('/treasury/flows/initial')
    }
    message.error('No se pudo purgar los datos de tesorería')
  } catch (err) {
    const errorMessage = typeof err === 'object' && err !== null && 'message' in err ? String(err.message) : 'Error al purgar los datos de tesorería'
    message.error(errorMessage)
  } finally {
    purging.value = false
  }
}

onBeforeMount(async () => {
  await getCurrentFlow()
})
</script>

<style lang="scss">
.flow-navitagor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}

.danger-zone {
  border-left: 4px solid #c10015;
  background-color: #fff8f8;
}
</style>
