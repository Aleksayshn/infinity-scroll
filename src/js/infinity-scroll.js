'use strict'

import { lightbox } from "../index";
import { galleryListEl } from "../index";
import { pixabayAPI, targetScrollEl, endCollectionText } from "../index";
import { createMarkUpGallery, } from './markup';


export const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
        return;
    }
    onLoadMoreBtnClick()
}, {
    root: null,
    rootMargin: '0px 0px 250px 0px',
    threshold: 1.0,
});

async function onLoadMoreBtnClick() {
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
            observer.unobserve(targetScrollEl); //убираем элемент из слежения
            endCollectionText.classList.remove("is-hidden");
        }
    }
    catch (error) {
        console.log(error);
    }
}