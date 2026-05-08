import type { Meta, StoryObj } from '@storybook/react-vite';
import { StaticCard } from './StaticCard';

const meta = {
  title: 'Working/Static Card',
  component: StaticCard,
} satisfies Meta<typeof StaticCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
