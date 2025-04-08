import { z } from "zod"
import { nameZ, emailZ, passwordZ } from "~/schema/general"

const signInZ = z.object({
  email: emailZ,
  password: passwordZ
})

const signUpZ = z
  .object({
    name: nameZ,
    email: emailZ,
    password: passwordZ,
  })


export {
  signInZ,
  signUpZ
}
