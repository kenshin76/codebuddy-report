"use strict";

// Prices are the supplied document's snapshot, never live checkout quotes.
window.PLAN_PRICING = Object.freeze({
  quote(plan, {promotion = false, yearly = false, bonus = false} = {}) {
    const monthlyCents = yearly ? plan.yearlyCents / 12 : promotion ? plan.listedMonthlyCents : plan.referenceMonthlyCents;
    const promotionApplied = promotion && !yearly && plan.listedMonthlyCents < plan.referenceMonthlyCents;
    const discountPercent = yearly ? (1 - plan.yearlyCents / (plan.listedMonthlyCents * 12)) * 100 : 0;
    const activityDays = 30;
    const activityCredits = plan.dailyReward === null ? null : plan.dailyReward * activityDays;
    const monthlyCredits = plan.baseCredits + (bonus ? plan.bonusCredits : 0);
    return {
      monthlyCents,
      promotionApplied,
      billedCents: yearly ? plan.yearlyCents : monthlyCents,
      billingPeriod: yearly ? "year" : "month",
      discountPercent: Math.round(discountPercent * 100) / 100,
      baseCredits: plan.baseCredits,
      bonusCredits: bonus ? plan.bonusCredits : 0,
      monthlyCredits,
      activityDays,
      activityCredits,
      monthlyMaxCredits: activityCredits === null ? null : monthlyCredits + activityCredits,
      referenceOnly: !yearly && !promotion && plan.referenceUnconfirmed
    };
  }
});
