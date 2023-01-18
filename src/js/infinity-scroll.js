export function onLoadMoreBtnClick() {

    if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
        pixabayAPI.page += 1;
        console.log(pixabayAPI.page);


        pixabayAPI.fetchImagePixabay()
            .then(data => {
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
    }
};