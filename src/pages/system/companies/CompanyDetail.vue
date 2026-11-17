<template>
  <div class="company-detail">
    <div class="row items-center q-mb-md" v-if="company && canEdit">
      <div class="col">
        <q-btn
          icon="edit"
          label="Editar los datos de la iglesia"
          color="primary"
          no-caps
          @click="edit" />
      </div>
    </div>

    <q-banner v-if="error" dense class="q-mb-md">
      <template v-slot:avatar>
        <q-icon name="error_outline" color="negative" />
      </template>
      {{ error }}
    </q-banner>

    <template v-else-if="company">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-6">
          <q-card flat bordered class="q-pa-md q-mb-md">
            <h3 class="company-detail__title">Identificación</h3>
            <table class="company-detail__rows">
              <tbody>
                <tr>
                  <th scope="row">Nombre</th>
                  <td>{{ company.name || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Acrónimo</th>
                  <td>{{ company.acronym || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Tipo</th>
                  <td>{{ typeLabel }}</td>
                </tr>
                <tr>
                  <th scope="row">Misión</th>
                  <td>{{ missionName || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Estado</th>
                  <td>{{ company.state === 'INACTIVE' ? 'INACTIVO' : 'ACTIVO' }}</td>
                </tr>
                <tr>
                  <th scope="row">Descripción</th>
                  <td>{{ company.description || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </q-card>

          <q-card flat bordered class="q-pa-md">
            <h3 class="company-detail__title">Contacto</h3>
            <table class="company-detail__rows">
              <tbody>
                <tr>
                  <th scope="row">Teléfonos</th>
                  <td>{{ company.phones || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Correo electrónico</th>
                  <td>{{ company.email || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Sitio web</th>
                  <td>{{ company.web || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Subdominio</th>
                  <td>{{ company.subdomain || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Moneda</th>
                  <td>{{ company.money || '—' }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="contacts.length > 0" class="q-mt-md">
              <h4 class="company-detail__subtitle">Contactos</h4>
              <table class="company-detail__rows">
                <tbody>
                  <tr v-for="contact in contacts" :key="contact.id">
                    <th scope="row">{{ contact.name || 'Sin nombre' }}</th>
                    <td>{{ contact.phone || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="company-detail__empty">Todavía no hay contactos registrados.</p>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-6">
          <q-card flat bordered class="q-pa-md">
            <h3 class="company-detail__title">Ubicación</h3>
            <table class="company-detail__rows">
              <tbody>
                <tr>
                  <th scope="row">Dirección</th>
                  <td>{{ company.address || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Departamento</th>
                  <td>{{ company.department || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Provincia</th>
                  <td>{{ company.province || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">País</th>
                  <td>{{ company.country || '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Latitud</th>
                  <td>{{ company.latitude ?? '—' }}</td>
                </tr>
                <tr>
                  <th scope="row">Longitud</th>
                  <td>{{ company.longitude ?? '—' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="q-mt-md">
              <MapPicker
                readonly
                :latitude="company.latitude"
                :longitude="company.longitude"
                :center="mapCenter" />
              <p v-if="!hasPoint" class="company-detail__empty">
                La iglesia todavía no tiene coordenadas registradas.
              </p>
            </div>
          </q-card>
        </div>
      </div>
    </template>

    <q-skeleton v-else type="rect" height="220px" square />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { http } from 'boot/http'
import { useStore } from '../../../store'
import { Company } from '../../../components/entities/Company'
import { Result } from '../../../components/entities/Entity'
import MapPicker from '../../../components/common/map-picker/MapPicker.vue'
import boliviaDepartamentosProvincias from '../../../data/bolivia-departamentos-provincias.json'

const props = defineProps<{
  companyId: number
}>()

type CompanyDetailEmits = {
  (event: 'edit'): void
}

const emit = defineEmits<CompanyDetailEmits>()

/** Avisa a la página que se quiere editar (abre el modal de la iglesia). */
const edit = () => emit('edit')

const store = useStore()

/** La secretaría puede editar los datos de su iglesia (permiso actual). */
const canEdit = computed(() => store.state.user?.permissions?.includes('company:update') ?? false)

const company = ref<Company>()
const companies = ref<Company[]>([])
const error = ref<string>('')

const types: Record<string, string> = {
  GENERAL: 'GENERAL',
  UNION: 'UNIÓN',
  DIVISION: 'DIVISIÓN',
  ASSOCIATION: 'ASOCIACIÓN',
  MISSION: 'MISIÓN',
  CHURCH: 'IGLESIA',
  GROUP: 'GRUPO'
}

const typeLabel = computed(() => types[company.value?.type ?? ''] ?? company.value?.type ?? '—')

const missionName = computed(() => {
  const id = company.value?.idCompany
  if (!id) {
    return ''
  }
  return companies.value.find(item => item.id === id)?.name ?? ''
})

const contacts = computed(() => company.value?.info?.contacts ?? [])

const hasPoint = computed(() =>
  company.value?.latitude !== null && company.value?.latitude !== undefined &&
  company.value?.longitude !== null && company.value?.longitude !== undefined)

/** Si la iglesia tiene departamento, el mapa abre ahí. */
const mapCenter = computed(() => {
  const found = (boliviaDepartamentosProvincias as Array<{
    department: string, latitude?: number, longitude?: number
  }>).find(item => item.department === company.value?.department)

  if (found?.latitude !== undefined && found?.longitude !== undefined) {
    return { lat: found.latitude, lng: found.longitude, zoom: 10 }
  }
  return null
})

onMounted(async () => {
  try {
    company.value = await http.get(`companies/${props.companyId}`) as Company
    const list = await http.get('companies', false) as Result<Company>
    companies.value = list.rows
  } catch (e) {
    error.value = 'No se pudo cargar la información de la iglesia.'
  }
})
</script>

<style lang="scss" scoped>
.company-detail {
  &__title {
    font-size: 1rem;
    font-weight: bold;
    color: $secondary;
    margin: 0 0 10px;
  }

  &__subtitle {
    font-size: 0.9rem;
    font-weight: bold;
    color: $secondary;
    margin: 0 0 6px;
  }

  // Tabla de datos: la etiqueta a la izquierda, el valor a la derecha.
  &__rows {
    width: 100%;
    border-collapse: collapse;

    th {
      font-weight: normal;
      font-size: 0.84rem;
      color: $texto-claro;
      text-align: left;
      padding: 4px 0;
      vertical-align: top;
    }

    td {
      font-size: 0.95rem;
      text-align: right;
      padding: 4px 0;
      color: $secondary;
      word-break: break-word;
    }
  }

  &__empty {
    font-size: 0.82rem;
    color: $texto-claro;
    margin: 10px 0 0;
  }
}
</style>
