# AgileFlow UI Redesign Rules

## 1. Purpose of This Phase

The AgileFlow application is already functionally implemented.

The frontend, backend, API integration, and existing application logic are considered working.

This phase is exclusively focused on:

- Improving the visual design.
- Improving UI consistency.
- Improving UX.
- Improving layout and information hierarchy.
- Improving responsiveness.
- Improving visual feedback and interactions.
- Creating a more polished and professional application interface.

The goal is:

> Redesign the existing user interface without changing or breaking the existing functionality.

---

# 2. Backend Is Strictly Out of Scope

Do not modify the backend under any circumstances.

Do not change:

- Backend controllers.
- Backend services.
- Repositories.
- Entities.
- DTOs.
- Security configuration.
- API endpoints.
- Database logic.
- Authentication logic on the backend.
- Authorization logic on the backend.

The backend is outside the scope of this UI redesign phase.

Only work inside the frontend unless explicitly instructed otherwise.

---

# 3. Preserve All Existing Functionality

The current functionality must remain unchanged.

Do not intentionally change:

- Business logic.
- API behavior.
- API endpoints.
- HTTP methods.
- Request payloads.
- Response handling.
- Authentication flow.
- Authorization behavior.
- Role-based behavior.
- Existing routing behavior.
- Existing data flow.
- Existing feature behavior.

The UI may look different, but the application must continue to perform the same actions.

The redesign must not remove existing functionality.

---

# 4. Preferred Modification Areas

Prioritize changes in:

- HTML/templates.
- CSS/SCSS/styles.
- Layout structure.
- Component styling.
- Responsive styling.
- Icons.
- Spacing.
- Typography.
- Visual hierarchy.
- Empty states.
- Loading states.
- Visual feedback.
- Transitions and animations.

TypeScript may be modified only when genuinely necessary for UI-related behavior.

Examples of acceptable UI-related TypeScript changes:

- Opening or closing a UI-only dropdown.
- Sidebar collapse state.
- Modal visibility.
- Tab selection.
- Accordion behavior.
- UI interaction state.
- Animation state.

Do not modify TypeScript business logic unless the existing UI structure makes a small UI-related adjustment absolutely necessary.

---

# 5. Do Not Rewrite Working Logic

Before modifying a component:

1. Inspect the existing component.
2. Understand its current UI and functionality.
3. Identify the existing bindings.
4. Identify event handlers.
5. Identify forms and validation.
6. Identify API-related calls.
7. Identify routing and navigation behavior.

Preserve all existing working:

- Event bindings.
- Function calls.
- Form bindings.
- Validation.
- API service calls.
- Data models.
- Routing.
- Conditional rendering.
- Role-based conditions.

Do not replace working logic simply because a cleaner implementation is possible.

The purpose is UI redesign, not code refactoring.

---

# 6. Redesign the Page, Not the Functionality

You are allowed to significantly improve:

- Page layout.
- Component arrangement.
- Card structures.
- Navigation appearance.
- Table appearance.
- Form appearance.
- Modal appearance.
- Dashboard layout.
- Information hierarchy.
- Spacing and alignment.
- Typography.
- Icon usage.
- Empty states.
- Visual feedback.

However, preserve what each existing feature does.

Before removing or hiding any existing UI element, verify whether it provides functionality.

Never remove a functional element merely for visual simplicity.

If the same functionality needs a better visual placement, move or redesign it instead of deleting it.

---

# 7. Establish and Follow a Consistent Design System

Before redesigning multiple pages, inspect the existing application and establish a consistent UI direction.

Maintain consistency in:

- Colors.
- Typography.
- Font sizes.
- Spacing.
- Border radius.
- Shadows.
- Buttons.
- Form controls.
- Cards.
- Tables.
- Modals.
- Dropdowns.
- Icons.
- Empty states.
- Loading states.
- Hover states.
- Transitions.

Do not make every page look like it belongs to a different application.

Reuse shared styles and existing reusable components where appropriate.

---

# 8. Improve Information Hierarchy

The interface should clearly communicate:

- What page the user is currently viewing.
- The most important information.
- Primary actions.
- Secondary actions.
- Status and progress.
- Related information.

Avoid:

- Excessive cards.
- Unnecessary visual clutter.
- Too many competing colors.
- Large blocks of text.
- Repeated information.
- Poor spacing.
- Misaligned elements.

The UI should feel clean, modern, professional, and appropriate for a project management system.

---

# 9. Responsive Design Is Required

Every redesigned page must work properly across:

- Desktop.
- Tablet.
- Mobile.

Do not create a design that only works on a large desktop screen.

Check the layout structure in the code for:

- Overflow.
- Overlapping elements.
- Unusable navigation.
- Broken tables.
- Inaccessible buttons.
- Poor spacing.
- Unreadable content.
- Fixed-width elements causing layout issues.

Preserve usability at smaller screen sizes.

Use responsive layouts rather than simply shrinking the desktop interface.

---

# 10. Tables and Data-Heavy Sections

For tables and data-heavy interfaces:

- Preserve all existing information and actions.
- Improve readability.
- Clearly distinguish important data.
- Keep action controls accessible.
- Handle smaller screens appropriately.

Do not remove columns or actions that are required for existing functionality unless an alternative accessible UI is provided.

---

# 11. Forms and User Actions

Improve the visual design of:

- Inputs.
- Select fields.
- Buttons.
- Validation messages.
- Error states.
- Success states.
- Disabled states.

Maintain existing:

- Form controls.
- Validation rules.
- Submission logic.
- API behavior.

The user should clearly understand:

- What information is required.
- What action they are performing.
- Whether the action succeeded or failed.

---

# 12. Icons and Actions

Use appropriate icons where they improve clarity.

Examples include:

- Edit.
- Delete.
- Add.
- Search.
- Filter.
- Notifications.
- Settings.
- Navigation.

Do not replace text with an icon when the icon would be unclear.

Use consistent icon style, sizing, and placement across the application.

Ensure important actions remain understandable.

---

# 13. Interactions and Visual Feedback

Interactive elements should have appropriate visual feedback.

Where appropriate, provide:

- Hover states.
- Focus states.
- Active states.
- Disabled states.
- Loading states.
- Success feedback.
- Error feedback.
- Smooth transitions.

Keep animations subtle and purposeful.

Do not add unnecessary animations that slow down or distract from the application.

---

# 14. Reuse Existing Components

Before creating a new:

- Button style.
- Card.
- Modal.
- Dropdown.
- Alert.
- Empty state.
- Loading state.
- Table pattern.

Check whether an existing reusable implementation can be reused or improved.

Avoid duplicate UI implementations for the same purpose.

If a shared component needs a visual improvement, ensure that the change does not negatively affect existing functionality elsewhere.

---

# 15. Do Not Make Unrelated Changes

While redesigning a specific page:

- Do not redesign unrelated pages.
- Do not refactor unrelated components.
- Do not change application-wide logic unnecessarily.
- Do not fix random bugs unless they directly prevent the requested UI redesign.

Keep the work focused on the assigned page or UI area.

---

# 16. Handling Unclear Design Decisions

If a design decision is unclear:

1. Inspect the existing page and functionality.
2. Inspect related pages.
3. Follow the established design system.
4. Choose the most appropriate layout based on the page's purpose.

Do not ask unnecessary questions for small visual decisions.

However, do not assume or change functional behavior.

If a UI change would require changing the intended functionality:

> Stop and ask for clarification.

---

# 17. Do Not Manually Test Through the Browser

Do not repeatedly open the browser and manually test the application.

Do not enter a browser-testing loop.

Verify the redesign through:

- Code inspection.
- Template bindings.
- Component structure.
- Existing event handlers.
- Existing TypeScript logic.
- Existing routing.
- Existing data flow.

The user will manually check the redesigned UI and interactions.

Do not claim that the UI was manually tested in the browser unless explicitly instructed.

---

# 18. Recheck Before Completing a Page

After redesigning a page:

1. Review the modified frontend files.
2. Ensure no backend files were modified.
3. Check that existing bindings still exist.
4. Check that existing event handlers are still connected.
5. Check that forms still use their existing logic.
6. Check that API-related code was not changed unnecessarily.
7. Check that routing and navigation remain intact.
8. Check that role-based UI conditions remain intact.
9. Check the responsive structure in the code.
10. Ensure the redesigned page follows the application's design system.

---

# Final Principle

For every page:

> Understand the existing functionality → preserve it → redesign only the presentation and user experience → keep interactions intact → maintain consistency → protect the working application.

The priority order is:

1. Existing functionality must remain intact.
2. Backend must never be touched.
3. UI and UX should be significantly improved.
4. The design must remain consistent across the application.
5. The layout must be responsive.
6. Changes must remain focused on the assigned page.

The final goal is:

> Transform AgileFlow into a polished, modern, responsive, and professional project management application without changing what the existing application does.