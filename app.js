(() => {
  'use strict';
  const poster=document.querySelector('#poster');
  const posterCtx=poster.getContext('2d');
  const mini=document.querySelector('#mobile-preview');
  const miniCanvas=document.querySelector('#mini-poster');
  const miniCtx=miniCanvas.getContext('2d');
  const hero=document.querySelector('#hero-canvas');
  const heroCtx=hero.getContext('2d');
  const nameInput=document.querySelector('#brand-name');
  const lightInput=document.querySelector('#lighting');
  const lightValue=document.querySelector('#lighting-value');
  const colorInput=document.querySelector('#object-color');
  const colorValue=document.querySelector('#color-value');
  const status=document.querySelector('#action-status');
  const index=document.querySelector('#poster-index');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const worlds={
    electric:{number:'01',label:'ELECTRIC',descriptor:'A NEW KIND OF ENERGY',headline:['THINK','BEYOND.'],palette:['#111260','#4939eb','#a589ff'],tint:'#5949ff',accent:'#d2ff73',bottom:'#ffffff'},
    bloom:{number:'02',label:'SUPERBLOOM',descriptor:'A LITTLE MORE ALIVE',headline:['MAKE IT','BLOOM.'],palette:['#98294e','#ef624d','#ffc09b'],tint:'#ff8a8e',accent:'#fff4a0',bottom:'#ffffff'},
    nocturne:{number:'03',label:'AFTER HOURS',descriptor:'BEAUTY IN THE UNKNOWN',headline:['FEEL','EVERYTHING.'],palette:['#130d20','#4e2648','#ac6072'],tint:'#b67898',accent:'#f3d9b3',bottom:'#ffffff'},
    citrus:{number:'04',label:'CITRUS CLUB',descriptor:'A BRIGHTER POINT OF VIEW',headline:['BRIGHT','IDEAS.'],palette:['#7d3812','#e88321','#ffcd6d'],tint:'#ffc331',accent:'#fcffcc',bottom:'#2b260f'},
    ocean:{number:'05',label:'DEEP BLUE',descriptor:'DIVE A LITTLE DEEPER',headline:['GO','DEEPER.'],palette:['#093a49','#087f88','#8dd7c9'],tint:'#1fc0ba',accent:'#d6ffb6',bottom:'#102f36'},
    studio:{number:'06',label:'ATELIER',descriptor:'BEAUTY IN THE DETAILS',headline:['LESS, BUT','BETTER.'],palette:['#282323','#766a61','#dfd4c3'],tint:'#d4c3aa',accent:'#f8e5c6',bottom:'#282320'}
  };
  const shapes=['bottle','can','jar','sculpture'];
  const finishes=['glass','chrome','satin'];
  const params=new URLSearchParams(location.search);
  let world=Object.hasOwn(worlds,params.get('world'))?params.get('world'):'electric';
  let shape=shapes.includes(params.get('object'))?params.get('object'):'bottle';
  let finish=finishes.includes(params.get('finish'))?params.get('finish'):'glass';
  let brightness=Math.min(100,Math.max(35,Number(params.get('light'))||70));
  let customColor=/^#[0-9a-f]{6}$/i.test(params.get('color')||'')?params.get('color').toLowerCase():'';
  nameInput.value=(params.get('name')||'').slice(0,22);
  lightInput.value=brightness;
  const renderer=window.WorldsRenderer.create();
  poster.dataset.rendering=renderer.kind;
  let posterVisible=true,heroVisible=true,miniVisible=false,frame=0,lastTime=0;
  const cleanName=()=> (nameInput.value.trim()||'YOUR IDEA').replace(/\s+/g,' ').slice(0,22);
  function updateUrl(){
    const url=new URL(location.href);
    const values={name:nameInput.value.trim().slice(0,22),world:world==='electric'?'':world,object:shape==='bottle'?'':shape,finish:finish==='glass'?'':finish,color:customColor,light:brightness===70?'':String(brightness)};
    Object.entries(values).forEach(([key,value])=>value?url.searchParams.set(key,value):url.searchParams.delete(key));
    try{history.replaceState(null,'',url);}catch(_){}
  }
  function paintText(ctx,text,x,y,{size=15,color='#fff',font='DM Mono',weight=400,align='left'}={}){ctx.font=`${weight} ${size}px "${font}", monospace`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(text,x,y);ctx.textAlign='left';}
  function fitText(ctx,text,maxWidth,initial){let size=initial;do{ctx.font=`700 ${size}px "Space Grotesk", sans-serif`;if(ctx.measureText(text).width<=maxWidth)break;size-=2;}while(size>32);}
  function star(ctx,x,y,outer,inner,points,rotate=0){ctx.beginPath();for(let i=0;i<points*2;i++){const a=rotate+i*Math.PI/points,r=i%2===0?outer:inner,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();}
  function sceneOptions(now,heroMode=false){const color=heroMode?'#5c62ff':(customColor||worlds[world].tint);const red=parseInt(color.slice(1,3),16),green=parseInt(color.slice(3,5),16),blue=parseInt(color.slice(5,7),16);const luminance=(red*.299+green*.587+blue*.114);return {shape:heroMode?'sculpture':shape,finish:heroMode?'chrome':finish,color,name:cleanName(),labelColor:(finish==='chrome'||luminance>175)?'#151826':'#ffffff',light:brightness,time:motion.matches?0:now};}
  function renderPoster(ctx,width,height,now=0,quality=420){
    ctx.save();ctx.scale(width/900,height/1125);ctx.clearRect(0,0,900,1125);
    const d=worlds[world],bg=ctx.createLinearGradient(0,0,900,1125);bg.addColorStop(0,d.palette[0]);bg.addColorStop(.55,d.palette[1]);bg.addColorStop(1,d.palette[2]);ctx.fillStyle=bg;ctx.fillRect(0,0,900,1125);
    ctx.globalAlpha=.16;ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(26,26,848,1073);ctx.beginPath();ctx.moveTo(54,91);ctx.lineTo(846,91);ctx.moveTo(54,1035);ctx.lineTo(846,1035);ctx.stroke();ctx.globalAlpha=1;
    paintText(ctx,'W O R L D S  /  THE WORLD LAB',55,70,{size:14});paintText(ctx,`${d.number} / 06`,845,70,{size:14,align:'right'});
    d.headline.forEach((text,i)=>paintText(ctx,text,55,189+i*86,{size:text.length>10?65:82,font:'Space Grotesk',weight:700}));
    paintText(ctx,d.descriptor,60,345,{size:13,color:'rgba(255,255,255,.85)'});
    ctx.save();ctx.globalAlpha=.24;ctx.filter='blur(20px)';ctx.fillStyle='#0a0b18';ctx.beginPath();ctx.ellipse(475,797,180,27,0,0,Math.PI*2);ctx.fill();ctx.restore();
    const artwork=renderer.render(sceneOptions(now),quality);ctx.drawImage(artwork,100,245,700,700);
    ctx.fillStyle=d.accent;star(ctx,775,357,26,9,8,now*.00006);star(ctx,140,688,16,5,8,-now*.00005);
    paintText(ctx,`WORLD ${d.number} / ${d.label}`,55,885,{size:14,color:world==='studio'||world==='citrus'||world==='ocean'?'rgba(26,25,25,.75)':'rgba(255,255,255,.84)'});
    const brand=cleanName().toLocaleUpperCase();fitText(ctx,brand,785,94);ctx.fillStyle=d.bottom;ctx.fillText(brand,50,985);
    const foot=world==='studio'||world==='citrus'||world==='ocean'?'rgba(25,24,24,.75)':'rgba(255,255,255,.82)';paintText(ctx,'ONE IDEA. INFINITE FEELINGS.',55,1072,{size:13,color:foot});paintText(ctx,'A WORLD BY RADOSTINA PETKOVA',845,1072,{size:13,color:foot,align:'right'});ctx.restore();
  }
  function renderHero(now=0){heroCtx.clearRect(0,0,hero.width,hero.height);heroCtx.drawImage(renderer.render(sceneOptions(now,true),420),0,0,hero.width,hero.height);}
  function drawOnce(now=performance.now()){if(heroVisible)renderHero(now);if(posterVisible||miniVisible){renderPoster(posterCtx,poster.width,poster.height,now);if(miniVisible){miniCtx.clearRect(0,0,miniCanvas.width,miniCanvas.height);miniCtx.drawImage(poster,0,0,miniCanvas.width,miniCanvas.height);}}}
  function loop(now){if(!motion.matches&&now-lastTime>70&&(posterVisible||heroVisible||miniVisible)){drawOnce(now);lastTime=now;}frame=requestAnimationFrame(loop);}
  function syncMini(){const bounds=document.querySelector('#lab').getBoundingClientRect();const show=window.innerWidth<=650&&!posterVisible&&bounds.top<window.innerHeight&&bounds.bottom>0;if(show!==miniVisible){miniVisible=show;mini.hidden=!show;if(show)drawOnce();}}
  function updateButtons(){
    document.querySelectorAll('[data-world]').forEach(button=>{const active=button.dataset.world===world;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    document.querySelectorAll('[data-object]').forEach(button=>{const active=button.dataset.object===shape;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    document.querySelectorAll('[data-finish]').forEach(button=>{const active=button.dataset.finish===finish;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    index.textContent=`WORLD ${worlds[world].number} / 06`;lightValue.textContent=`${brightness}%`;colorInput.value=customColor||worlds[world].tint;colorValue.textContent=colorInput.value.toUpperCase();poster.setAttribute('aria-label',`${worlds[world].label} ${finish} ${shape} mockup for ${cleanName()}`);
  }
  function change(){updateButtons();updateUrl();drawOnce();}
  document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>{world=b.dataset.world;customColor='';change();}));
  document.querySelectorAll('[data-object]').forEach(b=>b.addEventListener('click',()=>{shape=b.dataset.object;change();}));
  document.querySelectorAll('[data-finish]').forEach(b=>b.addEventListener('click',()=>{finish=b.dataset.finish;change();}));
  nameInput.addEventListener('input',change);
  colorInput.addEventListener('input',()=>{customColor=colorInput.value;change();});
  document.querySelector('#reset-color').addEventListener('click',()=>{customColor='';change();});
  mini.addEventListener('click',()=>document.querySelector('.poster-area').scrollIntoView({behavior:motion.matches?'auto':'smooth',block:'center'}));
  lightInput.addEventListener('input',()=>{brightness=Number(lightInput.value);change();});
  document.querySelector('#download').addEventListener('click',()=>{
    try{const output=document.createElement('canvas');output.width=1200;output.height=1500;renderPoster(output.getContext('2d'),1200,1500,0,650);output.toBlob(blob=>{if(!blob){status.textContent='Sorry, the poster could not be created. Please try again.';return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=`${cleanName().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'my-world'}-${world}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);status.textContent='Your poster is ready. Go make some noise.';},'image/png');}catch(_){status.textContent='Sorry, the poster could not be created in this browser.';}
  });
  document.querySelector('#share').addEventListener('click',async()=>{updateUrl();const url=new URL(location.href);url.hash='lab';try{await navigator.clipboard.writeText(url.toString());status.textContent='Link copied. Share your world.';}catch(_){window.prompt('Copy the link to your world:',url.toString());status.textContent='Your world link is ready to copy.';}});
  if('IntersectionObserver'in window){new IntersectionObserver(entries=>{posterVisible=entries[0].isIntersecting;syncMini();if(posterVisible)drawOnce();},{rootMargin:'150px'}).observe(poster);new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)drawOnce();},{rootMargin:'150px'}).observe(hero);}
  window.addEventListener('scroll',syncMini,{passive:true});window.addEventListener('resize',syncMini);
  motion.addEventListener?.('change',()=>drawOnce());
  document.querySelector('.hero').addEventListener('pointermove',event=>{if(motion.matches||event.pointerType==='touch')return;hero.style.setProperty('--mouse-x',`${(event.clientX/window.innerWidth-.5)*14}px`);hero.style.setProperty('--mouse-y',`${(event.clientY/window.innerHeight-.5)*14}px`);});
  document.fonts?.ready.then(()=>{renderer.invalidateLabel?.();drawOnce();}).catch(()=>{});
  updateButtons();updateUrl();drawOnce();frame=requestAnimationFrame(loop);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
})();
