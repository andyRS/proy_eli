$(document).ready(function () {
  const menu = $(".menu");
  const menuLinks = $(".menu a");

  function UnderlineHover() {
    $(this).css("text-decoration", "underline");
  }

  function NotUnderlineHover() {
    $(this).css("text-decoration", "none");
  }

  menuLinks.hover(UnderlineHover, NotUnderlineHover);

  $(".portafolio-carousel").owlCarousel({
    loop: true,
    margin: 24,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      680: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  });

  $(".testimonios-carousel").owlCarousel({
    loop: true,
    margin: 24,
    nav: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      860: {
        items: 2,
      },
      1140: {
        items: 3,
      },
    },
  });

  $(window).scroll(function () {
    scroll = $(window).scrollTop();
    if (scroll > 685) {
      menu.css({ position: "fixed" });
      menu.css({ width: "100%" });
      menu.css({ top: "0" });
      menu.css({ background: "#f0637d" });
      menuLinks.css({ color: "#fff" });
      $(".logo").css({ color: "#fff" });
      menu.css({ "box-shadow": "rgba(0, 0, 0, 0.22) 6px 1px 1px" });
      menu.css({ "z-index": "100" });
      $(".contenedor-servicios")
        .css({ width: "90%" })
        .css("margin", "0px auto");
    } else {
      menu.css({ position: "relative" });
      menu.css({ background: "transparent" });
      menu.css({ "box-shadow": "0 0 0" });
      menuLinks.css({ color: "#fff" });
      $(".logo").css({ color: "#fff" });
    }

    $("#php h3").css("color","red").css("display","none");
    if(btn-eviar.click){
      $("#php h3").css("color","red").css("display","block");
    }
    
  });

  var menuButton = $(".menu-icon");
  var menuNav = $("#menu-principal");

  menuButton.on("click", function () {
    var isExpanded = menuButton.attr("aria-expanded") === "true";
    menuButton.attr("aria-expanded", String(!isExpanded));
    menuNav.slideToggle();
  });

  $(".trabajo-filtro").on("click", function () {
    var filtro = $(this).data("filter");

    $(".trabajo-filtro").removeClass("is-active");
    $(this).addClass("is-active");

    if (filtro === "todos") {
      $(".trabajo-card").removeClass("is-hidden");
      return;
    }

    $(".trabajo-card").each(function () {
      var categoria = $(this).data("category");
      $(this).toggleClass("is-hidden", categoria !== filtro);
    });
  });

  $(".testimonios-carousel").owlCarousel({
    items: 1,
    margin: 24,
    autoplay: true,
    loop: true,
    autoplayHoverPause: true,
    dots: true,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1024: {
        items: 3
      }
    }
  });
});
