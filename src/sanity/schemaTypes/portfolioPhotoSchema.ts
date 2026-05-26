import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'portfolioPhoto',
  title: 'Portfolio Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category Reference or Select',
      type: 'string',
      options: {
        list: [
          { title: 'Wedding Photography', value: 'wedding-photography' },
          { title: 'Engagement Photography', value: 'engagement-photography' },
          { title: 'Baby Shower Photography', value: 'baby-shower-photography' },
          { title: 'Children Photography', value: 'children-photography' },
          { title: 'Indoor Studio Photography', value: 'indoor-studio-photography' },
          { title: 'Product Photography', value: 'product-photography' },
          { title: 'Modeling Photography', value: 'modeling-photography' },
          { title: 'Corporate Event Photography', value: 'corporate-event-photography' },
          { title: 'Birthday Photography', value: 'birthday-photography' },
          { title: 'Maternity Photography', value: 'maternity-photography' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'capturedDate',
      title: 'Captured Date',
      type: 'date',
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text (for Accessibility)',
      type: 'string',
    }),
  ],
});
