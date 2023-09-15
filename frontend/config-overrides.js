// config-overrides.js
module.exports = function override(config, env) {
    // ...その他の設定
  
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      "stream": require.resolve("stream-browserify")
    };
  
    return config;
  };
  