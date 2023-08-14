// the order of JS week days - do not update!
const jsWeekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// the order we want the days to display in
const orderedWeekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let today = new Date();
let todaysWeekDayIndex = today.getDay();
let todaysWeekDay = jsWeekDays[todaysWeekDayIndex];

function renderLocationStatus({ locationName, hours }) {
  const openingSoonStatus = document.querySelectorAll(
    `.status.opening-soon[data-location='${locationName}']`
  );
  const closingSoonStatus = document.querySelectorAll(
    `.status.closing-soon[data-location='${locationName}']`
  );
  const openStatus = document.querySelectorAll(
    `.status.open[data-location='${locationName}']`
  );
  const closedStatus = document.querySelectorAll(
    `.status.closed[data-location='${locationName}']`
  );

  const renderStatus = (status) => {
    if (status === "OPEN") {
      openStatus.forEach((el) => (el.style.display = "flex"));
    }

    if (status === "CLOSED") {
      closedStatus.forEach((el) => (el.style.display = "flex"));
    }

    if (status === "CLOSING_SOON") {
      closingSoonStatus.forEach((el) => (el.style.display = "flex"));
    }

    if (status === "OPENING_SOON") {
      openingSoonStatus.forEach((el) => (el.style.display = "flex"));
    }
  };

  const getWeekDaysWithOpeningTimes = () => {
    let weekDaysWithOpeningTimes = [];

    orderedWeekDays.forEach((weekDay) => {
      const weekDayRegex = new RegExp(
        `\(${weekDay}\)\\s\([01]?[0-9]|2[0-3]\):\([0-5][0-9]\)-\([01]?[0-9]|2[0-3]\):\([0-5][0-9]\)`
      );

      const weekDayRegexMatches = hours.match(weekDayRegex);
      // will return ["Tuesday 08:30-16:00","Tuesday","08","30","16","00"]

      const hoursCanBeParsed =
        weekDayRegexMatches?.length && weekDayRegexMatches.length > 5;

      if (hoursCanBeParsed) {
        const openingTime = {
          hour: weekDayRegexMatches[2],
          min: weekDayRegexMatches[3],
        };

        const closingTime = {
          hour: weekDayRegexMatches[4],
          min: weekDayRegexMatches[5],
        };

        const currentWeekDayIndex = jsWeekDays.findIndex(
          (jsWeekDay) => jsWeekDay === weekDay
        );
        const currentWeekDay = jsWeekDays[currentWeekDayIndex];

        let diffInDays = currentWeekDayIndex - todaysWeekDayIndex;

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

        let weekDayAsDate = new Date();
        weekDayAsDate.setDate(weekDayAsDate.getDate() + diffInDays);

        let openingTimeAsDate = new Date(weekDayAsDate.getTime());
        openingTimeAsDate.setHours(
          parseInt(openingTime.hour),
          parseInt(openingTime.min),
          0,
          0
        );

        let closingTimeAsDate = new Date(weekDayAsDate.getTime());
        closingTimeAsDate.setHours(
          parseInt(closingTime.hour),
          parseInt(closingTime.min),
          0,
          0
        );

        const closingTimeMightBeTomorrow =
          openingTimeAsDate > closingTimeAsDate;

        if (closingTimeMightBeTomorrow) {
          let startOfDay = new Date(closingTimeAsDate.getTime());
          startOfDay.setHours(0, 0, 0, 0);

          let timeZoneOffsetInMs = new Date().getTimezoneOffset() * 60000;
          const msSinceStartOfDay = closingTimeAsDate - startOfDay;

          const timeZoneIsBehindUTC = timeZoneOffsetInMs < 0;

          const closingTimeIsTomorrow = timeZoneIsBehindUTC
            ? msSinceStartOfDay > timeZoneOffsetInMs * -1
            : msSinceStartOfDay < timeZoneOffsetInMs;

          if (closingTimeIsTomorrow) {
            closingTimeAsDate.setDate(closingTimeAsDate.getDate() + 1);
          }

          const msSinceOpeningTime = closingTimeAsDate - openingTimeAsDate;

          if (msSinceOpeningTime < 0) {
            closingTimeAsDate.setDate(closingTimeAsDate.getDate() + 1);
          }
        }

        weekDaysWithOpeningTimes.push({
          weekDay,
          isOpen: true,
          openingTime: openingTimeAsDate,
          closingTime: closingTimeAsDate,
        });
      } else {
        weekDaysWithOpeningTimes.push({ weekDay, isOpen: false });
      }
    });

    return weekDaysWithOpeningTimes;
  };

  const getStatus = () => {
    const weekDaysWithOpeningTimes = getWeekDaysWithOpeningTimes();
    let status = "CLOSED";
    const now = new Date();

    weekDaysWithOpeningTimes.forEach((weekDayWithOpeningTimes) => {
      if (weekDayWithOpeningTimes.isOpen) {
        const { openingTime, closingTime } = weekDayWithOpeningTimes;
        const isOpenNow = openingTime <= now && now < closingTime;

        if (isOpenNow) {
          let timeBeforeClose = (closingTime.getTime() - now.getTime()) / 1000;
          timeBeforeClose /= 60;
          const timeBeforeCloseInMin = Math.abs(Math.round(timeBeforeClose));

          if (timeBeforeClose < 60) {
            status = "CLOSING_SOON";
          } else {
            status = "OPEN";
          }
        } else {
          const willOpenLaterToday = openingTime > now;
          let timeBeforeOpen = (now.getTime() - openingTime.getTime()) / 1000;
          timeBeforeOpen /= 60;
          const timeBeforeOpenInMin = Math.abs(Math.round(timeBeforeOpen));

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

// Get initial locations on first load
window.onload = function () {
  const initialLocations = document.querySelectorAll(
    `.list-item[data-location][data-hours]`
  );
  const listWrapper = document.getElementById("list-wrapper");

  initialLocations.forEach((initialLocation) => {
    const locationName = initialLocation.dataset.location;
    const hours = initialLocation.dataset.hours;

    if (locationName && hours) {
      renderLocationStatus({ locationName, hours });

      console.log({ locationName, hours });
    }
  });

  // Listen for ny new children of the list-wrapper element
  listWrapper.addEventListener(
    "DOMNodeInserted",
    function (event) {
      // check if new element is direct descendant of the list wrapper
      // (we don't want to get any nested children)
      if (event.target.parentNode.id == "list-wrapper") {
        const locationName = event.target.dataset.location;
        const hours = event.target.dataset.hours;

        if (locationName && hours) {
          renderLocationStatus({ locationName, hours });

          console.log({ locationName, hours });
        }
      }
    },
    false
  );
};
