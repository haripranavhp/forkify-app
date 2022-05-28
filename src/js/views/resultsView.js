import View from "./View";
// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

class resultsView extends View {
	_parentElement = document.querySelector(".results");
	_errorMessage = "No recipes found for your query, Please try again!";
	_message = "Start by searching for a recipe or an ingredient. Have fun!";

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
	}
}

export default new resultsView();
