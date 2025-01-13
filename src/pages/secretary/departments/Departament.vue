<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Departamentos
    </h2>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="id"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="$store.state.user?.permissions?.includes('department:create') && (isAdmin || isSuperAdmin)"
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openModal(props.open)"
        >
          Agregar
          <q-tooltip>Agregar registro</q-tooltip>
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card>
          <q-toolbar class="q-pa-md">
            <q-icon
              name="apartment"
              size="md"
            />
            <q-toolbar-title>
              {{ department.id ? 'Editar' : 'Agregar' }} departamento
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="props.close" />
          </q-toolbar>
          <q-card-section>
            <q-form @submit="save(props)">
              <div class="row q-col-gutter-md">
                <!-- <div
                  v-if="isAdmin || isSuperAdmin"
                  class="col-xs-12 col-md-12">
                  <q-select
                    label="Iglesia/Grupo"
                    filled
                    v-model="department.idCompany"
                    :options="companies"
                    :rules="rules.type"
                    option-value="id"
                    option-label="name"
                    emit-value
                    map-options />
                </div> -->
                <div class="col-xs-12 col-md-12">
                  <q-input
                    label="Nombre"
                    filled
                    v-model="department.name"
                    :rules="rules.name"
                    autofocus />
                </div>
                <div
                  class="col-xs-12 col-md-12">
                  <q-input
                    label="Descripción"
                    filled
                    v-model="department.description"
                    :rules="rules.description" />
                </div>
                <div
                  class="col-xs-12 col-md-5">
                  <div>Departamento de la:</div>
                  <q-radio v-if="isAdmin || isSuperAdmin" v-model="department.type" val="GLOBAL" label="ASOCIACION" />
                  <q-radio :disable="!(isAdmin || isSuperAdmin)" v-model="department.type" val="LOCAL" label="IGLESIA LOCAL" />
                </div>
                <div
                  class="col-xs-12 col-md-7">
                  <q-select
                    label="Tipo"
                    filled
                    v-model="department.group"
                    :options="groups"
                    :rules="rules.type"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12 text-right q-gutter-sm">
                  <q-btn
                    icon="close"
                    label="Cancelar"
                    @click="props.close" />
                  <q-btn
                    icon="check"
                    color="secondary"
                    label="Guardar"
                    type="submit" />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr>
          <q-td>
            <q-btn
              v-if="$store.state.user?.permissions?.includes('department:update') && (isAdmin || isSuperAdmin)"
              flat
              round
              @click="openModal(props.open, props.row.id)"
              icon="edit">
              <q-tooltip>Editar registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="$store.state.user?.permissions?.includes('department:delete') && (isAdmin || isSuperAdmin)"
              color="negative"
              flat
              round
              @click="deleteItem(props.update, `${url}/${props.row.id}`)"
              icon="delete">
              <q-tooltip>Eliminar registro</q-tooltip>
            </q-btn>
            <q-toggle
              v-if="isAdmin || isSuperAdmin"
              v-model="props.row.state"
              color="primary"
              false-value="INACTIVE"
              true-value="ACTIVE"
              @click="changeState(props.update, props.row, `${url}/${props.row.id}`)" />
          </q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.description }}</q-td>
          <q-td>{{ getGroupLabel(props.row.group) }}</q-td>
          <q-td class="text-right">
            <q-chip
              square
              dense
              :color="labels[props.row.type].color"
              :text-color="labels[props.row.type].textColor"
              :label="labels[props.row.type].label"
            />
          </q-td>
          <q-td class="text-right">
            <q-chip
              square
              dense
              :color="labels[props.row.state].color"
              :text-color="labels[props.row.state].textColor"
              :label="labels[props.row.state].label"
            />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import { DepartmentEntity } from '../../../components/entities/Department'
import { Result } from '../../../components/entities/Entity'
import { deleteItem, changeState } from '../../../components/plugins/crud'
import validation from '../../../components/plugins/validation'
import { RoleSlug } from '../../../components/entities/Permission'
import { useStore } from '../../../store'

const store = useStore()

const url = 'departments'

const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug)

const columns = [
  {
    label: 'Acciones',
    align: 'center',
    sortable: false
  },
  {
    name: 'name',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'description',
    label: 'Descripción',
    align: 'left',
    sortable: true
  },
  {
    name: 'group',
    label: 'Tipo',
    align: 'left',
    sortable: true
  },
  {
    name: 'type',
    label: 'Pertenece a',
    sortable: true
  },
  {
    name: 'state',
    label: 'Estado',
    sortable: true
  }
]

const types = isSuperAdmin ? [
  { value: 'GLOBAL', label: 'ASOCIACION' },
  { value: 'LOCAL', label: 'IGLESIA LOCAL' }
] : [
  { value: 'GLOBAL', label: 'ASOCIACION' },
  { value: 'LOCAL', label: 'IGLESIA LOCAL' }
]

const groups = (isAdmin || isSuperAdmin) ? [
  { value: 'TITHES', label: 'DIEZMOS' },
  { value: 'SCOOP', label: 'PRIMICIAS' },
  { value: 'SECOND', label: 'SEGUNDO DIEZMO' },
  { value: 'TITHE', label: 'DIEZMO DE IGLESIA' },
  { value: 'MUNDIAL', label: 'ASOCIACION GENERAL' },
  { value: 'ASSOCIATION', label: 'ASOCIACIÓN' },
  { value: 'DEPARTMENT', label: 'DEPARTAMENTO' },
  { value: 'CHURCH', label: 'IGLESIA' },
  { value: 'EVENT', label: 'POBRES' },
  { value: 'YOUNG', label: 'JOVENES' },
  { value: 'OTHER', label: 'OTROS' }
  // { value: 'SCHOOL', label: 'ESCUELA SABATICA' }, // ARGENTINA
  // { value: 'WEEK', label: 'SEMANA DE ORACION' },
  // { value: 'MISSION', label: 'MISIÓN' },
  // { value: 'MUSIC', label: 'MÚSICA' },
  // { value: 'MULTIMEDIA', label: 'MULTIMEDIA' },
  // { value: 'PUBLICATIONS', label: 'PUBLICACIONES' },
  // { value: 'GRATITUDE', label: 'OFRENDA DE GRATITUD' },
  // { value: 'POOR', label: 'POBRES' },
  // { value: 'FAMILY', label: 'FAMILIA' },
  // { value: 'DORCAS', label: 'DORCAS' },
  // { value: 'HEALTH', label: 'SALUD' },
  // { value: 'ASSEMBLY', label: 'ASAMBLEA' },
  // { value: 'CHILDREN', label: 'NIÑOS' },
  // { value: 'SAMARITAN', label: 'SAMARITANO' },
  // { value: 'MISSIONARY', label: 'MISIONERO' },
  // { value: 'QUARTER', label: 'TRIMESTRE' },
  // { value: 'OUTFLOW', label: 'DESARROLLO' },
  // { value: 'SEMINARS', label: 'SEMINARIOS' },
  // { value: 'DAYS', label: 'DÍAS' }
] : [
  { value: 'DEPARTMENT', label: 'DEPARTAMENTO' },
  { value: 'CHURCH', label: 'IGLESIA' },
  { value: 'EVENT', label: 'POBRES' },
  { value: 'YOUNG', label: 'JOVENES' },
  { value: 'OTHER', label: 'OTROS' }
]

const filters = [
  {
    label: 'Nombre',
    name: 'name',
    type: 'input'
  },
  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: groups
  },
  {
    label: 'Pertenece a',
    name: 'type',
    type: 'select',
    options: types
  },
  {
    label: 'Estado',
    name: 'state',
    type: 'select',
    options: [
      {
        label: 'ACTIVO',
        value: 'ACTIVE'
      },
      {
        label: 'INACTIVO',
        value: 'INACTIVE'
      }
    ]
  }
]

const labels = {
  LOCAL: { color: 'warning', textColor: 'white', label: 'IGLESIA LOCAL' },
  GLOBAL: { color: 'positive', textColor: 'white', label: 'ASOCIACION' },
  ACTIVE: { color: 'positive', textColor: 'white', label: 'ACTIVO' },
  INACTIVE: { color: 'warning', textColor: 'white', label: 'INACTIVO' }
}

const rules = {
  name: [validation.required],
  description: [],
  type: [validation.required],
  group: [validation.required]
}

const department = ref<DepartmentEntity>()
const companies = ref<DepartmentEntity[]>()

const getGroupLabel = (group: string) => {
  const find = groups.find(item => item.value === group)
  return find?.label || ''
}

const getCompanies = async () => {
  const items = await http.get('companies') as Result<DepartmentEntity>
  companies.value = items.rows
}

const openModal = async (open: () => void, id?: number) => {
  if (id) {
    department.value = await http.get(`${url}/${id}`) as DepartmentEntity
  } else {
    department.value = {
      name: '',
      description: '',
      group: '',
      type: (isAdmin || isSuperAdmin) ? 'GLOBAL' : 'LOCAL'
    }
  }
  open()
}

const save = async (crud: { update: () => void, close: () => void }) => {
  if (department.value?.id) {
    await http.put(`${url}/${String(department.value?.id)}`, department.value)
    message.success('¡Registro actualizado!')
  } else {
    await http.post(url, department.value)
    message.success('¡Registro creado exitósamente!')
  }
  crud.update()
  crud.close()
}
onBeforeMount(async () => {
  await getCompanies()
})
</script>

<style lang="scss">
.title-contacts {
  padding-top: 0;
  margin: 0;
  font-size: 20px;
}
</style>
