import { Component } from '@angular/core';
import { Capa } from 'src/app/model/capa.model';
import { CapasService } from 'src/app/services/capas.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
})
export class ArchivoComponent {
  constructor(
    private servicioCapas: CapasService,
  ) { }

  public getAcepted(): string {
    return 'application/json';
  }

  public abrirProyecto($event) {
    let archivo = $event.target.files[0];
    var contenido: Capa[];
    let reader = new FileReader();
    reader.readAsText(archivo);
    reader.onload = (event) => {
      contenido = JSON.parse(event.target.result.toString());
      if (this.servicioCapas.abrirProyecto(contenido)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Proyecto cargado con exito.',
          showConfirmButton: false,
          timer: 2500
        });
      }
    };
    // this.servicioCapas.abrirProyecto();
  }

  public guardarProyecto() {
    Swal.fire({
      title: 'Ingrese el nombre del proyecto:',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
      preConfirm: (name => {
        this.nameFile = name;
      }),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.servicioCapas.saveProyecto(this.nameFile);
        //Mensaje de terminado
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Proyecto guarado con exito.',
          showConfirmButton: false,
          timer: 2500
        });
      } else if (result.isDenied) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'El Proyecto no ha sido guardado.',
          showConfirmButton: false,
          timer: 1500
        })

      }
    });
  }

  generarImg() {
    Swal.fire({
      title: 'Ingrese el nombre de la imagen:',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Save`,
      denyButtonText: `Don't save`,
      preConfirm: (name => {
        this.nameFile = name;
      }),
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.servicioCapas.generarImg(this.nameFile);
        //Mensaje de terminado
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Imagen generada con exito. \nGueradando...',
          showConfirmButton: false,
          timer: 2500
        });
      } else if (result.isDenied) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Erorr al generar con exito.',
          showConfirmButton: false,
          timer: 1500
        })

      }
    });

  }
  private nameFile: string = "";
}