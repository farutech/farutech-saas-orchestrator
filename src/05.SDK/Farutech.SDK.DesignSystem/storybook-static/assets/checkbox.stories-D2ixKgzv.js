import{t as e}from"./react-uv-Ghkqr.js";import{t}from"./jsx-runtime-DNZ2e1fB.js";import"./react-dom-CsrWfbrJ.js";import"./dist-Bgd7CuJZ.js";import"./dist-Cp-7oqJL.js";import"./dist-lQwzu1EI.js";import"./dist-BuAqTJkv.js";import"./dist-3YYKyc0D.js";import"./dist-DJBgKmjy.js";import"./createLucideIcon-B2lKdPjW.js";import"./check-Tc2ZVfZ1.js";import"./cn-D_2D8x3C.js";import"./dist-CFqRO75o.js";import"./dist-DZSf3qfw.js";import{t as n}from"./checkbox-Bh7mnFJr.js";var r=e(),i=t(),a={title:`UI/Checkbox`,component:n,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{disabled:{control:`boolean`},checked:{control:`boolean`}}};const o={render:()=>{let[e,t]=(0,r.useState)(!1);return(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`default`,checked:e,onCheckedChange:e=>t(e===!0)}),(0,i.jsx)(`label`,{htmlFor:`default`,className:`text-sm`,children:`Accept terms and conditions`})]})}},s={args:{checked:!0},render:e=>(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`controlled`,...e}),(0,i.jsx)(`label`,{htmlFor:`controlled`,className:`text-sm`,children:`Controlled checkbox`})]})},c={render:()=>(0,i.jsxs)(`div`,{className:`space-y-2`,children:[(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`disabled-unchecked`,disabled:!0}),(0,i.jsx)(`label`,{htmlFor:`disabled-unchecked`,className:`text-sm text-muted-foreground`,children:`Disabled unchecked`})]}),(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`disabled-checked`,disabled:!0,checked:!0}),(0,i.jsx)(`label`,{htmlFor:`disabled-checked`,className:`text-sm text-muted-foreground`,children:`Disabled checked`})]})]})},l={render:()=>{let[e,t]=(0,r.useState)({newsletter:!1,marketing:!1,updates:!0}),a=e=>n=>{t(t=>({...t,[e]:n}))};return(0,i.jsxs)(`div`,{className:`space-y-3`,children:[(0,i.jsx)(`h3`,{className:`text-lg font-medium`,children:`Email Preferences`}),(0,i.jsxs)(`div`,{className:`space-y-2`,children:[(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`newsletter`,checked:e.newsletter,onCheckedChange:a(`newsletter`)}),(0,i.jsx)(`label`,{htmlFor:`newsletter`,className:`text-sm`,children:`Newsletter`})]}),(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`marketing`,checked:e.marketing,onCheckedChange:a(`marketing`)}),(0,i.jsx)(`label`,{htmlFor:`marketing`,className:`text-sm`,children:`Marketing emails`})]}),(0,i.jsxs)(`div`,{className:`flex items-center space-x-2`,children:[(0,i.jsx)(n,{id:`updates`,checked:e.updates,onCheckedChange:a(`updates`)}),(0,i.jsx)(`label`,{htmlFor:`updates`,className:`text-sm`,children:`Product updates`})]})]})]})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="flex items-center space-x-2">\r
        <Checkbox id="default" checked={checked} onCheckedChange={checked => setChecked(checked === true)} />\r
        <label htmlFor="default" className="text-sm">\r
          Accept terms and conditions\r
        </label>\r
      </div>;
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    checked: true
  },
  render: args => <div className="flex items-center space-x-2">\r
      <Checkbox id="controlled" {...args} />\r
      <label htmlFor="controlled" className="text-sm">\r
        Controlled checkbox\r
      </label>\r
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="disabled-unchecked" disabled />\r
        <label htmlFor="disabled-unchecked" className="text-sm text-muted-foreground">\r
          Disabled unchecked\r
        </label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="disabled-checked" disabled checked />\r
        <label htmlFor="disabled-checked" className="text-sm text-muted-foreground">\r
          Disabled checked\r
        </label>\r
      </div>\r
    </div>
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [items, setItems] = useState({
      newsletter: false,
      marketing: false,
      updates: true
    });
    const handleChange = (key: string) => (checked: boolean) => {
      setItems(prev => ({
        ...prev,
        [key]: checked
      }));
    };
    return <div className="space-y-3">\r
        <h3 className="text-lg font-medium">Email Preferences</h3>\r
        <div className="space-y-2">\r
          <div className="flex items-center space-x-2">\r
            <Checkbox id="newsletter" checked={items.newsletter} onCheckedChange={handleChange('newsletter')} />\r
            <label htmlFor="newsletter" className="text-sm">\r
              Newsletter\r
            </label>\r
          </div>\r
          <div className="flex items-center space-x-2">\r
            <Checkbox id="marketing" checked={items.marketing} onCheckedChange={handleChange('marketing')} />\r
            <label htmlFor="marketing" className="text-sm">\r
              Marketing emails\r
            </label>\r
          </div>\r
          <div className="flex items-center space-x-2">\r
            <Checkbox id="updates" checked={items.updates} onCheckedChange={handleChange('updates')} />\r
            <label htmlFor="updates" className="text-sm">\r
              Product updates\r
            </label>\r
          </div>\r
        </div>\r
      </div>;
  }
}`,...l.parameters?.docs?.source}}};const u=[`Default`,`Controlled`,`Disabled`,`Group`];export{s as Controlled,o as Default,c as Disabled,l as Group,u as __namedExportsOrder,a as default};