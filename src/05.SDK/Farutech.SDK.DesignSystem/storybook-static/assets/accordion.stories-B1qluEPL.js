import{o as e}from"./iframe-D4gg6Iw3.js";import{t}from"./react-uv-Ghkqr.js";import{t as n}from"./jsx-runtime-DNZ2e1fB.js";import"./react-dom-CsrWfbrJ.js";import{n as r}from"./dist-Bgd7CuJZ.js";import{n as i}from"./dist-Cp-7oqJL.js";import{t as a}from"./dist-CSg34EEP.js";import{r as o,t as s}from"./dist-lQwzu1EI.js";import"./dist-BuAqTJkv.js";import{t as c}from"./dist-3YYKyc0D.js";import"./dist-DJBgKmjy.js";import{t as l}from"./dist-nwF1eD0n.js";import{a as u,i as d,o as f,r as p}from"./dist-B30tAWKo.js";import{t as m}from"./dist-VN4p9mL0.js";import"./createLucideIcon-B2lKdPjW.js";import{t as ee}from"./chevron-down-BZCsKJrV.js";import{t as h}from"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import{t as g}from"./badge-BXYXjPVW.js";var _=e(t(),1),v=n(),y=`Accordion`,te=[`Home`,`End`,`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`],[b,x,S]=a(y),[C,ne]=r(y,[S,f]),w=f(),T=_.forwardRef((e,t)=>{let{type:n,...r}=e,i=r,a=r;return(0,v.jsx)(b.Provider,{scope:e.__scopeAccordion,children:n===`multiple`?(0,v.jsx)(O,{...a,ref:t}):(0,v.jsx)(ae,{...i,ref:t})})});T.displayName=y;var[E,re]=C(y),[D,ie]=C(y,{collapsible:!1}),ae=_.forwardRef((e,t)=>{let{value:n,defaultValue:r,onValueChange:i=()=>{},collapsible:a=!1,...o}=e,[s,l]=c({prop:n,defaultProp:r??``,onChange:i,caller:y});return(0,v.jsx)(E,{scope:e.__scopeAccordion,value:_.useMemo(()=>s?[s]:[],[s]),onItemOpen:l,onItemClose:_.useCallback(()=>a&&l(``),[a,l]),children:(0,v.jsx)(D,{scope:e.__scopeAccordion,collapsible:a,children:(0,v.jsx)(j,{...o,ref:t})})})}),O=_.forwardRef((e,t)=>{let{value:n,defaultValue:r,onValueChange:i=()=>{},...a}=e,[o,s]=c({prop:n,defaultProp:r??[],onChange:i,caller:y}),l=_.useCallback(e=>s((t=[])=>[...t,e]),[s]),u=_.useCallback(e=>s((t=[])=>t.filter(t=>t!==e)),[s]);return(0,v.jsx)(E,{scope:e.__scopeAccordion,value:o,onItemOpen:l,onItemClose:u,children:(0,v.jsx)(D,{scope:e.__scopeAccordion,collapsible:!0,children:(0,v.jsx)(j,{...a,ref:t})})})}),[k,A]=C(y),j=_.forwardRef((e,t)=>{let{__scopeAccordion:n,disabled:r,dir:a,orientation:c=`vertical`,...l}=e,u=i(_.useRef(null),t),d=x(n),f=m(a)===`ltr`,p=o(e.onKeyDown,e=>{if(!te.includes(e.key))return;let t=e.target,n=d().filter(e=>!e.ref.current?.disabled),r=n.findIndex(e=>e.ref.current===t),i=n.length;if(r===-1)return;e.preventDefault();let a=r,o=i-1,s=()=>{a=r+1,a>o&&(a=0)},l=()=>{a=r-1,a<0&&(a=o)};switch(e.key){case`Home`:a=0;break;case`End`:a=o;break;case`ArrowRight`:c===`horizontal`&&(f?s():l());break;case`ArrowDown`:c===`vertical`&&s();break;case`ArrowLeft`:c===`horizontal`&&(f?l():s());break;case`ArrowUp`:c===`vertical`&&l();break}n[a%i].ref.current?.focus()});return(0,v.jsx)(k,{scope:n,disabled:r,direction:a,orientation:c,children:(0,v.jsx)(b.Slot,{scope:n,children:(0,v.jsx)(s.div,{...l,"data-orientation":c,ref:u,onKeyDown:r?void 0:p})})})}),M=`AccordionItem`,[N,P]=C(M),F=_.forwardRef((e,t)=>{let{__scopeAccordion:n,value:r,...i}=e,a=A(M,n),o=re(M,n),s=w(n),c=l(),u=r&&o.value.includes(r)||!1,f=a.disabled||e.disabled;return(0,v.jsx)(N,{scope:n,open:u,disabled:f,triggerId:c,children:(0,v.jsx)(d,{"data-orientation":a.orientation,"data-state":H(u),...s,...i,ref:t,disabled:f,open:u,onOpenChange:e=>{e?o.onItemOpen(r):o.onItemClose(r)}})})});F.displayName=M;var I=`AccordionHeader`,L=_.forwardRef((e,t)=>{let{__scopeAccordion:n,...r}=e,i=A(y,n),a=P(I,n);return(0,v.jsx)(s.h3,{"data-orientation":i.orientation,"data-state":H(a.open),"data-disabled":a.disabled?``:void 0,...r,ref:t})});L.displayName=I;var R=`AccordionTrigger`,z=_.forwardRef((e,t)=>{let{__scopeAccordion:n,...r}=e,i=A(y,n),a=P(R,n),o=ie(R,n),s=w(n);return(0,v.jsx)(b.ItemSlot,{scope:n,children:(0,v.jsx)(u,{"aria-disabled":a.open&&!o.collapsible||void 0,"data-orientation":i.orientation,id:a.triggerId,...s,...r,ref:t})})});z.displayName=R;var B=`AccordionContent`,V=_.forwardRef((e,t)=>{let{__scopeAccordion:n,...r}=e,i=A(y,n),a=P(B,n),o=w(n);return(0,v.jsx)(p,{role:`region`,"aria-labelledby":a.triggerId,"data-orientation":i.orientation,...o,...r,ref:t,style:{"--radix-accordion-content-height":`var(--radix-collapsible-content-height)`,"--radix-accordion-content-width":`var(--radix-collapsible-content-width)`,...e.style}})});V.displayName=B;function H(e){return e?`open`:`closed`}var oe=T,se=F,ce=L,U=z,W=V,G=oe,K=_.forwardRef(({className:e,...t},n)=>(0,v.jsx)(se,{ref:n,className:h(`border-b`,e),...t}));K.displayName=`AccordionItem`;var q=_.forwardRef(({className:e,children:t,...n},r)=>(0,v.jsx)(ce,{className:`flex`,children:(0,v.jsxs)(U,{ref:r,className:h(`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180`,e),...n,children:[t,(0,v.jsx)(ee,{className:`h-4 w-4 shrink-0 transition-transform duration-200`})]})}));q.displayName=U.displayName;var J=_.forwardRef(({className:e,children:t,...n},r)=>(0,v.jsx)(W,{ref:r,className:`overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down`,...n,children:(0,v.jsx)(`div`,{className:h(`pb-4 pt-0`,e),children:t})}));J.displayName=W.displayName;try{K.displayName=`AccordionItem`,K.__docgenInfo={description:``,displayName:`AccordionItem`,props:{}}}catch{}try{q.displayName=`AccordionTrigger`,q.__docgenInfo={description:``,displayName:`AccordionTrigger`,props:{}}}catch{}try{J.displayName=`AccordionContent`,J.__docgenInfo={description:``,displayName:`AccordionContent`,props:{}}}catch{}var le={title:`UI/Accordion`,component:G,parameters:{layout:`centered`},tags:[`autodocs`]};const Y={args:{type:`single`,collapsible:!0},render:e=>(0,v.jsxs)(G,{...e,className:`w-[400px]`,children:[(0,v.jsxs)(K,{value:`item-1`,children:[(0,v.jsx)(q,{children:`Is it accessible?`}),(0,v.jsx)(J,{children:`Yes. It adheres to the WAI-ARIA design pattern.`})]}),(0,v.jsxs)(K,{value:`item-2`,children:[(0,v.jsx)(q,{children:`Is it styled?`}),(0,v.jsx)(J,{children:`Yes. It comes with default styles that match the other components' aesthetic.`})]}),(0,v.jsxs)(K,{value:`item-3`,children:[(0,v.jsx)(q,{children:`Is it animated?`}),(0,v.jsx)(J,{children:`Yes. It's animated by default, but you can disable it if you prefer.`})]})]})},X={args:{type:`multiple`},render:e=>(0,v.jsxs)(G,{...e,className:`w-[400px]`,children:[(0,v.jsxs)(K,{value:`item-1`,children:[(0,v.jsx)(q,{children:`What is React?`}),(0,v.jsx)(J,{children:`React is a JavaScript library for building user interfaces.`})]}),(0,v.jsxs)(K,{value:`item-2`,children:[(0,v.jsx)(q,{children:`What is TypeScript?`}),(0,v.jsx)(J,{children:`TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.`})]}),(0,v.jsxs)(K,{value:`item-3`,children:[(0,v.jsx)(q,{children:`What is Tailwind CSS?`}),(0,v.jsx)(J,{children:`Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.`})]})]})},Z={args:{},render:()=>(0,v.jsxs)(G,{type:`single`,collapsible:!0,className:`w-[400px]`,children:[(0,v.jsxs)(K,{value:`item-1`,children:[(0,v.jsx)(q,{children:(0,v.jsxs)(`div`,{className:`flex items-center justify-between w-full mr-4`,children:[(0,v.jsx)(`span`,{children:`Notifications`}),(0,v.jsx)(g,{variant:`secondary`,children:`3`})]})}),(0,v.jsx)(J,{children:`You have 3 unread notifications. Check them out in your dashboard.`})]}),(0,v.jsxs)(K,{value:`item-2`,children:[(0,v.jsx)(q,{children:(0,v.jsxs)(`div`,{className:`flex items-center justify-between w-full mr-4`,children:[(0,v.jsx)(`span`,{children:`Messages`}),(0,v.jsx)(g,{variant:`destructive`,children:`12`})]})}),(0,v.jsx)(J,{children:`You have 12 unread messages from your team members.`})]}),(0,v.jsxs)(K,{value:`item-3`,children:[(0,v.jsx)(q,{children:(0,v.jsxs)(`div`,{className:`flex items-center justify-between w-full mr-4`,children:[(0,v.jsx)(`span`,{children:`Tasks`}),(0,v.jsx)(g,{variant:`outline`,children:`5`})]})}),(0,v.jsx)(J,{children:`You have 5 pending tasks that need your attention.`})]})]})},Q={args:{},render:()=>(0,v.jsxs)(G,{type:`single`,collapsible:!0,className:`w-[600px]`,children:[(0,v.jsxs)(K,{value:`item-1`,children:[(0,v.jsx)(q,{children:`How do I get started?`}),(0,v.jsx)(J,{children:`Getting started is easy! First, install the design system package, then import the components you need. Check out our documentation for detailed instructions.`})]}),(0,v.jsxs)(K,{value:`item-2`,children:[(0,v.jsx)(q,{children:`Can I customize the components?`}),(0,v.jsx)(J,{children:`Absolutely! All components support customization through props, CSS classes, and CSS variables. You can modify colors, spacing, typography, and more to match your brand.`})]}),(0,v.jsxs)(K,{value:`item-3`,children:[(0,v.jsx)(q,{children:`Is it accessible?`}),(0,v.jsx)(J,{children:`Yes, accessibility is a core principle. All components follow WAI-ARIA guidelines and support keyboard navigation, screen readers, and other assistive technologies.`})]}),(0,v.jsxs)(K,{value:`item-4`,children:[(0,v.jsx)(q,{children:`Do you support dark mode?`}),(0,v.jsx)(J,{children:`Yes! The design system includes built-in dark mode support. Simply toggle the 'dark' class on your root element or use our theme provider for automatic switching.`})]})]})},$={args:{},render:()=>(0,v.jsxs)(G,{type:`single`,collapsible:!0,className:`w-[500px]`,children:[(0,v.jsxs)(K,{value:`item-1`,children:[(0,v.jsx)(q,{children:`Getting Started`}),(0,v.jsx)(J,{children:(0,v.jsxs)(G,{type:`single`,collapsible:!0,children:[(0,v.jsxs)(K,{value:`nested-1`,children:[(0,v.jsx)(q,{children:`Installation`}),(0,v.jsx)(J,{children:"Run `npm install @farutech/design-system` to install the package."})]}),(0,v.jsxs)(K,{value:`nested-2`,children:[(0,v.jsx)(q,{children:`Configuration`}),(0,v.jsx)(J,{children:`Configure your project by setting up the theme provider and importing styles.`})]})]})})]}),(0,v.jsxs)(K,{value:`item-2`,children:[(0,v.jsx)(q,{children:`Components`}),(0,v.jsx)(J,{children:(0,v.jsxs)(G,{type:`single`,collapsible:!0,children:[(0,v.jsxs)(K,{value:`nested-3`,children:[(0,v.jsx)(q,{children:`Basic Components`}),(0,v.jsx)(J,{children:`Learn about buttons, inputs, and other fundamental components.`})]}),(0,v.jsxs)(K,{value:`nested-4`,children:[(0,v.jsx)(q,{children:`Advanced Components`}),(0,v.jsx)(J,{children:`Explore data tables, charts, and complex interactive components.`})]})]})})]})]})};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'single',
    collapsible: true
  },
  render: args => <Accordion {...args} className="w-[400px]">\r
      <AccordionItem value="item-1">\r
        <AccordionTrigger>Is it accessible?</AccordionTrigger>\r
        <AccordionContent>\r
          Yes. It adheres to the WAI-ARIA design pattern.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-2">\r
        <AccordionTrigger>Is it styled?</AccordionTrigger>\r
        <AccordionContent>\r
          Yes. It comes with default styles that match the other components' aesthetic.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-3">\r
        <AccordionTrigger>Is it animated?</AccordionTrigger>\r
        <AccordionContent>\r
          Yes. It's animated by default, but you can disable it if you prefer.\r
        </AccordionContent>\r
      </AccordionItem>\r
    </Accordion>
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'multiple'
  },
  render: args => <Accordion {...args} className="w-[400px]">\r
      <AccordionItem value="item-1">\r
        <AccordionTrigger>What is React?</AccordionTrigger>\r
        <AccordionContent>\r
          React is a JavaScript library for building user interfaces.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-2">\r
        <AccordionTrigger>What is TypeScript?</AccordionTrigger>\r
        <AccordionContent>\r
          TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-3">\r
        <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>\r
        <AccordionContent>\r
          Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.\r
        </AccordionContent>\r
      </AccordionItem>\r
    </Accordion>
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <Accordion type="single" collapsible className="w-[400px]">\r
      <AccordionItem value="item-1">\r
        <AccordionTrigger>\r
          <div className="flex items-center justify-between w-full mr-4">\r
            <span>Notifications</span>\r
            <Badge variant="secondary">3</Badge>\r
          </div>\r
        </AccordionTrigger>\r
        <AccordionContent>\r
          You have 3 unread notifications. Check them out in your dashboard.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-2">\r
        <AccordionTrigger>\r
          <div className="flex items-center justify-between w-full mr-4">\r
            <span>Messages</span>\r
            <Badge variant="destructive">12</Badge>\r
          </div>\r
        </AccordionTrigger>\r
        <AccordionContent>\r
          You have 12 unread messages from your team members.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-3">\r
        <AccordionTrigger>\r
          <div className="flex items-center justify-between w-full mr-4">\r
            <span>Tasks</span>\r
            <Badge variant="outline">5</Badge>\r
          </div>\r
        </AccordionTrigger>\r
        <AccordionContent>\r
          You have 5 pending tasks that need your attention.\r
        </AccordionContent>\r
      </AccordionItem>\r
    </Accordion>
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <Accordion type="single" collapsible className="w-[600px]">\r
      <AccordionItem value="item-1">\r
        <AccordionTrigger>How do I get started?</AccordionTrigger>\r
        <AccordionContent>\r
          Getting started is easy! First, install the design system package, then import the components you need. Check out our documentation for detailed instructions.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-2">\r
        <AccordionTrigger>Can I customize the components?</AccordionTrigger>\r
        <AccordionContent>\r
          Absolutely! All components support customization through props, CSS classes, and CSS variables. You can modify colors, spacing, typography, and more to match your brand.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-3">\r
        <AccordionTrigger>Is it accessible?</AccordionTrigger>\r
        <AccordionContent>\r
          Yes, accessibility is a core principle. All components follow WAI-ARIA guidelines and support keyboard navigation, screen readers, and other assistive technologies.\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-4">\r
        <AccordionTrigger>Do you support dark mode?</AccordionTrigger>\r
        <AccordionContent>\r
          Yes! The design system includes built-in dark mode support. Simply toggle the 'dark' class on your root element or use our theme provider for automatic switching.\r
        </AccordionContent>\r
      </AccordionItem>\r
    </Accordion>
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <Accordion type="single" collapsible className="w-[500px]">\r
      <AccordionItem value="item-1">\r
        <AccordionTrigger>Getting Started</AccordionTrigger>\r
        <AccordionContent>\r
          <Accordion type="single" collapsible>\r
            <AccordionItem value="nested-1">\r
              <AccordionTrigger>Installation</AccordionTrigger>\r
              <AccordionContent>\r
                Run \`npm install @farutech/design-system\` to install the package.\r
              </AccordionContent>\r
            </AccordionItem>\r
            <AccordionItem value="nested-2">\r
              <AccordionTrigger>Configuration</AccordionTrigger>\r
              <AccordionContent>\r
                Configure your project by setting up the theme provider and importing styles.\r
              </AccordionContent>\r
            </AccordionItem>\r
          </Accordion>\r
        </AccordionContent>\r
      </AccordionItem>\r
      <AccordionItem value="item-2">\r
        <AccordionTrigger>Components</AccordionTrigger>\r
        <AccordionContent>\r
          <Accordion type="single" collapsible>\r
            <AccordionItem value="nested-3">\r
              <AccordionTrigger>Basic Components</AccordionTrigger>\r
              <AccordionContent>\r
                Learn about buttons, inputs, and other fundamental components.\r
              </AccordionContent>\r
            </AccordionItem>\r
            <AccordionItem value="nested-4">\r
              <AccordionTrigger>Advanced Components</AccordionTrigger>\r
              <AccordionContent>\r
                Explore data tables, charts, and complex interactive components.\r
              </AccordionContent>\r
            </AccordionItem>\r
          </Accordion>\r
        </AccordionContent>\r
      </AccordionItem>\r
    </Accordion>
}`,...$.parameters?.docs?.source}}};const ue=[`Single`,`Multiple`,`WithBadges`,`FAQ`,`Nested`];export{Q as FAQ,X as Multiple,$ as Nested,Y as Single,Z as WithBadges,ue as __namedExportsOrder,le as default};