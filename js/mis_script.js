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

  const statusElement = document.getElementById("form-status");
  if (statusElement) {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const code = params.get("code");
    const messages = {
      success: "La consulta se envió correctamente. Nos contactaremos a la brevedad.",
      error: {
        invalid_method: "No se pudo enviar el formulario. Inténtalo nuevamente.",
        spam_detected: "No se pudo enviar el formulario. Inténtalo nuevamente.",
        missing_fields: "Completa todos los campos obligatorios.",
        invalid_name: "Ingresa un nombre válido.",
        invalid_name_length: "El nombre debe tener entre 2 y 100 caracteres.",
        invalid_email: "Ingresa un correo válido.",
        invalid_message_length: "El mensaje debe tener entre 10 y 1000 caracteres.",
        invalid_message_content: "El mensaje contiene caracteres no permitidos.",
        send_failed: "No se pudo enviar el mensaje. Inténtalo más tarde.",
      },
    };

    if (status === "success") {
      statusElement.textContent = messages.success;
      statusElement.classList.add("form-status--success");
    } else if (status === "error") {
      const errorMessage = messages.error[code] || "Ocurrió un error al enviar el formulario.";
      statusElement.textContent = errorMessage;
      statusElement.classList.add("form-status--error");
    }

    if (statusElement.textContent) {
      statusElement.classList.add("form-status--visible");
      const cleanUrl = `${window.location.pathname}#contacto`;
      window.history.replaceState(null, "", cleanUrl);
    }
  }
});
