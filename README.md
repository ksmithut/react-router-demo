# React Router v7 demo

This is an example [react-router](https://reactrouter.com/) application using
the "framework". It tries to demonstrate most of the patterns you might use like
using loaders to load data, using HTML forms to submit data (instead of JSON
APIs), dynamic routing, authentication, etc.

It is by no means an example of best practices. The authentication stuff is very
naïve and was only put in to demonstrate a way you can protect pages. If you
don't know what you're doing, you shouldn't try and roll your own auth. If you
do know what you're doing, you should also probably not try and roll your own
auth. In any case, don't take any of the auth stuff here and use it in
production.

A lot of the libraries used outside of react-router and vite aren't necessarily
required for react-router to work. Here are some of those extra things:

- [@react-router/fs-routes](https://reactrouter.com/how-to/file-route-conventions) -
  By default with react-router you declare all of your routes in
  `/app/routes.ts`, but I opted for their fs-routes approach, where the file
  system decides the routing. I've had mixed feelings about it, but for a small
  project it's nice to just add a new file and not have to wire it up manually.
- [tailwindcss](https://tailwindcss.com/) - Used for styling. A lot of
  react-router templates have this baked in, but it's possible to not use it.
- [drizzle-orm/drizzle-kit](https://orm.drizzle.team/) - Used for database
  stuff. I picked SQLite for this project so you don't have to stand up another
  service.
- [valibot](https://valibot.dev/) - Used for data validations (mostly for
  sign-up).
- [marked](https://marked.js.org/) - Used to parse markdown into HTML.
- [clsx](https://github.com/lukeed/clsx#readme) - Used for dynamic classes based
  on different data/states.

## Running Locally

1. Set up local environment variables by copying the `.env.example` to `.env`.
   You should probably change the `COOKIE_SECRET`. You can change the
   `DB_FILE_NAME` value to whatever path you'd like.

   ```sh
   cp .env.example .env
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Run the database migrations:

   ```sh
   npm run db:migrate
   ```

4. Start the app:

   ```sh
   npm run dev
   ```

5. Open up the app at localhost:5173
