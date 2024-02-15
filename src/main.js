import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const list = document.querySelector('.pictures-list');
const loader = document.querySelector('.loader');

const lightbox = new SimpleLightbox('.gallery-card a.gallary-card-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const searchImg = e.target.elements.input.value;

  if (searchImg.trim('') === '') {
    return;
  }

  loader.style.display = 'flex';

  if (lightbox) {
    lightbox.close();
    list.innerHTML = '';
  }

  setTimeout(() => {
    getImg(searchImg)
      .then(data => {
        render(data.hits);
        lightbox.refresh();
        if (data.hits.length === 0) {
          iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
            backgroundColor: 'red',
            messageColor: 'white',
          });
        }
      })
      .catch(error => {
        console.error('Помилка отримання зображень:', error);
      })
      .finally(() => {
        loader.style.display = 'none';
      });
  }, 500);

  e.target.reset();
});

function getImg(searchImg) {
  const API_KEY = '42390639-e472f6261e3eecbaf31797673';
  const URL = 'https://pixabay.com/api/';
  const PARAMS = new URLSearchParams({
    key: API_KEY,
    q: searchImg,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return fetch(`${URL}?${PARAMS}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function render(imgs) {
  const markup = imgs
    .map(img => {
      return `<li class="gallery-card">
    <a class="gallary-card-link" href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" />
    <ul class="image-info">
            <li class="image-item-info">
            <p>Likes</p>
            <p>${img.likes}</p>
        </li>
        <li class="image-item-info">
            <p>Views</p>
            <p>${img.views}</p>
        </li>
        <li class="image-item-info">
            <p>Comments</p>
            <p>${img.comments}</p>
        </li>
        <li class="image-item-info">
            <p>Downloads</p>
            <p>${img.downloads}</p>
        </li>
    </ul>
    </a>
</li>`;
    })
    .join('');

  list.insertAdjacentHTML('beforeend', markup);
}
