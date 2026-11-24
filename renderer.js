/* All objects and materials are drawn procedurally in the browser. */
(() => {
  'use strict';
  function hexColor(hex){let x=hex.replace('#','');if(x.length===3)x=x.split('').map(c=>c+c).join('');return [parseInt(x.slice(0,2),16)/255,parseInt(x.slice(2,4),16)/255,parseInt(x.slice(4,6),16)/255];}

  function fallback2d(canvas, options){
    const ctx=canvas.getContext('2d'),size=canvas.width;
    ctx.clearRect(0,0,size,size);ctx.save();ctx.scale(size/600,size/600);
    const tint=options.color||'#6555ee';
    const rgb=hexColor(tint).map(v=>Math.round(v*255));
    const mix=(target,amount)=>'#'+rgb.map((v,i)=>Math.round(v*(1-amount)+target[i]*amount).toString(16).padStart(2,'0')).join('');
    const lightAmount=Math.max(0,Math.min(1,((options.light??70)-35)/65));
    const dark=mix([5,6,14],.8),deep=mix([10,10,24],.56),mid=mix([255,255,255],.15),light=mix([255,255,255],.35+lightAmount*.45),pale=mix([255,255,255],.58+lightAmount*.4);
    const round=(x,y,w,h,r)=>{r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();};
    const shine=(x,w)=>{const g=ctx.createLinearGradient(x,0,x+w,0);if(options.finish==='chrome'){
      [[0,'#171827'],[.07,'#788294'],[.14,'#f9fafc'],[.23,deep],[.34,'#272937'],[.45,'#f7f3ed'],[.54,'#a6aebd'],[.65,'#272631'],[.76,mid],[.9,'#ededed'],[1,'#1a1a25']].forEach(s=>g.addColorStop(...s));
    }else if(options.finish==='satin'){
      [[0,deep],[.1,tint],[.29,mid],[.48,tint],[.78,deep],[.94,dark],[1,deep]].forEach(s=>g.addColorStop(...s));
    }else{
      [[0,dark],[.07,deep],[.15,light],[.2,pale],[.25,mid],[.42,tint],[.62,deep],[.78,tint],[.9,light],[.96,deep],[1,dark]].forEach(s=>g.addColorStop(...s));
    }return g;};
    const chrome=(x,w)=>{const g=ctx.createLinearGradient(x,0,x+w,0);[[0,'#171923'],[.1,'#737a88'],[.2,'#f6f7f6'],[.32,'#6c7080'],[.48,'#181a25'],[.62,'#d1d2d3'],[.77,'#fff8ed'],[.89,'#6a6d79'],[1,'#181823']].forEach(s=>g.addColorStop(...s));return g;};
    const halo=ctx.createRadialGradient(300,300,15,300,300,280);halo.addColorStop(0,mix([255,255,255],.12)+'88');halo.addColorStop(.5,tint+'33');halo.addColorStop(1,tint+'00');ctx.fillStyle=halo;ctx.fillRect(0,0,600,600);
    ctx.translate(300,300);ctx.scale(1.13,1.13);ctx.translate(-300,-300);
    if(options.shape==='sculpture'){
      ctx.save();ctx.translate(300,300);ctx.rotate((options.time||0)*.00008);
      const ring=ctx.createLinearGradient(-220,-120,220,120);
      const ringStops=options.finish==='chrome'?[[0,'#171923'],[.12,'#8399bf'],[.23,pale],[.33,deep],[.47,'#202a3a'],[.58,light],[.71,mid],[.84,pale],[1,'#131b24']]:options.finish==='satin'?[[0,dark],[.16,deep],[.32,mid],[.48,tint],[.68,light],[.84,deep],[1,dark]]:[[0,dark],[.12,deep],[.23,pale],[.33,tint],[.47,deep],[.58,light],[.71,mid],[.84,pale],[1,dark]];
      ringStops.forEach(s=>ring.addColorStop(...s));
      for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=14;ctx.shadowOffsetY=8;ctx.beginPath();ctx.ellipse(0,0,174,80,0,0,Math.PI*2);ctx.lineWidth=46;ctx.strokeStyle=ring;ctx.stroke();ctx.shadowColor='transparent';ctx.beginPath();ctx.ellipse(0,0,174,80,0,0,Math.PI*2);ctx.lineWidth=1.5;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.stroke();ctx.restore();}
      ctx.restore();ctx.restore();return canvas;
    }
    ctx.save();ctx.filter='blur(14px)';ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(300,469,125,21,0,0,Math.PI*2);ctx.fill();ctx.restore();
    const name=options.name.toLocaleUpperCase().slice(0,22);
    const label=(y,width)=>{ctx.save();ctx.textAlign='center';ctx.fillStyle=options.labelColor||'#ffffff';ctx.shadowColor='rgba(0,0,0,.32)';ctx.shadowBlur=1;let fs=25;ctx.font=`700 ${fs}px "Space Grotesk", sans-serif`;while(ctx.measureText(name).width>width&&fs>12){fs--;ctx.font=`700 ${fs}px "Space Grotesk", sans-serif`;}ctx.fillText(name,300,y);ctx.globalAlpha=.84;ctx.font='8px "DM Mono", monospace';ctx.fillText('A WORLD OF YOUR OWN',300,y+20,width);ctx.font='7px "DM Mono", monospace';ctx.fillText('STUDIO EDITION  /  NO. 001',300,y+34,width);ctx.restore();};
    const gloss=(x,y,w,h,r)=>{ctx.save();round(x,y,w,h,r);ctx.clip();const gl=ctx.createLinearGradient(x,y,x+w,y);gl.addColorStop(0,'rgba(255,255,255,.08)');gl.addColorStop(.15,'rgba(255,255,255,.02)');gl.addColorStop(.19,'rgba(255,255,255,.38)');gl.addColorStop(.23,'rgba(255,255,255,.04)');gl.addColorStop(.74,'rgba(255,255,255,0)');gl.addColorStop(.9,'rgba(255,255,255,.12)');gl.addColorStop(1,'rgba(0,0,0,.2)');ctx.fillStyle=gl;ctx.fillRect(x,y,w,h);const spec=ctx.createLinearGradient(0,y,0,y+h);spec.addColorStop(0,`rgba(255,255,255,${.04+options.light/400})`);spec.addColorStop(.25,'rgba(255,255,255,0)');spec.addColorStop(.9,'rgba(0,0,0,0)');spec.addColorStop(1,'rgba(0,0,0,.28)');ctx.fillStyle=spec;ctx.fillRect(x,y,w,h);ctx.restore();};
    if(options.shape==='bottle'){
      const x=205,y=171,w=190,h=270;
      round(252,133,96,61,12);ctx.fillStyle=shine(252,96);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(255,255,255,.27)';ctx.stroke();
      round(244,105,112,53,9);ctx.fillStyle=chrome(244,112);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.stroke();
      ctx.beginPath();ctx.ellipse(300,106,52,7,0,Math.PI,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.stroke();
      ctx.save();ctx.shadowColor='rgba(2,2,12,.35)';ctx.shadowBlur=24;ctx.shadowOffsetY=11;round(x,y,w,h,35);ctx.fillStyle=shine(x,w);ctx.fill();ctx.restore();
      gloss(x,y,w,h,35);round(x+2,y+2,w-4,h-4,33);ctx.strokeStyle='rgba(255,255,255,.38)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+18,y+h-18);ctx.quadraticCurveTo(300,y+h+1,x+w-18,y+h-18);ctx.strokeStyle='rgba(255,255,255,.26)';ctx.lineWidth=2;ctx.stroke();label(y+135,155);
    }else if(options.shape==='can'){
      const x=210,y=144,w=180,h=304;
      ctx.save();ctx.shadowColor='rgba(2,2,12,.3)';ctx.shadowBlur=20;ctx.shadowOffsetY=10;round(x,y,w,h,23);ctx.fillStyle=shine(x,w);ctx.fill();ctx.restore();
      gloss(x,y,w,h,23);ctx.fillStyle=chrome(x,w);ctx.beginPath();ctx.ellipse(300,y+8,88,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.ellipse(300,y+7,68,7,0,0,Math.PI*2);ctx.strokeStyle='rgba(32,35,45,.75)';ctx.stroke();ctx.fillStyle=chrome(x,w);ctx.beginPath();ctx.ellipse(300,y+h-9,88,12,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(300,y+h-10,84,9,0,0,Math.PI);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.stroke();label(y+151,145);
    }else{
      const x=188,y=243,w=224,h=190;
      ctx.save();ctx.shadowColor='rgba(2,2,12,.3)';ctx.shadowBlur=21;ctx.shadowOffsetY=10;round(x,y,w,h,30);ctx.fillStyle=shine(x,w);ctx.fill();ctx.restore();gloss(x,y,w,h,30);round(x+2,y+2,w-4,h-4,28);ctx.lineWidth=2;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.stroke();
      round(x-4,y-34,w+8,51,10);ctx.fillStyle=chrome(x-4,w+8);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.stroke();ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+w,y-10);ctx.moveTo(x,y-3);ctx.lineTo(x+w,y-3);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.stroke();label(y+92,175);
    }
    ctx.restore();return canvas;
  }
  function create(){
    const canvas=document.createElement('canvas');
    return {kind:'2d',render(options,size=420){if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size;}return fallback2d(canvas,options);}};
  }
  window.WorldsRenderer={create};
})();
