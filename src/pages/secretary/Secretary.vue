<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/')" />
      Secretaría
    </h2>
    <div class="row q-col-gutter-md">
      <div
        v-if="$store.state.user?.permissions?.includes('company:read')"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="home"
          label="Iglesias"
          no-caps
          @click="$router.push('/secretary/churchs')"
          class="full-width btn-block"
        />
      </div>
      <div
        v-if="$store.state.user?.permissions?.includes('user:read')"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="people"
          label="Miembros y usuarios"
          no-caps
          @click="$router.push('/secretary/members')"
          class="full-width btn-block"
        />
      </div>
      <div
        v-if="$store.state.user?.permissions?.includes('department:read') && (isSuperAdmin || isAdmin)"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="apartment"
          label="Departamentos"
          no-caps
          @click="$router.push('/secretary/departments')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RoleSlug } from 'src/components/entities/Permission'
import { useStore } from '../../store'
const store = useStore()

const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug)
</script>

<style lang="scss">
</style>
