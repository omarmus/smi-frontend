"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[634],{8634:(e,a,l)=>{l.r(a),l.d(a,{default:()=>Q});var o=l(3673),t=l(2323),n=l(1959),s=l(8339),i=l(9236),r=l(2993),u=l(4626),c=l(4781),d=l(185),m=l(925),p=l(8468),v=function(e,a,l,o){function t(e){return e instanceof l?e:new l((function(a){a(e)}))}return new(l||(l=Promise))((function(l,n){function s(e){try{r(o.next(e))}catch(a){n(a)}}function i(e){try{r(o["throw"](e))}catch(a){n(a)}}function r(e){e.done?l(e.value):t(e.value).then(s,i)}r((o=o.apply(e,a||[])).next())}))};const g={class:"container"},f={class:"treasury-title"},w={class:"text-warning"},h=(0,o._)("div",{class:"alert alert-info"},[(0,o.Uk)("Selecciona el "),(0,o._)("strong",null,"mes"),(0,o.Uk)(" en el que empezarás a contabilizar los registros de tesorería en el sistema.")],-1),_={class:"q-pb-md"},b={class:"row q-col-gutter-x-sm"},y={class:"col-xs-12 col-md-8"},U={class:"col-xs-12 col-md-4"},k={class:"alert alert-info"},x=(0,o._)("div",{class:"alert alert-warning"},[(0,o._)("strong",null,"Importante.-"),(0,o.Uk)(" Usa el "),(0,o._)("strong",null,"punto decimal ."),(0,o.Uk)(" como separador para los centavos en todo el sistema. "),(0,o._)("em",null,"Ejemplo: 132.5")],-1),q={class:"text-right"},C={class:"row flow-items q-col-gutter-x-lg q-pt-md"},S={class:"row q-pb-xs"},V={class:"col-8 q-pb-lg"},D={class:"col-xs-4 col-sm-4"},z={class:"text-right q-pt-lg"},I=(0,o.aZ)({__name:"Initial",setup(e){var a,l;const I=(0,s.tv)(),F=(0,i.o)(),H=(0,n.iH)([]),Z=(0,n.iH)(),T=(0,n.iH)(),W=(0,n.iH)((new Date).getFullYear()),$=null===(l=null===(a=F.state.user)||void 0===a?void 0:a.user)||void 0===l?void 0:l.company.id,L=()=>v(this,void 0,void 0,(function*(){const e=yield r.http.get("departments?order=id&type=LOCAL");H.value=e.rows})),Q=()=>v(this,void 0,void 0,(function*(){const e=yield r.http.get(`flows?id_company=${$}&type=INITIAL`);e.count?(H.value=e.rows.map((e=>({id:e.department.id,name:e.department.name,total:e.total}))),Z.value=!0,T.value=e.rows[0].month):yield L()})),Y=()=>0===H.value.reduce(((e,a)=>e+(a.total||0)),0)?u.message.warning("Debe llenar por lo menos un monto de algún departamento para continuar"):H.value.reduce(((e,a)=>e&&(!a.total||(0,p.K)(a.total))),!0)?void(0,d.Confirm)("<p>Revise que los datos ingresados sean correctos, solo podrá configurar esta información por única vez.<p> ¿Deséa continuar?",(()=>v(this,void 0,void 0,(function*(){return yield r.http.post("flows/initial",{id_company:$,departments:H.value,month:T.value,year:W.value}),u.message.success("Configuración guardada correctamente"),c.storage.set("initial",!1),F.commit("global/setInitial",!1),I.push("/treasury")}))),null,"Advertencia","Si, continuar"):u.message.warning("- El formato del monto no es válido, use el punto decimal como separador de decimales,<br>- Tampoco puede usar las comas como separador de miles"),j=(0,o.Fl)((()=>{let e=0;return H.value.forEach((a=>{e+=Number(a.total||0)})),e.toFixed(2)})),A=(0,o.Fl)((()=>T.value>1?m.e7[T.value-2].toUpperCase():m.e7[11].toUpperCase()));return(0,o.wF)((()=>v(this,void 0,void 0,(function*(){yield Q()})))),(e,a)=>{var l,s;const i=(0,o.up)("q-btn"),r=(0,o.up)("q-select"),u=(0,o.up)("q-chip"),c=(0,o.up)("q-input");return(0,o.wg)(),(0,o.iD)("div",g,[(0,o._)("h2",f,[(0,o.Wm)(i,{icon:"arrow_back",round:"",flat:"",onClick:a[0]||(a[0]=a=>e.$router.push("/"))}),(0,o.Uk)(" Configuración Caja local - "),(0,o._)("span",w,(0,t.zw)(null===(s=null===(l=e.$store.state.user)||void 0===l?void 0:l.user)||void 0===s?void 0:s.company.name),1)]),h,(0,o._)("div",_,[(0,o._)("div",b,[(0,o._)("div",y,[(0,o.Wm)(r,{modelValue:T.value,"onUpdate:modelValue":a[1]||(a[1]=e=>T.value=e),options:(0,n.SU)(m.e7).map(((e,a)=>({value:a+1,label:e.toUpperCase()}))),label:"Seleccione el mes","emit-value":"","map-options":"",filled:"",disable:Z.value,rules:[e=>!!e||"Debe seleccionar el mes para continuar"]},null,8,["modelValue","options","disable","rules"])]),(0,o._)("div",U,[(0,o.Wm)(r,{modelValue:W.value,"onUpdate:modelValue":a[2]||(a[2]=e=>W.value=e),options:(0,n.SU)(m.V4)(0,(new Date).getFullYear()-1),label:"Seleccione el año","emit-value":"","map-options":"",filled:"",disable:Z.value,rules:[e=>!!e||"Debe seleccionar el año para continuar"]},null,8,["modelValue","options","disable","rules"])])])]),T.value?((0,o.wg)(),(0,o.iD)(o.HY,{key:0},[(0,o._)("div",k,[(0,o.Uk)("Llena los montos de cada departamento de tu iglesia local que tiene como saldo acumulado hasta el mes de "),(0,o._)("strong",null,(0,t.zw)((0,n.SU)(A)),1)]),x,(0,o._)("div",q,[(0,o.Wm)(u,{square:"",color:"warning","text-color":"white"},{default:(0,o.w5)((()=>{var a;return[(0,o._)("strong",null,"Total "+(0,t.zw)((0,n.SU)(A))+": "+(0,t.zw)((0,n.SU)(j))+" "+(0,t.zw)(null===(a=e.$store.state.user)||void 0===a?void 0:a.user.company.money),1)]})),_:1})]),(0,o._)("div",C,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(H.value,(a=>{var l;return(0,o.wg)(),(0,o.iD)("div",{class:"col-xs-12 col-sm-6",key:a.id},[(0,o._)("div",S,[(0,o._)("div",V,(0,t.zw)(a.name),1),(0,o._)("div",D,[(0,o.Wm)(c,{standout:"",class:"text-right",dense:"",placeholder:"0.0",suffix:null===(l=e.$store.state.user)||void 0===l?void 0:l.user.company.money,modelValue:a.total,"onUpdate:modelValue":e=>a.total=e,disable:Z.value,rules:[(0,n.SU)(p.Z).decimal]},null,8,["suffix","modelValue","onUpdate:modelValue","disable","rules"])])])])})),128))]),(0,o._)("div",z,[Z.value?(0,o.kq)("",!0):((0,o.wg)(),(0,o.j4)(i,{key:0,label:"Guardar configuración inicial","no-caps":"",color:"primary",icon:"check",padding:"10px 20px",class:"btn-close-month",onClick:Y}))])],64)):(0,o.kq)("",!0)])}}});var F=l(2165),H=l(2448),Z=l(7030),T=l(4689),W=l(7518),$=l.n(W);const L=I,Q=L;$()(I,"components",{QBtn:F.Z,QSelect:H.Z,QChip:Z.Z,QInput:T.Z})}}]);