"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[144],{925:(e,l,t)=>{t.d(l,{e7:()=>a,KS:()=>n,WU:()=>o,Fv:()=>i});const a=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],n=(e,l)=>{const t=new Date(e,l,0).getDate(),a=new Date(e,l-1,1),n=[];for(let o=6-a.getDay(),i=1;o<t;o+=7,i++)n.push({day:o+1,label:`Sábado ${o+1}`,week:i,total:0});return n},o=e=>{if(!e)return null;const l=new Date(e);return[l.getUTCDate(),l.getUTCMonth()+1,l.getUTCFullYear()].join("/")},i=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},1144:(e,l,t)=>{t.r(l),t.d(l,{default:()=>fe});var a=t(3673),n=t(2323),o=t(1959),i=t(9582),u=t(2993),s=t(185),r=t(4781),d=t(925),c=function(e,l,t,a){function n(e){return e instanceof t?e:new t((function(l){l(e)}))}return new(t||(t=Promise))((function(t,o){function i(e){try{s(a.next(e))}catch(l){o(l)}}function u(e){try{s(a["throw"](e))}catch(l){o(l)}}function s(e){e.done?t(e.value):n(e.value).then(i,u)}s((a=a.apply(e,l||[])).next())}))};const v={key:0,class:"container"},p={class:"treasury-title"},m={class:"row"},y={key:0,class:"col-xs-12 col-sm-6"},w={class:"col-xs-12"},f={key:0,class:"col-xs-12"},g={class:"text-secondary"},b=(0,a.Uk)(" La persona que busca no está registrada "),_={class:"col-xs-12"},h={class:"col-xs-12"},k={class:"col-xs-12"},C={key:1,class:"col-xs-12"},D={key:2},E=(0,a._)("h3",{class:"text-warning treasury-subtitle"},"Concepto de donación",-1),q={class:"q-table-simple q-table__container q-table--horizontal-separator column q-table--dense"},x={class:"q-table"},z=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",{class:"text-left"}),(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Concepto")]),(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Valor")])])],-1),M={class:"width-80"},W={class:"text-left"},S={class:"treasury-observation"},H={class:"text-right"},U=(0,a._)("th",{class:"text-left",colspan:"2"},[(0,a._)("strong",null,"Total")],-1),L={class:"text-right"},R={class:"col-xs-12"},V={key:0,class:"text-secondary treasury-subtitle"},$={key:1,class:"q-table-simple q-table__container q-table--horizontal-separator column q-table--dense q-table--no-wrap"},B={key:0,class:"text-left"},O=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Nombre")],-1),I={key:1,class:"text-left"},F=(0,a._)("strong",null,"Detalle",-1),A=[F],Z=(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Valor")],-1),Q={key:0,class:"width-80"},T={class:"text-left"},j={key:0},K={key:1,class:"text-primary"},N={key:2,class:"treasury-observation"},Y={key:0},P={key:1,class:"text-left"},G={class:"text-texto"},J={key:0,class:"treasury-list-concepts"},X={key:0},ee={class:"text-right total"},le=(0,a._)("th",{class:"text-left",colspan:"2"},[(0,a._)("strong",null,"Total")],-1),te={class:"text-right"},ae={key:2,class:"treasury-empty"},ne=(0,a.aZ)({setup(e){const l={member:"Miembro",sympathizer:"Simpatizante",visit:"Visita"},t=(0,o.iH)(null),F=(0,o.iH)("MEMBER"),ne=(0,o.iH)(),oe=(0,o.iH)(),ie=(0,o.iH)(),ue=(0,o.iH)(),se=(0,o.iH)([]),re=(0,o.iH)(),de=(0,o.iH)([]),ce=(0,o.iH)([]),ve=(0,o.iH)([]),pe=(0,o.iH)([]),me=(0,o.iH)(-1),ye=(0,o.iH)([]),we=(0,o.iH)(),fe=(0,o.iH)(),ge=(0,o.iH)(!0),be=(0,i.yj)(),{entryId:_e,week:he}=be.params,ke={};r.storage.set("entry",ke);const Ce=9,De=()=>c(this,void 0,void 0,(function*(){we.value=yield u.http.get(`entries/${parseInt(_e)}`);const e=(0,d.KS)(we.value.year,we.value.month),l=e.find((e=>e.week===parseInt(he)));fe.value=l.day})),Ee=()=>c(this,void 0,void 0,(function*(){const e=yield u.http.get(`entries/details?id_entry=${we.value.id}&week=${he}`);ye.value=e.rows})),qe=()=>c(this,void 0,void 0,(function*(){const e=yield u.http.get("departments?order=id");return e.rows.map((e=>({value:e.id,type:"GLOBAL"===e.type?"Asociación":"Iglesia local",label:e.name,group:e.group})))})),xe=e=>c(this,void 0,void 0,(function*(){let l="users?order=fullname";l+=e?`&fullname=${e}`:`&id_company=${Ce}`;const t=yield u.http.get(l,!1);return t.rows.map((e=>{var l;return{value:e.id,label:`${e.person.fullname}`,church:`${e.company.name}`,type:null===(l=e.type)||void 0===l?void 0:l.toLowerCase()}}))})),ze=(e,l)=>c(this,void 0,void 0,(function*(){if(e.length>3&&re.value){const t=yield u.http.post("users/new",{type:re.value,fullname:e,id_company:Ce});l(e,"add-unique"),ne.value={value:t.id,label:t.person.fullname}}})),Me=e=>{re.value=e;const l=document.querySelector("#entry-person input");l.dispatchEvent(new KeyboardEvent("keydown",{bubbles:!0,cancelable:!0,keyCode:13}))},We=(e,l)=>{l((()=>c(this,void 0,void 0,(function*(){se.value=""===e?de.value:yield xe(e)}))))},Se=(e,l)=>{l((()=>{if(""===e)ve.value="MEMBER"===F.value?ce.value:ce.value.filter((e=>"CHURCH"===e.group));else{const l=e.toLowerCase();ve.value=ce.value.filter((e=>e.label.toLowerCase().indexOf(l)>-1))}}))},He=()=>c(this,void 0,void 0,(function*(){const e={id:t.value,concepts:pe.value,type:F.value,id_entry:we.value.id,date:`${we.value.year}-${we.value.month}-${fe.value}`,week:he};"MEMBER"===F.value?(e.value=Oe.value,e.id_user=ne.value.value):(e.observations=ue.value,e.value=ie.value,e.id_department=oe.value.value),"MEMBER"!==F.value&&!t.value&&[12,25].includes(e.id_department)?((0,s.Confirm)("¿Desea dividir la ofrenda de jóvenes para la Asociación e Iglesia local?",(()=>c(this,void 0,void 0,(function*(){e.value=Number(e.value)/2,e.id_department=25,yield u.http.post("entries/details",e),e.id_department=12,yield u.http.post("entries/details",e),yield Ee()}))),(()=>c(this,void 0,void 0,(function*(){yield u.http.post("entries/details",e),yield Ee()}))),"Ofrenda de Jóvenes","Si","No"),yield Ue()):(t.value?yield u.http.put(`entries/details/${t.value}`,e):yield u.http.post("entries/details",e),yield Ee(),yield Ue())})),Ue=()=>c(this,void 0,void 0,(function*(){ge.value=!1,yield(0,a.Y3)((()=>{t.value=null,oe.value=null,ue.value="",ie.value="",me.value=-1,pe.value=[],ne.value=null,ge.value=!0}))})),Le=e=>c(this,void 0,void 0,(function*(){const l=yield u.http.get(`entries/details/${e}`);F.value=l.type,t.value=l.id,"MEMBER"===F.value?(ne.value={value:l.user.id,label:l.user.person.fullname},l.id_user=ne.value.value,pe.value=l.concepts):(ue.value=l.observation,ie.value=l.value,oe.value={value:l.department.id,label:l.department.name,type:l.department.type},l.id_department=oe.value.value)})),Re=e=>{(0,s.Confirm)("¿Desea eliminar el registro?",(()=>c(this,void 0,void 0,(function*(){yield u.http["delete"](`entries/details/${e}`),yield Ee()}))),null,"Eliminar","Si","No")},Ve=()=>{const e={concept:oe.value,observation:ue.value,value:ie.value};me.value>-1?pe.value[me.value]=e:pe.value.push(e),oe.value=null,ue.value="",ie.value="",me.value=-1},$e=e=>{const l=pe.value[e];oe.value=l.concept,ue.value=l.observation,ie.value=l.value,me.value=e},Be=e=>{pe.value.splice(e,1)},Oe=(0,o.Fl)((()=>{let e=0;for(const l of pe.value)e+=parseFloat(l.value);return e})),Ie=(0,o.Fl)((()=>{let e=0;for(const l of ye.value)e+=parseFloat(l.value);return e}));return(0,a.wF)((()=>c(this,void 0,void 0,(function*(){ce.value=yield qe(),ve.value=ce.value,de.value=yield xe(),se.value=de.value,yield De(),yield Ee()})))),(e,i)=>{const u=(0,a.up)("q-btn"),s=(0,a.up)("q-btn-group"),r=(0,a.up)("q-item-label"),c=(0,a.up)("q-item-section"),re=(0,a.up)("q-item"),de=(0,a.up)("q-select"),ce=(0,a.up)("q-input"),me=(0,a.up)("q-form");return we.value?((0,a.wg)(),(0,a.iD)("div",v,[(0,a._)("h2",p,[(0,a.Wm)(u,{icon:"arrow_back",round:"",flat:"",onClick:i[0]||(i[0]=l=>e.$router.push(`/treasury/week/${we.value.id}`))}),(0,a.Uk)(" Diezmos y ofrendas - Sábado "+(0,n.zw)(fe.value)+" de "+(0,n.zw)((0,o.SU)(d.e7)[we.value.month-1]),1)]),(0,a._)("div",m,["CLOSED"!==we.value.state?((0,a.wg)(),(0,a.iD)("div",y,[ge.value?((0,a.wg)(),(0,a.j4)(me,{key:0,class:"q-gutter-md",onSubmit:Ve,onReset:Ue},{default:(0,a.w5)((()=>[(0,a._)("div",w,[(0,a.Wm)(s,{spread:"",outline:""},{default:(0,a.w5)((()=>[(0,a.Wm)(u,{outline:"MEMBER"!==F.value,padding:"12px",color:"primary",label:"Persona",onClick:i[1]||(i[1]=e=>F.value="MEMBER"),"no-caps":""},null,8,["outline"]),(0,a.Wm)(u,{outline:"CHURCH"!==F.value,padding:"10px",color:"primary",label:"Congregación",onClick:i[2]||(i[2]=e=>F.value="CHURCH"),"no-caps":""},null,8,["outline"])])),_:1})]),"MEMBER"===F.value?((0,a.wg)(),(0,a.iD)("div",f,[(0,a.Wm)(de,{id:"entry-person",filled:"",modelValue:ne.value,"onUpdate:modelValue":i[5]||(i[5]=e=>ne.value=e),placeholder:ne.value?"":"Escriba un nombre","use-input":"","use-chips":"","input-debounce":300,onNewValue:ze,options:se.value,onFilter:We,"lazy-rules":"",rules:[e=>!!e||"Seleccione a una persona"]},{option:(0,a.w5)((e=>[(0,a.Wm)(re,(0,n.vs)((0,a.F4)(e.itemProps)),{default:(0,a.w5)((()=>[(0,a.Wm)(c,null,{default:(0,a.w5)((()=>[(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)(e.opt.label),1)])),_:2},1024),(0,a.Wm)(r,{caption:""},{default:(0,a.w5)((()=>[(0,a._)("strong",g,(0,n.zw)(l[e.opt.type]),1),(0,a.Uk)(" - "+(0,n.zw)(e.opt.church),1)])),_:2},1024)])),_:2},1024)])),_:2},1040)])),"no-option":(0,a.w5)((()=>[(0,a.Wm)(re,{dense:""},{default:(0,a.w5)((()=>[(0,a.Wm)(c,null,{default:(0,a.w5)((()=>[b])),_:1})])),_:1}),(0,a.Wm)(re,null,{default:(0,a.w5)((()=>[(0,a.Wm)(c,null,{default:(0,a.w5)((()=>[(0,a.Wm)(u,{color:"secondary",label:"Agregar como simpatizante","no-caps":"",onClick:i[3]||(i[3]=e=>Me("SYMPATHIZER"))})])),_:1})])),_:1}),(0,a.Wm)(re,null,{default:(0,a.w5)((()=>[(0,a.Wm)(c,null,{default:(0,a.w5)((()=>[(0,a.Wm)(u,{color:"secondary",label:"Agregar como visita","no-caps":"",onClick:i[4]||(i[4]=e=>Me("VISIT"))})])),_:1})])),_:1})])),_:1},8,["modelValue","placeholder","options","rules"])])):(0,a.kq)("",!0),(0,a._)("div",_,[(0,a.Wm)(de,{filled:"",label:"Concepto",modelValue:oe.value,"onUpdate:modelValue":i[6]||(i[6]=e=>oe.value=e),"use-input":"","use-chips":"","input-debounce":"0",options:ve.value,onFilter:Se,"lazy-rules":"",rules:[e=>!!e||"Seleccione el concepto"]},{option:(0,a.w5)((e=>[(0,a.Wm)(re,(0,n.vs)((0,a.F4)(e.itemProps)),{default:(0,a.w5)((()=>[(0,a.Wm)(c,null,{default:(0,a.w5)((()=>[(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)(e.opt.label),1)])),_:2},1024),(0,a.Wm)(r,{caption:""},{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)(e.opt.type),1)])),_:2},1024)])),_:2},1024)])),_:2},1040)])),_:1},8,["modelValue","options","rules"])]),(0,a._)("div",h,[(0,a.Wm)(ce,{filled:"",label:"Valor",modelValue:ie.value,"onUpdate:modelValue":i[7]||(i[7]=e=>ie.value=e),"lazy-rules":"",rules:[e=>e&&e.length>0||"Ingrese el valor"]},null,8,["modelValue","rules"])]),(0,a._)("div",k,[(0,a.Wm)(ce,{filled:"",label:"Observaciones",modelValue:ue.value,"onUpdate:modelValue":i[8]||(i[8]=e=>ue.value=e)},null,8,["modelValue"])]),"MEMBER"===F.value?((0,a.wg)(),(0,a.iD)("div",C,[(0,a.Wm)(u,{padding:"10px",label:"Agregar concepto",icon:"add",color:"warning",type:"submit","no-caps":"",class:"full-width"})])):(0,a.kq)("",!0),"MEMBER"===F.value&&pe.value.length?((0,a.wg)(),(0,a.iD)("div",D,[E,(0,a._)("div",q,[(0,a._)("table",x,[z,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(pe.value,((e,l)=>((0,a.wg)(),(0,a.iD)("tr",{key:e},[(0,a._)("td",M,[(0,a.Wm)(u,{size:"sm",icon:"edit",onClick:e=>$e(l),round:"",flat:""},null,8,["onClick"]),(0,a.Wm)(u,{size:"sm",icon:"delete",onClick:e=>Be(l),round:"",flat:""},null,8,["onClick"])]),(0,a._)("td",W,[(0,a.Uk)((0,n.zw)(e.concept.label)+" ",1),(0,a._)("span",S,(0,n.zw)(e.observation),1)]),(0,a._)("td",H,(0,n.zw)(e.value),1)])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[U,(0,a._)("th",L,[(0,a._)("strong",null,(0,n.zw)((0,o.SU)(Oe)),1)])])])])])])):(0,a.kq)("",!0),(0,a._)("div",R,[(0,a.Wm)(u,{padding:"10px",label:t.value?"Actualizar recibo":"Guardar recibo",color:"primary","no-caps":"",disable:0===pe.value.length&&"MEMBER"===F.value,onClick:He,icon:"check",class:"full-width"},null,8,["label","disable"]),t.value?((0,a.wg)(),(0,a.j4)(u,{key:0,type:"reset",padding:"10px",label:"Cancelar actualización","no-caps":"",icon:"cancel",class:"full-width q-mt-sm"})):(0,a.kq)("",!0)])])),_:1})):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("div",{class:(0,n.C_)(["col-xs-12 tithe-column",{"col-sm-6":"CLOSED"!==we.value.state,"col-sm-12":"CLOSED"===we.value.state}])},["CLOSED"!==we.value.state?((0,a.wg)(),(0,a.iD)("h3",V,"Diezmos y ofrendas")):(0,a.kq)("",!0),ye.value.length?((0,a.wg)(),(0,a.iD)("div",$,[(0,a._)("table",{class:(0,n.C_)(["q-table",{"treasury-table-data":"CLOSED"===we.value.state}])},[(0,a._)("thead",null,[(0,a._)("tr",null,["CLOSED"!==we.value.state?((0,a.wg)(),(0,a.iD)("th",B)):(0,a.kq)("",!0),O,"CLOSED"===we.value.state?((0,a.wg)(),(0,a.iD)("th",I,A)):(0,a.kq)("",!0),Z])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(ye.value,(e=>{var l,t,o;return(0,a.wg)(),(0,a.iD)("tr",{key:e.id},["CLOSED"!==we.value.state?((0,a.wg)(),(0,a.iD)("td",Q,[(0,a.Wm)(u,{size:"sm",icon:"edit",round:"",flat:"",onClick:l=>Le(e.id)},null,8,["onClick"]),(0,a.Wm)(u,{size:"sm",icon:"delete",round:"",flat:"",onClick:l=>Re(e.id)},null,8,["onClick"])])):(0,a.kq)("",!0),(0,a._)("td",T,["MEMBER"===e.type?((0,a.wg)(),(0,a.iD)("span",j,(0,n.zw)(null===(t=null===(l=e.user)||void 0===l?void 0:l.person)||void 0===t?void 0:t.fullname),1)):((0,a.wg)(),(0,a.iD)("strong",K,(0,n.zw)(e.department.name),1)),"CLOSED"!==we.value.state?((0,a.wg)(),(0,a.iD)("span",N,["MEMBER"!==e.type?((0,a.wg)(),(0,a.iD)("strong",Y,(0,n.zw)("LOCAL"===e.department.type?"Iglesia local":"Asociación"),1)):(0,a.kq)("",!0),(0,a.Uk)(" "+(0,n.zw)(e.observations?` / ${e.observations}`:""),1)])):(0,a.kq)("",!0)]),"CLOSED"===we.value.state?((0,a.wg)(),(0,a.iD)("td",P,[(0,a._)("span",G,(0,n.zw)(e.observations),1),(null===(o=e.concepts)||void 0===o?void 0:o.length)?((0,a.wg)(),(0,a.iD)("ul",J,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.concepts,((e,l)=>((0,a.wg)(),(0,a.iD)("li",{key:l},[(0,a._)("strong",null,(0,n.zw)(e.concept.label)+": ",1),(0,a.Uk)((0,n.zw)(e.value)+" ",1),e.observation?((0,a.wg)(),(0,a.iD)("span",X," - "+(0,n.zw)(e.observation),1)):(0,a.kq)("",!0)])))),128))])):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("td",ee,[(0,a._)("span",null,(0,n.zw)(e.value),1)])])})),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[le,(0,a._)("th",te,[(0,a._)("strong",null,(0,n.zw)((0,o.SU)(Ie)),1)])])])],2)])):((0,a.wg)(),(0,a.iD)("div",ae,"Sin registros"))],2)])])):(0,a.kq)("",!0)}}});var oe=t(8240),ie=t(5269),ue=t(6375),se=t(2448),re=t(3414),de=t(2035),ce=t(2350),ve=t(4689),pe=t(6429),me=t(7518),ye=t.n(me);const we=ne,fe=we;ye()(ne,"components",{QBtn:oe.Z,QForm:ie.Z,QBtnGroup:ue.Z,QSelect:se.Z,QItem:re.Z,QItemSection:de.Z,QItemLabel:ce.Z,QInput:ve.Z,QTable:pe.Z})}}]);