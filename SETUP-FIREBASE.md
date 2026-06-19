# Turning on real owner-only security (Firebase)

Your site already works locally. Follow these steps **once** to make Edit access
truly secure (server‑enforced): visitors can only **view**, and only **you**
(after logging in) can **edit** — and it can't be bypassed with dev tools or
direct URLs, because the rules run on Google's servers.

> You only need a free Google account. No coding, no server to run.

---

## 1. Create a Firebase project
1. Go to **https://console.firebase.google.com** → **Add project** → name it
   (e.g. `nfc-cards`) → keep defaults → Create.

## 2. Enable Email/Password login
1. Left menu → **Build → Authentication → Get started**.
2. **Sign‑in method** tab → **Email/Password** → **Enable** → Save.
3. **Users** tab → **Add user** → enter **your email** and a **password**.
   *This is the only account that will be able to edit.*

## 3. Create the database
1. Left menu → **Build → Firestore Database → Create database**.
2. Choose **Production mode** → pick a location → Enable.
3. Open the **Rules** tab → delete what's there → paste the contents of
   **`firestore.rules`** (in this project) → **Publish**.

## 4. Connect your web app
1. Project **Settings** (gear, top‑left) → scroll to **Your apps** →
   click the **web** icon `</>` → register an app (any nickname) → **Register**.
2. Copy the `firebaseConfig` values it shows.
3. Open **`firebase-config.js`** and paste them in (apiKey, authDomain,
   projectId, storageBucket, messagingSenderId, appId).
4. Set `window.OWNER_EMAIL` to the email you created in step 2.

That's it — the moment `apiKey` is filled in, the site switches from local mode
to **real Firebase security**.

---

## 5. Deploy so visitors can open it (NFC / shared link)
A real card needs a public URL (Firebase Auth doesn't work from `file://`).
Easiest free option — **Firebase Hosting**:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting        # choose your project; set public dir to "."; single-page: No
firebase deploy
```

You'll get a URL like `https://nfc-cards.web.app`. Put that on your NFC tag.
(You can also drag‑drop the folder into Netlify, or use GitHub Pages — any
static host works. Add your host's domain under
**Authentication → Settings → Authorized domains**.)

---

## How it behaves once configured
| Who | Access |
|-----|--------|
| **Anyone with the link / NFC tag** | **Preview only** — read‑only profile, no edit UI |
| **You, after logging in** | Preview **+ Edit** (changes publish to Firestore instantly) |

- The **Edit/Preview toggle, Edit Profile, Setup and Dashboard** are blocked
  for everyone except your logged‑in account.
- Even if someone forces the edit screen open in dev tools, Firestore **rejects
  every write** that isn't from your authenticated account — so they cannot
  change your published card.
- Each profile lives at `sites/{siteId}` in Firestore; visitors read it, only
  the owner can write it (`firestore.rules`).

---

## Notes
- Until you complete step 4, the app runs in **local mode** (data stays in the
  browser, the old hardcoded login is used) — nothing breaks.
- To change which email can edit: add/disable users in **Authentication → Users**.
- Free tier limits are far beyond what a personal/business card needs.
