import { INVENTORY, Item, getPlayerInventory, removePlayerItem } from '..';
import { addExchangeItem, EXCHANGE_PARTNER_UUID } from '../../exchange';
import { getItemById } from '../../utils';

(async () => {
  await WA.onInit();
  // document.getElementById('closeModal')?.addEventListener('click', async () => {
  //   await closeInventoryAndExchangeIframes();
  // });

  const inventory = document.getElementById('inventory');

  const items = await getPlayerInventory();

  const getCellHTML = (item?: Item): string => {
    if (item === undefined) {
      return `<div class="card"></div>`;
    }
    return `<div class="card-filled">
              <img src="${item?.sprite_url}" alt="${item?.description}" title="${item.name}" style="width:95%">
            </div>`;
  };

  const refreshCells = (inventory: HTMLElement | null, items: Item[] = []) => {
    if (!inventory) {
      throw new Error('Missing interface');
    }

    const MIN_NB_CELLS = 30;
    const displayedNbCells = Math.max(
      Math.ceil(items.length / 10) * 10,
      MIN_NB_CELLS,
    );

    let cellsHTML: string = '';
    for (let i = 0; i < displayedNbCells; i++) {
      if (items[i] !== undefined) {
        cellsHTML += getCellHTML(items[i]);
      } else {
        cellsHTML += getCellHTML();
      }
    }

    inventory.innerHTML = cellsHTML;

    // Add event listener to each item
    const cards = document.getElementsByClassName('card-filled');
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', () => {
        if (items[i] !== undefined) {
          openItemModal(items[i]);
        }
      });
    }
  };

  // Display initial cells in the inventory
  refreshCells(inventory, items);

  // Add event listener to each item
  const cards = document.getElementsByClassName('card-filled');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
      if (items[i] !== undefined) {
        openItemModal(items[i]);
      }
    });
  }

  const modal = document.getElementById('itemModal');

  function openItemModal(item: Item) {
    if (modal) {
      modal.style.display = 'block';
      document.getElementById('itemModalTitle')!.innerHTML = item.name;
      document.getElementById('itemModalDescription')!.innerHTML =
        item.description;

      const tradeButton = document.getElementById('tradeItem') as HTMLElement;

      if (!tradeButton) {
        throw new Error('Trade button not found');
      }

      tradeButton.setAttribute('data-item', String(item.id));
      if (WA.player.state[EXCHANGE_PARTNER_UUID]) {
        tradeButton.style.display = 'block';
      } else {
        tradeButton.style.display = 'none';
      }
    }
  }

  function closeItemModal() {
    if (modal?.style.display === 'block') {
      modal.style.display = 'none';
    }
  }

  document
    .getElementById('closeInteractModal')
    ?.addEventListener('click', closeItemModal);

  // Close the modal if the user presses the escape key
  window.onkeydown = function (event) {
    if (event.key === 'Escape') {
      if (modal) {
        modal.style.display = 'none';
      }
    }
  };

  WA.player.state.onVariableChange(INVENTORY).subscribe((items: any) => {
    refreshCells(inventory, items);
  });

  document.getElementById('tradeItem')?.addEventListener('click', async (e) => {
    const itemId = (e.target as HTMLElement).dataset.item;
    const item = await getItemById(itemId as string);

    if (item) {
      await removePlayerItem(item);
      refreshCells(inventory, await getPlayerInventory());
      closeItemModal();
      await addExchangeItem(item);
    }
  });
})();
