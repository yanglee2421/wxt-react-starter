var b=Object.defineProperty;var M=(i,t,s)=>t in i?b(i,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[t]=s;var o=(i,t,s)=>(M(i,typeof t!="symbol"?t+"":t,s),s),f=(i,t,s)=>{if(!t.has(i))throw TypeError("Cannot "+s)};var e=(i,t,s)=>(f(i,t,"read from private field"),s?s.call(i):t.get(i)),x=(i,t,s)=>{if(t.has(i))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(i):t.set(i,s)},m=(i,t,s,n)=>(f(i,t,"write to private field"),n?n.call(i,s):t.set(i,s),s);import{j as y}from"./index-f0e7dd37.js";import{r as E}from"./antd-63f1a089.js";import{u as C}from"./useResize-9ddaf608.js";import{u as _}from"./useStyle-128032ca.js";const j="_partcle_1tj4z_1",R="_particle-canvas_1tj4z_10",P="_particle-content_1tj4z_16",z={partcle:j,particleCanvas:R,particleContent:P};class w{constructor(t,s){this.min=t,this.max=s}get(){return Math.random()*(this.max-this.min)+this.min}}const p=new w(-1,1),A=new w(2,4);class g{constructor(t){o(this,"xv",p.get());o(this,"yv",p.get());o(this,"radius",A.get());o(this,"x");o(this,"y");o(this,"color");this.canvas=t,this.x=Math.random()*t.width,this.y=Math.random()*t.height,this.color=`rgba(254,250,255,${1-1/this.radius})`}draw(){const t=this.canvas.getContext("2d");t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.closePath(),t.strokeStyle=this.color,t.stroke()}update(){const{width:t,height:s}=this.canvas;(this.x<0||this.x>t)&&(this.xv*=-1),(this.y<0||this.y>s)&&(this.yv*=-1),this.x+=this.xv,this.y+=this.yv,this.draw()}}var r,d,a,l;class L{constructor(t,s=100,n=100){x(this,r,[]);x(this,d,0);x(this,a,null);x(this,l,new AbortController);this.canvas=t,this.lineMax=n;for(let h=0;h<s;h++)e(this,r).push(new g(this.canvas))}drawLine(){e(this,r).forEach((t,s)=>{e(this,r).slice(s+1).forEach(n=>{const h=Math.abs(t.x-n.x);if(h>this.lineMax)return;const v=Math.abs(t.y-n.y);if(v>this.lineMax)return;const u=Math.sqrt(h**2+v**2);if(u>this.lineMax)return;const c=this.canvas.getContext("2d");c.beginPath(),c.moveTo(t.x,t.y),c.lineTo(n.x,n.y),c.closePath(),c.strokeStyle=`rgba(254,250,255, ${1-u/this.lineMax})`,c.lineWidth=.8,c.stroke()})})}animate(){m(this,d,requestAnimationFrame(this.animate.bind(this))),this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height),e(this,r).forEach(s=>s.update()),this.drawLine()}abortAnimate(){cancelAnimationFrame(e(this,d))}bindEvent(){m(this,l,new AbortController);const{signal:t}=e(this,l);this.canvas.addEventListener("mouseover",({offsetX:s,offsetY:n})=>{e(this,a)||(m(this,a,new g(this.canvas)),e(this,a).x=s,e(this,a).y=n,e(this,a).xv=0,e(this,a).yv=0,e(this,r).push(e(this,a)))},{signal:t}),this.canvas.addEventListener("mousemove",({offsetX:s,offsetY:n})=>{e(this,a)&&(e(this,a).x=s,e(this,a).y=n)},{signal:t}),this.canvas.addEventListener("mouseout",()=>{e(this,a)&&e(this,r).includes(e(this,a))&&(e(this,r).splice(e(this,r).indexOf(e(this,a)),1),m(this,a,null))},{signal:t})}abortEvent(){e(this,l).abort()}}r=new WeakMap,d=new WeakMap,a=new WeakMap,l=new WeakMap;function I(){const i=_(z),t=E.useRef(null),s=C(n=>{const h=t.current;if(!h)return;Object.assign(h,n);const v=setTimeout(()=>{const u=new L(h,n.width/1920*120,100);u.animate(),u.bindEvent()},500);return()=>{clearTimeout(v)}});return y.jsx("div",{ref:s,className:i("partcle"),children:y.jsx("canvas",{ref:t,className:i("particle-canvas")})})}export{I as Component};
