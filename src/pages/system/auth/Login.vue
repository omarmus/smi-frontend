<template>
  <div class="login">
    <div class="login-left">
      <div class="login-logo">
        <div class="login-logo-smi"></div>
        <h1 class="login-logo-title">Secretaría & Tesorería</h1>
      </div>
    </div>
    <div class="login-right">
      <div class="login-form">
        <h2>Ingresar</h2>
        <p>Llene sus datos para ingresar al sistema</p>
        <q-form @submit.prevent="login" class="q-gutter-y-md">
          <q-input
            label="Nombre de usuario"
            v-model="username"
            filled
            autofocus
            :rules="[v => !!v || 'El campo es requerido']" />
          <q-input
            label="Contraseña"
            v-model="password"
            type="password"
            filled
            :rules="[v => !!v || 'El campo es requerido']" />
          <q-btn
            type="submit"
            label="Ingresar"
            no-caps
            class="full-width"
            color="primary"
            padding="13px 20px" />
        </q-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { auth } from 'boot/auth'

const username = ref()
const password = ref()

const login = () => {
  auth.login(username.value, password.value)
}
</script>

<style lang="scss">
.login {
  display: grid;
  grid-template-columns: 45% 55%;
  grid-template-rows: 1fr;
  height: 100vh;
}

.login-left {
  background-color: #fff;
  background-image: url(../../../assets/images/bg-system.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left center;
  position: relative;
}

.login-right {
  background: #F5F8FA;
  display: flex;
  align-items: center;
}

.login-form {
  margin: 0 auto 0 100px;
  width: 100%;
  max-width: 420px;
  padding-right: 20px;

  h2 {
    font-weight: bold;
    font-size: 1.6rem;
    margin: 0 0 10px;
    line-height: 2rem;
    color: $primary;
  }

  p {
    margin-bottom: 60px;
    color: $texto;
    font-size: 1rem;
  }
}

.login-logo {
  position: relative;
  z-index: 1;
  height: 100%;
}
.login-logo-title {
  position: absolute;
  bottom: 60px;
  left: 40px;
  right: 20px;
  font-weight: bold;
  font-size: 3rem;
  margin: 0;
  line-height: 2.8rem;
  color: white;
}
.login-logo-smi {
  display: inline-block;
  background-image: url(../../../assets/images/logo-smi.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 120px;
  width: 120px;
  margin: 20px 0 0 20px;
}
@media (max-width: $breakpoint-xs-max) {
  .login {
    grid-template-columns: 1fr;
    height: auto;
  }
  .login-left {
    min-height: 200px;

    .login-logo-title {
      bottom: 20px;
      left: 20px;
      right: 20px;
      font-size: 2rem;
      line-height: 2rem;
    }
  }
  .login-form {
    margin: 20px auto;
    padding: 0 20px;
  }
  .login-logo-smi {
    position: absolute;
    right: 10px;
    top: -5px;
    height: 90px;
    width: 90px;
  }
}
</style>
