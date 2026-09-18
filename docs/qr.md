# Links de QR con contador

`clicfit.ar/q/<slug>` redirige al destino real y cuenta el escaneo. Quien escanea
no ve nada: el servidor contesta un `302` y el teléfono se va derecho al destino
en el mismo viaje.

## Cómo está armado

| Archivo | Qué hace |
| --- | --- |
| `src/lib/qr/links.ts` | Los links. Fuente de verdad, en código. |
| `src/app/q/[slug]/route.ts` | El `302` + el disparo del conteo. |
| `src/lib/qr/request.ts` | Convierte el request en un `Escaneo` (geo, dispositivo, bot). |
| `src/lib/qr/store.ts` | Elige el backend y expone la única API que usa el resto. |
| `src/lib/qr/store-archivo.ts` | Backend de prueba: un JSON en disco. |
| `src/lib/qr/store-upstash.ts` | Backend de producción: Upstash Redis. |
| `src/app/qr/[slug]/page.tsx` | Panel de métricas. |

Dos decisiones que conviene no tocar sin entender por qué:

- **`302`, nunca `301`.** Un `301` queda cacheado en el browser y el segundo
  escaneo del mismo teléfono ya no pasa por el servidor: el contador se clava.
- **El conteo va en `after()`.** Corre después de que la respuesta salió, así que
  escribir en Redis no le agrega latencia a quien escanea. Como contrapartida no
  puede tirar excepciones: si Upstash falla se loguea y se pierde ese escaneo.

## Agregar un link

Sumar un objeto a `qrLinks` en `src/lib/qr/links.ts` y pushear a `main`. Vercel
redeploya solo. El slug va adentro del QR: cuanto más corto, menos denso el
código y más fácil de leer impreso chico.

## Dónde se guardan los escaneos

Hay dos backends detrás de la misma interfaz. **Los elige una variable de
entorno, no un cambio de código.**

### Hoy: JSON en disco (prueba de concepto)

Sin las variables de Upstash, el contador escribe un JSON que se autoincrementa.
Por defecto va al temp del sistema: `/tmp/qr-escaneos.json` en Linux y en Vercel,
el equivalente en Mac. `QR_DATA_FILE` cambia la ruta — en local conviene ponerlo
en `.env.local` apuntando a `.data/qr-escaneos.json` (ya está en `.gitignore`)
para tenerlo a mano y que sobreviva a un reinicio:

```bash
echo 'QR_DATA_FILE=.data/qr-escaneos.json' >> .env.local
```

El archivo se puede abrir, mirar y editar a mano. Formato:

```json
{
  "gorroswine": {
    "total": 12,
    "humanos": 9,
    "visitantes": ["a1b2c3d4e5f6"],
    "recientes": [{ "ts": 1758234000000, "pais": "AR", "bot": false }]
  }
}
```

**Esto no sirve para producción**, y no por falta de ganas:

- En Vercel el filesystem del deploy es de solo lectura y `/tmp` vive por
  instancia. Vercel las recicla cuando quiere, así que los números vuelven a cero
  solos.
- Dos instancias en paralelo tienen cada una su archivo. El escaneo puede caer en
  una y el panel leer la otra.
- Guardar un escaneo es leer el archivo, modificarlo y reescribirlo. Dentro del
  proceso hay una cola que serializa las escrituras, pero entre instancias no hay
  nada que las coordine.
- Armar la ruta en runtime hace que el tracer de Next meta el proyecto entero en
  la función serverless. Por eso `next.config.ts` tiene un
  `outputFileTracingExcludes` para `/q/[slug]` y `/qr/[slug]`: sin él, la ruta
  del escaneo se llevaba los 80 MB de fotos de `public/` adentro (2,1 MB con él).

Para unas pruebas seguidas alcanza y sobra. Para un QR impreso circulando, no.

### Después: Upstash Redis (producción)

Crear la base en `console.upstash.com` (plan free) y poner en Vercel las dos
variables de la pestaña REST API. Con eso el backend cambia solo en el próximo
deploy y no hay una línea de código que tocar.

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Para qué |
| --- | --- |
| `QR_PANEL_TOKEN` | Abre el panel: `clicfit.ar/qr/<slug>?token=...`. Sin esta variable el panel da 404 en producción. |
| `QR_HASH_SALT` | Opcional. Sal del hash de visitantes únicos. Cambiarla resetea el conteo de únicos. |
| `QR_DATA_FILE` | Opcional. Ruta del JSON en modo prueba. Por defecto, el temp del sistema. |
| `UPSTASH_REDIS_REST_URL` | Vacía = modo prueba. Completarla pasa a Redis. |
| `UPSTASH_REDIS_REST_TOKEN` | Idem. |

## Qué mide el panel

- **Escaneos** — hits que no parecen crawler.
- **Personas** — visitantes distintos. El identificador es un hash de IP +
  user-agent + día, así que **la IP no se guarda en ningún lado** y el mismo
  teléfono cuenta como alguien nuevo al día siguiente.
- **Bots** — previews de WhatsApp/Meta, buscadores, monitores. Se registran pero
  aparte, para que no inflen el número real.

Se guarda el detalle de los últimos 100 escaneos. El total no tiene tope.

Dos cosas que ya están resueltas y explican diferencias contra otros contadores:

- El `HEAD` tiene su propio handler: los previewers que sondean el link redirigen
  pero no suman.
- `/q/` y `/qr/` están en `disallow` de `robots.txt`.

## Generar la imagen del QR

No hay dependencia de QR en el proyecto: la imagen se genera una vez y se manda a
imprimir. Con [`segno`](https://pypi.org/project/segno/):

```bash
pip install segno
python3 -c "
import segno
qr = segno.make('https://clicfit.ar/q/gorroswine', error='q')
qr.save('qr.png', scale=20, border=4, dark='#0a0a0a', light='#ffffff')
"
```

- **`error='q'`** (25% de corrección) porque para una URL de este largo ocupa los
  mismos 37×37 módulos que el nivel M por defecto. Es mejora gratis.
- **Módulos oscuros sobre fondo claro.** Invertirlo (amarillo sobre negro) rompe
  scanners viejos. Para la versión de marca, negro sobre amarillo `#FBFA3F`.
- **`border=4`** es el quiet zone del estándar. Sin ese margen blanco muchos
  lectores no encuentran el código.
- Si va un logo al medio, que no tape más del ~6% del área: pasado eso deja de
  leerse aunque el nivel sea Q.
