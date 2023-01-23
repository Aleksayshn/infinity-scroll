import './css/styles.css';
import './css/gallery.css';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { PixabayAPI } from './js/api';
import { createMarkUpGallery } from './js/markup';
import { observer } from './js/infinity-scroll';

export const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
});

const refs = {
    searchFormEl: document.querySelector('#js-search-form'),
    galleryListEl: document.querySelector('.js-gallery'),
    searchBtnEl: document.querySelector('.js-search-btn'),
    endCollectionText: document.querySelector(".end-collection-text"),
    targetScrollEl: document.querySelector(".target-element")
}

export const { searchFormEl, galleryListEl, searchBtnEl, targetScrollEl, endCollectionText } = refs;
export const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(e) {
    e.preventDefault();
    pixabayAPI.query = e.target.elements.searchQuery.value.trim().toLowerCase();
    pixabayAPI.page = 1;

    if (pixabayAPI.query === '') {
        galleryListEl.innerHTML = '';
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        e.target.reset();
        return;
    }

    try {
        const { data } = await pixabayAPI.fetchImagePixabay();
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            e.target.reset();
            galleryListEl.innerHTML = '';
            return;
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        galleryListEl.innerHTML = createMarkUpGallery(data.hits);
        lightbox.refresh();
        setTimeout(() => { // помещаем функцию отсеживания в макроочередь, чтобы 
            // отслеживание вызывалась только после рендера/отрисовывания img
            observer.observe(targetScrollEl) // Выбор отслеживаемого элемента
        }, 100); //ставим задержку чтобі успела отрисоваться страница

        if (data.totalHits > pixabayAPI.per_page) {
            return
        }
        endCollectionText.classList.remove("is-hidden");
    }
    catch (error) {
        console.log(error);
    }
    searchBtnEl.disabled = false;
}

