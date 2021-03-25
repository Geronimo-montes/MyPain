import { Injectable } from '@angular/core';
import { ParCoordenada } from '../model/capa.model';
import { DibujarLineaService } from './dibujar-linea.service';

@Injectable({
  providedIn: 'root'
})
export class DibujarPoligonoService {

  constructor(
    private dibujarLinea: DibujarLineaService,
  ) { }

  public poligono(puntoA: ParCoordenada, puntoB: ParCoordenada, numeroLados: number, factorReduce: number): ParCoordenada[] {
    let
      puntos: ParCoordenada[] = [],
      centro: ParCoordenada = puntoA,
      radio = Math.sqrt(Math.pow(puntoB.x - puntoA.x, 2) + Math.pow(puntoB.y - puntoA.y, 2)),
      radianes = (2 * Math.PI) / numeroLados,

      verticeA: ParCoordenada = {
        x: centro.x + radio * Math.cos(radianes * 0),
        y: centro.y + radio * Math.sin(radianes * 0),
      },
      verticeB: ParCoordenada;

    for (let i = 1; i < numeroLados + 1; i++) {
      verticeB = {
        x: Math.abs(centro.x + radio * Math.cos(radianes * i)),
        y: Math.abs(centro.y + radio * Math.sin(radianes * i)),
      };

      this.dibujarLinea.bresenhamLine(verticeA, verticeB, factorReduce)
        .forEach(punto => puntos.push(punto));
      verticeA = verticeB;
    }
    return puntos;
  }
}
