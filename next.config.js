/** @type {import('next').NextConfig} */


const nextConfig = {
  webpack: (config) => {
    // fs
    config.resolve.fallback = { fs: false };
    
    // this will override the experiments
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      asyncWebAssembly: true, // for tiktoken
    };
    // this will just update topLevelAwait property of config.experiments
    config.experiments.topLevelAwait = true 
    return config;
  },
  
};



module.exports = nextConfig