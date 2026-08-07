<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center login-page">
        <!-- Fondos abstractos elegantes -->
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>

        <transition appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
          <q-card class="login-card q-pa-xl">
            <q-card-section class="text-center q-pb-none">
              <div class="logo-container q-mb-lg">
                <q-avatar size="80px" class="logo-avatar">
                  <q-icon name="medical_services" size="40px" color="primary" />
                </q-avatar>
              </div>
              <div class="text-h4 text-weight-bolder text-dark q-mb-xs tracking-tight">Sistema Médico</div>
              <div class="text-subtitle1 text-grey-6 q-mb-lg">Ingresa tus credenciales para continuar</div>
            </q-card-section>

            <q-card-section class="q-pt-md">
              <q-form @submit="onSubmit" class="q-gutter-y-lg">
                <!-- Correo Electrónico -->
                <div class="input-group">
                  <div class="input-label">Correo Electrónico</div>
                  <q-input
                    borderless
                    autofocus
                    v-model="email"
                    type="email"
                    placeholder="doctor@clinica.com"
                    lazy-rules
                    :rules="[val => !!val || 'El correo es requerido']"
                    class="elegant-input"
                    hide-bottom-space
                  >
                    <template v-slot:prepend>
                      <q-icon name="mail_outline" size="xs" class="q-pl-sm text-grey-5" />
                    </template>
                  </q-input>
                </div>

                <!-- Contraseña -->
                <div class="input-group">
                  <div class="input-label">Contraseña</div>
                  <q-input
                    borderless
                    v-model="password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    placeholder="••••••••"
                    lazy-rules
                    :rules="[val => !!val || 'La contraseña es requerida']"
                    class="elegant-input"
                    hide-bottom-space
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_outline" size="xs" class="q-pl-sm text-grey-5" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer text-grey-5 q-pr-sm hover-primary-text transition-icon"
                        @click="isPasswordVisible = !isPasswordVisible"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="q-mt-xl pt-4">
                  <q-btn
                    type="submit"
                    class="full-width btn-premium"
                    unelevated
                    size="lg"
                    :loading="loading"
                  >
                    <div class="text-weight-bold text-white tracking-wide">Iniciar Sesión</div>
                    <template v-slot:loading>
                      <q-spinner-dots class="on-left text-white" />
                      <span class="text-white">Autenticando...</span>
                    </template>
                  </q-btn>
                </div>
              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-lg">
              <q-btn flat class="hover-primary-text text-grey-6 text-weight-medium" label="Volver a página principal" to="/" no-caps />
              <div class="text-caption text-grey-4 q-mt-lg">Versión {{ version }} &copy; {{ new Date().getFullYear() }}</div>
            </q-card-section>
          </q-card>
        </transition>
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
const isPasswordVisible = ref(false)
const loading = ref(false)
const version = import.meta.env.VITE_APP_VERSION || 'Desarrollo'

const onSubmit = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value)

    $q.notify({
      color: 'dark',
      textColor: 'white',
      message: 'Autenticación exitosa. Redirigiendo...',
      icon: 'check_circle',

      classes: 'elegant-notification'
    })

    router.push('/admin/dashboard')
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Las credenciales no son correctas, intente de nuevo.',
      icon: 'error_outline',

      classes: 'elegant-notification'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  /* Un fondo muy elegante, limpio y profesional */
  background: #f8fafc;
  background-image: radial-gradient(at 0% 0%, rgba(224, 242, 254, 1) 0px, transparent 50%),
                    radial-gradient(at 100% 100%, rgba(219, 234, 254, 1) 0px, transparent 50%);
  position: relative;
  overflow: hidden;
}

/* Formas muy sutiles para dar dinamismo sin sobrecargar */
.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  animation: float 25s ease-in-out infinite;
  opacity: 0.6;
}

.shape-1 {
  width: 700px;
  height: 700px;
  background: rgba(56, 189, 248, 0.15);
  top: -200px;
  right: -200px;
}

.shape-2 {
  width: 600px;
  height: 600px;
  background: rgba(99, 102, 241, 0.1);
  bottom: -200px;
  left: -200px;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 30px); }
}

/* Tarjeta elegante estilo SaaS / Stripe */
.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  z-index: 1;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
  padding: 48px;
}

/* Logo muy sutil y limpio */
.logo-container {
  display: flex;
  justify-content: center;
}

.logo-avatar {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
}

.tracking-tight {
  letter-spacing: -0.025em;
  color: #0f172a;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

/* =========================================
   NUEVOS INPUTS (Sin Material Design)
   ========================================= */
.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  text-align: left;
}

.elegant-input {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.elegant-input:hover {
  border-color: #94a3b8;
}

/* Efecto focus súper elegante tipo Vercel / Tailwind */
.elegant-input.q-field--focused {
  border-color: #25cf33;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.elegant-input :deep(.q-field__control) {
  min-height: 46px;
  padding: 0 4px;
}

.elegant-input :deep(.q-field__native) {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 500;
}

.elegant-input :deep(.q-field__native::placeholder) {
  color: #94a3b8;
  font-weight: 400;
}

.transition-icon {
  transition: color 0.2s;
}

.hover-primary-text:hover {
  color: #3b82f6 !important;
}

/* =========================================
   BOTÓN POTENTE Y ELEGANTE
   ========================================= */
.btn-premium {
  background: #138a70 !important; /* Un tono oscuro casi negro muy elegante */
  border-radius: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2), 0 2px 4px -2px rgba(15, 23, 42, 0.1);
}

.btn-premium:hover {
  background: #1e293b !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.25), 0 4px 6px -4px rgba(15, 23, 42, 0.1);
}

.btn-premium:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);
}
</style>
