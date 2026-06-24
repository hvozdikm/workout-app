import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  clampTargetValue,
  getDefaultTargetValue,
  getPlanEstimatedTotalSeconds,
  getPlanOverview,
  getTargetStepSize,
} from '../../core/workout/step-utils'
import type { BodyPart, ExerciseDefinition, WorkoutPlan, WorkoutStepMode } from '../../core/types/workout'
import {
  createManualPlan,
  createManualStep,
  createQuickTimerPlan,
  getExerciseCatalog,
} from './service'

export const useWorkoutPlanStore = defineStore('workout-plan', () => {
  const plan = ref<WorkoutPlan | null>(null)
  const availableExercises = ref<ExerciseDefinition[]>([])
  const isLoading = ref(false)
  const selectedBodyPart = ref<BodyPart>('Chest')

  const hasPlan = computed(() => plan.value !== null)
  const canReviewPlan = computed(() => (plan.value?.steps.length ?? 0) > 0)
  const planOverview = computed(() => (plan.value ? getPlanOverview(plan.value) : []))
  const estimatedTotalSeconds = computed(() => (plan.value ? getPlanEstimatedTotalSeconds(plan.value) : 0))
  const selectedExerciseIds = computed(() => new Set(plan.value?.steps.map((step) => step.exerciseId) ?? []))

  async function loadPlannerData(bodyPart: BodyPart): Promise<void> {
    isLoading.value = true
    selectedBodyPart.value = bodyPart
    availableExercises.value = getExerciseCatalog(bodyPart)
    isLoading.value = false
  }

  function ensureManualPlan(): void {
    if (!plan.value || plan.value.source !== 'manual') {
      plan.value = createManualPlan()
    }
  }

  function prepareManualWorkout(): void {
    ensureManualPlan()
  }

  function createManualWorkout(): void {
    plan.value = createManualPlan()
  }

  function addExerciseToPlan(exerciseId: string): void {
    ensureManualPlan()
    if (selectedExerciseIds.value.has(exerciseId)) {
      return
    }
    plan.value?.steps.push(createManualStep(selectedBodyPart.value, exerciseId))
  }

  function isExerciseSelected(exerciseId: string): boolean {
    return selectedExerciseIds.value.has(exerciseId)
  }

  function removeExerciseFromPlan(exerciseId: string): void {
    if (!plan.value) {
      return
    }

    plan.value.steps = plan.value.steps.filter((step) => step.exerciseId !== exerciseId)
  }

  function removeStep(stepId: string): void {
    if (!plan.value) {
      return
    }

    plan.value.steps = plan.value.steps.filter((step) => step.id !== stepId)
  }

  function updateSeriesCount(stepId: string, delta: number): void {
    if (!plan.value) {
      return
    }

    const step = plan.value.steps.find((candidate) => candidate.id === stepId)
    if (!step) {
      return
    }

    step.seriesCount = Math.max(1, Math.min(10, step.seriesCount + delta))
  }

  function setStepMode(stepId: string, mode: WorkoutStepMode): void {
    if (!plan.value) {
      return
    }

    const step = plan.value.steps.find((candidate) => candidate.id === stepId)
    if (!step || step.mode === mode) {
      return
    }

    step.mode = mode
    step.targetValue = getDefaultTargetValue(mode)
  }

  function updateStepTarget(stepId: string, direction: -1 | 1): void {
    if (!plan.value) {
      return
    }

    const step = plan.value.steps.find((candidate) => candidate.id === stepId)
    if (!step) {
      return
    }

    const nextValue = step.targetValue + getTargetStepSize(step.mode) * direction
    step.targetValue = clampTargetValue(step.mode, nextValue)
  }

  function createQuickStartPlan(
    exerciseSeconds: number,
    restSeconds: number,
    seriesCount: number,
    targetDurationSeconds?: number,
  ): void {
    plan.value = createQuickTimerPlan(
      selectedBodyPart.value,
      exerciseSeconds,
      restSeconds,
      seriesCount,
      targetDurationSeconds,
    )
  }

  return {
    plan,
    availableExercises,
    isLoading,
    selectedBodyPart,
    hasPlan,
    canReviewPlan,
    planOverview,
    estimatedTotalSeconds,
    selectedExerciseIds,
    loadPlannerData,
    prepareManualWorkout,
    createManualWorkout,
    addExerciseToPlan,
    isExerciseSelected,
    removeExerciseFromPlan,
    removeStep,
    updateSeriesCount,
    setStepMode,
    updateStepTarget,
    createQuickStartPlan,
  }
})
