'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const labels = {truth:'Reference',nie_mlp:'NIE · MLP time kernel',nie_exp:'NIE · learned decay kernel',node8:'History NODE · 8 states',node32:'History NODE · 32 states',ndde4:'Neural DDE · 4 delays'};
  const colors = {truth:'#273e36',nie_mlp:'#267655',nie_exp:'#267655',node8:'#aa8542',node32:'#8b86a8',ndde4:'#3b71c4'};
  const info = {
    diffusion2d: {title:'Two-dimensional diffusion sensing',desc:'Two sensor outputs from an 81-state reference field.',eq:'<mrow><msub><mi>u</mi><mi>t</mi></msub><mo>=</mo><mn>0.035</mn><mi>Δ</mi><mi>u</mi><mo>−</mo><mn>0.06</mn><msup><mi>u</mi><mn>3</mn></msup></mrow>',obs:'u(0,y,t) = b(t) sin(πy); other edges are zero. Sensors: (0.3,0.5) and (0.7,0.5). Only sensor history and controls enter the models.'},
    relaxation: {title:'Multirate nonlinear relaxation',desc:'Twelve hidden relaxation variables; two weighted outputs.',eq:'<mrow><msub><mover><mi>r</mi><mo>˙</mo></mover><mi>j</mi></msub><mo>=</mo><msub><mi>λ</mi><mi>j</mi></msub><mo>(</mo><mi>b</mi><mo>(</mo><mi>t</mi><mo>)</mo><mo>−</mo><msub><mi>r</mi><mi>j</mi></msub><mo>−</mo><mn>0.08</mn><msubsup><mi>r</mi><mi>j</mi><mn>3</mn></msubsup><mo>)</mo><mo>,</mo><mspace width="1em"/><mi>y</mi><mo>=</mo><mi>C</mi><mi>r</mi></mrow>',obs:'j = 1,…,12. The reference rates are not supplied. The NIE learns rates and mixtures within a constant-plus-positive-decay kernel family.'},
    wave1d: {title:'Damped wave sensing',desc:'Two displacement sensors; the full reference state is hidden.',eq:'<mrow><msub><mi>u</mi><mrow><mi>t</mi><mi>t</mi></mrow></msub><mo>=</mo><mn>0.64</mn><msub><mi>u</mi><mrow><mi>x</mi><mi>x</mi></mrow></msub><mo>−</mo><mn>0.9</mn><msub><mi>u</mi><mi>t</mi></msub><mo>−</mo><mn>0.15</mn><msup><mi>u</mi><mn>3</mn></msup></mrow>',obs:'u(0,t) = b(t); u(1,t) = 0. Sensors: x = 0.25 and 0.75. Hidden displacement and velocity fields are not model inputs.'}
  };
  const findings = {
    diffusion2d: {new:'NIE sustains the long-horizon response; DDE is more accurate on this input family.',shift:'NIE and DDE have similar average error; their ordering changes with solver refinement.'},
    relaxation: {new:'NIE improves on the history NODEs at long horizons; DDE has lower same-family error.',shift:'NIE has lower mean 8T error under doubled forcing frequency; individual inputs vary.'},
    wave1d: {new:'NIE and DDE sustain same-family wave responses with similar aggregate accuracy.',shift:'Frequency transfer remains difficult: NIE has high error and trails NODE–8 and DDE.'}
  };
  let data = {}, task = 'diffusion2d', family = 'new', seed = '5301', channel = 0, multiple = 8, pos = 1, playing = false, last = 0;
  const visible = new Set();
  function el(tag, attrs = {}, text = '') {
    const n = document.createElementNS(NS, tag);
    for (const [k,v] of Object.entries(attrs)) n.setAttribute(k,String(v));
    if (text) n.textContent = text;
    return n;
  }
  function txt(svg,x,y,t,attrs={}) {svg.appendChild(el('text',{x,y,fill:'#768273','font-size':11,...attrs},t));}
  function line(svg,x,y,X,Y,k,width=2) {
    const n = el('path',{d:x.map((t,i)=>(i?'L':'M')+X(t).toFixed(2)+','+Y(y[i]).toFixed(2)).join(' '),fill:'none',stroke:colors[k],'stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round','data-model':k});
    if (k !== 'truth') n.setAttribute('stroke-dasharray', k === 'node32' ? '3 4' : '6 3');
    svg.appendChild(n);
  }
  function bounds(values) {const a=Math.min(...values),b=Math.max(...values),p=Math.max(.02,(b-a)*.09);return[a-p,b+p];}
  async function decode(p) {
    for (const f of Object.values(p.families)) {
      const raw=Uint8Array.from(atob(f.q),c=>c.charCodeAt(0));
      const buffer=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer();
      const view=new DataView(buffer),series=[];
      let offset=0;
      for (let a=0;a<1+p.seeds.length*p.kinds.length;a++) {
        const accum=[0,0],rows=[];
        for (let i=0;i<f.count;i++) {
          const row=[];
          for (let d=0;d<2;d++) {accum[d]=(accum[d]+view.getUint16(offset,true))%65536;offset+=2;row.push(f.lo[a][d]+accum[d]*f.step[a][d]);}
          rows.push(row);
        }
        series.push(rows);
      }
      if (offset!==buffer.byteLength) throw Error('Unexpected replay length');
      f.t=Array.from({length:f.count},(_,i)=>i*f.end/(f.count-1));
      f.truth=series[0];f.pred={};
      p.seeds.forEach((s,si)=>{f.pred[s]={};p.kinds.forEach((k,ki)=>f.pred[s][k]=series[1+si*p.kinds.length+ki]);});
      delete f.q;
    }
    return p;
  }
  function renderSummary() {
    const p=data[task].families[family];
    $('table-caption').textContent=info[task].title+' · '+(family==='new'?'same-family inputs':'doubled frequency')+' · normalized RMSE (%)';
    $('metrics').replaceChildren();
    for (const k of data[task].kinds) {
      const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=labels[k];tr.appendChild(th);
      for (const v of p.summary[k]) {const td=document.createElement('td');td.textContent=v[2]?'Failed ('+v[2]+')':v[0].toFixed(3)+' ± '+v[1].toFixed(3);tr.appendChild(td);}
      $('metrics').appendChild(tr);
    }
  }
  function showAll() {
    visible.clear();['truth',...data[task].kinds].forEach(k=>visible.add(k));
    $('legend').querySelectorAll('input').forEach(n=>{n.checked=true;});draw();
  }
  function controls() {
    const v=info[task];
    $('case-title').textContent=v.title;$('case-description').textContent=v.desc+' T = 3.2.';
    $('case-equation').innerHTML='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+v.eq+'</math>';$('observation').textContent=v.obs;
    document.querySelectorAll('[data-task]').forEach(n=>n.setAttribute('aria-selected',String(n.dataset.task===task)));
    visible.clear();$('legend').replaceChildren();
    // Every reference/model curve starts visible, including the 32-state NODE.
    for (const k of ['truth',...data[task].kinds]) {
      visible.add(k);
      const label=document.createElement('label'),input=document.createElement('input'),key=document.createElement('i');
      input.type='checkbox';input.checked=true;input.dataset.model=k;
      key.className='key';key.style.background=colors[k];
      input.addEventListener('change',()=>{input.checked?visible.add(k):visible.delete(k);draw();});
      label.append(input,key,document.createTextNode(labels[k]));$('legend').appendChild(label);
    }
    pos=1;playing=false;$('play').textContent='Play';$('family').value=family;renderSummary();draw();
  }
  function draw() {
    if (!data[task]) return;
    const p=data[task].families[family],end=3.2*multiple,idx=p.t.findLastIndex(t=>t<=end+1e-8)+1,x=p.t.slice(0,idx),reference=p.truth.slice(0,idx).map(r=>r[channel]);
    const curves=[];
    if (visible.has('truth')) curves.push({k:'truth',y:reference});
    for (const k of data[task].kinds) if (visible.has(k)) curves.push({k,y:p.pred[seed][k].slice(0,idx).map(r=>r[channel])});
    const b=bounds(curves.length?curves.flatMap(c=>c.y):reference),svg=$('rollout');svg.replaceChildren();
    const X=t=>65+910*t/end,Y=y=>296-268*(y-b[0])/(b[1]-b[0]);
    if (multiple>1) svg.appendChild(el('rect',{x:X(3.2),y:25,width:X(end)-X(3.2),height:272,fill:'#f0f4ed'}));
    for (let i=0;i<5;i++) {const v=b[0]+i*(b[1]-b[0])/4;svg.appendChild(el('line',{x1:65,x2:975,y1:Y(v),y2:Y(v),stroke:'#e0e6dc'}));txt(svg,55,Y(v)+4,v.toFixed(2),{'text-anchor':'end'});txt(svg,X(end*i/4),322,(end*i/4).toFixed(1),{'text-anchor':'middle'});}
    svg.appendChild(el('line',{x1:X(3.2),x2:X(3.2),y1:25,y2:297,stroke:'#95a491','stroke-dasharray':'4 4'}));
    if (multiple>1) txt(svg,X(3.2)+7,40,'Beyond training horizon',{'font-size':10});
    const cut=Math.max(1,x.findLastIndex(t=>t<=end*pos+1e-8)+1);
    for (const c of curves) line(svg,x.slice(0,cut),c.y.slice(0,cut),X,Y,c.k,c.k==='truth'?2.5:2);
    svg.appendChild(el('line',{x1:X(end*pos),x2:X(end*pos),y1:25,y2:297,stroke:'#91a58a'}));txt(svg,500,345,'Time',{'text-anchor':'middle'});
    const err=$('error-plot');err.replaceChildren();
    const es=curves.filter(c=>c.k!=='truth').map(c=>({k:c.k,y:c.y.map((v,i)=>Math.max(.01,100*Math.abs(v-reference[i])/p.std[channel]))}));
    const max=Math.max(1,...es.flatMap(c=>c.y)),hi=Math.ceil(Math.log10(max)),EY=v=>150-127*(Math.log10(v)+2)/(hi+2);
    for (let n=-2;n<=hi;n++) {const y=EY(10**n);err.appendChild(el('line',{x1:65,x2:975,y1:y,y2:y,stroke:'#e0e6dc'}));txt(err,55,y+4,String(10**n),{'text-anchor':'end'});}
    for (const c of es) line(err,x.slice(0,cut),c.y.slice(0,cut),X,EY,c.k,1.7);
    for (let n=0;n<5;n++) txt(err,X(end*n/4),177,(end*n/4).toFixed(1),{'text-anchor':'middle'});
    $('progress').value=Math.round(pos*1000);$('clock').textContent='t = '+(end*pos).toFixed(1);$('finding').textContent=findings[task][family];
    $('status').textContent='Test case 0 · seed '+seed+' · sensor '+(channel+1)+' · axes fit visible curves';
  }
  function small(svg,name,wide=false) {
    const p=data[name].families[name==='relaxation'?'shift':'new'],nie=data[name].kinds[0],W=wide?500:320,H=wide?300:130,P=wide?35:12;
    const ks=wide?['truth',...data[name].kinds]:['truth',nie];
    const curves=ks.map(k=>({k,y:(k==='truth'?p.truth:p.pred[5301][k]).map(r=>r[0])})),b=bounds(curves.flatMap(c=>c.y));
    const X=t=>P+t/25.6*(W-2*P),Y=y=>H-P-(y-b[0])/(b[1]-b[0])*(H-2*P);svg.replaceChildren();
    svg.appendChild(el('rect',{x:X(3.2),y:P,width:X(25.6)-X(3.2),height:H-2*P,fill:'#e8eee2'}));
    for (const c of curves) line(svg,p.t,c.y,X,Y,c.k,c.k===nie?2:1.5);
    if (wide) {txt(svg,35,18,'Sensor 1',{'font-size':10});txt(svg,465,295,'t = 25.6',{'text-anchor':'end','font-size':10});}
  }
  function frame(now) {if(playing){if(last)pos+=(now-last)/16000;if(pos>=1){pos=1;playing=false;$('play').textContent='Play';}draw();}last=now;requestAnimationFrame(frame);}
  async function main() {
    try {
      if (!('DecompressionStream' in window)) throw Error('Use a current browser for replay data');
      const r=await fetch('release.json');if(!r.ok)throw Error('Release manifest unavailable');const release=await r.json();
      await Promise.all(Object.keys(info).map(async k=>{const parts=await Promise.all(release.tasks[k].parts.map(async path=>{const r=await fetch(path);if(!r.ok)throw Error('Replay data unavailable: '+k);return r.text();}));data[k]=await decode(JSON.parse(parts.join('')));}));
      for (const k of Object.keys(info)) small($('spark-'+k),k);small($('hero-plot'),'diffusion2d',true);controls();
      $('play').disabled=false;$('reset').disabled=false;$('show-all').addEventListener('click',showAll);
      document.querySelectorAll('[data-task],[data-case]').forEach(e=>e.addEventListener('click',()=>{task=e.dataset.task||e.dataset.case;family='new';controls();}));
      $('family').addEventListener('change',e=>{family=e.target.value;pos=1;playing=false;$('play').textContent='Play';renderSummary();draw();});
      $('seed').addEventListener('change',e=>{seed=e.target.value;draw();});$('channel').addEventListener('change',e=>{channel=+e.target.value;draw();});
      $('horizon').addEventListener('change',e=>{multiple=+e.target.value;pos=1;playing=false;$('play').textContent='Play';draw();});
      $('play').addEventListener('click',()=>{if(pos===1)pos=0;playing=!playing;$('play').textContent=playing?'Pause':'Play';draw();});
      $('reset').addEventListener('click',()=>{pos=0;playing=false;$('play').textContent='Play';draw();});
      $('progress').addEventListener('input',e=>{pos=+e.target.value/1000;playing=false;$('play').textContent='Play';draw();});
      window.NIE_REPLAY_READY=true;requestAnimationFrame(frame);
    } catch(e) {$('status').textContent='Replay unavailable: '+e.message;console.error(e);}
  }
  main();
})();
