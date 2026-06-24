<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Timer Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Default exercise seconds</ion-label>
        <ion-input v-model.number="settingsStore.defaultExerciseSeconds" type="number" min="5" />
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Default rest seconds</ion-label>
        <ion-input v-model.number="settingsStore.defaultRestSeconds" type="number" min="5" />
      </ion-item>
      <ion-button expand="block" class="ion-margin-top" @click="onSave">Save</ion-button>
      <ion-button expand="block" fill="clear" router-link="/tabs/today">Back to Today</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { onMounted } from 'vue'

import { useSettingsStore } from '../store'

const settingsStore = useSettingsStore()

onMounted(async () => {
  await settingsStore.load()
})

async function onSave(): Promise<void> {
  await settingsStore.save()
}
</script>
