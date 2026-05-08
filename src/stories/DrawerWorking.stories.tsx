import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';

const meta = {
  title: 'Working/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
