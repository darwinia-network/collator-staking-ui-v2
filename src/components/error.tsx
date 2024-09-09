import ErrorDisplay from '@/components/error-display';

const Error = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ErrorDisplay
        title="Error"
        message="Sorry, something went wrong"
        buttonText="Refresh"
        action={() => window.location.reload()}
      />
    </div>
  );
};

export default Error;
