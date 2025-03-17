import { handler as handlerDecor } from "@dododo/core/utils";
import { migrate } from "@/db";

export const handler = handlerDecor(async (event) => {
  const pathToMIgrations = "migrations";

  await migrate(pathToMIgrations);

  return JSON.stringify({
    body: "Migrated!",
  });
});
