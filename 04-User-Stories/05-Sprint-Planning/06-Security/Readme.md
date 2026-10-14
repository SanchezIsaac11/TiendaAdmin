# Security Requirements — TiendaAdmin POS

## Description

This directory contains the security requirements and proposed protection measures for the TiendaAdmin Point of Sale (POS) system.

## Objective

Protect business information, restrict unauthorized operations, maintain transaction integrity, and ensure accountability across both cash registers.

## 1. User Authentication

The system should provide secure authentication for authorized personnel.

Proposed security requirements:

- Each user must have an individual account.
- Users must authenticate before accessing restricted functions.
- User sessions must be managed securely.
- Passwords must not be stored in plain text.
- Access must be revoked when a user is deactivated.

## 2. Roles and Permissions

The system will consider three main roles:

**Administrator**
- Manage users and permissions.
- Manage products, costs, and prices.
- Access consolidated reports.
- Configure authorized system settings.

**Supervisor**
- Authorize restricted cash operations.
- Approve special discounts and price changes.
- Supervise cash register activities.

**Cashier**
- Process sales.
- Register authorized payment methods.
- Operate an assigned cash register shift.
- Access only permitted functions.

The final permission matrix must be validated before implementation.

## 3. Cash Register Security

- Each cash register must have a unique identifier.
- Each shift must be associated with an assigned cashier.
- Cash inflows and outflows must record the responsible user.
- Restricted cash outflows must require authorization.
- Payments to suppliers must be traceable.
- Cash register movements must preserve their transaction history.

## 4. Sales Security

- Sales must be associated with the corresponding cash register, shift, and cashier.
- Unauthorized price modifications must be prevented.
- Special discounts must require authorization when applicable.
- Duplicate sales must be prevented.
- Incomplete sales must not modify inventory or cash balances.
- Sales records must not be deleted to conceal previous transactions.
- Cancellations must follow a controlled process if enabled.
- Ticket reprints must be restricted or logged.

## 5. Inventory Security

- Product creation and modification must be permission-controlled.
- Cost and price changes must be restricted.
- Inventory adjustments must be traceable.
- Product losses must include a recorded reason.
- Inactive products must retain their historical records.

## 6. Database Security

The planned database platform is Supabase with PostgreSQL.

Proposed technical controls:

- Use secure connections.
- Implement Row Level Security (RLS) where appropriate.
- Enforce sensitive permissions at the backend/database level.
- Avoid exposing privileged database credentials in the Android application.
- Validate transactions before committing inventory and financial changes.
- Apply database constraints to protect data integrity.

## 7. Two-Register Synchronization

The system must support two cash registers operating simultaneously.

Security and integrity considerations include:

- Preventing conflicting stock updates.
- Validating actual stock before completing sales.
- Preventing duplicate synchronization operations.
- Preserving transaction identifiers.
- Maintaining traceability of pending and synchronized transactions.

## 8. Audit and Traceability

Sensitive operations should record relevant audit information, including:

- User responsible.
- Cash register identifier.
- Date and time.
- Operation performed.
- Authorization information when required.

## 9. Security Documentation

Planned document:

`security-requirements.md`

This document will contain detailed security requirements, identifiers, priorities, and verification criteria.

## Status

**Sprint 1 — Initial security requirements documentation.**

Security controls will be reviewed and validated before implementation.
