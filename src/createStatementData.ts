class PerformanceCalculator {
  play: any;
  performance: any;

  constructor(aPerformance: any, aPlay: any) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`Unknown type: ${this.play.type}`)
    }
    return result
  }
}

export function createStatementData(invoice: any, plays: any) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: {},
    totalVolumeCredits: {},
  }
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData;

  function enrichPerformance(aPerformance: any) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play;
    result.amount = amountFor(result)
    result.volumeCredits = volumeCreditsFor(result)
    return result
  }

  function playFor(aPerformance: any) {
    return plays[aPerformance.playID]
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
  function volumeCreditsFor(aPerformance: any) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if ('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5)
    return result
  }
  function totalAmount(data: any) {
    return data.performances.reduce((total: any, p: any) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: any) {
    return data.performances.reduce((total: any, p: any) => total + p.volumeCredits, 0);
  }
}