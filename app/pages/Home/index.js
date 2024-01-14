import Page from 'classes/Page'
// import Gallery from './Gallery.js'
// import Gallery2 from './Gallery_2.js'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import each from 'lodash/each'
import { lerp } from 'utils/math'
import { BREAKPOINT_PHONE } from '../../utils/breakpoints.js'

GSAP.registerPlugin(ScrollTrigger)

export default class extends Page {
  constructor () {
    super({
      id: 'home',

      classes: {
        active: 'home--active'
      },

      element: '.frame',
      elements: {
        navigation: document.querySelectorAll('.navigation__list__link')
      }
    })
    // this.heroAnimationIn()
  }

  create () {
    super.create()

    each(this.elements.navigation, (link, index) => {
      link.style.textDecoration = 'none'
    })
  }

  // Animations
  async show (url) {
    // GSAP.delayedCall(0, () => {
    //   this.element.classList.add(this.classes.active)

    //   GSAP.to(this.element, {
    //     autoAlpha: 1,
    //     ease: 'power3.in',
    //     duration: 0.5
    //   })
    // })
    // this.heroAnimationIn()

    return super.show(url)
  }

  async hide (url) {
    this.element.classList.remove(this.classes.active)

    return super.hide(url)
  }

  update (time) {
    super.update(time)
  }

  onResize () {
    super.onResize()
  }

  addEventListeners () {
  }

  removeEventListeners () {
  }

  /**
   * Destroy.
   */
  destroy () {
    super.destroy()
    window.removeEventListener('preloaderCompleted', this.heroAnimationIn.bind(this))
  }
}
