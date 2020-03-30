import handleInput from './createApi';
import * as path from 'path';

const publicPath = path.resolve('./public');

exports.onPreBuild = async ({ graphql }: { graphql: any }, _pluginOptions: any) => {
  const results = await graphql(`
    {
      allModules {
        edges {
          node {
            moduleId
            authors
            dependencies {
              id
              versionConstrain
            }
            description
            downloadUrl
            name
            releaseNotes
            sourceUrl
            updatedAt
            version
          }
        }
      }
    }
  `);
  const modules = results.data.allModules.edges;
  console.log(publicPath);
  await handleInput(
    publicPath,
    modules.map((module: any) => module.node)
  );
};

exports.onCreateNode = async (allActions: any) => {
  const { node, actions, loadNodeContent, createNodeId, createContentDigest } = allActions;
  function transformObject(obj: any, id: string) {
    const jsonNode = {
      ...obj,
      id,
      moduleId: obj.id,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(obj),
        type: 'Modules'
      }
    };
    createNode(jsonNode);
    createParentChildLink({ parent: node, child: jsonNode });
  }

  const { createNode, createParentChildLink } = actions;

  // We only care about JSON content.
  if (node.internal.mediaType !== `application/json`) {
    return;
  }

  const content = await loadNodeContent(node);
  const parsedContent = JSON.parse(content);

  transformObject(parsedContent, createNodeId(`${node.id} >>> JSON`));
};
