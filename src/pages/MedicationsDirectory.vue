<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-dark text-weight-bold">Catálogo de Medicamentos</div>
        <div class="text-subtitle1 text-grey-6 q-mt-xs">Gestión de sustancias y presentaciones médicas</div>
      </div>
      <q-btn
        color="primary"
        icon="vaccines"
        label="Nuevo Medicamento"
        unelevated
        rounded
        class="q-px-lg shadow-3 font-weight-bold"
        @click="openCreateDialog"
      />
    </div>

    <q-card class="shadow-2 dashboard-card" flat>
      <q-card-section class="row items-center justify-between q-pb-none bg-white" style="border-radius: 16px 16px 0 0;">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="medication" color="primary" class="q-mr-sm" size="sm" />
          Medicamentos Registrados
        </div>
        <q-input outlined dense v-model="filter" placeholder="Buscar por sustancia, marca..." class="q-ml-md bg-grey-2" style="min-width: 300px; border-radius: 8px;" borderless>
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-sm bg-white" style="border-radius: 0 0 16px 16px;">
        <q-table
          :rows="medications"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :loading="loading"
          class="bg-transparent premium-table"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:body-cell-generic_name="props">
            <q-td :props="props">
              <div class="text-weight-bold text-dark" style="font-size: 15px;">{{ props.row.generic_name }}</div>
              <div class="text-caption text-grey-7">{{ props.row.commercial_name || 'Genérico' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-details="props">
            <q-td :props="props">
              <div class="text-dark">{{ props.row.concentration }}</div>
              <div class="text-caption text-grey-6">{{ props.row.presentation || 'N/E' }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-route="props">
            <q-td :props="props">
              <q-chip
                outline
                color="blue-8"
                size="sm"
                class="text-weight-bold"
              >
                {{ props.row.route }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm text-right">
              <q-btn
                unelevated round color="blue-1" text-color="blue-8" icon="edit" size="sm"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip class="bg-dark">Editar Medicamento</q-tooltip>
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

    <!-- Dialog para Nuevo/Editar Medicamento -->
    <q-dialog v-model="formDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 600px; max-width: 95vw; border-radius: 16px;" class="bg-grey-1">
        <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-primary text-white shadow-2" style="z-index: 10;">
          <div>
            <div class="text-h5 text-white text-weight-bold">{{ isEditing ? 'Editar Medicamento' : 'Registrar Nuevo Medicamento' }}</div>
            <div class="text-subtitle2 opacity-80">Información para el catálogo y recetas.</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <q-form ref="medicationFormRef" @submit="saveMedication">
          <q-card-section class="q-pa-lg">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="form.generic_name" label="Sustancia Activa *" outlined dense lazy-rules :rules="[val => !!val || 'Requerido']" autofocus />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.commercial_name" label="Nombre Comercial" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.presentation" label="Presentación (ej. Tabletas, Jarabe)" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.concentration" label="Concentración / Gramaje *" outlined dense lazy-rules :rules="[val => !!val || 'Requerido']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.route" label="Vía de administración *" outlined dense lazy-rules :rules="[val => !!val || 'Requerido']" />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup class="q-mr-sm" />
            <q-btn unelevated icon="save" label="Guardar Medicamento" color="primary" type="submit" class="q-px-lg shadow-2 text-weight-bold" style="border-radius: 8px;" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const medications = ref([])
const loading = ref(true)
const filter = ref('')

const formDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const medicationFormRef = ref(null)

const getBaseForm = () => ({
  id: null,
  generic_name: '',
  active_substance: '',
  commercial_name: '',
  presentation: '',
  concentration: '',
  route: ''
})

const form = ref(getBaseForm())

const columns = [
  { name: 'generic_name', align: 'left', label: 'Sustancia y Marca', field: 'generic_name', sortable: true },
  { name: 'details', align: 'left', label: 'Gramaje y Presentación', field: 'concentration', sortable: false },
  { name: 'route', align: 'left', label: 'Vía', field: 'route', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions' }
]

const fetchMedications = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/medications/all')
    medications.value = data
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error cargando medicamentos' })
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  form.value = getBaseForm()
  formDialog.value = true
}

const openEditDialog = (medication) => {
  isEditing.value = true
  form.value = { ...getBaseForm(), ...medication }
  formDialog.value = true
}

const saveMedication = async () => {
  saving.value = true
  try {
    // ensure active_substance matches generic_name as per our current simplified structure
    form.value.active_substance = form.value.generic_name
    
    if (isEditing.value) {
      await api.put(`/medications/${form.value.id}`, form.value)
      $q.notify({ color: 'positive', message: 'Medicamento actualizado', icon: 'check_circle' })
    } else {
      await api.post('/medications', form.value)
      $q.notify({ color: 'positive', message: 'Medicamento creado', icon: 'check_circle' })
    }
    formDialog.value = false
    fetchMedications()
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al guardar'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (medication) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar ${medication.generic_name}?`,
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Eliminar' }
  }).onOk(async () => {
    try {
      await api.delete(`/medications/${medication.id}`)
      $q.notify({ color: 'positive', message: 'Medicamento eliminado' })
      fetchMedications()
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al eliminar' })
    }
  })
}

onMounted(() => {
  fetchMedications()
})
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background-color: #FFFFFF;
}

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
