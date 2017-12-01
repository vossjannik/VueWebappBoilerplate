class Connection {
  open ({ url }) {
    if ('_' in this) throw new Error('connection already initialized')
    this._ = {
      handlers: new Map(),
      timeout: null,
      timeoutMs: 200,
      ws: null,
      url,
    }
    console.log('opening')
    this._init()
  }
  send (topic, data) {
    if (!this._.ws ||
        this._.ws.readyState !== window.WebSocket.OPEN ||
        !topic
    ) {
      console.log('connection currently unavailable')
      return false
    }
    this._.ws.send(JSON.stringify({ topic, data }))
    return true
  }
  on (topic, cb, once = false) {
    const tmp = { cb, once }
    if (this._.handlers.has(topic)) this._.handlers.get(topic).push(tmp)
    else this._.handlers.set(topic, [tmp])
  }
  once (topic, cb) {
    this.on(topic, cb, true)
  }
  _init () {
    if (window.navigator.onLine) {
      console.log('connecting...')
      this._.ws = new window.WebSocket(this._.url)
      this._.ws.onopen = this._open.bind(this)
      this._.ws.onerror = this._error.bind(this)
      this._.ws.onmessage = this._message.bind(this)
      this._.ws.onclose = this._close.bind(this)
    } else {
      console.log('waiting for a network...')
      if (this._.timeout) clearTimeout(this._.timeout)
      this._.timeout = setTimeout(this._init.bind(this), this._.timeoutMs)
    }
  }
  _open () {
    this._callHandlers('connect')
  }
  _error () {
    // dismiss
  }
  _message (event) {
    let obj = null
    try {
      obj = JSON.parse(event.data)
      if (!('topic' in obj) || !('data' in obj)) return
    } catch (err) { return } // dismiss message
    this._callHandlers(obj.topic, obj.data)
  }
  _close () {
    // clear
    this._.ws = null
    if (this._.timeout) clearTimeout(this._.timeout)

    // handle
    this._callHandlers('disconnect')

    // reconnect after delay
    this._.timeout = setTimeout(this._init.bind(this), this._.timeoutMs)
  }
  _callHandlers (topic, arg = null) {
    if (!this._.handlers.has(topic)) {
      console.log('no handler found for topic: ' + topic)
      return
    }

    const hasArg = (arg !== null && arg !== undefined)

    const ref = this._.handlers.get(topic)
    for (let i = 0; i < ref.length; ++i) {
      const handler = ref[i]
      if (hasArg) handler.cb(arg)
      else handler.cb()
      if (handler.once) {
        if (ref.length <= 1) {
          this._.handlers.remove(topic)
          return
        } else ref.slice(i, 1)
      }
    }
  }
}

const instance = new Connection() // create singleton
export default instance
