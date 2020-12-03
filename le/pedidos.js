SORT_DATA_RANGE = "b3:m999";
SHEET_DATE_CELL = "p4"; // CELDA EN DONDE SE ENCUENTRA LA FECHA DE LA HOJA ACTUAL
CREATE_DATE_CELL = "R10"; // CELDA EN DONDE SE ENCUENTRA LA FECHA QUE TENDRÁ LA HOJA QUE SE VA A CREAR
ENTREGADO_RANGE = "m3:m102";
const REGEX_NAME = /(LUNES|MARTES|MIÉRCOLES|JUEVES|VIERNES|SÁBADO|DOMINGO) [0-9]{1,2}\/(ENE|FEB|MAR|ABR|MAY|JUN|JUL|AGO|SEP|SET|OCT|NOV|DIC)\. \[GS\]/;

SORT_ORDER = [
    { column: 13, ascending: false }, // 3 = column number, sorting by descending order
    { column: 9, ascending: true }, // 1 = column number, sort by ascending order 
    { column: 8, ascending: true },
    { column: 2, ascending: true }
];


var colorsWeek = {
    "lunes": "#7ec0ee", //whiteblue
    "martes": "#b6d7a8", //green
    "miércoles": "#cccccc", //gray
    //"jueves":"#ffd966", //yellow
    "jueves": "#f1c232",
    "viernes": "#f9cb9c", //orange
    "sábado": "#d5a6bd", //rose,
    "domingo": "#8e7cc3" //purple
};


var ss = SpreadsheetApp.getActiveSpreadsheet();


function onEdit(e) {
    var nameToday = nameByDate();
    var sheetToday = ss.getSheetByName(nameToday);
    var sheet = ss.getActiveSheet();
    var name = sheet.getName();
    var match = REGEX_NAME.exec(name);
    var cell = sheet.getActiveCell();
    var col = cell.getColumn();
    var row = cell.getRow();
    //if (sheet.getName() == nameToday) {
    if ((match || name == "template") && (col == 8 || col == 9 || col == 13)) {

        if (col == 9 && cell.getValue() == "AHORA") {
            sheet.getRange(row, 8).setValue(new Date().toLocaleTimeString())
                .setFontSize(10)
                .setFontColor("#ffe599")
                .setNumberFormat('h:mm A/P"M"')
        } else if (col == 13 && cell.getValue() == "ENTREGADO") {
            sheet.getRange(row, 8)
                // .setFontSize(9)
                .setFontColor("black");
        }

        sortTable(sheet);

        //var email = Session.getActiveUser().getEmail();
        ss.toast('Se ordenaron los datos.');
    }
}


function onOpen(e) {


    var name = nameByDate();
    var sheet = ss.getSheetByName(name)
    var today = dayInWeek() + " " + simpleDate();
    if (sheet) {
        var color = sheet.activate().getTabColor();
        if (color != "#008000") { //green
            sheet.setTabColor("#008000");
        }
        ss.toast("Se abrió automáticamente la hoja de hoy " + today, "MENSAJE ", 5)
    } else {
        ss.getSheetByName("acciones").activate();
        ss.toast("La hoja de hoy " + today + " no ha sido encontrada. Utilizar la pestaña 'ACCIONES' para crearla.", "HOJA NO ENCONTRADA", 10);
    }

    var date = new Date();
    date.setDate(date.getDate() - 1)
    var namey = nameByDate(date);
    var sheety = ss.getSheetByName(namey)
    if (sheety) {
        var color = sheety.getTabColor();
        if (color) {
            sheety.setTabColor(null);
        }
    }

}

function setTabColor(sheet) {
    var match = REGEX_NAME.exec(sheet.getName());
    var now = new Date().setHours(0, 0, 0, 0);

    //var name = nameByDate();

    var str = "";

    if (match) {
        var date = sheet.getRange(SHEET_DATE_CELL).getValue();
        //str+=date+" ";

        if (new Date(date) < now) {
            // sheet.setTabColor("#e98c00"); //orangedark
            sheet.setTabColor("gray");
        }
    }

    return sheet.getName();
}


function existSheet(date) {
    var name = nameByDate(date);
    return ss.getSheetByName(name);
}

function createSheet(date) {
    var dateString = dayInWeek(date) + " " + simpleDate(date);
    var sheet = ss.getActiveSheet();
    var newSheet = existSheet(date);
    if (newSheet) {
        newSheet.showSheet();
        ss.toast("Se abrió la hoja con la fecha " + dateString + ". La hoja ya había sido creada previamente.", "HOJA ENCONTRADA", 5);
        newSheet.activate();
        return false;
    }


    var wkDay = dayInWeek(date);
    var color = colorsWeek[wkDay.toLowerCase()];
    var newSheet = ss.getSheetByName("template").copyTo(ss);
    newSheet.setName(nameByDate(date)).getRange(SHEET_DATE_CELL).setValue(date);
    newSheet.getRange("b1").setValue(newSheet.getRange("b1").getValue() + " - " + wkDay + " " + simpleDate(date));
    newSheet.getRange("a1:m2").setBackground(color);
    // newSheet.setTabColor(color);
    //var nextday = new Date(date.setDate(date.getDate()+1));
    //newSheet.getRange(CREATE_DATE_CELL).setValue(nextday);
    //newSheet.getRange(row, column).set
    ss.toast("Se creó hoja de pedidos para el día " + dateString, "HOJA CREADA", 5);
    newSheet.showSheet().activate().setTabColor(null);
    return newSheet;
}

function createByDate() {
    var sheet = ss.getSheetByName("acciones");
    var date = sheet.getRange("e4").getValue();
    var newSheet = createSheet(date);
    var nextday = new Date(date.setDate(date.getDate() + 1));
    sheet.getRange("e4").setValue(nextday);


}

function createToday() {
    var date = new Date(new Date().setHours(0, 0, 0, 0));
    createSheet(date);
}

function finishSheet() {

    // ss.toast("Analizando y finalizando hoja. Espere unos segundos...");
    var sheet = ss.getActiveSheet();
    var date = sheet.getRange(SHEET_DATE_CELL).getValue();
    var now = new Date().setHours(0, 0, 0, 0);
    if (date >= now) {
        ss.toast("No se pueden finalizar los pedidos de una hoja con fecha igual o posterior al día de hoy.", "MENSAJE", 5);
        return false;
    }

    // sheet.getRange(ENTREGADO_RANGE).setValue("ENTREGADO");

    var pendings = iterate(sheet);
    sortTable(sheet);
    if (pendings > 0) {
        ss.toast("Aún quedan " + pendings + " pedidos que no han sido marcados como entregados.", "PEDIDOS PENDIENTES", 5);
        return false;
    }
    sheet.hideSheet();
    ss.toast('Se finalizó y ocultó la hoja del día ' + dayInWeek(date) + " " + simpleDate(date), "HOJA FINALIZADA", 5);

}



function iterate(sheet) {

    //  const sheet = ss.getActiveSheet();
    var range = sheet.getRange(SORT_DATA_RANGE);

    var rows = range.getNumRows();
    var cols = range.getNumColumns();
    var data = range.getValues();
    var pendings = 0;

    for (var r = 0; r < rows; r++) {
        var values = data[r].join("");
        if (values == "PENDIENTE") {
            range.getCell(r + 1, cols).setValue("");
        } else if (values.includes("PENDIENTE")) {
            pendings++;
        }
    }
    return pendings;



}

function nameByDate(date) {
    if (!date) date = new Date();

    var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var weekDay = dayInWeek(date);

    var day = Utilities.formatDate(date, "GMT-5", "dd");
    var monthIndex = Utilities.formatDate(date, "GMT-5", "M") - 1;
    var month = months[monthIndex].substring(0, 3) + ".";
    return (weekDay + " " + day + "/" + month + " [gs]").toUpperCase();
}

function dayInWeek(date) {
    if (!date) date = new Date();
    var week = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    var weekDayIndex = Utilities.formatDate(date, "GMT-5", "u") - 1;
    return week[weekDayIndex];
}

function simpleDate(date) {
    if (!date) date = new Date();
    return Utilities.formatDate(date, "GMT-5", "dd/MM/yyyy");
}

function sortTable(sheet) {
    //var name = nameByDate();
    //var sheet = ss.getSheetByName(name);
    var range = sheet.getRange(SORT_DATA_RANGE);
    range.sort(SORT_ORDER);



}

function sortCurrentTable() {
    sortTable(ss.getActiveSheet());
    ss.toast('Se ordenaron los datos.');
}

function openActions() {
    var acciones = ss.getSheetByName("acciones")
    if (!acciones) {
        ss.toast("No se encontró la pestaña 'acciones'");
        return false;
    }
    acciones.activate().getRange("b7").setValue(new Date());


}