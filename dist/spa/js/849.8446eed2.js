"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[849],{1849:(e,s,t)=>{t.r(s),t.d(s,{default:()=>A});var a=t(3673),n=t(2323),o=t(1959),r=t(8339),l=t(925),c=t(2993),i=t(4626),u=t(185),d=function(e,s,t,a){function n(e){return e instanceof t?e:new t((function(s){s(e)}))}return new(t||(t=Promise))((function(t,o){function r(e){try{c(a.next(e))}catch(s){o(s)}}function l(e){try{c(a["throw"](e))}catch(s){o(s)}}function c(e){e.done?t(e.value):n(e.value).then(r,l)}c((a=a.apply(e,s||[])).next())}))};const p={key:0,class:"container"},m={class:"treasury-title"},v={key:0,class:"text-warning"},y={class:"row"},b={class:"col-xs-12 col-sm-6 col-md-3 q-pa-sm card-button"},g=(0,a._)("strong",{class:"q-pb-sm"},"Ingresos",-1),h={class:"btn-block-detail"},_=(0,a._)("strong",null,"Total:",-1),f={class:"text-primary"},k={class:"col-xs-12 col-sm-6 col-md-3 q-pa-sm card-button"},w=(0,a._)("strong",{class:"q-pb-sm"},"Gastos",-1),$={class:"btn-block-detail"},x=(0,a._)("strong",null,"Total:",-1),C={class:"text-primary"},q={class:"col-xs-12 col-sm-6 col-md-3 q-pa-sm card-button"},I=(0,a._)("strong",{class:"q-pb-sm"},"Transacciones",-1),D=(0,a._)("span",{class:"btn-block-detail"},[(0,a._)("strong",null,"Bancarias")],-1),S={key:0,class:"col-xs-12 col-sm-6 col-md-3 q-pa-sm card-button"},W=(0,a._)("strong",{class:"q-pb-sm"},"Informe mensual",-1),E=(0,a._)("span",{class:"btn-block-detail"},[(0,a._)("strong",null,"Ingresos y gastos")],-1),U={class:"text-right q-pt-md q-gutter-xs"},z=(0,a.aZ)({__name:"EntryExpense",setup(e){const s=(0,o.iH)(),t=(0,o.iH)(0),z=(0,o.iH)(0),O=(0,r.yj)(),T=(0,r.tv)(),{entryId:F,expenseId:L}=O.params,N=()=>d(this,void 0,void 0,(function*(){s.value=yield c.http.get(`entries/${parseInt(F)}`)})),A=()=>d(this,void 0,void 0,(function*(){const e=yield c.http.get(`entriesdetails?id_entry=${s.value.id}`);t.value=e.rows.reduce(((e,s)=>e+Number(s.value)),0).toFixed(1)})),H=()=>d(this,void 0,void 0,(function*(){const e=yield c.http.get(`expensesdetails?id_expense=${L}`);z.value=e.rows.reduce(((e,s)=>e+Number(s.value)),0).toFixed(1)})),V=()=>{0===Number.parseFloat(t.value)||0===Number.parseFloat(z.value)?i.message.warning("Debe llenar los ingresos y los gastos"):"ACTIVE"===s.value.state&&(0,u.Confirm)(`Va a <strong>cerrar</strong> el mes de <strong>${l.e7[s.value.month-1]}</strong> este proceso es irreversible, revise los datos antes de continuar porque ya no podrá modificarlos.`,(()=>d(this,void 0,void 0,(function*(){return yield c.http.put(`entries/close/${F}/${L}`),T.push(`/treasury/report/${F}/${L}`)}))),null,"Advertencia","Cerrar mes")};return(0,a.wF)((()=>d(this,void 0,void 0,(function*(){yield N(),yield A(),yield H()})))),(e,r)=>{const c=(0,a.up)("q-btn"),i=(0,a.up)("q-icon");return s.value?((0,a.wg)(),(0,a.iD)("div",p,[(0,a._)("h2",m,[(0,a.Wm)(c,{icon:"arrow_back",round:"",flat:"",onClick:r[0]||(r[0]=s=>e.$router.push("/treasury"))}),(0,a.Uk)(" Ingresos y Gastos de "+(0,n.zw)((0,o.SU)(l.e7)[s.value.month-1])+" "+(0,n.zw)(s.value.year)+" ",1),"CLOSED"===s.value.state?((0,a.wg)(),(0,a.iD)("span",v,"CERRADO")):(0,a.kq)("",!0)]),(0,a._)("div",y,[(0,a._)("div",b,[(0,a.Wm)(c,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:r[1]||(r[1]=s=>e.$router.push(`/treasury/week/${e.$route.params.entryId}/${e.$route.params.expenseId}`)),class:"full-width btn-block"},{default:(0,a.w5)((()=>{var s;return[g,(0,a._)("span",h,[_,(0,a.Uk)(),(0,a._)("span",f,(0,n.zw)(t.value)+" "+(0,n.zw)(null===(s=e.$store.state.user)||void 0===s?void 0:s.user.company.money),1)]),(0,a.Wm)(i,{name:"attach_money"})]})),_:1})]),(0,a._)("div",k,[(0,a.Wm)(c,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:r[2]||(r[2]=s=>e.$router.push(`/treasury/expense/${e.$route.params.expenseId}`)),class:"full-width btn-block"},{default:(0,a.w5)((()=>{var s;return[w,(0,a._)("span",$,[x,(0,a.Uk)(),(0,a._)("span",C,(0,n.zw)(z.value)+" "+(0,n.zw)(null===(s=e.$store.state.user)||void 0===s?void 0:s.user.company.money),1)]),(0,a.Wm)(i,{name:"payments"})]})),_:1})]),(0,a._)("div",q,[(0,a.Wm)(c,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:r[3]||(r[3]=s=>e.$router.push(`/treasury/transactions/${(0,o.SU)(F)}/${(0,o.SU)(L)}`)),class:"full-width btn-block"},{default:(0,a.w5)((()=>[I,D,(0,a.Wm)(i,{name:"point_of_sale"})])),_:1})]),"CLOSED"===s.value.state?((0,a.wg)(),(0,a.iD)("div",S,[(0,a.Wm)(c,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:r[4]||(r[4]=s=>e.$router.push(`/treasury/report/${(0,o.SU)(F)}/${(0,o.SU)(L)}`)),class:"full-width btn-block"},{default:(0,a.w5)((()=>[W,E,(0,a.Wm)(i,{name:"analytics"})])),_:1})])):(0,a.kq)("",!0)]),(0,a._)("div",U,[(0,a.Wm)(c,{label:"Cambiar mes","no-caps":"",icon:"calendar_month",onClick:r[5]||(r[5]=s=>e.$router.push("/treasury/months"))}),"CLOSED"!==s.value.state?((0,a.wg)(),(0,a.j4)(c,{key:0,label:"CLOSED"===s.value.state?"Ver informe mensual":"Cerrar el mes","no-caps":"",color:"primary",icon:"CLOSED"===s.value.state?"print":"check",class:"btn-close-month",onClick:V},null,8,["label","icon"])):(0,a.kq)("",!0)])])):(0,a.kq)("",!0)}}});var O=t(2165),T=t(4554),F=t(7518),L=t.n(F);const N=z,A=N;L()(z,"components",{QBtn:O.Z,QIcon:T.Z})}}]);