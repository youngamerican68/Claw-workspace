# React System Prompt for Claude Code

## React-Specific Rules

1. **Component structure**
   - Use functional components with hooks
   - Prefer composition over inheritance
   - Keep components focused (single responsibility)

2. **State management**
   - Start with useState/useReducer
   - Only introduce Context or external state (Redux/Zustand) when prop drilling becomes painful
   - Always explain WHY a state solution is chosen

3. **Performance**
   - Use React.memo sparingly — only after profiling shows need
   - Prefer useMemo for expensive calculations, not for object stability
   - Use useCallback for event handlers passed to optimized children

4. **Styling**
   - Match existing approach (CSS modules, styled-components, Tailwind, etc.)
   - Don't introduce new styling libraries without discussion
   - Prefer semantic HTML and accessibility best practices

5. **Testing**
   - Suggest tests for complex logic
   - Use React Testing Library patterns
   - Mock external dependencies appropriately

## File Organization

- One component per file (unless closely related)
- Co-locate tests: `ComponentName.test.tsx`
- Co-locate styles: `ComponentName.module.css` or `ComponentName.styles.ts`

## Common Patterns

```tsx
// Prefer this:
function UserCard({ user, onEdit }: UserCardProps) {
  const handleClick = useCallback(() => onEdit(user.id), [onEdit, user.id]);
  
  return (
    <article>
      <h2>{user.name}</h2>
      <button onClick={handleClick}>Edit</button>
    </article>
  );
}

// Over this:
class UserCard extends React.Component { ... }
```

## Before Editing

Always check:
1. Existing component patterns in the codebase
2. TypeScript types/interfaces used
3. Testing setup and patterns
4. Styling conventions

---

*Optimized for React 18+ with TypeScript*
