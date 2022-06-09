/**
 * 顶层的statement函数现在只剩7行代码，而且它处理的都是与打印详单相关的逻辑。
 * 与计算相关的逻辑从主函数中被移走，改由一组函数来支持。
 * 每个单独的计算过程和详单的整体结构，都因此变得更易理解了
 */

// 打印账单详情
function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  /**
   * amountFor函数中play变量是由performance计算而来，没必要作为参数传入。
   * 分解一个长函数时，作者喜欢将play这样的变量移除掉，他们作为具有局部作用域的临时变量，使函数提炼更加复杂。
   * 
   * 查找play变量代码在每次循环中只执行1次，而重构后执行了3次，这里改动不太会对性能构成严重影响，及时有影响
   * 后续在对结构良好的代码进行性能调优，也容易的多
   */
  function amountFor(perf) {
    let result = 0;
    switch (playFor(perf).type) {
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
        throw new Error(`unknown type: ${playFor(perf).type}`);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}

function volumeCreditsFor(perf) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ('comedy' === playFor(perf).type) 
    result += Math.floor(perf.audience / 5);
  return result;    
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber);
}

function totalVolumeCredits() {
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
}

/**
 *    重构至此，让我先暂停一下，谈谈刚刚完成的修改。首先，我知道有些读者会再次对此修改可能带来的性能问题感到担忧，
 * 我知道很多人本能地警惕重复的循环。但大多数时候，重复一次这样的循环对性能的影响都可忽略不计。
 * 如果你在重构前后进行计时，很可能甚至都注意不到运行速度的变化——通常也确实没什么变化。
 * 许多程序员对代码实际的运行路径都所知不足，甚至经验丰富的程序员有时也未能避免。
 * 在聪明的编译器、现代的缓存技术面前，我们很多直觉都是不准确的。
 * 软件的性能通常只与代码的一小部分相关，改变其他的部分往往对总体性能贡献甚微。
 * 
      当然，“大多数时候”不等同于“所有时候”。有时，一些重构手法也会显著地影响性能。
  但即便如此，我通常也不去管它，继续重构，因为有了一份结构良好的代码，回头调优其性能也容易得多。
  如果我在重构时引入了明显的性能损耗，我后面会花时间进行性能调优。进行调优时，可能会回退我早先做的一些重构——但更多时候，
  因为重构我可以使用更高效的调优方案。最后我得到的是既整洁又高效的代码。
  因此对于重构过程的性能问题，我总体的建议是：大多数情况下可以忽略它。如果重构引入了性能损耗，先完成重构，再做性能优化
 *  */ 

function totalAmount() {
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf);
  }
  return result
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

