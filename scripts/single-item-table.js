// Replace this with the field value
const hours = `{{wf {&quot;path&quot;:&quot;days-2&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}`;
const table = document.getElementById("opening-times");

// the order of JS week days - do not update!
const JS_WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TODAYS_DATE = new Date();
let currentWeekDay = JS_WEEK_DAYS[TODAYS_DATE.getDay()];

// Everything below this line is only for the location page
// (not the index page)

// the order we want the days to display in
const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const render12HourTime = ({ hour, min }) => {
  const timeString = `${hour.length === 1 ? `0${hour}` : hour}:${min}:00`;
  // Prepend any date, it doesn't matter
  const timeString12hr = new Date(
    "1970-01-01T" + timeString + "Z"
  ).toLocaleTimeString("en-GB", {
    timeZone: "Europe/London",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });

  return timeString12hr;
};

// We have to reverse the days since the table rows are added to the top
WEEK_DAYS.reverse().forEach((weekDay) => {
  const dayRegex = new RegExp(
    `\(${weekDay}\)\\s\([01]?[0-9]|2[0-3]\):\([0-5][0-9]\)-\([01]?[0-9]|2[0-3]\):\([0-5][0-9]\)`
  );

  const matches = hours.match(dayRegex);
  // will return ["Tuesday 08:30-16:00","Tuesday","08","30","16","00"]

  const isOpenThatDay = matches?.length > 5;
  const isToday = currentWeekDay === weekDay;

  // Create an empty <tr> element and add it to the 1st position of the table:
  const row = table.insertRow(0);

  if (isToday) {
    row.classList.add("semibold-text");
  }

  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);

  // Add some text to the new cells:
  cell1.innerHTML = weekDay;

  if (isOpenThatDay) {
    const openingTime = { hour: matches[2], min: matches[3] };
    const closingTime = { hour: matches[4], min: matches[5] };

    cell2.innerHTML = `${render12HourTime({
      ...openingTime,
    })} - ${render12HourTime({ ...closingTime })}`;
  } else {
    cell2.innerHTML = "Closed";
  }
});
