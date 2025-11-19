# FAZA 11: ESLint Fixes - NO WORKAROUNDS

**Zasada nadrzędna**: NAPRAWIAMY PRZYCZYNĘ, NIE OBJAWY

## Status wyjściowy

**Łącznie**: 1802 problemy (1572 błędy, 230 ostrzeżenia)
**Auto-fixable**: 800 błędów

## Analiza nexus vs thelounge

**thelounge**:
- 97 wystąpień `: any`
- 27 dyrektyw `eslint-disable`

**nexus**:
- 171 wystąpień `: any`
- 18 dyrektyw `eslint-disable`

**Wniosek**: nexus ma MNIEJ eslint-disable mimo WIĘCEJ użyć `any` - czystszy kod wymagający mniej obejść.

## Podział błędów

### 1. Krytyczny - Błąd parsera (MUST FIX FIRST)
- **Plik**: `index.js:7`
- **Problem**: `ecmaVersion: 2022` nie wspiera Import Attributes (`with {type: "json"}`)
- **Fix**: Zaktualizować `eslint.config.js:119` na `ecmaVersion: 2024`

### 2. Auto-fixable Style Rules (~1520 błędów)
- `spaced-comment` - Brak spacji po `/**`
- `padding-line-between-statements` - Brak pustych linii
- `no-var` - Użycie `var` zamiast `let`/`const`

### 3. TypeScript Strict Mode (41 błędów - manualne poprawki)
- 9× `@typescript-eslint/no-unsafe-return`
- 7× `@typescript-eslint/prefer-promise-reject-errors`
- 7× `@typescript-eslint/no-unused-expressions`
- 4× `@typescript-eslint/no-require-imports`
- 3× `@typescript-eslint/restrict-template-expressions`
- 3× `@typescript-eslint/require-await`
- 3× `@typescript-eslint/no-unused-vars`
- 3× `@typescript-eslint/no-floating-promises`
- 1× `@typescript-eslint/only-throw-error`
- 1× `@typescript-eslint/no-shadow`

### 4. TypeScript Any Warnings (230 ostrzeżeń)
- 230× `@typescript-eslint/no-explicit-any`

## Plan wykonania

### Faza 1: Fix Parser Configuration ⚠️ CRITICAL

**Branch**: `fix/eslint-parser-ecmaversion`

```bash
# 1. Utwórz branch
git checkout -b fix/eslint-parser-ecmaversion

# 2. Edytuj eslint.config.js
```

**Zmiana w `eslint.config.js:119`**:
```javascript
// BEFORE
ecmaVersion: 2022,

// AFTER
ecmaVersion: 2024,
```

```bash
# 3. Weryfikacja
yarn lint:eslint index.js  # Nie powinno być błędu parsera
yarn test                   # Wszystkie testy przechodzą
yarn build:server          # Build działa

# 4. Commit
git add eslint.config.js
git commit -m "fix: update ESLint ecmaVersion to 2024 for Import Attributes support

Fixes parsing error in index.js:7 caused by `with {type: "json"}` syntax
which requires ES2024 support. Previous ecmaVersion: 2022 was too old.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Merge
git checkout master
git merge fix/eslint-parser-ecmaversion
```

### Faza 2: Auto-Fix Style Rules

**Branch**: `fix/eslint-style-autofix`

```bash
# 1. Utwórz branch
git checkout -b fix/eslint-style-autofix

# 2. Uruchom auto-fix
yarn lint:eslint --fix

# 3. Weryfikacja
yarn lint:eslint              # Sprawdź ile błędów zostało
yarn test                     # Wszystkie testy przechodzą
yarn build:server            # Build działa

# 4. Review zmian
git diff                      # Przejrzyj wszystkie zmiany

# 5. Commit
git add .
git commit -m "fix: apply ESLint auto-fixes for style rules

Auto-fixed ~800 errors:
- spaced-comment: Added spaces after /** in comments
- padding-line-between-statements: Added blank lines
- no-var: Converted var to let/const

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 6. Merge
git checkout master
git merge fix/eslint-style-autofix
```

### Faza 3: Manual TypeScript Fixes (NO WORKAROUNDS)

**Strategia**: Plik po pliku, kategoria po kategorii

#### 3.1: @typescript-eslint/no-floating-promises (3 błędy)

**Lokalizacje**:
- `server/command-line/start.ts:18`
- `server/models/chan.ts:470`
- `server/plugins/irc-events/link.ts:78`

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
// eslint-disable-next-line @typescript-eslint/no-floating-promises
someAsyncFunction();
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Await
await someAsyncFunction();

// ✅ Opcja 2: Catch
someAsyncFunction().catch((err) => {
    log.error("Error:", err);
});

// ✅ Opcja 3: Then with rejection handler
someAsyncFunction().then(
    () => { /* success */ },
    (err) => { log.error(err); }
);

// ✅ Opcja 4: Explicit void (fire-and-forget)
void someAsyncFunction();
```

**Branch**: `fix/eslint-no-floating-promises`

#### 3.2: @typescript-eslint/require-await (3 błędy)

**Lokalizacje**:
- `server/command-line/install.ts:30`
- `server/command-line/start.ts:21`

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
// eslint-disable-next-line @typescript-eslint/require-await
async function foo() {
    return 42;
}
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Usuń async jeśli nie await
function foo() {
    return 42;
}

// ✅ Opcja 2: Dodaj await jeśli powinno być
async function foo() {
    const result = await someOperation();
    return result;
}
```

**Branch**: `fix/eslint-require-await`

#### 3.3: @typescript-eslint/no-unsafe-return (9 błędów)

**Lokalizacje** (sprawdź dokładne przez `yarn lint:eslint | grep no-unsafe-return`):
- `server/command-line/utils.ts`
- `server/plugins/inputs/list.ts`
- inne...

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
function foo(): any {
    return someValue;
}

// ❌ NIE ROB TEGO
function foo() {
    return someValue as any;
}
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Dodaj właściwy typ zwracany
function foo(): string {
    return someValue;
}

// ✅ Opcja 2: Użyj generics
function foo<T>(value: T): T {
    return value;
}

// ✅ Opcja 3: Użyj union type
function foo(): string | number {
    return someValue;
}
```

**Branch**: `fix/eslint-no-unsafe-return`

#### 3.4: @typescript-eslint/prefer-promise-reject-errors (7 błędów)

**Lokalizacje**:
- `server/models/chan.ts:484`
- inne...

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
return Promise.reject("error message");
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Użyj Error object
return Promise.reject(new Error("error message"));

// ✅ Opcja 2: Użyj custom error class
return Promise.reject(new CustomError("error message"));

// ✅ Opcja 3: Throw Error w async
async function foo() {
    throw new Error("error message");
}
```

**Branch**: `fix/eslint-prefer-promise-reject-errors`

#### 3.5: @typescript-eslint/no-require-imports (4 błędy)

**Lokalizacje**:
- `server/command-line/users/edit.ts:20`
- `server/command-line/users/remove.ts:19`
- `server/plugins/irc-events/list.ts:18`
- inne...

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
// eslint-disable-next-line @typescript-eslint/no-require-imports
const foo = require("foo");
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: ESM import
import foo from "foo";

// ✅ Opcja 2: Named import
import {bar} from "foo";

// ✅ Opcja 3: Dynamic import (jeśli conditional)
const foo = await import("foo");
```

**Branch**: `fix/eslint-no-require-imports`

#### 3.6: @typescript-eslint/restrict-template-expressions (3 błędy)

**Lokalizacje**:
- `server/client.ts:259`
- `server/client.ts:292`

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
const msg = `Error: ${unknownValue}`;  // eslint-disable-line
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: String conversion
const msg = `Error: ${String(unknownValue)}`;

// ✅ Opcja 2: Type guard
if (typeof value === "string") {
    const msg = `Error: ${value}`;
}

// ✅ Opcja 3: Optional chaining + nullish
const msg = `Error: ${value?.toString() ?? "unknown"}`;
```

**Branch**: `fix/eslint-restrict-template-expressions`

#### 3.7: @typescript-eslint/no-unused-vars (3 błędy)

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
const _unused = foo;  // Rename to suppress

// ❌ NIE ROB TEGO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unused = foo;
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Usuń nieużywaną zmienną
// Po prostu usuń całą linię

// ✅ Opcja 2: Użyj zmiennej jeśli jest potrzebna
const result = foo;
return result;

// ✅ Opcja 3: Destructure z ignore (tylko jeśli naprawdę potrzebne)
const {needed, ...rest} = obj;  // rest może być unused jeśli chcemy exclude
```

**Branch**: `fix/eslint-no-unused-vars`

#### 3.8: @typescript-eslint/no-unused-expressions (7 błędów)

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Przypisz do zmiennej
const result = expression;

// ✅ Opcja 2: Usuń jeśli niepotrzebne
// Po prostu usuń wyrażenie

// ✅ Opcja 3: Zamień na statement
if (condition) {
    doSomething();
}
```

**Branch**: `fix/eslint-no-unused-expressions`

### Faza 4: TypeScript Any Warnings (230 ostrzeżeń)

**Strategia**: Kategoria po kategorii, patrząc jak nexus to rozwiązuje

#### 4.1: Analiza nexus patterns

Przed rozpoczęciem poprawek, sprawdź jak nexus rozwiązuje podobne przypadki:

```bash
# Znajdź przykłady z nexus gdzie używają proper types zamiast any
cd /Users/k/dev/nexus
grep -n "interface.*{" server/**/*.ts | head -20
grep -n "type.*=" server/**/*.ts | head -20
```

#### 4.2: Kategorie `any` do naprawy

1. **Test files** - Mogą mieć `any` w mockach (dopuszczalne)
2. **Config merging** - Użyj generics lub proper types
3. **IRC event handlers** - Zdefiniuj typy dla event payloads
4. **Plugin interfaces** - Zdefiniuj proper interfaces

**ZAKAZANE workarounds**:
```typescript
// ❌ NIE ROB TEGO
function foo(arg: any) { }  // eslint-disable-line

// ❌ NIE ROB TEGO
const obj: any = {};
```

**PRAWIDŁOWE rozwiązania**:
```typescript
// ✅ Opcja 1: Zdefiniuj interface
interface EventPayload {
    type: string;
    data: unknown;
}
function handleEvent(payload: EventPayload) { }

// ✅ Opcja 2: Użyj generics
function process<T>(data: T): T { }

// ✅ Opcja 3: Użyj union types
function handle(value: string | number | object) { }

// ✅ Opcja 4: Użyj unknown + type guards
function process(data: unknown) {
    if (typeof data === "string") {
        // data is string here
    }
}
```

**Branch per kategoria**:
- `fix/eslint-any-test-files`
- `fix/eslint-any-config`
- `fix/eslint-any-irc-events`
- `fix/eslint-any-plugins`

## Proces dla każdego brancha

```bash
# 1. Utwórz branch
git checkout -b fix/eslint-XXX

# 2. Napraw błędy (NO WORKAROUNDS!)
# Edit files...

# 3. ZAWSZE weryfikuj
yarn lint:eslint                    # Sprawdź czy błąd zniknął
yarn test                           # WSZYSTKIE testy MUSZĄ przechodzić
yarn build:server                   # Build MUSI działać

# 4. Commit tylko gdy wszystko działa
git add .
git commit -m "fix: resolve @typescript-eslint/XXX errors

<opis co i jak zostało naprawione>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Merge
git checkout master
git merge fix/eslint-XXX
```

## Kiedy eslint-disable JEST dopuszczalne

**TYLKO W <1% PRZYPADKÓW**:

1. **Type definition files** (`.d.ts`) z zewnętrznymi bibliotekami:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "external-lib" {
    export function foo(arg: any): any;  // External lib doesn't have types
}
```

2. **Udowodnione false positives** (z komentarzem WHY):
```typescript
// ESLint bug #12345 - false positive for valid pattern
// eslint-disable-next-line @typescript-eslint/XXX
const valid = pattern;
```

3. **Kompatybilność z external API** (z dokumentacją):
```typescript
// Required by express middleware signature - must match (req, res, next)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(async (req, res, next) => { });
```

**W KAŻDYM PRZYPADKU**:
- Dodaj komentarz WYJAŚNIAJĄCY czemu
- Dodaj link do issue/docs jeśli możliwe
- Rozważ czy to naprawdę edge case czy może da się lepiej

## Metryki sukcesu

**Przed FAZA 11**: 1802 problemy (1572 błędy, 230 ostrzeżenia)

**Po FAZA 11 (target)**:
- 0 błędów parsera
- 0 auto-fixable errors
- 0 TypeScript strict mode errors
- <10 `@typescript-eslint/no-explicit-any` warnings (tylko w `.d.ts` lub uzasadnionych przypadkach)
- <5 `eslint-disable` directives (wszystkie z komentarzami WHY)

## Checklisty

### Przed każdym commitem
- [ ] `yarn lint:eslint` - błąd zniknął
- [ ] `yarn test` - wszystkie testy przechodzą (239/239)
- [ ] `yarn build:server` - build działa
- [ ] NIE ma nowych `eslint-disable` (chyba że <1% case z komentarzem)
- [ ] Przejrzałem diff - wszystko ma sens

### Przed mergeowaniem brancha
- [ ] Wszystkie zmiany zostały zreviewowane
- [ ] Master jest up-to-date
- [ ] Commit message jest opisowy
- [ ] Ma Co-Authored-By: Claude

## Referencje

- **nexus patterns**: `/Users/k/dev/nexus`
- **ESLint config**: `/Users/k/dev/thelounge/eslint.config.js`
- **TypeScript config**: `/Users/k/dev/thelounge/tsconfig.json`

---

**PAMIĘTAJ**: ZERO TOLERANCJI dla hacków, workarounds i obejść. Każdy problem ma przyczynę - znajdź ją i napraw.
