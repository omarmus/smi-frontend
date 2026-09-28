<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary/reports')" />
      Informes mensuales
    </h2>
    <q-banner v-if="blocked" dense class="bg-red-1 text-red-10 q-mb-md">
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ blockedMessage }}
    </q-banner>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="-year"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="canCreate"
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
                <!-- B6-5: el tipo es dato interno del obrero (lo resuelve el
                     server vía my-report-type); solo la administración lo elige -->
                <div v-if="!typeLocked" class="col-xs-12">
                  <q-select
                    label="Cargo"
                    filled
                    v-model="selectedType"
                    :options="typeOptions"
                    :rules="rules.required"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12">
                  <!-- B6-5: vacío y deshabilitado hasta elegir tipo (admin);
                       el obrero ve directamente las de su tipo resuelto -->
                  <q-select
                    label="Informe"
                    filled
                    v-model="form.idTemplate"
                    :options="templateOptions"
                    :disable="informeDisabled"
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
                  <q-btn icon="check" color="primary" label="Crear" type="submit" />
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
          <q-td>{{ templateNameOf(props.row) }}</q-td>
          <q-td>{{ typeLabels[props.row.type] || props.row.type }}</q-td>
          <q-td>{{ monthName(props.row.month) }}</q-td>
          <q-td>{{ props.row.year }}</q-td>
        </q-tr>
      </template>
    </CrudTable>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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
  // sin `form`: la plantilla ya dice "Informe de Trabajo - Pastor".
  // sortable false: el orden se manda al server, que no puede ordenar por template.name
  { name: 'templateName', label: 'Nombre de plantilla', align: 'left', sortable: false },
  { name: 'type', label: 'Cargo', align: 'left', sortable: true },
  { name: 'month', label: 'Mes', align: 'left', sortable: true },
  { name: 'year', label: 'Año', align: 'center', sortable: true }
]

/** Nombre de la plantilla de origen; si se eliminó, fallback a form — cargo. */
const templateNameOf = (row: FormReport): string =>
  row.template?.name ||
  `${formLabels[row.form] || row.form} — ${typeLabels[row.type] || row.type}`

const monthOptions = months.map((label, index) => ({ label, value: index + 1 }))
const yearOptions = getYears(1, 2024)

const filters = [
  { label: 'Formulario', name: 'form', type: 'select', options: formOptionsOf(formLabels) },
  { label: 'Cargo', name: 'type', type: 'select', options: formOptionsOf(typeLabels) },
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

/** Respuesta de `GET form-reports/my-report-type` (motivos en inglés). */
interface ReportTypeAccess {
  unrestricted: boolean
  type: string | null
  reason: string | null
}

/** El backend devuelve el código; la frase en español vive acá (R5/R6). */
const blockedMessage = 'No tiene un cargo asignado para generar informes. Contacte con el administrador para que le asigne un cargo.'

const access = ref<ReportTypeAccess>()
const allTemplates = ref<ReportTemplate[]>([])
const selectedType = ref<string>()

const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({ value, label }))
/** No-admin: el tipo sale de su cargo y queda fijado (selector deshabilitado). */
const typeLocked = computed(() => !!access.value && !access.value.unrestricted)
const blocked = computed(() => !!access.value && !access.value.unrestricted && !access.value.type)
const canCreate = computed(() => can('form_report:create') && !blocked.value)

/** Nombre de la plantilla para el select. Todo se fuerza a `string`: el label
 *  nunca debe quedar tipeado como `any` aunque el checker resuelva mal la interfaz. */
const templateLabel = (template: ReportTemplate): string => {
  const name = String(template.name ?? '').trim()
  if (name !== '') return name
  const form = String(formLabels[template.form] ?? template.form)
  const type = String(typeLabels[template.type] ?? template.type)
  return `${form} — ${type}`
}

const templateOptions = computed(() =>
  allTemplates.value
    // B6-5: sin tipo elegido NO hay plantillas (el admin ve el campo vacío y
    // deshabilitado hasta elegir; el obrero ya recibe las de su tipo del server)
    .filter(template => !!selectedType.value && template.type === selectedType.value)
    .map(template => ({
      value: Number(template.id),
      // B6-6: la opción muestra el nombre de la plantilla
      label: templateLabel(template)
    }))
)

/** B6-5: el campo `Informe` solo se habilita cuando ya hay un tipo elegido. */
const informeDisabled = computed(() => !typeLocked.value && !selectedType.value)

// cambiar de tipo invalida la plantilla elegida (pertenecía al tipo anterior)
watch(selectedType, () => { form.value.idTemplate = undefined })

onMounted(async () => {
  access.value = await http.get('form-reports/my-report-type', false) as ReportTypeAccess
  if (blocked.value) {
    message.error(blockedMessage)
  }
})

const monthName = (month: number) => months[Number(month) - 1] || month

const openCreateModal = async (open: () => void) => {
  // la lista sale de form-reports/templates (no de report-templates): el
  // WORKER ya no tiene `report_template:read` y ese 403 lo mandaría a /404
  const templates = await http.get('form-reports/templates', false) as Result<ReportTemplate>
  allTemplates.value = templates.rows || []
  selectedType.value = typeLocked.value ? (access.value?.type ?? undefined) : undefined
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
