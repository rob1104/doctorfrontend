import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCobranzaStore = defineStore('cobranza', () => {
    const filters = ref({
        patient_id: null,
        doctor_id: null,
        specialty_id: null, // Note: backend API needs to support this if required
        date_from: null,
        date_to: null,
        status: 'todos', // todos, pendientes, pagados
        payment_method: null,
    });

    function setFilters(newFilters) {
        filters.value = { ...filters.value, ...newFilters };
    }

    function resetFilters() {
        filters.value = {
            patient_id: null,
            doctor_id: null,
            specialty_id: null,
            date_from: null,
            date_to: null,
            status: 'todos',
            payment_method: null,
        };
    }

    return {
        filters,
        setFilters,
        resetFilters
    };
});
