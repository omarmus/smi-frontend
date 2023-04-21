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
            v-if="type === 'MEMBER'">
            <q-select
              id="entry-person"
              filled
              v-model="name"
              :placeholder="name ? '' : 'Escriba un nombre'"
              use-input
              use-chips
              :input-debounce="300"
              @new-value="createValue"
              :options="users"
              @filter="filterUsers"
              lazy-rules
              :rules="[ val => !!val || 'Seleccione a una persona']"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>
                      <strong class="text-secondary">{{ scope.opt.association ? scope.opt.association : memberType[scope.opt.type] }} - </strong>
                      {{ scope.opt.church }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item dense>
                  <q-item-section>
                    La persona que busca no está registrada
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-btn
                      color="secondary"
                      label="Agregar como miembro de escuela sabática"
                      no-caps
                      @click="enterEventPerson('SYMPATHIZER')" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-btn
                      color="secondary"
                      label="Agregar como visita"
                      no-caps
                      @click="enterEventPerson('VISIT')" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-btn
                      color="warning"
                      label="Buscar en otra Asociación"
                      no-caps
                      @click="enterEventPerson('SEARCH')" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
              :disable="conceptsItems.length === 0 && type === 'MEMBER'"
              @click="saveDetail"
              icon="check"
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
                <th class="text-right"><strong>{{ totalEntries }}</strong></th>
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
        :done="doneSearch"
        v-model:name="name" />
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { Confirm } from 'boot/modal'
import { Result } from '../../../components/entities/Entity'
import { Concept, EntryDetail, Entry } from '../../../components/entities/Entry'
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
  sympathizer: 'Simpatizante',
  visit: 'Visita'
}

interface Option {
  value: string
  label: string
}

// data entry detail
const idEntryDetail = ref<number | null>(null)
const type = ref<string>('MEMBER')
const name = ref<{ label: string, value: number }>()
const concept = ref<{ label: string, value: number, type: string }>()
const value = ref<number>()
const date = ref<Option>()
const dates = ref<Option[]>([])
const observation = ref<string>()

const users = ref([])
const typeUser = ref<string>()
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
const doneSearch = ref(() => undefined)
const updateFilter = ref()

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

const createValue = async (val: string, done: () => void) => {
  if (typeUser.value !== 'SEARCH') {
    if (val.length > 3 && typeUser.value) {
      const user = await http.post('users/new', {
        type: typeUser.value,
        fullname: val,
        id_company: idCompany
      }) as User
      done(val, 'add-unique')
      name.value = { value: user.id, label: user.person.fullname }
    }
  } else {
    dialogUserSearch.value = false
    void nextTick(() => {
      valueSearch.value = val
      doneSearch.value = done
      dialogUserSearch.value = true
    })
  }
}

const enterEventPerson = (type: string) => {
  typeUser.value = type
  const element = document.querySelector('#entry-person input')
  element.dispatchEvent(new KeyboardEvent('keydown', {
    bubbles: true, cancelable: true, keyCode: 13
  }))
}

const filterUsers = (val: string, update: unknown) => {
  updateFilter.value = update
  update(async () => {
    if (val === '') {
      users.value = usersChurch.value
    } else {
      users.value = await getUsers(val)
    }
  })
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
  } else {
    item.observations = observation.value
    item.value = value.value
    item.id_department = concept.value.value
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
    }, async () => {
      item.split = false
      await http.post('entriesdetails', item)
      await getEntryDetails()
    }, 'Ofrenda de Jóvenes', 'Si', 'No')
    await cleanEntryDetail()
  } else {
    if (idEntryDetail.value) {
      await http.put(`entriesdetails/${idEntryDetail.value}`, item)
    } else {
      await http.post('entriesdetails', item)
    }
    await getEntryDetails()
    await cleanEntryDetail()
  }
}

const cleanEntryDetail = async () => {
  myForm.value.resetValidation() // eslint-disable-line
  formRender.value = false
  await nextTick(() => {
    idEntryDetail.value = null
    concept.value = null
    observation.value = ''
    value.value = ''
    index.value = -1
    conceptsItems.value = []
    name.value = null
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
  console.log(item)
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
</style>
