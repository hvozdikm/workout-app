import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import {
  createInitialCursor,
  getActiveSeconds,
  getRemainingExerciseSeconds,
  getRemainingWorkoutSeconds,
  getTotalWorkoutSeconds,
  isLastPhase,
  moveNext,
} from '../../core/session/session-engine'
import { formatSeconds } from '../../core/timer/countdown'
import { formatStepTarget, isTimedStep } from '../../core/workout/step-utils'
import { useWorkoutPlanStore } from '../workout-plan/store'

export const useWorkoutSessionStore = defineStore('workout-session', () => {
  const planStore = useWorkoutPlanStore()
  const stepIndex = ref(0)
  const seriesIndex = ref(0)
  const inRest = ref(false)
  const remainingSeconds = ref(0)
  const isRunning = ref(false)
  const isComplete = ref(false)

  let timerId: number | null = null

  const currentStep = computed(() => planStore.plan?.steps[stepIndex.value] ?? null)
  const currentSeries = computed(() => seriesIndex.value + 1)
  const totalSeries = computed(() => planStore.plan?.quickTimerSeriesCount ?? currentStep.value?.seriesCount ?? 0)
  const phase = computed(() => (inRest.value ? 'Rest' : 'Exercise'))
  const shouldAutoStart = computed(() => planStore.plan?.source !== 'quick-timer')
  const totalSeconds = computed(() => {
    if (!planStore.plan) {
      return 0
    }
    return getActiveSeconds(planStore.plan, {
      stepIndex: stepIndex.value,
      seriesIndex: seriesIndex.value,
      inRest: inRest.value,
    })
  })
  const isTimedPhase = computed(() => totalSeconds.value > 0)
  const currentTargetLabel = computed(() => {
    if (!currentStep.value) {
      return ''
    }
    return inRest.value ? `${currentStep.value.restSeconds} sec rest` : formatStepTarget(currentStep.value)
  })
  const activeClock = computed(() => formatSeconds(remainingSeconds.value))
  const progressValue = computed(() => {
    if (!isTimedPhase.value || totalSeconds.value <= 0) {
      return 0
    }
    return (totalSeconds.value - remainingSeconds.value) / totalSeconds.value
  })
  const remainingExerciseSeconds = computed(() => {
    if (!planStore.plan) {
      return 0
    }
    return getRemainingExerciseSeconds(
      planStore.plan,
      { stepIndex: stepIndex.value, seriesIndex: seriesIndex.value, inRest: inRest.value },
      remainingSeconds.value,
    )
  })
  const remainingWorkoutSeconds = computed(() => {
    if (!planStore.plan) {
      return 0
    }
    return getRemainingWorkoutSeconds(
      planStore.plan,
      { stepIndex: stepIndex.value, seriesIndex: seriesIndex.value, inRest: inRest.value },
      remainingSeconds.value,
    )
  })
  const totalWorkoutSeconds = computed(() => (planStore.plan ? getTotalWorkoutSeconds(planStore.plan) : 0))
  const elapsedWorkoutSeconds = computed(() => Math.max(0, totalWorkoutSeconds.value - remainingWorkoutSeconds.value))
  const elapsedWorkoutClock = computed(() => formatSeconds(elapsedWorkoutSeconds.value))
  const totalWorkoutClock = computed(() => formatSeconds(totalWorkoutSeconds.value))
  const wholeWorkoutProgressValue = computed(() => {
    if (totalWorkoutSeconds.value <= 0) {
      return 0
    }
    return (totalWorkoutSeconds.value - remainingWorkoutSeconds.value) / totalWorkoutSeconds.value
  })
  const workoutProgressValue = computed(() => {
    if (totalWorkoutSeconds.value <= 0) {
      return 0
    }
    return elapsedWorkoutSeconds.value / totalWorkoutSeconds.value
  })
  const remainingExerciseClock = computed(() => formatSeconds(remainingExerciseSeconds.value))
  const remainingWorkoutClock = computed(() => formatSeconds(remainingWorkoutSeconds.value))
  const requiresManualCompletion = computed(() => !!currentStep.value && !inRest.value && !isTimedStep(currentStep.value))

  function syncRemaining(): void {
    remainingSeconds.value = totalSeconds.value
  }

  function clearTimer(): void {
    if (timerId !== null) {
      window.clearInterval(timerId)
      timerId = null
    }
    isRunning.value = false
  }

  function advancePhase(): void {
    if (!planStore.plan) {
      clearTimer()
      return
    }

    const cursor = { stepIndex: stepIndex.value, seriesIndex: seriesIndex.value, inRest: inRest.value }
    if (isLastPhase(planStore.plan, cursor)) {
      isComplete.value = true
      clearTimer()
      remainingSeconds.value = 0
      return
    }

    const nextCursor = moveNext(planStore.plan, cursor)
    stepIndex.value = nextCursor.stepIndex
    seriesIndex.value = nextCursor.seriesIndex
    inRest.value = nextCursor.inRest
    syncRemaining()

    if (totalSeconds.value <= 0) {
      clearTimer()
    }
  }

  function tick(): void {
    if (remainingSeconds.value > 1) {
      remainingSeconds.value -= 1
      return
    }

    advancePhase()
  }

  function start(): void {
    if (!planStore.plan || isComplete.value || totalSeconds.value <= 0) {
      return
    }
    if (timerId !== null) {
      return
    }

    if (remainingSeconds.value <= 0) {
      syncRemaining()
    }

    isRunning.value = true
    timerId = window.setInterval(tick, 1000)
  }

  function pause(): void {
    clearTimer()
  }

  function initialize(): void {
    clearTimer()
    const initialCursor = createInitialCursor()
    stepIndex.value = initialCursor.stepIndex
    seriesIndex.value = initialCursor.seriesIndex
    inRest.value = initialCursor.inRest
    isComplete.value = false
    syncRemaining()
  }

  function next(): void {
    if (!planStore.plan) {
      return
    }

    advancePhase()

    if (!isComplete.value && totalSeconds.value > 0) {
      start()
    }
  }

  function reset(): void {
    initialize()
  }

  return {
    currentStep,
    currentSeries,
    totalSeries,
    phase,
    currentTargetLabel,
    activeClock,
    progressValue,
    remainingExerciseClock,
    remainingWorkoutClock,
    totalWorkoutSeconds,
    elapsedWorkoutSeconds,
    elapsedWorkoutClock,
    totalWorkoutClock,
    wholeWorkoutProgressValue,
    workoutProgressValue,
    remainingSeconds,
    totalSeconds,
    isTimedPhase,
    requiresManualCompletion,
    shouldAutoStart,
    isRunning,
    isComplete,
    initialize,
    start,
    pause,
    next,
    reset,
  }
})
