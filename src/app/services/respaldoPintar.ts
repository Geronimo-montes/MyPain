  /**
   * @name pintar
   * @description Dados dos pares de coordenadas realiza un trazada de una 
   * linea recta dentro del canvas
   * @param x1 Coordenada x del punto inicial 
   * @param y1 Coordenada y del punto inicial
   * @param x2 Coordenada x del punto final
   * @param y2 Coordenada y del punto final
   */
   private pintar(x1, y1, x2, y2, colorTrazo, anchoTrazo) {
  this.cx.fillStyle = colorTrazo;

  /**Pares de coordenadas inicio */
  var _x1 = Math.round(x1);
  var _y1 = Math.round(y1);
  /**Pares de coordenadas final */
  var _x2 = Math.round(x2);
  var _y2 = Math.round(y2);

  /**Valor absoluto de la diferencia de x2 - x1*/
  const dx = Math.abs(_x2 - _x1);
  /** */
  const sx = _x1 < _x2 ? 1 : -1;
  /**Valor absoluto de la diferencia de y2 - y1*/
  const dy = Math.abs(_y2 - _y1);
  const sy = _y1 < _y2 ? 1 : -1;

  var error, len, rev, count = dx;

  this.cx.beginPath();

  if (dx > dy) {
    error = dx / 2;
    rev = _x1 > _x2 ? 1 : 0;
    if (dy > 1) {
      error = 0;
      count = dy - 1;
      do {
        len = error / dy + 2 | 0;
        this.cx.rect(_x1 - len * rev, _y1, len, anchoTrazo);
        _x1 += len * sx;
        _y1 += sy;
        error -= len * dy - dx;
      } while (count--);
    }
    if (error > 0) { this.cx.rect(_x1, _y2, _x2 - _x1, anchoTrazo) }
  } else if (dx < dy) {
    error = dy / 2;
    rev = _y1 > _y2 ? 1 : 0;
    if (dx > 1) {
      error = 0;
      count--;
      do {
        len = error / dx + 2 | 0;
        this.cx.rect(_x1, _y1 - len * rev, anchoTrazo, len);
        _y1 += len * sy;
        _x1 += sx;
        error -= len * dx - dy;
      } while (count--);
    }
    if (error > 0) { this.cx.rect(_x2, _y1, anchoTrazo, _y2 - _y1) }
  } else {
    do {
      this.cx.rect(_x1, _y1, anchoTrazo, 1);
      _x1 += sx;
      _y1 += sy;
    } while (count--);
  }
  this.cx.fill();
}