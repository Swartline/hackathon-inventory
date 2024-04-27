import { EXCHANGE_LIST, EXCHANGE_PARTNER_UUID } from '..';
import { Item } from '../../inventory';
import { getIframeById, getRemotePlayerByUuid } from '../../utils';

const getCellHTML = (item?: Item): string => {
  if (item === undefined) {
    return `<div class="card"></div>`;
  }
  return `<div class="card">
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
};

(async () => {
  await WA.onInit();

  document.getElementById('closeModal')?.addEventListener('click', () => {
    close();
  });

  const exchangeHTML = document.getElementById('exchange-cells');
  const remoteExchangeHTML = document.getElementById('remote-exchange-cells');
  // Display initial empty cells
  refreshCells(exchangeHTML);
  refreshCells(remoteExchangeHTML);

  // Creation of the cells in the inventory
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

  async function close() {
    const exchangeIframe = await getIframeById(
      String(WA.player.state.exchange_id),
    );
    if (exchangeIframe) {
      exchangeIframe.close();
    }
  }
})();
