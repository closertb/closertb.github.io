const resolvers = {
  Mutation: {
    changeStatus: (_, { status }, { cache }) => {
      const data = { readStatus: status };
      cache.writeData({ data });
      return null;
    },
  },
};
export default resolvers; // 暂未使用
