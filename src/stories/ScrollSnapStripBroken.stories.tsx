import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollSnapStripBroken } from './ScrollSnapStripBroken';

const meta = {
  title: 'Broken/Scroll Snap',
  component: ScrollSnapStripBroken,
} satisfies Meta<typeof ScrollSnapStripBroken>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
