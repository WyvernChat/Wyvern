import { createHash } from "crypto"

const sha256 = (data: string) => createHash("sha256").update(data, "binary").digest("hex")

export { sha256 }
