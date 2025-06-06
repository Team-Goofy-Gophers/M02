import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          email: true,
          image: true,
        }
      })
    }),

});
