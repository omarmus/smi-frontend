<template>
  <div class="container">
    <div class="row q-col-gutter-md">
      <div
        v-if="['TREASURER'].indexOf($store.state.user.role?.slug) === -1"
        class="col-xs-12 col-sm-6 col-sm-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="edit_note"
          label="Secretaría"
          no-caps
          @click="$router.push('/secretary')"
          class="full-width btn-block" />
      </div>
      <div
        v-if="['SECRETARY'].indexOf($store.state.user?.role?.slug) === -1"
        class="col-xs-12 col-sm-6 col-sm-3 card-button">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          icon="paid"
          label="Tesorería"
          no-caps
          @click="goTreasury"
          class="full-width btn-block" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { storage } from 'boot/storage'

const router = useRouter()

const goTreasury = () => {
  const initial = storage.get('initial')
  return router.push(initial ? '/treasury/flows/initial' : '/treasury')
}
</script>
