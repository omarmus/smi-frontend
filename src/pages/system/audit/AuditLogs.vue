<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn icon="arrow_back" round flat @click="$router.push('/')" />
      Bitácora de auditoría
    </h2>

    <CrudTable
      url="audit-logs"
      :columns="columns"
      :filters="filters"
      order="-createAt"
      :open-filter="true"
      buttons-hidden
    >
      <template v-slot:row="props">
        <q-tr>
          <q-td>{{ formatDate(props.row.createAt) }}</q-td>
          <q-td>
            <q-badge :color="eventColor(props.row.eventName)" :label="eventLabel(props.row.eventName)" />
          </q-td>
          <q-td>
            <q-badge :color="severityColor(props.row.severity)" :label="severityLabel(props.row.severity)" />
          </q-td>
          <q-td>
            <div class="text-weight-medium">{{ props.row.actorFullname || props.row.actorUsername || '—' }}</div>
            <div class="text-caption text-grey">@{{ props.row.actorUsername }} · #{{ props.row.actorIdUser }}</div>
          </q-td>
          <q-td>{{ roleLabel(props.row.actorRoleSlug) }}</q-td>
          <q-td>{{ props.row.targetType }}</q-td>
          <q-td class="text-center">{{ props.row.targetId }}</q-td>
          <q-td>{{ props.row.ip }}</q-td>
          <q-td class="text-center">
            <q-badge color="grey-7" :label="payloadSize(props.row.payload)" />
            <q-btn
              size="sm"
              round
              dense
              class="q-ml-md"
              :icon="expanded[props.row.id] ? 'remove' : 'add'"
              @click="toggleExpand(props.row.id)" />
          </q-td>
        </q-tr>
        <q-tr v-if="expanded[props.row.id]">
          <q-td colspan="100%">
            <div class="q-pa-md">
              <div class="text-caption text-grey q-mb-sm">Payload</div>
              <pre class="audit-payload">{{ formatPayload(props.row.payload) }}</pre>
              <div v-if="props.row.ip || props.row.userAgent" class="q-mt-sm">
                <div class="text-caption text-grey">IP: {{ props.row.ip || '—' }} | User-Agent: {{ props.row.userAgent || '—' }}</div>
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data>
        <div class="full-width text-center q-pa-md text-grey">No hay registros de auditoría</div>
      </template>
    </CrudTable>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CrudTable from 'src/components/common/crud-table/CrudTable.vue'

const columns = [
  { name: 'createAt', label: 'Fecha/Hora', field: 'createAt', align: 'left' as const, sortable: true },
  { name: 'eventName', label: 'Evento', field: 'eventName', align: 'left' as const, sortable: true },
  { name: 'severity', label: 'Severidad', field: 'severity', align: 'center' as const },
  { name: 'actorUsername', label: 'Actor', field: 'actorUsername', align: 'left' as const },
  { name: 'actorRoleSlug', label: 'Rol', field: 'actorRoleSlug', align: 'left' as const },
  { name: 'targetType', label: 'Entidad', field: 'targetType', align: 'left' as const },
  { name: 'targetId', label: 'ID Target', field: 'targetId', align: 'center' as const },
  { name: 'ip', label: 'IP', field: 'ip', align: 'left' as const },
  { name: 'payload', label: 'Payload', field: 'payload', align: 'center' as const }
]

const filters = [
  {
    label: 'Evento',
    name: 'eventName',
    type: 'select',
    options: [
      { value: 'treasury_purged', label: 'Tesorería purgada' },
      { value: 'month_reopened', label: 'Mes reabierto' },
      { value: 'month_closed', label: 'Mes cerrado' },
      { value: 'manual_contribution_saved', label: 'Aporte manual guardado' },
      { value: 'initial_balance_created', label: 'Balance inicial creado' },
      { value: 'initial_balance_updated', label: 'Balance inicial actualizado' },
      { value: 'cross_church_report_viewed', label: 'Reporte cruzado visualizado' },
      { value: 'login_failed', label: 'Login fallido' },
      { value: 'login_succeeded', label: 'Login exitoso' },
      { value: 'login_denied_inactive', label: 'Login denegado (inactivo)' },
      { value: 'context_switched', label: 'Cambio de contexto' },
      { value: 'user_password_changed', label: 'Contraseña cambiada' },
      { value: 'user_roles_changed', label: 'Roles de usuario cambiados' },
      { value: 'user_state_changed', label: 'Estado de usuario cambiado' },
      { value: 'user_deleted', label: 'Usuario eliminado' },
      { value: 'company_deleted', label: 'Compañía eliminada' },
      { value: 'company_state_changed', label: 'Estado de compañía cambiado' },
      { value: 'role_permissions_changed', label: 'Permisos de rol cambiados' }
    ]
  },
  { label: 'Usuario actor', name: 'actorUsername', type: 'input' },
  { label: 'Desde', name: 'startDate', type: 'date' },
  { label: 'Hasta', name: 'endDate', type: 'date' }
]

const expanded = reactive<Record<number, boolean>>({})

const toggleExpand = (id: number) => {
  expanded[id] = !expanded[id]
}

const severityColor = (severity: string): string => {
  const map: Record<string, string> = {
    LOW: 'green-9', MEDIUM: 'amber-9', HIGH: 'deep-orange-7', CRITICAL: 'red-10'
  }
  return map[severity] ?? 'grey'
}

const severityLabel = (severity: string): string => {
  const map: Record<string, string> = {
    LOW: 'Bajo', MEDIUM: 'Medio', HIGH: 'Alto', CRITICAL: 'Crítico'
  }
  return map[severity] ?? severity
}

const eventLabel = (eventName: string): string => {
  const map: Record<string, string> = {
    treasury_purged: 'Tesorería purgada',
    month_reopened: 'Mes reabierto',
    month_closed: 'Mes cerrado',
    manual_contribution_saved: 'Aporte manual guardado',
    initial_balance_created: 'Balance inicial creado',
    initial_balance_updated: 'Balance inicial actualizado',
    cross_church_report_viewed: 'Reporte cruzado visualizado',
    login_failed: 'Login fallido',
    login_succeeded: 'Login exitoso',
    login_denied_inactive: 'Login denegado (inactivo)',
    context_switched: 'Cambio de contexto',
    user_password_changed: 'Contraseña cambiada',
    user_roles_changed: 'Roles de usuario cambiados',
    user_state_changed: 'Estado de usuario cambiado',
    user_deleted: 'Usuario eliminado',
    company_deleted: 'Compañía eliminada',
    company_state_changed: 'Estado de compañía cambiado',
    role_permissions_changed: 'Permisos de rol cambiados'
  }
  return map[eventName] ?? eventName
}

const eventColor = (eventName: string): string => {
  const map: Record<string, string> = {
    treasury_purged: 'red-10',
    month_reopened: 'orange-9',
    month_closed: 'green-9',
    manual_contribution_saved: 'amber-9',
    initial_balance_created: 'teal-10',
    initial_balance_updated: 'teal-8',
    cross_church_report_viewed: 'purple-10',
    login_failed: 'red-10',
    login_succeeded: 'green-9',
    login_denied_inactive: 'orange-9',
    context_switched: 'blue-10',
    user_password_changed: 'amber-9',
    user_roles_changed: 'indigo-9',
    user_state_changed: 'indigo-8',
    user_deleted: 'red-10',
    company_deleted: 'red-9',
    company_state_changed: 'indigo-9',
    role_permissions_changed: 'purple-9'
  }
  return map[eventName] ?? 'grey'
}

const roleLabel = (slug: string | null): string => {
  if (!slug) return '—'
  const map: Record<string, string> = {
    SUPERADMINISTRATOR: 'Superadmin',
    ADMINISTRATOR_UNION: 'Admin Unión',
    ADMINISTRATOR_ASSOCIATION: 'Admin Asociación',
    TREASURER: 'Tesorero',
    WORKER: 'Obrero',
    SECRETARY: 'Secretario'
  }
  return map[slug] ?? slug
}

const payloadSize = (payload: Record<string, unknown> | null): string => {
  if (!payload) return '0 B'
  const bytes = JSON.stringify(payload).length
  return bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })
}

const formatPayload = (payload: Record<string, unknown> | null): string => {
  if (!payload) return '{}'
  return JSON.stringify(payload, null, 2)
}
</script>

<style scoped>
.audit-payload {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  max-height: 300px;
  overflow: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.q-badge) {
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.03em;
}
</style>
