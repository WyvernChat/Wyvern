declare module "emoji-dictionary" {
    export function getName(unicodeChar: string): string
    export function getUnicode(name: string): string
    export const unicode: string[]
    export const names: string[]
}
