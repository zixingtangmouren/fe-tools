module.exports = class BaseIPC {
  constructor(props) {
    this.processKey = props.processKey;
    this.processMessagePortMap = {};
    this.portChannelMap = {};
  }

  send(channel, data) {
    for (const [_, processMessagePort] of Object.entries(
      this.processMessagePortMap
    )) {
      processMessagePort.messagePort?.postMessage({
        channel,
        header: {},
        data,
      });
    }
  }

  on(channel, handler) {
    if (!this.portChannelMap[channel]) {
      this.portChannelMap[channel] = {
        callbacks: [],
      };
    }

    this.portChannelMap[channel].callbacks.push(handler);
  }

  handleMessages({ channel, header, data }) {
    const callbacks = this.portChannelMap[channel]?.callbacks;
    if (this.portChannelMap[channel]?.callbacks) {
      callbacks.forEach((handler) => {
        handler({}, data);
      });
    }
  }
};
