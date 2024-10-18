import { X } from 'lucide-react';
import { useState } from 'react';

import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { unitAvailable } from '@/lib/options';

import { User } from '../../type';

type Props = {
  onClose: () => void;
  onConfirm: (data: User) => void;
  user: User;
};

const UserEditor = ({ onClose, onConfirm, user }: Props) => {
  const [newUser, setNewUser] = useState<User>(user);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Thông tin người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>
        <div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
                disabled={!!user.uid}
                value={newUser?.displayName}
                onChange={(e) =>
                  setNewUser((pre) => ({
                    ...(pre || { uid: '', email: '', avatar: '' }),
                    displayName: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                disabled={!!user.uid}
                value={newUser?.email}
                onChange={(e) =>
                  setNewUser((pre) => ({
                    ...(pre || { uid: '', displayName: '', avatar: '' }),
                    email: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Đơn vị
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                onValueChange={(v) =>
                  setNewUser((pre) => ({ ...pre, unit: v }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(unitAvailable).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              className="mr-2"
              onClick={() => {
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (!newUser.email || !newUser.unit) {
                  toast({
                    title: 'Thiếu thông tin',
                    description: 'Các thông tin bắc buộc không được để trống',
                    variant: 'destructive',
                  });
                  return;
                }
                onConfirm(newUser);
              }}
            >
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditor;
