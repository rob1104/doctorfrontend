<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="text-h4 text-dark text-weight-bold q-mb-lg">Configuración de Recetas</div>

    <q-card class="shadow-2" style="border-radius: 16px; max-width: 800px;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6 text-white">Datos de Membrete</div>
        <div class="text-caption text-white opacity-80">Estos datos aparecerán en la cabecera de las recetas médicas y resúmenes.</div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner color="primary" size="2em" />
        </div>
        <q-form v-else @submit="saveSettings" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="form.doctor_name" label="Nombre del Doctor" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.specialty" label="Especialidad" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.email" type="email" label="Correo Electrónico" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.university" label="Universidad de Egreso" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.professional_id" label="Cédula Profesional" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.specialty_id" label="Cédula de Especialidad" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.clinic_address" label="Dirección de la Clínica (Pie de página)" outlined dense autogrow />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.clinic_phone" label="Teléfono de la Clínica" outlined dense />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model.number="form.folio_counter" type="number" label="Siguiente Folio de Receta" outlined dense hint="Se incrementa automáticamente" />
            </div>
            <div class="col-12 col-md-6">
              <q-file v-model="logoFile" label="Logo del Membrete (Opcional)" outlined dense accept=".jpg, .jpeg, .png, .svg" @update:model-value="previewLogo" clearable @clear="clearLogo">
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" />
                </template>
              </q-file>
              <div v-if="logoPreviewUrl" class="q-mt-sm text-center">
                <img :src="logoPreviewUrl" style="max-height: 80px; border-radius: 8px; border: 1px solid #e5e7eb;" />
              </div>
            </div>
          </div>
          
          <div class="text-right q-mt-xl">
            <q-btn label="Guardar Configuración" color="primary" type="submit" unelevated class="q-px-lg shadow-1" :loading="saving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const saving = ref(false)
const logoFile = ref(null)
const logoPreviewUrl = ref(null)

const form = ref({
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

const fetchSettings = async () => {
  try {
    const { data } = await api.get('/prescription-settings')
    form.value = {
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
      // Create a full URL for the image preview from the backend
      const backendUrl = api.defaults.baseURL.replace('/api', '');
      logoPreviewUrl.value = `${backendUrl}/storage/${data.logo_path}`
    }
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error cargando configuración' })
  } finally {
    loading.value = false
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

const saveSettings = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    
    // Append text fields
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key] === null ? '' : form.value[key])
    })

    // Append file if selected
    if (logoFile.value) {
      formData.append('logo', logoFile.value)
    }

    const { data } = await api.post('/prescription-settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (data.logo_path) {
      const backendUrl = api.defaults.baseURL.replace('/api', '');
      logoPreviewUrl.value = `${backendUrl}/storage/${data.logo_path}`
      logoFile.value = null // clear file input after successful upload
    }

    $q.notify({ color: 'positive', icon: 'check', message: 'Configuración guardada' })
  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Error al guardar configuración' })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
