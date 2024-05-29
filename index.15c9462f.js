var t,e;const a=async t=>{let e=await fetch(t);if(!e.ok)throw Error(`Failed to fetch data from ${t}`);return e.json()},i=async()=>{try{let t=[],e=async i=>{let n=await a(i);t=[...t,...n.results];let s=n.next;if(s)return e(s)};await e("https://swapi.dev/api/planets");let i=t?.map(async t=>0===t.films.length?null:await s(t)?t:null),n=await Promise.all(i),l=(n=n.filter(t=>null!==t)).map(async t=>{let e=await Promise.all(t.films.map(async t=>{try{return await a(t)}catch{return null}}));return e=e.filter(t=>null!==t),{...t,filmsData:e}});return Promise.all(l)}catch(t){return console.error("Error fetching planets:",t),[]}},n=async t=>{let e=t.species;if(e.length){let t=async i=>{let n=e[i],s=i===e.length-1;try{let e=await a(n);return"artificial"===e.classification.toLowerCase()?e:s?null:t(i+1)}catch(t){return null}};return!!await t(0)}},s=async t=>{let e=t.residents;if(e.length){let t=async i=>{let s=e[i],l=i===e.length-1;try{let e=await a(s);return await n(e)?e:l?null:t(i+1)}catch(t){return null}};return!!await t(0)}return!1};(t=e||(e={})).UPDATE_STATE="UPDATE_STATE",t.RESET_STATE="RESET_STATE";const l=new class{constructor(t,e=[]){this.state=t,this.initialState=t,this.listeners=new Set,this.middlewares=e}notify(){this.listeners.forEach(t=>t?.(this.state))}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}setState(t){this.state={...this.state,...t},this.notify()}getState(){return this.state}getActions(){return{updateState:t=>({type:e.UPDATE_STATE,payload:t}),resetState:()=>({type:e.RESET_STATE})}}dispatch(t){return new Promise((e,a)=>{this.middlewares.reduceRight((t,e)=>a=>e(this,t)(a),t=>{let i=this.applyAction(t);i&&a(i),e(this.getState())})(t)})}applyAction(t){switch(t.type){case e.UPDATE_STATE:this.setState(t.payload);break;case e.RESET_STATE:this.setState(this.initialState);break;default:return Error("Unknown action type")}}}({planets:[],isLoading:!1,error:null},[]);function r(t){l.dispatch(l.getActions().updateState({isLoading:t}))}function o(t){l.dispatch(l.getActions().updateState({error:t}))}l.subscribe(t=>{var e;(function(t){let e=document.getElementById("error");e.style.display=t?"block":"none",e.textContent=String(t)})(t.error),e=t.isLoading,document.getElementById("loading").style.display=e?"block":"none",function(t){let e=document.getElementById("planet-container");e.innerHTML="",t.forEach(t=>{let a=function(t){let e=t.filmsData.map(t=>t.title).join(", "),a=new Date(t.created).toDateString(),i=`
    <div class="planet-card p-4 rounded-lg shadow-lg space-y-4">
      <div class="planet-info bg-[#3f4045] p-4 rounded-lg block lg:hidden
       transform transition duration-300 ease-in-out hover:scale-105 
       hover:shadow-lg hover:brightness-110 hover:bg-gray-600"">
        <div class="text-yellow-500">${a}</div>
        <div class="flex justify-between items-center mt-2">
          <div>
            <div class="text-xl font-bold text-white">${t.name}</div>
            <div class="text-gray-500">${t.climate}</div>
          </div>
        </div>
        <div class="text-gray-400 mt-2">${e}</div>
      </div>

      <div class="planet-info bg-[#27272a] p-4 rounded-lg hidden lg:block
      transform transition duration-300 ease-in-out hover:scale-105 mx-8
       hover:shadow-lg hover:brightness-110 hover:bg-gray-600"
      ">
        <div class="text-yellow-500">${a}</div>
        <div class="flex justify-between items-center mt-2">
          <div>
            <div class="text-xl font-bold text-white">${t.name}</div>
            <div class="text-gray-400 mt-1">${e}</div>
          </div>
          <div>
            <div class="text-yellow-500 text-sm">${a}</div>
            <div class="text-gray-500 mt-1">${t.climate}</div>
          </div>
        </div>
      </div>
    </div>
  `,n=document.createElement("template");return n.innerHTML=i.trim(),n.content.firstChild}(t);e.appendChild(a)})}(t.planets)}),r(!0),i().then(t=>{o(null),l.dispatch(l.getActions().updateState({planets:t}))}).catch(t=>o(t??Error("Unknown Error"))).finally(()=>r(!1));
//# sourceMappingURL=index.15c9462f.js.map
