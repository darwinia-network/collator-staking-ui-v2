interface CollatorStatusProps {
  status: 'active' | 'inactive' | 'waiting';
}
const CollatorStatus = ({ status }: CollatorStatusProps) => {
  switch (status) {
    case 'active':
      return (
        <div className="rounded-medium bg-[#5ED62A] px-[0.3125rem] py-[0.125rem] text-[0.5rem] font-bold text-white">
          Active
        </div>
      );
    case 'inactive':
      return (
        <div className="rounded-medium bg-[#C6C6C6] px-[0.3125rem] py-[0.125rem] text-[0.5rem] font-bold text-white">
          Inactive
        </div>
      );
    case 'waiting':
      return (
        <div className="rounded-medium bg-[#FFB732] px-[0.3125rem] py-[0.125rem] text-[0.5rem] font-bold text-white">
          Waiting
        </div>
      );
  }
};

export default CollatorStatus;
