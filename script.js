'use strict';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc,
  onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ===== Firebase初期化 =====
// あなたのfirebaseConfigをコピペ
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== テーマ切替（元のまま） =====
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');
  switcher.textContent =
    document.body.className === 'light-theme' ? 'Dark' : 'Light';
});

// ===== ページルーティング（元のまま） =====
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
document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const pass = document.getElementById('register-password').value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert('登録完了！');
    document.getElementById('register-form').reset();
  } catch (err) {
    alert(err.message);
  }
});

// ===== ログイン =====
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    document.getElementById('login-form').reset();
  } catch (err) {
    alert(err.message);
  }
});

// ===== ログアウト =====
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth);
});

// ===== UI更新 =====
function updateAuthUI(user) {
  if (user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-section').style.display = 'block';
    document.getElementById('username-display').textContent = user.email;
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
  }
}
onAuthStateChanged(auth, updateAuthUI);

// ===== 投稿追加（Firestoreに保存） =====
window.addPost = async function (pageId) {
  const input = document.getElementById(pageId + '-input');
  const text = input.value.trim();
  if (!auth.currentUser) {
    alert('ログインしてください');
    return;
  }
  if (!text) return;

  await addDoc(collection(db, pageId), {
    email: auth.currentUser.email,
    text,
    createdAt: new Date()
  });
  input.value = '';
};

// ===== 投稿描画（Firestoreからリアルタイム購読） =====
['home', 's', 'm', 'e', 'c'].forEach(pageId => {
  const q = query(collection(db, pageId), orderBy('createdAt','desc'));
  onSnapshot(q, snapshot => {
    const container = document.getElementById(pageId + '-posts');
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement('div');
      div.className = 'post';
      div.textContent = `${p.email}: ${p.text}`;
      container.appendChild(div);
    });
  });
});

