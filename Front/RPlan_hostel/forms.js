function SetGlobal() {
  window.print_r = function(o) {var out = ''; for (var p in o) {out += p + ': ' + o[p] + '\n';} alert(out);}
  window.isLetter = function(c) {return c.toLowerCase() != c.toUpperCase();}
  window.download = function(content, filename, contentType) {
    if(!contentType) contentType = 'application/octet-stream';
    var blob = new Blob([content], {'type':contentType});
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    a.style.position = 'absolute';
    document.body.appendChild(a);
    a.click();
    // for Mozilla
    setTimeout(function(){document.body.removeChild(a); window.URL.revokeObjectURL(a.href);}, 100);
  }
  window.StatusTitle = '';
  window.SaveGUIItem = null;
  window.clickTimer = null;
  window.clickSource = null;

  window.CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, corners) {
    if (typeof corners==='undefined') corners = [1, 1, 1, 1];
    this.moveTo(x + radius * corners[0], y);
    this.lineTo(x + width - radius * corners[1], y);
    if (corners[1]==1) this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius * corners[2]);
    if (corners[2]==1) this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius * corners[3], y + height);
    if (corners[3]==1) this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius * corners[0]);
    if (corners[0]==1) this.quadraticCurveTo(x, y, x + radius, y);
  }
  window.CanvasRenderingContext2D.prototype.fillText_original = window.CanvasRenderingContext2D.prototype.fillText;
  window.CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
    if (maxWidth) {
      if (this.measureText(text).width>maxWidth) {
        var p1=0, p2=text.length-1, pc=p1+Math.floor((p2-p1)/2);
        for (;(p1!=pc)&&(p2!=pc);) {
          if (this.measureText(text.slice(0, pc)).width>maxWidth) p2=pc; else p1=pc;
          pc=p1+Math.floor((p2-p1)/2);
        }
        this.fillText_original(text.slice(0, pc), x, y);
        return;
      }
    }
    this.fillText_original(text, x, y);
  }
  window.CanvasRenderingContext2D.prototype.drawSVG = function (path, x=0, y=0, scale=1) {
    this.save();
    this.beginPath();
    this.translate(x, y);
    this.scale(scale, scale);
    this.fill(path);
    this.stroke(path);
    this.restore();
  }
  window.CanvasRenderingContext2D.prototype.translate_original = window.CanvasRenderingContext2D.prototype.translate;
  window.CanvasRenderingContext2D.prototype.translate = function(x, y) {
    this.translate_original(Math.round(x), Math.round(y));
  }
  window.CanvasRenderingContext2D.prototype.moveTo_original = window.CanvasRenderingContext2D.prototype.moveTo;
  window.CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
    this.moveTo_original(Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5);
  }
  window.CanvasRenderingContext2D.prototype.lineTo_original = window.CanvasRenderingContext2D.prototype.lineTo;
  window.CanvasRenderingContext2D.prototype.lineTo = function(x, y) {
    this.lineTo_original(Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5);
  }
  window.CanvasRenderingContext2D.prototype.rect_original = window.CanvasRenderingContext2D.prototype.rect;
  window.CanvasRenderingContext2D.prototype.rect = function(x, y, w, h) {
    this.rect_original(Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5, Math.round(w), Math.round(h));
  }
  window.CanvasRenderingContext2D.prototype.fillRect_original = window.CanvasRenderingContext2D.prototype.fillRect;
  window.CanvasRenderingContext2D.prototype.fillRect = function(x, y, w, h) {
    this.fillRect_original(Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5, Math.round(w), Math.round(h));
  }
  window.CanvasRenderingContext2D.prototype.ellipse_original = window.CanvasRenderingContext2D.prototype.ellipse;
  window.CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
    this.ellipse_original(Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5, Math.round(radiusX), Math.round(radiusY), rotation, startAngle, endAngle, anticlockwise);
  }
  window.CanvasRenderingContext2D.prototype.quadraticCurveTo_original = window.CanvasRenderingContext2D.prototype.quadraticCurveTo;
  window.CanvasRenderingContext2D.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
    this.quadraticCurveTo_original(Math.round(cpx-0.5)+0.5, Math.round(cpy-0.5)+0.5, Math.round(x-0.5)+0.5, Math.round(y-0.5)+0.5);
  }

  // property type
  window.prColor = 0;
  window.prEvent = 1;
  window.prInteger = 2;
  window.prString = 3;
  window.prBoolean = 3;
  // system colors http://diversenok.ho.ua/articles/TColor
  window.clActiveBorder = '#B4B4B4';
  window.clActiveCaption = '#99B4D1';
  window.clAppWorkSpace = '#ABABAB';
  window.clBackground = '#000000';
  window.clBtnFace = '#F0F0F0';
  window.clBtnHighlight = '#FFFFFF';
  window.clBtnShadow = '#A0A0A0';
  window.clBtnText = '#000000';
  window.clCaptionText = '#000000';
  window.clGradientActiveCaption = '#B9D1EA';
  window.clGradientInactiveCaption = '#D7E4F2';
  window.clGrayText = '#6D6D6D';
  window.clHighlight = '#3399FF';
  window.clHighlightText = '#FFFFFF';
  window.clHotLight = '#0066CC';
  window.clInactiveBorder = '#F4F7FC';
  window.clInactiveCaption = '#BFCDDB';
  window.clInactiveCaptionText = '#434E54';
  window.clInfoBk = '#FFFFE1';
  window.clInfoText = '#000000';
  window.clMenu = '#F0F0F0';
  window.clMenuBar = '#F0F0F0';
  window.clMenuHighlight = '#3399FF';
  window.clMenuText = '#000000';
  window.clScrollBar = '#C8C8C8';
  window.cl3DDkShadow = '#696969';
  window.cl3DLight = '#E3E3E3';
  window.clWindow = '#FFFFFF';
  window.clWindowFrame = '#646464';
  window.clWindowText = '#000000';
  // form Position
  window.poDesigned = 0;
  window.poScreenCenter = 4;
  // form BorderStyle
  window.bsSizeable = 2;
  window.bsDialog = 3;
  // control align
  window.alNone = 0;
  window.alTop = 1;
  window.alBottom = 2;
  window.alLeft = 3;
  window.alRight = 4;
  window.alClient = 5;
  // form style
  window.fsNormal = 2;
  window.fsStayOnTop = 3;
}
SetGlobal();

class TControl {
  constructor(AOwner) {
    this.FOwner = AOwner;
 	  if (this.FOwner!=null) this.FOwner.InsertComponent(this);
   	this.FComponents = [];
  	this.FControls = [];
  	this.FName = '';
   	this.FCaption = '';
  	this.FParent = null;
    this.FVisible = true;
    this.FLeft = 0;
    this.FTop = 0;
    this.FWidth = 0;
    this.FHeight = 0;
    this.FShiftX = 0;
    this.FShiftY = 0;
    this.FColor = '';
    this.FTransparent = false;

    this.FFont = '';
    this.FFontSize = '';
    this.FFontColor = '';

    this.Anchors = {Left: true, Top: true, Right: false, Bottom: false};
    this.FAlign = alNone;
    this.Tag = 0;
    this.Object = null;
    this.Cursor = '';
    this.FShowRequire = true;

    if (this.FOwner!=null)
      for (var j=1; ; j++) {
        var s = this.ClassName+j.toString(10);
        for (var i=0; i<this.FOwner.FComponents.length; i++) if (this.FOwner.FComponents[i].Name==s.slice(1)) break;
        if (i==this.FOwner.FComponents.length) {this.Name=s.slice(1); break;}
      }
//    this.RegisterClass();
  }
/*  RegisterClass() {
    var cl = this;
    for (; cl.__proto__!=null; cl = cl.__proto__)
      if (window.Classes.indexOf(cl.constructor.name)<0) window.Classes.push(cl.constructor.name);
  }*/
  ShowPath(Canvas) {
    Canvas.rect(-this.FShiftX, -this.FShiftY, this.FWidth, this.FHeight);
  }
  Show(Canvas, Clip=true) {
    if (!this.InRect()) return;
    Canvas.save();
    Canvas.translate(this.FLeft+this.FShiftX, this.FTop+this.FShiftY);
    if (Clip) {
      Canvas.beginPath();
      this.ShowPath(Canvas);
      Canvas.closePath();
      Canvas.clip();
    }
    Canvas.fillStyle = this.Color;
    if (!this.FTransparent) Canvas.fill();
    this.Event('Paint', [Canvas]);
//    this.Paint(this, Canvas);

    for (var i=0; i<this.FControls.length; i++)
      if (this.FControls[i].FParent==this)
        if (this.FControls[i].Visible) {
          this.FControls[i].Show(Canvas);
          this.FControls[i].ShowRequire = false;
        }
    this.ShowRequire = false;

    Canvas.restore();
  }
  Paint(Sender, Canvas) {}
  Event(EventName, prop, flag) {
    if (this.Enabled==false) if ((EventName=='Click')||(EventName=='DoubleClick')||(EventName=='MouseDown')||(EventName=='TouchStart')) return;
    if (EventName.slice(0, 2)=='On') EventName=EventName.slice(2);
    if (typeof prop==='undefined') var prop = [];
    prop.splice(0, 0, this);
    if ((typeof flag==='undefined')||(flag==1))
      if (EventName in this) this[EventName].apply(this, prop);
    if ((typeof flag==='undefined')||(flag==2))
      if ('On'+EventName in this) this['On'+EventName].apply(this.FOwner, prop);
  }
  PointIn(APoint) {
    /*if (!this.FVisible) return(null);
    var Result = null;
    if ((this.FLeft<=APoint[0]) && (this.FLeft+this.FWidth>=APoint[0]) && (this.FTop<=APoint[1]) && (this.FTop+this.FHeight>=APoint[1])) Result = this;
    return(Result);*/

    if (!this.FVisible) return(null);
    var Result = null;
    var SAPoint = [APoint[0]-this.FLeft-this.FShiftX, APoint[1]-this.FTop-this.FShiftY];
    if ((this.FLeft<APoint[0]) && (this.FLeft+this.FWidth>APoint[0]) && (this.FTop<APoint[1]) && (this.FTop+this.FHeight>APoint[1])) {
      for (var i=this.FControls.length-1; i>=0; i--) {
        Result = this.FControls[i].PointIn(SAPoint);
        if (Result!=null) break;
      }
      if (Result==null) Result = this;
    }
    return(Result);
  }
  InRect() {
    if (this.FParent==null) return(true);

    var Result1 = true;
    if (this.FOwner!=null) if (this.FOwner.FClipRect!=null) {
      var R = this.FOwner.FClipRect;
      var R2 = [this.ClientOriginLeft-this.FOwner.ClientOriginLeft, this.ClientOriginTop-this.FOwner.ClientOriginTop, this.FWidth, this.FHeight];
      if (R2!=null)
        Result1 = (!((R2[0]>=R[0]+R[2]) || (R2[0]+R2[2]<=R[0]) || (R2[1]>=R[1]+R[3]) || (R2[1]+R2[3]<=R[1])));
    }

    var LP = this.FParent.ClientOriginLeft+this.FParent.ClientLeft;
    var TP = this.FParent.ClientOriginTop+this.FParent.ClientTop;
    var L = this.ClientOriginLeft;
    var T = this.ClientOriginTop;
    var Result2 = (!(
      (L+this.FWidth<LP) || (T+this.FHeight<TP) ||
      (L>LP+this.FParent.ClientWidth) || (T>TP+this.FParent.ClientHeight)
    ));
    return(Result1 && Result2);
  }

  FindControl(AComponent) {
    var PControl = AComponent.FParent;
    for (var i=0; i<PControl.FControls.length; i++) {if (PControl.FControls[i]==AComponent) return(i);}
    return(-1);
  }
  FindComponent(AComponent) {
    for (var i=0; i<this.FComponents.length; i++) {if (this.FComponents[i]==AComponent) return(i);}
    return(-1);
  }
  InsertComponent(AComponent) {this.FComponents.push(AComponent);}
  RemoveComponent(AComponent) {
  	if (AComponent==null) return;
  	var C = this.FindControl(AComponent);
  	if (C>=0) AComponent.FParent.FControls.splice(C, 1);
  	var C = this.FindComponent(AComponent);
    if (C>=0) this.FComponents.splice(C, 1);
    AComponent.Destroy();
    AComponent = null;
  }
  Destroy() {
    for (var i=0; i<this.FControls.length; i++) this.FControls[i].Destroy();
    this.Event('Destroy', [], 2);
  }

  // properties
  get ClassName() {return(this.constructor.name);}
  set Properties(value) {for(var key in value) {this[key] = value[key];}}
  get Owner() {return(this.FOwner);}
  get Parent() {return this.FParent;}
  set Parent(value) {
  	if ((this.FParent==null)&&(this.FOwner!=null)) {
      value.FControls.push(this);
  		this.FParent = value;
  	}
  }

  get Name() {return(this.FName);} set Name(value) {this.FName=value; if (this.FCaption.length==0) this.FCaption=value;}
  get Caption() {return(this.FCaption);} set Caption(value) {if (this.FCaption==value) return; this.FCaption=value; this.ShowRequire=true;}
  get Visible() {return(this.FVisible);} set Visible(value) {
    if (this.FVisible!=value) {
      this.FVisible=value;
      if (this.FVisible) this.ShowRequire = true; else this.FParent.ShowRequire = true;
    }
  }
  get Left() {return(this.FLeft);} set Left(value) {this.FLeft = value; this.Align = this.FAlign;}
  get Top() {return(this.FTop);} set Top(value) {this.FTop = value; this.Align = this.FAlign;}
  get Width() {return(this.FWidth);}
  set Width(value) {
    var sw = this.FWidth;
    this.FWidth = value;
    this.Align = this.FAlign;
    for (var i=0; i<this.FControls.length; i++) {
      if ((!this.FControls[i].Anchors.Left)&&(this.FControls[i].Anchors.Right)) this.FControls[i].Left+=value-sw;
      if ((this.FControls[i].Anchors.Left)&&(this.FControls[i].Anchors.Right)) this.FControls[i].Width+=value-sw;
    }
  }
  get Height() {return(this.FHeight);}
  set Height(value) {
    var sh = this.FHeight;
    this.FHeight = value;
    this.Align = this.FAlign;
    for (var i=0; i<this.FControls.length; i++) {
      if ((!this.FControls[i].Anchors.Top)&&(this.FControls[i].Anchors.Bottom)) this.FControls[i].Top+=value-sh;
      if ((this.FControls[i].Anchors.Top)&&(this.FControls[i].Anchors.Bottom)) this.FControls[i].Height+=value-sh;
    }
  }
//  get Color() {return(this.FColor);} set Color(value) {this.FColor = value;}
  get Color() {if ((typeof this['FColor']!=='undefined')&&(this['FColor']!='')) return(this.FColor); else if (this.FParent!=null) return(this.FParent.Color);}
  set Color(value) {this.FColor = value;}
  get Canvas() {if (typeof this['FCanvas']!=='undefined') return(this.FCanvas); else if (this.FOwner!=null) return(this.FOwner.Canvas);}

  get ClientOriginLeft() {return(this.FLeft+this.ClientLeft+this.FParent.ClientOriginLeft+this.FParent.ClientLeft+this.FParent.FShiftX);}
  get ClientOriginTop() {return(this.FTop+this.ClientTop+this.FParent.ClientOriginTop+this.FParent.ClientTop+this.FParent.FShiftY);}

  get ClientLeft() {return(0);}
  get ClientTop() {return(0);}
  get ClientWidth() {return(this.FWidth);}
  get ClientHeight() {return(this.FHeight);}

  get ClipRect() {
    if ((this.FVisible)&&(this.FShowRequire))
      return([this.ClientOriginLeft-this.FOwner.ClientOriginLeft, this.ClientOriginTop-this.FOwner.ClientOriginTop, this.FWidth, this.FHeight]);
    else return(null);
  }

  get Font() {if ((typeof this['FFont']!=='undefined')&&(this['FFont']!='')) return(this.FFont); else if (this.FParent!=null) return(this.FParent.Font);}
  set Font(value) {this.FFont=value;}
  get FontSize() {if ((typeof this['FFontSize']!=='undefined')&&(this['FFontSize']!='')) return(this.FFontSize); else if (this.FParent!=null) return(this.FParent.FontSize);}
  set FontSize(value) {this.FFontSize=value;}
  get FontColor() {if ((typeof this['FFontColor']!=='undefined')&&(this['FFontColor']!='')) return(this.FFontColor); else if (this.FParent!=null) return(this.FParent.FontColor);}
  set FontColor(value) {this.FFontColor=value;}

  get Align() {return(this.FAlign);}
  set Align(value) {
    if ((this.FAlign==alNone)&&(value==alNone)) return;
    this.FAlign=value;

    if (this.FAlign!=alNone) {
      var Left=[0,0], Top=[0,0], Right=[0,0], Bottom=[0,0], F=0;
      for (var i=0; i<this.FParent.FControls.length; i++) {
        if (this.FParent.FControls[i]==this) F=1;
        if (this.FParent.FControls[i].FAlign==alLeft) Left[F]+=this.FParent.FControls[i].Width+1;
        if (this.FParent.FControls[i].FAlign==alTop) Top[F]+=this.FParent.FControls[i].Height+1;
        if (this.FParent.FControls[i].FAlign==alRight) Right[F]+=this.FParent.FControls[i].Width+1;
        if (this.FParent.FControls[i].FAlign==alBottom) Bottom[F]+=this.FParent.FControls[i].Height+1;
      }
      if (this.FAlign==alTop) this.Properties = {FLeft:0, FTop:Top[0], FWidth:this.FParent.ClientWidth};
      if (this.FAlign==alBottom) this.Properties = {FLeft:0, FTop:this.FParent.ClientHeight-this.Height-Bottom[0], FWidth:this.FParent.ClientWidth};
      if (this.FAlign==alLeft) this.Properties = {FLeft:Left[0], FTop:Top[0]+Top[1], FHeight:this.FParent.ClientHeight-Top[0]-Top[1]-Bottom[0]-Bottom[1]};
      if (this.FAlign==alRight) this.Properties = {FLeft:this.FParent.ClientWidth-this.Width-Right[0], FTop:Top[0]+Top[1], FHeight:this.FParent.ClientHeight-Top[0]-Top[1]-Bottom[0]-Bottom[1]};
      if (this.FAlign==alClient) this.Properties = {FLeft:Left[0]+Left[1], FTop:Top[0]+Top[1], FWidth:this.FParent.ClientWidth-Left[0]-Left[1]-Right[0]-Right[1], FHeight:this.FParent.ClientHeight-Top[0]-Top[1]-Bottom[0]-Bottom[1]};
    }

    if (this.FAlign==alNone) this.Anchors = {Left: true, Top: true, Right: false, Bottom: false}; else
    if (this.FAlign==alTop) this.Anchors = {Left: true, Top: true, Right: true, Bottom: false}; else
    if (this.FAlign==alBottom) this.Anchors = {Left: true, Top: false, Right: true, Bottom: true}; else
    if (this.FAlign==alLeft) this.Anchors = {Left: true, Top: true, Right: false, Bottom: true}; else
    if (this.FAlign==alRight) this.Anchors = {Left: false, Top: true, Right: true, Bottom: true}; else
    if (this.FAlign==alClient) this.Anchors = {Left: true, Top: true, Right: true, Bottom: true};

    for (var i=0; i<this.FControls.length; i++) this.FControls[i].Align = this.FControls[i].FAlign;
  }

  get Transparent() {return(this.FTransparent);}
  set Transparent(value) {if (value!=this.FTransparent) {this.FTransparent=value; this.ShowRequire=true;}}

  get ShowRequire() {return(this.FShowRequire||this.ShowRequireChild);}
  set ShowRequire(value) {this.FShowRequire=value;}
  get ShowRequireChild() {
    var Result = false;
    for (var i=0; i<this.FControls.length; i++) {
      if (this.FControls[i].FVisible) Result = this.FControls[i].ShowRequire;
      if (Result==true) break;
    }
    return(Result);
  }
}

class TLabel extends TControl {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = false;
   	this.FAlign = 'left'; // left, center, right
   	this.FVAlign = 'top'; // top, middle, bottom
  }
  Paint(Sender, Canvas) {
    if (!this.FTransparent) {
      Canvas.rect(0, 0, this.FWidth, this.FHeight);
      Canvas.fill();
    }
    Canvas.font = this.FontSize+'px '+this.Font;
    Canvas.fillStyle = this.FontColor;
    Canvas.textAlign=this.FAlign;
    Canvas.textBaseline=this.FVAlign;
    var x = (this.FAlign=='center')*this.Width/2 + (this.FAlign=='right')*this.Width;
    var y = (this.FVAlign=='middle')*this.Height/2 + (this.FVAlign=='bottom')*this.Height;
    Canvas.fillText(this.Caption, x, y);
  }
  get Align() {return(this.FAlign);} set Align(value) {this.FAlign=value;}
  get VAlign() {return(this.FVAlign);} set VAlign(value) {this.FVAlign=value;}
}

class TButton extends TControl {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = true;
    this.Type = 'rect'; // rect, roundrect, ellipse
    this.Radius = 0;
    this.FDown = false;
   	this.Flat = false;
   	this.FFlated = false;
   	this.GroupIndex = 0;
    this.Image = null;
    this.Layout = 0; // 0 - ImgLeft, 1 - ImgTop
    this.Enabled = true;
  }
  ShowPath(Canvas) {
    if (this.Type=='rect') Canvas.rect(0, 0, this.Width, this.Height);
    if (this.Type=='roundrect') Canvas.roundRect(0, 0, this.Width, this.Height, this.Radius);
    if (this.Type=='ellipse') Canvas.ellipse(this.Width/2, this.Height/2, this.Width/2, this.Height/2, 0, 0, Math.PI*2, true);
  }
  PaintFrame(Canvas) {
    if (!this.Transparent) {
      Canvas.beginPath();
      this.ShowPath(Canvas);
      Canvas.fill();
      Canvas.strokeStyle = clBtnShadow;
      Canvas.stroke();
    }
    if ((this.Down)&&(this.Enabled)) {
      var Grd = Canvas.createLinearGradient(0, 0, 0, this.Height);
      Grd.addColorStop(0, clGradientInactiveCaption);
      Grd.addColorStop(1, clGradientActiveCaption);
      Canvas.fillStyle=Grd;
      Canvas.beginPath();
      this.ShowPath(Canvas);
      Canvas.globalAlpha = 0.8;
      Canvas.fill();
      Canvas.globalAlpha = 1;
    } else
    if ((this.FFlated)&&(this.Enabled)) {
      var Grd = Canvas.createLinearGradient(0, 0, 0, this.Height/2);
      Grd.addColorStop(0, '#FFFFFF');
      Grd.addColorStop(1, clGradientInactiveCaption);
      Canvas.fillStyle=Grd;
      Canvas.beginPath();
      this.ShowPath(Canvas);
      Canvas.globalAlpha = 0.5;
      Canvas.fill();
      Canvas.globalAlpha = 1;
    }
    if ((!this.Flat) || (((this.Flat)&&(this.FFlated)) || (this.Down)) && (this.Enabled)) {
      if (this.Down) Canvas.strokeStyle = clHighlight; else Canvas.strokeStyle = clGradientActiveCaption;
      Canvas.beginPath();
      this.ShowPath(Canvas);
      Canvas.stroke();
    }
  }
  Paint(Sender, Canvas) {
    this.PaintFrame(Canvas);
    var TextLeft = this.Width/2;
    Canvas.textAlign="center";
    if (this.Image!=null) {
      Canvas.drawImage(this.Image, 2, 2, this.Height-4, this.Height-4);
      TextLeft = this.Height;
      Canvas.textAlign="start";
    }

    Canvas.fillStyle = this.FontColor;
    Canvas.font = this.FontSize+'px '+this.Font;
    Canvas.textBaseline="middle";
    Canvas.fillText(this.Caption, TextLeft, this.Height/2);
  }
  get Down() {return(this.FDown);}
  set Down(value) {
    if (this.FDown==value) return;
    if (value)
      for (var i=0; i<this.Parent.FControls.length; i++)
        if (this.GroupIndex==this.Parent.FControls[i].GroupIndex)
          if ('FDown' in this.Parent.FControls[i]) this.Parent.FControls[i].Down = false;
    this.FDown = value;
    if (this.FDown) this.Event('Down', [], 2);
    this.ShowRequire = true;
  }

  get CaptionWidth() {
    var Canvas = this.Canvas;
    Canvas.font = this.FontSize+'px '+this.Font;
    return(Canvas.measureText(this.FCaption).width);
  }
  MouseDown(Sender, e) {Sender.Down = true;}
  MouseMove(Sender, e) {
    if ((e.buttons==0)&&(Sender.Flat)&&(!Sender.FFlated)) {
      Sender.FFlated = true;
      Sender.ShowRequire = true;
    }
  }
  MouseUp(Sender, e) {
    if (Sender.GroupIndex==0) Sender.Down = false;
  }
  MouseOut(Sender, e) {
    if ((Sender.Flat)&&(Sender.FFlated)) {Sender.FFlated = false; Sender.ShowRequire = true;}
    if (Sender.GroupIndex==0) Sender.Down = false;
  }
  TouchStart(Sender, e) {if (e.targetTouches.length==1) Sender.Down = true;}
  TouchEnd(Sender, e) {Sender.MouseUp(Sender, e);}
  TouchOut(Sender, e) {Sender.MouseOut(Sender, e);}
  Click(Sender, e) {
/*
    if (Sender.GroupIndex==0) Sender.Down = false;
    else {
      for (var i=0; i<Sender.Parent.FControls.length; i++)
        if (Sender.GroupIndex==Sender.Parent.FControls[i].GroupIndex) {
          if ((Sender.Parent.FControls[i] instanceof TEdit)&&(Sender.Parent.FControls[i]!=Sender))
            Sender.Parent.FControls[i].Caption = '';
          Sender.Parent.FControls[i].Down = (Sender==Sender.Parent.FControls[i]);
        }
    }
*/
  }
}

class TIcon extends TButton {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = true;
    this.Type = 'roundrect';
    this.Radius = 3;
   	this.Image = null;
  }
  Paint(Sender, Canvas) {
    this.PaintFrame(Canvas);
    var FS = this.FontSize;
    Canvas.fillStyle = this.FontColor;
    Canvas.font = FS+'px '+this.Font;
    Canvas.textAlign="center";
    Canvas.textBaseline="middle";
    if (this.Image!=null) Canvas.drawImage(this.Image, FS/2, FS/2, this.Width-FS, this.Height-FS*2.5);
      else this.Event('DrawImage', [Canvas, this.Width, this.Height], 2);
    Canvas.fillText(this.Caption, this.Width/2, this.Height-FS, this.Width);
  }
}

class TTimer extends TControl {
  constructor(AOwner) {
    super(AOwner);
    this.FInterval = 1000;
    this.TimerId = null;
    this.FEnabled = false;
//    this.Enabled = true;
  }
  Destroy() {
    this.Enabled = false;
    super.Destroy();
  }
  SetIntervalFunc(Sender) {
    return function() {Sender.Event('Timer');}
  }
  get Enabled() {return(this.FEnabled);}
  set Enabled(value) {
    if (this.FEnabled!=value) {
      if (value) this.TimerId = setInterval(this.SetIntervalFunc(this), this.FInterval);
        else if (this.TimerId!=null) clearInterval(this.TimerId);
      this.FEnabled = value;
    }
  }
  get Interval() {return(this.FInterval);}
  set Interval(value) {
    if (this.FInterval!=value) {
      this.FInterval = value;
      if (this.Enabled) {
        this.Enabled = false;
        this.Enabled = true;
      }
    }
  }
}

class TOpenDialog extends TControl {
  constructor(AOwner) {
    super(AOwner);
    this.OnChange = null;
    this.InputDOM = document.createElement("input");
    this.InputDOM.style.display = 'none';
    this.InputDOM.type = 'file';
    this.InputDOM.onchange = this.ChangeFunc(this);
  }
  Execute() {this.InputDOM.click();}
  ChangeFunc(Sender) {
    return function() {if (Sender.OnChange!=null) Sender.OnChange.apply(Sender, [Sender.Owner]);}
  }
  get FileName() {if (this.InputDOM.files.length>0) return(this.InputDOM.files[0]); else return('');}
}

class TPanel extends TControl {}

class TScrollBox2 extends TControl {
  constructor(AOwner) {
    super(AOwner);
    this.BackgroundImage = null;
  }
  Show(Canvas) {
    if (this.BackgroundImage!=null) Canvas.drawImage(this.BackgroundImage, 0, 0, this.FWidth, this.FHeight);
    super.Show(Canvas);
    Canvas.save();
    var SH = this.ScrollHeight;
    if (SH>this.ClientHeight) {
      Canvas.fillStyle = '#888888';
      Canvas.globalAlpha = 0.7;
      Canvas.fillRect(this.Left+this.ClientWidth-8, this.Top+0, 8, this.ClientHeight);
      Canvas.fillStyle = '#ffffff';
      var val = -this.ClientHeight*this.FShiftY/SH;
      Canvas.globalAlpha = 1;
      Canvas.fillRect(this.Left+this.ClientWidth-6, this.Top+val, 4, Math.round(this.ClientHeight*(-this.FShiftY+this.ClientHeight)/SH-val));
    }
    Canvas.restore();
  }

  MouseWheel(Sender, e) {
    if (e.deltaY<0) Sender.ShiftY+=20; else Sender.ShiftY-=20;
  }
  DragDrop(Sender, e, Move, MoveN) {
    Sender.ShiftX-=Math.round((Move[0]-MoveN[0])/Application.ScaleX);
    Sender.ShiftY-=Math.round((Move[1]-MoveN[1])/Application.ScaleY);
  }

  get ShiftX() {return(this.FShiftX);}
  set ShiftX(value) {
    if (value<this.ClientWidth-this.ScrollWidth) value=this.ClientWidth-this.ScrollWidth;
    if (value>0) value=0;
    if (this.FShiftX!=value) {this.FShiftX=value; this.FShowRequire=true;}
  }
  get ShiftY() {return(this.FShiftY);}
  set ShiftY(value) {
    if (value<this.ClientHeight-this.ScrollHeight) value=this.ClientHeight-this.ScrollHeight;
    if (value>0) value=0;
    if (this.FShiftY!=value) {this.FShiftY=value; this.FShowRequire=true;}
  }
  get ScrollWidth() {
    var Result = 0;
    for (var i=0; i<this.FControls.length; i++)
      if (Result<this.FControls[i].Left+this.FControls[i].Width) Result = this.FControls[i].Left+this.FControls[i].Width;
    return(Result);
  }
  get ScrollHeight() {
    var Result = 0;
    for (var i=0; i<this.FControls.length; i++)
      if (Result<this.FControls[i].Top+this.FControls[i].Height) Result = this.FControls[i].Top+this.FControls[i].Height;
    return(Result);
  }
}

class TScrollBox2Auto extends TScrollBox2 {
  constructor(AOwner) {
    super(AOwner);
   	this.FDragDropStartTime = 0;
   	this.FDragDropStartY = 0;
    this.FDragDropTimer = null;
    this.FDragDropDir = 0;
  }
  DragDrop(Sender, e, Move, MoveN) {
    super.DragDrop(Sender, e, Move, MoveN);
    if (this.FDragDropDir * (MoveN[1]-Move[1])<=0) this.DragDropStart(Sender, e, Move, MoveN);
    this.FDragDropDir = MoveN[1]-Move[1];
  }
  DragDropStart(Sender, e, Move, MoveN) {
    clearInterval(this.timerId);
    this.FDragDropStartTime = new Date();
    this.FDragDropStartY = Move[1];
  }
  SetIntervalFunc(Sender) {
    this.timerV = Math.sign(this.timerV)*Math.sqrt(this.timerV*this.timerV*95/100);
    var ShiftYSave = this.ShiftY;
    this.ShiftY+=this.timerV*10;
    if (Math.abs(ShiftYSave-this.ShiftY)<1) clearInterval(this.timerId);
  }
  DragDropEnd(Sender, e, Move, MoveN) {
    var t=new Date();
    t = t.getTime() - Sender.FDragDropStartTime.getTime();
    var px = MoveN[1]-Sender.FDragDropStartY;
    Sender.timerV = px/t;
    Sender.timerId = setInterval(Sender.SetIntervalFunc.bind(this, Sender), 10);
  }
  MouseDown(Sender, e) {clearInterval(this.timerId);}
  TouchStart(Sender, e) {this.MouseDown(Sender, e);}
}

class TStringGrid extends TScrollBox2 {
  constructor(AOwner) {
    super(AOwner);
    this.FRow = 0;
    this.FCol = 0;
    this.FScrollWidth = 0;
    this.FScrollHeight = 0;
    this.FColCount = 5;
    this.FRowCount = 5;
    this.FDefaultColWidth = 64;
    this.FDefaultRowHeight = 24;
    this.FDefaultDrawing = true;
    this.FGridLineWidth = 1;
    this.FColWidths = [];
    this.FRowHeights = [];
    this.FCells = [];

    this.Edit = new TEdit(this);
    this.Edit.Properties = {Parent: this, Left: 0, Top: 0, Width: 150, Height: 30, Visible: false, OnKeyDown: this.KeyDown};
  }
  Paint(Sender, Canvas) {
    var i, j, flag, x, y, w, h;
    Canvas.fillStyle = clBtnShadow;
    y = this.FGridLineWidth;
    for (i=0; i<this.FRowCount; i++) {
      if (i<this.FRowHeights.length) h=this.FRowHeights[i]; else h=this.FDefaultRowHeight;
      x = this.FGridLineWidth;
      for (j=0; j<this.FColCount; j++) {
        if (j<this.FColWidths.length) w=this.FColWidths[i]; else w=this.FDefaultColWidth;
        if ((i==this.Row)&&(j==this.Col)) this.Edit.Properties = {Left: x+1, Top: y+1, Width: w-2, Height: h-2};
        if (this.FDefaultDrawing) flag=1; else flag = 2;
        Canvas.save();
        Canvas.beginPath();
        Canvas.rect(x, y, w, h);
        Canvas.clip();
        this.Event('DrawCell', [Canvas, i, j, [x, y, w, h]], flag);
        Canvas.restore();
        if (i==this.FRowCount-1) Canvas.fillRect(x-this.FGridLineWidth, 0, this.FGridLineWidth, y+h+this.FGridLineWidth);
        x+=w+this.FGridLineWidth;
      }
      Canvas.fillRect(0, y-this.FGridLineWidth, x, this.FGridLineWidth);
      y+=h+this.FGridLineWidth;
    }
    Canvas.fillRect(x-this.FGridLineWidth, 0, this.FGridLineWidth, y);
    Canvas.fillRect(0, y-this.FGridLineWidth, x, this.FGridLineWidth);
    this.FScrollWidth = x;
    this.FScrollHeight = y;

    if (this.Edit.TextCursor!=null) this.Edit.TextCursor.Enabled = true;
    this.Edit.Visible = true;
  }
  DrawCell(Sender, Canvas, Row, Col, Rect) {
    Canvas.textBaseline="middle";
    Canvas.font = this.FontSize+'px '+this.Font;
    Canvas.fillStyle = this.FontColor;
    Canvas.fillText(this.GetCell(Row, Col), Rect[0]+1, Rect[1]+Rect[3]/2);
  }
  GetCell(Row, Col) {
    if ((Row<0)||(Col<0)) return('');
    if (Row<this.FCells.length) if (Col<this.FCells[Row].length) return(this.FCells[Row][Col]);
    return('');
  }
  SetCell(Row, Col, Value) {
    if ((Row<0)||(Col<0)) return;
    if (Row>=this.FCells.length) for (;Row>=this.FCells.length;) this.FCells.push([]);
    if (Col>=this.FCells[Row].length) for (;Col>=this.FCells[Row].length;) this.FCells[Row].push('');
    this.FCells[Row][Col] = Value;
    if ((Row==this.FRow)&&(Col==this.FCol)) this.Edit.Text = Value;
  }
  SetRowCol(Row, Col) {
    this.SetCell(this.FRow, this.FCol, this.Edit.Text);
    this.Event('CellExit', [this.FRow, this.FCol], 2);
    this.FRow = Row;
    this.FCol = Col;
    this.Edit.Text = this.GetCell(this.FRow, this.FCol);
    this.Edit.DoSelectAll();
    Application.ActiveControl = this.Edit;
  }

  get Row() {return(this.FRow);} set Row(value) {this.SetRowCol(value, this.FCol);}
  get Col() {return(this.FCol);} set Col(value) {this.SetRowCol(this.FRow, value);}

  get ScrollHeight() {return(this.FScrollHeight);}
  get ScrollWidth() {return(this.FScrollWidth);}

  KeyDown(Sender, e) {
    if ((e.keyCode==38)&&(!e.ctrlKey)&&(!e.altKey)) if (this.FRow>0) this.Row--;
    if ((e.keyCode==40)&&(!e.ctrlKey)&&(!e.altKey)) if (this.FRow<this.FRowCount-1) this.Row++;
    if ((e.keyCode==13)&&(!e.ctrlKey)&&(!e.altKey)) if (this.FRow<this.FRowCount-1) this.Row++; else this.Row = this.Row;
  }
  MouseDown(Sender, e) {
    var i, j, x, y, w, h;
    var mx = e.pageX-this.ClientOriginLeft;//-this.FShiftX;
    var my = e.pageY-this.ClientOriginTop;//-this.FShiftY;
    var Break = false;
    y = this.FGridLineWidth;
    for (i=0; (i<this.FRowCount)&&(!Break); i++) {
      if (i<this.FRowHeights.length) h=this.FRowHeights[i]; else h=this.FDefaultRowHeight;
      x = this.FGridLineWidth;
      for (j=0; (j<this.FColCount)&&(!Break); j++) {
        if (j<this.FColWidths.length) w=this.FColWidths[i]; else w=this.FDefaultColWidth;
        if ((mx>=x)&&(mx<=x+w)&&(my>=y)&&(my<=y+h)) {this.SetRowCol(i, j); Break = true;}
        x+=w+this.FGridLineWidth;
      }
      y+=h+this.FGridLineWidth;
    }
  }
  TouchStart(Sender, e) {this.MouseDown(Sender, e);}
}

class TMemo extends TScrollBox2Auto {
  constructor(AOwner) {
    super(AOwner);
    this.Lines = [''];
    this.Color = clWindow;
    this.FontColor = clWindowText;
    this.FTextCursor = null;
    this.FCurCol = 0;
    this.CurLine = 0;
    this.SelCol = -1;
    this.SelLine = -1;
    this.HCanvas = null;
  }
  Paint(Sender, Canvas) {
    Canvas.translate(2, 0);
    Canvas.font = this.FontSize+'px '+this.Font;
    Canvas.textBaseline="middle";
    var mi = Math.ceil((-this.FShiftY+this.FHeight)/this.FontSize);
    if (mi>this.Lines.length) mi = this.Lines.length;
    for (var i=Math.floor(-this.FShiftY/this.FontSize); i<mi; i++) this.ShowLine(Canvas, i);
  }
  ShowLine(Canvas, i) {
    var a = this.CalcSelRange();
    var sc=a[0], sl=a[1], ec=a[2], el=a[3];
    if (this.Selected) {
      Canvas.fillStyle = clHighlight;
      if ((i==sl)&&(sl!=el)) Canvas.fillRect(Canvas.measureText(this.Lines[i].slice(0, sc)).width, this.FontSize*i, Canvas.measureText(this.Lines[i].slice(sc)).width, this.FontSize);
      if ((i>sl)&&(i<el)) Canvas.fillRect(0, this.FontSize*i, Canvas.measureText(this.Lines[i]).width, this.FontSize);
      if ((i==el)&&(sl!=el)) Canvas.fillRect(0, this.FontSize*i, Canvas.measureText(this.Lines[i].slice(0, ec)).width, this.FontSize);
      if ((i==sl)&&(sl==el)) Canvas.fillRect(Canvas.measureText(this.Lines[i].slice(0, sc)).width, this.FontSize*i, Canvas.measureText(this.Lines[i].slice(sc, ec)).width, this.FontSize);
    }
    Canvas.fillStyle = this.FontColor;
    Canvas.fillText(this.Lines[i], 0, this.FontSize*(i+0.5));
    this.HCanvas = Canvas;
  }
  SetCurPos(Line, Col) {
    if (!this.HCanvas) return;
    this.HCanvas.save();
    this.HCanvas.font = this.FontSize+'px '+this.Font;
    if (Line<0) Line=0;
    if (Line>=this.Lines.length) Line=this.Lines.length-1;
    if ((Col<0)&&(Line>0)) {Line--; Col=this.Lines[Line].length;}
    if (Col<0) Col=0;
    var i;
    i = (Line+1)*this.FontSize-this.FHeight;
    if (-this.ShiftY<i) this.ShiftY = -i;
    i = Line*this.FontSize;
    if (-this.ShiftY>i) this.ShiftY = -i;
    i = this.HCanvas.measureText(this.Lines[Line].slice(0, Col)).width-this.FWidth+9;
    if (-this.ShiftX<i) this.ShiftX = -i;
    i = this.HCanvas.measureText(this.Lines[Line].slice(0, Col)).width;
    if (-this.ShiftX>i) this.ShiftX = -i;
 
    this.CurLine = Line;
    this.CurCol = Col;
    if (this.TextCursor!=null) this.TextCursor.XY = [i+this.FShiftX+2, this.CurLine*this.FontSize+this.FShiftY];
    this.HCanvas.restore();
  }
  MouseWheel(Sender, e) {
    super.MouseWheel(Sender, e);
//    var i = (this.CurLine+1)*this.FontSize-this.FHeight;
//    if (this.TextCursor!=null) this.TextCursor.XY = [i+this.FShiftX, this.CurLine*this.FontSize+this.FShiftY];
  }
  DragDrop(Sender, e, Move, MoveN) {
    super.DragDrop(Sender, e, Move, MoveN);
  }

  CalcWordLeft() {
    if (this.CurCol==0) return(1);
    for (var i=this.CurCol-1; i>=0; i--) if (isLetter(this.Lines[this.CurLine][i])) break;
    for (; i>=0; i--) if (!isLetter(this.Lines[this.CurLine][i])) break;
    i++;
    return(this.CurCol-i);
  }
  CalcWordRight() {
    var l = this.Lines[this.CurLine].length;
    for (var i=this.CurCol; i<l; i++) if (!isLetter(this.Lines[this.CurLine][i])) break;
    for (; i<l; i++) if (isLetter(this.Lines[this.CurLine][i])) break;
    return(i-this.CurCol);
  }
  CalcSelRange() {
    if (!this.Selected) return([-1, -1, -1, -1]); else
    if ((this.SelLine<this.CurLine)||((this.SelLine==this.CurLine)&&(this.SelCol<this.CurCol)))
      return([this.SelCol, this.SelLine, this.CurCol, this.CurLine]); else
    if ((this.SelLine>this.CurLine)||((this.SelLine==this.CurLine)&&(this.SelCol>this.CurCol)))
      return([this.CurCol, this.CurLine, this.SelCol, this.SelLine]);
  }

  DoRight() {
    if (this.CurCol==this.Lines[this.CurLine].length) {
      if (this.CurLine<this.Lines.length-1) this.SetCurPos(this.CurLine+1, 0);
    } else this.SetCurPos(this.CurLine, this.CurCol+1);
  }
  DoLeft() {this.SetCurPos(this.CurLine, this.CurCol-1);}
  DoUp() {this.SetCurPos(this.CurLine-1, this.FCurCol);}
  DoDown() {this.SetCurPos(this.CurLine+1, this.FCurCol);}
  DoHome() {this.SetCurPos(this.CurLine, 0);}
  DoEnd() {this.SetCurPos(this.CurLine, this.Lines[this.CurLine].length);}
  DoWordLeft() {this.SetCurPos(this.CurLine, this.CurCol-this.CalcWordLeft());}
  DoWordRight() {
    if (this.CurCol==this.Lines[this.CurLine].length)
      if (this.CurLine<this.Lines.length-1) {this.CurLine++; this.CurCol=0;}
    this.SetCurPos(this.CurLine, this.CurCol+this.CalcWordRight());
  }
  DoPageUp() {this.SetCurPos(this.CurLine-Math.floor(this.Height/this.FontSize), this.CurCol);}
  DoPageDown() {this.SetCurPos(this.CurLine+Math.floor(this.Height/this.FontSize), this.CurCol);}
  DoStartDoc() {this.SetCurPos(0, 0);}
  DoEndDoc() {this.SetCurPos(this.Lines.length-1, this.Lines[this.Lines.length-1].length);}
  DoSelectAll() {
    if ((this.Lines==1)&&(this.Lines[0].length==0)) return;
    this.DoHome();
    this.DoEndDoc();
    this.Selected = true;
    this.SelCol = 0;
    this.SelLine = 0;
  }
  DoCopy() {
    if (this.SelLine<0) return;
    var a = this.CalcSelRange();
    var sc=a[0], sl=a[1], ec=a[2], el=a[3];
    if ((sl==el)&&(sc==ec)) return;
    var Data = [];
    for (var i=sl; i<=el; i++) {
      if ((i==sl)&&(sl!=el)) Data.push(this.Lines[i].slice(sc));
      if ((i>sl)&&(i<el)) Data.push(this.Lines[i]);
      if ((i==el)&&(sl!=el)) Data.push(this.Lines[i].slice(0, ec));
      if ((i==sl)&&(sl==el)) Data.push(this.Lines[i].slice(sc, ec));
    }
    Application.BufferType = 'Text';
    Application.BufferData = Data;
  }
  DoPaste() {
    if (Application.BufferType!='Text') return;
    this.DoDeleteSel();
    var Data = Application.BufferData;
    var s = this.Lines[this.CurLine].slice(this.CurCol);
    this.Lines[this.CurLine] = this.Lines[this.CurLine].slice(0, this.CurCol) + Data[0];
    for (var i=1; i<Data.length; i++) this.Lines.splice(this.CurLine+i, 0, Data[i]);
    var l = this.CurLine+Data.length-1;
    this.Lines[l]+=s;

    this.SetCurPos(l, this.Lines[l].length-s.length);
    this.ShowRequire = true;
  }
  DoDeleteSel() {
    if (!this.Selected) {this.SelLine=-1; return;}
    var a = this.CalcSelRange();
    var sc=a[0], sl=a[1], ec=a[2], el=a[3];
    this.Lines[sl] = this.Lines[sl].slice(0, sc) + this.Lines[el].slice(ec);
    if (sl!=el) this.Lines.splice(sl+1, el-sl);
    this.SetCurPos(sl, sc);
    this.SelLine=-1;
    this.ShowRequire = true;
  }
  DoBackSpace(Word) {
    if (this.SelLine>=0) {this.DoDeleteSel(); return;}
    if (this.CurCol>0) {
      var i = 1;
      if (Word) i = this.CalcWordLeft();
      var c = this.CurCol;
      this.Lines[this.CurLine] = this.Lines[this.CurLine].slice(0, this.CurCol-i) + this.Lines[this.CurLine].slice(this.CurCol);
      this.SetCurPos(this.CurLine, c-i);
      this.ShowRequire = true;
    } else if (this.CurLine>0) {
      var i = this.Lines[this.CurLine-1].length;
      this.Lines[this.CurLine-1] = this.Lines[this.CurLine-1] + this.Lines[this.CurLine];
      this.Lines.splice(this.CurLine, 1);
      this.SetCurPos(this.CurLine-1, i);
      this.ShowRequire = true;
    }
  }
  DoEnter() {
    this.DoDeleteSel();
    this.Lines.splice(this.CurLine+1, 0, this.Lines[this.CurLine].slice(this.CurCol));
    this.Lines[this.CurLine] = this.Lines[this.CurLine].slice(0, this.CurCol);
    this.SetCurPos(this.CurLine+1, 0);
    this.ShowRequire = true;
  }
  DoInsertKey(Key) {
    this.DoDeleteSel();
    this.Lines[this.CurLine] = this.Lines[this.CurLine].slice(0, this.CurCol) + Key + this.Lines[this.CurLine].slice(this.CurCol);
    this.SetCurPos(this.CurLine, this.CurCol+1);
    this.ShowRequire = true;
  }

  KeyDown(Sender, e) {
//    if (Sender.TextCursor!=null) {
      var SpecKey = ((e.ctrlKey)||(e.altKey)||(e.shiftKey));
      var CtrlKey = ((e.ctrlKey)&&(!e.altKey)&&(!e.shiftKey));
      var ShiftKey = ((!e.ctrlKey)&&(!e.altKey)&&(e.shiftKey));

      if ((e.keyCode>=33)&&(e.keyCode<=40)&&(e.shiftKey)&&(!e.altKey)) {
        if (!Sender.Selected) {Sender.SelCol=Sender.CurCol; Sender.SelLine=Sender.CurLine;}
        Sender.ShowRequire = true;
      } else
      if ((e.keyCode>=33)&&(e.keyCode<=40)&&(!e.shiftKey)&&(!e.altKey)&&(Sender.Selected)) {
        Sender.Selected = false;
        Sender.ShowRequire = true;
      }

      if ((e.keyCode==38)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoUp(); else
      if ((e.keyCode==40)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoDown(); else
      if ((e.keyCode==37)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoLeft(); else
      if ((e.keyCode==39)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoRight(); else
      if ((e.keyCode==36)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoHome(); else
      if ((e.keyCode==35)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoEnd(); else
      if ((e.keyCode==37)&&(e.ctrlKey)&&(!e.altKey)) Sender.DoWordLeft(); else
      if ((e.keyCode==39)&&(e.ctrlKey)&&(!e.altKey)) Sender.DoWordRight(); else
      if ((e.keyCode==33)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoPageUp(); else
      if ((e.keyCode==34)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoPageDown(); else
      if ((e.keyCode==33)&&(e.ctrlKey)&&(!e.altKey)) Sender.DoStartDoc(); else
      if ((e.keyCode==34)&&(e.ctrlKey)&&(!e.altKey)) Sender.DoEndDoc(); else
      if ((e.keyCode==65)&&(e.ctrlKey)&&(!e.altKey)) {Sender.DoSelectAll(); Sender.ShowRequire = true;} else
//      if ((e.keyCode==67)&&(CtrlKey)) Sender.DoCopy(); else
//      if ((e.keyCode==86)&&(CtrlKey)) Sender.DoPaste(); else
      if ((e.keyCode==8)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoBackSpace(false); else
      if ((e.keyCode==8)&&(CtrlKey)) Sender.DoBackSpace(true); else
      if ((e.keyCode==13)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoEnter(); else
      if ((e.key.length==1)&&(!e.ctrlKey)&&(!e.altKey)) Sender.DoInsertKey(e.key);
//    }
  }
  Enter(Sender, e) {
    var FontSize = Sender.FontSize;
    Sender.TextCursor.Prop = [-10, 0, 0, 0, 
      function(Sender, Canvas) {
        Canvas.save();
        Canvas.globalCompositeOperation='difference';
        Canvas.fillStyle='#ffffff';
        Canvas.fillRect_original(Math.round(Sender.X)-1, Math.round(Sender.Y), 2, FontSize);
        Canvas.restore();
      }
    ];
    Sender.SetCurPos(Sender.CurLine, Sender.CurCol);
  }

  get ShiftX() {return(super.ShiftX);}
  set ShiftX(value) {
    super.ShiftX = value;
  }
  get ShiftY() {return(super.ShiftY);}
  set ShiftY(value) {
    super.ShiftY = value;
    //////////////
    if (!this.HCanvas) return;
    this.HCanvas.save();
    this.HCanvas.font = this.FontSize+'px '+this.Font;
    var i = this.HCanvas.measureText(this.Lines[this.CurLine].slice(0, this.CurCol)).width;
    if (this.TextCursor!=null) this.TextCursor.XY = [i+this.FShiftX+2, this.CurLine*this.FontSize+this.FShiftY];
    this.HCanvas.restore();
    /////////////
  }
  get ScrollWidth() {}
  get ScrollHeight() {return((this.Lines.length)*this.FontSize);}
  get CurCol() {if (this.FCurCol>this.Lines[this.CurLine].length) return(this.Lines[this.CurLine].length); else return(this.FCurCol);}
  set CurCol(value) {this.FCurCol = value;}
  get TextCursor() {return(this.FTextCursor);}
  set TextCursor(value) {
    this.FTextCursor = value;
    if (this.FTextCursor!=null) this.FTextCursor.XY = [this.CurCol, this.CurLine];
  }
  get Selected() {return(!(((this.CurCol==this.SelCol)&&(this.CurLine==this.SelLine))||(this.SelLine==-1)));}
  set Selected(value) {if (!value) this.SelLine=-1;}
}

class TEdit extends TMemo {
  constructor(AOwner) {
    super(AOwner);
  }
  Paint(Sender, Canvas) {
    Canvas.translate(0, (this.Height-this.FontSize)/2);
    super.Paint(Sender, Canvas);
  }
  DoEnter() {}
  DoPaste() {
    if (Application.BufferType!='Text') return;
    var BD = Application.BufferData.slice();
    if (Application.BufferData.length>0) Application.BufferData = [Application.BufferData[0]];
    super.DoPaste();
    Application.BufferData = BD.slice();
  }

  get Text() {return(this.Lines[0]);}
  set Text(value) {this.Lines[0] = value.toString();}
}

class TToolBar extends TScrollBox2 {
  constructor(AOwner) {
    super(AOwner);
    this.ButtonLeft = new TButton(this);
    this.ButtonRight = new TButton(this);
    this.Properties = {Left: 0, Top: 0, Width: this.Owner.FWidth, Height: 45, Color: clBtnFace, Anchors: {Left:true, Top:true, Right:true, Bottom:false}};
    this.ButtonLeft.Properties = {Parent: this, Left: 0, Top: 0, Width: 20, Caption: '<', Flat: true, FontSize: '16', Color: clBtnFace, Click: this.ClickButtonLeft};
    this.ButtonRight.Properties = {Parent: this, Left: 0, Top: 0, Width: 20, Caption: '>', Flat: true, FontSize: '16', Color: clBtnFace, Click: this.ClickButtonRight};
  }
  ClickButtonLeft(Sender, e) {
    Sender.Down = false;
    this.ShiftX+=10;
  }
  ClickButtonRight(Sender, e) {
    Sender.Down = false;
    this.ShiftX-=10;
  }
  Show(Canvas) {
    for (var i=0; i<this.FControls.length; i++) if (this.FControls[i]==this.ButtonLeft) break;
    this.FControls.splice(i, 1);
    this.FControls.splice(this.FControls.length, 0, this.ButtonLeft);
    this.ButtonLeft.Left = -this.ShiftX;
    if (!this.ButtonLeft.Down) this.ButtonLeft.FFlated = true;
    this.ButtonLeft.Visible = (this.ShiftX!=0);

    for (var i=0; i<this.FControls.length; i++) if (this.FControls[i]==this.ButtonRight) break;
    this.FControls.splice(i, 1);
    this.FControls.splice(this.FControls.length, 0, this.ButtonRight);
    this.ButtonRight.Left = this.FWidth-this.ButtonRight.Width-this.ShiftX;
    if (!this.ButtonRight.Down) this.ButtonRight.FFlated = true;
    this.ButtonRight.Visible = (this.FWidth-this.ShiftX!=this.ScrollWidth);

    super.Show(Canvas);
  }
//  get Height() {return(this.Parent.FHeight);}
//  set Height(value) {super.Height = value; this.ButtonLeft.Height=value-1; this.ButtonRight.Height=value-1;}
}

class TStatusBar extends TScrollBox2 {
  constructor(AOwner) {
    super(AOwner);
    this.Properties = {Left: 0, Top: this.Owner.FHeight-19, Width: this.Owner.FWidth, Height: 19, Color: clBtnFace, Anchors: {Left:true, Top:false, Right:true, Bottom:true}};
  }
}

class TFormButton extends TButton {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = true;
    this.Func = 'Close';
  }
  Close(Canvas, x, y, scale) {
    Canvas.moveTo(x-scale, y-scale);
    Canvas.lineTo(x+scale, y+scale);
    Canvas.moveTo(x+scale, y-scale);
    Canvas.lineTo(x-scale, y+scale);
  }
  Maximize(Canvas, x, y, scale) {
    if (this.Parent.Form.Maximize) {
      scale*=4/5;
      Canvas.rect(x-scale-1, y-scale+1, scale*2, scale*2);
      Canvas.moveTo(x-scale+1, y-scale+1);
      Canvas.lineTo(x-scale+1, y-scale-1);
      Canvas.lineTo(x+scale+1, y-scale-1);
      Canvas.lineTo(x+scale+1, y+scale-1);
      Canvas.lineTo(x+scale-1, y+scale-1);
    } else Canvas.rect(x-scale, y-scale, scale*2, scale*2);
  }
  Minimize(Canvas, x, y, scale) {
    Canvas.moveTo(x-scale, y);
    Canvas.lineTo(x+scale, y);
  }
  Paint(Sender, Canvas) {
    Canvas.fillStyle='#E5E5E5';
    Canvas.strokeStyle = '#000000';
    if (this.FFlated) {
      if (this.Func=='Close') {Canvas.strokeStyle = '#ffffff'; Canvas.fillStyle='#E81123';}
      Canvas.beginPath();
      Canvas.rect(0, 0, this.Width, this.Height);
      Canvas.fill();
    } else if (!this.Parent.Form.Active) Canvas.strokeStyle='#666666'; 
    if (this.Func in this) {
      Canvas.beginPath();
      this[this.Func](Canvas, this.Width/2, this.Height/2, 5);
      Canvas.stroke();
    }
  }
  Click(Sender, e) {
    this.FFlated = false;
    this.ShowRequire = true;
  }
}

class TFormContainer extends TPanel {
  constructor(AOwner) {
    super(AOwner);
    this.FTransparent = true;
    this.Parent = AOwner;
    this.Visible = false;
    this.Form = null;
    this.FBorderStyle = bsSizeable;
    this.FHeaderHeight = 22;
    this.FBorderSize = 8;

    this.BorderLeft = new TControl(this);
    this.BorderLeft.Properties = {Parent: this, Cursor: 'e-resize', OnDragDrop: this.BorderLeftDragDrop, Transparent: true};
    this.BorderTop = new TControl(this);
    this.BorderTop.Properties = {Parent: this, Cursor: 'n-resize', OnDragDrop: this.BorderTopDragDrop, Transparent: true};
    this.BorderRight = new TControl(this);
    this.BorderRight.Properties = {Parent: this, Cursor: 'e-resize', OnDragDrop: this.BorderRightDragDrop, Transparent: true};
    this.BorderBottom = new TControl(this);
    this.BorderBottom.Properties = {Parent: this, Cursor: 'n-resize', OnDragDrop: this.BorderBottomDragDrop, Transparent: true};

    this.CornerLeftTop = new TControl(this);
    this.CornerLeftTop.Properties = {Parent: this, Cursor: 'se-resize', OnDragDrop: this.CornerLeftTopDragDrop, Transparent: true};
    this.CornerRightTop = new TControl(this);
    this.CornerRightTop.Properties = {Parent: this, Cursor: 'sw-resize', OnDragDrop: this.CornerRightTopDragDrop, Transparent: true};
    this.CornerRightBottom = new TControl(this);
    this.CornerRightBottom.Properties = {Parent: this, Cursor: 'se-resize', OnDragDrop: this.CornerRightBottomDragDrop, Transparent: true};
    this.CornerLeftBottom = new TControl(this);
    this.CornerLeftBottom.Properties = {Parent: this, Cursor: 'sw-resize', OnDragDrop: this.CornerLeftBottomDragDrop, Transparent: true};

    this.ButtonClose = new TFormButton(this);
    this.ButtonClose.Properties = {Parent: this, Left: 0, Top: 1, Width: 44, Height: this.HeaderHeight+this.FBorderSize-2, Caption: "\u00D7", Font: 'Times New Roman', FontSize: 26, Flat: true, GroupIndex: 1, Func: 'Close', OnClick: this.ButtonCloseClick};
    this.ButtonMaximize = new TFormButton(this);
    this.ButtonMaximize.Properties = {Parent: this, Left: 0, Top: 1, Width: 44, Height: this.HeaderHeight+this.FBorderSize-2, Caption: "\u20DE", Font: 'Times New Roman', FontSize: 14, Flat: true, GroupIndex: 1, Func: 'Maximize', OnClick: this.ButtonMaximizeClick};
//    this.ButtonMinimize = new TFormButton(this);
//    this.ButtonMinimize.Properties = {Parent: this, Left: 0, Top: 1, Width: 44, Height: this.HeaderHeight+this.FBorderSize-2, Caption: "\u2014", Font: 'Times New Roman', FontSize: 10, Flat: true, GroupIndex: 1, Func: 'Minimize', Enabled: false};
  }
  ResetFrame() {
    this.BorderLeft.Properties = {Left: 0, Top: this.FBorderSize, Width: this.FBorderSize, Height: this.FHeight-this.FBorderSize*2};
    this.BorderTop.Properties = {Left: this.FBorderSize, Top: 0, Width: this.FWidth-this.FBorderSize*2, Height: this.FBorderSize};
    this.BorderRight.Properties = {Left: this.FWidth-this.FBorderSize, Top: this.FBorderSize, Width: this.FBorderSize, Height: this.FHeight-this.FBorderSize*2};
    this.BorderBottom.Properties = {Left: this.FBorderSize, Top: this.FHeight-this.FBorderSize, Width: this.FWidth-this.FBorderSize*2, Height: this.FBorderSize};

    this.CornerLeftTop.Properties = {Left: 0, Top: 0, Width: this.FBorderSize, Height: this.FBorderSize};
    this.CornerRightTop.Properties = {Left: this.FWidth-this.FBorderSize, Top: 0, Width: this.FBorderSize, Height: this.FBorderSize};
    this.CornerRightBottom.Properties = {Left: this.FWidth-this.FBorderSize, Top: this.FHeight-this.FBorderSize, Width: this.FBorderSize, Height: this.FBorderSize};
    this.CornerLeftBottom.Properties = {Left: 0, Top: this.FHeight-this.FBorderSize, Width: this.FBorderSize, Height: this.FBorderSize};

    this.ButtonClose.Height = this.HeaderHeight+this.FBorderSize-3;
    this.ButtonMaximize.Height = this.HeaderHeight+this.FBorderSize-3;
//    this.ButtonMinimize.Height = this.HeaderHeight+this.FBorderSize-2;
    this.ButtonClose.Left = this.FWidth-this.FBorderSize-this.ButtonClose.Width-2;
    this.ButtonMaximize.Left = this.ButtonClose.Left-this.ButtonMaximize.Width-2;
//    this.ButtonMinimize.Left = this.ButtonMaximize.Left-this.ButtonMinimize.Width-3;
  }
  Show(Canvas) {super.Show(Canvas, false);}
  Paint(Sender, Canvas) {
    Canvas.beginPath();
    Canvas.fillStyle = '#ffffff';
    Canvas.shadowColor="#000000";
    Canvas.shadowBlur=this.FBorderSize;
    Canvas.fillRect(this.BorderSize+0.5, 0.5, this.Width-this.BorderSize*2-1, this.Height-this.BorderSize-1);
    Canvas.shadowBlur=0;
    Canvas.fillStyle = '#ffffff';
    Canvas.fillRect_original(this.BorderSize, 0, Math.round(this.Width-this.BorderSize*2), Math.round(this.HeaderHeight+this.BorderSize+1));

    var l = this.BorderSize;
    if (this.Form.Icon!=null) {
      l = this.BorderSize*3/2+1;
      Canvas.drawImage(this.Form.Icon, l, (this.BorderSize+this.HeaderHeight)/2-this.HeaderHeight/2+2, this.HeaderHeight-4, this.HeaderHeight-4);
      l+=this.HeaderHeight;
    }
    if (this.Form.Active) Canvas.fillStyle = '#000000'; else Canvas.fillStyle='#666666';
    Canvas.font=(this.HeaderHeight/20*11).toString(10)+'px Arial';
    Canvas.textBaseline="middle";
    Canvas.fillText(this.Form.Caption, l, (this.BorderSize+this.HeaderHeight)/2, this.ButtonMaximize.Left-l);

    this.Form.FShowRequire = true;
    super.Paint(Sender, Canvas);
    this.ShowRequire = false;
  }
  get HeaderHeight() {return(this.FHeaderHeight);}
  get BorderSize() {return(this.FBorderSize);}

  get BorderStyle() {return(this.FBorderStyle);}
  set BorderStyle(value) {
    if (this.FBorderStyle!=value) {
      var v = (value==bsSizeable);
      this.BorderLeft.Visible = v;
      this.BorderTop.Visible = v;
      this.BorderRight.Visible = v;
      this.BorderBottom.Visible = v;
      this.CornerLeftTop.Visible = v;
      this.CornerRightTop.Visible = v;
      this.CornerRightBottom.Visible = v;
      this.CornerLeftBottom.Visible = v;
      this.ButtonMaximize.Visible = v;
      this.FBorderStyle = value;
    }
  }

  Resize(Sender, e) {
    Sender.ResetFrame();
    this.FShowRequire = true;
  }

  DragDrop(Sender, e, Move, MoveN) {
    if (!Sender.Form.Maximize) {
      if (Move[1]-Sender.ClientOriginTop<=Sender.HeaderHeight+Sender.BorderSize) {
        Sender.Left+=MoveN[0]-Move[0];
        Sender.Top+=MoveN[1]-Move[1];
        Sender.ShowRequire = true;
      }
    }
  }
  DoubleClick(Sender, e) {
    Sender.Form.Maximize = !Sender.Form.Maximize;
  }

  BorderLeftDragDrop(Sender, e, Move, MoveN) {
    var i = Sender.Parent.Form.Width;
    Sender.Parent.Form.Width = Sender.Parent.Left+Sender.Parent.Form.Width-MoveN[0];
    if (i!=Sender.Parent.Form.Width) Sender.Parent.Left = MoveN[0];
  }
  BorderTopDragDrop(Sender, e, Move, MoveN) {
    var i = Sender.Parent.Form.Height;
    Sender.Parent.Form.Height = Sender.Parent.Top+Sender.Parent.Form.Height-MoveN[1];
    if (i!=Sender.Parent.Form.Height) Sender.Parent.Top = MoveN[1];
  }
  BorderRightDragDrop(Sender, e, Move, MoveN) {
    Sender.Parent.Form.Width = MoveN[0]-Sender.Parent.FLeft+this.FBorderSize;
  }
  BorderBottomDragDrop(Sender, e, Move, MoveN) {
    Sender.Parent.Form.Height = MoveN[1]-Sender.Parent.FTop+this.FBorderSize;
  }
  CornerLeftTopDragDrop(Sender, e, Move, MoveN) {
    this.BorderLeftDragDrop(Sender, e, Move, MoveN);
    this.BorderTopDragDrop(Sender, e, Move, MoveN);
  }
  CornerRightTopDragDrop(Sender, e, Move, MoveN) {
    this.BorderRightDragDrop(Sender, e, Move, MoveN);
    this.BorderTopDragDrop(Sender, e, Move, MoveN);
  }
  CornerRightBottomDragDrop(Sender, e, Move, MoveN) {
    this.BorderRightDragDrop(Sender, e, Move, MoveN);
    this.BorderBottomDragDrop(Sender, e, Move, MoveN);
  }
  CornerLeftBottomDragDrop(Sender, e, Move, MoveN) {
    this.BorderLeftDragDrop(Sender, e, Move, MoveN);
    this.BorderBottomDragDrop(Sender, e, Move, MoveN);
  }

  ButtonCloseClick(Sender, e) {this.Form.Close();}
  ButtonMaximizeClick(Sender, e) {
    this.Form.Maximize = !this.Form.Maximize;
    Sender.ShowRequire = true;
  }
}

class TForm extends TScrollBox2 {
  constructor(AOwner) {
    var FormContainer = new TFormContainer(AOwner);
    FormContainer.Parent = AOwner;

    super(FormContainer);
    this.Parent = FormContainer;
    this.Parent.Form = this;
    this.FActiveControl = null;
    this.Color = clBtnFace;

    this.Icon = null;
    this.FMaximize = false;
    this.FPosition = poDesigned;
    this.FFormStyle = fsNormal;
    this.SaveSize = null;
    this.FClipRect = null;

    this.HCanvasElement = document.createElement('canvas');
    this.HCanvas = this.HCanvasElement.getContext('2d');
    this.HCanvas.ImageSmoothingEnabled = false;
   	this.BackgroundImage = null;
  }

  Show(Canvas) {
    if (!this.InRect()) return;

    var ShowAll = false;
    //var ShowAll = true;

    if ((this.HCanvasElement.width!=this.FWidth*Application.ScaleX/Viewport) || (this.HCanvasElement.height!=this.FHeight*Application.ScaleY/Viewport) ||
        (this.HCanvasElement.style.width!=this.FWidth*Application.ScaleX+'px') || (this.HCanvasElement.style.height!=this.FHeight*Application.ScaleY+'px')) {
      this.HCanvasElement.width = this.FWidth*Application.ScaleX/Viewport;
      this.HCanvasElement.height = this.FHeight*Application.ScaleY/Viewport;
      this.HCanvasElement.style.width = this.FWidth*Application.ScaleX+'px';
      this.HCanvasElement.style.height = this.FHeight*Application.ScaleY+'px';
      this.FShowRequire = true;
      ShowAll = true;
    }

    var R = null;
//    if (this.FShowRequire) 
      R=[0, 0, this.FWidth, this.FHeight];
    if ((this.ShowRequireChild)||(ShowAll)) {
      this.HCanvas.font = this.FontSize+'px '+this.Font;
      this.HCanvas.save();
      this.HCanvas.scale(Application.ScaleX/Viewport, Application.ScaleY/Viewport);
      this.HCanvas.fillStyle = this.FColor;
/////////////////////
/*
      if (R==null) {
        var R2=[], RN=[];
        for (var i=0; i<this.FComponents.length; i++)
          if (this.FComponents[i].FShowRequire)
            if (R==null) R = this.FComponents[i].ClipRect;
            else {
              R2 = this.FComponents[i].ClipRect;
              if (R2!=null) {
                if (R2[0]<R[0]) RN[0]=R2[0]; else RN[0]=R[0];
                if (R2[1]<R[1]) RN[1]=R2[1]; else RN[1]=R[1];
                if (R2[0]+R2[2]>R[0]+R[2]) RN[2]=R2[0]+R2[2]-RN[0]; else RN[2]=R[0]+R[2]-RN[0];
                if (R2[1]+R2[3]>R[1]+R[3]) RN[3]=R2[1]+R2[3]-RN[1]; else RN[3]=R[1]+R[3]-RN[1];
                for (var j=0; j<4; j++) R[j] = RN[j];
              }
            }
      }
*/
/////////////////////
      this.HCanvas.beginPath();
      this.HCanvas.rect(R[0], R[1], R[2], R[3]);
      this.HCanvas.clip();
      this.FClipRect = R;

      if (this.BackgroundImage==null) this.HCanvas.fillRect(0, 0, this.FWidth, this.FHeight);
        else this.HCanvas.drawImage(this.BackgroundImage, 0, 0, this.FWidth, this.FHeight);

      this.HCanvas.translate(this.FShiftX, this.FShiftY);
      this.Event('Paint', [this.HCanvas]);
      for (var i=0; i<this.FControls.length; i++) {
        if (this.FControls[i].Visible) this.FControls[i].Show(this.HCanvas);
        this.FControls[i].ShowRequire = false;
      }
/*
      this.HCanvas.beginPath();
      this.HCanvas.lineWidth = 3;
      this.HCanvas.strokeStyle = '#'+(Math.floor(Math.random()*16)).toString(16)+(Math.floor(Math.random()*16)).toString(16)+(Math.floor(Math.random()*16)).toString(16);
      this.HCanvas.rect(R[0]+3, R[1]+3, R[2]-6, R[3]-6);
      this.HCanvas.stroke();
*/
      this.FClipRect = null;
      this.HCanvas.restore();
    }

    Canvas.save();
    Canvas.scale(1/Application.ScaleX*Viewport, 1/Application.ScaleY*Viewport);
    Canvas.drawImage(this.HCanvasElement, this.FLeft*Application.ScaleX/Viewport, this.FTop*Application.ScaleY/Viewport);
//    if ((R==null)||(this.FShowRequire)) R=[0, 0, this.FWidth, this.FHeight];
//    Canvas.drawImage(this.HCanvasElement,
//      R[0]*Application.ScaleX/Viewport, R[1]*Application.ScaleY/Viewport, R[2]*Application.ScaleX/Viewport, R[3]*Application.ScaleY/Viewport,
//      (this.FLeft+R[0])*Application.ScaleX/Viewport, (this.FTop+R[1])*Application.ScaleY/Viewport, R[2]*Application.ScaleX/Viewport, R[3]*Application.ScaleY/Viewport
//    );

    Canvas.restore();
    this.ShowRequire = false;
  }
  Event(EventName, prop, flag) {
    if (EventName.slice(0, 2)=='On') EventName=EventName.slice(2);
    if (typeof prop==='undefined') var prop = [];
    prop.splice(0, 0, this);
    if ((typeof flag==='undefined')||(flag==1))
      if (EventName in this) this[EventName].apply(this, prop);
    if ((typeof flag==='undefined')||(flag==2))
      if ('On'+EventName in this) this['On'+EventName].apply(this, prop);
  }
  Close() {this.Parent.Parent.RemoveForm(this.Parent.Form);}
  get Visible() {return(this.Parent.FVisible);}
  set Visible(value) {this.Parent.FVisible=value;}
  get Left() {return(this.Parent.FLeft);}
  set Left(value) {this.FLeft = this.Parent.BorderSize; this.Parent.FLeft = value;}
  get Top() {return(this.Parent.FTop);}
  set Top(value) {this.FTop = this.Parent.HeaderHeight+this.Parent.BorderSize; this.Parent.FTop = value;}
  get Width() {return(this.Parent.FWidth);}
  set Width(value) {
//    if (this.Parent.Width==value) return;
    if (value>Application.Width) value = Application.Width;
    if (value-this.Parent.BorderSize*2>150) {
      this.Parent.Width = value;
      super.Width = this.ClientWidth;
      this.Parent.Resize(this.Parent, null);
      Application.ExecuteEventSub(this, 'Resize', null);
    }
  }
  get Height() {return(this.Parent.FHeight);}
  set Height(value) {
//    if (this.Parent.Height==value) return;
    if (value>Application.Height) value = Application.Height;
    if (value-this.Parent.HeaderHeight-this.Parent.BorderSize*2>150) {
      this.Parent.Height = value;
      super.Height = this.ClientHeight;
      this.Parent.Resize(this.Parent, null);
      Application.ExecuteEventSub(this, 'Resize', null);
    }
  }
  get ClientWidth() {return(this.Parent.FWidth-this.Parent.BorderSize*2);}
  get ClientHeight() {return(this.Parent.FHeight-this.Parent.HeaderHeight-this.Parent.BorderSize*2);}
  get Active() {return(this.Parent.Parent.ActiveForm==this);}
  get Position() {return(this.FPosition);}
  set Position(value) {
    if (value == poScreenCenter) {
      this.Parent.Left = this.Parent.Parent.Width/2 - this.Parent.Width/2;
      this.Parent.Top = this.Parent.Parent.Height/2 - this.Parent.Height/2;
      if (this.Parent.Left<0) this.Parent.Left = 0;
      if (this.Parent.Top<0) this.Parent.Top = 0;
    }
    this.FPosition = value;
  }
  get FormStyle() {return(this.FFormStyle);} set FormStyle(value) {this.FFormStyle = value;}
  get BorderStyle() {return(this.Parent.BorderStyle);}
  set BorderStyle(value) {this.Parent.BorderStyle = value;}
  get Maximize() {return(this.FMaximize);}
  set Maximize(value) {
    this.FMaximize = value;
    this.Parent.FBorderSize = 8*(!this.FMaximize);
    this.Parent.ResetFrame();
    if (this.FMaximize) {
      if ((this.Parent.Width==0)||(this.Parent.Height==0)) 
        this.SaveSize = {Left: 0, Top: 0, Width: Application.Width, Height: Application.Height};
      else this.SaveSize = {Left: this.Parent.Left, Top: this.Parent.Top, Width: this.Parent.Width, Height: this.Parent.Height};
      this.Properties = {Left: 0, Top: 0, Width: Application.Width, Height: Application.Height};
    } else this.Properties = this.SaveSize;
    this.Width=this.Width;
  }
  get ActiveControl() {return(this.FActiveControl);}
  set ActiveControl(value) {
    if (this.FActiveControl==value) return;
    if (this.FActiveControl!=null) {
      this.FActiveControl.Event('Exit');
      this.FActiveControl.TextCursor = null;
    }
    this.FActiveControl = null;
    Application.MainTextCursor.Enabled = false;
    if (value!=null)
      if ('TextCursor' in value) {
        this.FActiveControl = value;
        this.FActiveControl.TextCursor = Application.MainTextCursor;
        this.FActiveControl.Event('Enter');
        Application.MainTextCursor.Enabled = true;
      }
    this.ShowRequire = true;
  }
}

class TTextCursor extends TTimer {
  constructor(AOwner) {
    super(AOwner);
    this.FX = 0;
    this.FY = 0;
    this.Width = 0;
    this.Height = 0;
    this.OnShow = null;
  }
  SetIntervalFunc(Sender) {
    return function() {
      Sender.FVisible = !Sender.FVisible;
      if (Sender.FVisible) Sender.Show(); else
        if (Application.ActiveForm!=null) Application.ActiveForm.ShowRequire = true;
    }
  }
  Show() {
    if (Application.ActiveForm==null) this.Enabled = false; else if (Application.ActiveForm.ActiveControl==null) this.Enabled = false;
    if ((this.FVisible)&&(Application.ActiveForm!=null)) if (Application.ActiveForm.ActiveControl!=null) {
      var Control = Application.ActiveForm.ActiveControl;
      var Canvas = Application.FCanvas;
      Canvas.save();
      Canvas.scale(Application.ScaleX/Viewport, Application.ScaleY/Viewport);
      Canvas.translate(Control.ClientOriginLeft, Control.ClientOriginTop);
      Canvas.rect(0, 0, Control.ClientWidth, Control.ClientHeight);
      Canvas.clip();
      if (this.OnShow!=null) this.OnShow(this, Canvas);
      Canvas.restore();
    }
  }
  Reset() {
    this.Enabled = false;
    this.FVisible = true;
    this.Enabled = true;
//    this.Show();
    if (Application.ActiveForm!=null) Application.ActiveForm.ShowRequire = true;
  }
  get Enabled() {return(this.FEnabled);}
  set Enabled(value) {
    if (value) {
//      Application.HiddenEdit.style.bottom='0px';
      Application.HiddenEdit.style.display = '';
      Application.HiddenEdit.focus();
    } else {
      Application.HiddenEdit.blur();
//      Application.HiddenEdit.style.bottom='-200px';
      Application.HiddenEdit.style.display = 'none';
    }
    this.FVisible = true;
    super.Enabled = value;
  }
  get X() {return(this.FX);}
  set X(value) {this.FX=value; this.Reset();}
  get Y() {return(this.FY);}
  set Y(value) {this.FY=value; this.Reset();}
  set XY(value) {this.FX=value[0]; this.FY=value[1]; this.Reset();}
  set Prop(value) {this.FX=value[0]; this.FY=value[1]; this.Width=value[2]; this.Height=value[3]; this.OnShow=value[4]; this.Reset();}
}

class TApplication extends TPanel {
  constructor(HTMLContainer) {
    super(null);
  	this.Visible = true;
    this.DOMCanvas = null;
    this.FCanvas = null;
    this.BufferCanvasElement = document.createElement('canvas');
    this.BufferCanvas = this.BufferCanvasElement.getContext('2d');
    this.BufferActiveForm = null;

    this.FWidth = 0;
    this.FHeight = 0;

    this.ScaleX = 1;
    this.ScaleY = 1;

    this.DragDropMode = false;
    this.DragDropControl = null;
    this.DragDropSource = null;
    this.DragDropX = 0;
    this.DragDropY = 0;
    this.PinchX = 0;
    this.PinchY = 0;
    this.Touch1 = 0;
    this.Touch2 = 0;
    this.LongClick = {Click: false, StartTime: 0, X: 0, Y: 0, Control: null};

    this.FFont = 'Arial';
    this.FFontSize = 36;
    this.FFontColor = '#000000';

    this.FActiveForm = null;
//    this.FActiveControl = null;

    this.MainTextCursor = null;
    this.Timer = null;
    this.TimerTime = 0;
    this.Showing = false;

    this.BufferType = '';
    this.BufferData = null;

    this.Params = {ShowCounter: 0, time: 0, maxTime: 0, FFCounter: 0, SFCounter: 0};

    this.FBlocking = false;

    this.DOMCanvas = document.createElement('canvas');
    //    this.DOMCanvas.style.position = 'absolute';
    this.FCanvas = this.DOMCanvas.getContext('2d');
    this.FCanvas.ImageSmoothingEnabled = false;
    //document.body.insertAdjacentElement('afterbegin', this.DOMCanvas);
    if (!HTMLContainer) HTMLContainer = document.body;
    HTMLContainer.insertAdjacentElement('beforeend', this.DOMCanvas);
    this.DOMCanvas.width = this.Width/Viewport;
    this.DOMCanvas.height = this.Height/Viewport;
    this.DOMCanvas.style.width = this.Width+'px';
    this.DOMCanvas.style.height = this.Height+'px';

    this.HiddenEdit = document.createElement('textarea');
    this.HiddenEdit.style = 'position:fixed; top:-200px; left:50px; width:200px; height:60px; display:none';
    this.HiddenEdit.value="a\r\na";
    this.HiddenEdit.addEventListener('input', function(e){this.value="a\r\na";});
    this.HiddenEdit.addEventListener('focus', function(e){this.style.top="-200px";});
    HTMLContainer.insertAdjacentElement('beforeend', this.HiddenEdit);

    this.MainTextCursor = new TTextCursor(this);
    this.MainTextCursor.Properties = {Name: 'TextCursor', Interval: 500, FCanvas: this.FCanvas};
//////////////////////////
/*
var DOM = document.createElement('div');
DOM.style.position = 'absolute';
DOM.style.width = '100px';
DOM.style.height = '100px';
DOM.style.color = '#ff0000';
DOM.style.boxShadow = '0px 0px 10px 1px #000000';
DOM.style.backgroundColor = '#99CCFF';
document.getElementsByTagName('body')[0].appendChild(DOM);
this.HCE = document.createElement('canvas');
this.HCE.style.width = '100%';
this.HCE.style.height = '100%';
DOM.appendChild(this.HCE);
*/
/////////////////////////////

  }
  Show() {
    this.Showing = true;
/*time*/this.Params.time = performance.now();
//    this.ScaleX = 1;//window.innerWidth/this.ResGUIX;
//    this.ScaleY = this.ScaleX; //window.innerHeight/this.ResGUIY;
    this.FWidth = this.Width;
    this.FHeight = this.Height;

    if ((this.DOMCanvas.width!=this.Width/Viewport)||(this.DOMCanvas.height!=this.Height/Viewport)) {
      this.DOMCanvas.width = this.Width/Viewport;
      this.DOMCanvas.height = this.Height/Viewport;
      this.DOMCanvas.style.width = this.Width+'px';
      this.DOMCanvas.style.height = this.Height+'px';
      this.FShowRequire = true;
    }

    if (this.FControls.length>0) {
      this.FCanvas.save();
      this.FCanvas.scale(this.ScaleX/Viewport, this.ScaleY/Viewport);

      this.Params.FFCounter = 0;
      this.Params.SFCounter = 0;

///////////////
var ShowRequire = false;
var ShowLastActiveForm = false;
for (var i=0; i<this.FControls.length; i++) if (this.FControls[i].ShowRequire) {ShowRequire = true; break;}
if ((!ShowRequire)&&(this.ActiveForm.Parent==this.FControls[i])&&(!this.ActiveForm.Parent.FShowRequire)&&(this.ActiveForm.ShowRequire)) ShowLastActiveForm = true;
///////////////

if (!ShowLastActiveForm) {

      var ShowRequire = false;
      for (var i=0; i<this.FControls.length; i++) {
        if (this.ActiveForm.Parent==this.FControls[i]) break;
        if (this.FControls[i].ShowRequire) {ShowRequire = true; break;}
      }

      var i=0;
      if ((this.BufferActiveForm!=this.ActiveForm)||ShowRequire) {
        if ((this.BufferCanvasElement.width!=this.Width/Viewport)||(this.BufferCanvasElement.height!=this.Height/Viewport)) {
          this.BufferCanvasElement.width = this.Width/Viewport;
          this.BufferCanvasElement.height = this.Height/Viewport;
          this.BufferCanvasElement.style.width = this.Width+'px';
          this.BufferCanvasElement.style.height = this.Height+'px';
          this.BufferCanvas.scale(this.ScaleX/Viewport, this.ScaleY/Viewport);
        }
        for (; i<this.FControls.length; i++)
          if (this.FControls[i].FParent==this)
            if (this.FControls[i].Visible) {
              if (this.ActiveForm.Parent!=this.FControls[i]) {
                if (this.FControls[i].ShowRequire) this.Params.FFCounter++; else this.Params.SFCounter++;
                this.FControls[i].Show(this.BufferCanvas);
              } else break;
            }
      } else for (; i<this.FControls.length; i++) if (this.ActiveForm.Parent==this.FControls[i]) break;

      this.FCanvas.save();
      this.FCanvas.scale(1/Application.ScaleX*Viewport, 1/Application.ScaleY*Viewport);
      this.FCanvas.drawImage(this.BufferCanvasElement, 0, 0);
      this.FCanvas.restore();

      this.BufferActiveForm = this.ActiveForm;

      for (; i<this.FControls.length; i++)
        if (this.FControls[i].FParent==this)
          if (this.FControls[i].Visible) {
            if (this.FControls[i].ShowRequire) this.Params.FFCounter++; else this.Params.SFCounter++;
            this.FControls[i].Show(this.Canvas);
          }
//////////////
} else {
  var Control = this.FControls[this.FControls.length-1].Form;
  this.FCanvas.save();
  this.FCanvas.translate(Control.FParent.ClientOriginLeft, Control.FParent.ClientOriginTop);
  Control.Show(this.FCanvas);
  this.FCanvas.restore();
}
//////////////

  /*time*/this.Params.time = Math.round(performance.now()-this.Params.time);
  /*time*/if (this.Params.time>this.Params.maxTime) this.Params.maxTime=this.Params.time;
  /*time*/this.FCanvas.font="18px Arial";
  /*time*/this.FCanvas.textBaseline="alphabetic";
  /*time*/this.FCanvas.fillStyle="#";
  /*time*///StatusTitle= window.innerWidth.toString(10)+' '+ window.innerHeight.toString(10)+' ';
  /*time*///StatusTitle = this.DOMCanvas.clientLeft+' '+this.DOMCanvas.clientTop+' '+this.DOMCanvas.width+' '+this.DOMCanvas.height;
  this.Params.ShowCounter++;
  /*time*/
//StatusTitle = ShowLastActiveForm;
/*
  var s = this.Params.ShowCounter+'mt:'+this.Params.maxTime+',t:'+this.Params.time+',FF:'+this.Params.FFCounter+',SF:'+this.Params.SFCounter+',pixr:'+window.devicePixelRatio+',thW:'+this.Width+',thH:'+this.Height;
  this.FCanvas.fillStyle="#bbbbbb";
  this.FCanvas.fillRect(20, this.Height-15-24, this.FCanvas.measureText(s).width+20, 24);
  this.FCanvas.fillStyle="#000000";
  this.FCanvas.fillText(StatusTitle+' '+s, 25, this.Height-15-6);*/
//console.log(StatusTitle+' '+ShowCounter.toString(10)+'mt:'+maxTime.toString(10)+',t:'+time.toString(10)+',FF:'+FFCounter.toString(10)+',SF:'+SFCounter.toString(10));

      this.FCanvas.restore();

      this.MainTextCursor.SaveEnabled = false;
      this.MainTextCursor.Show();
    }
    this.ShowRequire = false;
    this.Showing = false;
  }
  Run() {
    window.addEventListener('resize', function(e) {Application.ExecuteEvent(Application, 'Resize', e);}, false);
    window.addEventListener('orientationchange', function(e) {Application.ExecuteEvent(Application, 'Resize', e);}, false);
    window.addEventListener('deviceorientation', function(e) {e.preventDefault(); Application.ExecuteEventSub(Application.ActiveForm, 'DeviceOrientation', e);}, false);
    window.addEventListener('devicemotion', function(e) {e.preventDefault(); Application.ExecuteEventSub(Application.ActiveForm, 'DeviceMotion', e);}, false);
    window.addEventListener('keydown', function(e) {if (Application.ActiveForm==null) return; var C = Application.ActiveForm.ActiveControl || Application.ActiveForm; if (C!=null) Application.ExecuteEventSub(C, 'KeyDown', e);}, false);
    window.addEventListener('keyup', function(e) {if (Application.ActiveForm==null) return; var C = Application.ActiveForm.ActiveControl || Application.ActiveForm; if (C!=null) Application.ExecuteEventSub(C, 'KeyUp', e);}, false);
    window.addEventListener('keypress', function(e) {if (Application.ActiveForm==null) return; var C = Application.ActiveForm.ActiveControl || Application.ActiveForm; if (C!=null) Application.ExecuteEventSub(C, 'KeyPress', e);}, false);

    window.addEventListener("dblclick", function(e){Application.ExecuteEvent(null, 'DoubleClick', e);}, false);
    window.addEventListener("mousedown", function(e){Application.ExecuteEvent(null, 'MouseDown', e);}, false);
    window.addEventListener("mouseup", function(e){Application.ExecuteEvent(null, 'MouseUp', e);}, false);
    window.addEventListener("mousemove", function(e){Application.ExecuteEvent(null, 'MouseMove', e);}, false);
    window.addEventListener("mouseout", function(e){Application.ExecuteEvent(null, 'MouseOut', e);}, false);
    window.addEventListener("wheel", function(e){Application.ExecuteEvent(null, 'MouseWheel', e);}, false);
    window.addEventListener("touchstart", function(e){Application.ExecuteEvent(null, 'TouchStart', e);}, false);
    window.addEventListener("touchend", function(e){Application.ExecuteEvent(null, 'TouchEnd', e);}, false);
    window.addEventListener("touchmove", function(e){Application.ExecuteEvent(null, 'TouchMove', e);}, false);

    this.DOMCanvas.addEventListener("click", function(e){e.preventDefault();}, false);
    this.DOMCanvas.addEventListener("contextmenu", function(e){e.preventDefault();}, false);

    window.addEventListener('copy', function(e) {
      if (Application.FActiveForm!=null) 
        if (Application.FActiveForm.ActiveControl!=null)
          if ('DoCopy' in Application.FActiveForm.ActiveControl)
            Application.FActiveForm.ActiveControl.DoCopy();
      e.clipboardData.setData('text/plain', Application.BufferData.join('\r\n'));
      e.preventDefault();
    });
    window.addEventListener('paste', function (e) {
      Application.BufferType = 'Text';
      Application.BufferData = e.clipboardData.getData('Text').split('\r\n');
      if (Application.FActiveForm!=null) 
        if (Application.FActiveForm.ActiveControl!=null)
          if ('DoPaste' in Application.FActiveForm.ActiveControl)
            Application.FActiveForm.ActiveControl.DoPaste();
    });
/*
    window.addEventListener("dragenter", function(e){
      e.preventDefault();
      e.stopPropagation();
      console.log(e);
      Application.ActiveForm.Color = '#ff0000';
      Application.ActiveForm.ShowRequire = true;
    }, false);
*/
    window.addEventListener("dragover", function(e){
      e.preventDefault();
      Application.ExecuteEvent(null, 'OSDragDrop', e);
//      console.log(e);
  //    console.log(e.movementX, e.movementY); 
    }, false);
/*
    window.addEventListener("dragleave", function(e){
      e.preventDefault();
      e.stopPropagation();
      console.log(e);
    }, false);
*/
    window.addEventListener("drop", function(e){
      e.preventDefault();
      Application.ExecuteEvent(null, 'OSDragDropEnd', e);
//      console.log(e);
    }, false);

//    var Events = ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown', 'mouseout', 'wheel', 'touchstart', 'touchend', 'touchmove'];
//    Events.forEach(function(ev) {window.addEventListener(ev, function(e){Application.EventHandler(e);}, false);});

    // off browser scroll in touch device
    this.DOMCanvas.addEventListener("touchstart", function(e){e.preventDefault();}, false);

//    if (this.FControls.length>1) {
      this.MainForm = this.FControls[0].Form;
//    }

//    this.Timer = new TTimer(this);
//    this.Timer.Properties = {Name: 'Timer', Enabled: true, Interval: 20, OnTimer: this.TimerTimer};
    this.FrameAnimation();
  }
  CreateForm(Form, Variable) {
    window[Variable] = new Form(this);
    if ('LoadDFM' in window[Variable]) window[Variable].LoadDFM();
  }
  RemoveForm(Form) {
    this.RemoveComponent(Form.Parent);
    this.ActiveForm = null;
    if (this.FControls.length>0) this.FControls[0].ShowRequire = true;
  }
///////////////////////
SAF() {
  if (typeof this.HCE==='undefined') return;
  if (this.ActiveForm!=null) {
    var Canvas = this.HCE.getContext('2d');
/*
//    this.FCanvas.drawImage(this.BufferCanvasElement, 0, 0);
    var CE = this.ActiveForm.HCanvasElement;//this.BufferCanvasElement;//
    var W = CE.width/4;
    var H = CE.height/4;
    this.HCE.width = W/Viewport;
    this.HCE.height = H/Viewport;
    this.HCE.style.width = W.toString()+'px';
    this.HCE.style.height = H.toString()+'px';;
    this.HCE.parentElement.style.width = (W*Viewport).toString()+'px';
    this.HCE.parentElement.style.height = (H*Viewport).toString()+'px';
    Canvas.clearRect(0, 0, W, H);
    Canvas.drawImage(CE, 0, 0, CE.width/Viewport, CE.height/Viewport, 0, 0, W/Viewport, H/Viewport);
*/
    var Form = this.ActiveForm;
    var W = Form.FWidth/4;
    var H = Form.FHeight/4;
    this.HCE.width = W/Viewport;
    this.HCE.height = H/Viewport;
    this.HCE.style.width = W.toString()+'px';
    this.HCE.style.height = H.toString()+'px';;
    this.HCE.parentElement.style.width = W.toString()+'px';
    this.HCE.parentElement.style.height = H.toString()+'px';
    Canvas.clearRect(0, 0, W, H);
    Canvas.drawImage(Form.HCanvasElement, 0, 0, Form.FWidth/Viewport, Form.FHeight/Viewport, 0, 0, W/Viewport, H/Viewport);

  }
}
//////////////////////
  TimerTimer(Sender) {
    this.TimerTime+=20;
    if ((this.LongClick.Click)&&(this.TimerTime-this.LongClick.StartTime>2000)) {
      this.LongClick.Click = false;
      this.ExecuteEventSub(this.LongClick.Control, 'LongClick', null, [this.LongClick.X, this.LongClick.Y]);
    }
//    if ((this.DOMCanvas.width!=this.Width/Viewport)||(this.DOMCanvas.height!=this.Height/Viewport)) this.Resize(this, null);
//    if (!this.Showing) if (Sender.Owner.ShowRequire) {
      //Sender.Owner.Show();
//      requestAnimationFrame(function(){Application.Show();});
//    }
    this.SAF();
  }

  FrameAnimation() {
    if ((this.DOMCanvas.width!=this.Width/Viewport)||(this.DOMCanvas.height!=this.Height/Viewport)) this.Resize(this, null);
    if (this.ShowRequire) this.Show();
    requestAnimationFrame(this.FrameAnimation.bind(this));
  }
  
  ExecuteEventSub(GUIItem, funcname, e, prop) {
    if (GUIItem==null) return;
    var Form = null;
    if (GUIItem instanceof TFormContainer) Form = GUIItem.Form;
    if (GUIItem.Owner instanceof TFormContainer) Form = GUIItem.Owner.Form;
    if (GUIItem instanceof TForm) Form = GUIItem;
    if (GUIItem.Owner instanceof TForm) Form = GUIItem.Owner;

    if ((funcname=='MouseDown')||(funcname=='TouchStart'))
//      if (typeof GUIItem['TextCursor']==='undefined') this.ActiveControl = null; else this.ActiveControl = GUIItem;
      if ('TextCursor' in GUIItem) if (Form!=null) Form.ActiveControl = GUIItem;// else this.ActiveControl = this.ActiveForm.ActiveControl;
    if (typeof prop==='undefined') var prop = [];
    prop.splice(0, 0, e);
    GUIItem.Event(funcname, prop);
  }
  ExecuteEvent(GUIItem, funcname, e) {
    function TouchFindID(TouchList, ID) {for (var i=0; i<TouchList.length; i++) if (TouchList[i].identifier==ID) return(TouchList[i]); return(false);}
///////////////////////////
    if (this.Blocking) return;

    if ((e.target!=this.DOMCanvas)&&(!this.DragDropMode)) return;
//2022//////////
    if ((e.type!='wheel') && (!(e instanceof TouchEvent))) e.preventDefault();
    var pageXShift = this.DOMCanvas.getBoundingClientRect().left + document.body.scrollLeft + document.documentElement.scrollLeft;
    var pageYShift = this.DOMCanvas.getBoundingClientRect().top + document.body.scrollTop + document.documentElement.scrollTop;
    var X = e.pageX - pageXShift;
    var Y = e.pageY - pageYShift;
    GUIItem = this.PointIn([X, Y]);
///////////////////////////
    if (GUIItem==null) GUIItem = this;
    if (!this.DragDropMode) if (this.Cursor!=GUIItem.Cursor) this.Cursor = GUIItem.Cursor;

    // bubble form
    var FormContainer = GUIItem;
    for (; (FormContainer.ClassName!='TFormContainer');) {
      FormContainer = FormContainer.Parent;
      if (FormContainer==null) break;
    }
    // bubble form

    if ((SaveGUIItem!=null)&&(SaveGUIItem!=GUIItem)&&(!this.DragDropMode)) this.ExecuteEventSub(SaveGUIItem, 'MouseOut', e);
    SaveGUIItem = GUIItem;
    var XL = X-GUIItem.ClientOriginLeft;
    var YL = Y-GUIItem.ClientOriginTop;
    this.ExecuteEventSub(GUIItem, funcname, e, [XL, YL]);

    if (funcname=='TouchStart') {
      if (e.targetTouches.length==1) this.LongClick = {Click: true, StartTime: this.TimerTime, X: X, Y: Y, Control: GUIItem};
      if ((e.targetTouches.length==1)||((e.targetTouches.length==2)&&(e.changedTouches.length==2))) {
        if (FormContainer!=null) this.ActiveForm = FormContainer.Form;

        this.Touch1 = e.changedTouches[0].identifier;
        this.DragDropX = X;
        this.DragDropY = Y;

        // find dragdrop self or parent control
        this.DragDropControl = GUIItem;
        for (; ((typeof this.DragDropControl['DragDrop']==='undefined')&&(typeof this.DragDropControl['OnDragDrop']==='undefined'));) {
          this.DragDropControl = this.DragDropControl.Parent;
          if (this.DragDropControl==null) break;
        }
        this.DragDropSource = GUIItem;
        this.DragDropMode = false;
      }
      if (e.targetTouches.length==2) {
        if (GUIItem instanceof TEdit) this.ActiveControl = null;
        if (e.changedTouches.length==1) this.Touch2 = e.changedTouches[0].identifier;
          else this.Touch2 = e.changedTouches[1].identifier;
        this.DragDropX = TouchFindID(e.targetTouches, this.Touch1).pageX - pageXShift;
        this.DragDropY = TouchFindID(e.targetTouches, this.Touch1).pageY - pageYShift;
        this.PinchX = TouchFindID(e.targetTouches, this.Touch2).pageX - pageXShift;
        this.PinchY = TouchFindID(e.targetTouches, this.Touch2).pageY - pageYShift;
      }
    }
    if (funcname=='TouchMove') {
      if (this.LongClick.Click) if (Math.sqrt(Math.pow(this.LongClick.X-X, 2)+Math.pow(this.LongClick.Y-Y, 2))>3) this.LongClick.Click = false;
      if (e.targetTouches.length==0) this.DragDropMode = false;
      if (e.targetTouches.length==1) {
        var MoveNX = X;
        var MoveNY = Y;
        if (!this.DragDropMode) this.ExecuteEventSub(this.DragDropControl, 'DragDropStart', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
        this.DragDropMode = true;
        this.ExecuteEventSub(this.DragDropControl, 'DragDrop', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
        if (this.DragDropSource!=null) if (GUIItem!=this.DragDropSource) {
          this.ExecuteEventSub(this.DragDropSource, 'TouchOut', e);
          this.DragDropSource = null;
        }
        this.DragDropX = MoveNX;
        this.DragDropY = MoveNY;
      }
      if (e.targetTouches.length==2) {
        var Touch1Obj = TouchFindID(e.targetTouches, this.Touch1);
        var Touch2Obj = TouchFindID(e.targetTouches, this.Touch2);
        if ((Touch1Obj===false) || (Touch2Obj===false)) return;

        var MoveNX = Touch1Obj.pageX - pageXShift;
        var MoveNY = Touch1Obj.pageY - pageYShift;
        var MoveNX2 = Touch2Obj.pageX - pageXShift;
        var MoveNY2 = Touch2Obj.pageY - pageYShift;

        this.ExecuteEventSub(this.DragDropControl, 'Pinch', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY], [this.PinchX, this.PinchY], [MoveNX2, MoveNY2]]);

        this.DragDropX = MoveNX;
        this.DragDropY = MoveNY;
        this.PinchX = MoveNX2;
        this.PinchY = MoveNY2;
      }
    }
    if (funcname=='TouchEnd') {
      this.LongClick.Click = false;
      if (e.targetTouches.length==0) {
        var MoveNX = X;
        var MoveNY = Y;
        if (this.DragDropMode) this.ExecuteEventSub(this.DragDropControl, 'DragDropEnd', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
        // double touch
        if (clickTimer == null) {
          if (this.DragDropSource!=null) if (GUIItem==this.DragDropSource) this.ExecuteEventSub(GUIItem, 'Click', e, [XL, YL]);
          clickSource = GUIItem;
          clickTimer = setTimeout(function () {clickTimer = null;}, 500)
        }
        else {
          clearTimeout(clickTimer);
          clickTimer = null;
          if (GUIItem==clickSource) this.ExecuteEventSub(GUIItem, 'DoubleClick', e, [XL, YL]);
          if (this.DragDropSource!=null) if (GUIItem==this.DragDropSource) this.ExecuteEventSub(GUIItem, 'Click', e, [XL, YL]);
        }
        // double touch
        this.DragDropMode = false;
      }
      if (e.targetTouches.length==1)
        if (!TouchFindID(e.targetTouches, this.Touch1)) {
          this.Touch1 = this.Touch2;
          this.DragDropX = this.PinchX;
          this.DragDropY = this.PinchY;
        }
    }
    if (funcname=='MouseDown') {
      if (FormContainer!=null) this.ActiveForm = FormContainer.Form;
      this.LongClick = {Click: true, StartTime: this.TimerTime, X: X, Y: Y, Control: GUIItem};
      this.DragDropX = X;
      this.DragDropY = Y;

      // find dragdrop self or parent control
      this.DragDropControl = GUIItem;
      for (; ((typeof this.DragDropControl['DragDrop']==='undefined')&&(typeof this.DragDropControl['OnDragDrop']==='undefined'));) {
        this.DragDropControl = this.DragDropControl.Parent;
        if (this.DragDropControl==null) break;
      }
      this.DragDropSource = GUIItem;
      this.DragDropMode = false;
    }
    if (funcname=='MouseMove') {
      if (this.LongClick.Click) if (Math.sqrt(Math.pow(this.LongClick.X-X, 2)+Math.pow(this.LongClick.Y-Y, 2))>3) this.LongClick.Click = false;
      if (e.buttons==1) {
        var MoveNX = X;
        var MoveNY = Y;
        if (!this.DragDropMode) this.ExecuteEventSub(this.DragDropControl, 'DragDropStart', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
        this.DragDropMode = true;
        this.ExecuteEventSub(this.DragDropControl, 'DragDrop', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
        if (this.DragDropSource!=null) if (GUIItem!=this.DragDropSource) {
          this.ExecuteEventSub(this.DragDropSource, 'MouseOut', e);
          this.DragDropSource = null;
        }
        this.DragDropX = MoveNX;
        this.DragDropY = MoveNY;
      } else this.DragDropMode = false;
    }
    if (funcname=='MouseUp') {
      this.LongClick.Click = false;
      var MoveNX = X;
      var MoveNY = Y;
      if (this.DragDropMode) this.ExecuteEventSub(this.DragDropControl, 'DragDropEnd', e, [[this.DragDropX, this.DragDropY], [MoveNX, MoveNY]]);
      if (this.DragDropSource!=null) if (GUIItem==this.DragDropSource) this.ExecuteEventSub(GUIItem, 'Click', e, [XL, YL]);
      this.DragDropMode = false;
    }
    if (funcname=='MouseWheel') {
      this.LongClick.Click = false;
      var Item = GUIItem;
      for (; ((typeof Item[funcname]==='undefined')&&(typeof Item['On'+funcname]==='undefined'));) {Item = Item.Parent; if (Item==null) break;}
      if ((Item!=null)&&(Item!=GUIItem)) this.ExecuteEventSub(Item, funcname, e, [XL, YL]);
    }
  }

  get ClientOriginLeft() {return(0);}
  get ClientOriginTop() {return(0);}
  get Width() {return(Math.min(this.DOMCanvas.parentElement.clientWidth, window.innerWidth));}
  get Height() {return(Math.min(this.DOMCanvas.parentElement.clientHeight, window.innerHeight));}
  get Cursor() {return(document.body.style.cursor);}
  set Cursor(value) {document.body.style.cursor = value;}
  get ActiveForm() {return(this.FActiveForm);}
  set ActiveForm(value) {
    if (this.FActiveForm==value) return;
    if (value==null) {
      for (var i=this.FControls.length-1; i>=0; i--) if (this.FControls[i].Visible) {value=this.FControls[i].Form; break;}
      if (value!=null) this.ActiveForm = value; else this.FActiveForm = null;
    } else
//    if ((value.Parent!=this.FControls[this.FControls.length-2])&&(value.Parent!=this.FControls[0])) {
    if (value.Parent!=this.FControls[0]) {
      for (var i=0; i<this.FControls.length; i++) if (this.FControls[i]==value.Parent) break;
      this.FControls.splice(i, 1);
      this.FControls.splice(this.FControls.length, 0, value.Parent);
      //this.FControls.push(value.Parent);
      for (var i=0; i<this.FControls.length; i++) {
        if (this.FControls[i].Form.FormStyle==fsStayOnTop) {
          var SF = this.FControls[i];
          this.FControls.splice(i, 1);
          this.FControls.splice(this.FControls.length, 0, SF);
        }
      }
    }
    if (this.FActiveForm!=null) if (this.FActiveForm.ActiveControl!=null) {
      this.FActiveForm.ActiveControl.Event('Exit');
      this.FActiveForm.ActiveControl.TextCursor = null;
    }
    this.FActiveForm = value;
    if (this.FActiveForm!=null) if (this.FActiveForm.ActiveControl!=null) {
      this.FActiveForm.ActiveControl.TextCursor = this.MainTextCursor;
      this.FActiveForm.ActiveControl.Event('Enter');
    }
    if (this.FActiveForm!=null) {
      this.FActiveForm.Visible = true;
      this.ActiveForm.FParent.ShowRequire = true;
    }
    this.ShowRequire = true;
  }
  get MainForm() {return(this.FControls[0]);}
  set MainForm(value) {
    value.Parent.FHeaderHeight = 0;
    value.Parent.FBorderSize = 0;
    value.Maximize = true;
    value.FVisible = true;
    this.ActiveForm=value;
  }
  get Blocking() {return(this.FBlocking);}
  set Blocking(value) {
    if (this.FBlocking==value) return;
    this.FBlocking = value;
    if (this.FBlocking) this.Cursor = 'wait'; else this.Cursor = '';
    this.ShowRequire = true;
  }
  PointIn(APoint) {
    APoint[0] = APoint[0]/this.ScaleX;
    APoint[1] = APoint[1]/this.ScaleY;
    return(super.PointIn(APoint));
  }
  Resize(Sender, e) {
    for (var FC of this.FControls)
      if (FC.Form.Maximize) {
        FC.Form.Width = this.Width;
        FC.Form.Height = this.Height;
        FC.ShowRequire = true;
      }
  }
}
