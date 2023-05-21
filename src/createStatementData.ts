class PerformanceCalculator {
  play: any;
  performance: any;

  constructor(aPerformance: any, aPlay: any) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount () {
    throw new Error("Subclass responsibility");
    return 0; // typescript things...
  }
  get volumeCredits () {
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }
    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits () {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator (aPerformance: any, aPlay: any) {
  switch (aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`Unknown type: ${aPlay.type}`)
  }
}

export function createStatementData (invoice: any, plays: any) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
    totalAmount: {},
    totalVolumeCredits: {},
  }
  statementData.totalAmount = totalAmount(statementData)
  statementData.totalVolumeCredits = totalVolumeCredits(statementData)
  return statementData;

  function enrichPerformance (aPerformance: any) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result
  }

  function playFor (aPerformance: any) {
    return plays[aPerformance.playID]
  }
  function totalAmount (data: any) {
    return data.performances.reduce((total: any, p: any) => total + p.amount, 0);
  }

  function totalVolumeCredits (data: any) {
    return data.performances.reduce((total: any, p: any) => total + p.volumeCredits, 0);
  }
}
