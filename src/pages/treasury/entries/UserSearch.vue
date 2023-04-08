<template>
  <q-card class="card-roles">
    <q-toolbar class="q-pa-md">
      <q-icon
        name="person_search"
        size="md"
      />
      <q-toolbar-title>
        Buscar personas
      </q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="close"
        v-close-popup />
    </q-toolbar>
    <q-card-section>
      <CrudTable
        v-if="render"
        :columns="columns"
        :filters="filters"
        :open-filter="true"
        :url="url"
        buttonsHidden
        cols-filter="col-xs-12 col-sm-12 col-md-12"
        label-selection="person.fullname">
        <template v-slot:row="props">
          <q-tr>
            <q-td>
              <strong class="text-primary">{{ props.row.person?.fullname }}</strong><br>
              <em>{{ props.row.company?.name }}</em><br>
              <strong class="treasury-observation">{{ props.row.association?.name }} - {{ props.row.association?.country }}</strong>
            </q-td>
            <q-td>
              <q-btn
                dense
                size="md"
                padding="3px 10px"
                no-caps
                color="primary"
                type="button"
                @click="selected(props.row)"
                label="Seleccionar"
                v-close-popup />
            </q-td>
          </q-tr>
        </template>
      </CrudTable>
    </q-card-section>
    <!-- <q-card-actions align="right" class="q-pa-md">
      <q-btn label="Cancelar" icon="close" v-close-popup />
    </q-card-actions> -->
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
// import { format } from '../../../components/plugins/datetime'
import { User } from '../../../components/entities/User'

interface Props {
  value: string,
  done: () => void
}

const emit = defineEmits(['name'])

const props = defineProps<Props>()

const url = 'users?all_association=true'
const columns = [
  { label: 'Nombre completo:', align: 'left', name: 'person.fullname', sortable: true },
  // { label: 'Fecha de nacimiento', align: 'left', name: 'person.birthday', sortable: true },
  // { label: 'Iglesia/Asociación', align: 'left', name: 'company.id', sortable: true },
  { label: '', align: 'right' }
]

const filters = ref([
  // {
  //   label: 'Iglesia/Grupo',
  //   name: 'id_company',
  //   type: 'select',
  //   options: []
  // },
  {
    label: 'Buscar por nombre completo',
    name: 'fullname',
    type: 'input',
    value: props.value
  }
])
const render = ref<boolean>(false)

const selected = (user: User) => {
  props.done(user.person.fullname, 'add-unique')
  emit('update:name', { value: user.id, label: user.person.fullname })
}

onMounted(() => {
  void nextTick(() => {
    render.value = true
  })
})
</script>
