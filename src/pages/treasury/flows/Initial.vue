-<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/')" />
        Configuración inicial Caja local - <span class="text-warning">{{ $store.state.user?.user?.company?.name }}</span>
        <!-- <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span> -->
    </h2>
    <div class="alert alert-info">Selecciona el <strong>mes</strong> en el que empezarás a contabilizar los registros de tesorería en el sistema.</div>
    <div class="q-pb-md">
      <div class="row q-col-gutter-x-sm">
        <div class="col-xs-12 col-md-8">
          <q-select
            v-model="month"
            :options="months.map((item: string, index: number) => ({ value: index + 1, label: item.toUpperCase() }))"
            label="Seleccione el mes"
            emit-value
            map-options
            filled
            :disable="initial"
            :rules="[v => !!v || 'Debe seleccionar el mes para continuar']" />
        </div>
        <div class="col-xs-12 col-md-4">
          <q-select
            v-model="year"
            :options="getYears(0, (new Date()).getFullYear() - 1)"
            label="Seleccione el año"
            emit-value
            map-options
            filled
            :disable="initial"
            :rules="[v => !!v || 'Debe seleccionar el año para continuar']" />
        </div>
      </div>
    </div>
    <template v-if="month">
      <div class="alert alert-info">Llena los montos de cada departamento de tu iglesia local que tiene como saldo acumulado hasta el mes de <strong>{{ monthPrev }}</strong></div>
      <div class="alert alert-warning"><strong>Importante.-</strong> Usa el <strong>punto decimal .</strong> como separador para los centavos en todo el sistema. <em>Ejemplo: 132.5</em></div>
      <div class="text-right">
        <q-chip square color="warning" text-color="white">
          <strong>Total {{ monthPrev }}: {{ total }} {{ $store.state.user?.user?.company?.money }}</strong>
        </q-chip>
      </div>
      <div class="row flow-items q-col-gutter-x-lg q-pt-md">
        <div
          class="col-xs-12 col-sm-6"
          v-for="item in departments"
          :key="item.id">
          <div class="row q-pb-xs">
            <div class="col-8 q-pb-lg">{{ item.name }}</div>
            <div class="col-xs-4 col-sm-4">
              <q-input
                standout
                class="text-right"
                dense
                placeholder="0.0"
                :suffix="$store.state.user?.user?.company?.money"
                v-model="item.total"
                :disable="initial"
                :rules="[validation.decimal]" />
            </div>
          </div>
        </div>
      </div>
      <div class="text-right q-pt-lg">
        <q-btn
          :label="'Guardar configuración inicial'"
          no-caps
          color="primary"
          icon="check"
          padding="10px 20px"
          class="btn-close-month"
          @click="save"
          v-if="!initial" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../../store'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { storage } from 'boot/storage'
import { Confirm } from 'boot/modal'
import { Result, Option } from '../../../components/entities/Entity'
import { Department } from '../../../components/entities/Department'
import { Flow } from '../../../components/entities/Flow'
import { months, getYears } from '../../../components/plugins/datetime'
import validation, { validateDecimal } from '../../../components/plugins/validation'

const router = useRouter()
const store = useStore()

const departments = ref<[Department]>([])
const initial = ref<false>()
const month = ref<Option>()
const year = ref<number>(new Date().getFullYear())
const idCompany = store.state.user?.user?.company?.id as number

const getDepartments = async () => {
  const items = await http.get('departments?order=id&type=LOCAL') as Result<Department>
  departments.value = items.rows
}

const getInitial = async () => {
  const items = await http.get(`flows?id_company=${idCompany}&type=INITIAL`) as Result<Flow>
  if (items.count) {
    departments.value = items.rows.map((item: Flow) => ({
      id: item.department.id,
      name: item.department.name,
      total: item.total
    }))
    initial.value = true
    month.value = items.rows[0].month
  } else {
    await getDepartments()
  }
}

const save = (): void => {
  if (departments.value.reduce((total: number, item: Department) => total + (item.total || 0), 0) === 0) {
    return message.warning('Debe llenar por lo menos un monto de algún departamento para continuar')
  }
  if (!departments.value.reduce((valid: boolean, item: Department) => valid && (item.total ? validateDecimal(item.total) : true), true)) {
    return message.warning('- El formato del monto no es válido, use el punto decimal como separador de decimales,<br>- Tampoco puede usar las comas como separador de miles')
  }
  Confirm('<p>Revise que los datos ingresados sean correctos, solo podrá configurar esta información por única vez.<p> ¿Deséa continuar?', async () => {
    await http.post('flows/initial', {
      id_company: idCompany,
      departments: departments.value,
      month: month.value,
      year: year.value
    })
    message.success('Configuración guardada correctamente')
    storage.set('initial', false)
    store.commit('global/setInitial', false)
    return router.push('/treasury')
  }, null, 'Advertencia', 'Si, continuar')
}

const total = computed(() => {
  let total = 0
  departments.value.forEach(item => {
    total += Number(item.total || 0)
  })
  return total.toFixed(2)
})

const monthPrev = computed(() => {
  if (month.value > 1) {
    return months[month.value - 2].toUpperCase()
  }
  return months[11].toUpperCase()
})

onBeforeMount(async () => {
  await getInitial()
})
</script>
