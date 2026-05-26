import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'reel',
  title: 'Video Reel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Cloudinary Video URL or Public ID',
      type: 'string',
      description: 'The URL or Public ID of the hosted MP4 video on Cloudinary.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnailImage',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category Tag',
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
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    }),
  ],
});
