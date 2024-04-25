const initializeExchangeButton = (): void => {
  WA.ui.onRemotePlayerClicked.subscribe((remotePlayer) => {
    remotePlayer.addAction('Échanger', () => {
      // TODO: display exchange iframe for both players
    });
  });
};

export const initializeExchangeSystem = async (): Promise<void> => {
  initializeExchangeButton();
};
