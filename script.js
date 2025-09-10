'use strict';

// 🎨 テーマ切替
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');

  const className = document.body.className;
  this.textContent = className === "light-theme" ? "Dark" : "Light";
  console.log('current class name: ' + className);
});

// 📌 ルーティング
const routes = { '/': 'home', '/s': 's', '/m': 'm', '/e': 'e', '/c': 'c' };

// 🚦 ページ切替
function router() {
  const path = location.hash.slice(1) || '/';
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageId = routes[path];
  if (pageId) {
    document.getElementById(pageId).classList.add('active');
  }
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// 🔑 Firebase 設定（あなたの値に置き換えてください）
const firebaseConfig = {
  apiKey: "AIzaSyDHCpNqhEL-a1sLsU4PpXboaWJ-P_XMwXs",
  authDomain: "sasasebokosen.firebaseapp.com",
  projectId: "sasasebokosen",
  storageBucket: "sasasebokosen.firebasestorage.app",
  messagingSenderId: "607000741264",
  appId: "1:607000741264:web:1d3f5c501296e9597b9f15",
  measurementId: "G-KJHJW3EH4T"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== ログイン/登録/ログアウト =====
document.getElementById("register-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("登録完了！"))
    .catch(err => alert(err.message));
});

document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut();
});

// ===== 認証状態を監視してUI切替 =====
auth.onAuthStateChanged(user => {
  if(user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("logout-section").style.display = "block";
    document.getElementById("username-display").textContent = user.email;
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-section").style.display = "none";
  }
});

// ===== 投稿追加 =====
function addPost(pageId) {
  const user = auth.currentUser;
  if(!user) { alert("ログインしてください"); return; }

  const input = document.getElementById(pageId + "-input");
  const text = input.value.trim();
  if(text === "") return;

  db.collection("posts").add({
    page: pageId,
    text: text,
    uid: user.uid,
    email: user.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  input.value = "";
}

// ===== 投稿リアルタイム表示 =====
function loadPosts(pageId) {
  db.collection("posts")
    .where("page", "==", pageId)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const container = document.getElementById(pageId + "-posts");
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "post";
        div.textContent = `${data.email}: ${data.text}`;
        container.appendChild(div);
      });
    });
}

// 全ページで投稿を監視
["home","s","m","e","c"].forEach(loadPosts);

