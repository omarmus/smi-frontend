<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Miembros y usuarios
    </h2>
    <CrudTable
      :columns="columns"
      :filters="filters"
      :open-filter="true"
      :url="url"
      :selection="selected"
      label-selection="person.fullname">
      <template v-slot:buttons="props">
        <q-btn
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openModal(props.open)"
        >
          Agregar
          <q-tooltip>Agregar registro</q-tooltip>
        </q-btn>
        <q-btn-dropdown
          icon="print"
          no-caps
          label="Imprimir"
          class="q-ml-none q-mr-xs"
          padding="6px 7px 6px 9px">
          <q-list>
            <q-item clickable v-close-popup @click="print(props.getSelected())">
              <q-item-section>
                <q-item-label>Imprimir seleccionados</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="printAll">
              <q-item-section>
                <q-item-label>Imprimir todo</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>
      <template v-slot:form="props">
        <q-card class="modal-lg">
          <q-toolbar class="q-pa-md">
            <q-icon name="people" size="md" />
            <q-toolbar-title>
              {{ user.id ? 'Editar' : 'Agregar' }} miembro
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="props.close()" />
          </q-toolbar>
          <q-tabs
            v-model="tab"
            inline-label
            no-caps
            dense
            align="justify"
            indicator-color="warning"
            class="bg-secondary text-white"
            :breakpoint="0"
          >
            <q-tab name="personal" icon="person" label="Datos personales" />
            <q-tab name="afiliacion" icon="manage_accounts" label="Datos de afiliación" />
            <q-tab name="cargos" icon="badge" label="Cargos" v-if="user.id" />
            <q-tab name="usuario" icon="contact_page" label="Datos de usuario" />
          </q-tabs>
          <q-separator />
          <q-form @submit="save(props)" ref="myForm">
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="personal">
                <div class="text-h6 text-warning q-mb-md">Datos personales</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-md-4">
                    <q-input
                      filled
                      label="Nombre(s)"
                      v-model="user.person.firstName"
                      :rules="[validation.required]"
                      @keyup="setUsername" />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-input
                      filled
                      label="Primer apellido"
                      v-model="user.person.lastName"
                      :rules="[validation.required]"
                      @keyup="setUsername" />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-input
                      filled
                      label="Segundo apellido"
                      v-model="user.person.secondLastName" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-select
                      filled
                      v-model="user.person.documentType"
                      :options="documentOptions"
                      label="Tipo de documento"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Número de documento"
                      v-model="user.person.documentNumber"
                      @keyup="setPasword" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Lugar de nacimiento"
                      v-model="user.person.birthplaceCountry" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Fecha de nacimiento"
                      v-model="user.person.birthday"
                      :rules="[validation.date]">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="birthdayDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale">
                            <q-date
                              v-model="user.person.birthday"
                              minimal
                              default-view="Years"
                              default-year-month="1980/01"
                              mask="DD/MM/YYYY"
                              :options="validateDateOptions"
                              >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-3 q-pt-md">
                    <q-radio v-model="user.person.gender" val="MALE" label="Hombre" />
                    <q-radio v-model="user.person.gender" val="FEMALE" label="Mujer" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-select
                      filled
                      v-model="user.person.civilStatus"
                      :options="civilOptions"
                      label="Estado civil"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-select
                      filled
                      label="Nacionalidad"
                      v-model="user.person.nationality"
                      :options="nationalitiesFilter"
                      option-value="nationality"
                      option-label="nationality"
                      use-input
                      input-debounce="0"
                      @filter="filterFn"
                      emit-value
                      map-options
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-select
                      filled
                      v-model="user.person.occupation"
                      :options="occupationOptions"
                      label="Ocupación"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      v-model="user.person.education"
                      :options="educationOptions"
                      label="Educación"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Teléfono(s)"
                      v-model="user.person.phone" />
                  </div>
                  <!-- <div class="col-xs-12 col-md-2">
                    <q-input
                      filled
                      label="Celular"
                      v-model="user.person.mobile"
                      :rules="[validation.required]" />
                  </div> -->
                  <div class="col-xs-12 col-md-5">
                    <q-input
                      filled
                      label="Dirección"
                      v-model="user.person.address" />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="afiliacion">
                <div class="text-h6 text-warning q-mb-md">Datos de afiliación</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      v-model="user.company.id"
                      :options="companiesFilter"
                      label="Iglesia actual"
                      option-value="id"
                      option-label="name"
                      emit-value
                      map-options
                      :rules="[validation.required]"
                      use-input
                      input-debounce="0"
                      @filter="filterCompaniesFn" />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      v-model="user.type"
                      :options="memberTypeOptions"
                      label="Tipo de membresía"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-select
                      filled
                      v-model="user.person.memberStatus"
                      :options="memberStateOptions"
                      clearable
                      label="Estado de la membresía"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-select
                      filled
                      v-model="user.person.origin"
                      :options="originOptions"
                      label="Procedencia religiosa"
                      emit-value
                      map-options />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Fecha de bautizmo"
                      v-model="user.person.christeningDate"
                      :rules="[validation.date]">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="christeningDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale">
                            <q-date
                              v-model="user.person.christeningDate"
                              minimal
                              mask="DD/MM/YYYY"
                              :options="validateDateOptions"
                              >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Bautizado por"
                      v-model="user.person.baptismPastor" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Texto bíblico"
                      v-model="user.person.biblicalText" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Lugar de bautizmo"
                      v-model="user.person.christeningPlace" />
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Fecha de aceptación"
                      v-model="user.person.acceptanceDate"
                      :rules="[validation.date]">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="acceptanceDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale">
                            <q-date
                              v-model="user.person.acceptanceDate"
                              minimal
                              mask="DD/MM/YYYY"
                              :options="validateDateOptions"
                              >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="F. aceptación/Iglesia local"
                      v-model="user.person.acceptanceLocalDate"
                      :rules="[validation.date]">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="acceptanceLocalDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale">
                            <q-date
                              v-model="user.person.acceptanceLocalDate"
                              minimal
                              mask="DD/MM/YYYY"
                              :options="validateDateOptions"
                              >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-3">
                    <q-input
                      filled
                      label="Fecha dado/a de baja"
                      v-model="user.person.dischargeDate"
                      :rules="[validation.date]">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="dischargeDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale">
                            <q-date
                              v-model="user.person.dischargeDate"
                              minimal
                              mask="DD/MM/YYYY"
                              :options="validateDateOptions"
                              >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-12">
                    <q-input
                      filled
                      label="Observaciones"
                      v-model="user.person.observations" />
                  </div>
                </div>
              </q-tab-panel>
              <q-tab-panel name="cargos" v-if="user.id">
                <div class="text-h6 text-warning q-pb-md">Cargos ocupados en la Iglesia</div>
                <Positions :user="user" v-if="user" />
              </q-tab-panel>
              <q-tab-panel name="usuario">
                <div class="text-h6 text-warning">Datos de usuario</div>
                <div class="row q-col-gutter-sm q-mb-md">
                  <div class="col-xs-12 col-md-4">
                    <q-input
                      filled
                      label="Usuario"
                      v-model="user.username"
                      :rules="[validation.required]" />
                  </div>
                  <div
                    class="col-xs-12 col-md-4"
                    v-if="!user.id">
                    <q-input
                      filled
                      :readonly="disablePassword"
                      label="Contraseña"
                      :type="viewPassword ? 'password' : 'text'"
                      v-model="user.password"
                      :rules="disablePassword ? null : [validation.required]">
                      <template v-slot:append>
                        <q-icon
                          :name="viewPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="viewPassword = !viewPassword"
                          color="primary"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-md-4">
                    <q-input
                      filled
                      label="Correo electrónico"
                      v-model="user.email"
                      :rules="[validation.email]" />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
            <q-card-actions align="right">
              <q-btn v-if="tab !== 'personal'" label="Anterior" icon="navigate_before" @click="previous" />
              <q-btn v-if="tab !== 'usuario'" label="Siguiente" icon="navigate_next" @click="next" />
              <q-btn label="Cancelar" icon="cancel" v-close-popup />
              <q-btn type="submit" label="Guardar" icon="check" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr class="crud-table-checkbox" :class="{ active: props.selected }">
          <q-td v-if="selected" class="crud-table-selected">
            <q-checkbox v-model="props.selected" @click="props.setSelected(props)" />
          </q-td>
          <q-td auto-width>
            <q-btn
              class="q-ma-xs"
              :color="props.row.expand ? 'secondary' : 'positive'"
              flat
              round
              @click="props.row.expand = !props.row.expand"
              :icon="props.row.expand ? 'remove_circle' : 'add_circle'">
              <q-tooltip>{{ props.row.expand ? 'Ocultar información' : 'Mostrar información' }}</q-tooltip>
            </q-btn>
            <q-toggle
              v-model="props.row.state"
              color="primary"
              false-value="INACTIVE"
              true-value="ACTIVE"
              @click="changeState(props.update, props.row, `${url}/${props.row.id}`)" />
            <q-btn-dropdown
              color="primary"
              dropdown-icon="more_vert"
              flat
              rounded>
              <q-list>
                <q-item clickable v-close-popup @click="openAddPhoto(props.row)">
                  <q-item-section avatar class="datatable-menu-item">
                    <q-icon name="photo_camera" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Agregar foto</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openModal(props.open, props.row.id)">
                  <q-item-section avatar class="datatable-menu-item">
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="deleteItem(props.update, `${url}/${props.row.id}`)">
                  <q-item-section avatar class="datatable-menu-item">
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="print([props.row])">
                  <q-item-section avatar class="datatable-menu-item">
                    <q-icon name="print" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Imprimir</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-tooltip>Más opciones</q-tooltip>
            </q-btn-dropdown>
          </q-td>
          <q-td>{{ props.row.person?.fullname }}</q-td>
          <!-- <q-td>{{ props.row.username }}</q-td> -->
          <!-- <q-td>{{ props.row.email }}</q-td> -->
          <q-td>{{ props.row.company?.name }}</q-td>
          <q-td class="text-left">
            <q-chip
              square
              dense
              :color="labels[props.row.type].color"
              :text-color="labels[props.row.type].textColor"
              :label="labels[props.row.type].label"
            />
            <span v-if="props.row.person.memberStatus">
              <q-chip
                square
                dense
                :color="labels[props.row.person.memberStatus].color"
                :text-color="labels[props.row.person.memberStatus].textColor"
                :label="labels[props.row.person.memberStatus].label"
              />
            </span>
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
        <q-tr v-show="props.row.expand">
          <q-td colspan="100%" class="member-info-container">
            <MemberInfo v-if="props.row.expand" :id="props.row.id" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
    <q-dialog v-model="dialogMemberPhoto" persistent transition-show="scale" transition-hide="scale">
      <MemberPhoto v-if="dialogMemberPhoto" :id="idUser" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Company } from '../../../components/entities/Company'
import { User } from '../../../components/entities/User'
import { Result } from '../../../components/entities/Entity'
import { format, normalize } from '../../../components/plugins/datetime'
import { getCountries } from '../../../components/plugins/countries'
import { deleteItem, changeState } from '../../../components/plugins/crud'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import MemberInfo from './MemberInfo.vue'
import MemberPhoto from './MemberPhoto.vue'
import Positions from './Positions.vue'
import validation from '../../../components/plugins/validation'
import {
  originOptions,
  educationOptions,
  occupationOptions,
  civilOptions,
  documentOptions,
  memberStateOptions,
  memberTypeOptions
} from '../../../components/plugins/params'
import { createPdf } from '../../../components/plugins/util'

const url = 'users'

const columns = [
  { label: 'Acciones', align: 'center' },
  // { label: 'Cambiar estado', align: 'center' },
  { label: 'Nombre completo', align: 'left', name: 'person.fullname', sortable: true },
  // { label: 'Nombre de usuario', align: 'left', name: 'user.username', sortable: true },
  // { label: 'Correo electrónico', name: 'user.email', sortable: true },
  { label: 'Iglesia', align: 'left', name: 'company.id', sortable: true },
  { label: 'Tipo/estado de membresia', align: 'left', name: 'user.type', sortable: true },
  { label: 'Estado del usuario', align: 'right', name: 'user.state', sortable: true }
]

const filters = ref([
  {
    label: 'Iglesia/Grupo',
    name: 'id_company',
    type: 'select',
    options: []
  },
  {
    label: 'Buscar por nombre completo',
    name: 'fullname',
    type: 'input'
  },
  {
    label: 'Buscar por nombre de usuario',
    name: 'username',
    type: 'input'
  },
  {
    label: 'Tipo de membresía',
    name: 'type',
    type: 'select',
    options: memberTypeOptions
  },
  {
    label: 'Estado de la membresía',
    name: 'memberStatus',
    type: 'select',
    options: [
      { label: 'TODOS LOS MIEMBROS ACTIVOS', value: 'ALL_ACTIVE' },
      { label: 'BAUTIZADO', value: 'BAPTIZED' },
      { label: 'RECIBIMIENTO', value: 'RECEPTION' },
      { label: 'TRANSFERENCIA', value: 'TRANSFER' },
      { label: 'TODOS LOS MIEMBROS INACTIVOS', value: 'ALL_INACTIVE' },
      { label: 'EXCLUSION', value: 'EXCLUSION' },
      { label: 'RENUNCIA', value: 'RESIGNATION' },
      { label: 'MUERTE', value: 'DEATH' }
    ]
  },
  {
    label: 'Ocupación',
    name: 'occupation',
    type: 'select',
    options: occupationOptions
  },
  {
    label: 'Estado del usuario',
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
])

const labels = {
  MEMBER: { color: 'positive', textColor: 'white', label: 'MIEMBRO' },
  SYMPATHIZER: { color: 'info', textColor: 'white', label: 'MIEMBRO E. SABÁTICA' },
  VISIT: { color: 'warning', textColor: 'white', label: 'VISITA' },
  ACTIVE: { color: 'positive', textColor: 'white', label: 'ACTIVO' },
  INACTIVE: { color: 'warning', textColor: 'white', label: 'INACTIVO' },
  BAPTIZED: { color: 'positive', textColor: 'white', label: 'BAUTIZADO' },
  RECEPTION: { color: 'positive', textColor: 'white', label: 'RECIBIMIENTO' },
  TRANSFER: { color: 'positive', textColor: 'white', label: 'TRANSFERENCIA' },
  EXCLUSION: { color: 'negative', textColor: 'white', label: 'EXCLUSION' },
  RESIGNATION: { color: 'negative', textColor: 'white', label: 'RENUNCIA' },
  DEATH: { color: 'negative', textColor: 'white', label: 'FALLECIDO' }
}

const tab = ref('personal')
const nationalities = getCountries()
const nationalitiesFilter = ref(nationalities)
const user = ref<User>()
const idUser = ref<number>()
const companies = ref<Company[]>()
const companiesFilter = ref<Company[]>()
const disablePassword = ref<boolean>(false)
const myForm = ref(null)
const viewPassword = ref<boolean>(true)
const dialogMemberPhoto = ref<boolean>(false)
const selected = ref<boolean>(true)

const openModal = async (open: () => void, id?: number) => {
  tab.value = 'personal'
  if (id) {
    user.value = await http.get(`${url}/${id}`) as User
    user.value.person.birthday = format(user.value.person.birthday as string)
    user.value.person.christeningDate = format(user.value.person.christeningDate as string)
    user.value.person.acceptanceDate = format(user.value.person.acceptanceDate as string)
    user.value.person.acceptanceLocalDate = format(user.value.person.acceptanceLocalDate as string)
    user.value.person.dischargeDate = format(user.value.person.dischargeDate as string)
  } else {
    viewPassword.value = false
    user.value = {
      username: '',
      person: {
        firstName: '',
        lastName: '',
        nationality: 'BOLIVIANA',
        occupation: 'NO DETERMINADO',
        education: 'NO DETERMINADO',
        origin: 'NO DETERMINADO'
      },
      company: {
        name: ''
      }
    }
  }
  open()
}

const save = async (crud: { update: () => void, close: () => void }) => {
  if (!user.value.person.firstName || !user.value.person.lastName) {
    tab.value = 'personal'
    setTimeout(() => {
      myForm.value.validate() // eslint-disable-line
    }, 300)
    return
  }
  if (!user.value.company.id) {
    tab.value = 'afiliacion'
    setTimeout(() => {
      myForm.value.validate() // eslint-disable-line
    }, 300)
    return
  }
  if (!user.value.username || (!user.value.id && !user.value.password)) {
    tab.value = 'usuario'
    setTimeout(() => {
      myForm.value.validate() // eslint-disable-line
    }, 300)
    return
  }
  user.value.person.fullname = `${user.value.person.firstName} ${user.value.person.lastName} ${user.value.person.secondLastName as string}`
  user.value.person.birthday = normalize(user.value.person.birthday as string)
  user.value.person.christeningDate = normalize(user.value.person.christeningDate as string)
  user.value.person.acceptanceDate = normalize(user.value.person.acceptanceDate as string)
  user.value.person.acceptanceLocalDate = normalize(user.value.person.acceptanceLocalDate as string)
  user.value.person.dischargeDate = normalize(user.value.person.dischargeDate as string)
  if (user.value?.id) {
    await http.put(`${url}/${user.value.id}`, user.value)
    message.success('¡Registro actualizado!')
  } else {
    user.value.state = 'INACTIVE'
    await http.post(url, user.value)
    message.success('¡Registro creado exitósamente!')
  }
  crud.update()
  crud.close()
}

const print = async (items: User[]) => {
  if (items.length === 0) {
    return message.warning('Debe seleccionar por lo menos un registro para poder imprimir.')
  }
  const pdf = await http.post('users/print', { ids: items.map(item => item.id) }) as string
  createPdf(pdf, `kardex-${Date.now()}.pdf`)
}

const printAll = async () => {
  const pdf = await http.post('users/print', { ids: [] }) as string
  createPdf(pdf, `kardex-${Date.now()}.pdf`)
}

const openAddPhoto = (item: User) => {
  dialogMemberPhoto.value = false
  idUser.value = 0
  void nextTick(() => {
    dialogMemberPhoto.value = true
    idUser.value = item.id
  })
}

const now = new Date()

const validateDateOptions = (date) => {
  return date <= `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
}

const next = () => {
  const tabsNext: Record<string, string> = {
    personal: 'afiliacion',
    afiliacion: 'cargos',
    cargos: 'usuario'
  }
  tab.value = tabsNext[tab.value]
}

const previous = () => {
  const tabsNext: Record<string, string> = {
    afiliacion: 'personal',
    cargos: 'afiliacion',
    usuario: 'cargos'
  }
  tab.value = tabsNext[tab.value]
}

const filterFn = (val: string, update: () => void) => {
  if (val === '') {
    update(() => (nationalitiesFilter.value = nationalities))
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    nationalitiesFilter.value = nationalities.filter(v => v.nationality.toLowerCase().indexOf(needle) > -1)
  })
}

const filterCompaniesFn = (val: string, update: () => void) => {
  if (val === '') {
    update(() => (companiesFilter.value = companies.value))
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    companiesFilter.value = companies.value.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
  })
}

const setUsername = () => {
  user.value.username = (user.value.person.firstName?.length ? user.value.person.firstName.charAt(0).toLowerCase() : '') + user.value.person.lastName?.toLowerCase()
}

const setPasword = () => {
  user.value.password = user.value.person.documentNumber
}

onMounted(async () => {
  const items = await http.get('companies') as Result<Company>
  companies.value = items.rows.filter(item => ['CHURCH', 'GROUP'].includes(item.type))
  companiesFilter.value = items.rows.filter(item => ['CHURCH', 'GROUP'].includes(item.type))
  filters.value[0].options = companies.value.map((item: Company) => ({ label: item.name, value: item.id, type: item.type }))
})
</script>
