import java.io.FileInputStream;
import java.io.IOException;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

public class FirebaseConfig {

    public static void initializeFirebase() {
        try {
            String firebaseConfigPath = System.getenv("FIREBASE_CONFIG");
            FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath);

            FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

            FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully.");

        } catch (IOException e) {
            System.err.println("Error initializing Firebase: " + e.getMessage());
            // Handle the exception appropriately (e.g., exit the application)
        }
    }
}
