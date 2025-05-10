"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "../_components/data-table";
import { userApi } from "@/lib/backend_api/user";
import { toast } from "sonner";

// Update User type to match backend
export type User = {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  nationality: string;
  password?: string; 
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
};

export default function UsersPage() {
  // Update initial users state to match User type
  const [users, setUsers] = useState<User[]>([]);
  
  // Update initial currentUser state with all required fields
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    nationality: "",
    role: "user",
    status: "active"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        // Make sure we're setting the correct data structure
        setUsers(response || []);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch users');
        setUsers([]); // Set empty array on error
      }
    };
    fetchUsers();
  }, []);

  // Add this function near your other handlers
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setCurrentUser({ ...currentUser, password: password });
  };

  // Add this in your dialog form, after the nationality input
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="password" className="text-right">
      Password
    </Label>
    <div className="col-span-3 flex gap-2">
      <Input
        id="password"
        type="text"
        value={currentUser.password || ''}
        onChange={(e) =>
          setCurrentUser({ ...currentUser, password: e.target.value })
        }
        className="flex-1"
        placeholder="Enter password"
      />
      <Button
        type="button"
        variant="outline"
        onClick={generatePassword}
      >
        Generate
      </Button>
    </div>
  </div>

  // Update the handleSaveUser function to include password
  const handleSaveUser = async () => {
    if (currentUser.firstname && currentUser.email && currentUser.password) {
      try {
        if (dialogMode === "add") {
          const response = await userApi.createUser({
            ...currentUser,
            firstname: currentUser.firstname,
            lastname: currentUser.lastname || '',
            email: currentUser.email,
            ...(currentUser.password && { password: currentUser.password }), // Only include password if it exists
            mobile: currentUser.mobile || '',
            nationality: currentUser.nationality || '',
            status: 'active',
            role: currentUser.role || 'user',
          });
          setUsers([...users, response]); // Remove .data
          toast.success('User created successfully');
        } else {
          const response = await userApi.updateUser(currentUser.user_id!, {
            firstname: currentUser.firstname,
            lastname: currentUser.lastname,
            email: currentUser.email,
            role: currentUser.role,
          });
          setUsers(users.map((user) => 
            user.user_id === currentUser.user_id ? response : user // Remove .data
          ));
          toast.success('User updated successfully');
        }

        setIsDialogOpen(false);
        setCurrentUser({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          nationality: "",
          role: "user",
          status: "active"
        });
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Failed to save user');
      }
    }
  };

  const handleDeleteUsers = (rowsToDelete: User[]) => {
    setUsers(
      users.filter((user) => !rowsToDelete.some((row) => row.user_id === user.user_id))
    );
  };

  const handleDeleteSingleUser = (userId: string) => {
    setUsers(users.filter((user) => user.user_id !== userId));
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstname",
      header: "First Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("firstname")}</div>
      ),
    },
    {
      accessorKey: "lastname",
      header: "Last Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lastname")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role");
        return (
          <Badge
          variant={role === "admin" ? "default" : "secondary"}
          >
            {role as string}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <p>Name: {user.firstname} {user.lastname}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Mobile: {user.mobile}</p>
                    <p>Nationality: {user.nationality}</p>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  openEditDialog(user);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleDeleteSingleUser(user.user_id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  // Update form fields to match new User type
  const handleAddUser = () => {
    setCurrentUser({
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      nationality: "",
      role: "user",
      status: "active"
    });
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Add New User" : "Edit User"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstname" className="text-right">
                First Name
              </Label>
              <Input
                id="firstname"
                value={currentUser.firstname}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, firstname: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastname" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastname"
                value={currentUser.lastname}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, lastname: e.target.value })
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
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input
                id="mobile"
                value={currentUser.mobile}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, mobile: e.target.value })
                }
                className="col-span-3"
                placeholder="+1234567890"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nationality" className="text-right">
                Nationality
              </Label>
              <Input
                id="nationality"
                value={currentUser.nationality}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, nationality: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter nationality"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={currentUser.password || ''}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, password: e.target.value })
                  }
                  className="flex-1"
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={currentUser.role}
                onValueChange={(value) =>
                  setCurrentUser({
                    ...currentUser,
                    role: value as "admin" | "user",
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent id="role">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveUser}>
              {dialogMode === "add" ? "Add User" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={users}
        onAdd={handleAddUser}
        onDelete={handleDeleteUsers}
      />
    </div>
  );
}