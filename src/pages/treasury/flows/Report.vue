<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push(`/treasury/entryexpense/${entryId}/${expenseId}`)" />
      Informe mensual {{ months[entry.month - 1] }}
    </h2>
    <div class="row q-col-gutter-x-lg">
      <div class="col-xs-12 col-sm-6">
        <div class="row justify-start">
          <h3 class="text-primary treasury-subtitle col-xs-12 col-sm-11">Ingreso por departamento - Iglesia local</h3>
        </div>
        <div
          v-for="item in flowsExpense"
          :key="item.id"
          class="row justify-start">
          <div class="col-8">{{ item.department.name }}</div>
          <div class="col-xs-4 col-sm-3 text-right">{{ item.total * 0.9 }} Bs.</div>
        </div>
        <div class="row justify-start">
          <div class="col-xs-12 col-sm-11">
            <q-separator />
          </div>
        </div>
        <div class="row justify-start">
          <div class="col-8"><strong>Total:</strong></div>
          <div class="col-xs-4 col-sm-3 text-right"><strong>{{ totalFlowExpense * 0.9 }} Bs.</strong></div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6">
        <div class="row justify-end">
          <h3 class="text-primary treasury-subtitle col-xs-12 col-sm-11">Ingreso por departamento - Asociación</h3>
        </div>
        <div
          v-for="item in flowsEntry"
          :key="item.id"
          class="row justify-end">
          <div class="col-8">{{ item.department.name }}</div>
          <div class="col-xs-4 col-sm-3 text-right">{{ item.total }} Bs.</div>
        </div>
        <div class="row justify-end">
          <div class="col-xs-12 col-sm-11">
            <q-separator />
          </div>
        </div>
        <div class="row justify-end">
          <div class="col-8"><strong>Total:</strong></div>
          <div class="col-xs-4 col-sm-3 text-right"><strong>{{ totalFlowEntry }} Bs.</strong></div>
        </div>
      </div>
    </div>
    <div class="row q-mt-lg justify-center q-col-gutter-x-lg">
      <div class="col-xs-12 col-sm-6">
        <div class="row justify-start">
          <h3 class="text-primary treasury-subtitle col-xs-12 col-sm-11">Ingreso semanal</h3>
        </div>
        <div
          v-for="item in weeks"
          :key="item.id"
          class="row justify-start">
          <div class="col-8">{{ item.label }} de {{ months[entry.month - 1] }}</div>
          <div class="col-xs-4 col-sm-3 text-right">{{ item.total }} Bs.</div>
        </div>
        <div class="row justify-start">
          <div class="col-xs-12 col-sm-11">
            <q-separator />
          </div>
        </div>
        <div class="row justify-start">
          <div class="col-8"><strong>Total:</strong></div>
          <div class="col-xs-4 col-sm-3 text-right"><strong>{{ total }} Bs.</strong></div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6">
        <div class="row justify-end">
          <div class="col-xs-12 col-sm-11">
            <h3 class="text-primary treasury-subtitle">Estado del depósito</h3>
            <div class="row q-pb-xs">
              <div class="col-7">Total a depositar</div>
              <div class="col-xs-5 col-sm-5">
                <q-field
                  standout
                  class="text-right"
                  dense
                  placeholder="0"
                  suffix="Bs.">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ totalFlowEntry }}</div>
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row q-pb-xs">
              <div class="col-7">Total depositado</div>
              <div class="col-xs-5 col-sm-5">
                <q-input
                  v-model="totalDeposited"
                  standout
                  class="text-right"
                  dense
                  placeholder="0"
                  suffix="Bs.">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">{{ totalFlowEntry }}</div>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-pb-xs">
              <div class="col-7">Fecha del depósito</div>
              <div class="col-xs-5 col-sm-5">
                <q-field
                  standout
                  class="text-right"
                  dense
                  placeholder="0">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">12/03/2022</div>
                  </template>
                </q-field>
              </div>
            </div>
            <div class="row row q-pb-sm">
              <div class="col">
                <q-file
                  standout
                  v-model="file"
                  dense
                  label="Adjuntar comprobante">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </div>
            </div>
            <div class="text-right">
              <q-btn
                label="Guardar datos del depósito"
                icon="check"
                color="primary"
                no-caps />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mt-sm justify-center">
      <div class="col-xs-12">
        <h3 class="text-primary treasury-subtitle">Gastos del mes</h3>
        <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap">
          <table class="q-table treasury-table-data">
            <thead>
              <tr>
                <th class="text-left"><strong>Descripción</strong></th>
                <th class="text-left"><strong>Datos de facturación</strong></th>
                <th class="text-right"><strong>Valor</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in expensesDetails"
                :key="item.id">
                <td class="text-left">
                  {{ item.concept }}
                  <strong class="treasury-departament">{{ item.department.name }}</strong>
                  <em>Registrado el {{ format(item.date) }}</em>
                </td>
                <td class="text-left">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { Flow } from '../../../components/entities/Flow'
import { months, getWeeks, format } from '../../../components/plugins/datetime'
import { EntryDetail, Entry } from '../../../components/entities/Entry'
import { ExpenseDetail } from '../../../components/entities/Expense'

const flowsEntry = ref<[Flow]>([])
const flowsExpense = ref<[Flow]>([])
const expensesDetails = ref<[ExpenseDetail]>([])
const entry = ref<Result<Entry>>([])
const weeks = ref([])
const total = ref<number>(0)
const totalDeposited = ref<number>(0)
const file = ref()

const route = useRoute()
const { entryId, expenseId } = route.params

const idCompany = 9

const getFlowsEntry = async () => {
  const url = `flows?id_company=${idCompany}&type=MONTH&type_treasury=ENTRY&type_department=GLOBAL&order=department.id`
  const items = await http.get(url) as Result<Flow>
  flowsEntry.value = items.rows
}

const getFlowsExpense = async () => {
  const url = `flows?id_company=${idCompany}&type=MONTH&type_treasury=EXPENSE&type_department=LOCAL&order=department.id`
  const items = await http.get(url) as Result<Flow>
  flowsExpense.value = items.rows
}

interface Total {
  total: number
  local: number
  global: number
}

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
  weeks.value = getWeeks(entry.value.year, entry.value.month)
  const items = await http.get(`entries/details?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
  const totals: Record<number, Total> = {
    1: { total: 0, local: 0, global: 0 },
    2: { total: 0, local: 0, global: 0 },
    3: { total: 0, local: 0, global: 0 },
    4: { total: 0, local: 0, global: 0 },
    5: { total: 0, local: 0, global: 0 }
  }
  items.rows.forEach(row => {
    totals[row.week].global += Number(row.value)
  })
  total.value = 0
  weeks.value.forEach((item: { total: number, week: number }) => {
    item.total = totals[item.week].global
    total.value += item.total
  })
}

const getExpenseDetails = async () => {
  const items = await http.get(`expenses/details?id_expense=${expenseId as string}`) as Result<ExpenseDetail>
  expensesDetails.value = items.rows
}

const totalFlowEntry = computed(() => {
  let total = 0
  flowsEntry.value.forEach(item => {
    total += Number(item.total)
  })
  return total
})

const totalFlowExpense = computed(() => {
  let total = 0
  flowsExpense.value.forEach(item => {
    total += Number(item.total)
  })
  return total
})

const totalExpenses = computed(() => {
  let total = 0
  for (const item of expensesDetails.value) {
    total += parseFloat(item.value)
  }
  return total
})

onMounted(async () => {
  await getFlowsEntry()
  await getFlowsExpense()
  await getEntry()
  await getExpenseDetails()
})
</script>
