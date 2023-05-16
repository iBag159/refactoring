import { statement } from "../statement"
import plays from '../data/plays.json';
import invoices from '../data/invoices.json';

describe("Statement", () => {
  it("should returns", () => {
    const result = statement(invoices[0], plays);
    expect(result).toBe(`Statement for BigCo\nHamlet: $650.00 (55 seats)\nAs You Like It: $580.00 (35 seats)\nOthello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits\n`);
  })
})