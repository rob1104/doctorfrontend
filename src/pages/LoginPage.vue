<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="login-card shadow-4 q-pa-lg">
          <q-card-section class="text-center">
            <q-avatar size="80px" color="primary" text-color="white" class="q-mb-md shadow-2">
              <q-icon name="admin_panel_settings" size="40px" />
            </q-avatar>
            <div class="text-h5 text-weight-bold text-dark q-mb-xs">Acceso Médico</div>
            <div class="text-subtitle2 text-grey-6">Ingresa tus credenciales para continuar</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                outlined
                v-model="email"
                type="email"
                label="Correo Electrónico"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Ingresa tu correo']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                outlined
                v-model="password"
                type="password"
                label="Contraseña"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Ingresa tu contraseña']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div class="q-mt-xl">
                <q-btn
                  type="submit"
                  color="primary"
                  label="Iniciar Sesión"
                  class="full-width q-py-sm shadow-2"
                  unelevated
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pt-none q-mt-sm">
            <q-btn flat color="grey-7" label="Volver al Portal Clínico" to="/" no-caps size="sm" />
            <div class="text-caption text-grey-5 q-mt-md">Versión {{ version }}</div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const version = import.meta.env.VITE_APP_VERSION || 'Desarrollo'

const onSubmit = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    
    $q.notify({
      color: 'positive',
      message: 'Bienvenido al sistema',
      icon: 'check_circle'
    })
    
    router.push('/admin/dashboard')
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Credenciales inválidas o error de conexión.',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
}
</style>
