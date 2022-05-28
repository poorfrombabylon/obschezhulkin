//uses("sysutils_drive.js");

const MaxInt = Math.pow(2, 32);
const PathDelim  = '\\';
const PathDelim2  = '/';
const DriveDelim = ':';

function Copy(S, Index, Count) {
  return(S.slice(Index, Index+Count));
}

function LastDelimiter(Delimiters, S) {
  var i, j;
  for (i=S.length-1; i>=0; i--) {
    for (j=0; j<Delimiters.length; j++) if (S[i]==Delimiters[j]) return(i);
  }
  return(i);
}

function ExtractFileDrive(FileName) {
  if ((FileName.length >= 2) && (FileName[1] = DriveDelim)) return(Copy(FileName, 0, 1).toUpperCase());
}

function ExtractFilePath(FileName) {
  var Result, I;
  I = LastDelimiter(PathDelim + PathDelim2 + DriveDelim, FileName);
  Result = Copy(FileName, 0, I);
  return(Result);
}

function ExtractFileName(FileName) {
  var Result, I;
  I = LastDelimiter(PathDelim + PathDelim2  + DriveDelim, FileName);
  Result = Copy(FileName, I + 1, MaxInt);
  return(Result);
}

function ExtractFileExt(FileName) {
  var Result, I;
  I = LastDelimiter('.' + PathDelim + PathDelim2  + DriveDelim, FileName);
  if ((I > 0) && (FileName[I]=='.'))
    Result = Copy(FileName, I, MaxInt);
    else Result = '';
  return(Result);
}

///////////////////////////////////////////////////////////////////////////////////////

function LoadFile(FileName) {return(OS.LoadFile(FileName));}
function SaveFile(FileName, Data, Append = false) {return(OS.SaveFile(FileName, Data, Append));}
function Execute(FileName) {return(OS.Execute(FileName));}
/*
function LoadURL(FileName, ResponseType = 'arraybuffer', OpenType = 'GET', POSTData) {
  return (new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(OpenType, FileName, true);
    xhr.responseType = ResponseType;
    xhr.onload = function() {resolve(xhr.response);}
    xhr.onerror = function() {reject(xhr.statusText);}
    xhr.send(POSTData);
  }));
}
*/
// FileSizeToDisplay(65535, 4, true, ['', ' K', ' M', ' G']);
function FileSizeToDisplay(size, maxlen=3, digitgroup=true, add=[]) {
  var s = '', ss = '';
  size = parseInt(size);
  for (var i=0; ; i++) { 
    s = Math.round(size).toString();
    if (digitgroup) for (var j=s.length-3; j>0; j--) if ((s.length-3-j)%4==0) s = s.substr(0, j) + ' ' + s.substr(j);
    if (s.length<=maxlen) break;
    size = size/1024;
  }
  if (i<add.length) s+=add[i];
  return(s);
}

//////////////////// arraybuffer->string->base64 /////////////////////////////////
function arrayToBase64String(a) {
  var b = '';
  var bytes = new Uint8Array(a);
  var len = bytes.byteLength;
  for(var i=0; i<len; i++) b+=String.fromCharCode(bytes[i]);
  return window.btoa(b);
}
function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
  return bytes.buffer;
}
function arrayToString(a) {
  var b = '';
  var bytes = new Uint8Array(a);
  var len = bytes.byteLength;
  for(var i=0; i<len; i++) b+=String.fromCharCode(bytes[i]);
  return b;
}
function stringToArray(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
function concatArrayBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}
///////////////////////////////////////////////////////////////////////////////////////

class TFileSystem {
  constructor() {
    this.Caption = '';
    this.CurDir = '';
  }
  Dir() {}
  DirUp() {
    this.CurDir = this.CurDir.split(PathDelim).slice(0, -1).join(PathDelim);
/*    var path = '';
    for (var i=0; i<this.CurDir.length; i++) if ((this.CurDir[i]=='\\')||(this.CurDir[i]=='/')) path+=PathDelim; else path+=this.CurDir[i];
    if (path.length>0) {
      if (path[path.length-1]==PathDelim) path=path.slice(0, -1);
      for (var i=path.length-1; i>=0; i--) if (path[i]==PathDelim) {path=path.slice(0, i); break;}
      if (i==-1) path='';
      this.CurDir = path;
    }*/
  }
  DirDown(file) {
    if (this.CurDir.length>0) this.CurDir+=PathDelim;
    this.CurDir+=file.name;
/*    var s = file.name;
    var path = '';
    for (var i=0; i<this.CurDir.length; i++) if ((this.CurDir[i]=='\\')||(this.CurDir[i]=='/')) path+=PathDelim; else path+=this.CurDir[i];
    if ((s.indexOf('/')>=0)||(s.indexOf('\\')>=0)||(s=='..')||(s=='.')) return(path);
    if (path.length>0) if (path.slice(-1)!=PathDelim) path+=PathDelim;
    this.CurDir = path+s;*/
  }
  LoadFile(file, Control, ControlFunc) {}
  SortByName(Files) {
    Files.sort(function(a, b) {
      if (a['folder']>b['folder']) return(-1);
      if (a['folder']<b['folder']) return(1);
      if (a['name'].toLowerCase()>b['name'].toLowerCase()) return(1);
      if (a['name'].toLowerCase()<b['name'].toLowerCase()) return(-1);
    });
  }
}

class TMemoryFileSystem extends TFileSystem {
  constructor() {
    super();
    this.Caption = 'Memory';
    this.FS = {name: 'root', size: 0, folder: true, mtime: '13.11.2009 13:49:00', data: [
      {name: 'folder', size: 0, folder: true, mtime: '13.11.2009 13:49:00', data: [
        {name: 'file1.txt', get size() {return(this.data.byteLength)}, folder: false, mtime: '13.11.2009 13:49:00', data: new ArrayBuffer()},
        {name: 'file2.txt', get size() {return(this.data.byteLength)}, folder: false, mtime: '13.11.2009 13:49:00', data: new ArrayBuffer()}
      ]},
      {name: 'file.txt', get size() {return(this.data.byteLength)}, folder: false, mtime: '13.11.2009 13:49:00', data: stringToArray('Hi guy!')}
    ]};
  }
  GetDataByPath(FileName) {
    var a = FileName.split(PathDelim);
    var Obj = this.FS.data;
    for (var i=1; i<a.length; i++)
      for (var j=0; j<Obj.length; j++) if (Obj[j].name==a[i]) {Obj=Obj[j].data; break;}
    return(Obj);
  }
  Dir2(s) {
    return(new Promise(function(resolve, reject) {resolve({files:this.GetDataByPath(s), path:s});}.bind(this)));
  }
  LoadFile2(FileName) {
    return(new Promise(function(resolve, reject) {resolve(this.GetDataByPath(FileName));}.bind(this)));
  }
  SaveFile2(FileName, Data, Append = false) {
    return(new Promise(function(resolve, reject) {
      var Folder = this.GetDataByPath(ExtractFilePath(FileName));
      var File = {name: ExtractFileName(FileName), get size() {return(this.data.byteLength)}, folder: false, mtime: '13.11.2009 13:49:00', data: Data};
      for (var i=0; i<Folder.length; i++) if (File.name==Folder[i].name) break;
      if (i==Folder.length) Folder.push(File); 
        else if (Append) Folder[i].data = concatArrayBuffer(Folder[i].data, Data); else Folder[i].data = Data;
      resolve();
    }.bind(this)));
  }
}

class TPHPFileSystem extends TFileSystem {
  constructor(AURL) {
    super();
    this.Caption = 'PHP';
    this.URL = AURL;
  }

  SendJSON(AJSON, Control, ControlFunc, ResponseType='json') {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = this.ReceiveJSON(this, xhr, Control, ControlFunc);
    xhr.open('POST', this.URL, true);
    xhr.responseType = ResponseType;
    xhr.send(JSON.stringify(AJSON));
  }
  ReceiveJSON(Sender, xhr, Control, ControlFunc) {
    var this_ = this;
    return function() {
      if (xhr.readyState == xhr.DONE) {
        if (xhr.status == 200 && xhr.response) {
          var res = xhr.response;
          if (xhr.response.command=='dir') this_.SortByName(res.files);
          Control[ControlFunc](res);
        }
        else alert("Failed to download:" + xhr.status + " " + xhr.statusText);
      }
    }
  }
  Dir(s, Control, ControlFunc) {
    this.SendJSON({command:'dir', path:s}, Control, ControlFunc);
  }
  Dir2(s) {
    return(this.SendJSON2({command:'dir', path:s}));
  }
  LoadFile(file, Control, ControlFunc) {
    this.SendJSON({command:'loadfile', path: this.CurDir, filename: file.name}, Control, ControlFunc, 'arraybuffer');
  }
///////////////////////////////
  SendJSON2(AJSON, ResponseType='json') {
    return (new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = this.ReceiveJSON2.bind(this, xhr, resolve, reject);
      xhr.open('POST', this.URL, true);
      xhr.responseType = ResponseType;
      xhr.send(JSON.stringify(AJSON));
    }.bind(this)));
  }
  ReceiveJSON2(xhr, resolve, reject) {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200 && xhr.response) {
        var res = xhr.response;
        if (res instanceof Array) if (arrayToString(res.slice(0, 10))=='{"error":"') reject(JSON.parse(arrayToString(res)));
        if (xhr.response.command=='dir') this.SortByName(res.files);
        resolve(res);
      } else reject(JSON.parse('{"error":"Loadfile: error"}'));
    }
  }
///////////////////////////////
  LoadFile2(FileName) {
    return(this.SendJSON2({command:'loadfile', path: ExtractFilePath(FileName), filename: ExtractFileName(FileName)}, 'arraybuffer'));
  }
  SaveFile(file, Data, Control, ControlFunc) {
    var AJSON = {command:'savefile', path: this.CurDir, filename: file.name};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.URL+'?JSON='+encodeURI(JSON.stringify(AJSON)), true);
    xhr.responseType = 'json';
    xhr.onload = function() {Control[ControlFunc](xhr.response);}
    xhr.send(Data);
  }
  SaveFile2(FileName, Data, Append = false) {
    return(new Promise(function(resolve, reject) {
      var AJSON = {command:'savefile', path: ExtractFilePath(FileName), filename: ExtractFileName(FileName), append: Append};
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.URL+'&JSON='+encodeURI(JSON.stringify(AJSON)), true);
      xhr.responseType = 'json';
      xhr.onload = function() {resolve(xhr.response);}
      xhr.onerror = function() {reject(xhr.statusText);}
      xhr.send(Data);
    }.bind(this)));
  }
}

class TDropBoxFileSystem extends TFileSystem {
  constructor(AACCESS_TOKEN) {
    super();
    this.Caption = 'Dropbox';
    this.ACCESS_TOKEN = AACCESS_TOKEN;
    this.dbx = new Dropbox.Dropbox({ accessToken: this.ACCESS_TOKEN });
  }
  Dir(s, Control, ControlFunc) {
    var this_ = this;
    var s2 = '';
    for (var i=0; i<s.length; i++) if (s[i]=='\\') s2+='/'; else s2+=s[i];
    if (s2.length>0) s2 = '/'+s2;
    this.dbx.filesListFolder({path: s2})
      .then(function(response) {
        var t;
        for (var i=0; i<response.entries.length; i++) {
          if ('size' in response.entries[i]); else response.entries[i].size = '';
          if ('server_modified' in response.entries[i]) {
            t = response.entries[i]['server_modified'];
            t = t.substr(8, 2)+'.'+t.substr(5, 2)+'.'+t.substr(0, 4)+' '+t.substr(11,2)+':'+t.substr(14,2)+':'+t.substr(17,2);
            response.entries[i].mtime = t;
          } else response.entries[i].mtime = '';
          response.entries[i].folder = response.entries[i]['.tag']=="folder";
        }
        if (s.length>0) response.entries.splice(0, 0, {name:'..', size:0, folder:true, mtime:''});
        this_.SortByName(response.entries);
        Control[ControlFunc]({command:'dir', files:response.entries, path:s});
      });
      /*
      .catch(function(error) {
        console.error(error);
      });*/
  }
  LoadFile(file, Control, ControlFunc) {
    var s2 = this.CurDir+'/'+file.name;
    if (s2.length>0) s2 = '/'+s2;
    this.dbx.filesDownload({path: s2})
      .then(function(response) {
        var fileReader = new FileReader();
        fileReader.onload = function(event) {Control[ControlFunc](event.target.result);};
        fileReader.readAsArrayBuffer(response.fileBlob);
      });
  }
}

class TGoogleDriveFileSystem extends TFileSystem {
  constructor(ACLIENT_ID, AAPI_KEY) {
    super();
    this.Caption = 'Google Drive';
    this.CurDir = '';
    this.CurIdDir = 'root';//'1mf_VK7CIa5YQ5LuirICsdgUWFGx6lVX0';
    this.CLIENT_ID = ACLIENT_ID;
    this.API_KEY = AAPI_KEY;
    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    this.SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
    this.Connected = false;
  }
  Connect() {
    var this_ = this;
    return(new Promise(
      function (resolve, reject) {
        if (this_.Connected) resolve(); else {
          gapi.load('client:auth2', function() {
            gapi.client.init({
              apiKey: this_.API_KEY,
              clientId: this_.CLIENT_ID,
              discoveryDocs: this_.DISCOVERY_DOCS,
              scope: this_.SCOPES
            }).then(function () {
              this_.Connected = true;
              resolve();
            }, function(error) {
              reject(error);
            });  
          });
        }
      }
    ));
  }
  Dir(s, Control, ControlFunc) {
    var this_ = this;
    this.Connect().then(function() {
      var CurIdDir = this_.CurIdDir.split(PathDelim).slice(-1)[0];
      gapi.client.drive.files.list({
        'pageSize': 100,
        'q': "parents = '"+CurIdDir+"' and trashed = false",
        'fields': "files(id, name, size, mimeType, modifiedTime, webContentLink)"
      }).then(function(response) {
        var t;
        for (var i=0; i<response.result.files.length; i++) {
          if ('size' in response.result.files[i]); else response.result.files[i].size = '-';
          response.result.files[i].folder = (response.result.files[i].mimeType=='application/vnd.google-apps.folder');
          t = response.result.files[i]['modifiedTime'];
          t = t.substr(8, 2)+'.'+t.substr(5, 2)+'.'+t.substr(0, 4)+' '+t.substr(11,2)+':'+t.substr(14,2)+':'+t.substr(17,2);
          response.result.files[i].mtime = t;
        }
        if (s.length>0) response.result.files.splice(0, 0, {name:'..', size:0, folder:true, mtime:''});
        this_.SortByName(response.result.files);
        Control[ControlFunc]({command:'dir', files:response.result.files, path:s});
      });
    });
  }
  DirDown(file) {
    if (this.CurDir.length>0) this.CurDir+=PathDelim;
    this.CurDir+=file.name;
    if (this.CurIdDir=='root') this.CurIdDir='';
    if (this.CurIdDir.length>0) this.CurIdDir+=PathDelim;
    this.CurIdDir+=file.id;
  }
  DirUp() {
    this.CurDir = this.CurDir.split(PathDelim).slice(0, -1).join(PathDelim);
    this.CurIdDir = this.CurIdDir.split(PathDelim).slice(0, -1).join(PathDelim);
    if (this.CurIdDir=='') this.CurIdDir = 'root'; else this.CurIdDir = this.CurIdDir;
  }
  LoadFile(file, Control, ControlFunc) {
// not working!
    if ('webContentLink' in file); else return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.webContentLink, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
//    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      Control[ControlFunc](xhr.responseText);
    }
    xhr.send();
  }
}

class TOS {
  constructor() {
    this.Drives = {};
//    OS_Drives_Init(this);
    this.FCurDriveLetter = 'C';
  }
  Dir(FileName) {
    var Drive = ExtractFileDrive(FileName);
    if (Drive) return(this.Drives[Drive].Dir2(FileName));
      else return(new Promise(function(resolve, reject) {reject()}));
  }
  DirUp(s) {
    return(s.slice(0,3)+s.slice(3).split(PathDelim).slice(0, -1).join(PathDelim));
  }
  DirDown(s, file) {
    if (s.length>3) s+=PathDelim;
    s+=file.name;
    return(s);
  }
  DirRoot(s) {return(s.slice(0,3));}
  LoadFile(FileName) {
    var Drive = ExtractFileDrive(FileName);
    if (Drive) return(this.Drives[Drive].LoadFile2(FileName));
      else return(new Promise(function(resolve, reject) {reject()}));
  }
  SaveFile(FileName, Data, Append = false) {
    var Drive = ExtractFileDrive(FileName);
    if (Drive) return(this.Drives[Drive].SaveFile2(FileName, Data, Append));
      else return(new Promise(function(resolve, reject) {reject()}));
  }
  get CurDrive() {return(this.Drives[this.CurDriveLetter]);}
  get CurDriveLetter() {return(this.FCurDriveLetter);}
  set CurDriveLetter(value) {if (value in this.Drives) this.FCurDriveLetter = value;}
  get CurDir() {return(this.CurDriveLetter+DriveDelim+PathDelim+this.CurDrive.CurDir);}
  set CurDir(value) {
    if (value.length>=3)
      if ((value[0].toUpperCase() in this.Drives) && (value[1]==DriveDelim) && (value[2]==PathDelim)) {
        this.CurDriveLetter = value[0].toUpperCase();
        this.CurDrive.CurDir = value.slice(3);
      }        
  }

  async Execute(FileName) {
    async function Load(App, Title) {
      uses(App[4]);
      await Loader.Load();
      var Form = eval('new '+App[2]+'(Application);');
      if (Form.Caption==Form.Name) {
        Form.Caption = App[0];
        if (Title) Form.Caption+=' - ' + Title;
      }
      if (Form.Icon==null) Form.Icon = Images[App[1]];
      Application.ActiveForm = Form;
      return(Form);
    }
    var r = window.RegistryApplications;
    var ext = ExtractFileExt(FileName).toLowerCase().slice(1);
    if (ext.length==0) for (var a of r) if (a[0]==FileName) {await Load(a); break;} else;
    else
    for (var i=r.length-1; i>=0; i--) {
      for (var key in r[i][3]) {
        if (key.toLowerCase()==ext) {
          var Form = await Load(r[i], FileName)
          Form.Open(FileName);
        }
      }
    }
  }
  GetIconByExt(FileName) {
    var r = window.RegistryApplications;
    var ext = ExtractFileExt(FileName).toLowerCase().slice(1);
    for (var i=r.length-1; i>=0; i--)
      for (var key in r[i][3])
        if (key.toLowerCase()==ext) 
          if (r[i][3][key].length>0) return(Images[r[i][3][key]]); else return(Images[r[i][1]]);
    return(null);
  }
}

window.OS = new TOS();
window.RegistryApplications = [];

RegistryApplication = function(AppData) {
  function sub(n) {return(ExtractFileName(n).slice(0, -(ExtractFileExt(n).length)));}
  var r = {};
  var n = sub(AppData[1]);
  r[n] = AppData[1];
  AppData[1] = n;
  for (var key in AppData[3]) {
    n = sub(AppData[3][key]);
    r[n] = AppData[3][key];
    AppData[3][key] = n;
  }
  res(r);
  RegistryApplications.push(AppData);
}
