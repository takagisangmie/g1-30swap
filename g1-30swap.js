/* g1-30swap v2 — one.google.com 响应内 AI 档 SKU 降级替换为同容量纯存储档
   Shadowrocket http-response script.
   覆盖 AI Ultra 30TB/20TB + AI Pro 10TB/5TB + AI Plus 2TB 的全部错位映射。
   目标 SKU 是否真实存在由服务端判定, 不存在时结算回落原档 —— 日志会告诉你哪些命中。
*/
"use strict";

(function () {
  var VERSION = "g1-30swap-v2.0.2";

  // AI 档 -> 同容量纯存储档
  // m = 月付 / y = 年付 / .v2 = 新版命名
  var MAP = {
    // AI Ultra 30TB  (原 v1 唯一映射)
    "g1.ios.30tb.ai.pro.m":   "g1.ios.30tb.m",
    "g1.ios.30tb.ai.pro.y":   "g1.ios.30tb.y",
    // AI Ultra 20TB
    "g1.ios.20tb.ai.pro.m":   "g1.ios.20tb.m",
    "g1.ios.20tb.ai.pro.y":   "g1.ios.20tb.y",
    "g1.ios.20tb.m.v2":       "g1.ios.20tb.m",
    "g1.ios.20tb.y.v2":       "g1.ios.20tb.y",
    "g1.ios.20tb.ai.pro.m.v2":"g1.ios.20tb.m",
    "g1.ios.20tb.ai.pro.y.v2":"g1.ios.20tb.y",
    // AI Pro 10TB
    "g1.ios.10tb.ai.pro.m":   "g1.ios.10tb.m",
    "g1.ios.10tb.ai.pro.y":   "g1.ios.10tb.y",
    // AI Pro 5TB
    "g1.ios.5tb.ai.pro.m":    "g1.ios.5tb.m",
    "g1.ios.5tb.ai.pro.y":    "g1.ios.5tb.y",
    // AI Plus 2TB
    "g1.ios.2tb.ai.pro.m":    "g1.ios.2tb.m",
    "g1.ios.2tb.ai.pro.y":    "g1.ios.2tb.y"
  };

  var url = typeof $request === "object" && $request ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\//.test(url)) {
    $done({}); return;
  }

  var body = typeof $response === "object" && $response ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  function escU(s){ return s.replace(/\./g,"\\u002e"); }
  function escH(s){ return s.replace(/\./g,"&#46;"); }

  var out = body, hits = 0, hitList = [];
  for (var src in MAP) {
    var dst = MAP[src];
    var forms = [[src,dst],[escU(src),escU(dst)],[escH(src),escH(dst)]];
    for (var i=0;i<forms.length;i++){
      var f=forms[i][0], t=forms[i][1];
      if (out.indexOf(f)===-1) continue;
      var n = out.split(f).length-1;
      out = out.split(f).join(t);
      hits += n;
      hitList.push(src+" -> "+dst+" x"+n);
    }
  }

  if (hits === 0) {
    // 观测: 收集出现的 ai.pro / .v2 / acq / 30tb / 20tb token, 用于扩展映射
    var seen = {}, m, re = /g1\.ios\.[A-Za-z0-9._-]{1,80}/g;
    while ((m = re.exec(body)) !== null) {
      if (/ai\.pro|\.v2|acq|30tb|20tb/.test(m[0])) seen[m[0]] = (seen[m[0]]||0)+1;
    }
    var keys = Object.keys(seen).sort();
    if (keys.length) {
      console.log("["+VERSION+"] no-hit; observed:");
      keys.slice(0,50).forEach(function(k){ console.log("["+VERSION+"]   "+k+" x"+seen[k]); });
    }
    $done({}); return;
  }

  hitList.forEach(function(h){ console.log("["+VERSION+"] "+h); });
  console.log("["+VERSION+"] total hits="+hits+" @ "+url.split("?")[0]);
  $done({ body: out });
})();
