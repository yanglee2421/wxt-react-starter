var R=Object.defineProperty;var j=(e,t,s)=>t in e?R(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var n=(e,t,s)=>(j(e,typeof t!="symbol"?t+"":t,s),s),w=(e,t,s)=>{if(!t.has(e))throw TypeError("Cannot "+s)};var o=(e,t,s)=>(w(e,t,"read from private field"),s?s.call(e):t.get(e)),m=(e,t,s)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,s)},f=(e,t,s,i)=>(w(e,t,"write to private field"),i?i.call(e,s):t.set(e,s),s);import{l as u}from"./index-c2cc4b23.js";import{c as k}from"./clsx-1229b3e0.js";import{r,S as z,L as _}from"./antd-57ea9798.js";import{u as B}from"./use-resize-65cef62a.js";class v{constructor(t,s){this.min=t,this.max=s}get(){return Math.random()*(this.max-this.min)+this.min}}const C=new v(-.5,.5),A=new v(1,3),E=new v(1,4);var x,y;class M{constructor(t){m(this,x);n(this,"x",0);n(this,"y",0);n(this,"xv",0);n(this,"yv",2);n(this,"r",0);n(this,"color","");this.canvas=t,this.reset()}reset(){this.x=Math.random()*this.canvas.width,this.y=0,this.xv=C.get(),this.yv=A.get(),this.r=E.get(),this.color=`rgba(255,255,255,${.5+this.r/4})`}draw(){const t=this.canvas.getContext("2d");t.beginPath(),t.arc(this.x,this.y,this.r,0,Math.PI*2),t.closePath(),t.fillStyle=this.color,t.shadowColor="#fff",t.shadowBlur=10,t.fill()}update(){o(this,x,y)||this.reset(),this.x+=this.xv,this.y+=this.yv,this.draw()}}x=new WeakSet,y=function(){const t=this.x>0&&this.x<this.canvas.width,s=this.y>0&&this.y<this.canvas.height;return t&&s};var a,l;class I{constructor(t,s=100){m(this,a,[]);m(this,l,0);this.canvas=t,this.number=s}animate(){f(this,l,requestAnimationFrame(this.animate.bind(this)));const t=this.canvas.getContext("2d"),{width:s,height:i}=this.canvas;t.clearRect(0,0,s,i),o(this,a).length<this.number&&o(this,a).push(new M(this.canvas)),o(this,a).forEach(g=>g.update())}abortAnimate(){cancelAnimationFrame(o(this,l)),f(this,a,[])}}a=new WeakMap,l=new WeakMap;const P="_ctx_atyyk_1",F="_box_atyyk_6",b={ctx:P,box:F},L="/react-antd/assets/snow-0970bb49.jpg",N="/react-antd/assets/snow-village-4117bc33.jpg";function q(){const e=r.useRef(null),t=r.useRef(null),s=B(t);r.useEffect(()=>{if(!s)return;const[c]=s.contentBoxSize,d=e.current;if(!d)return;Object.assign(d,{width:c.inlineSize,height:c.blockSize});let h=null;const S=setTimeout(()=>{h=new I(d,c.inlineSize/1920*200),h.animate()},500);return()=>{clearTimeout(S),h==null||h.abortAnimate()}},[s]);const[i,g]=r.useState(!1),p=r.useMemo(()=>u.jsx(z,{onChange:()=>g(c=>!c),checked:i}),[i]);return u.jsxs(_,{ref:t,className:k(["h-full",b.box]),style:{backgroundImage:`url(${i?L:N})`},children:[u.jsx("canvas",{ref:e,className:b.ctx}),u.jsx("div",{children:p})]})}export{q as Component};