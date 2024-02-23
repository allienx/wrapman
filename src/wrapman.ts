import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { flattenCollectionRequestItem } from 'src/postman/flatten-collection-request-item'
import { WrapmanCollection } from 'src/wrapman-collection'

interface WrapmanProps {
  collectionPath: string
  isPathUrl?: boolean
}

export class Wrapman {
  collectionPath: string
  collectionJson: Record<string, any> | null
  isPathUrl: boolean

  constructor({ collectionPath, isPathUrl = false }: WrapmanProps) {
    this.collectionPath = collectionPath
    this.collectionJson = null
    this.isPathUrl = isPathUrl
  }

  async readCollectionJson() {
    if (this.collectionJson) {
      return
    }

    if (this.isPathUrl) {
      try {
        this.collectionJson = await fetch(this.collectionPath).then((res) => {
          return res.json()
        })
      } catch (err) {
        console.error(err)

        this.collectionJson = null
      }

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
          const { url, method } = item.request
          const protocol = url.protocol || ''
          const host = url.host.join('.')
          const path = url.path.join('/')

          const resolvedUrl = protocol
            ? `${protocol}://${host}/${path}`
            : `${host}/${path}`

          return {
            id: item.wrapmanId,
            name: item.name,
            method,
            url: resolvedUrl,
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
