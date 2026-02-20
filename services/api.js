// API service to fetch live rates from RB Gold Spot
export const fetchRates = async () => {
  try {
    const response = await fetch('https://bcast.rbgoldspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/rbgold');
    const text = await response.text();

    // Parse the tab-separated response.
    // Some rows start with a leading tab (empty first element), others don't.
    // We detect the offset: if row[0] is empty, data starts at index 1, otherwise at 0.
    const rows = text.trim().split('\n');
    const dataMap = {};

    rows.forEach(rawRow => {
      const cols = rawRow.split('\t').map(c => c.trim());
      const offset = cols[0] === '' ? 1 : 0;
      const id = cols[offset];
      const name = cols[offset + 1];
      const bid = cols[offset + 2];
      const ask = cols[offset + 3];
      const high = cols[offset + 4];
      const low = cols[offset + 5];
      const stock = cols[offset + 6];

      if (id && name && ask !== undefined) {
        dataMap[id] = {
          id,
          name,
          bid: bid === '-' ? '-' : parseFloat(bid),
          ask: ask === '-' ? '-' : parseFloat(ask),
          high: high === '-' ? '-' : parseFloat(high),
          low: low === '-' ? '-' : parseFloat(low),
          stock: (stock || '').trim() === 'InStock',
        };
      }
    });

    // Spot: 3101=GOLD ($), 3107=SILVER ($), 3103=USD-INR (₹)
    const spot = [];
    if (dataMap['3101']) spot.push(dataMap['3101']);
    if (dataMap['3107']) spot.push(dataMap['3107']);
    if (dataMap['3103']) spot.push(dataMap['3103']);

    // Products: 945=Gold 999, 2966=Silver 999 (30 Kgs), 2987=Silver 999 (5 Kgs)
    const mapToRtgs = (id) => {
      const item = dataMap[id];
      if (!item) return null;
      return { id: item.id, name: item.name, buy: '-', sell: item.ask, stock: item.stock };
    };
    const rtgs = ['945', '2966', '2987'].map(mapToRtgs).filter(Boolean);

    return { spot, rtgs, futures: [], next: [] };
  } catch (error) {
    console.error('Error fetching live rates:', error);
    throw error;
  }
};