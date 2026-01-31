import"./react-uv-Ghkqr.js";import{t as e}from"./jsx-runtime-DNZ2e1fB.js";import"./react-dom-CsrWfbrJ.js";import"./dist-Bgd7CuJZ.js";import"./dist-Cp-7oqJL.js";import"./dist-CSg34EEP.js";import"./dist-lQwzu1EI.js";import"./dist-BuAqTJkv.js";import"./dist-3YYKyc0D.js";import"./dist-DJBgKmjy.js";import"./createLucideIcon-B2lKdPjW.js";import"./x-BFCjL7o5.js";import"./cn-D_2D8x3C.js";import"./dist-BP6TTQzW.js";import"./dist-d7e7dHBK.js";import"./dist-Co0IsVu2.js";import"./dist-DyUsFr32.js";import"./dist-DgzQp32D.js";import{t}from"./button-BwHpufzu.js";import{n,r,t as i}from"./toaster-PKxgEqN0.js";var a=e(),o={title:`UI/Toast`,component:i,parameters:{layout:`centered`,docs:{description:{component:`Toast notifications for displaying messages to users.`}}},tags:[`autodocs`],decorators:[e=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(e,{}),(0,a.jsx)(i,{})]})]},s=({variant:e=`default`})=>{let{toast:r}=n();return(0,a.jsxs)(t,{onClick:()=>{r({title:e===`destructive`?`Error`:`Success`,description:e===`destructive`?`There was a problem with your request.`:`Your action was completed successfully.`,variant:e})},children:[`Show `,e===`destructive`?`Error`:`Success`,` Toast`]})};const c={render:()=>(0,a.jsx)(s,{})},l={render:()=>(0,a.jsx)(s,{variant:`destructive`})},u={render:()=>{let{toast:e}=n();return(0,a.jsx)(t,{onClick:()=>{e({title:`Scheduled: Catch up`,description:`Friday, February 10, 2023 at 5:57 PM`,action:(0,a.jsx)(r,{altText:`Undo`,onClick:()=>console.log(`Undo clicked`),children:`Undo`})})},children:`Show Toast with Action`})}},d={render:()=>{let{toast:e}=n();return(0,a.jsx)(t,{onClick:()=>{e({title:`First Toast`,description:`This is the first notification.`}),setTimeout(()=>{e({title:`Second Toast`,description:`This is the second notification.`,variant:`destructive`})},1e3),setTimeout(()=>{e({title:`Third Toast`,description:`This is the third notification with an action.`,action:(0,a.jsx)(r,{altText:`View`,onClick:()=>console.log(`View clicked`),children:`View`})})},2e3)},children:`Show Multiple Toasts`})}},f={render:()=>{let{toast:e}=n();return(0,a.jsx)(t,{onClick:()=>{e({title:`Important Update Available`,description:`A new version of the application is available for download. This update includes several bug fixes and performance improvements. Please update your application to continue receiving the latest features and security patches.`})},children:`Show Long Toast`})}},p={render:()=>{let{toast:e}=n();return(0,a.jsx)(t,{onClick:()=>{e({title:`Auto-closing Toast`,description:`This toast will automatically close after 3 seconds.`})},children:`Show Auto-closing Toast`})}},m={render:()=>{let{toast:e}=n();return(0,a.jsxs)(`div`,{className:`flex gap-2`,children:[(0,a.jsx)(t,{onClick:()=>{e({title:`Success!`,description:`Your changes have been saved successfully.`})},variant:`default`,children:`Success`}),(0,a.jsx)(t,{onClick:()=>{e({title:`Error`,description:`Failed to save changes. Please try again.`,variant:`destructive`})},variant:`destructive`,children:`Error`}),(0,a.jsx)(t,{onClick:()=>{e({title:`Information`,description:`New features are available in the latest update.`})},variant:`outline`,children:`Info`})]})}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ToastDemo />
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <ToastDemo variant="destructive" />
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    const showToastWithAction = () => {
      toast({
        title: 'Scheduled: Catch up',
        description: 'Friday, February 10, 2023 at 5:57 PM',
        action: <ToastAction altText="Undo" onClick={() => console.log('Undo clicked')}>\r
            Undo\r
          </ToastAction>
      });
    };
    return <Button onClick={showToastWithAction}>\r
        Show Toast with Action\r
      </Button>;
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    const showMultipleToasts = () => {
      toast({
        title: 'First Toast',
        description: 'This is the first notification.'
      });
      setTimeout(() => {
        toast({
          title: 'Second Toast',
          description: 'This is the second notification.',
          variant: 'destructive'
        });
      }, 1000);
      setTimeout(() => {
        toast({
          title: 'Third Toast',
          description: 'This is the third notification with an action.',
          action: <ToastAction altText="View" onClick={() => console.log('View clicked')}>\r
              View\r
            </ToastAction>
        });
      }, 2000);
    };
    return <Button onClick={showMultipleToasts}>\r
        Show Multiple Toasts\r
      </Button>;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    const showLongToast = () => {
      toast({
        title: 'Important Update Available',
        description: 'A new version of the application is available for download. This update includes several bug fixes and performance improvements. Please update your application to continue receiving the latest features and security patches.'
      });
    };
    return <Button onClick={showLongToast}>\r
        Show Long Toast\r
      </Button>;
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    const showAutoCloseToast = () => {
      toast({
        title: 'Auto-closing Toast',
        description: 'This toast will automatically close after 3 seconds.'
      });
    };
    return <Button onClick={showAutoCloseToast}>\r
        Show Auto-closing Toast\r
      </Button>;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    const showSuccessToast = () => {
      toast({
        title: 'Success!',
        description: 'Your changes have been saved successfully.'
      });
    };
    const showErrorToast = () => {
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive'
      });
    };
    const showInfoToast = () => {
      toast({
        title: 'Information',
        description: 'New features are available in the latest update.'
      });
    };
    return <div className="flex gap-2">\r
        <Button onClick={showSuccessToast} variant="default">\r
          Success\r
        </Button>\r
        <Button onClick={showErrorToast} variant="destructive">\r
          Error\r
        </Button>\r
        <Button onClick={showInfoToast} variant="outline">\r
          Info\r
        </Button>\r
      </div>;
  }
}`,...m.parameters?.docs?.source}}};const h=[`Default`,`Destructive`,`WithAction`,`MultipleToasts`,`LongContent`,`AutoClose`,`ToastVariants`];export{p as AutoClose,c as Default,l as Destructive,f as LongContent,d as MultipleToasts,m as ToastVariants,u as WithAction,h as __namedExportsOrder,o as default};