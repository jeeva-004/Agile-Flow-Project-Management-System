# AgileFlow Project Rules

## 1. Project Goal

The primary goal of this project is to **complete and stabilize the existing AgileFlow Project Management System**.

The focus is not on expanding the project.

The goal is:

> Make all currently implemented features work correctly, reliably, and consistently.

Do not introduce unnecessary complexity or expand the project scope.

---

## 2. Existing Features Only

Do not add new features unless explicitly requested.

Focus only on:

- Existing functionality.
- Existing frontend implementation.
- Existing backend implementation.
- Existing API integrations.
- Existing workflows.
- Fixing broken, incomplete, or incorrectly connected functionality.

Do not assume that a feature needs additional functionality just because it could be improved.

---

## 3. Do Not Make Unnecessary Changes

Do not:

- Redesign the UI unnecessarily.
- Change the project architecture unnecessarily.
- Perform large-scale refactoring.
- Rename files, classes, methods, or variables without a valid reason.
- Modify unrelated features.
- Replace existing implementations with completely new solutions unless necessary to fix a confirmed problem.

Keep changes focused and minimal.

---

## 4. Respect the Existing Project Structure

Before making changes:

- Understand the existing frontend structure.
- Understand the existing backend structure.
- Follow the existing architecture and coding patterns.
- Reuse existing services, utilities, DTOs, models, and components when appropriate.

Do not introduce a different pattern or structure unless it is necessary to fix a real issue.

---

## 5. Do Not Assume Requirements

Never invent or assume:

- Feature behavior.
- Business rules.
- User workflows.
- API contracts.
- Validation requirements.
- Navigation behavior.
- Error-handling behavior.

If the intended behavior is unclear:

1. Check these project rules.
2. Check the workflow rules.
3. Inspect the relevant existing frontend code.
4. Inspect the relevant existing backend code.
5. Inspect API contracts, DTOs, models, and related implementations.
6. Check how similar features behave elsewhere in the project.

If the intended behavior is still unclear after investigation:

> Stop and ask for clarification before making changes.

Do not guess.

---

## 6. Frontend and Backend Must Remain Consistent

For every existing feature, ensure that the frontend and backend integration remains consistent.

Verify where relevant:

- API endpoint paths.
- HTTP methods.
- Request payloads.
- Request field names.
- DTO structures.
- Response structures.
- Response field names.
- Status codes.
- Authentication headers or tokens.
- Error responses.
- Frontend handling of backend responses.

Do not modify only one side of an integration without checking its impact on the other side.

---

## 7. Fix Confirmed Problems

If you find a genuine issue:

- Identify the actual cause.
- Fix the issue.
- Check all directly related code.
- Ensure the fix does not create obvious inconsistencies.

Do not make speculative changes.

Do not change code merely because it "might" be problematic.

Changes should have a clear technical reason.

---

## 8. Stay Within the Current Task Scope

Work only on the feature or issue currently assigned.

Do not start fixing unrelated features while working on the current feature.

If you discover an unrelated issue:

- Do not automatically expand the current task.
- Mention it in the final report if it is important.
- Continue focusing on the assigned feature.

---

## 9. Browser Testing

Do not perform repetitive manual browser testing or enter browser-testing loops unless explicitly requested.

The primary verification approach should be:

> Code-level analysis and end-to-end integration tracing.

The user will perform the final manual testing in the browser.

You may recommend specific scenarios for the user to test after completing the code-level verification and fixes.

---

## 10. Before Completing a Task

Before declaring a task complete:

- Review the changes made.
- Verify that the changes are relevant to the assigned feature.
- Check that frontend and backend integration is consistent where applicable.
- Ensure no unnecessary functionality was introduced.
- Ensure no assumptions were made without evidence from the project.

The objective is always:

> Fix and complete the existing project — not continuously expand or reinvent it.