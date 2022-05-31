
// 打印账单详情
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  for (let perf of invoice.performances) {
    // const play = playFor(perf);
    
    let thisAmount = amountFor(perf, playFor(perf));
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every tencomedy attendees
    if ('comedy' === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
    // print line for this order
    result += ` ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  /**
   * amountFor函数中play变量是由performance计算而来，没必要作为参数传入。
   * 分解一个长函数时，作者喜欢将play这样的变量移除掉，他们作为具有局部作用域的临时变量，使函数提炼更加复杂。
   */
  function amountFor(perf, play) {
    let result = 0;
    switch (play.type) {
      case 'tragedy': // 悲剧
        result = 40000;
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy': // 喜剧
        result = 30000;
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20);
        }
        result += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}

// 用上面的数据文件（invoices.json和plays.json）作为测试输入，运行这段代码，会得到如下输出：
const invocies = require('./invoices');
const plays = require('./play');
console.log(statement(invocies, plays));

// 输出结果
// Statement for BigCo
//  Hamlet: $650.00 (55 seats)
//  As You Like It: $580.00 (35 seats)
//  Othello: $500.00 (40 seats)
// Amount owed is $1,730.00
// You earned 47 credits

