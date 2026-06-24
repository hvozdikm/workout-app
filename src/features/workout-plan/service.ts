import type { BodyPart, ExerciseDefinition, WorkoutPlan, WorkoutStep, WorkoutStepMode } from '../../core/types/workout'

const exerciseCatalog: Record<BodyPart, ExerciseDefinition[]> = {
  Chest: [
    { id: 'push-ups', name: 'Push-ups', bodyPart: 'Chest', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 20 },
    { id: 'bench-press', name: 'Dumbbell Bench Press', bodyPart: 'Chest', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 30 },
    { id: 'incline-push-ups', name: 'Incline Push-ups', bodyPart: 'Chest', defaultMode: 'time', defaultTargetValue: 35, defaultRestSeconds: 20 },
    { id: 'chest-fly', name: 'Chest Fly', bodyPart: 'Chest', defaultMode: 'repetitions', defaultTargetValue: 10, defaultRestSeconds: 25 },
  ],
  Back: [
    { id: 'rows', name: 'Bent-over Rows', bodyPart: 'Back', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 30 },
    { id: 'superman', name: 'Superman Holds', bodyPart: 'Back', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 20 },
    { id: 'reverse-fly', name: 'Reverse Flys', bodyPart: 'Back', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'bird-dog', name: 'Bird Dog', bodyPart: 'Back', defaultMode: 'time', defaultTargetValue: 35, defaultRestSeconds: 20 },
  ],
  Shoulders: [
    { id: 'press', name: 'Shoulder Press', bodyPart: 'Shoulders', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 30 },
    { id: 'lateral-raise', name: 'Lateral Raises', bodyPart: 'Shoulders', defaultMode: 'repetitions', defaultTargetValue: 15, defaultRestSeconds: 25 },
    { id: 'front-raise', name: 'Front Raises', bodyPart: 'Shoulders', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'arm-circles', name: 'Arm Circles', bodyPart: 'Shoulders', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 15 },
  ],
  Legs: [
    { id: 'squats', name: 'Bodyweight Squats', bodyPart: 'Legs', defaultMode: 'repetitions', defaultTargetValue: 15, defaultRestSeconds: 30 },
    { id: 'lunges', name: 'Alternating Lunges', bodyPart: 'Legs', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'wall-sit', name: 'Wall Sit', bodyPart: 'Legs', defaultMode: 'time', defaultTargetValue: 35, defaultRestSeconds: 25 },
    { id: 'calf-raises', name: 'Calf Raises', bodyPart: 'Legs', defaultMode: 'repetitions', defaultTargetValue: 20, defaultRestSeconds: 20 },
  ],
  Abs: [
    { id: 'crunches', name: 'Crunches', bodyPart: 'Abs', defaultMode: 'repetitions', defaultTargetValue: 15, defaultRestSeconds: 20 },
    { id: 'plank', name: 'Plank', bodyPart: 'Abs', defaultMode: 'time', defaultTargetValue: 35, defaultRestSeconds: 20 },
    { id: 'mountain-climbers', name: 'Mountain Climbers', bodyPart: 'Abs', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 20 },
    { id: 'leg-raises', name: 'Leg Raises', bodyPart: 'Abs', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 20 },
  ],
  Biceps: [
    { id: 'curls', name: 'Dumbbell Curls', bodyPart: 'Biceps', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'hammer-curls', name: 'Hammer Curls', bodyPart: 'Biceps', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'curl-hold', name: 'Curl Hold', bodyPart: 'Biceps', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 20 },
    { id: 'band-curls', name: 'Band Curls', bodyPart: 'Biceps', defaultMode: 'repetitions', defaultTargetValue: 15, defaultRestSeconds: 20 },
  ],
  Triceps: [
    { id: 'dips', name: 'Chair Dips', bodyPart: 'Triceps', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'extensions', name: 'Overhead Extensions', bodyPart: 'Triceps', defaultMode: 'repetitions', defaultTargetValue: 12, defaultRestSeconds: 25 },
    { id: 'close-grip', name: 'Close-grip Push-ups', bodyPart: 'Triceps', defaultMode: 'repetitions', defaultTargetValue: 10, defaultRestSeconds: 20 },
    { id: 'triceps-hold', name: 'Triceps Hold', bodyPart: 'Triceps', defaultMode: 'time', defaultTargetValue: 30, defaultRestSeconds: 20 },
  ],
}

interface StepBlueprint {
  exerciseId: string
  seriesCount: number
  mode?: WorkoutStepMode
  targetValue?: number
  restSeconds?: number
}

function createStep(definition: ExerciseDefinition, overrides: StepBlueprint): WorkoutStep {
  return {
    id: `${definition.id}-${Math.random().toString(36).slice(2, 8)}`,
    exerciseId: definition.id,
    name: definition.name,
    bodyPart: definition.bodyPart,
    seriesCount: overrides.seriesCount,
    mode: overrides.mode ?? definition.defaultMode,
    targetValue: overrides.targetValue ?? definition.defaultTargetValue,
    restSeconds: overrides.restSeconds ?? definition.defaultRestSeconds,
  }
}

export function getExerciseCatalog(bodyPart: BodyPart): ExerciseDefinition[] {
  return exerciseCatalog[bodyPart].map((exercise) => ({ ...exercise }))
}

export function createManualPlan(): WorkoutPlan {
  return {
    id: 'manual-plan',
    title: 'Manual Workout Plan',
    source: 'manual',
    steps: [],
  }
}

export function createManualStep(bodyPart: BodyPart, exerciseId: string): WorkoutStep {
  const definition = exerciseCatalog[bodyPart].find((candidate) => candidate.id === exerciseId)
  if (!definition) {
    throw new Error(`Missing exercise definition for ${exerciseId}`)
  }

  return createStep(definition, {
    exerciseId,
    seriesCount: 1,
  })
}

export function calculateQuickTimerSeriesByDuration(
  totalWorkoutSeconds: number,
  exerciseSeconds: number,
  restSeconds: number,
): number {
  const cycleSeconds = Math.max(1, exerciseSeconds + restSeconds)
  return Math.max(1, Math.round(totalWorkoutSeconds / cycleSeconds))
}

export function getQuickTimerTotalSeconds(seriesCount: number, exerciseSeconds: number, restSeconds: number): number {
  return seriesCount * Math.max(1, exerciseSeconds + restSeconds)
}

export function createQuickTimerPlan(
  bodyPart: BodyPart,
  exerciseSeconds: number,
  restSeconds: number,
  seriesCount: number,
  targetDurationSeconds?: number,
): WorkoutPlan {
  return {
    id: `quick-timer-${bodyPart.toLowerCase()}`,
    title: 'Quick Timer',
    source: 'quick-timer',
    quickTimerSeriesCount: Math.max(1, seriesCount),
    quickTimerTargetDurationSeconds: targetDurationSeconds,
    steps: [
      {
        id: 'quick-timer-step',
        exerciseId: 'quick-timer-step',
        name: 'Free Workout Interval',
        bodyPart,
        seriesCount: Math.max(1, seriesCount),
        mode: 'time',
        targetValue: exerciseSeconds,
        restSeconds,
      },
    ],
  }
}
