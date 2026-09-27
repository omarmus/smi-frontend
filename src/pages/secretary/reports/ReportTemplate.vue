<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="$router.push('/secretary')" />
      Plantillas de reporte
    </h2>
    <CrudTable
      :url="url"
      :filters="filters"
      :columns="columns"
      order="id"
    >
      <template v-slot:buttons="props">
        <q-btn
          v-if="can('report_template:create')"
          class="q-ml-none q-mr-xs"
          icon="add"
          no-caps
          color="primary"
          @click="openModal(props.open)">
          Nueva plantilla
          <q-tooltip>Crear plantilla</q-tooltip>
        </q-btn>
      </template>
      <template v-slot:form="props">
        <q-card class="template-dialog">
          <q-toolbar class="q-pa-md">
            <q-icon name="dashboard_customize" size="md" />
            <q-toolbar-title>
              {{ template.id ? 'Editar' : 'Agregar' }} plantilla
            </q-toolbar-title>
            <q-btn flat round dense icon="close" @click="props.close" />
          </q-toolbar>
          <q-card-section>
            <q-form @submit="save(props)">
              <div class="row q-col-gutter-md">
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Formulario"
                    filled
                    v-model="template.form"
                    :options="formOptions"
                    :rules="rules.required"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12 col-md-6">
                  <q-select
                    label="Tipo"
                    filled
                    v-model="template.type"
                    :options="typeOptions"
                    :rules="rules.required"
                    emit-value
                    map-options />
                </div>
                <div class="col-xs-12">
                  <div class="text-subtitle2 q-mb-sm">
                    Columnas
                    <span class="text-caption text-grey">
                      (el orden de la lista es el orden de impresión)
                    </span>
                  </div>

                  <div
                    v-for="(column, index) in template.columns"
                    :key="index"
                    class="column-row q-pa-sm q-mb-sm">
                    <div class="row q-col-gutter-sm items-start">
                      <div class="col-12 col-sm-3">
                        <q-input
                          v-model="column.key"
                          label="Clave (inglés)"
                          filled
                          dense
                          hint="minúsculas: hours_worked" />
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-input
                          v-model="column.label"
                          label="Etiqueta (español)"
                          filled
                          dense />
                      </div>
                      <div class="col-6 col-sm-2">
                        <q-select
                          v-model="column.kind"
                          label="Tipo"
                          filled
                          dense
                          :options="kindOptions"
                          emit-value
                          map-options />
                      </div>
                      <div class="col-6 col-sm-2 column-total">
                        <q-toggle
                          v-model="column.total"
                          label="Total"
                          :disable="column.kind !== 'number'" />
                      </div>
                      <div class="col-12 col-sm-1 text-right column-actions">
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          icon="arrow_upward"
                          :disable="index === 0"
                          @click="moveColumn(index, -1)">
                          <q-tooltip>Subir</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          icon="arrow_downward"
                          :disable="index === template.columns.length - 1"
                          @click="moveColumn(index, 1)">
                          <q-tooltip>Bajar</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          dense
                          size="sm"
                          color="negative"
                          icon="delete"
                          @click="removeColumn(index)">
                          <q-tooltip>Quitar columna</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <q-btn
                    outline
                    color="primary"
                    icon="add"
                    label="Agregar columna"
                    dense
                    @click="addColumn" />
                </div>
                <div class="col-xs-12 text-right q-gutter-sm">
                  <q-btn icon="close" label="Cancelar" @click="props.close" />
                  <q-btn icon="check" color="secondary" label="Guardar" type="submit" />
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
              v-if="can('report_template:update')"
              flat
              round
              @click="openModal(props.open, props.row.id)"
              icon="edit">
              <q-tooltip>Editar registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="can('report_template:delete')"
              color="negative"
              flat
              round
              @click="deleteItem(props.update, `${url}/${props.row.id}`)"
              icon="delete">
              <q-tooltip>Eliminar registro</q-tooltip>
            </q-btn>
          </q-td>
          <q-td>{{ formLabels[props.row.form] || props.row.form }}</q-td>
          <q-td>{{ typeLabels[props.row.type] || props.row.type }}</q-td>
          <q-td>{{ props.row.columns?.length || 0 }}</q-td>
          <q-td class="text-right">
            <q-chip
              square
              dense
              :color="props.row.state === 'ACTIVE' ? 'positive' : 'warning'"
              text-color="white"
              :label="stateLabels[props.row.state] || props.row.state" />
          </q-td>
        </q-tr>
      </template>
    </CrudTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { http } from 'boot/http'
import { message } from 'boot/message'
import CrudTable from '../../../components/common/crud-table/CrudTable.vue'
import { deleteItem } from '../../../components/plugins/crud'
import validation from '../../../components/plugins/validation'
import { useStore } from '../../../store'
import {
  ReportTemplate,
  TemplateState,
  emptyColumn,
  formLabels,
  kindLabels,
  newTemplate,
  stateLabels,
  typeLabels
} from '../../../components/entities/ReportTemplate'

const store = useStore()
const url = 'report-templates'

const can = (permission: string) =>
  !!store.state.user?.permissions?.includes(permission)

const columns = [
  { label: 'Acciones', align: 'center', sortable: false },
  { name: 'form', label: 'Formulario', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', align: 'left', sortable: true },
  { name: 'columns', label: 'Columnas', align: 'center', sortable: false },
  { name: 'state', label: 'Estado', sortable: true }
]

const formOptions = Object.entries(formLabels).map(([value, label]) => ({ value, label }))
const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({ value, label }))
const kindOptions = Object.entries(kindLabels).map(([value, label]) => ({ value, label }))

const filters = [
  { label: 'Formulario', name: 'form', type: 'select', options: formOptions },
  { label: 'Tipo', name: 'type', type: 'select', options: typeOptions },
  {
    label: 'Estado',
    name: 'state',
    type: 'select',
    options: [
      { label: 'ACTIVO', value: TemplateState.ACTIVE },
      { label: 'INACTIVO', value: TemplateState.INACTIVE }
    ]
  }
]

const rules = { required: [validation.required] }

const template = ref<ReportTemplate>(newTemplate())

const openModal = async (open: () => void, id?: number) => {
  if (id) {
    template.value = await http.get(`${url}/${String(id)}`) as ReportTemplate
  } else {
    template.value = newTemplate()
  }
  open()
}

const addColumn = () => {
  template.value.columns.push(emptyColumn())
}

const removeColumn = (index: number) => {
  template.value.columns.splice(index, 1)
}

const moveColumn = (index: number, step: number) => {
  const target = index + step
  const list = template.value.columns
  if (target < 0 || target >= list.length) {
    return
  }
  const [column] = list.splice(index, 1)
  list.splice(target, 0, column)
}

const validate = (): boolean => {
  const list = template.value.columns
  if (!list.length) {
    message.error('Debe tener al menos una columna.')
    return false
  }
  const keys = list.map(column => column.key.trim())
  for (const key of keys) {
    if (!/^[a-z][a-z0-9_]{0,39}$/.test(key)) {
      message.error(`Clave de columna inválida: ${key}`)
      return false
    }
  }
  if (new Set(keys).size !== keys.length) {
    message.error('Hay claves de columna repetidas.')
    return false
  }
  for (const column of list) {
    if (!column.label.trim()) {
      message.error(`La columna ${column.key} necesita una etiqueta`)
      return false
    }
    if (column.total && column.kind !== 'number') {
      message.error(`Solo las columnas numéricas pueden ser total: ${column.key}`)
      return false
    }
  }
  return true
}

const save = async (crud: { update: () => void, close: () => void }) => {
  if (!validate()) {
    return
  }
  const list = template.value.columns.map(column => ({
    key: column.key.trim(),
    label: column.label.trim(),
    kind: column.kind,
    total: column.total
  }))
  template.value.columns = list
  const payload = {
    form: template.value.form,
    type: template.value.type,
    columns: list,
    state: template.value.state || TemplateState.ACTIVE
  }
  if (template.value.id) {
    await http.put(`${url}/${String(template.value.id)}`, payload)
    message.success('¡Plantilla actualizada!')
  } else {
    await http.post(url, payload)
    message.success('¡Plantilla creada exitósamente!')
  }
  crud.update()
  crud.close()
}
</script>

<style lang="scss">
.template-dialog {
  min-width: 320px;
  width: 100%;
  max-width: 720px;

  .column-row {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);
  }

  .column-total {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
