import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmRemove = ({ onClose, onConfirm }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Xóa khảo sát</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <div>
          Xóa khảo sát bao gồm xóa tất cả phản hồi của khảo sát này, sau khi
          xóa, dữ liệu sẽ không thể khôi phục. Bạn có chắc chắn muốn xóa?
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="mr-2">
            Hủy
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemove;
