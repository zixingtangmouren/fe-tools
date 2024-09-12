const npm = require('npm');

class PluginsService {
  constructor() {
    this.plugins = [];
  }

  installPlugin(plugin) {
    npm.commands.install([plugin], (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
    }});

    npm.register.log.on('log', (msg) => {
      console.log('msg >>>>', msg)
    })
  }

  getPlugins() {
    return this.plugins;
  }

  register(plugin) {
    this.plugins.push(plugin);
  }

}

module.exports = PluginsService;