import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowCardBroken } from './FlowCardBroken';

const meta = {
  title: 'Broken/Card',
  component: FlowCardBroken,
} satisfies Meta<typeof FlowCardBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
