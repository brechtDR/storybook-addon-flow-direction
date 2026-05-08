import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollSnapStrip } from './ScrollSnapStrip';

const meta = {
  title: 'Working/Scroll Snap',
  component: ScrollSnapStrip,
} satisfies Meta<typeof ScrollSnapStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
