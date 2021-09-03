interface IPersona {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  direccion: {
    calle: string;
    numero?: number;
  };
  telefono?: string;
}

class Persona implements IPersona {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  direccion: {
    calle: string;
    numero?: number;
  };
  telefono?: string;

  constructor(persona: IPersona) {
    this.id = persona.id;
    this.nombre = persona.nombre;
    this.apellido = persona.apellido;
    this.edad = persona.edad;
    this.direccion = persona.direccion;
    this.telefono = persona.telefono;

    this.save();
  }

  save() {
    const persons: IPersona[] = getAllPersons();
    let newPersonID: number = 1;
    if (persons.length) {
      newPersonID =
        persons.sort((a: IPersona, b: IPersona) => b.id - a.id)[0].id + 1;
    }

    this.id = this.id ? this.id : newPersonID;
    setPerson(this);
    return this;
  }
}

function getAllPersons() {
  const personas = localStorage.getItem('persons');

  return JSON.parse(personas || '[]');
}

function setPerson(person: IPersona) {
  const persons: IPersona[] = getAllPersons();

  const editPersonIndex = persons.findIndex(p => p.id === person.id);
  if (editPersonIndex !== -1) {
    persons.splice(editPersonIndex, 1, person);
  } else {
    persons.push(person);
  }

  localStorage.setItem('persons', JSON.stringify(persons));
}

export { IPersona, Persona, getAllPersons };
