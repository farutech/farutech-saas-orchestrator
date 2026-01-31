import"./react-uv-Ghkqr.js";import{t as e}from"./jsx-runtime-DNZ2e1fB.js";import"./dist-Cp-7oqJL.js";import"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import"./dist-DgzQp32D.js";import{t}from"./button-BwHpufzu.js";var n=e(),r={title:`UI/Button`,component:t,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`default`,`destructive`,`outline`,`secondary`,`ghost`,`link`]},size:{control:{type:`select`},options:[`default`,`sm`,`lg`,`icon`]},disabled:{control:`boolean`}}};const i={args:{children:`Button`}},a={render:()=>(0,n.jsxs)(`div`,{className:`flex gap-4`,children:[(0,n.jsx)(t,{variant:`default`,children:`Default`}),(0,n.jsx)(t,{variant:`destructive`,children:`Destructive`}),(0,n.jsx)(t,{variant:`outline`,children:`Outline`}),(0,n.jsx)(t,{variant:`secondary`,children:`Secondary`}),(0,n.jsx)(t,{variant:`ghost`,children:`Ghost`}),(0,n.jsx)(t,{variant:`link`,children:`Link`})]})},o={render:()=>(0,n.jsxs)(`div`,{className:`flex gap-4 items-center`,children:[(0,n.jsx)(t,{size:`sm`,children:`Small`}),(0,n.jsx)(t,{size:`default`,children:`Default`}),(0,n.jsx)(t,{size:`lg`,children:`Large`}),(0,n.jsx)(t,{size:`icon`,children:`🔍`})]})},s={args:{disabled:!0,children:`Disabled Button`}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4">\r
      <Button variant="default">Default</Button>\r
      <Button variant="destructive">Destructive</Button>\r
      <Button variant="outline">Outline</Button>\r
      <Button variant="secondary">Secondary</Button>\r
      <Button variant="ghost">Ghost</Button>\r
      <Button variant="link">Link</Button>\r
    </div>
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 items-center">\r
      <Button size="sm">Small</Button>\r
      <Button size="default">Default</Button>\r
      <Button size="lg">Large</Button>\r
      <Button size="icon">🔍</Button>\r
    </div>
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled Button'
  }
}`,...s.parameters?.docs?.source}}};const c=[`Default`,`Variants`,`Sizes`,`Disabled`];export{i as Default,s as Disabled,o as Sizes,a as Variants,c as __namedExportsOrder,r as default};