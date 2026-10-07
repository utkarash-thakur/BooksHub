# BookHubX · Frontend

<img src="BookStoreApp/src/assets/logo.png" alt="BookHubX logo" width="120" />

Angular app for **BookHubX**, a bookstore and reader community: readers discover, rate and discuss books and build reading lists; authors publish and manage their own titles.

**Backend (Spring Boot):** [utkarash-thakur/BooksBackend](https://github.com/utkarash-thakur/BooksBackend) · **Portfolio:** [utkarash-thakur.vercel.app](https://utkarash-thakur.vercel.app)

## Features

**Readers**
- Browse books and open a details page for each title.
- Rate and review books.
- Keep a personal reading list.
- Start and join community discussions.

**Authors**
- Register as an author and publish books through the add-book form.
- Update or remove their own titles.

**Admins**
- Remove discussions, users or authors.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Angular 16, TypeScript |
| Styling | Tailwind CSS |
| API | REST calls to the [Spring Boot backend](https://github.com/utkarash-thakur/BooksBackend), authenticated with JWT |

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: all books |
| `/book-details/:id` | Book details and reviews |
| `/readinglist` | My reading list |
| `/discussions` | Community discussions |
| `/addbook` | Add a book (authors) |
| `/login`, `/registration` | Sign in and sign up |

## Project structure

```
BookStoreApp/src/app
├── components/   home, details, readinglist, discussions, add-book-form, login, registration, navbar
├── services/     reading-list service (API calls)
└── app-routing.module.ts
```

## Run it locally

1. Start the [backend](https://github.com/utkarash-thakur/BooksBackend) first. It runs on `http://localhost:8080`.
2. Then start the frontend:
   ```bash
   cd BookStoreApp
   npm install
   npx ng serve
   ```
3. Open `http://localhost:4200`.

## Author

**Utkarash Thakur**, Backend Engineer · [Portfolio](https://utkarash-thakur.vercel.app) · [LinkedIn](https://www.linkedin.com/in/utkarash-thakur/)
