import{r as h}from"./jsx-runtime-d4f0a224.js";import{f as O,g as _,h as D,E as H,i as S,j as x,D as K,k as U,l as W,m as F,n as b}from"./index-73e15bd9.js";function g(){return g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g.apply(this,arguments)}function E(e,t){if(e==null)return{};var n={},r=Object.keys(e),a,i;for(i=0;i<r.length;i++)a=r[i],!(t.indexOf(a)>=0)&&(n[a]=e[a]);return n}function z(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function A(e,t){return e.button===0&&(!t||t==="_self")&&!z(e)}const I=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset"],M=["aria-current","caseSensitive","className","end","style","to","children"];function V(e,t){return O({basename:t==null?void 0:t.basename,history:_({window:t==null?void 0:t.window}),hydrationData:(t==null?void 0:t.hydrationData)||B(),routes:D(e)}).initialize()}function B(){var e;let t=(e=window)==null?void 0:e.__staticRouterHydrationData;return t&&t.errors&&(t=g({},t,{errors:T(t.errors)})),t}function T(e){if(!e)return null;let t=Object.entries(e),n={};for(let[r,a]of t)if(a&&a.__type==="RouteErrorResponse")n[r]=new H(a.status,a.statusText,a.data,a.internal===!0);else if(a&&a.__type==="Error"){let i=new Error(a.message);i.stack="",n[r]=i}else n[r]=a;return n}const q=h.forwardRef(function(t,n){let{onClick:r,relative:a,reloadDocument:i,replace:s,state:c,target:u,to:l,preventScrollReset:f}=t,p=E(t,I),k=W(l,{relative:a}),v=G(l,{replace:s,state:c,target:u,preventScrollReset:f,relative:a});function R(o){r&&r(o),o.defaultPrevented||v(o)}return h.createElement("a",g({},p,{href:k,onClick:i?r:R,ref:n,target:u}))}),X=h.forwardRef(function(t,n){let{"aria-current":r="page",caseSensitive:a=!1,className:i="",end:s=!1,style:c,to:u,children:l}=t,f=E(t,M),p=S(u,{relative:f.relative}),k=x(),v=h.useContext(K),{navigator:R}=h.useContext(U),o=R.encodeLocation?R.encodeLocation(p).pathname:p.pathname,m=k.pathname,d=v&&v.navigation&&v.navigation.location?v.navigation.location.pathname:null;a||(m=m.toLowerCase(),d=d?d.toLowerCase():null,o=o.toLowerCase());let y=m===o||!s&&m.startsWith(o)&&m.charAt(o.length)==="/",C=d!=null&&(d===o||!s&&d.startsWith(o)&&d.charAt(o.length)==="/"),N=y?r:void 0,w;typeof i=="function"?w=i({isActive:y,isPending:C}):w=[i,y?"active":null,C?"pending":null].filter(Boolean).join(" ");let j=typeof c=="function"?c({isActive:y,isPending:C}):c;return h.createElement(q,g({},f,{"aria-current":N,className:w,ref:n,style:j,to:u}),typeof l=="function"?l({isActive:y,isPending:C}):l)});var L;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmitImpl="useSubmitImpl",e.UseFetcher="useFetcher"})(L||(L={}));var P;(function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(P||(P={}));function G(e,t){let{target:n,replace:r,state:a,preventScrollReset:i,relative:s}=t===void 0?{}:t,c=F(),u=x(),l=S(e,{relative:s});return h.useCallback(f=>{if(A(f,n)){f.preventDefault();let p=r!==void 0?r:b(u)===b(l);c(e,{replace:p,state:a,preventScrollReset:i,relative:s})}},[u,c,l,r,a,n,e,i,s])}export{X as N,V as c};