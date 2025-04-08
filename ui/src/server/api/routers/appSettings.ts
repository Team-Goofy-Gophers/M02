import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const appSettingsRouter = createTRPCRouter({
  getHowItWorks: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.appSettings.findFirst({
        select: {
          howItWorks: true,
        }
      });
    }),

  updateHowItWorks: protectedProcedure
    .input(z.object({
      howItWorks: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.appSettings.updateMany({
        data: {
          howItWorks: input.howItWorks,
        },
      });
    })
});
