import { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `
          <h1>HippoAssets</h1>
          <h2>Please verify your email</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${token}">Verify</a>
        `
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'role',
      defaultValue: 'user',
      required: true,

      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
