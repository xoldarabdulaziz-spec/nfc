/* ============================================================================
   FIREBASE APP LAYER
   - If firebase-config.js has no apiKey  -> LOCAL-ONLY mode (window.FB_ON=false);
     this file does nothing and the app keeps using localStorage (unchanged).
   - If configured -> real Auth + Firestore. Auth state is bridged to the
     existing `dot_logged_in` flag so all the page guards keep working.

   Requires (loaded BEFORE this file in the page):
     firebase-app-compat.js, firebase-auth-compat.js, firebase-firestore-compat.js
     firebase-config.js
   ========================================================================== */
(function () {
  var cfg = window.FIREBASE_CONFIG || {};
  window.FB_ON = !!(cfg && cfg.apiKey);
  window.FB_USER = null;
  window.__fbAuthResolved = false;

  if (!window.FB_ON) return;                 // local-only mode → no-op

  try {
    firebase.initializeApp(cfg);
    var auth = firebase.auth();
    var fs   = firebase.firestore();
    window.FBAuth = auth; window.FBStore = fs;

    /* keep the owner signed in across visits */
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(){});

    /* bridge Firebase auth -> dot_logged_in so existing guards work */
    auth.onAuthStateChanged(function (u) {
      window.FB_USER = u || null;
      window.__fbAuthResolved = true;
      try {
        if (u) localStorage.setItem('dot_logged_in', '1');
        else   localStorage.removeItem('dot_logged_in');
      } catch (_) {}
      document.dispatchEvent(new CustomEvent('fbauth', { detail: { user: u || null } }));
    });

    /* ---- auth helpers ---- */
    window.fbLogin  = function (email, pwd) { return auth.signInWithEmailAndPassword(email, pwd); };
    window.fbLogout = function () { return auth.signOut(); };

    /* run cb(user) once auth is known (immediately if already resolved) */
    window.fbReady = function (cb) {
      if (window.__fbAuthResolved) { cb(window.FB_USER); return; }
      document.addEventListener('fbauth', function once (e) {
        document.removeEventListener('fbauth', once); cb(e.detail.user);
      });
    };

    /* ---- data helpers (Firestore collection: sites/{id}) ---- */
    window.fbFetchSite = function (id) {
      return fs.collection('sites').doc(id).get().then(function (d) { return d.exists ? d.data() : null; });
    };
    window.fbSaveSite = function (id, data) {
      var uid = window.FB_USER && window.FB_USER.uid;
      var doc = Object.assign({}, data, { owner: uid || null, updated: Date.now() });
      return fs.collection('sites').doc(id).set(doc, { merge: false });
    };
    window.fbDeleteSite = function (id) { return fs.collection('sites').doc(id).delete(); };
    window.fbListSites = function () {
      var uid = window.FB_USER && window.FB_USER.uid;
      if (!uid) return Promise.resolve([]);
      return fs.collection('sites').where('owner', '==', uid).orderBy('updated', 'desc').get()
        .then(function (q) { return q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); })
        .catch(function () {            // index/order may be unavailable on first run
          return fs.collection('sites').where('owner', '==', uid).get()
            .then(function (q) { return q.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); });
        });
    };
  } catch (e) {
    /* if Firebase fails to init (e.g. offline), fall back to local-only */
    window.FB_ON = false;
    window.__fbAuthResolved = true;
  }
})();
