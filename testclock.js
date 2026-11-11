/* Test day for another day (Nov 11, 2026; Dylan: "I want the button on all days. So I can test tomorrow and make sure it's set up good").
   While a grown-up's Test day is on for a day that isn't today (sessionStorage study-testday-date = YYYY-MM-DD), the page's clock is
   moved to that day (same time of day), so his start screen, worksheets and results all act as if it's that day. Nothing is saved in
   Test day. Loaded first on spell.html, do.html and fixup.html; does nothing otherwise. */
(() => {
  try {
    if (sessionStorage.getItem('study-testday') !== '1') return;
    const day = sessionStorage.getItem('study-testday-date'); if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) return;
    const Real = Date, now = Real.now(), at = new Real(now), target = new Real(day + 'T00:00:00');
    target.setHours(at.getHours(), at.getMinutes(), at.getSeconds(), at.getMilliseconds());
    const off = target.getTime() - now; if (!off) return;
    class TestDate extends Real { constructor(...a) { if (a.length) super(...a); else super(Real.now() + off); } static now() { return Real.now() + off; } }
    window.Date = TestDate; window.TEST_CLOCK = { day, off, Real };
  } catch (e) { }
})();
