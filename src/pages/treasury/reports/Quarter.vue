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
      <div class="alert alert-info" v-if="reports?.count === 0">
        Selecciona el <strong>mes, gestión y trimestre</strong> en el que empezarás a generar los informes trimestrales.
      </div>
      <div class="row q-col-gutter-sm" v-if="reports?.count === 0">
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
      <div class="row treasury-row" v-if="reports?.count !== 0">
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
          v-for="item in reports?.rows"
          :key="item.id">
          <q-btn
            flat
            color="secondary"
            padding="lg"
            no-caps
            @click="$router.push(`/treasury/report/quarter/${item.id}`)"
            class="full-width btn-block">
            {{ quarters[JSON.parse(item.metadata)?.quarter - 1].label }}
            <span class="btn-block-detail">
              <span class="text-warning">
                {{ JSON.parse(item.content)?.GLOBAL.entries.header.map((head: string) => monthsShort[Number(head.split('-')[0]) - 1]).join(' | ') }}
              </span>
            </span>
            <span class="btn-block-detail"><strong class="text-primary">{{ item.month > 11 ? item.year + 1 : item.year }}</strong></span>
            <q-icon name="width_normal" />
          </q-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { http } from 'boot/http'
import { months as monthsLiteral, monthsShort, getYears } from '../../../components/plugins/datetime'
import { useRouter } from 'vue-router'
import { Report, ReportResponse } from '../../../components/entities/Report'
import { Confirm } from 'boot/modal'

const quarters = [
  { value: 1, label: '1er. trimestre' },
  { value: 2, label: '2do. trimestre' },
  { value: 3, label: '3er. trimestre' },
  { value: 4, label: '4to. trimestre' }
]

// const store = useStore()
const router = useRouter()

const report = ref<Report>()
const reports = ref<ReportResponse>()
const year = ref<number>(new Date().getFullYear())
const month = ref<number>(1)
const quarter = ref<number>(1)
const render = ref<boolean>(false)
const loading = ref<boolean>(false)

const months = monthsLiteral.map((item, index) => ({ value: index + 1, label: item }))
const years = getYears()

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
