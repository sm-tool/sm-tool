import { GitFork, LucideProps } from 'lucide-react';
import React from 'react';

const GitForkRotated = React.forwardRef<SVGSVGElement, LucideProps>(
  (properties, reference) => (
    <GitFork
      ref={reference}
      className={`rotate-90 size-5 ${properties.className || ''}`}
      {...properties}
    />
  ),
);

GitForkRotated.displayName = 'GitForkRotated';

export default GitForkRotated;
