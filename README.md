# Yakoo NextJS Starter Template

By [Yakoo Technology Limited](https://www.yakoo.com.hk)

This is a integrated nextjs-app template. Below are the list of frameworks/library used in this template.

| Category            | Library           | URL                                                 |
| ------------------- | ----------------- | --------------------------------------------------- |
| -                   | NextJS app-router | [https://nextjs.org/docs]()                         |
| Auth                | Next-Auth         | [https://next-auth.js.org]()                        |
| UI                  | shadcn/ui         | [https://ui.shadcn.com]()                           |
| UI                  | Tailwindcss       | [https://tailwindcss.com]()                         |
| Icons               | Lucide Icons      | [https://lucide.dev/icons/]()                       |
| Headless Components | Radix-UI          | [https://radix-ui.com]()                            |
| Form                | React Hook Foorm  | [https://react-hook-form.com]()                     |
| Validation          | Zod               | [https://zod.dev]()                                 |
| Email               | Node Mailer       | [https://nodemailer.com]()                          |
| Email               | React-Email       | [https://react.email]()                             |
| SEO                 | Next-Sitemap      | [https://github.com/iamvishnusankar/next-sitemap]() |
| Client State        | Jotai             | [https://jotai.org]()                               |
| Client State        | Tanstack Query    | [https://tanstack.com/query]()                      |
| Database            | Prisma            | [https://prisma.io]()                               |
| Captcha             | hCaptcha          | [https://hcaptcha.com]()                            |

## Database (Prisma + MySQL)

This template uses MySQL as the database and assume you are rapid prototyping and use db push for schema changes. To setup the database, first copy `.env.sample` to `.env` and fill in the required values, then run the following command.

```bash
# push schema changes
npx prisma db push
# insert seed data
node prisma/seed.js
```

When your schema reaches stable, you may switch to prisma migrate. You may refer to [Prisma's guide](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/add-prisma-migrate-to-a-project) on how to create the initial migration script.

## Auth (Next-Auth)

### Setup

This template uses Next-Auth for authentication. You should setup a new `NEXTAUTH_SECRET` for your project. To generate a new secret, run the following command.

```bash
openssl rand -base64 32
```

### Frontend / Admin Users

This template uses a simple Username / Password authentication. Password is stored as a hash with [script](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback) with a random salt.

There are two type of users: `frontend` and `admin` users. To restrict access to certain pages, you may use the `requireFrontendUser` and `requireAdminUser` helper functions in server components. For API routes, you may use `withAuthentication`.

For more information, read `src/lib/auth.ts`.

## Email (Node Mailer + React Email)

This template uses Node Mailer with SMTPTransport to send emails. You may get a mailer from `getDefaultMailer` functions in `src/lib/mailer.ts`.

To setup the email layout and content, we use React Email. You may find the email templates in `src/emails`.

## Other environment variables

You may find the full list of environment variables in `src/env.ts`.

## License

Licensed under the **MIT license**.
