import { Button } from '@/components/ui/shadcn/button.tsx';

interface PageNavigationButtonProperties {
  page: number;
  isActive: boolean;
  onClick: (page: number) => void;
}

const PageNavigationButton = ({
  page,
  isActive,
  onClick,
}: PageNavigationButtonProperties) => (
  <Button
    variant={isActive ? 'default' : 'outline'}
    size='sm'
    onClick={() => onClick(page)}
  >
    {page + 1}
  </Button>
);

export default PageNavigationButton;
