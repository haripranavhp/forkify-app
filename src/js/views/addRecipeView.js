import View from "./View";
// import icons from '../img/icons.svg'  // Parcel 1
import icons from "url:../../img/icons.svg"; // Parcel 2

class AddRecipeView extends View {
	_message = "Recipe was successfully uploaded :)";
	_parentElement = document.querySelector(".upload");

	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");

	_btnOpen = document.querySelector(".nav__btn--add-recipe");
	_btnClose = document.querySelector(".btn--close-modal");
	constructor() {
		super();
		this._addHadlerShowWindow();
		this._addHadlerHideWindow();
	}
	toggleWindow() {
		this._overlay.classList.toggle("hidden");
		this._window.classList.toggle("hidden");
	}
	_addHadlerShowWindow() {
		this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
	}
	_addHadlerHideWindow() {
		this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
	}
	addHandlerUpload(handler) {
		this._parentElement.addEventListener("submit", function (e) {
			e.preventDefault();
			const dataArr = [...new FormData(this)];
			const data = Object.fromEntries(dataArr); // entries to object
			handler(data);
			// upload__btn;
		});
	}
	_generateMarkup() {}
}

export default new AddRecipeView();
