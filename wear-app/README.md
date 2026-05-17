# Padel Wear ScoreBoard

A modern, minimal Wear OS scoreboard app for Padel.

## Features
- Circular UI support
- High contrast (Padel Yellow on Black)
- Large readable scores
- Vaptic feedback on changes
- Touch-friendly large buttons
- Game counter tracking

## Quick Start
1. **Clone** or download this project.
2. **Open** the `/wear-app` folder in **Android Studio**.
3. **Connect** your Pixel Watch or Wear OS emulator.
4. **Click Run** (Green Play Button).

## Technical Specifications
- **SDK**: targetSdk 34, minSdk 30
- **UI**: Jetpack Compose Wear 1.3.0
- **State**: Flow-based ViewModel (MVVM)
- **Permissions**: Vibrate, Wake Lock (for session persistence)

## Project Structure
- `MainActivity.kt`: Entry point and Compose setup.
- `ScoreViewModel.kt`: State management and Padel logic.
- `ScoreScreen.kt`: The main watch interface.
- `Theme.kt`: Sporty material theme.

## Future Roadmap (Structure ready)
- [ ] Match Timer
- [ ] Set Counter
- [ ] Serve Indicator
- [ ] Match History persistence
