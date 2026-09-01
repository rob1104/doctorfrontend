<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="text-h4 text-dark text-weight-bold q-mb-xs">Configuración</div>
    <div class="text-subtitle1 text-grey-6 q-mb-lg">Configuración general del sistema</div>

    <q-card class="shadow-2" style="border-radius: 16px; max-width: 900px;">
      
      <!-- Tabs Header -->
      <q-tabs
        v-model="tab"
        dense
        class="text-grey-7 bg-white"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="membrete" icon="article" label="Datos de Membrete" />
        <q-tab name="agenda" icon="event" label="Agenda y Horarios" />
      </q-tabs>

      <q-separator />

      <!-- Tab Panels -->
      <q-tab-panels v-model="tab" animated>
        
        <!-- Tab 1: Membrete -->
        <q-tab-panel name="membrete" class="q-pa-none">
          <q-card-section class="bg-primary text-white row items-center q-pb-md">
            <q-avatar icon="article" color="white" text-color="primary" size="40px" class="q-mr-md shadow-1" />
            <div>
              <div class="text-h6 text-white text-weight-bold" style="line-height: 1.2;">Datos de Membrete</div>
              <div class="text-caption text-white opacity-80">Estos datos aparecerán en la cabecera de las recetas médicas y resúmenes.</div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div v-if="loadingMembrete" class="text-center q-pa-xl">
              <q-spinner-dots color="primary" size="3em" />
            </div>
            <q-form v-else @submit="saveMembreteSettings" class="q-gutter-y-lg">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.doctor_name" @update:model-value="v => formMembrete.doctor_name = v ? v.toUpperCase() : ''" label="Nombre del Doctor" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="person" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.specialty" @update:model-value="v => formMembrete.specialty = v ? v.toUpperCase() : ''" label="Especialidad" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="local_hospital" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.email" @update:model-value="v => formMembrete.email = v ? v.toLowerCase() : ''" type="email" label="Correo Electrónico" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="email" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.university" @update:model-value="v => formMembrete.university = v ? v.toUpperCase() : ''" label="Universidad de Egreso" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="school" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.professional_id" @update:model-value="v => formMembrete.professional_id = v ? v.toUpperCase() : ''" label="Cédula Profesional" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="badge" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.specialty_id" @update:model-value="v => formMembrete.specialty_id = v ? v.toUpperCase() : ''" label="Cédula de Especialidad" outlined dense color="primary">
                    <template v-slot:prepend><q-icon name="card_membership" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input :model-value="formMembrete.clinic_address" @update:model-value="v => formMembrete.clinic_address = v ? v.toUpperCase() : ''" label="Dirección de la Clínica (Pie de página)" outlined dense autogrow color="primary">
                    <template v-slot:prepend><q-icon name="location_on" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="formMembrete.clinic_phone" label="Teléfono de la Clínica" outlined dense mask="(###) ###-####" unmasked-value color="primary">
                    <template v-slot:prepend><q-icon name="phone" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model.number="formMembrete.folio_counter" type="number" label="Siguiente Folio de Receta" outlined dense hint="Se incrementa automáticamente" color="primary">
                    <template v-slot:prepend><q-icon name="pin" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-file v-model="logoFile" label="Logo del Membrete (Opcional)" outlined dense accept=".jpg, .jpeg, .png, .svg" @update:model-value="previewLogo" clearable @clear="clearLogo" color="primary">
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                  <div v-if="logoPreviewUrl" class="q-mt-md text-center bg-grey-2 q-pa-sm rounded-borders border-grey-3" style="border: 1px dashed #ccc;">
                    <img :src="logoPreviewUrl" style="max-height: 80px; border-radius: 8px;" />
                  </div>
                </div>
              </div>
              
              <q-separator class="q-mt-xl q-mb-md" />
              
              <div class="text-right">
                <q-btn icon="save" label="Guardar Membrete" color="primary" type="submit" unelevated rounded class="q-px-xl shadow-2" :loading="savingMembrete" />
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>

        <!-- Tab 2: Agenda -->
        <q-tab-panel name="agenda" class="q-pa-none">
          <q-card-section class="bg-secondary text-white row items-center q-pb-md">
            <q-avatar icon="event" color="white" text-color="secondary" size="40px" class="q-mr-md shadow-1" />
            <div>
              <div class="text-h6 text-white text-weight-bold" style="line-height: 1.2;">Configuración de Agenda</div>
              <div class="text-caption text-white opacity-80">Define los horarios laborales, descansos y días de atención.</div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div v-if="loadingAgenda" class="text-center q-pa-xl">
              <q-spinner-dots color="secondary" size="3em" />
            </div>
            <q-form v-else @submit="saveAgendaSettings" class="q-gutter-y-lg">
              
              <div class="text-subtitle2 text-weight-bold q-mb-sm text-grey-8">Días Laborales</div>
              <div class="row q-col-gutter-sm q-mb-md">
                <q-checkbox v-model="formAgenda.working_days" :val="1" label="Lunes" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="2" label="Martes" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="3" label="Miércoles" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="4" label="Jueves" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="5" label="Viernes" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="6" label="Sábado" color="secondary" />
                <q-checkbox v-model="formAgenda.working_days" :val="0" label="Domingo" color="secondary" />
              </div>

              <q-separator />

              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12 col-md-4">
                  <q-input v-model="formAgenda.start_time" label="Hora de Apertura" outlined dense color="secondary" mask="time" :rules="['time']">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="formAgenda.start_time" format24h color="secondary">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-input v-model="formAgenda.end_time" label="Hora de Cierre" outlined dense color="secondary" mask="time" :rules="['time']">
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="formAgenda.end_time" format24h color="secondary">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-4">
                  <q-select v-model="formAgenda.slot_duration" :options="slotOptions" label="Duración por Cita" outlined dense color="secondary" emit-value map-options>
                    <template v-slot:prepend><q-icon name="timer" /></template>
                  </q-select>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-xs">
                <div class="col-12 col-md-6">
                  <q-input v-model.number="formAgenda.consultation_price" type="number" label="Costo Base de Consulta" outlined dense color="secondary" prefix="$" :rules="[val => val >= 0 || 'El costo debe ser 0 o mayor']">
                    <template v-slot:prepend><q-icon name="payments" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-toggle v-model="formAgenda.require_otp" label="Requerir OTP por WhatsApp para agendar" color="secondary" />
                </div>
              </div>

              <div class="text-subtitle2 text-weight-bold q-mb-sm text-grey-8 q-mt-md">Horario de Comida / Descanso (Opcional)</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formAgenda.break_start_time" label="Inicio de Descanso" outlined dense color="secondary" mask="time" clearable>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="formAgenda.break_start_time" format24h color="secondary">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="formAgenda.break_end_time" label="Fin de Descanso" outlined dense color="secondary" mask="time" clearable>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="formAgenda.break_end_time" format24h color="secondary">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="secondary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              
              <q-separator class="q-mt-xl q-mb-md" />
              
              <div class="text-right">
                <q-btn icon="save" label="Guardar Agenda" color="secondary" type="submit" unelevated rounded class="q-px-xl shadow-2" :loading="savingAgenda" />
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const tab = ref('membrete')

// ========================
// STATE: Membrete
// ========================
const loadingMembrete = ref(true)
const savingMembrete = ref(false)
const logoFile = ref(null)
const logoPreviewUrl = ref(null)

const formMembrete = ref({
  doctor_name: '',
  specialty: '',
  email: '',
  university: '',
  professional_id: '',
  specialty_id: '',
  clinic_address: '',
  clinic_phone: '',
  folio_counter: 1
})

const fetchMembreteSettings = async () => {
  try {
    const { data } = await api.get('/prescription-settings')
    formMembrete.value = {
      doctor_name: data.doctor_name || '',
      specialty: data.specialty || '',
      email: data.email || '',
      university: data.university || '',
      professional_id: data.professional_id || '',
      specialty_id: data.specialty_id || '',
      clinic_address: data.clinic_address || '',
      clinic_phone: data.clinic_phone || '',
      folio_counter: data.folio_counter || 1
    }
    if (data.logo_path) {
      const backendUrl = api.defaults.baseURL.replace('/api', '');
      logoPreviewUrl.value = `${backendUrl}/storage/${data.logo_path}`
    }
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error cargando membrete' })
  } finally {
    loadingMembrete.value = false
  }
}

const previewLogo = (file) => {
  if (file) {
    logoPreviewUrl.value = URL.createObjectURL(file)
  }
}
const clearLogo = () => {
  logoPreviewUrl.value = null
}

const saveMembreteSettings = async () => {
  savingMembrete.value = true
  try {
    const formData = new FormData()
    Object.keys(formMembrete.value).forEach(key => {
      formData.append(key, formMembrete.value[key] === null ? '' : formMembrete.value[key])
    })
    if (logoFile.value) {
      formData.append('logo', logoFile.value)
    }

    const { data } = await api.post('/prescription-settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (data.logo_path) {
      const backendUrl = api.defaults.baseURL.replace('/api', '');
      logoPreviewUrl.value = `${backendUrl}/storage/${data.logo_path}`
      logoFile.value = null
    }
    $q.notify({ color: 'positive', icon: 'check', message: 'Membrete guardado' })
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Error al guardar membrete' })
  } finally {
    savingMembrete.value = false
  }
}

// ========================
// STATE: Agenda
// ========================
const loadingAgenda = ref(true)
const savingAgenda = ref(false)

const slotOptions = [
  { label: '15 Minutos', value: 15 },
  { label: '30 Minutos', value: 30 },
  { label: '45 Minutos', value: 45 },
  { label: '60 Minutos', value: 60 }
]

const formAgenda = ref({
  start_time: '09:00',
  end_time: '17:00',
  slot_duration: 30,
  consultation_price: 1500,
  working_days: [],
  break_start_time: null,
  break_end_time: null,
  require_otp: true
})

const fetchAgendaSettings = async () => {
  try {
    const { data } = await api.get('/agenda-settings')
    formAgenda.value = {
      start_time: data.start_time ? data.start_time.substring(0, 5) : '09:00',
      end_time: data.end_time ? data.end_time.substring(0, 5) : '17:00',
      slot_duration: data.slot_duration || 30,
      consultation_price: data.consultation_price !== undefined ? data.consultation_price : 1500,
      working_days: data.working_days || [],
      break_start_time: data.break_start_time ? data.break_start_time.substring(0, 5) : null,
      break_end_time: data.break_end_time ? data.break_end_time.substring(0, 5) : null,
      require_otp: data.require_otp !== undefined ? Boolean(data.require_otp) : true
    }
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error cargando agenda' })
  } finally {
    loadingAgenda.value = false
  }
}

const saveAgendaSettings = async () => {
  // Validations
  if (formAgenda.value.break_start_time && !formAgenda.value.break_end_time) {
    $q.notify({ color: 'warning', message: 'Debes especificar el fin del descanso' })
    return
  }
  if (!formAgenda.value.break_start_time && formAgenda.value.break_end_time) {
    $q.notify({ color: 'warning', message: 'Debes especificar el inicio del descanso' })
    return
  }

  savingAgenda.value = true
  try {
    await api.post('/agenda-settings', formAgenda.value)
    $q.notify({ color: 'positive', icon: 'check', message: 'Agenda guardada' })
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Error al guardar agenda' })
  } finally {
    savingAgenda.value = false
  }
}

onMounted(() => {
  fetchMembreteSettings()
  fetchAgendaSettings()
})
</script>
