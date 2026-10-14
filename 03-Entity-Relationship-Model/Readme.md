# Entity-Relationship Model — TiendaAdmin POS

## Description

This directory contains the Entity-Relationship (ER) model documentation for the TiendaAdmin Point of Sale system.

## Objective

Design and document the database structure required to manage sales, inventory, cash registers, users, and business transactions.

## Database Technology

- **Database:** PostgreSQL
- **Backend Platform:** Supabase
- **Architecture:** Centralized database shared by two cash registers.

## Main Entities (Preliminary)

The following entities will be considered during database design:

- **Users:** System users and their assigned roles.
- **Roles:** Access levels and permissions.
- **Cash Registers:** Information about each POS terminal.
- **Cash Shifts:** Opening and closing records for each register.
- **Products:** Product catalog, prices, costs, and stock levels.
- **Inventory Movements:** Stock changes, adjustments, and losses.
- **Sales:** Sales transactions and associated cash registers.
- **Payments:** Payment methods and amounts.
- **Promotions:** Discounts and promotional rules.
- **Suppliers:** Supplier information and related transactions.
- **Expenses:** Business expenses and authorized cash outflows.

## Planned Documentation

- `er-model.md` — Entity-Relationship diagram and relationship descriptions.
- `data-dictionary.md` — Entity attributes, data types, primary keys, and foreign keys.

## Design Considerations

The database design must support:

- Two cash registers operating simultaneously.
- Shared inventory information.
- Transaction history and traceability.
- User roles and permissions.
- Data integrity and consistency.
- Prevention of duplicate sales.
- Reliable stock updates.

## Status

**Sprint 1 — Initial database modeling documentation.**

The final entities, attributes, and relationships will be defined and validated during the database design process.
