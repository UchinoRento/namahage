'use strict';

// ===== 疑似ユーザー管理（ローカル） =====
let currentUser = null; // ログイン中ユーザー
const users = []; // {email, password}

// ===== テーマ切替 =====
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  document.body.classList.toggle('dark-theme');
  switcher.textContent =
    document.body.className === 'light-theme' ? 'Dark' : 'Light';
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

// ===== 登録（ローカル） =====
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const pass = document.getElementById('register-password').value;

  if (users.find(u => u.email === email)) {
    alert('このメールアドレスは既に登録されています');
    return;
  }
  users.push({ email, password: pass });
  alert('登録完了！ログインしてください');
  document.getElementById('register-form').reset();
});

// ===== ログイン（ローカル） =====
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;

  const user = users.find(u => u.email === email && u.password === pass);
  if (user) {
    currentUser = user;
    updateAuthUI(currentUser);
    document.getElementById('login-form').reset();
  } else {
    alert('メールアドレスまたはパスワードが違います');
  }
});

// ===== ログアウト（ローカル） =====
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  updateAuthUI(null);
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

// ===== 投稿（ローカル） =====
const posts = { home: [], s: [], m: [], e: [], c: [] };

window.addPost = function (pageId) {
  const input = document.getElementById(pageId + '-input');
  const text = input.value.trim();
  if (!currentUser) {
    alert('ログインしてください');
    return;
  }
  if (!text) return;

  posts[pageId].unshift({ email: currentUser.email, text });
  renderPosts(pageId);
  input.value = '';
};

// ===== 投稿描画（ローカル） =====
function renderPosts(pageId) {
  const container = document.getElementById(pageId + '-posts');
  container.innerHTML = '';
  posts[pageId].forEach(p => {
    const div = document.createElement('div');
    div.className = 'post';
    div.textContent = `${p.email}: ${p.text}`;
    container.appendChild(div);
  });
}

// 初期表示用
['home', 's', 'm', 'e', 'c'].forEach(renderPosts);

