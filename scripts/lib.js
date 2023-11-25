function convertTime(time) {
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

    return hours + ":" + mins + ":" + seconds;
}