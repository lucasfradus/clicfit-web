/**
 * Backend de prueba de concepto: un JSON en disco que se autoincrementa.
 *
 * Alcanza para probar el QR de punta a punta sin montar nada. Lo que NO es:
 * un contador de produccion. En Vercel el filesystem del deploy es de solo
 * lectura y lo unico escribible es `/tmp`, que vive por instancia y se borra
 * cuando la recicla — asi que los numeros aguantan una tanda de pruebas
 * seguidas y despues vuelven a cero. En local el archivo persiste de verdad.
 *
 * Para produccion está `store-upstash.ts`: se activa solo con configurar las
 * variables de entorno, sin tocar una línea de código.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { MAX_RECIENTES, type Escaneo, type Estadisticas } from "./tipos";

/** Un slug dentro del JSON. */
type Entrada = {
  total: number;
  humanos: number;
  /** Hashes de visitante, no IPs. */
  visitantes: string[];
  recientes: Escaneo[];
};

type Datos = Record<string, Entrada>;

export function rutaArchivo(): string {
  // Sin `process.cwd()` a propósito: alcanza con que aparezca acá para que
  // Turbopack trace el proyecto entero adentro de la función serverless y el
  // build tire un warning. La ruta por defecto es el temp del sistema, que es
  // además lo único escribible en Vercel.
  return process.env.QR_DATA_FILE ?? join(tmpdir(), "qr-escaneos.json");
}

/**
 * Las escrituras van de a una.
 *
 * Guardar un escaneo es leer el archivo, modificarlo y volver a escribirlo. Dos
 * escaneos simultáneos leerían el mismo contenido y el segundo pisaría al
 * primero. Esta cola los serializa dentro del proceso; entre instancias no hay
 * nada que hacer, y es una de las razones por las que esto no va a producción.
 */
let cola: Promise<unknown> = Promise.resolve();

function enCola<T>(tarea: () => Promise<T>): Promise<T> {
  const siguiente = cola.then(tarea, tarea);
  cola = siguiente.catch(() => undefined);
  return siguiente;
}

async function leerDatos(): Promise<Datos> {
  try {
    return JSON.parse(await readFile(rutaArchivo(), "utf8")) as Datos;
  } catch {
    // Todavía no existe, o quedó ilegible. Arrancar de cero es lo correcto acá:
    // es un contador de pruebas, no queremos que un JSON roto tire el request.
    return {};
  }
}

async function escribirDatos(datos: Datos): Promise<void> {
  const ruta = rutaArchivo();
  await mkdir(dirname(ruta), { recursive: true });
  // Escritura atómica: si el proceso muere a mitad de camino, el archivo viejo
  // queda intacto en vez de convertirse en un JSON truncado.
  const temporal = `${ruta}.${process.pid}.tmp`;
  await writeFile(temporal, JSON.stringify(datos, null, 2), "utf8");
  await rename(temporal, ruta);
}

function entradaVacia(): Entrada {
  return { total: 0, humanos: 0, visitantes: [], recientes: [] };
}

export async function registrarEscaneo(slug: string, escaneo: Escaneo): Promise<void> {
  await enCola(async () => {
    const datos = await leerDatos();
    const entrada = datos[slug] ?? entradaVacia();

    entrada.total += 1;
    // Los bots suman al total (para poder verlos) pero no al número real.
    if (!escaneo.bot) {
      entrada.humanos += 1;
      if (!entrada.visitantes.includes(escaneo.visitante)) {
        entrada.visitantes.push(escaneo.visitante);
      }
    }
    entrada.recientes.unshift(escaneo);
    entrada.recientes.length = Math.min(entrada.recientes.length, MAX_RECIENTES);

    datos[slug] = entrada;
    await escribirDatos(datos);
  });
}

export async function leerEstadisticas(slug: string): Promise<Estadisticas> {
  const entrada = (await leerDatos())[slug] ?? entradaVacia();
  return {
    total: entrada.total,
    humanos: entrada.humanos,
    unicos: entrada.visitantes.length,
    recientes: entrada.recientes,
    backend: "archivo",
    origen: rutaArchivo(),
  };
}
