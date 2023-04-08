<template>
  <div class="container" v-if="expense">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push(`/treasury/entryexpense/${entry.id}/${$route.params.expenseId}`)" />
      Gastos - {{ months[expense.month - 1] }}
      <span class="text-warning" v-if="expense.state === 'CLOSED'"> CERRADO</span>
      <span class="subtitle">Total: {{ totalExpenses }} {{ $store.state.user?.user.company.money }}</span>
    </h2>
    <div class="row">
      <div class="col-xs-12 col-sm-5" v-if="expense.state !== 'CLOSED'">
        <q-form
          v-if="formRender"
          @submit="saveDetail"
          @reset="cleanExpenseDetail"
          class="q-gutter-md">
          <div class="col-xs-12">
            <q-btn-group spread outline>
              <q-btn
                :outline="type !== 'LOCAL'"
                padding="12px"
                color="primary"
                label="Iglesia local"
                @click="type = 'LOCAL'"
                no-caps />
              <q-btn
                :outline="type !== 'GLOBAL'"
                padding="10px"
                color="primary"
                label="Asociación"
                @click="type = 'GLOBAL'"
                no-caps />
            </q-btn-group>
          </div>
          <div class="col-xs-12">
            <q-select
              filled
              label="Departamento"
              v-model="form.idDepartment"
              use-input
              use-chips
              input-debounce="0"
              :options="departmentsFilter"
              @filter="filterDepartment"
              lazy-rules
              :rules="[ val => !!val || 'Seleccione el departamento']">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section class="treasury-department-item">
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.type }}</q-item-label>
                    <!-- <span class="treasury-department-total">{{ scope.opt.total }} {{ $store.state.user?.user.company.money }}</span> -->
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div
            class="col-xs-12">
            <q-input
              filled
              label="Concepto"
              v-model="form.concept"
              :rules="[ val => !!val || 'Debe llenar el concepto' ]" />
          </div>
          <div class="col-xs-12">
            <q-input
              label="Fecha"
              filled
              v-model="form.date"
              mask="date"
              :rules="['date', val => !!val || 'Debe seleccionar una fecha']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="form.date"
                      minimal>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12">
            <q-input
              filled
              label="Valor"
              v-model="form.value"
              :rules="[validation.required, validation.decimal]" />
          </div>
          <h3 class="text-secondary treasury-subtitle q-px-md">Datos de la factura, recibo...</h3>
          <div class="col-xs-12">
            <q-select
              filled
              label="Tipo de documento"
              v-model="form.documentType"
              :options="documentTypes" />
          </div>
          <div
            class="col-xs-12">
            <q-input
              filled
              label="Número de documento"
              v-model="form.document_number" />
          </div>
          <div class="col-xs-12">
            <q-input
              filled
              label="Proveedor o responsable"
              v-model="form.supplier" />
          </div>
          <div class="col-xs-12">
            <q-btn
              v-if="form.id"
              type="reset"
              padding="10px"
              label="Cancelar"
              no-caps
              icon="cancel"
              class="full-width q-mb-sm" />
            <q-btn
              type="submit"
              padding="10px"
              :label="form.id ? 'Actualizar' : 'Registrar'"
              color="primary"
              no-caps
              icon="check"
              class="full-width" />
          </div>
        </q-form>
      </div>
      <div class="col-xs-12 tithe-column" :class="{ 'col-sm-7': expense.state !== 'CLOSED', 'col-sm-12': expense.state === 'CLOSED' }">
        <!-- <h3 class="text-secondary treasury-subtitle">Detalle</h3> -->
        <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap">
          <table class="q-table" :class="{ 'treasury-table-data': expense.state === 'CLOSED' }">
            <thead>
              <tr>
                <th class="text-left" v-if="expense.state !== 'CLOSED'"></th>
                <th class="text-left"><strong>Descripción</strong></th>
                <th class="text-left" v-if="expense.state === 'CLOSED'"><strong>Datos de facturación</strong></th>
                <th class="text-right"><strong>Valor</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in expensesDetails"
                :key="item.id">
                <td class="width-80" v-if="expense.state !== 'CLOSED'">
                  <q-btn
                    size="sm"
                    icon="edit"
                    round
                    flat
                    @click="editExpenseDetails(item.id)" />
                  <q-btn
                    size="sm"
                    icon="delete"
                    round
                    flat
                    @click="removeExpenseDetails(item.id)" />
                </td>
                <td class="text-left">
                  {{ item.concept }}
                  <strong class="treasury-departament">{{ item.department.name }} - <em>{{ item.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local' }}</em></strong>
                  <em>Registrado el {{ format(item.date) }}</em>
                </td>
                <td class="text-left" v-if="expense.state === 'CLOSED'">
                  <ul class="treasury-list-concepts">
                    <li v-if="item.document_type"><strong>Tipo de documento:</strong> {{ item.document_type }}</li>
                    <li v-if="item.document_number"><strong>Número de documento:</strong> {{ item.document_number }}</li>
                    <li v-if="item.supplier"><strong>Proveedor:</strong> {{ item.supplier }}</li>
                  </ul>
                </td>
                <td class="text-right total">{{ item.value }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th class="text-left" colspan="2"><strong>Total</strong></th>
                <th class="text-right"><strong>{{ totalExpenses }}</strong></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="text-right q-pt-xs q-gutter-xs">
          <q-btn
            v-if="entry"
            label="Ver ingresos del mes"
            no-caps
            icon="attach_money"
            padding="10px 20px"
            class="btn-close-month"
            @click="$router.push(`/treasury/week/${entry.id}`)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { Confirm } from 'boot/modal'
import { months, format } from '../../../components/plugins/datetime'
import { Expense, ExpenseDetail } from '../../../components/entities/Expense'
import { Result } from '../../../components/entities/Entity'
import { Department } from '../../../components/entities/Department'
import { Flow } from '../../../components/entities/Flow'
import { Entry } from '../../../components/entities/Entry'
import { useStore } from '../../../store'
import validation from '../../../components/plugins/validation'

const store = useStore()

const documentTypes = [
  { value: 'FACTURA', label: 'FACTURA' },
  { value: 'RECIBO', label: 'RECIBO' },
  { value: 'NOTA DE VENTA', label: 'NOTA DE VENTA' },
  { value: 'OTRO', label: 'OTRO' }
]
const idCompany = store.state.user?.user?.company.id as number
const departments = ref([])
const flows = ref<Flow[]>([])
const departmentsFilter = ref([])
const formRender = ref<boolean>(true)
const type = ref<string>('LOCAL')
const form = ref<ExpenseDetail>({
  id: null,
  date: null,
  value: '',
  concept: '',
  documentType: '',
  document_number: '',
  supplier: '',
  expense: null,
  department: null,
  idDepartment: null
})
const expense = ref<Expense>()
const entry = ref<Entry>()
const expensesDetails = ref<[ExpenseDetail]>([])

const route = useRoute()
const { expenseId } = route.params

const getExpense = async () => {
  expense.value = await http.get(`expenses/${+expenseId}`) as Expense
}

const getDepartments = async () => {
  const items = await http.get(`departments?order=id&type=${type.value}`) as Result<Department>
  departments.value = items.rows.map(item => ({
    value: item.id,
    type: (item.type === 'GLOBAL' ? 'Asociación' : 'Iglesia local'),
    label: item.name,
    group: item.group,
    total: flows.value.find(flow => flow.department.id === item.id)?.total || 0
  }))
}

watch(type, async () => {
  await getDepartments()
})

const getFlows = async () => {
  const items = await http.get(`flows?id_company=${idCompany}&type=GENERAL`) as Result<Flow>
  // const itemsObj: { [number]: { id: number, total: number } } = {}
  flows.value = items.rows
}

const filterDepartment = (val: string, update: unknown) => {
  update(() => {
    if (val === '') {
      departmentsFilter.value = departments.value
    } else {
      const needle = val.toLowerCase()
      departmentsFilter.value = departments.value.filter((item: { label: string }) => item.label.toLowerCase().indexOf(needle) > -1)
    }
  })
}

const saveDetail = async () => {
  form.value.id_expense = expense.value.id
  form.value.document_type = form.value.documentType.value as string
  form.value.id_department = form.value.idDepartment.value as number
  form.value.type = type.value

  if (form.value.id) {
    await http.put(`expensesdetails/${form.value.id}`, form.value)
  } else {
    await http.post('expensesdetails', form.value)
  }
  await getExpenseDetails()
  await cleanExpenseDetail()
}

const editExpenseDetails = async (id: number) => {
  form.value = await http.get(`expensesdetails/${id}`) as ExpenseDetail
  form.value.idDepartment = { value: form.value.department.id, label: form.value.department.name }
  form.value.documentType = { value: form.value.document_type, label: form.value.document_type }
  type.value = form.value.type
}
const removeExpenseDetails = (id: number) => {
  Confirm('¿Desea eliminar el registro?', async () => {
    await http.delete(`expensesdetails/${id}`)
    await getExpenseDetails()
  })
}

const cleanExpenseDetail = async () => {
  formRender.value = false
  await nextTick(() => {
    form.value = {
      id: null,
      date: null,
      value: '',
      concept: '',
      documentType: '',
      document_number: '',
      supplier: '',
      expense: null,
      department: null,
      idDepartment: null
    }
    formRender.value = true
  })
}

const getExpenseDetails = async () => {
  const items = await http.get(`expensesdetails?id_expense=${expense.value.id as string}`) as Result<ExpenseDetail>
  expensesDetails.value = items.rows
}

const getEntry = async () => {
  const entries = await http.get(`entries?year=${expense.value.year}&month=${expense.value.month}&id_company=${idCompany}`) as Result<Entry>
  if (entries.count) {
    entry.value = entries.rows[0]
  }
}

const totalExpenses = computed(() => {
  let total = 0
  for (const item of expensesDetails.value) {
    total += parseFloat(item.value)
  }
  return total
})

onBeforeMount(async () => {
  await getFlows()
  await getDepartments()
  await getExpense()
  await getExpenseDetails()
  await getEntry()
})
</script>
