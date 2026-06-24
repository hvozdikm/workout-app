<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workout Planner</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Build your workout</ion-card-title>
          <ion-card-subtitle>Pick a body part, add exercises manually, then preview the selected exercises and total time.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Body part</ion-label>
            <ion-select v-model="selectedBodyPart" interface="popover">
              <ion-select-option v-for="bodyPart in bodyPartOptions" :key="bodyPart" :value="bodyPart">
                {{ bodyPart }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ selectedBodyPart }} exercises</ion-card-title>
          <ion-card-subtitle>Added exercises move to the top and can only be selected once.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list inset>
            <ion-item
              v-for="exercise in orderedExercises"
              :key="exercise.id"
              :class="{ 'exercise-item--selected': isExerciseSelected(exercise.id) }"
            >
              <ion-label>
                <h3>{{ exercise.name }}</h3>
                <p>
                  Default: {{ exercise.defaultMode === 'time' ? `${exercise.defaultTargetValue} sec` : `${exercise.defaultTargetValue} reps` }}
                  <span v-if="isExerciseSelected(exercise.id)"> · Added</span>
                </p>
              </ion-label>
              <ion-button
                slot="end"
                fill="outline"
                :color="isExerciseSelected(exercise.id) ? 'danger' : undefined"
                @click="toggleExerciseSelection(exercise.id)"
              >
                {{ isExerciseSelected(exercise.id) ? 'Remove' : 'Add' }}
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Selected exercises</ion-card-title>
          <ion-card-subtitle>Adjust the time or reps and the number of series for each exercise. Estimated total: {{ estimatedTotalClock }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p v-if="!planStore.canReviewPlan" class="secondary-copy">No exercises added yet.</p>
          <div v-for="step in planStore.plan?.steps ?? []" :key="step.id" class="custom-step">
            <div class="custom-step__header">
              <div>
                <strong>{{ step.name }}</strong>
                <p class="secondary-copy">{{ step.bodyPart }} · {{ step.restSeconds }}s rest</p>
              </div>
              <ion-button color="danger" fill="clear" size="small" @click="planStore.removeStep(step.id)">Remove</ion-button>
            </div>
            <ion-segment :value="step.mode" @ionChange="planStore.setStepMode(step.id, $event.detail.value as 'time' | 'repetitions')">
              <ion-segment-button value="time">
                <ion-label>Time</ion-label>
              </ion-segment-button>
              <ion-segment-button value="repetitions">
                <ion-label>Reps</ion-label>
              </ion-segment-button>
            </ion-segment>
            <div class="stepper-row">
              <span>{{ step.mode === 'time' ? 'Time' : 'Repetitions' }}</span>
              <div class="stepper-control">
                <ion-button fill="outline" size="small" @click="planStore.updateStepTarget(step.id, -1)">-</ion-button>
                <span>{{ formatStepTarget(step) }}</span>
                <ion-button fill="outline" size="small" @click="planStore.updateStepTarget(step.id, 1)">+</ion-button>
              </div>
            </div>
            <div class="stepper-row">
              <span>Series</span>
              <div class="stepper-control">
                <ion-button fill="outline" size="small" @click="planStore.updateSeriesCount(step.id, -1)">-</ion-button>
                <span>{{ step.seriesCount }}</span>
                <ion-button fill="outline" size="small" @click="planStore.updateSeriesCount(step.id, 1)">+</ion-button>
              </div>
            </div>
          </div>
          <ion-button expand="block" :disabled="!planStore.canReviewPlan" @click="reviewCurrentPlan">
            Preview Workout
          </ion-button>
          <ion-button v-if="planStore.canReviewPlan" expand="block" fill="outline" color="medium" @click="planStore.createManualWorkout()">
            Clear Plan
          </ion-button>
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
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue'
import { computed, ref, watch } from 'vue'

import { formatSeconds } from '../../../core/timer/countdown'
import { BODY_PART_OPTIONS, type BodyPart, type ExerciseDefinition } from '../../../core/types/workout'
import { formatStepTarget } from '../../../core/workout/step-utils'
import { useWorkoutPlanStore } from '../store'

const router = useIonRouter()
const planStore = useWorkoutPlanStore()
const bodyPartOptions = BODY_PART_OPTIONS
const selectedBodyPart = ref<BodyPart>(planStore.selectedBodyPart)
const estimatedTotalClock = computed(() => formatSeconds(planStore.estimatedTotalSeconds))
const orderedExercises = computed<ExerciseDefinition[]>(() => {
  const selectedExercises: ExerciseDefinition[] = []
  const unselectedExercises: ExerciseDefinition[] = []

  for (const exercise of planStore.availableExercises) {
    if (planStore.isExerciseSelected(exercise.id)) {
      selectedExercises.push(exercise)
      continue
    }

    unselectedExercises.push(exercise)
  }

  return [...selectedExercises, ...unselectedExercises]
})

watch(selectedBodyPart, async (bodyPart) => {
  await planStore.loadPlannerData(bodyPart)
})

onIonViewWillEnter(async () => {
  await planStore.loadPlannerData(selectedBodyPart.value)
  planStore.prepareManualWorkout()
})

function reviewCurrentPlan(): void {
  router.push('/tabs/summary')
}

function isExerciseSelected(exerciseId: string): boolean {
  return planStore.isExerciseSelected(exerciseId)
}

function toggleExerciseSelection(exerciseId: string): void {
  if (planStore.isExerciseSelected(exerciseId)) {
    planStore.removeExerciseFromPlan(exerciseId)
    return
  }

  planStore.addExerciseToPlan(exerciseId)
}
</script>

<style scoped>
.exercise-item--selected {
  --background: color-mix(in srgb, var(--ion-color-success) 10%, transparent);
}

.exercise-item--selected ion-label h3 {
  color: var(--ion-color-success-shade);
}

.custom-step {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--ion-color-light-shade);
}

.custom-step:last-of-type {
  margin-bottom: 1rem;
}

.custom-step__header,
.stepper-row,
.stepper-control {
  display: flex;
  align-items: center;
}

.custom-step__header,
.stepper-row {
  justify-content: space-between;
  gap: 1rem;
}

.stepper-control {
  gap: 0.5rem;
}

.secondary-copy {
  margin: 0;
  color: var(--ion-color-medium);
}
</style>
