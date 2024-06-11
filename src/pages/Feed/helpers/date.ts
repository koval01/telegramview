import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    relativeTime: {
        past: "%s",
        s: '1s',
        ss: '%ds',
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d"
    }
});

export const formatDate = (unixTimestamp: number) => {
    const date = dayjs.unix(unixTimestamp);
    const now = dayjs();
    return now.diff(date, 'hour') < 24 ? date.fromNow() : date.format('MMM D');
};
