# AgileFlow Correction Workflow Rules

## 1. Purpose of This Phase

The core feature implementation and verification phase is already completed.

This phase is only for:

- Fixing reported functional or logical issues.
- Implementing the specified UI/UX corrections.
- Rendering existing or relevant data/components in more appropriate places where requested.
- Improving the usability and consistency of the existing application.

Do not treat this phase as an opportunity to redesign, rewrite, or expand the entire application.

---

## 2. Understand the Requested Correction First

Before making any changes, carefully understand the specific correction or issue assigned.

For each task:

1. Read the requested behavior carefully.
2. Inspect the relevant existing frontend and backend code.
3. Identify how the current implementation works.
4. Identify why the current behavior differs from the requested behavior.
5. Make changes only after understanding the existing flow.

Do not immediately modify code based only on assumptions.

---

## 3. Never Assume Unclear Behavior

If any part of the requested correction is unclear:

- Check the correction request.
- Check `PROJECT_RULES.md`.
- Inspect the relevant existing implementation.
- Check related frontend and backend logic.
- Check similar functionality elsewhere in the application.

If the intended behavior is still unclear:

> Stop and ask for clarification before implementing the change.

Do not invent business rules, workflows, UI behavior, or data relationships.

---

## 4. Keep Changes Within the Assigned Correction

Work only on the correction currently assigned.

Do not:

- Start fixing unrelated bugs.
- Refactor unrelated code.
- Redesign unrelated screens.
- Add extra features that were not requested.
- Change existing behavior without a reason connected to the current correction.

If an unrelated issue is discovered, do not silently fix it. Mention it after completing the assigned task if necessary.

---

## 5. Functional and Logical Corrections

For a functional correction, trace the relevant implementation before changing it.

Where applicable, verify:

```text
UI Action
→ Frontend Component
→ Service / State
→ API Request
→ Backend Logic
→ Database
→ Response
→ Frontend Handling
→ Final UI Behavior
```

Check both frontend and backend whenever the requested behavior depends on both.

Do not fix only the visible UI if the actual cause exists in backend logic, data relationships, permissions, or API behavior.

Similarly, do not change backend behavior without checking whether the frontend still correctly handles the result.

---

## 6. Data and Role-Based Behavior

When a correction involves:

- User roles.
- Project ownership.
- Project membership.
- Data visibility.
- Permissions.
- User state.
- Assigned or managed resources.

Treat these as logic-sensitive changes.

Before implementing, identify:

- What data currently exists.
- How the relationship is stored.
- Which user is allowed to access or modify it.
- What existing rules already define the behavior.

Ensure that the correction does not accidentally expose data to the wrong role or break existing authorization and ownership behavior.

---

## 7. UI/UX Corrections

For UI corrections:

- Preserve the existing application design unless a change is explicitly requested.
- Keep styles consistent with the existing application.
- Reuse existing components, patterns, and utilities where appropriate.
- Avoid creating duplicate implementations for the same behavior.

When adding UI behavior such as:

- Confirmation dialogs.
- Success feedback.
- Failure feedback.
- Dropdowns or popups.
- Icons.
- Hover effects.
- Animations.
- Responsive layouts.

Make the implementation consistent across the relevant parts of the application.

Do not apply random or inconsistent styling from one component to another.

---

## 8. Responsive Changes

When fixing responsiveness:

- Do not redesign the desktop layout unnecessarily.
- Preserve the intended existing desktop experience.
- Adjust layouts appropriately for tablet and mobile screens.
- Ensure components do not overflow, overlap, become inaccessible, or break interaction flow.

Use the existing layout structure and make responsive changes only where necessary.

---

## 9. Interaction Behavior

For interactive UI elements, verify the intended open and close behavior in the code.

For example, where appropriate:

- Clicking outside a popup should close it.
- Closing should not depend only on clicking the original trigger again.
- Escape or existing close controls should continue to work if already supported.
- The active navigation state should match the currently displayed route or component.
- Important actions should provide appropriate feedback.

Apply these behaviors consistently, but do not force the same behavior onto components where it would conflict with their intended purpose.

---

## 10. Reuse Before Creating

Before creating a new:

- Modal.
- Popup.
- Alert.
- Notification.
- Icon implementation.
- Animation pattern.
- UI utility.

Check whether the project already contains a reusable implementation.

If an appropriate existing implementation exists, reuse or extend it instead of creating unnecessary duplicates.

---

## 11. Verify Through Code, Not Manual Browser Testing

Do not open the browser and repeatedly test the application manually.

Do not enter a browser-testing loop.

Verify the correction primarily by:

- Inspecting the relevant code.
- Tracing the functional flow.
- Comparing frontend and backend contracts.
- Checking affected conditions and states.
- Reviewing the changes for consistency.

The user will manually verify the final behavior in the browser.

Do not claim that something was manually tested in the browser unless explicitly instructed to do so.

---

## 12. Recheck the Impact of Every Change

After implementing a correction:

1. Review the modified files.
2. Trace the affected flow again.
3. Check directly related scenarios.
4. Ensure existing behavior outside the requested correction was not unnecessarily changed.
5. Check frontend/backend consistency if both were modified.

The goal is to make a targeted correction without creating regressions in directly related functionality.

---

## 13. Don't Report

---

# Final Principle

For every correction:

> Understand the requested behavior → inspect the existing implementation → identify the real cause → make the minimum necessary change → recheck the affected flow.

Do not assume.

Do not over-engineer.

Do not expand the scope.

Do not repeatedly test manually in the browser.

The goal is simple:

> Apply the requested corrections accurately and make the existing AgileFlow application more stable, logically correct, and consistent without introducing unnecessary changes.
