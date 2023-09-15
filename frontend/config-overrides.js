// config-overrides.js
module.exports = function override(config, env) {
  // ...その他の設定

  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
  };

  if (env === 'development') {
    config.devServer = {
      ...(config.devServer || {}), // 既存のdevServer設定を維持
      allowedHosts: ['near-infrared-frontend'],
    };
  }

  return config;
};