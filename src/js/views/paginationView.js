import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _curPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    //Nie potrzebujemy argumentu z danymi, ponieważ funkcja render w View pobiera dane, które możemy użyć tutaj
    this._curPage = +this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1, and there are other pages
    if (this._curPage === 1 && numPages > 1)
      return this._generateMarkupButton(false, true);

    //Page 1, and there are NO other pages
    if (this._curPage === 1 && numPages === 1)
      return this._generateMarkupButton();

    // Last page
    if (this._curPage === numPages && numPages > 1)
      return this._generateMarkupButton(true);

    //Other page
    if (this._curPage < numPages && this._curPage > 1)
      return this._generateMarkupButton(true, true);
  }
  _generateMarkupButton(previous = false, next = false) {
    const previousButton = `
        <button data-goto="${
          this._curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._curPage - 1}</span>
        </button>`;
    const nextButton = `
        <button data-goto="${
          this._curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${this._curPage + 1}</span>
            <svg class="search__icon">1
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    return (previous ? previousButton : '') + (next ? nextButton : '');
  }
}

export default new PaginationView();
