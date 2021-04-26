//Enumerado para los botones del la aplicacion
export enum TipoTrazo {
  sinSeleccion = 0,
  lapiz = 1,
  pincel = 2,
  linea = 3,
  circulo = 4,
  elipse = 5,
  cuadrado = 6,
  rectangulo = 7,
  rombo = 8,
  pentagono = 9,
  hexagono = 10,
  octagono = 11,
  poligono = 12,
  triangulo = 13,
}

export enum Sombra {
  ArribaIzq = 0,
  ArribaDer = 1,
  AbajoIzq = 2,
  AbajoDer = 3,
}

export enum HerramientaCapa {
  sinSeleccion = 0,
  seleccionar = 1,
  extractor = 2,
  redimensionar = 3,
  moverTrazo = 4,
  borrador = 5,
  rotar = 6,
  movarUnaCapaAdelante = 7,
  movarUnaCapaAtras = 8,
  moverAdelante = 9,
  moverAtras = 10,
}

// export enum Archivo {
//   abrir = 0,
//   guardar = 1,
//   generarImg = 2,
//   atrasTrazo = 3,
//   adelanteTrazo = 4,
//   sinEvento = 5,
// }