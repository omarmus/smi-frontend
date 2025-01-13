<template>
  <div class="container" v-if="report && quarter" >
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/report/quarter')" />
        Atrás
    </h2>
    <div class="row">
      <div class="text-right q-mb-md col-xs-12">
        <q-btn
          icon="print"
          no-caps
          @click="printQuarterReport"
        >
          &nbsp;Imprimir informe
        </q-btn>
      </div>
    </div>
    <div class="row" id="report-quarter">
      <div class="col-12">
        <h2 class="text-center report-title">
          INFORME TRIMESTRAL
          <strong>{{ store.state.user.user.company?.name }}</strong>
          <span>
            <!-- {{ quarter.GLOBAL.entries.header.map((head) => monthsLiteral[Number(head.split('-')[0]) - 1]).join(' | ') }} <br> -->
            {{ getQuarterLabel }} - {{ report.month > 11 ? report.year + 1 : report.year }}
          </span>
        </h2>
        <h3 class="text-primary flow-title">OFRENDAS ENVIADAS A LA ASOCIACIÓN BOLIVIANA</h3>
        <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12">
          <table class="q-table treasury-table-data">
            <thead>
              <tr>
                <th class="text-left"><strong>Departamento</strong></th>
                <th
                  class="text-right text-secondary"
                  v-for="head in quarter.GLOBAL.entries.header"
                  :key="head"><strong>{{ monthsLiteral[Number(head.split('-')[0]) - 1] }}</strong></th>
                <th class="text-right text-primary"><strong>Total trimestre</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in quarter.GLOBAL.entries.body"
                :key="item.name">
                <td class="text-left">
                  <span class="flow-head-table">{{ item.name }}</span>
                </td>
                <td
                  class="text-right"
                  v-for="(value, index) in item.values"
                  :key="index">
                  <div class="flow-row-table">
                    <span class="text-hidden">{{ monthsLiteral[Number(quarter.GLOBAL.entries.header[index].split('-')[0]) - 1] }}:</span>
                    <span class="flow-head-table">{{ value.toFixed(2) }}</span>
                  </div>
                </td>
                <td class="text-right text-primary">
                  <div class="flow-row-table">
                    <span class="text-hidden">Total trimestre:</span>
                    <strong class="flow-head-table">{{ item.total.toFixed(2) }}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left">
                  <span class="flow-head-table"><strong>TOTAL</strong></span>
                </th>
                <th
                  class="text-right"
                  :class="{ 'text-primary': index === quarter.GLOBAL.entries.footer.length - 1 }"
                  v-for="(foot, index) in quarter.GLOBAL.entries.footer"
                  :key="index">
                  <div class="flow-row-table">
                    <span class="text-hidden" v-if="index >= 0 && index <= 2">{{ monthsLiteral[Number(quarter.LOCAL.entries.header[index].split('-')[0]) - 1] }}:</span>
                    <span class="text-hidden" v-if="index === quarter.GLOBAL.entries.footer.length - 1">Total trimestre:</span>
                    <strong class="flow-head-table">{{ foot.toFixed(2) }}</strong>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-if="quarter" class="col-12 q-mt-lg">
        <h3 class="text-primary flow-title">INGRESOS DE LA IGLESIA LOCAL, GASTOS Y SALDOS DE SUS FONDOS</h3>
        <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12">
          <table class="q-table treasury-table-data">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th class="bg-warning text-white">
                  <strong>SALDO ANTERIOR</strong>
                </th>
                <th colspan="4" class="bg-positive text-white">
                  <strong>INGRESOS TRIMESTRE</strong>
                </th>
                <th class="bg-negative text-white">
                  <strong>GASTOS TRIMESTRE</strong>
                </th>
                <th class="bg-primary text-white">
                  <strong>SALDO TRIMESTRE</strong>
                </th>
              </tr>
              <tr>
                <th class="text-left" rowspan="2"><strong>Departamento</strong></th>
                <th class="text-right text-warning" rowspan="2"><strong>Saldo {{ monthsLiteral[monthPrev] }}</strong></th>
                <th
                  class="text-right"
                  v-for="head in quarter.LOCAL.entries.header"
                  :key="head"><strong>{{ monthsLiteral[Number(head.split('-')[0]) - 1] }}</strong></th>
                <th class="text-right text-positive"><strong>Ingreso total</strong></th>
                <th class="text-right text-negative"><strong>Gasto total</strong></th>
                <th class="text-right text-primary"><strong>Saldo total</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in quarter.LOCAL.entries.body"
                :key="item.name">
                <td class="text-left">
                  <span class="flow-head-table">{{ item.name }}</span>
                </td>
                <td class="text-right text-warning">
                  <div class="flow-row-table">
                    <span class="text-hidden">Saldo {{ monthsLiteral[monthPrev] }}:</span>
                    <span class="flow-head-table">{{ item.previous?.toFixed(2) }}</span>
                  </div>
                </td>
                <td
                  class="text-right"
                  v-for="(value, index) in item.values"
                  :key="index">
                  <div class="flow-row-table">
                    <span class="text-hidden">{{ monthsLiteral[Number(quarter.LOCAL.entries.header[index].split('-')[0]) - 1] }}:</span>
                    <span class="flow-head-table">{{ value.toFixed(2) }}</span>
                  </div>
                </td>
                <td class="text-right text-positive">
                  <div class="flow-row-table">
                    <span class="text-hidden">Ingreso total:</span>
                    <strong class="flow-head-table">{{ item.total.toFixed(2) }}</strong>
                  </div>
                </td>
                <td class="text-right text-negative">
                  <div class="flow-row-table">
                    <span class="text-hidden">Gasto total:</span>
                    <strong class="flow-head-table">{{ item.totalExpense?.toFixed(2) }}</strong>
                  </div>
                </td>
                <td class="text-right text-primary">
                  <div class="flow-row-table">
                    <span class="text-hidden">Saldo total:</span>
                    <strong class="flow-head-table">{{ item.totalGlobal?.toFixed(2) }}</strong>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left">
                  <span class="flow-head-table"><strong>TOTAL</strong></span>
                </th>
                <th
                  class="text-right"
                  :class="{
                    'text-warning': index === 0,
                    'text-positive': index === quarter.LOCAL.entries.footer.length - 3,
                    'text-negative': index === quarter.LOCAL.entries.footer.length - 2,
                    'text-primary': index === quarter.LOCAL.entries.footer.length - 1,
                  }"
                  v-for="(foot, index) in quarter.LOCAL.entries.footer"
                  :key="index">
                  <div class="flow-row-table">
                    <span class="text-hidden" v-if="index === 0">Saldo {{ monthsLiteral[monthPrev] }}:</span>
                    <span class="text-hidden" v-if="index >= 1 && index <= 3">{{ monthsLiteral[Number(quarter.LOCAL.entries.header[index - 1].split('-')[0]) - 1] }}:</span>
                    <span class="text-hidden" v-if="index === quarter.LOCAL.entries.footer.length - 3">Ingreso total:</span>
                    <span class="text-hidden" v-if="index === quarter.LOCAL.entries.footer.length - 2">Gasto total:</span>
                    <span class="text-hidden" v-if="index === quarter.LOCAL.entries.footer.length - 1">Saldo total:</span>
                    <strong class="flow-head-table">{{ foot.toFixed(2) }}</strong>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useStore } from '../../../store'
import { onMounted, ref, computed } from 'vue'
import { http } from 'boot/http'
import { Report, ReportQuarter } from '../../../components/entities/Report'
import { months as monthsLiteral } from '../../../components/plugins/datetime'
import { printHTML } from 'src/components/plugins/util'

const route = useRoute()
const store = useStore()
const report = ref<Report>()
const quarter = ref<ReportQuarter>()

const quarters = [
  '1er. trimestre',
  '2do. trimestre',
  '3er. trimestre',
  '4to. trimestre'
]

const monthPrev = computed(() => {
  if (!report.value) {
    return 0
  }
  if (report.value.month - 2 < 0) {
    return 11
  }
  return report.value.month - 2
})

const getQuarterLabel = computed(() => {
  if (!report.value) {
    return ''
  }
  const metadata = JSON.parse(report.value.metadata) as { quarter: number }
  return quarters[metadata.quarter - 1]
})

const getReportQuarter = async (id: string) => {
  report.value = (await http.get(`reports/${id}`)) as Report
  quarter.value = JSON.parse(report.value.content) as ReportQuarter
}

function printQuarterReport () {
  printHTML('report-quarter', 'Informe trimestral')
}

onMounted(() => {
  if (route.params.id) {
    void getReportQuarter(String(route.params.id))
  }
})
</script>
