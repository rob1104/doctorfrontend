<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="text-h4 text-dark text-weight-bold q-mb-xs">Configuración</div>
    <div class="text-subtitle1 text-grey-6 q-mb-lg">Configuración general del sistema</div>

    <q-card class="shadow-2" style="border-radius: 16px; max-width: 900px;">
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <q-avatar icon="article" color="white" text-color="primary" size="40px" class="q-mr-md shadow-1" />
        <div>
          <div class="text-h6 text-white text-weight-bold" style="line-height: 1.2;">Datos de Membrete</div>
          <div class="text-caption text-white opacity-80">Estos datos aparecerán en la cabecera de las recetas médicas y resúmenes.</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="3em" />
        </div>
        <q-form v-else @submit="saveSettings" class="q-gutter-y-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input :model-value="form.doctor_name" @update:model-value="v => form.doctor_name = v ? v.toUpperCase() : ''" label="Nombre del Doctor" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="person" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.specialty" @update:model-value="v => form.specialty = v ? v.toUpperCase() : ''" label="Especialidad" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="local_hospital" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.email" @update:model-value="v => form.email = v ? v.toLowerCase() : ''" type="email" label="Correo Electrónico" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="email" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.university" @update:model-value="v => form.university = v ? v.toUpperCase() : ''" label="Universidad de Egreso" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="school" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.professional_id" @update:model-value="v => form.professional_id = v ? v.toUpperCase() : ''" label="Cédula Profesional" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="badge" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.specialty_id" @update:model-value="v => form.specialty_id = v ? v.toUpperCase() : ''" label="Cédula de Especialidad" outlined dense color="primary">
                <template v-slot:prepend><q-icon name="card_membership" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input :model-value="form.clinic_address" @update:model-value="v => form.clinic_address = v ? v.toUpperCase() : ''" label="Dirección de la Clínica (Pie de página)" outlined dense autogrow color="primary">
                <template v-slot:prepend><q-icon name="location_on" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.clinic_phone" label="Teléfono de la Clínica" outlined dense mask="(###) ###-####" unmasked-value color="primary">
                <template v-slot:prepend><q-icon name="phone" /></template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model.number="form.folio_counter" type="number" label="Siguiente Folio de Receta" outlined dense hint="Se incrementa automáticamente" color="primary">
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
            <q-btn icon="save" label="Guardar Configuración" color="primary" type="submit" unelevated rounded class="q-px-xl shadow-2" :loading="saving" />
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
