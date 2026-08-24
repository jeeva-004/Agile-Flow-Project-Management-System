# AgileFlow Responsive Design Rules

## 1. Purpose

The UI redesign of AgileFlow is completed.

The existing functionality and the redesigned desktop UI must be treated as stable.

This phase is focused only on making the application responsive and usable across different screen sizes.

The goal is:

> Adapt the existing redesigned UI for desktop, tablet, and mobile without changing functionality, backend code, business logic, or the established visual design.

---

## 2. Strict Scope

Only modify frontend code required for responsive behavior.

Primary modification areas:

- CSS/SCSS.
- HTML/template structure when necessary for responsive layout.
- Existing responsive utility classes or styles.
- TypeScript only when absolutely necessary for UI interaction on smaller screens.

Do not:

- Modify backend files.
- Modify APIs.
- Change API calls.
- Change request or response handling.
- Change business logic.
- Change authentication or authorization behavior.
- Change role-based functionality.
- Remove existing functionality.
- Redesign the desktop UI again.
- Perform unnecessary refactoring.

---

## 3. Preserve the Existing Desktop Design

The desktop UI has already been redesigned.

Do not unnecessarily change the desktop layout or visual design while fixing tablet or mobile responsiveness.

Responsive changes should adapt the existing design rather than replace it.

The goal is:

> One consistent design that adjusts appropriately to different screen sizes.

---

## 4. Inspect Before Changing

Before modifying a page or component:

1. Inspect its current HTML/template structure.
2. Inspect its existing styles.
3. Identify fixed widths or heights.
4. Identify layout containers.
5. Identify tables or data-heavy sections.
6. Identify sidebars and navigation.
7. Identify modals, dropdowns, and overlays.
8. Identify buttons and action groups.
9. Identify areas that may overflow, overlap, or become unusable.

Make responsive changes only after understanding the existing layout.

---

## 5. Responsive Priorities

For every page, prioritize the following:

### Layout

Ensure:

- Content does not overflow horizontally unnecessarily.
- Elements do not overlap.
- Sections have appropriate spacing.
- Content remains readable.
- Fixed-width layouts adapt when needed.
- Cards stack or resize appropriately.
- Grid layouts adapt based on available space.

### Navigation

Ensure:

- Navigation remains usable on tablet and mobile.
- Sidebar behavior adapts appropriately.
- Navigation controls remain accessible.
- Active navigation state remains unchanged.
- Existing routing behavior is preserved.

### Forms

Ensure:

- Inputs remain usable.
- Labels remain readable.
- Buttons remain accessible.
- Form rows stack when necessary.
- Important actions are not pushed off-screen.

### Tables and Data

Do not simply allow important data to become unusable on small screens.

Choose the most appropriate existing-structure-compatible solution, such as:

- Horizontal scrolling when appropriate.
- Responsive table layout when feasible.
- Stacking information while preserving all required actions.

Do not remove functional information or actions.

### Modals and Popups

Ensure:

- They fit within smaller screens.
- Their content remains accessible.
- They do not overflow the viewport.
- Important buttons remain reachable.
- Existing open/close functionality remains unchanged.

---

## 6. Use Meaningful Breakpoints

Do not add random media queries for individual devices.

Use a consistent responsive strategy based on layout behavior.

Think in practical ranges such as:

- Large desktop.
- Standard desktop/laptop.
- Tablet.
- Mobile.

Use breakpoints when the layout actually needs to change.

Avoid excessive or conflicting media queries.

Keep responsive styles organized and maintainable.

---

## 7. Mobile Is an Adaptation, Not a Shrunk Desktop

Do not simply reduce font sizes and scale down the desktop layout.

For smaller screens, adapt the layout where necessary.

For example:

- Multi-column layouts may become single-column.
- Large action groups may wrap or stack.
- Side navigation may collapse.
- Secondary information may move below primary information.
- Tables may require horizontal scrolling or an alternative responsive presentation.

Maintain the same functionality and information while improving usability.

---

## 8. Touch-Friendly Interaction

For tablet and mobile:

- Buttons should remain easy to tap.
- Icons used as actions should have sufficient clickable area.
- Important controls should not be too close together.
- Dropdowns and popups should remain accessible.
- Hover-only interactions must not be required to access important functionality.

Do not remove existing interactions; adapt them where necessary.

---

## 9. Shared Components Must Remain Consistent

Before adding page-specific responsive styles, check whether the issue belongs to a shared component.

Examples:

- Sidebar.
- Header.
- Buttons.
- Forms.
- Modals.
- Tables.
- Dropdowns.
- Cards.

If the same responsive problem exists across multiple pages, prefer fixing it in the appropriate shared component or common style.

Do not duplicate the same responsive fix unnecessarily across many pages.

---

## 10. Avoid Breaking Existing UI and Functionality

While making responsive changes, preserve:

- Existing bindings.
- Event handlers.
- Forms.
- Validation.
- API calls.
- Routing.
- Role-based conditions.
- Existing UI interactions.

Do not change functionality to solve a layout problem.

Solve layout problems through responsive design whenever possible.

---

## 11. Responsive Verification Through Code

Do not repeatedly open the browser and manually test the application.

Do not enter an endless browser-testing loop.

Verify responsiveness through:

- Inspecting layout structure.
- Reviewing CSS/SCSS.
- Checking flex and grid behavior.
- Checking width and height constraints.
- Checking overflow handling.
- Checking media queries.
- Checking responsive visibility rules.
- Checking modal and navigation structure.

The user will manually test the final responsive behavior.

Do not claim that responsiveness was manually verified in the browser unless explicitly instructed.

---

## 12. Work in Controlled Scope

Work on the assigned responsive area only.

For example:

- Application shell.
- Dashboard.
- Projects.
- Project details.
- Issues.
- Users.
- Authentication.
- Shared components.

Do not start changing unrelated pages.

If a shared component must be modified because it directly affects the assigned page, make only the necessary shared change.

---

## 13. Recheck Before Completing

Before completing a responsive task:

1. Review all modified files.
2. Ensure no backend files were modified.
3. Ensure desktop design was not unnecessarily changed.
4. Check that no horizontal overflow is introduced unnecessarily.
5. Check layout stacking and wrapping behavior.
6. Check navigation accessibility.
7. Check forms and action controls.
8. Check tables or data-heavy areas.
9. Check modals and popups.
10. Ensure existing functionality and bindings remain intact.

---

# Final Principle

For every responsive task:

> Preserve the existing design → inspect the layout → identify responsive risks → adapt the layout for smaller screens → preserve functionality → avoid unnecessary changes.

The priority order is:

1. Existing functionality must remain unchanged.
2. Backend must never be modified.
3. The completed desktop UI must be preserved.
4. Tablet layouts must remain usable.
5. Mobile layouts must remain fully usable.
6. Responsive fixes should be consistent and reusable.

The final goal is:

> Make AgileFlow feel like one polished application that works naturally across desktop, tablet, and mobile without sacrificing functionality or changing the completed UI design.