import React from 'react';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            isDraw:false
        });
        this.canvas = React.createRef();
    }

    componentDidMount(){
        let point = this.props.point;
        let x1 = point[0].split(',')[0];
        let y1 = point[0].split(',')[1];
        let x2 = point[1].split(',')[0];
        let y2 = point[1].split(',')[1];
        let x3 = point[2].split(',')[0];
        let y3 = point[2].split(',')[1];
        let x4 = point[3].split(',')[0];
        let y4 = point[3].split(',')[1];

        let leftMin = Math.min(x1, x2, x3, x4);
        //let rightMax = Math.max(x1, x2, x3, x4);
        let topMin = Math.min(y1, y2, y3, y4);
        //let bottomMax = Math.max(y1, y2, y3, y4);

        let _x1 = (x1 - leftMin) * 5;
        let _x2 = (x2 - leftMin) * 5;
        let _x3 = (x3 - leftMin) * 5;
        let _x4 = (x4 - leftMin) * 5;
        let _y1 = (y1 - topMin) * 5;
        let _y2 = (y2 - topMin) * 5;
        let _y3 = (y3 - topMin) * 5;
        let _y4 = (y4 - topMin) * 5;


        var canvas = this.canvas.current;
        //console.log(_x1,_y1,_x2,_y2,_x3,_y3,_x4,_y4);
        if(canvas.getContext){
            //debugger;
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = 'rgba(254,180,32,0.5)';
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.beginPath();
            ctx.moveTo(_x1, _y1);
            ctx.lineTo(_x2, _y2);
            ctx.lineTo(_x3, _y3);
            ctx.lineTo(_x4, _y4);
            ctx.fill();
        }

    }

    render(){
        let point = this.props.point;
        let x1 = point[0].split(',')[0];
        let y1 = point[0].split(',')[1];
        let x2 = point[1].split(',')[0];
        let y2 = point[1].split(',')[1];
        let x3 = point[2].split(',')[0];
        let y3 = point[2].split(',')[1];
        let x4 = point[3].split(',')[0];
        let y4 = point[3].split(',')[1];

        let leftMin = Math.min(x1, x2, x3, x4);
        let rightMax = Math.max(x1, x2, x3, x4);
        let topMin = Math.min(y1, y2, y3, y4);
        let bottomMax = Math.max(y1, y2, y3, y4);
        let _width = rightMax - leftMin;
        var _height = bottomMax - topMin;
        let cvsStyle={
            position:"absolute",
            // left:leftMin+"px",
            // top:topMin+"px",
            // //background:"#80008021",

            left: (leftMin + 0.5) + '%',
            top: (topMin + 0.5) + '%',
            height: _height + '%',
            width: _width + '%', 
        };
        return(
            <>
            {
                // <canvas
                // ref={this.canvas}
                // width={rightMax-leftMin} height={bottomMax-topMin} style={cvsStyle}>
                // </canvas>

                    <canvas
                        ref={this.canvas}
                        width={_width * 5} height={_height * 5} style={cvsStyle}>
                    </canvas>
            }
            </>
            
        )
    }
}

export default Canvas;