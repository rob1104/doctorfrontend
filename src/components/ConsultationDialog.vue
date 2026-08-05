<template>
  <q-dialog v-model="isOpen" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 1200px; max-width: 95vw; border-radius: 16px;">
      <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-primary text-white shadow-2" style="z-index: 10;">
        <div>
          <div class="text-h5 text-white text-weight-bold">{{ isEditMode ? 'Editar Consulta Clínica' : 'Nueva Consulta Clínica' }}</div>
          <div class="text-subtitle2 text-white opacity-80">{{ isEditMode ? 'Actualiza los datos de la nota médica y receta.' : 'Registra notas médicas y genera una receta.' }}</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="white" />
      </q-card-section>

      <q-card-section class="scroll q-pa-lg" style="max-height: 75vh;">
        <div class="row q-col-gutter-lg">

          <!-- Nota Clínica -->
          <div class="col-12 col-md-6">
            <div class="row q-col-gutter-md">
              <!-- Signos Vitales (NOM-004) -->
              <div class="col-12">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="monitor_heart" class="q-mr-xs"/> Signos Vitales (Opcional - NOM-004)</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6 col-sm-4"><q-input v-model="form.blood_pressure" label="TA (ej. 120/80)" outlined dense bg-color="white" /></div>
                    <div class="col-6 col-sm-4"><q-input v-model="form.heart_rate" label="FC (lpm)" type="number" outlined dense bg-color="white" /></div>
                    <div class="col-6 col-sm-4"><q-input v-model="form.respiratory_rate" label="FR (rpm)" type="number" outlined dense bg-color="white" /></div>
                    <div class="col-6 col-sm-4"><q-input v-model="form.temperature" label="Temp (°C)" type="number" step="0.1" outlined dense bg-color="white" /></div>
                    <div class="col-6 col-sm-4"><q-input v-model="form.weight" label="Peso (kg)" type="number" step="0.1" outlined dense bg-color="white" /></div>
                    <div class="col-6 col-sm-4"><q-input v-model="form.height" label="Talla (m)" type="number" step="0.01" outlined dense bg-color="white" /></div>
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="assignment" class="q-mr-xs"/> Motivo de Consulta</div>
                  <q-input v-model="form.reason" type="textarea" outlined dense autogrow rows="3" bg-color="white" autofocus />
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="accessibility_new" class="q-mr-xs"/> Examen Físico</div>
                  <q-input v-model="form.physical_exam" type="textarea" outlined dense autogrow rows="3" bg-color="white" />
                </q-card>
              </div>

              <!-- Diagnóstico y Plan -->
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="healing" class="q-mr-xs"/> Diagnóstico Clínico</div>
                  <q-input v-model="form.diagnosis" type="textarea" outlined dense autogrow rows="3" bg-color="white" />
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="medical_services" class="q-mr-xs"/> Plan de Tratamiento</div>
                  <q-input v-model="form.treatment_plan" type="textarea" outlined dense autogrow rows="3" bg-color="white" />
                </q-card>
              </div>

              <!-- Notas Privadas -->
              <div class="col-12">
                <q-card flat bordered class="q-pa-md bg-grey-1 shadow-1">
                  <div class="text-subtitle2 text-primary q-mb-sm row items-center"><q-icon name="lock" class="q-mr-xs"/> Notas Privadas (Internas)</div>
                  <q-input v-model="form.notes" type="textarea" outlined dense autogrow rows="2" bg-color="white" />
                </q-card>
              </div>
            </div>
          </div>

          <!-- Receta -->
          <div class="col-12 col-md-6">
            <q-card flat class="shadow-1 q-pa-md bg-blue-grey-1" style="border-radius: 12px; height: 100%;">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-subtitle1 text-weight-bold text-dark">
                  <q-icon name="receipt_long" size="sm" class="q-mr-xs" /> Generar Receta Médica
                </div>
                <q-toggle v-model="issuePrescription" color="primary" label="Emitir" left-label />
              </div>

              <div v-if="issuePrescription" class="q-mt-md">
                <div v-for="(med, index) in medications" :key="index" class="row q-col-gutter-sm items-center q-mb-sm bg-blue-grey-1 q-pa-sm" style="border-radius: 8px;">
                  <div class="col-4">
                    <q-input v-model="med.name" label="Medicamento / Sustancia" outlined dense bg-color="white" />
                  </div>
                  <div class="col-7">
                    <q-input v-model="med.instructions" label="Dosis e Indicaciones" outlined dense bg-color="white" />
                  </div>
                  <div class="col-1 text-center">
                    <q-btn flat round color="negative" icon="delete" dense @click="removeMedication(index)" />
                  </div>
                </div>
                <q-btn flat color="primary" icon="add" label="Agregar Medicamento" size="sm" class="q-mb-md" @click="addMedication" />

                <div class="text-subtitle2 text-primary q-mb-sm row items-center q-mt-md"><q-icon name="info" class="q-mr-xs"/> Indicaciones Generales / Recomendaciones</div>
                <q-input v-model="prescriptionInstructions" type="textarea" outlined dense autogrow rows="4" bg-color="white" />
              </div>
              <div v-else class="text-center text-grey-6 q-pa-xl" style="border: 2px dashed #ccc; border-radius: 8px;">
                Activa la emisión para generar un PDF.
              </div>
            </q-card>
          </div>

        </div>

      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
        <q-btn unelevated color="primary" :label="isEditMode ? 'Actualizar Consulta' : 'Guardar Consulta'" icon="save" class="text-weight-bold q-px-lg shadow-1" @click="save" :loading="saving" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: Boolean,
  patientId: { type: [String, Number], required: true },
  editData: { type: Object, default: null }
})
const emit = defineEmits(['update:modelValue', 'saved'])
const $q = useQuasar()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditMode = computed(() => !!props.editData)

const saving = ref(false)

// Consultation form
const form = ref({
  reason: '',
  physical_exam: '',
  diagnosis: '',
  treatment_plan: '',
  notes: '',
  blood_pressure: '',
  temperature: null,
  heart_rate: null,
  respiratory_rate: null,
  weight: null,
  height: null
})

// Prescription state
const issuePrescription = ref(false)
const medications = ref([{ name: '', instructions: '' }])
const prescriptionInstructions = ref('')

const addMedication = () => {
  medications.value.push({ name: '', instructions: '' })
}
const removeMedication = (index) => {
  medications.value.splice(index, 1)
}

const reset = () => {
  form.value = { reason: '', physical_exam: '', diagnosis: '', treatment_plan: '', notes: '', blood_pressure: '', temperature: null, heart_rate: null, respiratory_rate: null, weight: null, height: null }
  issuePrescription.value = false
  medications.value = [{ name: '', instructions: '' }]
  prescriptionInstructions.value = ''
}

const loadData = () => {
  if (props.editData) {
    form.value = {
      reason: props.editData.reason || '',
      physical_exam: props.editData.physical_exam || '',
      diagnosis: props.editData.diagnosis || '',
      treatment_plan: props.editData.treatment_plan || '',
      notes: props.editData.notes || '',
      blood_pressure: props.editData.blood_pressure || '',
      temperature: props.editData.temperature || null,
      heart_rate: props.editData.heart_rate || null,
      respiratory_rate: props.editData.respiratory_rate || null,
      weight: props.editData.weight || null,
      height: props.editData.height || null
    }
    if (props.editData.prescription) {
      issuePrescription.value = true
      medications.value = props.editData.prescription.medications && props.editData.prescription.medications.length
        ? JSON.parse(JSON.stringify(props.editData.prescription.medications))
        : [{ name: '', instructions: '' }]
      prescriptionInstructions.value = props.editData.prescription.instructions || ''
    } else {
      issuePrescription.value = false
      medications.value = [{ name: '', instructions: '' }]
      prescriptionInstructions.value = ''
    }
  } else {
    reset()
  }
}

watch(isOpen, (val) => {
  if (val) loadData()
})

const save = async () => {
  saving.value = true
  try {
    if (isEditMode.value) {
      // Lógica de actualización (PUT) con estructura unificada
      const payload = {
        ...form.value,
        issue_prescription: issuePrescription.value,
        medications: issuePrescription.value ? medications.value.filter(m => m.name.trim() !== '') : [],
        prescription_instructions: issuePrescription.value ? prescriptionInstructions.value : ''
      }
      await api.put(`/consultations/${props.editData.id}`, payload)
      $q.notify({ color: 'positive', icon: 'check_circle', message: 'Consulta actualizada exitosamente' })
    } else {
      // Lógica de creación (POST)
      const payload = {
        patient_id: props.patientId,
        ...form.value
      }
      const { data: consultation } = await api.post('/consultations', payload)

      if (issuePrescription.value) {
        const validMeds = medications.value.filter(m => m.name.trim() !== '')
        if (validMeds.length > 0 || prescriptionInstructions.value.trim() !== '') {
          await api.post('/prescriptions', {
            consultation_id: consultation.id,
            patient_id: props.patientId,
            medications: validMeds,
            instructions: prescriptionInstructions.value
          })
        }
      }
      $q.notify({ color: 'positive', icon: 'check_circle', message: 'Consulta registrada exitosamente' })
    }

    isOpen.value = false
    emit('saved')

  } catch (error) {
    console.error(error)
    $q.notify({ color: 'negative', message: 'Hubo un error al registrar la consulta' })
  } finally {
    saving.value = false
  }
}
</script>
