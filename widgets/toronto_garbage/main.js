const OUR_GROUP = "Tuesday2";
const CALENDAR_URL = "https://www.toronto.ca/ext/swms/collection_calendar.csv";

const widget = new ListWidget();

// Load the calendar
const req = new Request(CALENDAR_URL);
const rawData = await req.loadString();

// Find the first row that is in our pickup group and occurs today or in the future
// NB: Assumes the CSV is sorted
const today = new Date();
const theSplitRow = rawData.split("\n").find((row) => {
  const splitRow = row.split(",");
  return splitRow[1] == OUR_GROUP && new Date(splitRow[2]) >= today;
}).split(",");

const nextGarbageDate = theSplitRow[2];

// Setup display
const stack = widget.addStack();
stack.layoutVertically();

let txt = stack.addText(`Garbage Day: ${nextGarbageDate}`);
txt.font = Font.systemFont(24);

stack.addSpacer();

let horizStack = stack.addStack();
horizStack.layoutHorizontally();

const imgNames = ["greenbin", "garbagebin", "bluebin", "yardwaste", "ctree"];
const thisImageNames = imgNames.filter((elt, idx) => theSplitRow[3 + idx] == "T");
const theseImages = [];
let firstImg = true;
for (imageName of thisImageNames) {
  if (firstImg) {
    firstImg = false;
  } else {
    horizStack.addSpacer();
  }
  let myReq = new Request(`https://www.toronto.ca/resources/swm_collection_calendar/img/${imageName}.png`);
  let img = await myReq.loadImage();
  horizStack.addImage(img);
}

// Refresh tomorrow at a bit past midnight
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 15, 0, 0);
widget.refreshAfterDate = tomorrow;

// Widget boilerplate
Script.setWidget(widget);
Script.complete();

// Display
widget.presentMedium();
