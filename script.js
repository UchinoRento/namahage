'use strict';

// 🎨 テーマ切り替え
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', function() {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');

  const className = document.body.className;
  this.textContent = className === "light-theme" ? "Dark" : "Light";
  console.log('current class name: ' + className);
});

// 📌 ルーティング
const routes = {
  '/': 'home',
  '/s': 's',
  '/m': 'm',
  '/e': 'e',
  '/c': 'c'
};

// 💾 投稿保存/取得
function getPosts(page) {
  return JSON.parse(localStorage.getItem(`posts-${page}`) || '[]');
}
function savePosts(page, posts) {
  localStorage.setItem(`posts-${page}`, JSON.stringify(posts));
}

// ✍ 投稿追加
function addPost(page) {
  if (!localStorage.getItem("currentUser")) {
    alert("ログインしてください！");
    return;
  }

  const input = document.getElementById(page + '-input');
  const text = input.value.trim();
  if (text === '') return;

  const posts = getPosts(page);
  posts.unshift({
    user: localStorage.getItem("currentUser"),
    text,
    date: new Date().toLocaleString()
  });
  savePosts(page, posts);

  input.value = '';
  renderPosts(page);
}

// 🖼 投稿表示
function renderPosts(page) {
  const posts = getPosts(page);
  const container = document.getElementById(page + '-posts');
  container.innerHTML = '';

  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `<strong>${post.user}</strong> (${post.date})<br>${post.text}`;
    container.appendChild(div);
  });
}

// 🚦 ページ切替
function router() {
  const path = location.hash.slice(1) || '/';
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

  const pageId = routes[path];
  if (pageId) {
    document.getElementById(pageId).classList.add('active');
    renderPosts(pageId);
  }
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// 🔑 ログイン機能
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// 登録
document.getElementById("register-form").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;

  if (!username || !password) return;

  const users = getUsers();
  if (users[username]) {
    alert("そのユーザー名は既に存在します");
    return;
  }
  users[username] = password;
  saveUsers(users);

  alert("登録完了！");
});

// ログイン
document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const users = getUsers();
  if (users[username] && users[username] === password) {
    localStorage.setItem("currentUser", username);
    updateAuthUI();
  } else {
    alert("ユーザー名またはパスワードが違います");
  }
});

// ログアウト
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  updateAuthUI();
});

// UI切替
function updateAuthUI() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("logout-section").style.display = "block";
    document.getElementById("username-display").textContent = user;
  } else {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("logout-section").style.display = "none";
  }
}
window.addEventListener("load", updateAuthUI);
