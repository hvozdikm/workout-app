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
          <ion-card-title>Build for {{ selectedBodyPart }}</ion-card-title>
          <ion-card-subtitle>Choose a predefined plan or create your own from the exercise list.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="planner-top">
          <ion-item>
            <ion-label position="stacked">Body part</ion-label>
            <ion-select v-model="selectedBodyPart" interface="popover">
              <ion-select-option v-for="bodyPart in bodyPartOptions" :key="bodyPart" :value="bodyPart">
                {{ bodyPart }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-segment v-model="plannerMode">
            <ion-segment-button value="predefined">
              <ion-label>Predefined</ion-label>
            </ion-segment-button>
            <ion-segment-button value="custom">
              <ion-label>Build your own</ion-label>
            </ion-segment-button>
          </ion-segment>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="planStore.hasPlan && planStore.plan?.source !== 'quick-timer'">
        <ion-card-header>
          <ion-card-title>Current selection</ion-card-title>
          <ion-card-subtitle>{{ planStore.plan?.title }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-button expand="block" fill="outline" :disabled="!planStore.canReviewPlan" @click="reviewCurrentPlan">
            Review Current Plan
          </ion-button>
        </ion-card-content>
      </ion-card>

      <template v-if="plannerMode === 'predefined'">
        <ion-card v-for="predefinedPlan in planStore.availablePlans" :key="predefinedPlan.id">
          <ion-card-header>
            <ion-card-title>{{ predefinedPlan.title }}</ion-card-title>
            <ion-card-subtitle>{{ predefinedPlan.steps.length }} exercises</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content class="plan-card">
            <ion-list inset>
              <ion-item v-for="step in predefinedPlan.steps" :key="step.id">
                <ion-label>
                  <h3>{{ step.name }}</h3>
                  <p>{{ formatStepSummary(step) }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-button expand="block" @click="reviewPredefinedPlan(predefinedPlan.id)">Review Plan</ion-button>
          </ion-card-content>
        </ion-card>
      </template>

      <template v-else>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Exercise list</ion-card-title>
            <ion-card-subtitle>Add exercises to your own plan.</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list inset>
              <ion-item v-for="exercise in planStore.availableExercises" :key="exercise.id">
                <ion-label>
                  <h3>{{ exercise.name }}</h3>
                  <p>Default: {{ exercise.defaultMode === 'time' ? `${exercise.defaultTargetValue} sec` : `${exercise.defaultTargetValue} reps` }}</p>
                </ion-label>
                <ion-button slot="end" fill="outline" @click="planStore.addExerciseToPlan(exercise.id)">Add</ion-button>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ planStore.plan?.title ?? `Custom ${selectedBodyPart} Plan` }}</ion-card-title>
            <ion-card-subtitle>Set series, choose time or reps, then review the plan.</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p v-if="!planStore.canReviewPlan" class="empty-message">No exercises added yet.</p>
            <div v-for="step in planStore.plan?.steps ?? []" :key="step.id" class="custom-step">
              <div class="custom-step__header">
                <strong>{{ step.name }}</strong>
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
                <span>Target</span>
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
              <p class="rest-copy">Rest: {{ step.restSeconds }} sec</p>
            </div>
            <ion-button expand="block" :disabled="!planStore.canReviewPlan" @click="reviewCustomPlan">
              Review Custom Plan
            </ion-button>
          </ion-card-content>
        </ion-card>
      </template>
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
import { ref, watch } from 'vue'

import { BODY_PART_OPTIONS, type BodyPart } from '../../../core/types/workout'
import { formatStepSummary, formatStepTarget } from '../../../core/workout/step-utils'
import { useWorkoutPlanStore } from '../store'

const router = useIonRouter()
const planStore = useWorkoutPlanStore()
const bodyPartOptions = BODY_PART_OPTIONS
const selectedBodyPart = ref<BodyPart>(planStore.selectedBodyPart)
const plannerMode = ref<'predefined' | 'custom'>('predefined')

watch(selectedBodyPart, async (bodyPart) => {
  await planStore.loadPlannerData(bodyPart)
  if (plannerMode.value === 'custom') {
    planStore.createCustomWorkout()
  }
})

watch(plannerMode, (mode) => {
  if (mode === 'custom') {
    planStore.createCustomWorkout()
  }
})

onIonViewWillEnter(async () => {
  await planStore.loadPlannerData(selectedBodyPart.value)
})

function reviewPredefinedPlan(planId: string): void {
  planStore.selectPredefinedPlan(planId)
  router.push('/tabs/summary')
}

function reviewCustomPlan(): void {
  router.push('/tabs/summary')
}

function reviewCurrentPlan(): void {
  router.push('/tabs/summary')
}
</script>

<style scoped>
.planner-top,
.plan-card {
  display: grid;
  gap: 1rem;
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

.rest-copy,
.empty-message {
  margin: 0;
  color: var(--ion-color-medium);
}
</style>
