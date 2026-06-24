import { Preferences } from '@capacitor/preferences'

export interface WorkoutPreferences {
  defaultExerciseSeconds: number
  defaultRestSeconds: number
}

const PREFERENCES_KEY = 'workout-preferences'

const DEFAULT_PREFERENCES: WorkoutPreferences = {
  defaultExerciseSeconds: 45,
  defaultRestSeconds: 20,
}

export async function loadPreferences(): Promise<WorkoutPreferences> {
  const result = await Preferences.get({ key: PREFERENCES_KEY })
  if (!result.value) {
    return DEFAULT_PREFERENCES
  }
  const parsed = JSON.parse(result.value) as Partial<WorkoutPreferences>
  return {
    defaultExerciseSeconds: parsed.defaultExerciseSeconds ?? DEFAULT_PREFERENCES.defaultExerciseSeconds,
    defaultRestSeconds: parsed.defaultRestSeconds ?? DEFAULT_PREFERENCES.defaultRestSeconds,
  }
}

export async function savePreferences(preferences: WorkoutPreferences): Promise<void> {
  await Preferences.set({
    key: PREFERENCES_KEY,
    value: JSON.stringify(preferences),
  })
}
