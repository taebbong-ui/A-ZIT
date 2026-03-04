/* qa.js */
(function () {
  const FORM_KEY = "qaForm:v1";

  function getState() {
    try { return JSON.parse(localStorage.getItem(FORM_KEY)) || {}; }
    catch { return {}; }
  }
  function setState(patch) {
    const next = { ...getState(), ...patch, updatedAt: Date.now() };
    localStorage.setItem(FORM_KEY, JSON.stringify(next));
    return next;
  }
  function clear() { localStorage.removeItem(FORM_KEY); }

  // [data-field]가 달린 모든 입력요소 자동 바인딩(복원 + 자동저장)
  function bindAll(root = document) {
    const state = getState();
    root.querySelectorAll("[data-field]").forEach(el => {
      const field = el.dataset.field;

      // 복원
      if (state[field] != null) {
        if (el.type === "checkbox" || el.type === "radio") el.checked = !!state[field];
        else el.value = state[field];
      }

      // 자동 저장 (input/textarea 즉시, select/checkbox도 대응)
      const save = () => {
        const value = (el.type === "checkbox" || el.type === "radio") ? el.checked : el.value;
        setState({ [field]: value });
      };
      el.addEventListener("input", save);
      el.addEventListener("change", save);
    });
  }

  // 전역 공개
  window.FormState = { getState, setState, bindAll, clear, FORM_KEY };

  // 페이지 로드 시 자동 바인딩
  window.addEventListener("DOMContentLoaded", () => bindAll());
})();

