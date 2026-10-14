# Security Requirements and Design – Sprint 1

**Project:** POS Retail (Point of Sale and Inventory)

---

## 1. Planned Validations

All validations are done **on the server** (in a middleware that runs before the controller). Validations in the browser form only help the user and are not considered security.

### 1.1 Rules per field

| Field | Type | Rule | Invalid example |
|---|---|---|---|
| `email` | string | valid email format, max. 100 characters | `juan@` |
| `password` | string | min. 8 and max. 64 characters, with a letter and a number | `1234` |
| `nombre` (product) | string | required, 2 to 100 characters | empty |
| `precio` | number | greater than 0, max. 2 decimals | `-5`, `"abc"` |
| `stock` | integer | greater than or equal to 0 | `-1`, `2.5` |
| `codigo_barras` | string | numbers only, 8 to 14 digits, unique | `abc123` |
| `cantidad` (in a sale) | integer | greater than 0 and not greater than the stock | `0`, `9999` |
| `metodo_pago` | string | only `efectivo`, `tarjeta` or `transferencia` | `"bitcoin"` |
| `monto_recibido` | number | greater than or equal to the sale total | less than the total |
| `id` (in the route) | integer | positive number | `1 OR 1=1` |

### 1.2 How validation is done
1. **Data types:** each field is checked to be of the expected type (number, text, integer).
2. **Length:** texts that are too short or too long are rejected.
3. **Allowed fields:** only the expected fields are accepted. The rest are ignored, to prevent someone from sending `rol: "admin"`.
4. **Sanitization:** extra spaces are removed (`trim`) and the characters `<` and `>` are escaped in texts that will be displayed on screen (prevents XSS).
5. **Database queries:** always parameterized (`?`); user text is never concatenated. This prevents SQL injection.
6. **Error response:** if something fails, a `400` is returned with a clear message, without showing internal details or database errors.

### 1.3 Status codes used

| Code | When |
|---|---|
| 400 | invalid data |
| 401 | no session or invalid token |
| 403 | has a session but no permission |
| 404 | resource does not exist |
| 409 | duplicate (e.g. repeated barcode) |

---

## 2. Role-Based Access Control (RBAC)

### 2.1 Roles

| Role | Description |
|---|---|
| **Administrator** | Controls the whole store: users, inventory, reports and cash cuts. |
| **Cashier** | Only makes sales and checks what is needed to charge customers. |

### 2.2 How it works
1. The user logs in at `POST /api/auth/login`.
2. The server generates a **JWT token** that includes the user's `id` and role, with an expiration of 8 hours.
3. On every protected request, a `verificarToken` middleware checks that the token is valid.
4. Another middleware, `permitirRoles('Administrador')`, checks that the role has permission for that route.

It is split into two middlewares: one answers "who are you?" (401) and the other "are you allowed to do this?" (403).

### 2.3 Permissions matrix

| Route / Resource | Method | No session | Cashier | Administrator |
|---|---|:---:|:---:|:---:|
| `/api/auth/login` | POST | Yes | Yes | Yes |
| `/api/productos` | GET (list/search) | No | Yes | Yes |
| `/api/productos` | POST (create) | No | No | Yes |
| `/api/productos/:id` | PUT (edit) | No | No | Yes |
| `/api/productos/:id` | DELETE (soft delete) | No | No | Yes |
| `/api/ventas` | POST (register sale) | No | Yes | Yes |
| `/api/ventas` | GET (history) | No | Only their own | All |
| `/api/ventas/:id/cancelar` | PATCH | No | No | Yes |
| `/api/corte-caja` | POST (make cash cut) | No | Yes (their register) | Yes |
| `/api/corte-caja` | GET (view cash cuts) | No | Only their own | All |
| `/api/movimientos-caja` | POST | No | Yes | Yes |
| `/api/mermas` | POST | No | No | Yes |
| `/api/reportes` | GET | No | No | Yes |
| `/api/usuarios` | GET / POST / PUT / DELETE | No | No | Yes |

### 2.4 Additional rules
- A Cashier can only see the data of their own sales and cash cuts (filtered by the `id` in the token, not by a parameter sent by the client).
- Only an Administrator can create users or change roles.
- The role is never received from a form; it is taken from the database.

---

## 3. Secrets Protection

| Secret | Where it lives | How it is protected |
|---|---|---|
| Database password | `.env` | Not uploaded to GitHub |
| Database / Supabase URL and keys | `.env` | Not uploaded to GitHub |
| Key to sign the JWT (`JWT_SECRET`) | `.env` | Long random string (min. 32 characters) |
| User passwords | Database | Only the **hash** is stored with `bcrypt`, never the real password |

### 3.1 Strategy
1. **Environment variables:** all secrets are read with `process.env` from a `.env` file. They are never written directly in the code.
2. **`.gitignore`:** includes `.env`, `node_modules/` and local configuration files, so they do not reach the repository.
3. **`.env.example`:** a template with the variable names and fake values is uploaded to the repository, so the team knows what to configure.
4. **Hashed passwords:** with `bcrypt` (10 salt rounds). On login, the password is compared with `bcrypt.compare`. The hash is never returned in API responses.
5. **If a secret is uploaded by mistake:** it is changed immediately (deleting the commit is not enough) and the team is notified.
6. **Login messages:** the same response is returned for "user does not exist" and "wrong password" (`Invalid credentials`), so it does not reveal which users exist.

### 3.2 `.env.example` sample
```
PORT=3000
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=change_this
DB_NAME=pos
JWT_SECRET=change_to_a_long_random_string
JWT_EXPIRES_IN=8h
```

### 3.3 `.gitignore` sample
```
.env
node_modules/
*.log
```

---

## 4. Security Test Cases

| ID | Case | Input / Action | Expected result |
|---|---|---|---|
| S-01 | Access without authentication | `GET /api/productos` without a token | 401 |
| S-02 | Invalid token | Tampered or made-up token | 401 |
| S-03 | Expired token | Token older than 8 hours | 401 |
| S-04 | Cashier tries to create a product | `POST /api/productos` with a Cashier token | 403 |
| S-05 | Cashier tries to view reports | `GET /api/reportes` with a Cashier token | 403 |
| S-06 | Cashier tries to view someone else's sales | `GET /api/ventas` with a Cashier token | Returns only their own sales |
| S-07 | SQL injection in login | email: `' OR '1'='1` | 400 or 401, no access |
| S-08 | SQL injection in search | search: `'; DROP TABLE productos;--` | Not executed; empty result |
| S-09 | SQL injection in route parameter | `GET /api/productos/1 OR 1=1` | 400 |
| S-10 | XSS in product name | name: `<script>alert(1)</script>` | Escaped; does not run |
| S-11 | Negative price | `precio: -10` | 400 |
| S-12 | Wrong data type | `stock: "abc"` | 400 |
| S-13 | Missing fields | `POST /api/productos` with an empty body | 400 |
| S-14 | Text too long | name with 5000 characters | 400 |
| S-15 | Quantity greater than stock | sell 100 with a stock of 5 | 400 |
| S-16 | Duplicate barcode | create two products with the same code | 409 |
| S-17 | Role escalation | `POST /api/usuarios` with `rol: "Administrador"` sent by a Cashier | 403 |
| S-18 | Disallowed field | body with `rol: "Administrador"` when editing a profile | The field is ignored |
| S-19 | Password in the database | Check the `usuarios` table | Only hashes, no plain text |
| S-20 | Hash in responses | `GET /api/usuarios` | The response does not include `password` |
| S-21 | Login message | nonexistent user vs. wrong password | Same message in both cases |
| S-22 | Secrets in the repository | Search for `.env` or keys on GitHub | None exist |
| S-23 | Internal errors | Cause a database failure | Generic message, no technical details |
