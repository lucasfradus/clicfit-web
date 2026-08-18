// Tipos del flujo de reserva de clase de prueba. Espejan las respuestas de la API
// pública de Clicnet (app.clicpilates.com/api/public/*), filtradas a fitness.

export interface Sede {
  id: number;
  slug: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  localidad?: string | null;
  zona?: string | null;
  email: string | null;
  telefono?: string | null;
  descripcion: string | null;
  caracteristicasWeb?: string[];
  horaApertura?: string | null;
  horaCierre?: string | null;
  imagenUrl: string | null;
  imagenFoco?: { x: number; y: number };
  fotos: string[];
  fotosDetalle?: Array<{ url: string; foco: { x: number; y: number } }>;
  whatsappUrl: string | null;
  googleMapsUrl: string | null;
  precioPrueba: number | null;
  reservaOnline?: boolean;
}

export interface Actividad {
  id: number;
  nombre: string;
  nombreCorto?: string | null;
  descripcion?: string | null;
  color: string;
}

export interface Salon {
  id: number;
  nombre: string;
}

export interface Clase {
  id: number;
  inicio: string;
  actividad: Actividad;
  salon: Salon | null;
  instructor: string | null;
  cuposDisponibles: number;
}

export interface ReservarPayload {
  claseId: number;
  sedeId: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}

export interface ReservaResponse {
  actividad: string;
  /** ISO date-time de inicio de la clase. */
  fecha: string;
  sede: string;
  direccion: string;
  whatsapp: string;
}
