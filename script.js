'use strict';

// 🌙 テーマ切り替え
const switcher = document.querySelector('.btn');
switcher.addEventListener('click', function () {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    const className = document.body.className;
    this.textContent = (className === "light-theme") ? "Dark" : "Light";

    console.log('current class name: ' + className);
});

// 🌍 ルーティング
const routes = {
    '/': 'home',
    '/s': 's',
    '/m': 'm',
    '/e': 'e',
    '/c': 'c',
    '/s/test': 'stest',
    '/s/free': 'sfree',
    '/m/test': 'mtest',
    '/m/free': 'mfree',
    '/e/free': 'efree',
    '/e/test': 'etest',
    '/c/test': 'ctest',
    '/c/free': 'cfree'
};

// 📝 投稿管理
function getPosts(page) {
    return JSON.parse(localStorage.getItem(`posts-${page}`) || '[]');
}
function savePosts(page, posts) {
    localStorage.setItem(`posts-${page}`, JSON.stringify(posts));
}
function addPost(page) {
    const input = document.getElementById(page + '-input');
    const text = input.value.trim();

    if (text === '') return;

    const posts = getPosts(page);
    posts.unshift({ text, date: new Date().toLocaleString(), user: getCurrentUser() });

    savePosts(page, posts);
    input.value = '';
    renderPosts(page);
}
function renderPosts(page) {
    const posts = getPosts(page);
    const container = document.getElementById(page + '-posts');
    container.innerHTML = '';

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `<strong>${post.user} (${post.date})</strong><br>${post.text}`;
        container.appendChild(div);
    });
}

// 🚪 ログイン機能
function login(username, password) {
    // 簡易ユーザー認証（実際はサーバー側が必要）
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username] && users[username] === password) {
        localStorage.setItem("currentUser", username);
        alert(username + " でログインしました！");
        updateAuthUI();
        router();
        return true;
    } else {
        alert("ユーザー名またはパスワードが違います。");
        return false;
    }
}
function register(username, password) {
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
        alert("このユーザー名はすでに使われています。");
        return false;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("ユーザー登録完了！");
    return true;
}
function logout() {
    localStorage.removeItem("currentUser");
    updateAuthUI();
    router();
}
function getCurrentUser() {
    return localStorage.getItem("currentUser") || "匿名";
}
function updateAuthUI() {
    const user = getCurrentUser();
    const loginSection = document.getElementById("login-section");
    const logoutSection = document.getElementById("logout-section");
    const usernameDisplay = document.getElementById("username-display");

    if (user && user !== "匿名") {
        loginSection.style.display = "none";
        logoutSection.style.display = "block";
        usernameDisplay.textContent = user;
    } else {
        loginSection.style.display = "block";
        logoutSection.style.display = "none";
        usernameDisplay.textContent = "";
    }
}

// 📌 ルーター
function router() {
    const path = location.hash.slice(1) || '/';

    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));

    const pageId = routes[path];
    if (pageId) {
        document.getElementById(pageId).classList.add('active');
        renderPosts(pageId);
    }
}

// 📦 初期化
window.addEventListener('load', () => {
    updateAuthUI();
    router();

    // ログインフォーム処理
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        login(username, password);
    });

    // 登録フォーム処理
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        register(username, password);
    });

    // ログアウトボタン処理
    document.getElementById("logout-btn").addEventListener("click", logout);
});
window.addEventListener('hashchange', router);
