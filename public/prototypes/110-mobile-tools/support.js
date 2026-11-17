/* Minimal standalone player for the 110 Mobile Tools concept screens.
   Renders the <x-dc> template (holes, sc-if, sc-for, events) with the page's
   Component class, so each screen runs on a plain web host. */
(function () {
  var hide = document.createElement('style');
  hide.textContent = 'x-dc{display:none!important}';
  document.head.appendChild(hide);

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
    this.state = Object.assign({}, this.state, p);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.forceUpdate = function () { if (this.__schedule) this.__schedule(); };
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function lookup(expr, scope) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^'.*'$|^".*"$/.test(expr)) return expr.slice(1, -1);
    var parts = expr.split('.');
    var v = scope[parts[0]];
    for (var i = 1; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(str, scope) {
    return str.replace(HOLE, function (_, e) { var v = lookup(e, scope); return v == null ? '' : String(v); });
  }
  function eventFor(el, name) {
    var n = name.slice(2);
    if (n === 'change') {
      var tag = el.localName, type = (el.getAttribute('type') || '').toLowerCase();
      if (tag === 'textarea' || (tag === 'input' && type !== 'checkbox' && type !== 'radio')) return 'input';
    }
    if (n === 'doubleclick') return 'dblclick';
    return n;
  }

  function build(node, scope, out) {
    if (node.nodeType === 3) {
      var t = node.nodeValue;
      out.appendChild(document.createTextNode(t.indexOf('{{') >= 0 ? interp(t, scope) : t));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-if') {
      var m = WHOLE.exec(node.getAttribute('value') || '');
      var ok = m ? lookup(m[1], scope) : false;
      if (ok) for (var c = node.firstChild; c; c = c.nextSibling) build(c, scope, out);
      return;
    }
    if (tag === 'sc-for') {
      var lm = WHOLE.exec(node.getAttribute('list') || '');
      var list = lm ? lookup(lm[1], scope) : [];
      var as = node.getAttribute('as') || 'item';
      (list || []).forEach(function (item, i) {
        var s = Object.create(scope); s[as] = item; s.$index = i;
        for (var c = node.firstChild; c; c = c.nextSibling) build(c, s, out);
      });
      return;
    }
    if (tag === 'helmet' || tag === 'dc-import') return;
    var el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.localName)
      : document.createElement(tag);
    var late = [];
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i], name = a.name, val = a.value;
      if (name.indexOf('hint-') === 0) continue;
      var w = WHOLE.exec(val);
      if (name.length > 2 && name.indexOf('on') === 0 && w) {
        var fn = lookup(w[1], scope);
        if (typeof fn === 'function') el.addEventListener(eventFor(el, name), (function (f) { return function (e) { f(e); }; })(fn));
        continue;
      }
      if (w) {
        var v = lookup(w[1], scope);
        if (name === 'style') {
          if (v && typeof v === 'object') Object.keys(v).forEach(function (k) { el.style[k] = v[k]; });
          else if (v) el.setAttribute('style', String(v));
          continue;
        }
        if (name === 'checked') { late.push(['checked', !!v]); continue; }
        if (name === 'value') { late.push(['value', v == null ? '' : String(v)]); continue; }
        if (v === false || v == null) continue;
        el.setAttribute(name, v === true ? '' : String(v));
        continue;
      }
      el.setAttribute(name, val.indexOf('{{') >= 0 ? interp(val, scope) : val);
    }
    var host = tag === 'template' ? el.content : el;
    var src = tag === 'template' ? node.content : node;
    for (var c2 = src.firstChild; c2; c2 = c2.nextSibling) build(c2, scope, host);
    late.forEach(function (p) { el[p[0]] = p[1]; });
    out.appendChild(el);
  }

  function pathOf(el, root) {
    var p = [];
    while (el && el !== root) { var i = 0, s = el; while ((s = s.previousSibling)) i++; p.unshift(i); el = el.parentNode; }
    return el === root ? p : null;
  }
  function atPath(root, p) { var el = root; for (var i = 0; i < p.length && el; i++) el = el.childNodes[p[i]]; return el; }

  function start() {
    var xdc = document.querySelector('x-dc');
    var sc = document.querySelector('script[data-dc-script]');
    if (!xdc || !sc) return;
    var helmet = xdc.querySelector('helmet');
    if (helmet) Array.prototype.slice.call(helmet.children).forEach(function (n) {
      var copy = document.createElement(n.localName);
      for (var i = 0; i < n.attributes.length; i++) copy.setAttribute(n.attributes[i].name, n.attributes[i].value);
      copy.textContent = n.textContent;
      document.head.appendChild(copy);
    });
    var props = {};
    try {
      var decl = JSON.parse(sc.getAttribute('data-props') || '{}');
      Object.keys(decl).forEach(function (k) { if (k[0] !== '$' && decl[k] && 'default' in decl[k]) props[k] = decl[k].default; });
    } catch (e) { console.error('data-props', e); }
    // Each page defines its component in an ordinary inline script (no eval, so it runs under a strict CSP).
    var Component = window.__dcComponent;
    if (typeof Component !== 'function') { console.error('Component not defined'); return; }
    var comp = new Component(props);
    if (!comp.props) comp.props = props;
    var root = document.createElement('div');
    root.className = 'dc-root';
    xdc.parentNode.insertBefore(root, xdc);
    var queued = false;
    function render() {
      queued = false;
      var act = document.activeElement, fp = act && root.contains(act) ? pathOf(act, root) : null, sel = null;
      if (fp && act.setSelectionRange && typeof act.selectionStart === 'number') { try { sel = [act.selectionStart, act.selectionEnd]; } catch (e) {} }
      var vals = comp.renderVals() || {};
      var frag = document.createDocumentFragment();
      for (var c = xdc.firstChild; c; c = c.nextSibling) build(c, vals, frag);
      root.replaceChildren(frag);
      if (fp) { var el = atPath(root, fp); if (el && el.focus) { el.focus(); if (sel && el.setSelectionRange) { try { el.setSelectionRange(sel[0], sel[1]); } catch (e) {} } } }
    }
    comp.__schedule = function () { if (!queued) { queued = true; Promise.resolve().then(render); } };
    render();
    if (typeof comp.componentDidMount === 'function') comp.componentDidMount();
    if (/\(mobile\)/i.test(document.title)) {
      document.body.style.display = 'flex';
      document.body.style.justifyContent = 'center';
      document.body.style.background = '#DDE3EC';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
