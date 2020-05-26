//РАБОТА ЛЕВОГО МЕНЮ
const leftMenu = document.querySelector('.left-menu'),
hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.openMenu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});
leftMenu.addEventListener('click', event => {
    const target = event.target;
    dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

//DATA-backdrop
const imgs = document.querySelectorAll('.tv-card__img');
imgs.forEach(img => {
    const basicImg = img.currentSrc;
    img.addEventListener('mouseenter', event => {
        const target = event.target;
        target.src = target.dataset.backdrop;
    });
    img.addEventListener('mouseleave', event => {
        const target = event.target;
        target.src = basicImg;
    });
});



