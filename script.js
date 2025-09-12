// ===== ユーザーと投稿データ =====
let users = JSON.parse(localStorage.getItem('users') || '[]');
let posts = JSON.parse(localStorage.getItem('posts') || '{"home":[]}');
let currentUser = null;

// ===== ユーザー登録 =====
function registerUser() {
    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    if(!name || !studentId) { alert("名前と学籍番号を入力してください"); return; }
    if(users.find(u => u.studentId === studentId)) { alert("この学籍番号は既に登録済みです"); return; }

    users.push({name, studentId});
    localStorage.setItem('users', JSON.stringify(users));
    alert("登録完了しました");
}

// ===== ログイン =====
function login() {
    const studentId = document.getElementById('studentId').value.trim();
    const user = users.find(u => u.studentId === studentId);
    if(user) {
        currentUser = user;
        document.getElementById('currentUser').textContent = currentUser.name;
        document.getElementById('auth').style.display = 'none';
        document.getElementById('board').style.display = 'block';
        renderPosts();
    } else {
        alert("ユーザーが見つかりません");
    }
}

// ===== ログアウト =====
function logout() {
    currentUser = null;
    document.getElementById('auth').style.display = 'block';
    document.getElementById('board').style.display = 'none';
}

// ===== 投稿追加 =====
function addPost() {
    if(!currentUser) { alert("ログインしてください"); return; }
    const content = document.getElementById('newPost').value.trim();
    if(!content) { alert("投稿内容を入力してください"); return; }

    posts['home'].push({author: currentUser.name, content, timestamp: new Date().toLocaleString()});
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById('newPost').value = "";
    renderPosts();
}

// ===== 投稿表示 =====
function renderPosts() {
    const container = document.getElementById('postContainer');
    container.innerHTML = "";
    posts['home'].slice().reverse().forEach(post => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${post.author}</strong> [${post.timestamp}]:<br>${post.content}`;
        container.appendChild(div);
    });
}

