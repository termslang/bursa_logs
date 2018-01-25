exports.help0 = `
 ------------------------------------------------------------
|          BURSA DECENTRALISED ERC20, ERC223, ERC721         |
|                  TOKEN EXCHANGE TERMINAL                   |
|____________________________________________________________|

help 1 - registration and approval of tokens
help 2 - exploring markets
help 3 - managing your account
help 4 - buying, selling, placing orders
help 5 - advanced


`
var help1 = `
1. REGISTER AND APPROVE ERC20, ERC223, ERC721 TOKENS

token 0x021A8a8779AD0830CAfDaA73e777463c8BB8b2cc
                    - Request token info
token XYZ 0x021A8a8779AD0830CAfDaA73e777463c8BB8b2cc
                    - Register new token with name XYZ, address
                      0x021A8a8779AD0830CAfDaA73e777463c8BB8b2cc
token XYZ 0         - Unregister XYZ token
token               - List all registered tokens
approve XYZ         - Approve all your XYZ tokens for trading
approve XYZ 500     - Approve 500 XYZ tokens for trading


`
var help2 = `
2. EXPLORE MARKETS

list XYZ               - Show orders on XYZ tokens
list XYZ supply        - Show sell orders on XYZ tokens
list XYZ demand        - Show buy orders on XYZ tokens
list XYZ TWT           - Show orders on XYZ TWT pair
list XYZ TWT supply    - Show orders selling XYZ for TWT
list XYZ TWT demand    - Show orders buying XYZ for TWT


`
var help3 = `
3. MANAGE YOUR ACCOUNT

unlock secret         - Unlock your account with password 'secret'
deposit 0.1           - Deposit 0.1 ether to Bursa
withdraw 10           - Withdraw 10 ether from Bursa. If you have less, withdraw all
balance               - Show your deposited ether and tokens approved for trading

| NOTE:
| To approve all your XYZ tokens, type in "approve XYZ".
| DO NOT DEPOSIT ANY TOKENS! Only approve them!


`
var help4 = `
4. BUY, SELL, PLACE ORDERS!

buy 100 XYZ                          - Buy 100 XYZ tokens at market price
buy 100 XYZ with TWT                 - Buy 100 XYZ tokens at market price, pay with TWT
sell 100 XYZ                         - Sell 100 XYZ tokens at market price
buy 100 XYZ with TWT                 - Sell 100 XYZ tokens at market price, get TWT

buy 100 XYZ price 0.001 ether        - Buy 100 XYZ tokens at price
                                       not more than 0.001 ether
sell 100 XYZ price 0.001 ether       - Sell 100 XYZ tokens at price
                                       not less than 0.001 ether
trade 50 TWT for 100 XYZ             - Trade 50 TWT for not less than 100 XYZ
trade 50 TWT price 2 XYZ             - Trade 50 TWT at price not less
                                       than 2 XYZ each

will buy 100 XYZ price 0.001 ether   - Place order to buy 100 XYZ tokens
                                       with price not more than 0.001
will sell 100 XYZ price 0.001 ether  - Place order to sell 100 XYZ tokens
                                       with price not more than 0.001
will trade 50 TWT for 100 XYZ        - Place order to trade 50 TWT for
                                       not less than 100 XYZ
orders                               - Show orders you placed
cancel 1                             - Cancel order #1


`
var help5 = `
5. ADVANCED

gasprice 20000000000              - Set gas price 20000000000 for all transactions
collect                           - List collectibles for sale
sell KITTY 3 price 10 ether       - Sell collectible KITTY #3 for 10 ether
buy KITTY 3                       - Buy collectible KITTY #3 at the cheapest price

`


module.exports.showHelp = (word) => {
  if (word == '1') {
    console.log(help1);
  }
  else if (word == '2') {
    console.log(help2);
  }
  else if (word == '3') {
    console.log(help3);
  }
  else if (word == '4') {
    console.log(help4);
  }
  else if (word == '5') {
    console.log(help5);
  }
  else {
  console.log(exports.help0 + help1 + help2 + help3 + help4 + help5);
  }
}


var compiled = require('./compiled.js');
var deployed = require('./deployed.js');


const fs = require('fs');
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
exports.web3 = web3;
// var web3;
// if (typeof web3 !== 'undefined') {
//   web3 = new Web3(Web3.givenProvider || web3.currentProvider);
// }

var acc;
var acc0;
var gasPrice = '20000000000';
exports.acc0 = acc0;
exports.gasPrice = gasPrice;
exports.connect = connect;

async function connect() {
  acc = await web3.eth.getAccounts();
  web3.eth.defaultAccount = acc[0];
  acc0 = web3.eth.defaultAccount;
  web3.eth.coinbase = acc0;
  bursa = await new web3.eth.Contract(compiled.bursa_abi, deployed.bursa_address,
      { from: acc0, gasPrice: gasPrice });
}
connect();

var data;
try {
  data = require('./data.json');
  data.tokens.forEach(function (t) {
    if (t.symbol == 'BUR') {
      t.address = deployed.bursa_address;
    }
  });
} catch (e) {
  data = Object();
  data.tokens = [];
  data.orders = [];
  data.block = 0;
}
exports.data = data;


function toWei(amount) {
  return web3.utils.toWei(amount.toString(), 'ether');
}
function fromWei(amount) {
  return web3.utils.fromWei(amount.toString(), 'ether');
}
function decimalsZeroes(n) {
  var out = 1;
  while (n > 0) {
    out *= 10;
    --n;
  }
  return out;
}
function zeroesDecimals(n) {
  var out = 0;
  while (n % 10 == 0) {
    n /= 10;
    ++out;
  }
  if (n != 1) {
    out = n;
  }
  return out;
}
async function saveData() {
  var json = JSON.stringify(data);
  fs.writeFile('data.json', json, 'utf8', function(err) {
    if (err) console.log('ERROR: Can\'t write to file');
  });
}
async function bursaOffline() {
  var symbol = await bursa.methods.symbol().call({ from: acc0 });
  if (symbol == 'BUR') {
    return false;
  }
  else if (symbol == 'exBUR') {
    console.log('Bursa at ' + bursa.options.address + ' is inactive.');
    return true;
  }
  else {
    console.log('Address ' + bursa.options.address + ' is not Bursa.');
    return true;
  }
}
exports.bursaOffline = bursaOffline;








exports.tokenFromAddress = tokenFromAddress;
exports.tokenFromSymbol = tokenFromSymbol;

async function tokenFromAddress(address) {
  var out = Object();
  if (address == '0x0000000000000000000000000000000000000000') {
    out.decimals = decimalsZeroes(18);
    out.address = address;
    out.symbol = 'ether'
    return out;
  }
  try {
    var token = new web3.eth.Contract(compiled.erc20_abi, address, 0);
    out.decimals = decimalsZeroes(await token.methods.decimals().call({ from: acc0 }));
  } catch (e) {
  }
  out.address = address;
  out.symbol = '[' + address + ']'
  data.tokens.forEach(function (t) {
    if (t.address == address) {
      out = t;
    }
  });
  return out;
}
async function tokenFromSymbol(symbol) {
  var out = Object();
  if (symbol == 0 || symbol == 'ether') {
    out.symbol = 'ether';
    out.decimals = decimalsZeroes(18);
    out.address = '0x0000000000000000000000000000000000000000';
  }
  else {
    data.tokens.forEach(function (t) {
      if (t.symbol == symbol) {
        out = t;
      }
    });
  }
  return out;
}



// 1. TOKENS
exports.showTokens = showTokens;
exports.addToken = addToken;
exports.removeToken = removeToken;
exports.approveBursa = approveBursa;

function showTokens() {
  try {
    data.tokens.forEach(function (t) {
      var dec_str;
      if (dec_str == 777) {
        dec_str = 'ERC721 ';
      } else {
        dec_str = '1e+' + zeroesDecimals(t.decimals) + '  ';
      }
      console.log(dec_str + '[' + t.address + '] ' + t.symbol + ' ' + t.name);
    });
  } catch(e) {
    console.log('FAIL', e);
    return;
  }
}
async function addToken(symbol, address) {
  if (address == 0) {
    await removeToken(symbol);
    return;
  }
  var token;
  try {
    token = new web3.eth.Contract(compiled.erc20_abi, address, 0);
  } catch (e) {
    console.log('Invalid token');
    return;
  }
  try {
    var totalSupply = await token.methods.totalSupply().call({ from: acc0 });
  } catch(e) {
    console.log('ERROR: ' + address + ' is not a token');
    return;
  }
  try {
    var name = await token.methods.name().call({ from: acc0 });
  } catch (e) {
    console.log('WARNING: Token has no name');
  }
  try {
    var decimals = decimalsZeroes(await token.methods.decimals().call({ from: acc0 }));
  } catch (e) {
    decimals = 777;
    console.log('WARNING: Token has no decimals');
  }
  var t = new Object();
  t.address = token.options.address
  t.name = name;
  t.symbol = symbol;
  t.decimals = decimals;
  function tokenUnique(value) {
    var out = true;
    data.tokens.forEach(function (t) {
      if (t['address'] == value['address']) {
        out = false;
      }
    });
    return out;
  }
  function symbolUnique(symbol) {
    var out = true;
    data.tokens.forEach(function (t) {
      if (symbol == t.symbol) {
        out = false;
      }
    });
    return out;
  }
  if (tokenUnique(t)) {
    if (symbolUnique(symbol) == false) {
      console.log('Token ' + symbol + ' already exists. \"token ' + symbol + ' 0\" to remove the token');
      return;
    }
    data.tokens.push(t);
    data.tokens = data.tokens.sort(function(a, b) {
      return b.symbol < a.symbol;
    });

    console.log(symbol + ' added');
    await saveData();
  } else {
    data.tokens.forEach(async function (entry) {
      if (entry.address == t.address) {
        if (entry.symbol != t.symbol) {
          console.log('Replaced symbol ' + entry.symbol + ' with ' + t.symbol);
          entry.symbol = t.symbol;
          await saveData();
        }
      }
    });
  }
}
function removeToken(symbol) {
  var i = 0;
  while (data.tokens[i]) {
    if (data.tokens[i].symbol == symbol) {
      data.tokens.splice(i,1);
    }
    ++i;
  }
  console.log(symbol + ' token removed');
}
async function approveBursa(symbol, amount) {
  var t = await tokenFromSymbol(symbol);
  if (Object.keys(t).length === 0) {
    console.log('Token not registered');
    return
  }
  else if (t.address == deployed.bursa_address) {
    console.log('Bursa tokens already approved');
    return;
  }
  var token =  await new web3.eth.Contract(compiled.erc20_abi, t.address, { from: acc0, gasPrice: gasPrice });
  if (amount == 0) {
    amount = await token.methods.balanceOf(acc0).call({ from: acc0 });
    if (amount == 0) {
      console.log('You have no ' + symbol + ' tokens');
      return;
    }
  }
  console.log(amount / t.decimals + ' ' + symbol + ' to approve..');
  var tx = await token.methods.approve(deployed.bursa_address, amount).send({ from: acc0, gas:1000000});
  // var allowance = await approve(amount, token, acc0, deployed.bursa_address);
 console.log('Approved ' + amount + ' ' + symbol + ' (' + fromWei(tx.gasUsed * token.options.gasPrice) + ' ether paid)');
}




// 2. LIST ORDERS
exports.listTokenOrders = listTokenOrders;
exports.listPairOrders = listPairOrders;
exports.listBothPairOrders = listBothPairOrders;
exports.listBothTokenOrders = listBothTokenOrders;
exports.listAllOrders = listAllOrders;
exports.listYourOrders = listYourOrders;


async function getOrderData(o) {
  var out = {
    event:o
  }
  var tGet = await tokenFromAddress(o.tokenGet);
  var tGive = await tokenFromAddress(o.tokenGive);
  out.symbolGet = tGet.symbol;
  out.symbolGive = tGive.symbol;
  out.decimalsTokenGet = tGet.decimals;
  out.decimalsTokenGive = tGive.decimals;
  out.amountGet = (o.amountGet / tGet.decimals).toFixed(6);
  out.amountGive = (o.amountGive / tGive.decimals).toFixed(6);
  out.priceOfTokenGet = (out.amountGive / out.amountGet).toFixed(6);
  out.priceOfTokenGive = (out.amountGet / out.amountGive).toFixed(6);
  return out;
}
async function showOrder(o, amountLeft, order_field_index) {
  var tGet = await tokenFromAddress(o.tokenGet);
  var tGive = await tokenFromAddress(o.tokenGive);
  var amountLeftGet = (amountLeft / o.decimalsTokenGet).toFixed(6);
  var amountLeftGive = (amountLeft * o.amountGive / o.event.amountGet).toFixed(6);

  if (order_field_index == 0) {
    console.log('[' + o.event.user.slice(0,6) + '..] WILL BUY \t' + amountLeftGet
    + ' ' + o.symbolGet + '\tat ' + o.priceOfTokenGet +
     ' ' + o.symbolGive + ' each'
    );
  }
  else if (order_field_index == 2) {
    console.log('[' + o.event.user.slice(0,6) + '..] WILL SELL\t'
    + amountLeftGive + ' ' + o.symbolGive
    + '\tat '
    + o.priceOfTokenGive + ' ' + o.symbolGet + ' each'
    );
  }
  else if (order_field_index == 999) {   // all orders
    console.log('[' + o.event.user.slice(0,6) + '..] WILL SELL\t'
    + amountLeftGive + ' ' + o.symbolGive
    + '\tat '
    + o.priceOfTokenGive + ' ' + o.symbolGet + ' each'
    // console.log('[' + o.event.user.slice(0,6) + '..] WILL TRADE \t'
    // + amountLeftGive + ' ' + o.symbolGive
    // + '\tfor '
    // + amountLeftGet + ' ' + o.symbolGet
    );
  }
  else if (order_field_index > 1000) {   // your orders
    console.log('[' + (order_field_index - 1000) + ']\tWILL TRADE \t'
    + amountLeftGive + ' ' + o.symbolGive
    + '\tfor '
    + amountLeftGet + ' ' + o.symbolGet
    );
  }
}
async function listTokenOrders(symbol, order_field_index) {
  await collectOrders(0);
  var tag = order_field_index == 0 ? 'symbolGet' : 'symbolGive'
  var i=0;
  while (i < data.orders.length) {
    if (data.orders[i][tag] == symbol) {
      var o = data.orders[i].event;
      if (o.user != acc0) {
        var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
        o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });
        var ord = await getOrderData(o);
        await showOrder(ord, amountLeft, order_field_index);
      }
    }
    ++i;
  }
}
async function listPairOrders(symbol1, symbol2, order_field_index) {
  var out = [];
  await collectOrders(0);
  var i=0;
  while (i < data.orders.length) {
    var tag;
    var opposite_tag;
    if (order_field_index == 0) {
      tag = 'symbolGet';
      opposite_tag = 'symbolGive';
    }
    else if (order_field_index == 2) {
      tag = 'symbolGive';
      opposite_tag = 'symbolGet';
    }
    if (data.orders[i][tag] == symbol1 && data.orders[i][opposite_tag] == symbol2) {
      var o = data.orders[i].event;
      if (o.user != acc0) {
        var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
        o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });
        var ord = await getOrderData(o);
        await showOrder(ord, amountLeft, order_field_index);
        out.push(ord);
      }
    }
    ++i;
  }
  return out;
}
async function listBothPairOrders(symbol1, symbol2) {
  console.log('SUPPLY');
  await listPairOrders(symbol1, symbol2, 2);
  console.log('DEMAND');
  await listPairOrders(symbol1, symbol2, 0);
}
async function listBothTokenOrders(symbol) {
  console.log('SUPPLY');
  await listTokenOrders(symbol, 2);
  console.log('DEMAND');
  await listTokenOrders(symbol, 0);
}
async function listAllOrders() {
  await collectOrders(0);
  var i=0;
  while (i < data.orders.length) {
    var o = data.orders[i].event;
    if (o.user != acc0) {
      var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
      o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });
      var ord = await getOrderData(o);
      await showOrder(ord, amountLeft, 999);
    }
    ++i;
  }
}
async function listYourOrders() {
  console.log('YOUR ORDERS:');
  var out = [];
  await collectOrders(0);
  var i=0;
  while (i < data.orders.length) {
    var o = data.orders[i].event;
    if (o.user == acc0) {
      var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
      o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });
      var ord = await getOrderData(o);
      out.push(ord);
      await showOrder(ord, amountLeft, 1001 + i);
    }
    ++i;
  }
  return out;
}


async function collectOrders(block) {
  var blockNumber = await web3.eth.getBlockNumber()
  var orders = await bursa.getPastEvents('Order', { fromBlock: block, toBlock: blockNumber }, async function(e, order) {});

  // tmp TODO REMOVE
  data.orders = [];

  var i=0;
  while (i < orders.length) {
    var o = orders[i].returnValues;
    var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
    o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });
    if (amountLeft > 0) {
      var ord = await getOrderData(o);
      data.orders.push(ord);
    }
    ++i;
  }
  data.block = blockNumber;

  data.orders = data.orders.sort(function(a, b) {
    if (a.priceOfTokenGet == b.priceOfTokenGet) {
      return a.event.block - b.event.block;
    }
    return b.priceOfTokenGet - a.priceOfTokenGet;
  });


  await saveData();
}



// 3. DEPOSIT, WITHDRAW, BALANCE
exports.depositEther = depositEther;
exports.withdrawEther = withdrawEther;
exports.showBalance = showBalance;

async function depositEther(amount) {
  if (await bursaOffline()) return;
  // var etherBalance = await web3.eth.getBalance(acc0);
  // // var estimate = bursa.options.gasPrice * 25000;
  // // etherBalance -= estimate;
  // if (toWei(amount) > etherBalance) {
  //   console.log(toWei(amount));
  //   console.log(etherBalance);
  //   console.log('You only have ' + fromWei(etherBalance));
  //   return;
  // }
  console.log('Depositing ' + amount + ' ether..');
  var tx = await web3.eth.sendTransaction({from:acc0, to:deployed.bursa_address, value:toWei(amount), gas:100000});
  console.log('Sent ' + amount + ' ether ' + '  (', tx.gasUsed, 'gas )');
  var etherBalance = await web3.eth.getBalance(acc0);
  var deposit = await bursa.methods.fundsOf(acc0).call({ from: acc0 });
  console.log('BALANCES of [' + acc0 + ']:\nether: ' + fromWei(deposit) + ' ether on trade account\n       ' + fromWei(etherBalance) + ' ether on main account');
}


async function withdrawEther(amount) {
  if (await bursaOffline()) return;
  var etherBalance = await web3.eth.getBalance(acc0);
  console.log('Withdrawing ' + amount + ' ether..');
  var tx = await bursa.methods.withdraw(toWei(amount)).send({ from: acc0, gas: 1000000 });
  console.log('Money was withdrawn.');
  // console.log(tx.events.Withdraw);
  var etherBalance = await web3.eth.getBalance(acc0);
  var deposit = await bursa.methods.fundsOf(acc0).call({ from: acc0 });
  console.log('BALANCES of [' + acc0 + ']:\nether: ' + fromWei(deposit) + ' ether on trade account\n       ' + fromWei(etherBalance) + ' ether on main account');
}

async function showBalance() {
  if (await bursaOffline()) return;
  var etherBalance = await web3.eth.getBalance(acc0);
  var deposit = await bursa.methods.fundsOf(acc0).call({ from: acc0 });
  console.log('BALANCES of [' + acc0 + ']:\nether: ' + fromWei(deposit) + ' ether on trade account\n       ' + fromWei(etherBalance) + ' ether on main account');

  data.tokens.forEach(async function (t) {
    var token = await new web3.eth.Contract(compiled.erc20_abi, t.address, { from: acc0, gasPrice: gasPrice });
    var b = await token.methods.balanceOf(acc0).call({ from: acc0 });

    var allowance = await token.methods.allowance(acc0, deployed.bursa_address).call({ from: acc0 });
    var not_allowed = '';
    if (b > allowance) {
      not_allowed = '  (' + ((b - allowance) / t.decimals).toFixed(6) + ' not approved )';
      b = allowance;
      console.log(t.symbol + ': ' + (b / t.decimals).toFixed(6) + not_allowed);
    }
    else {
      console.log(t.symbol + ': ' + (b / t.decimals).toFixed(6));
    }
  });
}




// 4. Make orders, trade
exports.makeOrderBuyAtPrice = makeOrderBuyAtPrice;
exports.makeOrderSellAtPrice = makeOrderSellAtPrice;
exports.makeOrder = makeOrder;

exports.matchOrders = matchOrders;
exports.makeTrade = makeTrade;



async function makeOrderBuyAtPrice(amountGet, symbolGet, priceGive, symbolGive) {
  var amountGive = priceGive * amountGet;
  await makeOrder(amountGet, symbolGet, amountGive, symbolGive);
}
async function makeOrderSellAtPrice(amountGive, symbolGive, priceGet, symbolGet) {
  var amountGet = priceGet * amountGive;
  await makeOrder(amountGet, symbolGet, amountGive, symbolGive);
}
async function makeOrder(amountGet, symbolGet, amountGive, symbolGive) {
  var tokenGet = await tokenFromSymbol(symbolGet);
  var tokenGive = await tokenFromSymbol(symbolGive);

  if (await bursaOffline()) return;
  if (tokenGive.symbol == 'ether') {
    // TODO: check balance
  }
  else {
    var token = await new web3.eth.Contract(compiled.erc20_abi, tokenGive.address, { from: acc0, gasPrice: gasPrice });
    var b = await token.methods.balanceOf(acc0).call({ from: acc0 });
    if (b < amountGive * tokenGive.decimals) {
      console.log('Not enough ' + tokenGive.symbol + ': ' + b / tokenGive.decimals);
      return;
    }
  }
  console.log('Making order to get ' + amountGet + ' ' + tokenGet.symbol + ' for ' + amountGive + ' ' + tokenGive.symbol + '..');
  var tx = await bursa.methods.order(tokenGet.address, amountGet * tokenGet.decimals,
  tokenGive.address, amountGive * tokenGive.decimals ).send({ from: acc0 });
  console.log('Order placed (' + fromWei(tx.gasUsed * bursa.options.gasPrice) + ' ether paid)');
}






async function matchOrders(symbol1, amount1, symbol2, amount2) {
  if (amount1 == 0) {
    console.log('ORDERS THAT GIVE ' + symbol2 + ' for ' + symbol1 + ':');
    var orders = await listPairOrders(symbol1, symbol2, 0);
    console.log();
    // var t1 = await tokenFromSymbol(symbol1);
    var t2 = await tokenFromSymbol(symbol2);
    var o;
    // var rest = amount1 * t1.decimals;
    var rest = amount2 * t2.decimals;

    console.log('rest', rest);
    var i=0;
    while (i < orders.length && rest) {
      console.log('Trying order #' + i+1 + ', amount to buy:', rest/t2.decimals, t2.symbol);
      ord = orders[i];
      var o = ord.event;

      var amountLeft = await bursa.methods.amountLeft(o.tokenGet, o.amountGet,
      o.tokenGive, o.amountGive, o.block, o.user).call({ from: acc0 });

      showOrder(ord, amountLeft, 999);

      // rest = await makeTrade(ord, rest);
      rest = await makeTrade(ord, rest * ord.priceOfTokenGive);
      ++i;
    }
  }
  else if (amount2 == 0) {
  }
  else {
  }
}

async function makeTrade(o, willGet) {
  var canGive = await bursa.methods.canTrade(o.event.tokenGet, o.event.amountGet, o.event.tokenGive, o.event.amountGive,
    o.event.block, o.event.user, willGet).call({ from: acc0, gas: 1000000 });

  console.log('can give ', canGive / o.decimalsTokenGive, o.symbolGet);
  if (canGive == 0) return willGet;
  var restGive;

  var canGet = canGive * o.priceOfTokenGet;
  var willGive = willGet / canGet * canGive;
  // var canGet = await bursa.methods.canTrade(o.event.tokenGet, o.event.amountGet, o.event.tokenGive, o.event.amountGive,
  //   o.event.block, o.event.user, willGet).call({ from: acc0, gas: 1000000 });
  //
  // if (canGet == 0) return willGet;
  // var restGive;
  //
  // var canGive = canGet / o.priceOfTokenGet;
  // var willGive = willGet / canGet * canGive;


  // if (canGet > willGet) {
  //   willGet = canGet;
  // } else {
  //   restGive = willGet - canGet;
  // }

  console.log('PRE can give ', canGive / o.decimalsTokenGive, o.symbolGet);
  console.log('PRE will give ' + willGive / o.decimalsTokenGet, o.symbolGet);
  console.log('PRE can get     ' + canGet / o.decimalsTokenGet, o.symbolGive);
  console.log('PRE will get    ' + willGet / o.decimalsTokenGive, o.symbolGive);
  console.log('PRE rest to give ' + restGive / o.decimalsTokenGive, o.symbolGive);
  if (willGive > canGive) {
    willGive = canGive;
  }

  if (canGet > willGet) {
    restGive = 0;
  } else {
    restGive = willGet - canGet;
    willGet = canGet;
    restGive = 0;
  }



  console.log('can give ', canGive / o.decimalsTokenGive, o.symbolGet);
  console.log('will give ' + willGive / o.decimalsTokenGet, o.symbolGet);
  console.log('can get     ' + canGet / o.decimalsTokenGet, o.symbolGive);
  console.log('will get    ' + willGet / o.decimalsTokenGive, o.symbolGive);
  console.log('rest to give ' + restGive / o.decimalsTokenGive, o.symbolGive);

  var tx = await bursa.methods.trade(o.event.tokenGet, o.event.amountGet, o.event.tokenGive, o.event.amountGive,
    o.event.block, o.event.user, willGive, 0).send({ from: acc0, gas: 1000000 });
  console.log('Trade accomplished. ', willGet / o.decimalsTokenGive, o.symbolGive, 'for', willGive / o.decimalsTokenGet, o.symbolGet);
  console.log();
  return restGive;
  // return restGive * ord.priceOfTokenGive;
}
