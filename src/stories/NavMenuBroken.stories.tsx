import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavMenuBroken } from './NavMenuBroken';

const meta = {
  title: 'Broken/NavMenu',
  component: NavMenuBroken,
} satisfies Meta<typeof NavMenuBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
