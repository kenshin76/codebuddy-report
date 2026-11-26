"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"costs.js"),"utf8"),sandbox);
const api=sandbox.window.TOKEN_COSTS;
const config=JSON.parse(fs.readFileSync(path.join(root,"report-config.json"),"utf8"));
const models=fs.readdirSync(path.join(root,"models")).filter(f=>f.endsWith(".json")).map(f=>JSON.parse(fs.readFileSync(path.join(root,"models",f),"utf8")));
// Expected credits and USD independently reproduced from the usage report with Decimal.
const expected={
 gpt:[44122266,null,13.876452657], opus:[78061731,null,16.705210434],
 deepseek:[76426592,105.49,4.2196], hy4:[75681968,725.56,29.0224],
 kimi:[52185445,1278.42,51.1368],
 balanced:[47110323,818.23,32.7292]
};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const expectedPhases={
 gpt:[9.6827879455,4.1936647115],opus:[12.598883846,4.106326588],
 deepseek:[3.0696,1.15],hy4:[12.9876,16.0348],
 kimi:[28.3736,22.7632],balanced:[22.4928,10.2364]
};
const originals=JSON.stringify(models),originalRates=JSON.stringify(config.tokenPricing);
for(const m of models){
 const [tokens,credits,usd]=expected[m.id],rate=config.tokenPricing.rates[m.id];
 const q=api.model(m,rate);
 assert.equal(q.tokens,tokens);
 if(credits === null){assert.equal(q.method,"tokens");assert.equal(q.credits,null);}
 else {assert.equal(q.method,"credits");close(q.credits,credits);assert.equal(rate.usdPerMillion,undefined);}
 close(q.usd,usd);
 close(q.dev.usd,expectedPhases[m.id][0]);close(q.review.usd,expectedPhases[m.id][1]);
 close(q.dev.usd+q.review.usd,q.usd);
}
const hy4=config.tokenPricing.rates.hy4;
close(hy4.devCredits+hy4.reviewCredits,725.56); // Excludes W2 66.52 and W4 28.62.
const sample={tokens:{dev:{total:105},review:{total:105}}};
assert.equal(api.model(sample,{method:"tokens",usdPerMillion:1}).usd,.00021);
const credits={method:"credits",devCredits:1,reviewCredits:2,usdPerCredit:.04};
close(api.model(sample,credits).usd,.12);
close(api.model({tokens:{dev:null,review:null}},credits).usd,.12); // Known credits don't require token estimates.
close(api.model(sample,{...credits,usdPerMillion:999999}).usd,.12); // Never double-charge both methods.
assert.equal(api.model(sample).usd,null);
assert.equal(api.model(sample,{method:"tokens",usdPerMillion:0}).usd,0);
assert.equal(api.model(sample,{method:"tokens",usdPerMillion:-1}).usd,null);
for(const value of [null,undefined,NaN,-1]) {
 assert.equal(api.model(sample,{...credits,reviewCredits:value}).usd,null);
 assert.equal(api.model(sample,{...credits,usdPerCredit:value}).usd,null);
 assert.equal(api.model({tokens:{dev:{total:value},review:{total:1}}},{method:"tokens",usdPerMillion:1}).usd,null);
}
assert.equal(api.model(sample,{...credits,devCredits:0,reviewCredits:0}).usd,0);
assert.equal(api.model(sample,{...credits,usdPerCredit:0}).usd,0);
assert.equal(api.model({tokens:{dev:{total:0},review:{total:0}}},{method:"tokens",usdPerMillion:1}).usd,0);
const partial=api.model(sample,{...credits,reviewCredits:null});
close(partial.dev.usd,.04);assert.equal(partial.review.usd,null);assert.equal(partial.usd,null);
const terms=config.tokenPricing.creditComparison;
const scenarios=[
 [{},1000,.04,["deepseek","gpt","opus","hy4","balanced","kimi"]],
 [{bonus:true},2000,.02,["deepseek","gpt","hy4","balanced","opus","kimi"]],
 [{activity:true},2500,.016,["deepseek","hy4","balanced","gpt","opus","kimi"]],
 [{bonus:true,activity:true},3500,40/3500,["deepseek","hy4","balanced","gpt","kimi","opus"]]
];
for(const [options,allowance,unitPrice,order] of scenarios){
 const quote=api.creditQuote(terms,options);
 assert.equal(quote.credits,allowance);close(quote.usdPerCredit,unitPrice);
 const calculated=models.map(m=>{
  const source=config.tokenPricing.rates[m.id];
  const rate=source.method === "credits"?{...source,usdPerCredit:quote.usdPerCredit}:source;
  const cost=api.model(m,rate);
  if(source.method === "credits") {
   close(cost.credits,expected[m.id][1]);
   close(cost.usd,expected[m.id][1]*unitPrice);
   close(cost.dev.usd,source.devCredits*unitPrice);
   close(cost.review.usd,source.reviewCredits*unitPrice);
  } else close(cost.usd,expected[m.id][2]);
  return {id:m.id,usd:cost.usd};
 });
 assert.deepEqual(calculated.sort((a,b)=>a.usd-b.usd).map(row=>row.id),order);
}
assert.equal(api.creditQuote(terms,{}).usdPerCredit,.04); // Returning to the default restores the base price.
for(const invalid of [null,undefined,-1,NaN]){
 assert.equal(api.creditQuote({...terms,subscriptionUsd:invalid}).usdPerCredit,null);
 assert.equal(api.creditQuote({...terms,baseCredits:invalid}).usdPerCredit,null);
}
assert.equal(api.creditQuote({...terms,baseCredits:0}).usdPerCredit,null);
assert.equal(JSON.stringify(models),originals);
assert.equal(JSON.stringify(config.tokenPricing),originalRates);
console.log("비용 검사 통과: 6개 모델 개발/검토·합계 유지·범위 제외·미수집/0·이중 환산 방지·원본 보존");
