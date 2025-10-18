import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iDtoName'
})
export class IDtoNamePipe implements PipeTransform {

  transform(value:string,transformFrom: string,mappedArray:any[], transformTo:string): string {
    const result= mappedArray.filter(v=> v[transformFrom] === value)[0]?.[transformTo] || null;
    return result;
  }

}
