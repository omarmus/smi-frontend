<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push(`/treasury/entryexpense/${$route.params.entryId}/${$route.params.expenseId}`)" />
        Transacciones bancarias
    </h2>
    <!-- <div class="alert alert-info">
      Selecciona una cuenta bancaria
    </div> -->
    <q-select
      filled
      label="Cuenta bancaria"
      v-model="idAccount"
      option-value="id"
      option-label="number"
      :options="accounts"
      :rules="[validation.required]"
      emit-value
      map-options
      v-if="render">
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label v-html="scope.opt.number" />
            <q-item-label caption>
              {{ scope.opt.bank }} - {{ scope.opt.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div
      class="alert alert-info"
      v-else>
      No tiene cuentas bancarias asociadas, puede agregarlas <a @click="redirectAccounts" href="javascript:void(0)">aquí</a>.
    </div>
    <CrudTable
      :columns="columns"
      :filters="filters"
      :url="urlFilter"
      order="-transaction.id"
      v-if="render">
      <template v-slot:buttons="props">
        <q-btn
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openModal(props.open)"
        >
          Agregar transacción
          <q-tooltip>Agregar transacción</q-tooltip>
        </q-btn>
      </template>
      <template v-slot:buttons-end>
        <q-chip
          square
          color="positive"
          text-color="white"
          :label="`TOTAL SALDO: ${total} ${$store.state.user?.user.company.money}`"
        />
      </template>
      <template v-slot:form="props">
        <q-card class="modal-sm">
          <q-toolbar class="q-pa-md">
            <q-icon name="point_of_sale" size="md" />
            <q-toolbar-title>
              {{ transaction.id ? 'Editar' : 'Agregar' }} transacción
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="props.close()" />
          </q-toolbar>
          <q-form @submit="save(props)" ref="myForm">
            <q-card-section class="q-col-gutter-sm">
              <div class="row">
                <div class="col-sm-7 q-gutter-sm q-pb-sm">
                  <h6>Tipo de transacción</h6>
                  <q-radio v-model="transaction.type" val="ENTRY" label="Ingreso" />
                  <q-radio v-model="transaction.type" val="EXPENSE" label="Salida" />
                </div>
                <div class="col-sm-5 q-pt-lg">
                  <q-checkbox
                    v-model="transaction.interest"
                    v-if="transaction.type === 'ENTRY'"
                    label="Interés bancario"
                    class="transaction-interest"
                    @click="setDescription(transaction.interest)" />
                </div>
              </div>
              <q-input
                filled
                label="Fecha movimiento"
                v-model="transaction.date"
                :rules="[validation.date, validation.required]">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="birthdayDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date
                        v-model="transaction.date"
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
              <q-input
                filled
                label="Descripción"
                autogrow
                v-model="transaction.description"
                :rules="[validation.required]" />
              <q-input
                filled
                label="Monto"
                v-model="transaction.amount"
                :rules="[validation.required]" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Cancelar" icon="cancel" v-close-popup />
              <q-btn type="submit" label="Guardar" icon="check" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </template>
      <template v-slot:row="props">
        <q-tr :class="{ 'selected': props.row.interest }">
          <q-td>{{ format(props.row.date) }}</q-td>
          <q-td>{{ props.row.description }}</q-td>
          <q-td class="text-right">{{ props.row.type === 'EXPENSE' ? '-' : '' }}{{ props.row.amount }}</q-td>
          <q-td class="text-right">{{ props.row.balance }}</q-td>
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

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeMount } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { storage } from 'boot/storage'
import { useRoute, useRouter } from 'vue-router'
import { Result } from '../../../components/entities/Entity'
import { Transaction, Account } from '../../../components/entities/Transaction'
import { useStore } from '../../../store'
import { format, normalize } from '../../../components/plugins/datetime'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import validation from '../../../components/plugins/validation'

const route = useRoute()
const router = useRouter()
const { entryId } = route.params
const store = useStore()

const columns = [
  { label: 'Fecha movimiento', align: 'left', name: 'transaction.date', sortable: true },
  { label: 'Descripción', align: 'left', name: 'transaction.description', sortable: true },
  { label: 'Monto', align: 'right', name: 'transaction.amount', sortable: true },
  { label: 'Saldo', align: 'right', name: 'transaction.balance', sortable: true },
  { label: 'Estado', align: 'right', name: 'transaction.state', sortable: true }
]

const filters = ref([])
const labels = {
  MEMBER: { color: 'positive', textColor: 'white', label: 'MIEMBRO' },
  PENDING: { color: 'warning', textColor: 'white', label: 'PENDIENTE' },
  FINISHED: { color: 'positive', textColor: 'white', label: 'PROCESADO' }
}

const idCompany = store.state.user?.user?.company.id as number
const transaction = ref<Transaction>()
const accounts = ref<Account[]>()
const idAccount = ref<number>()
const render = ref<boolean>(false)
const total = ref<number>(0)
const url = `transactions?id_company=${idCompany as string}`
const urlFilter = ref<string>(url)

const openModal = async (open: () => void, id?: number) => {
  if (id) {
    transaction.value = await http.get(`${url}/${id}`) as Transaction
    transaction.value.date = format(transaction.value.date as string)
  } else {
    transaction.value = {
      interest: false,
      type: 'ENTRY'
    }
  }
  open()
}

const save = async (crud: { update: () => void, close: () => void }) => {
  if (transaction.value.type === 'EXPENSE') {
    transaction.value.interest = false
  }
  transaction.value.id_account = idAccount
  transaction.value.date = normalize(transaction.value.date as string)
  if (transaction.value?.id) {
    await http.put(`${url}/${transaction.value.id}`, transaction.value)
    message.success('¡Transacción actualizada!')
  } else {
    transaction.value.id_entry = entryId
    await http.post(url, transaction.value)
    message.success('¡Transacción creada exitósamente!')
  }
  crud.update()
  crud.close()
  await getTotalBalance(idAccount.value)
}

const getAccounts = async () => {
  const items = await http.get(`accounts?id_company=${idCompany}&order=id`) as Result<Account>
  accounts.value = items.rows
  if (items.count === 1) {
    idAccount.value = accounts.value[0].id
  }
}

const now = new Date()
const validateDateOptions = (date) => {
  return date <= `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
}

const setDescription = (interest) => {
  transaction.value.description = interest ? 'Pago de interés' : ''
}

const getTotalBalance = async (idAccount: number) => {
  const lastTransaction = await http.get(`transactions/last/${idAccount}`) as Transaction
  total.value = lastTransaction.balance
}

const redirectAccounts = () => {
  storage.set('create', true)
  void router.push('/treasury/accounts')
}

watch(idAccount, async (val: number) => {
  render.value = false
  urlFilter.value = `${url}&id_account=${val}`
  await getTotalBalance(val)
  void nextTick(() => (render.value = true))
})

onBeforeMount(async () => {
  await getAccounts()
  if (idAccount.value) {
    await getTotalBalance(idAccount.value)
  }
})
</script>

<style lang="scss">
.transaction-sub {
  color: $secondary;
  font-size: .8rem;
  margin-top: -2px;
}
.transaction-interest {
  margin-top: 2px;
}
</style>
