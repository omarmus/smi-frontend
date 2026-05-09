<template>
  <div class="container" v-if="entry">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
      Informe mensual - {{ months[entry.month - 1] }} {{ entry.year }}
    </h2>
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      align="left"
      dense
      no-caps
      indicator-color="warning"
      class="bg-primary text-white"
    >
      <q-tab name="entry" icon="paid" label="Asociación Boliviana" />
      <!-- <q-tab name="month" icon="money_off" label="Gastos Iglesia local" /> -->
      <q-tab name="expense" icon="money_off" :label="$store.state.user.user.company?.name" />
      <!-- <q-tab name="week" icon="movie" label="Ingreso Semanal" /> -->
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      vertical
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel name="entry">
        <div class="row">
          <div class="q-mb-md col-xs-12">
            <q-btn
              icon="print"
              no-caps
              @click="printMonthReport"
            >
              &nbsp;Imprimir
            </q-btn>
          </div>
        </div>
        <div class="row" id="report-month">
          <div class="col-12">
            <h2 class="text-center report-title">
              INFORME MENSUAL DE TESORERÍA DE IGLESIA
              <strong>{{ store.state.user.user.company?.name }}</strong>
              <span>{{ months[entry.month - 1] }} {{ entry.year }}</span>
            </h2>
            <!-- <h3 class="text-primary flow-title">OFRENDAS ENVIADAS A LA ASOCIACIÓN BOLIVIANA</h3> -->
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-mb-lg q-pb-lg">
            <div class="row justify-end">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Asociación</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-10">
                <div
                  v-for="item in flowsEntriesSendGlobal"
                  :key="item.id"
                  class="row justify-end">
                  <template v-if="item.department">
                    <div class="col-8">{{ item.department.name }}</div>
                    <div class="col-xs-4 col-sm-4 text-right">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</div>
                  </template>
                </div>
                <div class="row justify-end">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-end">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ totalFlowEntryGlobal.toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</strong></div>
                </div>
              </div>
            </div>
            <!-- <div class="row justify-end">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Asociación</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-10">
                <div
                  v-for="item in flowsEntriesGlobal"
                  :key="item.id"
                  class="row justify-end">
                  <div class="col-8">{{ item.department.name }}</div>
                  <div class="col-xs-4 col-sm-4 text-right">{{ Number(item.total).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</div>
                </div>
                <div class="row justify-end">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-end">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ totalFlowEntry.toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</strong></div>
                </div>
              </div>
            </div> -->
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-mb-lg q-pb-lg" v-if="totalExpensesGlobal > 0">
            <h3 class="text-primary flow-title">Gastos Asociación</h3>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-10">
                <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap">
                  <table class="q-table treasury-table-data">
                    <thead>
                      <tr>
                        <th class="text-left"><strong>Descripción</strong></th>
                        <th class="text-left"><strong>Datos de facturación</strong></th>
                        <th class="text-right"><strong>Valor</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in expensesDetailsGlobal"
                        :key="item.id">
                        <td class="text-left">
                          {{ item.concept }}
                          <strong class="treasury-departament">{{ item.department.name }}</strong>
                          <em>Registrado el {{ format(item.date) }}</em>
                        </td>
                        <td class="text-left">
                          <ul class="treasury-list-concepts">
                            <li v-if="item.document_type"><strong>Tipo de documento:</strong> {{ item.document_type }}</li>
                            <li v-if="item.document_number"><strong>Número de documento:</strong> {{ item.document_number }}</li>
                            <li v-if="item.supplier"><strong>Proveedor:</strong> {{ item.supplier }}</li>
                          </ul>
                        </td>
                        <td class="text-right total">{{ Number(item.value).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th class="text-left" colspan="2"><strong>Total</strong></th>
                        <th class="text-right"><strong>{{ totalExpensesGlobal.toFixed(2) }}</strong></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-mb-lg q-pb-lg">
            <h3 class="text-primary flow-title">Estado del depósito</h3>
            <q-form @submit.prevent="saveDeposit">
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-12 col-md-10">
                  <q-field filled label="Total a ser enviado" stack-label>
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ totalFlowEntryGlobal.toFixed(2) }}</div>
                    </template>
                    <template v-slot:append>
                      <span class="q-field__suffix no-pointer-events suffix-icon">{{ $store.state.user?.user?.company?.money }}</span>
                    </template>
                  </q-field>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-10">
                  <q-input
                    v-model="totalDeposited"
                    filled
                    placeholder="0"
                    class="text-right"
                    label="Total enviado"
                    :suffix="$store.state.user?.user?.company?.money"
                    debounce="1000">
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-10">
                  <q-field filled label="Tesorero de la iglesia" stack-label>
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                    <template v-slot:control>
                      <div class="self-center full-width no-outline">{{ $store.state.user?.user?.fullname }}</div>
                    </template>
                  </q-field>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-10">
                  <q-input
                    filled
                    label="Fecha del envío"
                    v-model="dateDeposited"
                    debounce="1000"
                    :rules="[]">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="birthdayDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale">
                          <q-date
                            v-model="dateDeposited"
                            minimal
                            mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Cerrar" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- <div class="text-right q-pt-sm">
                <q-btn
                  label="Guardar información del depósito"
                  no-caps
                  color="primary"
                  icon="check"
                  padding="10px 20px"
                  class="btn-close-month"
                  type="submit" />
              </div> -->
            </q-form>
          </div>
          <div class="row">
          </div>
        </div>
        <h3 class="text-primary flow-title q-pt-lg">Comprobante de pago</h3>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-12 col-md-5">
            <!-- Desktop: QUploader -->
            <div class="voucher-desktop">
              <q-uploader
                :url="voucherUrl"
                :headers="voucherHeaders"
                field-name="file"
                accept="image/*,application/pdf"
                :max-file-size="5 * 1024 * 1024"
                :multiple="false"
                auto-upload
                class="full-width voucher-uploader"
                @uploaded="onUploaded"
                @rejected="onRejected">
                <template v-slot:header="scope">
                  <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                    <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                    <div class="col">
                      <a class="q-uploader__title text-white" :href="`${urlBase.replace(/\/api\//g, '')}/files/${entry.voucherDeposited}`" target="blank" v-if="entry.voucherDeposited">
                        <q-icon name="file_download" /> {{ entry.voucherDeposited }}
                      </a>
                      <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
                    </div>
                    <q-btn v-if="scope.canAddFiles" type="a" no-caps color="warning" icon="add_box" class="voucher-uploader-trigger">
                      <q-uploader-add-trigger />
                      {{ entry.voucherDeposited ? 'Cambiar archivo' : 'Seleccionar archivo' }}
                      <q-tooltip>{{ entry.voucherDeposited ? 'Cambiar archivo' : 'Seleccionar archivo' }}</q-tooltip>
                    </q-btn>
                    <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
                      <q-tooltip>Subir archivo</q-tooltip>
                    </q-btn>
                    <q-btn v-if="scope.isUploading" icon="clear" @click="scope.abort" round dense flat >
                      <q-tooltip>Cancela subida</q-tooltip>
                    </q-btn>
                  </div>
                </template>
              </q-uploader>
            </div>
            <!-- Mobile: input nativo para evitar "blocked due to lack of user activation" -->
            <div class="voucher-mobile">
              <div class="row no-wrap items-center q-pa-sm q-gutter-xs voucher-mobile-inner">
                <q-spinner v-if="voucherUploading" size="sm" color="warning" />
                <div class="col">
                  <a v-if="entry.voucherDeposited" class="text-primary" :href="`${urlBase.replace(/\/api\//g, '')}/files/${entry.voucherDeposited}`" target="_blank" rel="noopener">
                    <q-icon name="file_download" /> {{ entry.voucherDeposited }}
                  </a>
                  <span v-else class="text-grey">Sin comprobante</span>
                </div>
                <label class="voucher-mobile-trigger q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--no-wrap bg-warning text-white">
                  <input
                    ref="mobileVoucherInputRef"
                    type="file"
                    accept="image/*,application/pdf"
                    class="voucher-mobile-input-overlay"
                    @change="onMobileVoucherChange"
                  >
                  <q-icon name="add_box" />
                  {{ entry.voucherDeposited ? 'Cambiar archivo' : 'Seleccionar archivo' }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="expense">
        <div class="row">
          <div class="q-mb-md col-xs-12">
            <q-btn
              icon="print"
              no-caps
              @click="printMonthReportLocal"
            >
              &nbsp;Imprimir
            </q-btn>
          </div>
        </div>
        <div class="row" id="report-month-local">
          <div class="col-12">
            <h2 class="text-center report-title">
              INFORME MENSUAL DE INGRESOS Y GASTOS IGLESIA LOCAL
              <strong>{{ store.state.user.user.company?.name }}</strong>
              <span>{{ months[entry.month - 1] }} {{ entry.year }}</span>
            </h2>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-mb-lg q-pb-lg">
            <div class="row justify-start">
              <h3 class="text-primary flow-title col-xs-12 col-sm-12">Ingresos Iglesia local</h3>
            </div>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-10">
                <div
                  v-for="item in flowsEntriesLocal"
                  :key="item.id"
                  class="row justify-start">
                  <div class="col-8">{{ item.department.name }}</div>
                  <div class="col-xs-4 col-sm-4 text-right">{{ (item.netTotal * 1).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</div>
                </div>
                <div class="row justify-start">
                  <div class="col-xs-12 col-sm-12">
                    <q-separator />
                  </div>
                </div>
                <div class="row justify-start">
                  <div class="col-8"><strong>Total:</strong></div>
                  <div class="col-xs-4 col-sm-4 text-right"><strong>{{ (totalFlowExpense * 1).toFixed(2) }} {{ $store.state.user?.user?.company?.money }}</strong></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6">
            <h3 class="text-primary flow-title">Gastos Iglesia local</h3>
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-10">
                <div class="q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap">
                  <table class="q-table treasury-table-data">
                    <thead>
                      <tr>
                        <th class="text-left"><strong>Descripción</strong></th>
                        <th class="text-left no-wrap"><strong></strong></th>
                        <th class="text-right"><strong>Valor</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in expensesDetailsLocal"
                        :key="item.id">
                        <td class="text-left no-wrap">
                          {{ item.concept }}
                          <strong class="treasury-departament">{{ item.department.name }}</strong>
                          <em>Registrado el {{ format(item.date) }}</em>
                        </td>
                        <td class="text-left">
                          <ul class="treasury-list-concepts">
                            <li v-if="item.document_type"><strong>Tipo documento:</strong> {{ item.document_type }}</li>
                            <li v-if="item.document_number"><strong>Nro. documento:</strong> {{ item.document_number }}</li>
                            <li v-if="item.supplier"><strong>Proveedor:</strong> {{ item.supplier }}</li>
                          </ul>
                        </td>
                        <td class="text-right total">{{ Number(item.value).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th class="text-left" colspan="2"><strong>Total</strong></th>
                        <th class="text-right"><strong>{{ totalExpensesLocal.toFixed(2) }}</strong></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
    <div
      v-if="!storage.exist('report')"
      class="text-right q-pt-md q-gutter-xs">
      <q-btn
        label="Ver flujo de caja"
        no-caps
        icon="account_balance"
        class="btn-close-month"
        @click="$router.push('/treasury/flows/general')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { http, urlBase } from 'boot/http'
import { storage } from 'boot/storage'
import { message } from 'boot/message'
import { Result, Response } from '../../../components/entities/Entity'
import { Flow } from '../../../components/entities/Flow'
import { months, getWeeks, format, normalize } from '../../../components/plugins/datetime'
import { EntryDetail, Entry } from '../../../components/entities/Entry'
import { ExpenseDetail } from '../../../components/entities/Expense'
import { useStore } from '../../../store'
import html2pdf from 'html2pdf.js'

const store = useStore()

const idCompany = store.state.user?.user?.company.id as number

const tab = ref('entry')
const flowsEntriesGlobal = ref<[Flow]>([])
const flowsEntriesSendGlobal = ref<[Flow]>([])
const flowsEntriesLocal = ref<[Flow]>([])
const expensesDetails = ref<[ExpenseDetail]>([])
const entry = ref<Entry>()
const weeks = ref([])
const total = ref<number>(0)
const totalDeposited = ref<number>()
const dateDeposited = ref<string>('')

const route = useRoute()
const router = useRouter()
const { entryId, expenseId } = route.params
const voucherUrl = `${urlBase as string}entries/${entryId as string}/upload`
const voucherHeaders = [{ name: 'Authorization', value: `Bearer ${storage.get('token') as string}` }]

const voucherUploading = ref(false)
const mobileVoucherInputRef = ref<HTMLInputElement | null>(null)
const maxVoucherSize = 5 * 1024 * 1024
const compressionTarget = 800 * 1024 // 800 KB objetivo para fotos de cámara

/** Quita los puntos del nombre del archivo y deja solo la extensión real (tras el último punto). */
function sanitizeVoucherFilename (originalName: string): string {
  const lastDot = originalName.lastIndexOf('.')
  if (lastDot === -1) {
    return originalName.replace(/\./g, '')
  }
  const base = originalName.slice(0, lastDot)
  const ext = originalName.slice(lastDot)
  const baseWithoutDots = base.replace(/\./g, '')
  return baseWithoutDots + ext
}

/**
 * Comprime una imagen usando canvas hasta que cumpla el tamaño máximo.
 * Devuelve un Blob con el contenido comprimido.
 */
async function compressImage (file: File, maxSizeBytes = 1024 * 1024, maxWidth = 1280): Promise<Blob | File> {
  if (file.size <= maxSizeBytes) return file

  // Obtener orientación EXIF si existe
  const orientation = await getExifOrientation(file)

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(String(fr.result))
    fr.onerror = reject
    fr.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = dataUrl
  })
  let { width, height } = img
  let ratio = 1
  if (width > maxWidth) {
    ratio = maxWidth / width
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Ajustar canvas y aplicar transformaciones según orientación EXIF
  if (orientation && orientation > 4) {
    canvas.width = height
    canvas.height = width
  } else {
    canvas.width = width
    canvas.height = height
  }

  applyOrientationTransform(ctx, width, height, orientation || 1)
  ctx.drawImage(img, 0, 0, width, height)

  // Intentar con calidades decrecientes hasta que el tamaño sea aceptable
  let quality = 0.92
  const minQuality = 0.5
  let blob: Blob | null = null

  while (quality >= minQuality) {
    // eslint-disable-next-line no-await-in-loop
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })
    if (!blob) break
    if (blob.size <= maxSizeBytes) break
    quality -= 0.12
  }

  if (blob && blob.size <= maxSizeBytes) return blob

  // Si aún es demasiado grande, reducir dimensiones a la mitad y volver a intentar
  let reducedWidth = Math.max(800, Math.round(width / 2))
  while (reducedWidth >= 400) {
    const scale = reducedWidth / width
    const newW = Math.round(width * scale)
    const newH = Math.round(height * scale)
    canvas.width = newW
    canvas.height = newH
    ctx.drawImage(img, 0, 0, newW, newH)
    // eslint-disable-next-line no-await-in-loop
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', minQuality)
    })
    if (blob && blob.size <= maxSizeBytes) return blob
    reducedWidth = Math.round(reducedWidth / 2)
  }

  // Fallback: devolver el archivo original si no pudo comprimirse correctamente
  return file
}

/** Lee la orientación EXIF (tag 0x0112) de un JPEG y devuelve el valor (1-8) o null. */
async function getExifOrientation (file: File): Promise<number | null> {
  try {
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result as ArrayBuffer)
      fr.onerror = reject
      fr.readAsArrayBuffer(file.slice(0, 64 * 1024)) // solo los primeros KB
    })

    const view = new DataView(arrayBuffer)
    if (view.getUint16(0, false) !== 0xFFD8) return null // no es JPEG

    let offset = 2
    const length = view.byteLength
    while (offset < length) {
      const marker = view.getUint16(offset, false)
      offset += 2
      if (marker === 0xFFE1) {
        // const app1Length = view.getUint16(offset, false)
        offset += 2
        // Check for 'Exif' string
        if (view.getUint32(offset, false) !== 0x45786966) return null
        offset += 6 // 'Exif\0\0'

        const little = view.getUint16(offset, false) === 0x4949
        offset += 2
        // const magic = view.getUint16(offset, little)
        offset += 2
        const ifdOffset = view.getUint32(offset, little)
        offset += ifdOffset - 4

        const entries = view.getUint16(offset, little)
        offset += 2
        for (let i = 0; i < entries; i++) {
          const tag = view.getUint16(offset + i * 12, little)
          if (tag === 0x0112) {
            const value = view.getUint16(offset + i * 12 + 8, little)
            return value
          }
        }
        break
      } else {
        offset += view.getUint16(offset, false)
      }
    }
    return null
  } catch (e) {
    return null
  }
}

/** Aplica la transformación en el contexto para corregir la orientación EXIF antes de dibujar. */
function applyOrientationTransform (ctx: CanvasRenderingContext2D, width: number, height: number, orientation: number) {
  switch (orientation) {
    case 2: // flip horizontal
      ctx.transform(-1, 0, 0, 1, width, 0)
      break
    case 3: // rotate 180
      ctx.transform(-1, 0, 0, -1, width, height)
      break
    case 4: // flip vertical
      ctx.transform(1, 0, 0, -1, 0, height)
      break
    case 5: // transpose
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    case 6: // rotate 90
      ctx.transform(0, 1, -1, 0, height, 0)
      break
    case 7: // transverse
      ctx.transform(0, -1, -1, 0, height, width)
      break
    case 8: // rotate -90
      ctx.transform(0, -1, 1, 0, 0, width)
      break
    default:
      break
  }
}

async function onMobileVoucherChange (e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !entry.value) return

  voucherUploading.value = true
  try {
    let toUpload: File | Blob = file

    // Si es imagen, intentar comprimir antes de subir
    if (file.type && file.type.startsWith('image/')) {
      const compressed = await compressImage(file, compressionTarget, 1280)
      if (compressed instanceof File) {
        toUpload = compressed
      } else if (compressed instanceof Blob) {
        const ext = '.jpg'
        const safeName = sanitizeVoucherFilename(file.name).replace(/\.[^.]*$/, '') + ext
        toUpload = new File([compressed], safeName, { type: compressed.type || 'image/jpeg' })
      }
    } else if (file.size > maxVoucherSize) {
      // No es imagen y supera tamaño
      message.error('El archivo supera el tamaño máximo (5 MB)')
      input.value = ''
      voucherUploading.value = false
      return
    }

    const formData = new FormData()
    const safeFilename = sanitizeVoucherFilename((toUpload as File).name || file.name)
    formData.append('file', toUpload as Blob, safeFilename)

    const data = await http.post(
      `entries/${entry.value.id as number}/upload`,
      formData,
      false,
      { 'Content-Type': 'multipart/form-data' }
    ) as { filename?: string }

    if (data?.filename) {
      entry.value.voucherDeposited = data.filename
    } else {
      message.error('Error al subir el comprobante')
    }
  } catch (error) {
    message.error(String(error || 'Error al subir el comprobante'))
  } finally {
    voucherUploading.value = false
    input.value = ''
  }
}

const saveDeposit = async (): void => {
  await http.put(`entries/${entryId as string}`, {
    totalDeposited: totalDeposited.value,
    dateDeposited: normalize(dateDeposited.value)
  })
}

watch(totalDeposited, () => {
  saveDeposit()
})

watch(dateDeposited, () => {
  saveDeposit()
})

const getFlowsEntriesGlobal = async () => {
  const query = {
    type_treasury: 'ENTRY',
    id_company: idCompany,
    year: entry.value.year,
    month: entry.value.month,
    type: 'MONTH',
    order: 'id_department',
    type_department: 'GLOBAL'
  }
  const items = await http.get(http.convertQuery('flows', query)) as Result<Flow>
  flowsEntriesGlobal.value = items.rows
}

const getFlowsEntriesSendGlobal = async () => {
  const items = await http.get(`flows/send/${entry.value.year}/${entry.value.month}`) as Result<Flow>
  flowsEntriesSendGlobal.value = items.rows
}

const getFlowsEntriesLocal = async () => {
  const query = {
    type_treasury: 'ENTRY',
    id_company: idCompany,
    year: entry.value.year,
    month: entry.value.month,
    type: 'MONTH',
    order: 'id_department',
    type_department: 'LOCAL'
  }
  const items = await http.get(http.convertQuery('flows', query)) as Result<Flow>
  flowsEntriesLocal.value = items.rows
}

function onRejected (rejectedEntries: string[]) {
  // console.log('error upload', rejectedEntries)
  message.error(`${rejectedEntries.length as string} el/los archivo(s) no pasaron las restricciones de validación`)
}

interface FileInfo {
  xhr: { response: string }
}

function onUploaded (info: FileInfo) {
  try {
    const json: Response<{ filename: string }> = JSON.parse(info.xhr.response) // eslint-disable-line
    entry.value.voucherDeposited = json.data.filename
  } catch (e) {}
}

interface Total {
  total: number
  local: number
  global: number
}

const getEntry = async () => {
  entry.value = await http.get(`entries/${parseInt(entryId)}`) as Entry
  totalDeposited.value = entry.value.totalDeposited
  dateDeposited.value = format(entry.value.dateDeposited)
  weeks.value = getWeeks(entry.value.year, entry.value.month)
  const items = await http.get(`entriesdetails?id_entry=${entry.value.id as string}`) as Result<EntryDetail>
  const totals: Record<number, Total> = {
    1: { total: 0, local: 0, global: 0 },
    2: { total: 0, local: 0, global: 0 },
    3: { total: 0, local: 0, global: 0 },
    4: { total: 0, local: 0, global: 0 },
    5: { total: 0, local: 0, global: 0 }
  }

  items.rows.forEach(row => {
    totals[row.week].global += Number(row.value)
  })
  total.value = 0
  weeks.value.forEach((item: { total: number, week: number }) => {
    item.total = totals[item.week].global
    total.value += item.total
  })
}

const getExpenseDetails = async () => {
  const items = await http.get(`expensesdetails?id_expense=${expenseId as string}`) as Result<ExpenseDetail>
  expensesDetails.value = items.rows
}

// const totalFlowEntry = computed(() => {
//   let total = 0
//   flowsEntriesGlobal.value.forEach(item => {
//     total += Number(item.total)
//   })
//   return total
// })

const totalFlowEntryGlobal = computed(() => {
  let total = 0
  flowsEntriesSendGlobal.value.forEach(item => {
    total += Number(item.total)
  })
  return total
})

const totalFlowExpense = computed(() => {
  let total = 0
  flowsEntriesLocal.value.forEach(item => {
    total += Number(item.netTotal)
  })
  return total
})

const totalExpensesLocal = computed(() => {
  let total = 0
  for (const item of expensesDetailsLocal.value) {
    total += parseFloat(item.value)
  }
  return total
})

const totalExpensesGlobal = computed(() => {
  let total = 0
  for (const item of expensesDetailsGlobal.value) {
    total += parseFloat(item.value)
  }
  return total
})

const expensesDetailsLocal = computed(() => expensesDetails.value.filter(item => item.type === 'LOCAL'))
const expensesDetailsGlobal = computed(() => expensesDetails.value.filter(item => item.type === 'GLOBAL'))

const goBack = () => {
  if (storage.exist('report')) {
    storage.remove('report')
    return router.push('/treasury/report/month')
  }
  return router.push(`/treasury/entryexpense/${String(entryId)}/${String(expenseId)}`)
}

const printMonthReport = async () => {
  const element = document.getElementById('report-month')
  if (!element) {
    return
  }

  await new Promise(resolve => setTimeout(resolve, 100))

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `informe-mensual-asociacion-${store.state.user.user.company?.name || 'iglesia'}-${entry.value?.month || ''}-${entry.value?.year || ''}-${Date.now()}.pdf`,
    image: { type: 'jpeg' as const, quality: 1.0 },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'letter' as const,
      orientation: 'portrait' as const
    }
  }

  void html2pdf().set(opt).from(element).save()
}

const printMonthReportLocal = async () => {
  const element = document.getElementById('report-month-local')
  if (!element) {
    return
  }

  await new Promise(resolve => setTimeout(resolve, 100))

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `informe-mensual-local-${store.state.user.user.company?.name || 'iglesia'}-${entry.value?.month || ''}-${entry.value?.year || ''}-${Date.now()}.pdf`,
    image: { type: 'jpeg' as const, quality: 1.0 },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'letter' as const,
      orientation: 'portrait' as const
    }
  }

  void html2pdf().set(opt).from(element).save()
}

onMounted(async () => {
  await getEntry()
  await getFlowsEntriesGlobal()
  await getFlowsEntriesLocal()
  await getExpenseDetails()
  await getFlowsEntriesSendGlobal()
})
</script>

<style scoped>
/* Desktop: mostrar q-uploader; móvil: mostrar input nativo (evita "blocked due to lack of user activation") */
.voucher-mobile {
  display: none;
}
@media (max-width: 768px) {
  .voucher-desktop {
    display: none;
  }
  .voucher-mobile {
    display: block;
  }
}

/* En móvil el input cubre el botón para que el tap sea activación directa */
.voucher-mobile-trigger {
  position: relative;
  min-height: 44px;
  min-width: 44px;
  padding-left: 12px;
  padding-right: 12px;
}
.voucher-mobile-input-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
}

@media (min-width: 769px) {
  .voucher-uploader-trigger {
    min-height: 44px;
    min-width: 44px;
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
