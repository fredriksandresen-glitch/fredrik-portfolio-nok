import Types "../types/portfolio";
import PortfolioLib "../lib/portfolio";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (
  holdings : List.List<Types.AssetHolding>,
  prices : Map.Map<Text, Types.PriceData>,
  snapshots : List.List<Types.PortfolioSnapshot>,
  usdNokRate : { var value : Float },
) {

  // Transform callback required by the IC for HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // --- Internal helpers ---

  // Parse a float value from a JSON-like substring: find key and extract numeric value.
  // Returns null if key not found or parsing fails.
  func extractFloat(json : Text, key : Text) : ?Float {
    let searchKey = "\"" # key # "\":";
    let parts = json.split(#text searchKey);
    let partsArr = parts.toArray();
    if (partsArr.size() < 2) { return null };
    let after = partsArr[1];
    // Extract numeric chars (digits, dot, minus, e, E, +)
    var numStr = "";
    var started = false;
    var done = false;
    for (c in after.toIter()) {
      if (not done) {
        if (not started and (c == '-' or (c >= '0' and c <= '9'))) {
          started := true;
          numStr := numStr # Text.fromChar(c);
        } else if (started) {
          if (c >= '0' and c <= '9' or c == '.' or c == 'e' or c == 'E' or c == '+' or c == '-') {
            numStr := numStr # Text.fromChar(c);
          } else {
            done := true;
          };
        };
      };
    };
    if (numStr == "") { return null };
    // Parse float manually: split on '.' and combine integer + fractional parts
    let numParts = numStr.split(#char '.').toArray();
    let isNeg = numStr.size() > 0 and numStr.toArray()[0] == '-';
    // Use a simple approach: parse integer and fractional parts via Int.fromText
    switch (numParts.size()) {
      case 1 {
        switch (Int.fromText(numStr)) {
          case (?i) { ?(i.toFloat()) };
          case null { null };
        };
      };
      case _ {
        let intStr = numParts[0];
        let fracStr = numParts[1];
        switch (Int.fromText(intStr)) {
          case (?intVal) {
            let fracLen = fracStr.size();
            switch (Int.fromText(fracStr)) {
              case (?fracVal) {
                var divisor : Float = 1.0;
                var k = 0;
                while (k < fracLen) { divisor := divisor * 10.0; k += 1 };
                let sign : Float = if (isNeg) -1.0 else 1.0;
                let result = intVal.toFloat() + sign * (fracVal.toFloat() / divisor);
                ?result;
              };
              case null { null };
            };
          };
          case null { null };
        };
      };
    };
  };

  // Fetch USD/NOK rate from CoinGecko using the USD/EUR/NOK endpoint via BTC
  // CoinGecko supports vs_currencies=nok
  func fetchUsdNokRate() : async Float {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=nok";
    try {
      let body = await OutCall.httpGetRequest(url, [], transform);
      // Expected: {"usd-coin":{"nok":10.5}}
      switch (extractFloat(body, "nok")) {
        case (?rate) { if (rate > 0.0) rate else usdNokRate.value };
        case null { usdNokRate.value };
      };
    } catch (_) {
      usdNokRate.value; // fallback to stored rate
    };
  };

  // Fetch crypto prices from CoinGecko
  func fetchCryptoPrices(nokRate : Float) : async [Types.PriceData] {
    let now = Time.now();
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=internet-computer,bitcoin&vs_currencies=usd";
    try {
      let body = await OutCall.httpGetRequest(url, [], transform);
      // Expected: {"internet-computer":{"usd":8.5},"bitcoin":{"usd":65000}}
      let icpParts = body.split(#text "\"internet-computer\"").toArray();
      let icpUSD : Float = if (icpParts.size() >= 2) {
        switch (extractFloat(icpParts[1], "usd")) {
          case (?v) { v };
          case null { 0.0 };
        };
      } else { 0.0 };

      let btcParts = body.split(#text "\"bitcoin\"").toArray();
      let btcUSD : Float = if (btcParts.size() >= 2) {
        switch (extractFloat(btcParts[1], "usd")) {
          case (?v) { v };
          case null { 0.0 };
        };
      } else { 0.0 };

      let results : [Types.PriceData] = [
        {
          symbol = "ICP";
          priceUSD = if (icpUSD > 0.0) icpUSD else 8.5;
          priceNOK = (if (icpUSD > 0.0) icpUSD else 8.5) * nokRate;
          lastUpdated = now;
          isLive = icpUSD > 0.0;
          isMockData = icpUSD == 0.0;
        },
        {
          symbol = "BTC";
          priceUSD = if (btcUSD > 0.0) btcUSD else 65000.0;
          priceNOK = (if (btcUSD > 0.0) btcUSD else 65000.0) * nokRate;
          lastUpdated = now;
          isLive = btcUSD > 0.0;
          isMockData = btcUSD == 0.0;
        },
      ];
      results;
    } catch (_) {
      [
        { symbol = "ICP"; priceUSD = 8.5; priceNOK = 8.5 * nokRate; lastUpdated = now; isLive = false; isMockData = true },
        { symbol = "BTC"; priceUSD = 65000.0; priceNOK = 65000.0 * nokRate; lastUpdated = now; isLive = false; isMockData = true },
      ];
    };
  };

  // Fetch stock price from Finnhub for a single symbol
  func fetchFinnhubPrice(symbol : Text, nokRate : Float) : async Types.PriceData {
    let now = Time.now();
    let apiKey = "d3fsbq9r01qqbh542lbgd3fsbq9r01qqbh542lc0";
    let url = "https://finnhub.io/api/v1/quote?symbol=" # symbol # "&token=" # apiKey;
    try {
      let body = await OutCall.httpGetRequest(url, [], transform);
      // Expected: {"c":3.5,"d":...,"dp":...,"h":...,"l":...,"o":...,"pc":...,"t":...}
      // "c" = current price
      switch (extractFloat(body, "c")) {
        case (?price) {
          if (price > 0.0) {
            {
              symbol;
              priceUSD = price;
              priceNOK = price * nokRate;
              lastUpdated = now;
              isLive = true;
              isMockData = false;
            };
          } else {
            { symbol; priceUSD = 0.0; priceNOK = 0.0; lastUpdated = now; isLive = false; isMockData = true };
          };
        };
        case null {
          { symbol; priceUSD = 0.0; priceNOK = 0.0; lastUpdated = now; isLive = false; isMockData = true };
        };
      };
    } catch (_) {
      { symbol; priceUSD = 0.0; priceNOK = 0.0; lastUpdated = now; isLive = false; isMockData = true };
    };
  };

  // --- Portfolio CRUD ---

  public func getPortfolio() : async [Types.AssetHolding] {
    PortfolioLib.seedInitialHoldings(holdings);
    PortfolioLib.getHoldings(holdings);
  };

  public func getAsset(symbol : Text) : async ?Types.AssetHolding {
    PortfolioLib.getHolding(holdings, symbol);
  };

  public func addAsset(holding : Types.AssetHolding) : async () {
    PortfolioLib.addHolding(holdings, holding);
  };

  public func updateAsset(holding : Types.AssetHolding) : async Bool {
    PortfolioLib.updateHolding(holdings, holding);
  };

  public func deleteAsset(symbol : Text) : async Bool {
    PortfolioLib.deleteHolding(holdings, symbol);
  };

  // --- Prices ---

  public func getCurrentPrices() : async [Types.PriceData] {
    PortfolioLib.getAllPrices(prices);
  };

  /// Triggers external API calls (Finnhub for stocks, CoinGecko for crypto + USD/NOK rate)
  public func refreshPrices() : async Text {
    PortfolioLib.seedInitialHoldings(holdings);

    // 1. Fetch USD/NOK exchange rate
    let nokRate = await fetchUsdNokRate();

    // 2. Fetch crypto prices from CoinGecko
    let cryptoPrices = await fetchCryptoPrices(nokRate);

    // 3. Fetch stock prices from Finnhub
    let bmnrPrice = await fetchFinnhubPrice("BMNR", nokRate);
    let mstrPrice = await fetchFinnhubPrice("MSTR", nokRate);
    let sbetPrice = await fetchFinnhubPrice("SBET", nokRate);

    // 4. Combine all prices
    let allPrices : [Types.PriceData] = [
      cryptoPrices[0], // ICP
      cryptoPrices[1], // BTC
      bmnrPrice,
      mstrPrice,
      sbetPrice,
    ];

    // 5. Store in state
    PortfolioLib.storePrices(prices, usdNokRate, nokRate, allPrices);

    // 6. Record daily snapshot only when at least one live price was fetched
    let liveCount = allPrices.filter(func(p) { p.isLive }).size();
    let mockCount = allPrices.filter(func(p) { p.isMockData }).size();
    if (liveCount > 0) {
      ignore PortfolioLib.recordSnapshot(snapshots, holdings, prices, usdNokRate.value);
    };

    "refreshed: " # liveCount.toText() # " live, " # mockCount.toText() # " mock";
  };

  // --- Snapshots ---

  /// Wipes all historical snapshots — use to clear corrupted/stale canister state.
  public func clearAllSnapshots() : async () {
    PortfolioLib.clearSnapshots(snapshots);
  };

  /// Records one snapshot for today (idempotent — only one per calendar day).
  /// Only records if at least one live price is available.
  public func recordDailySnapshot() : async Bool {
    let liveCount = PortfolioLib.getAllPrices(prices).filter(func(p) { p.isLive }).size();
    if (liveCount == 0) { return false };
    PortfolioLib.recordSnapshot(snapshots, holdings, prices, usdNokRate.value);
  };

  public func getHistoricalSnapshots() : async [Types.PortfolioSnapshot] {
    PortfolioLib.getSnapshots(snapshots);
  };

  public func getLastNSnapshots(n : Nat) : async [Types.PortfolioSnapshot] {
    PortfolioLib.getLastNSnapshots(snapshots, n);
  };

  // --- Yield ---

  public func getYieldInfo() : async [Types.YieldInfo] {
    PortfolioLib.calculateYield(holdings, prices);
  };

  // --- Summary ---

  public func getPortfolioSummary() : async Types.PortfolioSummary {
    PortfolioLib.seedInitialHoldings(holdings);
    PortfolioLib.buildSummary(holdings, prices, usdNokRate.value);
  };
};
