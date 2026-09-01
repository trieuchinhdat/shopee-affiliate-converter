import { defineType, defineField } from 'sanity';

export const adminUser = defineType({
  name: 'adminUser',
  title: 'Quản lý user',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: 'Tên đăng nhập',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập tên đăng nhập'),
    }),
    defineField({
      name: 'password',
      title: 'Mật khẩu đăng nhập',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bắt buộc nhập mật khẩu'),
    }),
    defineField({
      name: 'fullName',
      title: 'Họ và tên',
      type: 'string',
      initialValue: 'Quản Trị Viên',
    }),
    defineField({
      name: 'role',
      title: 'Vai trò',
      type: 'string',
      options: {
        list: [
          { title: 'Quản trị viên (Admin)', value: 'admin' },
          { title: 'Biên tập viên (Editor)', value: 'editor' },
          { title: 'Xem báo cáo (Viewer)', value: 'viewer' },
        ],
      },
      initialValue: 'admin',
    }),
    defineField({
      name: 'status',
      title: 'Trạng thái hoạt động',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Hoạt động (Active)', value: 'active' },
          { title: '🔴 Khóa tài khoản (Inactive)', value: 'inactive' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'lastLogin',
      title: 'Thời gian đăng nhập gần nhất',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'username',
      status: 'status',
      role: 'role',
    },
    prepare({ title, subtitle, status, role }) {
      const isAct = status === 'active';
      return {
        title: `${isAct ? '🟢' : '🔴'} ${title || subtitle} (${role || 'admin'})`,
        subtitle: `Tên đăng nhập: ${subtitle || 'Chưa đặt'}`,
      };
    },
  },
});
