import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  getCollection: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.collection.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          Documents: true,
          Datasets: true,
          Clusters: {
            select: {
              title: true,
              description: true,
              summary: true,
              confidence: true,
              agentsUsed: true,

              Documents: true
            }
          },
          Prompts: {
            select: {
              content: true,
              PromptResult: true,
            }
          },

        }
      })
    }),

  getCollectionsInfinitely: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      direction: z.enum(['forward', 'backward']), // optional, useful for bi-directional query
    }),)
    .query(async ({ ctx, input }) => {
      return await ctx.db.collection.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              Documents: true
            }
          }
        },
        take: (input.limit ?? 10) + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          updatedAt: input.direction === 'forward' ? 'asc' : 'desc',
        },
      })
    }),

  createCollection: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db.collection.create({
        data: {
          name: "New Collection",
          User: {
            connect: {
              id: ctx.session.user.id
            }
          }
        }
      })
    }),

  addDocument: protectedProcedure
    .input(z.object({
      collectionId: z.string(),
      documentId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.document.update({
        where: {
          id: input.documentId,
        },
        data: {
          Collection: {
            connect: {
              id: input.collectionId,
            }
          }
        }
      })
    })
});
