var currencySign = "$",
  taxRate = 0.125,
  shippingRate = 25,
  discountRate = 0.15;
function recalculateCart() {
  var r = 0;
  Array.from(document.getElementsByClassName("product")).forEach(function (e) {
    var t =
      e.querySelector(".product-price").innerHTML *
      e.querySelector(".product-quantity").value;
    (e.querySelector(".product-line-price").innerHTML = t.toFixed(2)),
      Array.from(e.getElementsByClassName("product-line-price")).forEach(
        function (e) {
          r += parseFloat(e.innerHTML);
        },
      );
  });
  var e = r * taxRate,
    t = r * discountRate,
    n = 0 < r ? shippingRate : 0,
    c = r + e + n - t;
  (document.getElementById("cart-subtotal").innerHTML =
    currencySign + r.toFixed(2)),
    (document.getElementById("cart-discount").innerHTML =
      "-" + currencySign + t.toFixed(2)),
    (document.getElementById("cart-shipping").innerHTML =
      currencySign + n.toFixed(2)),
    (document.getElementById("cart-tax").innerHTML =
      currencySign + e.toFixed(2)),
    (document.getElementById("cart-total").innerHTML =
      currencySign + c.toFixed(2));
}
function updateQuantity(e) {
  var t,
    r = e.closest(".product");
  (r || r.getElementsByClassName("product-price")) &&
    Array.from(r.getElementsByClassName("product-price")).forEach(function (e) {
      t = parseFloat(e.innerHTML);
    });
  var n = e.value,
    c = t * n;
  Array.from(r.getElementsByClassName("product-line-price")).forEach(
    function (e) {
      (e.innerHTML = c.toFixed(2)), recalculateCart();
    },
  );
}
$("input[name='demo_vertical']").TouchSpin({ verticalbuttons: !0 }),
  $("input[name='demo_vertical']").on("change", function (e) {
    updateQuantity(e.currentTarget);
  }),
  recalculateCart();
var removeProduct = document.getElementById("removeItemModal");
removeProduct &&
  removeProduct.addEventListener("show.bs.modal", function (t) {
    document
      .getElementById("remove-item")
      .addEventListener("click", function (e) {
        t.relatedTarget.closest(".product").remove(),
          document.getElementById("close-removeProductModal").click(),
          recalculateCart();
      });
  });
