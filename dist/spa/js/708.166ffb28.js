"use strict";(self["webpackChunksmi_frontend"]=self["webpackChunksmi_frontend"]||[]).push([[708],{925:(e,l,t)=>{t.d(l,{e7:()=>a,KS:()=>o,WU:()=>s,Fv:()=>n});const a=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],o=(e,l)=>{const t=new Date(e,l,0).getDate(),a=new Date(e,l-1,1),o=[];for(let s=6-a.getDay(),n=1;s<t;s+=7,n++)o.push({day:s+1,label:`Sábado ${s+1}`,week:n,total:0});return o},s=e=>{if(!e)return null;const l=new Date(e);return[l.getUTCDate(),l.getUTCMonth()+1,l.getUTCFullYear()].join("/")},n=e=>e?[e.split("/")[2],e.split("/")[1],e.split("/")[0]].join("-"):null},4708:(e,l,t)=>{t.r(l),t.d(l,{default:()=>Ce});var a=t(3673),o=t(1959),s=t(2323),n=t(8880),i=t(9582),r=t(2993),u=t(4781),d=t(4626),c=t(925),p=t(9236),m=function(e,l,t,a){function o(e){return e instanceof t?e:new t((function(l){l(e)}))}return new(t||(t=Promise))((function(t,s){function n(e){try{r(a.next(e))}catch(l){s(l)}}function i(e){try{r(a["throw"](e))}catch(l){s(l)}}function r(e){e.done?t(e.value):o(e.value).then(n,i)}r((a=a.apply(e,l||[])).next())}))};const v={key:0,class:"container"},_={class:"treasury-title"},w=(0,a._)("div",{class:"row justify-start"},[(0,a._)("h3",{class:"text-primary flow-title col-xs-12 col-sm-12"},"Ingreso por departamento para su Iglesia local")],-1),f={class:"row"},g={class:"col-xs-12 col-sm-7 col-md-5 col-lg-4"},h={class:"col-8"},y={class:"col-xs-4 col-sm-4 text-right"},b={class:"row justify-start"},x={class:"col-xs-12 col-sm-12"},k={class:"row justify-start"},q=(0,a._)("div",{class:"col-8"},[(0,a._)("strong",null,"Total:")],-1),U={class:"col-xs-4 col-sm-4 text-right"},D=(0,a._)("div",{class:"row justify-end"},[(0,a._)("h3",{class:"text-primary flow-title col-xs-12 col-sm-12"},"Ingreso por departamento para la Asociación")],-1),W={class:"row"},z={class:"col-xs-12 col-sm-7 col-md-5 col-lg-4"},S={class:"col-8"},j={class:"col-xs-4 col-sm-4 text-right"},T={class:"row justify-end"},Q={class:"col-xs-12 col-sm-12"},V={class:"row justify-end"},Z=(0,a._)("div",{class:"col-8"},[(0,a._)("strong",null,"Total:")],-1),C={class:"col-xs-4 col-sm-4 text-right"},F=(0,a._)("h3",{class:"text-primary flow-title"},"Estado del depósito",-1),H={class:"row q-col-gutter-sm"},I={class:"col-xs-12 col-sm-4"},$={class:"col-xs-12 col-sm-4"},N={class:"col-xs-12 col-sm-4"},Y={class:"row items-center justify-end"},B=(0,a._)("h3",{class:"text-primary flow-title q-pt-lg"},"Comprobante de pago",-1),P={class:"row q-col-gutter-sm"},A={class:"col"},E={class:"row no-wrap items-center q-pa-sm q-gutter-xs"},M={class:"col"},L=["href"],O={class:"q-uploader__subtitle"},K=(0,a.Uk)("Subir archivo"),R=(0,a.Uk)("Cancela subida"),G=(0,a._)("h3",{class:"text-primary flow-title"},"Gastos del mes de su Iglesia local",-1),J={class:"q-table-simple q-table__container q-table--horizontal-separator column no-wrap q-table--dense q-table--no-wrap"},X={class:"q-table treasury-table-data"},ee=(0,a._)("thead",null,[(0,a._)("tr",null,[(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Descripción")]),(0,a._)("th",{class:"text-left"},[(0,a._)("strong",null,"Datos de facturación")]),(0,a._)("th",{class:"text-right"},[(0,a._)("strong",null,"Valor")])])],-1),le={class:"text-left"},te={class:"treasury-departament"},ae={class:"text-left"},oe={class:"treasury-list-concepts"},se={key:0},ne=(0,a._)("strong",null,"Tipo de documento:",-1),ie={key:1},re=(0,a._)("strong",null,"Número de documento:",-1),ue={key:2},de=(0,a._)("strong",null,"Proveedor:",-1),ce={class:"text-right total"},pe=(0,a._)("th",{class:"text-left",colspan:"2"},[(0,a._)("strong",null,"Total")],-1),me={class:"text-right"},ve=(0,a.aZ)({setup(e){var l,t;const ve=(0,p.useStore)(),_e=null===(t=null===(l=ve.state.user)||void 0===l?void 0:l.user)||void 0===t?void 0:t.company.id,we=(0,o.iH)("local"),fe=(0,o.iH)([]),ge=(0,o.iH)([]),he=(0,o.iH)([]),ye=(0,o.iH)(),be=(0,o.iH)([]),xe=(0,o.iH)(0),ke=(0,o.iH)(),qe=(0,o.iH)(""),Ue=(0,i.yj)(),{entryId:De,expenseId:We}=Ue.params,ze=`${r.urlBase}entries/${De}/upload`,Se=[{name:"Authorization",value:`Bearer ${u.storage.get("token")}`}],je=()=>m(this,void 0,void 0,(function*(){yield r.http.put(`entries/${De}`,{totalDeposited:ke.value,dateDeposited:(0,c.Fv)(qe.value)})}));(0,a.YP)(ke,(()=>{je()})),(0,a.YP)(qe,(()=>{je()}));const Te=()=>m(this,void 0,void 0,(function*(){const e={type_treasury:"ENTRY",id_company:_e,year:ye.value.year,month:ye.value.month,type:"MONTH",order:"id_department",type_department:"GLOBAL"},l=yield r.http.get(r.http.convertQuery("flows",e));fe.value=l.rows})),Qe=()=>m(this,void 0,void 0,(function*(){const e={type_treasury:"ENTRY",id_company:_e,year:ye.value.year,month:ye.value.month,type:"MONTH",order:"id_department",type_department:"LOCAL"},l=yield r.http.get(r.http.convertQuery("flows",e));ge.value=l.rows}));function Ve(e){d.message.error(`${e.length} el/los archivo(s) no pasaron las restricciones de validación`)}function Ze(e){try{const l=JSON.parse(e.xhr.response);ye.value.voucherDeposited=l.data.filename}catch(l){}}const Ce=()=>m(this,void 0,void 0,(function*(){ye.value=yield r.http.get(`entries/${parseInt(De)}`),ke.value=ye.value.totalDeposited,qe.value=(0,c.WU)(ye.value.dateDeposited),be.value=(0,c.KS)(ye.value.year,ye.value.month);const e=yield r.http.get(`entriesdetails?id_entry=${ye.value.id}`),l={1:{total:0,local:0,global:0},2:{total:0,local:0,global:0},3:{total:0,local:0,global:0},4:{total:0,local:0,global:0},5:{total:0,local:0,global:0}};e.rows.forEach((e=>{l[e.week].global+=Number(e.value)})),xe.value=0,be.value.forEach((e=>{e.total=l[e.week].global,xe.value+=e.total}))})),Fe=()=>m(this,void 0,void 0,(function*(){const e=yield r.http.get(`expensesdetails?id_expense=${We}`);he.value=e.rows})),He=(0,o.Fl)((()=>{let e=0;return fe.value.forEach((l=>{e+=Number(l.total)})),e})),Ie=(0,o.Fl)((()=>{let e=0;return ge.value.forEach((l=>{e+=Number(l.total)})),e})),$e=(0,o.Fl)((()=>{let e=0;for(const l of he.value)e+=parseFloat(l.value);return e}));return(0,a.bv)((()=>m(this,void 0,void 0,(function*(){yield Ce(),yield Te(),yield Qe(),yield Fe()})))),(e,l)=>{const t=(0,a.up)("q-btn"),i=(0,a.up)("q-tab"),u=(0,a.up)("q-tabs"),d=(0,a.up)("q-separator"),p=(0,a.up)("q-tab-panel"),m=(0,a.up)("q-icon"),ve=(0,a.up)("q-input"),_e=(0,a.up)("q-date"),be=(0,a.up)("q-popup-proxy"),xe=(0,a.up)("q-spinner"),Ue=(0,a.up)("q-uploader-add-trigger"),Te=(0,a.up)("q-tooltip"),Qe=(0,a.up)("q-uploader"),Ce=(0,a.up)("q-form"),Fe=(0,a.up)("q-tab-panels"),Ne=(0,a.Q2)("close-popup");return ye.value?((0,a.wg)(),(0,a.iD)("div",v,[(0,a._)("h2",_,[(0,a.Wm)(t,{icon:"arrow_back",round:"",flat:"",onClick:l[0]||(l[0]=l=>e.$router.push(`/treasury/entryexpense/${(0,o.SU)(De)}/${(0,o.SU)(We)}`))}),(0,a.Uk)(" Informe mensual "+(0,s.zw)((0,o.SU)(c.e7)[ye.value.month-1]),1)]),(0,a.Wm)(u,{modelValue:we.value,"onUpdate:modelValue":l[1]||(l[1]=e=>we.value=e),"inline-label":"","outside-arrows":"","mobile-arrows":"",align:"left",dense:"","no-caps":"","indicator-color":"warning",class:"bg-primary text-white"},{default:(0,a.w5)((()=>[(0,a.Wm)(i,{name:"local",icon:"attach_money",label:"Ingresos Iglesia local"}),(0,a.Wm)(i,{name:"month",icon:"money_off",label:"Gastos Iglesia local"}),(0,a.Wm)(i,{name:"global",icon:"paid",label:"Ingresos Asociación"}),(0,a.Wm)(i,{name:"deposit",icon:"payments",label:"Depósito Asociación"})])),_:1},8,["modelValue"]),(0,a.Wm)(Fe,{modelValue:we.value,"onUpdate:modelValue":l[6]||(l[6]=e=>we.value=e),animated:"",swipeable:"",vertical:"","transition-prev":"jump-up","transition-next":"jump-up"},{default:(0,a.w5)((()=>[(0,a.Wm)(p,{name:"local"},{default:(0,a.w5)((()=>[w,(0,a._)("div",f,[(0,a._)("div",g,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(ge.value,(e=>((0,a.wg)(),(0,a.iD)("div",{key:e.id,class:"row justify-start"},[(0,a._)("div",h,(0,s.zw)(e.department.name),1),(0,a._)("div",y,(0,s.zw)((.9*e.total).toFixed(2))+" Bs.",1)])))),128)),(0,a._)("div",b,[(0,a._)("div",x,[(0,a.Wm)(d)])]),(0,a._)("div",k,[q,(0,a._)("div",U,[(0,a._)("strong",null,(0,s.zw)((.9*(0,o.SU)(Ie)).toFixed(2))+" Bs.",1)])])])])])),_:1}),(0,a.Wm)(p,{name:"global"},{default:(0,a.w5)((()=>[D,(0,a._)("div",W,[(0,a._)("div",z,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(fe.value,(e=>((0,a.wg)(),(0,a.iD)("div",{key:e.id,class:"row justify-end"},[(0,a._)("div",S,(0,s.zw)(e.department.name),1),(0,a._)("div",j,(0,s.zw)(Number(e.total).toFixed(2))+" Bs.",1)])))),128)),(0,a._)("div",T,[(0,a._)("div",Q,[(0,a.Wm)(d)])]),(0,a._)("div",V,[Z,(0,a._)("div",C,[(0,a._)("strong",null,(0,s.zw)((0,o.SU)(He).toFixed(2))+" Bs.",1)])])])])])),_:1}),(0,a.Wm)(p,{name:"deposit"},{default:(0,a.w5)((()=>[F,(0,a.Wm)(Ce,{onSubmit:(0,n.iM)(je,["prevent"])},{default:(0,a.w5)((()=>[(0,a._)("div",H,[(0,a._)("div",I,[(0,a.Wm)(ve,{filled:"",class:"text-right",suffix:"Bs.",label:"Total a depositar",modelValue:(0,o.SU)(He),"onUpdate:modelValue":l[2]||(l[2]=e=>(0,o.dq)(He)?He.value=e:null),readonly:""},{prepend:(0,a.w5)((()=>[(0,a.Wm)(m,{name:"attach_money"})])),_:1},8,["modelValue"])]),(0,a._)("div",$,[(0,a.Wm)(ve,{modelValue:ke.value,"onUpdate:modelValue":l[3]||(l[3]=e=>ke.value=e),filled:"",placeholder:"0",class:"text-right",label:"Total depositado",suffix:"Bs.",debounce:"1000"},{prepend:(0,a.w5)((()=>[(0,a.Wm)(m,{name:"attach_money"})])),_:1},8,["modelValue"])]),(0,a._)("div",N,[(0,a.Wm)(ve,{filled:"",label:"Fecha del depósito",modelValue:qe.value,"onUpdate:modelValue":l[5]||(l[5]=e=>qe.value=e),debounce:"1000",rules:[]},{append:(0,a.w5)((()=>[(0,a.Wm)(m,{name:"event",class:"cursor-pointer"},{default:(0,a.w5)((()=>[(0,a.Wm)(be,{ref:"birthdayDateProxy",cover:"","transition-show":"scale","transition-hide":"scale"},{default:(0,a.w5)((()=>[(0,a.Wm)(_e,{modelValue:qe.value,"onUpdate:modelValue":l[4]||(l[4]=e=>qe.value=e),minimal:"",mask:"DD/MM/YYYY"},{default:(0,a.w5)((()=>[(0,a._)("div",Y,[(0,a.wy)((0,a.Wm)(t,{label:"Cerrar",color:"primary",flat:""},null,512),[[Ne]])])])),_:1},8,["modelValue"])])),_:1},512)])),_:1})])),_:1},8,["modelValue"])])]),B,(0,a._)("div",P,[(0,a._)("div",A,[(0,a.Wm)(Qe,{url:ze,headers:Se,"field-name":"file",accept:".jpg, image/*, .pdf","max-file-size":5242880,"auto-upload":"",class:"full-width",onUploaded:Ze,onRejected:Ve},{header:(0,a.w5)((e=>[(0,a._)("div",E,[e.isUploading?((0,a.wg)(),(0,a.j4)(xe,{key:0,class:"q-uploader__spinner"})):(0,a.kq)("",!0),(0,a._)("div",M,[ye.value.voucherDeposited?((0,a.wg)(),(0,a.iD)("a",{key:0,class:"q-uploader__title text-white",href:`${(0,o.SU)(r.urlBase).replace(/\/api\//g,"")}/files/${ye.value.voucherDeposited}`,target:"blank"},[(0,a.Wm)(m,{name:"file_download"}),(0,a.Uk)(" "+(0,s.zw)(ye.value.voucherDeposited),1)],8,L)):(0,a.kq)("",!0),(0,a._)("div",O,(0,s.zw)(e.uploadSizeLabel)+" / "+(0,s.zw)(e.uploadProgressLabel),1)]),e.canAddFiles?((0,a.wg)(),(0,a.j4)(t,{key:1,type:"a","no-caps":"",color:"warning",icon:"add_box",dense:""},{default:(0,a.w5)((()=>[(0,a.Wm)(Ue),(0,a.Uk)(" "+(0,s.zw)(ye.value.voucherDeposited?"Cambiar archivo":"Seleccionar archivo")+" ",1),(0,a.Wm)(Te,null,{default:(0,a.w5)((()=>[(0,a.Uk)((0,s.zw)(ye.value.voucherDeposited?"Cambiar archivo":"Seleccionar archivo"),1)])),_:1})])),_:1})):(0,a.kq)("",!0),e.canUpload?((0,a.wg)(),(0,a.j4)(t,{key:2,icon:"cloud_upload",onClick:e.upload,round:"",dense:"",flat:""},{default:(0,a.w5)((()=>[(0,a.Wm)(Te,null,{default:(0,a.w5)((()=>[K])),_:1})])),_:2},1032,["onClick"])):(0,a.kq)("",!0),e.isUploading?((0,a.wg)(),(0,a.j4)(t,{key:3,icon:"clear",onClick:e.abort,round:"",dense:"",flat:""},{default:(0,a.w5)((()=>[(0,a.Wm)(Te,null,{default:(0,a.w5)((()=>[R])),_:1})])),_:2},1032,["onClick"])):(0,a.kq)("",!0)])])),_:1})])])])),_:1},8,["onSubmit"])])),_:1}),(0,a.Wm)(p,{name:"month"},{default:(0,a.w5)((()=>[G,(0,a._)("div",J,[(0,a._)("table",X,[ee,(0,a._)("tbody",null,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(he.value,(e=>((0,a.wg)(),(0,a.iD)("tr",{key:e.id},[(0,a._)("td",le,[(0,a.Uk)((0,s.zw)(e.concept)+" ",1),(0,a._)("strong",te,(0,s.zw)(e.department.name),1),(0,a._)("em",null,"Registrado el "+(0,s.zw)((0,o.SU)(c.WU)(e.date)),1)]),(0,a._)("td",ae,[(0,a._)("ul",oe,[e.document_type?((0,a.wg)(),(0,a.iD)("li",se,[ne,(0,a.Uk)(" "+(0,s.zw)(e.document_type),1)])):(0,a.kq)("",!0),e.document_number?((0,a.wg)(),(0,a.iD)("li",ie,[re,(0,a.Uk)(" "+(0,s.zw)(e.document_number),1)])):(0,a.kq)("",!0),e.supplier?((0,a.wg)(),(0,a.iD)("li",ue,[de,(0,a.Uk)(" "+(0,s.zw)(e.supplier),1)])):(0,a.kq)("",!0)])]),(0,a._)("td",ce,(0,s.zw)(Number(e.value).toFixed(2)),1)])))),128))]),(0,a._)("tfoot",null,[(0,a._)("tr",null,[pe,(0,a._)("th",me,[(0,a._)("strong",null,(0,s.zw)((0,o.SU)($e).toFixed(2)),1)])])])])])])),_:1})])),_:1},8,["modelValue"])])):(0,a.kq)("",!0)}}});var _e=t(8240),we=t(7547),fe=t(3269),ge=t(5906),he=t(6602),ye=t(5869),be=t(5269),xe=t(4842),ke=t(4554),qe=t(3944),Ue=t(6915),De=t(3768),We=t(9754),ze=t(1728),Se=t(8870),je=t(6429),Te=t(677),Qe=t(7518),Ve=t.n(Qe);const Ze=ve,Ce=Ze;Ve()(ve,"components",{QBtn:_e.Z,QTabs:we.Z,QTab:fe.Z,QTabPanels:ge.Z,QTabPanel:he.Z,QSeparator:ye.Z,QForm:be.Z,QInput:xe.Z,QIcon:ke.Z,QPopupProxy:qe.Z,QDate:Ue.Z,QUploader:De.Z,QSpinner:We.Z,QUploaderAddTrigger:ze.Z,QTooltip:Se.Z,QTable:je.Z}),Ve()(ve,"directives",{ClosePopup:Te.Z})}}]);