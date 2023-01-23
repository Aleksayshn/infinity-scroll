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
    endCollectionText: document.querySelector(".end-collection-text"),
}

const { searchFormEl, galleryListEl, loadMoreBtnEl, searchBtnEl, endCollectionText } = refs;
const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(e) {
    e.preventDefault();
    loadMoreBtnEl.classList.add('is-hidden');
    endCollectionText.classList.add("is-hidden");
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
        console.log(data);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        galleryListEl.innerHTML = createMarkUpGallery(data.hits);
        lightbox.refresh();

        if (data.totalHits > pixabayAPI.per_page) {
            loadMoreBtnEl.classList.remove('is-hidden');
            return
        }
        endCollectionText.classList.remove("is-hidden");
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
        const { data } = await pixabayAPI.fetchImagePixabay();
        galleryListEl.insertAdjacentHTML('beforeend', createMarkUpGallery(data.hits));
        lightbox.refresh();

        const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });

        if (data.totalHits < pixabayAPI.per_page * pixabayAPI.page) {
            loadMoreBtnEl.classList.add('is-hidden');
            endCollectionText.classList.remove("is-hidden");
        }
    }

    catch (error) {
        console.log(error);
    }

    finally {
        e.target.disabled = false;
    }

}