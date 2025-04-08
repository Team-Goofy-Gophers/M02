import { z } from "zod";

const nameZ = z.string().min(3, { message: "Name must be atleast 3 characters long" });
const emailZ = z.string().email({ message: "Invalid email address" });
const passwordZ = z.string().min(8, { message: "Password must be at least 8 characters long" });

export {
  nameZ,
  emailZ,
  passwordZ,
}
