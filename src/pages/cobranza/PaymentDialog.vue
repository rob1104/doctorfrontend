<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="min-width: 450px; max-width: 90vw; border-radius: 12px;">
            <q-card-section class="bg-primary row items-center q-pb-md">
                <q-avatar icon="payments" color="white" text-color="primary" size="40px" class="q-mr-md shadow-1" />
                <div>
                    <div class="text-h6 text-white text-weight-bold" style="line-height: 1.2;">{{ isReadOnly ? 'Detalle del Pago' : 'Registrar Pago' }}</div>
                    <div class="text-caption text-white" style="opacity: 0.8">
                        Módulo de Cobranza <span v-if="consultation?.id">| {{ formatFolio(consultation.id) }}</span>
                    </div>
                </div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup color="white" />
            </q-card-section>

            <q-card-section class="q-pa-lg">
                <q-form @submit.prevent="onSubmit" class="q-gutter-y-lg">
                    <!-- Resumen de Consulta -->
                    <div class="bg-grey-1 q-pa-md rounded-borders row items-center" style="border: 1px solid #e0e0e0;">
                        <q-icon name="person" color="primary" size="lg" class="q-mr-md" />
                        <div>
                            <div class="text-subtitle1 text-weight-bold text-dark" style="line-height: 1.2;">{{ consultation?.patient?.name || (consultation?.patient?.first_name + ' ' + consultation?.patient?.last_name) }}</div>
                            <div class="text-caption text-grey-7">Consulta agendada el {{ formatHumanDate(consultation?.created_at) }}</div>
                        </div>
                    </div>

                    <!-- Highlighted Monto Box -->
                    <div class="bg-teal-1 q-pa-lg rounded-borders row items-center justify-between" style="border: 2px solid #80cbc4;">
                        <div class="col-12 col-sm-7 q-pr-sm">
                            <div class="text-overline text-teal-9 text-weight-bold q-mb-xs" style="line-height: 1;">TOTAL A COBRAR</div>
                            <q-input
                                v-model.number="form.amount"
                                type="number"
                                outlined
                                autofocus
                                :readonly="isReadOnly"
                                :rules="[val => val > 0 || 'Monto requerido']"
                                prefix="$"
                                color="teal-9"
                                bg-color="white"
                                input-class="text-h5 text-weight-bold text-teal-10"
                                hide-bottom-space
                            />
                        </div>
                        
                        <div class="col-12 col-sm-5 flex column items-end justify-center">
                            <q-toggle
                                v-model="form.paid"
                                :label="form.paid ? 'CONFIRMADO' : 'PENDIENTE'"
                                :color="form.paid ? 'positive' : 'grey-6'"
                                :disable="isReadOnly"
                                size="xl"
                                class="text-weight-bold"
                                :class="form.paid ? 'text-positive' : 'text-grey-6'"
                            />
                        </div>
                    </div>

                    <!-- Forma de pago -->
                    <q-select
                        v-model="form.payment_method"
                        :options="paymentMethodOptions"
                        label="Forma de pago seleccionada"
                        outlined
                        emit-value
                        map-options
                        :readonly="isReadOnly"
                        :rules="[val => (!form.paid || !!val) || 'Selecciona un método de pago']"
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="credit_card" color="primary" />
                        </template>
                    </q-select>

                    <!-- Comentarios -->
                    <q-input
                        v-model="form.comments"
                        type="textarea"
                        label="Comentarios Adicionales"
                        outlined
                        :readonly="isReadOnly"
                        rows="2"
                        hide-bottom-space
                    >
                        <template v-slot:prepend>
                            <q-icon name="notes" color="primary" />
                        </template>
                    </q-input>
                </q-form>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right" class="q-pa-md bg-grey-1">
                <q-btn flat label="Cancelar" color="grey-8" v-close-popup rounded />
                <q-btn
                    v-if="!isReadOnly"
                    color="primary"
                    icon="check_circle"
                    label="Guardar Pago"
                    @click="onSubmit"
                    :loading="saving"
                    unelevated
                    rounded
                    class="q-px-md shadow-2"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useCobranza } from '../../composables/useCobranza';

const props = defineProps({
    modelValue: Boolean,
    consultation: {
        type: Object,
        default: () => ({})
    },
    isReadOnly: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const $q = useQuasar();
const { registerPayment } = useCobranza();

const formatFolio = (id) => {
    if (!id) return '';
    return 'Folio: #' + String(id).padStart(5, '0');
};

const formatHumanDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formatted = d.toLocaleDateString('es-MX', options);
    const parts = formatted.split(' ');
    if (parts.length >= 5) {
        parts[2] = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
        if (parts[3] === 'de') parts[3] = 'del';
        return parts.join(' ');
    }
    return formatted;
};

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const saving = ref(false);

const form = ref({
    amount: 0,
    paid: false,
    payment_method: null,
    comments: ''
});

const paymentMethodOptions = [
    { label: '01 Efectivo', value: '01' },
    { label: '03 Transferencia electrónica', value: '03' },
    { label: '04 Tarjeta de crédito', value: '04' },
    { label: '28 Tarjeta de débito', value: '28' },
    { label: '99 Por definir', value: '99' }
];

watch(() => props.consultation, async (newVal) => {
    if (newVal) {
        if (newVal.payments && newVal.payments.length > 0) {
            const payment = newVal.payments[0];
            form.value = {
                amount: payment.amount,
                payment_method: payment.payment_method,
                paid: payment.paid,
                comments: payment.comments || ''
            };
        } else {
            let defaultAmount = null;
            try {
                const { data } = await api.get('/agenda-settings');
                if (data && data.consultation_price) {
                    defaultAmount = data.consultation_price;
                }
            } catch (e) {
                console.error("No se pudo cargar el precio por defecto", e);
            }

            form.value = {
                amount: defaultAmount,
                payment_method: null,
                paid: true,
                comments: ''
            };
        }
    }
}, { immediate: true });

const onSubmit = async () => {
    if (form.value.amount <= 0) {
        $q.notify({ type: 'negative', message: 'El monto debe ser mayor a cero' });
        return;
    }
    if (form.value.paid && !form.value.payment_method) {
        $q.notify({ type: 'negative', message: 'Seleccione forma de pago' });
        return;
    }

    $q.dialog({
        title: 'Confirmar',
        message: '¿Está seguro de registrar este pago?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        saving.value = true;
        try {
            const payload = {
                consultation_id: props.consultation.id,
                amount: form.value.amount,
                payment_method: form.value.payment_method,
                paid: form.value.paid,
                comments: form.value.comments
            };
            const savedPayment = await registerPayment(payload);
            emit('saved', savedPayment);
            isOpen.value = false;
        } finally {
            saving.value = false;
        }
    });
};
</script>
