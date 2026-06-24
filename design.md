# Workout App Design Document

## Purpose
This document describes the current product direction, core architecture, main components, and active design decisions for the workout app.

## Product Goal
The app is a free cross-platform mobile workout companion. A user should be able to open the app, either start a quick timer or build a workout plan, and then follow the session guidance step by step.

## Core User Experience
The main experience is a guided workout flow.

Example:
- A user opens the app and chooses whether to **just start the timer** or **build a workout plan**.
- In quick-timer mode, the user configures exercise time, rest time, and either a target number of series or a target total workout duration before entering the session.
- In planner mode, the user chooses a body part such as chest, back, triceps, biceps, shoulders, legs, or abs.
- The user adds exercises manually, one exercise at a time, into a single workout plan.
- Each added exercise starts with **1 series**, and the user can change its **time or repetition target** and **series count** with simple controls.
- Already-added exercises are highlighted in the picker, move to the top of the current body-part list, and cannot be selected twice.
- Already-added exercises are highlighted in the picker, move to the top of the current body-part list, and can be removed directly from that list.
- The user can switch body parts and continue adding exercises into the same plan.
- Before the workout starts, the app shows a summary grouped by body part, plus an estimated total workout duration.
- During the session, the app presents the workout step by step with countdowns where applicable and clear whole-workout progress feedback.

## Initial Features
The current version focuses on these capabilities:

1. Users can customize quick-timer exercise intervals and rest times.
2. The app supports two start modes: quick timer and plan-based guided workout.
3. Quick-timer setup supports both explicit series count and target total workout duration.
4. The planner lets the user browse exercises by body part.
5. The planner builds a single manual plan by adding exercises one at a time.
6. Each added exercise starts lightweight with 1 series and can be adjusted later, including its target mode and target value.
7. The planner keeps the editing view compact by showing the selected exercises together with the estimated total duration, and the pre-workout summary still shows the grouped overview.
8. The workout session supports both timed steps and repetition-based steps.
9. The active workout screen shows the current phase, current series, current timer or rep target, and whole-workout remaining time.
10. The workout session includes progress feedback for both the current interval and the whole workout.
11. Navigation keeps the main screens reachable through persistent tabs.

## Platform Requirements
The app must be installable on both iOS and Android, so the stack should support cross-platform mobile delivery.

## Technology Direction
- **Frontend:** Vue 3 with Ionic Vue, Vite, and Pinia.
- **Mobile packaging:** Capacitor.
- **Backend:** Spring Boot is still the intended backend direction for a later phase.

## Current Implementation Notes
- The frontend currently owns the exercise catalog for each supported body part.
- Predefined plans are no longer part of the planner flow.
- The planner uses a manual plan model where each step stores its own body part, allowing mixed plans such as chest plus triceps.
- In the planner screen, selected exercises and estimated total time are shown in a single section to avoid duplicate overview blocks.
- The exercise picker prevents duplicate exercise entries inside the same manual plan.
- The summary estimates total duration by combining timed exercises directly and repetition-based exercises through a simple time estimate.
- Quick timer remains separate from the manual planner flow and still opens directly into the workout session.
- Resetting a workout session returns the user to the start of the workout without automatically restarting it.
- Session details intentionally stay lightweight and avoid duplicating information already shown in the title and primary timer.

## Scope Notes
- The first milestone prioritizes workout timing, rest customization, manual plan building, guided execution, and simple navigation.
- Plan customization stays intentionally lightweight in v1: manual exercise selection plus per-exercise target and series adjustment, without advanced plan templates.
- A later backend phase can provide persistence, synced workout-plan data, and richer exercise sources.
