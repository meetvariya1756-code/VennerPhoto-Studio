import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., Lead Photographer, Chief Retoucher',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'specialization',
      title: 'Core Specialization',
      type: 'string',
      description: 'e.g., Outdoor lighting, fashion grading',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Profile Link',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
});
