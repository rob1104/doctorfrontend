<template>
  <q-page class="bg-grey-1 q-pa-lg">

    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-dark text-weight-bold">Control Clínico</div>
        <div class="text-subtitle1 text-grey-6 q-mt-xs">Monitoreo y Gestión de Citas Médicas</div>
      </div>
      <div>
        <q-btn color="primary" icon="add" label="Nueva Cita" @click="openNewAppointmentDialog" class="shadow-2" rounded unelevated />
      </div>
    </div>

    <!-- Stats Header & Picker -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-dark text-weight-bold">
        Resumen de Citas
        <q-chip color="primary" text-color="white" size="sm" class="q-ml-sm text-weight-bold shadow-1">
          {{ kpiDateLabel }}
        </q-chip>
      </div>
      
      <div class="row items-center q-gutter-sm">
        <q-btn flat color="primary" label="Hoy" size="sm" class="text-weight-bold" @click="resetKpiToToday" />
        <q-btn outline color="primary" icon="date_range" label="Histórico" no-caps class="bg-white">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="kpiDateRange" range mask="YYYY-MM-DD" color="primary">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Aplicar Rango" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card shadow-1" flat>
          <q-card-section class="row items-center">
            <q-avatar size="50px" color="blue-1" text-color="blue-8" icon="event" class="q-mr-md" />
            <div>
              <div class="text-overline text-grey-6 text-weight-bold" style="line-height: 1.2;">CITAS TOTALES</div>
              <div class="text-h4 text-weight-bold text-dark">{{ todayCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card shadow-1" flat>
          <q-card-section class="row items-center">
            <q-avatar size="50px" color="amber-1" text-color="amber-8" icon="pending_actions" class="q-mr-md" />
            <div>
              <div class="text-overline text-grey-6 text-weight-bold" style="line-height: 1.2;">PENDIENTES</div>
              <div class="text-h4 text-weight-bold text-dark">{{ pendingCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card shadow-1" flat>
          <q-card-section class="row items-center">
            <q-avatar size="50px" color="green-1" text-color="green-8" icon="verified" class="q-mr-md" />
            <div>
              <div class="text-overline text-grey-6 text-weight-bold" style="line-height: 1.2;">APROBADAS</div>
              <div class="text-h4 text-weight-bold text-dark">{{ approvedCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="kpi-card shadow-1" flat>
          <q-card-section class="row items-center">
            <q-avatar size="50px" color="red-1" text-color="red-8" icon="cancel" class="q-mr-md" />
            <div>
              <div class="text-overline text-grey-6 text-weight-bold" style="line-height: 1.2;">CANCELADAS</div>
              <div class="text-h4 text-weight-bold text-dark">{{ canceledCount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Table Section -->
    <q-card class="dashboard-card shadow-2 q-mt-lg" flat>
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="row items-center">
          <div class="text-h6 text-weight-bold text-dark q-mr-lg">
            {{ viewMode === 'table' ? 'Citas (Tabla)' : (viewMode === 'calendar' ? 'Calendario Mensual' : 'Agenda Diaria') }}
          </div>
          <q-btn-group rounded class="shadow-1">
            <q-btn :color="viewMode === 'table' ? 'primary' : 'white'" :text-color="viewMode === 'table' ? 'white' : 'grey-8'" label="Tabla" icon="table_chart" @click="viewMode = 'table'" />
            <q-btn :color="viewMode === 'calendar' ? 'primary' : 'white'" :text-color="viewMode === 'calendar' ? 'white' : 'grey-8'" label="Calendario" icon="calendar_month" @click="viewMode = 'calendar'" />
            <q-btn :color="viewMode === 'agenda' ? 'primary' : 'white'" :text-color="viewMode === 'agenda' ? 'white' : 'grey-8'" label="Agenda" icon="view_agenda" @click="viewMode = 'agenda'" />
          </q-btn-group>
        </div>
        <q-input v-if="viewMode === 'table'" outlined dense v-model="filter" placeholder="Buscar paciente..." class="q-ml-md" style="min-width: 250px">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <!-- VISTA: TABLA -->
        <q-table
          v-if="viewMode === 'table'"
          :rows="appointments"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :loading="loading"
          class="bg-transparent premium-table"
          :rows-per-page-options="[10, 25, 50]"
        >

          <!-- Columna Paciente -->
          <template v-slot:body-cell-patient="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar size="42px" :color="getAvatarColor(props.row.patient.first_name)" text-color="white" class="q-mr-md font-weight-bold shadow-1">
                  {{ props.row.patient.first_name.charAt(0) }}{{ props.row.patient.last_name.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-weight-bold text-dark">{{ props.row.patient.first_name }} {{ props.row.patient.last_name }}</div>
                  <div class="text-caption text-grey-6">
                    <q-icon name="schedule" class="q-mr-xs" />
                    Agendado {{ getRelativeTime(props.row.created_at) }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Columna Tipo de Cita -->
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-chip
                outline
                :color="props.row.type === 'clinico' ? 'primary' : 'secondary'"
                size="sm"
                class="text-weight-bold"
              >
                <q-icon :name="props.row.type === 'clinico' ? 'medical_services' : 'auto_awesome'" class="q-mr-xs" />
                {{ props.row.type === 'clinico' ? 'Clínico' : 'Estético' }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna Estado -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="getStatusColor(props.row.status)"
                :text-color="getStatusTextColor(props.row.status)"
                size="sm"
                class="text-weight-bold shadow-1"
              >
                <q-icon :name="getStatusIcon(props.row.status)" class="q-mr-xs" size="14px" />
                {{ formatStatus(props.row.status) }}
              </q-chip>
            </q-td>
          </template>

          <!-- Columna Fecha de Cita -->
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              <div class="text-weight-medium text-dark">{{ formatDateNatural(props.row.appointment_date) }}</div>
              <div class="text-caption text-grey-6 text-weight-bold">{{ props.row.start_time.substring(0,5) }} hrs</div>
            </q-td>
          </template>

          <!-- Columna Acciones -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm text-right">
              <q-btn
                flat round color="primary" icon="chat" size="md"
                @click="openChat(props.row)"
              >
                <q-tooltip class="bg-dark">Contactar</q-tooltip>
              </q-btn>

              <q-btn
                v-if="!props.row.patient.is_patient"
                flat round color="amber-8" icon="person_add" size="md"
                @click="convertToPatient(props.row.patient)"
              >
                <q-tooltip class="bg-dark">Convertir a Paciente</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                flat round color="teal" icon="folder_shared" size="md"
                :to="`/admin/patient/${props.row.patient.id}`"
              >
                <q-tooltip class="bg-dark">Ver Expediente</q-tooltip>
              </q-btn>

              <q-btn
                v-if="props.row.status === 'pending'"
                flat round color="positive" icon="check_circle" size="md"
                @click="updateStatus(props.row.id, 'approved')"
              >
                <q-tooltip class="bg-dark">Aprobar Cita</q-tooltip>
              </q-btn>

              <q-btn
                v-if="props.row.status !== 'canceled'"
                flat round color="negative" icon="cancel" size="md"
                @click="promptCancel(props.row)"
              >
                <q-tooltip class="bg-dark">Cancelar Cita</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>

        <!-- VISTA: CALENDARIO -->
        <div v-else-if="viewMode === 'calendar'" class="calendar-view q-mt-md">
          <div class="row justify-between items-center q-mb-md">
            <q-btn flat icon="chevron_left" @click="prevMonth" />
            <div class="text-h6 text-weight-bold text-dark text-uppercase">{{ monthName(currentMonth) }} {{ currentYear }}</div>
            <q-btn flat icon="chevron_right" @click="nextMonth" />
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-header-day text-weight-bold text-grey-7" v-for="day in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']" :key="day">
              {{ day }}
            </div>
            
            <div 
              v-for="(cell, index) in calendarCells" 
              :key="index" 
              class="calendar-cell"
              :class="{ 'other-month': !cell.isCurrentMonth, 'today': cell.isToday }"
            >
              <div class="cell-date">{{ cell.date.getDate() }}</div>
              <div class="cell-events">
                <div 
                  v-for="app in appointmentsForDate(cell.date)" 
                  :key="app.id"
                  class="calendar-event"
                  :class="'bg-' + getStatusColor(app.status)"
                  @click.stop="openAppointmentDetails(app)"
                >
                  {{ app.start_time.substring(0,5) }} - {{ app.patient.first_name }} {{ app.patient.last_name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- VISTA: AGENDA -->
        <div v-else-if="viewMode === 'agenda'" class="agenda-view q-mt-md">
          <div class="row items-center q-mb-lg">
            <q-input v-model="agendaDate" type="date" outlined dense class="q-mr-md" />
            <div class="text-h6 text-weight-bold">Agenda del {{ formatDateNatural(agendaDate) }}</div>
          </div>

          <div v-if="agendaAppointments.length === 0" class="text-center text-grey-6 q-pa-xl" style="border: 2px dashed #ccc; border-radius: 8px;">
            No hay citas programadas para este día.
          </div>

          <q-timeline v-else color="primary">
            <q-timeline-entry
              v-for="app in agendaAppointments"
              :key="app.id"
              :title="`${app.start_time.substring(0,5)} - ${app.patient.first_name} ${app.patient.last_name}`"
              :subtitle="formatStatus(app.status)"
              :color="getStatusTextColor(app.status)"
              :icon="getStatusIcon(app.status)"
            >
              <q-card flat bordered class="q-mt-sm shadow-1">
                <q-card-section class="row justify-between items-center">
                  <div>
                    <div class="text-weight-bold">{{ app.type === 'clinico' ? 'Consulta Clínica' : 'Consulta Estética' }}</div>
                    <div class="text-grey-7">{{ app.notes || 'Sin notas adicionales' }}</div>
                  </div>
                  <div>
                    <q-btn flat round color="primary" icon="chat" size="sm" @click="openChat(app)">
                      <q-tooltip>Contactar</q-tooltip>
                    </q-btn>
                    <q-btn flat round color="info" icon="info" size="sm" @click="openAppointmentDetails(app)">
                      <q-tooltip>Ver Detalles</q-tooltip>
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </q-card-section>
    </q-card>

    <!-- Chat Dialog -->
    <q-dialog v-model="chatDialog" position="right" maximized transition-show="slide-left" transition-hide="slide-right">
      <q-card style="width: 400px; max-width: 100vw; display: flex; flex-direction: column;" class="bg-grey-2">
        <q-card-section class="bg-primary text-white row items-center no-wrap">
          <q-avatar size="40px" color="white" text-color="primary" class="q-mr-md font-weight-bold">
            {{ chatPatient?.patient?.first_name?.charAt(0) || '' }}{{ chatPatient?.patient?.last_name?.charAt(0) || '' }}
          </q-avatar>
          <div class="col">
            <div class="text-subtitle1 text-weight-bold text-white">{{ chatPatient?.patient?.first_name }} {{ chatPatient?.patient?.last_name }}</div>
            <div class="text-caption text-white text-weight-light">{{ chatPatient?.patient?.phone }}</div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="col scroll q-pa-md bg-grey-2" id="chat-scroll-area">
          <div v-if="chatLoading" class="text-center q-my-md">
            <q-spinner color="primary" size="2em" />
          </div>
          <div v-else>
            <div v-if="chatMessages.length === 0" class="text-center text-grey-6 q-my-lg text-caption">
              No hay mensajes previos. ¡Inicia la conversación!
            </div>
            <q-chat-message
              v-for="msg in chatMessages"
              :key="msg.id"
              :text="[msg.message]"
              :sent="!msg.is_from_patient"
              :bg-color="msg.is_from_patient ? 'white' : 'green-2'"
              :text-color="msg.is_from_patient ? 'dark' : 'dark'"
              :stamp="new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})"
              size="8"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="q-pa-md bg-white">
          <q-form @submit.prevent="sendMessage" class="full-width row items-center no-wrap">
            <q-input
              v-model="newMessage"
              rounded
              outlined
              dense
              placeholder="Escribe un mensaje..."
              class="col"
              bg-color="grey-2"
              borderless
              :disable="sendingMessage"
              autofocus
            />
            <q-btn
              round dense flat
              color="primary"
              icon="send"
              class="q-ml-sm"
              type="submit"
              :disable="!newMessage.trim() || sendingMessage"
              :loading="sendingMessage"
            />
          </q-form>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo de Detalles de Cita -->
    <q-dialog v-model="detailsDialog" persistent>
      <q-card style="width: 450px; max-width: 90vw; border-radius: 12px;" v-if="selectedAppointment">
        <q-card-section class="bg-primary text-white row justify-between items-center">
          <div class="text-h6 text-weight-bold text-white">Detalles de Cita</div>
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>
        <q-card-section class="q-pt-md">
          <div class="text-subtitle1 text-weight-bold text-dark q-mb-xs">{{ selectedAppointment.patient.first_name }} {{ selectedAppointment.patient.last_name }}</div>
          <div class="text-grey-7 q-mb-md"><q-icon name="phone" class="q-mr-xs"/> {{ selectedAppointment.patient.phone }}</div>
          
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <div class="text-overline text-grey-6">FECHA</div>
              <div class="text-body2 text-weight-bold">{{ formatDateNatural(selectedAppointment.appointment_date) }}</div>
            </div>
            <div class="col-6">
              <div class="text-overline text-grey-6">HORA</div>
              <div class="text-body2 text-weight-bold">{{ selectedAppointment.start_time.substring(0,5) }}</div>
            </div>
            <div class="col-6">
              <div class="text-overline text-grey-6">TIPO</div>
              <div class="text-body2 text-weight-bold text-capitalize">{{ selectedAppointment.type }}</div>
            </div>
            <div class="col-6">
              <div class="text-overline text-grey-6">ESTADO</div>
              <q-chip :color="getStatusColor(selectedAppointment.status)" :text-color="getStatusTextColor(selectedAppointment.status)" size="sm" class="q-ml-none text-weight-bold shadow-1">
                {{ formatStatus(selectedAppointment.status) }}
              </q-chip>
            </div>
          </div>

          <div v-if="selectedAppointment.notes">
            <div class="text-overline text-grey-6">NOTAS DEL PACIENTE</div>
            <div class="text-body2 bg-grey-2 q-pa-sm" style="border-radius: 4px;">{{ selectedAppointment.notes }}</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions class="bg-grey-1 row justify-between q-pa-sm">
          <div>
            <q-btn flat color="primary" icon="chat" @click="openChat(selectedAppointment)">
              <q-tooltip>WhatsApp</q-tooltip>
            </q-btn>
            <q-btn v-if="!selectedAppointment.patient.is_patient" flat color="amber-8" icon="person_add" @click="convertToPatient(selectedAppointment.patient)">
              <q-tooltip>Convertir a Paciente Oficial</q-tooltip>
            </q-btn>
            <q-btn v-else flat color="teal-8" icon="folder_shared" :to="`/admin/patient/${selectedAppointment.patient.id}`">
              <q-tooltip>Ir al Expediente Médico</q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn v-if="selectedAppointment.status === 'pending'" flat color="positive" icon="check_circle" label="Confirmar" @click="updateStatus(selectedAppointment.id, 'approved')" />
            <q-btn v-if="selectedAppointment.status !== 'canceled'" flat color="negative" icon="cancel" label="Cancelar" @click="promptCancel(selectedAppointment)" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo para Confirmar Cancelación -->
    <q-dialog v-model="cancelDialog" persistent>
      <q-card style="width: 400px; border-radius: 12px;">
        <q-card-section class="bg-negative text-white row items-center">
          <q-icon name="warning" size="md" class="q-mr-sm" />
          <div class="text-h6 text-white">Cancelar Cita</div>
        </q-card-section>
        
        <q-card-section class="q-pt-md">
          <div class="q-mb-md">¿Estás seguro de que deseas cancelar la cita de <strong>{{ appointmentToCancel?.patient.first_name }}</strong>?</div>
          <q-input v-model="cancelReason" type="textarea" label="Motivo de cancelación (Opcional)" outlined dense autogrow rows="2" class="q-mb-md" autofocus />
          <q-checkbox v-model="rescheduleAfterCancel" label="Reagendar una nueva cita inmediatamente" color="primary" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Atrás" color="grey-8" v-close-popup />
          <q-btn unelevated label="Confirmar Cancelación" color="negative" @click="confirmCancel" :loading="canceling" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo para Reagendar Cita Rápida -->
    <q-dialog v-model="rescheduleDialog" persistent>
      <q-card style="width: 400px; border-radius: 16px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-white">Reagendar Cita</div>
          <div class="text-subtitle2 text-white" v-if="appointmentToCancel">{{ appointmentToCancel.patient.first_name }} {{ appointmentToCancel.patient.last_name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input v-model="rescheduleForm.appointment_date" type="date" label="Nueva Fecha" outlined dense class="q-mb-md" autofocus />
          <q-input v-model="rescheduleForm.start_time" type="time" label="Hora" outlined dense class="q-mb-md" />
          <q-select v-model="rescheduleForm.type" :options="[{label: 'Clínico', value: 'clinico'}, {label: 'Estético', value: 'estetico'}]" emit-value map-options label="Tipo de Cita" outlined dense class="q-mb-md" />
          <q-input v-model="rescheduleForm.notes" type="textarea" label="Motivo / Notas" outlined dense autogrow rows="2" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md text-primary">
          <q-btn flat label="Omitir" color="grey" v-close-popup />
          <q-btn flat label="Agendar" icon="event" @click="saveReschedule" :loading="rescheduling" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo para Nueva Cita Manual -->
    <q-dialog v-model="newAppointmentDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw; border-radius: 16px;">
        <q-card-section class="bg-primary text-white row items-center justify-between">
          <div class="text-h6">Registrar Nueva Cita</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-btn-toggle
            v-model="newApptForm.is_existing_patient"
            spread
            no-caps
            rounded
            unelevated
            toggle-color="primary"
            color="white"
            text-color="grey-8"
            class="shadow-1 q-mb-md"
            :options="[
              {label: 'Paciente Existente', value: true},
              {label: 'Nuevo Prospecto', value: false}
            ]"
          />

          <div v-if="newApptForm.is_existing_patient" class="q-mb-md">
            <q-select
              v-model="newApptForm.patient_id"
              :options="filteredPatientsList"
              option-value="id"
              :option-label="(item) => `${item.first_name} ${item.last_name} (${item.phone})`"
              emit-value
              map-options
              use-input
              @filter="filterPatients"
              label="Buscar Paciente"
              outlined
              dense
              :loading="loadingPatients"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No se encontraron pacientes
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div v-else class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-sm-6">
              <q-input v-model="newApptForm.first_name" label="Nombre" outlined dense />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="newApptForm.last_name" label="Apellidos" outlined dense />
            </div>
            <div class="col-12">
              <q-input v-model="newApptForm.phone" label="Teléfono (WhatsApp)" outlined dense mask="##########" />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="newApptForm.appointment_date" type="date" label="Fecha de Cita" outlined dense />
            </div>
            <div class="col-6">
              <q-input v-model="newApptForm.start_time" type="time" label="Hora" outlined dense />
            </div>
            <div class="col-12">
              <q-select
                v-model="newApptForm.type"
                :options="[{label: 'Consulta Clínica', value: 'clinico'}, {label: 'Consulta Estética', value: 'estetico'}]"
                emit-value
                map-options
                label="Tipo de Consulta"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input v-model="newApptForm.notes" type="textarea" label="Motivo de consulta / Notas" outlined dense autogrow rows="2" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn unelevated label="Registrar Cita Confirmada" color="primary" @click="submitNewAppointment" :loading="savingNewAppointment" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import { formatDistanceToNow, parseISO, format } from 'date-fns'
import { es } from 'date-fns/locale'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const appointments = ref([])
const loading = ref(true)
const filter = ref('')
const viewMode = ref('calendar') // table | calendar | agenda

// View Shared State
const detailsDialog = ref(false)
const selectedAppointment = ref(null)

const openAppointmentDetails = (app) => {
  selectedAppointment.value = app
  detailsDialog.value = true
}

// Calendar Logic
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthName = (m) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[m]
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const calendarCells = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  const cells = []
  
  // Calculate offset (Monday as first day of week)
  let firstDayOfWeek = firstDay.getDay() - 1
  if (firstDayOfWeek === -1) firstDayOfWeek = 6
  
  // Previous month days
  const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0)
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay.getDate() - i)
    cells.push({ date: d, isCurrentMonth: false, isToday: false })
  }
  
  // Current month days
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(currentYear.value, currentMonth.value, i)
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    cells.push({ date: d, isCurrentMonth: true, isToday })
  }
  
  // Next month days to complete grid
  const remainingCells = 42 - cells.length
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(currentYear.value, currentMonth.value + 1, i)
    cells.push({ date: d, isCurrentMonth: false, isToday: false })
  }
  
  return cells
})

const appointmentsForDate = (dateObj) => {
  const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
  const dateStr = localDate.toISOString().split('T')[0]
  return appointments.value.filter(a => a.appointment_date === dateStr).sort((a,b) => a.start_time.localeCompare(b.start_time))
}

// Agenda Logic
const agendaDate = ref(new Date().toISOString().split('T')[0])
const agendaAppointments = computed(() => {
  return appointments.value.filter(a => a.appointment_date === agendaDate.value).sort((a,b) => a.start_time.localeCompare(b.start_time))
})

// Cancel and Reschedule Logic
const newAppointmentDialog = ref(false)
const savingNewAppointment = ref(false)
const loadingPatients = ref(false)
const allPatientsList = ref([])
const filteredPatientsList = ref([])

const newApptForm = ref({
  is_existing_patient: true,
  patient_id: null,
  first_name: '',
  last_name: '',
  phone: '',
  appointment_date: getTodayString(),
  start_time: '10:00',
  type: 'clinico',
  notes: ''
})

const openNewAppointmentDialog = async () => {
  newApptForm.value = {
    is_existing_patient: true,
    patient_id: null,
    first_name: '',
    last_name: '',
    phone: '',
    appointment_date: getTodayString(),
    start_time: '10:00',
    type: 'clinico',
    notes: ''
  }
  
  if (allPatientsList.value.length === 0) {
    loadingPatients.value = true
    try {
      const response = await api.get('/patients/all')
      allPatientsList.value = response.data
      filteredPatientsList.value = response.data
    } catch (e) {
      console.error(e)
    } finally {
      loadingPatients.value = false
    }
  }
  
  newAppointmentDialog.value = true
}

const filterPatients = (val, update) => {
  if (val === '') {
    update(() => {
      filteredPatientsList.value = allPatientsList.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    filteredPatientsList.value = allPatientsList.value.filter(v => 
      v.first_name.toLowerCase().includes(needle) || 
      v.last_name.toLowerCase().includes(needle) ||
      v.phone.includes(needle)
    )
  })
}

const submitNewAppointment = async () => {
  // Validación básica
  if (newApptForm.value.is_existing_patient && !newApptForm.value.patient_id) {
    return $q.notify({ color: 'negative', message: 'Selecciona un paciente' })
  }
  if (!newApptForm.value.is_existing_patient) {
    if (!newApptForm.value.first_name || !newApptForm.value.last_name || !newApptForm.value.phone) {
      return $q.notify({ color: 'negative', message: 'Llena los datos del prospecto' })
    }
  }
  if (!newApptForm.value.appointment_date || !newApptForm.value.start_time) {
    return $q.notify({ color: 'negative', message: 'Selecciona fecha y hora' })
  }

  savingNewAppointment.value = true
  try {
    const payload = {
      type: newApptForm.value.type,
      appointment_date: newApptForm.value.appointment_date,
      start_time: newApptForm.value.start_time,
      notes: newApptForm.value.notes
    }
    
    if (newApptForm.value.is_existing_patient) {
      payload.patient_id = newApptForm.value.patient_id
    } else {
      payload.first_name = newApptForm.value.first_name
      payload.last_name = newApptForm.value.last_name
      payload.phone = newApptForm.value.phone
    }

    const response = await api.post('/appointments/admin', payload)
    
    // Add to local state
    appointments.value.push(response.data.appointment)
    
    // Re-fetch all patients if a new prospect was created
    if (!newApptForm.value.is_existing_patient) {
      allPatientsList.value = [] // clear cache so it fetches next time
    }

    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Cita registrada y confirmada' })
    newAppointmentDialog.value = false
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al guardar la cita'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    savingNewAppointment.value = false
  }
}

// Cancel and Reschedule Logic
const cancelDialog = ref(false)
const appointmentToCancel = ref(null)
const cancelReason = ref('')
const rescheduleAfterCancel = ref(true)
const canceling = ref(false)

const rescheduleDialog = ref(false)
const rescheduling = ref(false)
const rescheduleForm = ref({
  appointment_date: '',
  start_time: '',
  type: 'clinico',
  notes: ''
})

const promptCancel = (app) => {
  appointmentToCancel.value = app
  cancelReason.value = ''
  rescheduleAfterCancel.value = true
  cancelDialog.value = true
}

const confirmCancel = async () => {
  canceling.value = true
  try {
    const payload = { status: 'canceled', cancelation_reason: cancelReason.value }
    const response = await api.patch(`/appointments/${appointmentToCancel.value.id}/status`, payload)
    
    // Update local state
    const index = appointments.value.findIndex(a => a.id === appointmentToCancel.value.id)
    if (index !== -1) {
      appointments.value[index].status = 'canceled'
    }
    
    $q.notify({ color: 'positive', message: 'Cita cancelada correctamente', icon: 'cancel' })
    cancelDialog.value = false
    detailsDialog.value = false // close details if open
    
    if (rescheduleAfterCancel.value) {
      // Setup reschedule form
      const today = new Date()
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      rescheduleForm.value.appointment_date = localDate.toISOString().split('T')[0]
      rescheduleForm.value.start_time = '10:00'
      rescheduleForm.value.type = appointmentToCancel.value.type || 'clinico'
      rescheduleForm.value.notes = ''
      rescheduleDialog.value = true
    }
  } catch (error) {
    console.error('Error canceling:', error)
    $q.notify({ color: 'negative', message: 'Error al cancelar la cita' })
  } finally {
    canceling.value = false
  }
}

const saveReschedule = async () => {
  rescheduling.value = true
  try {
    const response = await api.post('/appointments/admin', {
      patient_id: appointmentToCancel.value.patient.id,
      ...rescheduleForm.value
    })
    appointments.value.unshift(response.data.appointment)
    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Nueva cita agendada exitosamente' })
    rescheduleDialog.value = false
  } catch (error) {
    const msg = error.response?.data?.message || 'Hubo un error al agendar la cita'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    rescheduling.value = false
  }
}

// Chat State
const chatDialog = ref(false)
const chatPatient = ref(null)
const chatMessages = ref([])
const chatLoading = ref(false)
const newMessage = ref('')
const sendingMessage = ref(false)

const columns = [
  { name: 'patient', align: 'left', label: 'Paciente', field: row => `${row.patient.first_name} ${row.patient.last_name}`, sortable: true },
  { name: 'type', align: 'left', label: 'Tipo de Consulta', field: 'type', sortable: true },
  { name: 'date', align: 'left', label: 'Fecha Asignada', field: 'appointment_date', sortable: true },
  { name: 'status', align: 'left', label: 'Estado Actual', field: 'status', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions' }
]

// KPI State & Logic
function getTodayString() {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

const kpiDateRange = ref(getTodayString())

const resetKpiToToday = () => {
  kpiDateRange.value = getTodayString()
}

const kpiDateLabel = computed(() => {
  if (!kpiDateRange.value) return 'Todo el Histórico'
  if (typeof kpiDateRange.value === 'string') {
    return kpiDateRange.value === getTodayString() ? 'Hoy' : formatDateNatural(kpiDateRange.value)
  }
  return `${formatDateNatural(kpiDateRange.value.from)} - ${formatDateNatural(kpiDateRange.value.to)}`
})

const filteredKpiAppointments = computed(() => {
  if (!kpiDateRange.value) return appointments.value
  
  return appointments.value.filter(a => {
    const appDate = a.appointment_date
    if (typeof kpiDateRange.value === 'string') {
      return appDate === kpiDateRange.value
    }
    const from = kpiDateRange.value.from
    const to = kpiDateRange.value.to
    return appDate >= from && appDate <= to
  })
})

// Computed Stats
const todayCount = computed(() => filteredKpiAppointments.value.length)
const pendingCount = computed(() => filteredKpiAppointments.value.filter(a => a.status === 'pending').length)
const approvedCount = computed(() => filteredKpiAppointments.value.filter(a => a.status === 'approved').length)
const canceledCount = computed(() => filteredKpiAppointments.value.filter(a => a.status === 'canceled').length)

// UI Helpers
const getAvatarColor = (name) => {
  const colors = ['primary', 'secondary', 'accent', 'cyan-8', 'indigo-6', 'teal-6', 'purple-5']
  const charCode = name.charCodeAt(0)
  return colors[charCode % colors.length]
}

const getStatusColor = (status) => {
  switch(status) {
    case 'approved': return 'green-2'
    case 'pending': return 'amber-2'
    case 'canceled': return 'red-1'
    default: return 'grey-2'
  }
}

const getStatusTextColor = (status) => {
  switch(status) {
    case 'approved': return 'green-10'
    case 'pending': return 'amber-10'
    case 'canceled': return 'red-10'
    default: return 'grey-8'
  }
}

const getStatusIcon = (status) => {
  switch(status) {
    case 'approved': return 'check_circle'
    case 'pending': return 'schedule'
    case 'canceled': return 'cancel'
    default: return 'info'
  }
}

const formatStatus = (status) => {
  switch(status) {
    case 'approved': return 'Confirmada'
    case 'pending': return 'En Revisión'
    case 'canceled': return 'Cancelada'
    default: return status
  }
}

// Date Formatters
const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: es })
  } catch (e) {
    return ''
  }
}

const formatDateNatural = (dateString) => {
  if (!dateString) return ''
  try {
    return format(parseISO(dateString), "d 'de' MMMM, yyyy", { locale: es })
  } catch (e) {
    return dateString
  }
}

// Data Fetching
const fetchAppointments = async () => {
  loading.value = true
  try {
    const response = await api.get('/appointments')
    appointments.value = response.data
  } catch (error) {
    console.error('Error fetching appointments:', error)
    $q.notify({ color: 'negative', message: 'No se pudieron cargar las citas' })
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, newStatus) => {
  if (newStatus === 'approved') {
    $q.dialog({
      title: 'Confirmar Cita',
      message: '¿Estás seguro de aprobar esta cita? El paciente recibirá un mensaje de WhatsApp automáticamente.',
      cancel: { label: 'Cancelar', flat: true },
      ok: { label: 'Sí, Aprobar', color: 'positive' },
      persistent: true
    }).onOk(async () => {
      await executeStatusUpdate(id, newStatus)
    })
  } else {
    await executeStatusUpdate(id, newStatus)
  }
}

const executeStatusUpdate = async (id, newStatus) => {
  try {
    const payload = { status: newStatus }
    const response = await api.patch(`/appointments/${id}/status`, payload)
    const index = appointments.value.findIndex(a => a.id === id)
    if (index !== -1) {
      appointments.value[index].status = newStatus
    }
    $q.notify({
      color: 'positive',
      message: newStatus === 'approved' ? 'Cita confirmada exitosamente' : 'Cita cancelada',
      position: 'top',
      icon: 'check'
    })
    
    // Cerrar dialog si está abierto
    if (typeof detailsDialog !== 'undefined' && detailsDialog.value && selectedAppointment.value && selectedAppointment.value.id === id) {
      detailsDialog.value = false
    }
  } catch (error) {
    console.error('Error updating status:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Error al cambiar estado',
      position: 'top',
      icon: 'error'
    })
  }
}

const convertToPatient = async (patient) => {
  try {
    await api.patch(`/patients/${patient.id}/convert`)
    $q.notify({ color: 'positive', message: 'Convertido a Paciente Oficial' })
    router.push(`/admin/patient/${patient.id}`)
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al convertir' })
  }
}

// Chat Methods
const openChat = async (appointment) => {
  chatPatient.value = appointment
  chatDialog.value = true
  chatLoading.value = true
  chatMessages.value = []

  try {
    const response = await api.get(`/whatsapp/${appointment.patient.phone}`)
    chatMessages.value = response.data
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching chat history:', error)
    $q.notify({ color: 'negative', message: 'Error al cargar el historial de chat' })
  } finally {
    chatLoading.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !chatPatient.value) return

  sendingMessage.value = true
  try {
    const response = await api.post('/whatsapp/send', {
      phone: chatPatient.value.patient.phone,
      message: newMessage.value.trim()
    })

    newMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    $q.notify({ color: 'negative', message: 'No se pudo enviar el mensaje' })
  } finally {
    sendingMessage.value = false
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.getElementById('chat-scroll-area')
    if (el) el.scrollTop = el.scrollHeight
  })
}

onMounted(async () => {
  await fetchAppointments()

  // Revisar si venimos de una notificacion
  if (route.query.openChat) {
    const targetPhone = String(route.query.openChat).replace(/\D/g, '')
    // find patient or mock to open chat
    const foundApp = appointments.value.find(a => String(a.patient?.phone || '').replace(/\D/g, '') === targetPhone)
    if (foundApp) {
      openChat(foundApp)
    } else {
      // open chat with mock appointment
      openChat({ patient: { phone: route.query.openChat, first_name: 'Paciente', last_name: '(Buscando...)' } })
    }
    // Clean query
    router.replace({ path: '/admin/dashboard' })
  } else if (route.query.openAppointment) {
    const targetId = parseInt(route.query.openAppointment)
    const foundApp = appointments.value.find(a => a.id === targetId)
    if (foundApp) {
      openAppointmentDetails(foundApp)
    }
    router.replace({ path: '/admin/dashboard' })
  }

  if (window.Echo) {
    // Inyectar el token más reciente, ya que echo.js solo lo lee una vez al iniciar la app
    const token = localStorage.getItem('auth_token');
    if (window.Echo.connector.options) {
      window.Echo.connector.options.auth = window.Echo.connector.options.auth || {};
      window.Echo.connector.options.auth.headers = window.Echo.connector.options.auth.headers || {};
      window.Echo.connector.options.auth.headers['Authorization'] = `Bearer ${token}`;
    }
    if (window.Echo.connector.pusher) {
      window.Echo.connector.pusher.config = window.Echo.connector.pusher.config || {};
      window.Echo.connector.pusher.config.auth = window.Echo.connector.pusher.config.auth || {};
      window.Echo.connector.pusher.config.auth.headers = window.Echo.connector.pusher.config.auth.headers || {};
      window.Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${token}`;
    }

    window.Echo.private('admin.notifications')
      .listen('AppointmentCreated', (e) => {
        const appointment = e.appointment
        appointments.value.unshift(appointment)
      })
      .listen('WhatsAppMessageReceived', (e) => {
        const msg = e.message
        // Si el chat está abierto y es de este paciente
        const currentPhone = String(chatPatient.value?.patient?.phone || '').replace(/\D/g, '')
        const msgPhone = String(msg.phone || '').replace(/\D/g, '')
        
        if (chatDialog.value && currentPhone && msgPhone && (currentPhone.includes(msgPhone) || msgPhone.includes(currentPhone))) {
          // Solución a prueba de balas: recargar el historial directamente desde la base de datos
          api.get(`/whatsapp/${chatPatient.value.patient.phone}`).then(response => {
            chatMessages.value = response.data
            setTimeout(scrollToBottom, 200)
          }).catch(err => console.error('Error recargando chat', err))
        }
      })
  }
})

onUnmounted(() => {
  if (window.Echo) {
    window.Echo.leave('admin.notifications')
  }
})
</script>

<style lang="scss">
.dashboard-card {
  border-radius: 16px;
  background-color: #FFFFFF;
}

.kpi-card {
  border-radius: 16px;
  background-color: #FFFFFF;
  transition: transform 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
}

/* Rediseño sutil para la QTable */
.premium-table .q-table__card {
  box-shadow: none !important;
}

.premium-table thead tr {
  background-color: transparent !important;
  border-bottom: 2px solid #edf2f7;
}

.premium-table th {
  font-weight: 700 !important;
  font-size: 0.8rem !important;
  text-transform: uppercase;
  color: #718096 !important;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #edf2f7 !important;
}

.premium-table tbody td {
  padding: 16px 24px !important;
  border-bottom: 1px solid #f0f4f8 !important;
}

.premium-table tbody tr {
  transition: background-color 0.2s ease;
}

.premium-table tbody tr:hover {
  background-color: #f7fafc !important;
}

.elegant-notify {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Estilos de Calendario Mensual (Cuadritos) */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
.calendar-header-day {
  background-color: #f1f5f9;
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
}
.calendar-cell {
  background-color: #ffffff;
  min-height: 120px;
  padding: 8px;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
}
.calendar-cell:hover {
  background-color: #f8fafc;
}
.calendar-cell.other-month {
  background-color: #f8fafc;
  opacity: 0.5;
}
.calendar-cell.today .cell-date {
  background-color: var(--q-primary);
  color: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell-date {
  font-weight: bold;
  color: #475569;
  margin-bottom: 8px;
  font-size: 14px;
  align-self: flex-end;
}
.cell-events {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.calendar-event {
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1e293b;
  font-weight: 600;
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.calendar-event:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
