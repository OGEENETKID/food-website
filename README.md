visit site: campus-hot-eats.netlify.app

# Amagwinya — Bolt Side Husle

A single-page ordering site for a fat-cake / snack delivery side hustle serving CPUT student residences. Customers build an order from a tappable menu, fill in their residence and room, then send the order as a pre-filled WhatsApp message — no backend, no app install.

## Files

```
index.html   Page structure and content
style.css    Visual design (colors, layout, responsive rules)
script.js    Menu data, cart logic, WhatsApp checkout, order-window status
```

There's no build step. Open `index.html` in a browser, or host the three files on any static web host.

## How it works

1. **Menu** — `script.js` defines all menu categories and items in the `MENU` array. The page renders tabs and item cards from this array, so adding/removing/editing products only ever requires editing `MENU`, not the HTML.
2. **Cart / ticket** — Tapping "Add" on an item adds it to an in-memory cart (`cart` array in `script.js`). Nothing is saved to a database or browser storage — the cart resets on page reload.
3. **Delivery form** — Residence, room, session, and notes are collected in the ticket panel. The site validates that the cart isn't empty and that residence/room are filled in before it will let someone check out.
4. **WhatsApp checkout** — On submit, the cart contents and form fields are formatted into a message and opened via a `https://wa.me/<number>?text=...` link. The customer still has to hit send in WhatsApp themselves — nothing is transmitted automatically.
5. **Order window status** — A banner in the hero checks the current local time (of whoever's *viewing* the page) and shows whether the 9–11pm ordering window is open or closed.

## Customizing

**Change the WhatsApp number**
Edit the constant at the top of `script.js`:
```js
const WHATSAPP_NUMBER = "27787732609"; // international format, digits only, no +
```
Also update the footer links in `index.html` (`https://wa.me/...`) if you want the visible contact numbers to match.

**Edit the menu**
Add, remove, or reprice items directly in the `MENU` array in `script.js`. Two item shapes are supported:
- Simple item: `{ id, name, price }`
- Item with options (like the fat cake filling choices): `{ id, name, basePrice, options: [{ id, label, add }] }` — the selected option's `add` is added to `basePrice`.

**Change the order window**
In `script.js`, `updateOrderStatus()` currently hardcodes a 21:00–23:00 window:
```js
const open = hour >= 21 && hour < 23;
```
Update the hours here, and the matching display text in `index.html`'s "Order windows" section, if the schedule changes.

**Change colors**
All colors are CSS custom properties at the top of `style.css` (`:root`), so a full re-theme is just editing these values:
```css
--char, --char-2      background tones
--cocoa, --cocoa-2     card / panel backgrounds
--cream, --cream-dim   text colors
--gold, --gold-2       accent (prices, highlights)
--chili, --chili-2     primary buttons / CTA
--olive                secondary accent
```

**Fonts**
Loaded from Google Fonts in `index.html`'s `<head>`. Currently: Poppins (headings/display), Work Sans (body), Space Mono (prices, receipt, code-style text).

## Accessibility & responsive notes

- Mobile navigation uses a hamburger menu (below 760px) instead of hiding links.
- The cart/ticket panel supports closing via the ✕ button, clicking the backdrop, or pressing Escape, and returns focus to whatever opened it.
- Menu category tabs use proper `role="tab"`/`role="tabpanel"`/`aria-selected` semantics.
- Checkout is blocked with an inline, visible error (not just a native form validation popup) if the cart is empty or residence/room are missing.

## Known limitations

- No backend: orders aren't stored anywhere; if the customer closes WhatsApp without sending, the order is lost.
- The order-window check uses the visitor's device clock/timezone, not a server time.
- No payment processing — this is an order-and-confirm-manually flow.
