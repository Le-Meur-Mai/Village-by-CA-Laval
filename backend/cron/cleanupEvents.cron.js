import cron from "node-cron";
import EventServices from "../src/services/eventServices.js";

const service = new EventServices();

// Tous les 1ers du mois à 00:05
cron.schedule("5 0 1 * *", async () => {
  try {
    await service.cleanupOldEvents();
    console.log("Old events cleaned");
  } catch (err) {
    console.error("Cron error:", err);
  }
});
