"use strict";

(() => {
  const D = window.REPORT_DATA;
  const numeric = value => typeof value === "number" && Number.isFinite(value);
  const models = [...D.models].sort((a,b) => Number(a.pinLast)-Number(b.pinLast));
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "미수집").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const modelName = (m,label=m.name) => m.provider?.icon ? `<span class="model-identity" title="${esc(m.provider.name)}"><img class="model-icon" src="${esc(m.provider.icon)}" width="20" height="20" alt=""><span>${esc(label)}</span></span>` : esc(label);
  const modelCell = value => {const m=models.find(m=>m.name===value);return m ? modelName(m) : esc(value);};
  const nf = new Intl.NumberFormat("ko-KR");
  const number = value => value == null ? "미수집" : nf.format(value);
  const fixed = (value,digits=1) => numeric(value) ? value.toFixed(digits) : "미수집";
  const percent = value => numeric(value) ? value.toFixed(2)+"%" : "미수집";
  const apiCount = m => m.apiExecuted ?? m.apiTotal;
  const apiRate = m => numeric(m.apiPass) && numeric(apiCount(m)) && apiCount(m) > 0 ? m.apiPass/apiCount(m)*100 : null;
  const apiMissing = m => m.apiTotal-apiCount(m);
  const groupLabel = m => m.groupLabel || D.groups[m.group] || "기타 모델";
  const sourceLabel = m => m.presentation.tokens.sourceLabel || m.presentation.tokens.label;
  const state = {model:models.some(m=>m.id===D.report.defaultModelId) ? D.report.defaultModelId : models[0].id};
  const planState = {promotion:false,yearly:false,bonus:false};
  const costOptions = {bonus:false,activity:false};
  const cell = (value,cls="") => `<td${cls ? ` class="${cls}"` : ""}>${value}</td>`;
  const header = (labels,firstColumnClass="") => `<thead><tr>${labels.map((x,index) => `<th scope="col"${index === 0 && firstColumnClass ? ` class="${esc(firstColumnClass)}"` : ""}>${modelCell(x)}</th>`).join("")}</tr></thead>`;
  const table = (labels,rows,cls="") => `<table class="${cls}">${header(labels)}<tbody>${rows.map(r=>`<tr>${r.map(v=>cell(v)).join("")}</tr>`).join("")}</tbody></table>`;
  const counts = values => Array.isArray(values) && values.every(numeric) ? values.join(" / ") : "미수집";
  const combinedTokens = m => numeric(m.tokens.dev?.total) && numeric(m.tokens.review?.total) ? m.tokens.dev.total+m.tokens.review.total : null;
  const combinedTime = m => numeric(m.time.dev) && numeric(m.time.review) ? m.time.dev+m.time.review : null;
  const ranksFor = (getValue,descending=false) => {
    const observed=models.filter(m=>numeric(getValue(m)));
    return new Map(observed.map(m=>[m.id,1+observed.filter(other=>descending ? getValue(other)>getValue(m) : getValue(other)<getValue(m)).length]));
  };
  const rankBadge = (rank,label) => numeric(rank) ? `<span class="token-rank" aria-label="${esc(label)} ${rank}위">${rank}위</span>` : "";
  const evidenceLinks = m => (m.evidence || []).length ? `<p><strong>추가 근거</strong> ${(m.evidence || []).map(item=>`<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>`).join(" · ")}</p>` : "";

  function duration(ms) {
    if(!numeric(ms)) return "미수집";
    const h=Math.floor(ms/3600000),min=Math.floor(ms%3600000/60000),sec=Math.floor(ms%60000/1000),fraction=ms%1000;
    return `${h ? h+"시간 " : ""}${min ? min+"분 " : ""}${sec}${fraction ? "."+String(fraction).padStart(3,"0") : ""}초`;
  }

  function renderOverview() {
    document.querySelectorAll("[data-model-count]").forEach(e=>{e.textContent=models.length;});
    document.querySelectorAll("[data-report-date]").forEach(e=>{e.textContent=D.date.replaceAll("-",".");});
    const description=document.querySelector('meta[name="description"]');
    if(description) description.content=`동일 HRMS 과제의 ${models.length}개 결과물로 살펴본 Codebuddy의 품질, 사용 토큰과 소요 시간. 근거와 도입 조건을 함께 제시합니다.`;
    const codebuddy=models.filter(m=>m.group==="codebuddy");
    $("benchmark-model-list").innerHTML=codebuddy.map(m=>`<li${m.pinLast ? ' class="model-mode"' : ""}><strong>${modelName(m)}</strong><span>${esc(m.summary.rosterNote || m.position)}</span></li>`).join("");
    $("benchmark-reference").innerHTML=`<span>비교 기준</span>${models.filter(m=>m.group==="baseline").map(m=>`<strong>${modelName(m)}</strong>`).join("")}`;
    const top=codebuddy.filter(m=>numeric(m.raw)).sort((a,b)=>b.raw-a.raw)[0];
    const bestApi=codebuddy.filter(m=>numeric(apiRate(m))).sort((a,b)=>apiRate(b)-apiRate(a))[0];
    const reference=models.find(m=>m.id===D.report.primaryReferenceId);
    const topNote=top && numeric(reference?.raw) ? `${reference.name} ${fixed(reference.raw)}점 대비 ${fixed(Math.abs(reference.raw-top.raw))}점 차이.` : "비교 가능한 점수 미수집";
    const metric=(label,value,unit,title,note,emphasis=false,titleModel=null)=>`<article class="metric-card${emphasis ? " emphasis" : ""}"><span>${esc(label)}</span><div class="metric-number">${value}<small>${unit}</small></div><strong>${titleModel?modelName(titleModel,title):esc(title)}</strong><p>${esc(note).replaceAll("\n","<br>")}</p></article>`;
    $("overview-metrics").innerHTML=metric("Codebuddy 내 최고 완성도",top ? fixed(top.raw) : "미수집","/ 100점",top?.name || "평가 대기",topNote,true,top)+metric(`${bestApi?.summary.shortName || bestApi?.name || "Codebuddy"}의 공통 API 통과율`,bestApi ? fixed(apiRate(bestApi),2) : "미수집","%",bestApi ? `${bestApi.apiPass} / ${apiCount(bestApi)}개 검사 통과` : "미수집",bestApi?.summary.apiNote || "공통 API 검사 자료 미수집")+metric("기준 모델의 관측 토큰",numeric(reference?.tokens.total?.total) ? fixed(reference.tokens.total.total/1000000,2) : "미수집","백만 토큰",reference ? `${reference.name} · ${number(reference.tokens.total?.total)}토큰` : "미수집",reference?.summary.tokenMetricNote || reference?.tokenNote || "토큰 미수집",false,reference);
    const recommended=models.filter(m=>m.summary.recommendation).sort((a,b)=>Number(a.pinLast)-Number(b.pinLast)||a.summary.recommendation.order-b.summary.recommendation.order);
    $("adoption-recommend-grid").innerHTML=recommended.map(m=>{const rec=m.summary.recommendation;return `<article><span class="badge badge-${esc(rec.tone)}">${esc(rec.label)}</span><h3>${modelName(m)}</h3><p>${esc(rec.action)}</p></article>`;}).join("");
    $("adoption-model-conditions").innerHTML=recommended.map(m=>`<li><strong>${modelName(m,m.summary.shortName || m.name)}:</strong> ${esc(m.summary.recommendation.detail)}</li>`).join("");
  }

  function renderQuality() {
    $("score-chart").innerHTML = `<div class="token-axis" aria-hidden="true"><span>공통 눈금</span><div><span>0</span><span>50</span><span>100</span></div></div>` + models.map(m => {
      const rate=apiRate(m);
      const metrics=[{key:"score",label:"점수",value:m.raw,display:`${fixed(m.raw)}점`,detail:""},{key:"api",label:"API",value:rate,display:percent(rate),detail:`${number(m.apiPass)} / ${apiCount(m)}개 통과${apiMissing(m)?` · 미실행 ${apiMissing(m)}`:""}`}];
      const rows=metrics.map(metric=>!numeric(metric.value) ? `<div class="token-phase-row" data-metric="${metric.key}"><span class="token-phase-label">${metric.label}</span><div class="token-missing">미수집</div></div>` : `<div class="token-phase-row" data-metric="${metric.key}"><span class="token-phase-label">${metric.label}</span><div class="token-bar-space" aria-hidden="true"><div class="token-track quality-track quality-${metric.key}" style="width:${metric.value}%"></div></div><div class="token-value">${metric.display}${metric.detail ? `<small>${metric.detail}</small>` : ""}</div></div>`).join("");
      return `<div class="token-model" role="group" aria-label="${esc(m.name)} 완성도 점수와 API 통과율"><div class="token-model-name"><strong>${modelName(m)}</strong>${rankBadge(m.rank,"완성도 점수가 높은 순서")}<small>${esc(groupLabel(m))}</small></div><div class="token-pair">${rows}</div></div>`;
    }).join("");
  }

  function renderQualityTable() {
    const labels=["모델 / 순위","점수","API 통과","정적 구현 추정","A 검증 커버리지","A PASS / FAIL / NOT_RUN","관측 결함군",`Docker /${D.benchmark.dockerMax}`];
    $("quality-table").className="quality-table";
    $("quality-table").innerHTML=header(labels,"model-cell")+`<tbody>${models.map(m=>`<tr><td class="model-cell"><span class="cell-main">${modelName(m)}</span><span class="cell-sub">${esc(groupLabel(m))} · ${numeric(m.rank)?`<span class="table-rank">${m.rank}위</span>`:"순위 미수집"} · 신뢰도 ${esc(m.confidence)}</span></td>${cell(fixed(m.raw),"num")}${cell(percent(apiRate(m))+(numeric(m.apiPass)?`<span class="cell-sub">${m.apiPass}/${apiCount(m)} · FAIL ${apiCount(m)-m.apiPass}${apiMissing(m)?` · 미실행 ${apiMissing(m)}`:""}</span>`:""),"num")}${cell(percent(m.implementation),"num")}${cell(percent(m.coverage),"num")}${cell(counts(m.acceptance),"num")}${cell(number(m.bugs)+(Array.isArray(m.severity)&&m.severity.every(numeric)?`<span class="cell-sub">높음 ${m.severity[0]} / 중간 ${m.severity[1]} / 낮음 ${m.severity[2]}</span>`:""),"num")}${cell(fixed(m.docker),"num")}</tr>`).join("")}</tbody>`;
  }

  function renderModel() {
    const m=models.find(x=>x.id===state.model);
    $("model-detail").innerHTML=`<div class="detail-grid"><div class="model-detail-copy"><span class="badge ${m.group==="codebuddy" ? "badge-blue" : "badge-neutral"}">${modelName(m)} · 점수 ${fixed(m.raw)}</span><h4>${esc(m.position)}</h4><p><strong>강점</strong><br>${esc(m.strength)}</p><p><strong>조건과 한계</strong><br>${esc(m.weakness)}</p><p class="model-meta">원본 프로젝트: ${esc(m.folder)}<br>독립 A: ${Array.isArray(m.acceptance)&&m.acceptance.every(numeric)?`PASS ${m.acceptance[0]} · FAIL ${m.acceptance[1]} · NOT_RUN ${m.acceptance[2]}`:"미수집"}</p>${evidenceLinks(m)}</div><div class="score-breakdown" aria-label="영역별 점수">${D.areas.map((a,i)=>`<div class="score-breakdown-row"><span>${esc(a[0])}</span>${numeric(m.scores[i])?`<div class="bar-track" aria-hidden="true"><div class="score-fill" style="width:${m.scores[i]/a[1]*100}%"></div></div>`:'<span aria-hidden="true"></span>'}<span class="area-value">${numeric(m.scores[i])?m.scores[i]+" / "+a[1]:"미수집"}</span></div>`).join("")}</div></div>`;
  }

  function renderTokens() {
    const phases=[["dev","개발"],["review","검토"]];
    const ranks=ranksFor(combinedTokens);
    const maxObserved=Math.max(0,...models.flatMap(m=>phases.map(([key])=>m.tokens[key]?.total ?? 0)));
    const scaleMax=Math.max(10000000,Math.ceil(maxObserved/10000000)*10000000);
    const segmentLabels={regular:"일반 입력",cache:"캐시 읽기",write:"캐시 쓰기",output:"출력"};
    $("token-chart").innerHTML=`<div class="token-axis" aria-hidden="true"><span>공통 눈금</span><div><span>0</span><span>${scaleMax/2000000}M</span><span>${scaleMax/1000000}M 토큰</span></div></div>`+models.map(m=>{
      const p=m.presentation.tokens;
      const rows=phases.map(([key,label])=>{
        const t=m.tokens[key];
        const phaseLabel=`<span class="token-phase-label">${label}</span>`;
        if(!numeric(t?.total))return `<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-missing">미수집<span>${esc(p.missingNote || "관측 자료 없음")}</span></div></div>`;
        const classified=[t.regular,t.read,t.write,t.output].every(numeric);
        const segments=classified ? [["regular",t.regular],["cache",t.read],["write",t.write],["output",t.output]].map(([cls,value])=>`<span class="${cls}" style="width:${t.total?value/t.total*100:0}%" title="${segmentLabels[cls]} ${number(value)}토큰"></span>`).join("") : "";
        return `<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-bar-space" aria-hidden="true"><div class="token-track ${p.partial?"partial":""}${classified?"":" unclassified"}" style="width:${t.total/scaleMax*100}%"${classified?"":' title="구성별 토큰 미수집"'}>${segments}</div></div><div class="token-value">${fixed(t.total/1000000,2)}M<small>${number(t.total)} 토큰</small></div></div>`;
      }).join("");
      const combined=combinedTokens(m);
      const notes=combined==null?"":`<details class="token-measurement"><summary>수집 범위와 한계</summary><div>${phases.map(([key,label])=>`<p><strong>${label}</strong> ${esc(p.phaseNotes[key] || m.tokenNote)}</p>`).join("")}${p.extras.map(note=>`<p>${esc(note)}</p>`).join("")}<p>번호는 표시한 개발+검토 합계가 적은 순서이며 미수집 모델은 제외합니다. 관측 범위가 달라 모델 자체의 효율 순위로 해석하지 않습니다.</p></div></details>`;
      const total=combined==null?"":`<div class="token-total" role="group" aria-label="개발·검토 토큰 합계"><b>${fixed(combined/1000000,2)}M</b><small>${number(combined)} 토큰</small></div>`;
      const bottom=notes||total?`<div class="token-bottom">${notes}${total}</div>`:"";
      return `<div class="token-model${combined==null?" token-model-missing":""}" role="group" aria-label="${esc(m.name)} 개발·검토 토큰"><div class="token-model-name"><strong>${modelName(m)}</strong>${rankBadge(ranks.get(m.id),"표시 합계가 적은 순서")}<small>${esc(p.label)}</small></div><div class="token-pair">${rows}${bottom}</div></div>`;
    }).join("");
  }

  function renderTime() {
    const phases=[["dev","개발"],["review","검토"]];
    const ranks=ranksFor(combinedTime);
    const scaleMax=Math.max(60,Math.ceil(Math.max(0,...models.flatMap(m=>phases.map(([key])=>m.time[key]??0)))/3600000)*60);
    $("time-chart").innerHTML=`<div class="token-axis" aria-hidden="true"><span>공통 눈금</span><div><span>0</span><span>${scaleMax/2}분</span><span>${scaleMax}분</span></div></div>`+models.map(m=>{
      const combined=combinedTime(m);
      const p=m.presentation.time;
      const rows=phases.map(([key,label])=>{
        const ms=m.time[key];
        const phaseLabel=`<span class="token-phase-label">${label}</span>`;
        if(!numeric(ms))return `<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-missing">미수집</div></div>`;
        return `<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-bar-space" aria-hidden="true"><div class="token-track time-track time-${key}${p.partial?" partial":""}" style="width:${ms/60000/scaleMax*100}%"></div></div><div class="token-value">${fixed(ms/60000,2)}분<small>${esc(duration(ms))}</small></div></div>`;
      }).join("");
      const notes=`<details class="token-measurement"><summary>측정 범위와 한계</summary><div><p>${esc(m.timeNote)}</p></div></details>`;
      const total=combined==null?"":`<div class="token-total" role="group" aria-label="개발·검토 경과시간 구간 합"><b>${fixed(combined/60000,2)}분</b><small>${esc(duration(combined))}</small></div>`;
      return `<div class="token-model" role="group" aria-label="${esc(m.name)} 개발·검토 경과시간"><div class="token-model-name"><strong>${modelName(m)}</strong>${rankBadge(ranks.get(m.id),"표시 구간 합이 짧은 순서")}<small>${esc(p.label)}</small></div><div class="token-pair">${rows}<div class="token-bottom">${notes}${total}</div></div></div>`;
    }).join("");
    $("time-table").innerHTML=table(["모델","개발 경과","검토·수정 경과","구간 내부 합","전체 창·측정 범위"],models.map(m=>[`<strong>${modelName(m)}</strong>`,esc(duration(m.time.dev)),esc(duration(m.time.review)),esc(duration(m.time.total)),esc(m.timeNote)]),"time-table");
  }

  function renderComparison() {
    const shortTime=ms=>{if(!numeric(ms))return "미수집";const minutes=Math.floor(ms/60000);return `${minutes>=60?Math.floor(minutes/60)+"시간 ":""}${minutes%60}분`;};
    $("value-matrix").innerHTML=table(["모델","점수","토큰 사용량","소요 시간","활용 판단"],models.map(m=>[
      `<strong>${modelName(m)}</strong>`,
      `<span class="summary-score"><strong>${numeric(m.raw)?fixed(m.raw)+"점":"미수집"}</strong><span class="cell-sub">API ${percent(apiRate(m))}</span></span>`,
      numeric(m.tokens.total?.total)?`<span class="summary-token"><strong>${fixed(m.tokens.total.total/1000000,2)}M</strong><span class="cell-sub">${number(m.tokens.total.total)} 토큰</span></span>`:"미수집",shortTime(m.time.total),esc(m.position)
    ]),"value-table");
    $("comparison-notes").innerHTML=models.map(m=>`<article><h4>${modelName(m)}</h4><p><strong>활용 판단</strong> ${esc(m.position)}. ${esc(m.weakness)}</p><p><strong>토큰 범위</strong> ${esc(sourceLabel(m))}. ${esc(m.tokenNote)}</p><p><strong>시간 범위</strong> ${esc(m.timeNote)}</p>${evidenceLinks(m)}</article>`).join("");
    const comparable=models.filter(m=>m.efficiencyComparable);
    $("efficiency-table").innerHTML=table(["모델","점수 /100만 관측 토큰","점수 /요청 내부 1시간","비교 범위"],comparable.map(m=>[modelName(m),fixed(m.raw*1000000/m.tokens.total.total,4),fixed(m.raw*3600000/m.time.total,4),esc(m.efficiencyNote || "관측 범위를 확인한 참고 지표")]),"matrix-table");
  }

  function renderStatic() {
    $("model-select").innerHTML=models.map(m=>`<option value="${m.id}" ${m.id===state.model?"selected":""}>${esc(m.name)}</option>`).join("");
    $("area-table").innerHTML=table(["영역 / 만점",...models.map(m=>m.name)],D.areas.map((a,i)=>[`${esc(a[0])} / ${a[1]}`,...models.map(m=>numeric(m.scores[i])?`${m.scores[i]} / ${a[1]}`:"미수집")]).concat([["합계 /100",...models.map(m=>`<strong>${fixed(m.raw)}</strong>`)]]),"matrix-table");
    const a=D.acceptanceTable;
    const acceptanceRows=a.rows.map(r=>[r[0],r[1],...models.map(m=>r[2+D.models.findIndex(source=>source.id===m.id)]),r[r.length-1]]);
    $("acceptance-table").innerHTML=table(["ID","명세 시나리오",...models.map(m=>m.name),"근거 그룹"],acceptanceRows.map(r=>r.map(esc)),"acceptance-table");
    $("token-table").innerHTML=table(D.tokenTable.headers,D.tokenTable.rows.map(r=>r.map((value,index)=>index===0?modelCell(value):esc(value))),"token-detail-table");
    $("limits-table").innerHTML=table(D.limitsTable.headers,D.limitsTable.rows.map(r=>r.map(esc)),"long-table");
    $("weight-grid").innerHTML=D.areas.concat([["총 배점",100]]).map(a=>`<div class="weight"><span>${esc(a[0])}</span><strong>${a[1]}<small>점</small></strong></div>`).join("");
  }

  function renderCosts() {
    const pricing=D.tokenPricing || {rates:{}};
    const usd=(value,digits=2)=>numeric(value)?`$${value.toFixed(digits)}`:"미확인";
    const unitUsd=value=>numeric(value)?"$"+new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:6}).format(value):"미확인";
    const creditTerms=pricing.creditComparison;
    const creditQuote=window.TOKEN_COSTS.creditQuote(creditTerms,costOptions);
    const rows=models.map(m=>{
      const sourceRate=pricing.rates[m.id];
      const rate=sourceRate?.method === "credits" ? {...sourceRate,usdPerCredit:creditQuote.usdPerCredit} : sourceRate;
      return {m,rate,cost:window.TOKEN_COSTS.model(m,rate)};
    });
    const renderOptions=()=>`<div class="plan-options cost-options" role="group" aria-label="크레딧 비용 비교 옵션"><div><strong>비교 옵션</strong><span>지급량 ${number(creditQuote.credits)}크레딧 · 기본 ${number(creditTerms.baseCredits)}${costOptions.bonus?` + 보너스 ${number(creditTerms.bonusCredits)}`:""}${costOptions.activity?` + 활동보상 ${number(creditTerms.activityCredits)}(${creditTerms.activityDays}일 최대)`:""}</span></div><div class="plan-option-buttons"><button id="cost-bonus" class="plan-toggle" data-cost-option="bonus" type="button" aria-pressed="${costOptions.bonus}" aria-controls="cost-sections cost-rate-table cost-detail-table"><span class="plan-toggle-mark" aria-hidden="true"></span><span class="plan-toggle-label">보너스 크레딧</span><span class="plan-toggle-state" aria-hidden="true">${costOptions.bonus?"적용 중":"미적용"}</span></button><button id="cost-activity" class="plan-toggle" data-cost-option="activity" type="button" aria-pressed="${costOptions.activity}" aria-controls="cost-sections cost-rate-table cost-detail-table"><span class="plan-toggle-mark" aria-hidden="true"></span><span class="plan-toggle-label">활동 보너스 크레딧</span><span class="plan-toggle-state" aria-hidden="true">${costOptions.activity?"적용 중":"미적용"}</span></button></div></div>`;
    const costsById=new Map(rows.map(({m,cost})=>[m.id,cost.usd]));
    const costRanks=ranksFor(m=>costsById.get(m.id));
    const groups=[
      {id:"tokens",title:"토큰 기준",note:"주간 지급량을 월 4.3주로 환산하고 가장 저렴한 구독 조건을 가정한 추정액으로, 실제 비용과 큰 차이가 날 수 있습니다.",rows:rows.filter(row=>row.cost.method === "tokens")},
      {id:"credits",title:"크레딧 기준",note:"",rows:rows.filter(row=>row.cost.method === "credits")}
    ].filter(group=>group.rows.length);
    const phases=[["dev","개발"],["review","검토"]];
    const largest=Math.max(0,...rows.flatMap(({cost})=>phases.map(([key])=>cost[key].usd ?? 0)));
    const step=largest<=100?10:largest<=500?50:100;
    const scale=Math.max(step,Math.ceil(largest/step)*step);
    const rateLabel=rate=>rate?.method === "credits"?`${unitUsd(rate.usdPerCredit)} / 크레딧`:`${unitUsd(rate?.usdPerMillion)} / 1M 토큰`;
    const renderRow=({m,rate,cost})=>{
      const unit=value=>cost.method === "credits"?`${number(value.credits)} 크레딧`:`${fixed(value.tokens/1000000,2)}M 토큰`;
      const parts=phases.map(([key,label])=>{
        const value=cost[key];
        const phaseLabel=`<span class="token-phase-label">${label}</span>`;
        return numeric(value.usd)?`<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-bar-space" aria-hidden="true"><div class="token-track time-${key}" style="width:${value.usd/scale*100}%"></div></div><div class="token-value">${usd(value.usd)}<small>${unit(value)}</small></div></div>`:`<div class="token-phase-row" data-phase="${key}">${phaseLabel}<div class="token-missing">${!rate?"단가 미확인":cost.method === "credits"?"크레딧·환산율 미수집":"토큰·단가 미수집"}</div></div>`;
      }).join("");
      const total=numeric(cost.usd)?`<div class="token-bottom"><div class="token-total" aria-label="개발·검토 비용 합계"><b>${usd(cost.usd)}</b><small>${unit(cost)}</small></div></div>`:"";
      return `<div class="token-model" role="group" aria-label="${esc(m.name)} 개발·검토 비용"><div class="token-model-name"><strong>${modelName(m)}</strong>${rankBadge(costRanks.get(m.id),"전체 모델 개발·검토 합계 비용이 적은 순서")}</div><div class="token-pair">${parts}${total}</div></div>`;
    };
    const renderRates=group=>{
      const shared=group.id === "credits" && group.rows.every(({rate})=>numeric(rate?.usdPerCredit) && rate.usdPerCredit === group.rows[0].rate.usdPerCredit);
      if(shared) return `<div class="cost-rates cost-rates-common"><div class="cost-rate cost-credit-common"><div class="cost-credit-meta"><span>공통 적용 단가</span><p>${group.rows.map(({m})=>modelName(m)).join('<span class="model-separator" aria-hidden="true"> · </span>')}</p></div><div class="cost-rate-price"><strong>${unitUsd(group.rows[0].rate.usdPerCredit)}<small> / 크레딧</small></strong><p class="cost-rate-formula">구독 ${unitUsd(creditTerms.subscriptionUsd).replace(/\.00$/,"")} ÷ ${number(creditQuote.credits)}크레딧</p></div></div></div>`;
      return `<div class="cost-rates">${group.rows.map(({m,rate})=>`<div class="cost-rate"><span>${modelName(m)}</span><div class="cost-rate-price"><strong>${unitUsd(rate?.method === "credits"?rate.usdPerCredit:rate?.usdPerMillion)}<small> / ${rate?.method === "credits"?"크레딧":"1M 토큰"}</small></strong>${rate?.compactFormula?`<p class="cost-rate-formula">${esc(rate.compactFormula)}</p>`:""}</div></div>`).join("")}</div>`;
    };
    const renderBasisHeading=group=>{
      const token=group.id === "tokens";
      const denominator=token?"지급 토큰량 × 지급 횟수":"지급 크레딧량";
      const mark=token?'<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/>':'<circle cx="12" cy="12" r="9"/><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v12"/>';
      return `<header class="cost-basis-heading"><h3 id="cost-basis-${group.id}"><span class="cost-basis-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${mark}</svg></span>${group.title}</h3><div class="cost-basis-equation" role="math" aria-label="구독료 ÷ ${token?`(${denominator})`:denominator}"><span class="cost-equation-numerator" aria-hidden="true">구독료</span><span class="cost-equation-denominator" aria-hidden="true">${denominator}</span></div></header>`;
    };
    const axis=`<div class="token-axis" aria-hidden="true"><span>공통 눈금</span><div><span>$0</span><span>${usd(scale/2,scale%2?1:0)}</span><span>${usd(scale,0)}</span></div></div>`;
    $("cost-sections").innerHTML=groups.map(group=>`<section class="cost-basis-section" data-cost-basis="${group.id}" aria-labelledby="cost-basis-${group.id}">${renderBasisHeading(group)}${renderRates(group)}${group.id === "tokens"?`<div class="cost-rate-notes"><p>${group.note}</p></div>`:""}${group.id === "credits"?renderOptions():""}<figure class="chart-panel cost-panel compact-chart" aria-labelledby="cost-chart-title-${group.id}"><figcaption><strong id="cost-chart-title-${group.id}">${group.title} 개발·검토 비용 비교</strong><span>순위: 전체 모델 합계 비용이 적은 순</span></figcaption><div class="chart-legend"><span><i class="swatch time-dev"></i>개발</span><span><i class="swatch time-review"></i>검토</span></div><div id="cost-chart-${group.id}" class="token-chart cost-chart compact-totals" role="region" aria-label="${group.title} 모델별 개발·검토 비용">${axis}${group.rows.map(renderRow).join("")}</div></figure></section>`).join("");
    $("cost-rate-table").innerHTML=table(["모델","계산 기준","적용 단가","근거"],rows.map(({m,rate,cost})=>[modelName(m),cost.method === "credits"?"HRMS 기록 크레딧":"합계 토큰",rateLabel(rate),esc(rate?.scope || rate?.basis || "자료 없음")]),"cost-rate-table");
    $("cost-detail-table").innerHTML=table(["모델","개발 크레딧","검토 크레딧","개발 비용","검토 비용","합계"],rows.map(({m,rate,cost})=>[modelName(m),cost.method === "credits"?number(rate.devCredits):"—",cost.method === "credits"?number(rate.reviewCredits):"—",usd(cost.dev.usd,6),usd(cost.review.usd,6),usd(cost.usd,6)]),"cost-detail-table");
  }

  $("cost-sections").addEventListener("click",event=>{
    const button=event.target.closest("button[data-cost-option]");
    if(!button || !Object.hasOwn(costOptions,button.dataset.costOption)) return;
    const key=button.dataset.costOption;
    costOptions[key]=!costOptions[key];
    renderCosts();
    $(button.id).focus({preventScroll:true});
  });

  function renderPlans() {
    const pricing=D.pricing;
    const usd=cents=>new Intl.NumberFormat("en-US",{style:"currency",currency:pricing.currency,minimumFractionDigits:0,maximumFractionDigits:2}).format(cents/100);
    const quotes=pricing.plans.map(plan=>({plan,quote:window.PLAN_PRICING.quote(plan,planState)}));
    $("plan-promotion").setAttribute("aria-pressed",String(planState.promotion));
    $("plan-yearly").setAttribute("aria-pressed",String(planState.yearly));
    $("plan-bonus").setAttribute("aria-pressed",String(planState.bonus));
    for(const key of ["promotion","yearly","bonus"]) $("plan-"+key).querySelector(".plan-toggle-state").textContent=planState[key]?"적용 중":"미적용";
    $("plan-results").innerHTML=`<div class="plan-card-grid">${quotes.map(({plan,quote:q})=>`<article class="plan-card plan-${esc(plan.id)}"><div class="plan-card-top"><span>${esc(plan.audience)}</span><span class="badge ${q.referenceOnly?"badge-amber":"badge-neutral"}">${q.referenceOnly?"할인 제외 참고값":planState.yearly?"연 결제 표시가":q.promotionApplied?"프로모션 표시가":"월 결제 표시가"}</span></div><h3>${esc(plan.name)}</h3><div class="plan-price-block"><div class="plan-price-line"><div class="plan-price"><strong>${usd(q.monthlyCents)}</strong><span>/ 월${plan.id==="team"?" · 1좌석":""}</span></div>${planState.yearly?`<div class="plan-annual-total"><span>1년 총 청구액</span><strong>${usd(q.billedCents)}<small> / 년</small></strong></div>`:""}</div>${planState.yearly?"":`<div class="plan-billing"><span>월 결제 · 12개월 단순 합계</span><strong>${usd(q.monthlyCents*12)}</strong></div>`}</div><div class="plan-discount">${planState.yearly?`<span class="badge ${q.discountPercent?"badge-blue":"badge-neutral"}">${fixed(q.discountPercent,0)}% 연 결제 할인</span><small>표시 월 ${usd(plan.listedMonthlyCents)} 대비</small>`:q.promotionApplied?'<span class="badge badge-blue">프로모션 가격 적용</span>':`<span>${planState.promotion?"가격 프로모션 미표기":"연 결제 할인 미적용"}</span>`}</div><div class="plan-credit"><span>${numeric(q.monthlyMaxCredits)?"월 최대 크레딧 · 30일 기준":"월 제공 크레딧"}</span><strong>${number(q.monthlyMaxCredits ?? q.monthlyCredits)}<small> 크레딧</small></strong><p class="plan-credit-breakdown">기본 ${number(q.baseCredits)}${numeric(q.activityCredits)?` + 활동보상 ${number(q.activityCredits)}`:""}${planState.bonus?` + 보너스 ${number(q.bonusCredits)}`:""}</p>${numeric(plan.dailyReward)?`<p class="plan-daily-reward" title="30일 모두 활동 보상 조건 충족 시">일 ${number(plan.dailyReward)} · ${q.activityDays}일 활동보상 최대 <strong>${number(q.activityCredits)}</strong></p>`:""}${planState.bonus?`<small class="plan-bonus-scope">${esc(plan.bonusNote)}</small>`:""}</div><div class="plan-card-features"><span>${esc(plan.featureTitle)}</span><ul>${plan.features.map(feature=>`<li${feature===plan.featureHighlight?' class="plan-feature-highlight"':""}>${esc(feature)}</li>`).join("")}</ul></div></article>`).join("")}</div><div class="plan-difference"><span>${planState.yearly?"월 환산 차액":planState.promotion?"월 요금 차액":"월 참고가격 차액"}</span><strong>Team이 ${usd(quotes[1].quote.monthlyCents-quotes[0].quote.monthlyCents)} 더 높습니다</strong><small>${planState.yearly?"Pro 연$96 · Team 연$480/좌석 · 연 단위 청구":planState.promotion?"개인1명과 팀1좌석 기준 · 문서의 프로모션 표시가 적용":"개인1명과 팀1좌석 기준 · Pro 정상 청구가는 미확인"}</small></div>`;
  }

  function renderAppendix() {
    const benchmark=D.reviewBenchmark;
    if(!benchmark) return;
    const companyOrder=m=>({OpenAI:0,Anthropic:1}[m.provider.name] ?? 2);
    const rows=[...benchmark.models].sort((a,b)=>companyOrder(a)-companyOrder(b) || a.subscriptionCostCents-b.subscriptionCostCents || a.sourceOrder-b.sourceOrder);
    const maxReviewCost=Math.max(...rows.map(m=>m.subscriptionCostCents),1);
    const reviewRank=(m,key,descending=false)=>1+rows.filter(other=>descending?other[key]>m[key]:other[key]<m[key]).length;
    const reviewRankBadge=(rank,label)=>`<span class="review-rank" aria-label="${esc(label)} ${rank}위">${rank}위</span>`;
    const reviewBar=(value,max,kind)=>`<span class="review-metric-track review-metric-${kind}" aria-hidden="true"><span style="width:${Math.min(100,Math.max(0,value/max*100)).toFixed(2)}%"></span></span>`;
    const money=cents=>`$${(cents/100).toFixed(2)}`;
    const shortDuration=seconds=>`${seconds>=60?Math.floor(seconds/60)+"분 ":""}${seconds%60}초`;
    const name=(m,withGroup=false)=>`<strong class="appendix-model-name">${modelName(m)}</strong><span class="cell-sub${withGroup?" appendix-model-meta":""}">${withGroup?`<span>${esc(m.provider.name)}</span><span class="appendix-group${m.group === "핵심"?" appendix-group-core":""}">${esc(m.group)}</span>`:esc(m.provider.name)}</span>`;
    $("review-benchmark-table").innerHTML=`<table class="appendix-table"><thead><tr><th scope="col">모델</th><th scope="col" class="num">평균 탐지율 <span class="review-direction" aria-hidden="true">↑</span><small>평균 발견 건수 / 확정 ${benchmark.confirmedFindings}건</small></th><th scope="col" class="num">평균 시간<small>리뷰 1건</small></th><th scope="col" class="num">구독 환산액 <span class="review-direction" aria-hidden="true">↓</span><small>리뷰 ${benchmark.reviewCases}건 1회 · 참고</small></th></tr></thead><tbody>${rows.map((m,i)=>`<tr${i>0&&companyOrder(m)!==companyOrder(rows[i-1])?' class="appendix-company-start"':""}><td>${name(m,true)}</td><td class="num appendix-findings"><div class="review-metric-value">${reviewRankBadge(reviewRank(m,"reportedFindingPercent",true),"탐지율이 높은 순")}<strong>${m.reportedFindingPercent}%</strong><span class="appendix-secondary">(${number(m.averageFindings)}건)</span></div>${reviewBar(m.reportedFindingPercent,100,"findings")}</td><td class="num">${shortDuration(m.averageReviewSeconds)}</td><td class="num appendix-cost"><div class="review-metric-value">${reviewRankBadge(reviewRank(m,"subscriptionCostCents"),"구독 환산액이 낮은 순")}<strong>${m.subscriptionCostCents === 0?"무료":money(m.subscriptionCostCents)}</strong></div>${reviewBar(m.subscriptionCostCents,maxReviewCost,"cost")}</td></tr>`).join("")}</tbody></table>`;
    $("review-detail-table").innerHTML=table(["모델","정밀도","HIGH 이상 1 / 2회차","입력 / 출력 토큰","OpenRouter 참고액","구독 환산 근거"],rows.map(m=>[name(m),`${m.precisionPercent}%`,m.highFindings.join(" / "),`${number(m.inputTokens)} / ${number(m.outputTokens)}`,money(m.openRouterCostCents),esc(m.costBasisNote || "원문 구독 환산액")]),"appendix-detail-table");
  }

  $("plan-promotion").addEventListener("click",()=>{planState.promotion=!planState.promotion;renderPlans();});
  $("plan-yearly").addEventListener("click",()=>{planState.yearly=!planState.yearly;renderPlans();});
  $("plan-bonus").addEventListener("click",()=>{planState.bonus=!planState.bonus;renderPlans();});

  $("model-select").addEventListener("change",e=>{state.model=e.target.value;renderModel();});
  $("menu-toggle").addEventListener("click",()=>{
    const open=document.body.classList.toggle("nav-open");$("menu-toggle").setAttribute("aria-expanded",String(open));
  });
  const closeMenu=()=>{document.body.classList.remove("nav-open");$("menu-toggle").setAttribute("aria-expanded","false");};
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("nav-open")){closeMenu();$("menu-toggle").focus();}});
  const reportGroups = {
    overview:{label:"핵심 요약",sections:["overview"]},
    performance:{label:"성능 비교",sections:["comparison","quality","usage"]},
    cost:{label:"비용 비교",sections:["costs","plans"]},
    adoption:{label:"도입 판단·근거",sections:["method","decision"]},
    appendix:{label:"부록",sections:["appendix"]}
  };
  const sectionLabels = {overview:"핵심 요약",quality:"완성도·API 통과율",usage:"토큰·소요 시간",comparison:"결론",costs:"비용",plans:"Codebuddy 요금제",method:"평가 방법·근거",decision:"결론과 다음 단계",appendix:"코드 리뷰 벤치마크"};
  const reportSections = [...document.querySelectorAll("main>.section")];
  reportSections.forEach(section => section.setAttribute("tabindex","-1"));
  const navLinks = [...document.querySelectorAll("#main-nav a")];
  const rememberedSections = {overview:"overview",performance:"comparison",cost:"costs",adoption:"method",appendix:"appendix"};
  const groupForSection = id => Object.keys(reportGroups).find(key => reportGroups[key].sections.includes(id));
  function resolveReportTarget(hash) {
    let targetId;
    try { targetId = decodeURIComponent(hash.replace(/^#/, "")); } catch { return null; }
    if(targetId === "risks") targetId = "method";
    const target = document.getElementById(targetId);
    const section = target?.closest("main>.section");
    return section ? {sectionId:section.id,target} : null;
  }
  function showReportSection(id,{target=null,scroll=true}={}) {
    const groupId = groupForSection(id);
    if(!groupId) return;
    const group = reportGroups[groupId];
    rememberedSections[groupId] = id;
    reportSections.forEach(section => { section.hidden = section.id !== id; section.classList.toggle("is-active", section.id === id); });
    navLinks.forEach(link => {
      const active = link.dataset.reportGroup === groupId;
      link.classList.toggle("active",active);
      if(active) link.setAttribute("aria-current","page"); else link.removeAttribute("aria-current");
    });
    $("view-breadcrumb").textContent = groupId === "overview" ? "벤치마크 / 핵심 요약" : `벤치마크 / ${group.label} / ${sectionLabels[id]}`;
    const sectionNav = $("section-nav");
    sectionNav.hidden = group.sections.length === 1;
    sectionNav.setAttribute("aria-label",`${group.label} 상세 메뉴`);
    sectionNav.innerHTML = group.sections.length === 1 ? "" : group.sections.map(sectionId => `<a href="#${sectionId}"${sectionId === id ? ' class="active" aria-current="page"' : ""}>${sectionLabels[sectionId]}</a>`).join("");
    closeMenu();
    if(scroll) {
      $(id).focus({preventScroll:true});
      if(target && target.id !== id) target.scrollIntoView({block:"start"});
      else window.scrollTo({top:0,behavior:"instant"});
    }
  }
  document.addEventListener("click",event => {
    if(event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if(!link) return;
    const hash = link.dataset.reportGroup ? `#${rememberedSections[link.dataset.reportGroup]}` : link.hash;
    const route = resolveReportTarget(hash);
    if(!route) return;
    event.preventDefault();
    if(location.hash !== hash) history.pushState(null,"",hash);
    showReportSection(route.sectionId,{target:route.target});
  });
  window.addEventListener("hashchange",() => {
    const route = resolveReportTarget(location.hash);
    if(route) showReportSection(route.sectionId,{target:route.target});
    else if(!location.hash) showReportSection("overview");
  });
  let printSnapshot=null;
  window.addEventListener("beforeprint",()=>{
    if(printSnapshot)return;
    printSnapshot={state:{...state},open:[...document.querySelectorAll("details")].map(d=>[d,d.open])};
    renderQuality();renderTokens();
    document.querySelectorAll("details").forEach(d=>{d.open=true;});
  });
  window.addEventListener("afterprint",()=>{
    if(!printSnapshot)return;
    const snapshot=printSnapshot;printSnapshot=null;Object.assign(state,snapshot.state);
    renderQuality();renderTokens();snapshot.open.forEach(([d,open])=>{if(d.isConnected)d.open=open;});
  });
  $("print-button").addEventListener("click",()=>window.print());

  renderOverview();renderStatic();renderQualityTable();renderQuality();renderModel();renderTokens();renderTime();renderComparison();renderCosts();renderPlans();renderAppendix();
  const initialRoute = resolveReportTarget(location.hash);
  showReportSection(initialRoute?.sectionId ?? "overview",{target:initialRoute?.target,scroll:Boolean(initialRoute)});
})();
