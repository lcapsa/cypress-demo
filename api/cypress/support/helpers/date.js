export default class GenerateDate {
  format(date) {
    return date.toISOString().replace("T", " ").slice(0, -5);
  }

  getNow() {
    return this.format(new Date(Date.now()));
  }

  getNowPlusHours(noHours) {
    var date = new Date(Date.now());
    date.setHours(date.getHours() + noHours);
    return this.format(date);
  }
}
