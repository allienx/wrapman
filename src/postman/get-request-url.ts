export function getRequestUrl({
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
      //   Postman request url: {{baseUrl}}/v1/locations/{{location_id}}
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
