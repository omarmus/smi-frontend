<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Informes
    </h2>
    <div class="row q-col-gutter-md">
      <div
        v-if="canSeeTemplates"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="description"
          label="Plantillas de informes"
          no-caps
          @click="$router.push('/secretary/report-templates')"
          class="full-width btn-block"
        />
      </div>
      <div
        v-if="canSeeMonthly"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="post_add"
          label="Informes mensuales"
          no-caps
          @click="$router.push('/secretary/form-reports')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RoleSlug } from '../../../components/entities/Permission'
import { useStore } from '../../../store'

const store = useStore()

const can = (permission: string) =>
  !!store.state.user?.permissions?.includes(permission)

const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug)
// mismo gating positivo que el menú: SECRETARY/TREASURER jamás, WORKER sí
const canSeeReports = isSuperAdmin || isAdmin ||
  [RoleSlug.WORKER].includes(store?.state?.user?.role?.slug as RoleSlug)

/** Las plantillas las gestiona solo la administración (R1): el obrero no la ve. */
const canSeeTemplates = (isSuperAdmin || isAdmin) && can('report_template:read')
const canSeeMonthly = canSeeReports && can('form_report:read')
</script>
