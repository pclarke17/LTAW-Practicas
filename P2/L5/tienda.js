const fs = require('fs');

// Leer el archivo tienda.json
fs.readFile('tienda.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  try {
    const tiendaData = JSON.parse(data);
    
    // Número de usuarios registrados en la tienda
    const numUsuarios = tiendaData.usuarios.length;
    console.log('Número de usuarios registrados en la tienda:', numUsuarios);
    
    // Listado con los nombres de los usuarios
    console.log('Listado de nombres de usuarios:');
    tiendaData.usuarios.forEach(usuario => {
      console.log(usuario.nombre);
    });
    
    // Número de productos en la tienda
    const numProductos = tiendaData.productos.length;
    console.log('Número de productos en la tienda:', numProductos);
    
    // Listado de los productos de la tienda
    console.log('Listado de productos:');
    tiendaData.productos.forEach(producto => {
      console.log(`${producto.nombre} - Precio: $${producto.precio}`);
    });
    
    // Número de pedidos pendientes y detalles del pedido
    const pedidosPendientes = tiendaData.pedidos.filter(pedido => pedido.estado === 'pendiente');
    console.log('Número de pedidos pendientes:', pedidosPendientes.length);
    console.log('Detalles de los pedidos pendientes:');
    pedidosPendientes.forEach(pedido => {
      console.log(`Pedido ID: ${pedido.id}, Usuario: ${tiendaData.usuarios.find(usuario => usuario.id === pedido.usuario_id).nombre}, Productos: ${pedido.productos.join(', ')}`);
    });
  } catch (error) {
    console.error('Error al analizar el archivo JSON:', error);
  }
});
