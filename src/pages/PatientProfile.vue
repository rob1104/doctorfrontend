<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <q-btn flat icon="arrow_back" color="primary" label="Volver a Pacientes" to="/admin/patients" class="q-mr-sm" />
        <div class="text-h4 text-dark text-weight-bold q-mt-sm">Expediente Clínico</div>
      </div>
      <div>
        <q-btn
          color="primary"
          icon="add_circle"
          label="Nueva Consulta"
          unelevated
          rounded
          class="q-px-lg shadow-2"
          @click="startNewConsultation"
        />
      </div>
    </div>

    <div v-if="loading" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <div v-else-if="patient" class="row q-col-gutter-lg">

      <!-- Lado Izquierdo: Datos del Paciente -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2 profile-card" flat>
          <q-card-section class="text-center bg-teal-7 text-white q-pb-lg" style="border-top-left-radius: 4px; border-top-right-radius: 4px;">
            <div class="flex flex-center q-mb-md" style="margin-top: 20px;">
              <q-avatar size="100px" class="shadow-3">
                <img :src="getAvatarUrl(patient.gender)" />
              </q-avatar>
            </div>
            <div class="text-h5 text-grey-2 text-weight-bold" style="line-height: 1.2;">{{ patient.first_name }}</div>
            <div class="text-h5 text-grey-2 text-weight-bold q-mb-md" style="line-height: 1.2;">{{ patient.last_name }}</div>

            <div class="text-subtitle2 flex flex-center q-mb-xs">
              <q-icon name="phone" size="16px" class="q-mr-sm" /> {{ formatPhoneNumber(patient.phone) }}
            </div>
            <div class="text-body2 flex flex-center" style="opacity: 0.85;">
              <q-icon name="email" size="16px" class="q-mr-sm" /> {{ patient.email || 'Sin correo' }}
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-card class="bg-blue-grey-1 shadow-none q-pa-md" style="border-radius: 12px; border: 1px solid #E2E8F0;">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-weight-bold text-dark text-subtitle1">Ficha Clínica</div>
                <q-btn flat round dense icon="edit" color="primary" @click="editClinicalData = true" />
              </div>

              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="bloodtype" color="red-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Tipo de Sangre</q-item-label>
                    <q-item-label>{{ patient.blood_type || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="warning" color="amber-8" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Alergias</q-item-label>
                    <q-item-label>{{ patient.allergies || 'Ninguna conocida' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="face" color="brown-4" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Fototipo de Piel (Fitzpatrick)</q-item-label>
                    <q-item-label>{{ patient.skin_type || 'No evaluado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="family_restroom" color="blue-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Antecedentes Familiares</q-item-label>
                    <q-item-label>{{ patient.family_history || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="sports_tennis" color="green-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Personales No Patológicos (APNP)</q-item-label>
                    <q-item-label>{{ patient.non_pathological_history || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="patient.gender === 'Femenino' || patient.gender === 'Mujer' || patient.gyneco_obstetric_history">
                  <q-item-section avatar><q-icon name="pregnant_woman" color="pink-4" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Gineco-Obstétricos (AGO)</q-item-label>
                    <q-item-label>{{ patient.gyneco_obstetric_history || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="medical_information" color="purple-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Padecimientos Crónicos</q-item-label>
                    <q-item-label>{{ patient.chronic_conditions || 'Ninguno' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="medication" color="green-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Medicamentos Actuales</q-item-label>
                    <q-item-label>{{ patient.current_medications || 'Ninguno' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="content_cut" color="orange-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Historial Quirúrgico</q-item-label>
                    <q-item-label>{{ patient.surgical_history || 'Ninguno' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />
                <div class="text-weight-bold text-dark text-subtitle2 q-px-md q-pt-sm">Datos de Dermatología</div>
                <q-item>
                  <q-item-section avatar><q-icon name="water_drop" color="light-blue-4" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Tendencia de Piel</q-item-label>
                    <q-item-label>{{ patient.skin_tendency || 'No evaluada' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="light_mode" color="amber-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Nivel de Exposición Solar</q-item-label>
                    <q-item-label>{{ patient.sun_exposure_level || 'No evaluado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="healing" color="red-4" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Padecimientos Previos (Piel)</q-item-label>
                    <q-item-label>{{ patient.previous_skin_conditions || 'Ninguno' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="clean_hands" color="teal-3" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Rutina Skincare Actual</q-item-label>
                    <q-item-label>{{ patient.skincare_routine || 'No especificada' }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator class="q-my-sm" />
                <div class="text-weight-bold text-dark text-subtitle2 q-px-md q-pt-sm">Datos Generales</div>

                <q-item>
                  <q-item-section avatar><q-icon name="cake" color="pink-4" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Fecha de Nacimiento</q-item-label>
                    <q-item-label>{{ patient.date_of_birth || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="wc" color="teal-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Género & Estado Civil</q-item-label>
                    <q-item-label>{{ patient.gender || 'N/A' }} {{ patient.marital_status ? '- ' + patient.marital_status : '' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="work" color="grey-7" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Ocupación</q-item-label>
                    <q-item-label>{{ patient.occupation || 'No especificado' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="home" color="indigo-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Dirección Completa</q-item-label>
                    <q-item-label>{{ formatFullAddress(patient) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="patient.place_of_birth">
                  <q-item-section avatar><q-icon name="public" color="blue-5" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Lugar de Origen</q-item-label>
                    <q-item-label>{{ patient.place_of_birth }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="contact_phone" color="red-6" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Contacto de Emergencia</q-item-label>
                    <q-item-label>{{ patient.emergency_contact_name || 'N/A' }} {{ patient.emergency_contact_phone ? '(' + patient.emergency_contact_phone + ')' : '' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-card-section>
        </q-card>
      </div>

      <!-- Lado Derecho: Pestañas (Consultas + Archivos) -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-2 timeline-card" flat>
          <!-- Pestañas de navegación -->
          <q-tabs
            v-model="activeTab"
            class="text-grey-8"
            active-color="primary"
            indicator-color="primary"
            align="left"
            dense
            no-caps
            style="border-bottom: 1px solid #e0e0e0;"
          >
            <q-tab name="consultas" icon="history" label="Consultas" />
            <q-tab name="archivos" icon="perm_media" label="Archivos y Multimedia" />
          </q-tabs>

          <q-tab-panels v-model="activeTab" animated keep-alive>
            <!-- ════════ Panel: Consultas ════════ -->
            <q-tab-panel name="consultas" class="q-pa-none">
              <!-- Barra de herramientas superior -->
              <div class="q-pa-md bg-white row justify-between items-center" style="border-bottom: 1px solid #e0e0e0;">
                <div class="text-h6 text-weight-bold text-dark row items-center q-mb-sm-none q-mb-sm">
                  <q-icon name="history" color="primary" size="sm" class="q-mr-sm" />
                  Historial de Consultas
                </div>

                <div class="row q-gutter-sm items-center">
                  <q-input v-model="consultationSearch" dense outlined placeholder="Buscar diagnóstico..." style="width: 250px" bg-color="white">
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:append v-if="consultationSearch">
                      <q-icon name="close" @click="consultationSearch = ''" class="cursor-pointer" size="xs" />
                    </template>
                  </q-input>

                  <q-input :model-value="dateRangeText" dense outlined placeholder="Filtrar por fecha" readonly style="width: 250px" bg-color="white">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="consultationDateRange" range mask="YYYY-MM-DD" color="primary">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append v-if="consultationDateRange">
                      <q-icon name="close" @click="consultationDateRange = null" class="cursor-pointer" size="xs">
                        <q-tooltip>Limpiar Fechas</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Estado Vacio General -->
              <div v-if="!patient.consultations || patient.consultations.length === 0" class="text-center q-pa-xl text-grey-6 bg-grey-1" style="min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <q-icon name="history_toggle_off" size="4em" class="q-mb-md" />
                <div class="text-h6">Aún no hay consultas</div>
                <div>Inicia una nueva consulta para comenzar el historial médico de este paciente.</div>
              </div>

              <div v-else-if="filteredConsultations.length === 0" class="text-center q-pa-xl text-grey-6 bg-grey-1" style="min-height: 500px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <q-icon name="search_off" size="4em" class="q-mb-md" />
                <div class="text-h6">No se encontraron resultados</div>
                <div>Intenta ajustar los filtros de búsqueda o fechas.</div>
                <q-btn flat color="primary" label="Limpiar Filtros" class="q-mt-md" @click="consultationSearch = ''; consultationDateRange = null" />
              </div>

              <!-- Lista scrolleable -->
              <q-scroll-area v-else style="height: 600px;" class="bg-grey-1 q-pa-md">
                <div class="row q-col-gutter-md q-pb-xl">
                  <div class="col-12" v-for="consultation in filteredConsultations" :key="consultation.id">
                    <q-card flat bordered class="q-mb-md shadow-2 transition-ease" :style="{ backgroundColor: '#ECFAE5', borderRadius: '12px', borderLeft: consultation.is_finished ? '6px solid #4caf50' : '6px solid #ff9800' }">
                      <q-card-section class="q-pa-md">
                        <!-- HEADER: Fecha y Status -->
                        <div class="row items-center justify-between q-mb-md">
                          <div class="text-subtitle1 text-weight-bold text-dark row items-center">
                            <q-icon name="event_note" color="primary" class="q-mr-sm" size="sm" />
                            {{ formatDate(consultation.created_at) }}
                          </div>
                          <div class="row q-gutter-sm">
                            <!-- Estatus Médico (Labels) -->
                            <q-badge v-if="consultation.is_finished" color="green-1" text-color="green-8" class="text-weight-bold text-uppercase q-pa-xs shadow-1" style="border-radius: 4px;"><q-icon name="check_circle" size="xs" class="q-mr-xs"/> Completada</q-badge>
                            <q-badge v-else color="orange-1" text-color="orange-9" class="text-weight-bold text-uppercase q-pa-xs shadow-1" style="border-radius: 4px;"><q-icon name="pending_actions" size="xs" class="q-mr-xs"/> En Progreso</q-badge>

                            <!-- Estatus de Pago (Labels) -->
                            <q-badge v-if="consultation.payments && consultation.payments.length > 0" color="blue-1" text-color="blue-8" class="text-weight-bold text-uppercase q-pa-xs shadow-1" style="border-radius: 4px;"><q-icon name="payments" size="xs" class="q-mr-xs"/> Pagada</q-badge>
                            <q-badge v-else color="grey-2" text-color="grey-7" class="text-weight-bold text-uppercase q-pa-xs shadow-1" style="border-radius: 4px;"><q-icon name="money_off" size="xs" class="q-mr-xs"/> Pago Pendiente</q-badge>
                          </div>
                        </div>

                        <q-separator color="grey-3" class="q-mb-md" />

                        <!-- BODY: Resumen Clínico -->
                        <div class="row q-col-gutter-md q-mb-md">
                          <div class="col-12 col-md-7">
                            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Diagnóstico Clínico</div>
                            <div class="text-body2 text-dark text-weight-medium q-mb-sm">{{ consultation.diagnosis || 'Consulta General (Sin especificar)' }}</div>

                            <div v-if="consultation.reason">
                              <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Motivo de Visita</div>
                              <div class="text-body2 text-grey-8 text-truncate" style="max-height: 40px; overflow: hidden;">{{ consultation.reason }}</div>
                            </div>
                          </div>

                          <div class="col-12 col-md-5">
                             <div class="text-caption text-grey-6 text-uppercase text-weight-bold q-mb-xs">Signos Vitales Rápidos</div>
                             <div class="row q-gutter-xs">
                               <div v-if="consultation.blood_pressure" class="bg-grey-1 text-dark text-caption q-px-sm q-py-xs shadow-1 text-weight-medium" style="border-radius: 6px; border: 1px solid #e0e0e0;">PA: {{ consultation.blood_pressure }}</div>
                               <div v-if="consultation.heart_rate" class="bg-grey-1 text-dark text-caption q-px-sm q-py-xs shadow-1 text-weight-medium" style="border-radius: 6px; border: 1px solid #e0e0e0;">FC: {{ consultation.heart_rate }}</div>
                               <div v-if="consultation.weight" class="bg-grey-1 text-dark text-caption q-px-sm q-py-xs shadow-1 text-weight-medium" style="border-radius: 6px; border: 1px solid #e0e0e0;">Peso: {{ consultation.weight }} kg</div>
                               <span v-if="!consultation.blood_pressure && !consultation.heart_rate && !consultation.weight" class="text-grey-5 italic text-caption">No registrados</span>
                             </div>
                          </div>
                        </div>

                        <!-- FOOTER: Acciones (Botones Claros) -->
                        <div class="row items-center q-gutter-sm bg-grey-1 q-pa-sm" style="border-radius: 8px;">
                          <!-- Botones de Documentos -->
                          <q-btn unelevated no-caps color="blue-1" text-color="primary" icon="print" label="Expediente" size="sm" class="text-weight-bold" @click="viewConsultationPdf(consultation.id)" />
                          <q-btn v-if="consultation.prescription" outline no-caps color="deep-orange" icon="receipt_long" label="Receta" size="sm" class="text-weight-bold bg-white" @click="viewPrescription(consultation.prescription.id)" />

                          <q-space />

                          <!-- Botones de Gestión -->
                          <q-btn unelevated no-caps color="indigo-5" text-color="white" icon="visibility" label="Detalles" size="sm" class="text-weight-bold shadow-1" @click="openConsultation(consultation)" />
                          <q-btn v-if="!consultation.is_finished" unelevated no-caps color="orange-6" text-color="white" icon="edit" label="Editar" size="sm" class="text-weight-bold shadow-1" @click="editConsultation(consultation)" />
                          <q-btn v-if="!consultation.is_finished" unelevated no-caps color="positive" text-color="white" icon="check_circle" label="Completar" size="sm" class="text-weight-bold shadow-1" @click="confirmFinish(consultation)" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-scroll-area>
            </q-tab-panel>

            <!-- ════════ Panel: Archivos y Multimedia ════════ -->
            <q-tab-panel name="archivos">
              <PatientDocumentsTab :patient-id="patientId" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

    </div>

    <!-- Dialogo para Nueva Consulta -->
    <ConsultationDialog
      v-model="showConsultationDialog"
      :patientId="patientId"
      :editData="consultationToEdit"
      @saved="fetchPatient"
    />

    <!-- Dialogo para Ver Consulta (Solo Lectura - Rediseñado) -->
    <q-dialog v-model="viewConsultationDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 900px; max-width: 95vw; border-radius: 16px; background-color: #f8f9fa;">

        <!-- Header Elegante -->
        <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-dark text-white" style="border-top-left-radius: 16px; border-top-right-radius: 16px;">
          <div>
            <div class="text-h5 text-white text-weight-bold" style="letter-spacing: 0.5px;">Resumen Clínico</div>
            <div class="text-subtitle2 text-grey-4"><q-icon name="event" size="xs" class="q-mr-xs"/> {{ selectedConsultation ? formatDate(selectedConsultation.created_at) : '' }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="grey-4" />
        </q-card-section>

        <q-card-section class="scroll q-pa-lg" style="max-height: 80vh;" v-if="selectedConsultation">

          <div class="row q-col-gutter-lg">

            <!-- Columna Izquierda: Clínica principal -->
            <div class="col-12 col-md-7">

              <!-- Diagnóstico y Motivo -->
              <div class="bg-white q-pa-md shadow-1 q-mb-md" style="border-radius: 8px; border-left: 4px solid #37474f;">
                <div class="row items-center q-mb-sm">
                  <q-icon name="health_and_safety" color="blue-grey-8" size="sm" class="q-mr-sm"/>
                  <div class="text-subtitle1 text-blue-grey-9 text-weight-bold">Diagnóstico Clínico</div>
                </div>
                <div class="text-body1 text-dark q-pl-lg q-mb-md">{{ selectedConsultation.diagnosis || 'Sin especificar' }}</div>

                <q-separator class="q-my-sm" />

                <div class="row items-center q-mb-sm q-mt-md">
                  <q-icon name="chat_bubble_outline" color="blue-grey-8" size="sm" class="q-mr-sm"/>
                  <div class="text-subtitle2 text-blue-grey-9 text-weight-bold">Motivo de Consulta</div>
                </div>
                <div class="text-body2 text-grey-8 q-pl-lg">{{ selectedConsultation.reason || 'Sin especificar' }}</div>
              </div>

              <!-- Plan de Tratamiento -->
              <div class="bg-white q-pa-md shadow-1" style="border-radius: 8px; border-left: 4px solid #37474f;">
                <div class="row items-center q-mb-sm">
                  <q-icon name="healing" color="blue-grey-8" size="sm" class="q-mr-sm"/>
                  <div class="text-subtitle1 text-blue-grey-9 text-weight-bold">Plan de Tratamiento</div>
                </div>
                <div class="text-body2 text-dark q-pl-lg" style="white-space: pre-line;">{{ selectedConsultation.treatment_plan || 'Sin especificaciones médicas' }}</div>
              </div>

            </div>

            <!-- Columna Derecha: Signos Vitales y Receta -->
            <div class="col-12 col-md-5">

              <!-- Signos Vitales (Grid Minimalista) -->
              <div class="bg-white q-pa-md shadow-1 q-mb-md" style="border-radius: 8px; border: 1px solid #eceff1;">
                <div class="text-caption text-uppercase text-weight-bold text-blue-grey-6 q-mb-md">Signos Vitales y Medidas</div>

                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">Presión Art.</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.blood_pressure || '--' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">F. Cardiaca</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.heart_rate ? selectedConsultation.heart_rate + ' lpm' : '--' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">F. Respiratoria</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.respiratory_rate ? selectedConsultation.respiratory_rate + ' rpm' : '--' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">Temperatura</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.temperature ? selectedConsultation.temperature + ' °C' : '--' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">Peso</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.weight ? selectedConsultation.weight + ' kg' : '--' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-grey-1 q-pa-sm text-center" style="border-radius: 6px;">
                      <div class="text-caption text-grey-7">Talla</div>
                      <div class="text-subtitle2 text-dark text-weight-bold">{{ selectedConsultation.height ? selectedConsultation.height + ' cm' : '--' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vista Previa de Receta (Estilo Ticket Sobrio) -->
              <div v-if="selectedConsultation.prescription" class="bg-white q-pa-md shadow-1" style="border-radius: 8px; border: 1px solid #eceff1;">
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-caption text-uppercase text-weight-bold text-blue-grey-6">Receta Extendida</div>
                  <q-icon name="receipt_long" color="blue-grey-4" size="sm" />
                </div>

                <q-list dense separator class="text-body2">
                  <q-item v-for="(med, idx) in selectedConsultation.prescription.medications" :key="idx" class="q-pa-none q-py-xs">
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-dark">• {{ med.name }}</q-item-label>
                      <q-item-label caption class="text-grey-8 q-pl-sm">{{ med.instructions }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-if="selectedConsultation.prescription.instructions" class="q-mt-md bg-grey-1 q-pa-sm" style="border-radius: 4px; border-left: 2px solid #9e9e9e;">
                  <div class="text-caption text-weight-bold text-dark q-mb-xs">Instrucciones Generales</div>
                  <div class="text-caption text-grey-8">{{ selectedConsultation.prescription.instructions }}</div>
                </div>
              </div>

              <div v-else class="bg-white q-pa-md shadow-1 text-center" style="border-radius: 8px; border: 1px dashed #cfd8dc;">
                <q-icon name="medication" size="md" color="grey-4" class="q-mb-sm" />
                <div class="text-caption text-grey-6">Sin receta registrada en esta consulta</div>
              </div>

            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md bg-white">
          <q-btn flat label="Cerrar Detalles" color="blue-grey-8" v-close-popup class="text-weight-bold" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo para Editar Datos Clínicos -->
    <q-dialog v-model="editClinicalData" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 1100px; max-width: 95vw; border-radius: 16px;" class="bg-grey-1">

        <!-- Encabezado Fijo -->
        <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-primary text-white shadow-2" style="z-index: 10;">
          <div>
            <div class="text-h5 text-white text-weight-bold">Editar Ficha Médica</div>
            <div class="text-subtitle2 opacity-80">Actualiza los datos clínicos del paciente.</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <!-- El Formulario envuelve el contenido scrolleable y los botones fijos -->
        <q-form @submit="saveClinicalData">
          <!-- Área de Contenido con Scroll Independiente -->
          <q-card-section class="scroll q-pa-lg" style="max-height: 75vh;">
            <div class="row q-col-gutter-lg">

              <!-- Columna Izquierda: Demografía y Generales -->
              <div class="col-12 col-md-6">
                
                <q-card bordered flat class="q-mb-md bg-white" style="border-radius: 12px; border-top: 3px solid #009688;">
                  <q-card-section class="q-pb-sm">
                    <div class="text-subtitle1 text-weight-bold text-teal-7 row items-center">
                      <q-icon name="manage_accounts" size="sm" class="q-mr-sm" /> Generales y Demográficos
                    </div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="q-pa-sm q-px-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-sm-6">
                        <q-input v-model="clinicalForm.date_of_birth" type="date" label="Fecha de Nacimiento" outlined dense hide-bottom-space stack-label>
                          <template v-slot:prepend><q-icon name="cake" size="xs" color="teal-5" /></template>
                        </q-input>
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-select v-model="clinicalForm.gender" :options="['Masculino', 'Femenino', 'Otro']" label="Género" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-select v-model="clinicalForm.marital_status" :options="['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Libre']" label="Estado Civil" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input v-model="clinicalForm.occupation" label="Ocupación" outlined dense hide-bottom-space>
                          <template v-slot:prepend><q-icon name="work" size="xs" color="teal-5" /></template>
                        </q-input>
                      </div>
                      <div class="col-12 text-subtitle2 text-grey-8 q-mt-sm q-mb-none" style="line-height: 1;">Contacto de Emergencia</div>
                      <div class="col-12 col-sm-6">
                        <q-input v-model="clinicalForm.emergency_contact_name" label="Nombre" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input v-model="clinicalForm.emergency_contact_phone" label="Teléfono" outlined dense hide-bottom-space>
                          <template v-slot:prepend><q-icon name="emergency" size="xs" color="red-4" /></template>
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card bordered flat class="bg-white" style="border-radius: 12px; border-top: 3px solid #607d8b;">
                  <q-card-section class="q-pb-sm">
                    <div class="text-subtitle1 text-weight-bold text-blue-grey-7 row items-center">
                      <q-icon name="place" size="sm" class="q-mr-sm" /> Dirección y Origen
                    </div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="q-pa-sm q-px-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-md-6">
                        <q-input v-model="clinicalForm.address" label="Dirección (Calle y número)" outlined dense hide-bottom-space>
                          <template v-slot:prepend><q-icon name="place" size="xs" color="blue-grey-5" /></template>
                        </q-input>
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input v-model="clinicalForm.neighborhood" label="Colonia" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-md-4">
                        <q-input v-model="clinicalForm.zip_code" label="Código Postal" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-md-8">
                        <q-input v-model="clinicalForm.city" label="Ciudad" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-select v-model="clinicalForm.country" :options="['México', 'Estados Unidos']" label="País" outlined dense hide-bottom-space emit-value map-options @update:model-value="clinicalForm.state = ''" />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-select v-model="clinicalForm.state" :options="stateOptions" label="Estado" outlined dense hide-bottom-space emit-value map-options :disable="!clinicalForm.country" />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.place_of_birth" label="Lugar de Origen" outlined dense hide-bottom-space>
                          <template v-slot:prepend><q-icon name="public" size="xs" color="blue-grey-5" /></template>
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Columna Derecha: Datos Clínicos y Dermatología -->
              <div class="col-12 col-md-6">
                
                <q-card bordered flat class="q-mb-md bg-white" style="border-radius: 12px; border-top: 3px solid #f44336;">
                  <q-card-section class="q-pb-sm">
                    <div class="text-subtitle1 text-weight-bold text-red-7 row items-center">
                      <q-icon name="medical_information" size="sm" class="q-mr-sm" /> Historial Clínico
                    </div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="q-pa-sm q-px-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-sm-6">
                        <q-select v-model="clinicalForm.blood_type" :options="['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" label="Tipo de Sangre" outlined dense hide-bottom-space>
                          <template v-slot:prepend><q-icon name="bloodtype" size="xs" color="red-5" /></template>
                        </q-select>
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.allergies" type="textarea" label="Alergias" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.chronic_conditions" type="textarea" label="Padecimientos Crónicos" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.current_medications" type="textarea" label="Medicamentos Actuales" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.family_history" type="textarea" label="Antecedentes Familiares" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.non_pathological_history" type="textarea" label="Antecedentes Personales No Patológicos (APNP)" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12" v-if="patient.gender === 'Femenino' || patient.gender === 'Mujer' || clinicalForm.gender === 'Femenino' || clinicalForm.gender === 'Mujer'">
                        <q-input v-model="clinicalForm.gyneco_obstetric_history" type="textarea" label="Antecedentes Gineco-Obstétricos (AGO)" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.surgical_history" type="textarea" label="Historial Quirúrgico" outlined dense hide-bottom-space autogrow />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <!-- Datos Dermatológicos -->
                <q-card bordered flat class="bg-white" style="border-radius: 12px; border-top: 3px solid #3f51b5;">
                  <q-card-section class="q-pb-sm">
                    <div class="text-subtitle1 text-weight-bold text-indigo-7 row items-center">
                      <q-icon name="face" size="sm" class="q-mr-sm" /> Datos Dermatológicos
                    </div>
                  </q-card-section>
                  <q-separator inset />
                  <q-card-section class="q-pa-sm q-px-md">
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-sm-5">
                        <q-select v-model="clinicalForm.skin_type" :options="['I', 'II', 'III', 'IV', 'V', 'VI']" label="Fototipo (Fitzpatrick)" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-select v-model="clinicalForm.skin_tendency" :options="['Seca', 'Mixta', 'Grasa', 'Sensible']" label="Tendencia" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12 col-sm-3">
                        <q-select v-model="clinicalForm.sun_exposure_level" :options="['Baja', 'Moderada', 'Alta']" label="Exp. Solar" outlined dense hide-bottom-space />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.previous_skin_conditions" type="textarea" label="Condiciones de Piel Previas" outlined dense hide-bottom-space autogrow />
                      </div>
                      <div class="col-12">
                        <q-input v-model="clinicalForm.skincare_routine" type="textarea" label="Rutina Skincare Actual" outlined dense hide-bottom-space autogrow />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Footer Fijo de Acciones -->
          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup class="q-mr-sm" />
            <q-btn unelevated icon="save" label="Guardar Datos Clínicos" color="primary" type="submit" class="q-px-lg shadow-2 text-weight-bold" style="border-radius: 8px;" :loading="savingClinical" />
          </q-card-actions>

        </q-form>
      </q-card>
    </q-dialog>

    <!-- Dialogo para Agendar Próxima Cita -->
    <q-dialog v-model="showAppointmentDialog" persistent>
      <q-card style="width: 400px; border-radius: 16px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-white">Agendar Próxima Cita</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input v-model="appointmentForm.appointment_date" type="date" label="Fecha" outlined dense class="q-mb-md" autofocus />
          <q-input v-model="appointmentForm.start_time" type="time" label="Hora" outlined dense class="q-mb-md" />
          <q-select v-model="appointmentForm.type" :options="[{label: 'Clínico', value: 'clinico'}, {label: 'Estético', value: 'estetico'}]" emit-value map-options label="Tipo de Cita" outlined dense class="q-mb-md" />
          <q-input v-model="appointmentForm.notes" type="textarea" label="Notas (opcional)" outlined dense autogrow rows="2" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md text-primary">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn flat label="Agendar" icon="event" @click="saveAppointment" :loading="savingAppointment" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'
import { parseISO, format } from 'date-fns'
import { es } from 'date-fns/locale'
import ConsultationDialog from '../components/ConsultationDialog.vue'
import PatientDocumentsTab from '../components/PatientDocumentsTab.vue'

const getAvatarUrl = (gender) => {
  const f = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f48fb1'/><path d='M22 100 Q 22 70 50 70 Q 78 70 78 100' fill='%23d81b60'/><rect x='42' y='50' width='16' height='25' fill='%23ffcc80'/><ellipse cx='50' cy='42' rx='17' ry='23' fill='%23ffcc80'/><path d='M 50 8 C 20 8, 20 45, 20 70 C 20 95, 35 95, 35 70 C 35 45, 45 35, 50 30 C 55 35, 65 45, 65 70 C 65 95, 80 95, 80 70 C 80 45, 80 8, 50 8 Z' fill='%232c3e50'/></svg>";
  const m = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%234fc3f7'/><path d='M18 100 Q 18 65 50 65 Q 82 65 82 100' fill='%2334495e'/><rect x='40' y='50' width='20' height='20' fill='%23ffcc80'/><ellipse cx='50' cy='40' rx='19' ry='24' fill='%23ffcc80'/><path d='M28 40 Q 28 10 50 10 Q 72 10 72 40 Q 72 50 65 45 Q 50 25 35 45 Q 28 50 28 40 Z' fill='%232c3e50'/></svg>";
  const n = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e0e0e0'/><path d='M20 100 Q 20 65 50 65 Q 80 65 80 100' fill='%239e9e9e'/><rect x='40' y='50' width='20' height='20' fill='%23f5f5f5'/><ellipse cx='50' cy='40' rx='20' ry='25' fill='%23f5f5f5'/></svg>";
  if (gender === 'Femenino' || gender === 'Mujer') return f;
  if (gender === 'Masculino' || gender === 'Hombre') return m;
  return n;
}

const $q = useQuasar()
const route = useRoute()
const patientId = route.params.id

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

const formatFullAddress = (p) => {
  if (!p) return 'No especificada'
  const parts = [
    p.address,
    p.neighborhood ? `Col. ${p.neighborhood}` : null,
    p.city,
    p.state,
    p.country,
    p.zip_code ? `C.P. ${p.zip_code}` : null
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'No especificada'
}

const formatPhoneNumber = (phoneStr) => {
  if (!phoneStr) return ''
  const cleaned = ('' + phoneStr).replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) return `(${match[1]}) ${match[2]}-${match[3]}`
  return phoneStr
}

const patient = ref(null)
const loading = ref(true)
const activeTab = ref('consultas')

const consultationSearch = ref('')
const consultationDateRange = ref(null)

const dateRangeText = computed(() => {
  if (!consultationDateRange.value) return ''
  if (typeof consultationDateRange.value === 'string') return consultationDateRange.value
  if (consultationDateRange.value.from && consultationDateRange.value.to) {
    return `${consultationDateRange.value.from} al ${consultationDateRange.value.to}`
  }
  return ''
})

const filteredConsultations = computed(() => {
  if (!patient.value || !patient.value.consultations) return []

  let filtered = patient.value.consultations

  if (consultationSearch.value) {
    const term = consultationSearch.value.toLowerCase()
    filtered = filtered.filter(c =>
      (c.diagnosis && c.diagnosis.toLowerCase().includes(term)) ||
      (c.reason && c.reason.toLowerCase().includes(term))
    )
  }

  if (consultationDateRange.value) {
    filtered = filtered.filter(c => {
      const cDate = c.created_at ? format(parseISO(c.created_at), 'yyyy-MM-dd') : ''
      if (typeof consultationDateRange.value === 'string') {
        return cDate === consultationDateRange.value
      } else {
        return cDate >= consultationDateRange.value.from && cDate <= consultationDateRange.value.to
      }
    })
  }

  // Ordenar por fecha descendente (más recientes primero)
  filtered = filtered.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return filtered
})

const showConsultationDialog = ref(false)
const viewConsultationDialog = ref(false)
const selectedConsultation = ref(null)
const consultationToEdit = ref(null)

const showAppointmentDialog = ref(false)
const savingAppointment = ref(false)
const appointmentForm = ref({
  appointment_date: '',
  start_time: '',
  type: 'clinico',
  notes: ''
})

const editClinicalData = ref(false)
const savingClinical = ref(false)
const clinicalForm = ref({
  blood_type: '',
  skin_type: '',
  allergies: '',
  family_history: '',
  chronic_conditions: '',
  gender: '',
  date_of_birth: '',
  address: '',
  neighborhood: '',
  zip_code: '',
  city: '',
  state: '',
  country: 'México',
  place_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  marital_status: '',
  occupation: '',
  current_medications: '',
  surgical_history: '',
  skin_tendency: '',
  sun_exposure_level: '',
  previous_skin_conditions: '',
  skincare_routine: '',
  non_pathological_history: '',
  gyneco_obstetric_history: ''
})

const stateOptions = computed(() => {
  if (clinicalForm.value.country === 'México') return mexicoStates
  if (clinicalForm.value.country === 'Estados Unidos') return usStates
  return []
})

const fetchPatient = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/patients/${patientId}`)
    patient.value = data
    clinicalForm.value = {
      blood_type: data.blood_type || '',
      skin_type: data.skin_type || '',
      allergies: data.allergies || '',
      family_history: data.family_history || '',
      chronic_conditions: data.chronic_conditions || '',
      gender: data.gender || '',
      date_of_birth: data.date_of_birth || '',
      address: data.address || '',
      neighborhood: data.neighborhood || '',
      zip_code: data.zip_code || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || 'México',
      place_of_birth: data.place_of_birth || '',
      emergency_contact_name: data.emergency_contact_name || '',
      emergency_contact_phone: data.emergency_contact_phone || '',
      marital_status: data.marital_status || '',
      occupation: data.occupation || '',
      current_medications: data.current_medications || '',
      surgical_history: data.surgical_history || '',
      skin_tendency: data.skin_tendency || '',
      sun_exposure_level: data.sun_exposure_level || '',
      previous_skin_conditions: data.previous_skin_conditions || '',
      skincare_routine: data.skincare_routine || '',
      non_pathological_history: data.non_pathological_history || '',
      gyneco_obstetric_history: data.gyneco_obstetric_history || ''
    }
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al cargar expediente' })
  } finally {
    loading.value = false
  }
}

const saveClinicalData = async () => {
  savingClinical.value = true
  try {
    await api.put(`/patients/${patientId}`, clinicalForm.value)
    $q.notify({ color: 'positive', message: 'Datos actualizados' })
    editClinicalData.value = false
    fetchPatient()
  } catch (error) {
    if (error.response && error.response.status === 422 && error.response.data.errors) {
      const errors = error.response.data.errors
      let errorMsg = '<strong>Revisa los siguientes campos:</strong><br><ul style="margin:0; padding-left:20px;">'
      Object.values(errors).forEach(errArray => {
        errorMsg += `<li>${errArray[0]}</li>`
      })
      errorMsg += '</ul>'
      $q.notify({ color: 'negative', message: errorMsg, html: true, position: 'top', icon: 'warning', timeout: 5000 })
    } else {
      $q.notify({ color: 'negative', message: 'Error al guardar datos', position: 'top' })
    }
  } finally {
    savingClinical.value = false
  }
}

const formatDate = (dateStr) => {
  if(!dateStr) return ''
  return format(parseISO(dateStr), "d 'de' MMMM, yyyy - HH:mm", { locale: es })
}

const viewPrescription = async (id) => {
  try {
    const response = await api.get(`/prescriptions/${id}/pdf`, {
      responseType: 'blob'
    })

    // Create a Blob URL and open it in a new tab
    const file = new Blob([response.data], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(file)
    window.open(fileURL, '_blank')
  } catch (error) {
    console.error('Error fetching PDF:', error)
    $q.notify({ color: 'negative', message: 'No se pudo generar o descargar la receta' })
  }
}

const viewConsultationPdf = async (id) => {
  try {
    const response = await api.get(`/consultations/${id}/pdf`, {
      responseType: 'blob'
    })

    const file = new Blob([response.data], { type: 'application/pdf' })
    const fileURL = URL.createObjectURL(file)
    window.open(fileURL, '_blank')
  } catch (error) {
    console.error('Error fetching PDF:', error)
    $q.notify({ color: 'negative', message: 'No se pudo generar el resumen clínico' })
  }
}

const openConsultation = (consultation) => {
  selectedConsultation.value = consultation
  viewConsultationDialog.value = true
}

const startNewConsultation = () => {
  consultationToEdit.value = null
  showConsultationDialog.value = true
}

const editConsultation = (consultation) => {
  consultationToEdit.value = consultation
  showConsultationDialog.value = true
}

const confirmFinish = (consultation) => {
  $q.dialog({
    title: 'Terminar Consulta',
    message: '¿Estás seguro de que deseas terminar esta consulta? Ya no podrá ser editada y se sellará permanentemente.',
    cancel: true,
    persistent: true,
    ok: { color: 'positive', label: 'Sí, Terminar' }
  }).onOk(async () => {
    try {
      await api.patch(`/consultations/${consultation.id}/finish`)
      $q.notify({ color: 'positive', message: 'Consulta finalizada exitosamente.' })
      await fetchPatient()

      // Prompt for new appointment
      $q.dialog({
        title: 'Próxima Cita',
        message: '¿Deseas agendar la próxima cita para este paciente?',
        cancel: true,
        persistent: true,
        ok: { color: 'primary', label: 'Sí, Agendar' }
      }).onOk(() => {
        // Init form with tomorrow's date
        const tmr = new Date()
        tmr.setDate(tmr.getDate() + 1)
        appointmentForm.value.appointment_date = tmr.toISOString().split('T')[0]
        appointmentForm.value.start_time = '10:00'
        appointmentForm.value.notes = ''
        showAppointmentDialog.value = true
      })
    } catch (error) {
      console.error(error)
      $q.notify({ color: 'negative', message: 'Error al finalizar la consulta' })
    }
  })
}

const saveAppointment = async () => {
  savingAppointment.value = true
  try {
    await api.post('/appointments/admin', {
      patient_id: patientId,
      ...appointmentForm.value
    })
    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Próxima cita agendada exitosamente' })
    showAppointmentDialog.value = false
    await fetchPatient() // maybe appointments show up here in future, or just to refresh
  } catch (error) {
    console.error(error)
    if (error.response && error.response.status === 422) {
      $q.notify({ color: 'negative', message: error.response.data.message || 'Error de validación' })
    } else {
      $q.notify({ color: 'negative', message: 'Hubo un error al agendar la cita' })
    }
  } finally {
    savingAppointment.value = false
  }
}

onMounted(() => {
  fetchPatient()
})
</script>

<style scoped>
.profile-card {
  border-radius: 16px;
  overflow: visible;
}
.border-bottom-primary {
  border-bottom: 4px solid var(--q-primary);
}
.timeline-card {
  border-radius: 16px;
  background-color: #FFFFFF;
  min-height: 500px;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
