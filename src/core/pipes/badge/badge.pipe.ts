import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badge'
})
export class BadgePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const result = value.split(/[,|;_\-@\s]+/).map(str=>{
      return str[0].toUpperCase();
    }).join('');
    return result;
  }

}
