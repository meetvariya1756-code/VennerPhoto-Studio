import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Photography Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Service Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'packages',
      title: 'Pricing Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'package',
          title: 'Package Tier',
          fields: [
            { name: 'packageName', title: 'Package Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'price', title: 'Price', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'features', title: 'Features Included', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Sorting Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
});
