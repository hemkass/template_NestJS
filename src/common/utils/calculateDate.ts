export class CalculateDate {
  static expireInXSeconds(time: number) {
    return Math.floor(Date.now() / 1000) + time;
  }
  static expireInXMinutes(time: number) {
    return Math.floor(Date.now() / 1000) + 60 * time;
  }
  static expireInXHours(time: number) {
    return Math.floor(Date.now() / 1000) + 3600 * time;
  }

  static expireInXdays(time: number) {
    return Math.floor(Date.now() / 1000) + 86400 * time;
  }

  static diffBetweenTodayAndADate(date: Date | string) {
    const today = new Date();
    const d1 = new Date(date);
    return Math.floor(
      (today.getTime() - d1.getTime()) / 86400000 //(1000 * 3600 * 24)
    );
  }
}
