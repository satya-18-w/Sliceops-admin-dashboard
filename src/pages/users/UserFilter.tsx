import { Card, Flex, Input, Select, Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { ReactNode } from "react";


type UserFilterProps = {
  onFilterChange: (filterName: string, filterValue: string) => void;
  children?: ReactNode;
}
const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card style={{ marginBottom: 20 }}>
      <Flex justify="space-between" align="center">
        {/* Left Side: Search and Filters */}
        <Flex gap="middle" align="center" style={{ flex: 1 }}>
          <Input.Search
            placeholder="Search users..."
            allowClear={true}
            style={{ maxWidth: 260 }}
            onChange={(e) => onFilterChange("SearchQuery", e.target.value)}
          />
          <Select
            defaultValue="All"
            placeholder="Select Role"
            style={{ width: 140 }}
            allowClear={true}
            onChange={(value) => onFilterChange("UserRole", value)}
            options={[
              {
                value: "All",
                label: "All Roles"
              },
              {
                value: "Manager",
                label: "Manager"
              }, {
                value: "Employee",
                label: "Employee"
              }, {
                value: "Admin",
                label: "Admin"
              }
            ]}
          />
          <Select
            placeholder="Select Status"
            style={{ width: 140 }}
            allowClear={true}
            onChange={(value) => onFilterChange("UserStatus", value)}
            options={[
              {
                value: "Active",
                label: "Active"
              },
              {
                value: "Inactive",
                label: "Inactive"
              }, {
                value: "Ban",
                label: "Ban"
              }
            ]}
          />
        </Flex>

        {/* Right Side: Action Button */}
        <Flex gap="small" align="center">
          {children}
         
        </Flex>
      </Flex>
    </Card>
  )
}

export default UserFilter
