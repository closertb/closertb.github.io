export default (env => ({
  local: 'http://127.0.0.1:3000/arcticle/graphql',
  dev: 'https://closertb.site/arcticle/graphql',
  qa: 'https://closertb.site/arcticle/graphql',
  prod: 'https://closertb.site/arcticle/graphql'
}[env]))(process.env.DEPLOY_ENV);
