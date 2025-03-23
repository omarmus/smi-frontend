<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push(`/treasury/week/${entry.id}/${$route.params.expenseId}`)" />
      Diezmos y ofrendas - Sábado {{ day }} de {{ months[entry.month - 1] }}
    </h2>
    <div class="row">
      <div class="col-xs-12 col-sm-5" v-if="entry.state !== 'CLOSED'">
        <q-form
          v-if="formRender"
          class="q-gutter-md"
          @submit="addConcept"
          @reset="cleanEntryDetail"
          ref="myForm">
          <div class="col-xs-12">
            <q-btn-group spread outline>
              <q-btn
                :outline="type !== 'MEMBER'"
                padding="12px"
                color="primary"
                label="Persona"
                @click="type = 'MEMBER'"
                no-caps />
              <q-btn
                :outline="type !== 'CHURCH'"
                padding="10px"
                color="primary"
                label="Congregación"
                @click="type = 'CHURCH'"
                no-caps />
            </q-btn-group>
          </div>
          <div
            class="col-xs-12"
            id="entry-person"
            v-if="type === 'MEMBER'">
            <div class="popover-users">
              <q-field
                filled
                v-model="name.label"
                lazy-rules
                :loading="loadingState"
                :rules="[ val => !!val || 'Seleccione a una persona']"
                @click.stop.prevent="popoverUsers = !popoverUsers">
                <template v-slot:control>
                  <input
                    v-model="name.label"
                    class="self-center full-width no-outline no-border bg-transparent"
                    type="text"
                    @input="filterByUsers"
                    :placeholder="name?.label ? '' : 'Escriba un nombre'"
                    @click="popoverUsers = !popoverUsers">
                </template>

                <template v-slot:append>
                  <q-icon name="cancel" class="cursor-pointer" v-if="name?.label" @click="cleanUsers" />
                  <q-icon name="arrow_drop_down" class="cursor-pointer" />
                </template>
              </q-field>
              <div
                ref="elementUser"
                class="q-menu q-position-engine scroll q-menu--square"
                v-show="popoverUsers">
                <q-list v-if="users.length > 0">
                  <q-item
                    clickable
                    v-ripple
                    v-for="item in users"
                    :key="item.value"
                    @click="selectUser(item)">
                    <q-item-section>
                      <q-item-label>{{ item.label }}</q-item-label>
                      <q-item-label caption>
                        <strong class="text-secondary">{{ item.association ? item.association : memberType[item.type] }} - </strong>
                        {{ item.church }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-list v-else>
                  <div class="alert alert-info">
                    La persona que busca no está registrada
                  </div>
                  <q-item class="q-pt-none">
                    <q-item-section>
                      <q-btn
                        color="secondary"
                        label="Agregar como miembro de Escuela sabática"
                        no-caps
                        @click="saveUser(name.label, 'SYMPATHIZER')" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-btn
                        color="secondary"
                        label="Agregar como visita"
                        @click="saveUser(name.label, 'VISIT')" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-btn
                        color="warning"
                        label="Buscar en otra Asociación"
                        @click="saveUser(name.label, 'SEARCH')" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
          <div class="col-xs-12">
            <q-select
              filled
              label="Concepto"
              v-model="concept"
              use-input
              use-chips
              input-debounce="0"
              :options="conceptsFilter"
              @filter="filterDepartment"
              lazy-rules
              :rules="[ val => !!val || 'Seleccione el concepto']">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="row">
            <div class="col-xs-6 q-pr-xs" id="entry-value">
              <q-input
                filled
                label="Valor"
                v-model="value"
                lazy-rules
                :rules="[validation.decimal, validation.required]" />
            </div>
            <div class="col-xs-6">
              <q-select
                filled
                label="Fecha"
                v-model="date"
                :options="dates"
                :rules="[ val => !!val || 'Seleccione el concepto']" />
            </div>
          </div>
          <div class="col-xs-12">
            <q-input
              filled
              label="Observaciones"
              v-model="observation" />
          </div>
          <div
            class="col-xs-12"
            v-if="type === 'MEMBER'">
            <q-btn
              padding="10px"
              label="Agregar concepto"
              icon="add"
              color="warning"
              type="submit"
              no-caps
              class="full-width" />
          </div>
          <div v-if="type === 'MEMBER' && conceptsItems.length">
            <h3 class="text-warning treasury-subtitle">Concepto de donación</h3>
            <div class="q-table-simple q-table__container q-table--horizontal-separator column q-table--dense">
              <table class="q-table">
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left"><strong>Concepto</strong></th>
                    <th class="text-right"><strong>Valor</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in conceptsItems"
                    :key="item">
                    <td class="width-80">
                      <q-btn
                        size="sm"
                        icon="edit"
                        @click="editConcept(index)"
                        round
                        flat />
                      <q-btn
                        size="sm"
                        icon="delete"
                        @click="removeConcept(index)"
                        round
                        flat />
                    </td>
                    <td class="text-left">
                      {{ item.concept.label }}
                      <div class="treasury-observation">
                        {{ item.concept.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local' }} <span v-if="item.observation"> / {{ item.observation }}</span>
                      </div>
                    </td>
                    <td class="text-right">{{ item.value }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th class="text-left" colspan="2"><strong>Total</strong></th>
                    <th class="text-right"><strong>{{ totalConcept }}</strong></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="col-xs-12">
            <q-btn
              padding="10px"
              :label="idEntryDetail ? 'Actualizar recibo' : 'Guardar recibo'"
              color="primary"
              no-caps
              :disable="(conceptsItems.length === 0 && type === 'MEMBER') || loadingSend"
              @click="saveDetail"
              icon="check"
              :loading="loadingSend"
              class="full-width" />
            <q-btn
              v-if="idEntryDetail"
              type="reset"
              padding="10px"
              label="Cancelar actualización"
              no-caps
              icon="cancel"
              class="full-width q-mt-sm" />
          </div>
        </q-form>
      </div>
      <div class="col-xs-12 tithe-column" :class="{ 'col-sm-7': entry.state !== 'CLOSED', 'col-sm-12': entry.state === 'CLOSED' }">
        <h3 class="text-secondary treasury-subtitle" v-if="entry.state !== 'CLOSED'">Diezmos y ofrendas</h3>
        <div
          v-if="entriesDetails.length"
          class="q-table-simple q-table__container q-table--horizontal-separator column q-table--dense q-table--no-wrap">
          <table class="q-table" :class="{ 'treasury-table-data': entry.state === 'CLOSED' }">
            <thead>
              <tr>
                <th class="text-left" v-if="entry.state !== 'CLOSED'"></th>
                <th class="text-left"><strong>Nro. Boleta</strong></th>
                <th class="text-left"><strong>Nombre</strong></th>
                <th class="text-left" v-if="entry.state === 'CLOSED'"><strong>Detalle</strong></th>
                <th class="text-right"><strong>Valor</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in entriesDetails"
                :key="item.id">
                <td class="width-120" v-if="entry.state !== 'CLOSED'">
                  <q-btn
                    size="sm"
                    icon="edit"
                    round
                    flat
                    @click="editEntryDetails(item.id)" />
                  <q-btn
                    size="sm"
                    icon="delete"
                    round
                    flat
                    @click="removeEntryDetails(item.id)" />
                  <q-btn
                    v-if="item.type === 'MEMBER'"
                    size="sm"
                    icon="print"
                    round
                    flat
                    @click="generatePdf(item.id)" />
                </td>
                <td class="width-120">
                  <q-input
                    v-if="item.type === 'MEMBER'"
                    v-model="item.code"
                    dense
                    standout
                    debounce="500"
                    :disable="entry.state === 'CLOSED'"
                    @keyup="updateCode(item)" />
                </td>
                <td class="text-left">
                  <span v-if="item.type === 'MEMBER'">{{ item.user?.person?.fullname }}</span>
                  <strong class="text-primary" v-else>{{ item.department.name }}</strong>
                  <span class="treasury-observation" v-if="entry.state !== 'CLOSED'">
                    <strong v-if="item.type !== 'MEMBER'">{{ item.department.type === 'LOCAL' ? 'Iglesia local' : 'Asociación' }}</strong>
                    <span v-if="item.type !== 'MEMBER'"> - <q-icon name="today" /> {{ format(item.date) }}</span> {{ item.observations ? ` / ${item.observations}` : '' }}
                  </span>
                  <div class="q-ml-sm q-mt-xs">
                    <ul class="treasury-list-concepts" v-if="item.concepts?.length && entry.state !== 'CLOSED'">
                      <li
                        v-for="(concept, index) in item.concepts"
                        :key="index">
                        <strong class="text-warning">- {{ concept.concept.label }}: </strong>{{ concept.value }} / {{ concept.concept.type === 'LOCAL' ? 'Iglesia local' : 'Asociación' }} <span v-if="concept.observation"> - {{ concept.observation }}</span>
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="text-left" v-if="entry.state === 'CLOSED'">
                  <span class="treasury-observation" v-if="item.department">{{ item.department.type === 'LOCAL' ? 'Iglesia local' : 'Asociación' }}</span>
                  <span class="text-texto">{{ item.observations }}</span>
                  <div v-if="item.type !== 'MEMBER'"><q-icon name="today" /> {{ format(item.date) }}</div>
                  <ul class="treasury-list-concepts" v-if="item.concepts?.length">
                    <li
                      v-for="(concept, index) in item.concepts"
                      :key="index"
                      :class="{ 'treasury-line-bottom': item.concepts?.length > 1 && index !== item.concepts?.length - 1 }">
                      <span class="treasury-observation">{{ concept.concept.type === 'LOCAL' ? 'Iglesia local' : 'Asociación' }}</span>
                      <strong>{{ concept.concept.label }}: </strong>{{ concept.value }} <span v-if="concept.observation"> - {{ concept.observation }}</span>
                    </li>
                  </ul>
                </td>
                <td class="text-right total">
                  <span>{{ item.value }}</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left" colspan="2"></th>
                <th class="text-left"><strong>TOTAL</strong></th>
                <th class="text-right"><strong>{{ totalEntries.toFixed(2) }}</strong></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-else class="treasury-empty">Sin registros</div>
        <div class="text-right q-pt-xs q-gutter-xs">
          <q-btn
            :disable="entriesDetails.length === 0"
            label="Imprimir todos los recibos"
            no-caps
            icon="print"
            padding="10px 20px"
            class="btn-close-month"
            @click="generatePdf(null)" />
        </div>
      </div>
    </div>
    <q-dialog v-model="dialogUserSearch" persistent transition-show="scale" transition-hide="scale">
      <UserSearch
        v-if="dialogUserSearch"
        :value="valueSearch"
        v-model:name="name" />
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { debounce } from 'quasar'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { Confirm } from 'boot/modal'
import { message } from 'boot/message'
import { Result } from '../../../components/entities/Entity'
import { Concept, EntryDetail, Entry, Option } from '../../../components/entities/Entry'
import { Department, DepartmentOption } from '../../../components/entities/Department'
import { User } from '../../../components/entities/User'
import { months, days, getWeeks, format, normalize } from '../../../components/plugins/datetime'
import { useStore } from '../../../store'
import validation from '../../../components/plugins/validation'
import { createPdf } from '../../../components/plugins/util'
import UserSearch from './UserSearch.vue'

const store = useStore()

const memberType = {
  member: 'Miembro',
  sympathizer: 'Miembro Esc. sabática',
  visit: 'Visita'
}

// data entry detail
const idEntryDetail = ref<number | null>(null)
const type = ref<string>('MEMBER')
const name = ref<Option>({ value: '', label: '' })
const concept = ref<Option>()
const value = ref<number>()
const date = ref<Option>()
const dates = ref<Option[]>([])
const observation = ref<string>()
const popoverUsers = ref<boolean>(false)
const loadingState = ref<boolean>(false)
const loadingSend = ref<boolean>(false)
const users = ref<Option>([])
const usersChurch = ref([])
const concepts = ref<DepartmentOption[]>([])
const conceptsFilter = ref<DepartmentOption[]>([])
const conceptsItems = ref<[Concept]>([])
const index = ref<number>(-1)
const entriesDetails = ref<[EntryDetail]>([])
const entry = ref<Entry>()
const day = ref<number>()
const formRender = ref<boolean>(true)
const myForm = ref(null)
const dialogUserSearch = ref<boolean>(false)
const valueSearch = ref<string>('')
const elementUser = ref<HTMLDivElement>()

const route = useRoute()
const { entryId, week } = route.params

const idCompany = store.state.user?.user?.company.id as number

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
  const weeks = getWeeks(entry.value.year, entry.value.month)
  const item = weeks.find(item => item.week === parseInt(week))
  day.value = item.day
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(`${entry.value.year}-${entry.value.month}-${day.value as string} 00:00:00`)
    const daySub = new Date(currentDate.setDate(currentDate.getDate() - i))
    dates.value.push({
      value: normalize(format(daySub.toString())),
      label: `${days[daySub.getDay()]} ${daySub.getDate()}`
    })
  }
  date.value = dates.value[0]
}

const getEntryDetails = async () => {
  const items = await http.get(`entriesdetails?id_entry=${entry.value.id as string}&week=${week as string}&order=-entry_detail.id`) as Result<EntryDetail>
  entriesDetails.value = items.rows
}

const getDepartments: DepartmentOption[] = async () => {
  const items = await http.get('departments?order=id') as Result<Department>
  return items.rows.map(item => ({
    value: item.id,
    type: item.type,
    label: item.name,
    group: item.group
  }))
}

const getUsers = async (query: string, association?: boolean) => {
  let url = 'users?order=fullname'
  if (query) {
    if (association) {
      url += `&fullname=${query}&all_association=true`
    } else {
      url += `&fullname=${query}&all_churchs=true`
    }
  } else {
    url += `&id_company=${idCompany}`
  }
  const items = await http.get(url, false) as Result<User>
  return items.rows.map(item => ({
    value: item.id,
    label: `${item.person.fullname as string}`,
    church: `${item.company.name}`,
    association: association ? item.association?.name as string : null,
    type: item.type?.toLowerCase()
  }))
}

const groupsChurch = ['TITHES', 'SCOOP', 'SECOND', 'TITHE']
const filterDepartment = (val: string, update: unknown) => {
  update(() => {
    if (val === '') {
      conceptsFilter.value = type.value === 'MEMBER' ? concepts.value : concepts.value.filter(item => !groupsChurch.includes(item.group))
    } else {
      const needle = val.toLowerCase()
      conceptsFilter.value = concepts.value.filter((item: { label: string }) => item.label.toLowerCase().indexOf(needle) > -1)
    }
  })
}

const saveDetail = async () => {
  if (type.value !== 'MEMBER') {
    const success = await myForm.value.validate() // eslint-disable-line
    if (!success) {
      return false
    }
  }
  if (loadingSend.value) return false
  loadingSend.value = true
  const item: EntryDetail = {
    id: idEntryDetail.value,
    concepts: conceptsItems.value,
    type: type.value,
    id_entry: entry.value.id,
    date: date.value.value,
    week: week as number
  }
  if (type.value === 'MEMBER') {
    item.value = totalConcept.value
    item.id_user = name.value.value
    if (!item.id_user) {
      message.warning('No seleccionó correctamente el usuario')
      return false
    }
  } else {
    item.observations = observation.value
    item.value = value.value
    item.id_department = concept.value.value
    if (!item.id_department) {
      message.warning('No seleccionó correctamente el departamento')
      return false
    }
  }
  const idDepartmentLocal = concepts.value.find(item => item.group === 'YOUNG' && item.type === 'LOCAL').value
  const idDepartmentGlobal = concepts.value.find(item => item.group === 'YOUNG' && item.type === 'GLOBAL').value
  if (type.value !== 'MEMBER' && !idEntryDetail.value && [idDepartmentLocal, idDepartmentGlobal].includes(item.id_department)) {
    Confirm('¿Desea dividir la ofrenda de jóvenes para la Asociación e Iglesia local?', async () => {
      item.value = Number(item.value) / 2
      item.id_department = idDepartmentLocal
      item.split = true
      await http.post('entriesdetails', item)
      item.id_department = idDepartmentGlobal
      await http.post('entriesdetails', item)
      await getEntryDetails()
      loadingSend.value = false
    }, async () => {
      item.split = false
      await http.post('entriesdetails', item)
      await getEntryDetails()
      loadingSend.value = false
    }, 'Ofrenda de Jóvenes', 'Si', 'No')
    await cleanEntryDetail()
  } else {
    if (idEntryDetail.value) {
      await http.put(`entriesdetails/${idEntryDetail.value}`, item)
    } else {
      await http.post('entriesdetails', item)
    }
    loadingSend.value = false
    await getEntryDetails()
    await cleanEntryDetail()
  }
}

const cleanEntryDetail = async () => {
  myForm.value.resetValidation() // eslint-disable-line
  formRender.value = false
  users.value = usersChurch.value
  await nextTick(() => {
    idEntryDetail.value = null
    concept.value = null
    observation.value = ''
    value.value = ''
    index.value = -1
    conceptsItems.value = []
    name.value = { value: '', label: '' }
    formRender.value = true
    date.value = dates.value[0]
  })
}

const editEntryDetails = async (id: number) => {
  const item = await http.get(`entriesdetails/${id}`) as EntryDetail
  type.value = item.type
  idEntryDetail.value = item.id

  if (type.value === 'MEMBER') {
    name.value = { value: item.user.id, label: item.user.person.fullname }
    item.id_user = name.value.value
    conceptsItems.value = item.concepts
  } else {
    observation.value = item.observation
    value.value = item.value
    date.value = dates.value.find(d => d.value === normalize(format(item.date)))
    concept.value = { value: item.department.id, label: item.department.name, type: item.department.type }
    item.id_department = concept.value.value
  }
}

const removeEntryDetails = (id: number) => {
  Confirm('¿Desea eliminar el registro?', async () => {
    await http.delete(`entriesdetails/${id}`)
    await getEntryDetails()
  }, null, 'Eliminar', 'Si', 'No')
}

const addConcept = () => {
  const item: Concept = {
    concept: concept.value,
    observation: observation.value,
    value: value.value
  }
  if (index.value > -1) {
    conceptsItems.value[index.value] = item
  } else {
    conceptsItems.value.push(item)
  }
  concept.value = null
  observation.value = ''
  value.value = ''
  index.value = -1
}
const editConcept = (id: number) => {
  const item = conceptsItems.value[id]
  concept.value = item.concept
  observation.value = item.observation
  value.value = item.value
  date.value = dates.value[0]
  index.value = id
}
const removeConcept = (index: number) => {
  conceptsItems.value.splice(index, 1)
}

const totalConcept = computed(() => {
  let total = 0
  for (const item of conceptsItems.value) {
    total += parseFloat(item.value)
  }
  return total
})
const totalEntries = computed(() => {
  let total = 0
  for (const item of entriesDetails.value) {
    total += parseFloat(item.value)
  }
  return total
})

const updateCode = async (item: EntryDetail) => {
  if (item?.code) {
    await http.put(`entriesdetails/${item.id as string}`, { code: item.code })
  }
}

const generatePdf = async (idEntryDetail?: number) => {
  const url = idEntryDetail ? `entries/pdf/detail/${idEntryDetail as string}` : `entries/pdf/details/${entry.value.id as string}/${week as string}`
  const pdf = await http.get(url) as string
  createPdf(pdf, `invoice-${Date.now()}.pdf`)
}

watch(concept, (val: string) => {
  if (val) {
    void nextTick(() => {
      document.querySelector('#entry-value input').focus()
    })
  }
})

// select customize
const filterByUsers = debounce(async () => {
  if (name.value?.label === '') {
    users.value = usersChurch.value
    popoverUsers.value = true
  } else {
    loadingState.value = true
    users.value = await getUsers(name.value.label)
    void nextTick(() => {
      loadingState.value = false
      popoverUsers.value = true
    })
  }
}, 400)

const selectUser = (item: Option) => {
  name.value = item
  popoverUsers.value = false
}

const cleanUsers = () => {
  name.value = { label: '', value: '' }
  users.value = usersChurch.value
  popoverUsers.value = false
}

const saveUser = async (val: string, type: string) => {
  if (type !== 'SEARCH') {
    if (val.length > 3 && type) {
      const user = await http.post('users/new', {
        type,
        fullname: val,
        id_company: idCompany
      }) as User
      name.value = { value: user.id, label: user.person.fullname }
      popoverUsers.value = false
    }
  } else {
    dialogUserSearch.value = false
    void nextTick(() => {
      valueSearch.value = val
      dialogUserSearch.value = true
      popoverUsers.value = false
    })
  }
}

const handleClickOutside = (e: Event) => {
  if (elementUser.value && !elementUser.value.contains(e.target)) {
    popoverUsers.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

onBeforeMount(async () => {
  concepts.value = await getDepartments() as DepartmentOption[]
  conceptsFilter.value = concepts.value

  usersChurch.value = await getUsers()
  users.value = usersChurch.value

  await getEntry()
  await getEntryDetails()
})

</script>

<style lang="scss">
.width-input {
  width: 100%;
  max-width: 120px;
}
.treasury-line-bottom {
  border-bottom: 1px solid #ddd;
}
.popover-users {
  position: relative;

  .q-menu {
    background-color: white;
    position: absolute !important;
    left: 0;
    right: 0;
    top: 56px;
    visibility: visible;
    z-index: 100;
  }
}
</style>
