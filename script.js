// ==== Firebase SDK (ES Module) ====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyA35XTaIV6AHBLCWAcNXuqtQ9_-sF7S6ds",
  authDomain: "sasebokosenbbs.firebaseapp.com",
  projectId: "sasebokosenbbs",
  storageBucket: "sasebokosenbbs.firebasestorage.app",
  messagingSenderId: "883542260106",
  appId: "1:883542260106:web:dff4d97bf466e62d06b073",
  measurementId: "G-XHB75WQR6W"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==== ログイン状態監視 ====
onAuthStateChanged(auth, user => {
  updateAuthUI(user);
});

// ==== 登録 ====
document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const pass = document.getElementById('register-password').value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert('登録完了！ログインしました');
  } catch (err) {
    alert(err.message);
  }
});

// ==== ログイン ====
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert('ログイン成功');
  } catch (err) {
    alert(err.message);
  }
});

// ==== ログアウト ====
document.getElementById('logout-btn').addEventListener('click', async () => {
  await signOut(auth);
  alert('ログアウトしました');
});

// ==== UI更新 ====
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

// ==== 投稿（例） ====
window.addPost = function (pageId) {
  const input = document.getElementById(pageId + '-input');
  const text = input.value.trim();
  if (!auth.currentUser) {
    alert('ログインしてください');
    return;
  }
  if (!text) return;

  // ここはまだlocalStorage版のままにしておく（Firestoreに切り替え可）
  let posts = JSON.parse(localStorage.getItem('posts') || '{"home":[],"s":[],"m":[],"e":[],"c":[]}');
  posts[pageId].unshift({ email: auth.currentUser.email, text });
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts(pageId);
  input.value = '';
};

function renderPosts(pageId) {
  const posts = JSON.parse(localStorage.getItem('posts') || '{"home":[],"s":[],"m":[],"e":[],"c":[]}');
  const container = document.getElementById(pageId + '-posts');
  container.innerHTML = '';
  posts[pageId].forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.textContent = `${p.email}: ${p.text}`;
    container.appendChild(div);
  });
}
['home','s','m','e','c'].forEach(renderPosts);

