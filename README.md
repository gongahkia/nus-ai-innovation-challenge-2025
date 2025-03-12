# How to test backend:
1. mvn clean install (in the backend directory with the pom.xml file)
2. mvn spring-boot:run
Note: Lombok is a bit of a pain to configure. Ensure that annotations are enabled and that your IDE settings.json have Lombok enabled. Here is an example of the line to add to settings.json if your Lombok is misbehaving:

```console
"java.jdt.ls.lombokSupport.enabled": true,
"java.jdt.ls.vmargs": "-javaagent:<c:\\miya stuff\\lombok.jar>"
```

# To do for backend
1. Write function to parse sales data, etc into csv.
2. Write tests to walk through a typical monthly sales report for a business
3. Test inputs with csv files with said rigorous tests
# `Yipee! Yipee! Yipee! ᐠ( ᐛ )ᐟ`

## Frontend

### Web

```console
$ cd yipee
$ npm run dev
```

View the site at [http://localhost:3000](http://localhost:3000).

### Expo

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

## 27 Feb 2025 Call

```txt
———-—
MOTTO: Bringing industry insights to your doorstep

TARGET DEMOGRAPHIC: Small businesses (eg. Mama shop, Individual retail shops, F&B)

WHY LOYVERSE IS SHIT
- We don't take customer data
- We just take business general transaction data 

VALUE PROP
- Plug and play solution that features many ways to feed the data into our system
- Not invasive at all, little capital cost to adopt our system as comapred to existing competitors in the market
- Personalised data analytics for businesses, they can save their inventory the first time and then hook everything like recording transactions to a single webapp, then prompt them when there's a lack of resources, analytics system should backend also consider factors like weather, season, locality, producer availability, social media
- Can cross pollinate data insights across companies as well

USER JOURNEY: For the company
- Specify your industry
- Specify your existing stock
- Specify your POS data at the end of the day/week/month
- We give you insights

———-—
NOW WHAT DO?

Item 2
Backend + Model training: Kamiya, Jia Lin, Nichole
Frontend + Scanning functionality/deployment: Gabriel

Item 1,3,4,5
Astin
Gabriel

———-—
WHEN IS DEADLINE 

Checkin on 7 March Friday 
```
