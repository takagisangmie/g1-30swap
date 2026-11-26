/* g1-30swap v5-9 — Ultra 折扣探测 [com.google.gemini Ultra 12月 1折 (探测)]
   源: g1.ios.30tb.ai.pro.m   目标: com.google.gemini.ai.ultra.m.12month_ip_99p
*/
"use strict";

(function () {
  var VERSION = "g1-30swap-v5-9";
  var SRC = "g1.ios.30tb.ai.pro.m";
  var DST = "com.google.gemini.ai.ultra.m.12month_ip_99p";

  var url = typeof $request === "object" && $request ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\//.test(url)) {
    $done({}); return;
  }

  var body = typeof $response === "object" && $response ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  function escU(s){ return s.replace(/\./g,"\u002e"); }
  function escH(s){ return s.replace(/\./g,"&#46;"); }

  var out = body, hits = 0;
  var forms = [[SRC,DST],[escU(SRC),escU(DST)],[escH(SRC),escH(DST)]];
  for (var i=0;i<forms.length;i++){
    var f=forms[i][0], t=forms[i][1];
    if (out.indexOf(f)===-1) continue;
    var n = out.split(f).length-1;
    out = out.split(f).join(t);
    hits += n;
  }

  console.log("["+VERSION+"] "+SRC+" -> "+DST+" hits="+hits+" @ "+url.split("?")[0]);

  if (hits === 0) {
    var seen = {}, m, re = /g1\.ios\.[A-Za-z0-9._-]{1,80}|com\.google\.(?:one|gemini)\.[A-Za-z0-9._-]{1,80}/g;
    while ((m = re.exec(body)) !== null) seen[m[0]] = (seen[m[0]]||0)+1;
    var keys = Object.keys(seen).sort();
    if (keys.length) {
      console.log("["+VERSION+"] no-hit; observed:");
      keys.slice(0,50).forEach(function(k){ console.log("["+VERSION+"]   "+k+" x"+seen[k]); });
    }
    $done({}); return;
  }

  $done({ body: out });
})();
