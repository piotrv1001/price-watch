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

  static formatPrice(price: number | string): string {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) {
        return parsedPrice.toFixed(2);
      } else {
        throw new Error('Invalid price format');
      }
    } else {
      throw new Error('Invalid input');
    }
  }
}
