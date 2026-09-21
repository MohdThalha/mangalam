// Fills the support details on every page from contact.json.
//
// contact.json is the ONLY place these details live. The app reads the same
// file, so changing the WhatsApp number there changes it on these pages and in
// every installed copy of the app, with no app update.
//
// Markup:
//   <span data-contact="email"></span>       → text, plus a mailto link on <a>
//   <span data-contact="whatsapp"></span>    → "+91 98765 43210", wa.me link on <a>
//   <p data-contact-row="whatsapp">…</p>     → removed when that value is empty,
//                                              so an unset number never shows a
//                                              blank line or a dead link
(function () {
  function formatPhone(digits) {
    var d = String(digits).replace(/\D/g, '');
    if (d.length === 10) d = '91' + d;
    return d.length === 12 ? '+' + d.slice(0, 2) + ' ' + d.slice(2, 7) + ' ' + d.slice(7) : d;
  }

  fetch('contact.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (c) {
      document.querySelectorAll('[data-contact-row]').forEach(function (row) {
        if (!c[row.getAttribute('data-contact-row')]) row.remove();
      });
      document.querySelectorAll('[data-contact]').forEach(function (el) {
        var key = el.getAttribute('data-contact');
        var value = c[key];
        if (!value) return;
        if (key === 'whatsapp') {
          var d = String(value).replace(/\D/g, '');
          if (d.length === 10) d = '91' + d;
          el.textContent = formatPhone(value);
          if (el.tagName === 'A') el.href = 'https://wa.me/' + d;
        } else if (key === 'email') {
          el.textContent = value;
          if (el.tagName === 'A') el.href = 'mailto:' + value;
        } else {
          el.textContent = value;
        }
      });
    })
    .catch(function () {
      // Leave whatever the page already says; a missing file must not blank it.
    });
})();
