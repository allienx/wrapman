export interface WrapmanCollection {
  name: string
  items: WrapmanCollectionItem[]
}

export interface WrapmanCollectionItem {
  id: string
  name: string
  method: string
  url: string
}
