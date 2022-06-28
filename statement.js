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

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>';
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></td>\n`;
  }
  result += '</table>\n';
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(aNumber) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(aNumber);
}

/**
 * 作者的回顾总结:
  * 代码行数由我开始重构时的44行增加到了70行，
  * 这主要是将代码抽取到函数里带来的额外包装成本。
  * 虽然代码的行数增加了，
  * 但重构也带来了代码可读性的提高。
  * 额外的包装将混杂的逻辑分解成可辨别的部分，
  * 分离了详单的计算逻辑与样式。
  * 这种模块化使我更容易辨别代码的不同部分，了解它们的协作关系。
  * 虽说言以简为贵，但可演化的软件却以明确为贵。
  * 通过增强代码的模块化，我可以轻易地添加HTML版本的代码，而无须重复计算部分的逻辑
  * 
  * 营地法则无异：保证离开时的代码库一定比你来时更加健康。
  * 完美的境界很难达到，但应该时时都勤加拂拭。
 */