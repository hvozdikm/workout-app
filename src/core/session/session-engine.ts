import type { WorkoutPlan } from '../types/workout'
import { isTimedStep } from '../workout/step-utils'

export interface SessionCursor {
  stepIndex: number
  seriesIndex: number
  inRest: boolean
}

export function createInitialCursor(): SessionCursor {
  return {
    stepIndex: 0,
    seriesIndex: 0,
    inRest: false,
  }
}

export function getActiveSeconds(plan: WorkoutPlan, cursor: SessionCursor): number {
  const step = plan.steps[cursor.stepIndex]
  if (cursor.inRest) {
    return step.restSeconds
  }

  return isTimedStep(step) ? step.targetValue : 0
}

export function getRemainingExerciseSeconds(
  plan: WorkoutPlan,
  cursor: SessionCursor,
  currentPhaseRemainingSeconds: number,
): number {
  const step = plan.steps[cursor.stepIndex]
  let remainingSeconds = currentPhaseRemainingSeconds

  if (!cursor.inRest) {
    remainingSeconds += step.restSeconds
  }

  const activeSeconds = isTimedStep(step) ? step.targetValue : 0
  const remainingSeriesAfterCurrent = step.seriesCount - cursor.seriesIndex - 1
  const futureSeriesSeconds = remainingSeriesAfterCurrent * (activeSeconds + step.restSeconds)

  return remainingSeconds + futureSeriesSeconds
}

export function getRemainingWorkoutSeconds(
  plan: WorkoutPlan,
  cursor: SessionCursor,
  currentPhaseRemainingSeconds: number,
): number {
  let remainingSeconds = getRemainingExerciseSeconds(plan, cursor, currentPhaseRemainingSeconds)

  for (let index = cursor.stepIndex + 1; index < plan.steps.length; index += 1) {
    const step = plan.steps[index]
    const activeSeconds = isTimedStep(step) ? step.targetValue : 0
    remainingSeconds += step.seriesCount * (activeSeconds + step.restSeconds)
  }

  return remainingSeconds
}

export function getTotalWorkoutSeconds(plan: WorkoutPlan): number {
  let totalSeconds = 0

  for (const step of plan.steps) {
    const activeSeconds = isTimedStep(step) ? step.targetValue : 0
    totalSeconds += step.seriesCount * (activeSeconds + step.restSeconds)
  }

  return totalSeconds
}

export function moveNext(plan: WorkoutPlan, cursor: SessionCursor): SessionCursor {
  const step = plan.steps[cursor.stepIndex]
  const isLastStep = cursor.stepIndex >= plan.steps.length - 1
  const isLastSeries = cursor.seriesIndex >= step.seriesCount - 1

  if (!cursor.inRest) {
    return { ...cursor, inRest: true }
  }
  if (!isLastSeries) {
    return { ...cursor, seriesIndex: cursor.seriesIndex + 1, inRest: false }
  }
  if (isLastStep) {
    return cursor
  }
  return { stepIndex: cursor.stepIndex + 1, seriesIndex: 0, inRest: false }
}

export function isLastPhase(plan: WorkoutPlan, cursor: SessionCursor): boolean {
  const isLastStep = cursor.stepIndex >= plan.steps.length - 1
  const step = plan.steps[cursor.stepIndex]
  const isLastSeries = cursor.seriesIndex >= step.seriesCount - 1
  return isLastStep && isLastSeries && cursor.inRest
}
