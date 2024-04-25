/// <reference types="@workadventure/iframe-api-typings" />

import { initializeInventorySystem } from "workadventure-inventory";

// Waiting for the API to be ready
(async () => {
  await WA.onInit();
  await initializeInventorySystem();
})();
