const formatDateOrCountdown = (dateString: string, limit: number = 7): string => {
    const date = new Date(dateString);
    
    const millis = date.getTime() - Date.now();
    const days = Math.ceil(millis / 86400000);

    if (days > limit) {
        return date.toLocaleDateString('en-GB');
    }

    if (days === 0) {
        return "Today";
    }

    if (days < 0) {
        return Math.abs(days).toString() + " days exceeded";
    }

    return days.toString();
}

export default formatDateOrCountdown;
