import { hashAndSalt } from "~/lib/utils";
import { signUpZ } from "~/schema/auth";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signUp: protectedProcedure
    .input(signUpZ)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (user?.password) {
        throw new Error("User already exists");
      }

      return await ctx.db.user.create({
        data: {
          email: input.email,
          password: await hashAndSalt(input.password),
          name: input.name,
        },
      })
    }),
});
