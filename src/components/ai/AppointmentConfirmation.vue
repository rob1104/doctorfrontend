<template>
  <q-card class="appointment-card q-mt-sm" flat bordered>
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="text-subtitle2 flex items-center">
        <q-icon name="event_available" size="sm" class="q-mr-sm" />
        Acción Requerida
      </div>
    </q-card-section>
    
    <q-card-section>
      <div class="text-body2 text-grey-8">
        ¿Deseas confirmar este horario? También puedes responder con un mensaje de texto como "Sí", "Agéndala" o "No, dame otra opción".
      </div>
    </q-card-section>
    
    <q-card-actions align="right" class="q-pt-none">
      <q-btn flat color="negative" label="No, otra opción" @click="$emit('respond', 'No, quiero otra opción')" :disable="disabled" />
      <q-btn color="primary" label="Sí, agendar" @click="$emit('respond', 'Sí, por favor agéndala')" :disable="disabled" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['respond'])
</script>

<style scoped>
.appointment-card {
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}
</style>
