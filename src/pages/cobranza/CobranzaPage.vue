<template>
    <q-page class="bg-grey-1 q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
            <div>
                <div class="text-h4 text-dark text-weight-bold">Cobranza y Pagos</div>
                <div class="text-subtitle1 text-grey-6 q-mt-xs">Gestión y control de pagos de consultas médicas</div>
            </div>
            <div>
                <q-btn 
                    unelevated 
                    color="negative" 
                    icon="picture_as_pdf" 
                    label="Exportar a PDF" 
                    class="q-px-md"
                    style="border-radius: 8px;"
                    @click="downloadReportPdf"
                />
            </div>
        </div>

        <PaymentFilters @search="onSearch" class="q-mb-md" />

        <q-card class="shadow-2 dashboard-card" flat>
            <q-card-section class="q-pt-sm bg-white" style="border-radius: 16px;">
                <q-table
                    :rows="data"
                    :columns="columns"
                    row-key="id"
                    v-model:pagination="pagination"
                    :loading="loading"
                    @request="onRequest"
                    binary-state-sort
                    flat
                    class="bg-transparent premium-table"
                >
                    <template v-slot:loading>
                        <q-inner-loading showing color="primary" />
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <PaymentStatusBadge :status="getPaymentStatus(props.row)" />
                        </q-td>
                    </template>
                    
                    <template v-slot:body-cell-payment_date="props">
                        <q-td :props="props">
                            <q-badge v-if="getPaymentDate(props.row) !== '-'" color="blue-grey-2" text-color="dark" class="q-pa-xs">
                                <q-icon name="event" class="q-mr-xs" />
                                {{ getPaymentDate(props.row) }}
                            </q-badge>
                            <span v-else class="text-grey">-</span>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-amount="props">
                        <q-td :props="props">
                            <q-badge :color="getPaymentStatus(props.row) ? 'positive' : 'orange'" rounded class="q-pa-xs text-weight-bold" style="font-size: 13px;">
                                {{ formatCurrency(getPaymentAmount(props.row)) }}
                            </q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-patient="props">
                        <q-td :props="props">
                            <div 
                                class="text-weight-bold text-primary cursor-pointer hover-underline" 
                                @click="$router.push('/admin/patient/' + props.row.patient_id)"
                            >
                                {{ props.row.patient?.name || props.row.patient?.first_name + ' ' + props.row.patient?.last_name }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props" class="q-gutter-sm text-right">
                            <q-btn
                                v-if="!getPaymentStatus(props.row)"
                                unelevated
                                color="positive"
                                icon="payments"
                                size="sm"
                                @click="openDialog(props.row, false)"
                            >
                                <q-tooltip class="bg-dark">Registrar Pago</q-tooltip>
                            </q-btn>
                            
                            <template v-else>
                                <q-btn
                                    unelevated 
                                    round 
                                    color="blue-1" 
                                    text-color="blue-8"
                                    icon="visibility"
                                    size="sm"
                                    @click="openDialog(props.row, true)"
                                >
                                    <q-tooltip class="bg-dark">Ver pago</q-tooltip>
                                </q-btn>
                                
                                <q-btn
                                    unelevated 
                                    round 
                                    color="negative" 
                                    text-color="red-1"
                                    icon="picture_as_pdf"
                                    size="sm"
                                    @click="download(props.row)"
                                >
                                    <q-tooltip class="bg-dark">Descargar PDF</q-tooltip>
                                </q-btn>
                            </template>
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>

        <PaymentDialog
            v-model="dialog.open"
            :consultation="dialog.consultation"
            :is-read-only="dialog.readOnly"
            @saved="onPaymentSaved"
        />
    </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCobranza } from '../../composables/useCobranza';
import PaymentFilters from './PaymentFilters.vue';
import PaymentStatusBadge from './PaymentStatusBadge.vue';
import PaymentDialog from './PaymentDialog.vue';
import { date } from 'quasar';

const { loading, data, pagination, fetchCobranza, downloadPdf, downloadReportPdf } = useCobranza();

const columns = [
    { name: 'date', align: 'left', label: 'Fecha de Consulta', field: 'created_at', sortable: true, format: val => val ? date.formatDate(val, 'DD/MM/YYYY HH:mm') : '' },
    { name: 'patient', align: 'left', label: 'Paciente', field: row => row.patient ? `${row.patient.first_name} ${row.patient.last_name}` : '', sortable: true },
    { name: 'doctor', align: 'left', label: 'Doctor', field: () => 'Dr. Sobrevilla', sortable: false },
    { name: 'amount', align: 'right', label: 'Monto', field: row => getPaymentAmount(row), sortable: true },
    { name: 'payment_method', align: 'left', label: 'Forma de pago', field: row => getPaymentMethodLabel(getPaymentMethod(row)), sortable: false },
    { name: 'status', align: 'center', label: 'Estado', field: row => getPaymentStatus(row), sortable: true },
    { name: 'payment_date', align: 'left', label: 'Fecha de pago', field: 'payment_date', sortable: false },
    { name: 'actions', align: 'center', label: 'Acciones', field: 'actions' }
];

const getPaymentMethodLabel = (val) => {
    const methods = {
        '01': 'Efectivo',
        '03': 'Transferencia',
        '04': 'T. Crédito',
        '28': 'T. Débito',
        '99': 'Por definir',
    };
    return methods[val] || val || 'N/A';
};

const dialog = ref({
    open: false,
    consultation: null,
    readOnly: false
});

onMounted(() => {
    fetchCobranza();
});

const onRequest = (props) => {
    fetchCobranza(props);
};

const onSearch = () => {
    pagination.value.page = 1;
    fetchCobranza();
};

const openDialog = (consultation, readOnly) => {
    dialog.value.consultation = consultation;
    dialog.value.readOnly = readOnly;
    dialog.value.open = true;
};

const onPaymentSaved = (savedPayment) => {
    // Update the local row without reloading
    const index = data.value.findIndex(a => a.id === savedPayment.consultation_id);
    if (index !== -1) {
        if (!data.value[index].payments) {
            data.value[index].payments = [];
        }
        // Assuming single payment for now, or just push if allowing multiple
        if (data.value[index].payments.length > 0) {
            Object.assign(data.value[index].payments[0], savedPayment);
        } else {
            data.value[index].payments.push(savedPayment);
        }
    }
};

// Helpers for nested data
const getPaymentStatus = (row) => {
    return row.payments && row.payments.length > 0 && row.payments[0].paid;
};

const getPaymentAmount = (row) => {
    return (row.payments && row.payments.length > 0) ? row.payments[0].amount : (row.cost || 0);
};

const getPaymentMethod = (row) => {
    return (row.payments && row.payments.length > 0) ? row.payments[0].payment_method : 'N/A';
};

const getPaymentDate = (row) => {
    if (row.payments && row.payments.length > 0 && row.payments[0].paid_at) {
        return date.formatDate(row.payments[0].paid_at, 'DD/MM/YYYY HH:mm');
    }
    return '';
};

const download = (row) => {
    if (row.payments && row.payments.length > 0) {
        downloadPdf(row.payments[0].id);
    }
};

const formatCurrency = (val) => {
    if (val === null || val === undefined) return '';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
};
</script>

<style scoped>
.dashboard-card {
  border-radius: 16px;
  background-color: #FFFFFF;
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

.hover-underline:hover {
  text-decoration: underline;
}
</style>
