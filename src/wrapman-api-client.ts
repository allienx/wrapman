import axios, { AxiosRequestConfig } from 'axios'
import { WrapmanCollection } from 'src/wrapman-collection'

interface WrapmanApiClientProps {
  collection: WrapmanCollection
  prefix?: string
  headers?: AxiosRequestConfig['headers']
  params?: AxiosRequestConfig['params']
  vars?: Record<string, string>
}

interface WrapmanApiClientSendConfig<B> extends AxiosRequestConfig<B> {
  ignorePrefix?: boolean
  vars?: Record<string, string>
}

export class WrapmanApiClient {
  collection: WrapmanCollection
  prefix: string | undefined
  headers: AxiosRequestConfig['headers']
  params: AxiosRequestConfig['params']
  vars: Record<string, string> | undefined

  constructor({
    collection,
    prefix,
    headers,
    params,
    vars,
  }: WrapmanApiClientProps) {
    this.collection = collection
    this.prefix = prefix
    this.headers = headers
    this.params = params
    this.vars = vars
  }

  getRequestUrl({
    id,
    url,
    vars,
  }: {
    id: string
    url: string
    vars: Record<string, string>
  }) {
    return url
      .split('/')
      .map((str) => {
        // Replace any dynamic path variables in the postman url.
        //
        // Example:
        //   Request url: {{baseUrl}}/v1/locations/{{location_id}}
        //   This will try to find 'baseUrl' and 'location_id' values on the parameters object.
        if (str.startsWith('{{') && str.endsWith('}}')) {
          const envVar = str.replace(/[{}]/g, '')
          const paramValue = vars[envVar]

          if (!paramValue) {
            console.log('Missing path variable replacement!')
            console.log(`Request: ${id}`)
            console.log(`URL: ${url}`)
            console.log(`Var: ${envVar}`)
          }

          return paramValue
        }

        return str
      })
      .join('/')
  }

  async request<D = any, B = any>(
    id: string,
    {
      ignorePrefix,
      vars,
      headers,
      params,
      ...config
    }: WrapmanApiClientSendConfig<B> = {},
  ) {
    const itemId = this.prefix && !ignorePrefix ? `${this.prefix}::${id}` : id
    const collectionItem = this.collection.items.find((item) => {
      return item.id === itemId
    })

    if (!collectionItem) {
      throw new Error(
        `No request '${id}' found! Check that it exists in your source collection or regenerate the wrapman collection.`,
      )
    }

    const url = this.getRequestUrl({
      id,
      url: collectionItem.url,
      vars: {
        ...this.vars,
        ...vars,
      },
    })

    const res = await axios.request<D>({
      method: collectionItem.method,
      url,
      headers: {
        ...this.headers,
        ...headers,
      },
      params: {
        ...this.params,
        ...params,
      },
      ...config,
    })

    return res
  }
}
