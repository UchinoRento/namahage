'use strict';

const switcher = document.querySelector('.btn');

switcher.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    const className = document.body.className;
    if (className == "light-theme") {
        this.textContent = "Dark";
    } else {
        this.textContent = "Light";
    }

    console.log('current class name: ' + className);
});

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
    '/e/test': 'etest',
    '/e/free': 'efree',
    '/c/test': 'ctest',
    '/c/free': 'cfree'
};

function router() {
    const path = location.hash.slice(1) || '/';
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const pageId = routes[path];
    if (pageId) {
        document.getElementById(pageId).classList.add('active');
    }
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);
