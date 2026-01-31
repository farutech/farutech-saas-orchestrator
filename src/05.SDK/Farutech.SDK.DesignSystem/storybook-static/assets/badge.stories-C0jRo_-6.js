import"./react-uv-Ghkqr.js";import{t as e}from"./jsx-runtime-DNZ2e1fB.js";import"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import{t}from"./badge-BXYXjPVW.js";var n=e(),r={title:`UI/Badge`,component:t,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`default`,`secondary`,`destructive`,`outline`]}}};const i={args:{children:`Badge`}},a={render:()=>(0,n.jsxs)(`div`,{className:`flex gap-2`,children:[(0,n.jsx)(t,{variant:`default`,children:`Default`}),(0,n.jsx)(t,{variant:`secondary`,children:`Secondary`}),(0,n.jsx)(t,{variant:`destructive`,children:`Destructive`}),(0,n.jsx)(t,{variant:`outline`,children:`Outline`})]})},o={render:()=>(0,n.jsxs)(`div`,{className:`flex gap-2`,children:[(0,n.jsx)(t,{className:`bg-green-100 text-green-800`,children:`Active`}),(0,n.jsx)(t,{className:`bg-yellow-100 text-yellow-800`,children:`Pending`}),(0,n.jsx)(t,{className:`bg-red-100 text-red-800`,children:`Inactive`}),(0,n.jsx)(t,{className:`bg-blue-100 text-blue-800`,children:`Draft`})]})},s={render:()=>(0,n.jsxs)(`div`,{className:`flex gap-2`,children:[(0,n.jsxs)(t,{variant:`outline`,className:`gap-1`,children:[(0,n.jsx)(`div`,{className:`w-2 h-2 bg-green-500 rounded-full`}),`Online`]}),(0,n.jsxs)(t,{variant:`outline`,className:`gap-1`,children:[(0,n.jsx)(`div`,{className:`w-2 h-2 bg-red-500 rounded-full`}),`Offline`]})]})},c={render:()=>(0,n.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,n.jsx)(t,{className:`text-xs px-2 py-1`,children:`Small`}),(0,n.jsx)(t,{children:`Default`}),(0,n.jsx)(t,{className:`text-lg px-3 py-1`,children:`Large`})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">\r
      <Badge variant="default">Default</Badge>\r
      <Badge variant="secondary">Secondary</Badge>\r
      <Badge variant="destructive">Destructive</Badge>\r
      <Badge variant="outline">Outline</Badge>\r
    </div>
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">\r
      <Badge className="bg-green-100 text-green-800">Active</Badge>\r
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>\r
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>\r
      <Badge className="bg-blue-100 text-blue-800">Draft</Badge>\r
    </div>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">\r
      <Badge variant="outline" className="gap-1">\r
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>\r
        Online\r
      </Badge>\r
      <Badge variant="outline" className="gap-1">\r
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>\r
        Offline\r
      </Badge>\r
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">\r
      <Badge className="text-xs px-2 py-1">Small</Badge>\r
      <Badge>Default</Badge>\r
      <Badge className="text-lg px-3 py-1">Large</Badge>\r
    </div>
}`,...c.parameters?.docs?.source}}};const l=[`Default`,`Variants`,`Status`,`WithDot`,`Sizes`];export{i as Default,c as Sizes,o as Status,a as Variants,s as WithDot,l as __namedExportsOrder,r as default};