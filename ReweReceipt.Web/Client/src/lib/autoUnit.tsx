export default function autoUnit(timestamps: string[]) {
    if (timestamps.length < 2) return 'day';

    const dates = timestamps.map(t => new Date(t).getTime());
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    const range = max - min;

    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const MONTH = DAY * 30;
    const YEAR = DAY * 365;

    if (range > 5 * YEAR) return 'year';
    if (range > 5 * MONTH) return 'month';
    if (range > 7 * DAY) return 'week';
    return 'day';
};