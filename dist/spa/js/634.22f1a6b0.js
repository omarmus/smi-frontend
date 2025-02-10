"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[634],{8634:(e,l,a)=>{a.r(l),a.d(l,{default:()=>Q});var o=a(3673),t=a(2323),n=a(1959),i=a(8339),s=a(9236),r=a(2993),u=a(4626),d=a(4781),c=a(185),m=a(925),v=a(8468),p=function(e,l,a,o){function t(e){return e instanceof a?e:new a((function(l){l(e)}))}return new(a||(a=Promise))((function(a,n){function i(e){try{r(o.next(e))}catch(l){n(l)}}function s(e){try{r(o["throw"](e))}catch(l){n(l)}}function r(e){e.done?a(e.value):t(e.value).then(i,s)}r((o=o.apply(e,l||[])).next())}))};const g={class:"container"},f={class:"treasury-title"},w={class:"text-warning"},h=(0,o._)("div",{class:"alert alert-info"},[(0,o.Uk)("Selecciona el "),(0,o._)("strong",null,"mes"),(0,o.Uk)(" en el que empezarás a contabilizar los registros de tesorería en el sistema.")],-1),_={class:"q-pb-md"},b={class:"row q-col-gutter-x-sm"},y={class:"col-xs-12 col-md-8"},U={class:"col-xs-12 col-md-4"},k={class:"alert alert-info"},x=(0,o._)("div",{class:"alert alert-warning"},[(0,o._)("strong",null,"Importante.-"),(0,o.Uk)(" Usa el "),(0,o._)("strong",null,"punto decimal ."),(0,o.Uk)(" como separador para los centavos en todo el sistema. "),(0,o._)("em",null,"Ejemplo: 132.5")],-1),q={class:"text-right"},C={class:"row flow-items q-col-gutter-x-lg q-pt-md"},S={class:"row q-pb-xs"},V={class:"col-8 q-pb-lg"},D={class:"col-xs-4 col-sm-4"},z={class:"text-right q-pt-lg"},I=(0,o.aZ)({__name:"Initial",setup(e){var l,a,I;const F=(0,i.tv)(),H=(0,s.o)(),Z=(0,n.iH)([]),T=(0,n.iH)(),W=(0,n.iH)(),$=(0,n.iH)((new Date).getFullYear()),L=null===(I=null===(a=null===(l=H.state.user)||void 0===l?void 0:l.user)||void 0===a?void 0:a.company)||void 0===I?void 0:I.id,Q=()=>p(this,void 0,void 0,(function*(){const e=yield r.http.get("departments?order=id&type=LOCAL");Z.value=e.rows})),Y=()=>p(this,void 0,void 0,(function*(){const e=yield r.http.get(`flows?id_company=${L}&type=INITIAL`);e.count?(Z.value=e.rows.map((e=>({id:e.department.id,name:e.department.name,total:e.total}))),T.value=!0,W.value=e.rows[0].month):yield Q()})),j=()=>0===Z.value.reduce(((e,l)=>e+(l.total||0)),0)?u.message.warning("Debe llenar por lo menos un monto de algún departamento para continuar"):Z.value.reduce(((e,l)=>e&&(!l.total||(0,v.K)(l.total))),!0)?void(0,c.Confirm)("<p>Revise que los datos ingresados sean correctos, solo podrá configurar esta información por única vez.<p> ¿Deséa continuar?",(()=>p(this,void 0,void 0,(function*(){return yield r.http.post("flows/initial",{id_company:L,departments:Z.value,month:W.value,year:$.value}),u.message.success("Configuración guardada correctamente"),d.storage.set("initial",!1),H.commit("global/setInitial",!1),F.push("/treasury")}))),null,"Advertencia","Si, continuar"):u.message.warning("- El formato del monto no es válido, use el punto decimal como separador de decimales,<br>- Tampoco puede usar las comas como separador de miles"),A=(0,o.Fl)((()=>{let e=0;return Z.value.forEach((l=>{e+=Number(l.total||0)})),e.toFixed(2)})),E=(0,o.Fl)((()=>W.value>1?m.e7[W.value-2].toUpperCase():m.e7[11].toUpperCase()));return(0,o.wF)((()=>p(this,void 0,void 0,(function*(){yield Y()})))),(e,l)=>{var a,i,s;const r=(0,o.up)("q-btn"),u=(0,o.up)("q-select"),d=(0,o.up)("q-chip"),c=(0,o.up)("q-input");return(0,o.wg)(),(0,o.iD)("div",g,[(0,o._)("h2",f,[(0,o.Wm)(r,{icon:"arrow_back",round:"",flat:"",onClick:l[0]||(l[0]=l=>e.$router.push("/"))}),(0,o.Uk)(" Configuración inicial Caja local - "),(0,o._)("span",w,(0,t.zw)(null===(s=null===(i=null===(a=e.$store.state.user)||void 0===a?void 0:a.user)||void 0===i?void 0:i.company)||void 0===s?void 0:s.name),1)]),h,(0,o._)("div",_,[(0,o._)("div",b,[(0,o._)("div",y,[(0,o.Wm)(u,{modelValue:W.value,"onUpdate:modelValue":l[1]||(l[1]=e=>W.value=e),options:(0,n.SU)(m.e7).map(((e,l)=>({value:l+1,label:e.toUpperCase()}))),label:"Seleccione el mes","emit-value":"","map-options":"",filled:"",disable:T.value,rules:[e=>!!e||"Debe seleccionar el mes para continuar"]},null,8,["modelValue","options","disable","rules"])]),(0,o._)("div",U,[(0,o.Wm)(u,{modelValue:$.value,"onUpdate:modelValue":l[2]||(l[2]=e=>$.value=e),options:(0,n.SU)(m.V4)(0,(new Date).getFullYear()-1),label:"Seleccione el año","emit-value":"","map-options":"",filled:"",disable:T.value,rules:[e=>!!e||"Debe seleccionar el año para continuar"]},null,8,["modelValue","options","disable","rules"])])])]),W.value?((0,o.wg)(),(0,o.iD)(o.HY,{key:0},[(0,o._)("div",k,[(0,o.Uk)("Llena los montos de cada departamento de tu iglesia local que tiene como saldo acumulado hasta el mes de "),(0,o._)("strong",null,(0,t.zw)((0,n.SU)(E)),1)]),x,(0,o._)("div",q,[(0,o.Wm)(d,{square:"",color:"warning","text-color":"white"},{default:(0,o.w5)((()=>{var l,a,i;return[(0,o._)("strong",null,"Total "+(0,t.zw)((0,n.SU)(E))+": "+(0,t.zw)((0,n.SU)(A))+" "+(0,t.zw)(null===(i=null===(a=null===(l=e.$store.state.user)||void 0===l?void 0:l.user)||void 0===a?void 0:a.company)||void 0===i?void 0:i.money),1)]})),_:1})]),(0,o._)("div",C,[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(Z.value,(l=>{var a,i,s;return(0,o.wg)(),(0,o.iD)("div",{class:"col-xs-12 col-sm-6",key:l.id},[(0,o._)("div",S,[(0,o._)("div",V,(0,t.zw)(l.name),1),(0,o._)("div",D,[(0,o.Wm)(c,{standout:"",class:"text-right",dense:"",placeholder:"0.0",suffix:null===(s=null===(i=null===(a=e.$store.state.user)||void 0===a?void 0:a.user)||void 0===i?void 0:i.company)||void 0===s?void 0:s.money,modelValue:l.total,"onUpdate:modelValue":e=>l.total=e,disable:T.value,rules:[(0,n.SU)(v.Z).decimal]},null,8,["suffix","modelValue","onUpdate:modelValue","disable","rules"])])])])})),128))]),(0,o._)("div",z,[T.value?(0,o.kq)("",!0):((0,o.wg)(),(0,o.j4)(r,{key:0,label:"Guardar configuración inicial","no-caps":"",color:"primary",icon:"check",padding:"10px 20px",class:"btn-close-month",onClick:j}))])],64)):(0,o.kq)("",!0)])}}});var F=a(2165),H=a(2448),Z=a(7030),T=a(4689),W=a(7518),$=a.n(W);const L=I,Q=L;$()(I,"components",{QBtn:F.Z,QSelect:H.Z,QChip:Z.Z,QInput:T.Z})}}]);