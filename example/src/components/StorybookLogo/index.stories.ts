import type { Meta, StoryObj } from 'storybook-solidjs';
import { StorybookLogo } from '.';

const meta: Meta<typeof StorybookLogo> = {
  component: StorybookLogo,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
};
export default meta;

type Story = StoryObj<typeof StorybookLogo>;

export const Default: Story = {};
