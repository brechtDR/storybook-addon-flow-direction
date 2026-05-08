import type { Meta, StoryObj } from '@storybook/react-vite';
import { StaticCardBroken } from './StaticCardBroken';

const meta = {
  title: 'Broken/Static Card',
  component: StaticCardBroken,
} satisfies Meta<typeof StaticCardBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
