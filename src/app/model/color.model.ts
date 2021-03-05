export interface interfaceButtonColor {
  nombre: string,
  hex: Color,
  tooltip: string,
}

export enum Color {
  White = '#FFFFFF',
  Silver = '#C0C0C0',
  Gray = '#808080',
  Black = '#000000',
  Red = '#FF0000',
  Maroon = '#800000',
  Yellow = '#FFFF00',
  Olive = '#808000',
  Lime = '#00FF00',
  Green = '#008000',
  Aqua = '#00FFFF',
  Teal = '#008080',
  Blue = '#0000FF',
  Navy = '#000080',
  Fuchsia = '#FF00FF',
  Purple = '#800080',
}

export const colores: interfaceButtonColor[] = [
  { nombre: 'White', hex: Color.White, tooltip: '', },
  { nombre: 'Silver', hex: Color.Silver, tooltip: '', },
  { nombre: 'Gray', hex: Color.Gray, tooltip: '', },
  { nombre: 'Black', hex: Color.Black, tooltip: '', },
  { nombre: 'Red', hex: Color.Red, tooltip: '', },
  { nombre: 'Maroon', hex: Color.Maroon, tooltip: '', },
  { nombre: 'Yellow', hex: Color.Yellow, tooltip: '', },
  { nombre: 'Olive', hex: Color.Olive, tooltip: '', },
  { nombre: 'Lime', hex: Color.Lime, tooltip: '', },
  { nombre: 'Green', hex: Color.Green, tooltip: '', },
  { nombre: 'Aqua', hex: Color.Aqua, tooltip: '', },
  { nombre: 'Teal', hex: Color.Teal, tooltip: '', },
  { nombre: 'Blue', hex: Color.Blue, tooltip: '', },
  { nombre: 'Navy', hex: Color.Navy, tooltip: '', },
  { nombre: 'Fuchsia', hex: Color.Fuchsia, tooltip: '', },
  { nombre: 'Purple', hex: Color.Purple, tooltip: '', },
];