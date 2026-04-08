import Types "types/portfolio";
import PortfolioMixin "mixins/portfolio-api";
import List "mo:core/List";
import Map "mo:core/Map";

actor {
  let holdings = List.empty<Types.AssetHolding>();
  let prices = Map.empty<Text, Types.PriceData>();
  let snapshots = List.empty<Types.PortfolioSnapshot>();
  let usdNokRate = { var value : Float = 10.5 };

  include PortfolioMixin(holdings, prices, snapshots, usdNokRate);
};
