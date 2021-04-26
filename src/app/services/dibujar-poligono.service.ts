import { Injectable } from '@angular/core';
import { Capa, ParCoordenada } from '../model/capa.model';
import { TipoTrazo } from '../model/tipo-trazo.model';
import { DibujarCirculoElipseService } from './dibujar-circulo-elipse.service';
import { DibujarLineaService } from './dibujar-linea.service';
import { DibujarRotacionService } from './dibujar-rotacion.service';

@Injectable({
  providedIn: 'root'
})
export class DibujarPoligonoService {

  constructor(
    private dibujarLinea: DibujarLineaService,
    private dibujarCirculo: DibujarCirculoElipseService,
    private rotar: DibujarRotacionService,
  ) { }

  /**
   * @name poligono
   * @param capa 
   * @returns tipo de dato Capa
   * @description Calcula y setea el valor de los vertices, ademas calcula los puntos del trazo
   */
  public poligono(capa: Capa): Capa {
    capa.vertices = [];//inicializamos el array de vertices, sin importar su contenido
    const
      centro: ParCoordenada = capa.puntoA, //centro de la figura, el puntoA de la capa
      numeroLados: number = capa.numeroLados,
      radianes = 2 * Math.PI / numeroLados;
    let
      radioX: number, radioY: number;

    if (capa.tipoTrazo === TipoTrazo.rombo || capa.tipoTrazo === TipoTrazo.rectangulo) {//calculo de las diagonales del rombo
      radioX = Math.abs(capa.puntoB.x - capa.puntoA.x);
      radioY = Math.abs(capa.puntoB.y - capa.puntoA.y);
    } else if (capa.tipoTrazo === TipoTrazo.cuadrado) { //calculo de la longitud del lado del cuadradoy
      radioX = radioY = Math.abs(capa.puntoB.x - capa.puntoA.x) + Math.abs(capa.puntoB.y - capa.puntoA.y);
    } else if (capa.tipoTrazo === TipoTrazo.circulo) {
      radioX = radioY = Math.sqrt(Math.pow(capa.puntoB.x - capa.puntoA.x, 2) + Math.pow(capa.puntoB.y - capa.puntoA.y, 2));
    } else {//radio para los poligonos regulares
      radioX = radioY = Math.sqrt(Math.pow(capa.puntoB.x - capa.puntoA.x, 2) + Math.pow(capa.puntoB.y - capa.puntoA.y, 2));
    }

    this.calcularVerticesPoligono(numeroLados, centro, radioX, radioY, radianes)
      .forEach((p: ParCoordenada) => {
        capa.vertices.push(this.rotar.rotacion(capa.puntoA, p, capa.angulo));
      });

    capa.puntos = (capa.tipoTrazo === TipoTrazo.circulo) ?
      this.dibujarCirculo.circulo(capa.puntoA, capa.puntoB, capa.anchoTrazo) :
      this.calcularPuntosPoligono(capa); //calculo de puntos
    // console.log(capa.vertices);
    return capa;
  }

  /**
   * @name calcularVerticesPoligono
   * @param numeroLados 
   * @param centro 
   * @param radioX 
   * @param radioY 
   * @param radianes 
   * @returns ParCoordenada[]. con los vertices del poligono
   */
  public calcularVerticesPoligono(numeroLados: number, centro: ParCoordenada, radioX: number, radioY: number, radianes: number): ParCoordenada[] {
    let vertices: ParCoordenada[] = [];
    for (var i = 0; i < numeroLados; i++) { //calculo de vertices
      vertices.push({
        x: ~~(0.5 + (centro.x + radioX * Math.cos(radianes * i))),
        y: ~~(0.5 + (centro.y + radioY * Math.sin(radianes * i)))
      });
    }
    return vertices;
  }

  /**
 * @name calcularPuntos
 * @param capa
 * @returns array de puntos
 * @description Calcula los puntos de un poligono (regular o no regular)
 */
  public calcularPuntosPoligono(capa: Capa): ParCoordenada[] {
    let
      puntos: ParCoordenada[] = [],
      puntoAuxiliar: ParCoordenada = capa.vertices[capa.vertices.length - 1];

    capa.vertices
      .forEach((punto: ParCoordenada) => {
        this.dibujarLinea.bresenhamLine(puntoAuxiliar, punto, capa.anchoTrazo)
          .forEach(newPunto => puntos.push(newPunto));
        puntoAuxiliar = punto;
      });
    return puntos;
  }

  public rectangulo(capa: Capa): Capa {
    let margenB: number = 1, margenD: number = 1;
    capa.vertices = [];
    /**Para evitar un ligero descuadre se asigna un pixel (+,-) dependiendo el cuadrante */
    if ((capa.puntoA.x <= capa.puntoB.x && capa.puntoA.y <= capa.puntoB.y))
      margenB *= -1;
    else if (capa.puntoA.x >= capa.puntoB.x && capa.puntoA.y >= capa.puntoB.y)
      margenD *= -1;
    else
      margenB = margenD = 0;

    capa.vertices.push(capa.puntoA);
    capa.vertices.push({ x: capa.puntoA.x + margenB, y: capa.puntoB.y });
    capa.vertices.push(capa.puntoB);
    capa.vertices.push({ x: capa.puntoB.x + margenD, y: capa.puntoA.y });
    capa.puntos = this.calcularPuntosPoligono(capa);
    return capa;
  }
}