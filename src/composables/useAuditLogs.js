import { ref, reactive } from 'vue';
import { api } from '../boot/axios.js';

export function useAuditLogs() {
    const logs = ref([]);
    const loading = ref(false);
    const pagination = ref({
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0
    });

    const filters = reactive({
        event: null,
        subject_type: null,
        causer_id: null,
        date_from: null,
        date_to: null,
    });

    const fetchLogs = async (props) => {
        const { page, rowsPerPage } = props?.pagination || pagination.value;
        
        loading.value = true;
        try {
            const params = {
                page,
                rowsPerPage,
                ...filters
            };
            const response = await api.get('/audit-logs', { params });
            logs.value = response.data.data;
            
            pagination.value.page = response.data.current_page;
            pagination.value.rowsPerPage = response.data.per_page;
            pagination.value.rowsNumber = response.data.total;
        } catch (error) {
            console.error('Error fetching audit logs', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        logs,
        loading,
        pagination,
        filters,
        fetchLogs
    };
}
