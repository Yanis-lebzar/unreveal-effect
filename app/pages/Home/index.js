import Page from 'classes/Page'

import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import each from 'lodash/each'

import { ContentItem } from './ContentItem.js'
import { PreviewItem } from './PreviewItem.js'

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
        navigation: document.querySelectorAll('.navigation__list__link'),
        contentOverlayInner: document.querySelector('.content__overlay > .overlay__inner'),
        backCtrl: document.querySelector('.preview__back'),
        body: document.querySelector('body')
      }
    })

    // current element
    this.current = -1

    // check if currently animating
    this.isAnimating = false
  }

  create () {
    super.create()

    GSAP.set(this.elements.contentOverlayInner, {
      xPercent: -100
    })

    // Preview Items
    this.previewItems = [];
    [...document.querySelectorAll('.preview__item')].forEach(previewItem => {
      this.previewItems.push(new PreviewItem(previewItem))
    })

    // Content Items
    this.contentItems = [];
    [...document.querySelectorAll('.content__item')].forEach((contentItem, index) => {
      this.contentItems.push(new ContentItem(contentItem, this.previewItems[index]))
    })

    this.onOpen()
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

  onOpen () {
    for (const [index, contentItem] of this.contentItems.entries()) {
      contentItem.DOM.imgWrap.addEventListener('click', () => {
        console.log('clicked element')
        if (this.isAnimating) return

        this.isAnimating = true

        this.current = index

        this.previewItem = this.previewItems[this.current]

        GSAP.timeline({
          defaults: {
            duration: 1.1,
            ease: 'expo'
          },
          onStart: () => {
            this.elements.body.classList.add('preview-open')
            GSAP.set(this.previewItem.DOM.img, { xPercent: 100 })
            GSAP.set(this.previewItem.DOM.imgWrap, { xPercent: -102, opacity: 0 })

            GSAP.set(this.previewItem.DOM.slideTexts, { yPercent: 100 })
            GSAP.set(this.previewItem.DOM.descriptions, { yPercent: 15, opacity: 0 })

            GSAP.set(this.elements.backCtrl, { x: '+=15%', opacity: 0 })

            this.previewItem.DOM.el.classList.add('preview__item--current')
          },
          onComplete: () => {
            this.isAnimating = false
          }
        })
          .addLabel('start', 0)
          .addLabel('preview', 'start+=0.3')
          .addLabel('previewSlide', 'start+=0.4')
          .to(this.elements.contentOverlayInner, {
            ease: 'power2',
            startAt: { xPercent: -100 },
            xPercent: 0
          }, 'start')
          .to([this.previewItem.DOM.img, this.previewItem.DOM.imgWrap], {
            xPercent: 0
          }, 'preview')
          .to(this.previewItem.DOM.imgWrap, {
            opacity: 1
          }, 'preview')
          .to(this.previewItem.DOM.slideTexts, {
            yPercent: 0,
            stagger: 0.05
          }, 'previewSlide')
          .to(this.previewItem.DOM.descriptions, {
            ease: 'power2',
            opacity: 1,
            stagger: 0.05
          }, 'preview')
          .to(this.previewItem.DOM.descriptions, {
            yPercent: 0,
            stagger: 0.05
          }, 'preview')
          .to(this.elements.backCtrl, {
            ease: 'power2',
            opacity: 1,
            x: '-=15%'
          }, 'preview')
      })
    }
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
