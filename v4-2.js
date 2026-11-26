/* g1-30swap v4-2 — 30TB tier-minimization 测试 [.m.promo 后缀]
   30TB 目标 SKU: g1.ios.30tb.m.promo
*/
"use strict";

(function () {
  var VERSION = "g1-30swap-v4-2";
  var T30 = "g1.ios.30tb.m.promo";

  var MAP = {};
  MAP["g1.ios.30tb.ai.pro.m"]   = T30;
  MAP["g1.ios.30tb.ai.pro.y"]   = T30;
  MAP["g1.ios.20tb.ai.pro.m"]   = "g1.ios.20tb.m";
  MAP["g1.ios.20tb.ai.pro.y"]   = "g1.ios.20tb.y";
  MAP["g1.ios.20tb.m.v2"]       = "g1.ios.20tb.m";
  MAP["g1.ios.20tb.y.v2"]       = "g1.ios.20tb.y";
  MAP["g1.ios.20tb.ai.pro.m.v2"]= "g1.ios.20tb.m";
  MAP["g1.ios.20tb.ai.pro.y.v2"]= "g1.ios.20tb.y";
  MAP["g1.ios.10tb.ai.pro.m"]   = "g1.ios.10tb.m";
  MAP["g1.ios.10tb.ai.pro.y"]   = "g1.ios.10tb.y";
  MAP["g1.ios.5tb.ai.pro.m"]    = "g1.ios.5tb.m";
  MAP["g1.ios.5tb.ai.pro.y"]    = "g1.ios.5tb.y";
  MAP["g1.ios.2tb.ai.pro.m"]    = "g1.ios.2tb.m";
  MAP["g1.ios.2tb.ai.pro.y"]    = "g1.ios.2tb.y";

  var url = typeof $request === "object" && $request ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\//.test(url)) {
    $done({}); return;
  }

  var body = typeof $response === "object" && $response ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  function escU(s){ return s.replace(/\./g,"\u002e"); }
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

  console.log("["+VERSION+"] T30="+T30);

  if (hits === 0) {
    var seen = {}, m, re = /g1\.ios\.[A-Za-z0-9._-]{1,80}/g;
    while ((m = re.exec(body)) !== null) {
      if (/ai\.pro|\.v2|acq|30tb|20tb|promo|eft|trial/.test(m[0])) seen[m[0]] = (seen[m[0]]||0)+1;
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
