<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workout Session</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card v-if="sessionStore.currentStep">
        <ion-card-header>
          <ion-card-subtitle>{{ sessionStore.phase }}</ion-card-subtitle>
          <ion-card-title>{{ sessionStore.currentStep.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content class="session-card">
          <p class="session-series">Series {{ sessionStore.currentSeries }} of {{ sessionStore.totalSeries }}</p>
          <h1 class="session-clock">
            {{ sessionStore.isTimedPhase ? sessionStore.activeClock : sessionStore.currentTargetLabel }}
          </h1>
          <p class="session-caption">
            <template v-if="sessionStore.isTimedPhase">
              {{ sessionStore.remainingSeconds }} of {{ sessionStore.totalSeconds }} seconds remaining
            </template>
            <template v-else>
              Complete the set when you finish the target reps.
            </template>
          </p>
          <ion-progress-bar v-if="sessionStore.isTimedPhase" :value="sessionStore.progressValue" />
          <ion-list inset>
            <ion-item>
              <ion-label>
                <h3>Whole workout remaining</h3>
                <p>{{ sessionStore.remainingWorkoutClock }}</p>
                <ion-progress-bar class="whole-workout-progress" :value="sessionStore.wholeWorkoutProgressValue" />
              </ion-label>
            </ion-item>
          </ion-list>
          <p v-if="sessionStore.isComplete" class="session-complete">Workout complete.</p>
          <ion-button
            v-if="sessionStore.requiresManualCompletion && !sessionStore.isComplete"
            expand="block"
            @click="sessionStore.next"
          >
            Complete Set
          </ion-button>
          <ion-button
            v-else-if="!sessionStore.isComplete"
            expand="block"
            @click="sessionStore.isRunning ? sessionStore.pause() : sessionStore.start()"
          >
            {{ sessionStore.isRunning ? 'Pause Timer' : 'Start Timer' }}
          </ion-button>
          <ion-button v-if="!sessionStore.isComplete" expand="block" fill="outline" @click="sessionStore.next">
            Skip to Next
          </ion-button>
          <ion-button expand="block" fill="clear" @click="sessionStore.reset">Reset</ion-button>
        </ion-card-content>
      </ion-card>
      <ion-card v-else>
        <ion-card-content>
          <p>Choose a quick timer or build a workout plan first.</p>
          <ion-button expand="block" router-link="/tabs/today">Go to Start</ion-button>
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
  IonProgressBar,
  IonTitle,
  IonToolbar,
  onIonViewDidLeave,
  onIonViewWillEnter,
} from '@ionic/vue'

import { useWorkoutSessionStore } from '../store'

const sessionStore = useWorkoutSessionStore()

onIonViewWillEnter(() => {
  if (sessionStore.currentStep) {
    sessionStore.initialize()
    if (sessionStore.isTimedPhase && sessionStore.shouldAutoStart) {
      sessionStore.start()
    }
  }
})

onIonViewDidLeave(() => {
  sessionStore.pause()
})
</script>

<style scoped>
.session-card {
  display: grid;
  gap: 1rem;
}

.session-clock {
  margin: 0;
  font-size: 3rem;
  text-align: center;
}

.session-series,
.session-caption {
  margin: 0;
  text-align: center;
  color: var(--ion-color-medium);
}

.session-complete {
  margin: 0;
  text-align: center;
  font-weight: 600;
  color: var(--ion-color-success);
}

.whole-workout-progress {
  margin-top: 0.5rem;
}

</style>
