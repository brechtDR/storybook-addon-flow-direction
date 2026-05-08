import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowCard } from './FlowCard';

const meta = {
  title: 'Working/Card',
  component: FlowCard,
} satisfies Meta<typeof FlowCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
