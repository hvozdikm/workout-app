<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="today" href="/tabs/today">
          <ion-icon :icon="homeOutline" />
          <ion-label>Today</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="session" href="/tabs/session">
          <ion-icon :icon="barbellOutline" />
          <ion-label>Session</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/tabs/settings">
          <ion-icon :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue'
import { barbellOutline, homeOutline, settingsOutline } from 'ionicons/icons'
</script>
