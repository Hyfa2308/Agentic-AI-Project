<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Frontend architecture

- Preserve TanStack Start and its file-based routing for the React/Vite frontend, because it is the existing supported application bootstrap.
- Keep external FastAPI access and the explicitly labeled in-memory demo adapter behind `src/services/api.ts`, because UI components must not contain network or simulated-response logic.
- Keep support contracts in `src/types`, shared domain UI in `src/components/assistiQ`, and leaf pages in `src/routes`, because all five screens share the same data and design language.
- Compose chat with AI Elements conversation/message/prompt primitives, because accessibility and chat-state rendering should remain reusable.
