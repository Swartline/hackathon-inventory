/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { UIWebsite } from "@workadventure/iframe-api-typings";
import {
  Item,
  addPlayerItem,
  clearPlayerInventory,
  initPlayerInventory,
} from "workadventure-inventory";
import itemsJson from "./items/items.json";

const items: Item[] = itemsJson.items;

// Waiting for the API to be ready
(async () => {
  await WA.onInit();
  bootstrapExtra().catch((e) => console.error(e));
  await initPlayerInventory();

  await clearPlayerInventory();
  for (const item of items) {
    await addPlayerItem(item);
  }

  let inventoryIframe: UIWebsite | undefined;

  WA.ui.actionBar.addButton({
    id: "inventory-btn",
    type: "action",
    imageSrc: "https://cdn-icons-png.flaticon.com/512/4138/4138061.png",
    toolTip: "Inventaire",
    callback: async (event) => {
      if (!inventoryIframe) {
        inventoryIframe = await WA.ui.website.open({
          url: "../test.html",
          position: {
            vertical: "middle",
            horizontal: "middle",
          },
          size: {
            height: "50vh",
            width: "50vw",
          },
          allowApi: true,
        });
        inventoryIframe.position.vertical = "top";

        WA.player.state.inventory_open = true;
        WA.player.state.inventory_id = inventoryIframe.id;
      } else {
        inventoryIframe.close();
        inventoryIframe = undefined;
        WA.player.state.inventory_open = false;
      }
    },
  });

  WA.player.state.onVariableChange("inventory_open").subscribe((value) => {
    if (!value) {
      inventoryIframe = undefined;
    }
  });
})();
