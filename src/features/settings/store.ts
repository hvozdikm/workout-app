import { defineStore } from 'pinia'
import { ref } from 'vue'

import { loadPreferences, savePreferences } from '../../core/storage/preferences'

export const useSettingsStore = defineStore('settings', () => {
  const defaultExerciseSeconds = ref(45)
  const defaultRestSeconds = ref(20)

  async function load(): Promise<void> {
    const preferences = await loadPreferences()
    defaultExerciseSeconds.value = preferences.defaultExerciseSeconds
    defaultRestSeconds.value = preferences.defaultRestSeconds
  }

  async function save(): Promise<void> {
    await savePreferences({
      defaultExerciseSeconds: defaultExerciseSeconds.value,
      defaultRestSeconds: defaultRestSeconds.value,
    })
  }

  return {
    defaultExerciseSeconds,
    defaultRestSeconds,
    load,
    save,
  }
})
