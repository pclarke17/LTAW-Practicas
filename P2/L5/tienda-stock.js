const fs = require('fs');

// Leer el archivo tienda.json
fs.readFile('tienda.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }

  try {
    // Parsear el contenido JSON
    const tiendaData = JSON.parse(data);
    
    // Incrementar el stock de todos los productos en 1 unidad
    tiendaData.productos.forEach(producto => {
      producto.stock += 1;
    });
    
    // Convertir los datos actualizados de vuelta a JSON
    const newData = JSON.stringify(tiendaData, null, 2);
    
    // Escribir los datos actualizados en el archivo tienda.json
    fs.writeFile('tienda.json', newData, 'utf8', (err) => {
      if (err) {
        console.error('Error al escribir en el archivo:', err);
        return;
      }
      console.log('Stock de productos actualizado con éxito.');
    });
  } catch (error) {
    console.error('Error al analizar el archivo JSON:', error);
  }
});
