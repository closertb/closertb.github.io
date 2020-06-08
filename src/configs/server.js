export default (env => ({
  local: 'https://closertb.site/arcticle/graphql',
  dev: 'https://closertb.site/arcticle/graphql',
  qa: 'https://closertb.site/arcticle/graphql',
  prod: 'https://closertb.site/arcticle/graphql'
}[env]))(process.env.DEPLOY_ENV);
