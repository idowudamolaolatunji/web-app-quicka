import moment from "moment";

export function formatNumber(amount, dec=0) {
	return Number(amount)
		.toFixed(dec)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function todayDate() {
	return moment().format("dddd, MMMM D, YYYY");
}

export function dateTimeFormat(givenDate) {
	const date = moment(givenDate);
  	return date.format("D MMM YYYY, h:mm A");
}

export function ymdDateSlashTimeFormat(givenDate) {
	const date = moment(givenDate);
	return date.format("DD / MM / YYYY, h:mm A");
} 

export function ymdDateSlashFormat(givenDate) {
	const date = moment(givenDate);
	return date.format("DD / MM / YYYY");
} 

export function ymdDateFormat(givenDate) {
	const date = moment(givenDate);
	return date.format("YYYY-MM-DD");
} 


export function truncateString(input, num=25) {
    if (input?.length > num) {
        return input.substring(0, num) + "...";
    } else {
        return input;
    }
}

const currentTime = moment().hours();
export function getGreeting() {
	if (currentTime < 12) {
		return "Good morning";
	} else if (currentTime < 16) {
		return "Good afternoon";
	} else {
		return "Good evening";
	}
}

export function getExpression() {
	if (currentTime < 12) {
		return "🌞";
	} else if (currentTime < 16) {
		return "👋🏿";
	} else {
		return "🌙";
	}
}

export function openWidget() {
	FreshworksWidget("open");
}
export function closeWidget() {
	FreshworksWidget("close");
}

export function formatDate(givenDate) {
	const currentDate = moment().startOf("day");
	const inputDate = moment(givenDate);

	const diffInSeconds = moment().diff(inputDate, "seconds");
	if (diffInSeconds < 0) {
		return `Today by ${inputDate.format("h:mm A")}`;
	}
	if (diffInSeconds === 0) {
		return "Just now";
	}
	if (diffInSeconds < 60) {
		return `${diffInSeconds} secs ago`;
	} 

	const diffInMins = moment().diff(inputDate, "minutes");
	if (diffInMins < 60) {
		return `${diffInMins} mins. ago`;
	}

	if (inputDate.isSame(currentDate, "day")) {
		return `Today, ${inputDate.format("h:mm A")}`;
	} else if (inputDate.isSame(currentDate.clone().subtract(1, "day"), "day")) {
		return `Yesterday, ${inputDate.format("h:mm A")}`;
	} else if (inputDate.isSame(currentDate.clone().subtract(2, "day"), "day")) {
		return `Two days ago, ${inputDate.format("h:mm A")}`;
	} else {
		const diffInDays = moment().diff(inputDate, "days");
		if (diffInDays < 7) {
			return `Last ${inputDate.format("dddd")}, at ${inputDate.format("h:mm A")}`;
		} else if (diffInDays < 14) {
			return `Last week, ${inputDate.format("dddd")}, at ${inputDate.format("h:mm A")}`;
		} else if (diffInDays < 21) {
			return `2 weeks ago, ${inputDate.format("dddd")}, at ${inputDate.format("h:mm A")}`;
		} else if (diffInDays < 30) {
			return `3 weeks ago, ${inputDate.format("dddd")}, at ${inputDate.format("h:mm A")}`;
		} else {
			const diffInMonths = moment().diff(inputDate, "months");
			if (diffInMonths < 12) {
				return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
			} else {
				const day = inputDate.date();
				const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
				return `on ${inputDate.format("MMM Do") + suffix + ", " + inputDate.format("YYYY")}`;
			}
		}
	}
}

export function capitalizeFirstLetter(string) {
	return string.slice(0, 1).toUpperCase() + string.slice(1);
}


export function isWithinLast7Days(date) {
	return moment(date).isAfter(moment().subtract(7, 'days'));
}
  


export function getInitials(fullName) {
	const nameArray = fullName.split(" ");
	const firstInitial = nameArray[0].charAt(0);
	const secondInitial = nameArray[1].charAt(0);
	return `${firstInitial}${secondInitial}`;
}


let intervalId = null
export function countdownTimer(duration=120, callback) {
	if (intervalId) {
		clearInterval(intervalId);
	  }
	
	  let secondsLeft = duration;
	  intervalId = setInterval(() => {
		callback(`${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`);
		secondsLeft--;
		if (secondsLeft === 0) {
		  clearInterval(intervalId);
		  intervalId = null;
		  callback("00:00");
		}
	  }, 1000);
	
	  // Return a function to reset the timer
	  return (newDuration) => {
		clearInterval(intervalId);
		intervalId = null;
		countdownTimer(newDuration, callback);
	  };
	
	
}
