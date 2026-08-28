<template>
    <q-card flat bordered class="q-mb-md">
        <q-card-section>
            <div class="row q-col-gutter-sm">
                <!-- Paciente (Autocomplete stub - would normally use an API backed select) -->
                <div class="col-12 col-md-3">
                    <q-input
                        v-model="store.filters.patient_id"
                        label="Paciente (ID/Nombre)"
                        dense
                        outlined
                        clearable
                        @keyup.enter="emitSearch"
                    />
                </div>

                <!-- Fecha Inicial -->
                <div class="col-12 col-md-2">
                    <q-input v-model="store.filters.date_from" type="date" label="Fecha Inicial" dense outlined clearable />
                </div>

                <!-- Fecha Final -->
                <div class="col-12 col-md-2">
                    <q-input v-model="store.filters.date_to" type="date" label="Fecha Final" dense outlined clearable />
                </div>

                <!-- Estado -->
                <div class="col-12 col-md-2">
                    <q-select
                        v-model="store.filters.status"
                        :options="statusOptions"
                        label="Estado"
                        dense
                        outlined
                        emit-value
                        map-options
                    />
                </div>

                <div class="col-12 col-md-3 flex items-center justify-end q-gutter-x-sm">
                    <q-btn color="blue" icon="search" label="Buscar" @click="emitSearch" />
                    <q-btn flat color="grey-7" label="Limpiar" @click="clearFilters" />
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup>
import { useCobranzaStore } from '../../stores/useCobranzaStore';

const store = useCobranzaStore();
const emit = defineEmits(['search']);

const statusOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendientes', value: 'pendientes' },
    { label: 'Pagados', value: 'pagados' }
];

const emitSearch = () => {
    emit('search');
};

const clearFilters = () => {
    store.resetFilters();
    emit('search');
};
</script>
