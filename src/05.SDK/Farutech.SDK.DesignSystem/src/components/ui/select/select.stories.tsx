import type { Meta, StoryObj } from '@storybook/react';

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
  },
};
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card/Card';
import { Label } from '../label/Label';
import { Button } from '../button/Button';


const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A customizable select component with trigger, content, and item subcomponents for dropdown selection. Provides accessible dropdown menus with keyboard navigation and screen reader support.',
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
  tags: ['autodocs', 'ui', 'select', 'dropdown', 'form', 'accessibility'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled.',
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required.',
    },
    value: {
      control: 'text',
      description: 'The controlled value of the select.',
    },
    defaultValue: {
      control: 'text',
      description: 'The default value of the select.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic select with placeholder and multiple options.',
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('apple');

    return (
      <div className="space-y-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Selected: {value}</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled select with state management showing selected value.',
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="country-select">Choose a country</Label>
      <Select>
        <SelectTrigger id="country-select" className="w-full">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">🇺🇸 United States</SelectItem>
          <SelectItem value="ca">🇨🇦 Canada</SelectItem>
          <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
          <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
          <SelectItem value="de">🇩🇪 Germany</SelectItem>
          <SelectItem value="fr">🇫🇷 France</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Select your country of residence
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select with associated label for better accessibility.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled select preventing user interaction.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">
          🇺🇸 English
        </SelectItem>
        <SelectItem value="es">
          🇪🇸 Español
        </SelectItem>
        <SelectItem value="fr">
          🇫🇷 Français
        </SelectItem>
        <SelectItem value="de">
          🇩🇪 Deutsch
        </SelectItem>
        <SelectItem value="it">
          🇮🇹 Italiano
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select with flag icons for visual language selection.',
      },
    },
  },
};

export const InCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>Configure your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select components integrated within a card layout for settings.',
      },
    },
  },
};

export const Scrollable: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        <SelectItem value="afghanistan">Afghanistan</SelectItem>
        <SelectItem value="albania">Albania</SelectItem>
        <SelectItem value="algeria">Algeria</SelectItem>
        <SelectItem value="andorra">Andorra</SelectItem>
        <SelectItem value="angola">Angola</SelectItem>
        <SelectItem value="antigua">Antigua and Barbuda</SelectItem>
        <SelectItem value="argentina">Argentina</SelectItem>
        <SelectItem value="armenia">Armenia</SelectItem>
        <SelectItem value="australia">Australia</SelectItem>
        <SelectItem value="austria">Austria</SelectItem>
        <SelectItem value="azerbaijan">Azerbaijan</SelectItem>
        <SelectItem value="bahamas">Bahamas</SelectItem>
        <SelectItem value="bahrain">Bahrain</SelectItem>
        <SelectItem value="bangladesh">Bangladesh</SelectItem>
        <SelectItem value="barbados">Barbados</SelectItem>
        <SelectItem value="belarus">Belarus</SelectItem>
        <SelectItem value="belgium">Belgium</SelectItem>
        <SelectItem value="belize">Belize</SelectItem>
        <SelectItem value="benin">Benin</SelectItem>
        <SelectItem value="bhutan">Bhutan</SelectItem>
        <SelectItem value="bolivia">Bolivia</SelectItem>
        <SelectItem value="botswana">Botswana</SelectItem>
        <SelectItem value="brazil">Brazil</SelectItem>
        <SelectItem value="brunei">Brunei</SelectItem>
        <SelectItem value="bulgaria">Bulgaria</SelectItem>
        <SelectItem value="burundi">Burundi</SelectItem>
        <SelectItem value="cambodia">Cambodia</SelectItem>
        <SelectItem value="cameroon">Cameroon</SelectItem>
        <SelectItem value="canada">Canada</SelectItem>
        <SelectItem value="chad">Chad</SelectItem>
        <SelectItem value="chile">Chile</SelectItem>
        <SelectItem value="china">China</SelectItem>
        <SelectItem value="colombia">Colombia</SelectItem>
        <SelectItem value="comoros">Comoros</SelectItem>
        <SelectItem value="congo">Congo</SelectItem>
        <SelectItem value="costa-rica">Costa Rica</SelectItem>
        <SelectItem value="croatia">Croatia</SelectItem>
        <SelectItem value="cuba">Cuba</SelectItem>
        <SelectItem value="cyprus">Cyprus</SelectItem>
        <SelectItem value="czech">Czech Republic</SelectItem>
        <SelectItem value="denmark">Denmark</SelectItem>
        <SelectItem value="djibouti">Djibouti</SelectItem>
        <SelectItem value="dominica">Dominica</SelectItem>
        <SelectItem value="ecuador">Ecuador</SelectItem>
        <SelectItem value="egypt">Egypt</SelectItem>
        <SelectItem value="estonia">Estonia</SelectItem>
        <SelectItem value="ethiopia">Ethiopia</SelectItem>
        <SelectItem value="fiji">Fiji</SelectItem>
        <SelectItem value="finland">Finland</SelectItem>
        <SelectItem value="france">France</SelectItem>
        <SelectItem value="gabon">Gabon</SelectItem>
        <SelectItem value="gambia">Gambia</SelectItem>
        <SelectItem value="georgia">Georgia</SelectItem>
        <SelectItem value="germany">Germany</SelectItem>
        <SelectItem value="ghana">Ghana</SelectItem>
        <SelectItem value="greece">Greece</SelectItem>
        <SelectItem value="grenada">Grenada</SelectItem>
        <SelectItem value="guatemala">Guatemala</SelectItem>
        <SelectItem value="guinea">Guinea</SelectItem>
        <SelectItem value="guyana">Guyana</SelectItem>
        <SelectItem value="haiti">Haiti</SelectItem>
        <SelectItem value="honduras">Honduras</SelectItem>
        <SelectItem value="hungary">Hungary</SelectItem>
        <SelectItem value="iceland">Iceland</SelectItem>
        <SelectItem value="india">India</SelectItem>
        <SelectItem value="indonesia">Indonesia</SelectItem>
        <SelectItem value="iran">Iran</SelectItem>
        <SelectItem value="iraq">Iraq</SelectItem>
        <SelectItem value="ireland">Ireland</SelectItem>
        <SelectItem value="israel">Israel</SelectItem>
        <SelectItem value="italy">Italy</SelectItem>
        <SelectItem value="jamaica">Jamaica</SelectItem>
        <SelectItem value="japan">Japan</SelectItem>
        <SelectItem value="jordan">Jordan</SelectItem>
        <SelectItem value="kazakhstan">Kazakhstan</SelectItem>
        <SelectItem value="kenya">Kenya</SelectItem>
        <SelectItem value="kiribati">Kiribati</SelectItem>
        <SelectItem value="kuwait">Kuwait</SelectItem>
        <SelectItem value="kyrgyzstan">Kyrgyzstan</SelectItem>
        <SelectItem value="laos">Laos</SelectItem>
        <SelectItem value="latvia">Latvia</SelectItem>
        <SelectItem value="lebanon">Lebanon</SelectItem>
        <SelectItem value="lesotho">Lesotho</SelectItem>
        <SelectItem value="liberia">Liberia</SelectItem>
        <SelectItem value="libya">Libya</SelectItem>
        <SelectItem value="liechtenstein">Liechtenstein</SelectItem>
        <SelectItem value="lithuania">Lithuania</SelectItem>
        <SelectItem value="luxembourg">Luxembourg</SelectItem>
        <SelectItem value="madagascar">Madagascar</SelectItem>
        <SelectItem value="malawi">Malawi</SelectItem>
        <SelectItem value="malaysia">Malaysia</SelectItem>
        <SelectItem value="maldives">Maldives</SelectItem>
        <SelectItem value="mali">Mali</SelectItem>
        <SelectItem value="malta">Malta</SelectItem>
        <SelectItem value="marshall">Marshall Islands</SelectItem>
        <SelectItem value="mauritania">Mauritania</SelectItem>
        <SelectItem value="mauritius">Mauritius</SelectItem>
        <SelectItem value="mexico">Mexico</SelectItem>
        <SelectItem value="micronesia">Micronesia</SelectItem>
        <SelectItem value="moldova">Moldova</SelectItem>
        <SelectItem value="monaco">Monaco</SelectItem>
        <SelectItem value="mongolia">Mongolia</SelectItem>
        <SelectItem value="montenegro">Montenegro</SelectItem>
        <SelectItem value="morocco">Morocco</SelectItem>
        <SelectItem value="mozambique">Mozambique</SelectItem>
        <SelectItem value="myanmar">Myanmar</SelectItem>
        <SelectItem value="namibia">Namibia</SelectItem>
        <SelectItem value="nauru">Nauru</SelectItem>
        <SelectItem value="nepal">Nepal</SelectItem>
        <SelectItem value="netherlands">Netherlands</SelectItem>
        <SelectItem value="new-zealand">New Zealand</SelectItem>
        <SelectItem value="nicaragua">Nicaragua</SelectItem>
        <SelectItem value="niger">Niger</SelectItem>
        <SelectItem value="nigeria">Nigeria</SelectItem>
        <SelectItem value="north-korea">North Korea</SelectItem>
        <SelectItem value="norway">Norway</SelectItem>
        <SelectItem value="oman">Oman</SelectItem>
        <SelectItem value="pakistan">Pakistan</SelectItem>
        <SelectItem value="palau">Palau</SelectItem>
        <SelectItem value="panama">Panama</SelectItem>
        <SelectItem value="papua">Papua New Guinea</SelectItem>
        <SelectItem value="paraguay">Paraguay</SelectItem>
        <SelectItem value="peru">Peru</SelectItem>
        <SelectItem value="philippines">Philippines</SelectItem>
        <SelectItem value="poland">Poland</SelectItem>
        <SelectItem value="portugal">Portugal</SelectItem>
        <SelectItem value="qatar">Qatar</SelectItem>
        <SelectItem value="romania">Romania</SelectItem>
        <SelectItem value="russia">Russia</SelectItem>
        <SelectItem value="rwanda">Rwanda</SelectItem>
        <SelectItem value="saint-lucia">Saint Lucia</SelectItem>
        <SelectItem value="samoa">Samoa</SelectItem>
        <SelectItem value="san-marino">San Marino</SelectItem>
        <SelectItem value="saudi-arabia">Saudi Arabia</SelectItem>
        <SelectItem value="senegal">Senegal</SelectItem>
        <SelectItem value="serbia">Serbia</SelectItem>
        <SelectItem value="seychelles">Seychelles</SelectItem>
        <SelectItem value="sierra-leone">Sierra Leone</SelectItem>
        <SelectItem value="singapore">Singapore</SelectItem>
        <SelectItem value="slovakia">Slovakia</SelectItem>
        <SelectItem value="slovenia">Slovenia</SelectItem>
        <SelectItem value="solomon">Solomon Islands</SelectItem>
        <SelectItem value="somalia">Somalia</SelectItem>
        <SelectItem value="south-africa">South Africa</SelectItem>
        <SelectItem value="south-korea">South Korea</SelectItem>
        <SelectItem value="spain">Spain</SelectItem>
        <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
        <SelectItem value="sudan">Sudan</SelectItem>
        <SelectItem value="suriname">Suriname</SelectItem>
        <SelectItem value="sweden">Sweden</SelectItem>
        <SelectItem value="switzerland">Switzerland</SelectItem>
        <SelectItem value="syria">Syria</SelectItem>
        <SelectItem value="taiwan">Taiwan</SelectItem>
        <SelectItem value="tajikistan">Tajikistan</SelectItem>
        <SelectItem value="tanzania">Tanzania</SelectItem>
        <SelectItem value="thailand">Thailand</SelectItem>
        <SelectItem value="togo">Togo</SelectItem>
        <SelectItem value="tonga">Tonga</SelectItem>
        <SelectItem value="trinidad">Trinidad and Tobago</SelectItem>
        <SelectItem value="tunisia">Tunisia</SelectItem>
        <SelectItem value="turkey">Turkey</SelectItem>
        <SelectItem value="turkmenistan">Turkmenistan</SelectItem>
        <SelectItem value="tuvalu">Tuvalu</SelectItem>
        <SelectItem value="uganda">Uganda</SelectItem>
        <SelectItem value="ukraine">Ukraine</SelectItem>
        <SelectItem value="uae">United Arab Emirates</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="uruguay">Uruguay</SelectItem>
        <SelectItem value="uzbekistan">Uzbekistan</SelectItem>
        <SelectItem value="vanuatu">Vanuatu</SelectItem>
        <SelectItem value="vatican">Vatican City</SelectItem>
        <SelectItem value="venezuela">Venezuela</SelectItem>
        <SelectItem value="vietnam">Vietnam</SelectItem>
        <SelectItem value="yemen">Yemen</SelectItem>
        <SelectItem value="zambia">Zambia</SelectItem>
        <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Scrollable select with many options demonstrating height limitation.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      category: '',
      priority: '',
      assignee: '',
    });

    const handleChange = (field: string) => (value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
          <CardDescription>
            Fill out the form to create a new task.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleChange('category')}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">🐛 Bug</SelectItem>
                <SelectItem value="feature">✨ Feature</SelectItem>
                <SelectItem value="improvement">📈 Improvement</SelectItem>
                <SelectItem value="documentation">📚 Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={handleChange('priority')}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Low</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="high">🔴 High</SelectItem>
                <SelectItem value="urgent">🚨 Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={formData.assignee} onValueChange={handleChange('assignee')}>
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="bob">Bob Johnson</SelectItem>
                <SelectItem value="alice">Alice Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" disabled={!formData.category || !formData.priority}>
            Create Task
          </Button>
        </CardContent>
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete form example showing select components in a task creation form.',
      },
    },
  },
};

export const DisabledSelect: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="disabled-select">Disabled Select</Label>
        <Select disabled>
          <SelectTrigger id="disabled-select">
            <SelectValue placeholder="This select is disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="loading-select">Loading State</Label>
        <Select>
          <SelectTrigger id="loading-select" disabled>
            <SelectValue placeholder="Loading options..." />
          </SelectTrigger>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled and loading states for select components.',
      },
    },
  },
};

export const SelectWithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">💳 Credit Card</SelectItem>
            <SelectItem value="paypal">🅿️ PayPal</SelectItem>
            <SelectItem value="apple">📱 Apple Pay</SelectItem>
            <SelectItem value="google">🎯 Google Pay</SelectItem>
            <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-type">File Type</Label>
        <Select>
          <SelectTrigger id="file-type">
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">📄 PDF Document</SelectItem>
            <SelectItem value="doc">📝 Word Document</SelectItem>
            <SelectItem value="xls">📊 Excel Spreadsheet</SelectItem>
            <SelectItem value="ppt">📽️ PowerPoint Presentation</SelectItem>
            <SelectItem value="img">🖼️ Image File</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select components with icons for better visual context.',
      },
    },
  },
};



