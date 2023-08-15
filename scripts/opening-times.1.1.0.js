var jsWeekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
var orderedWeekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
var today = new Date();
var todaysWeekDayIndex = today.getDay();
var todaysWeekDay = jsWeekDays[todaysWeekDayIndex];
function renderLocationStatus(_a) {
    var locationName = _a.locationName, hours = _a.hours;
    var openingSoonStatus = document.querySelectorAll(".status.opening-soon[data-location='".concat(locationName, "']"));
    var closingSoonStatus = document.querySelectorAll(".status.closing-soon[data-location='".concat(locationName, "']"));
    var openStatus = document.querySelectorAll(".status.open[data-location='".concat(locationName, "']"));
    var closedStatus = document.querySelectorAll(".status.closed[data-location='".concat(locationName, "']"));
    var renderStatus = function (status) {
        if (status === "OPEN") {
            openStatus.forEach(function (el) { return (el.style.display = "flex"); });
        }
        if (status === "CLOSED") {
            closedStatus.forEach(function (el) { return (el.style.display = "flex"); });
        }
        if (status === "CLOSING_SOON") {
            closingSoonStatus.forEach(function (el) { return (el.style.display = "flex"); });
        }
        if (status === "OPENING_SOON") {
            openingSoonStatus.forEach(function (el) { return (el.style.display = "flex"); });
        }
    };
    var getWeekDaysWithOpeningTimes = function () {
        var weekDaysWithOpeningTimes = [];
        orderedWeekDays.forEach(function (weekDay) {
            var weekDayRegex = new RegExp("(".concat(weekDay, ")\\s([01]?[0-9]|2[0-3]):([0-5][0-9])-([01]?[0-9]|2[0-3]):([0-5][0-9])"));
            var weekDayRegexMatches = hours.match(weekDayRegex);
            var hoursCanBeParsed = (weekDayRegexMatches === null || weekDayRegexMatches === void 0 ? void 0 : weekDayRegexMatches.length) && weekDayRegexMatches.length > 5;
            if (hoursCanBeParsed) {
                var openingTime = {
                    hour: weekDayRegexMatches[2],
                    min: weekDayRegexMatches[3],
                };
                var closingTime = {
                    hour: weekDayRegexMatches[4],
                    min: weekDayRegexMatches[5],
                };
                var currentWeekDayIndex = jsWeekDays.findIndex(function (jsWeekDay) { return jsWeekDay === weekDay; });
                var currentWeekDay = jsWeekDays[currentWeekDayIndex];
                var diffInDays = currentWeekDayIndex - todaysWeekDayIndex;
                if (todaysWeekDay === "Saturday" && currentWeekDay === "Sunday") {
                    diffInDays = 1;
                }
                if (todaysWeekDay === "Sunday") {
                    diffInDays = currentWeekDayIndex - 7;
                    if (currentWeekDay === "Monday") {
                        diffInDays = 1;
                    }
                    if (currentWeekDay === "Sunday") {
                        diffInDays = 0;
                    }
                }
                var weekDayAsDate = new Date();
                weekDayAsDate.setDate(weekDayAsDate.getDate() + diffInDays);
                var openingTimeAsDate = new Date(weekDayAsDate.getTime());
                openingTimeAsDate.setHours(parseInt(openingTime.hour), parseInt(openingTime.min), 0, 0);
                var closingTimeAsDate = new Date(weekDayAsDate.getTime());
                closingTimeAsDate.setHours(parseInt(closingTime.hour), parseInt(closingTime.min), 0, 0);
                var closingTimeMightBeTomorrow = openingTimeAsDate > closingTimeAsDate;
                if (closingTimeMightBeTomorrow) {
                    var startOfDay = new Date(closingTimeAsDate.getTime());
                    startOfDay.setHours(0, 0, 0, 0);
                    var timeZoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
                    var msSinceStartOfDay = closingTimeAsDate.getTime() - startOfDay.getTime();
                    var timeZoneIsBehindUTC = timeZoneOffsetInMs < 0;
                    var closingTimeIsTomorrow = timeZoneIsBehindUTC
                        ? msSinceStartOfDay > timeZoneOffsetInMs * -1
                        : msSinceStartOfDay < timeZoneOffsetInMs;
                    if (closingTimeIsTomorrow) {
                        closingTimeAsDate.setDate(closingTimeAsDate.getDate() + 1);
                    }
                    var msSinceOpeningTime = closingTimeAsDate.getTime() - openingTimeAsDate.getTime();
                    if (msSinceOpeningTime < 0) {
                        closingTimeAsDate.setDate(closingTimeAsDate.getDate() + 1);
                    }
                }
                weekDaysWithOpeningTimes.push({
                    weekDay: weekDay,
                    isOpen: true,
                    openingTime: openingTimeAsDate,
                    closingTime: closingTimeAsDate,
                });
            }
            else {
                weekDaysWithOpeningTimes.push({ weekDay: weekDay, isOpen: false });
            }
        });
        return weekDaysWithOpeningTimes;
    };
    var getStatus = function () {
        var weekDaysWithOpeningTimes = getWeekDaysWithOpeningTimes();
        var status = "CLOSED";
        var now = new Date();
        weekDaysWithOpeningTimes.forEach(function (weekDayWithOpeningTimes) {
            if (weekDayWithOpeningTimes.isOpen) {
                var openingTime = weekDayWithOpeningTimes.openingTime, closingTime = weekDayWithOpeningTimes.closingTime;
                var isOpenNow = openingTime <= now && now < closingTime;
                if (isOpenNow) {
                    var timeBeforeClose = (closingTime.getTime() - now.getTime()) / 1000;
                    timeBeforeClose /= 60;
                    var timeBeforeCloseInMin = Math.abs(Math.round(timeBeforeClose));
                    if (timeBeforeCloseInMin < 60) {
                        status = "CLOSING_SOON";
                    }
                    else {
                        status = "OPEN";
                    }
                }
                else {
                    var willOpenLaterToday = openingTime > now;
                    var timeBeforeOpen = (now.getTime() - openingTime.getTime()) / 1000;
                    timeBeforeOpen /= 60;
                    var timeBeforeOpenInMin = Math.abs(Math.round(timeBeforeOpen));
                    if (timeBeforeOpenInMin < 60) {
                        status = "OPENING_SOON";
                    }
                }
            }
        });
        renderStatus(status);
    };
    getStatus();
}
window.onload = function () {
    var initialLocations = document.querySelectorAll(".list-item[data-location][data-hours]");
    initialLocations.forEach(function (initialLocation) {
        var locationName = initialLocation.dataset.location;
        var hours = initialLocation.dataset.hours;
        if (locationName && hours) {
            renderLocationStatus({ locationName: locationName, hours: hours });
            console.log({ locationName: locationName, hours: hours });
        }
    });
    var observer = new MutationObserver(function (mutationList) {
        for (var _i = 0, mutationList_1 = mutationList; _i < mutationList_1.length; _i++) {
            var mutation = mutationList_1[_i];
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
                var addedNodes = Array.prototype.slice.call(mutation.addedNodes);
                addedNodes.forEach(function (addedNode) {
                    if (addedNode.parentElement.id == "list-wrapper") {
                        var locationName = addedNode.dataset.location;
                        var hours = addedNode.dataset.hours;
                        if (locationName && hours) {
                            renderLocationStatus({ locationName: locationName, hours: hours });
                            console.log({ locationName: locationName, hours: hours });
                        }
                    }
                });
            }
        }
    });
    var listWrapper = document.getElementById("list-wrapper");
    observer.observe(listWrapper, { childList: true });
};
