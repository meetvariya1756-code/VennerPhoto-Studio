import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Global Site Settings',
  type: 'document',
  description: 'Manage studio info, address, opening hours, contact nodes, and map references.',
  fields: [
    defineField({
      name: 'studioName',
      title: 'Studio Name',
      type: 'string',
      initialValue: 'Venner Photo Studio',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Slogan',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Studio Logo Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'phone',
      title: 'Studio Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Studio Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Physical Studio Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'workingHours',
      title: 'Studio Working Hours',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram Handle URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook Page URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Channel URL',
      type: 'url',
    }),
    defineField({
      name: 'googleMapEmbedUrl',
      title: 'Google Maps Embed iframe source URL',
      type: 'url',
      description: 'The src value of the Google Maps iframe embed share code.',
    }),
  ],
});
