import type { Meta, StoryObj } from '@storybook/react-vite';
import { DrawerBroken } from './DrawerBroken';

const meta = {
  title: 'Broken/Drawer',
  component: DrawerBroken,
} satisfies Meta<typeof DrawerBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
