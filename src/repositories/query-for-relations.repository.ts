export default function buildQueryRelations(
  relationName: string,
  relation: any,
) {
  return {
    query: {
      bool: {
        must: [
          {
            nested: {
              path: relationName,
              query: {
                exists: {
                  field: relationName,
                },
              },
            },
          },
          {
            nested: {
              path: relationName,
              query: {
                term: {
                  [`${relationName}.id`]: relation.id,
                },
              },
            },
          },
        ],
      },
    },
  };
}
