import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was succressfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); //Trzeba bo klasa View jest rodzicem
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    //POPJAWIANIE SIĘ NOWEGO OKNA TO TAK NAPRAWDĘ USUWANIE KLASY HIDDEN
    // this._btnOpen.addEventListener('click', function () {
    //   this._overlay.classList.toggle('hidden'); //Tutaj jest błąd ponieważ this wskazuje na element z addEventListener czyli btnOpen
    //   this.window.classList.toggle('hidden'); // A my chcemy żeby this wskazywało na obiekt klasy
    // });

    //NAPRAWA
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); //Gdy klikniemy poza okienko to też się zamyka
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; //Jako argument do FormData przekazujemy element, który jest Form w HTML. Tutaj jest this, bo jest eventListener właśnie na tym elemencie Form, który chcemy
      const data = Object.fromEntries(dataArr); //dataArr to tablica tablic dwuelementowych(key,value) i została ona przekonwertowana na normalny obiekt
      handler(data); //Przekazujemy dane do funkcji w controller
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
