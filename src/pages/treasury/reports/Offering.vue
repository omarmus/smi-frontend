<template>
  <div class="container">
    <h2 class="treasury-title">
      <q-btn
        icon="arrow_back"
        round
        flat
        @click="goBack" />
        Informe de ofrendas y diezmos por persona
    </h2>
    <div class="q-pb-md row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-8">
        <q-select
          filled
          label="Buscar por nombre o apellido"
          v-model="selectedUser"
          use-input
          input-debounce="600"
          :options="userOptions"
          @filter="filterUsersByFullname"
          clearable>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.church }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <!-- Tabla para usuario seleccionado agrupada por gestión -->
    <div v-if="selectedUser && userEntryDetailsByYearArray.length > 0">
      <div class="col-xs-12 q-mb-lg">
        <q-btn
          icon="print"
          no-caps
          label="Imprimir"
          @click="generatePdf" />
      </div>
      <div
        id="report-content"
        class="q-mb-lg">
        <h2 class="treasury-title">
          Diezmos y ofrendas de {{ selectedUser?.label }} - {{ memberType[selectedUser?.type as keyof typeof memberType] }}
        </h2>
        <div
          v-for="[year, details] in userEntryDetailsByYearArray"
          :key="year"
          class="q-mb-lg row">
        <div class="col-xs-12 col-sm-8 q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap table-responsive">
          <h3 class="q-mb-md treasury-subtitle">Gestión {{ year }}</h3>
          <table class="q-table">
            <thead>
              <tr>
                <th class="text-left" style="width: 25%;"><strong>Mes</strong></th>
                <th class="text-left"><strong>Descripción</strong></th>
                <th class="text-left" style="width: 30%;"><strong>Lugar</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(detail, index) in details"
                :key="index">
                <td>{{ detail.monthName }}</td>
                <td>
                  <ul v-if="detail.concepts.length > 0" class="treasury-list-concepts">
                    <li
                      v-for="(concept, conceptIndex) in detail.concepts"
                      :key="conceptIndex">
                      <span class="treasury-observation-report">{{ concept.label }}: </span> <strong>{{ concept.value }}</strong>
                    </li>
                  </ul>
                  <span v-else class="treasury-observation">-</span>
                </td>
                <td>{{ detail.concepts.length > 0 ? detail.church : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
    <div
      v-if="selectedUser && userEntryDetailsByYearArray.length === 0"
      class="alert alert-info">Sin información para la persona</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from 'boot/http'
import { Result } from '../../../components/entities/Entity'
import { EntryDetail, Option } from '../../../components/entities/Entry'
import { months } from '../../../components/plugins/datetime'
import { User } from 'src/components/entities/User'
import html2pdf from 'html2pdf.js'

const router = useRouter()
const selectedUser = ref<Option | null>(null)
const userOptions = ref<Option[]>([])
const userEntryDetails = ref<Array<{
  year: number
  month: number
  monthName: string
  concepts: Array<{ label: string; value: number }>
  church: string
  date: Date
}>>([])

const userEntryDetailsByYear = ref<Map<number, Array<{
  year: number
  month: number
  monthName: string
  concepts: Array<{ label: string; value: number }>
  church: string
  date: Date
}>>>(new Map())

const goBack = () => {
  return router.push('/treasury/reports')
}

const memberType = {
  member: 'Miembro',
  sympathizer: 'Miembro Esc. sabática',
  visit: 'Visita'
}

const filterUsersByFullname = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    void (async () => {
      if (val === '') {
        userOptions.value = []
        return
      }
      const url = `users?order=fullname&fullname=${encodeURIComponent(val)}&all_churchs=true`
      const items = await http.get(url, false) as Result<User>
      userOptions.value = items.rows.map(item => ({
        value: String(item.id),
        label: String(item.person?.fullname),
        church: String(item.company?.name),
        association: undefined,
        type: item.type?.toLowerCase(),
        months: {}
      }))
    })()
  })
}

watch(selectedUser, async (newUser) => {
  if (newUser) {
    await getUserEntryDetails(newUser.value)
  } else {
    userEntryDetails.value = []
    userEntryDetailsByYear.value = new Map()
  }
})

const userEntryDetailsByYearArray = computed(() => {
  return Array.from(userEntryDetailsByYear.value.entries()).sort((a, b) => b[0] - a[0])
})

const generatePdf = () => {
  const element = document.getElementById('report-content')
  if (!element) {
    return
  }

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `informe-ofrendas-${selectedUser.value?.label || 'usuario'}-${Date.now()}.pdf`,
    image: { type: 'png' as const },
    html2canvas: {
      scale: 2.5,
      useCORS: true,
      logging: false
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'letter' as const,
      orientation: 'portrait' as const
    }
  }

  void html2pdf().set(opt).from(element).save()
}

const getUserEntryDetails = async (userId: string) => {
  userEntryDetails.value = []
  userEntryDetailsByYear.value = new Map()
  const items = await http.get(`entriesdetails?id_user=${userId}&order=entry_detail.id`) as Result<EntryDetail>

  // Group by year and month, combining all concepts
  const yearMonthMap = new Map<string, {
    year: number
    month: number
    concepts: Array<{ label: string; value: number }>
    churches: Set<string>
  }>()

  // Process each entry detail and group by year-month
  for (const item of items.rows) {
    const year = item.entry.year
    const month = item.entry.month
    const key = `${year}-${month}`
    const church = item.user?.company?.name || selectedUser.value?.church || ''

    // Get or create year-month entry
    if (!yearMonthMap.has(key)) {
      yearMonthMap.set(key, {
        year,
        month,
        concepts: [],
        churches: new Set()
      })
    }

    const yearMonthEntry = yearMonthMap.get(key)
    if (yearMonthEntry) {
      // Add church to set
      if (church) {
        yearMonthEntry.churches.add(church)
      }

      // Add concepts from this entry detail
      for (const concept of item.concepts) {
        if (concept.concept?.label && concept.value) {
          yearMonthEntry.concepts.push({
            label: concept.concept.label,
            value: Number(concept.value)
          })
        }
      }
    }
  }

  // Convert grouped data to final structure and group by year
  yearMonthMap.forEach((data) => {
    const year = data.year
    const month = data.month

    // Get the first church (or use selected user's church)
    const church = data.churches.size > 0
      ? Array.from(data.churches)[0]
      : selectedUser.value?.church || ''

    // Group and sum concepts by label
    const conceptMap = new Map<string, number>()
    data.concepts.forEach(concept => {
      const currentValue = conceptMap.get(concept.label) || 0
      conceptMap.set(concept.label, currentValue + concept.value)
    })

    // Convert map back to array
    const aggregatedConcepts = Array.from(conceptMap.entries()).map(([label, value]) => ({
      label,
      value
    }))

    const entryDetail = {
      year,
      month,
      monthName: months[month - 1],
      concepts: aggregatedConcepts,
      church,
      date: new Date(year, month - 1, 1)
    }

    userEntryDetails.value.push(entryDetail)

    // Group by year
    if (!userEntryDetailsByYear.value.has(year)) {
      userEntryDetailsByYear.value.set(year, [])
    }
    const yearDetails = userEntryDetailsByYear.value.get(year)
    if (yearDetails) {
      yearDetails.push(entryDetail)
    }
  })

  // Ensure all months (1-12) are present for each year, even if empty
  userEntryDetailsByYear.value.forEach((details, year) => {
    // Create a map of existing months
    const monthMap = new Map<number, typeof details[0]>()
    details.forEach(detail => {
      monthMap.set(detail.month, detail)
    })

    // Create entries for all 12 months
    const allMonths: typeof details = []
    for (let month = 1; month <= 12; month++) {
      const existingDetail = monthMap.get(month)
      if (existingDetail) {
        allMonths.push(existingDetail)
      } else {
        // Create empty entry for month without data
        allMonths.push({
          year,
          month,
          monthName: months[month - 1],
          concepts: [],
          church: selectedUser.value?.church || '',
          date: new Date(year, month - 1, 1)
        })
      }
    }

    // Sort by month (ascending: 1-12)
    allMonths.sort((a, b) => a.month - b.month)

    // Replace the details array with all months
    userEntryDetailsByYear.value.set(year, allMonths)
  })

  // Years are sorted in the computed property
}
</script>
