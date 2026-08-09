<template>
  <q-page :class="['landing-page', { 'bg-dark text-white': $q.dark.isActive }]">

    <!-- Hero Section -->
    <section class="hero-section flex flex-center relative-position">
      <div class="row full-width max-width-container q-px-md items-center">
        <!-- Text Content -->
        <div class="col-12 col-md-6 q-pr-lg-xl q-pb-xl q-pt-md relative-position" style="z-index: 1;">
          <div class="q-mb-md">
            <q-badge outline color="primary" class="q-px-md q-py-sm text-subtitle2 text-weight-bold shadow-1 bg-transparent" style="border-width: 2px;">
              <q-icon name="stars" class="q-mr-sm" size="18px" /> Dermatología Especializada
            </q-badge>
          </div>

          <h1 class="text-h2 text-weight-bolder q-mb-md hero-title" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            Salud y estética <br />
            <span class="text-primary">para tu piel.</span>
          </h1>
          <p class="text-h6 q-mb-xl text-weight-regular hero-subtitle" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
            Atención dermatológica de prestigio con tecnología avanzada y un enfoque centrado en tu bienestar. Descubre la mejor versión de tu piel.
          </p>

          <div class="row q-gutter-md items-center">
            <q-btn
              color="primary"
              label="Agendar Cita Ahora"
              class="q-px-xl q-py-md text-subtitle1 shadow-6 hero-btn full-width-sm"
              unelevated
              no-caps
              icon-right="arrow_forward"
              @click="scrollToAgenda"
            />
          </div>
        </div>

        <!-- Graphic Content -->
        <div class="col-12 col-md-6 flex justify-center q-mt-xl q-mt-md-none hero-image-container relative-position" style="z-index: 1;">
          <div class="hero-image-abstract shadow-10 flex flex-center" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-primary'">
             <q-icon name="spa" size="120px" :color="$q.dark.isActive ? 'primary' : 'white'" class="opacity-80" />
          </div>

          <!-- Floating Glass Card -->
          <q-card class="floating-glass-card absolute shadow-5" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'">
            <q-card-section class="row items-center q-pa-md">
              <q-avatar size="50px" color="secondary" text-color="white" icon="verified" class="q-mr-md shadow-2" />
              <div>
                <div class="text-weight-bold text-subtitle1">Certificación</div>
                <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Consejo Mexicano De Dermatología</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- Formas decorativas de fondo -->
      <div class="blob blob-1 opacity-20" :class="$q.dark.isActive ? 'bg-primary' : 'bg-secondary'"></div>
      <div class="blob blob-2 opacity-10" :class="$q.dark.isActive ? 'bg-secondary' : 'bg-accent'"></div>
    </section>

    <!-- Carousel Section -->
    <section class="carousel-section q-py-xl" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <div class="max-width-container q-px-md">
        <q-carousel
          v-model="carouselSlide"
          transition-prev="fade"
          transition-next="fade"
          swipeable
          animated
          control-color="primary"
          navigation
          padding
          arrows
          autoplay
          infinite
          height="500px"
          class="shadow-4 rounded-borders"
        >
          <q-carousel-slide name="clinica" img-src="/derma_clinica.jpg">
            <div class="absolute-bottom custom-caption text-white q-pa-lg">
              <div class="text-h3 text-white text-weight-bold q-mb-sm">Dermatología Clínica</div>
              <div class="text-h6 text-white text-weight-regular">Diagnóstico preciso y tratamientos médicos efectivos para afecciones cutáneas. Recupera la salud de tu piel.</div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="estetica" img-src="/derma_estetica.jpg">
            <div class="absolute-bottom custom-caption text-white q-pa-lg">
              <div class="text-h3 text-white text-weight-bold q-mb-sm">Estética y Rejuvenecimiento</div>
              <div class="text-h6 text-white text-weight-regular">Realza tu belleza natural con procedimientos seguros y mínimamente invasivos. Tecnología para resaltar tu mejor versión.</div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="prevencion" img-src="/derma_prevencion.jpg">
            <div class="absolute-bottom custom-caption text-white q-pa-lg">
              <div class="text-h3 text-white text-weight-bold q-mb-sm">Cáncer de Piel y Prevención</div>
              <div class="text-h6 text-white text-weight-regular">El cuidado oportuno salva vidas. Realiza tu chequeo dermatológico anual preventivo y mantén tu piel libre de riesgos.</div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </section>

    <!-- Sección de Confianza -->
    <section class="trust-section q-py-xl text-center" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
      <div class="max-width-container q-px-md">
        <h2 class="text-h5 text-weight-bold q-mb-xl" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
          Dr. Salvador Sobrevilla Ondarza <span class="text-weight-regular" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">| Dermatólogo Certificado</span>
        </h2>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-4">
            <q-icon name="health_and_safety" size="48px" color="primary" class="q-mb-sm" />
            <div class="text-h6 text-weight-medium">Cuidado Clínico</div>
            <p class="text-grey-7">Diagnóstico preciso y tratamientos médicos efectivos.</p>
          </div>
          <div class="col-12 col-sm-4">
            <q-icon name="face_retouching_natural" size="48px" color="accent" class="q-mb-sm" />
            <div class="text-h6 text-weight-medium">Estética Premium</div>
            <p class="text-grey-7">Procedimientos mínimamente invasivos para realzar tu belleza.</p>
          </div>
          <div class="col-12 col-sm-4">
            <q-icon name="science" size="48px" color="secondary" class="q-mb-sm" />
            <div class="text-h6 text-weight-medium">Tecnología Avanzada</div>
            <p class="text-grey-7">Equipamiento de última generación a tu disposición.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección Interactiva: Agendar Cita -->
    <section id="seccion-agendar" class="agenda-section q-py-xl flex flex-center" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-1'">
      <div class="max-width-container full-width q-px-md">

        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Agenda tu Cita</h2>
          <p class="text-subtitle1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Selecciona el día y horario que mejor te convenga.</p>
        </div>

        <q-card class="agenda-card shadow-3 q-mx-auto" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'">
          <q-card-section class="q-pa-lg q-pa-md-xl">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
              flat
              class="bg-transparent"
              :dark="$q.dark.isActive"
            >
              <!-- Paso 1: Selección de Fecha y Hora -->
              <q-step
                :name="1"
                title="Día a agendar"
                icon="calendar_month"
                :done="step > 1"
              >
                <div class="row q-col-gutter-xl q-mt-md">
                  <div class="col-12 col-md-6 flex justify-center">
                    <q-date
                      v-model="booking.date"
                      mask="YYYY-MM-DD"
                      color="primary"
                      :options="dateOptions"
                      @update:model-value="fetchAvailability"
                      flat
                      class="custom-date shadow-1"
                      :dark="$q.dark.isActive"
                    />
                  </div>

                  <div class="col-12 col-md-6">
                    <div class="text-h6 q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Horarios Disponibles</div>

                    <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                      <div v-if="loadingSlots" class="flex flex-center q-pa-xl" key="loading">
                        <q-spinner-puff color="primary" size="3em" />
                      </div>

                      <div v-else-if="!booking.date" class="text-grey-6 text-center q-pa-lg" key="empty">
                        <q-icon name="event" size="48px" class="q-mb-md opacity-50" />
                        <div class="text-body1">Selecciona una fecha en el calendario.</div>
                      </div>

                      <div v-else-if="availableSlots.length === 0" class="text-grey-6 text-center q-pa-lg" key="no-slots">
                        <q-icon name="event_busy" size="48px" class="q-mb-md opacity-50" />
                        <div class="text-body1">Día sin disponibilidad. Por favor elige otra fecha.</div>
                      </div>

                      <div v-else class="row q-col-gutter-md" key="slots">
                        <div class="col-6 col-sm-4" v-for="slot in availableSlots" :key="slot">
                          <q-btn
                            :color="booking.time === slot ? 'primary' : 'primary'"
                            :outline="booking.time !== slot"
                            :label="slot"
                            class="full-width time-slot-btn"
                            :class="{'slot-selected': booking.time === slot, 'slot-unselected': booking.time && booking.time !== slot}"
                            unelevated
                            @click="booking.time = slot"
                          />
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="row justify-end q-mt-xl">
                  <q-btn
                    @click="goToStep2"
                    color="primary"
                    label="Siguiente Paso"
                    icon-right="arrow_forward"
                    :disable="!booking.date || !booking.time"
                    class="q-px-xl q-py-sm shadow-2"
                    unelevated
                    no-caps
                  />
                </div>
              </q-step>

              <!-- Paso 2: Datos del Paciente -->
              <q-step
                :name="2"
                title="Tus Datos"
                icon="person_outline"
                :done="step > 2"
              >
                <transition appear enter-active-class="animated slideInRight">
                  <q-form @submit="requestOtp" class="q-gutter-y-lg q-mt-md">
                    <div class="row q-col-gutter-lg">
                      <div class="col-12 col-md-6">
                        <q-input
                          ref="nameInput"
                          outlined
                          v-model="booking.first_name"
                          label="Nombre(s) *"
                          lazy-rules
                          :rules="[val => val && val.length > 0 || 'Requerido']"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          outlined
                          v-model="booking.last_name"
                          label="Apellidos *"
                          lazy-rules
                          :rules="[val => val && val.length > 0 || 'Requerido']"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          outlined
                          v-model="booking.phone"
                          label="Teléfono Móvil (WhatsApp) *"
                          type="tel"
                          lazy-rules
                          :rules="[val => val && val.length >= 10 || 'Requerido a 10 dígitos mínimo']"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          outlined
                          v-model="booking.email"
                          label="Correo Electrónico (Opcional)"
                          type="email"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                      <div class="col-12">
                        <div class="text-subtitle2 q-mb-sm" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'">Motivo de consulta *</div>
                        <q-btn-toggle
                          v-model="booking.type"
                          spread
                          no-caps
                          rounded
                          unelevated
                          toggle-color="primary"
                          :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
                          :text-color="$q.dark.isActive ? 'white' : 'dark'"
                          :options="typeOptions"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          outlined
                          v-model="booking.notes"
                          type="textarea"
                          label="Notas o detalles adicionales"
                          rows="3"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                    </div>

                    <div class="row justify-between q-mt-xl">
                      <q-btn flat @click="step = 1" color="grey-7" label="Volver" icon="arrow_back" no-caps />
                      <q-btn
                        type="submit"
                        color="primary"
                        label="Agendar Cita"
                        icon-right="check_circle"
                        :loading="submitting"
                        class="q-px-xl q-py-sm shadow-3"
                        unelevated
                        no-caps
                      />
                    </div>
                  </q-form>
                </transition>
              </q-step>
            </q-stepper>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- Footer Simple -->
    <footer class="bg-dark text-white q-py-lg text-center">
      <div class="text-body2 opacity-70">
        © 2026 Dr. Salvador Sobrevilla Ondarza. Clínica Dermatológica. Todos los derechos reservados.
      </div>
    </footer>

    <!-- Diálogo de OTP -->
    <q-dialog v-model="showOtpDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 16px" class="q-pa-none" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'">
        <q-card-section class="bg-primary text-center">
          <q-avatar size="64px" color="white" text-color="primary" icon="mark_chat_read" class="q-mb-md shadow-2" />
          <div class="text-h6 text-weight-bold text-white">Verificación WhatsApp</div>
          <div class="text-body2 text-white q-mt-sm">
            Hemos enviado un código OTP de 6 dígitos a tu WhatsApp <strong>{{ booking.phone }}</strong>.
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            outlined
            v-model="otpCode"
            label="Código de Verificación"
            mask="######"
            unmasked-value
            autofocus
            class="text-h6 text-center"
            @keyup.enter="verifyOtpAndBook"
            :dark="$q.dark.isActive"
          />
        </q-card-section>

        <q-card-actions align="center" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn unelevated color="primary" label="Confirmar Cita" @click="verifyOtpAndBook" :loading="verifyingOtp" class="full-width q-mt-sm" style="border-radius: 8px" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const $q = useQuasar()
const step = ref(1)
const carouselSlide = ref('clinica')

const nameInput = ref(null)

const goToStep2 = () => {
  step.value = 2
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
    }
  })
}

const scrollToAgenda = () => {
  const el = document.getElementById('seccion-agendar')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const typeOptions = [
  { label: 'Dermatología Clínica', value: 'clinico' },
  { label: 'Medicina Estética', value: 'estetico' }
]

const booking = reactive({
  date: '',
  time: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  type: 'clinico',
  notes: ''
})

const availableSlots = ref([])
const loadingSlots = ref(false)
const submitting = ref(false)

const showOtpDialog = ref(false)
const otpCode = ref('')
const verifyingOtp = ref(false)

const dateOptions = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date < today) return false
  return date.getDay() !== 0
}

const fetchAvailability = async (date) => {
  if (!date) return

  loadingSlots.value = true
  booking.time = ''

  try {
    const response = await api.get('/availability', {
      params: { date }
    })
    availableSlots.value = response.data.available_slots
  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      color: 'negative',
      message: 'No se pudieron cargar los horarios.',
      icon: 'error'
    })
    availableSlots.value = ['09:00', '09:30', '10:30', '11:00', '16:00', '16:30']
  } finally {
    loadingSlots.value = false
  }
}

// Interceptar onSubmit para mandar OTP primero
const requestOtp = async () => {
  submitting.value = true
  try {
    const response = await api.post('/otp/send', { phone: booking.phone })

    $q.notify({ color: 'positive', message: response.data.message || 'Código enviado a tu WhatsApp.', position: 'top' })
    otpCode.value = ''
    showOtpDialog.value = true
  } catch (error) {
    console.error('Error enviando OTP:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.error || 'Hubo un error al enviar el código a ese número.',
      icon: 'error'
    })
  } finally {
    submitting.value = false
  }
}

// Verificar OTP y finalizar la cita
const verifyOtpAndBook = async () => {
  if (!otpCode.value || otpCode.value.length < 6) {
    $q.notify({ color: 'warning', message: 'Ingresa el código completo de 6 dígitos.' })
    return
  }

  verifyingOtp.value = true
  try {
    const payload = {
      first_name: booking.first_name,
      last_name: booking.last_name,
      phone: booking.phone,
      email: booking.email,
      type: booking.type,
      appointment_date: booking.date,
      start_time: booking.time,
      notes: booking.notes,
      otp_code: otpCode.value
    }

    await api.post('/appointments', payload)

    $q.notify({
      color: 'positive',
      message: '¡Cita agendada exitosamente!',
      icon: 'check_circle',
      timeout: 4000
    })

    // Limpiar formulario y cerrar modal
    showOtpDialog.value = false
    Object.keys(booking).forEach(key => booking[key] = '')
    booking.type = 'clinico'
    step.value = 1

  } catch (error) {
    console.error('Error verificando cita:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || error.response?.data?.error || 'Código OTP inválido o expirado.',
      icon: 'error'
    })
  } finally {
    verifyingOtp.value = false
  }
}
</script>

<style lang="scss" scoped>

.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  overflow: hidden;
  min-height: 75vh;
  padding-top: 0;
}

.hero-title {
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero-subtitle {
  max-width: 500px;
  line-height: 1.6;
}

.hero-btn {
  border-radius: 30px !important;
  transition: transform 0.3s ease;
}
.hero-btn:hover {
  transform: translateY(-3px);
}

.hero-image-abstract {
  width: 400px;
  height: 400px;
  border-radius: 40px 140px 40px 140px;
  border: 8px solid rgba(255, 255, 255, 0.15);
  transition: all 0.5s ease;
  animation: morphing 10s ease-in-out infinite;
}

@keyframes morphing {
  0% { border-radius: 40px 140px 40px 140px; }
  50% { border-radius: 140px 40px 140px 40px; }
  100% { border-radius: 40px 140px 40px 140px; }
}

.floating-glass-card {
  bottom: 30px;
  left: -30px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.85); /* Default fallback */
  animation: float 5s ease-in-out infinite;
}

.bg-dark.floating-glass-card {
  background: rgba(30, 30, 30, 0.85) !important;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

/* Blobs Backgrounds */
.blob {
  position: absolute;
  filter: blur(80px);
  z-index: 0;
}
.blob-1 {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  top: -100px;
  right: -100px;
}
.blob-2 {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  bottom: -50px;
  left: -50px;
}

/* Agenda Section */
.agenda-section {
  min-height: 80vh;
}

.agenda-card {
  width: 100%;
  max-width: 900px;
  border: none !important;
  border-radius: 20px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03) !important;
}

.custom-date {
  border-radius: 16px;
  /* background-color: #FFFFFF; Removed to adapt to dark mode natively */
}

.time-slot-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 12px !important;
}

.slot-selected {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 96, 100, 0.2);
}

.slot-unselected {
  opacity: 0.5;
  filter: grayscale(100%);
}

.custom-caption {
  text-align: center;
  padding: 24px 24px 48px 24px;
  background-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 4px 20px rgba(0, 0, 0, 0.7);
}
</style>
