<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workout Start</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>How do you want to start?</ion-card-title>
          <ion-card-subtitle>
            Choose between a quick timer and the guided planner flow.
          </ion-card-subtitle>
        </ion-card-header>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Just start the timer</ion-card-title>
          <ion-card-subtitle>Set your quick timer first, then start when you are ready.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="quick-timer-card">
          <ion-segment v-model="quickTimerMode">
            <ion-segment-button value="series">
              <ion-label>By series</ion-label>
            </ion-segment-button>
            <ion-segment-button value="duration">
              <ion-label>By total time</ion-label>
            </ion-segment-button>
          </ion-segment>

          <div class="stepper-row">
            <span>Exercise</span>
            <div class="stepper-control">
              <ion-button fill="outline" size="small" @click="changeExerciseSeconds(-5)">-</ion-button>
              <div class="numeric-input">
                <ion-input
                  :value="exerciseSeconds"
                  inputmode="numeric"
                  type="number"
                  min="10"
                  max="300"
                  @ionInput="setExerciseSeconds($event)"
                />
                <span>sec</span>
              </div>
              <ion-button fill="outline" size="small" @click="changeExerciseSeconds(5)">+</ion-button>
            </div>
          </div>

          <div class="stepper-row">
            <span>Rest</span>
            <div class="stepper-control">
              <ion-button fill="outline" size="small" @click="changeRestSeconds(-5)">-</ion-button>
              <div class="numeric-input">
                <ion-input
                  :value="restSeconds"
                  inputmode="numeric"
                  type="number"
                  min="5"
                  max="180"
                  @ionInput="setRestSeconds($event)"
                />
                <span>sec</span>
              </div>
              <ion-button fill="outline" size="small" @click="changeRestSeconds(5)">+</ion-button>
            </div>
          </div>

          <div v-if="quickTimerMode === 'series'" class="stepper-row">
            <span>Series</span>
            <div class="stepper-control">
              <ion-button fill="outline" size="small" @click="changeSeriesCount(-1)">-</ion-button>
              <div class="numeric-input">
                <ion-input
                  :value="seriesCount"
                  inputmode="numeric"
                  type="number"
                  min="1"
                  max="50"
                  @ionInput="setSeriesCount($event)"
                />
              </div>
              <ion-button fill="outline" size="small" @click="changeSeriesCount(1)">+</ion-button>
            </div>
          </div>

          <div v-else class="stepper-row">
            <span>Total workout</span>
            <div class="stepper-control">
              <ion-button fill="outline" size="small" @click="changeTargetDurationSeconds(-60)">-</ion-button>
              <div class="numeric-input">
                <ion-input
                  :value="targetDurationMinutes"
                  inputmode="numeric"
                  type="number"
                  min="5"
                  max="180"
                  @ionInput="setTargetDurationMinutes($event)"
                />
                <span>min</span>
              </div>
              <ion-button fill="outline" size="small" @click="changeTargetDurationSeconds(60)">+</ion-button>
            </div>
          </div>

          <p class="quick-timer-details">
            {{ derivedSeriesCount }} series · estimated total {{ estimatedWorkoutClock }}
          </p>
          <ion-button expand="block" @click="startQuickTimer">Open Quick Timer</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Build a workout plan</ion-card-title>
          <ion-card-subtitle>
            Pick body parts, add exercises manually, and preview the overview before you start.
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-button expand="block" @click="openPlanner">Open Planner</ion-button>
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue'
import type { InputCustomEvent } from '@ionic/vue'
import { computed, ref } from 'vue'

import { formatSeconds } from '../../../core/timer/countdown'
import { useSettingsStore } from '../../settings/store'
import { calculateQuickTimerSeriesByDuration, getQuickTimerTotalSeconds } from '../service'
import { useWorkoutPlanStore } from '../store'

const router = useIonRouter()
const planStore = useWorkoutPlanStore()
const settingsStore = useSettingsStore()
const quickTimerMode = ref<'series' | 'duration'>('series')
const exerciseSeconds = ref(45)
const restSeconds = ref(20)
const seriesCount = ref(5)
const targetDurationSeconds = ref(20 * 60)

const targetDurationMinutes = computed(() => Math.round(targetDurationSeconds.value / 60))
const derivedSeriesCount = computed(() =>
  quickTimerMode.value === 'series'
    ? seriesCount.value
    : calculateQuickTimerSeriesByDuration(targetDurationSeconds.value, exerciseSeconds.value, restSeconds.value),
)
const estimatedWorkoutClock = computed(() =>
  formatSeconds(getQuickTimerTotalSeconds(derivedSeriesCount.value, exerciseSeconds.value, restSeconds.value)),
)

onIonViewWillEnter(async () => {
  await settingsStore.load()
  exerciseSeconds.value = settingsStore.defaultExerciseSeconds
  restSeconds.value = settingsStore.defaultRestSeconds
})

async function openPlanner(): Promise<void> {
  await planStore.loadPlannerData(planStore.selectedBodyPart)
  planStore.prepareManualWorkout()
  router.push('/tabs/planner')
}

function startQuickTimer(): void {
  planStore.createQuickStartPlan(
    exerciseSeconds.value,
    restSeconds.value,
    derivedSeriesCount.value,
    quickTimerMode.value === 'duration' ? targetDurationSeconds.value : undefined,
  )
  router.push('/tabs/session')
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function changeExerciseSeconds(delta: number): void {
  exerciseSeconds.value = clamp(exerciseSeconds.value + delta, 10, 300)
}

function changeRestSeconds(delta: number): void {
  restSeconds.value = clamp(restSeconds.value + delta, 5, 180)
}

function changeSeriesCount(delta: number): void {
  seriesCount.value = clamp(seriesCount.value + delta, 1, 50)
}

function changeTargetDurationSeconds(delta: number): void {
  targetDurationSeconds.value = clamp(targetDurationSeconds.value + delta, 5 * 60, 3 * 60 * 60)
}

function parseNumericInput(event: InputCustomEvent, min: number, max: number): number | null {
  const rawValue = event.detail.value
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null
  }

  const nextValue = Number(rawValue)
  if (Number.isNaN(nextValue)) {
    return null
  }

  return clamp(Math.round(nextValue), min, max)
}

function setExerciseSeconds(event: InputCustomEvent): void {
  const nextValue = parseNumericInput(event, 10, 300)
  if (nextValue !== null) {
    exerciseSeconds.value = nextValue
  }
}

function setRestSeconds(event: InputCustomEvent): void {
  const nextValue = parseNumericInput(event, 5, 180)
  if (nextValue !== null) {
    restSeconds.value = nextValue
  }
}

function setSeriesCount(event: InputCustomEvent): void {
  const nextValue = parseNumericInput(event, 1, 50)
  if (nextValue !== null) {
    seriesCount.value = nextValue
  }
}

function setTargetDurationMinutes(event: InputCustomEvent): void {
  const nextValue = parseNumericInput(event, 5, 180)
  if (nextValue !== null) {
    targetDurationSeconds.value = nextValue * 60
  }
}
</script>

<style scoped>
.quick-timer-card {
  display: grid;
  gap: 0.75rem;
}

.stepper-row,
.stepper-control {
  display: flex;
  align-items: center;
}

.stepper-row {
  justify-content: space-between;
  gap: 1rem;
}

.stepper-control {
  gap: 0.5rem;
}

.numeric-input {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 6.5rem;
}

.numeric-input ion-input {
  width: 4rem;
  --padding-start: 0.4rem;
  --padding-end: 0.4rem;
  --padding-top: 0.35rem;
  --padding-bottom: 0.35rem;
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 8px;
  text-align: center;
}

.quick-timer-details {
  margin: 0;
  color: var(--ion-color-medium);
}
</style>
