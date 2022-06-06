-<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury/flows')" />
        Flujo de caja Inicial - <span class="text-warning">Iglesia local</span>
        <!-- <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span> -->
        <span class="subtitle">Total: {{ total }} Bs.</span>
    </h2>
    <div class="row flow-items q-col-gutter-x-lg q-pt-md">
      <div
        class="col-xs-12 col-sm-6"
        v-for="item in departments"
        :key="item.id">
        <div class="row q-pb-xs">
          <div class="col-8">{{ item.name }}</div>
          <div class="col-xs-4 col-sm-4">
            <q-input
              standout
              class="text-right"
              dense
              placeholder="0"
              suffix="Bs."
              v-model="item.total"
              :disable="initial" />
          </div>
        </div>
      </div>
    </div>
    <div class="text-right q-pt-lg">
      <q-btn
        :label="'Guardar balance inicial'"
        no-caps
        color="primary"
        icon="print"
        padding="10px 20px"
        class="btn-close-month"
        @click="saveInitial"
        :disable="initial" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { Department } from '../../../components/entities/Department'
import { Flow } from '../../../components/entities/Flow'

const departments = ref<[Department]>([])
const initial = ref<false>()
const idCompany = 9

const getDepartments = async () => {
  const items = await http.get('departments?order=id&type=LOCAL') as Result<Department>
  departments.value = items.rows
}

const getInitial = async () => {
  const items = await http.get(`flows?id_company=${idCompany}&type=INITIAL`) as Result<Flow>
  console.log(items)
  if (items.count) {
    departments.value = items.rows.map((item: Flow) => ({
      id: item.department.id,
      name: item.department.name,
      total: item.total
    }))
    initial.value = true
  } else {
    await getDepartments()
  }
}

const saveInitial = async () => {
  await http.post('flows/initial', {
    id_company: idCompany,
    departments: departments.value
  })
  await getInitial()
}

const total = computed(() => {
  let total = 0
  departments.value.forEach(item => {
    total += Number(item.total || 0)
  })
  return total.toFixed(2)
})

onBeforeMount(async () => {
  await getInitial()
})
</script>
