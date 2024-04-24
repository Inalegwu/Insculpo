import { publicProcedure, router } from "@src/trpc";

type NoteBook = {
  id: string;
  notes: string[];
};

export const notebooksRouter = router({
  getNotebooks: publicProcedure.query(async ({ ctx }) => {}),
});
