import { StringUtil } from '../utils/string/string.util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripPrice'
})
export class StripPricePipe implements PipeTransform {
  transform(productName?: string): string {
    if (!productName) {
      return '';
    }
    return StringUtil.stripPrice(productName);
  }
}
