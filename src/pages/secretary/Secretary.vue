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
    <div class="row">
      <div class="col-xs-6 col-sm-3 q-pr-sm">
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
      <div class="col-xs-6 col-sm-3 q-pl-sm">
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
      <div class="col-xs-6 col-sm-3 q-pl-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="money_off"
          label="Departamentos"
          no-caps
          @click="$router.push('/secretary/departments')"
          class="full-width btn-block"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>
