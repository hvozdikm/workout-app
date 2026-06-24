export const BODY_PART_OPTIONS = ['Chest', 'Back', 'Shoulders', 'Legs', 'Abs', 'Biceps', 'Triceps'] as const

export type BodyPart = (typeof BODY_PART_OPTIONS)[number]

export const WORKOUT_STEP_MODES = ['time', 'repetitions'] as const

export type WorkoutStepMode = (typeof WORKOUT_STEP_MODES)[number]

export type WorkoutPlanSource = 'quick-timer' | 'manual'

export interface WorkoutStep {
  id: string
  exerciseId: string
  name: string
  bodyPart: BodyPart
  seriesCount: number
  mode: WorkoutStepMode
  targetValue: number
  restSeconds: number
}

export interface WorkoutPlan {
  id: string
  title: string
  source: WorkoutPlanSource
  steps: WorkoutStep[]
  quickTimerSeriesCount?: number
  quickTimerTargetDurationSeconds?: number
}

export interface WorkoutBodyPartOverview {
  bodyPart: BodyPart
  exerciseCount: number
  totalSeriesCount: number
  estimatedTotalSeconds: number
}

export interface ExerciseDefinition {
  id: string
  name: string
  bodyPart: BodyPart
  defaultMode: WorkoutStepMode
  defaultTargetValue: number
  defaultRestSeconds: number
}
