import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { clampTargetValue, getDefaultTargetValue, getTargetStepSize } from '../../core/workout/step-utils'
import type { BodyPart, ExerciseDefinition, WorkoutPlan, WorkoutStepMode } from '../../core/types/workout'
import {
  createCustomPlan,
  createCustomStep,
  createQuickTimerPlan,
  fetchPlansByBodyPart,
  getExerciseCatalog,
} from './service'

export const useWorkoutPlanStore = defineStore('workout-plan', () => {
  const plan = ref<WorkoutPlan | null>(null)
  const availablePlans = ref<WorkoutPlan[]>([])
  const availableExercises = ref<ExerciseDefinition[]>([])
  const isLoading = ref(false)
  const selectedBodyPart = ref<BodyPart>('Chest')

  const hasPlan = computed(() => plan.value !== null)
  const canReviewPlan = computed(() => (plan.value?.steps.length ?? 0) > 0)

  async function loadPlannerData(bodyPart: BodyPart): Promise<void> {
    isLoading.value = true
    selectedBodyPart.value = bodyPart
    availablePlans.value = await fetchPlansByBodyPart(bodyPart)
    availableExercises.value = getExerciseCatalog(bodyPart)
    isLoading.value = false
  }

  function ensureCustomPlan(): void {
    if (!plan.value || plan.value.source !== 'custom' || plan.value.bodyPart !== selectedBodyPart.value) {
      plan.value = createCustomPlan(selectedBodyPart.value)
    }
  }

  function selectPredefinedPlan(planId: string): void {
    const selectedPlan = availablePlans.value.find((candidate) => candidate.id === planId)
    if (!selectedPlan) {
      return
    }

    plan.value = {
      ...selectedPlan,
      steps: selectedPlan.steps.map((step) => ({ ...step })),
    }
  }

  function createCustomWorkout(): void {
    plan.value = createCustomPlan(selectedBodyPart.value)
  }

  function addExerciseToPlan(exerciseId: string): void {
    ensureCustomPlan()
    plan.value?.steps.push(createCustomStep(selectedBodyPart.value, exerciseId))
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
    availablePlans,
    availableExercises,
    isLoading,
    selectedBodyPart,
    hasPlan,
    canReviewPlan,
    loadPlannerData,
    selectPredefinedPlan,
    createCustomWorkout,
    addExerciseToPlan,
    removeStep,
    updateSeriesCount,
    setStepMode,
    updateStepTarget,
    createQuickStartPlan,
  }
})
