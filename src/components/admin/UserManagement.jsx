import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Spinner from '../ui/Spinner';
import UserForm from './UserForm';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [users, setUsers] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadUsers = async () => {
    const data = await userService.getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (!users) return <Spinner label={t('common.loading')} />;

  const handleAdd = async (form) => {
    try {
      await userService.addUser(form);
      toast.success(t('admin.users.add'));
      setShowAdd(false);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || 'Could not add user');
      throw err;
    }
  };

  const handleEdit = async (form) => {
    try {
      await userService.updateUser(editing.id, form);
      toast.success(t('common.update'));
      setEditing(null);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || 'Could not update user');
      throw err;
    }
  };

  const toggleActive = async (u) => {
    try {
      await userService.updateUser(u.id, { active: !u.active });
      await loadUsers();
    } catch (err) {
      toast.error(err.message || 'Could not update user');
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleting.id);
      toast.success(t('common.delete'));
      setDeleting(null);
      await loadUsers();
    } catch (err) {
      toast.error(err.message || 'Could not delete user');
    }
  };

  return (
    <div>
      <div className="admin-users-header">
        <Button onClick={() => setShowAdd(true)}>+ {t('admin.users.add')}</Button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('common.name')}</th>
              <th>{t('admin.users.username')}</th>
              <th>{t('admin.users.role')}</th>
              <th>{t('common.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td data-label={t('common.name')}>{u.name}</td>
                <td data-label={t('admin.users.username')}>{u.username}</td>
                <td data-label={t('admin.users.role')}>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge--primary' : ''}`}>
                    {u.role === 'ADMIN' ? t('admin.users.role.admin') : t('admin.users.role.user')}
                  </span>
                </td>
                <td data-label={t('common.status')}>
                  <button className="badge-toggle" onClick={() => toggleActive(u)}>
                    {u.active ? t('common.active') : t('common.inactive')}
                  </button>
                </td>
                <td data-label={t('common.actions')} className="data-table__actions">
                  <button className="icon-btn" title={t('common.edit')} onClick={() => setEditing(u)}>
                    ✏️
                  </button>
                  <button
                    className="icon-btn icon-btn--danger"
                    title={t('common.delete')}
                    disabled={u.id === currentUser?.id}
                    onClick={() => setDeleting(u)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} title={t('admin.users.add')} onClose={() => setShowAdd(false)}>
        <UserForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!editing} title={t('common.edit')} onClose={() => setEditing(null)}>
        {editing && (
          <UserForm
            initialValue={editing}
            requirePassword={false}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title={t('common.delete')}
        message={
          deleting?.id === currentUser?.id
            ? t('admin.users.cannotDeleteSelf')
            : `${t('common.delete')} "${deleting?.name}"?`
        }
        confirmLabel={t('common.delete')}
        onConfirm={deleting?.id === currentUser?.id ? () => setDeleting(null) : handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
