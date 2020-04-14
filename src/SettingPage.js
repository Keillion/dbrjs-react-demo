import React from 'react';
import { PageHeader,Menu, Icon, Button,Radio, Card,Divider,Checkbox,Row,Col,message } from 'antd';
import './SettingPage.css';
import './Layout.css';


const { SubMenu } = Menu;

function CutOff(){
    return(
        <Divider style={{margin:"10px 0"}}/>
    )
}

const AttributeStyle = {
    padding:"5px"
};

const checkGroupStyle = { 
    paddingLeft:"20px", 
    color: "antiquewhite"
}

let settingsFromPage = {
    resolution:[1280,720],
    barcodeFormat:undefined,
    localization:[2,0,0,0,0,0,0,0],
    deblurlevel: 0, 
    scaleDownThreshold: 2300,
    timeout: 10000,
};


class VideoResolution extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:0,
        }
    }

    onSelectChange = e =>{
        settingsFromPage.resolution = e.target.res;
    };


    render(){
        return(
        <Menu
        mode="inline"
        >
            <SubMenu
                key="resolution"
                title={
                <span>
                    <Icon type="eye"/>
                    <span>Video Resolution</span>
                </span>
                }
            >
                <Radio.Group style={{paddingLeft:'20px'}} onChange={this.onSelectChange.bind(this)} defaultValue="1280,720">
                    <Radio style={AttributeStyle} value={"3840,2160"} res={[3840,2160]}>3840*2160</Radio>
                    <Radio style={AttributeStyle} value={"2560,1440"} res={[2560,1440]}>2560*1440</Radio>
                    <Radio style={AttributeStyle} value={"1920,1080"} res={[1920,1080]}>1920*1080</Radio>
                    <Radio style={AttributeStyle} value={"1600,1200"} res={[1600,1200]}>1600*1200</Radio>
                    <Radio style={AttributeStyle} value={"1280,720"} res={[1280,720]}>1280*720</Radio>
                    <Radio style={AttributeStyle} value={"800,600"} res={[800,600]}>800*600</Radio>
                    <Radio style={AttributeStyle} value={"640,480"} res={[640,480]}>640*480</Radio>
                    <Radio style={AttributeStyle} value={"640,360"} res={[640,360]}>640*360</Radio>
                </Radio.Group>
            </SubMenu>      
        </Menu>   
        )
    }   
}


// const options=['1D','PDF417','QR Code','Data Matrix','Aztec Code'];
var Dynamsoft = window.Dynamsoft;
var _1D = Dynamsoft.EnumBarcodeFormat.BF_ONED;
var _PDF417 = Dynamsoft.EnumBarcodeFormat.BF_PDF417;
var _QRCode = Dynamsoft.EnumBarcodeFormat.BF_QR_CODE;
var _DataMatrix = Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX;
var _AztecCode = Dynamsoft.EnumBarcodeFormat.BF_AZTEC;
var _MaxiCode = Dynamsoft.EnumBarcodeFormat.BF_MAXICODE;
var _GS1DataBar = Dynamsoft.EnumBarcodeFormat.BF_GS1_DATABAR;
var _GS1Composite = Dynamsoft.EnumBarcodeFormat.BF_GS1_COMPOSITE;
var _PatchCode = Dynamsoft.EnumBarcodeFormat.BF_PATCHCODE;

const defaultCheckList = ["1D", "PDF417", "QRCode", "DataMatrix", "AztecCode",  "MaxiCode", "GS1DataBar","GS1Composite", "PatchCode"];
if(!Dynamsoft.BarcodeReader._bUseFullFeature){
    defaultCheckList.length = 4;
}
const formats = {"1D":_1D, "PDF417":_PDF417, "QRCode":_QRCode, "DataMatrix":_DataMatrix, "AztecCode":_AztecCode, "MaxiCode":_MaxiCode, "GS1DataBar":_GS1DataBar, "GS1Composite":_GS1Composite, "PatchCode":_PatchCode};
var _all = 0;
defaultCheckList.forEach(item=>{_all+=formats[item]});
settingsFromPage.barcodeFormat = _all;


class BarcodeFormat extends React.Component{
    constructor(props){
        super(props);
        this.state={
            checkedList:defaultCheckList,
        }
    }

    onChange = checkedList=>{
        this.setState({
            checkedList,
        })
    }

    onSelectFormat = e=>{
        // console.log(e.target.format,e.target.value,this.state.checkedList.indexOf(e.target.value)!==-1);
        // this.state.checkedList.indexOf(e.target.value)!==-1?(settingsFromPage.barcodeFormat -= e.target.format):(settingsFromPage.barcodeFormat += e.target.format);
        this.state.checkedList.indexOf(e.target.value)!==-1?(settingsFromPage.barcodeFormat= settingsFromPage.barcodeFormat&(~e.target.format)):(settingsFromPage.barcodeFormat = settingsFromPage.barcodeFormat | e.target.format);
    }

    onClickMoreFormat = ()=>{

        let locQuestion = window.location.href.lastIndexOf('?');
        let locHash = window.location.href.lastIndexOf('#');
        if(-1 === locQuestion){
            if(-1 === locHash){
                // no ?, no #
                window.location.href += "?full=true";
            }else{
                // have #
                window.location.href = window.location.href.substring(0, locQuestion) + "?full=true" + window.location.href.substring(locQuestion);
            }
        }else{
            // have ?
            window.location.href = window.location.href.substring(0, locQuestion + 1) + "full=true&" + window.location.href.substring(locQuestion + 1);
        }
    }

    render(){
        return(
            <Menu mode="inline">
                <SubMenu 
                    key="format"
                    title={
                        <span>
                            <Icon type="barcode"/>
                            <span>Barcode Format</span>
                        </span>    
                    }
                >
                    <div>
                        <Checkbox.Group
                            value={this.state.checkedList}
                            onChange={this.onChange.bind(this)}
                            style={checkGroupStyle}
                        >
                            <Row>
                            {
                                defaultCheckList.map((item, index)=>{
                                    var key = item;
                                    return (<Col span={12} style={AttributeStyle} key={key+index}>
                                                <Checkbox value={key} format={formats[key]} onChange={this.onSelectFormat.bind(this)}>{key}</Checkbox>
                                            </Col>)
                                    }
                                )
                            }
                                <Col span={12} push={12} style={{padding:"15px 0"}}>
                                {
                                    !Dynamsoft.BarcodeReader._bUseFullFeature && 
                                    <Button icon="plus" type="primary" size="small" onClick={this.onClickMoreFormat.bind(this)}>More Formats</Button>
                                }
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </div>
                </SubMenu>    
                
            </Menu>
            
        )
    }
}


class ScanSettings extends React.Component{
    onSelectChange = e =>{
        if (e.target.value === "accurate") {
            settingsFromPage.localization = [2, 16, 4, 8, 0, 0, 0, 0]
            settingsFromPage.deblurlevel = 5;
            settingsFromPage.expectedBarcodesCount = 512;
            settingsFromPage.scaleDownThreshold = 100000;
            settingsFromPage.timeout = 100000;
        } else if (e.target.value === "balance") {
            settingsFromPage.localization = [2, 16, 0, 0, 0, 0, 0, 0];
            settingsFromPage.deblurlevel = 3;
            settingsFromPage.expectedBarcodesCount = 512;
            settingsFromPage.scaleDownThreshold = 2300;
            settingsFromPage.timeout = 100000;
        } else { //speed
            settingsFromPage.localization = [2, 0, 0, 0, 0, 0, 0, 0];
            settingsFromPage.deblurlevel = 0;
            settingsFromPage.expectedBarcodesCount = 0;
            settingsFromPage.scaleDownThreshold = 2300;
            settingsFromPage.timeout = 10000;
        }
    };

    render(){
        return(
            <Menu mode="inline">
               <SubMenu
                    key="scan"
                    title={
                    <span>
                        <Icon type="setting"></Icon>
                        <span>Scan Settings</span>
                    </span>
                    }
                >
                    <Radio.Group style={{paddingLeft:'20px'}} onChange={this.onSelectChange.bind(this)} defaultValue='fast'>
                        <Radio style={AttributeStyle} value="fast">Fastest</Radio>
                        <Radio style={AttributeStyle} value="balance">Balance</Radio>
                        <Radio style={AttributeStyle} value="accurate">Most Accurate</Radio>
                    </Radio.Group>
                </SubMenu> 
            </Menu>
            
        )
    }
}

// class ReadFullRegion extends React.Component{
//     constructor(props){
//         super(props);
//         this.state={
//             value:0
//         }
//     }

//     render(){
//         return(
//             <Menu mode="inline">
//                 <SubMenu 
//                     key="region" 
//                     title={
//                     <span>
//                         <Icon type="eye"></Icon>
//                         <span>Read Full Region</span>
//                     </span>
//                     }
//                 >
//                     <div>
//                         <Switch onChange={this.onChangeRegionMode} 
//                             style={{float:"right",right:"10px"}}/> 
//                     </div>
//                 </SubMenu>   
//             </Menu>
            
//         )
//     }
// }


class About extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:0
        }
    }

    render(){
        return(
            <Menu mode="inline">
                <SubMenu
                    key="about"
                    title={
                    <span>
                        <Icon type="bulb"></Icon>
                        <span>About Dynamsoft</span>
                    </span>
                    }
                >
                    <div>
                        <Card title="About">
                            <p>
                            Founded in Sep 2003 with the aim of being the dynamic center of software developers, 
                            Dynamsoft provides enterprise-class document capture and image processing software development kits (SDK),
                            with numerous generations for each product. Today many Fortune 500 Companies including HP, IBM, Intel, and Siemens trust Dynamsoft solutions.
                            </p>
                        </Card>
                    </div>
                </SubMenu>
            </Menu>
        )
    }
}


class ClearCache extends React.Component{
    handleClear(){
        var config={};
        message.config({
            top:window.innerHeight/2,
            duration:2,
        });
        try{
            console.log(window.indexedDB);
            var request = window.indexedDB.deleteDatabase('dynamsoft');
            request.onsuccess = request.onerror = ()=>{
                if(request.error){
                    // alert('Clear failed: '+(request.error.message || request.error));
                    config.content='Clear failed: '+(request.error.message || request.error);
                    config.icon=<Icon type="close" style={{color:"red"}}></Icon>;
                    message.open(config);
                }else{
                    // alert('Clear success!');
                    config.content="Clear success!";
                    config.icon=<Icon type="check-circle" style={{color:"#FE8E14"}}></Icon>;
                    message.open(config);
                }
            };
        }catch(ex){
            //alert(ex.message || ex);
            config.content=ex.message || ex;
            config.icon=<Icon type="close" style={{color:"red"}}></Icon>;
            message.open(config);
        }
    }

    render(){
        return(
            <div className="clear-cache">
                <Button type="primary"
                 size="large" 
                 onClick={this.handleClear.bind(this)}
                 style={{backgroundColor:"rgb(254, 142, 20)",border:"1px solid rgb(254, 142, 20)"}}
                >
                    Clear Cache
                </Button>
            </div>
        )
    }
}

class SettingPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showMenu:true,
            selectedTags: [],
        }
    }

    
    render(){
        return(
            <>
                {/* hide the setting button if the  setting page is shown */}
                {/* <div>
                    {
                        !this.state.showMenu && 
                        <div className="settingBtn-container">
                            <Icon onClick={this.onSettingClick.bind(this)}  type="setting" style={{fontSize:"50px",color:"wheat"}}></Icon>
                        </div>
                    }
                </div> */}
                
                {/* show the setting page */}
                
                {
                    //!this.state.showMenu ? null:
                    <div className="setting-container">
                        {/* <Link href="/"> */}
                            <div>
                            <PageHeader onBack={this.props.onBackClick/*()=>null*/} title="Settings"  />
                            </div>
                        {/* </Link> */}
                        <Menu
                            //defaultSelectedKeys={['video']}
                            //defaultOpenKeys={['Read Full Region']}
                            mode="inline"
                            theme="light"
                            
                        >
                            {/* Video Source */}
                            {/* <VideoSource></VideoSource>*/}
                            {/* <CutOff /> */}

                            {/* Video Resolution */}
                            <VideoResolution></VideoResolution>

                            <CutOff />

                            {/* //Barcode Format */}
                            <BarcodeFormat></BarcodeFormat>
                            
                            <CutOff />

                            {/* //Scan Settings */}
                            <ScanSettings></ScanSettings>

                            <CutOff />

                            {/* //Read Full Region */}
                            {/* <ReadFullRegion></ReadFullRegion> */}
                            {/* <CutOff /> */}

                            {/* About */}
                            <About></About>
                            
                            {/* Clear Cache */}
                            {/* <ClearCache></ClearCache> */}
                        </Menu>
                    </div>
                }
                
            </>
        );
    }
}


export default SettingPage;
export {settingsFromPage};