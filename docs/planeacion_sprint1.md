# Planning and Architecture Documentation – Sprint 1

**Project:** TiendaAdmin (Point of Sale and Web Management System)  
**Course:** Web Systems Programming

## Team and Responsibilities

* **Adriana Chiquito Díaz de León:** Frontend Development and Views.
* **Alondra Ivett Vera Macías:** Backend Development (Routes and Controllers).
* **Junuet de Jesús Reyes González:** Backend Development (Middlewares and Logic).
* **Enrique Isaac Sánchez Peñaloza:** Database, ER Model, and Integration.

---

## 1. Project Goals and Timeline

- **Sprint 1 (Planning):** Definition of requirements, use cases, Entity-Relationship model, user stories, acceptance criteria, and security design. Gitflow and GitHub Projects configuration.
- **Sprint 2 (Initial Implementation):** First functional workflow with PostgreSQL database persistence. User authentication and basic product CRUD operations.
- **Sprint 3 (Integration and Deployment):** Point of Sale module (checkout and receipts), functional Role-Based Access Control (RBAC), End-to-End (E2E) testing, and CI/CD configuration.
- **Sprint 4 (Consolidation):** Completion of sales history, technical debt resolution, vulnerability mitigation, and code optimization.
- **Final Delivery:** Application deployed to production, test coverage of at least 90%, and technical defense.

---

## 2. System Requirements

### Functional Requirements (FR)

* **FR01:** The system must allow users to log in by validating their credentials and assigning permissions according to their role (`Administrator` or `Cashier`).
* **FR02:** The system must require the cashier to register an initial cash amount to open a cash register shift.
* **FR03:** The system must allow extraordinary cash inflows and outflows to be recorded during an open shift.
* **FR04:** The system must calculate the final cash reconciliation by comparing the physical cash amount against the expected amount and record the shift closure.
* **FR05:** The administrator must be able to create, read, update, and deactivate (CRUD) products and categories.
* **FR06:** The system must allow products to be searched for at the Point of Sale terminal using a barcode or product name.
* **FR07:** The system must manage a sales cart, validate available stock in real time, and calculate totals and taxes.
* **FR08:** The system must record sales, automatically deduct stock from inventory, and record the payment method (cash/card).
* **FR09:** The system must generate a receipt after each successful sale.
* **FR10:** The system must allow sales history and cash register transactions to be queried by date and user.

### Non-Functional Requirements (NFR)

* **NFR01 (Security):** Passwords must be securely hashed using `bcrypt`. Routes must be protected, and credentials must not be exposed in the source code.
* **NFR02 (Integrity):** The PostgreSQL database must guarantee atomic transactions (ACID) to prevent inventory discrepancies.
* **NFR03 (Architecture):** The backend must strictly follow the separation of responsibilities: Routes → Middlewares → Controllers → Models.
* **NFR04 (Usability):** The checkout interface must minimize clicks and support efficient keyboard and barcode scanner usage.

---

## 3. Main Use Cases

**Identified Actors:** Administrator and Cashier.

* **UC01: Log In** (Administrator/Cashier)
* **UC02: Manage Inventory** (Administrator)
* **UC03: Open and Close Cash Register Shift** (Cashier)
* **UC04: Process Sale** (Cashier)
* **UC05: View Reports** (Administrator)

### Detailed Specification: UC04 – Process Sale

* **Actor:** Cashier.
* **Precondition:** A cash register shift is open.

**Main Flow:**

1. The cashier enters the product code.
2. The system validates stock availability and updates the cart and totals.
3. The cashier finishes entering products and enters the payment amount.
4. The system calculates the change.
5. The cashier confirms the transaction. The system deducts stock, saves the sale, and generates the receipt.

**Alternative Flow:** If stock is insufficient when a product is entered, the system displays an alert and rejects the addition.

### Detailed Specification: UC03 – Cash Register Closing

* **Actor:** Cashier.
* **Precondition:** A cash register shift is open.

**Main Flow:**

1. The cashier requests the shift closure and enters the amount of physical cash counted.
2. The system compares the physical cash against the expected cash balance (Initial amount + Cash sales + Cash inflows − Cash outflows).
3. The system displays the difference (shortage, surplus, or balanced).
4. The operation is confirmed, and the shift status changes to "Closed".

---

## 4. Entity-Relationship (ER) Model and Data Dictionary

The system consists of the following relational tables in PostgreSQL:

1. **`roles`:** `id_rol` (PK), `nombre` (Administrator, Cashier).
2. **`usuarios`:** `id_usuario` (PK), `id_rol` (FK), `nombre`, `email`, `password_hash`, `activo`.
3. **`cajas_turnos`:** `id_turno` (PK), `id_usuario` (FK), `monto_inicial`, `monto_final_esperado`, `monto_final_real`, `estado` (open/closed).
4. **`movimientos_caja`:** `id_movimiento` (PK), `id_turno` (FK), `tipo` (inflow/outflow), `monto`, `motivo`.
5. **`categorias`:** `id_categoria` (PK), `nombre`.
6. **`productos`:** `id_producto` (PK), `id_categoria` (FK), `codigo_barras`, `nombre`, `precio_costo`, `precio_venta`, `stock_actual`.
7. **`ventas`:** `id_venta` (PK), `id_turno` (FK), `folio`, `total`, `metodo_pago`, `pago_con`, `cambio`.
8. **`detalle_ventas`:** `id_detalle` (PK), `id_venta` (FK), `id_producto` (FK), `cantidad`, `precio_unitario`, `subtotal`.

---

## 5. User Stories and Acceptance Criteria

### US01: System Access

* **As an** employee, **I want to** log in using my credentials, **so that** I can access my work tools.

**Acceptance Criteria:**

- Given a valid email and password, the system starts a session and redirects the user according to their role.
- Given invalid credentials, the system returns a 401 error without specifying which field failed.

### US02: Shift Opening

* **As a** cashier, **I want to** register the initial cash amount, **so that** I can enable the checkout terminal.

**Acceptance Criteria:**

- Given an amount greater than or equal to zero, the shift is created with the status "Open".
- If the cashier already has an open shift, the system prevents another shift from being opened.

### US03: Product Scanning

* **As a** cashier, **I want to** enter a product code, **so that** I can add the product to the shopping cart.

**Acceptance Criteria:**

- If sufficient stock is available, the product is added and the total is recalculated.
- If sufficient stock is unavailable, the system displays an error and does not add the unit.

### US04: Payment Processing

* **As a** cashier, **I want to** register the customer's payment, **so that** I can complete the transaction.

**Acceptance Criteria:**

- If the payment is sufficient, the sale is saved atomically, the stock is reduced, and a receipt is generated.
- If the payment is less than the total, the sale cannot be processed.

### US05: Shift Closing

* **As a** cashier, **I want to** enter the final counted cash amount, **so that** I can reconcile the cash register.

**Acceptance Criteria:**

- When the physical cash total is entered, the system calculates the difference against the expected amount, saves the record, and closes the shift.

### US06: Catalog Management

* **As an** administrator, **I want to** register new products, **so that** I can keep inventory up to date.

**Acceptance Criteria:**

- Given valid data and a unique product code, the product is saved to the database.
- If the barcode already exists, the system returns a 409 Conflict error.

---

## 6. Security Design, Validation, and Roles (RBAC)

To comply with security guidelines, the following policies are established:

### 6.1. Input Validation

* All incoming data (POST/PUT/PATCH) must be validated in the **Middleware** layer before reaching the Controller.
* Numeric values (prices and quantities) must be validated as strictly positive.
* **SQL Injection Prevention:** Concatenating variables into SQL queries is prohibited. Only parameterized queries (`$1, $2, ...`) will be used through the PostgreSQL `pg` driver.

### 6.2. Role-Based Access Control (RBAC)

* **Administrator Role:** Global read/write permissions for products and categories, access to sales reports for all employees, and user management.
* **Cashier Role:** Restricted permissions for opening and closing their own cash register shift, searching for products, and creating sales. Cashiers are not authorized to modify prices or view other cashiers' closing reports.

### 6.3. Secrets Protection

* Passwords must never be stored in plain text. `bcrypt` will be used with a minimum of 10 salt rounds.
* Database credentials, ports, and cryptographic session secrets must be stored in environment variables (`.env`).
* The `.env` file must be explicitly included in `.gitignore` to prevent it from being published to the repository.

### 6.4. Security Test Cases (To Be Implemented)

1. **Anonymous Access Attempt:** Access the `/ventas` route without logging in. *Expected result: HTTP 401 Unauthorized.*
2. **Privilege Escalation:** A user with the "Cashier" role attempts to send a POST request to `/productos` to change a product price. *Expected result: HTTP 403 Forbidden.*
3. **SQL Injection:** Attempt to enter statements such as `' OR 1=1 --` in the product search field. *Expected result: The input is treated as a literal string, and the database remains unaffected.*
4. **Amount Manipulation:** A user submits a sale with a negative "total to pay" from the frontend. *Expected result: The middleware intercepts the request and responds with HTTP 400 Bad Request.*
