<nav>
    <a href="#/"data-link>ホーム</a><br>
    <a href="#/m"data-link>機械工学科</a><br>
    <a href="#/e"data-link>電気電子工学科</a><br>
    <a href="#/s"data-link>電子制御工学科</a><br>
    <a href="#/c"data-link>物質工学科</a><br>
</nav>

<div id="app">
    <div id="home" class="page active"><h2>ホーム</h2><p>佐世保高専の掲示板です！</p></div>
    <div id="s" class="page"><h2>電子制御工学科ページ</h2></div>
    <div id="m" class="page"><h2>機械工学科ページ</h2></div>
</div>

<script>
    const routes={
        '/': 'home',
        '/s':'s',
        '/m':'s'
    };

    function router(){
        const path=location.hash.slice(1) || '/';
        document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
        const pageId = routes[path];
        if(pageId) document.getElementById(pageId).classList.add('active');
    }

    window.addEventListener('load', router);

    window.addEventListener('hashchange', router);
</script>
<ul>
    <script>alert('佐世保高専の掲示板です！')</script>
</ul>
<div>
    <button class="btn">Dark</button>
</div>
<script src="app.js"></script>
<noscript>You need to enable JavaScript to view the full site.</noscript>
