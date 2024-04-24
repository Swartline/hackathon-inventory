import { UIWebsite } from "@workadventure/iframe-api-typings";
import { Item, getPlayerInventory } from "workadventure-inventory";

WA.onInit()
  .then(async () => {
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

    for (let i = 0; i < 30; i++) {
      if (items[i] !== undefined) {
        addCard(items[i]);
      } else {
        addCard();
      }
    }

    async function close() {
      WA.ui.website.getAll().then((websites) => {
        WA.ui.website
          .getById(websites[0].id)
          .then((website: UIWebsite | undefined) => {
            if (website) {
              WA.player.state.inventory_open = false;
              website.close();
            }
          });
      });
    }
  })
  .catch((e) => console.error(e));
