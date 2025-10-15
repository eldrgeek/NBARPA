import React from 'react';
import { MarkdownPage } from '../components/MarkdownPage';
import { UserCheck } from 'lucide-react';
import content from '../content/active-player.md?raw';

export const ActivePlayer: React.FC = () => {
  return (
    <MarkdownPage
      contentPath="../content/active-player.md"
      title="Active Player Journey"
      icon={UserCheck}
      accentColor="from-blue-500 to-blue-600"
    />
  );
};

// Export the markdown content for dynamic import
export default content;