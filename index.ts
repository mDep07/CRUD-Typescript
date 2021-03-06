// Import stylesheets
import './style.css';
import 'boxicons';
import { IPersona, Persona, getAllPersons } from './Models/Persona';

const personas: Persona[] = getAllPersons();
// const personas: Array<Persona> = [
//   {
//     id: 1,
//     nombre: 'Miguel',
//     apellido: 'Depiante',
//     edad: 26,
//     direccion: {
//       calle: '25 de Mayo'
//     }
//   },
//   {
//     id: 2,
//     nombre: 'Melina',
//     apellido: 'Paez',
//     edad: 27,
//     direccion: {
//       calle: 'Bv. 25 de Mayo'
//     }
//   }
// ];

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');

const table: HTMLTableElement = document.createElement('table');
table.innerHTML = `
  <thead>
    <tr>
      <th width="50%">Nombre Completo</th>
      <th width="15%">Edad</th>
      <th width="30%">Dirección</th>
      <th width="5%"></th>
    </tr>
  </thead>
  <tbody>
    ${
      personas.map(persona => {
        return `
          <tr data-id="${persona.id}">
            <td>${persona.nombre} ${persona.apellido}</td>
            <td>${persona.edad}</td>
            <td>${persona.direccion.calle} ${persona.direccion.numero ||
        ''}</td>
            <td>
              <button class="btn-action edit">
                <box-icon name='pencil' type='solid' border="square" ></box-icon>
              </button>
              <button class="btn-action delete">
                <box-icon type='solid' name='trash-alt' border="square"></box-icon>
              </button>
            </td>
          </tr>
        `;
      }).join('')
    }
  </tbody>
`;

table.querySelector('tbody').addEventListener('click', manageActions);

function manageActions(e: Event) {
  const element = <HTMLElement>e.target;
  const isActionButton = element.tagName === 'BOX-ICON';

  const searchRow = (e: HTMLElement) => {
    if(e.tagName === 'TR'){
      return e
    }
    return searchRow(e.parentElement);
  }

  if(isActionButton) {
    const isDeleteButton = element.parentElement.classList.contains('delete');
    const isEditButton = element.parentElement.classList.contains('edit');
    const rowElement = searchRow(element.parentElement);
    const id = rowElement.dataset?.id;

    if(isDeleteButton && id) {
      let deletePerson = confirm('Esta seguro de eliminar a esta Persona');
        if(deletePerson) {
          DeletePerson(parseInt(id));
        }
        return;
    } 

    if(isEditButton && id) {
      EditPerson(parseInt(id));
      return;
    }

  }
}

const form: HTMLFormElement = document.createElement('form');
form.innerHTML = `
  <input type="hidden" name="id" value="0" />  
  <div class="nombre">
    <label for="nombre">Nombre</label>
    <input type="text" name="nombre" required autocomplete="off"/> 
  </div>
  <div class="apellido">
    <label for="apellido">Apellido</label>
    <input type="text" name="apellido" required /> 
  </div>
  <div class="edad">
    <label for="edad">Edad</label>
    <input type="number" name="edad" required /> 
  </div>
  <div class="calle">
    <label for="calle">Calle</label>
    <input type="text" name="calle" required /> 
  </div>
  <div class="numero">
    <label for="numero">Número</label>
    <input type="number" name="numero" /> 
  </div>
  <div class="botones">
    <button type="reset" class="btn cancel hidden">Cancelar</button>
    <button type="submit" class="btn submit">Guardar</button>
  </div>
`;

appDiv.appendChild(form);
appDiv.appendChild(table);

const addNewPerson = (persona: Persona) => {
  
  const newRow: HTMLTableRowElement = document.createElement('tr');
  newRow.setAttribute('data-id', persona.id.toString());
  const tableBody: HTMLTableSectionElement = table.querySelector('tbody');
  newRow.innerHTML = `
    <td>${persona.nombre} ${persona.apellido}</td>
    <td>${persona.edad}</td>
    <td>${persona.direccion.calle} ${persona.direccion.numero || ''}</td>
    <td>
      <button class="btn-action edit">
        <box-icon name='pencil' type='solid' border="square" ></box-icon>
      </button>
      <button class="btn-action delete">
        <box-icon type='solid' name='trash-alt' border="square"></box-icon>
      </button>
    </td>
  `;

  //addEventsActions(Array.from(newRow.querySelectorAll('button.btn-action')));
  tableBody.appendChild(newRow);
  // personas.push(persona);
};

const DeletePerson = (id: number) => {
  const tableBody: HTMLTableSectionElement = table.querySelector('tbody');
  const deleteRow: HTMLTableRowElement = tableBody.querySelector(
    `tr[data-id="${id}"]`
  );
  tableBody.removeChild(deleteRow);
};

const EditPerson = (id: number) => {
  const personId = form.querySelector<HTMLInputElement>('input[name="id"]');
  const nombre = form.querySelector<HTMLInputElement>('input[name="nombre"]');
  const apellido = form.querySelector<HTMLInputElement>(
    'input[name="apellido"]'
  );
  const edad = form.querySelector<HTMLInputElement>('input[name="edad"]');
  const calle = form.querySelector<HTMLInputElement>('input[name="calle"]');
  const numero = form.querySelector<HTMLInputElement>('input[name="numero"]');

  const persona: Persona = personas.find(p => p.id === id);
  
  if(persona) {
    personId.value = persona.id.toString();
    nombre.value = persona.nombre;
    apellido.value = persona.apellido;
    edad.value = persona.edad.toString();
    calle.value = persona.direccion.calle;
    numero.value = persona.direccion.numero?.toString();

    const editRow: HTMLTableRowElement = table.querySelector(`tbody tr[data-id="${id}"]`);
    editRow.classList.add('editing');

    Array.from(table.querySelectorAll('button.btn-action')).forEach(btn => {
      btn.setAttribute('disabled', 'disabled');
    });
    
    form.querySelector('button.btn.cancel').classList.remove('hidden');
  }

};

form.addEventListener('submit', e => {
  e.preventDefault();

  const personId = form.querySelector<HTMLInputElement>('input[name="id"]');
  const nombre = form.querySelector<HTMLInputElement>('input[name="nombre"]');
  const apellido = form.querySelector<HTMLInputElement>(
    'input[name="apellido"]'
  );
  const edad = form.querySelector<HTMLInputElement>('input[name="edad"]');
  const calle = form.querySelector<HTMLInputElement>('input[name="calle"]');
  const numero = form.querySelector<HTMLInputElement>('input[name="numero"]');


  const persona: IPersona = {
    id: parseInt(personId.value),
    nombre: nombre.value,
    apellido: apellido.value,
    edad: parseInt(edad.value),
    direccion: {
      calle: calle.value,
      numero: parseFloat(numero.value)
    }
  };

  const newPerson = new Persona(persona);

  if(newPerson.id === 0) {
    //persona.id = personas.sort((a, b) => b.id - a.id)[0].id + 1;
    addNewPerson(newPerson);

  } else {
    // persona.id = parseInt(personId.value);

    const editRow: HTMLTableRowElement = table.querySelector(`tbody tr[data-id="${newPerson.id}"]`);
    const newRow: HTMLTableRowElement = document.createElement('tr');
    newRow.setAttribute('data-id', newPerson.id.toString());
    const tableBody: HTMLTableSectionElement = table.querySelector('tbody');
    newRow.innerHTML = `
      <td>${newPerson.nombre} ${newPerson.apellido}</td>
      <td>${newPerson.edad}</td>
      <td>${newPerson.direccion.calle} ${newPerson.direccion.numero || ''}</td>
      <td>
        <button class="btn-action edit">
          <box-icon name='pencil' type='solid' border="square" ></box-icon>
        </button>
        <button class="btn-action delete">
          <box-icon type='solid' name='trash-alt' border="square"></box-icon>
        </button>
      </td>
    `;

    //addEventsActions(Array.from(newRow.querySelectorAll('button.btn-action')));
    tableBody.insertBefore(newRow, editRow.nextElementSibling);
    tableBody.removeChild(editRow);
  }

  form.reset();
});

form.addEventListener('reset', (e) => {
  const personId = form.querySelector<HTMLInputElement>('input[name="id"]');
  personId.value = '0';
  Array.from(table.querySelectorAll('button.btn-action:disabled')).forEach(btn => {
    btn.removeAttribute('disabled');
  });

  form.querySelector('button.btn.cancel').classList.add('hidden');
  table.querySelector('tbody tr.editing')?.classList.remove('editing');
})


const addEventsActions = (lista: Array<HTMLButtonElement>) => {
  lista.forEach(btn =>  {
    btn.addEventListener('click', () => {
      const id = btn.parentElement.parentElement.dataset?.id;
      if(id) {
        if(btn.classList.contains('delete')) {
          let deletePerson = confirm('Esta seguro de eliminar a esta Persona');
          if(deletePerson) {
            DeletePerson(parseInt(id));
          }
          return;
        }

        if(btn.classList.contains('edit')) {
          EditPerson(parseInt(id));
          return;
        }
      }
    });
  })
}


//addEventsActions(Array.from(document.querySelectorAll('button.btn-action')));
