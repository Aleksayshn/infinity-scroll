import './css/styles.css';
import './css/gallery.css';

import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { PixabayAPI } from './js/api';
import { createMarkUpGallery } from './js/markup';

const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
});

const refs = {
    searchFormEl: document.querySelector('#js-search-form'),
    galleryListEl: document.querySelector('.js-gallery'),
    loadMoreBtnEl: document.querySelector('.js-load-more'),
    searchBtnEl: document.querySelector('.js-search-btn'),
}

const { searchFormEl, galleryListEl, loadMoreBtnEl, searchBtnEl } = refs;
const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(e) {
    e.preventDefault();
    loadMoreBtnEl.classList.add('is-hidden');
    searchBtnEl.disabled = true;
    pixabayAPI.query = e.target.elements.searchQuery.value.trim().toLowerCase();
    pixabayAPI.page = 1;

    try {
        const dataFromFetch = await pixabayAPI.fetchImagePixabay();
        if (dataFromFetch.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            e.target.reset();
            galleryListEl.innerHTML = '';
            return;
        }

        if (dataFromFetch.totalHits > pixabayAPI.per_page) {
            loadMoreBtnEl.classList.remove('is-hidden');
        }

        Notiflix.Notify.success(`Hooray! We found ${dataFromFetch.totalHits} images.`);
        galleryListEl.innerHTML = createMarkUpGallery(dataFromFetch.hits);
        lightbox.refresh();
    }
    catch (error) {
        console.log(error);
    }
    finally {
        searchBtnEl.disabled = false;
    };
}

async function onLoadMoreBtnClick(e) {
    e.target.disabled = true;
    pixabayAPI.page += 1;

    try {
        const loadMoreData = await pixabayAPI.fetchImagePixabay();
        galleryListEl.insertAdjacentHTML('beforeend', createMarkUpGallery(loadMoreData.hits));
        lightbox.refresh();
        const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });

        if (loadMoreData.hits.length === 0) {
            loadMoreBtnEl.classList.add('is-hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }

    catch (error) {
        console.log(error);
    }

    finally {
        e.target.disabled = false;

    }

}