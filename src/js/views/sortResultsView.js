import View from "./View";
// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

class SortResultsView extends View {
	_parentElement = document.querySelector(".sort");
	_errorMessage = "No recipes found for your query, Please try again!";
	_message = "Start by searching for a recipe or an ingredient. Have fun!";

	_generateMarkup() {
		// console.log(this._data);
		return `<button class="btn--inline sort__btn">
                    <span>Sort by Cooking time ⬆⬇</span>
                </button>`;
	}
	addHandlerSort(handler) {
		this._parentElement.addEventListener("click", (e) => {
			const btn = e.target.closest(".sort__btn");
			if (!btn) return;
			const ids = [...this._data].map((entry) => entry.id);
			handler(ids);
		});
	}
}

export default new SortResultsView();
