<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Plan Summary</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card v-if="planStore.plan">
        <ion-card-header>
          <ion-card-title>{{ planStore.plan.title }}</ion-card-title>
          <ion-card-subtitle>{{ sourceLabel }} · {{ planStore.plan.bodyPart }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="summary-card">
          <ion-list inset>
            <ion-item v-for="(step, index) in planStore.plan.steps" :key="step.id">
              <ion-label>
                <h3>{{ index + 1 }}. {{ step.name }}</h3>
                <p>{{ formatStepSummary(step) }}</p>
                <p v-if="index < planStore.plan.steps.length - 1">Next: {{ planStore.plan.steps[index + 1].name }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-button expand="block" router-link="/tabs/session">Start Workout</ion-button>
          <ion-button expand="block" fill="outline" router-link="/tabs/planner">Edit Plan</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-card v-else>
        <ion-card-content>
          <p>No plan selected yet.</p>
          <ion-button expand="block" router-link="/tabs/planner">Go to Planner</ion-button>
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
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { computed } from 'vue'

import { formatStepSummary } from '../../../core/workout/step-utils'
import { useWorkoutPlanStore } from '../store'

const planStore = useWorkoutPlanStore()

const sourceLabel = computed(() => {
  switch (planStore.plan?.source) {
    case 'quick-timer':
      return 'Quick timer'
    case 'custom':
      return 'Custom plan'
    default:
      return 'Predefined plan'
  }
})
</script>

<style scoped>
.summary-card {
  display: grid;
  gap: 1rem;
}
</style>
