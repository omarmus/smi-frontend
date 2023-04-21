"use strict";(globalThis["webpackChunksmi_frontend"]=globalThis["webpackChunksmi_frontend"]||[]).push([[793],{3793:(e,a,t)=>{t.r(a),t.d(a,{default:()=>L});var l=t(3673),o=t(1959),n=t(2323),u=t(8825),s=t(4220),r=t(2993),i=t(4781),c=t(8339),d=t(9236),m=function(e,a,t,l){function o(e){return e instanceof t?e:new t((function(a){a(e)}))}return new(t||(t=Promise))((function(t,n){function u(e){try{r(l.next(e))}catch(a){n(a)}}function s(e){try{r(l["throw"](e))}catch(a){n(a)}}function r(e){e.done?t(e.value):o(e.value).then(u,s)}r((l=l.apply(e,a||[])).next())}))};const v={class:"layout-menu"},p={class:"personal q-ma-md"},w={class:"personal-datos"},f={class:"personal-name"},_={class:"personal-company"},k=(0,l.aZ)({__name:"Menu",setup(e){const a=(0,d.o)(),t=(0,c.tv)(),k=(0,u.Z)(),h=(0,o.iH)(k.dark.isActive),g=(0,o.iH)(),W=(0,o.iH)();function y(){h.value=!h.value,k.dark.set(!k.dark.isActive)}function q(){s.auth.logout("store")}return(0,l.YP)(g,(()=>m(this,void 0,void 0,(function*(){if("number"===typeof g.value){const e=yield r.http.get(`auth/token/${g.value}`);return i.storage.set("role",e.role),i.storage.set("menu",e.menu),i.storage.set("permissions",e.permissions),i.storage.set("token",e.token),s.auth.initStore(),t.push("/")}})))),(0,l.bv)((()=>{W.value=a.state.user.roles,g.value=a.state.user.role})),(e,a)=>{const t=(0,l.up)("q-icon"),o=(0,l.up)("q-avatar"),u=(0,l.up)("q-separator"),s=(0,l.up)("q-select"),r=(0,l.up)("q-item-section"),i=(0,l.up)("q-item"),c=(0,l.up)("q-list"),d=(0,l.up)("q-scroll-area"),m=(0,l.Q2)("ripple");return(0,l.wg)(),(0,l.j4)(d,{class:"fit"},{default:(0,l.w5)((()=>{var d,k,Z,b,Q,x;return[(0,l._)("div",v,[(0,l._)("h1",null,[(0,l.Wm)(t,{name:"church",class:"warning-light",size:"32px"}),(0,l.Uk)(" Secretaría & Tesorería ")])]),(0,l._)("div",p,[(0,l.Wm)(o,{size:"48px",color:"white"},{default:(0,l.w5)((()=>{var a,t,o;return[(0,l.Uk)((0,n.zw)(null===(o=null===(t=null===(a=e.$store.state.user)||void 0===a?void 0:a.user)||void 0===t?void 0:t.username)||void 0===o?void 0:o.substring(0,2).toUpperCase()),1)]})),_:1}),(0,l._)("div",w,[(0,l._)("div",f,(0,n.zw)(null===(k=null===(d=e.$store.state.user)||void 0===d?void 0:d.user)||void 0===k?void 0:k.fullname),1),(0,l._)("div",_,(0,n.zw)(null===(Q=null===(b=null===(Z=e.$store.state.user)||void 0===Z?void 0:Z.user)||void 0===b?void 0:b.company)||void 0===Q?void 0:Q.name),1)])]),(0,l.Wm)(u),(null===(x=W.value)||void 0===x?void 0:x.length)>1?((0,l.wg)(),(0,l.j4)(s,{key:0,square:"",standout:"",color:"teal",label:"Rol seleccionado",modelValue:g.value,"onUpdate:modelValue":a[0]||(a[0]=e=>g.value=e),options:W.value,"option-value":"id","option-label":"name","emit-value":"","map-options":"",dark:""},null,8,["modelValue","options"])):(0,l.kq)("",!0),(0,l.Wm)(u),(0,l.Wm)(c,{padding:"",class:"menu-list"},{default:(0,l.w5)((()=>{var o,n,u;return[-1===["TREASURER"].indexOf(null===(o=e.$store.state.user.role)||void 0===o?void 0:o.slug)?(0,l.wy)(((0,l.wg)(),(0,l.j4)(i,{key:0,onClick:a[1]||(a[1]=a=>e.$router.push("/secretary")),active:-1!==e.$route.path.indexOf("/secretary"),clickable:""},{default:(0,l.w5)((()=>[(0,l.Wm)(r,{avatar:"",class:"layout-menu-icon"},{default:(0,l.w5)((()=>[(0,l.Wm)(t,{name:"edit_note",class:"color-texto"})])),_:1}),(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.Uk)(" Secretaria ")])),_:1})])),_:1},8,["active"])),[[m]]):(0,l.kq)("",!0),-1===["SECRETARY"].indexOf(null===(u=null===(n=e.$store.state.user)||void 0===n?void 0:n.role)||void 0===u?void 0:u.slug)?(0,l.wy)(((0,l.wg)(),(0,l.j4)(i,{key:1,onClick:a[2]||(a[2]=a=>e.$router.push("/treasury")),active:-1!==e.$route.path.indexOf("/treasury"),clickable:""},{default:(0,l.w5)((()=>[(0,l.Wm)(r,{avatar:"",class:"layout-menu-icon"},{default:(0,l.w5)((()=>[(0,l.Wm)(t,{name:"monetization_on",class:"color-texto"})])),_:1}),(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.Uk)(" Tesorería ")])),_:1})])),_:1},8,["active"])),[[m]]):(0,l.kq)("",!0)]})),_:1}),(0,l.Wm)(u),(0,l.Wm)(c,{padding:"",class:"menu-list"},{default:(0,l.w5)((()=>[(0,l.wy)(((0,l.wg)(),(0,l.j4)(i,{onClick:y,clickable:""},{default:(0,l.w5)((()=>[(0,l.Wm)(r,{avatar:"",class:"layout-menu-icon"},{default:(0,l.w5)((()=>[(0,l.Wm)(t,{name:"dark_mode",class:"color-texto"})])),_:1}),(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.Uk)((0,n.zw)(h.value?"Desactivar modo oscuro":"Activar modo oscuro"),1)])),_:1})])),_:1})),[[m]]),(0,l.wy)(((0,l.wg)(),(0,l.j4)(i,{onClick:q,clickable:""},{default:(0,l.w5)((()=>[(0,l.Wm)(r,{avatar:"",class:"layout-menu-icon"},{default:(0,l.w5)((()=>[(0,l.Wm)(t,{name:"logout",class:"color-texto"})])),_:1}),(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.Uk)("Salir de sistema")])),_:1})])),_:1})),[[m]])])),_:1})]})),_:1})}}});var h=t(7704),g=t(4554),W=t(2165),y=t(5096),q=t(5869),Z=t(2448),b=t(7011),Q=t(3414),x=t(2035),S=t(6489),U=t(7518),C=t.n(U);const $=k,R=$;C()(k,"components",{QScrollArea:h.Z,QIcon:g.Z,QBtn:W.Z,QAvatar:y.Z,QSeparator:q.Z,QSelect:Z.Z,QList:b.Z,QItem:Q.Z,QItemSection:x.Z}),C()(k,"directives",{Ripple:S.Z});const j={__name:"MainLayout",setup(e){const a=(0,o.iH)(!1);function t(){a.value=!a.value}return(e,n)=>{const u=(0,l.up)("q-btn"),s=(0,l.up)("q-space"),r=(0,l.up)("q-toolbar"),i=(0,l.up)("q-header"),c=(0,l.up)("q-drawer"),d=(0,l.up)("router-view"),m=(0,l.up)("q-page-container"),v=(0,l.up)("q-layout");return(0,l.wg)(),(0,l.j4)(v,{view:"lHh lpR lFf"},{default:(0,l.w5)((()=>[(0,l.Wm)(i,{class:"q-header-main"},{default:(0,l.w5)((()=>[(0,l.Wm)(r,null,{default:(0,l.w5)((()=>[(0,l.Wm)(u,{flat:"",dense:"",round:"",class:"warning-light",icon:"menu","aria-label":"Menu",onClick:t}),(0,l.Wm)(s)])),_:1})])),_:1}),(0,l.Wm)(c,{"show-if-above":"",modelValue:a.value,"onUpdate:modelValue":n[0]||(n[0]=e=>a.value=e),side:"left",bordered:"",width:270,class:"sidebar"},{default:(0,l.w5)((()=>[(0,l.Wm)((0,o.SU)(R))])),_:1},8,["modelValue"]),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(d)])),_:1})])),_:1})}}};var z=t(9214),A=t(3812),T=t(9570),H=t(2025),V=t(2901),E=t(2652),I=t(1762);const O=j,L=O;C()(j,"components",{QLayout:z.Z,QHeader:A.Z,QToolbar:T.Z,QBtn:W.Z,QIcon:g.Z,QSpace:H.Z,QDrawer:V.Z,QPageContainer:E.Z,QFooter:I.Z})}}]);