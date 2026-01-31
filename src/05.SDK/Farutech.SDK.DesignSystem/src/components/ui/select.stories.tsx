import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choose a country</label>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
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
};