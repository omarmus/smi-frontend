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
      :open-filter="true"
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
                  <q-btn icon="close" label="Cancelar" color="secondary" flat no-caps @click="props.close" />
                  <q-btn icon="check" color="primary" label="Crear" no-caps type="submit" />
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
              v-if="canSend(props.row)"
              flat
              round
              color="primary"
              @click="sendReport(props.row, props.update)"
              icon="send">
              <q-tooltip>Enviar informe a revisión</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canReopen(props.row)"
              flat
              round
              color="warning"
              @click="reopenReport(props.row, props.update)"
              icon="undo">
              <q-tooltip>Reabrir informe (volver a editarlo)</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canReview && props.row.reviewState === ReportReviewState.SUBMITTED"
              flat
              round
              color="primary"
              @click="openReviewDialog(props.row, props.update)"
              icon="rate_review">
              <q-tooltip>Revisar informe</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canDelete(props.row)"
              color="negative"
              flat
              round
              @click="deleteItem(props.update, `${url}/${props.row.id}`)"
              icon="delete">
              <q-tooltip>Eliminar informe</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canDisable(props.row)"
              color="negative"
              flat
              round
              @click="disableReport(props.row, props.update)"
              icon="block">
              <q-tooltip>Inhabilitar informe (no se borra, queda archivado)</q-tooltip>
            </q-btn>
            <q-btn
              v-if="canEnable(props.row)"
              color="primary"
              flat
              round
              @click="enableReport(props.row, props.update)"
              icon="restart_alt">
              <q-tooltip>Reactivar informe</q-tooltip>
            </q-btn>
          </q-td>
          <q-td>{{ templateNameOf(props.row) }}</q-td>
          <q-td v-if="!isWorker">{{ props.row.ownerName }}</q-td>
          <q-td>{{ typeLabels[props.row.type] || props.row.type }}</q-td>
          <q-td>{{ monthName(props.row.month) }}</q-td>
          <q-td>{{ props.row.year }}</q-td>
          <q-td>
            <q-badge
              :color="reviewStateColor(props.row)"
              :label="reviewStateLabel(props.row)" />
            <q-icon
              v-if="props.row.reviewComment"
              name="comment"
              size="xs"
              color="grey-8"
              class="q-ml-xs">
              <q-tooltip>{{ props.row.reviewComment }}</q-tooltip>
            </q-icon>
          </q-td>
        </q-tr>
      </template>
    </CrudTable>

    <!-- Revisión del informe (administración): aprobar, observar o revertir -->
    <q-dialog v-model="reviewOpen" persistent>
      <q-card class="report-dialog">
        <q-toolbar class="q-pa-md">
          <q-icon name="rate_review" size="md" />
          <q-toolbar-title>Revisar informe</q-toolbar-title>
          <q-btn flat round dense icon="close" @click="reviewOpen = false" />
        </q-toolbar>
        <q-card-section>
          <q-form @submit="submitReview">
            <div class="col-xs-12">
              <div class="col-xs-12 text-caption text-grey">
                {{ reviewRow ? `${templateNameOf(reviewRow)} — ${monthName(reviewRow.month)} ${reviewRow.year}` : '' }}
              </div>
              <div class="col-xs-12 q-mb-md">
                <q-select
                  v-model="reviewAction"
                  label="Acción"
                  filled
                  :options="reviewActions"
                  :rules="rules.required"
                  emit-value
                  map-options />
              </div>
              <div class="col-xs-12 q-mb-md">
                <q-input
                  v-model="reviewComment"
                  label="Comentario para el usuario"
                  type="textarea"
                  autogrow
                  filled
                  :rules="reviewRules"
                  hint="Obligatorio al observar: es lo que el usuario lee para saber qué corregir." />
              </div>
              <div class="col-xs-12 text-right q-gutter-sm">
                <q-btn icon="close" label="Cancelar" color="secondary" flat no-caps type="button" @click="reviewOpen = false" />
                <q-btn icon="check" color="primary" label="Aplicar" no-caps type="submit" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
import { RoleSlug } from '../../../components/entities/Permission'
import { Confirm } from 'boot/modal'
import { Result } from '../../../components/entities/Entity'
import {
  FormReport,
  ReportReviewAction,
  ReportReviewState,
  reviewActionLabels,
  reviewStateColors,
  reviewStateLabels
} from '../../../components/entities/FormReport'
import { ReportTemplate, formLabels, typeLabels } from '../../../components/entities/ReportTemplate'

const store = useStore()
const router = useRouter()
const url = 'form-reports'

const can = (permission: string) =>
  !!store.state.user?.permissions?.includes(permission)

/**
 * El obrero trabaja con UN cargo (el del server, por `my-report-type`) y no
 * administra el listado: los filtros de cargo y de nombre no le sirven. Se
 * ocultan para ese rol; el resto de la administración los mantiene.
 */
const isWorker = computed(() =>
  store.state.user?.role?.slug === RoleSlug.WORKER)

const columns = computed(() => [
  { label: 'Acciones', align: 'center', sortable: false },
  // sin `form`: la plantilla ya dice "Informe de Trabajo - Pastor".
  // sortable false: el orden se manda al server, que no puede ordenar por template.name
  { name: 'templateName', label: 'Nombre de plantilla', align: 'left', sortable: false },
  // el obrero sólo ve SUS informes: la columna "Propietario" siempre diría
  // su propio nombre (la administración sí la necesita).
  ...(isWorker.value
    ? []
    : [{ name: 'ownerName', label: 'Propietario', align: 'left', sortable: false }]),
  { name: 'type', label: 'Cargo', align: 'left', sortable: true },
  { name: 'month', label: 'Mes', align: 'left', sortable: true },
  { name: 'year', label: 'Año', align: 'center', sortable: true },
  { name: 'approved', label: 'Estado', align: 'center', sortable: false }
])

/** Nombre de la plantilla de origen; si se eliminó, fallback a form — cargo. */
const templateNameOf = (row: FormReport): string =>
  row.template?.name ||
  `${formLabels[row.form] || row.form} — ${typeLabels[row.type] || row.type}`

const monthOptions = months.map((label, index) => ({ label, value: index + 1 }))
const yearOptions = getYears(1, 2024)
const managementOptions = getYears(0, 2026).map(year => ({ value: year, label: String(year) }))

const filters = computed(() => [
  { label: 'Formulario', name: 'form', type: 'select', options: formOptionsOf(formLabels) },
  ...(isWorker.value
    ? []
    : [{ label: 'Cargo', name: 'type', type: 'select', options: formOptionsOf(typeLabels) }]),
  { label: 'Mes', name: 'month', type: 'select', options: monthOptions },
  { label: 'Gestión', name: 'year', type: 'select', options: managementOptions },
  ...(isWorker.value
    ? []
    : [{ label: 'Buscar por nombre', name: 'ownerName', type: 'input' }])
])

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

// ------------------------------------------------------------------
// Flujo de revisión del informe
// ------------------------------------------------------------------

/** La administración (unión/asociación/super) revisa y aprueba informes. */
const isAdmin = computed(() =>
  [RoleSlug.SUPERADMINISTRATOR, RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION]
    .includes(store.state.user?.role?.slug as RoleSlug)
)

/** Revisar (aprobar/observar/revertir) exige permiso explícito. */
const canReview = computed(() => isAdmin.value && can('form_report:approve'))

/** Id del usuario en sesión: define quién es el dueño del informe. */
const currentUserId = computed(() => store.state.user?.user?.id)

/** El informe es de este usuario (lo creó). */
const isOwner = (row: FormReport): boolean =>
  !!currentUserId.value && row.userCreated === currentUserId.value

/** El dueño envía un borrador (o uno observado que ya corrigió). */
const canSend = (row: FormReport): boolean =>
  isOwner(row) &&
  [ReportReviewState.DRAFT, ReportReviewState.OBSERVED].includes(row.reviewState || ReportReviewState.DRAFT)

/** El dueño reabre un informe enviado para corregirlo. */
const canReopen = (row: FormReport): boolean =>
  isOwner(row) && row.reviewState === ReportReviewState.SUBMITTED

/** Borrar: permiso + (dueño o administración) + sólo en borrador. */
const canDelete = (row: FormReport): boolean =>
  can('form_report:delete') &&
  (isOwner(row) || isAdmin.value) &&
  row.reviewState === ReportReviewState.DRAFT

/** Inhabilitar: la administración retira el informe del flujo (no se borra). */
const canDisable = (row: FormReport): boolean =>
  isAdmin.value &&
  can('form_report:delete') &&
  row.reviewState !== ReportReviewState.DRAFT &&
  row.reviewState !== ReportReviewState.INHABILITADO

/** Reactivar: la administración devuelve un informe inhabilitado al flujo. */
const canEnable = (row: FormReport): boolean =>
  isAdmin.value &&
  can('form_report:delete') &&
  row.reviewState === ReportReviewState.INHABILITADO

const sendReport = (row: FormReport, update: () => void | Promise<void>) => {
  Confirm(
    '¿Desea enviar el informe a revisión? Enviado, no se puede editar hasta que se reabra.',
    async () => {
      await http.post(`form-reports/${String(row.id)}/submit`)
      message.success('¡Informe enviado a revisión!')
      await update()
    }
  )
}

const reopenReport = (row: FormReport, update: () => void | Promise<void>) => {
  Confirm(
    '¿Desea reabrir el informe? Volverá a editable y después tendrás que enviarlo otra vez.',
    async () => {
      await http.post(`form-reports/${String(row.id)}/reopen`)
      message.success('¡Informe reabierto!')
      await update()
    }
  )
}

const disableReport = (row: FormReport, update: () => void | Promise<void>) => {
  Confirm(
    '¿Desea inhabilitar el informe? Quedará archivado y fuera del flujo (no se borra: conserva su historial).',
    async () => {
      await http.post(`form-reports/${String(row.id)}/disable`)
      message.success('¡Informe inhabilitado!')
      await update()
    }
  )
}

const enableReport = (row: FormReport, update: () => void | Promise<void>) => {
  Confirm(
    '¿Desea reactivar el informe? Volverá a borrador y su dueño podrá corregirlo y enviarlo otra vez.',
    async () => {
      await http.post(`form-reports/${String(row.id)}/enable`)
      message.success('¡Informe reactivado!')
      await update()
    }
  )
}

// --- diálogo de revisión ---
const reviewOpen = ref(false)
const reviewRow = ref<FormReport>()
const reviewAction = ref<string>()
const reviewComment = ref('')
const reviewUpdate = ref<() => void | Promise<void>>()

/** Un informe aprobado sólo se puede revertir; los demás, aprobar u observar. */
const reviewActions = computed(() => {
  const state = reviewRow.value?.reviewState || ReportReviewState.DRAFT
  const actions = state === ReportReviewState.APPROVED
    ? [ReportReviewAction.REVERT]
    : [ReportReviewAction.APPROVE, ReportReviewAction.OBSERVE]
  return actions.map(action => ({ value: action, label: reviewActionLabels[action] }))
})

/** Observar exige comentario: es lo que el usuario lee para saber qué corregir. */
const reviewRules = computed(() => [
  (value?: string) =>
    reviewAction.value !== ReportReviewAction.OBSERVE ||
    ((value || '').trim().length > 0 ||
      'Escribí la observación: el usuario la lee para saber qué corregir')
])

const reviewStateLabel = (row: FormReport): string =>
  reviewStateLabels[row.reviewState || ReportReviewState.DRAFT] || 'Borrador'

const reviewStateColor = (row: FormReport): string =>
  reviewStateColors[row.reviewState || ReportReviewState.DRAFT] || 'grey-7'

const openReviewDialog = (row: FormReport, update: () => void | Promise<void>) => {
  reviewRow.value = row
  reviewAction.value = undefined
  reviewComment.value = row.reviewComment || ''
  reviewUpdate.value = update
  reviewOpen.value = true
}

const submitReview = async () => {
  const row = reviewRow.value
  if (row && reviewAction.value) {
    await http.post(`form-reports/${String(row.id)}/review`, {
      action: reviewAction.value,
      comment: reviewComment.value.trim()
    })
    message.success('¡Revisión guardada!')
    reviewOpen.value = false
    await reviewUpdate.value?.()
  }
}
</script>

<style lang="scss">
.report-dialog {
  min-width: 320px;
  width: 100%;
  max-width: 480px;
}
</style>
