import { createStatementData } from "./createStatementData";

export function statement(invoice: any, plays: any) {
  return renderPlainText(createStatementData(invoice, plays));
}
function renderPlainText(data: any) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`
  return result
}
export function htmlStatement(invoice: any, plays: any) {
  return renderHtml(createStatementData(invoice, plays));
}
function renderHtml(data: any) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result = `<table>\n`;
  result = `<tr><th>play</th><th>seats</th><th>cost</th></tr>\n`;
  for (let perf of data.performances) {
    // print line for this order
    result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += `</table>\n`
  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`
  return result
}
function usd(aNumber: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber/100)
}
