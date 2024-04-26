import { UIWebsite } from "@workadventure/iframe-api-typings";
import { Item, getPlayerInventory } from "../../inventory";

(async () => {
  await WA.onInit();
  document.getElementById("closeModal")?.addEventListener("click", () => {
    close();
  });

  const inventory = document.getElementById("inventory");

  const items = await getPlayerInventory();

  function addCard(item?: Item): void {
    if (inventory != null) {
      if (item === undefined) {
        inventory.innerHTML += `<div class="card"></div>`;
      } else {
        inventory.innerHTML += `<div class="card">
            <img src="${item?.sprite_url}" alt="${item?.description}" title="${item.name}" style="width:95%">
          </div>`;
      }
    }
  }

  //Creation of the cards in the inventory
  let nbCard = 15;
  items.length > 15 ? (nbCard = Math.ceil(items.length / 10) * 10) : null;
  for (let i = 0; i < nbCard; i++) {
    if (items[i] !== undefined) {
      addCard(items[i]);
    } else {
      addCard();
    }
  }

  async function close() {
    WA.ui.website
      .getById(String(WA.player.state.exchange_id))
      .then((exchangeIframe: UIWebsite | undefined) => {
        if (exchangeIframe) {
          // WA.player.state.inventory_open = false;
          exchangeIframe.close();
        }
      });
  }
})();
