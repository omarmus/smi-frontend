<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary/form-reports')" />
      Vista de impresión
    </h2>

    <div class="row q-col-gutter-sm q-mb-md no-print">
      <div class="col-auto">
        <q-btn
          color="secondary"
          icon="print"
          label="Imprimir"
          no-caps
          @click="doPrint" />
      </div>
      <div class="col-auto">
        <q-btn
          outline
          color="primary"
          icon="picture_as_pdf"
          label="Descargar PDF"
          no-caps
          @click="doPdf" />
      </div>
    </div>

    <!-- El id es el contrato con printHTML()/html2pdf: solo se imprime ESTE nodo. -->
    <div v-if="detail" id="form-report-print" class="print-sheet">
      <div class="print-org">
        ASOCIACION BOLIVIANA DE LA MISION ADVENTISTA DEL SEPTIMO DIA MOVIMIENTO DE REFORMA
      </div>
      <div class="print-title">{{ formTitle }}</div>
      <!-- C5: el server devuelve el nombre completo del dueño del informe -->
      <div class="print-name">NOMBRE: {{ detail.ownerName || '____________________________________' }}</div>
      <div class="print-month">{{ monthYear }}</div>

      <table class="print-table">
        <thead>
          <tr>
            <th v-for="column in detail.columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.day">
            <td v-for="column in detail.columns" :key="column.key">
              {{ cellValue(column, row) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="print-totals">
            <td v-for="column in detail.columns" :key="column.key">
              {{ totalValue(column) }}
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="print-footer">
        <template v-if="detail.form === 'work'">
          <span>PRESIDENTE ASOCIACION</span>
          <span>PASTOR</span>
          <span>Fecha</span>
        </template>
        <template v-else>
          <span>TESORERA ASOCIACION</span>
          <span>PASTOR</span>
          <span>Alquiler</span>
          <span>Salud</span>
          <span>Fecha</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import html2pdf from 'html2pdf.js'
import { printHTML } from '../../../components/plugins/util'
import { months } from '../../../components/plugins/datetime'
import { FormReportDay, FormReportDetail } from '../../../components/entities/FormReport'
import { ReportColumn, formLabels, typeLabels } from '../../../components/entities/ReportTemplate'

const route = useRoute()
const reportId = String(route.params.id)

const detail = ref<FormReportDetail>()

const title = computed(() => {
  const report = detail.value
  if (!report) {
    return 'Informe'
  }
  const month = months[Number(report.month) - 1] || ''
  return `${formLabels[report.form] || report.form} ${month} ${report.year}`
})

const formTitle = computed(() => {
  const report = detail.value
  if (!report) {
    return ''
  }
  if (report.form === 'work') {
    const type = (typeLabels[report.type] || report.type).toUpperCase()
    return `INFORME DE TRABAJO DEL ${type}`
  }
  return 'GASTOS REALIZADOS'
})

const monthYear = computed(() => {
  const report = detail.value
  if (!report) {
    return ''
  }
  const month = months[Number(report.month) - 1] || ''
  return `${month.toUpperCase()} ${report.year}`
})

const rows = computed(() => {
  const report = detail.value
  if (!report) {
    return []
  }
  const stored = new Map<number, Record<string, unknown>>()
  for (const day of report.days || []) {
    stored.set(day.day, day.values)
  }
  const all: FormReportDay[] = []
  for (let day = 1; day <= report.daysInMonth; day++) {
    all.push({ day, values: stored.get(day) || {} })
  }
  return all
})

const numberValue = (value: unknown): number => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const formatDate = (day: number): string => {
  const report = detail.value
  if (!report) {
    return ''
  }
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${pad(day)}/${pad(Number(report.month))}/${report.year}`
}

/** Total de la fila derivado de los valores que mandó el server. */
const rowTotal = (row: FormReportDay): number => {
  const report = detail.value
  if (!report) {
    return 0
  }
  return report.columns
    .filter(column => column.kind === 'number' && column.total && column.key !== 'total')
    .reduce((sum, column) => sum + numberValue(row.values[column.key]), 0)
}

const cellValue = (column: ReportColumn, row: FormReportDay): string => {
  if (column.key === 'day') {
    return String(row.day)
  }
  if (column.key === 'date') {
    return formatDate(row.day)
  }
  if (column.key === 'total') {
    return String(rowTotal(row))
  }
  const value = row.values[column.key]
  return value === undefined || value === null ? '' : String(value)
}

/** Fila de totales: SOLO valores calculados por el server (GET :id → totals). */
const totalValue = (column: ReportColumn): string => {
  if (column.kind !== 'number' || !column.total) {
    return ''
  }
  const report = detail.value
  return String(report?.totals?.[column.key] ?? 0)
}

const load = async () => {
  detail.value = await http.get(`form-reports/${reportId}`) as FormReportDetail
}

const doPrint = () => {
  printHTML('form-report-print', title.value)
}

const doPdf = () => {
  const element = document.getElementById('form-report-print')
  if (!element || !detail.value) {
    return
  }
  const opt = {
    margin: [8, 8, 8, 8] as [number, number, number, number],
    filename: `informe-${detail.value.form}-${detail.value.type}-${String(detail.value.month)}-${String(detail.value.year)}.pdf`,
    image: { type: 'jpeg' as const, quality: 1.0 },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'letter' as const,
      // B6-1: el PDF sale apaisado (15 columnas no caben en retrito).
      // html2pdf.js reenvía estas opciones a jsPDF; la vista de impresión
      // (printHTML) no cambia.
      orientation: 'landscape' as const
    }
  }
  void html2pdf().set(opt).from(element).save()
}

onMounted(() => {
  // sin form_report:read el API devuelve 403 y boot/http redirige a /404
  void load()
})
</script>

<style lang="scss">
.print-sheet {
  background: #fff;
  color: #000;
  padding: 24px;
  font-family: Arial, Helvetica, sans-serif;

  .print-org {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .print-title {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 12px;
  }

  .print-name {
    margin-top: 16px;
    font-size: 12px;
  }

  .print-month {
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    text-transform: uppercase;
    margin: 8px 0 16px;
  }

  .print-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;

    th,
    td {
      border: 1px solid #000;
      padding: 3px 4px;
      text-align: center;
      word-break: break-word;
    }

    th {
      background: #f0f0f0;
      font-weight: bold;
    }

    tfoot .print-totals td {
      font-weight: bold;
      background: #fafafa;
    }
  }

  .print-footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 32px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;

    span {
      flex: 1;
      text-align: center;
      border-top: 1px solid #000;
      padding-top: 4px;
    }
  }
}

@media print {
  .no-print {
    display: none;
  }
}
</style>
