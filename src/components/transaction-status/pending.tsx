const TransactionPending = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="rolling-square-container">
        <div className="rolling-square"></div>
      </div>
      <p className="text-center text-[1.125rem] font-bold text-foreground">
        Transaction is being processing
      </p>
    </div>
  );
};

export default TransactionPending;
