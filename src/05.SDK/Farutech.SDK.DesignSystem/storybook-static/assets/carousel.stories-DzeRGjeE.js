import{o as e}from"./iframe-D4gg6Iw3.js";import{t}from"./react-uv-Ghkqr.js";import{t as n}from"./jsx-runtime-DNZ2e1fB.js";import"./dist-Cp-7oqJL.js";import{t as r}from"./createLucideIcon-B2lKdPjW.js";import{t as i}from"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import"./dist-DgzQp32D.js";import{t as a}from"./button-BwHpufzu.js";import{n as o,t as s}from"./card-C8VsPj8S.js";var c=r(`ArrowLeft`,[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]),l=r(`ArrowRight`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),u=t();function d(e){return Object.prototype.toString.call(e)===`[object Object]`}function f(e){return d(e)||Array.isArray(e)}function p(){return!!(typeof window<`u`&&window.document&&window.document.createElement)}function m(e,t){let n=Object.keys(e),r=Object.keys(t);return n.length!==r.length||JSON.stringify(Object.keys(e.breakpoints||{}))!==JSON.stringify(Object.keys(t.breakpoints||{}))?!1:n.every(n=>{let r=e[n],i=t[n];return typeof r==`function`?`${r}`==`${i}`:!f(r)||!f(i)?r===i:m(r,i)})}function h(e){return e.concat().sort((e,t)=>e.name>t.name?1:-1).map(e=>e.options)}function g(e,t){if(e.length!==t.length)return!1;let n=h(e),r=h(t);return n.every((e,t)=>{let n=r[t];return m(e,n)})}function _(e){return typeof e==`number`}function v(e){return typeof e==`string`}function y(e){return typeof e==`boolean`}function b(e){return Object.prototype.toString.call(e)===`[object Object]`}function x(e){return Math.abs(e)}function S(e){return Math.sign(e)}function C(e,t){return x(e-t)}function w(e,t){return e===0||t===0||x(e)<=x(t)?0:x(C(x(e),x(t))/e)}function T(e){return Math.round(e*100)/100}function E(e){return j(e).map(Number)}function D(e){return e[O(e)]}function O(e){return Math.max(0,e.length-1)}function k(e,t){return t===O(e)}function A(e,t=0){return Array.from(Array(e),(e,n)=>t+n)}function j(e){return Object.keys(e)}function ee(e,t){return[e,t].reduce((e,t)=>(j(t).forEach(n=>{let r=e[n],i=t[n];e[n]=b(r)&&b(i)?ee(r,i):i}),e),{})}function te(e,t){return t.MouseEvent!==void 0&&e instanceof t.MouseEvent}function ne(e,t){let n={start:r,center:i,end:a};function r(){return 0}function i(e){return a(e)/2}function a(e){return t-e}function o(r,i){return v(e)?n[e](r):e(t,r,i)}return{measure:o}}function re(){let e=[];function t(t,n,i,a={passive:!0}){let o;if(`addEventListener`in t)t.addEventListener(n,i,a),o=()=>t.removeEventListener(n,i,a);else{let e=t;e.addListener(i),o=()=>e.removeListener(i)}return e.push(o),r}function n(){e=e.filter(e=>e())}let r={add:t,clear:n};return r}function ie(e,t,n,r){let i=re(),a=1e3/60,o=null,s=0,c=0;function l(){i.add(e,`visibilitychange`,()=>{e.hidden&&m()})}function u(){p(),i.clear()}function d(e){if(!c)return;o||(o=e,n(),n());let i=e-o;for(o=e,s+=i;s>=a;)n(),s-=a;r(s/a),c&&=t.requestAnimationFrame(d)}function f(){c||=t.requestAnimationFrame(d)}function p(){t.cancelAnimationFrame(c),o=null,s=0,c=0}function m(){o=null,s=0}return{init:l,destroy:u,start:f,stop:p,update:n,render:r}}function ae(e,t){let n=t===`rtl`,r=e===`y`,i=r?`y`:`x`,a=r?`x`:`y`,o=!r&&n?-1:1,s=u(),c=d();function l(e){let{height:t,width:n}=e;return r?t:n}function u(){return r?`top`:n?`right`:`left`}function d(){return r?`bottom`:n?`left`:`right`}function f(e){return e*o}return{scroll:i,cross:a,startEdge:s,endEdge:c,measureSize:l,direction:f}}function M(e=0,t=0){let n=x(e-t);function r(t){return t<e}function i(e){return e>t}function a(e){return r(e)||i(e)}function o(n){return a(n)?r(n)?e:t:n}function s(e){return n?e-n*Math.ceil((e-t)/n):e}return{length:n,max:t,min:e,constrain:o,reachedAny:a,reachedMax:i,reachedMin:r,removeOffset:s}}function N(e,t,n){let{constrain:r}=M(0,e),i=e+1,a=o(t);function o(e){return n?x((i+e)%i):r(e)}function s(){return a}function c(e){return a=o(e),d}function l(e){return u().set(s()+e)}function u(){return N(e,s(),n)}let d={get:s,set:c,add:l,clone:u};return d}function oe(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v){let{cross:b,direction:T}=e,E=[`INPUT`,`SELECT`,`TEXTAREA`],D={passive:!1},O=re(),k=re(),A=M(50,225).constrain(p.measure(20)),j={mouse:300,touch:400},ee={mouse:500,touch:600},ne=m?43:25,ie=!1,ae=0,N=0,oe=!1,P=!1,se=!1,F=!1;function ce(e){if(!v)return;function n(t){(y(v)||v(e,t))&&pe(t)}let r=t;O.add(r,`dragstart`,e=>e.preventDefault(),D).add(r,`touchmove`,()=>void 0,D).add(r,`touchend`,()=>void 0).add(r,`touchstart`,n).add(r,`mousedown`,n).add(r,`touchcancel`,L).add(r,`contextmenu`,L).add(r,`click`,he,!0)}function le(){O.clear(),k.clear()}function ue(){let e=F?n:t;k.add(e,`touchmove`,me,D).add(e,`touchend`,L).add(e,`mousemove`,me,D).add(e,`mouseup`,L)}function de(e){let t=e.nodeName||``;return E.includes(t)}function I(){return(m?ee:j)[F?`mouse`:`touch`]}function fe(e,t){let n=d.add(S(e)*-1),r=u.byDistance(e,!m).distance;return m||x(e)<A?r:g&&t?r*.5:u.byIndex(n.get(),0).distance}function pe(e){let t=te(e,r);F=t,se=m&&t&&!e.buttons&&ie,ie=C(i.get(),o.get())>=2,!(t&&e.button!==0)&&(de(e.target)||(oe=!0,a.pointerDown(e),l.useFriction(0).useDuration(0),i.set(o),ue(),ae=a.readPoint(e),N=a.readPoint(e,b),f.emit(`pointerDown`)))}function me(e){if(!te(e,r)&&e.touches.length>=2)return L(e);let t=a.readPoint(e),n=a.readPoint(e,b),o=C(t,ae),c=C(n,N);if(!P&&!F&&(!e.cancelable||(P=o>c,!P)))return L(e);let u=a.pointerMove(e);o>h&&(se=!0),l.useFriction(.3).useDuration(.75),s.start(),i.add(T(u)),e.preventDefault()}function L(e){let t=u.byDistance(0,!1).index!==d.get(),n=a.pointerUp(e)*I(),r=fe(T(n),t),i=w(n,r),o=ne-10*i,s=_+i/50;P=!1,oe=!1,k.clear(),l.useDuration(o).useFriction(s),c.distance(r,!m),F=!1,f.emit(`pointerUp`)}function he(e){se&&=(e.stopPropagation(),e.preventDefault(),!1)}function ge(){return oe}return{init:ce,destroy:le,pointerDown:ge}}function P(e,t){let n,r;function i(e){return e.timeStamp}function a(n,r){let i=`client${(r||e.scroll)===`x`?`X`:`Y`}`;return(te(n,t)?n:n.touches[0])[i]}function o(e){return n=e,r=e,a(e)}function s(e){let t=a(e)-a(r),o=i(e)-i(n)>170;return r=e,o&&(n=e),t}function c(e){if(!n||!r)return 0;let t=a(r)-a(n),o=i(e)-i(n),s=i(e)-i(r)>170,c=t/o;return o&&!s&&x(c)>.1?c:0}return{pointerDown:o,pointerMove:s,pointerUp:c,readPoint:a}}function se(){function e(e){let{offsetTop:t,offsetLeft:n,offsetWidth:r,offsetHeight:i}=e;return{top:t,right:n+r,bottom:t+i,left:n,width:r,height:i}}return{measure:e}}function F(e){function t(t){return e*(t/100)}return{measure:t}}function ce(e,t,n,r,i,a,o){let s=[e].concat(r),c,l,u=[],d=!1;function f(e){return i.measureSize(o.measure(e))}function p(i){if(!a)return;l=f(e),u=r.map(f);function o(n){for(let a of n){if(d)return;let n=a.target===e,o=r.indexOf(a.target),s=n?l:u[o];if(x(f(n?e:r[o])-s)>=.5){i.reInit(),t.emit(`resize`);break}}}c=new ResizeObserver(e=>{(y(a)||a(i,e))&&o(e)}),n.requestAnimationFrame(()=>{s.forEach(e=>c.observe(e))})}function m(){d=!0,c&&c.disconnect()}return{init:p,destroy:m}}function le(e,t,n,r,i,a){let o=0,s=0,c=i,l=a,u=e.get(),d=0;function f(){let t=r.get()-e.get(),i=!c,a=0;return i?(o=0,n.set(r),e.set(r),a=t):(n.set(e),o+=t/c,o*=l,u+=o,e.add(o),a=u-d),s=S(a),d=u,C}function p(){return x(r.get()-t.get())<.001}function m(){return c}function h(){return s}function g(){return o}function _(){return y(i)}function v(){return b(a)}function y(e){return c=e,C}function b(e){return l=e,C}let C={direction:h,duration:m,velocity:g,seek:f,settled:p,useBaseFriction:v,useBaseDuration:_,useFriction:b,useDuration:y};return C}function ue(e,t,n,r,i){let a=i.measure(10),o=i.measure(50),s=M(.1,.99),c=!1;function l(){return!(c||!e.reachedAny(n.get())||!e.reachedAny(t.get()))}function u(i){if(!l())return;let c=x(e[e.reachedMin(t.get())?`min`:`max`]-t.get()),u=n.get()-t.get(),d=s.constrain(c/o);n.subtract(u*d),!i&&x(u)<a&&(n.set(e.constrain(n.get())),r.useDuration(25).useBaseFriction())}function d(e){c=!e}return{shouldConstrain:l,constrain:u,toggleActive:d}}function de(e,t,n,r,i){let a=M(-t+e,0),o=d(),s=u(),c=f();function l(e,t){return C(e,t)<=1}function u(){let e=o[0],t=D(o);return M(o.lastIndexOf(e),o.indexOf(t)+1)}function d(){return n.map((e,t)=>{let{min:r,max:i}=a,o=a.constrain(e),s=!t,c=k(n,t);return s?i:c||l(r,o)?r:l(i,o)?i:o}).map(e=>parseFloat(e.toFixed(3)))}function f(){if(t<=e+i)return[a.max];if(r===`keepSnaps`)return o;let{min:n,max:c}=s;return o.slice(n,c)}return{snapsContained:c,scrollContainLimit:s}}function I(e,t,n){let r=t[0];return{limit:M(n?r-e:D(t),r)}}function fe(e,t,n,r){let i=.1,{reachedMin:a,reachedMax:o}=M(t.min+i,t.max+i);function s(e){return e===1?o(n.get()):e===-1?a(n.get()):!1}function c(t){if(!s(t))return;let n=e*(t*-1);r.forEach(e=>e.add(n))}return{loop:c}}function pe(e){let{max:t,length:n}=e;function r(e){let r=e-t;return n?r/-n:0}return{get:r}}function me(e,t,n,r,i){let{startEdge:a,endEdge:o}=e,{groupSlides:s}=i,c=d().map(t.measure),l=f(),u=p();function d(){return s(r).map(e=>D(e)[o]-e[0][a]).map(x)}function f(){return r.map(e=>n[a]-e[a]).map(e=>-x(e))}function p(){return s(l).map(e=>e[0]).map((e,t)=>e+c[t])}return{snaps:l,snapsAligned:u}}function L(e,t,n,r,i,a){let{groupSlides:o}=i,{min:s,max:c}=r,l=u();function u(){let r=o(a),i=!e||t===`keepSnaps`;return n.length===1?[a]:i?r:r.slice(s,c).map((e,t,n)=>{let r=!t,i=k(n,t);return r?A(D(n[0])+1):i?A(O(a)-D(n)[0]+1,D(n)[0]):e})}return{slideRegistry:l}}function he(e,t,n,r,i){let{reachedAny:a,removeOffset:o,constrain:s}=r;function c(e){return e.concat().sort((e,t)=>x(e)-x(t))[0]}function l(n){let r=e?o(n):s(n),{index:i}=t.map((e,t)=>({diff:u(e-r,0),index:t})).sort((e,t)=>x(e.diff)-x(t.diff))[0];return{index:i,distance:r}}function u(t,r){let i=[t,t+n,t-n];if(!e)return t;if(!r)return c(i);let a=i.filter(e=>S(e)===r);return a.length?c(a):D(i)-n}function d(e,n){return{index:e,distance:u(t[e]-i.get(),n)}}function f(n,r){let o=i.get()+n,{index:s,distance:c}=l(o),d=!e&&a(o);return!r||d?{index:s,distance:n}:{index:s,distance:n+u(t[s]-c,0)}}return{byDistance:f,byIndex:d,shortcut:u}}function ge(e,t,n,r,i,a,o){function s(i){let s=i.distance,c=i.index!==t.get();a.add(s),s&&(r.duration()?e.start():(e.update(),e.render(1),e.update())),c&&(n.set(t.get()),t.set(i.index),o.emit(`select`))}function c(e,t){s(i.byDistance(e,t))}function l(e,n){let r=t.clone().set(e);s(i.byIndex(r.get(),n))}return{distance:c,index:l}}function _e(e,t,n,r,i,a,o,s){let c={passive:!0,capture:!0},l=0;function u(u){if(!s)return;function f(t){if(new Date().getTime()-l>10)return;o.emit(`slideFocusStart`),e.scrollLeft=0;let a=n.findIndex(e=>e.includes(t));_(a)&&(i.useDuration(0),r.index(a,0),o.emit(`slideFocus`))}a.add(document,`keydown`,d,!1),t.forEach((e,t)=>{a.add(e,`focus`,e=>{(y(s)||s(u,e))&&f(t)},c)})}function d(e){e.code===`Tab`&&(l=new Date().getTime())}return{init:u}}function ve(e){let t=e;function n(){return t}function r(e){t=o(e)}function i(e){t+=o(e)}function a(e){t-=o(e)}function o(e){return _(e)?e:e.get()}return{get:n,set:r,add:i,subtract:a}}function ye(e,t){let n=e.scroll===`x`?o:s,r=t.style,i=null,a=!1;function o(e){return`translate3d(${e}px,0px,0px)`}function s(e){return`translate3d(0px,${e}px,0px)`}function c(t){if(a)return;let o=T(e.direction(t));o!==i&&(r.transform=n(o),i=o)}function l(e){a=!e}function u(){a||(r.transform=``,t.getAttribute(`style`)||t.removeAttribute(`style`))}return{clear:u,to:c,toggleActive:l}}function be(e,t,n,r,i,a,o,s,c){let l=.5,u=E(i),d=E(i).reverse(),f=_().concat(v());function p(e,t){return e.reduce((e,t)=>e-i[t],t)}function m(e,t){return e.reduce((e,n)=>p(e,t)>0?e.concat([n]):e,[])}function h(e){return a.map((n,i)=>({start:n-r[i]+l+e,end:n+t-l+e}))}function g(t,r,i){let a=h(r);return t.map(t=>{let r=i?0:-n,o=i?n:0,l=i?`end`:`start`,u=a[t][l];return{index:t,loopPoint:u,slideLocation:ve(-1),translate:ye(e,c[t]),target:()=>s.get()>u?r:o}})}function _(){let e=o[0];return g(m(d,e),n,!1)}function v(){return g(m(u,t-o[0]-1),-n,!0)}function y(){return f.every(({index:e})=>p(u.filter(t=>t!==e),t)<=.1)}function b(){f.forEach(e=>{let{target:t,translate:n,slideLocation:r}=e,i=t();i!==r.get()&&(n.to(i),r.set(i))})}function x(){f.forEach(e=>e.translate.clear())}return{canLoop:y,clear:x,loop:b,loopPoints:f}}function xe(e,t,n){let r,i=!1;function a(a){if(!n)return;function o(e){for(let n of e)if(n.type===`childList`){a.reInit(),t.emit(`slidesChanged`);break}}r=new MutationObserver(e=>{i||(y(n)||n(a,e))&&o(e)}),r.observe(e,{childList:!0})}function o(){r&&r.disconnect(),i=!0}return{init:a,destroy:o}}function Se(e,t,n,r){let i={},a=null,o=null,s,c=!1;function l(){s=new IntersectionObserver(e=>{c||(e.forEach(e=>{let n=t.indexOf(e.target);i[n]=e}),a=null,o=null,n.emit(`slidesInView`))},{root:e.parentElement,threshold:r}),t.forEach(e=>s.observe(e))}function u(){s&&s.disconnect(),c=!0}function d(e){return j(i).reduce((t,n)=>{let r=parseInt(n),{isIntersecting:a}=i[r];return(e&&a||!e&&!a)&&t.push(r),t},[])}function f(e=!0){if(e&&a)return a;if(!e&&o)return o;let t=d(e);return e&&(a=t),e||(o=t),t}return{init:l,destroy:u,get:f}}function Ce(e,t,n,r,i,a){let{measureSize:o,startEdge:s,endEdge:c}=e,l=n[0]&&i,u=m(),d=h(),f=n.map(o),p=g();function m(){if(!l)return 0;let e=n[0];return x(t[s]-e[s])}function h(){if(!l)return 0;let e=a.getComputedStyle(D(r));return parseFloat(e.getPropertyValue(`margin-${c}`))}function g(){return n.map((e,t,n)=>{let r=!t,i=k(n,t);return r?f[t]+u:i?f[t]+d:n[t+1][s]-e[s]}).map(x)}return{slideSizes:f,slideSizesWithGaps:p,startGap:u,endGap:d}}function we(e,t,n,r,i,a,o,s,c){let{startEdge:l,endEdge:u,direction:d}=e,f=_(n);function p(e,t){return E(e).filter(e=>e%t===0).map(n=>e.slice(n,n+t))}function m(e){return e.length?E(e).reduce((n,f,p)=>{let m=D(n)||0,h=m===0,g=f===O(e),_=i[l]-a[m][l],v=i[l]-a[f][u],y=!r&&h?d(o):0,b=x(v-(!r&&g?d(s):0)-(_+y));return p&&b>t+c&&n.push(f),g&&n.push(e.length),n},[]).map((t,n,r)=>{let i=Math.max(r[n-1]||0);return e.slice(i,t)}):[]}function h(e){return f?p(e,n):m(e)}return{groupSlides:h}}function Te(e,t,n,r,i,a,o){let{align:s,axis:c,direction:l,startIndex:u,loop:d,duration:f,dragFree:p,dragThreshold:m,inViewThreshold:h,slidesToScroll:g,skipSnaps:_,containScroll:v,watchResize:y,watchSlides:b,watchDrag:x,watchFocus:S}=a,C=se(),w=C.measure(t),T=n.map(C.measure),k=ae(c,l),A=k.measureSize(w),j=F(A),ee=ne(s,A),te=!d&&!!v,{slideSizes:M,slideSizesWithGaps:Te,startGap:Ee,endGap:De}=Ce(k,w,T,n,d||!!v,i),Oe=we(k,A,g,d,w,T,Ee,De,2),{snaps:ke,snapsAligned:R}=me(k,ee,w,T,Oe),z=-D(ke)+D(Te),{snapsContained:B,scrollContainLimit:Ae}=de(A,z,R,v,2),V=te?B:R,{limit:H}=I(z,V,d),U=N(O(V),u,d),W=U.clone(),G=E(n),K=({dragHandler:e,scrollBody:t,scrollBounds:n,options:{loop:r}})=>{r||n.constrain(e.pointerDown()),t.seek()},je=({scrollBody:e,translate:t,location:n,offsetLocation:r,previousLocation:i,scrollLooper:a,slideLooper:o,dragHandler:s,animation:c,eventHandler:l,scrollBounds:u,options:{loop:d}},f)=>{let p=e.settled(),m=!u.shouldConstrain(),h=d?p:p&&m,g=h&&!s.pointerDown();g&&c.stop();let _=n.get()*f+i.get()*(1-f);r.set(_),d&&(a.loop(e.direction()),o.loop()),t.to(r.get()),g&&l.emit(`settle`),h||l.emit(`scroll`)},q=ie(r,i,()=>K(Be),e=>je(Be,e)),J=.68,Y=V[U.get()],X=ve(Y),Z=ve(Y),Q=ve(Y),$=ve(Y),Me=le(X,Q,Z,$,f,J),Ne=he(d,V,z,H,$),Pe=ge(q,U,W,Me,Ne,$,o),Fe=pe(H),Ie=re(),Le=Se(t,n,o,h),{slideRegistry:Re}=L(te,v,V,Ae,Oe,G),ze=_e(e,n,Re,Pe,Me,Ie,o,S),Be={ownerDocument:r,ownerWindow:i,eventHandler:o,containerRect:w,slideRects:T,animation:q,axis:k,dragHandler:oe(k,e,r,i,$,P(k,i),X,q,Pe,Me,Ne,U,o,j,p,m,_,J,x),eventStore:Ie,percentOfView:j,index:U,indexPrevious:W,limit:H,location:X,offsetLocation:Q,previousLocation:Z,options:a,resizeHandler:ce(t,o,i,n,k,y,C),scrollBody:Me,scrollBounds:ue(H,Q,$,Me,j),scrollLooper:fe(z,H,Q,[X,Q,Z,$]),scrollProgress:Fe,scrollSnapList:V.map(Fe.get),scrollSnaps:V,scrollTarget:Ne,scrollTo:Pe,slideLooper:be(k,A,z,M,Te,ke,V,Q,n),slideFocus:ze,slidesHandler:xe(t,o,b),slidesInView:Le,slideIndexes:G,slideRegistry:Re,slidesToScroll:Oe,target:$,translate:ye(k,t)};return Be}function Ee(){let e={},t;function n(e){t=e}function r(t){return e[t]||[]}function i(e){return r(e).forEach(n=>n(t,e)),c}function a(t,n){return e[t]=r(t).concat([n]),c}function o(t,n){return e[t]=r(t).filter(e=>e!==n),c}function s(){e={}}let c={init:n,emit:i,off:o,on:a,clear:s};return c}var De={align:`center`,axis:`x`,container:null,slides:null,containScroll:`trimSnaps`,direction:`ltr`,slidesToScroll:1,inViewThreshold:0,breakpoints:{},dragFree:!1,dragThreshold:10,loop:!1,skipSnaps:!1,duration:25,startIndex:0,active:!0,watchDrag:!0,watchResize:!0,watchSlides:!0,watchFocus:!0};function Oe(e){function t(e,t){return ee(e,t||{})}function n(n){let r=n.breakpoints||{};return t(n,j(r).filter(t=>e.matchMedia(t).matches).map(e=>r[e]).reduce((e,n)=>t(e,n),{}))}function r(t){return t.map(e=>j(e.breakpoints||{})).reduce((e,t)=>e.concat(t),[]).map(e.matchMedia)}return{mergeOptions:t,optionsAtMedia:n,optionsMediaQueries:r}}function ke(e){let t=[];function n(n,r){return t=r.filter(({options:t})=>e.optionsAtMedia(t).active!==!1),t.forEach(t=>t.init(n,e)),r.reduce((e,t)=>Object.assign(e,{[t.name]:t}),{})}function r(){t=t.filter(e=>e.destroy())}return{init:n,destroy:r}}function R(e,t,n){let r=e.ownerDocument,i=r.defaultView,a=Oe(i),o=ke(a),s=re(),c=Ee(),{mergeOptions:l,optionsAtMedia:u,optionsMediaQueries:d}=a,{on:f,off:p,emit:m}=c,h=O,g=!1,_,y=l(De,R.globalOptions),b=l(y),x=[],S,C,w;function T(){let{container:t,slides:n}=b;C=(v(t)?e.querySelector(t):t)||e.children[0];let r=v(n)?C.querySelectorAll(n):n;w=[].slice.call(r||C.children)}function E(t){let n=Te(e,C,w,r,i,t,c);return t.loop&&!n.slideLooper.canLoop()?E(Object.assign({},t,{loop:!1})):n}function D(e,t){g||(y=l(y,e),b=u(y),x=t||x,T(),_=E(b),d([y,...x.map(({options:e})=>e)]).forEach(e=>s.add(e,`change`,O)),b.active&&(_.translate.to(_.location.get()),_.animation.init(),_.slidesInView.init(),_.slideFocus.init(I),_.eventHandler.init(I),_.resizeHandler.init(I),_.slidesHandler.init(I),_.options.loop&&_.slideLooper.loop(),C.offsetParent&&w.length&&_.dragHandler.init(I),S=o.init(I,x)))}function O(e,t){let n=N();k(),D(l({startIndex:n},e),t),c.emit(`reInit`)}function k(){_.dragHandler.destroy(),_.eventStore.clear(),_.translate.clear(),_.slideLooper.clear(),_.resizeHandler.destroy(),_.slidesHandler.destroy(),_.slidesInView.destroy(),_.animation.destroy(),o.destroy(),s.clear()}function A(){g||(g=!0,s.clear(),k(),c.emit(`destroy`),c.clear())}function j(e,t,n){!b.active||g||(_.scrollBody.useBaseFriction().useDuration(t===!0?0:b.duration),_.scrollTo.index(e,n||0))}function ee(e){j(_.index.add(1).get(),e,-1)}function te(e){j(_.index.add(-1).get(),e,1)}function ne(){return _.index.add(1).get()!==N()}function ie(){return _.index.add(-1).get()!==N()}function ae(){return _.scrollSnapList}function M(){return _.scrollProgress.get(_.offsetLocation.get())}function N(){return _.index.get()}function oe(){return _.indexPrevious.get()}function P(){return _.slidesInView.get()}function se(){return _.slidesInView.get(!1)}function F(){return S}function ce(){return _}function le(){return e}function ue(){return C}function de(){return w}let I={canScrollNext:ne,canScrollPrev:ie,containerNode:ue,internalEngine:ce,destroy:A,off:p,on:f,emit:m,plugins:F,previousScrollSnap:oe,reInit:h,rootNode:le,scrollNext:ee,scrollPrev:te,scrollProgress:M,scrollSnapList:ae,scrollTo:j,selectedScrollSnap:N,slideNodes:de,slidesInView:P,slidesNotInView:se};return D(t,n),setTimeout(()=>c.emit(`init`),0),I}R.globalOptions=void 0;function z(e={},t=[]){let n=(0,u.useRef)(e),r=(0,u.useRef)(t),[i,a]=(0,u.useState)(),[o,s]=(0,u.useState)(),c=(0,u.useCallback)(()=>{i&&i.reInit(n.current,r.current)},[i]);return(0,u.useEffect)(()=>{m(n.current,e)||(n.current=e,c())},[e,c]),(0,u.useEffect)(()=>{g(r.current,t)||(r.current=t,c())},[t,c]),(0,u.useEffect)(()=>{if(p()&&o){R.globalOptions=z.globalOptions;let e=R(o,n.current,r.current);return a(e),()=>e.destroy()}else a(void 0)},[o,a]),[s,i]}z.globalOptions=void 0;var B=n(),Ae=u.createContext(null);function V(){let e=u.useContext(Ae);if(!e)throw Error(`useCarousel must be used within a <Carousel />`);return e}var H=u.forwardRef(({orientation:e=`horizontal`,opts:t,setApi:n,plugins:r,className:a,children:o,...s},c)=>{let[l,d]=z({...t,axis:e===`horizontal`?`x`:`y`},r),[f,p]=u.useState(!1),[m,h]=u.useState(!1),g=u.useCallback(e=>{e&&(p(e.canScrollPrev()),h(e.canScrollNext()))},[]),_=u.useCallback(()=>{d?.scrollPrev()},[d]),v=u.useCallback(()=>{d?.scrollNext()},[d]),y=u.useCallback(e=>{e.key===`ArrowLeft`?(e.preventDefault(),_()):e.key===`ArrowRight`&&(e.preventDefault(),v())},[_,v]);return u.useEffect(()=>{!d||!n||n(d)},[d,n]),u.useEffect(()=>{if(d)return g(d),d.on(`reInit`,g),d.on(`select`,g),()=>{d?.off(`select`,g)}},[d,g]),(0,B.jsx)(Ae.Provider,{value:{carouselRef:l,api:d,orientation:e||(t?.axis===`y`?`vertical`:`horizontal`),scrollPrev:_,scrollNext:v,canScrollPrev:f,canScrollNext:m},children:(0,B.jsx)(`div`,{ref:c,onKeyDownCapture:y,className:i(`relative`,a),role:`region`,"aria-roledescription":`carousel`,...s,children:o})})});H.displayName=`Carousel`;var U=u.forwardRef(({className:e,...t},n)=>{let{carouselRef:r,orientation:a}=V();return(0,B.jsx)(`div`,{ref:r,className:`overflow-hidden`,children:(0,B.jsx)(`div`,{ref:n,className:i(`flex`,a===`horizontal`?`h-full`:`flex-col`,e),...t})})});U.displayName=`CarouselContent`;var W=u.forwardRef(({className:e,...t},n)=>{let{orientation:r}=V();return(0,B.jsx)(`div`,{ref:n,role:`group`,"aria-roledescription":`slide`,className:i(`min-w-0 shrink-0 grow-0 basis-full`,r===`horizontal`?`pl-4`:`pt-4`,e),...t})});W.displayName=`CarouselItem`;var G=u.forwardRef(({className:e,variant:t=`outline`,size:n=`icon`,...r},o)=>{let{orientation:s,scrollPrev:l,canScrollPrev:u}=V();return(0,B.jsxs)(a,{ref:o,variant:t,size:n,className:i(`absolute h-8 w-8 rounded-full`,s===`horizontal`?`-left-12 top-1/2 -translate-y-1/2`:`-top-12 left-1/2 -translate-x-1/2 rotate-90`,e),disabled:!u,onClick:l,...r,children:[(0,B.jsx)(c,{className:`h-4 w-4`}),(0,B.jsx)(`span`,{className:`sr-only`,children:`Previous slide`})]})});G.displayName=`CarouselPrevious`;var K=u.forwardRef(({className:e,variant:t=`outline`,size:n=`icon`,...r},o)=>{let{orientation:s,scrollNext:c,canScrollNext:u}=V();return(0,B.jsxs)(a,{ref:o,variant:t,size:n,className:i(`absolute h-8 w-8 rounded-full`,s===`horizontal`?`-right-12 top-1/2 -translate-y-1/2`:`-bottom-12 left-1/2 -translate-x-1/2 rotate-90`,e),disabled:!u,onClick:c,...r,children:[(0,B.jsx)(l,{className:`h-4 w-4`}),(0,B.jsx)(`span`,{className:`sr-only`,children:`Next slide`})]})});K.displayName=`CarouselNext`;try{H.displayName=`Carousel`,H.__docgenInfo={description:``,displayName:`Carousel`,props:{opts:{defaultValue:null,description:``,name:`opts`,required:!1,type:{name:`Partial<OptionsType>`}},plugins:{defaultValue:null,description:``,name:`plugins`,required:!1,type:{name:`CreatePluginType<LoosePluginType, {}>[]`}},orientation:{defaultValue:{value:`horizontal`},description:``,name:`orientation`,required:!1,type:{name:`enum`,value:[{value:`"horizontal"`},{value:`"vertical"`}]}},setApi:{defaultValue:null,description:``,name:`setApi`,required:!1,type:{name:`(api: EmblaCarouselType) => void`}}}}}catch{}try{U.displayName=`CarouselContent`,U.__docgenInfo={description:``,displayName:`CarouselContent`,props:{}}}catch{}try{W.displayName=`CarouselItem`,W.__docgenInfo={description:``,displayName:`CarouselItem`,props:{}}}catch{}try{G.displayName=`CarouselPrevious`,G.__docgenInfo={description:``,displayName:`CarouselPrevious`,props:{variant:{defaultValue:{value:`outline`},description:``,name:`variant`,required:!1,type:{name:`enum`,value:[{value:`"default"`},{value:`"destructive"`},{value:`"outline"`},{value:`"secondary"`},{value:`"ghost"`},{value:`"link"`}]}},size:{defaultValue:{value:`icon`},description:``,name:`size`,required:!1,type:{name:`enum`,value:[{value:`"default"`},{value:`"sm"`},{value:`"lg"`},{value:`"icon"`}]}},asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}try{K.displayName=`CarouselNext`,K.__docgenInfo={description:``,displayName:`CarouselNext`,props:{variant:{defaultValue:{value:`outline`},description:``,name:`variant`,required:!1,type:{name:`enum`,value:[{value:`"default"`},{value:`"destructive"`},{value:`"outline"`},{value:`"secondary"`},{value:`"ghost"`},{value:`"link"`}]}},size:{defaultValue:{value:`icon`},description:``,name:`size`,required:!1,type:{name:`enum`,value:[{value:`"default"`},{value:`"sm"`},{value:`"lg"`},{value:`"icon"`}]}},asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}var je={title:`UI/Carousel`,component:H,parameters:{layout:`centered`},tags:[`autodocs`]};const q={render:()=>(0,B.jsxs)(H,{className:`w-full max-w-xs`,children:[(0,B.jsx)(U,{children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-4xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})},J={render:()=>(0,B.jsxs)(`div`,{className:`space-y-8`,children:[(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`h3`,{className:`text-lg font-semibold mb-4`,children:`Small Carousel`}),(0,B.jsxs)(H,{className:`w-full max-w-sm`,children:[(0,B.jsx)(U,{children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{className:`md:basis-1/2 lg:basis-1/3`,children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-2xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})]}),(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`h3`,{className:`text-lg font-semibold mb-4`,children:`Medium Carousel`}),(0,B.jsxs)(H,{className:`w-full max-w-md`,children:[(0,B.jsx)(U,{children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{className:`md:basis-1/2 lg:basis-1/3`,children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-3xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})]}),(0,B.jsxs)(`div`,{children:[(0,B.jsx)(`h3`,{className:`text-lg font-semibold mb-4`,children:`Large Carousel`}),(0,B.jsxs)(H,{className:`w-full max-w-lg`,children:[(0,B.jsx)(U,{children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{className:`md:basis-1/2 lg:basis-1/3`,children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-4xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})]})]})},Y={render:()=>(0,B.jsxs)(H,{orientation:`vertical`,className:`w-full max-w-xs`,opts:{align:`start`},children:[(0,B.jsx)(U,{className:`-mt-1 h-[200px]`,children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{className:`pt-1 md:basis-1/2`,children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-2xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})},X={render:()=>(0,B.jsxs)(H,{className:`w-full max-w-2xl`,children:[(0,B.jsxs)(U,{children:[(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsxs)(o,{className:`flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4`,children:[(0,B.jsx)(`h3`,{className:`text-xl font-semibold`,children:`Welcome`}),(0,B.jsx)(`p`,{className:`text-center text-muted-foreground`,children:`Discover our amazing features and capabilities.`})]})})})}),(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsxs)(o,{className:`flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4`,children:[(0,B.jsx)(`h3`,{className:`text-xl font-semibold`,children:`Powerful`}),(0,B.jsx)(`p`,{className:`text-center text-muted-foreground`,children:`Built with modern technologies for optimal performance.`})]})})})}),(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsxs)(o,{className:`flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4`,children:[(0,B.jsx)(`h3`,{className:`text-xl font-semibold`,children:`Accessible`}),(0,B.jsx)(`p`,{className:`text-center text-muted-foreground`,children:`Designed with accessibility in mind for all users.`})]})})})}),(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsxs)(o,{className:`flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4`,children:[(0,B.jsx)(`h3`,{className:`text-xl font-semibold`,children:`Customizable`}),(0,B.jsx)(`p`,{className:`text-center text-muted-foreground`,children:`Easily customize to match your brand and needs.`})]})})})})]}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})},Z={render:()=>(0,B.jsxs)(H,{className:`w-full max-w-xs`,opts:{loop:!0},plugins:[],children:[(0,B.jsx)(U,{children:Array.from({length:5}).map((e,t)=>(0,B.jsx)(W,{children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-4xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})},Q={render:()=>(0,B.jsxs)(H,{className:`w-full max-w-4xl`,opts:{align:`start`},children:[(0,B.jsx)(U,{children:Array.from({length:10}).map((e,t)=>(0,B.jsx)(W,{className:`md:basis-1/2 lg:basis-1/3`,children:(0,B.jsx)(`div`,{className:`p-1`,children:(0,B.jsx)(s,{children:(0,B.jsx)(o,{className:`flex aspect-square items-center justify-center p-6`,children:(0,B.jsx)(`span`,{className:`text-2xl font-semibold`,children:t+1})})})})},t))}),(0,B.jsx)(G,{}),(0,B.jsx)(K,{})]})};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-xs">\r
      <CarouselContent>\r
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index}>\r
            <div className="p-1">\r
              <Card>\r
                <CardContent className="flex aspect-square items-center justify-center p-6">\r
                  <span className="text-4xl font-semibold">{index + 1}</span>\r
                </CardContent>\r
              </Card>\r
            </div>\r
          </CarouselItem>)}\r
      </CarouselContent>\r
      <CarouselPrevious />\r
      <CarouselNext />\r
    </Carousel>
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">\r
      <div>\r
        <h3 className="text-lg font-semibold mb-4">Small Carousel</h3>\r
        <Carousel className="w-full max-w-sm">\r
          <CarouselContent>\r
            {Array.from({
            length: 5
          }).map((_, index) => <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">\r
                <div className="p-1">\r
                  <Card>\r
                    <CardContent className="flex aspect-square items-center justify-center p-6">\r
                      <span className="text-2xl font-semibold">{index + 1}</span>\r
                    </CardContent>\r
                  </Card>\r
                </div>\r
              </CarouselItem>)}\r
          </CarouselContent>\r
          <CarouselPrevious />\r
          <CarouselNext />\r
        </Carousel>\r
      </div>\r
\r
      <div>\r
        <h3 className="text-lg font-semibold mb-4">Medium Carousel</h3>\r
        <Carousel className="w-full max-w-md">\r
          <CarouselContent>\r
            {Array.from({
            length: 5
          }).map((_, index) => <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">\r
                <div className="p-1">\r
                  <Card>\r
                    <CardContent className="flex aspect-square items-center justify-center p-6">\r
                      <span className="text-3xl font-semibold">{index + 1}</span>\r
                    </CardContent>\r
                  </Card>\r
                </div>\r
              </CarouselItem>)}\r
          </CarouselContent>\r
          <CarouselPrevious />\r
          <CarouselNext />\r
        </Carousel>\r
      </div>\r
\r
      <div>\r
        <h3 className="text-lg font-semibold mb-4">Large Carousel</h3>\r
        <Carousel className="w-full max-w-lg">\r
          <CarouselContent>\r
            {Array.from({
            length: 5
          }).map((_, index) => <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">\r
                <div className="p-1">\r
                  <Card>\r
                    <CardContent className="flex aspect-square items-center justify-center p-6">\r
                      <span className="text-4xl font-semibold">{index + 1}</span>\r
                    </CardContent>\r
                  </Card>\r
                </div>\r
              </CarouselItem>)}\r
          </CarouselContent>\r
          <CarouselPrevious />\r
          <CarouselNext />\r
        </Carousel>\r
      </div>\r
    </div>
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel orientation="vertical" className="w-full max-w-xs" opts={{
    align: 'start'
  }}>\r
      <CarouselContent className="-mt-1 h-[200px]">\r
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index} className="pt-1 md:basis-1/2">\r
            <div className="p-1">\r
              <Card>\r
                <CardContent className="flex items-center justify-center p-6">\r
                  <span className="text-2xl font-semibold">{index + 1}</span>\r
                </CardContent>\r
              </Card>\r
            </div>\r
          </CarouselItem>)}\r
      </CarouselContent>\r
      <CarouselPrevious />\r
      <CarouselNext />\r
    </Carousel>
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-2xl">\r
      <CarouselContent>\r
        <CarouselItem>\r
          <div className="p-1">\r
            <Card>\r
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">\r
                <h3 className="text-xl font-semibold">Welcome</h3>\r
                <p className="text-center text-muted-foreground">\r
                  Discover our amazing features and capabilities.\r
                </p>\r
              </CardContent>\r
            </Card>\r
          </div>\r
        </CarouselItem>\r
        <CarouselItem>\r
          <div className="p-1">\r
            <Card>\r
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">\r
                <h3 className="text-xl font-semibold">Powerful</h3>\r
                <p className="text-center text-muted-foreground">\r
                  Built with modern technologies for optimal performance.\r
                </p>\r
              </CardContent>\r
            </Card>\r
          </div>\r
        </CarouselItem>\r
        <CarouselItem>\r
          <div className="p-1">\r
            <Card>\r
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">\r
                <h3 className="text-xl font-semibold">Accessible</h3>\r
                <p className="text-center text-muted-foreground">\r
                  Designed with accessibility in mind for all users.\r
                </p>\r
              </CardContent>\r
            </Card>\r
          </div>\r
        </CarouselItem>\r
        <CarouselItem>\r
          <div className="p-1">\r
            <Card>\r
              <CardContent className="flex flex-col aspect-[4/3] items-center justify-center p-6 space-y-4">\r
                <h3 className="text-xl font-semibold">Customizable</h3>\r
                <p className="text-center text-muted-foreground">\r
                  Easily customize to match your brand and needs.\r
                </p>\r
              </CardContent>\r
            </Card>\r
          </div>\r
        </CarouselItem>\r
      </CarouselContent>\r
      <CarouselPrevious />\r
      <CarouselNext />\r
    </Carousel>
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-xs" opts={{
    loop: true
  }} plugins={[
    // Note: Autoplay plugin would need to be installed and imported
    // Autoplay({ delay: 2000 })
  ]}>\r
      <CarouselContent>\r
        {Array.from({
        length: 5
      }).map((_, index) => <CarouselItem key={index}>\r
            <div className="p-1">\r
              <Card>\r
                <CardContent className="flex aspect-square items-center justify-center p-6">\r
                  <span className="text-4xl font-semibold">{index + 1}</span>\r
                </CardContent>\r
              </Card>\r
            </div>\r
          </CarouselItem>)}\r
      </CarouselContent>\r
      <CarouselPrevious />\r
      <CarouselNext />\r
    </Carousel>
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <Carousel className="w-full max-w-4xl" opts={{
    align: 'start'
  }}>\r
      <CarouselContent>\r
        {Array.from({
        length: 10
      }).map((_, index) => <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">\r
            <div className="p-1">\r
              <Card>\r
                <CardContent className="flex aspect-square items-center justify-center p-6">\r
                  <span className="text-2xl font-semibold">{index + 1}</span>\r
                </CardContent>\r
              </Card>\r
            </div>\r
          </CarouselItem>)}\r
      </CarouselContent>\r
      <CarouselPrevious />\r
      <CarouselNext />\r
    </Carousel>
}`,...Q.parameters?.docs?.source}}};const $=[`Default`,`Sizes`,`Vertical`,`WithContent`,`Autoplay`,`MultipleItems`];export{Z as Autoplay,q as Default,Q as MultipleItems,J as Sizes,Y as Vertical,X as WithContent,$ as __namedExportsOrder,je as default};