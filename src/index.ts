class TiktokVideo extends HTMLElement {
  videoId!: string

  connectedCallback() {
    // We'll get custom attributes
    this.videoId = this.getAttribute('videoid')!
    const thumbnailUrl = this.getAttribute('thumbnailurl')

    this.style.backgroundImage = `url(${thumbnailUrl})`

    this.addEventListener('click', this.activateVideo)
    this.addEventListener('keydown', this.handleKeyPress)
  }

  activateVideo() {
    this.style.backgroundImage = 'unset'

    this.querySelector(`#Id${this.videoId}`)?.remove()

    const iframeEl = this.createIframe()
    this.append(iframeEl)
    iframeEl.focus()

    this.unMutePlayerByDefault()
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.activateVideo()
    }
  }

  createIframe() {
    const iframeEl = document.createElement('iframe')
    iframeEl.width = '320'
    iframeEl.height = '570'
    iframeEl.classList.add('rounded-2xl', 'w-full', 'h-full', 'snap-center')
    iframeEl.title = this.getAttribute('data-title')!
    iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; transparency'
    iframeEl.allowFullscreen = true
    iframeEl.src = `https://www.tiktok.com/player/v1/${this.videoId}?autoplay=1`

    return iframeEl
  }

  unMutePlayerByDefault() {
    const messageHandler = (event: MessageEvent) => {
      if (event.origin === 'https://www.tiktok.com' && event.data.type === 'onPlayerReady') {
        this.querySelector('iframe')!.contentWindow!.postMessage({ type: 'unMute', 'x-tiktok-player': true }, '*')

        window.removeEventListener('message', messageHandler)
      }
    }

    window.addEventListener('message', messageHandler)
  }
}

customElements.define('tiktok-video', TiktokVideo)
