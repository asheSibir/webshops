const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '1909b1d8171b12d0b7da4e9cd8812dc6';
const tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger');;

//РАБОТА ЛЕВОГО МЕНЮ
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

//MODAL
const showModal = () => {

    tvShowList.addEventListener('click', event => {
        event.preventDefault();
        const target = event.target;
        const card = target.closest('.tv-card');

        if (card){
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        }
    });

    modal.addEventListener('click', event => {
        const target = event.target;
        if (target.classList.contains('modal') || target.closest('.cross')){
            document.body.style.overflow = '';
            modal.classList.add('hide');
        }
    });


};
showModal();

// КЛАСС
const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok){
            return (res.json());
        } else {
            throw new Error('Не удалось получить данные');
        };
    };
    getTestData = async () => {
        return await this.getData('test.json');
    };
}
const renderCard = response => {
    tvShowList.textContent = '';

    response.results.forEach(({
                            backdrop_path: backdrop,
                            name: title,
                            poster_path: poster,
                            vote_average: vote
                            }) => {
        const card = document.createElement('li');
        const posterIMG = poster? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop? IMG_URL + backdrop : '';
        const voteElem  = vote? vote : '';

        card.classList.add('tv-shows__item');
        card.classList.add('new-cards');
        card.innerHTML = `
            <a href="#" class="tv-card">
                <span class="tv-card__vote">${voteElem}</span>
                <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        tvShowList.append(card);
        const voteVal = card.querySelector('.tv-card__vote');
        if (voteVal.textContent === ''){
            voteVal.remove();
        };
        card.addEventListener('mouseenter', event => {
            card.querySelector('.tv-card__img').src = backdropIMG;
        });
        card.addEventListener('mouseleave', event => {
            card.querySelector('.tv-card__img').src = posterIMG;
        });
    });

}
new DBService().getTestData().then(renderCard);



