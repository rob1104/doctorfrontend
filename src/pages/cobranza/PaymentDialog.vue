<template>
    <q-dialog v-model="isOpen" persistent>
        <q-card style="min-width: 400px; max-width: 90vw;">
            <q-card-section class="bg-primary text-white row items-center">
                <div class="text-h6">{{ isReadOnly ? 'Detalle del Pago' : 'Registrar Pago' }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-md">
                <q-form @submit.prevent="onSubmit" class="q-gutter-md">
                    <!-- Paciente (solo lectura) -->
                    <q-input
                        :model-value="consultation?.patient?.name || (consultation?.patient?.first_name + ' ' + consultation?.patient?.last_name)"
                        label="Paciente"
                        outlined
                        dense
                        readonly
                        bg-color="grey-2"
                    />

                    <!-- Consulta (solo lectura) -->
                    <q-input
                        :model-value="consultation?.created_at ? new Date(consultation.created_at).toLocaleDateString('es-MX') : ''"
                        label="Fecha de Consulta"
                        outlined
                        dense
                        readonly
                        bg-color="grey-2"
                    />

                    <!-- Monto -->
                    <q-input
                        v-model.number="form.amount"
                        type="number"
                        label="Monto"
                        outlined
                        dense
                        autofocus
                        :readonly="isReadOnly"
                        :rules="[val => val > 0 || 'El monto debe ser mayor a cero']"
                        prefix="$"
                    />

                    <!-- Pagado Checkbox -->
                    <q-checkbox
                        v-model="form.paid"
                        label="Pagado"
                        :disable="isReadOnly"
                    />

                    <!-- Forma de pago -->
                    <q-select
                        v-model="form.payment_method"
                        :options="paymentMethodOptions"
                        label="Forma de pago"
                        outlined
                        dense
                        emit-value
                        map-options
                        :readonly="isReadOnly"
                        :rules="[val => (!form.paid || !!val) || 'La forma de pago es obligatoria si está pagado']"
                    />

                    <!-- Comentarios -->
                    <q-input
                        v-model="form.comments"
                        type="textarea"
                        label="Comentarios"
                        outlined
                        dense
                        :readonly="isReadOnly"
                    />
                </q-form>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cerrar" v-close-popup />
                <q-btn
                    v-if="!isReadOnly"
                    color="primary"
                    label="Guardar"
                    @click="onSubmit"
                    :loading="saving"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
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

watch(() => props.consultation, (newVal) => {
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
            form.value = {
                amount: null,
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
