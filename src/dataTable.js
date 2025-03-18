////////////////////////////////////////////
// Class
export class DataTable {
  options = null;
  data = [];
  #currentPage = 1;
  #totalItems = 0;
  #PerPageStart = 0;
  #perPageEnd = 0;
  #isFiltering = false;
  #filteredQuery = '';
  #sortOrder = null;
  params = new URLSearchParams();

  constructor(selector, options) {
    this.table = document.querySelector(selector);
    this.options = options;

    this.params.append('_page', 1);
    this.params.append('_limit', this.options?.pagination?.perPage || 10);

    this.fetchData();
    this.table.addEventListener('click', this.handleTableEvent.bind(this));
    this.table.addEventListener('click', this.sortData.bind(this));
  }

  // Fetch Data
  async fetchData() {
    try {
      let response = await fetch(`${this.options.api}?${this.params}`);

      if (!response.ok) throw new Error('Data not fetched. Please try again!');

      const data = await response.json();
      this.data = data;

      this.#totalItems = +response.headers.get('X-Total-Count') || 0;

      this.updatePagination();
      this.renderData(data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  // Render Data
  renderData(data) {
    const tableBody = this.table;
    tableBody.innerHTML = '';

    if (!data) return;

    const html = `
         <thead class="table-head">
          <tr class="table-head__row">
            <th class="table-head__column table-head__column-1">
              <input type="checkbox" class="table-head__checkbox" />
              <i class="fa-solid fa-sort"></i>
            </th>
            ${this.options.columns
              .slice(1, -1)
              .map(
                (col, i) => `    
              <th class="table-head__column table-head__column-${i + 2}">
              <span>${col.heading}</span>
              <i class="fa-solid fa-sort"></i>
            </th>`
              )
              .join('')}
          </tr>
        </thead>

        <tbody class="table-body">
         ${data
           .map(
             (row, rowIndex) => `
          <tr class="table-body__row" data-id="${row.id}">
            <td class="table-body__column table-body__column-1">
              <input type="checkbox" class="table-body__checkbox" />
              <span>${row.id}</span>
            </td>
            ${this.options.columns
              .slice(1)
              .map(
                (col, colIndex) =>
                  `<td class="table-body__column table-body__column-${
                    colIndex + 2
                  }">${
                    col.customCell
                      ? col.customCell(row)
                      : row[col.accessor] || ''
                  }</td>`
              )
              .join('')}
          </tr>`
           )
           .join('')}
        </tbody>

        <tfoot class="table-foot">
          <tr class="table-foot__row">
            <td class="table-foot__left-pages">${this.#PerPageStart} - ${
      this.#perPageEnd
    } of ${this.#totalItems}</td>

            <td class="table-foot__right">
              <div class="table-foot__right-pages">
                <button class="btn-left" data-index="1">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span>${this.#PerPageStart} - ${this.#perPageEnd}</span>
                <button class="btn-right" data-index="1">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
        `;
    tableBody.insertAdjacentHTML('beforeend', html);
  }

  // Search Data
  async searchData(key) {
    try {
      const keyWord = key;

      this.updateParams(params => ({ ...params, q: keyWord }));
    } catch (error) {
      this.showError(error.message);
    }
  }

  /*
  // Add Data
  async addCustomer(e) {
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

          const response = await fetch(`${this.options.api}items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addNewData),
          });

          if (!response.ok) throw new Error('Error Adding data');

          await response.json();
          this.fetchData();
        }

        if (e.target.classList.contains('form__close-button')) {
          form.style.display = 'none';
        }
          };

      // Add event listener
      form.addEventListener('click', this.formClickHandler);
    } catch (error) {
      this.showError(error.message);
    }
  }
 */

  // Update params
  updateParams(cb) {
    // convert url params to object
    const paramsToObj = Object.fromEntries(this.params);

    // pass params as object to callback function to be modified
    const updatedParam = cb(paramsToObj);
    console.log(updatedParam);

    // after params being updated convert back to params data type and set it on the class
    this.params = new URLSearchParams(updatedParam);

    // refetch data to apply new filter based on params
    this.fetchData();
  }

  // Pagination Data
  async handleTableEvent(e) {
    try {
      const target = e.target;
      const nextPageButton = target.closest('.btn-right');
      const prevPageButton = target.closest('.btn-left');

      const perPage = this.options.pagination.perPage;
      const totalPages = Math.ceil(this.#totalItems / perPage);

      if (!target) return;

      if (nextPageButton && this.#currentPage < totalPages) {
        this.updateParams(params => ({ ...params, _page: +params._page + 1 }));
        this.#currentPage++;
      }
      if (prevPageButton && this.#currentPage > 1) {
        this.updateParams(params => ({ ...params, _page: +params._page - 1 }));
        this.#currentPage--;
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  // UpdatePagination
  updatePagination() {
    const perPage = this.options.pagination.perPage;
    const start = (this.#currentPage - 1) * perPage + 1;
    let end = this.#currentPage * perPage;

    this.#PerPageStart = start;
    this.#perPageEnd = end;
  }

  // Sort Data
  async sortData(e) {
    try {
      const target = e.target;
      console.log(target.classList.contains('table-head__column-3'));

      // if (!target.classList.contains('fa-sort')) return;
      if (!target.classList.contains('fa-sort')) return;
      console.log(target);

      this.#sortOrder = this.#sortOrder === 'desc' ? 'asc' : 'desc';

      this.updateParams(params => ({
        ...params,
        _sort: 'id',
        _order: this.#sortOrder,
      }));

      console.log(this.params.toString());
    } catch (error) {
      this.showError(error.message);
    }
  }

  /*
  // Filter Data
  async #filterData(e) {
    try {
      const targetNum = +e.target.value;

      this.#isFiltering = true;
      this.#filteredQuery = targetNum;
      this.#currentPage = 1;

      await this.fetchData();
    } catch (error) {
      this.#showError(error.message);
    }
  }
 */

  // Edit Data
  async editRow(dataObject, rowIndex) {
    try {
      const response = await fetch(`${this.options.api}/${rowIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObject),
      });

      if (!response.ok) throw new Error('Error updating item');

      const data = await response.json();
      console.log(data);

      this.fetchData();
    } catch (error) {
      this.showError(error.message);
    }
  }

  // Delete Row
  async deleteRow(id, skipFetch = false) {
    try {
      const response = await fetch(`${this.options.api}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok)
        throw new Error('failed to delete items. Please try again');

      if (!skipFetch) {
        await this.fetchPaginateData();
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  // Clear All Rows
  async clearAll() {
    try {
      const itemsId = [...Array(this.#totalItems)].map((_, i) => i + 1);
      console.log(itemsId);

      const result = await Promise.all(
        itemsId.map(id => this.deleteRow(id, true))
      );

      this.getParams();
    } catch (error) {
      console.log(error.message);
    }
  }

  // Error message
  showError(error) {
    const elmnt = document.createElement('p');
    elmnt.classList.add('message');
    elmnt.textContent = error;

    this.table.innerHTML = '';
    this.table.append(elmnt);
  }
}
