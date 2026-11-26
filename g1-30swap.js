/* g1-30swap — one.google.com 响应内 g1.ios.30tb.ai.pro.m -> g1.ios.30tb.m
   Shadowrocket http-response script.
   原理同 g1-acq: 服务端按客户端提交的 SKU 结算, 页面下发什么 SKU 由响应改写控制。
*/
"use strict";

(function () {
  var VERSION = "g1-30swap-v1.0";
  var SRC = "g1.ios.30tb.ai.pro.m";
  var DST = "g1.ios.30tb.m";

  var url = typeof $request === "object" && $request ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\//.test(url)) {
    $done({});
    return;
  }

  var body = typeof $response === "object" && $response ? $response.body : undefined;
  if (typeof body !== "string") {
    console.log("[" + VERSION + "] non-text body, skip " + url);
    $done({});
    return;
  }

  // Google 页面里 SKU 可能出现三种形态: 原始 / . 转义点 / &#46; 实体点
  function escU(s) { return s.replace(/\./g, "\\u002e"); }
  function escH(s) { return s.replace(/\./g, "&#46;"); }

  var out = body;
  var hits = 0;
  var forms = [
    [SRC, DST],
    [escU(SRC), escU(DST)],
    [escH(SRC), escH(DST)]
  ];
  for (var i = 0; i < forms.length; i++) {
    var from = forms[i][0], to = forms[i][1];
    if (out.indexOf(from) === -1) continue;
    var n = out.split(from).length - 1;
    out = out.split(from).join(to);
    hits += n;
    console.log("[" + VERSION + "] rewrite form" + i + " x" + n + " @ " + url.split("?")[0]);
  }

  if (hits === 0) {
    // 观测模式日志: 页面里实际出现了哪些 g1.ios.30tb / g1.*.acq token, 方便确认 SRC 是否还在用
    var seen = {};
    var m, re = /(?:g1|com\.google\.one)\.[A-Za-z0-9._-]{1,80}/g;
    while ((m = re.exec(body)) !== null) {
      if (/30tb|acq|ai\.pro/.test(m[0])) seen[m[0]] = (seen[m[0]] || 0) + 1;
    }
    var keys = Object.keys(seen).sort();
    if (keys.length) {
      console.log("[" + VERSION + "] no-hit; observed tokens:");
      keys.forEach(function (k) { console.log("[" + VERSION + "]   " + k + " x" + seen[k]); });
    }
    $done({});
    return;
  }

  console.log("[" + VERSION + "] hits=" + hits + " @ " + url.split("?")[0]);
  $done({ body: out });
})();
