
const formatDateOrCountdown = (date : Date, limit : number = 7): string => {
    const millis = date.getTime() - Date.now()
    const days = Math.ceil(millis/86400000)

    if(days > limit){
        return date.toLocaleDateString('en-GB')
    }

    if(days == 0) {
        return "Today"
    }

    if(days < 0){
        return Math.abs(days).toString() + " days exceeded"
    }
    return days.toString()
}

export default formatDateOrCountdown