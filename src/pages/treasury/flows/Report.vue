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
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      align="left"
      dense
      no-caps
      indicator-color="warning"
      class="bg-primary text-white"
    >
      <q-tab name="entry" icon="paid" label="Ingresos" />
      <!-- <q-tab name="month" icon="money_off" label="Gastos Iglesia local" /> -->
      <q-tab name="expense" icon="money_off" label="Gastos" />
      <!-- <q-tab name="week" icon="movie" label="Ingreso Semanal" /> -->
      <q-tab name="deposit" icon="payments" label="Depósito bancario" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      vertical
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="entry">
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <div class="row justify-start">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Iglesia local</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-10">
                <div
                  v-for="item in flowsEntriesLocal"
                  :key="item.id"
                  class="row justify-start">
                  <div class="col-8">{{ item.department.name }}</div>
                  <div class="col-xs-4 col-sm-4 text-right">{{ (item.netTotal * 1).toFixed(2) }} {{ $store.state.user?.user.company.money }}</div>
                </div>
                <div class="row justify-start">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-start">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ (totalFlowExpense * 1).toFixed(2) }} {{ $store.state.user?.user.company.money }}</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <div class="row justify-end">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Asociación</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-10">
                <div
                  v-for="item in flowsEntriesGlobal"
                  :key="item.id"
                  class="row justify-end">
                  <div class="col-8">{{ item.department.name }}</div>
                  <div class="col-xs-4 col-sm-4 text-right">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user.company.money }}</div>
                </div>
                <div class="row justify-end">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-end">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ totalFlowEntry.toFixed(2) }} {{ $store.state.user?.user.company.money }}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="expense">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h3 class="text-primary flow-title">Gastos Iglesia local</h3>
            <div class="row">
              <div class="col-xs-10">
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
                        v-for="item in expensesDetailsLocal"
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
                        <td class="text-right total">{{ Number(item.value).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th class="text-left" colspan="2"><strong>Total</strong></th>
                        <th class="text-right"><strong>{{ totalExpensesLocal.toFixed(2) }}</strong></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <h3 class="text-primary flow-title">Gastos Asociación</h3>
            <div class="row">
              <div class="col-xs-10">
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
                        v-for="item in expensesDetailsGlobal"
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
                        <td class="text-right total">{{ Number(item.value).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th class="text-left" colspan="2"><strong>Total</strong></th>
                        <th class="text-right"><strong>{{ totalExpensesGlobal.toFixed(2) }}</strong></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="deposit">
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <div class="row justify-end">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Asociación para enviar</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-10">
                <div
                  v-for="item in flowsEntriesSendGlobal"
                  :key="item.id"
                  class="row justify-end">
                  <div class="col-8">{{ item.department.name }}</div>
                  <div class="col-xs-4 col-sm-4 text-right">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user.company.money }}</div>
                </div>
                <div class="row justify-end">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-end">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ totalFlowEntryGlobal.toFixed(2) }} {{ $store.state.user?.user.company.money }}</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6">
            <h3 class="text-primary flow-title">Estado del depósito</h3>
            <q-form @submit.prevent="saveDeposit">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12">
                  <q-input
                    filled
                    class="text-right"
                    :suffix="$store.state.user?.user.company.money"
                    label="Total a depositar"
                    v-model="totalFlowEntryGlobal"
                    readonly>
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12">
                  <q-input
                    v-model="totalDeposited"
                    filled
                    placeholder="0"
                    class="text-right"
                    label="Total depositado"
                    :suffix="$store.state.user?.user.company.money"
                    debounce="1000">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12">
                  <q-input
                    filled
                    label="Fecha del depósito"
                    v-model="dateDeposited"
                    debounce="1000"
                    :rules="[]">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="birthdayDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale">
                          <q-date
                            v-model="dateDeposited"
                            minimal
                            mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- <div class="text-right q-pt-sm">
                <q-btn
                  label="Guardar información del depósito"
                  no-caps
                  color="primary"
                  icon="check"
                  padding="10px 20px"
                  class="btn-close-month"
                  type="submit" />
              </div> -->
              <h3 class="text-primary flow-title q-pt-lg">Comprobante de pago</h3>
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <q-uploader
                    :url="voucherUrl"
                    :headers="voucherHeaders"
                    field-name="file"
                    accept=".jpg, image/*, .pdf"
                    :max-file-size="5 * 1024 * 1024"
                    auto-upload
                    class="full-width"
                    @uploaded="onUploaded"
                    @rejected="onRejected">
                    <template v-slot:header="scope">
                      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                        <div class="col">
                          <a class="q-uploader__title text-white" :href="`${urlBase.replace(/\/api\//g, '')}/files/${entry.voucherDeposited}`" target="blank" v-if="entry.voucherDeposited">
                            <q-icon name="file_download" /> {{ entry.voucherDeposited }}
                          </a>
                          <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                        </div>
                        <q-btn v-if="scope.canAddFiles" type="a" no-caps color="warning" icon="add_box" dense>
                          <q-uploader-add-trigger />
                          {{ entry.voucherDeposited ? 'Cambiar archivo' : 'Seleccionar archivo' }}
                          <q-tooltip>{{ entry.voucherDeposited ? 'Cambiar archivo' : 'Seleccionar archivo' }}</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
                          <q-tooltip>Subir archivo</q-tooltip>
                        </q-btn>
                        <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
                          <q-tooltip>Cancela subida</q-tooltip>
                        </q-btn>
                      </div>
                    </template>
                  </q-uploader>
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <div
      class="text-right q-pt-md q-gutter-xs">
      <q-btn
        label="Ver flujo de caja"
        no-caps
        icon="account_balance"
        class="btn-close-month"
        @click="$router.push('/treasury/flows/general')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { http, urlBase } from 'boot/http'
import { storage } from 'boot/storage'
import { message } from 'boot/message'
import { Result, Response } from '../../../components/entities/Entity'
import { Flow } from '../../../components/entities/Flow'
import { months, getWeeks, format, normalize } from '../../../components/plugins/datetime'
import { EntryDetail, Entry } from '../../../components/entities/Entry'
import { ExpenseDetail } from '../../../components/entities/Expense'
import { useStore } from '../../../store'

const store = useStore()

const idCompany = store.state.user?.user?.company.id as number

const tab = ref('entry')
const flowsEntriesGlobal = ref<[Flow]>([])
const flowsEntriesSendGlobal = ref<[Flow]>([])
const flowsEntriesLocal = ref<[Flow]>([])
const expensesDetails = ref<[ExpenseDetail]>([])
const entry = ref<Entry>()
const weeks = ref([])
const total = ref<number>(0)
const totalDeposited = ref<number>()
const dateDeposited = ref<string>('')

const route = useRoute()
const { entryId, expenseId } = route.params
const voucherUrl = `${urlBase as string}entries/${entryId as string}/upload`
const voucherHeaders = [{ name: 'Authorization', value: `Bearer ${storage.get('token') as string}` }]

const saveDeposit = async (): void => {
  await http.put(`entries/${entryId as string}`, {
    totalDeposited: totalDeposited.value,
    dateDeposited: normalize(dateDeposited.value)
  })
}

watch(totalDeposited, () => {
  saveDeposit()
})

watch(dateDeposited, () => {
  saveDeposit()
})

const getFlowsEntriesGlobal = async () => {
  const query = {
    type_treasury: 'ENTRY',
    id_company: idCompany,
    year: entry.value.year,
    month: entry.value.month,
    type: 'MONTH',
    order: 'id_department',
    type_department: 'GLOBAL'
  }
  const items = await http.get(http.convertQuery('flows', query)) as Result<Flow>
  flowsEntriesGlobal.value = items.rows
}

const getFlowsEntriesSendGlobal = async () => {
  const items = await http.get(`flows/send/${entry.value.year}/${entry.value.month}`) as Result<Flow>
  flowsEntriesSendGlobal.value = items.rows
}

const getFlowsEntriesLocal = async () => {
  const query = {
    type_treasury: 'ENTRY',
    id_company: idCompany,
    year: entry.value.year,
    month: entry.value.month,
    type: 'MONTH',
    order: 'id_department',
    type_department: 'LOCAL'
  }
  const items = await http.get(http.convertQuery('flows', query)) as Result<Flow>
  flowsEntriesLocal.value = items.rows
}

function onRejected (rejectedEntries: string[]) {
  // console.log('error upload', rejectedEntries)
  message.error(`${rejectedEntries.length as string} el/los archivo(s) no pasaron las restricciones de validación`)
}

interface FileInfo {
  xhr: { response: string }
}

function onUploaded (info: FileInfo) {
  try {
    const json: Response<{ filename: string }> = JSON.parse(info.xhr.response) // eslint-disable-line
    entry.value.voucherDeposited = json.data.filename
  } catch (e) {}
}

interface Total {
  total: number
  local: number
  global: number
}

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
  totalDeposited.value = entry.value.totalDeposited
  dateDeposited.value = format(entry.value.dateDeposited)
  weeks.value = getWeeks(entry.value.year, entry.value.month)
  const items = await http.get(`entriesdetails?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
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
  const items = await http.get(`expensesdetails?id_expense=${expenseId as string}`) as Result<ExpenseDetail>
  expensesDetails.value = items.rows
}

const totalFlowEntry = computed(() => {
  let total = 0
  flowsEntriesGlobal.value.forEach(item => {
    total += Number(item.total)
  })
  return total
})

const totalFlowEntryGlobal = computed(() => {
  let total = 0
  flowsEntriesSendGlobal.value.forEach(item => {
    total += Number(item.total)
  })
  return total
})

const totalFlowExpense = computed(() => {
  let total = 0
  flowsEntriesLocal.value.forEach(item => {
    total += Number(item.netTotal)
  })
  return total
})

const totalExpensesLocal = computed(() => {
  let total = 0
  for (const item of expensesDetailsLocal.value) {
    total += parseFloat(item.value)
  }
  return total
})

const totalExpensesGlobal = computed(() => {
  let total = 0
  for (const item of expensesDetailsGlobal.value) {
    total += parseFloat(item.value)
  }
  return total
})

const expensesDetailsLocal = computed(() => expensesDetails.value.filter(item => item.type === 'LOCAL'))
const expensesDetailsGlobal = computed(() => expensesDetails.value.filter(item => item.type === 'GLOBAL'))

onMounted(async () => {
  await getEntry()
  await getFlowsEntriesGlobal()
  await getFlowsEntriesLocal()
  await getExpenseDetails()
  await getFlowsEntriesSendGlobal()
})
</script>
