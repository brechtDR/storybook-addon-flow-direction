import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastBroken } from './ToastBroken';

const meta = {
  title: 'Broken/Toast',
  component: ToastBroken,
} satisfies Meta<typeof ToastBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
