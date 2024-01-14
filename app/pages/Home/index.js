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
        backCtrl: document.querySelectorAll('.preview__back'),
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
    console.log(this.contentItems)
    this.addEventListeners()
    console.log(this.elements.backCtrl)
    // this.onOpen()

    each(this.elements.navigation, (link, index) => {
      link.style.textDecoration = 'none'
    })
  }

  // Animations
  async show (url) {
    return super.show(url)
  }

  async hide (url) {
    this.element.classList.remove(this.classes.active)

    return super.hide(url)
  }

  onOpen (index) {
    console.log(this.elements.backCtrl[index])

    if (this.isAnimating) return

    this.isAnimating = true
    console.log(index)
    this.current = index

    this.previewItem = this.previewItems[this.current]

    GSAP.timeline({
      defaults: {
        duration: 1.1,
        ease: 'expo'
      },
      onStart: () => {
        this.elements.body.classList.add('preview-open')
        GSAP.set(this.elements.contentOverlayInner, { backgroundColor: '#131312' })
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
  }

  onClose (index) {
    console.log('click zebi')
    if (this.isAnimating) return
    this.isAnimating = true

    const previewItem = this.previewItems[index]

    GSAP.timeline({
      defaults: {
        duration: 1,
        ease: 'power4'
      },
      onComplete: () => {
        previewItem.DOM.el.classList.remove('preview__item--current')
        this.elements.body.classList.remove('preview-open')
        this.isAnimating = false
      }
    })
      .addLabel('start', 0)
      .to(this.elements.backCtrl, {
        ease: 'power2',
        opacity: 0
      }, 'start')
      .to(previewItem.DOM.descriptions, {
        ease: 'power2',
        opacity: 0
      }, 'start')
      .to(previewItem.DOM.descriptions, {
        yPercent: 15
      }, 'start')
      .to(previewItem.DOM.slideTexts, {
        yPercent: 100
      }, 'start')
      .to(previewItem.DOM.img, {
        xPercent: -100
      }, 'start')
      .to(previewItem.DOM.imgWrap, {
        xPercent: 100,
        opacity: 1
      }, 'start')
      .to(this.elements.contentOverlayInner, {
        ease: 'power2',
        xPercent: 100
      }, 'start+=0.4')
  }

  onHoverImgIn (index) {
    GSAP.timeline({
      defaults: {
        duration: 0.6,
        ease: 'expo'
      }
    })
      .addLabel('start', 0)
      .set(this.contentItems[index].DOM.titleInner, { transformOrigin: '0% 50%' }, 'start')
      .to(this.contentItems[index].DOM.titleInner, {
        startAt: { filter: 'blur(0px)' },
        duration: 0.2,
        ease: 'power1.in',
        yPercent: -100,
        rotation: -4,
        filter: 'blur(6px)'
      }, 'start')
      .to(this.contentItems[index].DOM.titleInner, {
        startAt: { yPercent: 100, rotation: 4, filter: 'blur(6px)' },
        yPercent: 0,
        rotation: 0,
        filter: 'blur(0px)'
      }, 'start+=0.2')
      .to(this.contentItems[index].DOM.imgWrap, {
        scale: 0.95
      }, 'start')
      .to(this.contentItems[index].DOM.img, {
        scale: 1.2
      }, 'start')
  }

  onHoverImgOut (index) {
    GSAP.timeline({ defaults: { duration: 0.8, ease: 'power4' } })
      .addLabel('start', 0)
      .to([this.contentItems[index].DOM.imgWrap, this.contentItems[index].DOM.img], {
        scale: 1
      }, 'start')
  }

  update (time) {
    super.update(time)
  }

  onResize () {
    super.onResize()
  }

  addEventListeners () {
    // this.openEvent = this.onOpen.bind(this)
    // this.mouseEnterImg = this.onHoverImgIn.bind(this)
    // this.mouseLeaveImg = this.onHoverImgOut.bind(this)

    for (const [index, contentItem] of this.contentItems.entries()) {
      this.previewItem = this.previewItems[index]
      contentItem.DOM.imgWrap.addEventListener('click', () => this.onOpen(index))
      this.previewItem.DOM.backCtrl.addEventListener('click', () => this.onClose(index))
      // this.elements.backCtrl.addEventListener('click', () => this.onClose(index))
      contentItem.DOM.imgWrap.addEventListener('mouseenter', () => this.onHoverImgIn(index))
      contentItem.DOM.imgWrap.addEventListener('mouseleave', () => this.onHoverImgOut(index))
    }
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
