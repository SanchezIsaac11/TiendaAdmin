# User Stories — TiendaAdmin POS

## Description

This directory contains the user stories and acceptance criteria for the TiendaAdmin Point of Sale (POS) system.

## Objective

Define system requirements from the perspective of the users, describing the features they need and the business value of each functionality.

## User Roles

The main user roles considered are:

- **Administrator:** Manages products, users, permissions, and business reports.
- **Supervisor:** Oversees cash register operations and authorizes restricted actions.
- **Cashier:** Processes sales, handles payments, and manages assigned cash register shifts.

## User Story Format

Each user story will follow this structure:

**As a** [user role],

**I want to** [perform an action],

**So that** [expected benefit].

## Initial User Stories

### US-001 — Process a Sale

**As a** cashier,

**I want to** scan products and add them to a shopping cart,

**So that** I can register customer purchases efficiently.

### US-002 — Manage Inventory

**As an** administrator,

**I want to** register products and monitor stock levels,

**So that** I can maintain accurate inventory records.

### US-003 — Open a Cash Register Shift

**As a** cashier,

**I want to** open a cash register shift with an initial cash amount,

**So that** all transactions can be associated with my assigned shift.

### US-004 — Apply Promotions

**As a** cashier,

**I want to** have valid promotions applied automatically,

**So that** customers receive the correct discounts.

### US-005 — Generate Sales Reports

**As an** administrator,

**I want to** review sales and profit reports,

**So that** I can evaluate business performance.

### US-006 — Synchronize Inventory

**As a** cashier,

**I want to** see updated product availability across both cash registers,

**So that** I can avoid selling products that are no longer in stock.

## Acceptance Criteria

Each user story must include measurable acceptance criteria defining the conditions required for successful completion.

Acceptance criteria will be documented in:

`acceptance-criteria.md`

## Planned Documentation

- `user-stories.md` — Detailed user stories, priorities, and related requirements.
- `acceptance-criteria.md` — Verifiable conditions for each user story.

## Status

**Sprint 1 — Initial user story documentation.**

The user stories and acceptance criteria will be refined and validated during sprint planning.
