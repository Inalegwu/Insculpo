import { publicProcedure, router } from "@src/trpc";
import { systemPreferences } from "electron";

export const systemRouter = router({
  getAccentColor: publicProcedure.query(async () => {
    const accentColor = systemPreferences.getAccentColor();

    console.log(accentColor);

    return accentColor;
  }),
});
