import { Meta } from '@storybook/react';

import { Example } from './example';

const meta: Meta = {
  title: 'Welcome',
  component: App,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template = () => <App />;

export const Default = Template.bind({});

function App() {
  return <Example/>
}
