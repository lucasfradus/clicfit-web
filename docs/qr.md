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
| `src/lib/qr/store.ts` | Guarda y lee de Upstash Redis. |
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

## Variables de entorno (Vercel → Settings → Environment Variables)

| Variable | Para qué |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis, plan free. `console.upstash.com` → Create database → pestaña REST API. |
| `UPSTASH_REDIS_REST_TOKEN` | Idem. |
| `QR_PANEL_TOKEN` | Abre el panel: `clicfit.ar/qr/<slug>?token=...`. Sin esta variable el panel da 404 en producción. |
| `QR_HASH_SALT` | Opcional. Sal del hash de visitantes únicos. Cambiarla resetea el conteo de únicos. |

Sin las dos de Upstash el sitio **no se rompe**: la redirección anda igual y el
contador cae a memoria del proceso, que en Vercel no sirve para nada. El panel lo
avisa arriba de todo.

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
