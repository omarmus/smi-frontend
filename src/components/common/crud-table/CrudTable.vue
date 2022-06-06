<template>
  <div class="row">
    <div class="col-xs-12">
      <q-dialog v-model="modal" persistent>
        <slot
          name="form"
          class="crud-table-form"
          :close="closeModal"
          :update="updateList">Agregue su formulario aquí</slot>
      </q-dialog>
      <slot
        name="formInline"
        class="crud-table-form"
        :update="updateList"></slot>
    </div>
    <div class="col-xs-12">
      <q-toolbar inset class="q-gutter-md q-px-md q-pb-md">
        <slot
          name="buttons"
          :open="openModal"
          :update="updateList"></slot>
        <q-btn
          v-if="props.filters?.length > 0 && props.openFilter === false"
          @click="toggleFilter">
          <q-icon
            center
            :name="enableFilter ? 'close' : 'search'"
            color="secondary" />
          <q-tooltip>{{ enableFilter ? 'Cerrar filtros' : 'Abrir filtros' }}</q-tooltip>
        </q-btn>
        <q-btn
          @click="updateList">
          <q-icon center name="refresh" color="secondary" />
          <q-tooltip>Actualizar página</q-tooltip>
        </q-btn>
        <slot name="buttons-end"></slot>
      </q-toolbar>
      <q-table
        v-model:pagination="pagination"
        v-model:selected="selected"
        :title="props.title"
        :rows="rows"
        :grid="props.grid"
        :columns="props.columns"
        :loading="loading"
        :rows-per-page-options="[10, 25, 50]"
        :pagination-label="getPaginationLabel"
        flat
        class="full-width q-crud-table"
        no-data-label="No existe registros disponibles"
        no-results-label="No existe registros"
        loading-label="Cargando..."
        rows-per-page-label="Filas por pagina"
        @request="onRequest"
        row-key="id"
        binary-state-sort
      >
        <template
          v-slot:top v-if="enableFilter">
          <div class="q-pl-md full-width q-crud-filter">
            <q-icon name="search" size="md" class="icon-search" />
            <div class="row q-col-gutter-xs no-padding full-width">
              <div
                v-for="(item, index) of props.filters"
                :key="index"
                class="col-3">
                <q-select
                  v-if="item.type === 'select'"
                  v-model="filter[item.name]"
                  :options="item.options"
                  :label="item.label"
                  behavior="menu"
                  clearable
                  filled
                  dense
                  emit-value
                  map-options
                  :autofocus="index === 0" />
                <q-checkbox
                  v-if="item.type === 'checkbox'"
                  v-model="filter[item.name]"
                  :label="item.label"
                  filled
                  dense
                  :autofocus="index === 0" />
                <q-input
                  v-if="item.type === 'input'"
                  v-model="filter[item.name]"
                  :label="item.label"
                  clearable
                  filled
                  dense
                  :autofocus="index === 0"
                  debounce="500" />
                <q-input
                  v-if="item.type === 'date'"
                  v-model="filter[item.name]"
                  :label="item.label"
                  clearable
                  filled
                  dense>
                  <template v-slot:append :props="item">
                    <q-icon name="event" class="cursor-pointer"></q-icon>
                    <q-popup-proxy
                      :ref="item.name"
                      transition-show="scale"
                      transition-hide="scale">
                      <q-date
                        v-model="filter[item.name]"
                        color="primary"
                        mask="YYYY-MM-DD"
                        @input="(evt) => ocultarPopup(evt, item.name)" />
                    </q-popup-proxy>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:body="props">
          <slot
            :row="props.row"
            :open="openModal"
            :update="updateList"
            name="row" />
        </template>
        <template v-slot:item="props">
          <slot
            :row="props.row"
            :selected="props.selected"
            :open="openModal"
            :update="updateList"
            name="item" />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { http } from 'boot/http'
import { Result } from '../../entities/Entity'

interface Props {
  title?: string
  columns: []
  filters?: []
  grid?: boolean
  order?: string
  url: string,
  openFilter: boolean
}

interface Pagination {
  sortBy: string
  descending: boolean
  page: number
  rowsPerPage: number
  rowsNumber: number
  'rows-per-page-label': string
}

const props = defineProps<Props>()

const rows = ref([])
const pagination = ref<Pagination>({
  sortBy: props.order || 'user.id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  'rows-per-page-label': 'Páginas'
})
const selected = ref([])
const loading = ref<boolean>(false)
const modal = ref(false)
const filter = ref<Record<string, string>>({})
const enableFilter = ref<boolean>(!!props.openFilter)

const toggleFilter = () => {
  enableFilter.value = !enableFilter.value
  filter.value = {}
}

function getPaginationLabel (firstRowIndex: number, endRowIndex: number, totalRowsNumber: number) {
  return `${firstRowIndex} - ${endRowIndex} de ${totalRowsNumber}`
}

const onRequest = async (propsData: { pagination: Pagination }) => {
  loading.value = true
  const { page, rowsPerPage, sortBy, descending } = propsData.pagination
  const query = {
    limit: rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage,
    page
  }
  if (sortBy) {
    query.order = (descending ? '-' : '') + sortBy
  }
  if (Object.keys(filter.value).length) {
    for (const key of Object.keys(filter.value)) {
      if (filter.value[key]) {
        if (filter.value[key].toString().length > 0) {
          query[key] = filter.value[key]
        }
      }
    }
  }
  const response = await http.get(http.convertQuery(props.url, query), false) as Result<unknown>
  void nextTick(() => {
    loading.value = false
    if (response) {
      rows.value = response.rows
      pagination.value = propsData.pagination
      pagination.value.rowsNumber = response.count
    }
  })
}

const openModal = () => {
  modal.value = true
}

const closeModal = () => {
  modal.value = false
}

const updateList = async () => {
  await onRequest({ pagination: pagination.value })
}

watch(() => JSON.parse(JSON.stringify(filter.value)) as Record<string, string>, async () => {
  await onRequest({ pagination: pagination.value })
})

onMounted(async () => {
  await onRequest({ pagination: pagination.value })
})
</script>

<style lang="scss">
.q-crud-table {
  width: 100%;

  &.q-table__card {
    background: transparent;
  }

  .q-crud-filter {
    position: relative;
    background: #EBF0F2;
    padding: 5px 5px 5px 7px;

    &::before {
      content: '';
      border-radius: 10px 0 0 10px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -22px;
      background: #EBF0F2;
      width: 30px;
    }

    .icon-search {
      position: absolute;
      top: 50%;
      left: -20px;
      transform: translateY(-50%);
    }
  }

  .icon-search {
    color: $texto;
    margin-top: 4px;
  }

  .col-grow {
    width: 250px;
  }
}
</style>
