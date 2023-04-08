<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
        Flujo de caja
    </h2>
    <div class="row treasury-row">
      <div
        class="col-xs-6 col-sm-3 q-pa-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push('/treasury/flows/general')"
          class="full-width btn-block">
          <strong>General</strong>
          <!-- <span class="btn-block-detail">{{ item.total }} {{ $store.state.user?.user.company.money }}</span> -->
          <q-icon name="account_balance" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
      <div
        class="col-xs-6 col-sm-3 q-pa-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push('/treasury/flows/initial')"
          class="full-width btn-block">
          <strong>Inicial</strong>
          <!-- <span class="btn-block-detail">{{ item.total }} {{ $store.state.user?.user.company.money }}</span> -->
          <q-icon name="account_balance" />
          <!-- <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" /> -->
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>
