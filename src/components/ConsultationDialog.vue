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
                    <div class="col-6 col-sm-4"><q-input v-model="form.blood_pressure" label="TA (ej. 120/80)" outlined dense bg-color="white" autofocus /></div>
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
                  <q-input v-model="form.reason" type="textarea" outlined dense autogrow rows="3" bg-color="white" />
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
                    <q-select
                      :ref="(el) => { if (el) medSelectRefs[index] = el }"
                      v-model="med.medication"
                      label="Medicamento / Sustancia"
                      outlined
                      dense
                      bg-color="white"
                      use-input
                      fill-input
                      hide-selected
                      clearable
                      input-debounce="300"
                      :options="medicationOptions"
                      option-label="generic_name"
                      @filter="filterMedications"
                      @new-value="createMedicationValue"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                            <q-item-section>
                              <q-item-label class="text-weight-bold">{{ scope.opt.generic_name }} <span v-if="scope.opt.concentration" class="text-primary">({{ scope.opt.concentration }})</span></q-item-label>
                              <q-item-label caption v-if="scope.opt.commercial_name || scope.opt.presentation || scope.opt.route">
                                <span v-if="scope.opt.commercial_name" class="q-mr-sm text-dark">{{ scope.opt.commercial_name }}</span> 
                                <span v-if="scope.opt.presentation">{{ scope.opt.presentation }}</span>
                                <span v-if="scope.opt.route" class="q-ml-sm text-italic">- {{ scope.opt.route }}</span>
                              </q-item-label>
                            </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-italic text-grey">
                            No se encontró el medicamento. Puede escribirlo y será agregado al catálogo automáticamente.
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
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

  <!-- Nuevo Medicamento Dialog -->
  <q-dialog v-model="isNewMedicationDialogOpen" persistent>
    <q-card style="width: 500px; max-width: 90vw; border-radius: 12px;">
      <q-card-section class="bg-primary text-white row items-center q-pb-sm">
        <div class="text-h6">Nuevo Medicamento</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      
      <q-card-section class="q-pt-md">
        <div class="text-subtitle2 q-mb-md text-grey-8">
          Por favor captura los detalles para registrar este medicamento en el catálogo.
        </div>
        <q-form @submit.prevent="saveNewMedication" class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="newMedicationForm.generic_name" label="Sustancia Activa *" outlined dense :rules="[val => !!val || 'Requerido']" autofocus />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="newMedicationForm.commercial_name" label="Nombre Comercial" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="newMedicationForm.presentation" label="Presentación (ej. Tabletas)" outlined dense />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="newMedicationForm.concentration" label="Concentración / Gramaje *" outlined dense :rules="[val => !!val || 'Requerido']" />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="newMedicationForm.route" label="Vía de administración *" outlined dense :rules="[val => !!val || 'Requerido']" />
          </div>
          <div class="col-12 text-right q-mt-md">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
            <q-btn type="submit" unelevated color="primary" label="Guardar y Seleccionar" :loading="savingMedication" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
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
const medications = ref([{ medication: null, instructions: '' }])
const prescriptionInstructions = ref('')
const medicationOptions = ref([])
const medSelectRefs = ref([])

// New Medication Dialog State
const isNewMedicationDialogOpen = ref(false)
const savingMedication = ref(false)
const newMedicationDoneCallback = ref(null)
const newMedicationForm = ref({
  generic_name: '',
  commercial_name: '',
  presentation: '',
  concentration: '',
  route: '',
  active_substance: ''
})

const addMedication = async () => {
  medications.value.push({ medication: null, instructions: '' })
  await nextTick()
  if (medSelectRefs.value && medSelectRefs.value[medications.value.length - 1]) {
    medSelectRefs.value[medications.value.length - 1].focus()
  }
}
const removeMedication = (index) => {
  medications.value.splice(index, 1)
  medSelectRefs.value.splice(index, 1)
}

const reset = () => {
  form.value = { reason: '', physical_exam: '', diagnosis: '', treatment_plan: '', notes: '', blood_pressure: '', temperature: null, heart_rate: null, respiratory_rate: null, weight: null, height: null }
  issuePrescription.value = false
  medications.value = [{ medication: null, instructions: '' }]
  medSelectRefs.value = []
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
        ? props.editData.prescription.medications.map(m => ({
            medication: { generic_name: m.name, id: m.medication_id },
            instructions: m.instructions
          }))
        : [{ medication: null, instructions: '' }]
      prescriptionInstructions.value = props.editData.prescription.instructions || ''
    } else {
      issuePrescription.value = false
      medications.value = [{ medication: null, instructions: '' }]
      prescriptionInstructions.value = ''
    }
  } else {
    reset()
  }
}

watch(isOpen, (val) => {
  if (val) loadData()
})

watch(issuePrescription, async (val) => {
  if (val) {
    await nextTick()
    if (medSelectRefs.value && medSelectRefs.value[0]) {
      medSelectRefs.value[0].focus()
    }
  }
})

const save = async () => {
  saving.value = true
  try {
    if (isEditMode.value) {
      // Lógica de actualización (PUT) con estructura unificada
      const payload = {
        ...form.value,
        issue_prescription: issuePrescription.value,
        medications: issuePrescription.value ? medications.value.filter(m => {
          const name = m.medication?.generic_name || m.medication
          return name && name.trim() !== ''
        }) : [],
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
        const validMeds = medications.value.filter(m => {
          const name = m.medication?.generic_name || m.medication
          return name && name.trim() !== ''
        })
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
    console.error('Save Consultation Error:', error)
    if (error.response && error.response.status === 422 && error.response.data.errors) {
      const errors = error.response.data.errors
      let errorMsg = '<strong>Revisa los datos capturados:</strong><br><ul style="margin:0; padding-left:20px;">'
      Object.values(errors).forEach(errArray => {
        errorMsg += `<li>${errArray[0]}</li>`
      })
      errorMsg += '</ul>'
      
      $q.notify({ 
        color: 'negative', 
        message: errorMsg, 
        html: true, 
        position: 'top', 
        icon: 'warning',
        timeout: 6000
      })
    } else {
      $q.notify({ color: 'negative', message: 'Hubo un error inesperado al registrar la consulta', position: 'top', icon: 'error' })
    }
  } finally {
    saving.value = false
  }
}

const filterMedications = async (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }
  try {
    const { data } = await api.get('/medications', { params: { search: val } })
    update(() => {
      medicationOptions.value = data
    })
  } catch (error) {
    console.error('Error fetching medications:', error)
    abort()
  }
}

const createMedicationValue = (val, done) => {
  if (val.length > 0) {
    newMedicationForm.value = {
      generic_name: val,
      active_substance: val,
      commercial_name: '',
      presentation: '',
      concentration: '',
      route: ''
    }
    newMedicationDoneCallback.value = done
    isNewMedicationDialogOpen.value = true
  }
}

const saveNewMedication = async () => {
  savingMedication.value = true
  try {
    const { data } = await api.post('/medications', newMedicationForm.value)
    if (newMedicationDoneCallback.value) {
      newMedicationDoneCallback.value(data, 'add-unique')
    }
    isNewMedicationDialogOpen.value = false
    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Medicamento guardado en el catálogo' })
  } catch (error) {
    console.error('Save Medication Error:', error)
    if (error.response && error.response.status === 422 && error.response.data.errors) {
      const errors = error.response.data.errors
      let errorMsg = '<strong>Error en el medicamento:</strong><br><ul style="margin:0; padding-left:20px;">'
      Object.values(errors).forEach(errArray => {
        errorMsg += `<li>${errArray[0]}</li>`
      })
      errorMsg += '</ul>'
      
      $q.notify({ 
        color: 'negative', 
        message: errorMsg, 
        html: true, 
        position: 'top', 
        icon: 'warning'
      })
    } else {
      $q.notify({ color: 'negative', message: 'Revisa los campos requeridos', position: 'top' })
    }
  } finally {
    savingMedication.value = false
  }
}
</script>
