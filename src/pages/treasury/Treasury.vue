<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/')" />
      Tesorería
    </h2>
    <div class="row q-gutter-sm">
      <div class="col-xs-6 col-sm-3">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="attach_money"
          label="Ingresos y Gastos"
          no-caps
          @click="$router.push('/treasury/months')"
          class="full-width btn-block"
        />
      </div>
      <div class="col-xs-6 col-sm-3">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="account_balance"
          label="Flujo de caja"
          no-caps
          @click="$router.push('/treasury/flows/general')"
          class="full-width btn-block"
        />
      </div>
      <div class="col-xs-6 col-sm-3">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="account_balance_wallet"
          label="Cuentas bancarias"
          no-caps
          @click="$router.push('/treasury/flows')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>
