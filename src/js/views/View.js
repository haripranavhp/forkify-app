// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

export default class View {
	_data;
	/**
	 * Render the received object to the DOM
	 * @param {Object | Object[] } data  The data to be rendered
	 * @returns
	 * @this {Object} View instance
	 * @author _addHandlerUpdateServings
	 * @todo Finish Implementaion
	 */
	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
	update(data) {
		// if (!data || (Array.isArray(data) && data.length === 0))
		// 	return this.renderError();
		this._data = data;
		const newMarkup = this._generateMarkup();
		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll("*"));
		const curElements = Array.from(
			this._parentElement.querySelectorAll("*")
		);

		newElements.forEach((newEl, i) => {
			let curEl = curElements[i];
			//Updates changed text
			if (
				!curEl.isEqualNode(newEl) &&
				newEl.firstChild?.nodeValue.trim() !== ""
			) {
				curEl.textContent = newEl.textContent;
			}
			//Updates changed attributes
			if (!curEl.isEqualNode(newEl)) {
				Array.from(newEl.attributes).forEach((attr) =>
					curEl.setAttribute(attr.name, attr.value)
				);
			}
		});
	}
	_clear() {
		this._parentElement.innerHTML = "";
	}

	renderSpinner() {
		const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}.svg#icon-loader"></use>
              </svg>
            </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
	renderError(message = this._errorMessage) {
		const markup = `
            <div class="error">
				<div>
					<svg>
						<use href="${icons}#icon-alert-triangle"></use>
					</svg>
				</div>
				<p>${message}</p>
            </div>
            `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		const markup = `
            <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
          </div>
            `;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}
