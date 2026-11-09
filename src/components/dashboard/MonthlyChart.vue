<template>
  <div class="chart">
    <div v-if="!series.length" class="chart__empty">
      Todavía no hay meses cerrados para comparar.
    </div>

    <template v-else>
      <div class="chart__grid">
        <div
          v-for="item in series"
          :key="`${item.year}-${item.month}`"
          class="chart__column">
          <div class="chart__bars">
            <div class="chart__bar-group">
              <div
                class="chart__bar chart__bar--income"
                :style="{ height: barHeight(item.income) }"
                :aria-hidden="true" />
              <div
                class="chart__bar chart__bar--expense"
                :style="{ height: barHeight(item.expense) }"
                :aria-hidden="true" />
            </div>
            <div class="chart__values">
              <span class="chart__value chart__value--income">
                <span class="chart__value-full">{{ format(item.income) }}</span>
                <span class="chart__value-compact">{{ formatCompact(item.income) }}</span>
              </span>
              <span class="chart__value chart__value--expense">
                <span class="chart__value-full">{{ format(item.expense) }}</span>
                <span class="chart__value-compact">{{ formatCompact(item.expense) }}</span>
              </span>
            </div>
          </div>
          <div class="chart__label">{{ shortLabel(item) }}</div>
        </div>
      </div>

      <div class="chart__legend">
        <span class="chart__legend-item">
          <i class="chart__swatch chart__swatch--income" /> Ingresos
        </span>
        <span class="chart__legend-item">
          <i class="chart__swatch chart__swatch--expense" /> Gastos
        </span>
      </div>

      <!-- Lectura equivalente para lectores de pantalla -->
      <table class="chart__table">
        <caption class="chart__caption">Ingresos y gastos por mes cerrado</caption>
        <thead>
          <tr>
            <th scope="col">Mes</th>
            <th scope="col">Ingresos</th>
            <th scope="col">Gastos</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in series" :key="`table-${item.year}-${item.month}`">
            <th scope="row">{{ item.label }}</th>
            <td>{{ format(item.income) }}</td>
            <td>{{ format(item.expense) }}</td>
            <td>{{ format(item.net) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// La interfaz se declara LOCAL: el macro `defineProps` de esta versión de Vue
// no resuelve tipos importados de otros archivos (quedan `any`).
interface Props {
  series: {
    year: number
    month: number
    label: string
    income: number
    expense: number
    net: number
  }[]
  format: (value: number) => string
  /** Versión corta del importe (móvil): sin moneda y abreviada. */
  formatCompact?: (value: number) => string
}

const props = defineProps<Props>()

const MONTH_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
]

const max = computed(() => {
  // Sin `flatMap`: el `lib` del tsconfig del proyecto no lo tipa (queda `any`).
  const values: number[] = []
  props.series.forEach(item => {
    values.push(Number(item.income) || 0, Number(item.expense) || 0)
  })
  return Math.max(1, ...values)
})

const barHeight = (value: number) => {
  const percent = ((Number(value) || 0) / max.value) * 100
  return `${Math.max(percent, value > 0 ? 2 : 0)}%`
}

/** Sin moneda y abreviado: en pantallas angostas el monto completo se solapaba. */
const formatCompact = (value: number) => {
  const number = Number(value) || 0
  if (props.formatCompact) {
    return props.formatCompact(number)
  }
  try {
    return new Intl.NumberFormat('es-BO', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(number)
  } catch (e) {
    return number.toLocaleString('es-BO')
  }
}

const shortLabel = (item: Props['series'][number]) => {
  const month = MONTH_SHORT[item.month - 1] || String(item.month)
  return `${month} ${String(item.year).slice(2)}`
}
</script>

<style lang="scss" scoped>
.chart {
  &__grid {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    min-height: 168px;
    overflow: hidden;
  }

  &__column {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__bars {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 6px;
    min-height: 168px;
  }

  &__bar-group {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 132px;
  }

  &__bar {
    width: 34%;
    min-height: 0;
    border-radius: 2px 2px 0 0;

    &--income {
      background: $primary;
    }

    &--expense {
      background: $warning;
    }
  }

  // Los dos importes van APILADOS (uno sobre otro): en una fila se solapaban
  // en pantallas angostas.
  &__values {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    min-height: 30px;
    line-height: 1.15;
  }

  &__value {
    font-size: 0.66rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    &--income {
      color: $primary;
    }

    &--expense {
      color: $negro-corporativo;
    }
  }

  &__value-compact {
    display: none;
  }

  &__label {
    text-align: center;
    font-size: 0.75rem;
    color: $texto-claro;
    padding-top: 6px;
    white-space: nowrap;
  }

  &__legend {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    font-size: 0.78rem;
    color: $texto-claro;
  }

  &__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__swatch {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;

    &--income {
      background: $primary;
    }

    &--expense {
      background: $warning;
    }
  }

  &__empty {
    color: $texto-claro;
    font-size: 0.9rem;
    padding: 24px 0;
    text-align: center;
  }

  @media (max-width: 600px) {
    &__grid {
      gap: 4px;
    }

    &__bars {
      min-height: 118px;
    }

    &__bar-group {
      height: 92px;
      gap: 2px;
    }

    &__bar {
      width: 42%;
    }

    &__values {
      min-height: 26px;
    }

    // El importe completo no entra en una columna de 6 meses: va la versión
    // corta (sin moneda, abreviada). El valor exacto queda en el tooltip y
    // en la tabla equivalente.
    &__value-full {
      display: none;
    }

    &__value-compact {
      display: inline;
    }

    &__label {
      font-size: 0.68rem;
    }
  }

  // Tabla equivalente: sólo para lectores de pantalla.
  &__table {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

// Modo oscuro: el azul corporativo (#335781) se confunde con el fondo
// azul-negro; se usa el azul claro de acento.
body.body--dark {
  .chart__bar--income {
    background: $dark-acento;
  }

  .chart__bar--expense {
    background: #D9A05E;
  }

  .chart__value--income {
    color: $dark-acento;
  }

  .chart__value--expense {
    color: #E0C58F;
  }

  .chart__swatch--income {
    background: $dark-acento;
  }

  .chart__swatch--expense {
    background: #D9A05E;
  }

  .chart__label {
    color: $dark-texto-suave;
  }
}
</style>
