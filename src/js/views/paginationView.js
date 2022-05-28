import View from "./View";
// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

class PaginationView extends View {
	_parentElement = document.querySelector(".pagination");
	_errorMessage = "No recipes found for your query, Please try again!";
	_message = "Start by searching for a recipe or an ingredient. Have fun!";

	addhandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline");
			if (!btn) return;
			// console.dir(btn);
			const goToPage = Number(btn.dataset.goto);
			handler(goToPage);
		});
	}

	_generateMarkup() {
		const curPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		const leftBtn = `<button data-goto="${curPage - 1}" 
                                class="btn--inline pagination__btn--prev">
                            <svg class="search__icon">
                                <use href="${icons}#icon-arrow-left"></use>
                            </svg>
                            <span>Page ${curPage - 1}</span>
                        </button>`;

		const numOfPages = `<button class="btn--inline pagination__btn--pages">
                            <span>${numPages} Pages</span>
                        </button>`;

		const RightBtn = `<button data-goto="${curPage + 1}" 
                                class="btn--inline pagination__btn--next">
                            <span>Page ${curPage + 1}</span>
                            <svg class="search__icon">
                                <use href="${icons}#icon-arrow-right"></use>
                            </svg>
                        </button>`;

		if (curPage === 1 && numPages > 1) return numOfPages + RightBtn; //page 1 other pages

		if (curPage === numPages && numPages > 1) return leftBtn + numOfPages; //last page

		if (curPage < numPages) return leftBtn + numOfPages + RightBtn; // other page

		return ""; // page 1 and no other pages
	}
}

export default new PaginationView();
