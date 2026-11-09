<template>
  <div class="container dashboard">
    <header class="dashboard__header">
      <div class="dashboard__heading">
        <h1 class="dashboard__title">{{ title }}</h1>
        <p class="dashboard__subtitle">{{ subtitle }}</p>
      </div>
      <q-btn
        flat
        dense
        round
        icon="refresh"
        color="primary"
        aria-label="Actualizar los datos"
        :loading="loading"
        @click="load" />
    </header>

    <!-- Accesos de sección: lo primero que el usuario necesita -->
    <div class="row q-col-gutter-md q-mb-md" role="group" aria-label="Secciones del sistema">
      <div
        v-if="canSecretary"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="edit_note"
          label="Secretaría"
          no-caps
          class="full-width btn-block"
          @click="$router.push('/secretary')" />
      </div>
      <div
        v-if="canTreasury"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="paid"
          label="Tesorería"
          no-caps
          class="full-width btn-block"
          @click="goTreasury" />
      </div>
    </div>

    <q-banner v-if="error" dense class="dashboard__error q-mb-md">
      <template v-slot:avatar>
        <q-icon name="error_outline" color="negative" />
      </template>
      {{ error }}
      <template v-slot:action>
        <q-btn flat dense color="negative" label="Reintentar" no-caps @click="load" />
      </template>
    </q-banner>

    <!-- Esqueleto de carga -->
    <div v-if="loading && !data" class="row q-col-gutter-md q-mb-md">
      <div class="col-xs-12 col-md-7">
        <q-skeleton type="rect" height="190px" square />
      </div>
      <div class="col-xs-12 col-md-5">
        <q-skeleton type="rect" height="190px" square />
      </div>
    </div>

    <template v-else-if="data">
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Mes en curso -->
        <div class="col-xs-12 col-md-7">
          <q-card flat bordered class="dashboard__card">
            <q-card-section class="q-pa-md">
              <div class="dashboard__card-head">
                <h2 class="dashboard__card-title">{{ currentTitle }}</h2>
                <span class="dashboard__card-note">{{ currentLabel }}</span>
              </div>

              <table class="dashboard__rows">
                <caption class="dashboard__visually-hidden">
                  Ingresos, gastos y resultado del mes en curso
                </caption>
                <tbody>
                  <tr>
                    <th scope="row">Ingresos</th>
                    <td>{{ format(current?.income || 0) }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gastos</th>
                    <td>{{ format(current?.expense || 0) }}</td>
                  </tr>
                  <tr class="dashboard__rows-total">
                    <th scope="row">Resultado</th>
                    <td :class="netClass(current?.net || 0)">
                      <q-icon
                        v-if="(current?.net || 0) !== 0"
                        :name="(current?.net || 0) > 0 ? 'arrow_upward' : 'arrow_downward'"
                        size="13px" />
                      {{ format(current?.net || 0) }}
                    </td>
                  </tr>
                  <tr v-if="previous">
                    <th scope="row">
                      Resultado de {{ previous.label }}
                      <span v-if="hasDelta" class="dashboard__row-note">({{ deltaLabel }})</span>
                    </th>
                    <td :class="netClass(previous.net)">{{ format(previous.net) }}</td>
                  </tr>
                </tbody>
              </table>

              <p v-if="!hasCurrentMovement" class="dashboard__empty">
                Todavía no hay movimientos en {{ currentLabel }}.
                <span v-if="canTreasury">Registrá ingresos y gastos para ver el balance.</span>
              </p>
            </q-card-section>
          </q-card>
        </div>

        <!-- Acumulado y contexto de la iglesia / del alcance -->
        <div class="col-xs-12 col-md-5">
          <q-card flat bordered class="dashboard__card">
            <q-card-section class="q-pa-md">
              <div class="dashboard__card-head">
                <h2 class="dashboard__card-title">Acumulado</h2>
                <span class="dashboard__card-note">Histórico registrado</span>
              </div>

              <table class="dashboard__rows">
                <caption class="dashboard__visually-hidden">
                  Saldo acumulado de ingresos y gastos
                </caption>
                <tbody>
                  <tr>
                    <th scope="row">Ingresos</th>
                    <td>{{ format(data.balance.income) }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Gastos</th>
                    <td>{{ format(data.balance.expense) }}</td>
                  </tr>
                  <tr class="dashboard__rows-total">
                    <th scope="row">Saldo</th>
                    <td :class="netClass(data.balance.net)">
                      <q-icon
                        v-if="data.balance.net !== 0"
                        :name="data.balance.net > 0 ? 'arrow_upward' : 'arrow_downward'"
                        size="13px" />
                      {{ format(data.balance.net) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table class="dashboard__rows dashboard__rows--facts">
                <caption class="dashboard__visually-hidden">
                  Miembros, departamentos con movimiento e informes pendientes
                </caption>
                <tbody>
                  <tr>
                    <th scope="row">Miembros</th>
                    <td>
                      {{ data.cards.members.baptized }}
                      <span class="dashboard__row-note">
                        de {{ data.cards.members.total }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Departamentos con movimiento</th>
                    <td>{{ data.cards.departments }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Informes pendientes</th>
                    <td>{{ data.cards.pendingReports }}</td>
                  </tr>
                </tbody>
              </table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Serie mensual -->
      <q-card flat bordered class="dashboard__card q-mb-md">
        <q-card-section>
          <div class="dashboard__card-head">
            <h2 class="dashboard__card-title">Ingresos y gastos por mes</h2>
            <span class="dashboard__card-note">Meses cerrados</span>
          </div>
          <MonthlyChart :series="data.series" :format="format" />
        </q-card-section>
      </q-card>

      <!-- Detalle por iglesia: sólo para quien administra varias iglesias -->
      <q-card v-if="data.scope.multiCompany" flat bordered class="dashboard__card q-mb-md">
        <q-card-section>
          <div class="dashboard__card-head">
            <h2 class="dashboard__card-title">{{ data.scope.label }}</h2>
            <span class="dashboard__card-note">
              {{ data.companies.length }} iglesias ·
              {{ data.cards.pendingChurches }} con el mes abierto sin datos ·
              {{ data.cards.noOpenMonth }} sin mes abierto
            </span>
          </div>

          <q-table
            v-if="data.companies.length"
            flat
            dense
            :rows="data.companies"
            :columns="columns"
            row-key="id"
            :filter="filter"
            filter-placeholder="Buscar iglesia"
            :pagination="{ rowsPerPage: 50, rowsPerPageOptions: [25, 50, 100] }">
            <template #body-cell-church="props">
              <q-td :props="props">
                <div class="dashboard__church">{{ props.row.name }}</div>
                <div v-if="props.row.acronym" class="dashboard__church-acronym">
                  {{ props.row.acronym }}
                </div>
              </q-td>
            </template>
            <template #body-cell-net="props">
              <q-td :props="props">
                <span :class="netClass(props.row.net)">{{ format(props.row.net) }}</span>
              </q-td>
            </template>
            <template #body-cell-openMonthLabel="props">
              <q-td :props="props">
                <span v-if="props.row.openMonthLabel">{{ props.row.openMonthLabel }}</span>
                <span v-else class="dashboard__muted">—</span>
              </q-td>
            </template>
            <template #body-cell-state="props">
              <q-td :props="props">
                <span
                  v-if="props.row.status === 'MOVED'"
                  class="dashboard__state dashboard__state--ok">
                  Con movimientos
                </span>
                <span
                  v-else-if="props.row.status === 'OPEN_EMPTY'"
                  class="dashboard__state dashboard__state--pending">
                  Mes abierto sin datos
                </span>
                <span v-else class="dashboard__state dashboard__state--none">
                  Sin mes abierto
                </span>
              </q-td>
            </template>
            <template #bottom>
              <tr class="dashboard__rows-total">
                <td>Total</td>
                <td />
                <td />
                <td>{{ format(totals.income) }}</td>
                <td>{{ format(totals.expense) }}</td>
                <td :class="netClass(totals.net)">{{ format(totals.net) }}</td>
                <td />
              </tr>
            </template>
          </q-table>

          <p v-else class="dashboard__empty">No hay iglesias en el alcance.</p>
        </q-card-section>
      </q-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storage } from 'boot/storage'
import { http } from 'boot/http'
import { useStore } from '../store'
import { Dashboard } from '../components/entities/Dashboard'
import { RoleSlug } from '../components/entities/Permission'
import MonthlyChart from '../components/dashboard/MonthlyChart.vue'

const store = useStore()
const router = useRouter()

const data = ref<Dashboard>()
const loading = ref(false)
const error = ref('')
const filter = ref('')

const roleSlug = computed(() => store.state.user?.role?.slug as RoleSlug | undefined)
const canSecretary = computed(() => roleSlug.value !== RoleSlug.TREASURER)
const canTreasury = computed(() => roleSlug.value !== RoleSlug.SECRETARY)
const churchName = computed(() => data.value?.church?.name || store.state.user?.user?.company?.name || '')
const roleName = computed(() => store.state.user?.role?.name || '')

const title = computed(() => {
  const period = data.value?.period.current
  return period ? `Resumen de ${period.label}` : 'Resumen'
})

const subtitle = computed(() => {
  const parts: string[] = []
  if (data.value?.scope.multiCompany) {
    parts.push(data.value.scope.label)
  } else if (churchName.value) {
    parts.push(churchName.value)
  }
  if (roleName.value) {
    parts.push(roleName.value)
  }
  return parts.join(' · ')
})

const current = computed(() => data.value?.period.current || null)
const previous = computed(() => data.value?.period.previous || null)
const currentLabel = computed(() => current.value?.label || 'sin mes abierto')

// El alcance de una iglesia mira su mes abierto (aunque esté vacío: hay que
// llenarlo); el de varias Churches mira el último mes con cifras reales.
const currentTitle = computed(() =>
  data.value?.scope.multiCompany ? 'Último mes con movimientos' : 'Mes en curso'
)

const hasCurrentMovement = computed(() => {
  const item = current.value
  return !!item && (item.income > 0 || item.expense > 0)
})

const deltaLabel = computed(() => {
  const now = current.value?.net ?? 0
  const before = previous.value?.net ?? 0
  if (!before) {
    return ''
  }
  const delta = ((now - before) / Math.abs(before)) * 100
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toFixed(1)}%`
})

const money = computed(() => store.state.user?.user?.company?.money || 'BOB')

const format = (value: number) => {
  const number = Number(value) || 0
  try {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: money.value,
      maximumFractionDigits: 2
    }).format(number)
  } catch (e) {
    return `${number.toFixed(2)} ${money.value}`
  }
}

/** El signo se marca con color Y con flecha: el color solo no se distingue. */
const netClass = (value: number) => (value < 0 ? 'dashboard__negative' : 'dashboard__positive')

const totals = computed(() => {
  const rows = data.value?.companies || []
  const income = rows.reduce((total, row) => total + row.income, 0)
  const expense = rows.reduce((total, row) => total + row.expense, 0)
  return { income, expense, net: income - expense }
})

// Los montos de todas las iglesias son del MISMO período de referencia:
// así las cifras son comparables entre iglesias y el total cierra.
const referenceLabel = computed(() => data.value?.period.current?.label || '')

const columns = computed(() => [
  { name: 'church', label: 'Iglesia', field: 'name', align: 'left' as const, sortable: true },
  { name: 'lastClosedLabel', label: 'Último mes cerrado', field: 'lastClosedLabel', align: 'left' as const, sortable: true },
  { name: 'openMonthLabel', label: 'Mes abierto', field: 'openMonthLabel', align: 'left' as const, sortable: true },
  { name: 'income', label: referenceLabel.value ? `Ingresos (${referenceLabel.value})` : 'Ingresos', field: 'income', align: 'right' as const, sortable: true },
  { name: 'expense', label: referenceLabel.value ? `Gastos (${referenceLabel.value})` : 'Gastos', field: 'expense', align: 'right' as const, sortable: true },
  { name: 'net', label: 'Resultado', field: 'net', align: 'right' as const, sortable: true },
  { name: 'state', label: 'Estado del mes', field: 'status', align: 'left' as const }
])

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    data.value = await http.get('dashboard') as Dashboard
  } catch (e) {
    error.value = 'No se pudieron cargar los datos. Revisá la conexión e intentá de nuevo.'
  } finally {
    loading.value = false
  }
}

const goTreasury = () => {
  const initial = storage.get('initial')
  return router.push(initial ? '/treasury/flows/initial' : '/treasury')
}

// El alcance del dashboard depende del ROL y de la IGLESIA activos: al
// cambiarlos en el menú lateral hay que volver a pedir los datos (el token
// cambia, pero la vista "/" no se vuelve a montar).
watch(
  () => [store.state.user?.role?.id, store.state.user?.user?.company?.id],
  () => load()
)

onMounted(load)
</script>

<style lang="scss" scoped>
.dashboard {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.3rem;
    font-weight: bold;
    line-height: 1.3rem;
    color: $secondary;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.85rem;
    color: $texto-claro;
    margin: 4px 0 0;
  }

  &__card {
    height: 100%;
  }

  &__card-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  &__card-title {
    font-size: 1rem;
    font-weight: bold;
    color: $secondary;
    margin: 0;
    line-height: 1.3rem;
  }

  &__card-note {
    font-size: 0.8rem;
    color: $texto-claro;
  }

  // Tabla de montos: los importes alineados a la derecha como en los informes.
  &__rows {
    width: 100%;
    border-collapse: collapse;

    th {
      font-weight: normal;
      font-size: 0.84rem;
      color: $texto-claro;
      text-align: left;
      padding: 4px 0;
    }

    td {
      font-size: 0.95rem;
      text-align: right;
      padding: 4px 0;
      font-variant-numeric: tabular-nums;
      color: $secondary;
      white-space: nowrap;
    }
  }

  &__rows-total {
    th,
    td {
      border-top: 1px solid $border;
      font-weight: bold;
      padding-top: 7px;
    }
  }

  // Segunda tabla de la tarjeta: los datos de contexto, separados por una
  // línea para que se lean como un bloque aparte sin gastar otra tarjeta.
  &__rows--facts {
    margin-top: 10px;
    padding-top: 6px;
    border-top: 1px solid $border;

    th,
    td {
      font-size: 0.84rem;
      padding: 3px 0;
    }

    td {
      font-size: 0.9rem;
    }
  }

  &__row-note {
    color: $texto-claro;
    font-size: 0.78rem;
  }

  &__positive {
    color: $positive-oscuro;
  }

  &__negative {
    color: $negative-oscuro;
  }

  &__empty {
    font-size: 0.82rem;
    color: $texto-claro;
    margin: 10px 0 0;
    padding-top: 8px;
    border-top: 1px solid $border;
  }

  &__facts {
    margin: 14px 0 0;
    padding-top: 12px;
    border-top: 1px solid $border;
  }

  &__fact {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 5px 0;

    dt {
      font-size: 0.88rem;
      font-weight: normal;
      color: $texto-claro;
    }

    dd {
      margin: 0;
      font-size: 0.95rem;
      color: $secondary;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
  }

  &__fact-note {
    color: $texto-claro;
    font-size: 0.8rem;
  }

  &__church {
    font-size: 0.92rem;
    color: $secondary;
  }

  &__church-acronym {
    font-size: 0.75rem;
    color: $texto-claro;
  }

  &__state {
    font-size: 0.78rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;

    &--ok {
      color: $positive-oscuro;
      background: rgba(11, 122, 94, 0.1);
    }

    &--pending {
      // Texto en negro corporativo sobre el tinte del amarillo de marca.
      color: $negro-corporativo;
      background: rgba(178, 166, 117, 0.3);
    }

    &--none {
      color: $texto-claro;
      background: rgba(99, 100, 122, 0.12);
    }
  }

  &__muted {
    color: $texto-claro;
  }

  &__error {
    background: #FBECEB;
    color: $negative-oscuro;
    border: 1px solid rgba(168, 50, 47, 0.25);
    border-radius: 4px;
  }

  &__visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

// Modo oscuro: el negro corporativo y los tintes claros no se leen sobre
// el fondo azul-negro.
body.body--dark {
  .dashboard__title,
  .dashboard__card-title,
  .dashboard__church,
  .dashboard__rows td {
    color: $dark-texto;
  }

  .dashboard__subtitle,
  .dashboard__card-note,
  .dashboard__rows th,
  .dashboard__row-note,
  .dashboard__muted,
  .dashboard__empty,
  .dashboard__church-acronym {
    color: $dark-texto-suave;
  }

  .dashboard__rows-total th,
  .dashboard__rows-total td {
    border-top-color: $dark-borde;
  }

  .dashboard__rows--facts {
    border-top-color: $dark-borde;
  }

  .dashboard__positive {
    color: #35C79A;
  }

  .dashboard__negative {
    color: #E8837E;
  }

  .dashboard__state--ok {
    color: #35C79A;
    background: rgba(53, 199, 154, 0.16);
  }

  .dashboard__state--pending {
    color: #E0C58F;
    background: rgba(224, 197, 143, 0.16);
  }

  .dashboard__state--none {
    color: $dark-texto-suave;
    background: rgba(255, 255, 255, 0.08);
  }

  .dashboard__error {
    background: #33191B;
    color: #E79A96;
    border-color: rgba(231, 154, 150, 0.3);
  }
}
</style>
