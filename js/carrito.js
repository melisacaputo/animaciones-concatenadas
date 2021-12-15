//inicializo la variable carrito con una funcion para que detecte si existen valores en el storage
let carrito = cargarCarrito();
//cargo las variables de monto y cantidad para que no se pierdan los datos almacenados al refrescar la ventana
let montoTotalCompra = calcularTotalCarrito();
let cantidadTotalCompra = carrito.length;

//dentro del document ready agrego todo el codigo generado por dom
$(document).ready(function () {
  //creacion de la seccion carrito mediante jquery y dom
  $("#section-carrito").append(`<div> 
                                <h2>Total: $</h2> 
                                <h2 id="montoTotalCompra">${montoTotalCompra}</h2>
                                </div>
                                <div> 
                                <h3>Cantidad de productos:</h3> 
                                <h3 id="cantidadTotalCompra">${cantidadTotalCompra}</h3>
                                </div>
                                <button class="botones" id="btn-finalizar">Finalizar compra</button>`);

  //evento al boton finalizar compra para que el usuario confirme su compra
  $("#btn-finalizar").on('click', function () {
    const precioFinal = $("#montoTotalCompra").text();
    //uso sweet alert para que el usuario confirme su compra, cuando toca si se vacia el carrito
    Swal.fire({
      title: '¿Seguro que queres finalizar tu compra?',
      text: `Total a abonar: $${precioFinal}`,
      showCancelButton: true,
      confirmButtonColor: '#008f39',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Compra confirmada',
          '¡Que lo disfrutes!',
          'success'
        )
        vaciarCarrito();
      }
    })
  });

  //configuracion del selector para ordenar productos
  $("#seleccion option[value='pordefecto']").attr("selected", true);
  $("#seleccion").on("change", ordenarProductos);

  //llamo a la funcion para renderizar los productos
  renderizarProductos();
});


//funcion para el renderizado de los productos en cards
function renderizarProductos() {
  for (const producto of productos) {
    $("#section-productos").append(`<div class="card-product"> 
                                    <div class="img-container">
                                    <img src="${producto.foto}" alt="${producto.nombre}" class="img-product"/>
                                    </div>
                                    <div class="info-producto">
                                    <p class="font">${producto.nombre}</p>
                                    <strong class="font">$${producto.precio}</strong>
                                    <button class="botones" id="btn${producto.id}"> Agregar al carrito </button>
                                    </div>
                                    </div>`)

    $(`#btn${producto.id}`).on('click', function () {
      agregarAlCarrito(`${producto.id}`)
    });
  }
};

//funcion para ordenar los productos segun precio y orden alfabetico
function ordenarProductos() {
  let seleccion = $("#seleccion").val();
  if (seleccion == "menor") {
    productos.sort(function (a, b) {
      return a.precio - b.precio
    });
  } else if (seleccion == "mayor") {
    productos.sort(function (a, b) {
      return b.precio - a.precio
    });
  } else if (seleccion == "alfabetico") {
    productos.sort(function (a, b) {
      return a.nombre.localeCompare(b.nombre);
    });
  }
  //luego del reordenamiento tenemos que volver a renderizar
  $(".card-product").remove();
  renderizarProductos();
}


//otras funciones
function agregarAlCarrito(id) {
  carrito.push(productos.find(p => p.id == id));
  localStorage.setItem("carrito", JSON.stringify(carrito));
  calcularTotalCarrito();
}

function calcularTotalCarrito() {
  let total = 0;
  for (const producto of carrito) {
    total += producto.precio;
  }
  $("#montoTotalCompra").text(total);
  $("#cantidadTotalCompra").text(carrito.length);
  return total;
}

function vaciarCarrito() {
  $("#montoTotalCompra").text("0");
  $("#cantidadTotalCompra").text("0");
  localStorage.clear();
  carrito = [];
}

//todavia no pude resolver que aparezca lo cargado en storage cuando recargo el html
function cargarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (carrito == null) {
    return [];
  } else {
    return carrito;
  }
}