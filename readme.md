# wrapman 🎁

Postman API request collection wrapper that generates an axios http client.

## Usage

```sh
npm i wrapman

# Generate a flattened JSON file
npx wrapman -i path/to/postman-collection.json -d data

# Read the source collection from a URL
npx wrapman -i https://api.com/my/collection/json --url -d data
```

Import the flattened JSON file and initialize an API client.

```js
import { WrapmanApiClient } from 'wrapman'
import wrapmanJson from 'data/wrapman.json'

const apiClient = new WrapmanApiClient({
  collection: wrapmanJson
})

// Wraps axios.request.
// https://axios-http.com/docs/res_schema
// https://axios-http.com/docs/handling_errors
const res = await apiClient.request('Pet Store Collection::Pet::Get Pet')
```

## Programmatically

If the CLI doesn't work for you, generate the flattened collection yourself.

```js
import { Wrapman } from 'wrapman'

const wrapman = new Wrapman({
  collectionPath: 'path/to/postman-collection.json'
})

const flattenedJson = await wrapman.flatten()

// Do something fancy with flattenedJson.
```

## Request IDs

Given a postman collection like the [Pet Store](https://www.postman.com/schude/workspace/petstore/collection/14574125-2e916d97-e26f-42d5-a20d-4b34b25498f8):

```
Pet Store Collection/
  Pet/
    Create Pet
    Get Pet
    Update Pet
    Get Pet After Update
    Delete Pet
    Get Pet After Delete
```

Wrapman will generate an API client with request IDs that mimic the collection folder hierarchy, joined by `::`

```js
await apiClient.request('Pet Store Collection::Pet::Create Pet', {
  data: {
    name: 'Fido',
    type: 'dog'
  }
})

await apiClient.request('Pet Store Collection::Pet::Get Pet', {
  vars: {
    pet_id: 123
  }
})
```

## Variables and Prefix

Given a request ID `Pet Store Collection::Pet::Get Pet` and a request url `{{url}}/pet/{{pet_id}}`,
you can simplify API client usage with base variable replacement and a prefix.

```js
import { WrapmanApiClient } from 'wrapman'
import wrapmanJson from 'data/wrapman.json'

const apiClient = new WrapmanApiClient({
  collection: wrapmanJson,
  prefix: 'Pet Store Collection',
  vars: {
    url: 'https://petstore.swagger.io/v2'
  }
})

await apiClient.request('Pet::Get Pet', {
  vars: {
    pet_id: 123
  }
})

// GET https://petstore.swagger.io/v2/pet/123
```

Happy wrapping! 🌯
