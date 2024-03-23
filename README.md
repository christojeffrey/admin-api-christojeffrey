this project is deployed on cloudflare pages and using kinde as authentication provider

# how to run

in the root directory of this project,

1. run `npm i`
2. install wrangler. run `npx wrangler pages dev .`

# database structure

as redis is unstructured data store, we need to enforce data structure on the application level.

redis works in **key value pair**. we have 3 *keys* in this project.

1. `projects`
2. `photos`
3. `experiences`

they are statent inside `constants.ts` file. the detail structure can be checked inside `types.ts` file.

# route (API Documentation as well)

there are 2 types of route, public and restrited. The public API used to read. the restricted API is used to write and/or update data.

## public

1. `GET /api/get-all` - get all type of items. projects, photos, and experiences.

## restricted

to access restricted API, pass the `Authorization` header with the value of `[access token]` from [admin.christojeffrey.com](admin.christojeffrey.com). the token can be obtained by login to the application.

1. `POST /api/restricted/update-all/[item]` - update an all data of a specific item. item can be `projects`, `photos`, or `experiences` (stated inside `constants.ts` file). WARNING, this will overwrite all data of the specific item. be careful when using this API.
