import { BODY_PART_OPTIONS, type WorkoutBodyPartOverview, type WorkoutPlan, type WorkoutStep, type WorkoutStepMode } from '../types/workout'

const TIME_STEP_SIZE = 5
const REP_STEP_SIZE = 1
const REP_ESTIMATED_SECONDS_PER_REP = 4

export function isTimedStep(step: WorkoutStep): boolean {
  return step.mode === 'time'
}

export function formatStepTarget(step: WorkoutStep): string {
  return step.mode === 'time' ? `${step.targetValue} sec` : `${step.targetValue} reps`
}

export function formatStepSummary(step: WorkoutStep): string {
  return `${step.seriesCount} series · ${formatStepTarget(step)} · ${step.restSeconds}s rest`
}

export function getEstimatedActiveSeconds(step: WorkoutStep): number {
  return step.mode === 'time' ? step.targetValue : step.targetValue * REP_ESTIMATED_SECONDS_PER_REP
}

export function getStepEstimatedTotalSeconds(step: WorkoutStep): number {
  return step.seriesCount * (getEstimatedActiveSeconds(step) + step.restSeconds)
}

export function getPlanOverview(plan: WorkoutPlan): WorkoutBodyPartOverview[] {
  const groupedOverview = new Map<WorkoutBodyPartOverview['bodyPart'], WorkoutBodyPartOverview>()

  for (const step of plan.steps) {
    const currentOverview = groupedOverview.get(step.bodyPart) ?? {
      bodyPart: step.bodyPart,
      exerciseCount: 0,
      totalSeriesCount: 0,
      estimatedTotalSeconds: 0,
    }

    currentOverview.exerciseCount += 1
    currentOverview.totalSeriesCount += step.seriesCount
    currentOverview.estimatedTotalSeconds += getStepEstimatedTotalSeconds(step)
    groupedOverview.set(step.bodyPart, currentOverview)
  }

  return BODY_PART_OPTIONS
    .map((bodyPart) => groupedOverview.get(bodyPart))
    .filter((overview): overview is WorkoutBodyPartOverview => overview !== undefined)
}

export function getPlanEstimatedTotalSeconds(plan: WorkoutPlan): number {
  return plan.steps.reduce((totalSeconds, step) => totalSeconds + getStepEstimatedTotalSeconds(step), 0)
}

export function getTargetStepSize(mode: WorkoutStepMode): number {
  return mode === 'time' ? TIME_STEP_SIZE : REP_STEP_SIZE
}

export function getDefaultTargetValue(mode: WorkoutStepMode): number {
  return mode === 'time' ? 30 : 10
}

export function clampTargetValue(mode: WorkoutStepMode, nextValue: number): number {
  if (mode === 'time') {
    return Math.max(10, Math.min(180, nextValue))
  }

  return Math.max(1, Math.min(100, nextValue))
}
