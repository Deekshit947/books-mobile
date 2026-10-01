# Books Mobile

A focused React Native application for finding books through Open Library and viewing edition metadata. It is written in TypeScript, uses the bare React Native toolchain (no Expo), and targets Android and iOS.

## Features

- Search by title, author, or ISBN using the Open Library Search API.
- Paginated results with cover, author, first publication year, and edition count.
- A dedicated details screen backed by the Open Library Books API.
- Explicit initial, loading, slow-network, empty, error, and offline states.
- Seven-day persistent request cache for repeated searches and previously opened details.
- Defensive API mapping so incomplete Open Library records do not crash the UI.
- Accessible labels, scalable layouts, image fallbacks, and pull-to-refresh.
- Unit tests for the API-to-domain mapping boundary.

## Stack

- React Native 0.87.1 / React 19.2 / TypeScript 6
- React Navigation 7
- TanStack Query 5 with AsyncStorage persistence
- Axios and NetInfo
- React Native `StyleSheet` only, with no UI or styling framework
- Jest and React Native Testing Library

## Local development setup

This is a bare React Native project. Local development uses Metro for the JavaScript bundle and Fast Refresh, plus Android Studio for Android or Xcode for iOS. No API key or project `.env` file is required because Open Library exposes a public API.

The repository pins its reproducible JavaScript toolchain in `.nvmrc`, `package.json`, and `package-lock.json`:

- Node.js 24.3.0
- npm 11.4.2
- JDK 17 for Android
- Android SDK Platform 37, Build Tools 37.0.0, and NDK 27.1.12297006
- The latest stable Xcode supported by the Mac for iOS

These instructions follow the official [React Native environment guide](https://reactnative.dev/docs/set-up-your-environment), [Android Studio installation guide](https://developer.android.com/studio/install), and [Apple Xcode requirements](https://developer.apple.com/xcode/system-requirements/).

### Windows: Android

Windows is fully supported for Android development. Native iOS builds require macOS and Xcode and cannot be compiled locally on Windows.

#### 1. Install the host tools

Install these tools and restart the terminal afterward:

1. [Git for Windows](https://git-scm.com/download/win).
2. [NVM for Windows](https://github.com/coreybutler/nvm-windows/releases) using the release's `nvm-setup.exe`. If Node was installed separately before NVM, uninstall that Node installation first to avoid PATH conflicts.
3. [Microsoft OpenJDK 17](https://learn.microsoft.com/java/openjdk/download#openjdk-17).
4. [Android Studio](https://developer.android.com/studio). In its Setup Wizard, keep **Android SDK**, **Android SDK Platform**, and **Android Virtual Device** selected.

Open a new PowerShell window and install the repository's Node and npm versions:

```powershell
nvm install 24.3.0
nvm use 24.3.0
npm install --global npm@11.4.2

node --version
npm --version
java -version
```

The expected Node and npm versions are `v24.3.0` and `11.4.2`; Java must report version 17.

#### 2. Install the Android SDK

In Android Studio, open **More Actions > SDK Manager**. Enable **Show Package Details**, then install:

- **SDK Platforms:** Android SDK Platform 37.
- **SDK Tools:** Android SDK Build-Tools 37.0.0, Android SDK Platform-Tools, Android SDK Command-line Tools (latest), Android Emulator, and NDK (Side by side) 27.1.12297006.

The project compiles against API 37 and targets API 36. The emulator may use an API 36 or newer Google APIs system image.

Set `ANDROID_HOME` and add the emulator and platform tools to the user `Path` from PowerShell:

```powershell
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidSdk, 'User')

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
$requiredPaths = "$androidSdk\platform-tools;$androidSdk\emulator"
[Environment]::SetEnvironmentVariable('Path', "$userPath;$requiredPaths", 'User')
```

Close and reopen PowerShell, then verify the configuration:

```powershell
Write-Output $env:ANDROID_HOME
adb version
```

`ANDROID_HOME` should normally be `C:\Users\<you>\AppData\Local\Android\Sdk`. Android documents this variable in its [environment-variable reference](https://developer.android.com/tools/variables).

#### 3. Create an Android emulator

In Android Studio:

1. Open **More Actions > Virtual Device Manager**.
2. Select **Create Device** and choose a recent Pixel phone.
3. Select an API 36 or newer Google APIs system image.
4. Finish the wizard and launch the emulator with its play button.

Hardware virtualization must be enabled for acceptable emulator performance. See Android's official [Virtual Device Manager guide](https://developer.android.com/studio/run/managing-avds).

#### 4. Clone and validate the project

```powershell
git clone https://github.com/Deekshit947/books-mobile.git
cd books-mobile

nvm use 24.3.0
npm ci
npx react-native doctor
npm run verify
```

#### 5. Run Android in development mode

Keep the emulator running. Open two PowerShell terminals in the project directory.

Terminal 1 - Metro:

```powershell
nvm use 24.3.0
npm start
```

Terminal 2 - native Android build and installation:

```powershell
nvm use 24.3.0
adb devices
npm run android
```

The emulator should be listed by `adb devices`. Leave Metro running while using the debug application. Source edits should appear through Fast Refresh.

To use a physical Android phone instead, enable Developer Options and USB debugging, connect it by USB, accept the authorization prompt, and confirm that `adb devices` lists it before running `npm run android`. See React Native's [running-on-device guide](https://reactnative.dev/docs/running-on-device).

### macOS: iOS and Android

A Mac can develop both platforms. The following steps cover iOS. Install Android Studio and JDK 17 using the Android SDK versions above if Android development is also required.

#### 1. Install Xcode and supporting tools

1. Install the latest stable [Xcode](https://developer.apple.com/xcode/) supported by the installed macOS version.
2. Launch Xcode once, accept the license, and allow it to install its components.
3. In **Xcode > Settings > Platforms**, install an iOS Simulator runtime.
4. In **Xcode > Settings > Locations**, select the installed Xcode under **Command Line Tools**.

Verify Xcode from Terminal:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
xcodebuild -version
xcrun simctl list devices available
```

Apple documents the [Xcode command-line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/) and [running apps on simulators and devices](https://developer.apple.com/documentation/Xcode/running-your-app-on-simulated-or-physical-devices).

#### 2. Install Node, Watchman, Ruby, and Bundler

Install [Homebrew](https://brew.sh/) if it is not already available. Install Watchman and Ruby:

```bash
brew install watchman ruby
```

Add Homebrew's Ruby to the shell path using the path reported by `brew --prefix ruby`:

```bash
echo 'export PATH="'"$(brew --prefix ruby)"'/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install bundler
```

Install `nvm` using the official [nvm installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating), reopen Terminal, and then run:

```bash
nvm install 24.3.0
nvm use 24.3.0
npm install --global npm@11.4.2

node --version
npm --version
watchman --version
ruby --version
bundle --version
```

#### 3. Clone and install the project

```bash
git clone https://github.com/Deekshit947/books-mobile.git
cd books-mobile

nvm use
npm ci
bundle install
bundle exec pod install --project-directory=ios
npx react-native doctor
npm run verify
```

Always open `ios/BooksMobile.xcworkspace`, not the `.xcodeproj`, when working directly in Xcode:

```bash
open ios/BooksMobile.xcworkspace
```

#### 4. Run iOS in development mode

Open two Terminal windows in the project directory.

Terminal 1 - Metro:

```bash
nvm use
npm start
```

Terminal 2 - simulator build and installation:

```bash
nvm use
npm run ios
```

The iOS Simulator should start automatically. A paid Apple Developer membership is not required for Simulator development. Testing on a physical iPhone requires selecting a development team and configuring signing in Xcode.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run verify
```

Run `npm run verify` before every push. GitHub Actions runs the same lint, typecheck, and test command from a clean environment.

## Cloud builds and browser demos

Every push runs the quality checks and creates two standalone artifacts in GitHub Actions:

- `BooksMobile-Android-Release-Package`, containing `BooksMobile-Android-Release.apk` with its JavaScript bundle embedded.
- `BooksMobile-iOS-Simulator-Release-Package`, containing `BooksMobile-iOS-Simulator-Release.zip`, an unsigned iOS Simulator `.app` archive.

Download an artifact from the successful workflow run and extract GitHub's outer artifact ZIP once. Install `BooksMobile-Android-Release.apk` on Android or upload it to [Appetize](https://appetize.io/upload). For iOS, upload the inner `BooksMobile-iOS-Simulator-Release.zip` without extracting it.

Appetize requires a ZIP containing an iOS Simulator `.app`; an App Store `.ipa` is not supported. See the official [Appetize iOS upload guide](https://docs.appetize.io/platform/app-management/uploading-apps/ios).

Both release artifacts include the JavaScript bundle and run without Metro. The Android artifact uses the template debug signing key for demonstration only; publishing to an app store requires private release signing.

## Demo checklist

- Run `npm run verify` and keep the successful output available.
- Use a local Android Emulator or iOS Simulator to demonstrate the normal development workflow and Fast Refresh.
- Search for a common title such as `The Hobbit`, open a result, and show the detail screen.
- Show loading, empty-result, and error feedback.
- Complete a search online, disconnect the simulator, and repeat it to demonstrate persisted offline data.
- Keep the latest standalone Android and iOS artifacts and Appetize demos as presentation backups.
- Confirm internet access before the demo because uncached Open Library searches require the public API.

## Architecture

```text
src/
├── api/          HTTP client, endpoint calls, defensive response mapping
├── components/   Reusable, presentation-only building blocks
├── hooks/        Small UI behavior hooks
├── navigation/   Typed stack and route parameters
├── query/        Server-state and persistence configuration
├── screens/      Search and book-details feature screens
├── theme/        Shared design tokens
└── types/        Stable application domain models
```

Raw Open Library responses stop at `src/api/books.ts`. Screens receive compact domain models instead of loosely typed remote data. Search results use work records while preferring the search result's cover edition OLID and falling back to its first edition; the detail request sends that OLID to `/api/books.json` with `jscmd=data`.

The query cache treats results as fresh for ten minutes and retains persisted data for seven days. Requests try the network first, use cached results when available, and pause through TanStack Query when the device is offline.

## API usage

The app requests only the search fields it displays and uses pages of 20 items.

- Search: `GET https://openlibrary.org/search.json`
- Details: `GET https://openlibrary.org/api/books.json?bibkeys=OLID:<id>&jscmd=data&format=json`
- Covers: `https://covers.openlibrary.org/b/id/<id>-M.jpg`