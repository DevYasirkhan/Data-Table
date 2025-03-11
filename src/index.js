'use strict';

////////////////////////////////////////////
// Import
import { DataTable } from './dataTable.js';

////////////////////////////////////////////
// Selector
/*
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
*/

////////////////////////////////////////////
const options = {
  api: 'http://localhost:3000/items',
  pagination: { perPage: 9 },
  columns: [
    { heading: 'ID', accessor: 'id' },
    { heading: 'Name', accessor: 'name' },
    { heading: 'Location', accessor: 'location' },
    { heading: 'Age', accessor: 'age' },
    { heading: 'Description', accessor: 'description' },
    {
      heading: 'Actions',
      customCell: row => `
          <button onclick="editRow(${row.id})">Edit</button>
          <button onclick="deleteRow(${row.id})">Delete</button>
        `,
    },
  ],
};

const table = new DataTable('.table', options);
console.log(table);

// AdEventListener
/*
window.addEventListener('DOMContentLoaded', table.fetchData.bind(this));
filter.addEventListener('change', this.filterData.bind(this));
btnAddCustomer.addEventListener('click', this.addCustomer.bind(this));
searchInput.addEventListener('input', this.searchData.bind(this));
headerCheckbox.addEventListener('change', this.action.bind(this));
btnSort.addEventListener('click', this.sortData.bind(this));
dataTable.addEventListener('click', this.action.bind(this));
footer.addEventListener('click', this.pagination.bind(this));
paginationRightPerPage.addEventListener('click', this.dropDown.bind(this));
*/
