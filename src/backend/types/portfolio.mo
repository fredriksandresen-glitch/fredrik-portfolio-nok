import Time "mo:core/Time";

module {
  public type AssetType = {
    #Crypto;
    #Stock;
  };

  public type AssetHolding = {
    symbol : Text;
    name : Text;
    quantity : Float;
    assetType : AssetType;
    stakedQty : Float;
    yieldRate : Float; // Annual yield rate (e.g. 0.077 = 7.7%)
  };

  public type PriceData = {
    symbol : Text;
    priceUSD : Float;
    priceNOK : Float;
    lastUpdated : Time.Time;
    isLive : Bool;
    isMockData : Bool;
  };

  public type PortfolioSnapshot = {
    date : Text; // ISO date string "YYYY-MM-DD"
    totalValueNOK : Float;
    perAssetValues : [(Text, Float)]; // (symbol, valueNOK)
    recordedAt : Time.Time;
  };

  public type YieldInfo = {
    symbol : Text;
    stakedQty : Float;
    annualYieldRate : Float;
    monthlyYieldAsset : Float;
    yearlyYieldAsset : Float;
    monthlyYieldNOK : Float;
    yearlyYieldNOK : Float;
  };

  public type AssetWithPrice = {
    holding : AssetHolding;
    price : ?PriceData;
    valueNOK : Float;
  };

  public type PortfolioSummary = {
    assets : [AssetWithPrice];
    totalValueNOK : Float;
    usdNokRate : Float;
    lastPriceUpdate : ?Time.Time;
    hasLiveData : Bool;
  };
};
