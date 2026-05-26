import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mock_project_id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineCliConfig({
  api: {
    projectId: projectId === 'mock_project_id' ? 'your_sanity_project_id' : projectId,
    dataset: dataset,
  }
});
