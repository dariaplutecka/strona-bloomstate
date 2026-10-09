# Bloomstate — strona www

Statyczna strona (HTML, CSS, JS) z wersją PL/EN.

## Lokalny podgląd

```bash
python3 -m http.server 8900
```

Otwórz: http://localhost:8900/

## Netlify (deploy z GitHub)

1. W [Netlify](https://app.netlify.com): **Add new site** → **Import an existing project** → **GitHub**.
2. Wybierz repozytorium `strona-bloomstate`.
3. Ustawienia build (zwykle wystarczą domyślne z `netlify.toml`):
   - **Build command:** *(puste)*
   - **Publish directory:** `.`
4. **Deploy site**.
5. Własna domena: **Domain management** → **Add domain** → `bloomstate.pl` (DNS u rejestratora według instrukcji Netlify).

Każdy `git push` na gałąź `main` uruchamia nowy deploy.

## Struktura

- `index.html` — szablon
- `css/styles.css` — style
- `js/translations.js` — teksty PL/EN
- `js/main.js` — język, zakładki oferty, formularz
- `assets/images/` — grafiki
