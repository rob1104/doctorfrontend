<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-dark text-weight-bold">Auditoría y Seguridad</div>
        <div class="text-subtitle1 text-grey-6 q-mt-xs">Registro detallado de actividad del sistema</div>
      </div>
      <q-btn
        color="primary"
        icon="refresh"
        label="Actualizar"
        unelevated
        rounded
        class="q-px-lg shadow-3 font-weight-bold"
        @click="onRequest({ pagination })"
      />
    </div>

    <!-- Filtros y Tabla -->
    <q-card class="shadow-2 dashboard-card" flat>
      <q-card-section class="row items-center justify-between q-pb-none bg-white" style="border-radius: 16px 16px 0 0;">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="history" color="primary" class="q-mr-sm" size="sm" />
          Historial de Eventos
        </div>

        <div class="row q-gutter-md items-center q-mt-sm q-mt-md-none">
          <q-select
            v-model="filters.causer_id"
            :options="userOptions"
            label="Usuario"
            outlined
            borderless
            dense
            emit-value
            map-options
            clearable
            class="bg-grey-2"
            style="min-width: 180px; border-radius: 8px;"
            @update:model-value="onRequest({ pagination: { ...pagination, page: 1 } })"
          />
          <q-select
            v-model="filters.event"
            :options="eventOptions"
            label="Tipo de Evento"
            outlined
            borderless
            dense
            emit-value
            map-options
            clearable
            class="bg-grey-2"
            style="min-width: 180px; border-radius: 8px;"
            @update:model-value="onRequest({ pagination: { ...pagination, page: 1 } })"
          />
          <q-input
            v-model="filters.date_from"
            type="date"
            label="Desde"
            outlined
            borderless
            dense
            clearable
            class="bg-grey-2"
            style="border-radius: 8px;"
            @update:model-value="onRequest({ pagination: { ...pagination, page: 1 } })"
          />
          <q-input
            v-model="filters.date_to"
            type="date"
            label="Hasta"
            outlined
            borderless
            dense
            clearable
            class="bg-grey-2"
            style="border-radius: 8px;"
            @update:model-value="onRequest({ pagination: { ...pagination, page: 1 } })"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-sm bg-white" style="border-radius: 0 0 16px 16px;">
        <q-table
          :rows="logs"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
          flat
          class="bg-transparent premium-table"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:body-cell-event="props">
            <q-td :props="props">
              <q-chip
                :color="getEventColor(props.row.event)"
                text-color="white"
                dense
                size="sm"
                class="text-weight-bold text-uppercase shadow-1"
              >
                {{ formatEvent(props.row.event) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-causer="props">
            <q-td :props="props">
              <div v-if="props.row.causer" class="row items-center">
                <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm shadow-1">
                  {{ props.row.causer.name.charAt(0) }}
                </q-avatar>
                <div class="text-weight-bold text-dark">{{ props.row.causer.name }}</div>
              </div>
              <div v-else class="text-grey italic row items-center">
                <q-avatar size="32px" color="grey-4" text-color="grey-7" class="q-mr-sm">
                  <q-icon name="desktop_windows" size="xs" />
                </q-avatar>
                Sistema / Invitado
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-subject="props">
            <q-td :props="props">
              <span v-if="props.row.subject_type" class="text-weight-medium text-dark">
                <q-icon name="folder" size="xs" color="primary" class="q-mr-xs" />
                {{ formatSubjectType(props.row.subject_type) }}
                <span class="text-grey-6 text-caption q-ml-xs">#{{ props.row.subject_id }}</span>
              </span>
              <span v-else class="text-grey italic">-</span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-right">
              <q-btn flat round dense color="primary" icon="visibility" @click="viewDetails(props.row)" class="bg-blue-1">
                <q-tooltip>Ver Detalles</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Diálogo de Detalles -->
    <q-dialog v-model="detailsDialog">
      <q-card style="min-width: 600px; max-width: 90vw; border-radius: 16px;">
        <q-card-section class="bg-primary text-white row items-center q-pb-md border-primary-top">
          <div class="text-h6 text-white text-weight-bold row items-center">
            <q-icon name="info" size="sm" class="q-mr-sm" /> Detalles del Evento
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6">
              <q-card flat bordered class="bg-grey-1 text-center q-pa-sm" style="border-radius: 12px;">
                <div class="text-caption text-grey-7 text-uppercase text-weight-bold">Fecha y Hora</div>
                <div class="text-subtitle1 text-dark text-weight-medium">{{ formatDate(selectedLog?.created_at) }}</div>
              </q-card>
            </div>
            <div class="col-12 col-sm-6">
              <q-card flat bordered class="bg-grey-1 text-center q-pa-sm" style="border-radius: 12px;">
                <div class="text-caption text-grey-7 text-uppercase text-weight-bold">Causante</div>
                <div class="text-subtitle1 text-dark text-weight-medium">{{ selectedLog?.causer?.name || 'Sistema / Invitado' }}</div>
              </q-card>
            </div>
          </div>

          <!-- Vista para Inicios de Sesión -->
          <div v-if="selectedLog?.event === 'login' || selectedLog?.event === 'login_failed'">
            <div class="text-subtitle2 q-mb-md text-primary text-weight-bold text-uppercase row items-center">
              <q-icon name="vpn_key" class="q-mr-xs" size="sm" /> Información de Conexión
            </div>
            <q-list bordered separator style="border-radius: 12px;" class="overflow-hidden">
              <q-item v-if="selectedLog.properties?.ip">
                <q-item-section avatar>
                  <q-icon name="public" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold text-uppercase">Dirección IP</q-item-label>
                  <q-item-label class="text-dark">{{ selectedLog.properties.ip }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="selectedLog.properties?.email">
                <q-item-section avatar>
                  <q-icon name="email" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold text-uppercase">Email Utilizado</q-item-label>
                  <q-item-label class="text-dark">{{ selectedLog.properties.email }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="selectedLog.properties?.user_agent">
                <q-item-section avatar>
                  <q-icon name="devices" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold text-uppercase">Navegador / Dispositivo</q-item-label>
                  <q-item-label class="text-dark text-caption" style="word-break: break-all;">{{ selectedLog.properties.user_agent }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Vista para Cambios en Modelos -->
          <div v-else-if="selectedLog?.properties?.attributes">
            <div class="text-subtitle2 q-mb-md text-primary text-weight-bold text-uppercase row items-center">
              <q-icon name="edit_note" class="q-mr-xs" size="sm" /> Modificaciones a: {{ formatSubjectType(selectedLog.subject_type) }}
            </div>

            <q-markup-table flat bordered class="rounded-borders premium-table" style="border-radius: 12px;">
              <thead>
                <tr>
                  <th class="text-left bg-grey-2">Campo</th>
                  <th v-if="selectedLog.properties.old" class="text-left bg-red-1 text-red-9">Valor Anterior</th>
                  <th class="text-left bg-green-1 text-green-9">Valor Nuevo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(newValue, key) in selectedLog.properties.attributes" :key="key">
                  <td class="text-weight-bold text-grey-8">{{ key }}</td>
                  <td v-if="selectedLog.properties.old" class="text-red-9" style="background-color: #fef2f2;">
                    {{ formatValue(selectedLog.properties.old[key]) }}
                  </td>
                  <td class="text-green-9 text-weight-medium" style="background-color: #f0fdf4;">
                    {{ formatValue(newValue) }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div v-else>
            <div class="text-italic text-grey text-center q-pa-lg">
              <q-icon name="do_not_disturb_alt" size="xl" color="grey-4" class="q-mb-md block q-mx-auto" />
              No hay detalles adicionales registrados para este evento.
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { api } from '../../boot/axios.js'
import { useAuditLogs } from '../../composables/useAuditLogs.js'

const { logs, loading, pagination, filters, fetchLogs } = useAuditLogs()

const detailsDialog = ref(false)
const selectedLog = ref(null)
const userOptions = ref([])

const eventOptions = [
  { label: 'Creación (created)', value: 'created' },
  { label: 'Actualización (updated)', value: 'updated' },
  { label: 'Eliminación (deleted)', value: 'deleted' },
  { label: 'Inicio de Sesión Exitoso', value: 'login' },
  { label: 'Inicio de Sesión Fallido', value: 'login_failed' },
]

const columns = [
  { name: 'created_at', label: 'Fecha / Hora', field: 'created_at', format: val => formatDate(val), align: 'left' },
  { name: 'event', label: 'Evento', field: 'event', align: 'left' },
  { name: 'causer', label: 'Causante', field: 'causer', align: 'left' },
  { name: 'subject', label: 'Módulo Afectado', field: 'subject_type', align: 'left' },
  { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
  { name: 'actions', label: 'Acciones', align: 'right' }
]

const onRequest = (props) => {
  fetchLogs(props)
}

onMounted(async () => {
  fetchLogs({ pagination: pagination.value })
  try {
    const res = await api.get('/users')
    const userList = Array.isArray(res.data) ? res.data : (res.data.data || [])
    userOptions.value = userList.map(u => ({ label: u.name, value: u.id }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})

const viewDetails = (log) => {
  selectedLog.value = log
  detailsDialog.value = true
}

// Helpers
const formatDate = (val) => {
  if (!val) return ''
  return date.formatDate(val, 'DD/MM/YYYY HH:mm:ss')
}

const getEventColor = (event) => {
  switch(event) {
    case 'created': return 'positive'
    case 'updated': return 'info'
    case 'deleted': return 'negative'
    case 'login': return 'teal'
    case 'login_failed': return 'red-9'
    default: return 'grey'
  }
}

const formatEvent = (event) => {
  switch(event) {
    case 'created': return 'Creado'
    case 'updated': return 'Actualizado'
    case 'deleted': return 'Eliminado'
    case 'login': return 'Login'
    case 'login_failed': return 'Login Fallido'
    default: return event
  }
}

const formatSubjectType = (type) => {
  if (!type) return ''
  const parts = type.split('\\')
  const modelName = parts[parts.length - 1]

  const translations = {
    'User': 'Usuario',
    'Patient': 'Paciente',
    'Appointment': 'Cita',
    'Consultation': 'Consulta',
    'ConsultationPayment': 'Pago',
    'AgendaSetting': 'Ajustes de Agenda',
    'PrescriptionSetting': 'Ajustes de Receta',
    'Medication': 'Medicamento',
    'Prescription': 'Receta Médica',
    'BlockedTimeSlot': 'Bloqueo de Agenda',
    'PatientDocument': 'Documento de Paciente'
  }

  return translations[modelName] || modelName
}

const formatValue = (val) => {
  if (val === null || val === undefined) return 'NULO'
  if (typeof val === 'boolean') return val ? 'Sí' : 'No'
  if (typeof val === 'object') return JSON.stringify(val)
  return val
}
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background-color: #FFFFFF;
}
.border-primary-top {
  border-top: 3px solid #000;
  border-top-color: var(--q-primary);
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

/* Fix q-input bg inside card header */
.bg-grey-2 {
  background-color: #f1f5f9 !important;
}
</style>
