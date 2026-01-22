// Google Sheets Integration - using Replit's Google Sheets connector
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

// Get the drive client for creating spreadsheets
async function getUncachableDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// Spreadsheet ID - stored in memory
let spreadsheetId: string | null = null;

async function getOrCreateSpreadsheet(): Promise<string> {
  if (spreadsheetId) {
    return spreadsheetId;
  }

  const drive = await getUncachableDriveClient();
  
  // Search for existing GVIM Quiz Results spreadsheet
  const searchResponse = await drive.files.list({
    q: "name='GVIM Quiz Results' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: 'files(id, name)',
    pageSize: 1
  });

  if (searchResponse.data.files && searchResponse.data.files.length > 0) {
    spreadsheetId = searchResponse.data.files[0].id!;
    return spreadsheetId;
  }

  // Create new spreadsheet
  const sheets = await getUncachableGoogleSheetClient();
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'GVIM Quiz Results'
      },
      sheets: [{
        properties: {
          title: 'Results',
          gridProperties: {
            rowCount: 1000,
            columnCount: 15
          }
        }
      }]
    }
  });

  spreadsheetId = createResponse.data.spreadsheetId!;

  // Add header row
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Results!A1:O1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [['Player Name', 'Score', 'Total Questions', 'Completed At', 
                'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10']]
    }
  });

  return spreadsheetId;
}

export async function appendQuizResult(
  playerName: string,
  score: number,
  totalQuestions: number,
  completedAt: string,
  answers: string[]
): Promise<void> {
  try {
    const sheetId = await getOrCreateSpreadsheet();
    const sheets = await getUncachableGoogleSheetClient();

    const row = [
      playerName,
      score,
      totalQuestions,
      completedAt,
      ...answers.slice(0, 10)
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Results!A:O',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row]
      }
    });

    console.log(`Quiz result saved to Google Sheets for ${playerName}`);
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    // Don't throw - we still want to save locally even if Sheets fails
  }
}
