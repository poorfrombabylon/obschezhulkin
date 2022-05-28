var DXFFile = 'http://localhost:8080/app/object.dxf';
var TXTFile = 'http://localhost:8080/app/object.txt';

//uses("app/rplan/rpitems.js", "app/rplan/rpmain.js");
//uses("app/pdfviewer/pdfviewer.js");
//uses("app/map/map.js");
//res({rent_icon: 'app/rent/rent_icon.png'});

function dateToDDMMYYYY(d) {return(('0'+d.getDate()).slice(-2)+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+d.getFullYear());}
function checkINN(INN) {
  INN = "" + INN;
  INN = INN.split('');
  if ((INN.length==10)&&(INN[9]==((2*INN[0]+4*INN[1]+10*INN[2]+3*INN[3]+5*INN[4]+9*INN[5]+4*INN[6]+6*INN[7]+8*INN[8])%11)%10)) return true;
  else if ((INN.length==12)&&((INN[10]==((7*INN[0]+2*INN[1]+4*INN[2]+10*INN[3]+3*INN[4]+5*INN[5]+9*INN[6]+4*INN[7]+6*INN[8]+8*INN[9])%11)%10)&&(INN[11]==((3*INN[0]+7*INN[1]+2*INN[2]+4*INN[3]+10*INN[4]+3*INN[5]+5*INN[6]+9*INN[7]+4*INN[8]+6*INN[9]+8*INN[10])%11)%10))) return true;
  else return false;
}

function LoadURL(FileName, ResponseType = 'arraybuffer', OpenType = 'GET', PostData) {
  return (new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(OpenType, FileName, true);
    xhr.responseType = ResponseType;
    xhr.onload = function() {resolve(xhr.response);}
    xhr.onerror = function() {reject(xhr.statusText);}
    xhr.send(PostData);
  }));
}

/*
class TEdit2 extends TEdit {
  Suggest(s) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://dadata.ru/api/v2/suggest/party', true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Authorization', 'Token b6c34f9e7a02626783ffde78117336ae411a33ce');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function() {console.log(xhr.response);}
    xhr.onerror = function() {console.log(xhr.statusText);}
    xhr.send(JSON.stringify({"query": s}));
  }
}
*/

class TRPlanRent extends TRPlan {
  constructor(AOwner) {
    super(AOwner);
    this.Layers = [];
    this.CurLayer = '';
    this.Floors = [];
  }
  Paint(Sender, Canvas) {
    Canvas.fillStyle = '#FFFFFF';
    Canvas.fillRect(0, 0, this.MainBlock.FRect.Right, this.MainBlock.FRect.Bottom);
    this.MainBlock.Show(Canvas, [this.CurLayer]);

    if ((this.LINK)&&(this.LINKPoint[2])) {
      var APoint = this.MainBlock.RealToScreenConvert(this.LINKPoint);
      Canvas.strokeStyle = '#ff0000';
      Canvas.lineWidth = 2;
      Canvas.strokeRect(APoint[0]-LinkSensetive, APoint[1]-LinkSensetive, LinkSensetive*2, LinkSensetive*2);
    }

    if (this.MainBlock.FileName) {
      Canvas.globalAlpha = 0.1;
      Canvas.fillStyle = '#000000';
      Canvas.font = (this.FontSize*3).toString(10)+'px '+this.Font;
      var s = this.MainBlock.FileName;
      Canvas.fillText(s, (this.Width-Canvas.measureText(s).width)/2, this.FontSize*3);
      Canvas.globalAlpha = 1;
    }
  }
  LoadFromDXF(str) {
    this.MainBlock.Clear();
    this.MainBlock.LoadFromDXF(str);
    this.MainBlock.AutoSize(0.9);
    this.Layers = [];
    var Last = '';
    for (var I of this.MainBlock.Items) {
      if (I.LayerName!=Last) if (this.Layers.indexOf(I.LayerName)<0) this.Layers.push(I.LayerName);
      Last = I.LayerName;
    }
    if (this.Layers.length>0) this.CurLayer = this.Layers[0]; else this.CurLayer = '';
    for (var i=0; i<this.Floors.length; i++) this.RemoveComponent(this.Floors[i]);
    this.Floors = [];
    if (this.Layers.length>1) {
      for (var i=0; i<this.Layers.length; i++) {
        var Button = new TButton(this);
        Button.Properties = {Parent: this, Caption: this.Layers[i], Left:10, Top:i*(this.FontSize*2)+10, Width:100, Height:this.FontSize*2, Flat: true, GroupIndex: 1, OnDown: this.FloorDown};
        if (i==0) Button.Down = true;
        this.Floors.push(Button);
      }
      this.FloorDown(this.Floors[0]);
    }
    this.ShowRequire = true;
  }
  FloorDown(Sender) {
    this.CurLayer = Sender.Caption;
    for (var I of this.Floors) {
      if (I.Caption==this.CurLayer) {
        I.FontColor = '#000000';
        I.FontSize = I.Parent.FontSize*1.4;
      } else {
        I.FontColor = '#888888';
        I.FontSize = I.Parent.FontSize;
      }
    }
    this.ShowRequire = true;
  }
}

class TRPCommandRent extends TRPCommand {
  MouseDown(Sender, e, X, Y) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
//    console.log(APoint);
    this.MouseMove(Sender, e, X, Y);
  }
  MouseMove(Sender, e, X, Y) {
    var Item = this.RPlan.MainBlock.ScreenPointIn([X, Y]);
    var Items = this.RPlan.MainBlock.Items;
    for (var i=Items.length-1; i>=0; i--)
      if (Items[i].ClassName=='TRPPolyLineRent') 
        if ((Items[i].Selected)&&(Items[i]!=Item)) {Items[i].Selected = false; this.RPlan.ShowRequire = true;} else; else break;
    if (Item.ClassName=='TRPPolyLineRent') if (!Item.Selected) {Item.Selected = true; this.RPlan.ShowRequire = true;}
  }
}

class TRPCommandArea extends TRPCommandLine {
  constructor(ARPlan) {
    super(ARPlan);
    this.RPPolyLine = null;
    this.FText = '';
    this.e_pageX = 0;
    this.e_pageY = 0;
  }
  MouseDown(Sender, e, X, Y) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
    this.RPlan.LINKPrepare(Sender, e, X, Y);
    if ((this.RPlan.LINK)&&(this.RPlan.LINKPoint[2])) APoint=[this.RPlan.LINKPoint[0], this.RPlan.LINKPoint[1]];
    if (this.RPPolyLine==null) {
      this.RPPolyLine = new TRPPolyLineRent(this.RPlan.MainBlock);
      this.RPPolyLine.Filled = true;
      this.RPPolyLine.PenWidth = 2;
      this.RPPolyLine.PenColor = '#004444';
      this.RPPolyLine.BrushColor = '#00ffff';
//      this.RPPolyLine.BrushColor = '#'+(Math.random()*127).toString(16)+(102).toString(16)+(102).toString(16);
      this.RPlan.MainBlock.AddItem(this.RPPolyLine);
      this.RPPolyLine.AddPoint(APoint[0], APoint[1]);
    }
    if ((this.RPPolyLine.Points.length>1) && (APoint[0]==this.RPPolyLine.Points[0][0]) && ((APoint[1]==this.RPPolyLine.Points[0][1]))) this.Key27(Sender, e);
      else this.RPPolyLine.AddPoint(APoint[0], APoint[1]);
    Sender.ShowRequire = true;
  }
  MouseUp(Sender, e) {
  }
  MouseMove(Sender, e, X, Y) {
    if (this.RPPolyLine!=null) {
      var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
      var APointP = this.RPPolyLine.Points[this.RPPolyLine.PointCount-2];
      this.RPlan.LINKPrepare(Sender, e, X, Y, this.RPPolyLine.Points[this.RPPolyLine.PointCount-1]);
      if ((this.RPlan.LINK)&&(this.RPlan.LINKPoint[2])) APoint=[this.RPlan.LINKPoint[0], this.RPlan.LINKPoint[1]];
      if (this.RPlan.ORTHO) if (Math.abs(APoint[0]-APointP[0])<Math.abs(APoint[1]-APointP[1])) APoint[0] = APointP[0]; else APoint[1] = APointP[1];
      this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = APoint;
      this.RPPolyLine.CalcCorner();
      this.RPlan.ShowRequire = true;
    } else this.RPlan.LINKPrepare(Sender, e, X, Y);
    this.e_pageX = X;
    this.e_pageY = Y;
  }
  KeyDown(Sender, e) {
    if (e.key.length==1) this.Text+=e.key;
    if (e.keyCode==8) if (this.Text.length>0) this.Text = this.Text.slice(0, -1);
    if (e.keyCode==13) {
      for (var i=0; i<this.Text.length;) if (this.Text[i]==' ') this.Text = this.Text.slice(0, i)+this.Text.slice(i+1); else i++;
      if (this.Text.length==0) {
      } else
      if ((this.Text.toUpperCase()=='C')||(this.Text.toUpperCase()=='З')) {
        this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = [this.RPPolyLine.Points[0][0], this.RPPolyLine.Points[0][1]];
        this.RPlan.Command='';
      } else 
      if ((this.Text.toUpperCase()=='U')||(this.Text.toUpperCase()=='О')) {
        if (this.RPPolyLine.PointCount>2) this.RPPolyLine.DeletePoint(this.RPPolyLine.PointCount-2);
      } else 
      if (this.Text.indexOf('>')>=0) {
        var arr = this.Text.split('>');
        var D1 = parseFloat(arr[0]);
        var D2 = parseFloat(arr[1]);
        var P1 = this.RPPolyLine.Points[this.RPPolyLine.PointCount-2];
        var P2 = [P1[0]+D1*Math.cos(D2*Math.PI/180), P1[1]+D1*Math.sin(D2*Math.PI/180)];
        this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = P2;
        this.RPPolyLine.AddPoint(P2[0], P2[1]);
      } else
      if (this.Text.indexOf(',')>=0) {
        var arr = this.Text.split(',');
        if (arr.length==2) {
          var P2 = [this.RPPolyLine.Points[this.RPPolyLine.PointCount-1][0], this.RPPolyLine.Points[this.RPPolyLine.PointCount-1][1]];
          var PD = [0, 0];
          if (arr[0].length>0) if (arr[0][0]=='@') {
            arr[0] = arr[0].slice(1);
            PD = [this.RPPolyLine.Points[this.RPPolyLine.PointCount-2][0], this.RPPolyLine.Points[this.RPPolyLine.PointCount-2][1]];
          }
          this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = [PD[0]+parseFloat(arr[0]), PD[1]+parseFloat(arr[1])];
          this.RPPolyLine.AddPoint(P2[0], P2[1]);
        }
      } else {
        var P2 = this.RPlan.MainBlock.ScreenToRealConvert([this.e_pageX-Sender.ClientOriginLeft, this.e_pageY-Sender.ClientOriginTop]);
        var S2 = parseFloat(this.Text);
        var P1 = this.RPPolyLine.Points[this.RPPolyLine.PointCount-2];
        if (this.RPlan.ORTHO) if (Math.abs(P2[0]-P1[0])<Math.abs(P2[1]-P1[1])) P2[0] = P1[0]; else P2[1] = P1[1];
        var S1 = Math.sqrt((P2[0]-P1[0])*(P2[0]-P1[0]) + (P2[1]-P1[1])*(P2[1]-P1[1]))
        var P3 = [(P2[0]-P1[0])*S2/S1+P1[0], (P2[1]-P1[1])*S2/S1+P1[1]];
        this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = P3;
        this.RPPolyLine.AddPoint(P2[0], P2[1]);
      }
      this.Text = '';
      Sender.ShowRequire = true;
    }
    if (e.keyCode==119) {
      this.MouseMove(this.RPlan, {'pageX': this.e_pageX, 'pageY': this.e_pageY});
    }
    if (e.keyCode==27) this.Key27(Sender, e);
  }
  Key27(Sender, e) {
    if (this.RPPolyLine!=null) {
      if (this.RPPolyLine.PointCount>3) {
        this.RPPolyLine.Points[this.RPPolyLine.PointCount-1] = [this.RPPolyLine.Points[0][0], this.RPPolyLine.Points[0][1]];
      } else this.RPlan.MainBlock.DeleteItem(this.RPlan.MainBlock.ItemsCount-1);
    }
    this.RPlan.Command='Rent';

    var Form = new TFormRent_Card(Application);
    Form.Item = this.RPPolyLine;
    Application.ActiveForm = Form;

//    Sender.ShowRequire = true
  }
}

class TRPPolyLineRent extends TRPPolyLine {
  get_angle(center, point){
    var x = point[0] - center[0];
    var y = point[1] - center[1];
    if(x==0) return (y>0) ? 180 : 0;
    var a = Math.atan(y/x)*180/Math.PI;
    a = (x > 0) ? a+90 : a+270;
    return a;
  }
  DateActual() {
    if (this.data) if (this.data.Date) {
      var t1 = new Date(this.FOwner.FOwner.FParent.TrackBar1.Position*(1000*60*60*24));
      var t2 = new Date(this.data.Date);
      return(t2<=t1);
    } else return(true);
    return(true);
  }
  CalcColor() {
    var s = Math.round(Math.sqrt(this.Square())).toString();
    var r=0;
    for (var i=0; i<s.length; i++) r+=s.charCodeAt(i);
    return(Color8BitTo24Bit(r));
  }
  ShowTable(Canvas, x, y, w, h, data, colWidth, rowHeight, space, color) {
    var i, j, cw, rh=rowHeight;
    Canvas.save();
    Canvas.font = (rowHeight/4*3).toString(10)+'px '+this.Font;
    Canvas.textBaseline = 'middle';
    Canvas.fillStyle = '#ffffff';
    Canvas.fillRect(x, y, w, data.length*rh+rh*space/100);
    Canvas.fillStyle = color[0];
    w = w-rh*space/100;
    for (var j=0; j<data.length; j++) {
      cw=0;
      for (var i=0; i<data[j].length; i++) {
        Canvas.fillStyle = color[((j%2)+1)*(j>0)];
        Canvas.fillRect(x+w*cw/100+rh*space/100, y+j*rh+rh*space/100, w*colWidth[i]/100-rh*space/100, rh-rh*space/100);
        Canvas.fillStyle = '#000000';
        Canvas.fillText(data[j][i], x+w*cw/100+rh*2*space/100, y+j*rh+rh/2+rh*space/100);
        cw+=colWidth[i];
      }
    }
    Canvas.restore();
  }
  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    if (this.Points.length==0) return;
//    if (!this.DateActual()) return;
    Canvas.fillStyle = this.CalcColor();
    var APoints = [];
    for (var i=0; i<this.Points.length; i++)
      APoints.push([Math.round((this.Points[i][0]-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Points[i][1]-ShiftY)*ScaleY)]);
    Canvas.beginPath();
    Canvas.moveTo(APoints[0][0], APoints[0][1]);
    for(var i=1; i<APoints.length; i++) Canvas.lineTo(APoints[i][0], APoints[i][1]);
    Canvas.save();
    Canvas.globalAlpha = 0.5;
    Canvas.fill();
    Canvas.restore();
    Canvas.stroke();

    if (this.data) if (this.data.Label) {
      Canvas.save();
      Canvas.fillStyle = '#000000';
      Canvas.beginPath();
      var l = this.data.Label;
      var w2 = (l[2]-ShiftX)*ScaleX - (l[0]-ShiftX)*ScaleX;
      var P1 = [(l[0]-ShiftX)*ScaleX, Rect.Bottom-(l[1]-ShiftY)*ScaleY];
      var P2 = [(l[2]-ShiftX)*ScaleX, Rect.Bottom-(l[3]-ShiftY)*ScaleY];
//      Canvas.rect(P1[0], P1[1], P2[0]-P1[0], P2[1]-P1[1]);
//      Canvas.stroke();
      Canvas.translate(P1[0]+(P2[0]-P1[0])/2, P1[1]+(P2[1]-P1[1])/2);
      Canvas.textBaseline = 'bottom';
      Canvas.textAlign = 'center';

      var I = this.FOwner.FOwner.FOwner.Images;
      if (l[4] in I) {
        var img = I[l[4]];
        var h2 = w2*img.naturalHeight/img.naturalWidth;
        Canvas.drawImage(img, -w2/2, -h2, w2, h2);
      } else {
        var s = this.data.Name2;
        var w = Canvas.measureText(s).width;
        var h2 = w2/w*this.FontSize;
        if (h2>(P2[1]-P1[1])/2) h2 = (P2[1]-P1[1])/2;
        Canvas.fillStyle = '#ffffff';
        Canvas.beginPath();
        Canvas.rect(-(P2[0]-P1[0])/2, -h2, P2[0]-P1[0], h2);
        Canvas.fill();
        Canvas.font = h2.toString(10)+'px '+this.Font;
        Canvas.fillStyle = '#000000';
        Canvas.fillText(s, 0, 0);
      }
      Canvas.textAlign = 'left';
      if (w2<250) {
/*        Canvas.font = this.FontSize.toString(10)+'px '+this.Font;
        var s = (this.Square()/1000000).toFixed(0)+'кв.м, 980р.';
        var w = Canvas.measureText(s).width;
        var h2 = w2/w*this.FontSize;
        Canvas.font = h2.toString(10)+'px '+this.Font;
        Canvas.fillText(s, 0, h2);*/
        this.ShowTable(Canvas, -(P2[0]-P1[0])/2, 0, P2[0]-P1[0], P2[1]-P1[1], [
          [(this.Square()/1000000).toFixed(0)+'кв.м, 980р.']
        ], [100], (P2[0]-P1[0])/6, 5, ['#ffffff']);

      } else {
        this.ShowTable(Canvas, -(P2[0]-P1[0])/2, 0, P2[0]-P1[0], P2[1]-P1[1], [
          ['ИП Сулеева Л.Т.->', 'ООО "Зоосад"'],
          ['Договор', '132 от 12.12.2019'],
          ['Дата начала аренды', '10.10.2019'],
          ['Дата окончания аренды', '10.10.2020'],
          ['Площадь', '1200 кв.м'],
          ['Постоянная часть АП', '850 руб.'],
          ['Переменная часть АП', 'свет, вода'],
        ], [50, 50], (P2[0]-P1[0])/16, 5, ['#83992A', '#D9DECD', '#EDEFE8']);
      }
      Canvas.restore();
    }

/*//////////
Canvas.save();
Canvas.beginPath();
Canvas.fillStyle = '#000000';
var P = this.FOwner.RealToScreenConvert(this.MassCenter());
Canvas.textAlign = 'center';
Canvas.textBaseline = 'middle';
Canvas.font = (this.FontSize/4*3).toString(10)+'px '+this.Font;
Canvas.fillText(this.data.Name2, P[0], P[1]-(this.FontSize*1));
Canvas.font = (this.FontSize).toString(10)+'px '+this.Font;
Canvas.fillText((this.Square()/1000000).toFixed(2)+' кв.м', P[0], P[1]);
Canvas.font = (this.FontSize/4*3).toString(10)+'px '+this.Font;
Canvas.fillText(this.data.Rate, P[0], P[1]+(this.FontSize*1));
Canvas.drawImage(Images['logo_monastirev'], P[0]-75, P[1], 150, 40);
Canvas.restore();
*//////////
  }
  ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    if (this.Points.length==0) return;
//    if (!this.DateActual()) return;
    var APoints = [];
    for (var i=0; i<this.Points.length; i++)
      APoints.push([Math.round((this.Points[i][0]-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Points[i][1]-ShiftY)*ScaleY)]);

    Canvas.beginPath();
    Canvas.moveTo(APoints[0][0], APoints[0][1]);
    for (var i=1; i<APoints.length; i++) Canvas.lineTo(APoints[i][0], APoints[i][1]);  
    Canvas.strokeStyle = '#ff0000';
    Canvas.lineWidth = 3;
    Canvas.stroke();
/*  длины сторон
    Canvas.fillStyle = '#000000';
    Canvas.font = (this.FontSize/4*3).toString(10)+'px '+this.Font;
    for (var i=0; i<this.Points.length-1; i++) {
      var d = Math.sqrt(Math.pow(this.Points[i+1][0]-this.Points[i][0], 2) + Math.pow(this.Points[i+1][1]-this.Points[i][1], 2));
      var d2 = Math.sqrt(Math.pow(APoints[i+1][0]-APoints[i][0], 2) + Math.pow(APoints[i+1][1]-APoints[i][1], 2));
      if (d2>this.FontSize*4) {
        Canvas.save();
        Canvas.textBaseline = 'middle';
        Canvas.textAlign = 'center';
        Canvas.translate(APoints[i][0]+(APoints[i+1][0]-APoints[i][0])/2, APoints[i][1]+(APoints[i+1][1]-APoints[i][1])/2);
        var a = (this.get_angle(APoints[i+1], APoints[i])+90);
        Canvas.rotate(a*Math.PI/180);
        Canvas.translate(0, this.FontSize/2+2);
        if ((a>90)&&(a<270)) {Canvas.rotate(180*Math.PI/180); Canvas.translate(0, this.FontSize/6);}
        Canvas.fillText((d/1000).toFixed(2), 0, 0);
        Canvas.restore();
      }
    }
    Canvas.font = (this.FontSize).toString(10)+'px '+this.Font;
    if (this.data) {
      var d = {};
      for (var key in this.data) if ((key!='ID')&&(key!='Points')) d[key]=this.data[key];
      Canvas.save();
      var APoint = [this.FCorner.Left, this.FCorner.Top];
      var P1 = [(APoint[0]-ShiftX)*ScaleX, Rect.Bottom-(APoint[1]-ShiftY)*ScaleY];
      var APoint = [this.FCorner.Right, this.FCorner.Bottom];
      var P2 = [(APoint[0]-ShiftX)*ScaleX, Rect.Bottom-(APoint[1]-ShiftY)*ScaleY];
      var C = [P1[0]+(P2[0]-P1[0])/2, P2[1]];
      var w = 200;
      var h = 10;
      d.Square = (this.Square()/1000000).toFixed(2)+' кв.м';
      for (var key in d) h+=wrapText(Canvas, d[key], 0, i, w-10, this.FontSize, false)*this.FontSize;
      var r = [C[0]-w/2, C[1]-h-5, w, h];
      if (r[0]<0) r[0] = 0;
      if (r[1]<0) r[1] = 0;
      if (r[0]+r[2]>this.FOwner.FRect.Right) r[0] = this.FOwner.FRect.Right-r[2];
      if (r[1]+r[3]>this.FOwner.FRect.Bottom) r[1] = this.FOwner.FRect.Bottom-r[3];
      Canvas.beginPath();
      Canvas.globalAlpha = 0.7;
      Canvas.fillStyle = '#000000';
      Canvas.roundRect(r[0], r[1], r[2], r[3], 10);
      Canvas.fill();
      Canvas.translate(r[0]+5, r[1]+5);
      Canvas.beginPath();
      Canvas.rect(0, 0, r[2]-10, r[3]-10);
      Canvas.clip();
      Canvas.globalAlpha = 1;
      Canvas.textBaseline = 'top';
      Canvas.fillStyle = '#ffffff';
      var i = 0;
      for (var key in d)
        i+=wrapText(Canvas, d[key], 0, i, w-10, this.FontSize, true)*this.FontSize;
      Canvas.restore();
    }
*/
  }
}

class TFormRent_Blank extends TForm {
  constructor(AOwner) {
    super(AOwner);
    this.Item = null;
    this.Properties = {Left: 50, Top: 50, Width: 400, Height: 200, FontSize:16, BorderStyle: bsDialog, FormStyle: fsStayOnTop};
    this.ButtonSave = new TButton(this);
    this.ButtonSave.Properties = {Parent: this, Left: 10, Top: 70, Width: 200, Height:26, Caption: 'Выполнить', Color: clBtnFace, OnClick: this.ButtonSaveClick};
    this.ButtonCancel = new TButton(this);
    this.ButtonCancel.Properties = {Parent: this, Left: 10, Top: 100, Width: 200, Height:26, Caption: 'Отменить', Color: clBtnFace, OnClick: this.ButtonCancelClick};
  }
  Init() {
    var w = 0, h = 0;
    for (var i=0; i<this.FControls.length; i++) {
      if (this.FControls[i].Top+this.FControls[i].Height>h) h = this.FControls[i].Top+this.FControls[i].Height;
    }
    this.ButtonSave.Top = h+5;
    this.ButtonCancel.Top = h+35;
    this.Height = 20+h+this.Parent.BorderSize+this.Parent.HeaderHeight+35+25;
    this.Position = poScreenCenter;
  }
  DataToForm() {}
  FormToData() {this.Item.data = {}; return(-1);}
  ButtonSaveClick(Sender, e) {
    if (this.FormToData()==-1) {
/*      var buffer = new ArrayBuffer(0);
      var Stream = new TMemoryStream(buffer);
      this.Item.SaveToStream(Stream);*/
      this.Item.data.Points = this.Item.Points;//arrayToBase64String(Stream.Memory);
      var s = JSON.stringify(this.Item.data, null, '\t')+",\r";
      delete(this.Item.data.Points);
      s = new TextEncoder("utf-8").encode(s);
      SaveFile(this.Item.FOwner.FileName, s, true).then(function() {this.Close();}.bind(this));
    }
  }
  ButtonCancelClick(Sender, e) {
    if (!this.Item.data) {
      for (var i=this.Item.FOwner.Items.length-1; i>=0; i--) if (this.Item.FOwner.Items[i]==this.Item) break;
      this.Item.FOwner.DeleteItem(i);
    }
    this.Close();
  }
}

class TFormRent_Card extends TFormRent_Blank {
  constructor(AOwner) {
    super(AOwner);
// ID, Event, Date, Name1, INN1, Name2, INN2, Square, Rate, VarPart, DateFrom, DateTo, Comment
/*
    this.Edit1 = new TEdit(this);
    this.Edit1.Properties = {Parent: this, Left: 10, Top: 10, Width: 200, Height:26, Text: '', Color: clWindow};

    this.Edit2 = new TEdit(this);
    this.Edit2.Properties = {Parent: this, Left: 10, Top: 40, Width: 200, Height:26, Text: '', Color: clWindow};
*/
  }
  Init() {
    var r = {Date: 'Дата события (03.12.2019)', Name1: 'Арендодатель (ООО "Компания1")', INN1: 'ИНН Арендодателя', Name2: 'Арендатор (ООО "Компания2")', INN2: 'ИНН Арендатора', Square: 'Площадь, кв.м (62.8)', Rate: 'Ставка, руб/кв.м (864.25)', VarPart: 'Переменная часть (свет;вода;тепло;другое)', DateTo: 'Дата окончания аренды (03.12.2019)', Comment: 'Комментарий'};
    var i = 10;
    for (var key in r) {
      this['Label'+key] = new TLabel(this);
      this['Label'+key].Properties = {Parent:this, Caption: r[key], Left:10, Top:i, FontSize: this.FontSize};
      this['Edit'+key] = new TEdit(this);
      this['Edit'+key].Properties = {Parent: this, Left: 10, Top: i+20, Width: this.FWidth-20, Height:26, Text: '', Color: clWindow};
      i = i+50;
    }
    super.Init();
  }
  DataToForm() {
    if (!this.Item.data) return;
    this.EditDate.Text = dateToDDMMYYYY(new Date());
  //  this.Edit1.Text = this.Item.data.INN1;
  //  this.Edit2.Text = this.Item.data.INN2;
  }
  FormToData() {
    var r = {};
    if (this.Item.data) r.ID = this.Item.data.ID; else r.ID = new Date().getTime();
  //  r.INN1 = this.Edit1.Text;
  //  r.INN2 = this.Edit2.Text;
    r.qqq = true;
    r.www = false;
    this.Item.data = r;
    return(-1);
  }
}

class TFormRent_Take extends TFormRent_Blank {
  constructor(AOwner) {
    super(AOwner);
    this.Caption = 'Выселить';
    this.Edit1 = new TEdit(this);
    this.Edit1.Properties = {Parent: this, Left: 10, Top: 10, Width: 200, Height:26, Text: '', Color: clWindow};
  }
  DataToForm() {
    if (!this.Item.data) return;
    this.Edit1.Text = dateToDDMMYYYY(new Date());
  }
  FormToData() {
    var r = {};
    if (this.Item.data) r.ID = this.Item.data.ID; else r.ID = new Date().getTime();
    r.Event = 'Take';
    r.Date = this.Edit1.Text;
    this.Item.data = r;
    return(-1);
  }
}

class TTrackBar extends TPanel {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = true;
    this.FPosition = 0;
    this.FMin = 0;
    this.FMax = 10;
    this.FBarDragDrop = false;
    this.Points = [];
    this.TrackButton = new TButton(this);
    this.TrackButton.Properties = {Parent: this, Left: 0, Top: 10, Width: 8, Height: 20, Caption: '', Color: clBtnFace, Flat: true, Transparent: false, OnDragDrop: this.TrackButtonDragDrop};
  }
  Show(Canvas) {
    if (!this.InRect()) return;
    this.TrackButton.Left = this.ScreenPosition-this.TrackButton.Width/2;
    Canvas.fillStyle = this.Color;
    Canvas.beginPath();
    Canvas.rect(this.Left, this.Top, this.Width, this.Height);
    Canvas.fill();
    Canvas.beginPath();
    Canvas.strokeStyle = '#444444';
    Canvas.moveTo(this.Left+10, this.Top+20);
    Canvas.lineTo(this.Left+this.Width-10, this.Top+20);
    Canvas.stroke();
    var Step = (this.Width-20)/(this.Max-this.Min);
/*    for(var i=this.Min; i<=this.Max; i++) {
      Canvas.beginPath();
      Canvas.moveTo(this.Left+10+Step*i, this.Top+15);
      Canvas.lineTo(this.Left+10+Step*i, this.Top+25);
      Canvas.stroke();
    }*/
    Canvas.textBaseline = 'top';
    Canvas.font = this.FontSize/3*2+'px '+this.Font;
    var x = 0;
    for (var i=0; i<this.Points.length; i++) {
      if ((this.Points[i][0]>=this.FMin) && (this.Points[i][0]<=this.FMax)) {
        x = this.Left+(this.Points[i][0]-this.FMin)*Step+10;
        if (this.Points[i][2]=='line') {
          Canvas.beginPath();
          Canvas.lineWidth = this.Points[i][5];
          Canvas.strokeStyle = this.Points[i][3];
          Canvas.moveTo(x, this.Top+20-this.Points[i][4]/2);
          Canvas.lineTo(x, this.Top+20+this.Points[i][4]/2);
          Canvas.stroke();
          Canvas.lineWidth = 1;
        }
        if (this.Points[i][2]=='circle') {
          Canvas.beginPath();
          Canvas.fillStyle = this.Points[i][3];
          Canvas.ellipse(x, this.Top+20, this.Points[i][4], this.Points[i][4], 0, 0, Math.PI*2, true);
          Canvas.fill();
        }
        Canvas.fillStyle = this.FontColor;
        Canvas.fillText(this.Points[i][1], x-Canvas.measureText(this.Points[i][1]).width/2, 30);
      }
    }
    var s = dateToDDMMYYYY(new Date(this.Position*(1000*60*60*24)));
    Canvas.fillText(s, this.Width/2-Canvas.measureText(s).width/2, 3);
    super.Show(Canvas);
  }
  TrackButtonDragDrop(Sender, e, Move, MoveN) {
    Sender.Parent.ScreenPosition = MoveN[0]-Sender.Parent.ClientOriginLeft;
  }
  MouseDown(Sender, e, X, Y) {
    this.ScreenPosition = X;
  }
  TouchStart(Sender, e, X, Y) {
    this.MouseDown(Sender, e, X, Y);
  }
  get Position() {return(this.FPosition);}
  set Position(value) {
    value = Math.round(value);
    if (value==this.FPosition) return;
    if (value<this.FMin) value = this.FMin;
    if (value>this.FMax) value = this.FMax;
    this.FPosition = value;
    this.TrackButton.Left = this.ScreenPosition-this.TrackButton.Width/2;
    this.ShowRequire = true;
    this.Event('Change');
  }
  get ScreenPosition() {return(this.FLeft+(this.FPosition-this.FMin)*((this.FWidth-20)/(this.FMax-this.FMin))+10);}
  set ScreenPosition(value) {this.Position = (value-10)/((this.Width-20)/(this.Max-this.Min))+this.Min;}
  get Min() {return(this.FMin);}
  set Min(value) {this.FMin = Math.round(value); if (this.FPosition<this.FMin) this.FPosition=this.FMin;}
  get Max() {return(this.FMax);}
  set Max(value) {this.FMax = Math.round(value); if (this.FPosition>this.FMax) this.FPosition=this.FMax;}
}

class TFormHostel extends TForm {
  constructor(AOwner) {
    super(AOwner);
    this.Properties = {Left: 0, Top: 0, Width: 700, Height: 500, FontSize: 16, Font: 'Arial', Position: poScreenCenter};
    this.Path;
    this.CurPath;
    this.Objects;
    this.CurObject;
    this.CurDetail;
    this.Images = {};

    this.ToolBar = new TToolBar(this);
    this.ToolBar.Properties = {Parent: this, Height: 45, Align: alTop};
    this.Button0 = new TButton(this);
    this.Button0.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Просмотр', Flat: true, GroupIndex: 1, Down: true, OnClick: this.Button0Click};
    this.Button1 = new TButton(this);
    this.Button1.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Резерв', Flat: true, GroupIndex: 1, OnClick: this.Button1Click};
/*
    this.Button2 = new TButton(this);
    this.Button2.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Заселить', Flat: true, GroupIndex: 1, OnClick: this.Button2Click};
    this.Button3 = new TButton(this);
    this.Button3.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Выселить', Flat: true, GroupIndex: 1};
    this.Button4 = new TButton(this);
    this.Button4.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Изменить', Flat: true, GroupIndex: 1};
    this.Button5 = new TButton(this);
    this.Button5.Properties = {Parent: this.ToolBar, Width: 100, Align: alLeft, Caption: 'Исправить', Flat: true, GroupIndex: 1};
*/
/*    this.ToolBar2 = new TToolBar(this);
    this.ToolBar2.Properties = {Parent: this, Height: 45, Align: alTop};
    this.TrackBar1 = new TTrackBar(this);
    var Min = (new Date('2019', '00', '01'))/(1000*60*60*24);
    var Max = Math.floor((new Date())/(1000*60*60*24));
    this.TrackBar1.Properties = {Parent: this.ToolBar2, Width: 400, Align: alClient, Color: clBtnFace, Min: Min, Max: Max, Position: Max, OnChange: this.TrackBar1Change};
    this.TrackBar1.Visible = false;
*/
//    this.StatusBar = new TStatusBar(this);
//    this.StatusBar.Properties = {Parent: this, Height: 24, Align: alBottom};
/*    this.Label1 = new TLabel(this);
    this.Label1.Properties = {Parent: this.StatusBar, Left: 4, Top: 4, Width: 150};
    this.Label2 = new TLabel(this);
    this.Label2.Properties = {Parent: this.StatusBar, Left: 4, Top: 4+20, Width: 150};
    this.Label3 = new TLabel(this);
    this.Label3.Properties = {Parent: this.StatusBar, Left: 4, Top: 4+40, Width: 150};
*/
/*
    this.Map = new TMap(this);
    this.Map.Properties = {Parent: this, Width:150, Align: alLeft, OnPointClick: this.MapPointClick, OnDrawPoint: this.MapDrawPoint};
    this.Map.Center = [43.281755, 132.065057];
    this.Map.Scale = 10;
    this.Map.Visible = false;
*/
    this.Detail = new TScrollBox2Auto(this);
    this.Detail.Properties = {Parent: this, Width: 150, Align: alRight};
//    this.Detail.Visible = false;

    this.RPlan = new TRPlanRent(this);
    this.RPlan.Properties = {Parent: this, Align: alClient, OnCommandTextChange: this.RPlanCommandTextChange, OnClick: this.RPlanClick};
    this.RPlan.MainBlock.FRect = {Left: 0, Top: 0, Right: this.RPlan.FWidth, Bottom: this.RPlan.FHeight};
    this.RPlan.Command='Rent';
/*
    this.PdfViewer = new TPdfViewer(this);
    this.PdfViewer.Properties = {Parent: this, Align: alClient, Color: clBtnFace, Visible: false};
    this.ButtonPdfClose = new TButton(this);
    this.ButtonPdfClose.Properties = {Parent: this.PdfViewer, Flat: true, Transparent: false, Left: this.PdfViewer.ClientLeft+this.PdfViewer.ClientWidth-this.FontSize*3, Top: this.FontSize*0.5, Width: this.FontSize*2, Height: this.FontSize*2, Caption: 'X', FontSize: '14', Color: '#675E51', FontColor: '#FFFFFF', Type: 'ellipse', Anchors: {Left:false, Top:true, Right:true, Bottom:false}, OnClick: this.ButtonPdfCloseClick};
*/
    this.Resize(this);
//    this.Open('D:\\дефриз.dxf');
    this.Open('http://rorders.ru/RPlan/volumes/root/rent_work/');
  }
  async Open(Path) {
/*    try {
      Application.Blocking = true;
      this.Path = Path;
//      var data = await LoadFile(Path+'objects.txt');
      var data = await LoadURL(this.Path+'objects.txt')
      var s = new TextDecoder("utf-8").decode(data);
      s = '[' + s.substr(0, s.length-2) + ']';
      this.Objects = JSON.parse(s);
      //for (var obj of this.Objects) this.Map.AddPoint(obj.Point[0], obj.Point[1]);
      this.CurObject = this.Objects[0];
    } finally {
      Application.Blocking = false;
    }
*/
    this.LoadObject(this.CurObject);
  }
  async LoadObject(Object) {
    try {
      Application.Blocking = true;
//      this.CurPath = this.Path+(Object.ID).toString().padStart(8, '0')+'/';
      var data = await Promise.all([
        //LoadURL(this.CurPath+'object.dxf'), 
        //LoadURL(this.CurPath+'object.txt')
        LoadURL(DXFFile),
        LoadURL(TXTFile),
      ]);
//      this.RPlan.MainBlock.FileName = Object.Name;
      this.RPlan.LoadFromDXF(arrayToString(data[0]));

      var s = new TextDecoder("utf-8").decode(data[1]);
      s = '['+ s.substr(0, s.length-2) + ']';
      var MonthNameRus = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
//      this.TrackBar1.Points = [];
//      for (var i=0; i<12; i++) this.TrackBar1.Points.push([Math.round((new Date('2019', i, '01'))/(1000*60*60*24)), MonthNameRus[i], 'line', '#444444', 6, 1]);
      var json = JSON.parse(s);
      for (var i=0; i<json.length; i++) {
        if (json[i].ID==0) this.RPlan.MainBlock.data = json[i]; else {
          var Item = new TRPPolyLineRent(this.RPlan.MainBlock);
          this.RPlan.MainBlock.AddItem(Item);    
          Item.Points = json[i].Points;
          Item.Filled = true;
          Item.CalcCorner();
          delete(json[i].Points);
          Item.data = json[i];
//          if (Item.data.Date) this.TrackBar1.Points.push([Item.data.Date/(1000*60*60*24), '', 'line', '#ff0000', 16, 3]);
        }
/*
        if (json[i].Label) if (json[i].Label.length>4)
          if (json[i].Label[4] in this.Images); else {
            data = await LoadURL(this.Path+'\\images\\'+json[i].Label[4]);
            var img = document.createElement('img');
            await new Promise((resolve, reject) => {
              img.addEventListener("load", () => resolve(img));
              img.addEventListener("error", err => reject(err));
              img.src = URL.createObjectURL(new Blob([data]));
            });
            this.Images[json[i].Label[4]] = img;
          }
*/
      } 
//      this.TrackBar1Change(this.TrackBar1);
      this.CurDetail = this.RPlan.MainBlock;
      this.FillDetail(this.CurDetail);
      this.ShowRequire = true;
    } catch(e) {
      console.log(e);
    } finally {
      Application.Blocking = false;
    }
  }
/*  Button1Click(Sender) {
    var buffer = new ArrayBuffer(0);
    var Stream = new TMemoryStream(buffer);
    this.RPlan.MainBlock.SaveToStream(Stream);
    SaveFile('C:\\test.pln', Stream.DataView.buffer);
  }*/
  Button0Click(Sender) {
    this.RPlan.Command = 'Rent';
  }
  Button1Click(Sender) {
    this.RPlan.Command = 'Area';
  }
  Button2Click(Sender) {
    this.RPlan.Command = 'Area';
  }
  RPlanCommandTextChange(Sender, Text) {
    this.Label.Caption = Text;
    this.Label.ShowRequire = true;
  }
  FillDetail(Item) {
/*
    for (;this.Detail.FControls.length>0;) this.RemoveComponent(this.Detail.FControls[0]);
    var c = ['#D9DECD', '#EDEFE8'];

    if (Item.data.Label) {
      var img = this.Images[Item.data.Label[4]];
      if (img) {
        var C = new TImage(this);
        C.Properties = {Parent: this.Detail, Left: 4+20, Top: 8, Width: this.Detail.Width-8-40, FImage: img};
        C.Height = C.Width*img.naturalHeight/img.naturalWidth;
      }
    }
*/
    if (this.Detail.FControls.length==0) {
      var C = new TLabel(this);
      C.Properties = {Parent: this.Detail, Left: 4, Top:8, Width: this.Detail.Width-8, Height: 30, Caption: Item.data.Name2, Color: '#ffffff', Align: 'center', VAlign: 'middle'};
    }
/*
    this.Label4 = new TLabel(this);
    this.Label4.Top = this.Detail.FControls[this.Detail.FControls.length-1].Top+this.Detail.FControls[this.Detail.FControls.length-1].Height+8;
    this.Label4.Properties = {Parent: this.Detail, Left: 4, Width: this.Detail.Width-8, Height: 20, Caption:'Сведения', Color: '#83992A', FontColor: '#ffffff', Align: 'center', VAlign: 'middle'};

    var i=0;
    for (var key in Item.data) {
      if ((key!='ID')&&(key!='Label')&&(key!='Files')) {
        var e = new TLabel(this);
        e.Top = this.Detail.FControls[this.Detail.FControls.length-1].Top+this.Detail.FControls[this.Detail.FControls.length-1].Height;
        e.Properties = {Parent: this.Detail, Left: 4, Width: this.Detail.Width-8, Height: 14, FontSize: 12, Color: c[i%2], VAlign: 'middle'};
        e.Caption = key;

        var e = new TLabel(this);
        e.Top = this.Detail.FControls[this.Detail.FControls.length-1].Top+this.Detail.FControls[this.Detail.FControls.length-1].Height;
        e.Properties = {Parent: this.Detail, Left: 4, Width: this.Detail.Width-8, Height: 18, FontSize: 16, Color: c[(i+1)%2], VAlign: 'middle', Align: 'right'};
        e.Caption = Item.data[key];
        i+=2;
      }
    }

    for (var key in Item.data.Files) {
      var Icon = new TIcon(this);
      Icon.Top = 6+this.Detail.FControls[this.Detail.FControls.length-1].Top+this.Detail.FControls[this.Detail.FControls.length-1].Height;
      Icon.Properties = {Parent: this.Detail, FileData: Item.data.Files[key], Flat: true, GroupIndex: 1, Left: 4, Width: this.Detail.Width-8, Height: 48, Caption: '', OnDoubleClick: this.FileIconClick, OnDrawImage: this.FileIconDrawImage};
    }
*/
  }
  RPlanClick(Sender, e, X, Y) {
/*    var Item = this.RPlan.MainBlock.ScreenPointIn([X, Y]);
    var Form = new TFormRent_Card(Application);
    Form.Init();
    Form.Item = Item;
    Form.DataToForm();
    Application.ActiveForm = Form;
*/
    var Item = this.RPlan.MainBlock.ScreenPointIn([X, Y]);
    if (!Item.data) Item = this.RPlan.MainBlock;
    this.CurDetail = Item;
    this.FillDetail(this.CurDetail);
  }
  FileIconDrawImage(Sender, Canvas, Width, Height) {
/*    var Image;
    Image = OS.GetIconByExt(Sender.FileData.name);
    if (Image==null) Image = Images['explorer_file_icon'];  
    var fs = Sender.FontSize;
    Canvas.drawImage(Image, fs/8, fs/8, Height-fs/4, Height-fs/4);
    var FS = (Sender.Height-fs/6)/3;
    Canvas.font = (FS-fs/5)+'px '+this.Font;
    Canvas.textAlign="start";
    Canvas.textBaseline="top";
    Canvas.fillText(Sender.FileData.dname, Sender.Height, fs/4);
    Canvas.globalAlpha = 0.6;
    Canvas.fillText('Файл '+ExtractFileExt(Sender.FileData.name).slice(1).toUpperCase(), Sender.Height, fs/4+FS);
    Canvas.fillText(FileSizeToDisplay(Sender.FileData.size/1024, 6, true, [' КБ', ' МБ', ' ГБ']), Sender.Height, fs/4+FS*2);*/
  }
  async FileIconClick(Sender) {
    this.RPlan.Visible = false;
    this.PdfViewer.Visible = true;
    var data = await LoadFile(this.CurPath+Sender.FileData.name);
    this.PdfViewer.Load(arrayToString(data));
  }
  ButtonPdfCloseClick(Sender) {
    this.PdfViewer.Visible = false;
    this.RPlan.Visible = true;
    this.PdfViewer.Clear();
  }
  TrackBar1Change(Sender) {
    if (Sender.Position<Sender.Max) Sender.Color = '#e3a15b'; else Sender.Color = clBtnFace;
    var Items = this.RPlan.MainBlock.Items;
    var sq = 0, c = 0, rate = 0;
    for (var i=Items.length-1; i>=0; i--)
      if (Items[i].ClassName=='TRPPolyLineRent') if (Items[i].DateActual()) {
        sq+=Math.round(Items[i].Square()/10000)/100;
        c++;
      }
        
//    this.Label1.Caption = 'Количество арендаторов: '+c;
//    this.Label2.Caption = 'Сданная в аренду площадь: '+sq.toFixed(2)+' кв.м';
//    this.Label3.Caption = 'Общая сумма аренды: ';//+rate.toFixed(2)+' руб.';

//    this.RPlan.MainBlock.Date = new Date(Sender.Position*(1000*60*60*24));
//    console.log(dateToDDMMYYYY(new Date(Sender.Position*(1000*60*60*24))));
  }
  MapPointClick(Sender, P) {
    for (var obj of this.Objects) 
      if ((P.X==obj.Point[0])&&(P.Y==obj.Point[1])) {
        if (this.CurObject==obj) return;
        this.CurObject = obj;
        this.LoadObject(this.CurObject);
      }
  }
  MapDrawPoint(Sender, Canvas, X, Y, P) {
    Canvas.strokeStyle = '#000000';
    if ((this.CurObject.Point[0]==P.X) && (this.CurObject.Point[1]==P.Y)) Canvas.fillStyle = '#ff0000'; else Canvas.fillStyle = '#1081E0';
    P.Show(Canvas, X, Y);
  }
  Resize(Sender) {
/*
    if (this.TrackBar1) {
      this.TrackBar1Change(this.TrackBar1);
      Sender.ShowRequire = true;
      console.log(Application.Width, Application.Height);
    }
    if ((this.Map)&&(this.Detail))
      if (this.Width<this.Height) {
        var h = this.Height/4;
        if (h>250) h=250;

        this.Map.Align = alNone;
        this.Detail.Align = alNone;
        this.RPlan.Align = alNone;
        this.PdfViewer.Align = alNone;

        this.Map.Properties = {Height: h, Align: alTop};
        this.Detail.Properties = {Height: h, Align: alBottom};
        this.RPlan.Properties = {Align: alClient};
        this.RPlan.MainBlock.FRect = {Left: 0, Top: 0, Right: this.RPlan.FWidth, Bottom: this.RPlan.FHeight};
        this.RPlan.MainBlock.AutoSize(0.9);
        this.PdfViewer.Properties = {Align: alClient};
        this.ButtonPdfClose.Left = this.PdfViewer.ClientLeft+this.PdfViewer.ClientWidth-this.FontSize*3;
        if (this.CurDetail) this.FillDetail(this.CurDetail);
      } else {
        var w = this.Width/4;
        if (w>250) w=250;

        this.Map.Align = alNone;
        this.Detail.Align = alNone;
        this.RPlan.Align = alNone;
        this.PdfViewer.Align = alNone;

        this.Map.Properties = {Width: w, Align: alLeft};
        this.Detail.Properties = {Width: w, Align: alRight};
        this.RPlan.Properties = {Align: alClient};
        this.RPlan.MainBlock.FRect = {Left: 0, Top: 0, Right: this.RPlan.FWidth, Bottom: this.RPlan.FHeight};
        this.RPlan.MainBlock.AutoSize(0.9);
        this.PdfViewer.Properties = {Align: alClient};
        this.ButtonPdfClose.Left = this.PdfViewer.ClientLeft+this.PdfViewer.ClientWidth-this.FontSize*3;
        if (this.CurDetail) this.FillDetail(this.CurDetail);
      }
*/

    if (this.RPlan) {
//      this.Map.Align = alNone;
      this.Detail.Align = alNone;
      this.RPlan.Align = alNone;
//      this.PdfViewer.Align = alNone;

      this.RPlan.Properties = {Align: alClient};
      this.RPlan.MainBlock.FRect = {Left: 0, Top: 0, Right: this.RPlan.FWidth, Bottom: this.RPlan.FHeight};
      this.RPlan.MainBlock.AutoSize(0.9);

      Sender.ShowRequire = true;
    }

  }
}

//RegistryApplication.push(['Rent', 'rent_icon', TFormRent, {}]);
