<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Informes mensuales
    </h2>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="-year"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="can('form_report:create')"
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openCreateModal(props.open)">
          Nuevo informe
          <q-tooltip>Crear informe del mes</q-tooltip>
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card class="report-dialog">
          <q-toolbar class="q-pa-md">
            <q-icon name="post_add" size="md" />
            <q-toolbar-title>Nuevo informe</q-toolbar-title>
            <q-btn flat round dense icon="close" @click="props.close" />
          </q-toolbar>
          <q-card-section>
            <q-form @submit="create(props)">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12">
                  <q-select
                    label="Plantilla"
                    filled
                    v-model="form.idTemplate"
                    :options="templateOptions"
                    :rules="rules.required"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Mes"
                    filled
                    v-model="form.month"
                    :options="monthOptions"
                    :rules="rules.required"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Año"
                    filled
                    v-model="form.year"
                    :options="yearOptions"
                    :rules="rules.required" />
                </div>
                <div class="col-xs-12 text-right q-gutter-sm">
                  <q-btn icon="close" label="Cancelar" @click="props.close" />
                  <q-btn icon="check" color="secondary" label="Crear" type="submit" />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              v-if="can('form_report:read')"
              flat
              round
              @click="openReport(props.row)"
              icon="edit">
              <q-tooltip>Abrir informe</q-tooltip>
            </q-btn>
            <q-btn
              v-if="can('form_report:read')"
              flat
              round
              color="primary"
              @click="printReport(props.row)"
              icon="print">
              <q-tooltip>Imprimir</q-tooltip>
            </q-btn>
            <q-btn
              v-if="can('form_report:delete')"
              color="negative"
              flat
              round
              @click="deleteItem(props.update, `${url}/${props.row.id}`)"
              icon="delete">
              <q-tooltip>Eliminar informe</q-tooltip>
            </q-btn>
          </q-td>
          <q-td>{{ formLabels[props.row.form] || props.row.form }}</q-td>
          <q-td>{{ typeLabels[props.row.type] || props.row.type }}</q-td>
          <q-td>{{ monthName(props.row.month) }}</q-td>
          <q-td>{{ props.row.year }}</q-td>
        </q-tr>
      </template>
    </CrudTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { message } from 'boot/message'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import { deleteItem } from '../../../components/plugins/crud'
import validation from '../../../components/plugins/validation'
import { getYears, months } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'
import { Result } from '../../../components/entities/Entity'
import { FormReport } from '../../../components/entities/FormReport'
import { ReportTemplate, formLabels, typeLabels } from '../../../components/entities/ReportTemplate'

const store = useStore()
const router = useRouter()
const url = 'form-reports'

const can = (permission: string) =>
  !!store.state.user?.permissions?.includes(permission)

const columns = [
  { label: 'Acciones', align: 'center', sortable: false },
  { name: 'form', label: 'Formulario', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', align: 'left', sortable: true },
  { name: 'month', label: 'Mes', align: 'left', sortable: true },
  { name: 'year', label: 'Año', align: 'center', sortable: true }
]

const monthOptions = months.map((label, index) => ({ label, value: index + 1 }))
const yearOptions = getYears(1, 2024)

const filters = [
  { label: 'Formulario', name: 'form', type: 'select', options: formOptionsOf(formLabels) },
  { label: 'Tipo', name: 'type', type: 'select', options: formOptionsOf(typeLabels) },
  { label: 'Mes', name: 'month', type: 'select', options: monthOptions },
  { label: 'Año', name: 'year', type: 'input' }
]

function formOptionsOf (labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }))
}

const rules = { required: [validation.required] }

const form = ref<{ idTemplate?: number, month?: number, year?: number }>({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear()
})
const templateOptions = ref<{ value: number, label: string }[]>([])

const monthName = (month: number) => months[Number(month) - 1] || month

const openCreateModal = async (open: () => void) => {
  const templates = await http.get('report-templates?limit=100&state=ACTIVE', false) as Result<ReportTemplate>
  templateOptions.value = (templates.rows || []).map(template => ({
    value: Number(template.id),
    label: `${formLabels[template.form] || template.form} — ${typeLabels[template.type] || template.type}`
  }))
  form.value = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  }
  open()
}

const create = async (crud: { update: () => void, close: () => void }) => {
  const created = await http.post(url, {
    id_template: form.value.idTemplate,
    month: form.value.month,
    year: form.value.year
  }) as FormReport
  message.success('¡Informe creado exitósamente!')
  crud.update()
  crud.close()
  if (created?.id) {
    await router.push(`/secretary/form-reports/${String(created.id)}`)
  }
}

const openReport = (row: FormReport) => {
  void router.push(`/secretary/form-reports/${String(row.id)}`)
}

const printReport = (row: FormReport) => {
  void router.push(`/secretary/form-reports/print/${String(row.id)}`)
}
</script>

<style lang="scss">
.report-dialog {
  min-width: 320px;
  width: 100%;
  max-width: 480px;
}
</style>
