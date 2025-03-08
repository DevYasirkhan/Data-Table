'use strict';

////////////////////////////////////////////
// Selector
const dataTable = document.querySelector('.data-table');
const filter = document.querySelector('.header__wrap-filter');
const searchInput = document.querySelector('.input__search');
const btnAddCustomer = document.querySelector('.btn-add');
const headerCheckbox = document.querySelector('.data-header__checkbox-input');
const btnSort = document.querySelector('.fa-sort');

const actionBox = document.querySelector('.action-box');
const btnEdit = document.querySelector('.btn-edit');
const btndelete = document.querySelector('.btn-delete');

// Form
const form = document.querySelector('.form');
const id = document.querySelector('.form__input-1');
const uname = document.querySelector('.form__input-2');
const location = document.querySelector('.form__input-3');
const age = document.querySelector('.form__input-4');
const description = document.querySelector('.form__input-5');

// Pagination
const footer = document.querySelector('.footer');
const paginationRightPerPage = document.querySelector(
  '.pagination-right__pages'
);
const perPageList = document.querySelector('.per-page-list');

////////////////////////////////////////////
// Class

class DataTable {
  #data = [];
  #totalData = [];
  #currentPage = 1;
  #totalItems = 0;
  #isFiltering = false;
  #filteredQuery = '';
  #sortOrder = null;
  #options = null;

  constructor(selector, options) {
    this.tableElement = document.querySelector(selector);
    this.#options = options;

    this.#init();
  }

  #init() {
    // AdEventListener
    window.addEventListener('DOMContentLoaded', this.#fetchData.bind(this));
    filter.addEventListener('change', this.#filterData.bind(this));
    btnAddCustomer.addEventListener('click', this.#addCustomer.bind(this));
    searchInput.addEventListener('input', this.#searchData.bind(this));
    headerCheckbox.addEventListener('change', this.#action.bind(this));
    btnSort.addEventListener('click', this.#sortData.bind(this));
    dataTable.addEventListener('click', this.#action.bind(this));
    footer.addEventListener('click', this.#pagination.bind(this));
    paginationRightPerPage.addEventListener('click', this.#dropDown.bind(this));
  }

  // Fetch full data
  async fetchFullData() {
    try {
      const response = await fetch(`${this.#options.api}items`);

      if (!response.ok) throw new Error('Error fetching full data.');

      this.#totalData = await response.json();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Fetch paginated data
  async #fetchData() {
    try {
      const perPage = this.#options.pagination.perPage;

      let apiURL = this.#isFiltering
        ? `${this.#options.api}items?age_gte=${this.#filteredQuery}&_page=${
            this.#currentPage
          }&_limit=${perPage}`
        : `${this.#options.api}items?_page=${
            this.#currentPage
          }&_limit=${perPage}`;

      if (this.#sortOrder) {
        apiURL += `&_sort=id&_order=${this.#sortOrder}`;
      }

      const response = await fetch(apiURL);

      if (!response.ok)
        throw new Error('Error fetching data. Please try again!');

      this.#totalItems = +response.headers.get('X-total-count') || 0;

      this.#data = await response.json();

      this.renderData();
      this.#updatePagination();
      this.fetchFullData();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Render Data
  renderData() {
    const tableBody = this.tableElement;
    tableBody.innerHTML = '';

    if (!this.#data.length) return;

    this.#data.forEach((row, i) => {
      const html = `
        <div class="data-row data-row-${i + 1}" data-index="${i + 1}">
          <div class="data-row__checkbox">
            <input type="checkbox" class="data-row__checkbox-input" />
            <div class="data-row__checkbox">
              <span>${row.id}</span>
            </div>
          </div>

          <p class="data-row__cell data-row__cell-1">
            ${row.name}
          </p>
          <p class="data-row__cell data-row__cell-2">${row.location}</p>
          <p class="data-row__cell data-row__cell-3">${row.age}</p>
          <p class="data-row__cell data-row__cell-4">
           ${row.description}
          </p>
        </div>`;
      tableBody.insertAdjacentHTML('beforeend', html);
    });
  }

  // Search Data
  async #searchData() {
    try {
      const keyWord = searchInput.value.toLowerCase();

      if (keyWord === '') {
        this.#fetchData();
        return;
      }

      const response = await fetch(`${this.#options.api}items?q=${keyWord}`);

      if (!response.ok) throw new Error('Error fetching item');

      this.#data = await response.json();

      this.renderData();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Add Data
  async #addCustomer(e) {
    try {
      form.style.display = 'block';

      // Remove event listener
      form.removeEventListener('click', this.formClickHandler);

      this.formClickHandler = async e => {
        e.preventDefault();

        if (e.target.classList.contains('form__button')) {
          form.style.display = 'none';

          const addNewData = {
            id: +id.value.trim(),
            name: uname.value.trim(),
            location: location.value.trim(),
            age: +age.value.trim(),
            description: description.value.trim(),
          };

          const response = await fetch(`${this.#options.api}items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addNewData),
          });

          if (!response.ok) throw new Error('Error Adding data');

          await response.json();
          this.#fetchData();
        }

        if (e.target.classList.contains('form__close-button')) {
          form.style.display = 'none';
        }
      };

      // Add event listener
      form.addEventListener('click', this.formClickHandler);
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Pagination Data
  async #pagination(e) {
    try {
      const target =
        e.target.closest('.btn-right') || e.target.closest('.btn-left');

      if (!target) return;

      const perPage = this.#options.pagination.perPage;
      const totalPages = Math.ceil(this.#totalItems / perPage);

      if (
        target.classList.contains('btn-right') &&
        this.#currentPage < totalPages
      ) {
        this.#currentPage++;
      } else if (
        target.classList.contains('btn-left') &&
        this.#currentPage > 1
      ) {
        this.#currentPage--;
      }

      this.#fetchData();
      this.#updatePagination();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // UpdatePagination
  #updatePagination() {
    const perPage = this.#options.pagination.perPage;
    const start = (this.#currentPage - 1) * perPage + 1;
    let end = this.#currentPage * perPage;

    if (end > this.#totalItems) end = this.#totalItems;

    footer.querySelector(
      '.pagination-left-pages'
    ).textContent = `${start} - ${end} of ${this.#totalItems}`;

    footer.querySelector(
      '.pagination-right__pagination span'
    ).textContent = `${start} - ${end}`;
  }

  // DropDown
  #dropDown(e) {
    const target = e.target.closest('.pagination-right__pages');
    if (target.classList.contains('pagination-right__pages')) {
      perPageList.classList.toggle('active');
    }

    perPageList.addEventListener('click', e => {
      const pageNum = +e.target.closest('button').textContent;

      this.#options.pagination.perPage = pageNum;

      this.#fetchData();
      perPageList.classList.remove('active');
    });
  }

  // Sort Data
  async #sortData(e) {
    try {
      if (!e.target.classList.contains('fa-sort')) return;

      this.#sortOrder = this.#sortOrder === 'desc' ? 'asc' : 'desc';

      this.#fetchData();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Filter Data
  async #filterData(e) {
    try {
      const targetNum = +e.target.value;

      this.#isFiltering = true;
      this.#filteredQuery = targetNum;
      this.#currentPage = 1;

      await this.#fetchData();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Edit Data
  async #editData(target) {
    try {
      form.style.display = 'block';
      form.querySelector('.form__button').textContent = 'Edit';
      uname.focus();

      // Get row data
      const dataRow = target;
      const dataIndex = dataRow.dataset.index;

      // Extract old values
      const oldName = dataRow
        .querySelector('.data-row__cell-1')
        .textContent.trim();
      const oldLocation = dataRow
        .querySelector('.data-row__cell-2')
        .textContent.trim();
      const oldAge = dataRow
        .querySelector('.data-row__cell-3')
        .textContent.trim();
      const oldDescription = dataRow
        .querySelector('.data-row__cell-4')
        .textContent.trim();

      // Add old values to form
      uname.value = oldName;
      location.value = oldLocation;
      age.value = oldAge;
      description.value = oldDescription;

      // Remove previous event listener
      form.removeEventListener('submit', this._submitHandler);

      this._submitHandler = async e => {
        e.preventDefault();
        form.style.display = 'none';
        form.querySelector('.form__button').textContent = 'Add';
        actionBox.style.display = 'none';
        target.querySelector('.data-row__checkbox-input').checked = false;

        // Get updated values
        const updatedData = {
          id: id.value.trim(),
          name: uname.value.trim(),
          location: location.value.trim(),
          age: age.value.trim(),
          description: description.value.trim(),
        };

        const response = await fetch(`${this.#options.api}items/${dataIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Error updating item');
        const data = await response.json();
        this.#fetchData();
        uname.value = location.value = age.value = description.value = '';
      };

      // Add new event listener
      form.addEventListener('submit', this._submitHandler);
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Delete Data
  async #deleteData(target = false) {
    try {
      if (target) {
        const dataRow = target;
        const dataIndex = +dataRow?.dataset.index;

        await fetch(`${this.#options.api}items/${dataIndex}`, {
          method: 'DELETE',
        });
      } else {
        headerCheckbox.checked = false;
        actionBox.style.display = 'none';

        for (const item of this.#totalData) {
          await fetch(`${this.#options.api}items/${item.id}`, {
            method: 'DELETE',
          });
        }
      }

      this.#fetchData();
    } catch (error) {
      this.#showError(error.message);
    }
  }

  // Action
  #action(e) {
    if (e.target.classList.contains('data-row__checkbox-input')) {
      const target = e.target.closest('.data-row');

      const checkInput = target.querySelector('.data-row__checkbox-input');

      if (!checkInput.checked) {
        actionBox.style.display = '';
      } else {
        actionBox.style.display = 'block';

        // Remove previous event listener
        btnEdit.removeEventListener('click', this._editHandler);
        btndelete.removeEventListener('click', this._deleteHandler);

        this._editHandler = () => this.#editData(target);
        this._deleteHandler = () => this.#deleteData(target);

        // Add new event listener
        btnEdit.addEventListener('click', this._editHandler);
        btndelete.addEventListener('click', this._deleteHandler);
      }
    } else {
      if (e.target.classList.contains('data-header__checkbox-input')) {
        const checkInput = headerCheckbox;
        const allCheckbox = document.querySelectorAll(
          '.data-row__checkbox-input'
        );

        if (!checkInput.checked) {
          actionBox.style.display = '';
          allCheckbox.forEach(checkbox => {
            checkbox.checked = false;
          });
        } else {
          actionBox.style.display = 'block';
          allCheckbox.forEach(checkbox => {
            checkbox.checked = true;
          });

          btndelete.addEventListener(
            'click',
            function (e) {
              this.#deleteData();
            }.bind(this)
          );
        }
      }
    }
  }

  // Error message
  #showError(error) {
    const elmnt = document.createElement('p');
    elmnt.classList.add('message');
    elmnt.textContent = error;

    this.tableElement.innerHTML = '';
    this.tableElement.append(elmnt);
  }
}

const options = {
  api: 'http://localhost:3000/',
  pagination: { perPage: 9 },
  columns: [
    { heading: 'ID', accessor: 'id' },
    { heading: 'Name', accessor: 'name' },
    { heading: 'Age', accessor: 'age' },
    { heading: 'Location', accessor: 'location' },
    {
      heading: 'Actions',
      customCell: row => `
          <button onclick="editRow(${row.id})">Edit</button>
          <button onclick="deleteRow(${row.id})">Delete</button>
        `,
    },
  ],
};

const table = new DataTable('.data-table', options);
console.log(table);
