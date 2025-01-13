<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Iglesias
    </h2>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="id"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="$store.state.user?.permissions?.includes('company:create')"
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
              name="home_work"
              size="md"
            />
            <q-toolbar-title>
              {{ company.id ? 'Editar' : 'Agregar' }} registro
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
                    label="Nombre"
                    filled
                    v-model="company.name"
                    :rules="rules.name"
                    :disable="!(isAdmin || isSuperAdmin)"
                    autofocus />
                </div>
                <div
                  v-if="isAdmin || isSuperAdmin"
                  class="col-xs-12 col-md-6">
                  <q-select
                    label="Tipo"
                    filled
                    v-model="company.type"
                    :options="types"
                    :rules="rules.type"
                    emit-value
                    map-options />
                </div>
                <div
                  v-if="isAdmin || isSuperAdmin"
                  class="col-xs-12 col-md-6">
                  <q-select
                    label="Misión"
                    filled
                    v-model="company.idCompany"
                    :options="companies.filter(c => ['MISSION'].includes(c.type))"
                    :rules="rules.type"
                    :disable="!['CHURCH', 'GROUP'].includes(company.type)"
                    option-value="id"
                    option-label="name"
                    emit-value
                    map-options />
                </div>
                <div
                  class="col-xs-12 col-md-12"
                  v-if="!['CHURCH', 'GROUP'].includes(company.type)">
                  <q-input
                    label="Descripción"
                    filled
                    v-model="company.description"
                    :rules="rules.description" />
                </div>
                <div class="col-xs-12 col-md-12">
                  <q-input
                    label="Dirección"
                    filled
                    v-model="company.address"
                    :rules="rules.address" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    label="Teléfonos"
                    filled
                    v-model="company.phones"
                    :rules="rules.phones" />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-input
                    label="Correo electrónico de contacto"
                    filled
                    v-model="company.email"
                    :rules="rules.email" />
                </div>
                <div class="col-xs-12 col-md-12">
                  <div class="row">
                    <div class="col-xs-6 col-md-6">
                      <h3 class="title-contacts">Contactos:</h3>
                    </div>
                    <div class="col-xs-6 col-md-6 text-right">
                      <q-btn
                        class="q-mt-md"
                        rounded
                        label="Agregar contacto"
                        size="sm"
                        icon="add"
                        color="positive"
                        no-caps
                        @click="addContact" />
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-md-12" v-if="company?.info?.contacts">
                  <div
                    class="row q-col-gutter-md"
                    v-for="contact in company.info.contacts"
                    :key="contact.id">
                    <div class="col-xs-12 col-md-6">
                      <q-input
                        dense
                        label="Nombre"
                        filled
                        v-model="contact.name"
                        :rules="rules.name" />
                    </div>
                    <div class="col-xs-12 col-md-5">
                      <q-input
                        dense
                        label="Teléfono(s)"
                        filled
                        v-model="contact.phone"
                        :rules="rules.phone" />
                    </div>
                    <div class="col-xs-12 col-md-1">
                      <q-btn
                        class="q-mt-xs"
                        round
                        icon="delete"
                        color="negative"
                        size="sm"
                        @click="removeContact(contact.id)" />
                    </div>
                  </div>
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
              v-if="$store.state.user?.permissions?.includes('company:update')"
              flat
              round
              @click="openModal(props.open, props.row.id)"
              icon="edit">
              <q-tooltip>Editar registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="$store.state.user?.permissions?.includes('company:delete')"
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
          <q-td>{{ props.row.address }}</q-td>
          <q-td>
            <ul
              class="q-ma-none q-pa-none"
              v-if="props.row.info?.contacts">
              <li
                v-for="item in props.row.info.contacts"
                :key="item.id">
                {{ item.name }} <em>{{ item.phone }}</em>
              </li>
            </ul>
          </q-td>
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
import { Company } from '../../../components/entities/Company'
import { Result } from '../../../components/entities/Entity'
import { deleteItem, changeState } from '../../../components/plugins/crud'
import validation from '../../../components/plugins/validation'
import { uuidv4 } from '../../../components/plugins/util'
import { RoleSlug } from '../../../components/entities/Permission'
import { useStore } from '../../../store'

const store = useStore()

const url = 'companies'

const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store.state.user.role.slug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store.state.user.role.slug)

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
    name: 'address',
    label: 'Dirección',
    align: 'left',
    sortable: true
  },
  {
    name: 'info',
    label: 'Contacto(s)',
    align: 'left',
    sortable: true
  },
  {
    name: 'type',
    label: 'Tipo',
    sortable: true
  },
  {
    name: 'state',
    label: 'Estado',
    sortable: true
  }
]

const types = isSuperAdmin ? [
  { value: 'GENERAL', label: 'GENERAL' },
  { value: 'UNION', label: 'UNION' },
  { value: 'DIVISION', label: 'DIVISION' },
  { value: 'ASSOCIATION', label: 'ASOCIACION' },
  { value: 'MISSION', label: 'MISION' },
  { value: 'CHURCH', label: 'IGLESIA' },
  { value: 'GROUP', label: 'GRUPO' }
] : [
  { value: 'MISSION', label: 'MISION' },
  { value: 'CHURCH', label: 'IGLESIA' },
  { value: 'GROUP', label: 'GRUPO' }
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
  GENERAL: { color: 'positive', textColor: 'white', label: 'GENERAL' },
  UNION: { color: 'info', textColor: 'white', label: 'UNION' },
  ASSOCIATION: { color: 'warning', textColor: 'white', label: 'ASOCIACION' },
  DIVISION: { color: 'positive', textColor: 'white', label: 'DIVISION' },
  MISSION: { color: 'info', textColor: 'white', label: 'MISION' },
  CHURCH: { color: 'positive', textColor: 'white', label: 'IGLESIA' },
  GROUP: { color: 'warning', textColor: 'white', label: 'GRUPO' },
  ACTIVE: { color: 'positive', textColor: 'white', label: 'ACTIVO' },
  INACTIVE: { color: 'warning', textColor: 'white', label: 'INACTIVO' }
}

const rules = {
  name: [validation.required],
  description: [],
  type: [validation.required],
  phones: [],
  address: [],
  web: [validation.url],
  email: [validation.email]
}

const company = ref<Company>()
const companies = ref<Company[]>()

const getCompanies = async () => {
  const items = await http.get('companies') as Result<Company>
  companies.value = items.rows
}

const openModal = async (open: () => void, id?: number) => {
  if (id) {
    company.value = await http.get(`${url}/${id}`) as Company
    if (!company.value.info) {
      company.value.info = {
        contacts: [
          { id: uuidv4(), name: '', phone: '' }
        ]
      }
    }
  } else {
    company.value = {
      type: 'CHURCH',
      info: {
        contacts: [
          { id: uuidv4(), name: '', phone: '' }
        ]
      }
    }
  }
  open()
}

const addContact = () => {
  company.value.info.contacts.push({ id: uuidv4(), name: '', phone: '' })
}

const removeContact = (id: string) => {
  company.value.info.contacts = company.value.info.contacts.filter(item => item.id !== id)
}

const save = async (crud: { update: () => void, close: () => void }) => {
  if (company.value?.id) {
    await http.put(`${url}/${company.value.id}`, company.value)
    message.success('¡Registro actualizado!')
  } else {
    await http.post(url, company.value)
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
