import { Edit2, FilterIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserEditor } from '@/features/user/components';
import { useUserStore } from '@/features/user/hooks';
import { User } from '@/features/user/type';
import { unitAvailable } from '@/lib/options';
import formatError from '@/utils/formatError';

import { Filter } from './Filter';

export default function UserManagement() {
  const { toast } = useToast();
  const {
    getUsers,
    handling,
    allUser,
    updateUser,
    deleteUser,
    activeUser,
    addUser,
  } = useUserStore(
    useShallow((state) => ({
      getUsers: state.getUsers,
      handling: state.handling,
      allUser: state.users,
      updateUser: state.updateUser,
      addUser: state.addUser,
      deleteUser: state.deleteUser,
      activeUser: state.information,
    }))
  );

  const [users, setUsers] = useState<User[]>([]);
  const [userDialog, setUserDialog] = useState<User>();
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      if (activeUser?.unit !== 'xbot') {
        const filter = { unit: activeUser?.unit || '' };
        getUsers(filter);
      } else {
        getUsers();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  }, [activeUser?.unit, getUsers, toast]);

  useEffect(() => {
    setUsers(Object.values(allUser));
  }, [allUser]);

  const handleFilter = (filter: { unit?: string }) => {
    const filteredUsers = Object.values(allUser).filter(
      (user) => !filter.unit || user.unit === filter.unit
    );
    setUsers(filteredUsers);
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      {handling ? <Waiting /> : null}
      {userDialog ? (
        <UserEditor
          user={userDialog}
          onConfirm={(newUser) => {
            if (newUser.uid) {
              updateUser(newUser.email, newUser);
            } else {
              addUser(newUser.email, newUser);
            }
            setUserDialog(undefined);
          }}
          onClose={() => setUserDialog(undefined)}
        />
      ) : null}
      {activeUser?.unit === 'xbot' ? (
        <div className="flex justify-between">
          <Button
            onClick={() =>
              setUserDialog({
                email: '',
                displayName: '',
                unit: '',
                avatar: '',
                uid: '',
              })
            }
            className="mb-4"
          >
            Thêm người dùng
          </Button>
          <div>
            <Button
              aria-label="Filter"
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsFilterDropdownOpen((pre) => !pre)}
            >
              <FilterIcon className="mr-2" /> Lọc
            </Button>
            {isFilterDropdownOpen ? (
              <Filter
                onClose={() => setIsFilterDropdownOpen(false)}
                onFilter={handleFilter}
              />
            ) : null}
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Đơn vị</TableHead>
                {activeUser?.unit !== 'xbot' ? null : (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{unitAvailable[user.unit]}</TableCell>
                  {activeUser?.unit !== 'xbot' ? null : (
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setUserDialog(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {activeUser?.email !== user.email ? (
                        <Button
                          className="ml-2"
                          variant="outline"
                          size="icon"
                          onClick={() => deleteUser(user.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
