import{o as e}from"./iframe-D4gg6Iw3.js";import{t}from"./react-uv-Ghkqr.js";import{t as n}from"./jsx-runtime-DNZ2e1fB.js";import{t as r}from"./createLucideIcon-B2lKdPjW.js";import{t as i}from"./cn-D_2D8x3C.js";import{t as a}from"./dist-BP6TTQzW.js";var o=r(`CircleAlert`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]]),s=r(`CircleCheckBig`,[[`path`,{d:`M21.801 10A10 10 0 1 1 17 3.335`,key:`yps3ct`}],[`path`,{d:`m9 11 3 3L22 4`,key:`1pflzl`}]]),c=r(`Info`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 16v-4`,key:`1dtifu`}],[`path`,{d:`M12 8h.01`,key:`e9boi3`}]]),l=r(`TriangleAlert`,[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]]),u=e(t(),1),d=n(),f=a(`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground`,{variants:{variant:{default:`bg-background text-foreground`,destructive:`border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive`,success:`border-green-500/50 text-green-700 dark:border-green-500 dark:text-green-400 [&>svg]:text-green-600`,warning:`border-yellow-500/50 text-yellow-700 dark:border-yellow-500 dark:text-yellow-400 [&>svg]:text-yellow-600`,info:`border-blue-500/50 text-blue-700 dark:border-blue-500 dark:text-blue-400 [&>svg]:text-blue-600`}},defaultVariants:{variant:`default`}}),p=u.forwardRef(({className:e,variant:t,...n},r)=>(0,d.jsx)(`div`,{ref:r,role:`alert`,className:i(f({variant:t}),e),...n}));p.displayName=`Alert`;var m=u.forwardRef(({className:e,...t},n)=>(0,d.jsx)(`h5`,{ref:n,className:i(`mb-1 font-medium leading-none tracking-tight`,e),...t}));m.displayName=`AlertTitle`;var h=u.forwardRef(({className:e,...t},n)=>(0,d.jsx)(`div`,{ref:n,className:i(`text-sm [&_p]:leading-relaxed`,e),...t}));h.displayName=`AlertDescription`;try{p.displayName=`Alert`,p.__docgenInfo={description:``,displayName:`Alert`,props:{variant:{defaultValue:null,description:``,name:`variant`,required:!1,type:{name:`enum`,value:[{value:`"default"`},{value:`"destructive"`},{value:`"success"`},{value:`"warning"`},{value:`"info"`}]}}}}}catch{}try{m.displayName=`AlertTitle`,m.__docgenInfo={description:``,displayName:`AlertTitle`,props:{}}}catch{}try{h.displayName=`AlertDescription`,h.__docgenInfo={description:``,displayName:`AlertDescription`,props:{}}}catch{}var g={title:`UI/Alert`,component:p,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`default`,`destructive`]}}};const _={render:()=>(0,d.jsxs)(p,{className:`w-96`,children:[(0,d.jsx)(c,{className:`h-4 w-4`}),(0,d.jsx)(m,{children:`Information`}),(0,d.jsx)(h,{children:`This is a default alert with some information.`})]})},v={render:()=>(0,d.jsxs)(p,{variant:`destructive`,className:`w-96`,children:[(0,d.jsx)(o,{className:`h-4 w-4`}),(0,d.jsx)(m,{children:`Error`}),(0,d.jsx)(h,{children:`Something went wrong. Please try again.`})]})},y={render:()=>(0,d.jsxs)(p,{className:`w-96 border-green-200 bg-green-50`,children:[(0,d.jsx)(s,{className:`h-4 w-4 text-green-600`}),(0,d.jsx)(m,{className:`text-green-800`,children:`Success`}),(0,d.jsx)(h,{className:`text-green-700`,children:`Your changes have been saved successfully.`})]})},b={render:()=>(0,d.jsxs)(p,{className:`w-96 border-yellow-200 bg-yellow-50`,children:[(0,d.jsx)(l,{className:`h-4 w-4 text-yellow-600`}),(0,d.jsx)(m,{className:`text-yellow-800`,children:`Warning`}),(0,d.jsx)(h,{className:`text-yellow-700`,children:`Please review your input before proceeding.`})]})},x={render:()=>(0,d.jsx)(p,{className:`w-96`,children:(0,d.jsx)(h,{children:`Simple alert without title.`})})};_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Alert className="w-96">\r
      <Info className="h-4 w-4" />\r
      <AlertTitle>Information</AlertTitle>\r
      <AlertDescription>\r
        This is a default alert with some information.\r
      </AlertDescription>\r
    </Alert>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive" className="w-96">\r
      <AlertCircle className="h-4 w-4" />\r
      <AlertTitle>Error</AlertTitle>\r
      <AlertDescription>\r
        Something went wrong. Please try again.\r
      </AlertDescription>\r
    </Alert>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Alert className="w-96 border-green-200 bg-green-50">\r
      <CheckCircle className="h-4 w-4 text-green-600" />\r
      <AlertTitle className="text-green-800">Success</AlertTitle>\r
      <AlertDescription className="text-green-700">\r
        Your changes have been saved successfully.\r
      </AlertDescription>\r
    </Alert>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Alert className="w-96 border-yellow-200 bg-yellow-50">\r
      <AlertTriangle className="h-4 w-4 text-yellow-600" />\r
      <AlertTitle className="text-yellow-800">Warning</AlertTitle>\r
      <AlertDescription className="text-yellow-700">\r
        Please review your input before proceeding.\r
      </AlertDescription>\r
    </Alert>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Alert className="w-96">\r
      <AlertDescription>\r
        Simple alert without title.\r
      </AlertDescription>\r
    </Alert>
}`,...x.parameters?.docs?.source}}};const S=[`Default`,`Destructive`,`Success`,`Warning`,`Simple`];export{_ as Default,v as Destructive,x as Simple,y as Success,b as Warning,S as __namedExportsOrder,g as default};