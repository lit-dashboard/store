var __defProp=Object.defineProperty,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=(e,r,s)=>r in e?__defProp(e,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[r]=s,__spreadValues=(e,r)=>{for(var s in r||(r={}))__hasOwnProp.call(r,s)&&__defNormalProp(e,s,r[s]);if(__getOwnPropSymbols)for(var s of __getOwnPropSymbols(r))__propIsEnum.call(r,s)&&__defNormalProp(e,s,r[s]);return e};!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e="undefined"!=typeof globalThis?globalThis:e||self)["webbit-store"]={})}(this,(function(e){"use strict";var r="[object Symbol]",s=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,t=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,o="\\u0300-\\u036f\\ufe20-\\ufe23",i="\\u2700-\\u27bf",u="a-z\\xdf-\\xf6\\xf8-\\xff",c="A-Z\\xc0-\\xd6\\xd8-\\xde",n="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",a="['’]",_="[\\ud800-\\udfff]",d="["+n+"]",l="["+o+"\\u20d0-\\u20f0]",f="\\d+",h="[\\u2700-\\u27bf]",b="["+u+"]",p="[^\\ud800-\\udfff"+n+f+i+u+c+"]",v="\\ud83c[\\udffb-\\udfff]",g="[^\\ud800-\\udfff]",S="(?:\\ud83c[\\udde6-\\uddff]){2}",y="[\\ud800-\\udbff][\\udc00-\\udfff]",m="["+c+"]",w="(?:"+b+"|"+p+")",O="(?:"+m+"|"+p+")",P="(?:['’](?:d|ll|m|re|s|t|ve))?",j="(?:['’](?:D|LL|M|RE|S|T|VE))?",A="(?:"+l+"|"+v+")"+"?",x="[\\ufe0e\\ufe0f]?",E=x+A+("(?:\\u200d(?:"+[g,S,y].join("|")+")"+x+A+")*"),R="(?:"+[h,S,y].join("|")+")"+E,T="(?:"+[g+l+"?",l,S,y,_].join("|")+")",N=RegExp(a,"g"),I=RegExp(l,"g"),U=RegExp(v+"(?="+v+")|"+T+E,"g"),z=RegExp([m+"?"+b+"+"+P+"(?="+[d,m,"$"].join("|")+")",O+"+"+j+"(?="+[d,m+w,"$"].join("|")+")",m+"?"+w+"+"+P,m+"+"+j,f,R].join("|"),"g"),C=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),V=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,L="object"==typeof global&&global&&global.Object===Object&&global,k="object"==typeof self&&self&&self.Object===Object&&self,K=L||k||Function("return this")();var D,Z=(D={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"ss"},function(e){return null==D?void 0:D[e]});function B(e){return C.test(e)}function M(e){return B(e)?function(e){return e.match(U)||[]}(e):function(e){return e.split("")}(e)}var W=Object.prototype.toString,G=K.Symbol,Y=G?G.prototype:void 0,H=Y?Y.toString:void 0;function J(e){if("string"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&W.call(e)==r}(e))return H?H.call(e):"";var s=e+"";return"0"==s&&1/e==-Infinity?"-0":s}function $(e,r,s){var t=e.length;return s=void 0===s?t:s,!r&&s>=t?e:function(e,r,s){var t=-1,o=e.length;r<0&&(r=-r>o?0:o+r),(s=s>o?o:s)<0&&(s+=o),o=r>s?0:s-r>>>0,r>>>=0;for(var i=Array(o);++t<o;)i[t]=e[t+r];return i}(e,r,s)}function F(e){return null==e?"":J(e)}var q,Q=(q=function(e,r,s){return r=r.toLowerCase(),e+(s?ee(F(r).toLowerCase()):r)},function(e){return function(e,r,s,t){var o=-1,i=e?e.length:0;for(t&&i&&(s=e[++o]);++o<i;)s=r(s,e[o],o,e);return s}(function(e,r,t){return e=F(e),void 0===(r=t?void 0:r)?function(e){return V.test(e)}(e)?function(e){return e.match(z)||[]}(e):function(e){return e.match(s)||[]}(e):e.match(r)||[]}(function(e){return(e=F(e))&&e.replace(t,Z).replace(I,"")}(e).replace(N,"")),q,"")});var X,ee=(X="toUpperCase",function(e){var r=B(e=F(e))?M(e):void 0,s=r?r[0]:e.charAt(0),t=r?$(r,1).join(""):e.slice(1);return s[X]()+t});const re=e=>e.split("/").map((e=>Q(e))).join("/");class se{static get __WEBBIT_CLASSNAME__(){return"Source"}}const te=e=>e instanceof Object&&"Source"===e.constructor.__WEBBIT_CLASSNAME__;class oe{constructor(e){this.sources=e,this.sourceObjectRefs={}}getSourceObject(e,r){const s=re(r);return void 0===this.sourceObjectRefs[e]&&(this.sourceObjectRefs[e]={}),void 0===this.sourceObjectRefs[e][s]&&(this.sourceObjectRefs[e][s]=new se),this.sourceObjectRefs[e][s]}setSourceObjectProps(e,r){const s=this.getSourceObject(e,r.__normalizedKey__),t=this.sources;Object.getOwnPropertyNames(s).forEach((e=>{e in r.__sources__||delete s[e]}));for(let o in r.__sources__){const i=re(o);if(i in s)continue;const u=r.__sources__[o];Object.defineProperty(s,i,{configurable:!0,set(r){const s=t[e];if(void 0===s)return;const o=s.setters[u.__normalizedKey__];void 0!==o&&o(r)},get(){if(void 0!==t[e])return t[e].getterValues[u.__normalizedKey__]}})}}}class ie{constructor(e){this.nextSubscriberId=0,this.subscribers={},this.subscribersAll={},this.sources=e}subscribe(e,r,s,t){if("function"!=typeof s)throw new Error("Callback is not a function");const o=re(r);void 0===this.subscribers[e]&&(this.subscribers[e]={}),void 0===this.subscribers[e][o]&&(this.subscribers[e][o]={});const i=this.nextSubscriberId;if(this.nextSubscriberId++,this.subscribers[e][o][i]=s,t){const t=this.sources.getSource(e,re(r));void 0!==t&&s(t,r,r)}return()=>{delete this.subscribers[e][o][i]}}subscribeAll(e,r,s){if("function"!=typeof r)throw new Error("Callback is not a function");void 0===this.subscribersAll[e]&&(this.subscribersAll[e]={});const t=this.nextSubscriberId;if(this.nextSubscriberId++,this.subscribersAll[e][t]=r,s){const s=this.sources.getSources(e);Object.getOwnPropertyNames(s||{}).forEach((t=>{if(this.sources.getRawSource(e,t).__fromProvider__){const e=s[t];r(e,t)}}))}return()=>{delete this.subscribersAll[e][t]}}notifySubscribers(e,r){const s=re(r).split("/");if(e in this.subscribers&&s.forEach(((t,o)=>{const i=s.slice(0,o+1).join("/");for(let s in this.subscribers[e][i]||{}){(0,this.subscribers[e][i][s])(this.sources.getSource(e,i),i,re(r))}})),e in this.subscribersAll)for(let t in this.subscribersAll[e]){(0,this.subscribersAll[e][t])(this.sources.getSource(e,r),re(r))}}notifySubscribersRemoved(e,r,s){if(e in this.subscribers)for(let t of r){t=re(t);for(let r in this.subscribers[e][t]){(0,this.subscribers[e][t][r])(void 0,t,t)}}if(e in this.subscribersAll)for(let t of s||r)for(let r in this.subscribersAll[e]){(0,this.subscribersAll[e][r])(void 0,t)}}}class ue{constructor(e){this.rawSources={},this.sources={},this.sourceObjects=new oe(this.sources),this.subscribers=new ie(this),this.store=e}cleanSource(e,r,s){if(0===s.length)return!1;const t=s[0],o=r[t];if(void 0===o)return!1;if(s.length>1&&this.cleanSource(e,o.__sources__,s.slice(1)),0!==Object.keys(o.__sources__).length||o.__fromProvider__){const r=this.sources[e];this.sourceObjects.setSourceObjectProps(e,o),0===Object.keys(o.__sources__).length&&(r.getterValues[o.__normalizedKey__]=o.__value__)}else delete r[t],delete this.sources[e].sources[o.__normalizedKey__],delete this.sources[e].getterValues[o.__normalizedKey__],delete this.sources[e].setters[o.__normalizedKey__],this.subscribers.notifySubscribersRemoved(e,[o.__normalizedKey__]);return!0}getRawSources(e){return this.rawSources[e]}getRawSource(e,r){let s=this.getRawSources(e);if(void 0===s)return;if("string"!=typeof r)return s;const t=re(r).split("/");let o=s.__sources__;for(let i in t){const e=t[i];if(t.length-1===parseInt(i))return e in o?o[e]:void 0;if(!(e in o))return;o=o[e].__sources__}}getSources(e){if(e in this.sources)return this.sources[e].sources}getSource(e,r){const s=this.getSources(e);if(s)return s[re(r)]}clearSources(e){if(!(e in this.rawSources))return;const r=Object.getOwnPropertyNames(this.getSources(e)||{}),s=r.filter((r=>this.getRawSource(e,r).__fromProvider__));for(let t in this.sources[e].getterValues){const r=this.sources[e].getterValues[t];te(r)&&Object.getOwnPropertyNames(r).forEach((e=>{delete r[e]}))}this.rawSources[e]={__normalizedKey__:void 0,__fromProvider__:!1,__key__:void 0,__value__:void 0,__sources__:{}},this.sources[e]={getterValues:{},setters:{},sources:{}},this.subscribers.notifySubscribersRemoved(e,r,s)}removeSources(e){if(!(e in this.rawSources))return;const r=Object.getOwnPropertyNames(this.getSources(e)),s=r.filter((r=>this.getRawSource(e,r).__fromProvider__));for(let t in this.sources[e].getterValues){const r=this.sources[e].getterValues[t];te(r)&&Object.getOwnPropertyNames(r).forEach((e=>{delete r[e]}))}delete this.rawSources[e],delete this.sources[e],this.subscribers.notifySubscribersRemoved(e,r,s)}sourcesRemoved(e,r){if(void 0===this.rawSources[e])return;const s=this.rawSources[e];for(let t of r){const r=re(t).split("/");let o=s.__sources__;for(let e in r){const s=r[e];if(!(s in o))break;r.length-1===parseInt(e)&&(o[s].__fromProvider__=!1,o[s].__value__=void 0),o=o[s].__sources__}this.cleanSource(e,s.__sources__,r)}}sourcesChanged(e,r){const s=this.sources;void 0===this.rawSources[e]&&(this.rawSources[e]={__normalizedKey__:void 0,__fromProvider__:!1,__key__:void 0,__value__:void 0,__sources__:{}},s[e]={getterValues:{},setters:{},sources:{}});const t=this.rawSources[e];for(let o in r){const i=r[o],u=o.split("/"),c=re(o).split("/");let n=t.__sources__,a={};c.forEach(((r,t)=>{const o=r in n,_=u.slice(0,t+1).join("/"),d=s[e],l=c.slice(0,t+1).join("/");if(o||(n[r]={__fromProvider__:!1,__normalizedKey__:l,__key__:_,__value__:void 0,__sources__:{}},d.getterValues[l]=this.sourceObjects.getSourceObject(e,_),d.setters[l]=()=>{},Object.defineProperty(d.sources,l,{configurable:!0,set(r){const t=s[e];if(void 0===t)return;const o=t.setters[l];void 0!==o&&o(r)},get(){if(void 0!==s[e])return s[e].getterValues[l]}})),c.length-1===t){n[r].__fromProvider__=!0,n[r].__value__=i,0===Object.keys(n[r].__sources__).length&&(d.getterValues[l]=i);const s=this.store.getSourceProvider(e);d.setters[l]=e=>{s.userUpdate(_,e)}}0!==t&&(te(d.getterValues[a.__normalizedKey__])||(d.getterValues[a.__normalizedKey__]=this.sourceObjects.getSourceObject(e,a.__normalizedKey__)),this.sourceObjects.setSourceObjectProps(e,a)),a=n[r],n=n[r].__sources__})),this.subscribers.notifySubscribers(e,o)}}subscribe(e,r,s,t){return this.subscribers.subscribe(e,r,s,t)}subscribeAll(e,r,s){return this.subscribers.subscribeAll(e,r,s)}}class ce{static get __WEBBIT_CLASSNAME__(){return"SourceProvider"}static get typeName(){return null}static get settingsDefaults(){return{}}constructor(e,r,s){if(new.target===ce)throw new TypeError("Cannot construct SourceProvider instances directly.");if("string"!=typeof r)throw new TypeError("The providerName needs to be passed into super() from your provider's constructor.");if(void 0===s)throw new Error("settings must be passed into the super() from your provider's constructor.");if("string"!=typeof this.constructor.typeName)throw new Error("A typeName string must be defined.");this.store=e,this._providerName=r,this.settings=__spreadValues(__spreadValues({},this.constructor.settingsDefaults),s),this._sourceUpdates={},this._interval=setInterval(this._sendUpdates.bind(this),100),this.clearSourcesTimeoutId=null}updateSource(e,r){clearTimeout(this._clearSourcesTimeoutId),void 0===this._sourceUpdates[e]?this._sourceUpdates[e]={first:{type:"change",value:r}}:this._sourceUpdates[e].last={type:"change",value:r}}removeSource(e){void 0===this._sourceUpdates[e]?this._sourceUpdates[e]={first:{type:"removal"}}:this._sourceUpdates[e].last={type:"removal"}}subscribe(e,r,s){return this.store.subscribe(this._providerName,e,r,s)}subscribeAll(e,r){return this.store.subscribeAll(this._providerName,e,r)}getSource(e){return this.store.getSource(this._providerName,e)}getRawSource(e){return this.store.getRawSource(this._providerName,e)}getSources(){return this.store.getSources(this._providerName)}clearSources(e){this._sendUpdates((()=>{this.store.clearSources(this._providerName),"function"==typeof e&&e()}))}clearSourcesWithTimeout(e,r){clearTimeout(this._clearSourcesTimeoutId),this._clearSourcesTimeoutId=setTimeout((()=>{this.clearSources(r)}),e)}userUpdate(e,r){}getType(e){return"string"==typeof e?"string":"number"==typeof e?"number":"boolean"==typeof e?"boolean":e instanceof Array?"Array":null===e?"null":null}_disconnect(){clearTimeout(this._interval)}_sendUpdates(e){if(0===Object.keys(this._sourceUpdates).length)return void("function"==typeof e&&e());const r={},s={};for(let t in this._sourceUpdates){const e=this._sourceUpdates[t];r[t]=e.first,"last"in e&&(s[t]=e.last)}this._sendChanges(r),this._sendRemovals(r),Object.keys(s).length>0?setTimeout((()=>{this._sendChanges(s),this._sendRemovals(s),this._sourceUpdates={},"function"==typeof e&&e()})):(this._sourceUpdates={},"function"==typeof e&&e())}_sendChanges(e){const r={};for(let s in e)"change"===e[s].type&&(r[s]=e[s].value);Object.keys(r).length>0&&this.store.sourcesChanged(this._providerName,r)}_sendRemovals(e){const r=[];for(let s in e)"removal"===e[s].type&&r.push(s);r.length>0&&this.store.sourcesRemoved(this._providerName,r)}}e.SourceProvider=ce,e.Store=class{constructor(){this.providerTypes={},this.providers={},this.defaultSourceProvider=null,this.sourceProviderListeners=[],this.defaultSourceProviderListeners=[],this.sources=new ue(this)}addSourceProviderType(e){const{typeName:r}=e;if("string"!=typeof r)throw new Error("A typeName for your source provider type must be set.");if(this.hasSourceProviderType(r))throw new Error("A source provider type with the same name has already been added.");"SourceProvider"===e.__WEBBIT_CLASSNAME__&&(this.providerTypes[r]=e)}hasSourceProviderType(e){return e in this.providerTypes}hasSourceProvider(e){return e in this.providers}addSourceProvider(e,r,s){if(s=s||{},"string"!=typeof r&&(r=e),!this.hasSourceProviderType(e))throw new Error("A source provider type with that name hasn't been added.");if(this.hasSourceProvider(r))throw new Error("A source provider with that name has already been added.");const t=this.providerTypes[e];return this.providers[r]=new t(this,r,__spreadValues(__spreadValues({},t.settingsDefaults),s)),this.sourceProviderListeners.forEach((e=>{e(r)})),this.providers[r]}sourceProviderAdded(e){if("function"!=typeof e)throw new Error("listener is not a function");this.sourceProviderListeners.push(e)}removeSourceProvider(e){if(!this.hasSourceProvider(e))return;this.providers[e]._disconnect(),delete this.providers[e]}getSourceProvider(e){return this.providers[e]}getSourceProviderTypeNames(){return Object.keys(this.providerTypes)}getSourceProviderNames(){return Object.keys(this.providers)}setDefaultSourceProvider(e){this.defaultSourceProvider=e,this.defaultSourceProviderListeners.forEach((e=>{e(this.defaultSourceProvider)}))}defaultSourceProviderSet(e){if("function"!=typeof e)throw new Error("listener is not a function");this.defaultSourceProviderListeners.push(e)}getDefaultSourceProvider(){return this.defaultSourceProvider}getRawSources(e){return this.sources.getRawSources(e)}getRawSource(e,r){return this.sources.getRawSource(e,r)}getSources(e){return this.sources.getSources(e)}getSource(e,r){return this.sources.getSource(e,r)}subscribe(e,r,s,t){return this.sources.subscribe(e,r,s,t)}subscribeAll(e,r,s){return this.sources.subscribeAll(e,r,s)}sourcesChanged(e,r){return this.sources.sourcesChanged(e,r)}clearSources(e){return this.sources.clearSources(e)}sourcesRemoved(e,r){return this.sources.sourcesRemoved(e,r)}},Object.defineProperty(e,"__esModule",{value:!0}),e[Symbol.toStringTag]="Module"}));
