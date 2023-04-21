"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[461],{2461:(e,t,l)=>{l.r(t),l.d(t,{default:()=>Ne});var a=l(3673),o=l(2323),s=l(1959),n=l(2993),i=l(925),r=l(9236),u=function(e,t,l,a){function o(e){return e instanceof l?e:new l((function(t){t(e)}))}return new(l||(l=Promise))((function(l,s){function n(e){try{r(a.next(e))}catch(t){s(t)}}function i(e){try{r(a["throw"](e))}catch(t){s(t)}}function r(e){e.done?l(e.value):o(e.value).then(n,i)}r((a=a.apply(e,t||[])).next())}))};const d={class:"container"},c={class:"treasury-title"},v=(0,a._)("span",{class:"text-warning"},"Iglesia local",-1),_={class:"subtitle"},m={class:"row q-col-gutter-sm"},p={class:"col-xs-12 col-sm-4"},w={class:"col-xs-12 col-sm-4"},h={class:"col-xs-12 col-sm-4"},x={key:0,class:"row flow-items q-col-gutter-x-lg q-pt-md"},b={class:"flow-title col-12"},g={class:"row q-pb-xs"},f={class:"col-8"},y={class:"col-xs-4 col-sm-4"},U={class:"self-center full-width no-outline",tabindex:"0"},k={key:1,class:"row flow-navitagor"},N={key:0},T={key:2,class:"row tithe-column"},S={class:"flow-title col-12"},z={class:"q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12"},I={class:"q-table treasury-table-data"},q=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Departamento")],-1),F={class:"text-right text-secondary"},E={class:"text-right text-positive"},A={class:"text-right text-negative"},L=(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Sub total")],-1),G=(0,a._)("th",{class:"text-right text-primary"},[(0,a._)("strong",null,"Total")],-1),H={class:"text-left"},W={class:"flow-head-table"},$={class:"text-right text-secondary"},D={class:"flow-row-table"},V={class:"text-hidden"},C={class:"text-right text-positive"},M={class:"flow-row-table"},R={class:"text-hidden"},O={class:"text-right text-negative"},j={class:"flow-row-table"},Y={class:"text-hidden"},Z={class:"text-right"},Q={class:"flow-row-table"},P=(0,a._)("span",{class:"text-hidden"},"Sub total:",-1),K={class:"text-right text-primary"},B={class:"flow-row-table"},J=(0,a._)("span",{class:"text-hidden"},"Total:",-1),X=(0,a._)("td",{class:"text-left"},[(0,a._)("span",{class:"flow-head-table"},[(0,a._)("strong",null,"TOTAL")])],-1),ee={class:"text-right text-secondary"},te={class:"flow-row-table"},le={class:"text-hidden"},ae={class:"text-right text-positive"},oe={class:"flow-row-table"},se={class:"text-hidden"},ne={class:"text-right text-negative"},ie={class:"flow-row-table"},re={class:"text-hidden"},ue={class:"text-right"},de={class:"flow-row-table"},ce=(0,a._)("span",{class:"text-hidden"},"Sub total:",-1),ve={class:"text-right text-primary"},_e={class:"flow-row-table"},me=(0,a._)("span",{class:"text-hidden"},"Total:",-1),pe={key:3,class:"q-pa-sm text-primary"},we=(0,a.aZ)({__name:"General",setup(e){var t,l;const we=(0,r.o)(),he=null===(l=null===(t=we.state.user)||void 0===t?void 0:t.user)||void 0===l?void 0:l.company.id,xe=()=>u(this,void 0,void 0,(function*(){const e=`entries?id_company=${he}&state=ACTIVE`,t=yield n.http.get(e);t.count>0&&(ye.value=1===t.rows[0].month?12:t.rows[0].month-1,ge.value=1===t.rows[0].month?t.rows[0].year-1:t.rows[0].year)})),be=(0,s.iH)(0),ge=(0,s.iH)(0),fe=(0,s.iH)("MONTH"),ye=(0,s.iH)(0),Ue=i.e7.map(((e,t)=>({value:t+1,label:e}))),ke=(0,i.V4)(),Ne=[{value:"GENERAL",label:"GENERAL"},{value:"MONTH",label:"MENSUAL"},{value:"INITIAL",label:"INICIAL"}],Te=(0,s.iH)([]),Se=()=>u(this,void 0,void 0,(function*(){if("GENERAL"===fe.value){const e=`expenses/report/${fe.value}?id_company=${he}`,t=yield n.http.get(e);Te.value=t.rows}else if("MONTH"===fe.value){const e=`expenses/report/${fe.value}?id_company=${he}&year=${ge.value}&month=${ye.value}`,t=yield n.http.get(e);Te.value=t.rows}else{const e=`flows?id_company=${he}&type=${fe.value}`,t=yield n.http.get(e);Te.value=t.rows}})),ze=()=>{let e=ge.value,t=ye.value+1;t>12&&(e++,t=1),ye.value=t,ge.value=e},Ie=()=>{let e=ge.value,t=ye.value-1;0===t&&(e--,t=12),ye.value=t,ge.value=e},qe=(0,a.Fl)((()=>{const e={previous:0,entry:0,tithe:0,entryTotal:0,expense:0,subtotal:0,total:0};return Te.value.forEach((t=>{e.previous+=t.previous?Number(t.previous):0,e.entry+=t.entry?Number(t.entry):0,e.tithe+=t.tithe?Number(t.tithe):0,e.entryTotal+=t.entryTotal?Number(t.entryTotal):0,e.expense+=t.expense?Number(t.expense):0,e.subtotal+=t.subtotal?Number(t.subtotal):0,e.total+=t.total?Number(t.total):0})),e})),Fe=(0,a.Fl)((()=>ye.value-2<0?11:ye.value-2));return(0,a.YP)(fe,(()=>u(this,void 0,void 0,(function*(){return yield Se()})))),(0,a.YP)(ge,(()=>u(this,void 0,void 0,(function*(){return yield Se()})))),(0,a.YP)(ye,(()=>u(this,void 0,void 0,(function*(){return yield Se()})))),(0,a.wF)((()=>u(this,void 0,void 0,(function*(){yield xe()})))),(e,t)=>{var l;const n=(0,a.up)("q-btn"),r=(0,a.up)("q-select"),u=(0,a.up)("q-field"),we=(0,a.up)("q-icon");return(0,a.wg)(),(0,a.iD)("div",d,[(0,a._)("h2",c,[(0,a.Wm)(n,{icon:"arrow_back",round:"",flat:"",onClick:t[0]||(t[0]=t=>e.$router.push("/treasury"))}),(0,a.Uk)(" Flujo de caja - "),v,(0,a._)("span",_,"Total: "+(0,o.zw)(((0,s.SU)(qe).total||0).toFixed(2))+" "+(0,o.zw)(null===(l=e.$store.state.user)||void 0===l?void 0:l.user.company.money),1)]),(0,a._)("div",m,[(0,a._)("div",p,[(0,a.Wm)(r,{filled:"",modelValue:fe.value,"onUpdate:modelValue":t[1]||(t[1]=e=>fe.value=e),options:Ne,label:"Tipo","map-options":"","emit-value":""},null,8,["modelValue"])]),(0,a._)("div",w,[(0,a.Wm)(r,{filled:"",modelValue:ge.value,"onUpdate:modelValue":t[2]||(t[2]=e=>ge.value=e),options:(0,s.SU)(ke),label:"Gestión",disable:"GENERAL"===fe.value||"INITIAL"===fe.value,"map-options":"","emit-value":""},null,8,["modelValue","options","disable"])]),(0,a._)("div",h,[(0,a.Wm)(r,{filled:"",modelValue:ye.value,"onUpdate:modelValue":t[3]||(t[3]=e=>ye.value=e),options:(0,s.SU)(Ue),label:"Mes",disable:"GENERAL"===fe.value||"YEAR"===fe.value||"INITIAL"===fe.value,"map-options":"","emit-value":""},null,8,["modelValue","options","disable"])])]),!Te.value.length||"GENERAL"!==fe.value&&"INITIAL"!==fe.value?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("div",x,[(0,a._)("h3",b,"Flujo de caja "+(0,o.zw)("GENERAL"===fe.value?"General":"Inicial"),1),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(Te.value,(t=>{var l,s;return(0,a.wg)(),(0,a.iD)("div",{class:"col-xs-12 col-sm-6",key:t.id},[(0,a._)("div",g,[(0,a._)("div",f,(0,o.zw)(null===(l=t.department)||void 0===l?void 0:l.name),1),(0,a._)("div",y,[(0,a.Wm)(u,{standout:"",class:"text-right",dense:"",placeholder:"0",suffix:null===(s=e.$store.state.user)||void 0===s?void 0:s.user.company.money},{control:(0,a.w5)((()=>[(0,a._)("div",U,(0,o.zw)(Number(t.total).toFixed(2)),1)])),_:2},1032,["suffix"])])])])})),128))])),"MONTH"===fe.value?((0,a.wg)(),(0,a.iD)("div",k,[(0,a.Wm)(n,{label:"Anterior",flat:"",icon:"chevron_left",onClick:Ie}),ye.value>0?((0,a.wg)(),(0,a.iD)("strong",N,(0,o.zw)((0,s.SU)(i.e7)[ye.value-1].toUpperCase()),1)):(0,a.kq)("",!0),(0,a.Wm)(n,{label:"Siguiente",flat:"","icon-right":"chevron_right",onClick:ze})])):(0,a.kq)("",!0),Te.value.length&&"MONTH"===fe.value?((0,a.wg)(),(0,a.iD)("div",T,[(0,a._)("h3",S,"Flujo de caja "+(0,o.zw)((0,s.SU)(i.e7)[ye.value-1]),1),(0,a._)("div",z,[(0,a._)("table",I,[(0,a._)("thead",null,[(0,a._)("tr",null,[q,(0,a._)("th",F,[(0,a._)("strong",null,"Saldo "+(0,o.zw)((0,s.SU)(i.e7)[(0,s.SU)(Fe)]),1)]),(0,a._)("th",E,[(0,a._)("strong",null,[(0,a.Uk)("Ingreso "),(0,a.Wm)(we,{name:"add_circle_outline"})])]),(0,a._)("th",A,[(0,a._)("strong",null,[(0,a.Uk)("Gasto "),(0,a.Wm)(we,{name:"remove_circle_outline"})])]),L,G])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(Te.value,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e.id},[(0,a._)("td",H,[(0,a._)("span",W,(0,o.zw)(e.name),1)]),(0,a._)("td",$,[(0,a._)("div",D,[(0,a._)("span",V,"Saldo "+(0,o.zw)((0,s.SU)(i.e7)[be.value-1])+":",1),(0,a.Uk)(" "+(0,o.zw)(Number(e.previous).toFixed(2)),1)])]),(0,a._)("td",C,[(0,a._)("div",M,[(0,a._)("span",R,[(0,a.Uk)("Ingreso "),(0,a.Wm)(we,{name:"add_circle_outline"}),(0,a.Uk)(" :")]),(0,a.Uk)(" "+(0,o.zw)(Number(e.entryTotal).toFixed(2)),1)])]),(0,a._)("td",O,[(0,a._)("div",j,[(0,a._)("span",Y,[(0,a.Uk)("Gasto "),(0,a.Wm)(we,{name:"remove_circle_outline"}),(0,a.Uk)(":")]),(0,a.Uk)(" "+(0,o.zw)(Number(e.expense).toFixed(2)),1)])]),(0,a._)("td",Z,[(0,a._)("div",Q,[P,(0,a.Uk)(" "+(0,o.zw)(Number(e.subtotal).toFixed(2)),1)])]),(0,a._)("td",K,[(0,a._)("div",B,[J,(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number(e.total).toFixed(2)),1)])])])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[X,(0,a._)("td",ee,[(0,a._)("div",te,[(0,a._)("span",le,"Saldo "+(0,o.zw)((0,s.SU)(i.e7)[be.value-1])+":",1),(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number((0,s.SU)(qe).previous).toFixed(2)),1)])]),(0,a._)("td",ae,[(0,a._)("div",oe,[(0,a._)("span",se,[(0,a.Uk)("Ingreso "),(0,a.Wm)(we,{name:"add_circle_outline"}),(0,a.Uk)(" :")]),(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number((0,s.SU)(qe).entryTotal).toFixed(2)),1)])]),(0,a._)("td",ne,[(0,a._)("div",ie,[(0,a._)("span",re,[(0,a.Uk)("Gasto "),(0,a.Wm)(we,{name:"remove_circle_outline"}),(0,a.Uk)(":")]),(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number((0,s.SU)(qe).expense).toFixed(2)),1)])]),(0,a._)("td",ue,[(0,a._)("div",de,[ce,(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number((0,s.SU)(qe).subtotal).toFixed(2)),1)])]),(0,a._)("td",ve,[(0,a._)("div",_e,[me,(0,a.Uk)(),(0,a._)("strong",null,(0,o.zw)(Number((0,s.SU)(qe).total).toFixed(2)),1)])])])])])])])):0===Te.value.length&&"MONTH"===fe.value?((0,a.wg)(),(0,a.iD)("div",pe,[(0,a.Uk)("No existe datos para el mes de "),(0,a._)("strong",null,(0,o.zw)((0,s.SU)(i.e7)[ye.value-1]),1),(0,a.Uk)(".")])):(0,a.kq)("",!0)])}}});var he=l(2165),xe=l(2448),be=l(6115),ge=l(6429),fe=l(4554),ye=l(7518),Ue=l.n(ye);const ke=we,Ne=ke;Ue()(we,"components",{QBtn:he.Z,QSelect:xe.Z,QField:be.Z,QTable:ge.Z,QIcon:fe.Z})}}]);