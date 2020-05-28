const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3/';
const API_KEY = '1909b1d8171b12d0b7da4e9cd8812dc6';
const tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShows = document.querySelector('.tv-shows'),
    searchForm = document.querySelector('.search__form'),
    searchInput = document.querySelector('.search__form-input');


//ЛОАДЕР
const loading = document.createElement('div');
loading.className = 'loading';

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
    getTestCard = () => {
        return this.getData('card.json');
    }
    getSearchResult = query => {
        return this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`)
    }
    getTvShow = id => this.getData(`${SERVER}tv/${id}?api_key=${API_KEY}&language=ru-RU`)


}

const renderCard = response => {
    tvShowList.textContent = '';

    if (response.results.length) {
        response.results.forEach(({
                                backdrop_path: backdrop,
                                name: title,
                                poster_path: poster,
                                vote_average: vote,
                                id: id
                                }) => {
            const card = document.createElement('li');
            const posterIMG = poster? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropIMG = backdrop? IMG_URL + backdrop : '';
            const voteElem  = vote? vote : '';

            card.classList.add('tv-shows__item');
            card.classList.add('new-cards');
            card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    <span class="tv-card__vote">${voteElem}</span>
                    <img class="tv-card__img"
                            src="${posterIMG}"
                            data-backdrop="${backdropIMG}"
                            alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            loading.remove();
            tvShowList.append(card);
            const voteVal = card.querySelector('.tv-card__vote');
            if (voteVal.textContent === ''){
                voteVal.remove();
            };


            //Смена картинок
            card.addEventListener('mouseenter', event => {
                card.querySelector('.tv-card__img').src = backdropIMG;
            });
            card.addEventListener('mouseleave', event => {
                card.querySelector('.tv-card__img').src = posterIMG;
            });
        });
    } else {
        loading.remove();
        document.querySelector('.tv-shows__head').textContent = 'По вашему запросу сериалов не найдено';
    }


}
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchInput.value.trim();

    if (value){
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchInput.value = '';
});


//MODAL
tvShowList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card){
        const tvCardImg = modal.querySelector('.tv-card__img'),
            modalTitle = modal.querySelector('.modal__title'),
            genres = modal.querySelector('.genres'),
            rating = modal.querySelector('.rating'),
            description = modal.querySelector('.description'),
            modalLink = modal.querySelector('.modal__link'),
            preloader = document.querySelector('.preloader');

        preloader.style.display = 'block';
        //new DBService().getTestCard()
        new DBService().getTvShow(card.id)
            .then(response => {
                preloader.style.display = 'none';
                console.log(response.poster_path);
                if (response.poster_path){
                    tvCardImg.src = IMG_URL + response.poster_path;
                } else {
                    modal.querySelector('.image__content').remove();
                }

                modalTitle.textContent = response.name;
                genres.innerHTML = response.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');
                rating.textContent = response.vote_average;
                description.textContent = response.overview;
                modalLink.textContent = response.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })



    }
});

modal.addEventListener('click', event => {
    const target = event.target;
    if (target.classList.contains('modal') || target.closest('.cross')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});






