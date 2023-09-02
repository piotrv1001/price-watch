export class StringUtil {

  static stripPrice(productName: string): string {
    const commaIndex = productName.lastIndexOf(', ');
    const productNameWithoutPrice = productName.substring(0, commaIndex);
    return productNameWithoutPrice;
  }

  static removeContentInBraces(inputString: string): string {
    const regex = /\s\([^)]+\)$/;
    const modifiedString = inputString.replace(regex, '');
    return modifiedString.trim();
  }
}
