import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'padStart'
})
export class PadStartPipe implements PipeTransform {
  transform(value?: number): string | undefined {
    return value?.toString().padStart(2, '0');
  }
}
