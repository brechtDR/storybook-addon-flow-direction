import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingTileBroken } from './PricingTileBroken';

const meta = {
  title: 'Broken/PricingTile',
  component: PricingTileBroken,
} satisfies Meta<typeof PricingTileBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
