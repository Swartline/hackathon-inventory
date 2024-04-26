import { Item, getPlayerInventory } from "..";
import { addExchangeItem, openExchange } from "../../exchange";
import { getIframeById, getItemById } from "../../utils";

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
        inventory.innerHTML += `<div class="card-filled">
            <img 
              src="${item?.sprite_url}" 
              alt="${item?.description}" 
              title="${item.name}" 
              style="width:95%"
              onclick=""
            >
          </div>`;
      }
    }
  }

  //Creation of the cards in the inventory
  let nbCard = 30;
  items.length > 30 ? (nbCard = Math.ceil(items.length / 10) * 10) : null;
  for (let i = 0; i < nbCard; i++) {
    if (items[i] !== undefined) {
      addCard(items[i]);
    } else {
      addCard();
    }
  }

  async function close() {
    const website = await getIframeById(String(WA.player.state.inventory_id));
    if (website) {
      WA.player.state.inventory_open = false;
      website.close();
    }
  }

  // Add event listener to each item
  const cards = document.getElementsByClassName("card-filled");
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", () => {
      console.log("Item clicked", cards[i]);
      if (items[i] !== undefined) {
        openItemModal(items[i]);
      }
    });
  }

  const modal = document.getElementById("itemModal");

  function openItemModal(item: Item) {
    console.log("Open item modal", item);
    if (modal) {
      modal.style.display = "block";
      document.getElementById("itemModalTitle")!.innerHTML = item.name;
      document.getElementById("itemModalDescription")!.innerHTML =
        item.description;
      document
        .getElementById("tradeItem")!
        .setAttribute("data-item", String(item.id));
      //add data to the trade button
      //TODO
    }
  }

  document
    .getElementById("closeInteractModal")
    ?.addEventListener("click", () => {
      if (modal?.style.display === "block") {
        modal.style.display = "none";
      }
    });

  //Close the modal if the user clicks outside of it
  // window.onclick = function (event) {
  //   console.log("Click", event.target);
  //   if (event.target !== modal && modal?.style.display === "block") {
  //     console.log("Close modal");

  //     modal!.style.display = "none";
  //   }
  // };

  // Close the modal if the user presses the escape key
  window.onkeydown = function (event) {
    if (event.key === "Escape") {
      if (modal) {
        modal.style.display = "none";
      }
    }
  };

  document.getElementById("tradeItem")?.addEventListener("click", async (e) => {
    console.log("Trade item4567", e.target);
    const itemId = (<HTMLElement>e.target).getAttribute("data-item");
    let item = await getItemById(itemId!);
    const inventoryIframe = await getIframeById(
      String(WA.player.state.inventory_id)
    ); //Receive the iframe of the inventory to reposition it

    if (inventoryIframe) {
      console.log("Trade item", inventoryIframe);
      // inventoryIframe.position.horizontal = "left";
      // const iframeExchange = await openExchange();
      if (item) {
        await addExchangeItem(item);
      }
    }
    // });
    //TODO
  });
})();
