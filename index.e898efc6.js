(t=e||(e={})).UPDATE_STATE="UPDATE_STATE",t.RESET_STATE="RESET_STATE";var t,e,a=class{constructor(t,e=[]){this.state=t,this.initialState=t,this.listeners=new Set,this.middlewares=e}notify(){this.listeners.forEach(t=>t?.(this.state))}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}setState(t){this.state={...this.state,...t},this.notify()}getState(){return this.state}getActions(){return{updateState:t=>({type:e.UPDATE_STATE,payload:t}),resetState:()=>({type:e.RESET_STATE})}}dispatch(t){return new Promise((e,a)=>{this.middlewares.reduceRight((t,e)=>a=>e(this,t)(a),t=>{let s=this.applyAction(t);s&&a(s),e(this.getState())})(t)})}applyAction(t){switch(t.type){case e.UPDATE_STATE:this.setState(t.payload);break;case e.RESET_STATE:this.setState(this.initialState);break;default:return Error("Unknown action type")}}};const s=async t=>{let e=await fetch(t);if(!e.ok)throw Error(`Failed to fetch data from ${t}`);return e.json()},i=async()=>{try{let t=[],e=async a=>{let i=await s(a);t=[...t,...i.results];let r=i.next;if(r)return e(r)};await e("https://swapi.dev/api/planets");let a=t?.map(async t=>0===t.films.length?null:await n(t)?t:null);return(await Promise.all(a)).filter(t=>null!==t)}catch(t){return console.error("Error fetching planets:",t),[]}},r=async t=>{for(let e of t.species)try{let t=await s(e);if("reptile"===t.classification.toLowerCase())return!0}catch(t){console.error(`Error fetching species data: ${e}`,t)}return!1},n=async t=>{for(let e of t.residents)try{let t=await s(e);if(await r(t))return!0}catch(t){console.error(`Error fetching resident data: ${e}`,t)}return!1},l=new a({planets:[]},[]);l.subscribe(t=>{(function(t){let e=document.getElementById("planet-container");e.innerHTML="",t.forEach(t=>{let a=function(t){let e=document.createElement("div");e.className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-between";let a=document.createElement("div");a.innerHTML=`
    <div class="text-yellow-500 text-sm">Planet.created</div>
    <div class="text-2xl font-bold">${t.name}</div>
    <div class="text-gray-400">${t.climate}</div>
    <div>${t.films.map(t=>t).join(", ")}</div>
  `;let s=document.createElement("div");return s.className="text-yellow-500 text-2xl",s.innerHTML='<i class="fas fa-toothbrush"></i>',e.appendChild(a),e.appendChild(s),e}(t);e.appendChild(a)})})(t.planets)}),i().then(t=>{l.dispatch(l.getActions().updateState({planets:t}))});
//# sourceMappingURL=index.e898efc6.js.map