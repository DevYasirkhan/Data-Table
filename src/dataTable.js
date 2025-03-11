////////////////////////////////////////////
// Class

export class DataTable {
  #options = null;
  #data = [];
  // #totalData = [];
  // #currentPage = 1;
  // #totalItems = 0;
  // #isFiltering = false;
  // #filteredQuery = '';
  // #sortOrder = null;

  constructor(selector, options) {
    this.table = document.querySelector(selector);
    this.#options = options;

    this.fetchData();
  }

  // Fetch Data
  async fetchData() {
    try {
      let response = await fetch(`${this.#options.api}`);

      if (!response.ok)
        throw new Error('Error fetching data. Please try again!');

      const data = await response.json();
      this.#data = data;

      console.log(data.map(row => row));

      this.renderData(data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  // Render Data
  renderData(data) {
    const tableBody = this.table;
    tableBody.innerHTML = '';

    if (!data.length) return;

    const html = `
         <thead class="table-head">
          <tr class="table-head__row">
            <th class="table-head__column table-head__column-1">
              <input type="checkbox" class="table-head__checkbox" />
              <i class="fa-solid fa-sort"></i>
            </th>
            ${this.#options.columns
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
              <span>${rowIndex + 1}</span>
            </td>
            ${this.#options.columns
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
            <td class="table-foot__left-pages">1 - 10 of 97</td>

            <td class="table-foot__right">
              <button class="btn-dropdown">
                Rows per page: <span>10</span>
                <i class="fa-solid fa-chevron-down"></i>
              </button>

              <!-- Action -->
              <div class="table-foot__right-list">
                <div class="table-foot__right-inner-list">
                  <button>9</button>
                  <button>15</button>
                  <button>20</button>
                  <button>25</button>
                </div>
              </div>

              <div class="table-foot__right-pages">
                <button class="btn-left" data-index="1">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span>1 - 9</span>
                <button class="btn-right" data-index="1">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </td>
          </tr>
        </tfoot>`;

    tableBody.insertAdjacentHTML('beforeend', html);
  }

  /*
  // Search Data
  async searchData() {
    try {
      const keyWord = searchInput.value.toLowerCase();

      if (keyWord === '') {
        this.fetchData();
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
 */

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

          const response = await fetch(`${this.#options.api}items`, {
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

  /*
   // Pagination Data
  async pagination(e) {
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

      this.fetchData();
      this.#updatePagination();
    } catch (error) {
      this.showError(error.message);
    }
  }
  */

  /*
  // UpdatePagination
  updatePagination() {
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
  */

  /*
  // DropDown
  dropDown(e) {
    const target = e.target.closest('.pagination-right__pages');
    if (target.classList.contains('pagination-right__pages')) {
      perPageList.classList.toggle('active');
    }

    perPageList.addEventListener('click', e => {
      const pageNum = +e.target.closest('button').textContent;

      this.#options.pagination.perPage = pageNum;

      this.fetchData();
      perPageList.classList.remove('active');
    });
  }
  */

  /*
   // Sort Data
  async sortData(e) {
    try {
      if (!e.target.classList.contains('fa-sort')) return;

      this.#sortOrder = this.#sortOrder === 'desc' ? 'asc' : 'desc';

      this.fetchData();
    } catch (error) {
      this.showError(error.message);
    }
  }
 */

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

  /*
  // Edit Data
  async editRow(target) {
    try {
      form.style.display = 'block';

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
      // this.fetchData();
    } catch (error) {
      this.showError(error.message);
    }
  }
*/

  /*
  // // Delete Row
  async deleteRow(target = false) {
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

        for (const item of this.#data) {
          await fetch(`${this.#options.api}items/${item.id}`, {
            method: 'DELETE',
          });
        }
      }

      this.fetchData();
    } catch (error) {
      this.showError(error.message);
    }
  }
 */

  // Error message
  showError(error) {
    const elmnt = document.createElement('p');
    elmnt.classList.add('message');
    elmnt.textContent = error;

    this.table.innerHTML = '';
    this.table.append(elmnt);
  }
}
