import moment from "moment";

export function formatNumber(amount, dec = 0) {
	return Number(amount)
		.toFixed(dec)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function todayDate() {
	return moment().format("dddd, MMMM Do YYYY");
}

export function dateTimeFormat(givenDate) {
	const date = moment(givenDate);
	return date.format("D MMM YYYY, h:mm a");
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

export function formatDateSince(givenDate) {
	const date = moment(givenDate);
	const now = moment();
	const diff = now.diff(date);

	if (diff < 3600000) {
		// less than 1 hour
		const seconds = Math.floor(diff / 1000);
		return `${seconds} secs ago`;
	} else if (diff < 86400000) {
		// less than 1 day
		const minutes = Math.floor(diff / 60000);
		if (minutes < 60) {
			return `${minutes} mins ago`;
		} else {
			const hours = Math.floor(diff / 3600000);
			return `${hours} hours ago`;
		}
	} else if (diff < 172800000) {
		// yesterday
		return `Yesterday at ${date.format("h:mm a")}`;
	} else {
		return date.format("D MMM YYYY, h:mm a");
	}
}

export function joinedSinceFormat(givenDate) {
	const date = moment(givenDate);
	const now = moment();
	const diff = now.diff(date);

	if (diff < 3600000) {
		// less than 1 hour
		const seconds = Math.floor(diff / 1000);
		return `Joined ${seconds} secs ago`;
	} else if (diff < 86400000) {
		// less than 1 day
		const minutes = Math.floor(diff / 60000);
		if (minutes < 60) {
			return `Joined ${minutes} mins ago`;
		} else {
			const hours = Math.floor(diff / 3600000);
			return `Joined ${hours} hours ago`;
		}
	} else if (diff < 86400000) {
		// TODAY
		return `Joined today at ${date.format("h:mm a")}`;
	} else if (diff < 172800000) {
		// YESTERSAY
		return `Joined yesterday at ${date.format("h:mm a")}`;
	} else if (diff < 604800000) {
		// up to 7 days ago
		const days = Math.floor(diff / 86400000);
		return `Joined ${days} days ago at ${date.format("h:mm a")}`;
	} else if (diff < 1209600000) {
		// 1 WEEK AGO
		return `Joined 1 week ago at ${date.format("h:mm a")}`;
	} else {
		return `Joined since ${date.format("MMM DD YYYY, h:mm a")}`;
	}
}

export function calRemainingDays(startDate, endDate) {
	const start = moment(startDate);
	const end = moment(endDate);
	return end.diff(start, "days");
}

export function truncateString(input, num = 25) {
	if (input?.length > num) {
		return input?.substring(0, num) + "...";
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

export function cap1stLetter(string) {
	return string?.slice(0, 1)?.toUpperCase() + string?.slice(1);
}

export function isWithinLast7Days(date) {
	return moment(date).isAfter(moment().subtract(7, "days"));
}

export function getInitials(firstname, lastname) {
	const firstInitial = firstname?.charAt(0);
	const secondInitial = lastname?.charAt(0);
	return `${firstInitial}${secondInitial}`;
}

export function getRemainingMinutes(dateTimeStr) {
	const currentTime = new Date(Date.now());
	const expiresTime = new Date(dateTimeStr);
	const timeDiff = expiresTime - currentTime;
	let remainingTime;

	const minutes = Math.floor(timeDiff / 60000);
	const seconds = Math.floor((timeDiff % 60000) / 1000);

	if (timeDiff <= 0) {
		return "00:00";
	}

	return `${minutes?.toString().padStart(2, "0")}:${seconds?.toString().padStart(2, "0")}`;
}

let intervalId = null;
export function countdownTimer(dateTimeStr, callback) {
	if (intervalId) {
		clearInterval(intervalId);
	}

	let timeLeft = getRemainingMinutes(dateTimeStr);
	let initialTimeLeft = timeLeft;

	intervalId = setInterval(() => {
		timeLeft = getRemainingMinutes(dateTimeStr);

		if (timeLeft !== "00:00") {
			callback(timeLeft);
		} else {
			clearInterval(intervalId);
			intervalId = null;
			callback("00:00");
		}
	}, 1000);

	// Return a function to reset the timer
	return (newDateTimeStr) => {
		clearInterval(intervalId);
		intervalId = null;
		countdownTimer(newDateTimeStr, callback);
	};
}
