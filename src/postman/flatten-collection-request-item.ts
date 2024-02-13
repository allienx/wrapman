export function flattenCollectionRequestItem(
  collectionItem: Record<string, any>,
) {
  const { wrapmanId, name, item, request } = collectionItem

  if (request) {
    return {
      ...collectionItem,
      wrapmanId: wrapmanId ? `${wrapmanId}::${name}` : name,
    }
  }

  return item
    .map((i: any) => ({
      ...i,
      wrapmanId: wrapmanId ? `${wrapmanId}::${name}` : name,
    }))
    .map(flattenCollectionRequestItem)
}
