# AI-Powered Checkout/POS Frontend

## Stack

* Next.js
* React Native

## Usage

### Web

Add Firebase secrets within a `.env.local`.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=???
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=???
NEXT_PUBLIC_FIREBASE_PROJECT_ID=???
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=???
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=???
NEXT_PUBLIC_FIREBASE_APP_ID=???
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=???
```

Then run the below.

```console
$ cd reworked-yipee/yipee-org
$ npm install firebase date-fns recharts lucide-react
$ npm run dev
```

View the site at [http://localhost:3000](http://localhost:3000).

### Mobile application

```console
$ cd yipee-native
$ npx expo install firebase @react-navigation/native @react-navigation/stack expo-constants react-native-gesture-handler react-native-safe-area-context react-native-screens expo-camera react-native-svg expo-image-picker
$ npm install react-native-chart-kit @react-navigation/bottom-tabs
```

* `npx expo start --clear -c --tunnel` for generic mobile build *(IOS deprecated, use the below)*
    * `npx expo run:android` for Android build
    * `npx expo run:ios` for IOS build
* `npx expo start --clear -c --tunnel --web` for web debugger

Scan the QR code with the [Camera](https://docs.expo.dev/versions/latest/sdk/camera/) app on IOS or the [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG) app on Android.

## Screenshots

<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/1.png" width="48%">
  <img src="./../asset/2.png" width="48%">
</div>
<br>
<div style="display: flex; justify-content: space-between;">
  <img src="./../asset/3.png" width="48%">
  <img src="./../asset/4.png" width="48%">
</div>