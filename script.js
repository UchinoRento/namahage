
'use strict';

const switcher = document.querySelector('.btn');

switcher.addEventListener('click', function() {

document.body.classList.toggle('light-theme');

document.body.classList.toggle('dark-theme');



const className = document.body.className;

if(className=="light-theme"){

    this.textContent="Dark";

}else{

    this.textContent = "Light";

}



console.log('current class name: '+className);

});

const routes={

'/': 'home',

'/s':'s',

'/m':'m',

'/e':'e',

'/c':'c',

'/s/test':'stest',

'/s/free':'sfree',

'/m/test':'mtest',

'/m/free':'mfree',

'/e/free':'efree',

'/e/test':'etest',

'/c/test':'ctest',

'/c/free':'cfree'

};

function getPosts(page){

return JSON.parse(localStorage.getItem(`posts-${page}`) ||'[]');

}

function savePosts(page,posts){

localStorage.setItem(`posts-${page}`,JSON.stringify(posts));

}

function addPost(page){

const input = document.getElementById(page + '-input');

const text = input.value.trim();

if(text ==='')return;

const posts = getPosts(page);

posts.unshift({text,date: new Date().toLocaleString()});

savePosts(page,posts);

input.value='';

renderPosts(page);

}

function renderPosts(page){

const posts = getPosts(page);

const container = document.getElementById(page + '-posts');

container.innerHTML = '';

posts.forEach(post=>{

    const div = document.createElement('div');

    div.className = 'post';

    div.innerHTML = `<strong>${post.date}</strong><br>${post.text}`;

    container.appendChild(div);

});

}

function router(){

const path=location.hash.slice(1) || '/';

document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));

const pageId = routes[path];

if(pageId) {

    document.getElementById(pageId).classList.add('active');

    renderPosts(pageId);

}

}

window.addEventListener('load', router);

window.addEventListener('hashchange', router
