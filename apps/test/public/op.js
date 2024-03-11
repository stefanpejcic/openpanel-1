"use strict";(()=>{function v(r){return Promise.all(Object.entries(r).map(async([t,e])=>[t,await e??""])).then(t=>Object.fromEntries(t))}function m(r){let t={"Content-Type":"application/json"};return{headers:t,async fetch(e,i,n){let s=`${r}${e}`,c,l=await v(t);return new Promise(o=>{let h=a=>{clearTimeout(c),fetch(s,{headers:l,method:"POST",body:JSON.stringify(i??{}),keepalive:!0,...n??{}}).then(async p=>{if(p.status!==200&&p.status!==202)return f(a,o);let g=await p.text();if(!g)return o(null);o(g)}).catch(()=>f(a,o))};function f(a,p){if(a>1)return p(null);c=setTimeout(()=>{h(a+1)},Math.pow(2,a)*500)}h(0)})}}}var d=class{options;api;state={properties:{}};constructor(t){this.options=t,this.api=m(t.url),this.api.headers["openpanel-client-id"]=t.clientId,this.options.clientSecret&&(this.api.headers["openpanel-client-secret"]=this.options.clientSecret)}init(t){this.state.properties=t??{}}setProfileId(t){this.state.profileId=t}setProfile(t){this.setProfileId(t.profileId),this.api.fetch("/profile",{...t,properties:{...this.state.properties,...t.properties}})}increment(t,e,i){let n=i?.profileId??this.state.profileId;if(!n)return console.log("No profile id");this.api.fetch("/profile/increment",{profileId:n,property:t,value:e})}decrement(t,e,i){let n=i?.profileId??this.state.profileId;if(!n)return console.log("No profile id");this.api.fetch("/profile/decrement",{profileId:n,property:t,value:e})}event(t,e){let i=e?.profileId??this.state.profileId;delete e?.profileId,this.api.fetch("/event",{name:t,properties:{...this.state.properties,...e??{}},timestamp:this.timestamp(),deviceId:this.getDeviceId(),profileId:i}).then(n=>{this.options.setDeviceId&&n&&this.options.setDeviceId(n)})}setGlobalProperties(t){this.state.properties={...this.state.properties,...t}}clear(){this.state.properties={},this.state.deviceId=void 0,this.options.removeDeviceId&&this.options.removeDeviceId()}timestamp(){return new Date().toISOString()}getDeviceId(){if(this.state.deviceId)return this.state.deviceId;this.options.getDeviceId&&(this.state.deviceId=this.options.getDeviceId()||void 0)}};function b(r){return r.replace(/([-_][a-z])/gi,t=>t.toUpperCase().replace("-","").replace("_",""))}var u=class extends d{lastPath="";constructor(t){super(t),this.isServer()||(this.setGlobalProperties({referrer:document.referrer}),this.options.trackOutgoingLinks&&this.trackOutgoingLinks(),this.options.trackScreenViews&&this.trackScreenViews(),this.options.trackAttributes&&this.trackAttributes())}isServer(){return typeof document>"u"}trackOutgoingLinks(){this.isServer()||document.addEventListener("click",t=>{let e=t.target,i=e.closest("a");if(i&&e){let n=i.getAttribute("href");n?.startsWith("http")&&super.event("link_out",{href:n,text:i.innerText||i.getAttribute("title")||e.getAttribute("alt")||e.getAttribute("title")})}})}trackScreenViews(){if(this.isServer())return;let t=history.pushState;history.pushState=function(...n){let s=t.apply(this,n);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("locationchange")),s};let e=history.replaceState;history.replaceState=function(...n){let s=e.apply(this,n);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("locationchange")),s},window.addEventListener("popstate",()=>window.dispatchEvent(new Event("locationchange"))),this.options.hash?window.addEventListener("hashchange",()=>this.screenView()):window.addEventListener("locationchange",()=>this.screenView()),setTimeout(()=>{this.screenView()},50)}trackAttributes(){this.isServer()||document.addEventListener("click",t=>{let e=t.target,i=e.closest("button"),n=e.closest("button"),s=i?.getAttribute("data-event")?i:n?.getAttribute("data-event")?n:null;if(s){let c={};for(let o of s.attributes)o.name.startsWith("data-")&&o.name!=="data-event"&&(c[b(o.name.replace(/^data-/,""))]=o.value);let l=s.getAttribute("data-event");l&&super.event(l,c)}})}screenView(t){if(this.isServer())return;let e=window.location.href;this.lastPath!==e&&(this.lastPath=e,super.event("screen_view",{...t??{},path:e,title:document.title}))}};(r=>{if(r.op&&"q"in r.op){let t=r.op.q||[],e=new u(t.shift()[1]);t.forEach(i=>{i[0]in e&&e[i[0]](...i.slice(1))}),r.op=(i,...n)=>{let s=e[i].bind(e);typeof s=="function"&&s(...n)}}})(window);})();
//# sourceMappingURL=cdn.global.js.map