// Tipos del turno de nutrición para no socios. Espejan la API pública del
// consultorio de Clicnet (app.clicpilates.com/api/public/consultorio/*).

export interface PrestacionPublica {
  id: number;
  nombre: string;
  descripcion: string | null;
  duracionMinutos: number;
  /** El precio varía por profesional: este es el más bajo. */
  precioDesde: number;
  senaDesde: number;
}

export interface ServicioPublico {
  servicioId: number;
  nombre: string;
  sede: { id: number; nombre: string; direccion: string };
  horasCancelacion: number;
  diasReservaAnticipada: number;
  prestaciones: PrestacionPublica[];
}

export interface HuecoPublico {
  franjaId: number;
  /** ISO date-time. */
  inicio: string;
  fin: string;
  profesional: string;
  precio: number;
  sena: number;
}

export interface CheckoutPayload {
  prestacionId: number;
  franjaId: number;
  inicio: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  /** URL de vuelta de Mercado Pago; el backend le agrega `token=<token>`. */
  volverA: string;
}

export type CheckoutResponse =
  | { token: string; initPoint: string; monto: number; precio: number; expiraEn: string }
  | { esSocio: true; mensaje: string }
  | { token: string; confirmada: true };

export type EstadoTurno = "PENDIENTE" | "PROCESADA" | "VENCIDA" | "SIN_LUGAR";

export interface TurnoEstado {
  estado: EstadoTurno;
  /** La seña cobrada. */
  monto: number;
  precio: number;
  inicio: string;
  fin: string;
  prestacion: string;
  servicio: string;
  profesional: string;
  sede: { nombre: string; direccion: string };
}
