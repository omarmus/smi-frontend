/**
 * Informes mensuales: snapshot de columnas + días sparse + totales server-side.
 * El frontend NUNCA calcula totales ni días: los recibe del backend.
 */
import { ReportColumn } from './ReportTemplate'

export interface FormReport {
  id?: number
  form: string
  type: string
  month: number
  year: number
  /** Snapshot de columnas copiado de la plantilla al crear. */
  columns: ReportColumn[]
}

export interface FormReportDay {
  day: number
  /** { [columnKey]: value } — sin claves derivadas. */
  values: Record<string, unknown>
}

/** Respuesta de GET api/form-reports/:id (llenado Y impresión). */
export interface FormReportDetail extends FormReport {
  days: FormReportDay[]
  totals: Record<string, number>
  /** Días del mes derivados en el server (leap-aware). */
  daysInMonth: number
  /** Nombre completo del dueño del informe (línea NOMBRE de la impresión). */
  ownerName: string
}
