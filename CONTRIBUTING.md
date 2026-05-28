# Contributing to BugReaper X

First off, thank you for considering contributing to BugReaper X! We welcome contributions from the security research community. This guide outlines the process for contributing to the project.

## 📋 Code of Conduct

By participating in this project, you agree to uphold our standards of respectful, constructive collaboration. We do not tolerate harassment, discrimination, or unethical behavior.

## 🐛 Reporting Bugs

1. **Check existing issues** — Search the [issue tracker](https://github.com/vanthryx00/bugreaperx/issues) first
2. **Use the bug report template** — Include:
   - BugReaper X version
   - Windows version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or logs if applicable
3. **Security vulnerabilities** — Report to `security@bugreaper-x.ca` (see `SECURITY.md`)

## 💡 Feature Requests

Open a [feature request](https://github.com/vanthryx00/bugreaperx/issues/new) with:

- A clear description of the problem you're solving
- Proposed solution or approach
- Any alternatives you've considered
- Why this would benefit the community

## 🔧 Development Setup

```bash
# Clone the repository
git clone https://github.com/vanthryx00/bugreaperx.git
cd bugreaperx

# Install dependencies
npm install

# Start development server
npm run dev

# For the website
cd website
npm install
npm run dev
```

### Project Structure

```
bugreaperx/
├── src/               # React renderer (Electron app)
├── website/           # Marketing website (React + Vite)
│   ├── src/components/   # UI components
│   ├── src/lib/          # Game engine, protection systems
│   ├── src/shaders/      # Custom GLSL shaders
│   └── public/           # Static assets
├── electron/          # Electron main process
├── dist/              # Build output
└── docs/              # Documentation
```

## 🧪 Testing

```bash
# Run tests
npm test

# TypeScript check
npx tsc --noEmit

# Build check
npm run build
```

All tests must pass and TypeScript must compile with zero errors before submitting a PR.

## 📝 Pull Request Process

1. **Fork the repository** and create your feature branch
2. **Write clear commit messages** following conventional commits (`feat:`, `fix:`, `docs:`, etc.)
3. **Add or update tests** as needed
4. **Ensure zero TypeScript errors** — run `npx tsc --noEmit`
5. **Build successfully** — run `npm run build`
6. **Open a pull request** with a clear title and description

### PR Title Format

```
<type>: <short description>
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`

### PR Description Template

```markdown
## What does this PR do?

Brief description of changes.

## Related Issues

Closes #<issue-number>

## Testing

- [ ] Tests pass
- [ ] TypeScript compiles with zero errors
- [ ] Build succeeds
- [ ] Manual testing on Windows

## Screenshots (if applicable)

```

## 🎮 Game Development

The Vulnerability Hunter RPG in `website/src/lib/game/` has its own guidelines:

- **State management**: Use the Zustand store (`store.ts`) — no prop drilling
- **3D entities**: Use `@react-three/fiber` + custom GLSL shaders in `src/shaders/`
- **Combat**: Turn-based system in `combat.ts` — keep calculations deterministic
- **Assets**: All procedural geometry — no external model files

## 🛡️ Protection System

The anti-clone and honeypot systems in `src/lib/` are critical for production:

- **Do NOT** modify `anticlone.ts` or `honeypot.ts` without testing the full build
- **Do NOT** disable the guardian inline script in `index.html`
- **Do NOT** remove the obfuscation config in `vite.config.ts`

## 📄 Licensing

BugReaper X is proprietary software. By contributing, you agree that your contributions will be licensed under the project's [proprietary license](LICENSE).

---

*Questions? Reach out on [Discord](https://discord.gg/bugreaperx) or open a discussion.*
