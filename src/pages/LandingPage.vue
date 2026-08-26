<template>
  <q-page :class="['landing-page', { 'bg-dark text-white': $q.dark.isActive, 'bg-grey-1': !$q.dark.isActive }]">

    <!-- 1. Hero Section -->
    <section class="hero-section flex flex-center relative-position overflow-hidden" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <!-- Subtle Gradient Background -->
      <div class="absolute-full hero-gradient" :class="{'hero-gradient-dark': $q.dark.isActive}"></div>

      <!-- Background blobs for dynamic feel -->
      <div class="hero-blob hero-blob-1" :class="$q.dark.isActive ? 'bg-primary opacity-10' : 'bg-primary opacity-20'"></div>
      <div class="hero-blob hero-blob-2" :class="$q.dark.isActive ? 'bg-secondary opacity-10' : 'bg-accent opacity-10'"></div>
      <div class="hero-blob hero-blob-3" :class="$q.dark.isActive ? 'bg-accent opacity-10' : 'bg-secondary opacity-20'"></div>

      <div class="row full-width max-width-container q-px-md items-center relative-position" style="z-index: 2; padding-top: 60px; padding-bottom: 60px;">
        <!-- Text Content -->
        <div class="col-12 col-md-6 q-pr-md-xl q-pb-xl q-pt-md">
          <div class="q-mb-lg">
            <q-badge color="secondary" class="q-px-md q-py-sm text-caption text-weight-bold shadow-2 border-radius-8" style="background: rgba(0, 150, 136, 0.1) !important; color: var(--q-secondary) !important;">
              <q-icon name="stars" class="q-mr-sm" size="16px" /> DERMATOLOGÍA ESPECIALIZADA
            </q-badge>
          </div>

          <h1 class="text-h2 text-weight-bolder q-mb-md hero-title" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
            Salud y estética <br />
            <span class="text-primary">para tu piel.</span>
          </h1>
          <p class="text-h6 q-mb-xl text-weight-regular hero-subtitle" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
            Atención médica de prestigio con tecnología avanzada. Descubre la mejor versión de tu piel con tratamientos seguros y personalizados.
          </p>

          <div class="row q-gutter-md items-center">
            <q-btn
              color="primary"
              label="Agendar una cita"
              class="q-px-xl q-py-md text-subtitle1 shadow-6 hero-btn border-radius-12"
              unelevated
              no-caps
              icon-right="arrow_forward"
              @click="scrollTo('seccion-agendar')"
            />
            <q-btn
              outline
              color="secondary"
              label="Conoce nuestros servicios"
              class="q-px-lg q-py-md text-subtitle1 hero-btn-outline border-radius-12"
              no-caps
              @click="scrollTo('seccion-servicios')"
            />
          </div>

          <div class="row items-center q-mt-xl q-gutter-x-lg text-body2 text-weight-medium" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
            <div class="row items-center"><q-icon name="check_circle" color="positive" class="q-mr-sm" size="20px"/> Dermatólogo Certificado</div>
            <div class="row items-center"><q-icon name="check_circle" color="positive" class="q-mr-sm" size="20px"/> Atención Personalizada</div>
          </div>
        </div>

        <!-- Graphic Content -->
        <div class="col-12 col-md-6 flex justify-center hero-image-container relative-position">
          <div class="image-wrapper shadow-15">
            <q-img src="/derma_clinica.jpg" class="hero-img border-radius-24" fit="cover" />
          </div>

          <!-- Floating Glass Card -->
          <q-card class="floating-glass-card absolute shadow-8" :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-white'">
            <q-card-section class="row items-center q-pa-md no-wrap">
              <q-avatar size="48px" color="primary" text-color="white" icon="verified" class="q-mr-md shadow-2" />
              <div>
                <div class="text-weight-bold text-subtitle2">Certificación</div>
                <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Consejo Mexicano de Dermatología</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- 2. Trust Bar -->
    <section class="trust-bar-section border-bottom" :class="$q.dark.isActive ? 'bg-dark border-bottom-dark' : 'bg-white'">
      <div class="max-width-container q-px-md q-py-lg">
        <div class="row justify-around items-center q-col-gutter-y-md text-center">
          <div class="col-6 col-md-3 column items-center">
            <q-icon name="verified_user" size="32px" color="primary" class="q-mb-sm" />
            <div class="text-weight-bold text-subtitle2">Dermatólogo Certificado</div>
          </div>
          <div class="col-6 col-md-3 column items-center">
            <q-icon name="health_and_safety" size="32px" color="secondary" class="q-mb-sm" />
            <div class="text-weight-bold text-subtitle2">Tecnología Avanzada</div>
          </div>
          <div class="col-6 col-md-3 column items-center">
            <q-icon name="support_agent" size="32px" color="accent" class="q-mb-sm" />
            <div class="text-weight-bold text-subtitle2">Atención Personalizada</div>
          </div>
          <div class="col-6 col-md-3 column items-center">
            <q-icon name="event_available" size="32px" color="positive" class="q-mb-sm" />
            <div class="text-weight-bold text-subtitle2">Agenda Fácil y Rápida</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Servicios Section -->
    <section id="seccion-servicios" class="q-py-xl" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
      <div class="max-width-container q-px-md q-py-xl">
        <div class="text-center q-mb-xl">
          <q-badge color="secondary" class="q-px-md q-py-sm text-caption text-weight-bold q-mb-md border-radius-8" style="background: rgba(0, 150, 136, 0.1) !important; color: var(--q-secondary) !important;">
            NUESTROS SERVICIOS
          </q-badge>
          <h2 class="text-h3 text-weight-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Áreas de Especialidad</h2>
          <p class="text-subtitle1 q-mx-auto" style="max-width: 600px;" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Soluciones integrales para la salud y belleza de tu piel, cabello y uñas.</p>
        </div>

        <div class="row q-col-gutter-xl justify-center">
          <!-- Servicio 1 -->
          <div class="col-12 col-md-4">
            <q-card class="service-card h-full column border-radius-16 shadow-2" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
              <q-img src="/derma_clinica.jpg" height="200px" class="service-img" />
              <q-card-section class="q-pa-lg flex-grow-1 column">
                <q-icon name="coronavirus" size="32px" color="primary" class="q-mb-md" />
                <div class="text-h5 text-weight-bold q-mb-sm">Dermatología Clínica</div>
                <p class="text-body1 flex-grow-1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
                  Diagnóstico y tratamiento preciso de enfermedades de la piel, acné, rosácea, alopecia y afecciones ungueales.
                </p>
                <q-btn flat no-caps color="primary" label="Agendar Cita" class="q-mt-md q-px-none self-start font-weight-bold" icon-right="arrow_forward" @click="scrollTo('seccion-agendar')" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Servicio 2 -->
          <div class="col-12 col-md-4">
            <q-card class="service-card h-full column border-radius-16 shadow-2" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
              <q-img src="/derma_estetica.jpg" height="200px" class="service-img" />
              <q-card-section class="q-pa-lg flex-grow-1 column">
                <q-icon name="face_retouching_natural" size="32px" color="accent" class="q-mb-md" />
                <div class="text-h5 text-weight-bold q-mb-sm">Medicina Estética</div>
                <p class="text-body1 flex-grow-1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
                  Procedimientos mínimamente invasivos, rejuvenecimiento facial, toxina botulínica, rellenos y cuidado preventivo anti-edad.
                </p>
                <q-btn flat no-caps color="accent" label="Agendar Cita" class="q-mt-md q-px-none self-start font-weight-bold" icon-right="arrow_forward" @click="scrollTo('seccion-agendar')" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Servicio 3 -->
          <div class="col-12 col-md-4">
            <q-card class="service-card h-full column border-radius-16 shadow-2" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
              <q-img src="/derma_prevencion.jpg" height="200px" class="service-img" />
              <q-card-section class="q-pa-lg flex-grow-1 column">
                <q-icon name="search" size="32px" color="secondary" class="q-mb-md" />
                <div class="text-h5 text-weight-bold q-mb-sm">Prevención y Cáncer</div>
                <p class="text-body1 flex-grow-1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
                  Evaluación de lunares, mapeo corporal y detección temprana de cáncer de piel. La prevención salva vidas.
                </p>
                <q-btn flat no-caps color="secondary" label="Agendar Cita" class="q-mt-md q-px-none self-start font-weight-bold" icon-right="arrow_forward" @click="scrollTo('seccion-agendar')" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Conoce al Dermatólogo -->
    <section id="seccion-doctor" class="q-py-xl" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <div class="max-width-container q-px-md q-py-xl">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-5 flex justify-center">
            <div class="doctor-image-wrapper border-radius-24 overflow-hidden shadow-6" style="width: 100%; aspect-ratio: 1/1; max-width: 400px; display: flex; align-items: center; justify-content: center;">
              <q-img src="/doctor_avatar.jpg" class="full-height full-width" fit="cover" />
            </div>
          </div>
          <div class="col-12 col-md-7">
            <q-badge color="primary" class="q-px-md q-py-sm text-caption text-weight-bold q-mb-lg border-radius-8" style="background: rgba(0, 150, 136, 0.1) !important; color: var(--q-primary) !important;">
              TU ESPECIALISTA
            </q-badge>
            <h2 class="text-h3 text-weight-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Dr. Salvador Sobrevilla Ondarza</h2>
            <div class="text-subtitle1 text-primary text-weight-medium q-mb-lg">Dermatólogo Certificado</div>

            <p class="text-body1 q-mb-md" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" style="line-height: 1.8;">
              Con una sólida formación médica y años de experiencia clínica, el Dr. Sobrevilla se especializa en ofrecer diagnósticos precisos y tratamientos de vanguardia para todo tipo de afecciones dermatológicas.
            </p>
            <p class="text-body1 q-mb-xl" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" style="line-height: 1.8;">
              Su enfoque integral combina el rigor científico de la dermatología médica con los más altos estándares de la medicina estética, asegurando que cada paciente reciba una atención verdaderamente personalizada y resultados naturales.
            </p>

            <div class="row q-gutter-sm">
              <q-btn unelevated color="primary" label="Agendar Consulta" class="q-px-lg q-py-md border-radius-12 text-weight-bold" no-caps icon-right="event" @click="scrollTo('seccion-agendar')" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Beneficios / Por qué elegirnos -->
    <section id="seccion-beneficios" class="q-py-xl text-center" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-primary'">
      <div class="max-width-container q-px-md q-py-xl">
        <h2 class="text-h3 text-weight-bold q-mb-xl text-white">¿Por qué elegir nuestra clínica?</h2>
        <div class="row q-col-gutter-xl justify-center">
          <div class="col-12 col-sm-4">
            <div class="benefit-icon-wrapper bg-white text-primary shadow-4 q-mx-auto q-mb-lg">
              <q-icon name="diversity_1" size="40px" />
            </div>
            <div class="text-h6 text-weight-bold text-white q-mb-sm">Enfoque Humano</div>
            <p class="text-white opacity-80 text-body1">Atención cálida, empática y verdaderamente centrada en escuchar tus necesidades.</p>
          </div>
          <div class="col-12 col-sm-4">
            <div class="benefit-icon-wrapper bg-white text-secondary shadow-4 q-mx-auto q-mb-lg">
              <q-icon name="biotech" size="40px" />
            </div>
            <div class="text-h6 text-weight-bold text-white q-mb-sm">Ciencia y Vanguardia</div>
            <p class="text-white opacity-80 text-body1">Tratamientos basados en evidencia científica y tecnología médica de última generación.</p>
          </div>
          <div class="col-12 col-sm-4">
            <div class="benefit-icon-wrapper bg-white text-accent shadow-4 q-mx-auto q-mb-lg">
              <q-icon name="update" size="40px" />
            </div>
            <div class="text-h6 text-weight-bold text-white q-mb-sm">Seguimiento Continuo</div>
            <p class="text-white opacity-80 text-body1">Acompañamiento constante en cada etapa de tu tratamiento hasta lograr los resultados.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Agent Chat Banner -->
    <section class="q-py-lg" :class="$q.dark.isActive ? 'bg-dark border-bottom-dark' : 'bg-grey-1'">
      <div class="max-width-container q-px-md">
        <q-card class="bg-secondary text-white border-radius-24 shadow-4 overflow-hidden relative-position">
          <div class="absolute-right opacity-10" style="top: -50px; right: -50px;">
            <q-icon name="forum" size="200px" />
          </div>
          <q-card-section class="q-pa-xl row items-center justify-between q-col-gutter-lg relative-position">
            <div class="col-12 col-md-8">
              <h3 class="text-h4 text-weight-bold q-mb-sm q-mt-none">¿No sabes qué consulta necesitas?</h3>
              <p class="text-h6 text-weight-regular q-mb-none opacity-90">Pregúntale a nuestro asistente virtual inteligente. Puede orientarte sobre tratamientos, preparación y disponibilidad al instante.</p>
            </div>
            <div class="col-12 col-md-4 flex justify-md-end justify-start">
              <q-btn unelevated color="white" text-color="secondary" label="Hablar con el Asistente" icon="support_agent" class="q-px-xl q-py-md text-weight-bold border-radius-12 shadow-2" no-caps @click="openAiChat" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- 7. Agenda Section -->
    <section id="seccion-agendar" class="agenda-section q-py-xl flex flex-center relative-position overflow-hidden" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
      <div class="max-width-container full-width q-px-md q-py-xl relative-position" style="z-index: 1;">

        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Agenda tu Cita</h2>
          <p class="text-subtitle1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Reserva tu espacio en un par de clics.</p>
        </div>

        <q-card class="agenda-card shadow-10 q-mx-auto border-radius-24" :class="$q.dark.isActive ? 'bg-dark text-white border-dark' : 'bg-white'">
          <q-card-section class="q-pa-lg q-pa-md-xl">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
              flat
              class="bg-transparent custom-stepper"
              :dark="$q.dark.isActive"
            >
              <!-- Paso 1: Selección de Fecha y Hora -->
              <q-step
                :name="1"
                title="Elige tu horario"
                icon="calendar_month"
                :done="step > 1"
              >
                <div class="row q-col-gutter-xl q-mt-md">
                  <div class="col-12 col-md-6 flex justify-center">
                    <q-date
                      v-model="booking.date"
                      mask="YYYY-MM-DD"
                      color="primary"
                      :options="dateOptions"
                      @update:model-value="fetchAvailability"
                      flat
                      class="custom-date shadow-1 border-radius-16"
                      :dark="$q.dark.isActive"
                    />
                  </div>

                  <div class="col-12 col-md-6">
                    <div class="text-h6 text-weight-bold q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Horarios Disponibles</div>

                    <transition mode="out-in" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                      <div v-if="loadingSlots" class="flex flex-center q-pa-xl" key="loading">
                        <q-spinner-puff color="primary" size="3em" />
                      </div>

                      <div v-else-if="!booking.date" class="text-grey-5 text-center q-pa-lg border-dashed border-radius-16" key="empty">
                        <q-icon name="event" size="48px" class="q-mb-md opacity-70" />
                        <div class="text-body1 text-weight-medium">Selecciona una fecha en el calendario.</div>
                      </div>

                      <div v-else-if="availableSlots.length === 0" class="text-negative text-center q-pa-lg border-dashed border-radius-16" key="no-slots">
                        <q-icon name="event_busy" size="48px" class="q-mb-md opacity-70" />
                        <div class="text-body1 text-weight-medium">Día sin disponibilidad. Por favor elige otra fecha.</div>
                      </div>

                      <div v-else class="row q-col-gutter-sm" key="slots">
                        <div class="col-4 col-sm-3 col-md-4" v-for="slot in availableSlots" :key="slot">
                          <q-btn
                            :color="booking.time === slot ? 'primary' : ($q.dark.isActive ? 'grey-8' : 'grey-2')"
                            :text-color="booking.time === slot ? 'white' : ($q.dark.isActive ? 'white' : 'dark')"
                            :label="slot"
                            class="full-width time-slot-btn shadow-0"
                            :class="{'slot-selected shadow-3': booking.time === slot}"
                            unelevated
                            @click="booking.time = slot"
                          />
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="row justify-end q-mt-xl">
                  <q-btn
                    @click="goToStep2"
                    color="primary"
                    label="Continuar"
                    icon-right="arrow_forward"
                    :disable="!booking.date || !booking.time"
                    class="q-px-xl q-py-md border-radius-12 shadow-3 text-weight-bold"
                    unelevated
                    no-caps
                  />
                </div>
              </q-step>

              <!-- Paso 2: Datos del Paciente -->
              <q-step
                :name="2"
                title="Completa tus datos"
                icon="person"
                :done="step > 2"
              >
                <transition appear enter-active-class="animated slideInRight">
                  <q-form @submit="requestOtp" class="q-mt-md">

                    <div class="text-subtitle1 text-weight-bold q-mb-md text-primary">1. Datos Personales</div>
                    <div class="row q-col-gutter-md q-mb-xl">
                      <div class="col-12 col-md-6">
                        <q-input
                          ref="nameInput"
                          outlined
                          v-model="booking.first_name"
                          label="Nombre(s) *"
                          lazy-rules
                          :rules="[val => val && val.length > 0 || 'Requerido']"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          outlined
                          v-model="booking.last_name"
                          label="Apellidos *"
                          lazy-rules
                          :rules="[val => val && val.length > 0 || 'Requerido']"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                    </div>

                    <div class="text-subtitle1 text-weight-bold q-mb-md text-primary">2. Información de Contacto</div>
                    <div class="row q-col-gutter-md q-mb-xl">
                      <div class="col-12 col-md-6">
                        <div class="row no-wrap">
                          <q-select
                            v-model="booking.country_code"
                            :options="[{label:'🇲🇽 +52', value:'+52'}, {label:'🇺🇸 +1', value:'+1'}]"
                            outlined
                            emit-value
                            map-options
                            style="width: 110px"
                            class="q-mr-sm"
                            :dark="$q.dark.isActive"
                            @update:model-value="focusPhone"
                          />
                          <q-input
                            class="col"
                            ref="phoneInput"
                            v-model="booking.phone"
                            label="WhatsApp *"
                            type="tel"
                            outlined
                            mask="(###) ###-####"
                            unmasked-value
                            lazy-rules
                            :rules="[val => val && val.length >= 10 || '10 dígitos mínimo']"
                            :dark="$q.dark.isActive"
                          >
                            <template v-slot:prepend><q-icon name="whatsapp" color="positive" /></template>
                          </q-input>
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <q-input
                          outlined
                          v-model="booking.email"
                          label="Correo Electrónico (Opcional)"
                          type="email"
                          :dark="$q.dark.isActive"
                        >
                          <template v-slot:prepend><q-icon name="email" color="grey" /></template>
                        </q-input>
                      </div>
                    </div>

                    <div class="text-subtitle1 text-weight-bold q-mb-md text-primary">3. Detalles de la Consulta</div>
                    <div class="row q-col-gutter-md q-mb-lg">
                      <div class="col-12">
                        <q-btn-toggle
                          v-model="booking.type"
                          spread
                          no-caps
                          rounded
                          unelevated
                          toggle-color="primary"
                          :color="$q.dark.isActive ? 'grey-9' : 'grey-2'"
                          :text-color="$q.dark.isActive ? 'white' : 'dark'"
                          :options="typeOptions"
                          class="shadow-1"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          outlined
                          v-model="booking.notes"
                          type="textarea"
                          label="Notas o detalles adicionales (Opcional)"
                          rows="3"
                          :dark="$q.dark.isActive"
                        />
                      </div>
                    </div>

                    <div class="row justify-between items-center q-mt-xl">
                      <q-btn flat @click="step = 1" color="grey-7" label="Volver al calendario" icon="arrow_back" no-caps />
                      <q-btn
                        type="submit"
                        color="primary"
                        label="Agendar Cita"
                        icon-right="check_circle"
                        :loading="submitting"
                        class="q-px-xl q-py-md border-radius-12 shadow-4 text-weight-bold"
                        unelevated
                        no-caps
                      />
                    </div>
                  </q-form>
                </transition>
              </q-step>
            </q-stepper>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- 8. Footer -->
    <footer class="bg-dark text-white q-py-xl border-top-dark">
      <div class="max-width-container q-px-md">
        <div class="row q-col-gutter-xl q-mb-xl">
          <div class="col-12 col-md-4">
            <div class="text-h6 text-weight-bold q-mb-md row items-center text-white">
              <q-icon name="spa" color="primary" size="24px" class="q-mr-sm" /> Clínica Dermatológica
            </div>
            <p class="text-grey-5 text-body2" style="line-height: 1.6;">
              Dr. Salvador Sobrevilla Ondarza.<br>
              Especialistas en el cuidado médico y estético de tu piel, brindando atención integral y personalizada.
            </p>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Enlaces Rápidos</div>
            <div class="column q-gutter-y-sm">
              <a class="cursor-pointer text-grey-5 hover-text-white transition" @click="scrollTo('seccion-servicios')">Servicios</a>
              <a class="cursor-pointer text-grey-5 hover-text-white transition" @click="scrollTo('seccion-doctor')">El Dermatólogo</a>
              <a class="cursor-pointer text-grey-5 hover-text-white transition" @click="scrollTo('seccion-beneficios')">Beneficios</a>
              <a class="cursor-pointer text-grey-5 hover-text-white transition" @click="openAiChat">Asistente Virtual</a>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Agenda</div>
            <p class="text-grey-5 text-body2 q-mb-md">Reserva tu consulta de manera rápida y segura a través de nuestra plataforma online.</p>
            <q-btn unelevated outline color="primary" label="Agendar Cita" no-caps @click="scrollTo('seccion-agendar')" />
          </div>
        </div>
        <q-separator dark class="q-mb-md opacity-20" />
        <div class="row justify-between items-center text-caption text-grey-6">
          <div>© 2026 Dr. Salvador Sobrevilla Ondarza. Todos los derechos reservados.</div>
          <div>Aviso de Privacidad</div>
        </div>
      </div>
    </footer>

    <!-- Diálogo de OTP -->
    <q-dialog v-model="showOtpDialog" persistent>
      <q-card style="min-width: 350px; max-width: 400px;" class="q-pa-none border-radius-16 overflow-hidden" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white'">
        <q-card-section class="bg-primary text-center q-py-lg">
          <q-avatar size="72px" color="white" text-color="primary" icon="mark_chat_read" class="q-mb-md shadow-3" />
          <div class="text-h5 text-weight-bold text-white">Verificación Segura</div>
          <div class="text-body2 text-white q-mt-sm opacity-90">
            Hemos enviado un código a tu WhatsApp
          </div>
          <div class="text-subtitle1 text-weight-bold text-white q-mt-xs">
            {{ booking.country_code }} {{ booking.phone }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-xl q-pb-md q-px-lg">
          <div class="text-center text-body2 q-mb-lg" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">
            Ingresa el código de 6 dígitos para confirmar tu cita. Esto nos asegura que podamos contactarte.
          </div>
          <q-input
            outlined
            v-model="otpCode"
            label="Código de 6 dígitos"
            mask="######"
            unmasked-value
            autofocus
            class="text-h5 text-center custom-otp-input"
            @keyup.enter="verifyOtpAndBook"
            :dark="$q.dark.isActive"
          />
        </q-card-section>

        <q-card-actions align="center" class="q-px-lg q-pb-lg q-pt-none column">
          <q-btn unelevated color="primary" label="Confirmar Cita" @click="verifyOtpAndBook" :loading="verifyingOtp" class="full-width q-py-md text-weight-bold border-radius-12 shadow-2 q-mb-sm" no-caps />
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup no-caps class="full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const $q = useQuasar()
const step = ref(1)

const nameInput = ref(null)
const phoneInput = ref(null)

const focusPhone = () => {
  nextTick(() => {
    if (phoneInput.value) {
      phoneInput.value.focus()
    }
  })
}

const goToStep2 = () => {
  step.value = 2
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
    }
  })
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

const openAiChat = () => {
  window.dispatchEvent(new Event('open-ai-chat'))
}

const typeOptions = [
  { label: 'Clínica', value: 'clinico' },
  { label: 'Estética', value: 'estetico' }
]

const booking = reactive({
  date: '',
  time: '',
  first_name: '',
  last_name: '',
  country_code: '+52',
  phone: '',
  email: '',
  type: 'clinico',
  notes: ''
})

const availableSlots = ref([])
const loadingSlots = ref(false)
const submitting = ref(false)

const showOtpDialog = ref(false)
const otpCode = ref('')
const verifyingOtp = ref(false)

const dateOptions = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date < today) return false
  return date.getDay() !== 0
}

const fetchAvailability = async (date) => {
  if (!date) return

  loadingSlots.value = true
  booking.time = ''

  try {
    const response = await api.get('/availability', {
      params: { date }
    })
    availableSlots.value = response.data.available_slots
  } catch (error) {
    console.error('Error:', error)
    $q.notify({
      color: 'negative',
      message: 'No se pudieron cargar los horarios.',
      icon: 'error'
    })
    availableSlots.value = ['09:00', '09:30', '10:30', '11:00', '16:00', '16:30']
  } finally {
    loadingSlots.value = false
  }
}

const requestOtp = async () => {
  submitting.value = true
  try {
    const fullPhone = booking.country_code + booking.phone;
    const response = await api.post('/otp/send', { phone: fullPhone })

    $q.notify({ color: 'positive', message: 'Código enviado por WhatsApp' })
    otpCode.value = ''
    showOtpDialog.value = true
  } catch (error) {
    const msg = error.response?.data?.error || 'Error al enviar OTP'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    submitting.value = false
  }
}

const verifyOtpAndBook = async () => {
  if (otpCode.value.length < 6) {
    $q.notify({ color: 'warning', message: 'Ingresa el código de 6 dígitos' })
    return
  }

  verifyingOtp.value = true
  try {
    const fullPhone = booking.country_code + booking.phone;
    const payload = {
      first_name: booking.first_name,
      last_name: booking.last_name,
      phone: fullPhone,
      email: booking.email,
      type: booking.type,
      appointment_date: booking.date,
      start_time: booking.time,
      notes: booking.notes,
      otp_code: otpCode.value
    }

    await api.post('/appointments', payload)

    $q.notify({
      color: 'positive',
      message: '¡Cita agendada exitosamente!',
      icon: 'check_circle',
      timeout: 4000
    })

    showOtpDialog.value = false
    Object.keys(booking).forEach(key => booking[key] = '')
    booking.type = 'clinico'
    booking.country_code = '+52'
    step.value = 1

  } catch (error) {
    console.error('Error verificando cita:', error)
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || error.response?.data?.error || 'Código OTP inválido o expirado.',
      icon: 'error'
    })
  } finally {
    verifyingOtp.value = false
  }
}
</script>

<style lang="scss" scoped>

.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Utilities */
.h-full { height: 100%; }
.border-radius-8 { border-radius: 8px !important; }
.border-radius-12 { border-radius: 12px !important; }
.border-radius-16 { border-radius: 16px !important; }
.border-radius-24 { border-radius: 24px !important; }
.opacity-10 { opacity: 0.1; }
.opacity-20 { opacity: 0.2; }
.opacity-70 { opacity: 0.7; }
.opacity-80 { opacity: 0.8; }
.opacity-90 { opacity: 0.9; }
.border-bottom { border-bottom: 1px solid rgba(0,0,0,0.05); }
.border-bottom-dark { border-bottom: 1px solid rgba(255,255,255,0.05); }
.border-top-dark { border-top: 1px solid rgba(255,255,255,0.05); }
.transition { transition: all 0.3s ease; }
.hover-text-white:hover { color: #fff !important; }

/* Hero Section */
.hero-gradient {
  background: linear-gradient(135deg, rgba(0,150,136,0.03) 0%, rgba(255,255,255,0) 100%);
}
.hero-gradient-dark {
  background: linear-gradient(135deg, rgba(0,150,136,0.1) 0%, rgba(18,18,18,0) 100%);
}

.hero-title {
  line-height: 1.1;
  letter-spacing: -1px;
}

.hero-subtitle {
  max-width: 550px;
  line-height: 1.6;
}

.hero-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 150, 136, 0.3) !important;
}

.hero-btn-outline {
  transition: all 0.3s ease;
}
.hero-btn-outline:hover {
  background: rgba(0, 150, 136, 0.05);
}

.image-wrapper {
  border-radius: 24px;
  position: relative;
  z-index: 1;
}
.hero-img {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/5;
}

.floating-glass-card {
  bottom: 20px;
  left: -20px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.9);
  z-index: 2;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

/* Service Cards */
.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.03);
}
.bg-dark.service-card {
  border: 1px solid rgba(255,255,255,0.05);
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
}
.service-img {
  transition: transform 0.5s ease;
}
.service-card:hover .service-img {
  transform: scale(1.05);
}

/* Benefit Icons */
.benefit-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
}
.benefit-icon-wrapper:hover {
  transform: rotate(0deg) scale(1.05);
}

/* Agenda Section */
.agenda-card {
  width: 100%;
  max-width: 850px;
  border: 1px solid rgba(128, 128, 128, 0.1) !important;
  position: relative;
}
.agenda-card.border-dark {
  border: 1px solid rgba(255,255,255,0.05) !important;
}

.custom-stepper {
  .q-stepper__header {
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
}

.border-dashed {
  border: 2px dashed rgba(128, 128, 128, 0.3);
}

.time-slot-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 10px !important;
  transition: all 0.2s ease;
}
.time-slot-btn:hover {
  transform: translateY(-2px);
}

.slot-selected {
  transform: scale(1.03) !important;
}

/* Responsive fixes */
@media (max-width: 1024px) {
  .floating-glass-card {
    left: 20px;
    bottom: -20px;
  }
}
@media (max-width: 599px) {
  .hero-section {
    text-align: center;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-image-container {
    margin-top: 3rem;
  }
  .floating-glass-card {
    left: 10px;
    bottom: -20px;
    right: 10px;
  }
}
/* Hero Blobs */
.hero-blob {
  position: absolute;
  filter: blur(80px);
  border-radius: 50%;
  z-index: 1;
  animation: float-blob 15s infinite alternate ease-in-out;
}
.hero-blob-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -100px;
  animation-delay: 0s;
}
.hero-blob-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: -100px;
  animation-delay: 2s;
}
.hero-blob-3 {
  width: 300px;
  height: 300px;
  top: 30%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float-blob {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}
</style>
