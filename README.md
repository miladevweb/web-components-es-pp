<br>

# <div align="center">Web Components</div>

Los Web Components tienen algunos métodos por defecto que puedes usar para manejar el ciclo de vida del componente. Aquí te explico los más importantes:

> ## Métodos del Ciclo de Vida:

**_constructor():_** Este es el método que se llama cuando se crea una instancia del componente. Aquí puedes inicializar propiedades, crear el Shadow DOM y establecer el contenido inicial.

**_connectedCallback():_** Se invoca cada vez que el componente se añade al DOM. Es útil para realizar tareas como agregar event listeners o hacer peticiones de datos.

**_disconnectedCallback():_** Se llama cuando el componente es eliminado del DOM. Puedes usarlo para limpiar recursos, como remover event listeners.

**_attributeChangedCallback(attrName, oldValue, newValue):_** Este método se llama cuando un atributo del componente cambia. Debes declarar los atributos que deseas observar en el método estático observedAttributes.

**_adoptedCallback():_** Se invoca cuando el componente es movido a un nuevo documento (por ejemplo, si se mueve entre iframes).

<br>

> ## Example:

<details>
  <summary>HTML</summary>

```html
<!-- We can add custom attributes -->
<tiktok-video
  tabindex="0"
  role="button"
  data-title="{title}"
  class="rounded-2xl size-full"
  aria-label="Reproducir video"
  videoid="{videoId}"
  thumbnailurl="{thumbnailUrl}"
>
  <div
    class="p-4 pl-[18px] bg-white rounded-full absolute bottom-6 right-6 hover:scale-110 transition-transform duration-300"
    id="Id${videoId}"
    title="{title}"
  >
    <Icon
      name="play"
      class="text-primary"
    />
  </div>
</tiktok-video>
```

</details>

<details>
  <summary>TypeScript</summary>

```ts
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
```

</details>

<br>

> ## Example with all the methods:

<details>
  <summary>HTML</summary>

```html
<mi-componente data-mensaje="¡Hola, mundo!"></mi-componente>
```

</details>

<details>
  <summary>TypeScript</summary>

```ts
class MiComponente extends HTMLElement {
  private contenedor: HTMLDivElement

  static get observedAttributes(): string[] {
    return ['data-mensaje']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.contenedor = document.createElement('div')
    this.shadowRoot?.appendChild(this.contenedor)
  }

  connectedCallback() {
    this.actualizarContenido()
  }

  disconnectedCallback() {
    console.log('Componente eliminado del DOM')
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    if (attrName === 'data-mensaje') {
      this.actualizarContenido()
    }
  }

  private actualizarContenido() {
    const mensaje = this.getAttribute('data-mensaje') || '¡Hola desde mi Web Component!'
    this.contenedor.textContent = mensaje
  }
}

// Definición del nuevo elemento
customElements.define('mi-componente', MiComponente)
```

</details>
