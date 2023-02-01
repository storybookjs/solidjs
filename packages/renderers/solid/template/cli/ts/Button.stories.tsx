import type { StoryObj, Meta } from '@storybook/html';
import type { ButtonProps } from './Button';
import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/html/writing-stories/introduction#default-export
const meta: Meta<ButtonProps> = {
  title: 'Example/Button',
  tags: ['autodocs'],
  render: (args) => <Button {...args} />,
};

export default meta;
type Story = StoryObj<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/html/writing-stories/args
export const Primary: Story = {
  args: {},
};
