import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingTile } from './PricingTile';

const meta = {
  title: 'Working/PricingTile',
  component: PricingTile,
} satisfies Meta<typeof PricingTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
