// Module qui s'occupe de sélectionner les données que les posts vont retourner

// Retourne les détails d'un post

function getPostDetailsFormat (post) {
  try {
    return {
      title: post.title,
      picture: post.picture?.secureUrl,
      description: post.description,
      createdAt: post.createdAt
    };
  } catch (error) {
    throw error;
  }
}

function getAllPostsFormat (posts) {
  try {
    if (!posts.length) {
      return [];
    } else {
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        picture: post.picture?.secureUrl,
        createdAt: post.createdAt
      }));
    }
  } catch (error) {
    throw error;
  }
}

export default {
  getPostDetailsFormat,
  getAllPostsFormat
}
