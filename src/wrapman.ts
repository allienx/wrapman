import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { flattenCollectionRequestItem } from 'src/postman/flatten-collection-request-item'
import { WrapmanCollection } from 'src/wrapman-collection'

interface WrapmanProps {
  collectionPath: string
}

export class Wrapman {
  collectionPath: string
  collectionJson: Record<string, any> | null

  constructor({ collectionPath }: WrapmanProps) {
    this.collectionPath = collectionPath
    this.collectionJson = null
  }

  async readCollectionJson() {
    if (this.collectionJson) {
      return
    }

    try {
      const str = await readFile(this.collectionPath, {
        encoding: 'utf8',
      })

      this.collectionJson = JSON.parse(str)
    } catch (err) {
      console.error(err)

      this.collectionJson = null
    }
  }

  async flatten({ destPath }: { destPath?: string } = {}) {
    await this.readCollectionJson()

    const { collection } = this.collectionJson || {}
    const items = collection?.item || []

    const flattenedCollection: WrapmanCollection = {
      name: collection?.info.name,
      items: items
        .map(flattenCollectionRequestItem)
        .flat(10)
        .map((item: any) => {
          const { request } = item
          const host = request.url.host.join('/')
          const path = request.url.path.join('/')

          return {
            id: item.wrapmanId,
            name: item.name,
            method: request.method,
            url: `${host}/${path}`,
          }
        }),
    }

    if (destPath) {
      const outputPath = path.join(destPath, 'wrapman.json')

      await mkdir(destPath, { recursive: true })

      await writeFile(outputPath, JSON.stringify(flattenedCollection))
    }

    return flattenedCollection
  }
}
