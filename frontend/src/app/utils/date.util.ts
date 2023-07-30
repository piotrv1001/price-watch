export class DateUtil {
  static WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  static MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  static getDate(date: string | Date | undefined): Date | null {
    if(typeof date === 'string') {
      return new Date(date);
    } else if(date instanceof Date) {
      return date;
    }
    return null;
  }
}
