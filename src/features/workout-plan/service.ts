import type { BodyPart, ExerciseDefinition, WorkoutPlan, WorkoutStep, WorkoutStepMode } from '../../core/types/workout'

interface StepBlueprint {
  exerciseId: string
  seriesCount: number
  mode?: WorkoutStepMode
  targetValue?: number
  restSeconds?: number
}

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

const planBlueprints: Record<BodyPart, Array<{ id: string; title: string; steps: StepBlueprint[] }>> = {
  Chest: [
    {
      id: 'chest-strength-builder',
      title: 'Chest Strength Builder',
      steps: [
        { exerciseId: 'bench-press', seriesCount: 4 },
        { exerciseId: 'push-ups', seriesCount: 3, mode: 'time', targetValue: 35 },
        { exerciseId: 'chest-fly', seriesCount: 3 },
      ],
    },
    {
      id: 'chest-quick-burn',
      title: 'Chest Quick Burn',
      steps: [
        { exerciseId: 'push-ups', seriesCount: 3, mode: 'time', targetValue: 30 },
        { exerciseId: 'incline-push-ups', seriesCount: 3, mode: 'time', targetValue: 35 },
      ],
    },
  ],
  Back: [
    {
      id: 'back-power-flow',
      title: 'Back Power Flow',
      steps: [
        { exerciseId: 'rows', seriesCount: 4 },
        { exerciseId: 'superman', seriesCount: 3 },
        { exerciseId: 'reverse-fly', seriesCount: 3 },
      ],
    },
    {
      id: 'back-posture-reset',
      title: 'Back Posture Reset',
      steps: [
        { exerciseId: 'bird-dog', seriesCount: 3, mode: 'time', targetValue: 35 },
        { exerciseId: 'superman', seriesCount: 3, mode: 'time', targetValue: 30 },
      ],
    },
  ],
  Shoulders: [
    {
      id: 'shoulder-stability-session',
      title: 'Shoulder Stability Session',
      steps: [
        { exerciseId: 'press', seriesCount: 4 },
        { exerciseId: 'lateral-raise', seriesCount: 3 },
        { exerciseId: 'front-raise', seriesCount: 3 },
      ],
    },
    {
      id: 'shoulder-mobility-burn',
      title: 'Shoulder Mobility Burn',
      steps: [
        { exerciseId: 'arm-circles', seriesCount: 3, mode: 'time', targetValue: 30 },
        { exerciseId: 'lateral-raise', seriesCount: 3, targetValue: 15 },
      ],
    },
  ],
  Legs: [
    {
      id: 'leg-day-builder',
      title: 'Leg Day Builder',
      steps: [
        { exerciseId: 'squats', seriesCount: 4 },
        { exerciseId: 'lunges', seriesCount: 3 },
        { exerciseId: 'wall-sit', seriesCount: 3 },
      ],
    },
    {
      id: 'leg-endurance-circuit',
      title: 'Leg Endurance Circuit',
      steps: [
        { exerciseId: 'wall-sit', seriesCount: 3, mode: 'time', targetValue: 35 },
        { exerciseId: 'calf-raises', seriesCount: 4, targetValue: 20 },
      ],
    },
  ],
  Abs: [
    {
      id: 'core-focus-circuit',
      title: 'Core Focus Circuit',
      steps: [
        { exerciseId: 'crunches', seriesCount: 3 },
        { exerciseId: 'plank', seriesCount: 3, mode: 'time', targetValue: 35 },
        { exerciseId: 'mountain-climbers', seriesCount: 4, mode: 'time', targetValue: 30 },
      ],
    },
    {
      id: 'abs-express-flow',
      title: 'Abs Express Flow',
      steps: [
        { exerciseId: 'leg-raises', seriesCount: 3 },
        { exerciseId: 'plank', seriesCount: 2, mode: 'time', targetValue: 30 },
      ],
    },
  ],
  Biceps: [
    {
      id: 'biceps-pump-session',
      title: 'Biceps Pump Session',
      steps: [
        { exerciseId: 'curls', seriesCount: 4 },
        { exerciseId: 'hammer-curls', seriesCount: 3 },
        { exerciseId: 'curl-hold', seriesCount: 2, mode: 'time', targetValue: 30 },
      ],
    },
    {
      id: 'biceps-express-pump',
      title: 'Biceps Express Pump',
      steps: [
        { exerciseId: 'band-curls', seriesCount: 3 },
        { exerciseId: 'curl-hold', seriesCount: 3, mode: 'time', targetValue: 30 },
      ],
    },
  ],
  Triceps: [
    {
      id: 'triceps-burn-session',
      title: 'Triceps Burn Session',
      steps: [
        { exerciseId: 'dips', seriesCount: 3 },
        { exerciseId: 'extensions', seriesCount: 4 },
        { exerciseId: 'close-grip', seriesCount: 3 },
      ],
    },
    {
      id: 'triceps-endurance-flow',
      title: 'Triceps Endurance Flow',
      steps: [
        { exerciseId: 'triceps-hold', seriesCount: 3, mode: 'time', targetValue: 30 },
        { exerciseId: 'dips', seriesCount: 3, targetValue: 10 },
      ],
    },
  ],
}

function createStep(definition: ExerciseDefinition, overrides: StepBlueprint): WorkoutStep {
  return {
    id: `${definition.id}-${Math.random().toString(36).slice(2, 8)}`,
    name: definition.name,
    seriesCount: overrides.seriesCount,
    mode: overrides.mode ?? definition.defaultMode,
    targetValue: overrides.targetValue ?? definition.defaultTargetValue,
    restSeconds: overrides.restSeconds ?? definition.defaultRestSeconds,
  }
}

function buildPlan(bodyPart: BodyPart, id: string, title: string, steps: StepBlueprint[], source: WorkoutPlan['source']): WorkoutPlan {
  const definitions = exerciseCatalog[bodyPart]

  return {
    id,
    bodyPart,
    title,
    source,
    steps: steps.map((step) => {
      const definition = definitions.find((candidate) => candidate.id === step.exerciseId)
      if (!definition) {
        throw new Error(`Missing exercise definition for ${step.exerciseId}`)
      }
      return createStep(definition, step)
    }),
  }
}

export async function fetchPlansByBodyPart(bodyPart: BodyPart): Promise<WorkoutPlan[]> {
  return planBlueprints[bodyPart].map((plan) => buildPlan(bodyPart, plan.id, plan.title, plan.steps, 'predefined'))
}

export function getExerciseCatalog(bodyPart: BodyPart): ExerciseDefinition[] {
  return exerciseCatalog[bodyPart].map((exercise) => ({ ...exercise }))
}

export function createCustomPlan(bodyPart: BodyPart): WorkoutPlan {
  return {
    id: `custom-${bodyPart.toLowerCase()}`,
    bodyPart,
    title: `Custom ${bodyPart} Plan`,
    source: 'custom',
    steps: [],
  }
}

export function createCustomStep(bodyPart: BodyPart, exerciseId: string): WorkoutStep {
  const definition = exerciseCatalog[bodyPart].find((candidate) => candidate.id === exerciseId)
  if (!definition) {
    throw new Error(`Missing exercise definition for ${exerciseId}`)
  }

  return createStep(definition, {
    exerciseId,
    seriesCount: 3,
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
    bodyPart,
    title: 'Quick Timer',
    source: 'quick-timer',
    quickTimerSeriesCount: Math.max(1, seriesCount),
    quickTimerTargetDurationSeconds: targetDurationSeconds,
    steps: [
      {
        id: 'quick-timer-step',
        name: 'Free Workout Interval',
        seriesCount: Math.max(1, seriesCount),
        mode: 'time',
        targetValue: exerciseSeconds,
        restSeconds,
      },
    ],
  }
}
