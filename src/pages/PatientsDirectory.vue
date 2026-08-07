<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-dark text-weight-bold">Directorio de Pacientes</div>
        <div class="text-subtitle1 text-grey-6 q-mt-xs">Gestión y control de expedientes clínicos</div>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Nuevo Paciente"
        unelevated
        rounded
        class="q-px-lg shadow-3 font-weight-bold"
        @click="openCreateDialog"
      />
    </div>

    <q-card class="shadow-2 dashboard-card" flat>
      <q-card-section class="row items-center justify-between q-pb-none bg-white" style="border-radius: 16px 16px 0 0;">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="contacts" color="primary" class="q-mr-sm" size="sm" />
          Mis Pacientes
        </div>
        <q-input outlined dense hide-bottom-space v-model="filter" placeholder="Buscar por nombre, teléfono..." class="q-ml-md bg-grey-2" style="min-width: 300px; border-radius: 8px;" borderless>
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-sm bg-white" style="border-radius: 0 0 16px 16px;">
        <q-table
          :rows="patients"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :filter-method="customFilter"
          :loading="loading"
          class="bg-transparent premium-table"
          :rows-per-page-options="[10, 25, 50]"
        >
          <!-- Loading state -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar size="48px" class="q-mr-md shadow-1">
                  <img :src="getAvatarUrl(props.row.gender)" />
                </q-avatar>
                <div>
                  <div class="text-weight-bold text-primary" style="font-size: 15px; letter-spacing: 0.3px;">{{ props.row.first_name }} {{ props.row.last_name }}</div>
                  <div class="text-caption text-grey-7 row items-center">
                    <q-icon name="phone" size="12px" class="q-mr-xs" /> {{ props.row.phone }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-age="props">
            <q-td :props="props">
              <q-chip v-if="getAge(props.row.date_of_birth) !== 'N/E'" dense color="indigo-1" text-color="indigo-8" class="text-weight-bold q-px-sm" style="font-size: 13px;">
                {{ getAge(props.row.date_of_birth) }}
              </q-chip>
              <span v-else class="text-grey-5 italic text-caption">N/E</span>
            </q-td>
          </template>

          <template v-slot:body-cell-contact="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-mb-xs">
                <q-icon name="email" size="14px" class="q-mr-xs text-grey-6" />
                <div v-if="props.row.email" class="text-dark">{{ props.row.email }}</div>
                <div v-else class="text-grey-5 italic">Sin correo</div>
              </div>
              <div class="text-caption text-grey-6 text-truncate row items-center" style="max-width: 200px;">
                <q-icon name="place" size="14px" class="q-mr-xs text-grey-5" />
                {{ [props.row.city, props.row.state].filter(Boolean).join(', ') || 'Ubicación no especificada' }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-clinical="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-chip
                outline
                :color="props.row.gender === 'Femenino' ? 'pink-4' : (props.row.gender === 'Masculino' ? 'blue-6' : 'grey-6')"
                size="sm"
                class="text-weight-bold"
              >
                {{ props.row.gender || 'N/E' }}
              </q-chip>
              <q-chip
                v-if="props.row.blood_type"
                color="red-1" text-color="red-8"
                size="sm" class="text-weight-bold"
              >
                <q-icon name="bloodtype" size="14px" class="q-mr-xs" />
                {{ props.row.blood_type }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-diagnosis="props">
            <q-td :props="props">
              <div class="text-dark text-weight-medium text-truncate" style="max-width: 180px;">
                {{ props.row.consultations && props.row.consultations.length > 0 ? (props.row.consultations[0].diagnosis || 'Sin especificar') : 'Sin consultas' }}
              </div>
              <div v-if="props.row.consultations && props.row.consultations.length > 0" class="text-caption text-grey-6">
                {{ formatDateNatural(props.row.consultations[0].created_at) }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              <div class="text-weight-medium text-dark">{{ formatDateNatural(props.row.created_at) }}</div>
              <div class="text-caption text-grey-6">{{ getRelativeTime(props.row.created_at) }}</div>
              <div v-if="props.row.user" class="text-grey-5 row items-center q-mt-xs" style="font-size: 10px; line-height: 1;">
                <q-icon name="person_outline" size="10px" class="q-mr-xs" /> {{ props.row.user.name }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm text-right">
              <q-btn
                unelevated round color="purple-1" text-color="purple-8" icon="event" size="sm"
                @click="openQuickAppointment(props.row)"
              >
                <q-tooltip class="bg-dark">Cita Rápida</q-tooltip>
              </q-btn>
              <q-btn
                unelevated round color="teal-1" text-color="teal-8" icon="folder_shared" size="sm"
                :to="`/admin/patient/${props.row.id}`"
              >
                <q-tooltip class="bg-dark">Ver Expediente Clínico</q-tooltip>
              </q-btn>
              <q-btn
                unelevated round color="blue-1" text-color="blue-8" icon="edit" size="sm"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip class="bg-dark">Editar Paciente</q-tooltip>
              </q-btn>
              <q-btn
                flat round color="negative" icon="delete_outline" size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip class="bg-dark">Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog Elegante para Nuevo/Editar Paciente -->
    <q-dialog v-model="formDialog" persistent transition-show="scale" transition-hide="scale">
  <q-card style="width: 1100px; max-width: 95vw; border-radius: 16px;" class="bg-grey-1">

    <!-- Header del Dialog -->
    <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-primary text-white shadow-2" style="z-index: 10;">
      <div>
        <div class="text-h5 text-white text-weight-bold">{{ isEditing ? 'Editar Perfil del Paciente' : 'Registrar Nuevo Paciente' }}</div>
        <div class="text-subtitle2 opacity-80">Completa la información necesaria para el expediente médico.</div>
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup color="white" />
    </q-card-section>

    <q-form ref="patientForm" @submit="savePatient">
      <q-card-section class="scroll q-pa-lg" style="max-height: 75vh;">
        <div class="row q-col-gutter-lg">

          <!-- Columna 1: Contacto y Demografía -->
          <div class="col-12 col-md-6">

            <!-- Tarjeta: Identificación -->
            <q-card bordered flat class="q-mb-md bg-white" style="border-radius: 12px;">
              <q-card-section class="q-pb-sm">
                <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                  <q-icon name="badge" size="sm" class="q-mr-sm" /> Identificación y Contacto
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="q-pa-sm q-px-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.first_name" label="Nombre(s) *" outlined dense hide-bottom-space lazy-rules :rules="[val => !!val || 'Requerido']" autofocus>
                      <template v-slot:prepend><q-icon name="person" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.last_name" label="Apellidos *" outlined dense hide-bottom-space lazy-rules :rules="[val => !!val || 'Requerido']" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.phone" label="Teléfono WhatsApp *" outlined dense hide-bottom-space mask="(###) ###-####" unmasked-value lazy-rules :rules="[val => !!val || 'Requerido']">
                      <template v-slot:prepend><q-icon name="phone" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.email" type="email" label="Correo Electrónico" outlined dense hide-bottom-space>
                      <template v-slot:prepend><q-icon name="email" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.address" label="Dirección (Calle y número)" outlined dense hide-bottom-space>
                      <template v-slot:prepend><q-icon name="place" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input v-model="form.neighborhood" label="Colonia" outlined dense hide-bottom-space />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="form.zip_code" label="Código Postal" outlined dense hide-bottom-space />
                  </div>
                  <div class="col-12 col-md-8">
                    <q-input v-model="form.city" label="Ciudad" outlined dense hide-bottom-space />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select v-model="form.country" :options="['México', 'Estados Unidos']" label="País" outlined dense hide-bottom-space emit-value map-options @update:model-value="form.state = ''" />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select v-model="form.state" :options="stateOptions" label="Estado" outlined dense hide-bottom-space emit-value map-options :disable="!form.country" />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.place_of_birth" label="Lugar de Origen" outlined dense hide-bottom-space>
                      <template v-slot:prepend><q-icon name="public" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Tarjeta: Demografía -->
            <q-card bordered flat class="bg-white" style="border-radius: 12px;">
              <q-card-section class="q-pb-sm">
                <div class="text-subtitle1 text-weight-bold text-primary row items-center">
                  <q-icon name="diversity_1" size="sm" class="q-mr-sm" /> Demografía y Emergencias
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="q-pa-sm q-px-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.date_of_birth" type="date" label="Fecha de Nacimiento" outlined dense hide-bottom-space stack-label>
                      <template v-slot:prepend><q-icon name="cake" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select v-model="form.gender" :options="['Masculino', 'Femenino', 'Otro']" label="Género" outlined dense hide-bottom-space emit-value map-options />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select v-model="form.marital_status" :options="['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Libre']" label="Estado Civil" outlined dense hide-bottom-space emit-value map-options />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.occupation" label="Ocupación" outlined dense hide-bottom-space>
                      <template v-slot:prepend><q-icon name="work" size="xs" color="grey-6" /></template>
                    </q-input>
                  </div>

                  <div class="col-12 text-subtitle2 text-grey-8 q-mt-sm q-mb-none" style="line-height: 1;">Contacto de Emergencia</div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.emergency_contact_name" label="Nombre Completo" outlined dense hide-bottom-space />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="form.emergency_contact_phone" label="Teléfono de Emergencia" outlined dense hide-bottom-space mask="(###) ###-####" unmasked-value>
                      <template v-slot:prepend><q-icon name="emergency" size="xs" color="red-4" /></template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Columna 2: Historial Clínico y Dermatología -->
          <div class="col-12 col-md-6">

            <!-- Tarjeta: Historial Clínico -->
            <q-card bordered flat class="q-mb-md bg-white" style="border-radius: 12px; border-top: 3px solid #f44336;">
              <q-card-section class="q-pb-sm">
                <div class="text-subtitle1 text-weight-bold text-red-7 row items-center">
                  <q-icon name="medical_information" size="sm" class="q-mr-sm" /> Historial Clínico General
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="q-pa-sm q-px-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6">
                    <q-select v-model="form.blood_type" :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" label="Tipo de Sangre" outlined dense hide-bottom-space>
                      <template v-slot:prepend><q-icon name="bloodtype" size="xs" color="red-5" /></template>
                    </q-select>
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.allergies" type="textarea" label="Alergias (Medicamentos, alimentos, látex...)" outlined dense hide-bottom-space autogrow />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.chronic_conditions" type="textarea" label="Padecimientos Crónicos" outlined dense hide-bottom-space autogrow />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.current_medications" type="textarea" label="Medicamentos que toma habitualmente" outlined dense hide-bottom-space autogrow />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.surgical_history" type="textarea" label="Historial Quirúrgico" outlined dense hide-bottom-space autogrow />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.family_history" type="textarea" label="Antecedentes Familiares" outlined dense hide-bottom-space autogrow />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Tarjeta: Dermatología -->
            <q-card bordered flat class="bg-white" style="border-radius: 12px; border-top: 3px solid #3f51b5;">
              <q-card-section class="q-pb-sm">
                <div class="text-subtitle1 text-weight-bold text-indigo-7 row items-center">
                  <q-icon name="face" size="sm" class="q-mr-sm" /> Datos de Dermatología
                </div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="q-pa-sm q-px-md">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-5">
                    <q-select v-model="form.skin_type" :options="['I', 'II', 'III', 'IV', 'V', 'VI']" label="Fototipo (Fitzpatrick)" outlined dense hide-bottom-space emit-value map-options />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-select v-model="form.skin_tendency" :options="['Seca', 'Mixta', 'Grasa', 'Sensible']" label="Tendencia" outlined dense hide-bottom-space emit-value map-options />
                  </div>
                  <div class="col-12 col-sm-3">
                    <q-select v-model="form.sun_exposure_level" :options="['Baja', 'Moderada', 'Alta']" label="Exp. Solar" outlined dense hide-bottom-space emit-value map-options />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.previous_skin_conditions" type="textarea" label="Condiciones de Piel Previas" outlined dense hide-bottom-space autogrow />
                  </div>
                  <div class="col-12">
                    <q-input v-model="form.skincare_routine" type="textarea" label="Rutina Skincare Actual" outlined dense hide-bottom-space autogrow />
                  </div>
                </div>
              </q-card-section>
            </q-card>

          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer de Acciones -->
      <q-card-actions align="right" class="q-pa-md bg-white">
        <q-btn flat label="Cancelar" color="grey-8" v-close-popup class="q-mr-sm" />
        <q-btn unelevated icon="save" label="Guardar Paciente" color="primary" type="submit" class="q-px-lg shadow-2 text-weight-bold" style="border-radius: 8px;" :loading="saving" />
      </q-card-actions>
    </q-form>
  </q-card>
</q-dialog>
    <!-- Dialog para Cita Rápida -->
    <q-dialog v-model="quickAppointmentDialog" persistent>
      <q-card style="width: 400px; border-radius: 16px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-white">Cita Rápida</div>
          <div class="text-subtitle2 text-white" v-if="selectedPatient">{{ selectedPatient.first_name }} {{ selectedPatient.last_name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input v-model="appointmentForm.appointment_date" type="date" label="Fecha" outlined dense hide-bottom-space class="q-mb-md" autofocus />
          <q-input v-model="appointmentForm.start_time" type="time" label="Hora" outlined dense hide-bottom-space class="q-mb-md" />
          <q-select v-model="appointmentForm.type" :options="[{label: 'Clínico', value: 'clinico'}, {label: 'Estético', value: 'estetico'}]" emit-value map-options label="Tipo de Cita" outlined dense hide-bottom-space class="q-mb-md" />
          <q-input v-model="appointmentForm.notes" type="textarea" label="Motivo / Notas" outlined dense hide-bottom-space autogrow rows="2" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md text-primary">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn flat label="Agendar" icon="event" @click="saveQuickAppointment" :loading="savingAppointment" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import { formatDistanceToNow, parseISO, format, differenceInYears } from 'date-fns'
import { es } from 'date-fns/locale'

const mexicoStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 
  'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 
  'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 
  'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]

const $q = useQuasar()
const patients = ref([])
const loading = ref(true)
const filter = ref('')

const formDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const patientForm = ref(null)

const quickAppointmentDialog = ref(false)
const selectedPatient = ref(null)
const savingAppointment = ref(false)
const appointmentForm = ref({
  appointment_date: '',
  start_time: '',
  type: 'clinico',
  notes: ''
})

const getBaseForm = () => ({
  id: null,
  first_name: '', last_name: '', phone: '', email: '', 
  address: '', neighborhood: '', zip_code: '', city: '', state: '', country: 'México', place_of_birth: '',
  date_of_birth: '', gender: '', marital_status: '', occupation: '',
  emergency_contact_name: '', emergency_contact_phone: '',
  blood_type: '', allergies: '', chronic_conditions: '', current_medications: '',
  surgical_history: '', family_history: '',
  skin_type: '', skin_tendency: '', sun_exposure_level: '',
  previous_skin_conditions: '', skincare_routine: ''
})

const form = ref(getBaseForm())

const stateOptions = computed(() => {
  if (form.value.country === 'México') return mexicoStates
  if (form.value.country === 'Estados Unidos') return usStates
  return []
})

const columns = [
  { name: 'name', align: 'left', label: 'Paciente', sortable: true },
  { name: 'age', align: 'left', label: 'Edad', sortable: true },
  { name: 'contact', align: 'left', label: 'Contacto y Ubicación', field: 'email', sortable: false },
  { name: 'clinical', align: 'left', label: 'Perfil', field: 'gender', sortable: false },
  { name: 'diagnosis', align: 'left', label: 'Últ. Diagnóstico', sortable: false },
  { name: 'created_at', align: 'left', label: 'Registro', field: 'created_at', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions' }
]

const customFilter = (rows, terms) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  if (!lowerTerms) return rows

  return rows.filter(row => {
    const name = `${row.first_name || ''} ${row.last_name || ''}`.toLowerCase()
    const phone = (row.phone || '').toLowerCase()
    const email = (row.email || '').toLowerCase()
    const ageStr = row.date_of_birth ? differenceInYears(new Date(), parseISO(row.date_of_birth)).toString() : ''
    const diagnosis = (row.consultations && row.consultations.length > 0) ? (row.consultations[0].diagnosis || '').toLowerCase() : ''
    const city = (row.city || '').toLowerCase()
    const state = (row.state || '').toLowerCase()

    return name.includes(lowerTerms) || 
           phone.includes(lowerTerms) || 
           email.includes(lowerTerms) ||
           ageStr.includes(lowerTerms) ||
           diagnosis.includes(lowerTerms) ||
           city.includes(lowerTerms) ||
           state.includes(lowerTerms)
  })
}

const getAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/E'
  try {
    return differenceInYears(new Date(), parseISO(dateOfBirth)).toString()
  } catch (e) {
    return 'N/E'
  }
}

const getAvatarUrl = (gender) => {
  const f = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f48fb1'/><path d='M22 100 Q 22 70 50 70 Q 78 70 78 100' fill='%23d81b60'/><rect x='42' y='50' width='16' height='25' fill='%23ffcc80'/><ellipse cx='50' cy='42' rx='17' ry='23' fill='%23ffcc80'/><path d='M 50 8 C 20 8, 20 45, 20 70 C 20 95, 35 95, 35 70 C 35 45, 45 35, 50 30 C 55 35, 65 45, 65 70 C 65 95, 80 95, 80 70 C 80 45, 80 8, 50 8 Z' fill='%232c3e50'/></svg>";
  const m = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%234fc3f7'/><path d='M18 100 Q 18 65 50 65 Q 82 65 82 100' fill='%2334495e'/><rect x='40' y='50' width='20' height='20' fill='%23ffcc80'/><ellipse cx='50' cy='40' rx='19' ry='24' fill='%23ffcc80'/><path d='M28 40 Q 28 10 50 10 Q 72 10 72 40 Q 72 50 65 45 Q 50 25 35 45 Q 28 50 28 40 Z' fill='%232c3e50'/></svg>";
  const n = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><path d='M20 100 Q 20 65 50 65 Q 80 65 80 100' fill='%239e9e9e'/><rect x='40' y='50' width='20' height='20' fill='%23f5f5f5'/><ellipse cx='50' cy='40' rx='20' ry='25' fill='%23f5f5f5'/></svg>";
  if (gender === 'Femenino' || gender === 'Mujer') return f;
  if (gender === 'Masculino' || gender === 'Hombre') return m;
  return n;
}

const formatDateNatural = (dateString) => {
  if (!dateString) return ''
  try {
    return format(parseISO(dateString), "d 'de' MMM, yyyy", { locale: es })
  } catch (e) {
    return dateString
  }
}

const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: es })
  } catch (e) {
    return ''
  }
}

const fetchPatients = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/patients')
    patients.value = data
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error cargando pacientes' })
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  form.value = getBaseForm()
  formDialog.value = true
}

const openEditDialog = (patient) => {
  isEditing.value = true
  // Merge to ensure missing fields exist
  form.value = { ...getBaseForm(), ...patient }
  formDialog.value = true
}

const submitForm = () => {
  if(patientForm.value) {
    patientForm.value.submit()
  }
}

const savePatient = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/patients/${form.value.id}`, form.value)
      $q.notify({ color: 'positive', message: 'Paciente actualizado correctamente', icon: 'check_circle' })
    } else {
      await api.post('/patients', form.value)
      $q.notify({ color: 'positive', message: 'Paciente creado exitosamente', icon: 'check_circle' })
    }
    formDialog.value = false
    fetchPatients()
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al guardar el paciente'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (patient) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar permanentemente a ${patient.first_name}? Esta acción no se puede deshacer.`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Eliminar'
    }
  }).onOk(async () => {
    try {
      await api.delete(`/patients/${patient.id}`)
      $q.notify({ color: 'positive', message: 'Paciente eliminado' })
      fetchPatients()
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al eliminar paciente' })
    }
  })
}

const openQuickAppointment = (patient) => {
  selectedPatient.value = patient
  const today = new Date()
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  appointmentForm.value.appointment_date = localDate.toISOString().split('T')[0]
  appointmentForm.value.start_time = '10:00'
  appointmentForm.value.type = 'clinico'
  appointmentForm.value.notes = ''
  quickAppointmentDialog.value = true
}

const saveQuickAppointment = async () => {
  savingAppointment.value = true
  try {
    await api.post('/appointments/admin', {
      patient_id: selectedPatient.value.id,
      ...appointmentForm.value
    })
    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Cita agendada exitosamente' })
    quickAppointmentDialog.value = false
  } catch (error) {
    const msg = error.response?.data?.message || 'Hubo un error al agendar la cita'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    savingAppointment.value = false
  }
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background-color: #FFFFFF;
}
.elegant-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
.border-primary-top {
  border-top: 3px solid var(--q-primary);
}
.opacity-80 {
  opacity: 0.8;
}
.opacity-0 {
  opacity: 0;
}

/* Tabla premium */
.premium-table thead tr {
  background-color: #f8fafc;
}
.premium-table th {
  font-weight: 700 !important;
  font-size: 13px !important;
  color: #4a5568 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.premium-table tbody td {
  padding: 12px 16px !important;
}
</style>
