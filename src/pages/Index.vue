<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-6 col-sm-3 q-pr-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="edit_note"
          label="Secretaría"
          no-caps
          @click="$router.push('secretary')"
          class="full-width btn-block" />
      </div>
      <div class="col-xs-6 col-sm-3 q-pl-sm">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="paid"
          label="Tesorería"
          no-caps
          @click="$router.push('/treasury')"
          class="full-width btn-block" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
</style>
