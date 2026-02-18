// Mock API service to simulate live rate fetching

export const fetchRates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        spot: [
          { id: 1, name: 'GOLD', bid: 4911.45, ask: 4912.20, high: 5000.35, low: 4865.20 },
          { id: 2, name: 'SILVER', bid: 74.83, ask: 74.89, high: 76.95, low: 72.84 },
          { id: 3, name: 'INR', bid: 90.773, ask: 90.783, high: 90.808, low: 90.660 },
        ],
        rtgs: [
          { id: 1, name: "SILVER-30 KG'S RTGS ONLY-", buy: '-', sell: 243937, stock: true },
          { id: 2, name: 'SILVER MINI- -CASH', buy: '-', sell: 244437, stock: true },
          { id: 3, name: 'GOLD RTGS', buy: '-', sell: 156495, stock: true },
        ],
        futures: [
          { id: 1, name: 'GOLD FUTURE', bid: 152624, ask: 152695, high: 154935, low: 151311 },
          { id: 2, name: 'SILVER FUTURE', bid: 234613, ask: 234837, high: 240449, low: 229802 },
        ],
        next: [
          { id: 1, name: 'SILVER NEXT', bid: 234613, ask: 234837, high: 240449, low: 229802 },
          { id: 2, name: 'GOLD NEXT', bid: 152624, ask: 152695, high: 154935, low: 151311 },
        ],
      });
    }, 1000);
  });
};