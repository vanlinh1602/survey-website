import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserStore } from '@/features/user/hooks';
import { User } from '@/features/user/type';
import formatError from '@/utils/formatError';

export default function UserManagement() {
  const { toast } = useToast();
  const { getUser, handling, allUser, addUser, deleteUser, activeUser } =
    useUserStore(
      useShallow((state) => ({
        getUser: state.getUsers,
        handling: state.handling,
        allUser: state.users,
        addUser: state.addUser,
        deleteUser: state.deleteUser,
        activeUser: state.information,
      }))
    );

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>();

  useEffect(() => {
    try {
      getUser();
    } catch (error) {
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  }, [getUser, toast]);

  useEffect(() => {
    setUsers(Object.values(allUser));
  }, [allUser]);

  return (
    <div className="container mx-auto p-4">
      {handling ? <Waiting /> : null}
      <Dialog open={!!newUser}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setNewUser({ uid: '', email: '', displayName: '', avatar: '' });
            }}
            className="mb-4"
          >
            Thêm người dùng
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người dùng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên
              </Label>
              <Input
                id="name"
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
              </Label>
              <Input
                id="email"
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
          </div>
          <Button
            onClick={() => {
              if (newUser) {
                addUser(newUser.email, newUser);
                setNewUser(undefined);
              }
            }}
          >
            Thêm
          </Button>
        </DialogContent>
      </Dialog>

      <Table className="bg-white rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.displayName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {activeUser?.email !== user.email ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteUser(user.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
