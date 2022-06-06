<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
        Ingresos - Diezmos y ofrendas
      </h2>
    <div class="q-pb-md">
      <q-select
        filled
        v-model="year"
        :options="years"
        label="Gestión" />
    </div>
    <div class="row treasury-row">
      <div
        class="col-xs-6 col-sm-3 q-pa-sm"
        v-for="item in months"
        :key="item.month">
        <q-btn
          flat
          color="secondary"
          padding="lg"
          no-caps
          @click="$router.push(`/treasury/week/${item.id}`)"
          class="full-width btn-block"
          :class="item.state.toLowerCase()"
          :disable="item.state === 'PENDING'">
          <strong>{{ monthsLiteral[item.month - 1] }}</strong>
          <span class="btn-block-detail">{{ item.total }} Bs.</span>
          <q-icon name="calendar_month" />
          <q-icon name="check_circle" color="positive" size="sm" v-if="item.state === 'CLOSED'" class="treasury-check" />
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { Entry } from '../../../components/entities/Entry'
import { months as monthsLiteral } from '../../../components/plugins/datetime'

const year = ref(new Date().getFullYear())
const months = ref<Entry>([])
const idCompany = 9
const years = [
  { value: 2022, label: '2022' }
]

const getEntriesYear = async () => {
  const items = await http.get(`entries/year/${year.value}/${idCompany}`) as Result<Entry>
  months.value = items.rows
}

onBeforeMount(async () => {
  await getEntriesYear()
})
</script>
