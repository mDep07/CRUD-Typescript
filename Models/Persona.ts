interface Persona {
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

export { Persona };
