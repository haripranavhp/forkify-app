import View from "./View";
// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

class BookmarksView extends View {
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = "No Bookmarks yet. Find a nice recipe and bookmark it :)";
	_message = "";

	_generateMarkup() {
		return this._data.map(this._generateMarkupPreview).join("");
	}

	_generateMarkupPreview(res) {
		const id = window.location.hash.slice(1);
		return `
            <li class="preview">
            <a class="preview__link 
            ${id === res.id ? "preview__link--active" : ""}" 
            href="#${res.id}">
                <figure class="preview__fig">
                    <img src="${res.image}" alt="${res.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${res.title}</h4>
                    <p class="preview__publisher">${res.publisher}</p>
                    <div class="preview__user-generated 
                    ${res.key ? "" : "hidden"}">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                    </div>
                </div>
            </a>
            </li>
            `;
		// preview__link--active
		/*<div class="preview__user-generated">
                        <svg>
                            <use href="${icons}#icon-user"></use>
                        </svg>
        </div>*/
	}
}

export default new BookmarksView();
