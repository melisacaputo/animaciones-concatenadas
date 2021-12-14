$("header").slideUp(2000).delay(1000).slideDown(2000)
.animate({opacity: 0.20}, 2000)
.animate({opacity: 1}, 3000, function () {console.log("animacion finalizada")});