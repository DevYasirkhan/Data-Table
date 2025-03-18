'use strict';

////////////////////////////////////////////
// Import
import { DataTable } from './dataTable.js';
import { z } from 'zod';

////////////////////////////////////////////
// Selector
const tableBox = document.querySelector('.table');
const popup = document.querySelector('.popup-clear');
const searchInput = document.querySelector('.input__search');

// Form inputs
const form = document.querySelector('.form');
const id = document.querySelector('.form__group-input-id');
const uName = document.querySelector('.form__group-input-name');
const location = document.querySelector('.form__group-input-location');
const age = document.querySelector('.form__group-input-age');
const description = document.querySelector('.form__group-input-description');
/*
const filter = document.querySelector('.header__wrap-filter');
const btnAddCustomer = document.querySelector('.btn-add');
const btnSort = document.querySelector('.fa-sort');
*/

////////////////////////////////////////////
// Define Zod schema
const formSchema = z.object({
  id: z.coerce.number().positive('ID must be a positive number'),
  uName: z.string().min(3, 'Name must be at least 3 characters long'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  age: z.coerce
    .number()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be less than 100'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be under 200 characters'),
});

// Display errors below inputs
function showErrors(errors) {
  document
    .querySelectorAll('.form__error')
    .forEach(el => (el.textContent = ''));

  console.log(errors);

  errors.forEach(err => {
    const fieldName = err.path[0];
    const errorEl = document.querySelector(`.form__error-${fieldName}`);

    console.log(errorEl);

    if (errorEl) {
      errorEl.textContent = err.message;
    }
  });
}

////////////////////////////////////////////
const options = {
  api: 'http://localhost:3000/items',
  pagination: { perPage: 10 },
  columns: [
    { heading: 'ID', accessor: 'id' },
    { heading: 'Name', accessor: 'name' },
    { heading: 'Location', accessor: 'location' },
    { heading: 'Age', accessor: 'age' },
    { heading: 'Description', accessor: 'description' },
    {
      heading: 'Actions',
      customCell: row => `
          <button class="btn-edit" data-id="${row.id}" class="btn-edit">Edit</button>
          <button class="btn-delete" data-id="${row.id}">Delete</button>
        `,
    },
  ],
};

const table = new DataTable('.table', options);

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
        table.clearAll();
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

  // Form Validation
  if (target.classList.contains('btn-edit')) {
    // Show form
    form.style.opacity = 1;
    form.style.pointerEvents = 'auto';

    // Get row data
    const targetRow = target.closest('.table-body__row');

    // Extract old values
    const oldId = targetRow.querySelector(
      '.table-body__column-1 span'
    ).textContent;
    const oldName = targetRow.querySelector(
      '.table-body__column-2'
    ).textContent;
    const oldLocation = targetRow.querySelector(
      '.table-body__column-3'
    ).textContent;
    const oldAge = targetRow.querySelector('.table-body__column-4').textContent;
    const oldDescription = targetRow.querySelector(
      '.table-body__column-5'
    ).textContent;

    // Add old values to form for update
    id.value = oldId;
    uName.value = oldName;
    location.value = oldLocation;
    age.value = oldAge;
    description.value = oldDescription;
  }
});

// form.removeEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();

  // Get updated values
  const updatedData = {
    id: +id.value.trim(),
    name: uName?.value.trim(),
    location: location.value.trim(),
    age: +age.value.trim(),
    description: description.value.trim(),
  };
  console.log(updatedData);

  // Validation
  const validationResult = formSchema.safeParse(updatedData);

  if (!validationResult.success) {
    showErrors(validationResult.error.errors);
    console.error(validationResult.error.errors[0]);
    return;
  }

  showErrors([]);

  table.editRow(updatedData, rowIndex);

  form.style.opacity = 0;
  form.style.pointerEvents = 'none';
  form.reset();
}
form.addEventListener('submit', handleSubmit);

searchInput.addEventListener('input', function (e) {
  const inputKeyword = searchInput.value.toLowerCase();
  console.log(inputKeyword);

  table.searchData(inputKeyword);
});

////////////////////////////////////////////
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
    },
    {
      "id": 16,
      "name": "Orion",
      "location": "New York",
      "age": 30,
      "description": "Consectetur adipiscing elit"
    },
    {
      "id": 17,
      "name": "Nova",
      "location": "Los Angeles",
      "age": 27,
      "description": "Sed do eiusmod tempor incididunt"
    },
    {
      "id": 18,
      "name": "Vega",
      "location": "Houston",
      "age": 22,
      "description": "Ut labore et dolore magna aliqua"
    },
    {
      "id": 19,
      "name": "Sirius",
      "location": "Miami",
      "age": 29,
      "description": "Ut enim ad minim veniam"
    },
    {
      "id": 20,
      "name": "Altair",
      "location": "San Francisco",
      "age": 26,
      "description": "Duis aute irure dolor in reprehenderit"
    }
*/
