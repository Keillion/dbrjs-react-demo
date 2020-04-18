import React from 'react';
import "./Layout.css";
import {Icon} from 'antd';
import SettingPage from './SettingPage';
import FilePage from './FilePage';
import Scanner from "./Scanner";

function RegionBtn(props){
    return(
        <label className="region" onClick={props.handleRegion}>
            <Icon type={props.isFullRegion?"fullscreen-exit":"fullscreen"} style={{fontSize:"2rem",color:"#FE8E14"}}></Icon>
        </label>
    )
}


function ScannerArea(props){
    return(
        <div className="scanner-container">
            {/* <div className="frame" style={{width:props.region+"%",height:props.region+"%",maxWidth:"250px",maxHeight:"250px"}}>
                 <label className="flashlight">
                    <Icon type="funnel-plot" style={{fontSize:"2rem",color:"#FE8E14"}}></Icon>
                </label> 
            </div> */}
            <div className="tip-info">
                <p>Line up your barcode within the box.</p>
            </div>
        </div>
    )
}


class Main extends React.Component{
    constructor(props){
        super(props);
        this.state=({
            isShowSettingBtn:false,
            isShowSettingPage:false,
            isShowFilePage:false,
            isFullScreen:false,
            isFullRegion:false,
            settingDisplayStyle:{display:"none"},
            fileDisplayStyle:{display:"none"}
        })
    }

    componentWillMount(){
        window.Dynamsoft.BarcodeReader.loadWasm().then(()=>{
            this.setState({
                isShowSettingBtn:true,
            })
        });
    }

    handleRegion(){
        this.setState({
            isFullRegion:!this.state.isFullRegion,
        })
    }

    handleShowSettingPage(){
        this.setState({
            isShowSettingPage:!this.state.isShowSettingPage,
            settingDisplayStyle:this.state.settingDisplayStyle.display==="none"?{display:"block"}:{display:"none"}
        });
    }

    handleShowFilePage(){
        this.setState({
            isShowFilePage:!this.state.isShowFilePage,
            fileDisplayStyle:this.state.fileDisplayStyle.display==="none"?{display:"block"}:{display:"none"}
        });
    }

    switchFullScreen(){
        if(!this.state.isFullScreen){
            if(document.documentElement.requestFullscreen){
                document.documentElement.requestFullscreen();
            }
            else if(document.documentElement.webkitRequestFullScreen){
                document.documentElement.webkitRequestFullScreen();
            }
            else if(document.documentElement.mozRequestFullScreen){
                document.documentElement.mozRequestFullScreen();
            }
            else{
                document.documentElement.msRequestFullscreen();
            }
            //document.documentElement.requestFullscreen(); 
        }
            
        else
            document.exitFullscreen();
        this.setState({
            isFullScreen:!this.state.isFullScreen,
        })       
    }

    fullScreenClickHandler(event){
        this.switchFullScreen();
    }   

    render(){
        var regionSize = 60;
        var home = (
            <div className="home-screen">
                <Scanner region={regionSize} isFullRegion={this.state.isFullRegion}></Scanner>
                {
                    !this.state.isFullRegion&&
                    <ScannerArea region={regionSize}></ScannerArea>
                }
                <div className="dynam-info">
                    <img src="img/logo-dynamsoft-blackBg-190x47.png" alt="logo"></img><br/>
                    Interested? <a href="https://www.dynamsoft.com/Company/Contact.aspx" style={{ color: "white"}}><u>Let's talk!</u></a>
                </div>
                <RegionBtn handleRegion={this.handleRegion.bind(this)} isFullRegion={this.state.isFullRegion}></RegionBtn>
            </div>
        );

        var extra = (
            <>
            {
                this.state.isShowSettingBtn && 
                <div className="settingBtn-container" >
                    <Icon type="setting" style={{fontSize:"2rem",color:"#FE8E14"}} onClick={this.handleShowSettingPage.bind(this)} ></Icon>
                </div>
            }
            <div className="double-click" >
                <label onClick={this.fullScreenClickHandler.bind(this)}>click {this.state.isFullScreen&&"exit"} full screen</label>
            </div>
            <div className="selImgBtn-container">
                <Icon type="plus" style={{fontSize:"2rem",color:"#FE8E14"}} onClick={this.handleShowFilePage.bind(this)}></Icon>
            </div>
            
            <div style={this.state.settingDisplayStyle}>
                <SettingPage onBackClick={this.handleShowSettingPage.bind(this)} ></SettingPage>
            </div>
            {
                this.state.isShowFilePage&&
                <FilePage style={this.state.fileDisplayStyle} onBackClick={this.handleShowFilePage.bind(this)}></FilePage>
            }
            </>
        );
        
        return(
            <>
            {!this.state.isShowSettingPage&&home}
            {/* extra:setting page,setting btn,file page,file btn */}
            {extra}     
            </>
        )
    }
    
}


class Layout extends React.Component{
    render(){
        return (
            <div className="wrap-container">
                <Main></Main>
            </div>   
        )
    }
}

export default Layout;
