import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Client Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type / Occasion',
      type: 'string',
      description: 'e.g., Wedding Photography, Corporate Branding',
    }),
    defineField({
      name: 'quote',
      title: 'Client Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1 - 5 stars)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'clientPhoto',
      title: 'Client Photo (Optional)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
