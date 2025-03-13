'use strict';

////////////////////////////////////////////
// Import
import { DataTable } from './dataTable.js';

////////////////////////////////////////////
// Selector
const tableBox = document.querySelector('.table');
const popup = document.querySelector('.popup-clear');
/*
const filter = document.querySelector('.header__wrap-filter');
const searchInput = document.querySelector('.input__search');
const btnAddCustomer = document.querySelector('.btn-add');
const btnSort = document.querySelector('.fa-sort');

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
          <button onclick="editRow(${row.id})" class="btn-edit">Edit</button>
          <button class="btn-delete" data-id="${row.id}">Delete</button>
        `,
    },
  ],
};

const table = new DataTable('.table', options);
console.log(table);

////////////////////////////////////////////
// AdEventListener

let popupHandler;
tableBox.addEventListener('click', function (e) {
  const target = e.target;

  if (target.classList.contains('table-head__checkbox')) {
    popup.style.opacity = 1;
    popup.style.pointerEvents = 'auto';

    popup.removeEventListener('click', popupHandler);

    popupHandler = e => {
      if (e.target.classList.contains('btn-clear')) {
        table.deleteRow();
      }
      popup.style.opacity = 0;
      popup.style.pointerEvents = 'none';
      target.checked = false;
    };

    popup.addEventListener('click', popupHandler);
  }

  if (target.classList.contains('btn-delete')) {
    const id = +target.dataset.id;
    table.deleteRow(id);
  }
});

/* 
data for data.json
{
      "id": 1,
      "name": "Jack Thompson",
      "location": "China",
      "age": 36,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 2,
      "name": "Avery Turner",
      "location": "Hungary",
      "age": 22,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 3,
      "name": "Samuel Lee",
      "location": "Australia",
      "age": 52,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 4,
      "name": "Stella White",
      "location": "Singapore",
      "age": 31,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 5,
      "name": "Jacob Sanders",
      "location": "Sweden",
      "age": 30,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 6,
      "name": "Stella White",
      "location": "China",
      "age": 21,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 7,
      "name": "Aurora King",
      "location": "New Zealand",
      "age": 28,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 8,
      "name": "Leo Stanton",
      "location": "France",
      "age": 60,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 9,
      "name": "Alexander",
      "location": "Germany",
      "age": 47,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 10,
      "name": "Ava Mitchell",
      "location": "Spain",
      "age": 29,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 11,
      "name": "Bob",
      "location": "England",
      "age": 32,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 12,
      "name": "Steven",
      "location": "London",
      "age": 25,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 13,
      "name": "Michchel",
      "location": "Euorop",
      "age": 54,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 14,
      "name": "Alex rocher",
      "location": "Los Angles",
      "age": 38,
      "description": "Lorem ipsum dolor sit amet"
    },
    {
      "id": 15,
      "name": "Locus",
      "location": "Chicago",
      "age": 24,
      "description": "Lorem ipsum dolor sit amet"
    }
*/
