import { Item } from '../inventory';

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
  await WA.player.state.saveVariable(listVariableName, []);
};

export const addItemToPlayerList = async (
  item: Item,
  listVariableName: string,
): Promise<Item[]> => {
  const list = await getPlayerList(listVariableName);
  list.push(item);
  await WA.player.state.saveVariable(listVariableName, list);
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

  await WA.player.state.saveVariable(listVariableName, list);

  return list;
};
