import type { Meta, StoryObj } from 'storybook-solidjs';
import {SolidLogo} from '.';

const meta: Meta<typeof SolidLogo> = {
  component: SolidLogo,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' }
  },
};
export default meta;

type Story = StoryObj<typeof SolidLogo>;

export const Default: Story = {};
