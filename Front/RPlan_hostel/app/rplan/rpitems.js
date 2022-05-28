const LinkSensetive = 5;

function TColorToString(value) {
  var s = ('000000'+value.toString(16)).slice(-6);
  return('#'+s[4]+s[5]+s[2]+s[3]+s[0]+s[1]);
}

function StringToTColor(value) {
  var s = value.slice(1);
  return(parseInt('0x'+s[4]+s[5]+s[2]+s[3]+s[0]+s[1]));
}

function Color8BitTo24Bit(value) {
  return('#' + ('00'+((value >> 5) * 255 / 7).toString(16)).slice(-2) +
    ('00'+(((value >> 2) & 0x07) * 255 / 7).toString(16)).slice(-2) +
    ('00'+((value & 0x03) * 255 / 3).toString(16)).slice(-2)
  );
}

function RotatePoint(P, PC, Angle) {
  return([
    PC[0] + (P[0]-PC[0])*Math.cos(-Angle*Math.PI/180) - (P[1]-PC[1])*Math.sin(-Angle*Math.PI/180),
    PC[1] + (P[1]-PC[1])*Math.cos(-Angle*Math.PI/180) + (P[0]-PC[0])*Math.sin(-Angle*Math.PI/180)
  ]);
}

class TRPCorner {
  constructor(AOwner) {
    this.Reset();
  }
  Reset() {
    this.Left = null;
    this.Top = null;
    this.Right = null;
    this.Bottom = null;
  }
  AddPoint(P) {
    if ((P[0]<this.Left)||(this.Left==null)) this.Left = P[0];
    if ((P[1]<this.Top)||(this.Top==null)) this.Top = P[1];
    if ((P[0]>this.Right)||(this.Right==null)) this.Right = P[0];
    if ((P[1]>this.Bottom)||(this.Bottom==null)) this.Bottom = P[1];
  }
  AddCorner(Corner) {
    this.AddPoint([Corner.Left, Corner.Top]);
    this.AddPoint([Corner.Right, Corner.Bottom]);
  }
}

class TRPItem {
  constructor(AOwner) {
    this.FOwner = AOwner;
    this.FParent = null;
    this.FName = '';
    this.FLayerName = '';
    this.FVisible = true;
    this.FSelected = false;
    this.FPenStyle = '';
    this.FPenStyleSet = false;
    this.FPenColor = '#FFFFFF';
    this.FPenColorSet = false;
    this.FPenWidth = 1;
    this.FPenWidthSet = false;
    this.FBrushStyle = '';
    this.FBrushStyleSet = false;
    this.FBrushColor = '#FFFFFF';
    this.FBrushColorSet = false;
    this.FCorner = new TRPCorner(); //{}; //{'Left': Number(0), 'Bottom': Number(0), 'Right': Number(0), 'Top': Number(0)};
  }

  // methods
  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {}
  ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {}

  ShowSelected(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers) {
    if (!this.FVisible) return;
    if (Layers) if (this.FLayerName.length>0) if (Layers.indexOf(this.FLayerName)<0) return;
    var RRect = [];
    RRect.Left = Rect.Left/ScaleX+ShiftX;
    RRect.Bottom = Rect.Bottom/ScaleY+ShiftY;
    RRect.Right = Rect.Right/ScaleX+ShiftX;
    RRect.Top = Rect.Top/ScaleY+ShiftY;
    if (this.InRect(RRect))
      this.ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers);
  }

  Show(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers) {
    if (!this.FVisible) return;
    if (Layers) if (this.FLayerName.length>0) if (Layers.indexOf(this.FLayerName)<0) return;
    var RRect = [];
    RRect.Left = Rect.Left/ScaleX+ShiftX;
    RRect.Bottom = Rect.Bottom/ScaleY+ShiftY;
    RRect.Right = Rect.Right/ScaleX+ShiftX;
    RRect.Top = Rect.Top/ScaleY+ShiftY;
    if (this.InRect(RRect)) {
//      Canvas.Pen.Style = this.PenStyle;
      Canvas.strokeStyle = this.PenColor;
      Canvas.lineWidth = this.PenWidth;
//      Canvas.Brush.Style = this.BrushStyle;
      Canvas.fillStyle = this.BrushColor;
      this.ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers);
    }
// DEBUG Corner show begin
    if (this.CornerShow) {
      Canvas.save();
      Canvas.strokeStyle = '#ff0000';
      Canvas.lineWidth = 3;
      Canvas.setLineDash([5, 5]);
      Canvas.beginPath();
      var APoint = [this.FCorner.Left, this.FCorner.Top];
      var P1 = [(APoint[0]-ShiftX)*ScaleX, Rect.Bottom-(APoint[1]-ShiftY)*ScaleY];
      var APoint = [this.FCorner.Right, this.FCorner.Bottom];
      var P2 = [(APoint[0]-ShiftX)*ScaleX, Rect.Bottom-(APoint[1]-ShiftY)*ScaleY];
      Canvas.rect(P1[0]-10, P1[1]+10, P2[0]-P1[0]+20, P2[1]-P1[1]-20);
      Canvas.stroke();
      Canvas.restore();
    }
// DEBUG Corner show end
}

  InRect(MainRect) {
    var Rect = this.Corner;
    return(!((Rect.Right<MainRect.Left) || (Rect.Bottom<MainRect.Top) || (Rect.Left>MainRect.Right) || (Rect.Top>MainRect.Bottom)));
  }

  PointIn(APoint, AScale) {return(null);}
  PointNearLink(APoint, AScale, LinkPoint, Except) {}

  CalcCorner() {}
  Move(X, Y) {this.CalcCorner();}
  Rotate(X, Y, Angle) {this.CalcCorner();}
  Mirror(X1, Y1, X2, Y2) {this.CalcCorner();}

  LoadFromStream(Stream) {
    this.FName = Stream.ReadString();
    this.FVisible = Stream.ReadBoolean();

    this.FPenStyle = Stream.ReadByte();
    this.FPenStyleSet = Stream.ReadBoolean();
    this.FPenColor = TColorToString(Stream.ReadDWord());
    this.FPenColorSet = Stream.ReadBoolean();
    this.FPenWidth = Stream.ReadDWord();
    this.FPenWidthSet = Stream.ReadBoolean();
    this.FBrushStyle = Stream.ReadByte();
    this.FBrushStyleSet = Stream.ReadBoolean();
    this.FBrushColor = TColorToString(Stream.ReadDWord());
    this.FBrushColorSet = Stream.ReadBoolean();
  }

  SaveToStream(Stream) {
    Stream.WriteString(this.ClassName);
    Stream.WriteString(this.FName);
    Stream.WriteBoolean(this.FVisible);

    Stream.WriteByte(this.FPenStyle);
    Stream.WriteBoolean(this.FPenStyleSet);
    Stream.WriteDWord(StringToTColor(this.FPenColor));
    Stream.WriteBoolean(this.FPenColorSet);
    Stream.WriteDWord(this.FPenWidth);
    Stream.WriteBoolean(this.FPenWidthSet);
    Stream.WriteByte(this.FBrushStyle);
    Stream.WriteBoolean(this.FBrushStyleSet);
    Stream.WriteDWord(StringToTColor(this.FBrushColor));
    Stream.WriteBoolean(this.FBrushColorSet);
  }

  Clone() {
    var Obj = {};
    Obj.__proto__ = this.__proto__;
    for (var key in this) Obj[key] = this[key];
    Obj.FCorner = new TRPCorner();
    for (var key in this.FCorner) Obj.FCorner[key] = this.FCorner[key];
    return(Obj);
  }

//  DoCommand(CommandText) {}

  // properties
  set Properties(value) {for(var key in value) {this[key] = value[key];}}
  get Parent() {return this.FParent;}
  set Parent(value) {
  	if ((this.FParent==null)&&(this.FOwner!=null)) {
  		this.FOwner.Items.push(this);
  		this.FParent = value;
  	}
  }
  get ClassName() {return(this.constructor.name);}
  get Name() {return(this.FName);} set Name(value) {this.FName = value;}
  get LayerName() {return(this.FLayerName);} set LayerName(value) {this.FLayerName = value;}
  get Visible() {return(this.FVisible);} set Visible(value) {this.FVisible=value;}
  get Selected() {return(this.FSelected);} set Selected(value) {this.FSelected=value;}
  get Corner() {return(this.FCorner);}
  get Owner() {return(this.FOwner);}
  get Canvas() {if (typeof this['FCanvas']!=='undefined') return(this.FCanvas); else if (this.FOwner!=null) return(this.FOwner.Canvas);}

  // graphic property
  get PenStyle() {if (this.FPenStyleSet) return(this.FPenStyle); else if (this.FOwner!=null) return(this.FOwner.PenStyle);}
  set PenStyle(value) {this.FPenStyleSet=true; this.FPenStyle=value;}
  get PenStyleSet() {return(this.FPenStyleSet);} set PenStyleSet(value) {this.FPenStyleSet=value;}

  get PenColor() {if (this.FPenColorSet) return(this.FPenColor); else if (this.FOwner!=null) return(this.FOwner.PenColor);}
  set PenColor(value) {this.FPenColorSet=true; this.FPenColor=value;}
  get PenColorSet() {return(this.FPenColorSet);} set PenColorSet(value) {this.FPenColorSet=value;}

  get PenWidth() {if (this.FPenWidthSet) return(this.FPenWidth); else if (this.FOwner!=null) return(this.FOwner.PenWidth);}
  set PenWidth(value) {this.FPenWidthSet=true; this.FPenWidth=value;}
  get PenWidthSet() {return(this.FPenWidthSet);} set PenWidthSet(value) {this.FPenWidthSet=value;}

  get BrushStyle() {if (this.FBrushStyleSet) return(this.FBrushStyle); else if (this.FOwner!=null) return(this.FOwner.BrushStyle);}
  set BrushStyle(value) {this.FBrushStyleSet=true; this.FBrushStyle=value;}
  get BrushStyleSet() {return(this.FBrushStyleSet);} set BrushStyleSet(value) {this.FBrushStyleSet=value;}

  get BrushColor() {if (this.FBrushColorSet) return(this.FBrushColor); else if (this.FOwner!=null) return(this.FOwner.BrushColor);}
  set BrushColor(value) {this.FBrushColorSet=true; this.FBrushColor=value;}
  get BrushColorSet() {return(this.FBrushColorSet);} set BrushColorSet(value) {this.FBrushColorSet=value;}

  // text property
  get Font() {if ((typeof this['FFont']!=='undefined')&&(this['FFont']!='')) return(this.FFont); else if (this.FOwner!=null) return(this.FOwner.Font);}
  set Font(value) {this.FFont=value;}
  get FontSize() {if ((typeof this['FFontSize']!=='undefined')&&(this['FFontSize']!='')) return(this.FFontSize); else if (this.FOwner!=null) return(this.FOwner.FontSize);}
  set FontSize(value) {this.FFontSize=value;}
}

class TRPPolyLine extends TRPItem {
  constructor(AOwner) {
    super(AOwner);
    this.Points = [];
    this.Filled = false;
  }

  // methods
  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    if (this.Points.length==0) return;
//    if (this.Points.length==1) then Canvas.Pixels[Round((FPoints[0].X-ShiftX)*ScaleX), Rect.Bottom-Round((FPoints[0].Y-ShiftY)*ScaleY)]:=Canvas.Pen.Color
//    else begin
      var APoints = [];
      for (var i=0; i<this.Points.length; i++)
        APoints.push([Math.round((this.Points[i][0]-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Points[i][1]-ShiftY)*ScaleY)]);
      Canvas.beginPath();
      Canvas.moveTo(APoints[0][0], APoints[0][1]);
      for(var i=1; i<APoints.length; i++) Canvas.lineTo(APoints[i][0], APoints[i][1]);
      if (this.Filled) Canvas.fill(); else Canvas.stroke();
//    end;
  }

  ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    if (this.Points.length==0) return;
    var APoints = [];
    for (var i=0; i<this.Points.length; i++)
      APoints.push([Math.round((this.Points[i][0]-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Points[i][1]-ShiftY)*ScaleY)]);

    Canvas.lineWidth = 1;
    Canvas.fillStyle = '#A6CAF0';
    Canvas.strokeStyle = '#000000';
    for (var i=0; i<APoints.length; i++) {
      Canvas.fillRect(APoints[i][0]-5, APoints[i][1]-5, 10, 10);
      Canvas.strokeRect(APoints[i][0]-5, APoints[i][1]-5, 10, 10);
    }
  }

  PointIn(APoint, AScale) {
    if (!this.FVisible) return(null);

    var Result = null;
    var i, j;
    var X1, Y1, X2, Y2, XP1, YP1, XP2, YP2, a, b, c, x, y, h, Xh;
    var XPItem;
    var XP = [];
    var APointOut;

    if (this.Filled) {
      for (i=0; i<this.Points.length-1; i++) {
        if (((this.Points[i][1]>=APoint[1]) && (this.Points[i+1][1]<APoint[1])) ||
           ((this.Points[i][1]<=APoint[1]) && (this.Points[i+1][1]>APoint[1]))) {
          X1 = this.Points[i][0]-APoint[0];
          Y1 = this.Points[i][1]-APoint[1];
          X2 = this.Points[i+1][0]-APoint[0];
          Y2 = this.Points[i+1][1]-APoint[1];
          if (Y2-Y1!=0) {
            XPItem = (X1-X2)/(Y2-Y1)*Y2+X2+APoint[0];
            for (j=0; j<XP.length; j++) if (XPItem<XP[j]) break;
            XP.splice(j, 0, XPItem);
          }
        }
      }
      for (i=0; i<XP.length-1; i++) {
        if ((APoint[0]>XP[i]) && (APoint[0]<XP[i+1])) if (1-(i%2)) Result = this;
      }
    } else {
      for (i=0; i<this.Points.length-1; i++) {
        APointOut = false;
        X1 = this.Points[i][0];
        Y1 = this.Points[i][1];
        X2 = this.Points[i+1][0];
        Y2 = this.Points[i+1][1];
        if (X1>X2) {x=X1; y=Y1; X1=X2; Y1=Y2; X2=x; Y2=y;}

        if (X2==X1) {
          h = Math.abs(APoint[0]-X1);
          if (Y1>Y2) {x=X1; y=Y1; X1=X2; Y1=Y2; X2=x; Y2=y;}
          if ((APoint[1]<Y1) || (APoint[1]>Y2)) APointOut = true;
        } else
        if (Y2==Y1) {
          h = Math.abs(APoint[1]-Y1);
          if ((APoint[0]<X1) || (APoint[0]>X2)) APointOut = true;
        } else {
          XP1 = APoint[0];
          YP1 = (XP1-X1)*(Y2-Y1)/(X2-X1)+Y1;
          YP2 = APoint[1];
          XP2 = (YP2-Y1)*(X2-X1)/(Y2-Y1)+X1;
          a = Math.abs(APoint[1]-YP1);
          b = Math.abs(APoint[0]-XP2);
          c = Math.sqrt(Math.pow(XP2-XP1, 2)+Math.pow(YP2-YP1, 2));
          if ((c==0) || (a==0) || (b==0)) {
            h = 0;
            if ((APoint[0]<X1) || (APoint[0]>X2)) APointOut = true;
          } else {
            x = (Math.pow(b, 2)-Math.pow(a, 2)+Math.pow(c, 2))/(2*c);
            h = Math.sqrt(Math.pow(b, 2)-Math.pow(x, 2));
            Xh = XP1+(Math.pow(h, 2)-Math.pow(x, 2)+Math.pow(b, 2))/(2*b)*Math.sign(XP2-XP1);
            if (((Xh<X1) && (Xh<X2)) || ((Xh>X1) && (Xh>X2))) APointOut = true;
          }
        }
        if (APointOut) {
          x = Math.sqrt(Math.pow(X1-APoint[0], 2)+Math.pow(Y1-APoint[1], 2));
          y = Math.sqrt(Math.pow(X2-APoint[0], 2)+Math.pow(Y2-APoint[1], 2));
          if (x<y) h = x; else h = y;
        }
        if (h<=(3/AScale)) Result = this;
      }
    }
    return(Result);
  }

  PointNearLink(APoint, AScale, LinkPoint, Except) {
    var Result = false;
    var mindist = LinkSensetive/AScale;
    var dist = 0;
    for (var i=0; i<this.Points.length; i++) {
      dist = Math.sqrt(Math.pow(APoint[0]-this.Points[i][0], 2)+Math.pow(APoint[1]-this.Points[i][1], 2));
      if (dist<=mindist) {
        if (Except==this.Points[i]); else {
          LinkPoint[0] = this.Points[i][0];
          LinkPoint[1] = this.Points[i][1];
          Result = true;
        }
      }
    }
    return(Result);
  }

  Move(X, Y) {
    if (this.Points.length==0) return;
    for (var i=0; i<this.Points.length; i++) {
      this.Points[i][0]+=X;
      this.Points[i][1]+=Y;
    }
    super.Move(X, Y);
  }

  Rotate(X, Y, Angle) {
    if (this.Points.length==0) return;
    for (var i=0; i<this.Points.length; i++)
      this.Points[i] = RotatePoint(this.Points[i], [X, Y], Angle);
    super.Rotate(X, Y, Angle);
  }

  Mirror(X1, Y1, X2, Y2) {
    for (var i=0; i<this.Points.length; i++) {
      if (X2==X1) this.Points[i][0] = X2 + X2 - this.Points[i][0];
      if (Y2==Y1) this.Points[i][1] = Y2 + Y2 - this.Points[i][1];
    }
    super.Mirror(X1, Y1, X2, Y2);
  }

  LoadFromStream(Stream) {
    super.LoadFromStream(Stream);
    var d = Stream.ReadDWord();
    for (var i=0; i<d; i++) this.Points.push([Stream.ReadFloat(), Stream.ReadFloat()]);
    this.FCorner.Left = Stream.ReadFloat();
    this.FCorner.Top = Stream.ReadFloat();
    this.FCorner.Right = Stream.ReadFloat();
    this.FCorner.Bottom = Stream.ReadFloat();
    this.Filled = Stream.ReadBoolean();
  }

  SaveToStream(Stream) {
    super.SaveToStream(Stream);
    Stream.WriteDWord(this.Points.length);
    for (var i=0; i<this.Points.length; i++) {
      Stream.WriteFloat(this.Points[i][0]);
      Stream.WriteFloat(this.Points[i][1]);
    }
    Stream.WriteFloat(this.FCorner.Left);
    Stream.WriteFloat(this.FCorner.Top);
    Stream.WriteFloat(this.FCorner.Right);
    Stream.WriteFloat(this.FCorner.Bottom);
    Stream.WriteBoolean(this.Filled);
  }

  Clone() {
    var Obj = super.Clone();
    Obj.Points = [];
    for (var i=0; i<this.Points.length; i++) Obj.Points.push([this.Points[i][0], this.Points[i][1]]);
    return(Obj);
  }

//  function DoCommand(CommandText: string): string; override;
  AddPoint(X, Y) {
    this.Points.push([X, Y]);
    this.CalcCorner();
    return(this.Points.length-1);
  }
  DeletePoint(num) {
    this.Points.splice(num, 1);
    this.CalcCorner();
  }

  CalcCorner() {
    this.FCorner.Reset();
    for (var i=0; i<this.Points.length; i++) this.FCorner.AddPoint(this.Points[i]);
  }
  Square() {
    var s = 0;
    for (var i=0; i<this.Points.length-1; i++)
      s+=(this.Points[i+1][0]-this.Points[i][0])*(this.Points[i+1][1]+this.Points[i][1])/2;
    return(s);
  }
  MassCenter() {
    var off = this.Points[0];
    var twicearea = 0, x = 0, y = 0, p1, p2, f;
    for (var i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++) {
        p1 = this.Points[i];
        p2 = this.Points[j];
        f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
        twicearea += f;
        x += (p1[0] + p2[0] - 2 * off[0]) * f;
        y += (p1[1] + p2[1] - 2 * off[1]) * f;
    }
    f = twicearea * 3;
    return [x / f + off[0], y / f + off[1]];
  }

  // properties
  get PointCount() {return(this.Points.length);}
}

class TRPText extends TRPItem {
  constructor(AOwner) {
  	super(AOwner);
  	this.X = 0;
  	this.Y = 0;
  	this.FAngle = 0;
  	this.FText = '';
  	this.FHeight = 0;
  	this.FWidth = 0;
  }
  // methods
  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    Canvas.font = (this.Height*ScaleY).toString(10)+'px '+this.Font;
    if (this.FAngle!=0) {
      Canvas.save();
      Canvas.translate(Math.round((this.X-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Y-ShiftY)*ScaleY));
      Canvas.rotate(this.FAngle*Math.PI/180);
      Canvas.fillText(this.Text, 0, 0);
      Canvas.restore();
    }
    else Canvas.fillText(this.Text, Math.round((this.X-ShiftX)*ScaleX), Math.round(Rect.Bottom-(this.Y-ShiftY)*ScaleY));
  }

  Move(X, Y) {
    this.X+=X;
    this.Y+=Y;
    super.Move(X, Y);
  }

  Rotate(X, Y, Angle) {
    var P = RotatePoint([this.X, this.Y], [X, Y], Angle);
    this.X = P[0];
    this.Y = P[1];
    this.Angle+=Angle;
    super.Rotate(X, Y, Angle);
  }

  CalcWidth() {
    var Canvas = this.Canvas;
    Canvas.font = (this.Height).toString(10)+'px '+this.Font;
    this.FWidth = Canvas.measureText(this.Text).width;
    this.CalcCorner();
  }

  CalcCorner() {
    this.FCorner.Reset();
    if (this.Width==0) return;
    var Points = [[this.X, this.Y], [this.X, this.Y+this.FHeight], [this.X+this.FWidth, this.Y+this.FHeight], [this.X+this.FWidth, this.Y]];
    for (var i=0; i<Points.length; i++) {
      Points[i] = RotatePoint(Points[i], [this.X, this.Y], this.FAngle);
      this.FCorner.AddPoint(Points[i]);
    }
  }

  // properties
  get Angle() {return(this.FAngle);} set Angle(value) {this.FAngle=value;}
  get Text() {return(this.FText);} set Text(value) {this.FText=value; this.CalcWidth();}
  get Height() {return(this.FHeight);} set Height(value) {this.FHeight=value; this.CalcWidth();}
  get Width() {return(this.FWidth);}
}

class TRPBlock extends TRPItem {
  constructor(AOwner) {
    super(AOwner);
    this.Items = [];
  }

  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers) {
    for (var i=0; i<this.Items.length; i++)
      this.Items[i].Show(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers);
  }

  ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers) {
    for (var i=0; i<this.Items.length; i++)
      this.Items[i].ShowSelectedInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY, Layers);
  }

  PointIn(APoint, AScale) {
//    var Result = false;
//    for (var i=0; i<this.Items.length; i++)
//      if (this.Items[i].PointIn(APoint, AScale)) {Result = true; break;}
//    return(Result);
    if (!this.FVisible) return(null);
    var Result = null;
    for (var i=this.Items.length-1; i>=0; i--) {
      Result = this.Items[i].PointIn(APoint, AScale);
      if (Result!=null) break;
    }
    return(Result);
  }

  PointNearLink(APoint, AScale, LinkPoint, Except) {
    var Result = false;
    var mindist = LinkSensetive/AScale;
    var dist = 0;
    var LinkPoint2 = [0, 0];
    for (var i=0; i<this.Items.length; i++) {
      if (this.Items[i].PointNearLink(APoint, AScale, LinkPoint2, Except)) {
        dist = Math.sqrt(Math.pow(APoint[0]-LinkPoint2[0], 2)+Math.pow(APoint[1]-LinkPoint2[1], 2));
        if (dist<=mindist) {
          LinkPoint[0] = LinkPoint2[0];
          LinkPoint[1] = LinkPoint2[1];
          Result = true;
        }
      }
    }
    return(Result);
  }

  LoadFromStream(Stream) {
    super.LoadFromStream(Stream);
    var d = Stream.ReadDWord();
    var b=0;
    var Item=null;
    for (var i=0; i<d; i++) {
      eval('Item = new '+Stream.ReadString()+'(this);');
      this.AddItem(Item);
      Item.LoadFromStream(Stream);
    }
  }

  SaveToStream(Stream) {
    super.SaveToStream(Stream);
    Stream.WriteDWord(this.Items.length);
    for (var i=0; i<this.Items.length; i++) this.Items[i].SaveToStream(Stream);
  }

  Clone() {
    var Obj = super.Clone();
    var SubObj = null;
    Obj.Items = [];
    for (var i=0; i<this.Items.length; i++) {
      SubObj = this.Items[i].Clone();
      SubObj.FOwner = Obj;
      Obj.Items.push(SubObj);
    }
    return(Obj);
  }

  AddItem(AItem) {this.Items.push(AItem); return(this.ItemsCount-1);}
  InsertItem(AItem, num) {this.Items.splice(num, 0, AItem);}
  DeleteItem(num) {this.Items.splice(num, 1);}

  LoadFromDXF(str) {
    var s1, s2, SaveX;
    var Item = null;
    var ENTITIES = false;
    var POLYLINE = false;
    var VERTEX = false;
    var POLYLINE_70 = ''; // closed polyline
//    var POLYLINE_62 = '';
    var list = str.split('\r\n');

    for (var i=0; i<list.length; i++) {
      s1 = list[i];
      i++;
      s2 = list[i];
      if ((s1=='  2')&&(s2=='ENTITIES')) ENTITIES = true;
      if (ENTITIES) {
        if (s1=='  0') {
          if (s2!='VERTEX') {
            if (POLYLINE_70=='     1') if (Item!=null) if (Item.PointCount>0) Item.AddPoint(Item.Points[0][0], Item.Points[0][1]);
//            if (POLYLINE_62!='') if (Item!=null) Item.PenColor = Color8BitTo24Bit(parseInt(POLYLINE_62));
//            if (POLYLINE_70=='     1') if (Item!=null) if (Item.PointCount>0) Item.AddPoint(Item.Points[0][0], Item.Points[0][1]);
            POLYLINE = false;
            POLYLINE_70 = '';
//            POLYLINE_62 = '';
          }
          if ((s2=='LWPOLYLINE')||(s2=='POLYLINE')||(s2=='LINE')) {
            Item = new TRPPolyLine(this);
            this.AddItem(Item);
            POLYLINE = true;
          }
          if (s2=='VERTEX') {
            if ((POLYLINE)&&(!VERTEX)) Item.Points = [];
            VERTEX = true;
          }
          if (s2=='SEQEND') {
            POLYLINE = false;
            VERTEX = false;
          }
          if (s2=='ENDSEC') break;
        }
        if (POLYLINE) {
          if ((s1==' 10')||(s1==' 11')) SaveX = parseFloat(s2);
          if ((s1==' 20')||(s1==' 21')) Item.AddPoint(SaveX, parseFloat(s2));
          if (s1==' 70') POLYLINE_70 = s2;
          if (s1=='  8') Item.LayerName = s2;
//          if (s1==' 62') POLYLINE_62 = s2;
        }
      }
    }
  }

  Clear() {this.Items = [];}

  Move(X, Y) {for (var i=0; i<this.Items.length; i++) this.Items[i].Move(X, Y);}
  Rotate(X, Y, Angle) {for (var i=0; i<this.Items.length; i++) this.Items[i].Rotate(X, Y, Angle);}
  Mirror(X1, Y1, X2, Y2) {for (var i=0; i<this.Items.length; i++) this.Items[i].Mirror(X1, Y1, X2, Y2);}

  CalcCorner() {for (var i=0; i<this.Items.length; i++) this.Items[i].CalcCorner();}
  // properties
  get Corner() {
    this.FCorner.Reset();
    for (var i=0; i<this.Items.length; i++) this.FCorner.AddCorner(this.Items[i].Corner);
    return(this.FCorner);
  }

  get ItemsCount() {return(this.Items.length);}
}

class TRPMainBlock extends TRPBlock {
  constructor() {
    super(null);
    this.PenColor = '#000000';
    this.PenWidth = 1;
    this.BrushColor = '#FFFFFF';
    this.FOwner = null;
    this.FCanvas = null;
    this.FShiftX = 0;
    this.FShiftY = 0;
    this.FScale = 1;
//    this.FRect = {'Left': Number(0), 'Bottom': Number(ACanvas.height), 'Right': Number(ACanvas.width), 'Top': Number(0)};
    this.MouseMoveX = 0;
    this.MouseMoveY = 0;
  }

  Show(Canvas, Layers) {
    super.Show(Canvas, this.FRect, this.FShiftX, this.FShiftY, this.FScale, this.FScale, Layers);
    for (var i=0; i<this.Items.length; i++)
      if (this.Items[i].FSelected) this.Items[i].ShowSelected(Canvas, this.FRect, this.FShiftX, this.FShiftY, this.FScale, this.FScale);
  }

  AutoSize(k) {
    if (typeof k==='undefined') k=1;
    this.CalcCorner();
    var ACorner = this.Corner;
    this.FScale = (this.FRect.Right-this.FRect.Left)/(ACorner.Right-ACorner.Left)*k;
    var FScale1 = (this.FRect.Bottom-this.FRect.Top)/(ACorner.Bottom-ACorner.Top)*k;
    if (this.FScale>FScale1) this.FScale = FScale1;
    this.FShiftX = ACorner.Left-Math.round(((this.FRect.Right-this.FRect.Left)/this.FScale-(ACorner.Right-ACorner.Left))/2);
    this.FShiftY = ACorner.Top-Math.round(((this.FRect.Bottom-this.FRect.Top)/this.FScale-(ACorner.Bottom-ACorner.Top))/2);
  }

  ScreenToRealConvert(APoint) {
    return([APoint[0]/this.FScale+this.FShiftX, (this.FRect.Bottom-APoint[1])/this.FScale+this.FShiftY]);
  }

  RealToScreenConvert(APoint) {
    return([(APoint[0]-this.FShiftX)*this.FScale, this.FRect.Bottom-(APoint[1]-this.FShiftY)*this.FScale]);
  }

  PointIn(APoint, AScale) {
    if (!this.FVisible) return(null);
    var Result = super.PointIn(APoint, AScale);
    if (Result==null) Result=this;
    return(Result);
  }

  ScreenPointIn(APoint) {
    if (!this.FVisible) return(null);
    var APoint = [APoint[0]/this.FScale+this.FShiftX, (this.FRect.Bottom-APoint[1])/this.FScale+this.FShiftY];
    return(this.PointIn(APoint, this.FScale));
  }

  SelectItemsByPoint(X, Y) {
    var APoint = [X/this.FScale+this.FShiftX, (this.FRect.Bottom-Y)/this.FScale+this.FShiftY];
    for (var i=this.Items.length-1; i>=0; i--)
      if (this.Items[i].FVisible)
        if (this.Items[i].PointIn(APoint, this.FScale)) this.Items[i].FSelected = true;
  }

  ClearSelectedItems() {
    for (var i=0; i<this.Items.length; i++)
      if (this.Items[i].FSelected) this.Items[i].FSelected = false;
  }

  DeleteSelectedItems() {
    for (var i=0; i<this.Items.length;)
      if (this.Items[i].FSelected) this.DeleteItem(i); else i++;
  }

//  procedure SelectedItemsToBlock;
//  SelectedBlocksUnlink

  ScaleFromScreenPoint(APoint, AScale) {
    this.FShiftX = APoint[0]/this.FScale+this.FShiftX-(APoint[0]/this.FScale*AScale);
    this.FShiftY = (this.FRect.Bottom-APoint[1])/this.FScale+this.FShiftY-((this.FRect.Bottom-APoint[1])/this.FScale*AScale);
    this.FScale = this.FScale/AScale;
  }

  // properties
  get Scale() {return(this.FScale);} set Scale(value) {this.FScale = value;}
  get ShiftX() {return(this.FShiftX);} set ShiftX(value) {this.FShiftX = value;}
  get ShiftY() {return(this.FShiftY);} set ShiftY(value) {this.FShiftY = value;}
  get Rect() {return(this.FRect);}
}

class TMemoryStream {
  constructor(buffer) {
    this.Position = 0;
    this.DataView = new DataView(buffer);
    this.FSize = this.DataView.byteLength;
  }

  Read(len, funcname) {this.Position+=len; return(this.DataView[funcname](this.Position-len, true));}
  ReadBoolean() {return(Boolean(this.Read(1, 'getUint8')));}
  ReadByte() {return(this.Read(1, 'getUint8'));}
  ReadWord() {return(this.Read(2, 'getUint16'));}
  ReadDWord() {return(this.Read(4, 'getUint32'));}
  ReadFloat() {return(this.Read(8, 'getFloat64'));}
  ReadString() {
    var len = this.ReadWord();    
    var Result = '';
    for (var i=0; i<len; i++)
      Result+=String.fromCharCode(this.DataView.getUint16(this.Position+i*2, false));
    this.Position+=len*2;
    return(Result);
  }

  Write(value, len, funcname) {
  	if (this.Position+len > this.FSize) this.Size = this.Position+len;
  	this.DataView[funcname](this.Position, value, true);
  	this.Position+=len;
  }
  WriteBoolean(value) {this.Write(value, 1, 'setUint8');}
  WriteByte(value) {this.Write(value, 1, 'setUint8');}
  WriteWord(value) {this.Write(value, 2, 'setUint16');}
  WriteDWord(value) {this.Write(value, 4, 'setUint32');}
  WriteFloat(value) {this.Write(value, 8, 'setFloat64');}
  WriteString(value) {
    this.WriteWord(value.length);
    var len = value.length*2;
  	if (this.Position+len > this.FSize) this.Size = this.Position+len;
    for (var i=0; i<value.length; i++) this.DataView.setUint16(this.Position+i*2, value.charCodeAt(i));
  	this.Position+=len;
  }

  get Size() {return(this.FSize);}
  set Size(value) {
    if (value>this.DataView.buffer.byteLength) {
      var newbuffer = new ArrayBuffer(((value>>10)+1)<<10);
      new Uint8Array(newbuffer).set(new Uint8Array(this.DataView.buffer));
      this.DataView = null;
      this.DataView = new DataView(newbuffer);
    }
    this.FSize = value;
  }
  get Memory() {return(this.DataView.buffer.slice(0, this.Size));}
}

class TRPEquipment extends TRPBlock {
  constructor(AOwner) {
    super(AOwner);
    this.FFire = false;
    this.GroupNames = '';
  }
  ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY) {
    if (this.FFire) Canvas.globalAlpha = 0.4;
    super.ShowInternal(Canvas, Rect, ShiftX, ShiftY, ScaleX, ScaleY);
    Canvas.globalAlpha = 1;
  }
  get Fire() {return(this.FFire);} set Fire(value) {this.FFire = value;}
}