"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[849],{925:(e,t,s)=>{s.d(t,{e7:()=>n,KS:()=>o,WU:()=>r,Fv:()=>a});const n=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],o=(e,t)=>{const s=new Date(e,t,0).getDate(),n=new Date(e,t-1,1),o=[];for(let r=6-n.getDay(),a=1;r<s;r+=7,a++)o.push({day:r+1,label:`Sábado ${r+1}`,week:a,total:0});return o},r=e=>{if(!e)return null;const t=new Date(e);return[t.getUTCDate(),t.getUTCMonth()+1,t.getUTCFullYear()].join("/")},a=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},1849:(e,t,s)=>{s.r(t),s.d(t,{default:()=>T});var n=s(3673),o=s(2323),r=s(1959),a=s(9582),l=s(925),i=s(2993),u=s(185),c=function(e,t,s,n){function o(e){return e instanceof s?e:new s((function(t){t(e)}))}return new(s||(s=Promise))((function(s,r){function a(e){try{i(n.next(e))}catch(t){r(t)}}function l(e){try{i(n["throw"](e))}catch(t){r(t)}}function i(e){e.done?s(e.value):o(e.value).then(a,l)}i((n=n.apply(e,t||[])).next())}))};const d={key:0,class:"container"},p={class:"treasury-title"},m={key:0,class:"text-warning"},v={class:"row"},y={class:"col-xs-6 col-sm-3 q-pr-sm"},f=(0,n._)("strong",{class:"q-pb-sm"},"Ingresos",-1),h={class:"btn-block-detail"},g=(0,n._)("strong",null,"Total:",-1),b=(0,n.Uk)(),w={class:"text-primary"},k={class:"col-xs-6 col-sm-3 q-pl-sm"},_=(0,n._)("strong",{class:"q-pb-sm"},"Gastos",-1),x={class:"btn-block-detail"},$=(0,n._)("strong",null,"Total:",-1),C=(0,n.Uk)(),D={class:"text-primary"},q={class:"text-right q-pt-sm q-gutter-xs"},I=(0,n.aZ)({setup(e){const t=(0,r.iH)(),s=(0,r.iH)(0),I=(0,r.iH)(0),U=(0,a.yj)(),S=(0,a.tv)(),{entryId:W,expenseId:E}=U.params,F=()=>c(this,void 0,void 0,(function*(){t.value=yield i.http.get(`entries/${parseInt(W)}`)})),T=()=>c(this,void 0,void 0,(function*(){const e=yield i.http.get(`entries/details?id_entry=${t.value.id}`);s.value=e.rows.reduce(((e,t)=>e+Number(t.value)),0).toFixed(1)})),A=()=>c(this,void 0,void 0,(function*(){const e=yield i.http.get(`expenses/details?id_expense=${E}`);I.value=e.rows.reduce(((e,t)=>e+Number(t.value)),0).toFixed(1)})),O=()=>{if(0===s.value||0===I.value)alert("Debe llenar los ingresos y los gastos");else{if("ACTIVE"!==t.value.state)return S.push(`/treasury/report/${W}/${E}`);(0,u.Confirm)(`Va a <strong>cerrar</strong> el mes de <strong>${l.e7[t.value.month-1]}</strong> este proceso es irreversible, revise los datos antes de continuar porque ya no podrá modificar los datos del mes.`,(()=>c(this,void 0,void 0,(function*(){return yield i.http.put(`entries/close/${W}/${E}`),S.push(`/treasury/report/${W}/${E}`)}))),null,"Advertencia","Cerrar mes")}};return(0,n.wF)((()=>c(this,void 0,void 0,(function*(){yield F(),yield T(),yield A()})))),(e,a)=>{const i=(0,n.up)("q-btn"),u=(0,n.up)("q-icon");return t.value?((0,n.wg)(),(0,n.iD)("div",d,[(0,n._)("h2",p,[(0,n.Wm)(i,{icon:"arrow_back",round:"",flat:"",onClick:a[0]||(a[0]=t=>e.$router.push("/treasury/months"))}),(0,n.Uk)(" Ingresos y Gastos de "+(0,o.zw)((0,r.SU)(l.e7)[t.value.month-1])+" ",1),"CLOSED"===t.value.state?((0,n.wg)(),(0,n.iD)("span",m,"CERRADO")):(0,n.kq)("",!0)]),(0,n._)("div",v,[(0,n._)("div",y,[(0,n.Wm)(i,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:a[1]||(a[1]=t=>e.$router.push(`/treasury/week/${e.$route.params.entryId}`)),class:"full-width btn-block"},{default:(0,n.w5)((()=>[f,(0,n._)("span",h,[g,b,(0,n._)("span",w,(0,o.zw)(s.value)+" Bs.",1)]),(0,n.Wm)(u,{name:"attach_money"})])),_:1})]),(0,n._)("div",k,[(0,n.Wm)(i,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:a[2]||(a[2]=t=>e.$router.push(`/treasury/expense/${e.$route.params.expenseId}`)),class:"full-width btn-block"},{default:(0,n.w5)((()=>[_,(0,n._)("span",x,[$,C,(0,n._)("span",D,(0,o.zw)(I.value)+" Bs.",1)]),(0,n.Wm)(u,{name:"money_off"})])),_:1})])]),(0,n._)("div",q,[(0,n.Wm)(i,{label:"CLOSED"===t.value.state?"Ver informe mensual":"Cerrar el mes y generar Informe mensual","no-caps":"",color:"primary",icon:"CLOSED"===t.value.state?"print":"check",padding:"10px 20px",class:"btn-close-month",onClick:O},null,8,["label","icon"])])])):(0,n.kq)("",!0)}}});var U=s(8240),S=s(4554),W=s(7518),E=s.n(W);const F=I,T=F;E()(I,"components",{QBtn:U.Z,QIcon:S.Z})}}]);