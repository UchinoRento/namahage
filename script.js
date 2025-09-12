// ===== ログイン情報・投稿をlocalStorageに保存 =====
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users') || '[]');
let posts = JSON.parse(localStorage.getItem('posts') || '{"home":[],"s":[],"m":[],"e":[],"c":[]}');

// 登録
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const pass = document.getElementById('register-password').value.trim();
  if (users.find(u => u.email === email)) {
    alert('このメールアドレスは既に登録されています');
    return;
  }
  users.push({ email, password: pass });
  localStorage.setItem('users', JSON.stringify(users));
  alert('登録完了！ログインしてください');
  e.target.reset();
});

// ログイン
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const user = users.find(u => u.email === email && u.password === pass);
  if (user) {
    currentUser = user;
    updateAuthUI(currentUser);
    e.target.reset();
    loadPosts();
  } else {
    alert('メールアドレスまたはパスワードが違います');
  }
});

// ログアウト
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  updateAuthUI(null);
});

// 投稿
document.getElementById('post-btn').addEventListener('click', () => {
  const text = document.getElementById('home-input').value.trim();
  if (!text || !currentUser) return;
  posts.home.push({ text, email: currentUser.email, created: new Date().toISOString() });
  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('home-input').value = '';
  loadPosts();
});

function loadPosts() {
  const postsDiv = document.getElementById('home-posts');
  postsDiv.innerHTML = '';
  posts.home.slice().reverse().forEach(p => {
    const el = document.createElement('p');
    el.textContent = `${p.email}: ${p.text}`;
    postsDiv.appendChild(el);
  });
}

function updateAuthUI(user) {
  if (user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('logout-section').style.display = 'block';
    document.getElementById('username-display').textContent = user.email;
    document.getElementById('home').style.display = 'block';
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('logout-section').style.display = 'none';
    document.getElementById('home').style.display = 'none';
  }
}

// ページ読み込み時に投稿を表示（ログイン状態は手動で）
loadPosts();
