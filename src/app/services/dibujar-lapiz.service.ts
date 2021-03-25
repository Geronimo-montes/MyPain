import { Injectable } from '@angular/core';
import { ParCoordenada } from '../model/capa.model';
import { DibujarLineaService } from './dibujar-linea.service';

@Injectable({
  providedIn: 'root'
})
export class DibujarLapizService {

  constructor(
    private dibujarLinea: DibujarLineaService,
  ) { }

  /**
   * @name lapiz
   * @param punto Nuevo punto a trazar 
   * @param puntos Array de puntos ya existente
   * @param factorReduce Factor de reduccion de los puntos a trazar
   * @returns Arrat puntos del tipo ParCoordenada
   */
  public lapiz(punto: ParCoordenada, puntos: ParCoordenada[], factorReduce: number): ParCoordenada[] {
    if (puntos.length === 0)
      puntos.push(punto);
    else
      this.dibujarLinea.bresenhamLine(puntos[puntos.length - 1], punto, factorReduce)
        .forEach((punto: ParCoordenada) => puntos.push(punto));
    return puntos;
  }
}