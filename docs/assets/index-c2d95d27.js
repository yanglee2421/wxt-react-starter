import{j as e}from"./index-6c9ed304.js";import{m,c}from"./antd-756ea8ee.js";import{u as l}from"./useStyle-f7c045c6.js";const x="_form-ul_5ftoi_1",u="_box_5ftoi_11",j="_ol_5ftoi_15",o={formUl:x,box:u,ol:j},d="/vite-react/assets/fh-866a5734.jpg";function g(){const t=l(o);return e.jsxs("div",{className:t("box"),children:[e.jsx("h2",{children:"Form & Input"}),e.jsxs("form",{onSubmit:n=>{n.preventDefault(),m.success("提交成功");const s=new FormData(n.currentTarget),i=Object.fromEntries(s.entries());console.log(i)},children:[e.jsxs(h,{children:[e.jsx("input",{type:"text",name:"text",required:!0}),e.jsx("input",{type:"number",name:"number",max:99,min:1}),e.jsx("input",{type:"url",name:"url"}),e.jsx("input",{type:"search",name:"search",maxLength:9,minLength:2}),e.jsx("input",{type:"password",name:"password"}),e.jsx("input",{type:"email",name:"email"}),e.jsx("input",{type:"tel",name:"tel"}),e.jsx("input",{type:"datetime-local",name:"datetime-local"}),e.jsx("input",{type:"month",name:"month"}),e.jsx("input",{type:"date",name:"date"}),e.jsx("input",{type:"week",name:"week"}),e.jsx("input",{type:"time",name:"time"}),e.jsx("input",{type:"checkbox",name:"checkbox"}),e.jsx("input",{type:"radio",name:"radio",defaultChecked:!0}),e.jsx("input",{type:"color",name:"color",defaultValue:"#ffffff"}),e.jsx("input",{type:"file",name:"file"}),e.jsx("input",{type:"range",name:"range"}),e.jsx("input",{type:"hidden",name:"hidden"}),e.jsx("input",{type:"button",value:"inputBtn"}),e.jsx("input",{type:"image",src:d}),e.jsx("input",{type:"submit",value:"submitBtn"}),e.jsx("input",{type:"reset",value:"resetBtn"})]}),e.jsxs("ol",{className:t("ol"),children:[e.jsx("li",{children:e.jsxs("label",{children:["radio2：",e.jsx("input",{type:"radio",name:"radio",value:2})]})}),e.jsxs("li",{children:[e.jsx("label",{children:"select："}),e.jsxs("select",{name:"select",children:[e.jsx("option",{value:"1",children:"1"}),e.jsx("option",{value:"2",children:"2"}),e.jsx("option",{value:"3",children:"3"})]})]}),e.jsxs("li",{children:[e.jsx("label",{children:"textarea："}),e.jsx("textarea",{name:"textarea",maxLength:20,minLength:2,cols:30,rows:5})]})]})]})]})}function h(t){const{children:n}=t,s=l(o),i=c.Children.map(n,(a,p)=>{var r;if(a)return e.jsx("li",{children:e.jsxs("label",{children:[((r=a.props)==null?void 0:r.type)+"："||"",a]})},p)});return e.jsx("ol",{className:s("form-ul"),children:i})}export{g as Component};