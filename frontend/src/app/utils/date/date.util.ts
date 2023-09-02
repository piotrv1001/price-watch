export class DateUtil {

  static WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  static MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  static getDate(date: string | Date | undefined): Date | null {
    if(typeof date === 'string') {
      return new Date(date);
    } else if(date instanceof Date) {
      return date;
    }
    return null;
  }

  static formatDate(date?: Date | string): string {
    if(!date) {
      return '';
    }
    if(typeof date === 'string') {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  static getLabels(startDate?: Date, endDate?: Date): string[] {
    if(!startDate || !endDate) {
      return [];
    }
    const labels: string[] = [];
    const date = new Date(startDate);
    while(date <= endDate) {
      const label = DateUtil.formatDate(date);
      labels.push(label);
      date.setDate(date.getDate() + 1);
    }
    return labels;
  }
}

