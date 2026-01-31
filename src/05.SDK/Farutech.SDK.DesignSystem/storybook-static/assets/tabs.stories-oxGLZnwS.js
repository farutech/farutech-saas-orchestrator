import{o as e}from"./iframe-D4gg6Iw3.js";import{t}from"./react-uv-Ghkqr.js";import{t as n}from"./jsx-runtime-DNZ2e1fB.js";import"./react-dom-CsrWfbrJ.js";import{n as r}from"./dist-Bgd7CuJZ.js";import"./dist-Cp-7oqJL.js";import"./dist-CSg34EEP.js";import{r as i,t as a}from"./dist-lQwzu1EI.js";import"./dist-BuAqTJkv.js";import{t as o}from"./dist-3YYKyc0D.js";import{t as s}from"./dist-DJBgKmjy.js";import{t as c}from"./dist-nwF1eD0n.js";import{t as l}from"./dist-VN4p9mL0.js";import{t as u}from"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import{t as d}from"./badge-BXYXjPVW.js";import"./dist-d7e7dHBK.js";import{n as f,r as p,t as m}from"./dist-DkdmMsFL.js";import{a as h,n as g,o as _,r as v,t as y}from"./card-C8VsPj8S.js";var b=e(t(),1),x=n(),S=`Tabs`,[C,w]=r(S,[p]),T=p(),[E,D]=C(S),O=b.forwardRef((e,t)=>{let{__scopeTabs:n,value:r,onValueChange:i,defaultValue:s,orientation:u=`horizontal`,dir:d,activationMode:f=`automatic`,...p}=e,m=l(d),[h,g]=o({prop:r,onChange:i,defaultProp:s??``,caller:S});return(0,x.jsx)(E,{scope:n,baseId:c(),value:h,onValueChange:g,orientation:u,dir:m,activationMode:f,children:(0,x.jsx)(a.div,{dir:m,"data-orientation":u,...p,ref:t})})});O.displayName=S;var k=`TabsList`,A=b.forwardRef((e,t)=>{let{__scopeTabs:n,loop:r=!0,...i}=e,o=D(k,n),s=T(n);return(0,x.jsx)(f,{asChild:!0,...s,orientation:o.orientation,dir:o.dir,loop:r,children:(0,x.jsx)(a.div,{role:`tablist`,"aria-orientation":o.orientation,...i,ref:t})})});A.displayName=k;var j=`TabsTrigger`,M=b.forwardRef((e,t)=>{let{__scopeTabs:n,value:r,disabled:o=!1,...s}=e,c=D(j,n),l=T(n),u=F(c.baseId,r),d=I(c.baseId,r),f=r===c.value;return(0,x.jsx)(m,{asChild:!0,...l,focusable:!o,active:f,children:(0,x.jsx)(a.button,{type:`button`,role:`tab`,"aria-selected":f,"aria-controls":d,"data-state":f?`active`:`inactive`,"data-disabled":o?``:void 0,disabled:o,id:u,...s,ref:t,onMouseDown:i(e.onMouseDown,e=>{!o&&e.button===0&&e.ctrlKey===!1?c.onValueChange(r):e.preventDefault()}),onKeyDown:i(e.onKeyDown,e=>{[` `,`Enter`].includes(e.key)&&c.onValueChange(r)}),onFocus:i(e.onFocus,()=>{let e=c.activationMode!==`manual`;!f&&!o&&e&&c.onValueChange(r)})})})});M.displayName=j;var N=`TabsContent`,P=b.forwardRef((e,t)=>{let{__scopeTabs:n,value:r,forceMount:i,children:o,...c}=e,l=D(N,n),u=F(l.baseId,r),d=I(l.baseId,r),f=r===l.value,p=b.useRef(f);return b.useEffect(()=>{let e=requestAnimationFrame(()=>p.current=!1);return()=>cancelAnimationFrame(e)},[]),(0,x.jsx)(s,{present:i||f,children:({present:n})=>(0,x.jsx)(a.div,{"data-state":f?`active`:`inactive`,"data-orientation":l.orientation,role:`tabpanel`,"aria-labelledby":u,hidden:!n,id:d,tabIndex:0,...c,ref:t,style:{...e.style,animationDuration:p.current?`0s`:void 0},children:n&&o})})});P.displayName=N;function F(e,t){return`${e}-trigger-${t}`}function I(e,t){return`${e}-content-${t}`}var L=O,R=A,z=M,B=P,V=L,H=b.forwardRef(({className:e,...t},n)=>(0,x.jsx)(R,{ref:n,className:u(`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground`,e),...t}));H.displayName=R.displayName;var U=b.forwardRef(({className:e,...t},n)=>(0,x.jsx)(z,{ref:n,className:u(`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm`,e),...t}));U.displayName=z.displayName;var W=b.forwardRef(({className:e,...t},n)=>(0,x.jsx)(B,{ref:n,className:u(`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,e),...t}));W.displayName=B.displayName;try{V.displayName=`Tabs`,V.__docgenInfo={description:``,displayName:`Tabs`,props:{asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}try{H.displayName=`TabsList`,H.__docgenInfo={description:``,displayName:`TabsList`,props:{asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}try{U.displayName=`TabsTrigger`,U.__docgenInfo={description:``,displayName:`TabsTrigger`,props:{asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}try{W.displayName=`TabsContent`,W.__docgenInfo={description:``,displayName:`TabsContent`,props:{asChild:{defaultValue:null,description:``,name:`asChild`,required:!1,type:{name:`boolean`}}}}}catch{}var G={title:`UI/Tabs`,component:V,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{defaultValue:{control:`text`}}};const K={render:()=>(0,x.jsxs)(V,{defaultValue:`account`,className:`w-[400px]`,children:[(0,x.jsxs)(H,{className:`grid w-full grid-cols-2`,children:[(0,x.jsx)(U,{value:`account`,children:`Account`}),(0,x.jsx)(U,{value:`password`,children:`Password`})]}),(0,x.jsx)(W,{value:`account`,children:(0,x.jsxs)(y,{children:[(0,x.jsxs)(h,{children:[(0,x.jsx)(_,{children:`Account`}),(0,x.jsx)(v,{children:`Make changes to your account here. Click save when you're done.`})]}),(0,x.jsxs)(g,{className:`space-y-2`,children:[(0,x.jsxs)(`div`,{className:`space-y-1`,children:[(0,x.jsx)(`label`,{className:`text-sm font-medium`,children:`Name`}),(0,x.jsx)(`input`,{className:`w-full px-3 py-2 border rounded-md`})]}),(0,x.jsxs)(`div`,{className:`space-y-1`,children:[(0,x.jsx)(`label`,{className:`text-sm font-medium`,children:`Email`}),(0,x.jsx)(`input`,{className:`w-full px-3 py-2 border rounded-md`})]})]})]})}),(0,x.jsx)(W,{value:`password`,children:(0,x.jsxs)(y,{children:[(0,x.jsxs)(h,{children:[(0,x.jsx)(_,{children:`Password`}),(0,x.jsx)(v,{children:`Change your password here. After saving, you'll be logged out.`})]}),(0,x.jsxs)(g,{className:`space-y-2`,children:[(0,x.jsxs)(`div`,{className:`space-y-1`,children:[(0,x.jsx)(`label`,{className:`text-sm font-medium`,children:`Current password`}),(0,x.jsx)(`input`,{type:`password`,className:`w-full px-3 py-2 border rounded-md`})]}),(0,x.jsxs)(`div`,{className:`space-y-1`,children:[(0,x.jsx)(`label`,{className:`text-sm font-medium`,children:`New password`}),(0,x.jsx)(`input`,{type:`password`,className:`w-full px-3 py-2 border rounded-md`})]})]})]})})]})},q={render:()=>(0,x.jsxs)(V,{defaultValue:`overview`,className:`w-[600px]`,children:[(0,x.jsxs)(H,{className:`grid w-full grid-cols-3`,children:[(0,x.jsx)(U,{value:`overview`,children:`Overview`}),(0,x.jsx)(U,{value:`analytics`,children:`Analytics`}),(0,x.jsx)(U,{value:`reports`,children:`Reports`})]}),(0,x.jsx)(W,{value:`overview`,className:`space-y-4`,children:(0,x.jsxs)(`div`,{className:`grid grid-cols-2 gap-4`,children:[(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{className:`flex flex-row items-center justify-between space-y-0 pb-2`,children:(0,x.jsx)(_,{className:`text-sm font-medium`,children:`Total Revenue`})}),(0,x.jsxs)(g,{children:[(0,x.jsx)(`div`,{className:`text-2xl font-bold`,children:`$45,231.89`}),(0,x.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`+20.1% from last month`})]})]}),(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{className:`flex flex-row items-center justify-between space-y-0 pb-2`,children:(0,x.jsx)(_,{className:`text-sm font-medium`,children:`Subscriptions`})}),(0,x.jsxs)(g,{children:[(0,x.jsx)(`div`,{className:`text-2xl font-bold`,children:`+2350`}),(0,x.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:`+180.1% from last month`})]})]})]})}),(0,x.jsx)(W,{value:`analytics`,className:`space-y-4`,children:(0,x.jsxs)(y,{children:[(0,x.jsxs)(h,{children:[(0,x.jsx)(_,{children:`Analytics`}),(0,x.jsx)(v,{children:`View your analytics data`})]}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Analytics content would go here.`})})]})}),(0,x.jsx)(W,{value:`reports`,className:`space-y-4`,children:(0,x.jsxs)(y,{children:[(0,x.jsxs)(h,{children:[(0,x.jsx)(_,{children:`Reports`}),(0,x.jsx)(v,{children:`Generate and view reports`})]}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Reports content would go here.`})})]})})]})},J={render:()=>(0,x.jsxs)(V,{defaultValue:`inbox`,className:`w-[400px]`,children:[(0,x.jsxs)(H,{className:`grid w-full grid-cols-3`,children:[(0,x.jsxs)(U,{value:`inbox`,className:`flex items-center gap-2`,children:[`Inbox`,(0,x.jsx)(d,{variant:`secondary`,className:`ml-1 h-5 w-5 rounded-full p-0 text-xs`,children:`3`})]}),(0,x.jsx)(U,{value:`sent`,children:`Sent`}),(0,x.jsx)(U,{value:`drafts`,children:`Drafts`})]}),(0,x.jsx)(W,{value:`inbox`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Inbox`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`You have 3 unread messages.`})})]})}),(0,x.jsx)(W,{value:`sent`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Sent`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Your sent messages.`})})]})}),(0,x.jsx)(W,{value:`drafts`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Drafts`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Your draft messages.`})})]})})]})},Y={render:()=>(0,x.jsx)(`div`,{className:`flex space-x-4`,children:(0,x.jsxs)(V,{defaultValue:`tab1`,orientation:`vertical`,className:`w-[400px]`,children:[(0,x.jsxs)(H,{className:`flex flex-col h-auto w-full`,children:[(0,x.jsx)(U,{value:`tab1`,className:`w-full justify-start`,children:`Tab 1`}),(0,x.jsx)(U,{value:`tab2`,className:`w-full justify-start`,children:`Tab 2`}),(0,x.jsx)(U,{value:`tab3`,className:`w-full justify-start`,children:`Tab 3`})]}),(0,x.jsx)(W,{value:`tab1`,className:`mt-0`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Tab 1 Content`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Content for the first tab.`})})]})}),(0,x.jsx)(W,{value:`tab2`,className:`mt-0`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Tab 2 Content`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Content for the second tab.`})})]})}),(0,x.jsx)(W,{value:`tab3`,className:`mt-0`,children:(0,x.jsxs)(y,{children:[(0,x.jsx)(h,{children:(0,x.jsx)(_,{children:`Tab 3 Content`})}),(0,x.jsx)(g,{children:(0,x.jsx)(`p`,{children:`Content for the third tab.`})})]})})]})})};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="account" className="w-[400px]">\r
      <TabsList className="grid w-full grid-cols-2">\r
        <TabsTrigger value="account">Account</TabsTrigger>\r
        <TabsTrigger value="password">Password</TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="account">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Account</CardTitle>\r
            <CardDescription>\r
              Make changes to your account here. Click save when you're done.\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-2">\r
            <div className="space-y-1">\r
              <label className="text-sm font-medium">Name</label>\r
              <input className="w-full px-3 py-2 border rounded-md" />\r
            </div>\r
            <div className="space-y-1">\r
              <label className="text-sm font-medium">Email</label>\r
              <input className="w-full px-3 py-2 border rounded-md" />\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="password">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Password</CardTitle>\r
            <CardDescription>\r
              Change your password here. After saving, you'll be logged out.\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-2">\r
            <div className="space-y-1">\r
              <label className="text-sm font-medium">Current password</label>\r
              <input type="password" className="w-full px-3 py-2 border rounded-md" />\r
            </div>\r
            <div className="space-y-1">\r
              <label className="text-sm font-medium">New password</label>\r
              <input type="password" className="w-full px-3 py-2 border rounded-md" />\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" className="w-[600px]">\r
      <TabsList className="grid w-full grid-cols-3">\r
        <TabsTrigger value="overview">Overview</TabsTrigger>\r
        <TabsTrigger value="analytics">Analytics</TabsTrigger>\r
        <TabsTrigger value="reports">Reports</TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="overview" className="space-y-4">\r
        <div className="grid grid-cols-2 gap-4">\r
          <Card>\r
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\r
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <div className="text-2xl font-bold">$45,231.89</div>\r
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>\r
            </CardContent>\r
          </Card>\r
          <Card>\r
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\r
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <div className="text-2xl font-bold">+2350</div>\r
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>\r
            </CardContent>\r
          </Card>\r
        </div>\r
      </TabsContent>\r
      <TabsContent value="analytics" className="space-y-4">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Analytics</CardTitle>\r
            <CardDescription>View your analytics data</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Analytics content would go here.</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="reports" className="space-y-4">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Reports</CardTitle>\r
            <CardDescription>Generate and view reports</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Reports content would go here.</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="inbox" className="w-[400px]">\r
      <TabsList className="grid w-full grid-cols-3">\r
        <TabsTrigger value="inbox" className="flex items-center gap-2">\r
          Inbox\r
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">\r
            3\r
          </Badge>\r
        </TabsTrigger>\r
        <TabsTrigger value="sent">Sent</TabsTrigger>\r
        <TabsTrigger value="drafts">Drafts</TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="inbox">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Inbox</CardTitle>\r
          </CardHeader>\r
          <CardContent>\r
            <p>You have 3 unread messages.</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="sent">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Sent</CardTitle>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Your sent messages.</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="drafts">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Drafts</CardTitle>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Your draft messages.</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex space-x-4">\r
      <Tabs defaultValue="tab1" orientation="vertical" className="w-[400px]">\r
        <TabsList className="flex flex-col h-auto w-full">\r
          <TabsTrigger value="tab1" className="w-full justify-start">Tab 1</TabsTrigger>\r
          <TabsTrigger value="tab2" className="w-full justify-start">Tab 2</TabsTrigger>\r
          <TabsTrigger value="tab3" className="w-full justify-start">Tab 3</TabsTrigger>\r
        </TabsList>\r
        <TabsContent value="tab1" className="mt-0">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle>Tab 1 Content</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p>Content for the first tab.</p>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
        <TabsContent value="tab2" className="mt-0">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle>Tab 2 Content</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p>Content for the second tab.</p>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
        <TabsContent value="tab3" className="mt-0">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle>Tab 3 Content</CardTitle>\r
            </CardHeader>\r
            <CardContent>\r
              <p>Content for the third tab.</p>\r
            </CardContent>\r
          </Card>\r
        </TabsContent>\r
      </Tabs>\r
    </div>
}`,...Y.parameters?.docs?.source}}};const X=[`Default`,`ThreeTabs`,`WithBadges`,`Vertical`];export{K as Default,q as ThreeTabs,Y as Vertical,J as WithBadges,X as __namedExportsOrder,G as default};