<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
        Reportes
    </h2>
    <div class="row q-col-gutter-md">
      <div
        v-if="$store.state.user?.permissions?.includes('balance:read')"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="account_balance"
          label="Flujo de caja local"
          no-caps
          @click="$router.push('/treasury/flows/general')"
          class="full-width btn-block"
        />
      </div>
      <div
        v-if="$store.state.user?.permissions?.includes('balance:read')"
        class="col-xs-12 col-sm-6 col-md-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="width_normal"
          label="Informe trimestral"
          no-caps
          @click="$router.push('/treasury/report/quarter')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>
