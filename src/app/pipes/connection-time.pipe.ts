import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'connectionTime',
})
export class ConnectionTimePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '0 h. 0 min. 0 sec.';
    const h: number = Math.floor(value / 3600);
    const min: number = Math.floor((value % 3600) / 60);
    const sec: number = ((value % 3600) % 60) % 60;
    return h + ' h ' + min + ' min ' + sec + ' sec';
  }
}
