import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Search, MoreHorizontal } from 'lucide-react';
import { fetchAdminUsers } from '../../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        const response = await fetchAdminUsers();

        setUsers(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.city?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        subtitle="Review accounts and platform access."
      />

      <div className="soft-card p-3">

        {/* SEARCH */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#eee1e8] w-fit mb-3">
          <Search
            size={14}
            className="text-[#9ca3b7]"
          />

          <input
            className="outline-none text-xs"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table">

            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>City</th>
                <th>Role</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 muted"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 muted"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id || user.id}
                  >
                    <td>
                      #{String(index + 1).padStart(4, '0')}
                    </td>

                    <td className="font-black">
                      {user.name || 'Unnamed User'}
                    </td>

                    <td>
                      {user.email || 'No email'}
                    </td>

                    <td>
                      {user.city || 'Not provided'}
                    </td>

                    <td>
                      <span className="badge bg-[#f1f5ff] text-[#4d72d7]">
                        {user.role || 'user'}
                      </span>
                    </td>

                    <td>
                      <span className="badge success">
                        Active
                      </span>
                    </td>

                    <td>
                      <MoreHorizontal size={16} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}