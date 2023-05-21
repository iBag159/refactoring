export function statement(invoice: any, plays: any) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: {},
    totalVolumeCredits: {}
  }
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  console.log(statementData);
  return renderPlainText(statementData);

  function totalVolumeCredits(data: any) {
    let result = 0
    for (let perf of data.performances) {
      // add volume credits
      result += perf.volumeCredits;
    }
    return result
  }
  function totalAmount(data: any) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount
    }
    return result;
  }
  function enrichPerformance(aPerformance: any) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
  function volumeCreditsFor(aPerformance: any) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if ('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5)
    return result
  }
  function amountFor(aPerformance: any) {
    let result = 0
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
        break
      default:
        throw new Error(`Unknown type: ${aPerformance.play.type}`)
    }
    return result
  }
  function playFor(aPerformance: any) {
    return plays[aPerformance.playID]
  }
}

function renderPlainText(data: any) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    // print line for this order
    result += `${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`
  }
  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`
  return result


  function usd(aNumber: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber)
  }

}
