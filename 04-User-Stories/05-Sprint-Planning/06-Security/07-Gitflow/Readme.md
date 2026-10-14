# Gitflow Workflow — TiendaAdmin POS

## Description

This directory defines the Gitflow branching strategy, commit conventions, and Pull Request workflow for the TiendaAdmin Point of Sale (POS) project.

## Objective

Establish a consistent version control workflow that supports team collaboration, traceability, code and documentation reviews, and controlled integration of changes.

## 1. Branching Strategy

The repository follows a Gitflow-based workflow.

### main

The `main` branch contains stable and approved project deliverables.

- Only reviewed and approved changes should be integrated.
- Direct commits should be restricted.
- Changes should be merged through Pull Requests.

### develop

The `develop` branch is used to integrate ongoing work.

- Feature branches are created from `develop`.
- Completed features are merged into `develop` through Pull Requests.
- The branch represents the latest integrated development state.

### feature/*

Feature branches are used for individual tasks.

Naming convention:

`feature/task-description`

Examples:

- `feature/documentation-structure`
- `feature/functional-requirements`
- `feature/use-case-diagram`
- `feature/er-model`
- `feature/user-stories`
- `feature/security-requirements`

Feature branches must originate from `develop` and be merged back into `develop` through Pull Requests.

### release/*

Release branches are created from `develop` when preparing a stable version.

Example:

`release/v1.0.0`

After validation, release changes are merged into `main` and back into `develop`.

### hotfix/*

Hotfix branches are created from `main` to address urgent problems affecting a stable release.

Example:

`hotfix/critical-documentation-fix`

Approved fixes must be integrated into both `main` and `develop`.

## 2. Commit Conventions

Commit messages must be written in English.

The team will use the following format:

`type: short description`

Common commit types:

- `docs:` Documentation changes.
- `feat:` New functionality.
- `fix:` Bug fixes.
- `refactor:` Internal improvements.
- `chore:` Maintenance and configuration.
- `test:` Tests and verification.

Examples:

- `docs: initialize POS requirements documentation`
- `docs: add user stories`
- `docs: define entity relationship model`
- `docs: document security requirements`
- `chore: configure repository structure`

Commits should be descriptive and focused on a specific change.

## 3. Pull Request Workflow

The team must use Pull Requests to integrate changes.

Standard workflow:

1. Create a GitHub Issue describing the task.
2. Assign the Issue to a team member.
3. Create a feature branch from `develop`.
4. Complete the assigned work.
5. Commit changes using the established convention.
6. Push changes to the remote repository.
7. Open a Pull Request targeting `develop`.
8. Request a review from another team member.
9. Address any requested changes.
10. Merge the Pull Request after approval.
11. Close the associated Issue.

## 4. Pull Request Requirements

Each Pull Request should include:

- A descriptive title.
- A summary of the changes.
- The related GitHub Issue.
- Acceptance criteria or verification results.
- A reviewer when available.

Example title:

`docs: add Sprint 1 documentation structure`

## 5. Branch Protection

The team should configure repository rules to protect `main` and `develop`, where supported.

Recommended rules:

- Require Pull Requests before merging.
- Require at least one approval.
- Restrict direct changes to protected branches.
- Prevent accidental deletion of protected branches.

## 6. Sprint 1 Workflow

During Sprint 1, the team will focus exclusively on project documentation.

Planned activities include:

- Defining requirements.
- Documenting use cases.
- Designing the ER model.
- Writing user stories and acceptance criteria.
- Establishing security requirements.
- Organizing the GitHub Projects board.
- Creating Issues and assigning responsibilities.
- Recording commits and Pull Requests.

No application source code will be included in the Sprint 1 deliverables.

## 7. Definition of Done

A task is considered complete when:

- Its documentation is finished.
- The corresponding acceptance criteria are satisfied.
- Changes have been committed to the appropriate feature branch.
- A Pull Request has been created.
- The changes have been reviewed.
- The Pull Request has been merged.
- The associated Issue has been updated or closed.

## 8. Planned Documentation

- `branching-strategy.md` — Detailed branching and merging conventions.
- `commit-conventions.md` — Commit message standards and examples.

## Status

**Sprint 1 — Gitflow documentation initialized.**
