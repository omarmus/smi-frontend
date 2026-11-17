<template>
  <div class="map-picker">
    <div
      ref="mapElement"
      class="map-picker__map"></div>
    <p class="map-picker__hint">
      Hacé clic en el mapa para ubicar la iglesia, o arrastrá el marcador.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = withDefaults(defineProps<{
  latitude?: number | null
  longitude?: number | null
  zoom?: number
  /** Centro sugerido (por ejemplo, el departamento elegido): mueve el mapa. */
  center?: { lat: number, lng: number, zoom?: number } | null
}>(), {
  latitude: null,
  longitude: null,
  zoom: 16,
  center: null
})

type MapPickerEmits = {
  (event: 'update:latitude', value: number): void
  (event: 'update:longitude', value: number): void
}

const emit = defineEmits<MapPickerEmits>()

/** Centro de Bolivia: donde se abre el mapa si la iglesia no tiene punto. */
const DEFAULT_CENTER: [number, number] = [-17.5, -64.5]

const mapElement = ref<HTMLElement>()
let map: L.Map | null = null
let marker: L.Marker | null = null

const isNumber = (value: unknown): value is number =>
  value !== null && value !== undefined && value !== '' && !Number.isNaN(Number(value))

const hasPoint = () => isNumber(props.latitude) && isNumber(props.longitude)

const round7 = (value: number) => Number(value.toFixed(7))

/**
 * Marcador dibujado con CSS y no con la imagen que trae Leaflet: la imagen
 * no resuelve su ruta cuando el proyecto se empaqueta.
 */
const markerIcon = () => L.divIcon({
  className: 'map-picker__marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const setMarker = (lat: number, lng: number) => {
  if (!map) {
    return
  }

  if (!marker) {
    marker = L.marker([lat, lng], { icon: markerIcon(), draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const position = marker?.getLatLng()
      if (!position) {
        return
      }
      emit('update:latitude', round7(position.lat))
      emit('update:longitude', round7(position.lng))
    })
    return
  }

  marker.setLatLng([lat, lng])
}

const select = (lat: number, lng: number) => {
  setMarker(lat, lng)
  emit('update:latitude', round7(lat))
  emit('update:longitude', round7(lng))
}

onMounted(() => {
  if (!mapElement.value) {
    return
  }

  map = L.map(mapElement.value).setView(
    hasPoint() ? [Number(props.latitude), Number(props.longitude)] : DEFAULT_CENTER,
    hasPoint() ? props.zoom : 5
  )

  // Si viene un centro (el departamento elegido), el mapa abre ahí.
  if (props.center) {
    map.setView([props.center.lat, props.center.lng], props.center.zoom ?? props.zoom)
  }

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  map.on('click', (event: L.LeafletMouseEvent) => select(event.latlng.lat, event.latlng.lng))

  if (hasPoint()) {
    setMarker(Number(props.latitude), Number(props.longitude))
  }
})

// Si las coordenadas cambian desde los campos de texto, el marcador sigue.
watch(() => [props.latitude, props.longitude], () => {
  if (!hasPoint() || !map) {
    return
  }

  const lat = Number(props.latitude)
  const lng = Number(props.longitude)
  const position = marker?.getLatLng()

  if (!position || position.lat !== lat || position.lng !== lng) {
    setMarker(lat, lng)
  }
})

// Un centro nuevo (por ejemplo, el departamento elegido) mueve el mapa.
watch(() => props.center, center => {
  if (!center || !map) {
    return
  }
  map.setView([center.lat, center.lng], center.zoom ?? props.zoom)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<style lang="scss" scoped>
.map-picker {
  &__map {
    width: 100%;
    height: 320px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  &__hint {
    font-size: 0.78rem;
    color: rgba(0, 0, 0, 0.6);
    margin: 6px 0 0;
  }

  :deep(.map-picker__marker) {
    background: #1976d2;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }
}
</style>
