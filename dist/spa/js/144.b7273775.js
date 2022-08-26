"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[144],{925:(e,l,t)=>{t.d(l,{e7:()=>a,KS:()=>n,WU:()=>o,Fv:()=>i});const a=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],n=(e,l)=>{const t=new Date(e,l,0).getDate(),a=new Date(e,l-1,1),n=[];for(let o=6-a.getDay(),i=1;o<t;o+=7,i++)n.push({day:o+1,label:`Sábado ${o+1}`,week:i,total:0});return n},o=e=>{if(!e)return null;const l=new Date(e);return[l.getUTCDate(),l.getUTCMonth()+1,l.getUTCFullYear()].join("/")},i=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},8468:(e,l,t)=>{t.d(l,{Z:()=>a,K:()=>n});const a={email:e=>{const l=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;return l.test(String(e).toLowerCase())||!e||"El correo no es válido."},url:e=>/[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/.test(e)||!e||"Introduzca una URL válida",date:e=>/^((0?[1-9]|[12][0-9]|3[01])[- /.](0?[1-9]|1[012])[- /.](19|20)?[0-9]{2})*$/.test(e)||!e||"Introduzca una fecha válida",password:e=>e.length>=6||!e||"Debe tener al menos 6 carácteres.",required:e=>!!e||"El campo es requerido.",phone:e=>{const l=/^[0-9]/;return l.test(String(e).toLowerCase())&&8===e.length||!e||"Introduzca un numero de celular válido."},alphabet:e=>{const l=/^[a-zñÑáéíóú]/;return l.test(String(e).toLowerCase())||!e||"Solo se permiten letras."},number:e=>{const l=/^\d+$/g;return l.test(String(e))||!e||"Solo se permiten numeros enteros."},decimal:e=>{const l=/^\d*\.?\d*$/g;return l.test(String(e))||!e||"Use el punto (.) para los decimales."}};function n(e){return/^\d*\.?\d*$/.test(e)}},1144:(e,l,t)=>{t.r(l),t.d(l,{default:()=>xe});var a=t(3673),n=t(2323),o=t(1959),i=t(9582),s=t(2993),u=t(185),r=t(4781),d=t(925),c=t(9236),v=t(8468),p=function(e,l,t,a){function n(e){return e instanceof t?e:new t((function(l){l(e)}))}return new(t||(t=Promise))((function(t,o){function i(e){try{u(a.next(e))}catch(l){o(l)}}function s(e){try{u(a["throw"](e))}catch(l){o(l)}}function u(e){e.done?t(e.value):n(e.value).then(i,s)}u((a=a.apply(e,l||[])).next())}))};const m={key:0,class:"container"},y={class:"treasury-title"},w={class:"row"},g={key:0,class:"col-xs-12 col-sm-5"},f={class:"col-xs-12"},b={key:0,class:"col-xs-12"},h={class:"text-secondary"},_=(0,a.Uk)(" La persona que busca no está registrada "),k={class:"col-xs-12"},C={class:"col-xs-12"},D={class:"col-xs-12"},q={key:1,class:"col-xs-12"},z={key:2},E=(0,a._)("h3",{class:"text-warning treasury-subtitle"},"Concepto de donación",-1),x={class:"q-table-simple q-table__container q-table--horizontal-separator column q-table--dense"},S={class:"q-table"},M=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",{class:"text-left"}),(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Concepto")]),(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Valor")])])],-1),L={class:"width-80"},U={class:"text-left"},W={class:"treasury-observation"},H={key:0,class:"treasury-observation"},$={class:"text-right"},A=(0,a._)("th",{class:"text-left",colspan:"2"},[(0,a._)("strong",null,"Total")],-1),R={class:"text-right"},V={class:"col-xs-12"},B={key:0,class:"text-secondary treasury-subtitle"},O={key:1,class:"q-table-simple q-table__container q-table--horizontal-separator column q-table--dense q-table--no-wrap"},I={key:0,class:"text-left"},Z=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Nro. Boleta")],-1),F=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Nombre")],-1),K={key:1,class:"text-left"},j=(0,a._)("strong",null,"Detalle",-1),Q=[j],T=(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Valor")],-1),N={key:0,class:"width-120"},Y={class:"width-120"},P={class:"text-left"},G={key:0},J={key:1,class:"text-primary"},X={key:2,class:"treasury-observation"},ee={key:0},le={class:"q-ml-sm q-mt-xs"},te={key:0,class:"treasury-list-concepts"},ae={class:"text-warning"},ne={key:0},oe={key:1,class:"text-left"},ie={class:"text-texto"},se={key:0,class:"treasury-list-concepts"},ue={key:0},re={class:"text-right total"},de=(0,a._)("th",{class:"text-left",colspan:"2"},null,-1),ce=(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"TOTAL")],-1),ve={class:"text-right"},pe={key:2,class:"treasury-empty"},me={class:"text-right q-pt-xs q-gutter-xs"},ye=(0,a.aZ)({setup(e){var l,t;const j=(0,c.useStore)(),ye={member:"Miembro",sympathizer:"Simpatizante",visit:"Visita"},we=(0,o.iH)(null),ge=(0,o.iH)("MEMBER"),fe=(0,o.iH)(),be=(0,o.iH)(),he=(0,o.iH)(),_e=(0,o.iH)(),ke=(0,o.iH)([]),Ce=(0,o.iH)(),De=(0,o.iH)([]),qe=(0,o.iH)([]),ze=(0,o.iH)([]),Ee=(0,o.iH)([]),xe=(0,o.iH)(-1),Se=(0,o.iH)([]),Me=(0,o.iH)(),Le=(0,o.iH)(),Ue=(0,o.iH)(!0),We=(0,o.iH)(null),He=(0,i.yj)(),{entryId:$e,week:Ae}=He.params,Re={};r.storage.set("entry",Re);const Ve=null===(t=null===(l=j.state.user)||void 0===l?void 0:l.user)||void 0===t?void 0:t.company.id,Be=()=>p(this,void 0,void 0,(function*(){Me.value=yield s.http.get(`entries/${parseInt($e)}`);const e=(0,d.KS)(Me.value.year,Me.value.month),l=e.find((e=>e.week===parseInt(Ae)));Le.value=l.day})),Oe=()=>p(this,void 0,void 0,(function*(){const e=yield s.http.get(`entriesdetails?id_entry=${Me.value.id}&week=${Ae}`);Se.value=e.rows})),Ie=()=>p(this,void 0,void 0,(function*(){const e=yield s.http.get("departments?order=id");return e.rows.map((e=>({value:e.id,type:e.type,label:e.name,group:e.group})))})),Ze=e=>p(this,void 0,void 0,(function*(){let l="users?order=fullname";l+=e?`&fullname=${e}`:`&id_company=${Ve}`;const t=yield s.http.get(l,!1);return t.rows.map((e=>{var l;return{value:e.id,label:`${e.person.fullname}`,church:`${e.company.name}`,type:null===(l=e.type)||void 0===l?void 0:l.toLowerCase()}}))})),Fe=(e,l)=>p(this,void 0,void 0,(function*(){if(e.length>3&&Ce.value){const t=yield s.http.post("users/new",{type:Ce.value,fullname:e,id_company:Ve});l(e,"add-unique"),fe.value={value:t.id,label:t.person.fullname}}})),Ke=e=>{Ce.value=e;const l=document.querySelector("#entry-person input");l.dispatchEvent(new KeyboardEvent("keydown",{bubbles:!0,cancelable:!0,keyCode:13}))},je=(e,l)=>{l((()=>p(this,void 0,void 0,(function*(){ke.value=""===e?De.value:yield Ze(e)}))))},Qe=(e,l)=>{l((()=>{if(""===e)ze.value="MEMBER"===ge.value?qe.value:qe.value.filter((e=>"CHURCH"===e.group));else{const l=e.toLowerCase();ze.value=qe.value.filter((e=>e.label.toLowerCase().indexOf(l)>-1))}}))},Te=()=>p(this,void 0,void 0,(function*(){if("MEMBER"!==ge.value){const e=yield We.value.validate();if(!e)return!1}const e={id:we.value,concepts:Ee.value,type:ge.value,id_entry:Me.value.id,date:`${Me.value.year}-${Me.value.month}-${Le.value}`,week:Ae};"MEMBER"===ge.value?(e.value=el.value,e.id_user=fe.value.value):(e.observations=_e.value,e.value=he.value,e.id_department=be.value.value),"MEMBER"!==ge.value&&!we.value&&[12,25].includes(e.id_department)?((0,u.Confirm)("¿Desea dividir la ofrenda de jóvenes para la Asociación e Iglesia local?",(()=>p(this,void 0,void 0,(function*(){e.value=Number(e.value)/2,e.id_department=25,yield s.http.post("entriesdetails",e),e.id_department=12,yield s.http.post("entriesdetails",e),yield Oe()}))),(()=>p(this,void 0,void 0,(function*(){yield s.http.post("entriesdetails",e),yield Oe()}))),"Ofrenda de Jóvenes","Si","No"),yield Ne()):(we.value?yield s.http.put(`entriesdetails/${we.value}`,e):yield s.http.post("entriesdetails",e),yield Oe(),yield Ne())})),Ne=()=>p(this,void 0,void 0,(function*(){We.value.resetValidation(),Ue.value=!1,yield(0,a.Y3)((()=>{we.value=null,be.value=null,_e.value="",he.value="",xe.value=-1,Ee.value=[],fe.value=null,Ue.value=!0}))})),Ye=e=>p(this,void 0,void 0,(function*(){const l=yield s.http.get(`entriesdetails/${e}`);ge.value=l.type,we.value=l.id,"MEMBER"===ge.value?(fe.value={value:l.user.id,label:l.user.person.fullname},l.id_user=fe.value.value,Ee.value=l.concepts):(_e.value=l.observation,he.value=l.value,be.value={value:l.department.id,label:l.department.name,type:l.department.type},l.id_department=be.value.value)})),Pe=e=>{(0,u.Confirm)("¿Desea eliminar el registro?",(()=>p(this,void 0,void 0,(function*(){yield s.http["delete"](`entriesdetails/${e}`),yield Oe()}))),null,"Eliminar","Si","No")},Ge=()=>{const e={concept:be.value,observation:_e.value,value:he.value};xe.value>-1?Ee.value[xe.value]=e:Ee.value.push(e),be.value=null,_e.value="",he.value="",xe.value=-1},Je=e=>{const l=Ee.value[e];be.value=l.concept,_e.value=l.observation,he.value=l.value,xe.value=e},Xe=e=>{Ee.value.splice(e,1)},el=(0,o.Fl)((()=>{let e=0;for(const l of Ee.value)e+=parseFloat(l.value);return e})),ll=(0,o.Fl)((()=>{let e=0;for(const l of Se.value)e+=parseFloat(l.value);return e})),tl=e=>p(this,void 0,void 0,(function*(){(null===e||void 0===e?void 0:e.code)&&(yield s.http.put(`entriesdetails/${e.id}`,{code:e.code}))})),al=e=>p(this,void 0,void 0,(function*(){const l=e?`entries/pdf/detail/${e}`:`entries/pdf/details/${Me.value.id}`,t=yield s.http.get(l),a=document.createElement("a");a.href=window.URL.createObjectURL(nl(t,"application/pdf")),a.setAttribute("download",`invoice-${Date.now()}.pdf`),document.body.appendChild(a),a.click()})),nl=(e,l,t=512)=>{const a=atob(e),n=[];for(let o=0;o<a.length;o+=t){const e=a.slice(o,o+t),l=new Array(e.length);for(let t=0;t<e.length;t++)l[t]=e.charCodeAt(t);const i=new Uint8Array(l);n.push(i)}return new Blob(n,{type:l||""})};return(0,a.wF)((()=>p(this,void 0,void 0,(function*(){qe.value=yield Ie(),ze.value=qe.value,De.value=yield Ze(),ke.value=De.value,yield Be(),yield Oe()})))),(e,l)=>{const t=(0,a.up)("q-btn"),i=(0,a.up)("q-btn-group"),s=(0,a.up)("q-item-label"),u=(0,a.up)("q-item-section"),r=(0,a.up)("q-item"),c=(0,a.up)("q-select"),p=(0,a.up)("q-input"),j=(0,a.up)("q-form");return Me.value?((0,a.wg)(),(0,a.iD)("div",m,[(0,a._)("h2",y,[(0,a.Wm)(t,{icon:"arrow_back",round:"",flat:"",onClick:l[0]||(l[0]=l=>e.$router.push(`/treasury/week/${Me.value.id}`))}),(0,a.Uk)(" Diezmos y ofrendas - Sábado "+(0,n.zw)(Le.value)+" de "+(0,n.zw)((0,o.SU)(d.e7)[Me.value.month-1]),1)]),(0,a._)("div",w,["CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("div",g,[Ue.value?((0,a.wg)(),(0,a.j4)(j,{key:0,class:"q-gutter-md",onSubmit:Ge,onReset:Ne,ref_key:"myForm",ref:We},{default:(0,a.w5)((()=>[(0,a._)("div",f,[(0,a.Wm)(i,{spread:"",outline:""},{default:(0,a.w5)((()=>[(0,a.Wm)(t,{outline:"MEMBER"!==ge.value,padding:"12px",color:"primary",label:"Persona",onClick:l[1]||(l[1]=e=>ge.value="MEMBER"),"no-caps":""},null,8,["outline"]),(0,a.Wm)(t,{outline:"CHURCH"!==ge.value,padding:"10px",color:"primary",label:"Congregación",onClick:l[2]||(l[2]=e=>ge.value="CHURCH"),"no-caps":""},null,8,["outline"])])),_:1})]),"MEMBER"===ge.value?((0,a.wg)(),(0,a.iD)("div",b,[(0,a.Wm)(c,{id:"entry-person",filled:"",modelValue:fe.value,"onUpdate:modelValue":l[5]||(l[5]=e=>fe.value=e),placeholder:fe.value?"":"Escriba un nombre","use-input":"","use-chips":"","input-debounce":300,onNewValue:Fe,options:ke.value,onFilter:je,"lazy-rules":"",rules:[e=>!!e||"Seleccione a una persona"]},{option:(0,a.w5)((e=>[(0,a.Wm)(r,(0,n.vs)((0,a.F4)(e.itemProps)),{default:(0,a.w5)((()=>[(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[(0,a.Wm)(s,null,{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)(e.opt.label),1)])),_:2},1024),(0,a.Wm)(s,{caption:""},{default:(0,a.w5)((()=>[(0,a._)("strong",h,(0,n.zw)(ye[e.opt.type]),1),(0,a.Uk)(" - "+(0,n.zw)(e.opt.church),1)])),_:2},1024)])),_:2},1024)])),_:2},1040)])),"no-option":(0,a.w5)((()=>[(0,a.Wm)(r,{dense:""},{default:(0,a.w5)((()=>[(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[_])),_:1})])),_:1}),(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[(0,a.Wm)(t,{color:"secondary",label:"Agregar como simpatizante","no-caps":"",onClick:l[3]||(l[3]=e=>Ke("SYMPATHIZER"))})])),_:1})])),_:1}),(0,a.Wm)(r,null,{default:(0,a.w5)((()=>[(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[(0,a.Wm)(t,{color:"secondary",label:"Agregar como visita","no-caps":"",onClick:l[4]||(l[4]=e=>Ke("VISIT"))})])),_:1})])),_:1})])),_:1},8,["modelValue","placeholder","options","rules"])])):(0,a.kq)("",!0),(0,a._)("div",k,[(0,a.Wm)(c,{filled:"",label:"Concepto",modelValue:be.value,"onUpdate:modelValue":l[6]||(l[6]=e=>be.value=e),"use-input":"","use-chips":"","input-debounce":"0",options:ze.value,onFilter:Qe,"lazy-rules":"",rules:[e=>!!e||"Seleccione el concepto"]},{option:(0,a.w5)((e=>[(0,a.Wm)(r,(0,n.vs)((0,a.F4)(e.itemProps)),{default:(0,a.w5)((()=>[(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[(0,a.Wm)(s,null,{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)(e.opt.label),1)])),_:2},1024),(0,a.Wm)(s,{caption:""},{default:(0,a.w5)((()=>[(0,a.Uk)((0,n.zw)("GLOBAL"===e.opt.type?"Asociación":"Iglesia local"),1)])),_:2},1024)])),_:2},1024)])),_:2},1040)])),_:1},8,["modelValue","options","rules"])]),(0,a._)("div",C,[(0,a.Wm)(p,{filled:"",label:"Valor",modelValue:he.value,"onUpdate:modelValue":l[7]||(l[7]=e=>he.value=e),"lazy-rules":"",rules:[(0,o.SU)(v.Z).decimal,(0,o.SU)(v.Z).required]},null,8,["modelValue","rules"])]),(0,a._)("div",D,[(0,a.Wm)(p,{filled:"",label:"Observaciones",modelValue:_e.value,"onUpdate:modelValue":l[8]||(l[8]=e=>_e.value=e)},null,8,["modelValue"])]),"MEMBER"===ge.value?((0,a.wg)(),(0,a.iD)("div",q,[(0,a.Wm)(t,{padding:"10px",label:"Agregar concepto",icon:"add",color:"warning",type:"submit","no-caps":"",class:"full-width"})])):(0,a.kq)("",!0),"MEMBER"===ge.value&&Ee.value.length?((0,a.wg)(),(0,a.iD)("div",z,[E,(0,a._)("div",x,[(0,a._)("table",S,[M,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(Ee.value,((e,l)=>((0,a.wg)(),(0,a.iD)("tr",{key:e},[(0,a._)("td",L,[(0,a.Wm)(t,{size:"sm",icon:"edit",onClick:e=>Je(l),round:"",flat:""},null,8,["onClick"]),(0,a.Wm)(t,{size:"sm",icon:"delete",onClick:e=>Xe(l),round:"",flat:""},null,8,["onClick"])]),(0,a._)("td",U,[(0,a.Uk)((0,n.zw)(e.concept.label)+" ",1),(0,a._)("span",W,(0,n.zw)("GLOBAL"===e.concept.type?"Asociación":"Iglesia local"),1),e.observation?((0,a.wg)(),(0,a.iD)("span",H," / "+(0,n.zw)(e.observation),1)):(0,a.kq)("",!0)]),(0,a._)("td",$,(0,n.zw)(e.value),1)])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[A,(0,a._)("th",R,[(0,a._)("strong",null,(0,n.zw)((0,o.SU)(el)),1)])])])])])])):(0,a.kq)("",!0),(0,a._)("div",V,[(0,a.Wm)(t,{padding:"10px",label:we.value?"Actualizar recibo":"Guardar recibo",color:"primary","no-caps":"",disable:0===Ee.value.length&&"MEMBER"===ge.value,onClick:Te,icon:"check",class:"full-width"},null,8,["label","disable"]),we.value?((0,a.wg)(),(0,a.j4)(t,{key:0,type:"reset",padding:"10px",label:"Cancelar actualización","no-caps":"",icon:"cancel",class:"full-width q-mt-sm"})):(0,a.kq)("",!0)])])),_:1},512)):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("div",{class:(0,n.C_)(["col-xs-12 tithe-column",{"col-sm-7":"CLOSED"!==Me.value.state,"col-sm-12":"CLOSED"===Me.value.state}])},["CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("h3",B,"Diezmos y ofrendas")):(0,a.kq)("",!0),Se.value.length?((0,a.wg)(),(0,a.iD)("div",O,[(0,a._)("table",{class:(0,n.C_)(["q-table",{"treasury-table-data":"CLOSED"===Me.value.state}])},[(0,a._)("thead",null,[(0,a._)("tr",null,["CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("th",I)):(0,a.kq)("",!0),Z,F,"CLOSED"===Me.value.state?((0,a.wg)(),(0,a.iD)("th",K,Q)):(0,a.kq)("",!0),T])]),(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(Se.value,(e=>{var l,o,i,s;return(0,a.wg)(),(0,a.iD)("tr",{key:e.id},["CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("td",N,[(0,a.Wm)(t,{size:"sm",icon:"edit",round:"",flat:"",onClick:l=>Ye(e.id)},null,8,["onClick"]),(0,a.Wm)(t,{size:"sm",icon:"delete",round:"",flat:"",onClick:l=>Pe(e.id)},null,8,["onClick"]),"MEMBER"===e.type?((0,a.wg)(),(0,a.j4)(t,{key:0,size:"sm",icon:"print",round:"",flat:"",onClick:l=>al(e.id)},null,8,["onClick"])):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("td",Y,["MEMBER"===e.type?((0,a.wg)(),(0,a.j4)(p,{key:0,modelValue:e.code,"onUpdate:modelValue":l=>e.code=l,dense:"",standout:"",debounce:"500",onKeyup:l=>tl(e)},null,8,["modelValue","onUpdate:modelValue","onKeyup"])):(0,a.kq)("",!0)]),(0,a._)("td",P,["MEMBER"===e.type?((0,a.wg)(),(0,a.iD)("span",G,(0,n.zw)(null===(o=null===(l=e.user)||void 0===l?void 0:l.person)||void 0===o?void 0:o.fullname),1)):((0,a.wg)(),(0,a.iD)("strong",J,(0,n.zw)(e.department.name),1)),"CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("span",X,["MEMBER"!==e.type?((0,a.wg)(),(0,a.iD)("strong",ee,(0,n.zw)("LOCAL"===e.department.type?"Iglesia local":"Asociación"),1)):(0,a.kq)("",!0),(0,a.Uk)(" "+(0,n.zw)(e.observations?` / ${e.observations}`:""),1)])):(0,a.kq)("",!0),(0,a._)("div",le,[(null===(i=e.concepts)||void 0===i?void 0:i.length)&&"CLOSED"!==Me.value.state?((0,a.wg)(),(0,a.iD)("ul",te,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.concepts,((e,l)=>((0,a.wg)(),(0,a.iD)("li",{key:l},[(0,a._)("strong",ae,"- "+(0,n.zw)(e.concept.label)+": ",1),(0,a.Uk)((0,n.zw)(e.value)+" / "+(0,n.zw)("LOCAL"===e.concept.type?"Iglesia local":"Asociación")+" ",1),e.observation?((0,a.wg)(),(0,a.iD)("span",ne," - "+(0,n.zw)(e.observation),1)):(0,a.kq)("",!0)])))),128))])):(0,a.kq)("",!0)])]),"CLOSED"===Me.value.state?((0,a.wg)(),(0,a.iD)("td",oe,[(0,a._)("span",ie,(0,n.zw)(e.observations),1),(null===(s=e.concepts)||void 0===s?void 0:s.length)?((0,a.wg)(),(0,a.iD)("ul",se,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.concepts,((e,l)=>((0,a.wg)(),(0,a.iD)("li",{key:l},[(0,a._)("strong",null,(0,n.zw)(e.concept.label)+": ",1),(0,a.Uk)((0,n.zw)(e.value)+" / "+(0,n.zw)("LOCAL"===e.concept.type?"Iglesia local":"Asociación")+" ",1),e.observation?((0,a.wg)(),(0,a.iD)("span",ue," - "+(0,n.zw)(e.observation),1)):(0,a.kq)("",!0)])))),128))])):(0,a.kq)("",!0)])):(0,a.kq)("",!0),(0,a._)("td",re,[(0,a._)("span",null,(0,n.zw)(e.value),1)])])})),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[de,ce,(0,a._)("th",ve,[(0,a._)("strong",null,(0,n.zw)((0,o.SU)(ll)),1)])])])],2)])):((0,a.wg)(),(0,a.iD)("div",pe,"Sin registros")),(0,a._)("div",me,[(0,a.Wm)(t,{disable:0===Se.value.length,label:"Imprimir todos los recibos","no-caps":"",icon:"print",padding:"10px 20px",class:"btn-close-month",onClick:l[9]||(l[9]=e=>al(null))},null,8,["disable"])])],2)])])):(0,a.kq)("",!0)}}});var we=t(8240),ge=t(5269),fe=t(6375),be=t(2448),he=t(3414),_e=t(2035),ke=t(2350),Ce=t(4842),De=t(6429),qe=t(7518),ze=t.n(qe);const Ee=ye,xe=Ee;ze()(ye,"components",{QBtn:we.Z,QForm:ge.Z,QBtnGroup:fe.Z,QSelect:be.Z,QItem:he.Z,QItemSection:_e.Z,QItemLabel:ke.Z,QInput:Ce.Z,QTable:De.Z})}}]);