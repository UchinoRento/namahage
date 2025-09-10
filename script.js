'use strict';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc,
  query, where, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ===== Firebase 設定 =====
const firebaseConfig = {
  apiKey: "AIzaSyDHCpNqhEL-a1sLsU4PpXboaWJ-P_XMwXs",
  authDomain: "sasasebokosen.firebaseapp.com",
  projectId: "sasasebokosen",
  storageBucket: "sasasebokosen.firebasestorage.app",
  messagingSenderId: "607000741264",
  appId: "1:607000741264:web:1d3f5c501296e9597b9f15",
  measurementId: "G-KJHJW3EH4T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== テーマ切替 =====
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');
  switcher.textContent = document.body.className === 'light-theme' ? 'Dark' : 'Light';
});

// ===== ページルーティング =====
const routes = { '/': 'home', '/s': 's', '/m': 'm', '/e': 'e', '/c': 'c' };
function router() {
  const path = location.hash.slice(1) || '/';
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const pageId = routes[path];
  if (pageId) document.getElementById(pageId).classList.add('active');
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// ===== 登録 =====
document.getElementById("register-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const pass = document.getElementById("register-password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("登録完了！ログインしてください");
    document.getElementById("register-form").reset();
  } catch (err) {
    alert(err.message);
  }
});

// ===== ログイン =====
document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    document.getElementById("login-form").reset();
  } catch (err) {
    alert(err.message);
  }
});

// ===== ログアウト =====
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth);
});

// ===== UI更新 =====
function updateAuthUI(user) {
  if (user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("logout-section").style.display = "block";
    document.getElementById("username-display").textContent = user.email;
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-section").style.display = "none";
  }
}
onAuthStateChanged(auth, user => updateAuthUI(user));

// ===== 投稿 =====
window.addPost = async function (pageId) {
  const input = document.getElementById(pageId + "-input");
  const text = input.value.trim();
  const user = auth.currentUser;
  if (!user) { alert("ログインしてください"); return; }
  if (!text) return;

  await addDoc(collection(db, "posts"), {
    page: pageId,
    text: text,
    uid: user.uid,
    email: user.email,
    createdAt: new Date()
  });
  input.value = "";
};

// 投稿リアルタイム表示
["home", "s", "m", "e", "c"].forEach(page => {
  const q = query(
    collection(db, "posts"),
    where("page", "==", page),
    orderBy("createdAt", "desc")
  );
  onSnapshot(q, snapshot => {
    const container = document.getElementById(page + "-posts");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      div.textContent = `${data.email}: ${data.text}`;
      container.appendChild(div);
    });
  });
});
