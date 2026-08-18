import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"

const KEY_LENGTH = 64
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const
const HASH_PREFIX = "scrypt"

function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      keyLength,
      SCRYPT_PARAMS,
      (err, derivedKey) => {
        if (err) reject(err)
        else resolve(derivedKey)
      }
    )
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH)
  const { N, r, p } = SCRYPT_PARAMS
  return `${HASH_PREFIX}$${N}:${r}:${p}$${salt.toString("base64")}$${derivedKey.toString("base64")}`
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split("$")
  if (parts.length !== 4 || parts[0] !== HASH_PREFIX) return false

  const [nStr, rStr, pStr] = parts[1].split(":")
  const N = Number(nStr)
  const r = Number(rStr)
  const p = Number(pStr)
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p))
    return false

  const salt = Buffer.from(parts[2], "base64")
  const expected = Buffer.from(parts[3], "base64")
  if (salt.length === 0 || expected.length === 0) return false

  try {
    const derivedKey = await new Promise<Buffer>((resolve, reject) => {
      scryptCallback(
        password,
        salt,
        expected.length,
        { N, r, p },
        (err, key) => {
          if (err) reject(err)
          else resolve(key)
        }
      )
    })
    return timingSafeEqual(derivedKey, expected)
  } catch {
    return false
  }
}
