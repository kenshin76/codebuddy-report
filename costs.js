"use strict";

// Each phase explicitly uses HRMS credits or the supplied token-rate estimate.
(() => {
  const measured=value=>typeof value === "number" && Number.isFinite(value) && value >= 0;
  const sum=(a,b)=>measured(a) && measured(b) ? a+b : null;
  window.TOKEN_COSTS=Object.freeze({
    creditQuote(terms,options={}) {
      const base=terms?.baseCredits;
      const bonus=options.bonus ? terms?.bonusCredits : 0;
      const activity=options.activity ? terms?.activityCredits : 0;
      const credits=measured(base) && measured(bonus) && measured(activity) ? base+bonus+activity : null;
      return {credits,usdPerCredit:measured(terms?.subscriptionUsd) && credits>0 ? terms.subscriptionUsd/credits : null};
    },
    model(model,rate) {
      const method=rate?.method === "credits" ? "credits" : "tokens";
      const phase=key=>{
        const raw=model.tokens[key]?.total;
        const tokens=measured(raw)?raw:null;
        if(method === "credits") {
          const rawCredits=rate[key+"Credits"];
          const credits=measured(rawCredits)?rawCredits:null;
          return {tokens,credits,usd:credits === null || !measured(rate.usdPerCredit) ? null : credits*rate.usdPerCredit};
        }
        return {tokens,credits:null,usd:tokens === null || !measured(rate?.usdPerMillion) ? null : tokens*rate.usdPerMillion/1000000};
      };
      const dev=phase("dev"),review=phase("review");
      return {method,dev,review,tokens:sum(dev.tokens,review.tokens),credits:sum(dev.credits,review.credits),usd:sum(dev.usd,review.usd)};
    }
  });
})();
