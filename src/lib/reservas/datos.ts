// Datos personales que se piden para reservar sin cuenta (clase de prueba y
// turno de nutrición) y su validación del lado del cliente.

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}

export type FormErrors = Partial<Record<keyof DatosPersonales, string>>;

export const datosVacios: DatosPersonales = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  dni: "",
};

export function validate(form: DatosPersonales): FormErrors {
  const errors: FormErrors = {};
  if (!form.nombre.trim()) errors.nombre = "Ingresá tu nombre";
  if (!form.apellido.trim()) errors.apellido = "Ingresá tu apellido";
  if (!form.email.trim()) errors.email = "Ingresá tu email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Email inválido";
  if (!form.telefono.trim()) errors.telefono = "Ingresá tu teléfono";
  else if (form.telefono.replace(/\D/g, "").length < 8)
    errors.telefono = "Teléfono demasiado corto";
  const dniDigits = form.dni.replace(/\D/g, "");
  if (!form.dni.trim()) errors.dni = "Ingresá tu DNI";
  else if (dniDigits.length < 7 || dniDigits.length > 8)
    errors.dni = "DNI inválido";
  return errors;
}

/** Lo que se manda al backend: sin espacios de más y el DNI sólo con dígitos. */
export function limpiar(form: DatosPersonales): DatosPersonales {
  return {
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    email: form.email.trim(),
    telefono: form.telefono.trim(),
    dni: form.dni.replace(/\D/g, ""),
  };
}
