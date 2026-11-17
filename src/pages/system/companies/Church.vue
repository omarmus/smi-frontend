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

    <!-- El rol de secretaría solo consulta los datos de su iglesia. -->
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      :hide-table="isSecretary"
      order="id"
    >
      <template v-slot:formInline="props">
        <CompanyDetail
          v-if="isSecretary && myCompanyId"
          :company-id="myCompanyId"
          @edit="openModal(props.open, myCompanyId)" />
      </template>
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
        <q-card class="modal-md">
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
          <q-tabs
            v-model="tab"
            inline-label
            no-caps
            dense
            align="justify"
            indicator-color="warning"
            class="bg-secondary text-white"
            :breakpoint="0">
            <q-tab name="general" icon="badge" label="Datos generales" />
            <q-tab name="location" icon="location_on" label="Datos de ubicación" />
            <q-tab name="contacts" icon="contacts" label="Contactos" />
          </q-tabs>
          <q-separator />
          <q-form @submit="save(props)" ref="myForm">
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="general">
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
                </div>
              </q-tab-panel>

              <q-tab-panel name="location">
                <div class="row q-col-gutter-md">
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      label="País"
                      v-model="company.country"
                      :options="countriesFilter"
                      option-value="value"
                      option-label="label"
                      use-input
                      input-debounce="0"
                      @filter="filterCountries"
                      :disable="isAssociationAdmin"
                      emit-value
                      map-options>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      label="Departamento"
                      v-model="company.department"
                      :options="departmentOptions"
                      emit-value
                      map-options
                      clearable
                      @update:model-value="onDepartmentChange" />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      label="Provincia"
                      v-model="company.province"
                      :options="provinceOptions"
                      emit-value
                      map-options
                      :disable="!company.department"
                      clearable />
                  </div>
                  <div class="col-xs-12 col-md-12">
                    <q-input
                      label="Dirección"
                      filled
                      v-model="company.address"
                      :rules="rules.address" />
                  </div>
                  <div class="col-xs-12 col-md-12">
                    <MapPicker
                      v-model:latitude="company.latitude"
                      v-model:longitude="company.longitude"
                      :center="mapCenter" />
                  </div>
                  <div class="col-xs-12 col-md-12">
                    <div class="row q-col-gutter-md items-center">
                      <div class="col-xs-12 col-md-4">
                        <q-input
                          label="Latitud"
                          filled
                          type="number"
                          step="any"
                          v-model.number="company.latitude"
                          :rules="rules.latitude" />
                      </div>
                      <div class="col-xs-12 col-md-4">
                        <q-input
                          label="Longitud"
                          filled
                          type="number"
                          step="any"
                          v-model.number="company.longitude"
                          :rules="rules.longitude" />
                      </div>
                      <div class="col-xs-12 col-md-4 text-right">
                        <q-btn
                          v-if="company.latitude !== null && company.latitude !== undefined"
                          flat
                          dense
                          no-caps
                          size="sm"
                          color="secondary"
                          label="Quitar punto"
                          @click="clearCoordinates" />
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="contacts">
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
              </q-tab-panel>
            </q-tab-panels>
            <q-card-actions align="right">
              <q-btn
                v-if="tab !== 'general'"
                label="Anterior"
                no-caps
                icon="navigate_before"
                @click="previous" />
              <q-btn
                v-if="tab !== 'contacts'"
                label="Siguiente"
                no-caps
                icon="navigate_next"
                @click="next" />
              <q-btn
                icon="close"
                label="Cancelar" color="secondary" flat no-caps
                @click="props.close" />
              <q-btn
                icon="check"
                color="primary"
                label="Guardar" no-caps
                type="submit" />
            </q-card-actions>
          </q-form>
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
import { ref, computed, onBeforeMount } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import CompanyDetail from './CompanyDetail.vue'
import MapPicker from '../../../components/common/map-picker/MapPicker.vue'
import { Company } from '../../../components/entities/Company'
import { Result } from '../../../components/entities/Entity'
import { deleteItem, changeState } from '../../../components/plugins/crud'
import validation from '../../../components/plugins/validation'
import { uuidv4 } from '../../../components/plugins/util'
import { RoleSlug } from '../../../components/entities/Permission'
import { useStore } from '../../../store'
import boliviaDepartamentosProvincias from '../../../data/bolivia-departamentos-provincias.json'
import { getCountries } from '../../../components/plugins/countries'

const store = useStore()

const url = 'companies'

const isSuperAdmin = [RoleSlug.SUPERADMINISTRATOR].includes(store.state.user.role.slug)
const isAdmin = [RoleSlug.ADMINISTRATOR_UNION, RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store.state.user.role.slug)

/** La secretaría ve los datos de su iglesia, no el listado administrable. */
const isSecretary = [RoleSlug.SECRETARY].includes(store.state.user.role.slug)
const myCompanyId = computed(() => store.state.user?.user?.company?.id)

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
  email: [validation.email],
  latitude: [(value: number | null) => isValidLatitude(value) || 'La latitud debe estar entre -90 y 90'],
  longitude: [(value: number | null) => isValidLongitude(value) || 'La longitud debe estar entre -180 y 180']
}

const isValidLatitude = (value: number | null | undefined) =>
  value === null || value === undefined || value === '' ||
  (Number(value) >= -90 && Number(value) <= 90)

const isValidLongitude = (value: number | null | undefined) =>
  value === null || value === undefined || value === '' ||
  (Number(value) >= -180 && Number(value) <= 180)

/** Quita el punto del mapa: la iglesia queda sin coordenadas. */
const clearCoordinates = () => {
  if (!company.value) {
    return
  }
  company.value.latitude = null
  company.value.longitude = null
}

const company = ref<Company>()
const companies = ref<Company[]>()
const tab = ref<string>('general')

/**
 * Datos de Bolivia: departamentos con sus provincias y las coordenadas de
 * la capital de cada departamento (para centrar el mapa).
 */
interface BoliviaProvincia {
  id: number
  name: string
}

interface BoliviaDepartamento {
  id: number
  department: string
  latitude?: number
  longitude?: number
  provinces: BoliviaProvincia[]
}

const departamentos = boliviaDepartamentosProvincias as BoliviaDepartamento[]

/** Departamento y provincia: los mismos datos del modal de usuario. */
const departmentOptions = departamentos.map(item => ({
  label: item.department,
  value: item.department
}))

const provinceOptions = computed(() => {
  const department = company.value?.department
  if (!department) {
    return []
  }
  const found = departamentos.find(item => item.department === department)
  return (found?.provinces ?? []).map(item => ({
    label: item.name,
    value: item.name
  }))
})

const onDepartmentChange = (department?: string) => {
  if (company.value) {
    company.value.province = undefined
  }

  // El mapa se centra en el departamento elegido.
  const found = departamentos.find(item => item.department === department)
  mapCenter.value = found?.latitude !== undefined && found?.longitude !== undefined
    ? { lat: found.latitude, lng: found.longitude, zoom: 10 }
    : null
}

/** Países: la lista que ya usa el modal de usuario (nacionalidad). */
const countryOptions = getCountries().map(item => ({
  label: item.country,
  value: item.country
}))
const countriesFilter = ref(countryOptions)

const filterCountries = (val: string, update: () => void) => {
  update(() => {
    countriesFilter.value = val
      ? countryOptions.filter(item => item.label.toLowerCase().includes(val.toLowerCase()))
      : countryOptions
  })
}

/** Centro que se le pasa al mapa (el departamento elegido). */
const mapCenter = ref<{ lat: number, lng: number, zoom: number } | null>(null)

/** El admin de asociación no puede cambiar el país: es el de su asociación. */
const isAssociationAdmin = [RoleSlug.ADMINISTRATOR_ASSOCIATION].includes(store.state.user.role.slug)

const associationCountry = computed(() => {
  // El storage ya trae el país de la asociación (va en el login); si no está,
  // se busca en la lista de iglesias de la sesión.
  const fromStorage = store.state.user?.user?.associationCountry
  if (fromStorage) {
    return fromStorage
  }
  const idAssociation = store.state.user?.user?.idAssociation
  return companies.value?.find(item => item.id === idAssociation)?.country ?? ''
})

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
    // Iglesia nueva: el país y la ubicación se completan con los datos de la
    // asociación y del usuario en sesión (el backend también los hereda).
    const user = store.state.user?.user

    company.value = {
      type: 'CHURCH',
      country: associationCountry.value,
      department: user?.person?.department ?? '',
      province: user?.person?.province ?? '',
      info: {
        contacts: [
          { id: uuidv4(), name: '', phone: '' }
        ]
      }
    }
  }

  // El admin de asociación trabaja siempre con el país de su asociación.
  if (isAssociationAdmin) {
    company.value.country = associationCountry.value
  }

  // Si la iglesia ya tiene departamento, el mapa abre en ese departamento.
  const found = departamentos.find(item => item.department === company.value?.department)
  mapCenter.value = found?.latitude !== undefined && found?.longitude !== undefined
    ? { lat: found.latitude, lng: found.longitude, zoom: 10 }
    : null

  tab.value = 'general'
  open()
}

/** Pestañas del formulario: siguiente y anterior. */
const TABS = ['general', 'location', 'contacts']

const next = () => {
  const index = TABS.indexOf(tab.value)
  if (index < TABS.length - 1) {
    tab.value = TABS[index + 1]
  }
}

const previous = () => {
  const index = TABS.indexOf(tab.value)
  if (index > 0) {
    tab.value = TABS[index - 1]
  }
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
