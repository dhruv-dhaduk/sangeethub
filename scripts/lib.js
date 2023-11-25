function convertTime(time) {
    if (time < 0)
        return null;

    time = Math.floor(time);

    let hours = 0, mins = 0, seconds = 0;
    if (time >= 3600) {
        hours = Math.floor(time / 3600);
        time %= 3600;
    }
    if (time >= 60) {
        mins = Math.floor(time / 60);
        time %= 60;
    }

    seconds = time;

    const hoursStr = hours > 0 ? hours + ":" : "";
    const minsStr = mins >= 0 && mins < 10 ? '0' + mins + ':' : mins + ':';
    const secondsStr = seconds >= 0 && seconds < 10 ? '0' + seconds : String(seconds);

    return hoursStr + minsStr + secondsStr;
}