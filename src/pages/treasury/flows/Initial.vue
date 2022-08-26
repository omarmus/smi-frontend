-<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/')" />
        Configuración Caja local - <span class="text-warning">{{ $store.state.user?.user?.company.name }}</span>
        <!-- <span class="text-warning" v-if="entry.state === 'CLOSED'">CERRADO</span> -->
        <span class="subtitle">Total: {{ total }} Bs.</span>
    </h2>
    <div class="alert alert-info">Para <strong>empezar</strong> a registrar la información de tesorería primero necesita seleccionar el <strong>MES</strong> en el que empezará a contabilizar los registros de tesorería en el sistema, es decir el <strong>siguiente mes</strong> del último libro de tesorería que llenó.</div>
    <div class="q-pb-md">
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
    <template v-if="month">
      <div class="alert alert-info">Ahora debe <strong>llenar los montos de cada departamento</strong> de su iglesia local que tiene como saldo acumulado hasta <strong>{{ monthPrev }}</strong></div>
      <div class="alert alert-info"><strong>Importante.-</strong> Use el punto <strong>.</strong> como separador decimal para los centavos en todo el sistema. <em>Ejemplo: 132.5</em></div>
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
                suffix="Bs."
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
import { Result } from '../../../components/entities/Entity'
import { Department } from '../../../components/entities/Department'
import { Flow } from '../../../components/entities/Flow'
import { months } from '../../../components/plugins/datetime'
import validation, { validateDecimal } from '../../../components/plugins/validation'

const router = useRouter()
const store = useStore()

const departments = ref<[Department]>([])
const initial = ref<false>()
const month = ref<{ value: number, label: string }>()
const idCompany = store.state.user?.user?.company.id as number

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

const save = () => {
  if (departments.value.reduce((total: number, item: Department) => total + (item.total || 0), 0) === 0) {
    return message.warning('Debe llenar por lo menos un monto de algún departamento para continuar')
  }
  if (!departments.value.reduce((valid: boolean, item: Department) => valid && (item.total ? validateDecimal(item.total) : true), true)) {
    return message.warning('- El formato del monto no es válido, use el punto decimal como separador de decimales,<br>- Tampoco puede usar las comas como separador de miles')
  }
  Confirm('<p>Revise que los datos ingresados sean correctos, solo podrá configurar esta información una única vez.<p> ¿Deséa continuar?', async () => {
    await http.post('flows/initial', {
      id_company: idCompany,
      departments: departments.value,
      month: month.value
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
