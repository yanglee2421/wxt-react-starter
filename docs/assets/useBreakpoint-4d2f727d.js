import{r as s}from"./jsx-runtime-d4f0a224.js";import{u as c}from"./index-2be6ccbe.js";function a(){const[,r]=s.useReducer(e=>e+1,0);return r}function p(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0;const e=s.useRef({}),n=a(),t=c();return s.useEffect(()=>{const u=t.subscribe(o=>{e.current=o,r&&n()});return()=>t.unsubscribe(u)},[]),e.current}export{a,p as u};