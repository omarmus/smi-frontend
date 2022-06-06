<template>
  <div class="member-info" v-if="user">
    <div class="row q-col-gutter-x-sm">
      <div class="col-xs-12 col-sm-6">
        <h2 class="member-info-title">Datos Personales</h2>
        <ul class="member-info-list">
          <li><strong>Nombre completo:</strong> {{ user.person.fullname }}</li>
          <li><strong>Primer apellido:</strong> {{ user.person.lastName }}</li>
          <li><strong>Segundo apellido:</strong> {{ user.person.secondLastName }}</li>
          <li><strong>Nombre(s):</strong> {{ user.person.firstName }}</li>
          <li><strong>{{ labels[user.person.documentType].label }}:</strong> {{ user.person.documentNumber }}</li>
          <li><strong>Lugar de nacimiento:</strong> {{ user.person.birthplaceCountry }}</li>
          <li><strong>Fecha de nacimiento:</strong> {{ format(user.person.birthday) }}</li>
          <li><strong>Género:</strong> {{ labels[user.person.gender].label }}</li>
          <li><strong>Estado civil:</strong> {{ labels[user.person.civilStatus][user.person.gender === 'MALE' ? 'male' : 'female'] }}</li>
          <li><strong>Ocupación:</strong> {{ user.person.occupation }}</li>
          <li><strong>Educación:</strong> {{ user.person.education }}</li>
          <li v-if="user.person.phone"><strong>Teléfono:</strong> {{ user.person.phone }}</li>
          <li v-if="user.person.mobile"><strong>Teléfono móvil:</strong> {{ user.person.mobile }}</li>
          <li><strong>Nacionalidad:</strong> {{ user.person.nationality }}</li>
          <li><strong>Dirección:</strong> {{ user.person.address }}</li>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-6">
        <h2 class="member-info-title">Afiliación</h2>
        <ul class="member-info-list">
          <li><strong>Procedencia religiosa:</strong> {{ user.person.origin }}</li>
          <li><strong>Fecha de bautismo:</strong> {{ format(user.person.christeningDate) }}</li>
          <li><strong>Bautizado por:</strong> {{ user.person.baptismPastor }}</li>
          <li><strong>Fecha de aceptación:</strong> {{ format(user.person.acceptanceDate) }}</li>
          <li><strong>Fecha de aceptación en la iglesia local:</strong> {{ format(user.person.acceptanceLocalDate) }}</li>
          <li><strong>Iglesia donde pertenece:</strong> {{ user.company.name }}</li>
          <li>
            <strong>Tipo de membresía:</strong>
            <q-chip
              square
              dense
              class="q-my-none"
              :color="labels[user.type].color"
              :text-color="labels[user.type].textColor"
              :label="labels[user.type].label"
            />
          </li>
          <li v-if="user.person.memberStatus">
            <span v-if="user.person.dischargeDate">
              <strong>Fecha en que fue dado/a de baja:</strong> {{ format(user.person.dischargeDate) }} <strong>por </strong>
            </span>
            <span v-else>
              <strong>Estado de la membresía: </strong>
            </span>
            <q-chip
              square
              dense
              class="q-my-none"
              :color="labels[user.person.memberStatus].color"
              :text-color="labels[user.person.memberStatus].textColor"
              :label="labels[user.person.memberStatus].label"
            />
          </li>
        </ul>
        <h2 class="member-info-title">Cargos ocupados</h2>
        <ul class="member-info-list">
          <li><strong>Cargo:</strong> {{ user.person.position || 'NINGUNO' }}</li>
        </ul>
        <h2 class="member-info-title">Datos de usuario</h2>
        <ul class="member-info-list">
          <li><strong>Nombre de usuario:</strong> {{ user.username }}</li>
          <li><strong>Correo electrónico:</strong> {{ user.email }}</li>
          <li>
            <strong>Estado del usuario:</strong>
            <q-chip
              square
              dense
              class="q-my-none"
              :color="labels[user.state].color"
              :text-color="labels[user.state].textColor"
              :label="labels[user.state].label"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { http } from 'boot/http'
import { User } from '../../../components/entities/User'
import { format } from '../../../components/plugins/datetime'

const labels = {
  MEMBER: { color: 'positive', textColor: 'white', label: 'MIEMBRO' },
  SYMPATHIZER: { color: 'info', textColor: 'white', label: 'MIEMBRO DE ESCUELA SABÁTICA' },
  VISIT: { color: 'warning', textColor: 'white', label: 'VISITA' },
  ACTIVE: { color: 'positive', textColor: 'white', label: 'ACTIVO' },
  INACTIVE: { color: 'warning', textColor: 'white', label: 'INACTIVO' },
  NI: { label: 'C.I.' },
  PASSPORT: { label: 'PASAPORTE' },
  OTHER: { label: 'OTRO' },
  MALE: { label: 'HOMBRE' },
  FEMALE: { label: 'MUJER' },
  BAPTIZED: { color: 'positive', textColor: 'white', label: 'BAUTIZADO' },
  RECEPTION: { color: 'positive', textColor: 'white', label: 'RECIBIMIENTO' },
  TRANSFER: { color: 'positive', textColor: 'white', label: 'TRANSFERENCIA' },
  EXCLUSION: { color: 'negative', textColor: 'white', label: 'EXCLUSION' },
  RESIGNATION: { color: 'negative', textColor: 'white', label: 'RENUNCIA' },
  DEATH: { color: 'negative', textColor: 'white', label: 'FALLECIDO' },
  SINGLE: { male: 'SOLTERO', female: 'SOLTERA' },
  MARRIED: { male: 'CASADO', female: 'CASADA' },
  DIVORCED: { male: 'DIVORCIADO', female: 'DIVORCIADA' },
  WIDOW: { male: 'VIUDO', female: 'VIUDA' }
}

interface Props {
  id: number
}

const props = defineProps<Props>()

const user = ref()

onMounted(async () => {
  user.value = await http.get(`users/${props.id}`) as User
})
</script>

<style lang="scss">
.q-table td.member-info-container {
  padding: 0;
}
.member-info {
  font-size: .85rem;
  line-height: 1.5rem;
  background-color: white;
  padding: 10px 15px 0;
}
.member-info-title {
  margin: 5px 0;
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: 600;
  color: $warning;
}
.member-info-list {
  margin: 0 0 10px;
  padding: 0;
  list-style: none;
  color: $secondary;
  white-space: normal;
}
</style>