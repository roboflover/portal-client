module.exports = {
    images: {
      domains: ['storage.yandexcloud.net'],
    },
    apps: [{
      name: "app1",
      script: "node_modules/next/dist/bin/next",
      //args: "start"
    }]
};