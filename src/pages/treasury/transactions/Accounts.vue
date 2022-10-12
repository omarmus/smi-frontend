<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/treasury')" />
        Cuentas bancarias
      </h2>
    <div class="alert alert-info">
      Agregue las cuentas bancarias de su iglesia local para contabilizarlo con los ingresos de su iglesia.
    </div>
    <div>
      <q-btn
        class="q-ml-none q-mr-xs"
        icon="add"
        no-caps
        color="primary"
        @click="openDialog()">
        Agregar cuenta<q-tooltip>Agregar cuenta</q-tooltip>
      </q-btn>
    </div>
    <div class="row treasury-row q-pt-md">
      <div
        class="col-xs-12 col-sm-6 col-md-3 q-pa-sm"
        v-for="item in accounts"
        :key="item.id">
        <q-btn
          flat
          color="secondary"
          padding="24px 10px"
          no-caps
          @click="openDialog(item.id)"
          class="full-width btn-block">
          <strong class="q-pb-sm"><q-icon name="account_balance_wallet" size="sm" /> {{ item.name }}</strong>
          <span class="btn-block-detail">{{ item.bank }}</span>
          <span class="btn-block-detail text-primary">{{ item.number }}</span>
          <span class="btn-block-detail">{{ item.total }} {{ item.currency }}</span>
        </q-btn>
      </div>
    </div>
    <q-dialog v-model="dialog" persistent transition-show="scale" transition-hide="scale">
      <q-card  class="modal-sm">
        <q-toolbar class="q-pa-md">
          <q-icon name="people" size="md" />
          <q-toolbar-title>
            {{ account.id ? 'Editar' : 'Nueva' }} cuenta bancaria
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup />
        </q-toolbar>
        <q-form @submit="save" ref="myForm">
          <q-card-section class="q-col-gutter-sm">
            <q-input
              v-model="account.name"
              label="Nombre para identificar la cuenta"
              filled
              autofocus
              :rules="[v => !!v || 'El campo es requerido']" />
            <q-select
              filled
              v-model="account.bank"
              :placeholder="account.bank ? '' : 'Nombre del Banco'"
              use-input
              use-chips
              :input-debounce="500"
              @new-value="createValue"
              :options="banksFilter"
              @filter="filterFn"
              lazy-rules
              :rules="[ val => !!val || 'Seleccione a una persona']"
            >
            </q-select>
            <q-input
              v-model="account.number"
              label="Número de cuenta"
              filled
              :rules="[v => !!v || 'El campo es requerido']" />
            <q-select
              v-model="account.currency"
              label="Moneda"
              filled
              emit-value
              :options="currencies"
              :rules="[v => !!v || 'El campo es requerido']" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Cancelar" icon="cancel" v-close-popup />
            <q-btn v-if="account.id" label="Eliminar" icon="delete" color="negative" v-close-popup @click="deleteItem(getAccounts, `accounts/${account.id}`)" />
            <q-btn type="submit" :label="account.id ? 'Actualizar' : 'Guardar'" icon="check" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import { Result } from '../../../components/entities/Entity'
import { Account } from '../../../components/entities/Transaction'
import { useStore } from '../../../store'
import { deleteItem } from '../../../components/plugins/crud'

const currencies = [
  { value: 'BOB', label: 'Bolivianos (BOB)' },
  { value: 'USD', label: 'Dólares (USD)' }
]

const store = useStore()
const accounts = ref<Account[]>()
const banksFilter = ref<Account[]>()
const account = ref<Account>({})
const dialog = ref<boolean>(false)
const idCompany = store.state.user?.user?.company.id as number

const getAccounts = async () => {
  const items = await http.get(`accounts?id_company=${idCompany}&order=id`) as Result<Account>
  accounts.value = items.rows
}

const save = async () => {
  const item = JSON.parse(JSON.stringify(account.value)) as Account
  if (item.id) {
    await http.put(`accounts/${item.id}`, {
      name: item.name,
      number: item.number,
      bank: item.bank,
      currency: item.currency,
      id_company: idCompany
    })
    message.success('¡Cuenta actualizada!')
  } else {
    item.id_company = idCompany
    await http.post('accounts', item)
    message.success('¡Cuenta agregada correctamente!')
  }
  await getAccounts()
  dialog.value = false
}

const openDialog = async (id?: number) => {
  if (id) {
    account.value = await http.get(`accounts/${id}`) as Account
  } else {
    account.value = {}
  }
  dialog.value = true
}

const createValue = (val: string, done: () => void) => {
  if (val.length > 2) {
    done(val, 'add-unique')
  }
}

const filterFn = (val: string, update: unknown) => {
  update(async () => {
    if (val === '') {
      banksFilter.value = []
    } else {
      banksFilter.value = await getBanks(val)
    }
  })
}

const getBanks = async (query: string) => {
  const items = await http.get(`accounts?bank=${query}&groupby=account.bank`, false) as Result<Account>
  const banks: Record<string, boolean> = {}
  items.rows.forEach(item => (banks[item.bank] = true))
  return Object.keys(banks)
}

onBeforeMount(async () => {
  await getAccounts()
})
</script>
