import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mock_project_id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Venner Studio CMS',

  projectId: projectId === 'mock_project_id' ? 'your_sanity_project_id' : projectId,
  dataset: dataset,
  basePath: '/studio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
