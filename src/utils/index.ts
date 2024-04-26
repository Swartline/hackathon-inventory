import { UIWebsite } from '@workadventure/iframe-api-typings';
import { Item } from '../inventory';
import { RemotePlayerInterface } from '@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Players/RemotePlayer';

// Utilitary functions to handle adding and removing items in lists
export const getPlayerList = async (
  listVariableName: string,
): Promise<Item[]> => {
  const list = (await WA.player.state.loadVariable(listVariableName)) as Item[];
  return list ?? [];
};

export const clearPlayerList = async (
  listVariableName: string,
): Promise<void> => {
  await WA.player.state.saveVariable(listVariableName, [], { public: true });
};

export const addItemToPlayerList = async (
  item: Item,
  listVariableName: string,
): Promise<Item[]> => {
  const list = await getPlayerList(listVariableName);
  list.push(item);
  await WA.player.state.saveVariable(listVariableName, list, { public: true });
  return list;
};

export const removeItemFromPlayerList = async (
  item: Item,
  listVariableName: string,
): Promise<Item[]> => {
  const list = await getPlayerList(listVariableName);

  list.forEach((currentItem: Item, index: number) => {
    if (currentItem.id === item.id) {
      list.splice(index, 1);
    }
  });

  await WA.player.state.saveVariable(listVariableName, list, { public: true });

  return list;
};

export async function getItemById(id: number): Promise<Item | undefined> {
  return (await getPlayerList('inventory')).find((item) => item.id === id);
}

export async function getIframeById(
  id: string,
): Promise<UIWebsite | undefined> {
  return WA.ui.website.getById(id);
}

export const getRemotePlayerByUuid = async (
  uuid: string,
): Promise<RemotePlayerInterface | null> => {
  await WA.players.configureTracking({ players: true });
  const allPlayers = WA.players.list();

  for (const player of allPlayers) {
    if (player.uuid === uuid) {
      return player;
    }
  }
  return null;
};
