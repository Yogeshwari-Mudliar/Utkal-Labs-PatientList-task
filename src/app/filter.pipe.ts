import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
private search:string=''

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
