const CALENDAR_URL = "https://widgetdata.kevinhayeswilson.com/holidays.csv";

const widget = new ListWidget();

// Load the calendar
const req = new Request(CALENDAR_URL);
const rawData = await req.loadString();

// Find today's data
// NB: Assumes the CSV is sorted
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');  // +1 because months are 0-based
const day = String(today.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
const theSplitRow = rawData.split("\n").find((row) => {
  const splitRow = row.split(",");
  return splitRow[0] == formattedDate;
}).split(",");

const isHoliday = theSplitRow[2] == "True";
const dayOfWeek = theSplitRow[1];

// Setup display
const stack = widget.addStack();
stack.layoutVertically();

let header = stack.addText("⚡ Cost ⚡");
header.font = Font.systemFont(24);
header.textColor = new Color("black");
stack.addSpacer();

if (isHoliday) {
  let txt = stack.addText(`Holidays are Cheap!`);
  txt.font = Font.systemFont(24);
  txt.textColor = new Color("black");

  widget.backgroundColor = Color("#d9e7bb");
} else if (dayOfWeek === "SATURDAY" || dayOfWeek === "SUNDAY") {
  let txt = stack.addText(`Weekends are Cheap!`);
  txt.font = Font.systemFont(24);
  txt.textColor = new Color("black");

  widget.backgroundColor = Color("#d9e7bb");
} else {
  let now = new Date();
  if (now.getHours() < 7 || now.getHours() >= 19) {
    let txt = stack.addText(`Evenings are Cheap!`);
    txt.font = Font.systemFont(24);
    txt.textColor = new Color("black");

    widget.backgroundColor = new Color("#d9e7bb");
  } else if ((now.getHours() >= 7 && now.getHours() < 11) || (now.getHours() >= 11 && now.getHours() < 17)) {
    let txt = stack.addText(`Current mid-peak. Wait until 7pm`);
    txt.font = Font.systemFont(24);
    txt.textColor = new Color("black");

    widget.backgroundColor = new Color("#ffe59f");
  } else {
    let txt = stack.addText(`Peak. Don't start!`);
    txt.font = Font.systemFont(24);
    txt.textColor = new Color("black");

    widget.backgroundColor = new Color("#f2c6a9");
  }
}

const nextRefreshTime = new Date();
nextRefreshTime.setHours(nextRefreshTime.getHours() + 1, 1, 0, 0);
widget.refreshAfterDate = nextRefreshTime;

// Widget boilerplate
Script.setWidget(widget);
Script.complete();

// Display
widget.presentSmall();
