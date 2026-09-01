<template>
  <q-page class="bg-grey-1 q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-dark text-weight-bold">Gestión de Usuarios</div>
        <div class="text-subtitle1 text-grey-6 q-mt-xs">Control de accesos y roles del sistema</div>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="Nuevo Usuario"
        unelevated
        rounded
        class="q-px-lg shadow-3 font-weight-bold"
        @click="openCreateDialog"
      />
    </div>

    <q-card class="shadow-2 dashboard-card" flat>
      <q-card-section class="row items-center justify-between q-pb-none bg-white" style="border-radius: 16px 16px 0 0;">
        <div class="text-h6 text-weight-bold text-dark row items-center">
          <q-icon name="manage_accounts" color="primary" class="q-mr-sm" size="sm" />
          Directorio de Usuarios
          <q-toggle v-model="showDeleted" label="Mostrar inactivos" color="negative" class="q-ml-md" size="sm" @update:model-value="fetchUsers" />
        </div>
        <q-input outlined dense hide-bottom-space v-model="filter" placeholder="Buscar por nombre, correo o rol..." class="q-ml-md bg-grey-2" style="min-width: 300px; border-radius: 8px;" borderless>
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-sm bg-white" style="border-radius: 0 0 16px 16px;">
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          flat
          :filter="filter"
          :filter-method="customFilter"
          :loading="loading"
          class="bg-transparent premium-table"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap" :class="{'opacity-50': props.row.deleted_at}">
                <q-avatar size="40px" :color="props.row.deleted_at ? 'grey' : getRoleColor(props.row.role)" text-color="white" class="q-mr-md shadow-1">
                  {{ props.row.name.charAt(0).toUpperCase() }}
                </q-avatar>
                <div>
                  <div class="text-weight-bold text-dark row items-center" style="font-size: 15px;">
                    <span :class="{'text-strike': props.row.deleted_at}">{{ props.row.name }}</span>
                    <q-chip v-if="props.row.deleted_at" color="negative" text-color="white" size="xs" class="q-ml-sm font-weight-bold">INACTIVO</q-chip>
                  </div>
                  <div class="text-caption text-grey-7 row items-center">
                    <q-icon name="email" size="12px" class="q-mr-xs" /> {{ props.row.email }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-chip :color="props.row.deleted_at ? 'grey-5' : getRoleColor(props.row.role)" text-color="white" size="sm" class="text-weight-bold shadow-1">
                {{ props.row.role }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              <div class="text-dark">{{ formatDate(props.row.created_at) }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-sm text-right">
              <template v-if="!props.row.deleted_at">
                <q-btn
                  unelevated round color="blue-1" text-color="blue-8" icon="edit" size="sm"
                  @click="openEditDialog(props.row)"
                >
                  <q-tooltip class="bg-dark">Editar Usuario</q-tooltip>
                </q-btn>
                <q-btn
                  flat round color="negative" icon="delete_outline" size="sm"
                  @click="confirmDelete(props.row)"
                  :disable="isCurrentUser(props.row.id)"
                >
                  <q-tooltip class="bg-dark" v-if="isCurrentUser(props.row.id)">No puedes eliminarte a ti mismo</q-tooltip>
                  <q-tooltip class="bg-dark" v-else>Eliminar</q-tooltip>
                </q-btn>
              </template>
              <template v-else>
                <q-btn
                  unelevated round color="positive" text-color="white" icon="restore" size="sm"
                  @click="confirmRestore(props.row)"
                >
                  <q-tooltip class="bg-dark">Restaurar Usuario</q-tooltip>
                </q-btn>
                <q-btn
                  flat round color="red-10" icon="delete_forever" size="sm"
                  @click="confirmForceDelete(props.row)"
                >
                  <q-tooltip class="bg-dark">Eliminar Definitivamente</q-tooltip>
                </q-btn>
              </template>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialogo Elegante y Compacto para Usuario -->
    <q-dialog v-model="formDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 500px; max-width: 95vw; border-radius: 16px;" class="bg-grey-1">
        <q-card-section class="row items-center q-pb-md q-pt-md q-px-lg bg-primary text-white shadow-2">
          <div>
            <div class="text-h5 text-white text-weight-bold">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <q-form @submit="saveUser">
          <q-card-section class="q-pa-lg bg-white">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input v-model="form.name" label="Nombre Completo" outlined dense hide-bottom-space autofocus :rules="[val => !!val || 'El nombre es requerido']">
                  <template v-slot:prepend><q-icon name="person" size="xs" color="primary" /></template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input v-model="form.email" type="email" label="Correo Electrónico" outlined dense hide-bottom-space :rules="[val => !!val || 'El correo es requerido']">
                  <template v-slot:prepend><q-icon name="email" size="xs" color="primary" /></template>
                </q-input>
              </div>

              <div class="col-12">
                <q-select v-model="form.role" :options="['Admin', 'Doctor', 'Asistente']" label="Rol del Sistema" outlined dense hide-bottom-space :rules="[val => !!val || 'Selecciona un rol']">
                  <template v-slot:prepend><q-icon name="badge" size="xs" color="primary" /></template>
                </q-select>
              </div>

              <div class="col-12 q-mt-md">
                <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" :label="isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'" outlined dense hide-bottom-space :rules="isEditing ? [] : [val => !!val || 'La contraseña es requerida']">
                  <template v-slot:prepend><q-icon name="lock" size="xs" color="primary" /></template>
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>
                <div v-if="isEditing" class="text-caption text-grey-6 q-mt-xs q-ml-sm">
                  Deja el campo vacío si no deseas cambiar la contraseña actual.
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn flat label="Cancelar" color="grey-8" v-close-popup class="q-mr-sm" />
            <q-btn unelevated icon="save" label="Guardar Usuario" color="primary" type="submit" class="q-px-lg shadow-2 text-weight-bold" style="border-radius: 8px;" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const users = ref([])
const loading = ref(true)
const filter = ref('')
const formDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const showPassword = ref(false)
const showDeleted = ref(false)

const getBaseForm = () => ({
  id: null,
  name: '',
  email: '',
  role: 'Asistente',
  password: ''
})

const form = ref(getBaseForm())

const columns = [
  { name: 'name', align: 'left', label: 'Usuario', field: 'name', sortable: true },
  { name: 'role', align: 'left', label: 'Rol', field: 'role', sortable: true },
  { name: 'created_at', align: 'left', label: 'Fecha de Registro', field: 'created_at', sortable: true },
  { name: 'actions', align: 'right', label: 'Acciones' }
]

const customFilter = (rows, terms) => {
  const lowerTerms = terms ? terms.toLowerCase() : ''
  if (!lowerTerms) return rows

  return rows.filter(row => {
    return (row.name || '').toLowerCase().includes(lowerTerms) ||
           (row.email || '').toLowerCase().includes(lowerTerms) ||
           (row.role || '').toLowerCase().includes(lowerTerms)
  })
}

const getRoleColor = (role) => {
  const lowerRole = (role || '').toLowerCase()
  if (lowerRole.includes('admin')) return 'negative'
  if (lowerRole.includes('doctor')) return 'indigo'
  return 'teal'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const isCurrentUser = (id) => {
  return authStore.user?.id === id
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/users', {
      params: {
        all: showDeleted.value ? 'true' : 'false'
      }
    })
    users.value = data
  } catch (error) {
    const msg = error.response?.data?.message || 'Error cargando usuarios. Verifica tus permisos.'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  form.value = getBaseForm()
  showPassword.value = false
  formDialog.value = true
}

const openEditDialog = (user) => {
  isEditing.value = true
  form.value = { ...getBaseForm(), ...user, password: '' }
  showPassword.value = false
  formDialog.value = true
}

const saveUser = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.put(`/users/${form.value.id}`, form.value)
      $q.notify({ color: 'positive', message: 'Usuario actualizado correctamente', icon: 'check_circle' })
    } else {
      await api.post('/users', form.value)
      $q.notify({ color: 'positive', message: 'Usuario creado exitosamente', icon: 'check_circle' })
    }
    formDialog.value = false
    fetchUsers()
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al guardar el usuario'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (user) => {
  if (isCurrentUser(user.id)) return

  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción revocará su acceso.`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Eliminar Usuario'
    }
  }).onOk(async () => {
    try {
      await api.delete(`/users/${user.id}`)
      $q.notify({ color: 'positive', message: 'Usuario eliminado' })
      fetchUsers()
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al eliminar usuario' })
    }
  })
}

const confirmRestore = (user) => {
  $q.dialog({
    title: 'Confirmar restauración',
    message: `¿Estás seguro de que deseas volver a activar a ${user.name}? Recuperará su acceso al sistema.`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'positive',
      label: 'Restaurar'
    }
  }).onOk(async () => {
    try {
      await api.post(`/users/${user.id}/restore`)
      $q.notify({ color: 'positive', message: 'Usuario restaurado correctamente' })
      fetchUsers()
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al restaurar usuario' })
    }
  })
}

const confirmForceDelete = (user) => {
  if (isCurrentUser(user.id)) return

  $q.dialog({
    title: 'Confirmar eliminación permanente',
    message: `¿Estás completamente seguro de eliminar DEFINITIVAMENTE a ${user.name}? Esta acción no se puede deshacer y borrará permanentemente sus datos de acceso.`,
    cancel: true,
    persistent: true,
    ok: {
      color: 'red-10',
      label: 'Eliminar Definitivamente'
    }
  }).onOk(async () => {
    try {
      await api.delete(`/users/${user.id}/force`)
      $q.notify({ color: 'positive', message: 'Usuario eliminado permanentemente' })
      fetchUsers()
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al eliminar usuario definitivamente'
      $q.notify({ color: 'negative', message: msg })
    }
  })
}

onMounted(() => {
  fetchUsers()
})
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
</style>
