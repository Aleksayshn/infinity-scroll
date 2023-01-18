'use strict'

import axios from 'axios';


export class PixabayAPI {
    static BASE_URL = 'https://pixabay.com/api/';
    static API_KEY = '32902525-5659279b2e410ad3de3aa6bbd';

    constructor() {
        this.page = 1;
        this.query = null;
        this.per_page = 40;
        this.axios = require('axios');
        this.searchQuery = '';

    }

    async fetchImagePixabay() {
        try {
            const response = await axios.get(
                `${BASE_URL}/?
    key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`
            );
            const data = response.data;
            this.incrementPage();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}

//         const searchParams = new URLSearchParams({
//             key: PixabayAPI.API_KEY,
//             q: this.query,
//             page: this.page,
//             per_page: 40,
//             image_type: 'photo',
//             orientation: 'horizontal',
//             safesearch: true,
//         });

//         const response = await fetch(`${PixabayAPI.BASE_URL}?${searchParams}`);
//         if (!response.ok) {
//             throw new Error(response.status);
//         }
//         return await response.json();
//     }
// }
