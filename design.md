# Workout App Design Document

## Purpose
This document describes the product direction, core architecture, main components, and key design decisions for the workout app. It is intended to be a clear reference for future development and maintenance.

## Product Goal
The app should be a free mobile application that users can use every day to follow and track workout plans. A user should be able to open the app, select or receive the workout plan for the current day, and follow the on-screen guidance during the session.

## Core User Experience
The main experience is a guided workout flow.

Example:
- A user opens the app and chooses whether to **just start the timer** or **pick/build a workout plan**.
- In quick-timer mode, the user first configures exercise time, rest time, and either a target number of series or a target total workout duration before opening the session.
- If the user wants a plan, they enter the planner flow and select a body part such as chest, back, triceps, biceps, shoulders, legs, or abs.
- The user can either choose a predefined plan or build a custom plan from an exercise list for that body part.
- Before the workout starts, the app shows a summary of the selected plan, including the order of exercises and what comes next.
- During the session, the frontend presents the workout step by step with clear instructions, countdowns where applicable, and upcoming-exercise context.

## Initial Features
The first version should focus on these capabilities:

1. Users can customize exercise intervals and rest times to match their fitness level and preferences.
2. The app supports two start modes: a quick-start timer and a plan-based guided workout flow.
3. The app shows a timer for both active exercise periods and rest periods.
4. The active workout screen shows an interval progress bar so users can immediately see how much time remains in the current exercise or rest phase.
5. Each exercise includes a configurable number of series so the guided workout flow can track repeated sets correctly, and users can adjust the series count with clear plus and minus controls.
6. The planner flow lets the user choose which body part they want to train before loading or building a plan.
7. The app includes persistent navigation so users can jump between the home, workout session, and settings screens without losing context.
8. The workout session shows not only the current interval progress, but also how much time remains in the current exercise and which exercises are coming next.
9. The planner supports both predefined plans and custom plans built from a body-part exercise list.
10. Custom-plan exercises can be configured either by **time** or by **number of repetitions**, with simple plus/minus adjustments and sensible defaults such as 30 or 35 seconds for timed exercises.
11. After a user picks or creates a plan, the app shows a summary screen listing the exercises, their order, their intervals or repetition targets, and what comes next before the workout begins.
12. Quick-timer setup supports two configuration modes: explicit series count or target total workout duration that is converted into a matching number of exercise/rest cycles.
13. The workout session includes a second progress bar placed directly under the whole-workout remaining label so users can clearly understand it represents overall workout progress.

## Platform Requirements
The app must be installable on both iOS and Android, so the technology choices should support cross-platform mobile development.

## Technology Direction
- **Frontend:** Vue with a free and practical framework or library for building cross-platform mobile apps.
- **Backend:** Spring Boot. Backend design can be detailed in a later phase.

## Current Scope Notes
- The frontend should prioritize a simple guided workout experience.
- The backend should provide workout-plan data, including predefined recommendations for a selected body part and support for custom-plan execution data in a later phase.
- The first milestone should focus on workout timing, rest customization, dual start modes, body-part selection, lightweight plan building, and guided execution.
- Guided execution should include numeric countdown feedback, a progress bar for the current exercise/rest phase, and a second progress bar directly paired with the whole-workout remaining section.
- Session details should avoid repeating information that is already shown in the main title and timer, so the detail list should keep only whole-workout remaining.
- Guided execution should keep track of the current series within each exercise so the user always knows which set is in progress.
- Resetting a workout session should return the user to the beginning without automatically restarting the timer.
- Plan customization should stay lightweight in v1, with simple plus/minus controls for series and target values directly in the planner.
- Navigation should make the core screens always reachable without forcing the user to backtrack through a single linear flow.
- The quick-timer path should provide a setup step so users can configure intervals and either series count or total duration before entering the session.
- The plan-based path should include a planner screen and a summary screen before the workout session begins.
