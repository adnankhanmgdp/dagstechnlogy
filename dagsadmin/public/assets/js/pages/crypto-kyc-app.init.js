!(function () {
  "use strict";
  (0, window.jQuery)("#kyc-verify-wizard").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "slide",
  });
  var e,
    r = document.querySelector("#dropzone-preview-list");
  (r.id = ""),
    r &&
      ((e = r.parentNode.innerHTML),
      r.parentNode.removeChild(r),
      new Dropzone(".dropzone", {
        url: "https://httpbin.org/post",
        method: "post",
        previewTemplate: e,
        previewsContainer: "#dropzone-preview",
      }));
})();
