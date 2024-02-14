export interface WrapmanCollection {
  name: string
  items: WrapmanCollectionItem[]
}

export interface WrapmanCollectionItem {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  url: string
}
