import axios, { AxiosRequestConfig } from 'axios'
import { WrapmanCollection } from 'src/wrapman-collection'
import { getRequestUrl } from 'src/postman/get-request-url'

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

  async request<D, B>(
    id: string,
    {
      ignorePrefix,
      vars,
      headers,
      params,
      ...config
    }: WrapmanApiClientSendConfig<B>,
  ) {
    const itemId = this.prefix && !ignorePrefix ? `${this.prefix}::${id}` : id
    const collectionItem = this.collection.items.find((item) => {
      return item.id === itemId
    })

    if (!collectionItem) {
      throw new Error(
        `No request '${id}' found! Check that it exists in your postman collection or regenerate the wrapman collection.`,
      )
    }

    const url = getRequestUrl({
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
