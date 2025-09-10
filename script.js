'use strict';

// Firebase SDKの新しい形式でのインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ===== Firebase 設定 =====
const firebaseConfig = {
  apiKey: "AIzaSyDHCpNqhEL-a1sLsU4PpXboaWJ-P_XMwXs",
  authDomain: "sasasebokosen.firebaseapp.com",
  projectId: "sasasebokosen",
  storageBucket: "sasasebokosen.firebasestorage.app",
  messagingSenderId: "607000741264",
  appId: "1:607000741264:web:1d3f5c501296e9597b9f15"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 学校のメールアドレスドメイン
const SCHOOL_DOMAIN = "sasebo-k.ac.jp";

// ===== DOM要素 =====
const loginSection = document.getElementById("login-section");
const logoutSection = document.getElementById("logout-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const usernameDisplay = document.getElementById("username-display");
const pages = document.querySelectorAll(".page");
const switcher = document.querySelector('.btn');

// ===== ページルーティング =====
const routes = { '/': 'home', '/s': 's', '/m': 'm', '/e': 'e', '/c': 'c' };

function router() {
  const path = location.hash.slice(1) || '/';
  const pageId = routes[path];
  
  // ナビゲーションリンクのハイライト
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === `#${path}`) {
      link.classList.add('active-nav');
    } else {
      link.classList.remove('active-nav');
    }
  });

  // ページ表示
  pages.forEach(el => el.classList.remove('active'));
  if (pageId) {
    document.getElementById(pageId).classList.add('active');
    // ページ切り替え時に投稿を読み込む
    fetchPosts(pageId);
  }
}

// ページ読み込みとハッシュ変更時のイベントリスナー
window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);

// ===== テーマ切替 =====
// CSSで`body`の初期クラスを設定してください
switcher.addEventListener('click', () => {
  if (document.body.classList.contains('light-theme')) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    switcher.textContent = 'Light';
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    switcher.textContent = 'Dark';
  }
});

// ===== 登録 =====
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const pass = document.getElementById("register-password").value;
  
  // メールアドレスのドメインをチェック
  if (!email.endsWith(`@${SCHOOL_DOMAIN}`)) {
    alert(`登録には @${SCHOOL_DOMAIN} のメールアドレスが必要です。`);
    return;
  }
  
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("登録が完了しました！ログインしてください。");
      registerForm.reset();
    })
    .catch(err => {
      let errorMessage = "登録に失敗しました。";
      switch(err.code) {
        case "auth/email-already-in-use":
          errorMessage = "このメールアドレスは既に登録されています。";
          break;
        case "auth/invalid-email":
          errorMessage = "メールアドレスの形式が正しくありません。";
          break;
        case "auth/weak-password":
          errorMessage = "パスワードは6文字以上で設定してください。";
          break;
        default:
          errorMessage = `登録エラー: ${err.message}`;
      }
      alert(errorMessage);
    });
});

// ===== ログイン =====
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;
  
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      loginForm.reset();
    })
    .catch(err => {
      alert("ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。");
    });
});

// ===== ログアウト =====
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("ログアウトしました。");
    })
    .catch(err => {
      console.error("ログアウトエラー:", err);
      alert("ログアウトに失敗しました。");
    });
});

// ===== UI更新 =====
onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.style.display = "none";
    logoutSection.style.display = "block";
    // ユーザー名としてメールアドレスの@より前の部分を表示
    usernameDisplay.textContent = user.email.split("@")[0];
  } else {
    loginSection.style.display = "block";
    logoutSection.style.display = "none";
  }
});

// ===== 投稿 =====
function addPost(pageId) {
  const input = document.getElementById(pageId + "-input");
  const text = input.value.trim();
  const user = auth.currentUser;
  
  if (!user) {
    alert("投稿するにはログインしてください。");
    return;
  }
  if (!text) {
    return;
  }

  // Firestoreにデータを追加
  addDoc(collection(db, "posts"), {
    page: pageId,
    text: text,
    username: user.email.split("@")[0], // @より前の部分をユーザー名として保存
    createdAt: serverTimestamp() // サーバー側でタイムスタンプを生成
  })
  .then(() => {
    input.value = "";
  })
  .catch(err => {
    console.error("投稿エラー:", err);
    alert("投稿に失敗しました。");
  });
}

// 投稿のリアルタイム表示
function fetchPosts(pageId) {
  const container = document.getElementById(pageId + "-posts");
  
  const postsQuery = query(
    collection(db, "posts"),
    where("page", "==", pageId),
    orderBy("createdAt", "desc")
  );

  onSnapshot(postsQuery, (snapshot) => {
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      
      const date = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleString() : "日時不明";
      
      div.innerHTML = `
        <div class="post-meta">
          <strong>${data.username}</strong>
          <span> - ${date}</span>
        </div>
        <div class="post-content">${data.text}</div>
      `;
      container.appendChild(div);
    });
  });
}

// グローバルスコープにaddPostを公開してHTMLから呼び出せるようにする
window.addPost = addPost;
