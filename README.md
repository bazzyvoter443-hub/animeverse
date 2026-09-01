# AnimeVerse — демо

Статический сайт, готовый для GitHub Pages и Cloudflare Pages.

## Файлы
- index.html — каталог
- anime.html — страница аниме
- styles.css — стили
- app.js — AniList API, поиск, жанры, пагинация
- 404.html — страница ошибки
- .nojekyll — отключает Jekyll-обработку GitHub Pages

## GitHub Pages
1. Создайте репозиторий.
2. Загрузите в корень все файлы из этой папки.
3. Settings → Pages.
4. Source: Deploy from a branch.
5. Branch: main, folder: /(root).
6. Save.

## Cloudflare Pages
1. Загрузите проект в GitHub.
2. Cloudflare → Workers & Pages → Create application → Pages → Connect to Git.
3. Выберите репозиторий.
4. Для этого статического сайта build command: exit 0.
5. Build output directory: / (или каталог, содержащий index.html, если интерфейс требует путь).
6. Deploy.

Метаданные: AniList GraphQL API.
Видео и нелицензированный контент проект не хостит.
