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
  document.getElementById('register-form').reset();
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
    document.getElementById('login-form').reset();
  } else {
    alert('メールアドレスまたはパスワードが違います');
  }
});

// ログアウト
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  updateAuthUI(null);
});

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

// 投稿なども同じ(localStorageに保存)
