<template>
  <div>
    <!-- ═══════════════════════════════════════════════ -->
    <!-- Sección de Subida de Archivos                  -->
    <!-- ═══════════════════════════════════════════════ -->
    <q-card flat bordered class="q-mb-lg" style="border-radius: 12px; border-top: 3px solid #1976D2;">
      <q-card-section class="q-pb-sm">
        <div class="text-subtitle1 text-weight-bold text-primary row items-center">
          <q-icon name="cloud_upload" size="sm" class="q-mr-sm" /> Subir Archivos
        </div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Formatos aceptados: imágenes (JPG, PNG, GIF, WebP), video MP4, PDF, Word y Excel. Máximo 20MB por archivo.
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-file
          v-model="selectedFiles"
          label="Seleccionar archivos..."
          outlined
          multiple
          counter
          :accept="acceptedTypes"
          :max-file-size="20971520"
          use-chips
          style="width: 100%;"
          @rejected="onRejected"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="cloud_upload"
              color="primary"
              :loading="uploading"
              :disable="!selectedFiles || selectedFiles.length === 0"
              @click="uploadFiles"
            >
              <q-tooltip>Subir archivos</q-tooltip>
            </q-btn>
          </template>
        </q-file>
        <q-linear-progress
          v-if="uploading"
          :value="uploadProgress"
          color="primary"
          class="q-mt-sm"
          style="border-radius: 4px;"
        />
      </q-card-section>
    </q-card>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- Estado de Carga                                -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="loadingDocs" class="row justify-center q-pa-xl">
      <q-spinner-dots color="primary" size="2.5em" />
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- Sin archivos                                   -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-else-if="documents.length === 0" class="text-center q-pa-xl text-grey-6">
      <q-icon name="folder_open" size="4em" class="q-mb-md" />
      <div class="text-h6">Sin archivos</div>
      <div>Sube fotos, videos o documentos para asociarlos a este paciente.</div>
    </div>

    <template v-else>
      <!-- ═══════════════════════════════════════════════ -->
      <!-- Galería de Imágenes & Videos                   -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="mediaFiles.length > 0" class="q-mb-lg">
        <div class="text-subtitle1 text-weight-bold text-dark q-mb-md row items-center">
          <q-icon name="photo_library" color="teal-7" size="sm" class="q-mr-sm" />
          Galería de Imágenes y Videos
          <q-badge color="teal-7" class="q-ml-sm">{{ mediaFiles.length }}</q-badge>
        </div>

        <div class="row q-col-gutter-md">
          <div
            v-for="doc in mediaFiles"
            :key="doc.id"
            class="col-6 col-sm-4 col-md-3"
          >
            <q-card
              flat
              bordered
              class="media-card cursor-pointer"
              style="border-radius: 12px; overflow: hidden;"
            >
              <!-- Imagen -->
              <q-img
                v-if="doc.mime_type.startsWith('image/')"
                :src="doc.url"
                :ratio="1"
                class="media-thumbnail"
                @click="openViewer(doc)"
              >
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-img>

              <!-- Video -->
              <div
                v-else
                class="video-thumbnail"
                @click="openViewer(doc)"
              >
                <video
                  :src="doc.url"
                  muted
                  preload="metadata"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
                <div class="absolute-center">
                  <q-icon name="play_circle_filled" color="white" size="3em" style="opacity: 0.9; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));" />
                </div>
              </div>

              <!-- Barra inferior con nombre y acciones -->
              <q-card-section class="q-pa-sm row items-center no-wrap">
                <div class="ellipsis text-caption text-grey-8 col">
                  {{ doc.original_name }}
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click.stop="confirmDelete(doc)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- Lista de Documentos (PDF, Word, Excel)         -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="docFiles.length > 0">
        <div class="text-subtitle1 text-weight-bold text-dark q-mb-md row items-center">
          <q-icon name="description" color="deep-orange-7" size="sm" class="q-mr-sm" />
          Documentos
          <q-badge color="deep-orange-7" class="q-ml-sm">{{ docFiles.length }}</q-badge>
        </div>

        <q-card flat bordered style="border-radius: 12px;">
          <q-list separator>
            <q-item
              v-for="doc in docFiles"
              :key="doc.id"
              class="q-py-sm"
            >
              <q-item-section avatar>
                <q-avatar
                  :color="getDocColor(doc.mime_type)"
                  text-color="white"
                  rounded
                  size="42px"
                >
                  <q-icon :name="getDocIcon(doc.mime_type)" size="xs" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium text-dark">
                  {{ doc.original_name }}
                </q-item-label>
                <q-item-label caption>
                  {{ formatFileSize(doc.file_size) }} · {{ formatDate(doc.created_at) }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn
                    flat
                    round
                    dense
                    icon="open_in_new"
                    color="primary"
                    size="sm"
                    @click="openDocument(doc)"
                  >
                    <q-tooltip>Abrir en nueva pestaña</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="download"
                    color="secondary"
                    size="sm"
                    @click="downloadDocument(doc)"
                  >
                    <q-tooltip>Descargar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="confirmDelete(doc)"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- Visor Fullscreen (Imágenes y Videos)           -->
    <!-- ═══════════════════════════════════════════════ -->
    <q-dialog
      v-model="viewerOpen"
      maximized
      transition-show="fade"
      transition-hide="fade"
    >
      <q-card class="bg-black column items-center justify-center" style="border-radius: 0;">
        <!-- Botón cerrar -->
        <q-btn
          flat
          round
          icon="close"
          color="white"
          size="lg"
          class="absolute-top-right q-ma-md"
          style="z-index: 10;"
          v-close-popup
        />

        <!-- Nombre del archivo -->
        <div class="absolute-bottom q-pa-md text-center text-white text-caption" style="z-index: 10; background: linear-gradient(transparent, rgba(0,0,0,0.7));">
          {{ viewerDoc?.original_name }}
        </div>

        <!-- Imagen -->
        <q-img
          v-if="viewerDoc && viewerDoc.mime_type.startsWith('image/')"
          :src="viewerDoc.url"
          fit="contain"
          style="max-height: 90vh; max-width: 95vw;"
        />

        <!-- Video -->
        <video
          v-else-if="viewerDoc && viewerDoc.mime_type.startsWith('video/')"
          :src="viewerDoc.url"
          controls
          autoplay
          style="max-height: 90vh; max-width: 95vw;"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from '../boot/axios'

const props = defineProps({
  patientId: {
    type: [String, Number],
    required: true
  }
})

const $q = useQuasar()

// ─── Estado ───────────────────────────────────────────
const documents = ref([])
const loadingDocs = ref(true)
const viewerOpen = ref(false)
const viewerDoc = ref(null)
const selectedFiles = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)

const acceptedTypes = '.jpg,.jpeg,.png,.gif,.webp,.mp4,.pdf,.doc,.docx,.xls,.xlsx'

// ─── Computadas para clasificación ────────────────────
const mediaFiles = computed(() =>
  documents.value.filter(d =>
    d.mime_type.startsWith('image/') || d.mime_type.startsWith('video/')
  )
)

const docFiles = computed(() =>
  documents.value.filter(d =>
    !d.mime_type.startsWith('image/') && !d.mime_type.startsWith('video/')
  )
)

// ─── API ──────────────────────────────────────────────
const fetchDocuments = async () => {
  loadingDocs.value = true
  try {
    const { data } = await api.get(`/patients/${props.patientId}/documents`)
    documents.value = data
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al cargar archivos del paciente' })
  } finally {
    loadingDocs.value = false
  }
}

const uploadFiles = async () => {
  if (!selectedFiles.value || selectedFiles.value.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    selectedFiles.value.forEach(file => {
      formData.append('files[]', file)
    })

    await api.post(`/patients/${props.patientId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = progressEvent.total
          ? progressEvent.loaded / progressEvent.total
          : 0
      }
    })

    $q.notify({ color: 'positive', icon: 'cloud_done', message: 'Archivos subidos exitosamente' })
    selectedFiles.value = null
    await fetchDocuments()
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al subir los archivos'
    $q.notify({ color: 'negative', message: msg })
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const deleteDocument = async (doc) => {
  try {
    await api.delete(`/patients/${props.patientId}/documents/${doc.id}`)
    $q.notify({ color: 'positive', icon: 'check_circle', message: 'Archivo eliminado' })
    documents.value = documents.value.filter(d => d.id !== doc.id)
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Error al eliminar el archivo' })
  }
}

// ─── Eventos del selector de archivos ─────────────────
const onRejected = (rejectedEntries) => {
  const reasons = rejectedEntries.map(e => {
    if (e.failedPropValidation === 'max-file-size') return `${e.file.name}: excede 20MB`
    if (e.failedPropValidation === 'accept') return `${e.file.name}: tipo no permitido`
    return `${e.file.name}: rechazado`
  })
  $q.notify({
    color: 'warning',
    textColor: 'dark',
    icon: 'warning',
    message: 'Archivos rechazados',
    caption: reasons.join(', '),
    timeout: 5000
  })
}

// ─── Visor Fullscreen ─────────────────────────────────
const openViewer = (doc) => {
  viewerDoc.value = doc
  viewerOpen.value = true
}

// ─── Documentos: abrir / descargar ────────────────────
const openDocument = (doc) => {
  window.open(doc.url, '_blank')
}

const downloadDocument = (doc) => {
  const link = document.createElement('a')
  link.href = doc.url
  link.download = doc.original_name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ─── Confirmación de borrado ──────────────────────────
const confirmDelete = (doc) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar "${doc.original_name}"? Esta acción no se puede deshacer.`,
    cancel: { flat: true, color: 'grey-8' },
    ok: { color: 'negative', label: 'Eliminar', icon: 'delete' },
    persistent: true
  }).onOk(() => {
    deleteDocument(doc)
  })
}

// ─── Utilidades ────────────────────────────────────────
const getDocIcon = (mimeType) => {
  if (mimeType === 'application/pdf') return 'picture_as_pdf'
  if (mimeType.includes('word') || mimeType.includes('msword')) return 'article'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table_chart'
  return 'insert_drive_file'
}

const getDocColor = (mimeType) => {
  if (mimeType === 'application/pdf') return 'red-7'
  if (mimeType.includes('word') || mimeType.includes('msword')) return 'blue-7'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'green-7'
  return 'grey-7'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// ─── Lifecycle ────────────────────────────────────────
onMounted(fetchDocuments)
</script>

<style scoped>
.media-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.media-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.media-thumbnail {
  cursor: pointer;
}
.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  cursor: pointer;
  background: #111;
}
.video-thumbnail video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
</style>
