export default (env => ({
  local: 'https://closertb.ronghuizt.cn/arcticle/graphql',
  dev: 'https://closertb.ronghuizt.cn/arcticle/graphql',
  qa: 'https://closertb.ronghuizt.cn/arcticle/graphql',
  prod: 'https://closertb.ronghuizt.cn/arcticle/graphql'
}[env]))(process.env.DEPLOY_ENV);
