<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>佐世保高専 掲示板</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="dark-theme">
  <!-- 🔑 ログイン / 新規登録 -->
  <div id="login-section">
    <h2>ログイン</h2>
    <form id="login-form">
      <input id="login-email" type="email" placeholder="メールアドレス" required>
      <input id="login-password" type="password" placeholder="パスワード" required>
      <button type="submit">ログイン</button>
    </form>

    <h3>新規登録</h3>
    <form id="register-form">
      <input id="register-email" type="email" placeholder="メールアドレス" required>
      <input id="register-password" type="password" placeholder="パスワード" required>
      <button type="submit">登録</button>
    </form>
  </div>

  <!-- 👤 ログイン後表示 -->
  <div id="logout-section" style="display:none;">
    <p>ログイン中: <span id="username-display"></span></p>
    <button id="logout-btn">ログアウト</button>
  </div>

  <!-- 🔗 ナビゲーション -->
  <nav>
    <a href="#/" data-link>ホーム</a> |
    <a href="#/s" data-link>電子制御</a> |
    <a href="#/m" data-link>機械</a> |
    <a href="#/e" data-link>電気電子</a> |
    <a href="#/c" data-link>物質</a>
  </nav>

  <!-- 📄 ページ群 -->
  <div id="home" class="page active">
    <h2>ホーム</h2>
    <input id="home-input" type="text" placeholder="投稿を書いてください">
    <button onclick="addPost('home')">投稿</button>
    <div id="home-posts"></div>
  </div>

  <div id="s" class="page">
    <h2>電子制御工学科</h2>
    <input id="s-input" type="text" placeholder="投稿を書いてください">
    <button onclick="addPost('s')">投稿</button>
    <div id="s-posts"></div>
  </div>

  <div id="m" class="page">
    <h2>機械工学科</h2>
    <input id="m-input" type="text" placeholder="投稿を書いてください">
    <button onclick="addPost('m')">投稿</button>
    <div id="m-posts"></div>
  </div>

  <div id="e" class="page">
    <h2>電気電子工学科</h2>
    <input id="e-input" type="text" placeholder="投稿を書いてください">
    <button onclick="addPost('e')">投稿</button>
    <div id="e-posts"></div>
  </div>

  <div id="c" class="page">
    <h2>物質工学科</h2>
    <input id="c-input" type="text" placeholder="投稿を書いてください">
    <button onclick="addPost('c')">投稿</button>
    <div id="c-posts"></div>
  </div>

  <!-- 🌙 ダークモード切替 -->
  <button class="btn">Light</button>

  <script src="script.js"></script>
</body>
</html>
