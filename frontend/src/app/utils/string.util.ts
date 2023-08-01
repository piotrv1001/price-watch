export class StringUtil {
  static stripPrice(productName: string): string {
    const commaIndex = productName.lastIndexOf(', ');
    const productNameWithoutPrice = productName.substring(0, commaIndex);
    return productNameWithoutPrice;
  }
}
