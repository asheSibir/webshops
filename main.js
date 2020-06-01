const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3/';
const API_KEY = '1909b1d8171b12d0b7da4e9cd8812dc6';
const tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShows = document.querySelector('.tv-shows'),
    searchForm = document.querySelector('.search__form'),
    searchInput = document.querySelector('.search__form-input'),
    dropdownItems = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    faSearch = document.getElementById('search'),
    pagination = document.querySelector('.pagination');
let queryOfSet = searchInput.value;


//ЛОАДЕР
const loading = document.createElement('div');
loading.className = 'loading';

//РАБОТА ЛЕВОГО МЕНЮ
const closeDropdown = () => {
    dropdownItems.forEach(item => {
        if (item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
}
hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});
document.addEventListener('click', (ev) => {
    if (!ev.target.closest('.openMenu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
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

    if (target.closest('#top-rated')){
        dbService.getStatistic('top_rated').then(renderCard).finally(changeTitle(target));
    }
    if (target.closest('#popular')){
        dbService.getStatistic('popular').then(renderCard).finally(changeTitle(target));
    }
    if (target.closest('#today')){
        dbService.getStatistic('airing_today').then(renderCard).finally(changeTitle(target));
    }
    if (target.closest('#week')){
        dbService.getStatistic('on_the_air').then(renderCard).finally(changeTitle(target));
    }
    if (target.closest('.fa-search')){
        tvShowsHead.textContent = '';
        tvShowList.textContent = '';
        leftMenu.classList.add('openMenu');
        const searchCustom = document.createElement('form');
        searchCustom.innerHTML = `
        <form class="search__form">
            <label class="search__form-block">
                <input type="text" class="search__form-input" id="searchText2"
                    placeholder="Введи название...">
            </label>
        </form>`;
        faSearch.querySelector('span').textContent = 'ТЕКСТ ДЛЯ ПОИСКА';
        faSearch.querySelector('.fa-search').style.display = 'inline-block';
        searchCustom.style.display = "inline-block";
        searchCustom.style.color = '#fff';
        searchCustom.querySelector('input').style.cssText = `
        text-transform: uppercase;
        text-decoration: none;
        color: #fff;
        text-align: center;
        `;
        faSearch.append(searchCustom);
        searchCustom.addEventListener('submit', event => {
            event.preventDefault();
            doAfterSubmit(searchCustom.querySelector('input'));
            searchCustom.remove();
        });
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

    getStatistic = (feature) => this.getData(`${SERVER}tv/${feature}?api_key=${API_KEY}&language=ru-RU`)

    getDataFromPage = (query, page) => {
        return this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU&page=${page}`)
    }
}

const dbService = new DBService();

const renderCard = (response) => {
    tvShowList.textContent = '';
    pagination.querySelectorAll('li').forEach(li => li.remove());
    if (response.total_pages > 1){
        for (let page = 0; page < response.total_pages; page++){
            pagination.insertAdjacentHTML('beforeend', `<li class="circle-point">${page+1}</li>`);
            if (page === 0) {
                pagination.querySelector('li').classList.add('active-circle');
            }
        }
    }

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
            if (leftMenu.classList.contains('openMenu')){
               leftMenu.classList.remove('openMenu');
            }
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

    if (pagination.querySelector('li')) {
        const pages = pagination.querySelectorAll('li');
        pages.forEach(page => {
            page.addEventListener('click', event => {
                document.querySelector('.active-circle').classList.remove('active-circle');
                event.target.classList.add('active-circle');
                dbService.getDataFromPage(queryOfSet, event.target.textContent).then(renderCard);
                console.log(event.target.textContent);
            });
        })
    }
}

const changeTitle = (elem) => {
    tvShowsHead.textContent = elem.textContent;
}

const doAfterSubmit = (elem) => {
    tvShowsHead.textContent = 'Результаты поиска';
    const value = elem.value.trim();

    if (value){
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
    }
    searchInput.value = '';
}

// searchForm.addEventListener('submit', event => {
//     event.preventDefault();
//     doAfterSubmit();
//});

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();
        doAfterSubmit(searchInput);
    });
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
        dbService.getTvShow(card.id)
            .then(response => {
                preloader.style.display = 'none';
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
            .finally(() => {
                preloader.style.display = '';
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











