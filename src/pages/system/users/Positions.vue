<template>
  <CrudTable
    :columns="columns"
    :url="`positionsuser?id_user=${props.user.id}`"
    :buttonsHidden="true"
    order="-positionuser.begin">
    <template v-slot:formInline="props">
      <q-form @submit="save(props)" ref="myForm">
        <div class="row">
          <div class="col-xs-12 col-sm-11">
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12" :class="{ 'col-sm-2': level === 'CHURCH', 'col-sm-3': level !== 'CHURCH' }">
                <q-select
                  v-model="level"
                  :options="levels"
                  filled
                  dense
                  label="Nivel"
                  emit-value
                  map-options
                  :rules="[validation.required]">
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-3" v-if="level === 'CHURCH'">
                <q-select
                  v-model="positionUser.id_company"
                  :options="companies"
                  filled
                  dense
                  label="Iglesia"
                  emit-value
                  map-options
                  option-value="id"
                  option-label="name"
                  :rules="[validation.required]">
                </q-select>
              </div>
              <div class="col-xs-12" :class="{ 'col-sm-3': level === 'CHURCH', 'col-sm-5': level !== 'CHURCH' }">
                <q-select
                  v-model="positionUser.id_position"
                  :options="positions.filter(item => item.level === level)"
                  filled
                  dense
                  label="Cargo"
                  option-value="id"
                  option-label="description"
                  emit-value
                  map-options
                  :rules="[validation.required]">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.description }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.type === 'OFFICIAL' ? 'Oficial' : 'Ministerio' }} - {{ scope.opt.level === 'CHURCH' ? 'Iglesia local' : 'Asociación' }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-xs-12 col-sm-2">
                <q-input
                  v-model="positionUser.begin"
                  filled
                  dense
                  label="Desde"
                  mask="####"
                  hint="AAAA"
                  :rules="[validation.required]"
                />
              </div>
              <div class="col-xs-12 col-sm-2">
                <q-input
                  v-model="positionUser.end"
                  filled
                  dense
                  label="Hasta"
                  mask="####"
                  hint="AAAA"
                  :rules="[]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-3">
                <q-checkbox
                  v-model="positionUser.remuneration"
                  label="Recibe remuneración"></q-checkbox>
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-checkbox
                  v-model="positionUser.fulltime"
                  label="Trabaja tiempo completo"></q-checkbox>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-1 text-right">
            <q-btn
              icon="add"
              color="positive"
              round
              size="16px"
              type="submit" />
          </div>
        </div>
      </q-form>
    </template>
    <template v-slot:row="props">
      <q-tr :class="{ 'selected': props.row.interest }">
        <q-td>
          <q-btn
            class="q-pa-xs"
            flat
            round
            color="negative"
            icon="delete"
            @click="deleteItem(props.update, `positionsuser/${props.row.id}`)" />
        </q-td>
        <q-td>
          {{ props.row.position?.description }} <br>
          <span class="text-grey-7">{{ labels[props.row.position?.type].label }}</span>
        </q-td>
        <q-td>{{ props.row.company?.name }}</q-td>
        <q-td>{{ props.row.begin === props.row.end ? props.row.begin : `${props.row.begin} - ${props.row.end || 'Actualidad'}` }}</q-td>
        <q-td>{{ props.row.remuneration ? 'SI' : 'NO' }}</q-td>
        <q-td>{{ props.row.fulltime ? 'SI' : 'NO' }}</q-td>
        <!-- <q-td class="text-right">
          <q-chip
            square
            dense
            :color="labels[props.row.state].color"
            :text-color="labels[props.row.state].textColor"
            :label="labels[props.row.state].label" />
        </q-td> -->
      </q-tr>
    </template>
  </CrudTable>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { useStore } from '../../../store'
import { User } from '../../../components/entities/User'
import { Position, PositionUser } from '../../../components/entities/Position'
import { Result } from '../../../components/entities/Entity'
import { Company } from '../../../components/entities/Company'
import validation from '../../../components/plugins/validation'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import { deleteItem } from '../../../components/plugins/crud'

const store = useStore()

const columns = [
  { label: 'Eliminar', align: 'center' },
  { label: 'Cargo', align: 'left', name: 'position.description', sortable: true },
  { label: 'Lugar', align: 'left', name: 'company.name', sortable: true },
  { label: 'Gestión', align: 'left', name: 'positionuser.begin', sortable: true },
  { label: 'Remunerado', align: 'left', name: 'positionuser.remuneration', sortable: true },
  { label: 'Trabajo tiempo completo', align: 'left', name: 'positionuser.fulltime', sortable: true }
  // { label: 'Estado', align: 'right', name: 'positionuser.state', sortable: true }
]

const levels = [
  // { value: 'GENERAL', label: 'GENERAL' },
  // { value: 'UNION', label: 'UNION' },
  { value: 'ASSOCIATION', label: 'ASOCIACION' },
  // { value: 'DIVISION', label: 'DIVISION' },
  // { value: 'MISSION', label: 'MISION' },
  { value: 'CHURCH', label: 'IGLESIA' }
  // { value: 'GROUP', label: 'GRUPO' },
]

const labels = {
  ACTIVE: { color: 'positive', textColor: 'white', label: 'VIGENTE' },
  INACTIVE: { color: 'warning', textColor: 'white', label: 'NO VIGENTE' },
  MINISTERIAL: { color: 'warning', textColor: 'white', label: 'MINISTERIO' },
  OFFICIAL: { color: 'warning', textColor: 'white', label: 'OFICIAL' }
}

interface Props {
  user: User
}

const props = defineProps<Props>()
const positions = ref<Position[]>([])
const positionUser = ref<PositionUser>({})
const level = ref<string>()
const companies = ref<Company[]>()

const getPositions = async () => {
  const items = await http.get(`positions?id_company=${(store.state.user.user.company.id_association) as number}`) as Result<Position>
  positions.value = items.rows
}

const openEdit = async (id?: number) => {
  if (id) {
    positionUser.value = await http.get(`positionsuser/${id}`) as PositionUser
  } else {
    positionUser.value = {
      remuneration: false,
      fulltime: false
    }
  }
}

const save = async (crud: { update: () => void, close: () => void }) => {
  positionUser.value.id_user = props.user.id
  if (level.value !== 'CHURCH') {
    positionUser.value.id_company = store.state.user.user.company.id_association as number
  }
  if (positionUser.value?.id) {
    await http.put(`positionsuser/${positionUser.value.id}`, positionUser.value)
    message.success('¡Cargo actualizado!')
  } else {
    await http.post('positionsuser', positionUser.value)
    message.success('¡Cargo creado!')
  }
  crud.update()
  await openEdit()
}

onMounted(async () => {
  const items = await http.get('companies') as Result<Company>
  companies.value = items.rows.filter(item => ['CHURCH', 'GROUP'].includes(item.type))
  await getPositions()
  await openEdit()
})
</script>
