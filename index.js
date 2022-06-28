import createStatementData from './createStatementData';

// 打印账单详情
function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data, plays) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    // print line for this order
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber);
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
}
