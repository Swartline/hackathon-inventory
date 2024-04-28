import {
  EXCHANGE_LIST,
  EXCHANGE_PARTNER_UUID,
  closeInventoryAndExchangeIframes,
} from '..';
import { Item, addPlayerItem } from '../../inventory';
import {
  clearPlayerList,
  getItemByIdFromPlayerList,
  getRemotePlayerByUuid,
  removeItemFromPlayerList,
} from '../../utils';

(async () => {
  await WA.onInit();

  const btnCancelItem = document.getElementById('btn-cancel-item');
  const overlayForMyItems = document.getElementById(
    'overlay-confirm-trade-my-item',
  );
  console.log('overlayForMyItems', overlayForMyItems);

  const overlayForRemoteItems = document.getElementById(
    'overlay-confirm-trade-remote-item',
  );

  document.getElementById('closeModal')?.addEventListener('click', () => {
    closeInventoryAndExchangeIframes();
  });

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

    const MIN_NB_CELLS = 10;
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

    if (inventory === document.getElementById('exchange-cells')) {
      // Add event listener to each item
      const cards = document
        .getElementById('exchange-cells')
        ?.getElementsByClassName('card-filled');

      for (let i = 0; i < cards!.length; i++) {
        cards![i].addEventListener('click', () => {
          if (items[i] !== undefined) {
            openItemModal(items[i]);
          }
        });
      }
    }
  };

  const modal = document.getElementById('itemModal');

  function openItemModal(item: Item) {
    if (modal) {
      modal.style.display = 'block';
      btnCancelItem?.setAttribute('data-item', String(item.id));
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

  btnCancelItem?.addEventListener('click', async (e) => {
    const itemId = (e.target as HTMLElement).dataset.item;

    const item = await getItemByIdFromPlayerList(Number(itemId));

    if (!item) {
      throw new Error('Item not found');
    }

    if (item) {
      removeItemFromPlayerList(item, EXCHANGE_LIST);
      closeItemModal();
      await addPlayerItem(item);
    }
  });

  const exchangeHTML = document.getElementById('exchange-cells');
  const remoteExchangeHTML = document.getElementById('remote-exchange-cells');
  // Display initial empty cells
  refreshCells(exchangeHTML);
  refreshCells(remoteExchangeHTML);

  const remotePlayer = await getRemotePlayerByUuid(
    WA.player.state[EXCHANGE_PARTNER_UUID] as string,
  );

  if (!remotePlayer) {
    throw new Error('No remote player');
  }

  WA.player.state.onVariableChange(EXCHANGE_LIST).subscribe((items: any) => {
    refreshCells(exchangeHTML, items);
  });

  remotePlayer.state.onVariableChange(EXCHANGE_LIST).subscribe((items: any) => {
    refreshCells(remoteExchangeHTML, items);
  });

  WA.player.state.saveVariable('trade_confirmed', false, { public: true });

  remotePlayer.state
    .onVariableChange('trade_confirmed')
    .subscribe((items: any) => {
      if (items === true) {
        overlayForRemoteItems!.style.display = 'block';
        checkExchange();
      } else if (items === false) {
        overlayForRemoteItems!.style.display = 'none';
      }
    });

  WA.player.state
    .onVariableChange('trade_confirmed')
    .subscribe((items: any) => {
      if (items === true) {
        overlayForMyItems!.style.display = 'block';
        checkExchange();
      } else if (items === false) {
        overlayForMyItems!.style.display = 'none';
      }
    });

  const confirmExchange = async () => {
    WA.player.state.saveVariable('trade_confirmed', true, { public: true });
  };

  const cancelExchange = async () => {
    WA.player.state.saveVariable('trade_confirmed', false, { public: true });
  };

  const btnCancelExchange = document.getElementById('btn-cancel-exchange');
  btnCancelExchange?.addEventListener('click', cancelExchange);

  const btnValidExchange = document.getElementById('btn-valid-exchange');
  btnValidExchange?.addEventListener('click', confirmExchange);

  const checkExchange = async () => {
    if (
      WA.player.state['trade_confirmed'] === true &&
      remotePlayer.state['trade_confirmed'] === true
    ) {
      const remoteItemsForExchange = remotePlayer.state[
        EXCHANGE_LIST
      ] as Item[];

      for (const item of remoteItemsForExchange) {
        await addPlayerItem(item);
      }

      console.log('exchange items confirmed !');
      await clearPlayerList(EXCHANGE_LIST);

      await closeInventoryAndExchangeIframes();
    }
  };
})();
