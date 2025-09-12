<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>nits_ch</title>
  <link rel="stylesheet" href="main.css">
</head>
<body class="dark-theme">
  <h1>佐世保高専 掲示板</h1>
  <p id="msg">学科</p>

  <nav>
    <a href="#/">ホーム</a><br>
    <a href="#/m">機械工学科</a><br>
    <a href="#/e">電気電子工学科</a><br>
    <a href="#/s">電子制御工学科</a><br>
    <a href="#/c">物質工学科</a><br>
  </nav>

  <div id="app">
    <div id="home" class="page active">
      <h2>ホーム</h2>
      <p>佐世保高専の掲示板です！</p>
    </div>
    <div id="m" class="page">
      <h2>機械工学科ページ</h2>
    </div>
    <div id="e" class="page">
      <h2>電気電子工学科ページ</h2>
    </div>
    <div id="s" class="page">
      <h2>電子制御工学科ページ</h2>
    </div>
    <div id="c" class="page">
      <h2>物質工学科ページ</h2>
    </div>
  </div>

  <div>
    <button class="btn">Dark</button>
  </div>

  <script>
    // ルーティング定義（全部追加）
    const routes = {
      '/': 'home',
      '/m': 'm',
      '/e': 'e',
      '/s': 's',
      '/c': 'c'
    };

    function router() {
      const path = location.hash.slice(1) || '/';
      document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
      const pageId = routes[path];
      if (pageId) document.getElementById(pageId).classList.add('active');
    }

    window.addEventListener('load', router);
    window.addEventListener('hashchange', router);

    // ページ読み込み時にアラート
    alert('佐世保高専の掲示板です！');
  </script>

  <script src="app.js"></script>
  <noscript>You need to enable JavaScript to view the full site.</noscript>
</body>
</html>
