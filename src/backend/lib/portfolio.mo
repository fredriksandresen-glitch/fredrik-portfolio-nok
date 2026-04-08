import Types "../types/portfolio";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {

  // --- Holdings management ---

  public func getHoldings(holdings : List.List<Types.AssetHolding>) : [Types.AssetHolding] {
    holdings.toArray();
  };

  public func getHolding(holdings : List.List<Types.AssetHolding>, symbol : Text) : ?Types.AssetHolding {
    holdings.find(func(h) { h.symbol == symbol });
  };

  public func addHolding(holdings : List.List<Types.AssetHolding>, holding : Types.AssetHolding) : () {
    // Remove existing holding with same symbol first (upsert)
    let existing = holdings.findIndex(func(h) { h.symbol == holding.symbol });
    switch (existing) {
      case (?idx) {
        holdings.put(idx, holding);
      };
      case null {
        holdings.add(holding);
      };
    };
  };

  public func updateHolding(holdings : List.List<Types.AssetHolding>, holding : Types.AssetHolding) : Bool {
    let idx = holdings.findIndex(func(h) { h.symbol == holding.symbol });
    switch (idx) {
      case (?i) {
        holdings.put(i, holding);
        true;
      };
      case null { false };
    };
  };

  public func deleteHolding(holdings : List.List<Types.AssetHolding>, symbol : Text) : Bool {
    let idx = holdings.findIndex(func(h) { h.symbol == symbol });
    switch (idx) {
      case (?i) {
        // Shift remaining elements to fill the gap by rebuilding list
        let arr = holdings.toArray();
        holdings.clear();
        for ((j, item) in arr.enumerate()) {
          if (j != i) { holdings.add(item) };
        };
        true;
      };
      case null { false };
    };
  };

  // --- Price management ---

  public func storePrices(
    prices : Map.Map<Text, Types.PriceData>,
    usdNokRateRef : { var value : Float },
    newRate : Float,
    newPrices : [Types.PriceData],
  ) : () {
    usdNokRateRef.value := newRate;
    for (pd in newPrices.values()) {
      prices.add(pd.symbol, pd);
    };
  };

  public func getPrice(prices : Map.Map<Text, Types.PriceData>, symbol : Text) : ?Types.PriceData {
    prices.get(symbol);
  };

  public func getAllPrices(prices : Map.Map<Text, Types.PriceData>) : [Types.PriceData] {
    prices.values().toArray();
  };

  // --- Date helpers ---

  // Convert Time (nanoseconds Int) to "YYYY-MM-DD"
  public func timeToDateString(t : Time.Time) : Text {
    let secondsSinceEpoch : Int = t / 1_000_000_000;
    let days : Int = secondsSinceEpoch / 86400;
    // Gregorian calendar calculation
    let z = days + 719468;
    let era = (if (z >= 0) z else z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = mp + (if (mp < 10) 3 else -9);
    let year = y + (if (m <= 2) 1 else 0);
    padInt(year, 4) # "-" # padInt(m, 2) # "-" # padInt(d, 2);
  };

  func padInt(n : Int, width : Nat) : Text {
    let s = if (n < 0) { "-" # Int.abs(n).toText() } else { n.toText() };
    let len = s.size();
    if (len >= width) { s } else {
      var pad = "";
      var i : Int = 0;
      let needed : Int = width.toInt() - len.toInt();
      while (i < needed) { pad := pad # "0"; i += 1 };
      pad # s;
    };
  };

  // --- Portfolio snapshot ---

  public func recordSnapshot(
    snapshots : List.List<Types.PortfolioSnapshot>,
    holdings : List.List<Types.AssetHolding>,
    prices : Map.Map<Text, Types.PriceData>,
    usdNokRate : Float,
  ) : Bool {
    let now = Time.now();
    let today = timeToDateString(now);

    // Build per-asset values
    let perAsset = holdings.map(func(h) {
      let valueNOK = switch (prices.get(h.symbol)) {
        case (?pd) { h.quantity * pd.priceUSD * usdNokRate };
        case null { 0.0 };
      };
      (h.symbol, valueNOK);
    }).toArray();

    let totalNOK = perAsset.foldLeft(0.0, func(acc, entry) {
      acc + entry.1;
    });

    let snapshot : Types.PortfolioSnapshot = {
      date = today;
      totalValueNOK = totalNOK;
      perAssetValues = perAsset;
      recordedAt = now;
    };

    // Check if snapshot for today already exists; if so, update it
    let existingIdx = snapshots.findIndex(func(s) { s.date == today });
    switch (existingIdx) {
      case (?i) {
        snapshots.put(i, snapshot);
      };
      case null {
        snapshots.add(snapshot);
      };
    };
    true;
  };

  public func clearSnapshots(snapshots : List.List<Types.PortfolioSnapshot>) : () {
    snapshots.clear();
  };

  public func getSnapshots(snapshots : List.List<Types.PortfolioSnapshot>) : [Types.PortfolioSnapshot] {
    // Sort ascending by date before returning
    let arr = snapshots.toArray();
    arr.sort(func(a, b) { Text.compare(a.date, b.date) });
  };

  public func getLastNSnapshots(snapshots : List.List<Types.PortfolioSnapshot>, n : Nat) : [Types.PortfolioSnapshot] {
    let total = snapshots.size();
    if (n >= total) {
      snapshots.toArray();
    } else {
      snapshots.sliceToArray(total.toInt() - n.toInt(), total.toInt());
    };
  };

  // --- Yield calculations ---

  public func calculateYield(
    holdings : List.List<Types.AssetHolding>,
    prices : Map.Map<Text, Types.PriceData>,
  ) : [Types.YieldInfo] {
    holdings
      .filter(func(h) { h.yieldRate > 0.0 })
      .map<Types.AssetHolding, Types.YieldInfo>(func(h) {
        let priceUSD = switch (prices.get(h.symbol)) {
          case (?pd) { pd.priceUSD };
          case null { 0.0 };
        };
        let nokRate = switch (prices.get(h.symbol)) {
          case (?pd) { if (pd.priceNOK > 0.0) pd.priceNOK / pd.priceUSD else 1.0 };
          case null { 1.0 };
        };
        let yearlyAsset = h.stakedQty * h.yieldRate;
        let monthlyAsset = yearlyAsset / 12.0;
        let priceNOK = priceUSD * nokRate;
        {
          symbol = h.symbol;
          stakedQty = h.stakedQty;
          annualYieldRate = h.yieldRate;
          monthlyYieldAsset = monthlyAsset;
          yearlyYieldAsset = yearlyAsset;
          monthlyYieldNOK = monthlyAsset * priceNOK;
          yearlyYieldNOK = yearlyAsset * priceNOK;
        };
      }).toArray();
  };

  // --- Portfolio summary ---

  public func buildSummary(
    holdings : List.List<Types.AssetHolding>,
    prices : Map.Map<Text, Types.PriceData>,
    usdNokRate : Float,
  ) : Types.PortfolioSummary {
    var totalNOK = 0.0;
    var lastUpdate : ?Time.Time = null;
    var hasLive = false;

    let assets = holdings.map<Types.AssetHolding, Types.AssetWithPrice>(func(h) {
      let priceOpt = prices.get(h.symbol);
      let valueNOK = switch (priceOpt) {
        case (?pd) {
          let v = h.quantity * pd.priceUSD * usdNokRate;
          totalNOK += v;
          if (pd.isLive) { hasLive := true };
          switch (lastUpdate) {
            case null { lastUpdate := ?pd.lastUpdated };
            case (?t) {
              if (pd.lastUpdated > t) { lastUpdate := ?pd.lastUpdated };
            };
          };
          v;
        };
        case null { 0.0 };
      };
      { holding = h; price = priceOpt; valueNOK };
    }).toArray();

    {
      assets;
      totalValueNOK = totalNOK;
      usdNokRate;
      lastPriceUpdate = lastUpdate;
      hasLiveData = hasLive;
    };
  };

  // --- Initial seed data ---

  public func seedInitialHoldings(holdings : List.List<Types.AssetHolding>) : () {
    if (holdings.size() > 0) { return }; // Already seeded
    holdings.add({
      symbol = "ICP";
      name = "Internet Computer";
      quantity = 17000.0;
      assetType = #Crypto;
      stakedQty = 9000.0;
      yieldRate = 0.077;
    });
    holdings.add({
      symbol = "BTC";
      name = "Bitcoin";
      quantity = 0.1;
      assetType = #Crypto;
      stakedQty = 0.0;
      yieldRate = 0.0;
    });
    holdings.add({
      symbol = "BMNR";
      name = "Bitmine Immersion Technologies";
      quantity = 700.0;
      assetType = #Stock;
      stakedQty = 0.0;
      yieldRate = 0.0;
    });
    holdings.add({
      symbol = "MSTR";
      name = "MicroStrategy";
      quantity = 9.0;
      assetType = #Stock;
      stakedQty = 0.0;
      yieldRate = 0.0;
    });
    holdings.add({
      symbol = "SBET";
      name = "Sports Entertainment Enterprises";
      quantity = 653.0;
      assetType = #Stock;
      stakedQty = 0.0;
      yieldRate = 0.0;
    });
  };
};
