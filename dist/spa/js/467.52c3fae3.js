"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[467],{4467:(e,t,a)=>{a.r(t),a.d(t,{default:()=>x});var n=a(3673),s=a(2323),o=a(1959),r=a(8339),l=a(2993),u=a(925),i=function(e,t,a,n){function s(e){return e instanceof a?e:new a((function(t){t(e)}))}return new(a||(a=Promise))((function(a,o){function r(e){try{u(n.next(e))}catch(t){o(t)}}function l(e){try{u(n["throw"](e))}catch(t){o(t)}}function u(e){e.done?a(e.value):s(e.value).then(r,l)}u((n=n.apply(e,t||[])).next())}))};const c={key:0,class:"container"},d={class:"treasury-title"},p={key:0,class:"text-warning"},v={class:"subtitle"},y={class:"row treasury-row"},m={class:"btn-block-detail"},w={class:"text-right q-pt-xs q-gutter-xs"},h=(0,n.aZ)({__name:"EntriesWeek",setup(e){const t=(0,o.iH)(),a=(0,o.iH)([]),h=(new Date).getDate(),k=(new Date).getMonth()+1,g=(0,o.iH)(0),f=(0,r.yj)(),{entryId:$}=f.params,b=e=>"CLOSED"===t.value.state||t.value.month!==k?"":e.day>=h-7&&e.day<h?"active":"pending",x=e=>"CLOSED"!==t.value.state&&t.value.month===k&&e.day>=h,_=()=>i(this,void 0,void 0,(function*(){t.value=yield l.http.get(`entries/${parseInt($)}`),a.value=(0,u.KS)(t.value.year,t.value.month);const e=yield l.http.get(`entriesdetails?id_entry=${t.value.id}`),n={1:0,2:0,3:0,4:0,5:0};e.rows.forEach((e=>{n[e.week]+=parseFloat(e.value)})),g.value=0,a.value.forEach((e=>{e.total=n[e.week],g.value+=e.total}))}));return(0,n.wF)((()=>i(this,void 0,void 0,(function*(){yield _()})))),(e,r)=>{var l;const i=(0,n.up)("q-btn"),h=(0,n.up)("q-icon");return t.value?((0,n.wg)(),(0,n.iD)("div",c,[(0,n._)("h2",d,[(0,n.Wm)(i,{icon:"arrow_back",round:"",flat:"",onClick:r[0]||(r[0]=t=>e.$router.push(`/treasury/entryexpense/${e.$route.params.entryId}/${e.$route.params.expenseId}`))}),(0,n.Uk)(" Ingresos "+(0,s.zw)((0,o.SU)(u.e7)[t.value.month-1])+" - Diezmos y ofrendas ",1),"CLOSED"===t.value.state?((0,n.wg)(),(0,n.iD)("span",p,"CERRADO")):(0,n.kq)("",!0),(0,n._)("span",v,"Total: "+(0,s.zw)(g.value.toFixed(2))+" "+(0,s.zw)(null===(l=e.$store.state.user)||void 0===l?void 0:l.user.company.money),1)]),(0,n._)("div",y,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(a.value,(t=>((0,n.wg)(),(0,n.iD)("div",{class:"col-xs-6 col-sm-3 q-pa-sm card-button",key:t.week},[(0,n.Wm)(i,{flat:"",color:"secondary",padding:"lg","no-caps":"",onClick:a=>e.$router.push(`/treasury/entry/${e.$route.params.entryId}/${e.$route.params.expenseId}/${t.week}`),class:(0,s.C_)(["full-width btn-block",b(t)]),disable:x(t)},{default:(0,n.w5)((()=>{var a;return[(0,n._)("strong",null,(0,s.zw)(t.label),1),(0,n._)("span",m,(0,s.zw)(t.total)+" "+(0,s.zw)(null===(a=e.$store.state.user)||void 0===a?void 0:a.user.company.money),1),(0,n.Wm)(h,{name:"calendar_month"})]})),_:2},1032,["onClick","class","disable"])])))),128))]),(0,n._)("div",w,[e.$route.params.expenseId?((0,n.wg)(),(0,n.j4)(i,{key:0,label:"Ver gastos del mes","no-caps":"",icon:"payments",padding:"10px 20px",class:"btn-close-month",onClick:r[1]||(r[1]=t=>e.$router.push(`/treasury/expense/${e.$route.params.expenseId}`))})):(0,n.kq)("",!0)])])):(0,n.kq)("",!0)}}});var k=a(2165),g=a(4554),f=a(7518),$=a.n(f);const b=h,x=b;$()(h,"components",{QBtn:k.Z,QIcon:g.Z})}}]);