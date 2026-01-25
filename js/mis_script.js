$(document).ready(function () {
  $(window).scroll(function () {
    scroll = $(window).scrollTop();
    if (scroll > 685) {
      var menu = $(".menu");
      menu.css({ position: "fixed" });
      menu.css({ width: "100%" });
      menu.css({ top: "0" });
      menu.css({ background: "#f0637d" });
      $("menu a").css({ color: "#fff" });
      $(".logo").css({ color: "#fff" });
      menu.css({ "box-shadow": "rgba(0, 0, 0, 0.22) 6px 1px 1px" });
      menu.css({ "z-index": "100" });
      $(".contenedor-servicios")
        .css({ width: "90%" })
        .css("margin", "0px auto");
      function UnderlineHover() {
        $(this).css("text-decoration", "underline");
        menu.hover(UnderlineHover);
      }
    } else {
      $(".menu").css({ position: "relative" });
      $(".menu").css({ background: "transparent" });
      $(".menu").css({ "box-shadow": "0 0 0" });
      $(".menu a").css({ color: "#fff" });
      $(".logo").css({ color: "#fff" });

      function NotUnderlineHover() {
        $(this).css("text-decoration", "none");
      }
      menu.hover(NotUnderlineHover);
    }

    $("#php h3").css("color","red").css("display","none");
    if(btn-eviar.click){
      $("#php h3").css("color","red").css("display","block");
    }else{
      alert("para enviar el mensaje pulse el boton de enviar mensaje")
    }
    
  });

  var menuButton = $(".menu-icon");
  var menuNav = $("#menu-principal");

  menuButton.on("click", function () {
    var isExpanded = menuButton.attr("aria-expanded") === "true";
    menuButton.attr("aria-expanded", String(!isExpanded));
    menuNav.slideToggle();
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
