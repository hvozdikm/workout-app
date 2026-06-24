import type { WorkoutStep, WorkoutStepMode } from '../types/workout'

const TIME_STEP_SIZE = 5
const REP_STEP_SIZE = 1

export function isTimedStep(step: WorkoutStep): boolean {
  return step.mode === 'time'
}

export function formatStepTarget(step: WorkoutStep): string {
  return step.mode === 'time' ? `${step.targetValue} sec` : `${step.targetValue} reps`
}

export function formatStepSummary(step: WorkoutStep): string {
  return `${step.seriesCount} series · ${formatStepTarget(step)} · ${step.restSeconds}s rest`
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
