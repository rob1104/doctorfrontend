import { ref } from 'vue';
import { api } from '../boot/axios';
import { useQuasar } from 'quasar';
import { useCobranzaStore } from '../stores/useCobranzaStore';

export function useCobranza() {
    const $q = useQuasar();
    const store = useCobranzaStore();
    
    const loading = ref(false);
    const data = ref([]);
    const pagination = ref({
        sortBy: 'created_at',
        descending: true,
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    });

    const fetchCobranza = async (props) => {
        const { page, rowsPerPage, sortBy, descending } = props?.pagination || pagination.value;
        loading.value = true;
        
        try {
            const params = {
                page,
                rowsPerPage,
                sortBy,
                descending,
                ...store.filters
            };
            
            // Assuming we have patient_id as an object from the UI, we just want the value.
            if (params.patient_id && params.patient_id.value) params.patient_id = params.patient_id.value;
            if (params.doctor_id && params.doctor_id.value) params.doctor_id = params.doctor_id.value;

            const response = await api.get('/cobranza', { params });
            data.value = response.data.data;
            
            pagination.value.page = response.data.current_page;
            pagination.value.rowsPerPage = response.data.per_page;
            pagination.value.rowsNumber = response.data.total;
            pagination.value.sortBy = sortBy;
            pagination.value.descending = descending;
        } catch (error) {
            console.error('Error fetching cobranza:', error);
            $q.notify({
                color: 'negative',
                message: 'Error al cargar los datos de cobranza',
                icon: 'report_problem'
            });
        } finally {
            loading.value = false;
        }
    };

    const registerPayment = async (paymentData) => {
        try {
            const response = await api.post('/cobranza', paymentData);
            $q.notify({
                color: 'positive',
                message: response.data.message || 'Pago registrado correctamente',
                icon: 'check'
            });
            return response.data.payment;
        } catch (error) {
            console.error('Error registering payment:', error);
            $q.notify({
                color: 'negative',
                message: error.response?.data?.message || 'Error al registrar el pago',
                icon: 'report_problem'
            });
            throw error;
        }
    };

    const downloadPdf = (id) => {
        // Construct the URL directly to let the browser download it.
        // Needs authorization token if using sanctum and direct window.open.
        // Better approach: fetch blob and create object URL.
        api.get(`/cobranza/${id}/pdf`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `nota_venta_${id}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(error => {
                console.error('Error downloading PDF:', error);
                $q.notify({
                    color: 'negative',
                    message: 'Error al generar el PDF',
                    icon: 'report_problem'
                });
            });
    };

    const downloadReportPdf = () => {
        const params = {
            ...store.filters
        };
        
        if (params.patient_id && params.patient_id.value) params.patient_id = params.patient_id.value;
        if (params.doctor_id && params.doctor_id.value) params.doctor_id = params.doctor_id.value;

        $q.notify({
            color: 'info',
            message: 'Generando reporte...',
            icon: 'hourglass_empty',
            position: 'bottom-right'
        });

        api.get('/cobranza/report/pdf', { params, responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `reporte_cobranza.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch(error => {
                console.error('Error downloading report PDF:', error);
                $q.notify({
                    color: 'negative',
                    message: 'Error al generar el reporte',
                    icon: 'report_problem'
                });
            });
    };

    return {
        loading,
        data,
        pagination,
        fetchCobranza,
        registerPayment,
        downloadPdf,
        downloadReportPdf
    };
}
