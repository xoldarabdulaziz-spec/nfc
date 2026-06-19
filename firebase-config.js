/* ============================================================================
   FIREBASE CONFIG  —  paste your own project values here.

   How to get these:
     1. Go to https://console.firebase.google.com  ->  Add project (free).
     2. Build -> Authentication -> Sign-in method -> enable "Email/Password".
     3. Authentication -> Users -> "Add user" -> your OWNER email + a password
        (this is the ONLY account that will be able to edit).
     4. Build -> Firestore Database -> Create database (Production mode).
     5. Firestore -> Rules -> paste the contents of firestore.rules -> Publish.
     6. Project settings (gear) -> Your apps -> Web (</>) -> register app ->
        copy the firebaseConfig values into the object below.

   Leave apiKey as "" to keep the site in LOCAL-ONLY mode (no Firebase, data
   stays in this browser). Fill it in to turn on real, server-enforced security.
   ========================================================================== */
window.FIREBASE_CONFIG = {
  apiKey:            "",   // e.g. "AIza...."
  authDomain:        "",   // e.g. "my-nfc.firebaseapp.com"
  projectId:         "",   // e.g. "my-nfc"
  storageBucket:     "",   // e.g. "my-nfc.appspot.com"
  messagingSenderId: "",   // e.g. "1234567890"
  appId:             ""    // e.g. "1:1234567890:web:abcdef"
};

/* The email allowed to edit (your owner account in Firebase Authentication). */
window.OWNER_EMAIL = "xoldar.abdulaziz@gmail.com";
