/* disable:tslint */

declare interface Window {}

declare var __webpack_public_path__: string

declare module '*.styl' {
  interface JsonObject {
      [ key: string ]: string
  }

  const jsonObject: JsonObject

  export default jsonObject
}

declare module '*.png' {
  const result: string
  export default result
}

declare module '*.svg' {
  const result: string
  export default result
}
