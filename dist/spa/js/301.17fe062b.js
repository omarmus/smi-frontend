"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[301],{6301:(t,e,l)=>{l.r(e),l.d(e,{default:()=>qt});var a=l(3673),s=l(2323),n=l(1959),r=l(8339),o=l(9236),i=l(2993),u=l(925),d=l(5751),c=function(t,e,l,a){function s(t){return t instanceof l?t:new l((function(e){e(t)}))}return new(l||(l=Promise))((function(l,n){function r(t){try{i(a.next(t))}catch(e){n(e)}}function o(t){try{i(a["throw"](t))}catch(e){n(e)}}function i(t){t.done?l(t.value):s(t.value).then(r,o)}i((a=a.apply(t,e||[])).next())}))};const w={key:0,class:"container"},h={class:"treasury-title"},_={class:"row"},g={class:"text-right q-mb-md col-xs-12"},p={class:"row",id:"report-quarter"},v={class:"col-12"},x={class:"text-center report-title"},b=(0,a._)("h3",{class:"text-primary flow-title"},"OFRENDAS ENVIADAS A LA ASOCIACIÓN BOLIVIANA",-1),f={class:"q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12"},m={class:"q-table treasury-table-data"},L=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Departamento")],-1),S=(0,a._)("th",{class:"text-right text-primary"},[(0,a._)("strong",null,"Total trimestre")],-1),y={class:"text-left"},A={class:"flow-head-table"},O={class:"flow-row-table"},k={class:"text-hidden"},D={class:"flow-head-table"},q={class:"text-right text-primary"},z={class:"flow-row-table"},T=(0,a._)("span",{class:"text-hidden"},"Total trimestre:",-1),C={class:"flow-head-table"},I=(0,a._)("th",{class:"text-left"},[(0,a._)("span",{class:"flow-head-table"},[(0,a._)("strong",null,"TOTAL")])],-1),U={class:"flow-row-table"},E={key:0,class:"text-hidden"},N={key:1,class:"text-hidden"},G={class:"flow-head-table"},F={key:0,class:"col-12 q-mt-lg"},R=(0,a._)("h3",{class:"text-primary flow-title"},"INGRESOS DE LA IGLESIA LOCAL, GASTOS Y SALDOS DE SUS FONDOS",-1),H={class:"q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap col-12"},Y={class:"q-table treasury-table-data"},B=(0,a._)("tr",null,[(0,a._)("th",null," "),(0,a._)("th",{class:"bg-warning text-white"},[(0,a._)("strong",null,"SALDO ANTERIOR")]),(0,a._)("th",{colspan:"4",class:"bg-positive text-white"},[(0,a._)("strong",null,"INGRESOS TRIMESTRE")]),(0,a._)("th",{class:"bg-negative text-white"},[(0,a._)("strong",null,"GASTOS TRIMESTRE")]),(0,a._)("th",{class:"bg-primary text-white"},[(0,a._)("strong",null,"SALDO TRIMESTRE")])],-1),K=(0,a._)("th",{class:"text-left",rowspan:"2"},[(0,a._)("strong",null,"Departamento")],-1),M={class:"text-right text-warning",rowspan:"2"},Q=(0,a._)("th",{class:"text-right text-positive"},[(0,a._)("strong",null,"Ingreso total")],-1),Z=(0,a._)("th",{class:"text-right text-negative"},[(0,a._)("strong",null,"Gasto total")],-1),J=(0,a._)("th",{class:"text-right text-primary"},[(0,a._)("strong",null,"Saldo total")],-1),V={class:"text-left"},W={class:"flow-head-table"},$={class:"text-right text-warning"},j={class:"flow-row-table"},P={class:"text-hidden"},X={class:"flow-head-table"},tt={class:"flow-row-table"},et={class:"text-hidden"},lt={class:"flow-head-table"},at={class:"text-right text-positive"},st={class:"flow-row-table"},nt=(0,a._)("span",{class:"text-hidden"},"Ingreso total:",-1),rt={class:"flow-head-table"},ot={class:"text-right text-negative"},it={class:"flow-row-table"},ut=(0,a._)("span",{class:"text-hidden"},"Gasto total:",-1),dt={class:"flow-head-table"},ct={class:"text-right text-primary"},wt={class:"flow-row-table"},ht=(0,a._)("span",{class:"text-hidden"},"Saldo total:",-1),_t={class:"flow-head-table"},gt=(0,a._)("th",{class:"text-left"},[(0,a._)("span",{class:"flow-head-table"},[(0,a._)("strong",null,"TOTAL")])],-1),pt={class:"flow-row-table"},vt={key:0,class:"text-hidden"},xt={key:1,class:"text-hidden"},bt={key:2,class:"text-hidden"},ft={key:3,class:"text-hidden"},mt={key:4,class:"text-hidden"},Lt={class:"flow-head-table"},St=(0,a.aZ)({__name:"QuarterDetails",setup(t){const e=(0,r.yj)(),l=(0,o.o)(),St=(0,n.iH)(),yt=(0,n.iH)(),At=["1er. trimestre","2do. trimestre","3er. trimestre","4to. trimestre"],Ot=(0,a.Fl)((()=>St.value?St.value.month-2<0?11:St.value.month-2:0)),kt=(0,a.Fl)((()=>{if(!St.value)return"";const t=JSON.parse(St.value.metadata);return At[t.quarter-1]})),Dt=t=>c(this,void 0,void 0,(function*(){St.value=yield i.http.get(`reports/${t}`),yt.value=JSON.parse(St.value.content)}));function qt(){(0,d.mT)("report-quarter","Informe trimestral")}return(0,a.bv)((()=>{e.params.id&&Dt(String(e.params.id))})),(t,e)=>{var r;const o=(0,a.up)("q-btn");return St.value&&yt.value?((0,a.wg)(),(0,a.iD)("div",w,[(0,a._)("h2",h,[(0,a.Wm)(o,{icon:"arrow_back",round:"",flat:"",onClick:e[0]||(e[0]=e=>t.$router.push("/treasury/report/quarter"))}),(0,a.Uk)(" Atrás ")]),(0,a._)("div",_,[(0,a._)("div",g,[(0,a.Wm)(o,{icon:"print","no-caps":"",onClick:qt},{default:(0,a.w5)((()=>[(0,a.Uk)("  Imprimir informe ")])),_:1})])]),(0,a._)("div",p,[(0,a._)("div",v,[(0,a._)("h2",x,[(0,a.Uk)(" INFORME TRIMESTRAL "),(0,a._)("strong",null,(0,s.zw)(null===(r=(0,n.SU)(l).state.user.user.company)||void 0===r?void 0:r.name),1),(0,a._)("span",null,(0,s.zw)((0,n.SU)(kt))+" - "+(0,s.zw)(St.value.month>11?St.value.year+1:St.value.year),1)]),b,(0,a._)("div",f,[(0,a._)("table",m,[(0,a._)("thead",null,[(0,a._)("tr",null,[L,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.GLOBAL.entries.header,(t=>((0,a.wg)(),(0,a.iD)("th",{class:"text-right text-secondary",key:t},[(0,a._)("strong",null,(0,s.zw)((0,n.SU)(u.e7)[Number(t.split("-")[0])-1]),1)])))),128)),S])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.GLOBAL.entries.body,(t=>((0,a.wg)(),(0,a.iD)("tr",{key:t.name},[(0,a._)("td",y,[(0,a._)("span",A,(0,s.zw)(t.name),1)]),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(t.values,((t,e)=>((0,a.wg)(),(0,a.iD)("td",{class:"text-right",key:e},[(0,a._)("div",O,[(0,a._)("span",k,(0,s.zw)((0,n.SU)(u.e7)[Number(yt.value.GLOBAL.entries.header[e].split("-")[0])-1])+":",1),(0,a._)("span",D,(0,s.zw)(t.toFixed(2)),1)])])))),128)),(0,a._)("td",q,[(0,a._)("div",z,[T,(0,a._)("strong",C,(0,s.zw)(t.total.toFixed(2)),1)])])])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[I,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.GLOBAL.entries.footer,((t,e)=>((0,a.wg)(),(0,a.iD)("th",{class:(0,s.C_)(["text-right",{"text-primary":e===yt.value.GLOBAL.entries.footer.length-1}]),key:e},[(0,a._)("div",U,[e>=0&&e<=2?((0,a.wg)(),(0,a.iD)("span",E,(0,s.zw)((0,n.SU)(u.e7)[Number(yt.value.LOCAL.entries.header[e].split("-")[0])-1])+":",1)):(0,a.kq)("",!0),e===yt.value.GLOBAL.entries.footer.length-1?((0,a.wg)(),(0,a.iD)("span",N,"Total trimestre:")):(0,a.kq)("",!0),(0,a._)("strong",G,(0,s.zw)(t.toFixed(2)),1)])],2)))),128))])])])])]),yt.value?((0,a.wg)(),(0,a.iD)("div",F,[R,(0,a._)("div",H,[(0,a._)("table",Y,[(0,a._)("thead",null,[B,(0,a._)("tr",null,[K,(0,a._)("th",M,[(0,a._)("strong",null,"Saldo "+(0,s.zw)((0,n.SU)(u.e7)[(0,n.SU)(Ot)]),1)]),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.LOCAL.entries.header,(t=>((0,a.wg)(),(0,a.iD)("th",{class:"text-right",key:t},[(0,a._)("strong",null,(0,s.zw)((0,n.SU)(u.e7)[Number(t.split("-")[0])-1]),1)])))),128)),Q,Z,J])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.LOCAL.entries.body,(t=>{var e,l,r;return(0,a.wg)(),(0,a.iD)("tr",{key:t.name},[(0,a._)("td",V,[(0,a._)("span",W,(0,s.zw)(t.name),1)]),(0,a._)("td",$,[(0,a._)("div",j,[(0,a._)("span",P,"Saldo "+(0,s.zw)((0,n.SU)(u.e7)[(0,n.SU)(Ot)])+":",1),(0,a._)("span",X,(0,s.zw)(null===(e=t.previous)||void 0===e?void 0:e.toFixed(2)),1)])]),((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(t.values,((t,e)=>((0,a.wg)(),(0,a.iD)("td",{class:"text-right",key:e},[(0,a._)("div",tt,[(0,a._)("span",et,(0,s.zw)((0,n.SU)(u.e7)[Number(yt.value.LOCAL.entries.header[e].split("-")[0])-1])+":",1),(0,a._)("span",lt,(0,s.zw)(t.toFixed(2)),1)])])))),128)),(0,a._)("td",at,[(0,a._)("div",st,[nt,(0,a._)("strong",rt,(0,s.zw)(t.total.toFixed(2)),1)])]),(0,a._)("td",ot,[(0,a._)("div",it,[ut,(0,a._)("strong",dt,(0,s.zw)(null===(l=t.totalExpense)||void 0===l?void 0:l.toFixed(2)),1)])]),(0,a._)("td",ct,[(0,a._)("div",wt,[ht,(0,a._)("strong",_t,(0,s.zw)(null===(r=t.totalGlobal)||void 0===r?void 0:r.toFixed(2)),1)])])])})),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[gt,((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(yt.value.LOCAL.entries.footer,((t,e)=>((0,a.wg)(),(0,a.iD)("th",{class:(0,s.C_)(["text-right",{"text-warning":0===e,"text-positive":e===yt.value.LOCAL.entries.footer.length-3,"text-negative":e===yt.value.LOCAL.entries.footer.length-2,"text-primary":e===yt.value.LOCAL.entries.footer.length-1}]),key:e},[(0,a._)("div",pt,[0===e?((0,a.wg)(),(0,a.iD)("span",vt,"Saldo "+(0,s.zw)((0,n.SU)(u.e7)[(0,n.SU)(Ot)])+":",1)):(0,a.kq)("",!0),e>=1&&e<=3?((0,a.wg)(),(0,a.iD)("span",xt,(0,s.zw)((0,n.SU)(u.e7)[Number(yt.value.LOCAL.entries.header[e-1].split("-")[0])-1])+":",1)):(0,a.kq)("",!0),e===yt.value.LOCAL.entries.footer.length-3?((0,a.wg)(),(0,a.iD)("span",bt,"Ingreso total:")):(0,a.kq)("",!0),e===yt.value.LOCAL.entries.footer.length-2?((0,a.wg)(),(0,a.iD)("span",ft,"Gasto total:")):(0,a.kq)("",!0),e===yt.value.LOCAL.entries.footer.length-1?((0,a.wg)(),(0,a.iD)("span",mt,"Saldo total:")):(0,a.kq)("",!0),(0,a._)("strong",Lt,(0,s.zw)(t.toFixed(2)),1)])],2)))),128))])])])])])):(0,a.kq)("",!0)])])):(0,a.kq)("",!0)}}});var yt=l(2165),At=l(6429),Ot=l(7518),kt=l.n(Ot);const Dt=St,qt=Dt;kt()(St,"components",{QBtn:yt.Z,QTable:At.Z})}}]);