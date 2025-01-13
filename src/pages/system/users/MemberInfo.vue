<template>
  <div class="member-info" v-if="user">
    <div class="row q-col-gutter-x-sm">
      <div class="col-xs-12 col-sm-6 member-info-relative">
        <h2 class="member-info-title-main">{{ user.person.fullname }}</h2>
        <h3 class="member-info-title">Datos Personales</h3>
        <ul class="member-info-list">
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
        <figure v-if="user.person.photo" class="member-info-photo">
          <img :src="`${urlBase.replace(/\/api\//g, '')}/files/users/${user.person.photo}`" :alt="user.person.firstName">
        </figure>
      </div>
      <div class="col-xs-12 col-sm-6">
        <h3 class="member-info-title">Afiliación</h3>
        <ul class="member-info-list">
          <li><strong>Iglesia donde pertenece:</strong> <strong class="text-warning">{{ user.company.name }}</strong></li>
          <li><strong>Fecha de bautismo:</strong> {{ format(user.person.christeningDate) }}</li>
          <li><strong>Bautizado por:</strong> {{ user.person.baptismPastor }}</li>
          <li><strong>Fecha de aceptación:</strong> {{ format(user.person.acceptanceDate) }}</li>
          <li><strong>Fecha de aceptación en la iglesia local:</strong> {{ format(user.person.acceptanceLocalDate) }}</li>
          <li><strong>Procedencia religiosa:</strong> {{ user.person.origin }}</li>
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
        <h3
          class="member-info-title"
          v-if="positions && positions.length > 0">Cargos ocupados</h3>
        <ul class="member-info-list">
          <li
            v-for="item in positions"
            :key="item.id">
            <strong>- {{ item.position.description }}</strong> <em>{{ item.company.name }}</em>, {{ item.begin }} - {{ item.end || 'Actualidad' }}
          </li>
        </ul>
        <h3 class="member-info-title">Datos de usuario</h3>
        <ul class="member-info-list">
          <li><strong>Nombre de usuario:</strong> {{ user.username }}</li>
          <li><strong>Correo electrónico:</strong> {{ user.email }}</li>
          <li><strong>Rol{{ user.roles.length > 1 ? 'es' : '' }} asignado{{ user.roles.length > 1 ? 's' : '' }}:</strong> {{ user.roles.map(item => item.name).join(', ') }}</li>
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
import { http, urlBase } from 'boot/http'
import { User } from '../../../components/entities/User'
import { PositionUser } from '../../../components/entities/PositionUser'
import { Result } from '../../../components/entities/Entity'
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

const user = ref<User>()
const positions = ref<PositionUser[]>()

onMounted(async () => {
  user.value = await http.get(`users/${props.id}`) as User
  positions.value = (await http.get(`positionsuser?id_user=${props.id}&order=-positionuser.begin`) as Result<User>).rows
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
.member-info-title-main {
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  color: $primary;
}
.member-info-list {
  margin: 0 0 10px;
  padding: 0;
  list-style: none;
  color: $secondary;
  white-space: normal;
}
.member-info-photo {
  width: 100%;
  max-width: 120px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 30px;

  img {
    width: 100%;
    border-radius: 50%;
  }
}
.member-info-relative {
  position: relative;
}
</style>
