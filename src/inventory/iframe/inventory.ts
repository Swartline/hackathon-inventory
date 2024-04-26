import { UIWebsite } from "@workadventure/iframe-api-typings";
import { Item, getPlayerInventory } from "..";

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
    WA.ui.website
      .getById(String(WA.player.state.inventory_id))
      .then((website: UIWebsite | undefined) => {
        if (website) {
          WA.player.state.inventory_open = false;
          website.close();
        }
      });
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

  //Event on click on the button id = "tradeItem"
  document.getElementById("tradeItem")?.addEventListener("click", async () => {
    console.log("Trade item");
    const website = await WA.ui.website.getById(
      String(WA.player.state.inventory_id)
    ); //TODO method to get the website by id

    if (website) {
      console.log("Trade item", website);
      website.position.horizontal = "left";
      const iframeExchange = await WA.ui.website.open({
        url: "/src/exchange/inventory/exchange.html",
        position: {
          vertical: "middle",
          horizontal: "right",
        },
        size: {
          height: "50vh",
          width: "50vw",
        },
        allowApi: true,
      });
      WA.player.state.exchange_id = iframeExchange.id;
    }
    // });
    //TODO
  });
})();
