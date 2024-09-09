import { useNavigate } from '@tanstack/react-router';

import ErrorDisplay from '@/components/error-display';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ErrorDisplay
        title="404"
        message="Sorry, Page not found"
        buttonText="Back to home >"
        action={() => navigate({ to: '/', replace: true })}
      />
    </div>
  );
};

export default NotFound;
