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
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="year"
          :options="years"
          label="Gestión"
          map-options
          emit-value />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-select
          filled
          v-model="month"
          :options="months"
          label="Mes"
          map-options
          emit-value />
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-btn
          class="q-ml-none q-mr-xs"
          icon="check"
          no-caps
          color="primary"
          @click="generateReport"
        >
          Generar informe trimestral
        </q-btn>
      </div>
      <pre>{{ report }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { http } from 'boot/http'
import { months as monthsLiteral, getYears } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'
import { Flow } from '../../../components/entities/Flow'

const store = useStore()

interface ReportQuarter {
  entries: {
    local: Flow[],
    global: Flow[]
  }
}
const report = ref<ReportQuarter>()
const year = ref<number>(new Date().getFullYear())
const month = ref<number>(1)

const months = monthsLiteral.map((item, index) => ({ value: index + 1, label: item }))
const years = getYears()

const idCompany = store.state.user?.user?.company.id as number

const generateReport = async () => {
  const url = `expenses/report/quarter?id_company=${idCompany}&year=${year.value as string}&month=${month.value as string}`
  report.value = await http.get(url) as ReportQuarter
}

</script>
