const FALLBACK_ID = 'YOUR_SPREADSHEET_ID';

function getSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SPREADSHEET_ID') || FALLBACK_ID;

  if (!id || id === 'YOUR_SPREADSHEET_ID') {
    const ss = SpreadsheetApp.create('Onam Festival Dashboard');
    id = ss.getId();
    props.setProperty('SPREADSHEET_ID', id);
    setupSheets(ss);
  }

  return SpreadsheetApp.openById(id);
}

function getSheet(name, spreadsheet) {
  const ss = spreadsheet || getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function setHeaders(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

function getHeaders(sheet) {
  if (sheet.getLastColumn() < 1) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function rowsToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      const key = headerToKey(h);
      obj[key] = row[i];
    });
    return obj;
  });
}

function headerToKey(header) {
  const map = {
    'ID': 'id',
    'Name': 'name',
    'Category': 'category',
    'Type': 'type',
    'MaxParticipants': 'maxParticipants',
    'Description': 'description',
    'TeamID': 'teamId',
    'Contact': 'contact',
    'Gender': 'gender',
    'Age': 'age',
    'Color': 'color',
    'Captain': 'captain',
    'ProgramID': 'programId',
    'ParticipantID': 'participantId',
    'Judge': 'judge',
    'Score': 'score',
    'Remarks': 'remarks',
    'Timestamp': 'timestamp'
  };
  return map[header] || (header.charAt(0).toLowerCase() + header.slice(1));
}

function getNextId(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().map(Number);
  return Math.max(...ids) + 1;
}

function appendObject(sheet, obj) {
  const headers = getHeaders(sheet);
  const row = headers.map((h) => (obj[h] === undefined ? '' : obj[h]));
  sheet.appendRow(row);
}

function updateObject(sheet, obj) {
  const headers = getHeaders(sheet);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(obj.ID)) {
      const row = headers.map((h) => {
        if (obj[h] === undefined) return values[i][headers.indexOf(h)];
        return obj[h];
      });
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  throw new Error('Record not found');
}

function deleteById(sheetName, id) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: 'ok' };
    }
  }
  throw new Error('Record not found');
}

function setupSheets(ss) {
  const spreadsheet = ss || getSpreadsheet();

  const programSheet = getSheet('Programs', spreadsheet);
  setHeaders(programSheet, ['ID', 'Name', 'Category', 'Type', 'MaxParticipants', 'Description']);

  const participantSheet = getSheet('Participants', spreadsheet);
  setHeaders(participantSheet, ['ID', 'Name', 'TeamID', 'Contact', 'Gender', 'Age']);

  const teamSheet = getSheet('Teams', spreadsheet);
  setHeaders(teamSheet, ['ID', 'Name', 'Color', 'Captain']);

  const scoringSheet = getSheet('Scoring', spreadsheet);
  setHeaders(scoringSheet, ['ID', 'ProgramID', 'ParticipantID', 'TeamID', 'Judge', 'Score', 'Remarks', 'Timestamp']);

  return { status: 'ok', message: 'Sheets initialized', spreadsheetId: spreadsheet.getId() };
}

function doGet(e) {
  const action = e.parameter.action || 'ping';
  try {
    let result;
    if (action === 'setup') result = setupSheets();
    else if (action === 'getAll') result = getAllData();
    else result = { status: 'ok', message: 'Onam Apps Script API is running' };
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData ? e.postData.contents : '{}');
  try {
    const result = handleAction(data);
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function handleAction(data) {
  const action = data.action;
  switch (action) {
    case 'getAll': return getAllData();
    case 'getPrograms': return getPrograms();
    case 'getParticipants': return getParticipants();
    case 'getTeams': return getTeams();
    case 'getScores': return getScores();
    case 'addProgram': return addProgram(data);
    case 'updateProgram': return updateProgram(data);
    case 'deleteProgram': return deleteById('Programs', data.id);
    case 'addParticipant': return addParticipant(data);
    case 'updateParticipant': return updateParticipant(data);
    case 'deleteParticipant': return deleteById('Participants', data.id);
    case 'addTeam': return addTeam(data);
    case 'updateTeam': return updateTeam(data);
    case 'deleteTeam': return deleteById('Teams', data.id);
    case 'addScore': return addScore(data);
    case 'updateScore': return updateScore(data);
    case 'deleteScore': return deleteById('Scoring', data.id);
    case 'getLeaderboard': return getAllData();
    default: throw new Error('Unknown action: ' + action);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllData() {
  return {
    status: 'ok',
    programs: getPrograms(),
    participants: getParticipants(),
    teams: getTeams(),
    scores: getScores()
  };
}

function getPrograms() { return rowsToObjects(getSheet('Programs')); }
function getParticipants() { return rowsToObjects(getSheet('Participants')); }
function getTeams() { return rowsToObjects(getSheet('Teams')); }
function getScores() { return rowsToObjects(getSheet('Scoring')); }

function addProgram(data) {
  const sheet = getSheet('Programs');
  const obj = {
    ID: getNextId(sheet),
    Name: data.name || '',
    Category: data.category || '',
    Type: data.type || 'Individual',
    MaxParticipants: data.maxParticipants || '',
    Description: data.description || ''
  };
  appendObject(sheet, obj);
  return { status: 'ok', id: obj.ID };
}

function updateProgram(data) {
  const sheet = getSheet('Programs');
  const obj = {
    ID: data.id,
    Name: data.name,
    Category: data.category,
    Type: data.type,
    MaxParticipants: data.maxParticipants,
    Description: data.description
  };
  updateObject(sheet, obj);
  return { status: 'ok' };
}

function addParticipant(data) {
  const sheet = getSheet('Participants');
  const obj = {
    ID: getNextId(sheet),
    Name: data.name || '',
    TeamID: data.teamId || '',
    Contact: data.contact || '',
    Gender: data.gender || '',
    Age: data.age || ''
  };
  appendObject(sheet, obj);
  return { status: 'ok', id: obj.ID };
}

function updateParticipant(data) {
  const sheet = getSheet('Participants');
  const obj = {
    ID: data.id,
    Name: data.name,
    TeamID: data.teamId,
    Contact: data.contact,
    Gender: data.gender,
    Age: data.age
  };
  updateObject(sheet, obj);
  return { status: 'ok' };
}

function addTeam(data) {
  const sheet = getSheet('Teams');
  const obj = {
    ID: getNextId(sheet),
    Name: data.name || '',
    Color: data.color || '',
    Captain: data.captain || ''
  };
  appendObject(sheet, obj);
  return { status: 'ok', id: obj.ID };
}

function updateTeam(data) {
  const sheet = getSheet('Teams');
  const obj = {
    ID: data.id,
    Name: data.name,
    Color: data.color,
    Captain: data.captain
  };
  updateObject(sheet, obj);
  return { status: 'ok' };
}

function addScore(data) {
  const sheet = getSheet('Scoring');
  const obj = {
    ID: getNextId(sheet),
    ProgramID: data.programId || '',
    ParticipantID: data.participantId || '',
    TeamID: data.teamId || '',
    Judge: data.judge || '',
    Score: data.score === undefined ? '' : data.score,
    Remarks: data.remarks || '',
    Timestamp: new Date().toISOString()
  };
  appendObject(sheet, obj);
  return { status: 'ok', id: obj.ID };
}

function updateScore(data) {
  const sheet = getSheet('Scoring');
  const obj = {
    ID: data.id,
    ProgramID: data.programId,
    ParticipantID: data.participantId || '',
    TeamID: data.teamId || '',
    Judge: data.judge,
    Score: data.score,
    Remarks: data.remarks
  };
  updateObject(sheet, obj);
  return { status: 'ok' };
}
