function LoadFromDXF(str) {
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
            }
        }
    }
}