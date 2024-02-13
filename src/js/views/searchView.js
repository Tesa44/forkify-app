class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    //Metoda, która pozyska nam input z pola tekstowego do wyszukiwania przepisów
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    //Submit - czyli nieważne czy klikniemy enter, czy przycisk search
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // musimy zapobiec wywołaniu domyślnej akcji, czyli ponownemu załadowaniu strony
      handler();
    });
  }
}

export default new SearchView();
