# frontend

# Usage

## Environment variables

| Name                                | Required | Value                         | Purpose                                 |
|-------------------------------------|----------|-------------------------------|-----------------------------------------|
| `NODE_ENV`                          | true     | development, test, production | environment name                        |
| `REDIS_HOST`                        | true     |                               | redis host                              |
| `REDIS_PORT`                        | true     |                               | redis port                              |
| `REDIS_KEY`                         | true     |                               | redis key                               |
| `STORAGE_URL`                       | true     |                               | storage url                             |
| `API_ENDPOINT`                      | true     |                               | api endpoint                            |
| `RESOURCE_SERVER_URL`               | true     |                               | resource serverurl                      |
| `CLIENT_ID`                         | true     |                               | client id                               |
| `CLIENT_SECRET`                     | true     |                               | client secret                           |
| `AUTHORIZE_SERVER_DOMAIN`           | true     |                               | authorize server domain                 |
| `CLIENT_ID_OAUTH2`                  | false    |                               | client id oauth2                        |
| `CLIENT_SECRET_OAUTH2`              | false    |                               | client secret oauth2                    |
| `OAUTH2_SERVER_DOMAIN`              | false    |                               | oauth2 server domain                    |
| `AUTH_REDIRECT_URI`                 | false    | site url + /signIn            | auth redirect uri                       |
| `AUTH_LOGUOT_URI`                   | false    | site url + /signOut           | auth loguot uri                         |
| `WAITER_SERVER_URL`                 | false    |                               | waiter server url                       |
| `ENCYPT_KEY`                        | false    |                               | encypt key                              |
| `LINY_API_ENDPOINT`                 | false    |                               | liny api endpoint                       |
| `LINY_API_SECRET`                   | false    |                               | liny api secret                         |
| `DEBUG`                             | false    |                               | debug                                   |
