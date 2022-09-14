<template>
  <q-card class="card-roles">
    <q-toolbar class="q-pa-md">
      <q-icon
        name="photo_camera"
        size="md"
      />
      <q-toolbar-title>
        Foto de <span v-if="user">{{ user?.person?.firstName }}</span>
      </q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="close"
        v-close-popup />
    </q-toolbar>
    <q-card-section>
      <div v-show="!viewEditor">
        <figure v-if="user?.person?.photo" class="member-photo">
          <img :src="`${urlBase.replace(/\/api\//g, '')}/files/users/${user.person.photo}`" :alt="user.person.firstName">
        </figure>
        <q-file
          v-model="file"
          :label="user?.person?.photo ? 'Selecciona una nueva imagen' : 'Seleccione una imagen'"
          filled>
          <template v-slot:prepend>
            <q-icon name="photo_camera" @click.stop.prevent />
          </template>
        </q-file>
      </div>
      <div
        class="upload-photo-wrap"
        v-show="viewEditor">
        <div id="upload-photo"></div>
      </div>
    </q-card-section>
    <q-card-actions align="right" class="q-pa-md">
      <q-btn label="Cancelar" icon="close" v-close-popup id="btn-photo" />
      <q-btn label="Cambiar" icon="add_a_photo" @click="viewEditor = false" v-if="viewEditor" />
      <q-btn
        label="Guardar"
        color="primary"
        icon="check"
        @click="sendPhoto"
        v-if="viewEditor"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { http, urlBase } from 'boot/http'
import { User } from '../../../components/entities/User'
import Croppie from 'croppie'
import 'croppie/croppie.css'

interface Props {
  id: number
}

const props = defineProps<Props>()

const user = ref()
const file = ref()
const viewEditor = ref<boolean>(false)

const uploadCrop = ref()

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = function (e) {
    viewEditor.value = true
    uploadCrop.value.bind({ // eslint-disable-line
      url: e.target.result
    }).then(() => {
      // console.log('Vanilla bind complete', e.target.result)
    })
  }
  reader.readAsDataURL(file)
}

watch(file, () => {
  readFile(file.value)
})

const sendPhoto = () => {
  uploadCrop.value.result({ // eslint-disable-line
    type: 'blob',
    size: 'viewport'
  }).then((photo: Blob) => {
    const file = new File([photo], 'photo.png')
    const formData = new FormData()
    formData.append('file', file)
    http.post(`users/${props.id}/photo`, formData, true, {
      'content-type': 'multipart/form-data'
    })
    document.getElementById('btn-photo').click()
  })
}

onMounted(async () => {
  user.value = await http.get(`users/${props.id}`) as User
  const el = document.getElementById('upload-photo')
  uploadCrop.value = new Croppie(el, {  // eslint-disable-line
    viewport: {
      width: 380,
      height: 380
    },
    // boundary: {
    //   width: 520,
    //   height: 520
    // },
    enableExif: true
  })
})
</script>

<style lang="scss">
.card-roles {
  width: 100% !important;
  max-width: 480px !important;
}
.upload-msg {
  text-align: center;
  padding: 50px;
  font-size: 22px;
  color: #aaa;
  width: 260px;
  margin: 50px auto;
  border: 1px solid #aaa;
}
.upload-photo-wrap {
  width: 420px;
  height: 420px;
  margin: 0 auto;
  padding-bottom: 30px;
}
</style>
