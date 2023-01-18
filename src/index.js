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

function onSearchFormSubmit(e) {
    e.preventDefault();
    loadMoreBtnEl.classList.add('is-hidden');
    searchBtnEl.disabled = true;
    pixabayAPI.query = e.target.elements.searchQuery.value.trim().toLowerCase();
    pixabayAPI.page = 1;

    pixabayAPI
        .fetchImagePixabay()
        .then(data => {
            if (data.hits.length === 0) {
                Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
                e.target.reset();
                galleryListEl.innerHTML = '';
                return;
            }

            if (data.totalHits > pixabayAPI.per_page) {
                loadMoreBtnEl.classList.remove('is-hidden');
            }
            galleryListEl.innerHTML = createMarkUpGallery(data.hits);
        }
        )
        .catch(err => {
            switch (err.message) {
                case '404': {
                    console.log(err);
                    break;
                }
            }
        })
        .finally(() => {
            searchBtnEl.disabled = false;
        });
}


function onLoadMoreBtnClick(e) {
    e.target.disabled = true;
    pixabayAPI.page += 1;

    pixabayAPI.fetchImagePixabay()
        .then(data => {
            galleryListEl.insertAdjacentHTML('beforeend', createMarkUpGallery(data.hits));
            lightbox.refresh();

            if (data.totalHits < pixabayAPI.per_page * pixabayAPI.page) {
                loadMoreBtnEl.classList.add('is-hidden');
                Notiflix.Notify.info(
                    "We're sorry, but you've reached the end of search results."
                );
            }
        })
        .catch(
            err => {
                console.log(err);
            }
        )
        .finally(
            () => {
                e.target.disabled = false;
            });
}


