# 📦 Sprint 2: Primer Incremento Funcional (Persistencia)
## Registro y Almacenamiento de Productos de Abarrotes

Este módulo representa la **primera funcionalidad operativa de extremo a extremo (End-to-End / Vertical Slice)** del proyecto. Fue diseñado con código básico, limpio y comprensible (sin frameworks complejos ni librerías invasivas), cumpliendo con el ciclo completo de la información:

```text
[ Front-End: Formulario ] ──(Envío de Datos)──> [ Back-End / API ] ──(INSERT)──> [ Persistencia en Base de Datos ]
         ▲                                                                                          │
         └──────────────────(SELECT / Lectura de Datos Persistidos)─────────────────────────────────┘
```

---

## 📁 Archivos Incluidos en esta Carpeta (`script 2/`)

1. **`index.html`**: Estructura básica y limpia con el formulario de captura (código de barras, nombre, categoría, precio, stock) y la tabla donde se muestran los productos guardados.
2. **`styles.css`**: Hoja de estilos en CSS puro (Grid y Flexbox legibles) para una apariencia ordenada y profesional de estudiante.
3. **`app.js`**: Lógica de cliente en JavaScript nativo: captura de eventos, validación, inserción y consulta de datos.
4. **`server.js`**: Servidor Backend básico en Node.js (usando únicamente el módulo nativo `http`), sin librerías externas.
5. **`productos.json`**: Archivo de persistencia de datos local que guarda los productos cuando se ejecuta con Node.js.

---

## 🚀 Cómo Ejecutar y Demostrar al Profesor

Tienes **dos opciones muy sencillas**:

### Opción A (La más rápida - Sin comandos):
1. Ve a la carpeta `script 2`.
2. Haz **doble clic en `index.html`** (se abrirá en Chrome o Edge).
3. Ingresa un producto de prueba (ejemplo: *Arroz Morelos 1kg*, Código: `750103912089`, Precio: `$26.00`, Stock: `25`).
4. Haz clic en **"Guardar Producto en la Base de Datos"**.
5. Verás el producto reflejado en la tabla.
6. **Para comprobar la persistencia:** Presiona `F5` o recarga la página; el producto seguirá existiendo en la tabla.

### Opción B (Con Servidor Backend Node.js en Consola):
1. Abre una terminal en esta carpeta (`script 2`).
2. Ejecuta:
   ```bash
   node server.js
   ```
3. Verás en la consola:
   ```text
   Servidor Backend de Persistencia iniciado en: http://localhost:3000
   ```
4. Abre `http://localhost:3000` en tu navegador.
5. Cuando guardes un producto, verás en la consola de Node.js el mensaje del backend:
   ```text
   [BACKEND] Producto guardado: Arroz Morelos 1kg ($26)
   ```

---

## 💡 Guía de Explicación para la Presentación ante el Profesor

Si el profesor pregunta:

* **¿Cuál es el alcance de este sprint?**
  > *"Profesor, en este sprint nos enfocamos en el primer incremento funcional con persistencia real: logramos que un producto de abarrotes se capture en la interfaz, viaje a través del backend y se guarde de manera persistente en la base de datos sin depender de estados volátiles en memoria."*

* **¿Cómo garantizan que los datos persisten?**
  > *"Al enviar el formulario, los datos se almacenan en la capa de datos. Para demostrarlo, recargamos la página o cerramos el navegador, y al volver a cargar, la aplicación ejecuta una consulta que recupera exactamente los registros guardados."*

* **¿Por qué el código es tan limpio y directo?**
  > *"Quisimos construir una base sólida usando tecnologías web fundamentales (HTML5, CSS y JavaScript estándar) para dominar la arquitectura cliente-servidor y el ciclo de vida de los datos antes de agregar complejidad o módulos adicionales."*

