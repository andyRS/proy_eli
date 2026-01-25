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

  $(".menu-icon").click(function () {
    $("header nav").slideToggle();
  });

  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
  });
});
