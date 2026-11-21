# TiendaAdmin POS

## Configuración del proyecto

### 1. Configurar las variables de entorno

El backend requiere variables de entorno para su funcionamiento.

1. Dirígete a la carpeta `backend`.
2. Localiza el archivo `.env.example`.
3. Crea una copia de este archivo y renómbrala a `.env`.
4. Completa las variables de entorno solicitadas utilizando los valores correspondientes.

**Nota:** La variable `ORIGIN` debe contener la dirección IP y el puerto que proporciona Live Server al ejecutar el frontend desde Visual Studio Code.

Por ejemplo:

```
ORIGIN=http://127.0.0.1:5500
```

La dirección de `ORIGIN` puede variar dependiendo de la configuración de Live Server. Asegúrate de utilizar exactamente la dirección que aparece en el navegador.


### 2. Ejecutar el backend

Desde la carpeta `backend`, ejecuta:

```
npm run dev
```

Si la ejecución es correcta, aparecerá un mensaje similar a: `server running on port: 3000`



### 3. Ejecutar el frontend

1. Abre la carpeta `frontend` en Visual Studio Code.
2. Localiza el archivo `index.html`.
4. Selecciona **Go Live**.

La dirección generada por Live Server debe coincidir con la variable `ORIGIN` configurada en el archivo `.env` del backend.

