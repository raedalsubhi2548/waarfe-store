/** Fly a little copy of the product image into the cart button, then bump the cart. Pure DOM, no layout cost. */
export function flyToCart(fromEl, src) {
  if (typeof window === 'undefined' || !fromEl) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const cart = document.getElementById('cart-btn')
  if (!cart) return
  const a = fromEl.getBoundingClientRect(), b = cart.getBoundingClientRect()
  const size = Math.min(a.width, 120)
  const ghost = document.createElement(src ? 'img' : 'div')
  if (src) ghost.src = src
  Object.assign(ghost.style, {
    position: 'fixed', zIndex: 9999, left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, objectFit: 'cover', borderRadius: '18px', pointerEvents: 'none',
    boxShadow: '0 20px 40px -12px rgb(9 56 46 / .6)', background: '#09382e',
  })
  document.body.appendChild(ghost)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const anim = ghost.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(-20deg)`, opacity: 0.4 },
  ], { duration: 850, easing: 'cubic-bezier(.5,0,.3,1)' })
  anim.onfinish = () => {
    ghost.remove()
    cart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'ease-out' })
  }
}
