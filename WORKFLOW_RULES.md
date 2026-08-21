# AgileFlow Feature Verification and Fixing Workflow

## 1. Follow the Project Rules First

Before starting any feature task:

- Read and follow `PROJECT_RULES.md`.
- Follow all project constraints.
- Understand the scope of the currently assigned feature.

These workflow rules explain **how to perform the task**.

The project rules define **what boundaries must be respected**.

---

# 2. Work on One Feature at a Time

Only work on the feature currently assigned.

Do not attempt to:

- Check the entire application.
- Fix multiple unrelated modules.
- Improve random parts of the codebase.
- Expand the scope of the task.

Complete the current feature before moving to another feature.

---

# 3. Understand Before Changing Anything

Before modifying code, first understand the existing implementation.

Identify the relevant:

## Frontend

- Components.
- Templates.
- Services.
- Models/interfaces.
- Routes.
- Guards.
- Interceptors.
- State or local storage logic.
- Error-handling logic.

## Backend

- Controllers.
- Request/response DTOs.
- Services.
- Entities/models.
- Repositories.
- Security configuration.
- Authentication/authorization logic.
- Exception handling.

Do not immediately start changing files.

First understand how the feature currently works.

---

# 4. Trace the Complete Feature Flow

For every assigned feature, trace the complete flow.

Start from the user action:

```text id="t2qczj"
User Action
↓
Frontend UI
↓
Component / Event Handler
↓
Frontend Service
↓
HTTP Request
↓
Backend Controller
↓
Backend Service
↓
Repository / Database
```

Then trace the result back:

```text id="5lyj4r"
Database / Backend Result
↓
Backend Response
↓
HTTP Response
↓
Frontend Service
↓
Component Response Handling
↓
UI Update / Navigation / Success Message / Error Message
```

Check every relevant connection.

---

# 5. Verify Frontend Logic

For the assigned feature, verify:

- Buttons call the correct functions.
- Event handlers are correctly connected.
- Forms submit correctly.
- Form fields are connected to the correct data.
- Validation logic is appropriate to the existing implementation.
- The correct frontend service method is called.
- API requests use the correct endpoint.
- API requests use the correct HTTP method.
- Request payloads match backend expectations.
- Required headers and authentication tokens are included when necessary.
- Responses are handled correctly.
- Success scenarios behave correctly.
- Error scenarios are handled correctly.
- Navigation paths are correct.
- Routes and guards work consistently with the feature.
- UI state is updated correctly.
- No relevant broken, disconnected, or outdated code exists.

---

# 6. Verify Backend Logic

For the assigned feature, verify:

- The required endpoint exists.
- The endpoint path matches the frontend request.
- The HTTP method matches.
- Request DTOs match frontend payloads.
- Required fields are handled correctly.
- Validation is consistent with the existing implementation.
- The controller calls the correct service logic.
- Service logic is correctly implemented.
- Repository/database interaction is correct.
- Authentication and authorization are correctly handled where applicable.
- Response structures match frontend expectations.
- Appropriate success and error responses are returned.
- Relevant edge cases are handled.

---

# 7. Verify Frontend ↔ Backend Integration

This is one of the most important parts of the workflow.

Explicitly compare the frontend and backend.

Check:

```text id="9at65z"
Frontend API URL
=
Backend Endpoint URL

Frontend HTTP Method
=
Backend HTTP Method

Frontend Request Payload
=
Backend Request DTO

Frontend Request Field Names
=
Backend Expected Field Names

Backend Response Structure
=
Frontend Expected Response Structure

Backend Status Codes
=
Frontend Success/Error Handling
```

Also verify:

- Authentication tokens.
- Authorization headers.
- Query parameters.
- Path variables.
- Optional fields.
- Validation errors.
- Error response structures.

Do not assume both sides are connected correctly just because both implementations exist.

---

# 8. Check Relevant Scenarios

Do not check only the happy path.

Analyze the relevant scenarios for the assigned feature.

Depending on the feature, check:

### Success Scenario

Does the complete code flow support the intended successful behavior?

### Invalid Input

Does the frontend validation and backend validation behave consistently?

### Missing or Incorrect Data

Is the scenario handled appropriately?

### Backend Errors

Can the frontend correctly receive and handle backend errors?

### Authentication and Authorization

If relevant:

- Is the token sent correctly?
- Are protected endpoints handled correctly?
- Are unauthorized responses handled correctly?
- Are forbidden responses handled correctly?

### Incorrect State or Edge Cases

Check relevant edge cases based on the existing feature implementation.

Do not invent unnecessary edge cases that are outside the project's intended behavior.

---

# 9. Fix Confirmed Issues

If an issue is identified:

1. Determine the actual cause.
2. Identify all directly related files.
3. Make the minimum necessary changes.
4. Keep frontend and backend consistent.
5. Recheck the complete code flow.

Do not:

- Make random changes.
- Rewrite unrelated modules.
- Add new features.
- Introduce unnecessary abstractions.
- Refactor the entire feature unless necessary.

---

# 10. Recheck After Fixing

After making changes, trace the feature again:

```text id="5ylj4r"
Frontend Action
→ Frontend Logic
→ API Request
→ Backend Logic
→ Database
→ Backend Response
→ Frontend Handling
→ UI Result
```

Confirm that the connections are now logically consistent.

This should be a code-level verification.

Do not repeatedly perform manual browser testing unless explicitly requested.

---

# 11. Handling Doubts or Unclear Behavior

If you are unsure about:

- The expected workflow.
- Feature behavior.
- Business rules.
- API behavior.
- Validation requirements.
- Navigation behavior.
- Intended UI behavior.

Do not assume.

Follow this order:

1. Check `PROJECT_RULES.md`.
2. Check `WORKFLOW_RULES.md`.
3. Inspect the relevant frontend implementation.
4. Inspect the relevant backend implementation.
5. Inspect DTOs, models, API contracts, and related code.
6. Compare with similar existing features.

If the answer is still unclear:

> Ask the user for clarification before making changes.

Never guess the intended behavior.

---

# 12. Final Task Report

After completing the assigned feature, provide a concise report.

## Feature Checked

State the name of the feature.

## Areas Analyzed

List the important frontend and backend areas inspected.

## Issues Found

Clearly list confirmed issues.

If no issues were found, explicitly state:

> No confirmed code-level logic or integration issues were found.

## Changes Made

Explain exactly what was changed and why.

If no changes were required, say so clearly.

## Out-of-Scope Issues

Mention any important unrelated issues discovered, but do not fix them unless explicitly requested.

## Manual Testing Recommendations

List the important scenarios that the user should test manually in the browser.

---

# Final Principle

For every feature, follow this approach:

> Understand first → Trace the complete flow → Verify frontend and backend integration → Check relevant scenarios → Fix confirmed issues → Recheck the code flow → Report clearly.

The goal is simple:

> Finish the existing AgileFlow application feature by feature and make the current functionality reliable, without unnecessary new features, redesigns, assumptions, or scope expansion.