// ===== SPAルーティング =====
const routes = { '/':'home','/m':'m','/e':'e','/s':'s','/c':'c' };
function router() {
    const path = location.hash.slice(1) || '/';
    document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
    const pageId = routes[path];
    if(pageId) document.getElementById(pageId).classList.add('active');
}
window.addEventListener('load', router);
window.addEventListener('hashchange', router);

// ===== テーマ切替 =====
document.getElementById('toggleTheme')?.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-theme');
});

// ===== ローカル掲示板データ =====
let users = JSON.parse(localStorage.getItem('users') || '[]');
let posts = JSON.parse(localStorage.getItem('posts') || '{"home":[],"m":[],"e":[],"s":[],"c":[]}');
let currentUser = null;

// ===== 各学科ページにフォームと投稿欄を追加 =====
Object.keys(posts).forEach(pageId=>{
    const pageDiv = document.getElementById(pageId);
    if(!pageDiv) return;

    // 認証フォーム
    const authDiv = document.createElement('div');
    authDiv.innerHTML = `
        <input type="text" id="name_${pageId}" placeholder="名前">
        <input type="text" id="id_${pageId}" placeholder="学籍番号">
        <button id="register_${pageId}">登録</button>
        <button id="login_${pageId}">ログイン</button>
        <p id="msg_${pageId}"></p>
    `;
    pageDiv.appendChild(authDiv);

    // 投稿フォーム
    const postDiv = document.createElement('div');
    postDiv.innerHTML = `
        <textarea id="post_${pageId}" placeholder="投稿内容"></textarea><br>
        <button id="add_${pageId}">投稿</button>
        <div id="list_${pageId}"></div>
    `;
    pageDiv.appendChild(postDiv);

    // イベント登録
    document.getElementById(`register_${pageId}`).addEventListener('click', ()=>registerUser(pageId));
    document.getElementById(`login_${pageId}`).addEventListener('click', ()=>login(pageId));
    document.getElementById(`add_${pageId}`).addEventListener('click', ()=>addPost(pageId));

    renderPosts(pageId);
});

// ===== 登録 =====
function registerUser(pageId){
    const name = document.getElementById(`name_${pageId}`).value.trim();
    const id = document.getElementById(`id_${pageId}`).value.trim();
    const msg = document.getElementById(`msg_${pageId}`);
    if(!name || !id){ msg.textContent="名前と学籍番号を入力"; return; }
    if(users.find(u=>u.studentId===id)){ msg.textContent="学籍番号は既に登録済"; return; }
    users.push({name,studentId:id});
    localStorage.setItem('users',JSON.stringify(users));
    msg.textContent=`登録完了: ${name}`;
}

// ===== ログイン =====
function login(pageId){
    const id = document.getElementById(`id_${pageId}`).value.trim();
    const msg = document.getElementById(`msg_${pageId}`);
    const user = users.find(u=>u.studentId===id);
    if(user){ currentUser=user; msg.textContent=`ログイン成功: ${user.name}`; } 
    else{ msg.textContent="ユーザーが見つかりません"; }
}

// ===== 投稿追加 =====
function addPost(pageId){
    if(!currentUser){ alert("ログインしてください"); return; }
    const content = document.getElementById(`post_${pageId}`).value.trim();
    if(!content){ alert("投稿内容を入力"); return; }
    posts[pageId].push({author:currentUser.name,content,timestamp:new Date().toLocaleString()});
    localStorage.setItem('posts',JSON.stringify(posts));
    document.getElementById(`post_${pageId}`).value="";
    renderPosts(pageId);
}

// ===== 投稿表示 =====
function renderPosts(pageId){
    const listDiv=document.getElementById(`list_${pageId}`);
    listDiv.innerHTML="";
    posts[pageId].slice().reverse().forEach(p=>{
        const d=document.createElement('div');
        d.className='post';
        d.innerHTML=`<strong>${p.author}</strong> [${p.timestamp}]:<br>${p.content}`;
        listDiv.appendChild(d);
    });
}

