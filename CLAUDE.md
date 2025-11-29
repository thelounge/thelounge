# The Lounge - Claude Code Guidelines

## WAŻNE: Używamy YARN, nie npm!

```bash
yarn test    # JEDYNA komenda do weryfikacji - uruchamia build, lint i testy
```

**NIGDY nie używaj npm** - projekt używa yarn workspaces.

## KRYTYCZNE ZASADY NAPRAW KODU

### NO WORKAROUNDS - Prawdziwe naprawy, nie obejścia!

**ZAKAZANE praktyki:**
- `// @ts-ignore` lub `// @ts-expect-error`
- `// eslint-disable-next-line`
- `as any` lub `as unknown as X`
- Komentarze typu `// TODO: fix later`
- Ukrywanie błędów zamiast ich naprawy

**WYMAGANE podejście:**
1. **Naprawiaj przyczynę, nie objaw** - jeśli typ jest zły, popraw definicję typu
2. **Rozumiej błąd** - przed naprawą zrozum DLACZEGO występuje błąd
3. **Testuj zmiany** - po każdej naprawie uruchom `yarn build:server` i `yarn test`
4. **Commituj atomowo** - każdy commit = jedna logiczna zmiana

### Weryfikacja przed commitem

```bash
yarn test    # Uruchamia WSZYSTKO: build + lint + testy
```

### Typowe naprawy (poprawne vs niepoprawne)

| Problem | ZŁE (workaround) | DOBRE (naprawa) |
|---------|------------------|-----------------|
| `any` type | `// eslint-disable` | Zdefiniuj proper interface |
| Duplicate imports | Zostaw jak jest | Scal w jeden import |
| Use before define | `// eslint-disable` | Przenieś definicję wyżej |
| Type mismatch | `as any` | Popraw typ lub definicję |

## Struktura projektu

- `server/` - Backend Node.js
- `client/` - Frontend Vue.js
- `shared/` - Współdzielone typy i utilities
- `test/` - Testy

## Komendy developerskie

```bash
yarn build          # Buduj wszystko
yarn build:server   # Buduj tylko serwer
yarn test           # Uruchom testy
yarn lint:eslint    # Sprawdź ESLint
yarn dev            # Development mode
```
