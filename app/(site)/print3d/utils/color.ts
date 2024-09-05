export function changeColorName(name: string) {
    if (name === '#00B140') return 'зеленый';
    if (name === '#EF3340') return 'красный';
    if (name === '#F6921E') return 'оранжевый';
    if (name === '#0085CA') return 'голубой';
    if (name === '#5d007f') return 'фиолетовый';
    if (name === '#D62598') return 'розовый';
    if (name === '#FFFFFF') return 'белый';
    if (name === '#8A8D8F') return 'серый';
    if (name === '#2D2926') return 'черный';
    return 'неизвестный цвет'; 
  }