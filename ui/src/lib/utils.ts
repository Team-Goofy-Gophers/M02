import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "~/env"

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

const hashAndSalt = async (password: string) => {
  const hashArrayBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.AUTH_SECRET + password))
  return Array.from(new Uint8Array(hashArrayBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export { cn, hashAndSalt }
