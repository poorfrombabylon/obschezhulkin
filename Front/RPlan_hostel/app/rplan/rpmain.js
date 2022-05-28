TRPItem.prototype.Published = function() {return({'PenColor': prColor, 'BrushColor': prColor});}
TRPPolyLine.prototype.Published = function() {return({'PenColor': prColor, 'PenWidth': prInteger, 'BrushColor': prColor, 'Filled': prBoolean});}
TRPEquipment.prototype.Published = function() {return({'Name': prString, 'GroupNames': prString});}

class TRPlan extends TScrollBox2 {
  constructor(AOwner) {
    super(AOwner);
    this.MainBlock = new TRPMainBlock();
    this.MainBlock.FCanvas = this.HCanvas;
    this.MainBlock.FOwner = this;
    this.Commands = [];
    this.Command = '';
    this.ORTHO = false;
    this.LINK = true;
    this.LINKPoint = [100, 100, false];
    this.COPYBLOCK = true;
//    this.TextCursor = null;
  }

  Paint(Sender, Canvas) {
    Canvas.fillStyle = '#FFFFFF';
    Canvas.fillRect(0, 0, this.MainBlock.FRect.Right, this.MainBlock.FRect.Bottom);
    this.MainBlock.Show(Canvas);
    if ((this.LINK)&&(this.LINKPoint[2])) {
      var APoint = this.MainBlock.RealToScreenConvert(this.LINKPoint);
      Canvas.strokeStyle = '#ff0000';
      Canvas.lineWidth = 2;
      Canvas.strokeRect(APoint[0]-LinkSensetive, APoint[1]-LinkSensetive, LinkSensetive*2, LinkSensetive*2);
    }

    Canvas.fillStyle = '#000000';
    Canvas.font = '20px Arial';
    Canvas.fillText('WX:'+this.FWidth.toString(10)+
      ' WY:'+this.FHeight.toString(10)+
      ' X:'+(this.MainBlock.MouseMoveX/this.MainBlock.Scale+this.MainBlock.ShiftX).toFixed(2)+
      ' Y:'+((this.MainBlock.Rect.Bottom-this.MainBlock.MouseMoveY)/this.MainBlock.Scale+this.MainBlock.ShiftY).toFixed(2)+
      ' BC:'+this.MainBlock.ItemsCount.toString(10)+
      ' '+this.CommandName,
      5, this.MainBlock.Rect.Bottom-5);
  }

  LINKPrepare(Sender, e, X, Y, Except) {
    if (this.LINK) {
      var APoint = this.MainBlock.ScreenToRealConvert([X, Y]);
      var SLP = [];
      for (var i=0; i<=2; i++) SLP[i]=this.LINKPoint[i];
      this.LINKPoint[2]=this.MainBlock.PointNearLink(APoint, this.MainBlock.FScale, this.LINKPoint, Except);
      if (SLP[2]!=this.LINKPoint[2]) this.ShowRequire = true;
      if ((SLP[2]==this.LINKPoint[2])&&(SLP[2]))
        if ((SLP[0]!=this.LINKPoint[0])||(SLP[1]!=this.LINKPoint[1])) this.ShowRequire = true;
    } else this.LINKPoint[2]=false;
  }

  LoadPlanFunc(Sender, xhr) {
    return function() {
      if (xhr.readyState == xhr.DONE)
        if (xhr.status == 200 && xhr.response) {
          var Stream = new TMemoryStream(xhr.response);
          Stream.Position = 26;
          Sender.MainBlock.LoadFromStream(Stream);
          Sender.MainBlock.FScale = 0.1;
          Sender.Event('Loaded', [], 2);
          Sender.ShowRequire = true;
        } else alert("Failed to download:" + xhr.status + " " + xhr.statusText);
    }
  }

  LoadPlan(plannum) {
    if (typeof plannum==='undefined') plannum='0';
    var url = 'http://emitents.net/RPlan/index.php?action=planget&plannum='+plannum;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = this.LoadPlanFunc(this, xhr);
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.send();

    this.MainBlock.FScale = 1;
  }

  SavePlan(plannum) {
    if (typeof plannum==='undefined') plannum='0';
    var buffer = new ArrayBuffer(0);
    var Stream = new TMemoryStream(buffer);
    this.MainBlock.SaveToStream(Stream);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://emitents.net/RPlan/index.php?action=planset&plannum='+plannum, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        alert('successfull saved! '+xhr.responseText);
      }
    }
    var DV = new DataView(Stream.DataView.buffer, 0, Stream.Size);
    xhr.send(DV);
  }

  get Width() {return(this.FWidth);}
  set Width(value) {
    super.Width = value;
    this.MainBlock.FRect = {Left: 0, Top: 0, Right: Number(this.FWidth), Bottom: Number(this.FHeight)};
  }
  get Height() {return(this.FHeight);}
  set Height(value) {
    super.Height = value;
    this.MainBlock.FRect = {Left: 0, Top: 0, Right: Number(this.FWidth), Bottom: Number(this.FHeight)};
  }

  get CommandName() {return(this.Commands[this.Commands.length-1].Name);}
  get Command() {return(this.Commands[this.Commands.length-1]);}
  set Command(value) {eval('this.Commands.push(new TRPCommand'+value+'(this));');}

  Click(Sender, e, X, Y) {Sender.Command.Click(Sender, e, X, Y);}
  DoubleClick(Sender, e, X, Y) {Sender.Command.DoubleClick(Sender, e, X, Y);}
  DragDrop(Sender, e, Move, MoveN) {Sender.Command.DragDrop(Sender, e, Move, MoveN);}
  DragDropStart(Sender, e, Move, MoveN) {Sender.Command.DragDropStart(Sender, e, Move, MoveN);}
  DragDropEnd(Sender, e, Move, MoveN) {Sender.Command.DragDropEnd(Sender, e, Move, MoveN);}
  Pinch(Sender, e, Move, MoveN, Move2, MoveN2) {Sender.Command.Pinch(Sender, e, Move, MoveN, Move2, MoveN2);}
  MouseWheel(Sender, e) {Sender.Command.MouseWheel(Sender, e);}
  MouseDown(Sender, e, X, Y) {Sender.Command.MouseDown(Sender, e, X, Y);}
  MouseUp(Sender, e, X, Y) {Sender.Command.MouseUp(Sender, e, X, Y);}
  MouseMove(Sender, e, X, Y) {Sender.Command.MouseMove(Sender, e, X, Y);}
  TouchStart(Sender, e, X, Y) {Sender.Command.TouchStart(Sender, e, X, Y);}
  TouchMove(Sender, e, X, Y) {Sender.Command.TouchMove(Sender, e, X, Y);}
  TouchEnd(Sender, e, X, Y) {Sender.Command.TouchEnd(Sender, e, X, Y);}
  KeyDown(Sender, e) {
    if (e.keyCode==119) {
      this.ORTHO = !this.ORTHO;
      this.ShowRequire = true;
    }
    if (e.keyCode==114) {
      this.LINK = !this.LINK;
      this.ShowRequire = true;
    }
    if (e.keyCode==46) {
      this.MainBlock.DeleteSelectedItems();
      this.ShowRequire = true;
    }
    if (e.keyCode==27) {
      this.MainBlock.ClearSelectedItems();
      this.ShowRequire = true;
    }
    Sender.Command.KeyDown(Sender, e);
  }
}

class TRPCommand {
  constructor(ARPlan) {
    this.RPlan = ARPlan;
  }
  get Name() {return(this.constructor.name.slice(10));}

  Click(Sender, e, X, Y) {}
  DoubleClick(Sender, e, X, Y) {}
  DragDrop(Sender, e, Move, MoveN) {
    Sender.MainBlock.FShiftX-=(MoveN[0]-Move[0])/Sender.MainBlock.FScale*Application.ScaleX;
    Sender.MainBlock.FShiftY+=(MoveN[1]-Move[1])/Sender.MainBlock.FScale*Application.ScaleY;
    Sender.ShowRequire = true;
  }
  DragDropStart(Sender, e, Move, MoveN) {}
  DragDropEnd(Sender, e, Move, MoveN) {}

  Pinch(Sender, e, Move, MoveN, Move2, MoveN2) {
    var L = Sender.ClientOriginLeft;
    var T = Sender.ClientOriginTop;
    Move[0]-=L; Move[1]-=T; MoveN[0]-=L; MoveN[1]-=T; Move2[0]-=L; Move2[1]-=T; MoveN2[0]-=L; MoveN2[1]-=T;

    var CX1 = Move[0] + (Move2[0]-Move[0])/2;
    var CY1 = Move[1] + (Move2[1]-Move[1])/2;
    var CX2 = MoveN[0] + (MoveN2[0]-MoveN[0])/2;
    var CY2 = MoveN[1] + (MoveN2[1]-MoveN[1])/2;

    var Delta = Math.sqrt(Math.pow(Move2[0]-Move[0], 2)+Math.pow(Move2[1]-Move[1], 2));
    var Delta2 = Math.sqrt(Math.pow(MoveN2[0]-MoveN[0], 2)+Math.pow(MoveN2[1]-MoveN[1], 2));
    var K = Delta/Delta2;

    Sender.MainBlock.FShiftX = CX1/Sender.MainBlock.FScale+Sender.MainBlock.FShiftX-(CX1/Sender.MainBlock.FScale*K);
    Sender.MainBlock.FShiftY = (Sender.MainBlock.FRect.Bottom-CY1)/Sender.MainBlock.FScale+Sender.MainBlock.FShiftY-((Sender.MainBlock.FRect.Bottom-CY1)/Sender.MainBlock.FScale*K);
    Sender.MainBlock.FScale = Sender.MainBlock.FScale/K;
    Sender.MainBlock.FShiftX+=(CX1-CX2)/Sender.MainBlock.FScale;
    Sender.MainBlock.FShiftY+=(CY2-CY1)/Sender.MainBlock.FScale;

    Sender.ShowRequire = true;
  }

  MouseWheel(Sender, e) {
    this.RPlan.MainBlock.ScaleFromScreenPoint([e.offsetX-Sender.ClientOriginLeft, e.offsetY-Sender.ClientOriginTop], (e.deltaY>=0)*1.1 + (e.deltaY<0)/1.1);
    Sender.ShowRequire = true;
  }
  MouseDown(Sender, e, X, Y) {
    var Item = this.RPlan.MainBlock.ScreenPointIn([X, Y]);
    var SItem = Item;
    for (; Item.Owner!=null; Item=Item.Owner) {
      if (Item.ClassName=='TRPEquipment') {
        if (!this.RPlan.COPYBLOCK)
          this.RPlan.Command = 'MoveBlock';
          else this.RPlan.Command = 'CopyBlock';
        this.RPlan.Command.RPBlock = Item;
        break;
      }
    }
    if (e.buttons!=2) {
      SItem.Selected = true;
      this.RPlan.Event('Selected', [SItem], 2);
      Sender.ShowRequire = true;
    }
    if ((e.buttons==2)&&(Item!=this.RPlan.MainBlock)) {
      var C = Item.Corner;
      Item.Rotate(C.Left+(C.Right-C.Left)/2, C.Top+(C.Bottom-C.Top)/2, 90);
      Sender.ShowRequire = true;
      this.RPlan.Command = '';
    }
  }
  MouseUp(Sender, e, X, Y) {}
  MouseMove(Sender, e, X, Y) {
    this.RPlan.LINKPrepare(Sender, e, X, Y);
/*
    if ((e.which==1)&&(this.MouseDrag)) {
      this.RPlan.MainBlock.FShiftX+=(this.MouseMoveX-e.offsetX)/this.RPlan.MainBlock.FScale;
      this.RPlan.MainBlock.FShiftY+=(e.offsetY-this.MouseMoveY)/this.RPlan.MainBlock.FScale;
      this.MouseMoveX = e.offsetX;
      this.MouseMoveY = e.offsetY;
//      this.RPlan.Show();
    } else {
//      this.RPlan.Show();
      this.RPlan.CanvasClear();
//      this.RPlan.MainBlock.Show();
      var Item = this.RPlan.MainBlock.ScreenPointIn([e.offsetX, e.offsetY]);
      for (; Item.Owner!=null; Item=Item.Owner) {
        if (Item.ClassName=='TRPEquipment') {
          Item.Show(this.RPlan.MainBlock.Canvas, this.RPlan.MainBlock.Rect, this.RPlan.MainBlock.ShiftX, this.RPlan.MainBlock.ShiftY, this.RPlan.MainBlock.Scale, this.RPlan.MainBlock.Scale);
          this.RPlan.MainBlock.Canvas.globalAlpha = 0.5;
          Item.Show(this.RPlan.MainBlock.Canvas, this.RPlan.MainBlock.Rect, this.RPlan.MainBlock.ShiftX, this.RPlan.MainBlock.ShiftY, this.RPlan.MainBlock.Scale, this.RPlan.MainBlock.Scale);
          this.RPlan.MainBlock.Canvas.globalAlpha = 1;

          break;
        }
      }
//      this.RPlan.GUIBlock.Show();
    }
*/
  }

  TouchStart(Sender, e, X, Y) {this.MouseDown(Sender, e, X, Y);}
  TouchMove(Sender, e, X, Y) {this.MouseMove(Sender, e, X, Y);}
  TouchEnd(Sender, e, X, Y) {this.MouseUp(Sender, e, X, Y);}

  KeyDown(Sender, e) {}
}

class TRPCommandInsertBlock extends TRPCommand {
  constructor(ARPlan) {
    super(ARPlan);
    this.RPBlock = null;
  }
  MouseWheel(Sender, e) {super.MouseWheel(Sender, e);}
  MouseDown(Sender, e) {
    if (e.buttons==1) {this.TouchStart(Sender, e);}
  }
  TouchStart(Sender, e) {
    this.RPBlock = this.RPBlock.Clone();
    this.RPBlock.FOwner = this.RPlan.MainBlock;
    this.RPBlock.FVisible = true;
    this.RPlan.MainBlock.AddItem(this.RPBlock);

    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
    this.RPBlock.Move(APoint[0]-this.RPBlock.Corner.Left-(this.RPBlock.Corner.Right-this.RPBlock.Corner.Left)/2, APoint[1]-this.RPBlock.Corner.Top-(this.RPBlock.Corner.Bottom-this.RPBlock.Corner.Top)/2);

    this.RPlan.Command = 'MoveBlock';
    this.RPlan.Command.RPBlock = this.RPBlock;
    Sender.ShowRequire = true;
  }
}

class TRPCommandMoveBlock extends TRPCommand {
  constructor(ARPlan) {
    super(ARPlan);
    this.RPBlock = null;
    this.StartPoint = [0, 0];
  }
  DragDropStart(Sender, e, Move, MoveN) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
    this.StartPoint = [APoint[0]-this.RPBlock.Items[0].Points[0][0], APoint[1]-this.RPBlock.Items[0].Points[0][1]];
  }
  DragDrop(Sender, e, Move, MoveN) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
    this.RPBlock.Move(APoint[0]-this.RPBlock.Items[0].Points[0][0]-this.StartPoint[0], APoint[1]-this.RPBlock.Items[0].Points[0][1]-this.StartPoint[1]);

    var LinkPoint = [];
    for (var i=0; i<this.RPBlock.Owner.ItemsCount; i++) {
      if ((this.RPBlock.Owner.Items[i].ClassName=='TRPEquipment')&&(this.RPBlock.Owner.Items[i]!=this.RPBlock)) {
        for (var j=0; j<this.RPBlock.Items[0].PointCount; j++) {
          if (this.RPBlock.Owner.Items[i].Items[0].PointNearLink(this.RPBlock.Items[0].Points[j], Sender.MainBlock.FScale, LinkPoint)) {
            this.RPBlock.Move((LinkPoint[0]-this.RPBlock.Items[0].Points[j][0]), (LinkPoint[1]-this.RPBlock.Items[0].Points[j][1]));
            break;
          }
        }
      }
    }
    Sender.ShowRequire = true;
  }
  DragDropEnd(Sender, e, Move, MoveN) {
    Sender.ShowRequire = true;
    this.RPlan.Command = '';
  }
  MouseDown(Sender, e) {
    if (e.buttons==3) {
      this.RPBlock.Rotate(this.RPBlock.Corner.Left+(this.RPBlock.Corner.Right-this.RPBlock.Corner.Left)/2, this.RPBlock.Corner.Top+(this.RPBlock.Corner.Bottom-this.RPBlock.Corner.Top)/2, 90);
      Sender.ShowRequire = true;
    }
  }
  MouseUp(Sender, e) {if (e.buttons==0) this.DragDropEnd(Sender, e);}
  TouchEnd(Sender, e) {this.DragDropEnd(Sender, e);}
}

class TRPCommandCopyBlock extends TRPCommand {
  constructor(ARPlan) {
    super(ARPlan);
    this.RPBlock = null;
    this.StartPoint = [0, 0];
  }
  DragDropStart(Sender, e, Move, MoveN) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
//    this.StartPoint = [APoint[0]-this.RPBlock.Items[0].Points[0][0], APoint[1]-this.RPBlock.Items[0].Points[0][1]];
    this.StartPoint = [APoint[0], APoint[1]];
  }

  Intersection(ax1,ay1,ax2,ay2,bx1,by1,bx2,by2) {
    var v1,v2,v3,v4;
    v1=(bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
    v2=(bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
    v3=(ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
    v4=(ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
    return((v1*v2<0)&&(v3*v4<0));
  }
  DragDrop(Sender, e, Move, MoveN) {
    var APoint = this.RPlan.MainBlock.ScreenToRealConvert([X, Y]);
    if (this.RPBlock.Items[0].PointIn(APoint, this.RPlan.MainBlock.Scale)==null) {
      var Item = this.RPBlock.Clone();
//      Item.Move(2000,0);
      for (var i=0; i<this.RPBlock.Items[0].PointCount-1; i++)
        if (this.Intersection(
          this.RPBlock.Items[0].Points[i][0],
          this.RPBlock.Items[0].Points[i][1],
          this.RPBlock.Items[0].Points[i+1][0],
          this.RPBlock.Items[0].Points[i+1][1],
          this.StartPoint[0],
          this.StartPoint[1],
          APoint[0],
          APoint[1]
        )) {
          Item.Mirror(this.RPBlock.Items[0].Points[i][0], this.RPBlock.Items[0].Points[i][1], this.RPBlock.Items[0].Points[i+1][0], this.RPBlock.Items[0].Points[i+1][1]);
          this.RPBlock.Owner.AddItem(Item);
          this.RPBlock = Item;
          this.DragDropStart(Sender, e, Move, MoveN);
          Sender.ShowRequire = true;
          break;
        }
    }
  }
  DragDropEnd(Sender, e, Move, MoveN) {
    Sender.ShowRequire = true;
    this.RPlan.Command = '';
  }
}

class TRPCommandLine extends TRPCommand {
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
      this.RPPolyLine = new TRPPolyLine(this.RPlan.MainBlock);
      this.RPPolyLine.PenColor = '#000000';
      this.RPlan.MainBlock.AddItem(this.RPPolyLine);
      this.RPPolyLine.AddPoint(APoint[0], APoint[1]);
    }
    this.RPPolyLine.AddPoint(APoint[0], APoint[1]);
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
    if (e.keyCode==27) {
      if (this.RPPolyLine.PointCount>2) this.RPPolyLine.DeletePoint(this.RPPolyLine.PointCount-1);
        else this.RPlan.MainBlock.DeleteItem(this.RPlan.MainBlock.ItemsCount-1);
      this.RPlan.Command='';
      Sender.ShowRequire = true
    }
  }

  get Text() {return(this.FText);}
  set Text(value) {
    this.FText = value;
    this.RPlan.Event('CommandTextChange', [this.FText], 2);
  }
}
