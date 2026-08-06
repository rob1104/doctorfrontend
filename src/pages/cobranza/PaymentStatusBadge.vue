<template>
    <q-badge :color="isPaid ? 'positive' : 'negative'" class="q-pa-xs">
        {{ isPaid ? 'Pagado' : 'Pendiente' }}
    </q-badge>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: Boolean,
        required: true
    }
});

const isPaid = computed(() => props.status);
</script>
