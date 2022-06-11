"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[598],{925:(e,t,n)=>{n.d(t,{e7:()=>s,KS:()=>a,WU:()=>l,Fv:()=>o});const s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],a=(e,t)=>{const n=new Date(e,t,0).getDate(),s=new Date(e,t-1,1),a=[];for(let l=6-s.getDay(),o=1;l<n;l+=7,o++)a.push({day:l+1,label:`Sábado ${l+1}`,week:o,total:0});return a},l=e=>{if(!e)return null;const t=new Date(e);return[t.getUTCDate(),t.getUTCMonth()+1,t.getUTCFullYear()].join("/")},o=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},7598:(e,t,n)=>{n.r(t),n.d(t,{default:()=>E});var s=n(3673),a=n(2323),l=n(1959),o=n(2993),r=n(925),i=function(e,t,n,s){function a(e){return e instanceof n?e:new n((function(t){t(e)}))}return new(n||(n=Promise))((function(n,l){function o(e){try{i(s.next(e))}catch(t){l(t)}}function r(e){try{i(s["throw"](e))}catch(t){l(t)}}function i(e){e.done?n(e.value):a(e.value).then(o,r)}i((s=s.apply(e,t||[])).next())}))};const c={class:"container"},u={class:"treasury-title"},d={class:"q-pb-md"},p={class:"row treasury-row"},w={class:"q-pb-sm"},m={class:"btn-block-detail"},b=(0,s._)("strong",null,"Ingresos:",-1),v=(0,s.Uk)(),y={class:"text-primary"},f={class:"btn-block-detail"},h=(0,s._)("strong",null,"Gastos:",-1),g=(0,s.Uk)(),k={class:"text-primary"},_=(0,s.aZ)({setup(e){const t=(0,l.iH)((new Date).getFullYear()),n=(0,l.iH)([]),_=9,D=[{value:2022,label:"2022"}],x=()=>i(this,void 0,void 0,(function*(){const e=yield o.http.get(`entries/year/${t.value}/${_}`),s=yield o.http.get(`expenses/year/${t.value}/${_}`);n.value=e.rows.map(((e,t)=>(e.idExpense=s.rows[t].id,e.totalExpense=s.rows[t].total,e)))}));return(0,s.wF)((()=>i(this,void 0,void 0,(function*(){yield x()})))),(e,o)=>{const i=(0,s.up)("q-btn"),_=(0,s.up)("q-select"),x=(0,s.up)("q-icon");return(0,s.wg)(),(0,s.iD)("div",c,[(0,s._)("h2",u,[(0,s.Wm)(i,{icon:"arrow_back",round:"",flat:"",onClick:o[0]||(o[0]=t=>e.$router.push("/treasury"))}),(0,s.Uk)(" Ingresos y gastos - Gestión "+(0,a.zw)(t.value),1)]),(0,s._)("div",d,[(0,s.Wm)(_,{filled:"",modelValue:t.value,"onUpdate:modelValue":o[1]||(o[1]=e=>t.value=e),options:D,label:"Gestión"},null,8,["modelValue"])]),(0,s._)("div",p,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(n.value,(t=>((0,s.wg)(),(0,s.iD)("div",{class:"col-xs-6 col-sm-3 q-pa-sm",key:t.month},[(0,s.Wm)(i,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:n=>e.$router.push(`/treasury/entryexpense/${t.id}/${t.idExpense}`),class:(0,a.C_)(["full-width btn-block",t.state.toLowerCase()]),disable:"PENDING"===t.state},{default:(0,s.w5)((()=>[(0,s._)("strong",w,(0,a.zw)((0,l.SU)(r.e7)[t.month-1]),1),(0,s._)("span",m,[b,v,(0,s._)("span",y,(0,a.zw)(t.total)+" Bs.",1)]),(0,s._)("span",f,[h,g,(0,s._)("span",k,(0,a.zw)(t.totalExpense)+" Bs.",1)]),(0,s.Wm)(x,{name:"calendar_month"}),"CLOSED"===t.state?((0,s.wg)(),(0,s.j4)(x,{key:0,name:"check_circle",color:"positive",size:"sm",class:"treasury-check"})):(0,s.kq)("",!0)])),_:2},1032,["onClick","class","disable"])])))),128))])])}}});var D=n(8240),x=n(2448),C=n(4554),U=n(7518),$=n.n(U);const q=_,E=q;$()(_,"components",{QBtn:D.Z,QSelect:x.Z,QIcon:C.Z})}}]);