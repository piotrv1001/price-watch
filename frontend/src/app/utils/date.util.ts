export class DateUtil {
  static getDate(date: string | Date | undefined): Date | null {
    if(typeof date === 'string') {
      return new Date(date);
    } else if(date instanceof Date) {
      return date;
    }
    return null;
  }
}
