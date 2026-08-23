<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Cargos
    </h2>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="id"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="$store.state.user?.permissions?.includes('position:create') && (isAdmin || isSuperAdmin)"
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openModal(props.open)"
        >
          Agregar
          <q-tooltip>Agregar cargo</q-tooltip>
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card>
          <q-toolbar class="q-pa-md">
            <q-icon
              name="work"
              size="md"
            />
            <q-toolbar-title>
              {{ position.id ? 'Editar' : 'Agregar' }} cargo
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
                <div class="col-xs-12 col-md-12">
                  <q-input
                    label="Descripción"
                    filled
                    v-model="position.description"
                    :rules="[val => !!val || 'Campo requerido']"
                    autofocus />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Nivel"
                    filled
                    v-model="position.level"
                    :options="levelOptions"
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Campo requerido']">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                          <q-item-label caption>Cargo a nivel {{ scope.opt.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Tipo"
                    filled
                    v-model="position.type"
                    :options="typeOptions"
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Campo requerido']">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.label }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Estado"
                    filled
                    v-model="position.state"
                    :options="stateOptions"
                    emit-value
                    map-options />
                </div> -->
              </div>
              <div class="row q-col-gutter-md q-pt-md">
                <div class="col-xs-12 text-right q-gutter-sm">
                  <q-btn
                    icon="close"
                    label="Cancelar"
                    color="negative"
                    @click="props.close" />
                  <q-btn
                    icon="save"
                    type="submit"
                    label="Guardar"
                    color="primary" />
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
              v-if="$store.state.user?.permissions?.includes('position:update') && (isAdmin || isSuperAdmin)"
              flat
              round
              dense
              icon="edit"
              color="primary"
              @click="openModal(props.open, props.row.id)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="$store.state.user?.permissions?.includes('position:delete') && (isAdmin || isSuperAdmin)"
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="deleteItem(props.update, `${url}/${props.row.id}`)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-toggle
              v-if="isAdmin || isSuperAdmin"
              v-model="props.row.state"
              color="primary"
              false-value="INACTIVE"
              true-value="ACTIVE"
              @click="changeState(props.update, props.row, `${url}/${props.row.id}`)" />
          </q-td>
          <q-td>{{ props.row.description }}</q-td>
          <q-td>
            <q-chip
              square
              dense
              :color="levelLabels[props.row.level]?.color || 'grey'"
              text-color="white"
              :label="levelLabels[props.row.level]?.label || props.row.level" />
          </q-td>
          <q-td>
            <q-chip
              square
              dense
              :color="typeLabels[props.row.type]?.color || 'grey'"
              text-color="white"
              :label="typeLabels[props.row.type]?.label || props.row.type" />
          </q-td>
          <q-td>
            <q-chip
              square
              dense
              :color="stateLabels[props.row.state]?.color || 'grey'"
              text-color="white"
              :label="stateLabels[props.row.state]?.label || props.row.state" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { useStore } from '../../../store'
import { RoleSlug } from '../../../components/entities/Permission'
import { deleteItem, changeState } from '../../../components/plugins/crud'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'

const store = useStore()

const isSuperAdmin = computed(() => [RoleSlug.SUPERADMINISTRATOR].includes(store?.state?.user?.role?.slug as RoleSlug))
const isAdmin = computed(() => [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store?.state?.user?.role?.slug as RoleSlug))

const url = computed(() => {
  const companyIdValue = store?.state?.user?.user?.company?.id_association as number || store?.state?.user?.user?.company?.id as number
  return isSuperAdmin.value ? 'positions' : `positions?id_company=${companyIdValue}`
})

const position = ref<{
  id?: number
  description: string
  level: string
  type: string
  state: string
}>({
  level: 'CHURCH',
  type: 'MINISTERIAL',
  state: 'ACTIVE'
})

const levelOptions = [
  { value: 'ASSOCIATION', label: 'ASOCIACIÓN' },
  { value: 'CHURCH', label: 'IGLESIA' }
]

const typeOptions = [
  { value: 'MINISTERIAL', label: 'Ministerio', description: 'Cargo de tipo ministerial' },
  { value: 'OFFICIAL', label: 'Oficial', description: 'Cargo de tipo oficial' }
]

// const stateOptions = [
//   { value: 'ACTIVE', label: 'Activo' },
//   { value: 'INACTIVE', label: 'Inactivo' }
// ]

const levelLabels: Record<string, { color: string, label: string }> = {
  ASSOCIATION: { color: 'primary', label: 'ASOCIACIÓN' },
  CHURCH: { color: 'secondary', label: 'IGLESIA' }
}

const typeLabels: Record<string, { color: string, label: string }> = {
  MINISTERIAL: { color: 'warning', label: 'MINISTERIO' },
  OFFICIAL: { color: 'info', label: 'OFICIAL' }
}

const stateLabels: Record<string, { color: string, label: string }> = {
  ACTIVE: { color: 'positive', label: 'ACTIVO' },
  INACTIVE: { color: 'negative', label: 'INACTIVO' }
}

const columns = [
  { label: 'Acciones', align: 'center', name: 'actions', sortable: false },
  { label: 'Descripción', align: 'left', name: 'description', sortable: true },
  { label: 'Nivel', align: 'left', name: 'level', sortable: true },
  { label: 'Tipo', align: 'left', name: 'type', sortable: true },
  { label: 'Estado', align: 'left', name: 'state', sortable: true }
]

const filters = [
  {
    label: 'Descripción',
    name: 'description',
    type: 'input'
  },
  {
    label: 'Nivel',
    name: 'level',
    type: 'select',
    options: levelOptions
  },
  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: typeOptions
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

const openModal = async (open: () => void, id?: number) => {
  if (id) {
    const data = await http.get(`${url.value}/${id}`) as typeof position.value
    position.value = data
  } else {
    position.value = {
      level: 'CHURCH',
      type: 'MINISTERIAL',
      state: 'ACTIVE'
    }
  }
  open()
}

const save = async (crud: { update: () => void, close: () => void }) => {
  try {
    if (position.value.id) {
      await http.put(`${url.value}/${position.value.id}`, position.value)
      message.success('¡Cargo actualizado!')
    } else {
      await http.post(url, position.value)
      message.success('¡Cargo creado!')
    }
    crud.update()
    crud.close()
  } catch (error) {
    message.error('Error al guardar')
  }
}
</script>
