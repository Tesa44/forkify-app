import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Mateusz Tesarewicz
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear(); // Wyczyszczenie kontenera z napisu, który był zanim się pojawiają szczegóły przepisu
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError(); To nie ma sensu

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); //Zmiana stringa(HTML) na DOM element
    const newElements = Array.from(newDOM.querySelectorAll('*')); //Poszczególne elementy na stronie takie jak div, span itp...
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements); // Będziemy porównywać dwie tablice i zmienimy dane, które się różnią.
    //Dokładniej to będziemy zmieniać tylko te dane, które zawierają tylko tekst.
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Updates chagned TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log('XXXXX', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) //Atrybuty elementu, które trzeba przenieść
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
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
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
