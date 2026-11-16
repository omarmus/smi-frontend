<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/reports')" />
        Informe trimestral
    </h2>
    <template v-if="render">
      <q-tabs
        v-model="tab"
        class="bg-primary text-white"
        indicator-color="warning"
        align="justify"
        dense>
        <q-tab name="automatic" icon="schedule" label="Informes trimestrales" />
        <q-tab name="custom" icon="tune" label="Informes personalizados" />
      </q-tabs>
      <q-separator />

      <q-tab-panels
        v-model="tab"
        class="bg-transparent"
        animated
        transition-prev="jump-up"
        transition-next="jump-up">
        <q-tab-panel name="automatic" class="bg-transparent">
          <div class="alert alert-info" v-if="standardReports.length === 0">
            Los informes trimestrales se generan solos cuando los 3 meses del trimestre ya tienen datos.
            También podés generar el primero a mano.
          </div>
          <div class="row q-col-gutter-sm" v-if="standardReports.length === 0">
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="year"
                :options="years"
                label="Gestión"
                map-options
                dense
                emit-value />
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="month"
                :options="months"
                label="Mes"
                map-options
                dense
                emit-value />
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="quarter"
                :options="quarters"
                label="Trimestre"
                map-options
                dense
                emit-value />
            </div>
            <div class="text-right q-mt-xs col-xs-12">
              <q-btn
                icon="check"
                no-caps
                color="primary"
                @click="generateFirstReport"
                :disable="loading"
              >
                Generar primer informe
              </q-btn>
            </div>
          </div>
          <div class="row treasury-row" v-if="standardReports.length > 0">
            <div class="text-right q-mb-md col-xs-12">
              <q-btn
                icon="check"
                no-caps
                color="primary"
                @click="generateNextReport"
                :disable="loading"
              >
                Generar siguiente informe
              </q-btn>
            </div>
            <div
              class="col-xs-6 col-sm-3 q-pa-sm"
              v-for="item in standardReports"
              :key="item.id">
              <q-btn
                flat
                color="secondary"
                padding="lg"
                no-caps
                @click="$router.push(`/treasury/report/quarter/${item.id}`)"
                class="full-width btn-block">
                {{ quarterLabel(item) }}
                <span class="btn-block-detail">
                  <span class="text-warning">
                    {{ monthNames(item) }}
                  </span>
                </span>
                <span class="btn-block-detail">
                  <strong class="text-primary">{{ item.month > 11 ? item.year + 1 : item.year }}</strong>
                  <q-badge
                    class="q-ml-sm"
                    :color="originColor(item)"
                    :label="originLabel(item)" />
                </span>
                <q-icon name="width_normal" />
              </q-btn>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="custom" class="bg-transparent">
          <div class="alert alert-info">
            Elegí el mes y la gestión del informe, y cuántos meses entran (3 por defecto).
            Con 3 meses, el mes inicial tiene que ser diciembre, marzo, junio o septiembre.
            Si a algún mes le faltan datos, no se genera.
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="customYear"
                :options="years"
                label="Gestión"
                map-options
                dense
                emit-value />
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="customMonth"
                :options="customMonthOptions"
                label="Mes"
                map-options
                dense
                emit-value />
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-select
                filled
                v-model="customMonths"
                :options="monthCountOptions"
                label="Meses del informe"
                map-options
                dense
                emit-value />
            </div>
            <div class="text-right q-mt-xs col-xs-12">
              <q-btn
                icon="check"
                no-caps
                color="primary"
                @click="generateCustomReport"
                :disable="loading"
              >
                Generar informe personalizado
              </q-btn>
            </div>
          </div>
          <div class="row treasury-row" v-if="customReports.length > 0">
            <div
              class="col-xs-6 col-sm-3 q-pa-sm"
              v-for="item in customReports"
              :key="item.id">
              <q-btn
                flat
                color="secondary"
                padding="lg"
                no-caps
                @click="$router.push(`/treasury/report/quarter/${item.id}`)"
                class="full-width btn-block">
                Informe personalizado
                <span class="btn-block-detail">
                  <span class="text-warning">
                    {{ monthNames(item) }}
                  </span>
                </span>
                <span class="btn-block-detail">
                  <strong class="text-primary">{{ customPeriod(item) }}</strong>
                  <q-badge class="q-ml-sm" color="primary" label="Personalizado" />
                </span>
                <q-icon name="width_normal" />
              </q-btn>
            </div>
          </div>
          <div class="alert alert-info" v-if="customReports.length === 0">
            Todavía no hay informes personalizados.
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { http } from 'boot/http'
import { months as monthsLiteral, monthsShort, getYears } from '../../../components/plugins/datetime'
import { useRouter } from 'vue-router'
import { Report, ReportResponse, ReportQuarter } from '../../../components/entities/Report'
import { Confirm } from 'boot/modal'

const quarters = [
  { value: 1, label: '1er. trimestre' },
  { value: 2, label: '2do. trimestre' },
  { value: 3, label: '3er. trimestre' },
  { value: 4, label: '4to. trimestre' }
]

const monthCountOptions = [
  { value: 1, label: '1 mes' },
  { value: 2, label: '2 meses' },
  { value: 3, label: '3 meses' }
]

const router = useRouter()

const report = ref<Report>()
const reports = ref<ReportResponse>()
const tab = ref<string>('automatic')
const year = ref<number>(new Date().getFullYear())
const month = ref<number>(1)
const quarter = ref<number>(1)
const customYear = ref<number>(new Date().getFullYear())
const customMonth = ref<number>(new Date().getMonth() + 1)
const customMonths = ref<number>(3)
const render = ref<boolean>(false)
const loading = ref<boolean>(false)

const months = monthsLiteral.map((item, index) => ({ value: index + 1, label: item }))
const years = getYears()

/** Los informes estándar (generados por el cron o a mano) y los personalizados. */
const standardReports = computed<Report[]>(() => (reports.value?.rows ?? []).filter(item => origin(item) !== 'CUSTOM'))
const customReports = computed<Report[]>(() => (reports.value?.rows ?? []).filter(item => origin(item) === 'CUSTOM'))

/** El `metadata` puede venir como texto (jsonb) o como objeto. */
const parseMetadata = (raw: unknown): Record<string, any> => {
  if (!raw) {
    return {}
  }
  if (typeof raw === 'object') {
    return raw as Record<string, any>
  }
  try {
    const parsed = JSON.parse(String(raw)) as unknown
    return parsed && typeof parsed === 'object' ? parsed as Record<string, any> : {}
  } catch {
    return {}
  }
}

const quarterLabel = (item: Report) => {
  const quarter = Number(parseMetadata(item.metadata).quarter)
  return quarters[quarter - 1]?.label ?? 'Informe trimestral'
}

const origin = (item: Report) => item.origin || 'MANUAL'
const originLabel = (item: Report) => origin(item) === 'AUTO' ? 'Automático' : 'Manual'
const originColor = (item: Report) => origin(item) === 'AUTO' ? 'positive' : 'grey'

/** Meses que incluye el informe (1, 2 o 3). */
const headerMonths = (item: Report): string[] => {
  try {
    const raw: unknown = typeof item.content === 'string'
      ? (JSON.parse(item.content) as unknown)
      : item.content
    const content = raw as ReportQuarter | undefined
    const header = content?.GLOBAL?.entries?.header
    return Array.isArray(header) ? header : []
  } catch {
    return []
  }
}

const monthNames = (item: Report) => headerMonths(item)
  .map(head => monthsShort[Number(head.split('-')[0]) - 1])
  .join(' | ')

const customPeriod = (item: Report) => {
  const header = headerMonths(item)
  if (header.length === 0) {
    return `${item.year}`
  }
  const first = header[0].split('-')
  const last = header[header.length - 1].split('-')
  const firstName = monthsLiteral[Number(first[0]) - 1]
  const lastName = monthsLiteral[Number(last[0]) - 1]
  return first[1] === last[1]
    ? `${firstName} - ${lastName} ${last[1]}`
    : `${firstName} ${first[1]} - ${lastName} ${last[1]}`
}

const generateFirstReport = () => {
  Confirm('Va a crear el <strong>PRIMER INFORME TRIMESTRAL</strong>, esta operación se hará una única vez y no podrá revertirlo. ¿Deséa continuar?.', async () => {
    report.value = await http.post('expenses/report/quarter', {
      month: month.value,
      year: year.value,
      quarter: quarter.value
    }) as Report

    if (report.value?.id) {
      await getReportsQuarter()
      void router.push(`/treasury/report/quarter/${report.value.id}`)
    }
  }, undefined, 'Advertencia', 'Continuar')
}

const generateNextReport = () => {
  Confirm('Va a crear el <strong>SIGUIENTE INFORME TRIMESTRAL</strong>. ¿Deséa continuar?.', async () => {
    report.value = await http.post('expenses/report/quarter/next') as Report

    if (report.value?.id) {
      await getReportsQuarter()
      void router.push(`/treasury/report/quarter/${report.value.id}`)
    }
  }, undefined, 'Advertencia', 'Continuar')
}

const generateCustomReport = () => {
  Confirm('Va a crear un <strong>INFORME TRIMESTRAL PERSONALIZADO</strong> con los meses indicados. ¿Deséa continuar?.', async () => {
    try {
      report.value = await http.post('expenses/report/quarter/custom', {
        month: customMonth.value,
        year: customYear.value,
        months: customMonths.value
      }) as Report
    } catch {
      // El backend ya informa el motivo (mes sin datos, rango inválido).
      return
    }

    if (report.value?.id) {
      await getReportsQuarter()
      void router.push(`/treasury/report/quarter/${report.value.id}`)
    }
  }, undefined, 'Advertencia', 'Continuar')
}

const getReportsQuarter = async () => {
  loading.value = true
  reports.value = await http.get('reports?type=QUARTER&order=-id') as ReportResponse
  void nextTick(() => {
    loading.value = false
  })
}

onMounted(async () => {
  await getReportsQuarter()
  render.value = true
})

</script>
