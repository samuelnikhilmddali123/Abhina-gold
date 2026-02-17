// Mock API service to simulate live rate fetching

export const fetchRates = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          goldBuy: 58120,
          goldSell: 57980,
          silverBuy: 758,
          silverSell: 748,
          retailGold: 16150,
          retailSilver: 2750,
        });
      }, 1000);
    });
  };