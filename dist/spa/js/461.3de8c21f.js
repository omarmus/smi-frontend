"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[461],{925:(e,t,l)=>{l.d(t,{e7:()=>a,KS:()=>s,WU:()=>o,Fv:()=>n});const a=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],s=(e,t)=>{const l=new Date(e,t,0).getDate(),a=new Date(e,t-1,1),s=[];for(let o=6-a.getDay(),n=1;o<l;o+=7,n++)s.push({day:o+1,label:`Sábado ${o+1}`,week:n,total:0});return s},o=e=>{if(!e)return null;const t=new Date(e);return[t.getUTCDate(),t.getUTCMonth()+1,t.getUTCFullYear()].join("/")},n=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},2461:(e,t,l)=>{l.r(t),l.d(t,{default:()=>wt});var a=l(3673),s=l(2323),o=l(1959),n=l(2993),i=l(925),u=l(9236),r=function(e,t,l,a){function s(e){return e instanceof l?e:new l((function(t){t(e)}))}return new(l||(l=Promise))((function(l,o){function n(e){try{u(a.next(e))}catch(t){o(t)}}function i(e){try{u(a["throw"](e))}catch(t){o(t)}}function u(e){e.done?l(e.value):s(e.value).then(n,i)}u((a=a.apply(e,t||[])).next())}))};const c={class:"container"},d={class:"treasury-title"},v=(0,a.Uk)(" Flujo de caja - "),_=(0,a._)("span",{class:"text-warning"},"Iglesia local",-1),m={class:"subtitle"},w={class:"row q-col-gutter-sm"},x={class:"col-xs-12 col-sm-4"},b={class:"col-xs-12 col-sm-4"},p={class:"col-xs-12 col-sm-4"},g={key:0,class:"row flow-items q-col-gutter-x-lg q-pt-md"},h={class:"flow-title col-12"},U={class:"row q-pb-xs"},f={class:"col-8"},k={class:"col-xs-4 col-sm-4"},y={class:"self-center full-width no-outline",tabindex:"0"},N={key:1,class:"row flow-navitagor"},S={key:2,class:"row tithe-column"},z={class:"flow-title col-12"},T={class:"q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12"},I={class:"q-table treasury-table-data"},F=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Departamento")],-1),D={class:"text-right text-secondary"},W={class:"text-right text-positive"},A=(0,a.Uk)("Ingreso "),E={class:"text-right text-negative"},q=(0,a.Uk)("Diezmo Ingreso "),L={class:"text-right text-positive"},M=(0,a.Uk)("Total Ingreso "),G={class:"text-right text-negative"},H=(0,a.Uk)("Gasto "),C=(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Sub total")],-1),$=(0,a._)("th",{class:"text-right text-primary"},[(0,a._)("strong",null,"Total")],-1),V={class:"text-left"},j={class:"flow-head-table"},O={class:"text-right text-secondary"},R={class:"flow-row-table"},Y={class:"text-hidden"},Z={class:"text-right text-positive"},Q={class:"flow-row-table"},P={class:"text-hidden"},B=(0,a.Uk)("Ingreso "),K=(0,a.Uk)(" :"),J={class:"text-right text-negative"},X={class:"flow-row-table"},ee={class:"text-hidden"},te=(0,a.Uk)("Diezmo Ingreso "),le=(0,a.Uk)(":"),ae={class:"text-right text-positive"},se={class:"flow-row-table"},oe={class:"text-hidden"},ne=(0,a.Uk)("Total Ingreso "),ie=(0,a.Uk)(" :"),ue={class:"text-right text-negative"},re={class:"flow-row-table"},ce={class:"text-hidden"},de=(0,a.Uk)("Gasto "),ve=(0,a.Uk)(":"),_e={class:"text-right"},me={class:"flow-row-table"},we=(0,a._)("span",{class:"text-hidden"},"Sub total:",-1),xe={class:"text-right text-primary"},be={class:"flow-row-table"},pe=(0,a._)("span",{class:"text-hidden"},"Total:",-1),ge=(0,a.Uk)(),he=(0,a._)("td",{class:"text-left"},[(0,a._)("span",{class:"flow-head-table"},[(0,a._)("strong",null,"TOTAL")])],-1),Ue={class:"text-right text-secondary"},fe={class:"flow-row-table"},ke={class:"text-hidden"},ye=(0,a.Uk)(),Ne={class:"text-right text-positive"},Se={class:"flow-row-table"},ze={class:"text-hidden"},Te=(0,a.Uk)("Ingreso "),Ie=(0,a.Uk)(" :"),Fe=(0,a.Uk)(),De={class:"text-right text-negative"},We={class:"flow-row-table"},Ae={class:"text-hidden"},Ee=(0,a.Uk)("Diezmo Ingreso "),qe=(0,a.Uk)(":"),Le=(0,a.Uk)(),Me={class:"text-right text-positive"},Ge={class:"flow-row-table"},He={class:"text-hidden"},Ce=(0,a.Uk)("Total Ingreso "),$e=(0,a.Uk)(" :"),Ve=(0,a.Uk)(),je={class:"text-right text-negative"},Oe={class:"flow-row-table"},Re={class:"text-hidden"},Ye=(0,a.Uk)("Gasto "),Ze=(0,a.Uk)(":"),Qe=(0,a.Uk)(),Pe={class:"text-right"},Be={class:"flow-row-table"},Ke=(0,a._)("span",{class:"text-hidden"},"Sub total:",-1),Je=(0,a.Uk)(),Xe={class:"text-right text-primary"},et={class:"flow-row-table"},tt=(0,a._)("span",{class:"text-hidden"},"Total:",-1),lt=(0,a.Uk)(),at={key:3,class:"q-pa-sm text-primary"},st=(0,a.Uk)("No existe datos para el mes de "),ot=(0,a.Uk)("."),nt=(0,a.aZ)({setup(e){var t,l;const nt=(0,u.useStore)(),it=null===(l=null===(t=nt.state.user)||void 0===t?void 0:t.user)||void 0===l?void 0:l.company.id,ut=new Date;let rt=ut.getFullYear(),ct=ut.getMonth()-1;ct<0&&(ct=11,rt--);const dt=(0,o.iH)({value:rt,label:rt}),vt=(0,o.iH)({value:"MONTH",label:"MENSUAL"}),_t=(0,o.iH)({value:ct+1,label:i.e7[ct]}),mt=i.e7.map(((e,t)=>({value:t+1,label:e}))),wt=[{value:2022,label:"2022"}],xt=[{value:"GENERAL",label:"GENERAL"},{value:"MONTH",label:"MENSUAL"},{value:"INITIAL",label:"INICIAL"}],bt=(0,o.iH)([]),pt=()=>r(this,void 0,void 0,(function*(){if("GENERAL"===vt.value.value){const e=`expenses/report/${vt.value.value}?id_company=${it}`,t=yield n.http.get(e);bt.value=t.rows}else if("MONTH"===vt.value.value){const e=`expenses/report/${vt.value.value}?id_company=${it}&year=${dt.value.value}&month=${_t.value.value}`,t=yield n.http.get(e);bt.value=t.rows}else{const e=`flows?id_company=${it}&type=${vt.value.value}`,t=yield n.http.get(e);bt.value=t.rows}})),gt=()=>{let e=dt.value.value,t=_t.value.value+1;t>12&&(e++,t=1),_t.value={value:t,label:i.e7[t-1]},dt.value={value:e,label:e}},ht=()=>{let e=dt.value.value,t=_t.value.value-1;t<0&&(e--,t=12),_t.value={value:t,label:i.e7[t-1]},dt.value={value:e,label:e}},Ut=(0,o.Fl)((()=>{const e={previous:0,entry:0,tithe:0,entryTotal:0,expense:0,subtotal:0,total:0};return bt.value.forEach((t=>{e.previous+=t.previous?Number(t.previous):0,e.entry+=t.entry?Number(t.entry):0,e.tithe+=t.tithe?Number(t.tithe):0,e.entryTotal+=t.entryTotal?Number(t.entryTotal):0,e.expense+=t.expense?Number(t.expense):0,e.subtotal+=t.subtotal?Number(t.subtotal):0,e.total+=t.total?Number(t.total):0})),e})),ft=(0,o.Fl)((()=>_t.value.value-2<0?11:_t.value.value-2));return(0,a.YP)(vt,(()=>r(this,void 0,void 0,(function*(){return yield pt(0)})))),(0,a.YP)(dt,(()=>r(this,void 0,void 0,(function*(){return yield pt(0)})))),(0,a.YP)(_t,(()=>r(this,void 0,void 0,(function*(){return yield pt(0)})))),(0,a.wF)((()=>r(this,void 0,void 0,(function*(){yield pt(0)})))),(e,t)=>{const l=(0,a.up)("q-btn"),n=(0,a.up)("q-select"),u=(0,a.up)("q-field"),r=(0,a.up)("q-icon");return(0,a.wg)(),(0,a.iD)("div",c,[(0,a._)("h2",d,[(0,a.Wm)(l,{icon:"arrow_back",round:"",flat:"",onClick:t[0]||(t[0]=t=>e.$router.push("/treasury"))}),v,_,(0,a._)("span",m,"Total: "+(0,s.zw)((0,o.SU)(Ut).total||0)+" Bs.",1)]),(0,a._)("div",w,[(0,a._)("div",x,[(0,a.Wm)(n,{filled:"",modelValue:vt.value,"onUpdate:modelValue":t[1]||(t[1]=e=>vt.value=e),options:xt,label:"Tipo"},null,8,["modelValue"])]),(0,a._)("div",b,[(0,a.Wm)(n,{filled:"",modelValue:dt.value,"onUpdate:modelValue":t[2]||(t[2]=e=>dt.value=e),options:wt,label:"Gestión",disable:"GENERAL"===vt.value.value||"INITIAL"===vt.value.value},null,8,["modelValue","disable"])]),(0,a._)("div",p,[(0,a.Wm)(n,{filled:"",modelValue:_t.value,"onUpdate:modelValue":t[3]||(t[3]=e=>_t.value=e),options:(0,o.SU)(mt),label:"Mes",disable:"GENERAL"===vt.value.value||"YEAR"===vt.value.value||"INITIAL"===vt.value.value},null,8,["modelValue","options","disable"])])]),!bt.value.length||"GENERAL"!==vt.value.value&&"INITIAL"!==vt.value.value?(0,a.kq)("",!0):((0,a.wg)(),(0,a.iD)("div",g,[(0,a._)("h3",h,"Flujo de caja "+(0,s.zw)("GENERAL"===vt.value.value?"General":"Inicial"),1),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(bt.value,(e=>{var t;return(0,a.wg)(),(0,a.iD)("div",{class:"col-xs-12 col-sm-6",key:e.id},[(0,a._)("div",U,[(0,a._)("div",f,(0,s.zw)(null===(t=e.department)||void 0===t?void 0:t.name),1),(0,a._)("div",k,[(0,a.Wm)(u,{standout:"",class:"text-right",dense:"",placeholder:"0",suffix:"Bs."},{control:(0,a.w5)((()=>[(0,a._)("div",y,(0,s.zw)(Number(e.total).toFixed(2)),1)])),_:2},1024)])])])})),128))])),"MONTH"===vt.value.value?((0,a.wg)(),(0,a.iD)("div",N,[(0,a.Wm)(l,{label:"Anterior",flat:"",icon:"chevron_left",onClick:ht}),(0,a._)("strong",null,(0,s.zw)((0,o.SU)(i.e7)[_t.value.value-1].toUpperCase()),1),(0,a.Wm)(l,{label:"Siguiente",flat:"","icon-right":"chevron_right",onClick:gt})])):(0,a.kq)("",!0),bt.value.length&&"MONTH"===vt.value.value?((0,a.wg)(),(0,a.iD)("div",S,[(0,a._)("h3",z,"Flujo de caja "+(0,s.zw)((0,o.SU)(i.e7)[_t.value.value-1]),1),(0,a._)("div",T,[(0,a._)("table",I,[(0,a._)("thead",null,[(0,a._)("tr",null,[F,(0,a._)("th",D,[(0,a._)("strong",null,"Saldo "+(0,s.zw)((0,o.SU)(i.e7)[(0,o.SU)(ft)]),1)]),(0,a._)("th",W,[(0,a._)("strong",null,[A,(0,a.Wm)(r,{name:"add_circle_outline"})])]),(0,a._)("th",E,[(0,a._)("strong",null,[q,(0,a.Wm)(r,{name:"remove_circle_outline"})])]),(0,a._)("th",L,[(0,a._)("strong",null,[M,(0,a.Wm)(r,{name:"add_circle_outline"})])]),(0,a._)("th",G,[(0,a._)("strong",null,[H,(0,a.Wm)(r,{name:"remove_circle_outline"})])]),C,$])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(bt.value,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e.id},[(0,a._)("td",V,[(0,a._)("span",j,(0,s.zw)(e.name),1)]),(0,a._)("td",O,[(0,a._)("div",R,[(0,a._)("span",Y,"Saldo "+(0,s.zw)((0,o.SU)(i.e7)[(0,o.SU)(ct)-1])+":",1),(0,a.Uk)(" "+(0,s.zw)(Number(e.previous).toFixed(2)),1)])]),(0,a._)("td",Z,[(0,a._)("div",Q,[(0,a._)("span",P,[B,(0,a.Wm)(r,{name:"add_circle_outline"}),K]),(0,a.Uk)(" "+(0,s.zw)(Number(e.entry).toFixed(2)),1)])]),(0,a._)("td",J,[(0,a._)("div",X,[(0,a._)("span",ee,[te,(0,a.Wm)(r,{name:"remove_circle_outline"}),le]),(0,a.Uk)(" "+(0,s.zw)(Number(e.tithe).toFixed(2)),1)])]),(0,a._)("td",ae,[(0,a._)("div",se,[(0,a._)("span",oe,[ne,(0,a.Wm)(r,{name:"add_circle_outline"}),ie]),(0,a.Uk)(" "+(0,s.zw)(Number(e.entryTotal).toFixed(2)),1)])]),(0,a._)("td",ue,[(0,a._)("div",re,[(0,a._)("span",ce,[de,(0,a.Wm)(r,{name:"remove_circle_outline"}),ve]),(0,a.Uk)(" "+(0,s.zw)(Number(e.expense).toFixed(2)),1)])]),(0,a._)("td",_e,[(0,a._)("div",me,[we,(0,a.Uk)(" "+(0,s.zw)(Number(e.subtotal).toFixed(2)),1)])]),(0,a._)("td",xe,[(0,a._)("div",be,[pe,ge,(0,a._)("strong",null,(0,s.zw)(Number(e.total).toFixed(2)),1)])])])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[he,(0,a._)("td",Ue,[(0,a._)("div",fe,[(0,a._)("span",ke,"Saldo "+(0,s.zw)((0,o.SU)(i.e7)[(0,o.SU)(ct)-1])+":",1),ye,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).previous).toFixed(2)),1)])]),(0,a._)("td",Ne,[(0,a._)("div",Se,[(0,a._)("span",ze,[Te,(0,a.Wm)(r,{name:"add_circle_outline"}),Ie]),Fe,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).entry).toFixed(2)),1)])]),(0,a._)("td",De,[(0,a._)("div",We,[(0,a._)("span",Ae,[Ee,(0,a.Wm)(r,{name:"remove_circle_outline"}),qe]),Le,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).tithe).toFixed(2)),1)])]),(0,a._)("td",Me,[(0,a._)("div",Ge,[(0,a._)("span",He,[Ce,(0,a.Wm)(r,{name:"add_circle_outline"}),$e]),Ve,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).entryTotal).toFixed(2)),1)])]),(0,a._)("td",je,[(0,a._)("div",Oe,[(0,a._)("span",Re,[Ye,(0,a.Wm)(r,{name:"remove_circle_outline"}),Ze]),Qe,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).expense).toFixed(2)),1)])]),(0,a._)("td",Pe,[(0,a._)("div",Be,[Ke,Je,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).subtotal).toFixed(2)),1)])]),(0,a._)("td",Xe,[(0,a._)("div",et,[tt,lt,(0,a._)("strong",null,(0,s.zw)(Number((0,o.SU)(Ut).total).toFixed(2)),1)])])])])])])])):0===bt.value.length&&"MONTH"===vt.value.value?((0,a.wg)(),(0,a.iD)("div",at,[st,(0,a._)("strong",null,(0,s.zw)((0,o.SU)(i.e7)[_t.value.value-1]),1),ot])):(0,a.kq)("",!0)])}}});var it=l(8240),ut=l(2448),rt=l(6115),ct=l(6429),dt=l(4554),vt=l(7518),_t=l.n(vt);const mt=nt,wt=mt;_t()(nt,"components",{QBtn:it.Z,QSelect:ut.Z,QField:rt.Z,QTable:ct.Z,QIcon:dt.Z})}}]);