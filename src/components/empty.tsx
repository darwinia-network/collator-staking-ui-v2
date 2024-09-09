const Empty = ({ label }: { label: string }) => {
  return (
    <div className="flex h-[10rem] flex-col items-center justify-center gap-[0.625rem] rounded-medium bg-secondary">
      <div className="flex flex-col items-center gap-[0.625rem]">
        <img src="/images/common/empty.svg" alt="empty" className="h-[56px] w-[116px]" />
        <p className="m-0 text-[0.75rem] font-normal text-foreground/50">{label}</p>
      </div>
    </div>
  );
};

export default Empty;
