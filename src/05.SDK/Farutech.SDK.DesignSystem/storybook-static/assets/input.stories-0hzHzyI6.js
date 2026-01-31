import"./react-uv-Ghkqr.js";import{t as e}from"./jsx-runtime-DNZ2e1fB.js";import"./cn-D_2D8x3C.js";import{t}from"./input-DqS6when.js";var n=e(),r={title:`UI/Input`,component:t,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{type:{control:{type:`select`},options:[`text`,`email`,`password`,`number`,`tel`,`url`,`search`]},disabled:{control:`boolean`},placeholder:{control:`text`}}};const i={args:{placeholder:`Enter text...`}},a={render:()=>(0,n.jsxs)(`div`,{className:`space-y-4 w-80`,children:[(0,n.jsx)(t,{type:`text`,placeholder:`Text input`}),(0,n.jsx)(t,{type:`email`,placeholder:`Email input`}),(0,n.jsx)(t,{type:`password`,placeholder:`Password input`}),(0,n.jsx)(t,{type:`number`,placeholder:`Number input`}),(0,n.jsx)(t,{type:`search`,placeholder:`Search input`})]})},o={args:{disabled:!0,placeholder:`Disabled input`}},s={render:()=>(0,n.jsxs)(`div`,{className:`space-y-2 w-80`,children:[(0,n.jsx)(`label`,{htmlFor:`input`,className:`text-sm font-medium`,children:`Email Address`}),(0,n.jsx)(t,{id:`input`,type:`email`,placeholder:`Enter your email`})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-80">\r
      <Input type="text" placeholder="Text input" />\r
      <Input type="email" placeholder="Email input" />\r
      <Input type="password" placeholder="Password input" />\r
      <Input type="number" placeholder="Number input" />\r
      <Input type="search" placeholder="Search input" />\r
    </div>
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Disabled input'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-80">\r
      <label htmlFor="input" className="text-sm font-medium">\r
        Email Address\r
      </label>\r
      <Input id="input" type="email" placeholder="Enter your email" />\r
    </div>
}`,...s.parameters?.docs?.source}}};const c=[`Default`,`Types`,`Disabled`,`WithLabel`];export{i as Default,o as Disabled,a as Types,s as WithLabel,c as __namedExportsOrder,r as default};