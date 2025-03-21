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
const btnAddCustomer = document.querySelector('.btn-add');
const btnFilter = document.querySelector('.header__wrap-filter');

// Form inputs
const form = document.querySelector('.form');
const id = document.querySelector('.form__group-input-id');
const uName = document.querySelector('.form__group-input-name');
const location = document.querySelector('.form__group-input-location');
const age = document.querySelector('.form__group-input-age');
const description = document.querySelector('.form__group-input-description');

////////////////////////////////////////////
// Define Zod schema
const formSchema = z.object({
  // id: z.coerce.number().positive('ID must be a positive number'),
  uName: z.coerce
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long'),
  location: z.coerce
    .string()
    .trim()
    .min(2, 'Location must be at least 2 characters'),
  age: z.coerce
    .number()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be less than 100'),
  description: z.coerce
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be under 200 characters'),
});

// Display errors in form
function showErrors(errors) {
  document
    .querySelectorAll('.form__error')
    .forEach(el => (el.textContent = ''));

  errors.forEach(err => {
    const fieldName = err.path[0];
    const errorEl = document.querySelector(`.form__error-${fieldName}`);

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
    { heading: 'Status', accessor: 'status' },
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

searchInput.addEventListener('input', () => {
  const inputKeyword = searchInput.value.toLowerCase();

  table.searchData(inputKeyword);
});

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
    form.style.opacity = 1;
    form.style.pointerEvents = 'auto';

    // Get row data
    const targetRow = target.closest('.table-body__row');
    const rowIndex = +targetRow.dataset.id;

    // Add old values to form for update
    // id.value = targetRow.querySelector(
    //   '.table-body__column-1 span'
    // ).textContent;
    uName.value = targetRow.querySelector('.table-body__column-2').textContent;
    location.value = targetRow.querySelector(
      '.table-body__column-3'
    ).textContent;
    age.value = targetRow.querySelector('.table-body__column-4').textContent;
    description.value = targetRow.querySelector(
      '.table-body__column-5'
    ).textContent;

    form.removeEventListener('submit', handleSubmit);
    function handleSubmit(event) {
      event.preventDefault();

      // Get updated values
      const updatedData = {
        // id: +id.value,
        name: uName.value,
        location: location.value,
        age: +age.value,
        description: description.value,
      };

      // Pass object for Validation
      const validationResult = formSchema.safeParse(updatedData);

      if (!validationResult.success) {
        showErrors(validationResult.error.errors);
        console.log(validationResult.error.errors);
        return;
      }

      showErrors([]);

      table.editRow(updatedData, rowIndex);

      form.style.opacity = 0;
      form.style.pointerEvents = 'none';
      form.reset();
    }
    form.addEventListener('submit', handleSubmit);
  }
});

// Add customer
btnAddCustomer.addEventListener('click', e => {
  e.preventDefault();
  form.style.opacity = 1;
  form.style.pointerEvents = 'auto';

  form.removeEventListener('submit', handleSubmit);
  function handleSubmit(event) {
    event.preventDefault();

    const newData = {
      name: uName.value,
      location: location.value,
      age: +age.value,
      description: description.value,
    };

    table.addCustomer(newData);

    form.style.opacity = 0;
    form.style.pointerEvents = 'none';
  }
  form.addEventListener('submit', handleSubmit);
});

// FIltering
btnFilter.addEventListener('change', function () {
  const filterValue = this.value;
  table.filterData(filterValue);
});

////////////////////////////////////////////
/* 
   data for data.json
     {
      "id": 1,
      "name": "Katty perry",
      "location": "USA",
      "age": 38,
      "status": "active",
      "description": "Beautiful singer"
    },
    {
      "id": 2,
      "name": "Avery Turner",
      "location": "Hungary",
      "age": 22,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 3,
      "name": "Samuel Lee",
      "location": "Australia",
      "age": 52,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 4,
      "name": "Stella White",
      "location": "Singapore",
      "age": 31,
      "status": "active",
      "description": "Lorem ipsum"
    },
    {
      "id": 5,
      "name": "Jacob Sanders",
      "location": "Sweden",
      "age": 30,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 6,
      "name": "Stella White",
      "location": "China",
      "age": 21,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 7,
      "name": "Aurora King",
      "location": "New Zealand",
      "age": 28,
      "status": "active",
      "description": "Lorem ipsum"
    },
    {
      "id": 8,
      "name": "Leo Stanton",
      "location": "France",
      "age": 60,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 9,
      "name": "Alexander",
      "location": "Germany",
      "age": 47,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 10,
      "name": "Ava Mitchell",
      "location": "Spain",
      "age": 29,
      "status": "active",
      "description": "Lorem ipsum"
    },
    {
      "id": 11,
      "name": "Bob",
      "location": "England",
      "age": 32,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 12,
      "name": "Steven",
      "location": "London",
      "age": 25,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 13,
      "name": "Michchel",
      "location": "Euorop",
      "age": 54,
      "status": "active",
      "description": "Lorem ipsum"
    },
    {
      "id": 14,
      "name": "Alex rocher",
      "location": "Los Angles",
      "age": 38,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 15,
      "name": "Locus",
      "location": "Chicago",
      "age": 24,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 16,
      "name": "Orion",
      "location": "New York",
      "age": 30,
      "status": "active",
      "description": "Consectetur elit"
    },
    {
      "id": 17,
      "name": "Nova",
      "location": "Los Angeles",
      "age": 27,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 18,
      "name": "Vega",
      "location": "Houston",
      "age": 22,
      "status": "canceled",
      "description": "Lorem ipsum"
    },
    {
      "id": 19,
      "name": "Sirius",
      "location": "Miami",
      "age": 29,
      "status": "active",
      "description": "Lorem ipsum"
    },
    {
      "id": 20,
      "name": "Altair",
      "location": "San Francisco",
      "age": 26,
      "status": "pending",
      "description": "Lorem ipsum"
    },
    {
      "id": 21,
      "name": "Jhon",
      "location": "portugal",
      "age": 42,
      "status": "canceled",
      "description": "Good teacher"
    },
    {
      "id": 22,
      "name": "josh",
      "location": "washington",
      "age": 43,
      "status": "active",
      "description": "A good teacher"
    },
    {
      "id": 23,
      "name": "Tom holiday",
      "location": "London",
      "age": 52,
      "status": "pending",
      "description": "Magician man"
    }
*/
